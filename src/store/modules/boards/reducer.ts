import {Action, Dispatch} from "redux";
import { ThunkAction } from "redux-thunk";
import { IBoard } from "../../../common/interfaces/IBoard";
import { createBoard } from "./actions";

const initialState = {
    boards: [] as IBoard[],
};

export default function reducer(state = initialState, action: {type: string, payload?: any}) {
    switch (action.type) {
        case 'UPDATE_BOARDS':
            console.log("UPDATE_BOARDS", action.payload);            
                   
            return {
              ...state,
              boards: action.payload
            }  
         
        case 'CREATE_BOARD':
                console.log("CREATE_BOARD", action.payload);      
                
                createBoard(action.payload)
                       
                return {
                  ...state,
                                   
                }    

        default: {
            return {...state, ...action.payload};
        }
    }
}

// export const thunkExample = (boardTitle: string): ThunkAction<Promise<void>, IBoard, unknown, Action> => {
//     return async (dispatch) => {
//         await dispatch()
//     }
// }