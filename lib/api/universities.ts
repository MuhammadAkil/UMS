// API utility functions for university management
// This will be used when integrating with the actual backend

export interface ApiResponse<T> {
  data: T
  message: string
  success: boolean
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

class UniversityAPI {
  private baseUrl = process.env.NEXT_PUBLIC_API_URL || "/api"

  async getUniversities(params?: {
    page?: number
    limit?: number
    search?: string
    type?: string
    status?: string
  }): Promise<PaginatedResponse<any>> {
    const searchParams = new URLSearchParams()

    if (params?.page) searchParams.append("page", params.page.toString())
    if (params?.limit) searchParams.append("limit", params.limit.toString())
    if (params?.search) searchParams.append("search", params.search)
    if (params?.type) searchParams.append("type", params.type)
    if (params?.status) searchParams.append("status", params.status)

    const response = await fetch(`${this.baseUrl}/universities?${searchParams}`)

    if (!response.ok) {
      throw new Error("Failed to fetch universities")
    }

    return response.json()
  }

  async getUniversity(id: number): Promise<ApiResponse<any>> {
    const response = await fetch(`${this.baseUrl}/universities/${id}`)

    if (!response.ok) {
      throw new Error("Failed to fetch university")
    }

    return response.json()
  }

  async createUniversity(data: any): Promise<ApiResponse<any>> {
    const response = await fetch(`${this.baseUrl}/universities`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      throw new Error("Failed to create university")
    }

    return response.json()
  }

  async updateUniversity(id: number, data: any): Promise<ApiResponse<any>> {
    const response = await fetch(`${this.baseUrl}/universities/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      throw new Error("Failed to update university")
    }

    return response.json()
  }

  async deleteUniversity(id: number): Promise<ApiResponse<any>> {
    const response = await fetch(`${this.baseUrl}/universities/${id}`, {
      method: "DELETE",
    })

    if (!response.ok) {
      throw new Error("Failed to delete university")
    }

    return response.json()
  }

  async bulkUploadUniversities(file: File): Promise<ApiResponse<any>> {
    const formData = new FormData()
    formData.append("file", file)

    const response = await fetch(`${this.baseUrl}/universities/bulk-upload`, {
      method: "POST",
      body: formData,
    })

    if (!response.ok) {
      throw new Error("Failed to upload universities")
    }

    return response.json()
  }

  async exportUniversities(format: "csv" | "excel" = "csv"): Promise<Blob> {
    const response = await fetch(`${this.baseUrl}/universities/export?format=${format}`)

    if (!response.ok) {
      throw new Error("Failed to export universities")
    }

    return response.blob()
  }
}

export const universityAPI = new UniversityAPI()
