// API utility functions for university management
import { BaseAPI, ApiResponse, PaginatedResponse } from "./base"
import { authAPI } from "./auth"

class UniversityAPI extends BaseAPI {
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

    const queryString = searchParams.toString()
    const endpoint = `/universities${queryString ? `?${queryString}` : ""}`
    
    return this.get<PaginatedResponse<any>>(endpoint)
  }

  async getUniversity(id: string): Promise<ApiResponse<any>> {
    return this.get<ApiResponse<any>>(`/universities/${id}`)
  }

  async createUniversity(data: any): Promise<ApiResponse<any>> {
    return this.post<ApiResponse<any>>("/universities", data)
  }

  async updateUniversity(id: string, data: any): Promise<ApiResponse<any>> {
    return this.put<ApiResponse<any>>(`/universities/${id}`, data)
  }

  async deleteUniversity(id: string): Promise<ApiResponse<any>> {
    return this.delete<ApiResponse<any>>(`/universities/${id}`)
  }

  async bulkUploadUniversities(file: File): Promise<ApiResponse<any>> {
    const formData = new FormData()
    formData.append("file", file)

    return this.upload<ApiResponse<any>>("/universities/bulk-upload", formData)
  }

  async exportUniversities(format: "csv" | "excel" = "csv"): Promise<Blob> {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api"
    const url = `${baseUrl}/universities/export?format=${format}`
    const token = authAPI.getAccessToken()
    
    const headers: HeadersInit = {}
    if (token) {
      headers.Authorization = `Bearer ${token}`
    }

    const response = await fetch(url, {
      method: "GET",
      headers,
    })

    if (!response.ok) {
      throw new Error(`Failed to export universities: ${response.statusText}`)
    }

    return response.blob()
  }
}

export const universityAPI = new UniversityAPI()
