const initialState = {
  isAuthentificated: false,
}

export default function reducer(
  state = initialState,
  action: { type: string },
) {
  switch (action.type) {
    case 'AUTHENTIFICATE':
      return {
        ...state,
        isAuthentificated: true,
      }

    case 'SIGNOUT':
      return {
        ...state,
        isAuthentificated: false,
      }

    default: {
      return state
    }
  }
}
