// API utility functions for university management
import { BaseAPI, ApiResponse, PaginatedResponse } from "./base"
import { authAPI } from "./auth"

class UniversityAPI extends BaseAPI {
  // New authentication method for search APIs
  private async getSearchAuthToken(): Promise<string> {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api"
    try {
      const response = await fetch(`${baseUrl}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: "abcz@d.com",
          password: "Ae121212"
        })
      })

      if (!response.ok) {
        throw new Error('Failed to authenticate for search')
      }

      const data = await response.json()
      if (data.success && data.data?.accessToken) {
        return data.data.accessToken
      } else {
        throw new Error('Invalid authentication response')
      }
    } catch (error) {
      console.error('Search authentication error:', error)
      throw new Error('Authentication failed for search APIs')
    }
  }

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

  // Updated search methods with new authentication
  async searchUniversitiesByCity(city: string): Promise<ApiResponse<any>> {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api"
    const token = await this.getSearchAuthToken()
    const response = await fetch(`${baseUrl}/user/universities/search?city=${encodeURIComponent(city)}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    })

    if (!response.ok) {
      throw new Error(`Search by city failed: ${response.statusText}`)
    }

    return response.json()
  }

  async searchUniversitiesByFieldOfStudy(fieldOfStudy: string): Promise<ApiResponse<any>> {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api"
    const token = await this.getSearchAuthToken()
    const response = await fetch(`${baseUrl}/user/universities/search?fieldOfStudy=${encodeURIComponent(fieldOfStudy)}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    })

    if (!response.ok) {
      throw new Error(`Search by field of study failed: ${response.statusText}`)
    }

    return response.json()
  }

  async searchUniversitiesByCourseType(courseType: string): Promise<ApiResponse<any>> {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api"
    const token = await this.getSearchAuthToken()
    const response = await fetch(`${baseUrl}/user/universities/search?courseType=${encodeURIComponent(courseType)}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    })

    if (!response.ok) {
      throw new Error(`Search by course type failed: ${response.statusText}`)
    }

    return response.json()
  }

  async searchUniversitiesByDegreeProgram(degreeProgram: string): Promise<ApiResponse<any>> {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api"
    const token = await this.getSearchAuthToken()
    const response = await fetch(`${baseUrl}/user/universities/search?degreeProgram=${encodeURIComponent(degreeProgram)}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    })

    if (!response.ok) {
      throw new Error(`Search by degree program failed: ${response.statusText}`)
    }

    return response.json()
  }

  async searchUniversitiesByAdmissions(admissions: string): Promise<ApiResponse<any>> {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api"
    const token = await this.getSearchAuthToken()
    const response = await fetch(`${baseUrl}/user/universities/search?admissions=${encodeURIComponent(admissions)}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    })

    if (!response.ok) {
      throw new Error(`Search by admissions failed: ${response.statusText}`)
    }

    return response.json()
  }

  async searchUniversitiesByDuration(duration: string): Promise<ApiResponse<any>> {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api"
    const token = await this.getSearchAuthToken()
    const response = await fetch(`${baseUrl}/user/universities/search?duration=${encodeURIComponent(duration)}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    })

    if (!response.ok) {
      throw new Error(`Search by duration failed: ${response.statusText}`)
    }

    return response.json()
  }

  async searchUniversitiesByProgramName(programName: string): Promise<ApiResponse<any>> {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api"
    const token = await this.getSearchAuthToken()
    const response = await fetch(`${baseUrl}/user/universities/search?programName=${encodeURIComponent(programName)}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    })

    if (!response.ok) {
      throw new Error(`Search by program name failed: ${response.statusText}`)
    }

    return response.json()
  }

  async getUniversity(id: string): Promise<ApiResponse<any>> {
    return this.get<ApiResponse<any>>(`/universities/${id}`)
  }

  async createUniversity(data: any): Promise<ApiResponse<any>> {
    return this.post<ApiResponse<any>>("/universities/universities", data)
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
