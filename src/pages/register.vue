<script setup lang="ts">
import { VForm } from 'vuetify/components'
import authV2RegisterIllustrationBorderedDark from '@images/pages/auth-v2-register-illustration-bordered-dark.png'
import authV2RegisterIllustrationBorderedLight from '@images/pages/auth-v2-register-illustration-bordered-light.png'
import authV2RegisterIllustrationDark from '@images/pages/auth-v2-register-illustration-dark.png'
import authV2RegisterIllustrationLight from '@images/pages/auth-v2-register-illustration-light.png'
import authV2MaskDark from '@images/pages/misc-mask-dark.png'
import authV2MaskLight from '@images/pages/misc-mask-light.png'

import axios from '@axios'
import { useGenerateImageVariant } from '@core/composable/useGenerateImageVariant'
import { VNodeRenderer } from '@layouts/components/VNodeRenderer'
import { themeConfig } from '@themeConfig'
import { alphaDashValidator, emailValidator, requiredValidator } from '@validators'
import AuthProvider from '@/views/pages/authentication/AuthProvider.vue'
import { useAppAbility } from '@/plugins/casl/useAppAbility'

const refVForm = ref<VForm>()
const username = ref('johnDoe')
const email = ref('john@example.com')
const password = ref('john@VUEXY#123')
const privacyPolicies = ref(true)

// Router
const route = useRoute()
const router = useRouter()

// Ability
const ability = useAppAbility()

// loader
const dataLoading = ref(false)

// Location for User
const userLocation = ref('')

// User Phone
const userPhone = ref('')

// Egypt's Governorate
const locations = ref([
  'Alexandria',
  'Aswan',
  'Asyut',
  'Beheira',
  'Beni Suef',
  'Cairo',
  'Dakahlia',
  'Damietta',
  'Faiyum',
  'Gharbia',
  'Giza',
  'Ismailia',
  'Kafr El Sheikh',
  'Luxor',
  'Matruh',
  'Minya',
  'Monufia',
  'New Valley',
  'North Sinai',
  'Port Said',
  'Qalyubia',
  'Qena',
  'Red Sea',
  'Sharqia',
  'Sohag',
  'South Sinai',
  'Suez Gover',
])

const roleItems = ref([{ label: 'User', value: 'user' }, { label: 'Pharmacy', value: 'pharmacy' }])
const role = ref('')

// Error Message Alert For Network Errors
const errorMessage = ref('')

// Form Errors
const errors = ref<Record<string, string | undefined>>({
  email: undefined,
  password: undefined,
  userLocation: undefined,
  phone: undefined,
})

function register() {
  const data: {
    username: string
    email: string
    password: string
    role: string
    policy: boolean
    userLocation?: string
    phone?: string
  } = {
    username: username.value,
    email: email.value,
    password: password.value,
    policy: privacyPolicies.value,
    role: role.value,
  }

  if (role.value === 'user') {
    data.userLocation = userLocation.value
    data.phone = userPhone.value
  }

  axios.post('http://localhost:5000/auth/register', data)
    .then(r => {
      console.log('R => ', r)

      const { accessToken, userData, userAbilities } = r.data

      // const userAbilities = [{
      //   action: 'manage',
      //   subject: 'all',
      // }]

      localStorage.setItem('userAbilities', JSON.stringify(userAbilities))
      ability.update(userAbilities)

      localStorage.setItem('userData', JSON.stringify(userData))
      localStorage.setItem('accessToken', JSON.stringify(accessToken))

      // Redirect to `to` query if exist or redirect to index route
      router.replace(route.query.to ? String(route.query.to) : '/')

      return null
    })
    .catch(error => {
      errorMessage.value = error.message

      const { errors: formErrors } = error.message

      dataLoading.value = false

      errors.value = formErrors
      console.error(error.message)
    })
}

const imageVariant = useGenerateImageVariant(
  authV2RegisterIllustrationLight,
  authV2RegisterIllustrationDark, authV2RegisterIllustrationBorderedLight,
  authV2RegisterIllustrationBorderedDark,
  true,
)

const authThemeMask = useGenerateImageVariant(authV2MaskLight, authV2MaskDark)

const isPasswordVisible = ref(false)

function onSubmit() {
  refVForm.value?.validate()
    .then(({ valid: isValid }) => {
      if (isValid) {
        dataLoading.value = true
        errorMessage.value = ''
        register()
      }
    })
}
</script>

