import axios, { AxiosInstance } from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // send/receive HttpOnly auth cookie
  headers: {
    'Content-Type': 'application/json',
  },
})

export default api

