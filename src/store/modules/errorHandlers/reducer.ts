const initialState = {
  isError: false,
  errorText: '',
}

export default function reducer(
  state = initialState,
  action: { type: string; payload: string }
) {

  console.log('errReducer', action.type );
  
  switch (action.type) {
    case 'AXIOS_ERROR':
      console.log('AXIOS_ERROR', action.payload)

      return {
        ...state,
        isError: true,
        errorText: action.payload,
      }

    case 'CLEAR_ERROR':
      console.log('CLEAR_ERROR')

      return {
        ...state,
        isError: false,
      }

    default: {
      return { ...state }
    }
  }
}
