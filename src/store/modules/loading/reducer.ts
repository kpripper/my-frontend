const initialState = {
  loading: false,
}

export default function reducer(
  state = initialState,
  action: { type: string; payload: boolean }
) {
  console.log('loadReducer', action.type);
  
  switch (action.type) {
    case 'LOADING':
      console.log('REDUCER LOADING', action.payload)

      return {
        ...state,
        loading: action.payload,
      }

    default: {
      return { ...state }
    }
  }
}
