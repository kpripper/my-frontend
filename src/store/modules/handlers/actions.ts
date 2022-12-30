export const handleAxiosError = (error: string) => {
  return { type: 'AXIOS_ERROR', payload: error }
}
