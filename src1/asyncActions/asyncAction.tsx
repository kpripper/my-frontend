import { Dispatch } from "redux"

export const thunkDispatch = () => {

    console.log("thunkDispatch");
    return (dispatch: (arg0: { type: string; payload: string; }) => void) => {
        try { 
            console.log("dispatch thunkDispatch");
            dispatch({ type: 'CREATE_BOARD', payload: "thunkDispatch"});            
          } catch (e) {
            dispatch({ type: 'ADD_BOARDS_ERROR', payload: 'ADD_BOARDS_ERROR' });
            console.log("e", e);
          }
    }
}