export const handleAxiosError = (error: string) => {
  return { type: 'AXIOS_ERROR', payload: error }
}

export const clearError = () => {
  console.log("clearError");  
  return { type: 'CLEAR_ERROR'}
}
