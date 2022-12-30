const initialState = {
  isError: false,
  errorText: '',
}

export default function reducer(
  state = initialState,
  action: { type: string; payload: string }
) {
  switch (action.type) {
    case 'AXIOS_ERROR':
      console.log('AXIOS_ERROR', action.payload)

      return {
        ...state,
        isError: true,
        errorText: action.payload,
      }

    default: {
      return { ...state }
    }
  }
}
