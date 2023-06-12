import axios, { AxiosResponse } from 'axios'
import { api } from '../common/constants'
import { toggleLoading } from '../store/modules/loading/actions'
import store from '../store/store'
import { handleAxiosError } from '../store/modules/errorHandlers/actions'
import { authentificate } from '../store/modules/user/actions'

const instance = axios.create({
  baseURL: api.baseURL,
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${localStorage.getItem('token')}`,
  },
})

export const instanceNotAuth = axios.create({
  baseURL: api.baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
})

instance.interceptors.request.use(
  function (config) {
    const token = localStorage.getItem('token')
    config.headers!.Authorization = `Bearer ${token}`
    store.dispatch(toggleLoading(true))
    return config
  },
  function (error) {
    return Promise.reject(error)
  },
)

instance.interceptors.response.use(
  function (res: AxiosResponse) {
    store.dispatch(toggleLoading(false))
    if (res.data.result === 'Authorized') store.dispatch(authentificate(true))
    return res.data
  },
  async function (error: any) {
    store.dispatch(toggleLoading(false))
    //якщо токен застарів (помилка 401) - оновлюємо токен і повторюємо запит
    if (error.response && error.response.status === 401) {
      const refresh: any = await instance.post('/refresh', {
        refreshToken: `${localStorage.getItem('refreshToken')}`,
      })
      localStorage.setItem('token', refresh.token)
      localStorage.setItem('refreshToken', refresh.refreshToken)
      store.dispatch(authentificate(true))
      try {
        const originalRequestConfig = error.config
        originalRequestConfig.headers[
          'Authorization'
        ] = `Bearer ${refresh.token}`
        // Повторна відправка оригінального запиту з оновленими авторизаційними даними
        const retryOriginalRequest = await instance(originalRequestConfig)
        return retryOriginalRequest.data
      } catch (refreshError) {
        console.error('Refresh token error:', refreshError)
      }
    } else {
      store.dispatch(handleAxiosError(error, 'toggleLoading'))
    }
    return Promise.reject(error)
  },
)

export default instance
