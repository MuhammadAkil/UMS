import { create } from "zustand"
import { universityAPI } from "@/lib/api/universities"

export interface University {
  id: number
  name: string
  code: string
  type: "Public" | "Private" | "Community"
  established: number
  country: string
  state?: string
  city: string
  website?: string
  email: string
  phone?: string
  students?: number
  ranking?: number
  address?: string
  description?: string
  status: "Active" | "Inactive" | "Inprogress" | "Deleted"
  programs?: number
  degrees?: string
  createdAt: Date
  updatedAt: Date
}

interface UniversityStore {
  universities: University[]
  loading: boolean
  error: string | null

  // Actions
  fetchUniversities: () => Promise<void>
  addUniversity: (university: Omit<University, "id" | "createdAt" | "updatedAt">) => Promise<void>
  updateUniversity: (id: number, university: Partial<University>) => Promise<void>
  deleteUniversity: (id: number) => Promise<void>
  bulkUploadUniversities: (file: File) => Promise<void>
}

// Dummy data for fallback
const dummyUniversities: University[] = [
  {
    id: 1,
    name: "University of Engineering & Technology Taxila",
    code: "UET-TXL",
    type: "Public",
    established: 1975,
    country: "Pakistan",
    state: "Punjab",
    city: "Taxila",
    website: "https://uettaxila.edu.pk",
    email: "info@uettaxila.edu.pk",
    phone: "+92-51-9047001",
    students: 15000,
    ranking: 5,
    address: "Taxila, Punjab, Pakistan",
    description: "University of Engineering and Technology Taxila",
    status: "Active",
    programs: 20,
    degrees: "BS, MPhil, PhD",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 2,
    name: "Lahore University of Management Sciences",
    code: "LUMS",
    type: "Private",
    established: 1984,
    country: "Pakistan",
    state: "Punjab",
    city: "Lahore",
    website: "https://lums.edu.pk",
    email: "info@lums.edu.pk",
    phone: "+92-42-3560-8000",
    students: 5000,
    ranking: 1,
    address: "DHA, Lahore Cantt, Punjab, Pakistan",
    description: "Lahore University of Management Sciences",
    status: "Active",
    programs: 30,
    degrees: "BS, MS, PhD",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 3,
    name: "National University of Sciences and Technology",
    code: "NUST",
    type: "Public",
    established: 1991,
    country: "Pakistan",
    city: "Islamabad",
    website: "https://nust.edu.pk",
    email: "info@nust.edu.pk",
    phone: "+92-51-9085-6000",
    students: 25000,
    ranking: 2,
    address: "H-12, Islamabad, Pakistan",
    description: "National University of Sciences and Technology",
    status: "Inprogress",
    programs: 50,
    degrees: "BS, MS, PhD",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]

export const useUniversityStore = create<UniversityStore>((set, get) => ({
  universities: [],
  loading: false,
  error: null,

  fetchUniversities: async () => {
    set({ loading: true, error: null })
    try {
      // Try to fetch from API first
      try {
        const response = await universityAPI.getUniversities()
        set({ universities: response.data, loading: false })
      } catch (apiError) {
        // If API fails, use dummy data
        console.warn("API not available, using dummy data:", apiError)
        set({ universities: dummyUniversities, loading: false })
      }
    } catch (error) {
      set({ error: "Failed to fetch universities", loading: false })
    }
  },

  addUniversity: async (universityData) => {
    set({ loading: true, error: null })
    try {
      // Try API first
      try {
        const response = await universityAPI.createUniversity(universityData)
        const newUniversity = response.data
        set((state) => ({
          universities: [...state.universities, newUniversity],
          loading: false,
        }))
      } catch (apiError) {
        // If API fails, add to local state
        console.warn("API not available, adding locally:", apiError)
        const newUniversity: University = {
          ...universityData,
          id: Date.now(),
          createdAt: new Date(),
          updatedAt: new Date(),
        }
        set((state) => ({
          universities: [...state.universities, newUniversity],
          loading: false,
        }))
      }
    } catch (error) {
      set({ error: "Failed to add university", loading: false })
    }
  },

  updateUniversity: async (id, universityData) => {
    set({ loading: true, error: null })
    try {
      // Try API first
      try {
        await universityAPI.updateUniversity(id, universityData)
      } catch (apiError) {
        console.warn("API not available, updating locally:", apiError)
      }

      // Update local state regardless
      set((state) => ({
        universities: state.universities.map((uni) =>
          uni.id === id ? { ...uni, ...universityData, updatedAt: new Date() } : uni,
        ),
        loading: false,
      }))
    } catch (error) {
      set({ error: "Failed to update university", loading: false })
    }
  },

  deleteUniversity: async (id) => {
    set({ loading: true, error: null })
    try {
      // Try API first
      try {
        await universityAPI.deleteUniversity(id)
      } catch (apiError) {
        console.warn("API not available, deleting locally:", apiError)
      }

      // Update local state regardless
      set((state) => ({
        universities: state.universities.filter((uni) => uni.id !== id),
        loading: false,
      }))
    } catch (error) {
      set({ error: "Failed to delete university", loading: false })
    }
  },

  bulkUploadUniversities: async (file) => {
    set({ loading: true, error: null })
    try {
      // Try API first
      try {
        await universityAPI.bulkUploadUniversities(file)
      } catch (apiError) {
        console.warn("API not available, simulating bulk upload:", apiError)
        // Simulate processing time
        await new Promise((resolve) => setTimeout(resolve, 2000))
      }

      set({ loading: false })
    } catch (error) {
      set({ error: "Failed to upload universities", loading: false })
    }
  },
}))
