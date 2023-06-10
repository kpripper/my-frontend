const initialState = {
  loading: false,
}

export default function reducer(
  state = initialState,
  action: { type: string; payload: boolean },
) {
  switch (action.type) {
    case 'LOADING':
      return {
        ...state,
        loading: action.payload,
      }
    default: {
      return { ...state }
    }
  }
}
