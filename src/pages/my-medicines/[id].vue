<script setup lang="ts">
import { useDonatedMedicineStore } from '@/views/apps/donated-medicines/useDonatedMedicineStore'

const donatedMedicinesListStore = useDonatedMedicineStore()

const router = useRouter()

const donatedMedicine = ref()

const dataLoading = ref(true)

// console.log(router)

function fetchDonatedMedicines() {
  donatedMedicinesListStore.fetchDonatedMedicine(router.currentRoute.value.params.id).then(({ data }) => {
    console.log('Data => ', data)

    donatedMedicine.value = data
    dataLoading.value = false
  }).catch(error => {
    console.log(error)
  })
}

function medicineAcceptance(medicine) {
  if (medicine.pending)
    return 'Pending'

  return !medicine.accepted ? 'Refused' : 'Accepted'
}

function medicineAcceptanceColor(medicine) {
  if (medicine.pending)
    return 'primary'

  return !medicine.accepted ? 'error' : 'success'
}

onMounted(() => {
  fetchDonatedMedicines()
})
</script>

<template>
  <VCard class="pa-4 text-center">
    <VProgressCircular
      v-if="dataLoading"
      indeterminate
      color="primary"
    />
    <VCardText v-else>
      <VRow>
        <VCol cols="6">
          <VImg
            :src="donatedMedicine.img"
            width="250"
          />
        </VCol>
        <VCol cols="6">
          <p>{{ donatedMedicine.name }}</p>
          <p>
            Status:
            <VChip
              class="ma-2"
              :color="medicineAcceptanceColor(donatedMedicine)"
              text-color="white"
            >
              {{ medicineAcceptance(donatedMedicine) }}
            </VChip>
          </p>
        </VCol>
      </VRow>
    </VCardText>
  </VCard>
</template>
