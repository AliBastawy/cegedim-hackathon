import { defineStore } from 'pinia'
import type { MedicineParam } from './types'
import axios from '@axios'

export const useMedicineStore = defineStore('MedicineStore', {
  actions: {
    // 👉 Fetch all Medicines
    fetchMedicines(params: MedicineParam) {
      return axios.get('http://localhost:5000/medicines', { params })
    },

    // 👉 Fetch Alternative Medicines
    fetchAlternativeMedicines(params: MedicineParam) {
      return axios.get('http://localhost:5000/medicines/alternative', { params })
    },

    // 👉 Fetch Alternative Medicines
    fetchNaturalAlternativeMedicines(params?: MedicineParam) {
      return axios.get('http://localhost:5000/medicines/natural-alternative', { params })
    },

    // 👉 Fetch single medicine
    fetchMedicine(id: number) {
      return axios.get(`http://localhost:5000/medicines/${id}`)
    },
  },
})
