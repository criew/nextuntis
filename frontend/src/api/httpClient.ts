import axios from 'axios'

const httpClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? '',
})

export function setAuthToken(token: string | null) {
  if (token) {
    httpClient.defaults.headers.common['Authorization'] = `Bearer ${token}`
  } else {
    delete httpClient.defaults.headers.common['Authorization']
  }
}

export default httpClient
