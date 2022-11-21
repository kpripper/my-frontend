const initialState = {};

export default function reducer(state = initialState, action: {type: string, payload?: any}) {
    switch (action.type) {
         case 'UPDATE_BOARD':
            console.log("UPDATE_BOARD", action.payload);    
                              
            return {
              ...state,
              boards: action.payload
            } 

        default: {
            return {...state, ...action.payload};
        }
    }
}
