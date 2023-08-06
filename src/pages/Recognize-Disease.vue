<script setup lang="ts">
import { VForm } from 'vuetify/components'
import type { RecognizeDiabiticsParam } from '@/views/apps/recognize-disease/types'
import axios from '@axios'
import { betweenValidator, decimalValidator, requiredValidator } from '@validators'

const refVForm = ref<VForm>()

const age = ref()

// const ages = ref([...Array(100).keys()].map(i => i + 1))

const temp = []
for (let i = 1; i < 101; i++)
  temp.push(i)

const ages = ref(temp)

// Gender
const genders = ref([{ label: 'Male', value: 'male' }, { label: 'Female', value: 'female' }])

const gender = ref()

// User Height
const height = ref('')

// User Weight
const weight = ref('')

// User Blood Type
const bloods = ref([
  'A+',
  'A-',
  'B+',
  'B-',
  'AB+',
  'AB-',
  'O+',
  'O-',
])

const blood = ref('')

const temperature = ref('')

const yesOrNO = [{ label: 'Yes', value: 1 }, { label: 'No', value: 0 }]

const smoking = ref()
const smokingOptions = ref(yesOrNO)

const bmi = ref('')

const cholesterol = ref('')
const bloodPressure = ref('')
const heartRate = ref('')

const dataLoading = ref(false)
const submitSuccessful = ref(false)

const recognition = ref('')

// Form Errors
const errors = ref<Record<string, string | undefined>>({
  age: undefined,
  gender: undefined,
  height: undefined,
  weight: undefined,
  blood: undefined,
  temperature: undefined,
  smoking: undefined,
  bmi: undefined,
  cholesterol: undefined,
  bloodPressure: undefined,
  heartRate: undefined,
})

// Error Message Alert For Network Errors
const errorMessage = ref('')

function calculateBMI() {
  return parseFloat(parseFloat(weight.value) / (parseFloat(height.value).toFixed(1) ** 2)).toFixed(2)
}

function recognizeDiabytics() {
  const data: RecognizeDiabiticsParam = {
    age: age.value,
    gender: gender.value,
    height: height.value,
    weight: weight.value,
    blood: blood.value,
    temperature: temperature.value,
    smoking: smoking.value,
    cholesterol: cholesterol.value,
    bloodPressure: bloodPressure.value,
    heartRate: heartRate.value,
    bmi: bmi.value === calculateBMI() ? bmi.value : calculateBMI(),
  }

  axios.post('http://localhost:5000/recongize-diabetics', data).then(result => {
    console.log('Result => ', result)
    dataLoading.value = false
    submitSuccessful.value = true

    recognition.value = result.data.message
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
        recognizeDiabytics()
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
    <VCol cols="6">
      <VCard
        class="pa-6"
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
            <!-- User Height -->
            <VCol cols="12">
              <VTextField
                v-model="height"
                :rules="[requiredValidator, decimalValidator]"
                label="Height in meter"
                :error-messages="errors.height"
              />
            </VCol>

            <!-- User Weight -->
            <VCol cols="12">
              <VTextField
                v-model="weight"
                :rules="[requiredValidator, decimalValidator]"
                label="Weight in Kg"
                :error-messages="errors.weight"
              />
            </VCol>

            <!-- Age For User -->
            <VCol cols="12">
              <VSelect
                v-model="age"
                :rules="[requiredValidator]"
                :items="ages"
                label="User Age"
              />
            </VCol>

            <!-- User Gender -->
            <VCol cols="12">
              <VSelect
                v-model="gender"
                :rules="[requiredValidator]"
                :items="genders"
                item-title="label"
                label="Gender"
              />
            </VCol>

            <!-- User Blood Type -->
            <VCol cols="12">
              <VSelect
                v-model="blood"
                :rules="[requiredValidator]"
                :items="bloods"
                label="Blood Type"
              />
            </VCol>

            <!-- User Body Temperature -->
            <VCol cols="12">
              <VTextField
                v-model="temperature"
                :rules="[requiredValidator, decimalValidator, val => betweenValidator(val, 0, 45)]"
                label="Body Temperature"
              />
            </VCol>

            <!-- User Smoking -->
            <VCol cols="12">
              <VSelect
                v-model="smoking"
                :rules="[requiredValidator]"
                :items="smokingOptions"
                item-title="label"
                label="Are You Smoking?"
              />
            </VCol>

            <!-- User BMI -->
            <VCol cols="12">
              <VTextField
                v-model="bmi"
                :rules="[requiredValidator]"
                label="BMI - Body Mass Index"
              />
            </VCol>

            <!-- User Height -->
            <VCol cols="12">
              <VTextField
                v-model="cholesterol"
                :rules="[requiredValidator, decimalValidator]"
                label="Cholesterol"
                :error-messages="errors.cholesterol"
              />
            </VCol>

            <!-- User Height -->
            <VCol cols="12">
              <VTextField
                v-model="heartRate"
                :rules="[requiredValidator, decimalValidator]"
                label="Heart Rate"
                :error-messages="errors.heartRate"
              />
            </VCol>

            <!-- User Height -->
            <VCol cols="12">
              <VTextField
                v-model="bloodPressure"
                :rules="[requiredValidator, decimalValidator]"
                label="Blood Pressure"
                :error-messages="errors.bloodPressure"
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

            <VCol cols="4" />
            <VCol cols="4">
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
    <VCol
      cols="5"
      class="ma-2"
    >
      <VCard
        class="pa-6"
      >
        <VCardText>
          Recognition: {{ recognition }}
        </VCardText>
      </VCard>
    </VCol>
  </VRow>
</template>
