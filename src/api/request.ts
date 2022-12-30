import axios, { AxiosResponse } from 'axios';
import { api } from '../common/constants';
import { toggleLoading } from '../store/modules/loading/actions';
import { Dispatch } from 'redux';
import { useDispatch } from 'react-redux';
import store from '../store/store';
import { handleAxiosError } from '../store/modules/handlers/actions';



const instance = axios.create({
  baseURL: api.baseURL,
  headers: {
    'Content-Type': 'application/json',
    Authorization: 'Bearer 123', // к этому мы ещё вернёмся как-нибудь потом
  },
});

instance.interceptors.request.use(function (config) {
//  // Invalid hook call. Hooks can only be called inside of the body of a function component. 
//   const dispatch = useDispatch()
  store.dispatch(toggleLoading(true));
  console.log("toggleLoading(true)")
  return config;
}, function (error) {

  // Do something with request error
  return Promise.reject(error);
});

//NOTE тут interceptors повертає res.data незрозумілого типу (якщо без AxiosResponse)

//instance.interceptors.response.use((res: AxiosResponse) => res.data);


instance.interceptors.response.use(function (res: AxiosResponse) {
  // Any status code that lie within the range of 2xx cause this function to trigger
  // Do something with response data
  store.dispatch(toggleLoading(false));
  console.log("toggleLoading(false)")
  return res.data
}, function (error) {
  store.dispatch(toggleLoading(false));
  //саме тут знаходиться стрінг помилки
  store.dispatch(handleAxiosError(error.response.data.error));
  console.log("store.dispatch(handleAxiosError(error))", error.response.data.error)
  // Any status codes that falls outside the range of 2xx cause this function to trigger
  // Do something with response error
  return Promise.reject(error);
});


export default instance;
