import { defineStore } from 'pinia'
import type { DonatedMedicineParam } from './types'
import axios from '@axios'

export const useDonatedMedicineStore = defineStore('DonatedMedicineStore', {
  actions: {
    // 👉 Fetch all Medicines
    fetchDonatedMedicines(params: DonatedMedicineParam) {
      return axios.get('http://localhost:5000/my-donated-medicines', { params })
    },

    // 👉 Fetch single medicine
    fetchDonatedMedicine(id: number) {
      return axios.get(`http://localhost:5000/my-donated-medicines/${id}`)
    },
  },
})
