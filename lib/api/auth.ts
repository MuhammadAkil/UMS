// Authentication API service
export interface LoginResponse {
  success: boolean
  data: {
    user: {
      id: string
      firstName: string
      lastName: string
      email: string
      role: string
    }
    accessToken: string
    refreshToken: string
  }
}

export interface LoginRequest {
  email: string
  password: string
}

class AuthAPI {
  private baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api"

  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await fetch(`${this.baseUrl}/auth/admin/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    })

    if (!response.ok) {
      throw new Error(`Login failed: ${response.statusText}`)
    }

    const data = await response.json()
    
    // Save access token to session storage
    if (data.success && data.data.accessToken) {
      sessionStorage.setItem("accessToken", data.data.accessToken)
      sessionStorage.setItem("user", JSON.stringify(data.data.user))
    }

    return data
  }

  getAccessToken(): string | null {
    if (typeof window !== "undefined") {
      return sessionStorage.getItem("accessToken")
    }
    return null
  }

  getUser(): any | null {
    if (typeof window !== "undefined") {
      const userStr = sessionStorage.getItem("user")
      return userStr ? JSON.parse(userStr) : null
    }
    return null
  }

  isAuthenticated(): boolean {
    return !!this.getAccessToken()
  }

  logout(): void {
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("accessToken")
      sessionStorage.removeItem("user")
    }
  }

  // Auto-login with hardcoded credentials
  async autoLogin(): Promise<LoginResponse> {
    const credentials: LoginRequest = {
      email: "admin@example.com",
      password: "admin123"
    }
    
    return this.login(credentials)
  }
}

export const authAPI = new AuthAPI() 