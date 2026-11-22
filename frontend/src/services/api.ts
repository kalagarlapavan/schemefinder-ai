import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
  timeout: 30000,
})

export interface Scheme {
  id: string
  name: string
  description: string
  category: string
  min_age: number
  max_age: number
  max_annual_income: number
  eligible_occupations: string[]
  eligible_states: string[]
  eligible_education: string[]
  benefits: string
  documents_required: string[]
  application_procedure: string
  official_url: string
  source_url: string
  is_central: boolean
}

export interface CitizenProfile {
  age: number
  state: string
  occupation: string
  annual_income: number
  education: string
}

export interface EligibilityResult {
  scheme_id: string
  scheme_name: string
  status: 'ELIGIBLE' | 'PARTIAL' | 'NOT_ELIGIBLE'
  match_reason: string
  missing_info: string[]
  scheme: Scheme
}

export interface EligibilityResponse {
  profile: CitizenProfile
  results: EligibilityResult[]
  total_eligible: number
  total_partial: number
  total_not_eligible: number
  disclaimer: string
}

// Health
export const checkHealth = () => api.get('/api/health')

// Schemes
export const getSchemes = (params?: { search?: string; category?: string; limit?: number }) =>
  api.get<{ schemes: Scheme[]; count: number }>('/api/schemes', { params })

export const getScheme = (id: string) =>
  api.get<Scheme>(`/api/schemes/${id}`)

export const getCategories = () =>
  api.get<{ categories: string[] }>('/api/schemes/categories')

// Eligibility
export const checkEligibility = (profile: CitizenProfile) =>
  api.post<EligibilityResponse>('/api/eligibility/check', profile)

// AI Assistant
export const chatWithAssistant = (data: {
  message: string
  session_id?: string
  user_profile?: CitizenProfile
}) => api.post<{ response: string; sources: string[]; session_id: string }>('/api/assistant/chat', data)

export default api
