import { Dispatch } from 'redux'
import { handleAxiosError } from '../errorHandlers/actions'

//Діспатчі потрібні щоб мінявся стейт, інакше після логіна юзер далі бачить форму логіна

export const authentificate =
  (isAuthentificated: boolean) => async (dispatch: Dispatch) => {
    try {
      localStorage.setItem('isAuthentificated', 'true')
      dispatch({ type: 'AUTHENTIFICATE', payload: isAuthentificated })
    } catch (e) {
      handleAxiosError(e, 'getBoard')
    }
  }

export const signOut = () => async (dispatch: Dispatch) => {
  try {
    localStorage.setItem('isAuthentificated', 'false')
    dispatch({ type: 'SIGNOUT' })
  } catch (e) {
    handleAxiosError(e, 'getBoard')
  }
}
