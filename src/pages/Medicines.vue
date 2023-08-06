<script setup lang="ts">
import type { MedicineParam } from '@/views/apps/medicines/types'
import { useMedicineStore } from '@/views/apps/medicines/useMedicineStore'

// 👉 Store
const medicinesListStore = useMedicineStore()

const searchQuery = ref('')
const rowPerPage = ref(10)
const currentPage = ref(1)
const totalPage = ref(1)
const totalMedicines = ref(0)
const medicines = ref<MedicineParam[]>([])
const alternativeMedicines = ref<MedicineParam[]>([])
const naturalMedicines = ref<MedicineParam[]>([])
const selectedRows = ref<string[]>([])

function fetchMedicines() {
  medicinesListStore.fetchMedicines(
    {
      q: searchQuery.value,
      perPage: rowPerPage.value,
    },
  ).then(({ data }) => {
    console.log('Data => ', data)
    if (typeof data !== 'object' || Array.isArray(data))
      return

    medicines.value = data?.data

    // totalPage.value = data.paginatorInfo.totalPage

    totalPage.value = medicines.value?.length ? Math.ceil(medicines.value.length / rowPerPage.value) : 1

    // totalMedicines.value = data.paginatorInfo.totalMedicines
    totalMedicines.value = medicines.value?.length
  }).catch(error => {
    console.log(error)
  })
}

function fetchAlternativeMedicines() {
  medicinesListStore.fetchAlternativeMedicines(
    {
      q: searchQuery.value,
      perPage: rowPerPage.value,
    },
  ).then(({ data }) => {
    console.log('Data => ', data)
    alternativeMedicines.value = data.data
  }).catch(error => {
    console.log(error)
  })
}

function fetchNaturalAlternativeMedicines() {
  medicinesListStore.fetchNaturalAlternativeMedicines().then(({ data }) => {
    console.log('Data => ', data)
    naturalMedicines.value = data.data
  }).catch(error => {
    console.log(error)
  })
}

// 👉 Fetch Invoices
onMounted(() => {
  fetchMedicines()
})

// 👉 watching current page
watchEffect(() => {
  if (currentPage.value > totalPage.value)
    currentPage.value = totalPage.value
})

// 👉 Computing pagination data
const paginationData = computed(() => {
  const firstIndex = medicines.value.length ? ((currentPage.value - 1) * rowPerPage.value) + 1 : 0
  const lastIndex = (currentPage.value * rowPerPage.value)

  return `Showing ${firstIndex} to ${lastIndex} of ${totalMedicines.value} entries`
})

const filteredMedicines = computed(() => {
  console.log('Filter Medicines =>> ', medicines.value.slice((currentPage.value - 1) * rowPerPage.value, rowPerPage.value))

  const originalMedicines = medicines.value.slice((currentPage.value - 1) * rowPerPage.value, currentPage.value * rowPerPage.value)

  if (originalMedicines.length)
    return originalMedicines

  if (searchQuery.value && !originalMedicines.length) {
    fetchAlternativeMedicines()
    fetchNaturalAlternativeMedicines()

    return []
  }

  return []

  // return medicines.value.slice((currentPage.value - 1) * rowPerPage.value, currentPage.value * rowPerPage.value)
})

const showMoreMedicines = ref(1)

const filteredAlternativeMedicines = computed(() => {
  const allAlternatives = alternativeMedicines.value

  return allAlternatives.slice(0, showMoreMedicines.value * rowPerPage.value)
})

const showAlternativeMedicines = computed(() => {
  return !filteredMedicines.length && searchQuery.value
})
</script>

<template>
  <VCard
    id="medicines-list"
  >
    <VCardText>
      <VRow>
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

        <VSpacer />

        <VCol cols="4">
          <!-- 👉 Search  -->
          <div class="medicine-list-filter d-flex align-center">
            <VBtn
              @click="fetchMedicines"
            >
              <VIcon icon="mdi-refresh" />
              Reload Data
            </VBtn>
            <VBtn
              icon="tabler-search"
              class="ma-2"
              @click="fetchMedicines"
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
              <p>{{ medicine.name }}</p>
              <p>{{ medicine.price }}EGP</p>
            </VCol>
            <VCol
              cols="12"
              class="text-center"
            >
              <VBtn @click="">
                Order
              </VBtn>
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

    <VDivider />

    <!-- SECTION Alternative Medicines -->
    <VCardText
      v-if="showAlternativeMedicines"
      class="text-center"
    >
      <span>There Is Alternative of this medicine Like:</span>
      <VRow class="pa-3">
        <VCol
          v-for="(medicine, index) in filteredAlternativeMedicines"
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
                <p>{{ medicine.name }}</p>
                <p>{{ medicine.price }}EGP</p>
              </VCol>
            </VRow>
          </VCard>
        </VCol>

        <!-- Not Found Original Medicine -->
        <VCol
          v-if="!showAlternativeMedicines"
          cols="12"
          class="text-center"
        >
          <span>No Alternative Medicine Found</span>
        </VCol>
      </VRow>

      <VBtn
        v-if="filteredAlternativeMedicines.length !== alternativeMedicines.length"
        @click="showMoreMedicines += 1"
      >
        Show More
      </VBtn>
    </VCardText>
    <!-- End SECTION Alternative Medicines -->

    <VDivider />

    <!-- SECTION Natural Alternative Medicines -->
    <VCardText
      v-if="showAlternativeMedicines"
      class="text-center"
    >
      <span>There Is Also Natural Alternative of this medicine Like:</span>
      <VRow class="pa-3">
        <VCol
          v-for="(medicine, index) in naturalMedicines"
          :key="`${medicine.id}-${index}`"
          cols="12"
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
                <p>{{ medicine.name }}</p>
                <p>{{ medicine.info }}</p>
              </VCol>
            </VRow>
          </VCard>
        </VCol>
      </VRow>
    </VCardText>
    <!-- End SECTION Natural Alternative Medicines -->
  </VCard>
</template>

<style lang="scss">
#invoice-list {
  .invoice-list-actions {
    inline-size: 8rem;
  }

  .medicine-list-filter {
    //inline-size: 12rem;
  }
}
</style>
