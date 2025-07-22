import axios from 'axios'
import router from '@/router'

axios.defaults.baseURL = import.meta.env.VITE_URI

axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*'
axios.defaults.headers.common['local'] = localStorage.getItem('appLang')

axios.interceptors.request.use((config) => {
  try {
    config.headers.Authorization = `Bearer ${JSON.parse(localStorage.getItem('token'))}`
  } catch (error) {
    config.headers.Authorization = `Bearer ${localStorage.getItem('token')}`
  }
  config.headers.Accept = 'application/json'
  config.headers["Content-Type"] = "application/json";
  return config
})
 /// mohamed clear token and go back log in page
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      router.push({ name: 'login' })
    }
    return Promise.reject(error)
  }
)

export default axios
