<script setup lang="ts">
import { VForm } from 'vuetify/components'
import type { DonateMedicineParam } from '@/views/apps/donate-medicine/types'
import axios from '@axios'
import { alphaDashValidator, emailValidator, requiredValidator } from '@validators'

const username = ref('test')
const email = ref('test@gmail.com')
const refVForm = ref<VForm>()

// Location for User
const userLocation = ref('Aswan')

// User Phone
const userPhone = ref('01112256266')

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

// Medicine Name
const medicineName = ref('Conjistal')

// Medicine Name
const medicinePic = ref(null)

// Medicine Name
const medicineExpirePic = ref(null)

// Medicine Name
const medicinePrescription = ref(null)

// User Sell Medicine
const sellMedicine = ref(false)

// Medicine Original Price
const medicineOriginalPrice = ref('')

// Medicine User Price
const medicineUserPrice = ref('')

const dataLoading = ref(false)
const submitSuccessful = ref(false)

// Form Errors
const errors = ref<Record<string, string | undefined>>({
  email: undefined,
  password: undefined,
  userLocation: undefined,
  phone: undefined,
})

// Error Message Alert For Network Errors
const errorMessage = ref('')

const router = useRouter()

function donateMedicine() {
  const data: DonateMedicineParam = {
    username: username.value,
    email: email.value,
    userLocation: userLocation.value,
    userPhone: userPhone.value,
    medicineName: medicineName.value,
    medicinePic: medicinePic.value[0],
    medicineExpirePic: medicineExpirePic.value[0],
    medicinePrescription: medicinePrescription.value[0],
  }

  if (sellMedicine.value) {
    data.medicineOriginalPrice = medicineOriginalPrice.value
    data.medicineUserPrice = medicineUserPrice.value
  }
  axios.post('http://localhost:8000/donate-medicine', data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }).then(result => {
    console.log('Result => ', result)
    dataLoading.value = false
    submitSuccessful.value = true

    router.push({ name: 'MyMedicines' })
  }).catch(error => {
    dataLoading.value = false
    errorMessage.value = error.message
    console.log('Error => ', error)
  })
}

function submitData() {
  refVForm.value?.validate()
    .then(({ valid: isValid }) => {
      if (isValid) {
        dataLoading.value = true
        errorMessage.value = ''
        donateMedicine()
      }
    })
}
</script>

<template>
  <VRow
    no-gutters
    align="center"
    justify="center"
  >
    <VCol cols="12">
      <VCard
        class="pa-6"
        :max-width="900"
      >
        <VSnackbar
          v-model="submitSuccessful"
          variant="outlined"
          color="success"
          location="top"
        >
          <VIcon icon="mdi-check" />
          Medicine Uploaded Successfully
        </VSnackbar>
        <VForm
          ref="refVForm"
          enctype="multipart/form-data"
          @submit.prevent="submitData"
        >
          <VRow>
            <!-- Username -->
            <VCol cols="12">
              <VTextField
                v-model="username"
                :rules="[requiredValidator]"
                label="Username"
              />
            </VCol>
            <!-- email -->
            <VCol cols="12">
              <VTextField
                v-model="email"
                label="Email"
                type="email"
                :rules="[emailValidator]"
                :error-messages="errors?.email"
              />
            </VCol>

            <!-- Phone Number For User -->
            <VCol cols="12">
              <VTextField
                v-model="userPhone"
                :rules="[requiredValidator]"
                label="Phone Number"
              />
            </VCol>

            <!-- Location For User -->
            <VCol cols="12">
              <VSelect
                v-model="userLocation"
                :rules="[requiredValidator, alphaDashValidator]"
                :items="locations"
                label="Location"
              />
            </VCol>
            <!-- Medicine Name -->
            <VCol cols="12">
              <VTextField
                v-model="medicineName"
                :rules="[requiredValidator]"
                label="Medicine Name"
              />
            </VCol>
            <!-- Medicine Picture -->
            <VCol cols="12">
              <VFileInput
                v-model="medicinePic"
                :rules="[requiredValidator]"
                label="Medicine Picture"
              />
            </VCol>
            <!-- Medicine Expire Data Picture -->
            <VCol cols="12">
              <VFileInput
                v-model="medicineExpirePic"
                :rules="[requiredValidator]"
                label="Medicine Expire Data Picture"
              />
            </VCol>
            <!-- Medicine Prescription Picture -->
            <VCol cols="12">
              <VFileInput
                v-model="medicinePrescription"
                :rules="[requiredValidator]"
                label="Medicine Prescription Picture"
              />
            </VCol>
            <!-- Does User Want to Sell The Medicine -->
            <VCol cols="12">
              <VSwitch
                v-model="sellMedicine"
                label="Sell Medicine"
              />
            </VCol>
            <!-- Medicine Original Price -->
            <VCol
              v-if="sellMedicine"
              cols="12"
            >
              <VTextField
                v-model="medicineOriginalPrice"
                label="Medicine Original Price"
              />
            </VCol>
            <!-- Medicine User Price -->
            <VCol
              v-if="sellMedicine"
              cols="12"
            >
              <VTextField
                v-model="medicineUserPrice"
                label="Medicine User Price"
              />
            </VCol>

            <VCol
              v-if="errorMessage"
              cols="12"
            >
              <VAlert
                type="error"
                title="Error"
                variant="outlined"
                class="mb-3"
                :text="errorMessage"
              />
            </VCol>

            <VCol cols="6">
              <VBtn
                :loading="dataLoading"
                type="submit"
                block
                class="mt-2"
                text="Submit"
              />
            </VCol>
          </VRow>
        </VForm>
      </VCard>
    </VCol>
  </VRow>
</template>
