import axios, { AxiosResponse } from 'axios';
import { api } from '../common/constants';

const instance = axios.create({
  baseURL: api.baseURL,
  headers: {
    'Content-Type': 'application/json',
    Authorization: 'Bearer 123', // к этому мы ещё вернёмся как-нибудь потом
  },
});


//BUG тут interceptors повертає res.data незрозумілого типу

instance.interceptors.response.use((res: AxiosResponse) => res.data);

export default instance;
