const initialState = {
  isError: false,
  errorText: '',
}

export default function reducer(
  state = initialState,
  action: { type: string; payload: string },
) {
  switch (action.type) {
    case 'AXIOS_ERROR':
      return {
        ...state,
        isError: true,
        errorText: action.payload,
      }

    case 'CLEAR_ERROR':
      return {
        ...state,
        isError: false,
      }

    default: {
      return { ...state }
    }
  }
}
