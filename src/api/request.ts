import axios, { AxiosResponse } from 'axios'
import { api } from '../common/constants'
import { toggleLoading } from '../store/modules/loading/actions'
import store from '../store/store'
import { handleAxiosError } from '../store/modules/errorHandlers/actions'

console.log('api.baseURL', api.baseURL);

const instance = axios.create({
  baseURL: api.baseURL,
  headers: {
    'Content-Type': 'application/json',
    Authorization: 'Bearer 123', 
  },
})

instance.interceptors.request.use(
  function (config) {
    store.dispatch(toggleLoading(true))
    return config
  },
  function (error) {
    return Promise.reject(error)
  }
)

//instance.interceptors.response.use((res: AxiosResponse) => res.data);

instance.interceptors.response.use(
  function (res: AxiosResponse) {
    store.dispatch(toggleLoading(false))
    return res.data
  },
  function (error) {
    store.dispatch(toggleLoading(false))
    //саме в error.response.data.error знаходиться стрінг помилки
    store.dispatch(handleAxiosError(error.response.data.error))
    console.log(
      'store.dispatch(handleAxiosError(error))',
      error.response.data.error
    )
    // setErrorMessage(error.response.data.error);
    // setOpen(true);
    return Promise.reject(error)
  }
)

export default instance
