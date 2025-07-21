export interface User {
  id: string
  name: string
  phone: number
  email_verified_at: string | null
  permissions : string[]
}

export interface LoginPayload {
  email: string
  password: string
}

export interface registrationPayload {
  name: string
  email: string
  password: string
  phone: number
}
