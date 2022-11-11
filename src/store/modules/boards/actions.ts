//BUG - абсолютний чи відносний шлях
//import api from '../../../api';
import instance from '../../../api/request';
import config from '../../../common/constants/api';
import {Dispatch} from "redux";

export const getBoards = () => async (dispatch: Dispatch) => {
    console.log("getBoards");
    try {

        
        //BUG TS2339: Property 'boards' does not exist on type 'AxiosResponse<any, any>'
        const boardsInGet  = await instance.get("/board"); 
        
        
        // {
        //     "boards": [
        //         {
        //             "id": 1668032236310,
        //             "title": "todos",
        //             "custom": {
        //                 "description": "desc"
        //             }
        //         },
        //         {
        //             "id": 1668068755851,
        //             "title": "Level 2.6 - CRUD",
        //             "custom": {
        //                 "description": "Make a board creation..."
        //             }
        //         }
        //     ]
        // }
        //console.log(boards);
          
        await dispatch({type: 'UPDATE_BOARDS', payload: boardsInGet});
    } catch (e) {
        console.log(e)
        dispatch({type: 'ERROR_ACTION_TYPE'});
    }
}
