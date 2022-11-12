import { IBoard } from "../../../common/interfaces/IBoard";

const initialState = {
    boards: [] as IBoard[],
};

export default function reducer(state = initialState, action: {type: string, payload?: any}) {
    switch (action.type) {
        case 'UPDATE_BOARDS':
            console.log("action.payload");            
            console.log(action.payload);
            
            return {
              ...state,
              boards: action.payload
            }        
        default: {
            return {...state, ...action.payload};
        }
    }
}