<template>
  <VRow
    no-gutters
    class="auth-wrapper"
  >
    <VCol
      lg="8"
      class="d-none d-lg-flex"
    >
      <div class="position-relative auth-bg rounded-lg w-100 ma-8 me-0">
        <div class="d-flex align-center justify-center w-100 h-100">
          <VImg
            max-width="441"
            :src="imageVariant"
            class="auth-illustration mt-16 mb-2"
          />
        </div>

        <VImg
          class="auth-footer-mask"
          :src="authThemeMask"
        />
      </div>
    </VCol>

    <VCol
      cols="12"
      lg="4"
      class="d-flex align-center justify-center"
    >
      <VCard
        flat
        :max-width="500"
        class="mt-12 mt-sm-0 pa-4"
      >
        <VCardText>
          <VNodeRenderer
            :nodes="themeConfig.app.logo"
            class="mb-6"
          />
          <h5 class="text-h5 font-weight-semibold mb-1">
            Adventure starts here 🚀
          </h5>
        </VCardText>

        <VCardText>
          <VForm
            ref="refVForm"
            @submit.prevent="onSubmit"
          >
            <VRow>
              <!-- Username -->
              <VCol cols="12">
                <VTextField
                  v-model="username"
                  :rules="[requiredValidator, alphaDashValidator]"
                  label="Username"
                />
              </VCol>

              <!-- email -->
              <VCol cols="12">
                <VTextField
                  v-model="email"
                  :rules="[requiredValidator, emailValidator]"
                  label="Email"
                  type="email"
                />
              </VCol>

              <!-- password -->
              <VCol cols="12">
                <VTextField
                  v-model="password"
                  :rules="[requiredValidator]"
                  label="Password"
                  :type="isPasswordVisible ? 'text' : 'password'"
                  :append-inner-icon="isPasswordVisible ? 'tabler-eye-off' : 'tabler-eye'"
                  @click:append-inner="isPasswordVisible = !isPasswordVisible"
                />
              </VCol>
              <!-- Role: Pharmacy | User | Admin -->
              <VCol cols="12">
                <VSelect
                  v-model="role"
                  :items="roleItems"
                  :rules="[requiredValidator]"
                  item-title="label"
                  label="Role"
                />
              </VCol>

              <!-- Phone Number For User -->
              <VCol
                v-if="role === 'user'"
                cols="12"
              >
                <VTextField
                  v-model="userPhone"
                  :rules="[requiredValidator]"
                  label="Phone Number"
                />
              </VCol>

              <!-- Location For User -->
              <VCol
                v-if="role === 'user'"
                cols="12"
              >
                <VSelect
                  v-model="userLocation"
                  :rules="[requiredValidator, alphaDashValidator]"
                  :items="locations"
                  label="Location"
                />
              </VCol>
              <VCol cols="12">
                <div class="d-flex align-center mt-2 mb-4">
                  <VCheckbox
                    id="privacy-policy"
                    v-model="privacyPolicies"
                    inline
                  />
                  <VLabel
                    for="privacy-policy"
                    class="pb-1"
                    style="opacity: 1;"
                  >
                    <span class="me-1">I agree to</span>
                    <a
                      href="javascript:void(0)"
                      class="text-primary"
                    >privacy policy & terms</a>
                  </VLabel>
                </div>

                <VAlert
                  v-if="errorMessage"
                  type="error"
                  title="Error"
                  variant="outlined"
                  class="mb-3"
                  :text="errorMessage"
                />

                <VBtn
                  :disabled="dataLoading"
                  block
                  type="submit"
                  :class="{ 'pa-6': dataLoading }"
                >
                  <VProgressCircular
                    v-if="dataLoading"
                    indeterminate
                    color="primary"
                  />
                  <span v-else>
                    Sign up
                  </span>
                </VBtn>
              </VCol>

              <!-- create account -->
              <VCol
                cols="12"
                class="text-center text-base"
              >
                <span>Already have an account?</span>
                <RouterLink
                  class="text-primary ms-2"
                  :to="{ name: 'login' }"
                >
                  Sign in instead
                </RouterLink>
              </VCol>

              <VCol
                cols="12"
                class="d-flex align-center"
              >
                <VDivider />
                <span class="mx-4">or</span>
                <VDivider />
              </VCol>

              <!-- auth providers -->
              <VCol
                cols="12"
                class="text-center"
              >
                <AuthProvider />
              </VCol>
            </VRow>
          </VForm>
        </VCardText>
      </VCard>
    </VCol>
  </VRow>
</template>

<style lang="scss">
@use "@core/scss/template/pages/page-auth.scss";
</style>

<route lang="yaml">
meta:
  layout: blank
  action: read
  subject: Auth
  redirectIfLoggedIn: true
</route>
