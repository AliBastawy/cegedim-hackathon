<script setup lang="ts">
import type { DonatedMedicineParam } from '@/views/apps/donated-medicines/types'
import { useDonatedMedicineStore } from '@/views/apps/donated-medicines/useDonatedMedicineStore'

// 👉 Store
const donatedMedicinesListStore = useDonatedMedicineStore()

const searchQuery = ref('')
const rowPerPage = ref(10)
const currentPage = ref(1)
const totalPage = ref(1)
const totalMedicines = ref(0)
const donatedMedicines = ref<DonatedMedicineParam[]>([])
const selectedRows = ref<string[]>([])

function fetchDonatedMedicines() {
  donatedMedicinesListStore.fetchDonatedMedicines(
    {
      q: searchQuery.value,
      perPage: rowPerPage.value,
    },
  ).then(({ data }) => {
    console.log('Data => ', data)
    if (typeof data !== 'object' || Array.isArray(data))
      return

    donatedMedicines.value = data?.data

    // totalPage.value = data.paginatorInfo.totalPage

    totalPage.value = donatedMedicines.value?.length ? Math.ceil(donatedMedicines.value.length / rowPerPage.value) : 1

    // totalMedicines.value = data.paginatorInfo.totalMedicines
    totalMedicines.value = donatedMedicines.value?.length
  }).catch(error => {
    console.log(error)
  })
}

// 👉 Fetch Invoices
onMounted(() => {
  fetchDonatedMedicines()
})

// 👉 watching current page
watchEffect(() => {
  if (currentPage.value > totalPage.value)
    currentPage.value = totalPage.value
})

// 👉 Computing pagination data
const paginationData = computed(() => {
  const firstIndex = donatedMedicines.value.length ? ((currentPage.value - 1) * rowPerPage.value) + 1 : 0
  const lastIndex = (currentPage.value * rowPerPage.value)

  return `Showing ${firstIndex} to ${lastIndex} of ${totalMedicines.value} entries`
})

const filteredMedicines = computed(() => {
  console.log('Filter Medicines =>> ', donatedMedicines.value.slice((currentPage.value - 1) * rowPerPage.value, rowPerPage.value))

  return donatedMedicines.value.slice((currentPage.value - 1) * rowPerPage.value, currentPage.value * rowPerPage.value)
})

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
</script>

<template>
  <VCard
    id="donatedMedicines-list"
  >
    <VCardText>
      <VRow align="center">
        <!-- 👉 Rows per page -->
        <div
          class="d-flex align-center"
          style="width: 135px;"
        >
          <span class="text-no-wrap me-3">Show:</span>
          <VSelect
            v-model="rowPerPage"
            density="compact"
            :items="[10, 20, 30, 50]"
          />
        </div>

        <div class="ma-3">
          <!-- 👉 Create invoice -->
          <VBtn
            prepend-icon="tabler-plus"
            :to="{ name: 'Donate-Medicine' }"
          >
            Donate New Medicine
          </VBtn>
        </div>

        <VSpacer />

        <VCol cols="3">
          <!-- 👉 Search  -->
          <div class="medicine-list-filter d-flex align-center">
            <VBtn
              icon="tabler-search"
              class="ma-2"
              @click="fetchDonatedMedicines"
            />
            <VTextField
              v-model="searchQuery"
              placeholder="Search Medicine"
              density="compact"
            />
          </div>
        </VCol>
      </VRow>
    </VCardText>

    <VDivider />

    <!-- SECTION Table -->
    <VRow class="pa-3">
      <VCol
        v-for="(medicine, index) in filteredMedicines"
        :key="`${medicine.id}-${index}`"
        cols="6"
        lg="4"
      >
        <VCard
          variant="flat"
          border
          class="pa-5"
        >
          <VRow align="center">
            <VCol cols="6">
              <VImg
                :src="medicine.img"
                width="150"
              />
            </VCol>
            <VCol cols="6">
              <RouterLink :to="{ name: 'my-medicines-id', params: { id: medicine.id } }">
                {{ medicine.name }}
              </RouterLink>
              <p>
                Status:
                <VChip
                  class="ma-2"
                  :color="medicineAcceptanceColor(medicine)"
                  text-color="white"
                >
                  {{ medicineAcceptance(medicine) }}
                </VChip>
              </p>
            </VCol>
          </VRow>
        </VCard>
      </VCol>
    </VRow>

    <!-- Not Found Original Medicine -->
    <VCol
      v-if="!filteredMedicines.length"
      cols="12"
      class="text-center"
    >
      No Medicine Found
    </VCol>
    <!-- !SECTION -->

    <VDivider />

    <!-- SECTION Pagination -->
    <VCardText class="d-flex align-center flex-wrap gap-4 py-3">
      <!-- 👉 Pagination meta -->
      <span class="text-sm text-disabled">
        {{ paginationData }}
      </span>

      <VSpacer />

      <!-- 👉 Pagination -->
      <VPagination
        v-model="currentPage"
        size="small"
        :total-visible="5"
        :length="totalPage"
        @next="selectedRows = []"
        @prev="selectedRows = []"
      />
    </VCardText>
    <!-- !SECTION -->
  </vcard>
</template>
