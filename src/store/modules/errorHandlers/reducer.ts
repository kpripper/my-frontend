const initialState = {
  isError: false,
  errorText: '',
}

export default function reducer(
  state = initialState,
  action: { type: string; payload: string },
) {
  switch (action.type) {
    case 'AXIOS_ERROR': {
      //на випадок отримання в пейлоаді значення, яке неможливо серіалізувати
      let serializedPayload
      try {
        serializedPayload = JSON.stringify(action.payload)
      } catch (error) {    
        serializedPayload = String(action.payload)
      }

      return {
        ...state,
        isError: true,
        errorText: serializedPayload,
      }
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
