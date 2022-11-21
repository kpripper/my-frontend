import {Action, Dispatch} from "redux";
import { ThunkAction } from "redux-thunk";
import { IBoard } from "../../../common/interfaces/IBoard";
import { createBoard } from "./actions";

// const initialState = {
//     boards: [
//         {id: 1, title: "buy"},
//         {id: 2, title: "wedding"},
//         {id: 3, title: "shop"},
//         {id: 4, title: "social"}
//       ]
// };

const initialState = {
  boards: [],
  modalIsOpen: false
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

        case 'MODAL_IS_OPEN': 

            console.log("MODAL_IS_OPEN", action.payload);  

            return {
            ...state,
            modalIsOpen: action.payload             
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