import { create } from "zustand"

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
  status: "Active" | "Inactive"
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

export const useUniversityStore = create<UniversityStore>((set, get) => ({
  universities: [],
  loading: false,
  error: null,

  fetchUniversities: async () => {
    set({ loading: true, error: null })
    try {
      // TODO: Replace with actual API call
      // const response = await fetch('/api/universities')
      // const universities = await response.json()

      // For now, using dummy data
      const universities: University[] = [
        {
          id: 1,
          name: "Harvard University",
          code: "HARV",
          type: "Private",
          established: 1636,
          country: "US",
          state: "Massachusetts",
          city: "Cambridge",
          website: "https://harvard.edu",
          email: "info@harvard.edu",
          phone: "+1-617-495-1000",
          students: 23000,
          ranking: 1,
          address: "Cambridge, MA 02138",
          description: "Harvard University is a private Ivy League research university",
          status: "Active",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        // Add more dummy data as needed
      ]

      set({ universities, loading: false })
    } catch (error) {
      set({ error: "Failed to fetch universities", loading: false })
    }
  },

  addUniversity: async (universityData) => {
    set({ loading: true, error: null })
    try {
      // TODO: Replace with actual API call
      // const response = await fetch('/api/universities', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(universityData)
      // })
      // const newUniversity = await response.json()

      const newUniversity: University = {
        ...universityData,
        id: Date.now(), // Temporary ID generation
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      set((state) => ({
        universities: [...state.universities, newUniversity],
        loading: false,
      }))
    } catch (error) {
      set({ error: "Failed to add university", loading: false })
    }
  },

  updateUniversity: async (id, universityData) => {
    set({ loading: true, error: null })
    try {
      // TODO: Replace with actual API call
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
      // TODO: Replace with actual API call
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
      // TODO: Replace with actual API call
      // const formData = new FormData()
      // formData.append('file', file)
      // const response = await fetch('/api/universities/bulk-upload', {
      //   method: 'POST',
      //   body: formData
      // })

      // Simulate processing
      await new Promise((resolve) => setTimeout(resolve, 2000))

      set({ loading: false })
    } catch (error) {
      set({ error: "Failed to upload universities", loading: false })
    }
  },
}))
