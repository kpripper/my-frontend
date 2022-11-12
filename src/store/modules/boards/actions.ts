//BUG - абсолютний чи відносний шлях
//import api from '../../../api';
import instance from '../../../api/request';
import config from '../../../common/constants/api';
import {Dispatch} from "redux";
import {IBoardArray} from '../../../common/interfaces/IBoardArray';
import { BoardsServerResponse } from '../../../common/interfaces/BoardsServerResponse';



export const getBoards = () => async (dispatch: Dispatch) => {
    console.log("getBoards");
    try {

        
        //BUG TS2339: Property 'boards' does not exist on type 'AxiosResponse<any, any>'
       //NOTE Katya               const boardsInGet  = await instance.get<{boards:[]}>("/board"); 
     
     //так тс свариться, але бачить поле boardsInGet.boards
     //  const {boardsInGet}  = await instance.get("/board"); 

       //так тс НЕ свариться, але НЕ бачить поле boardsInGet.boards
     //  const boardsInGet  = await instance.get("/board"); 

     //так працює з payload: boardsInGet.boards
     //const boardsInGet  = await instance.get("/board")  as { boards: IBoardArray };

     //NOTE https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#type-assertions
     
    const boardsInGet: BoardsServerResponse  = await instance.get("/board");

   //BUG  Property 'boards' does not exist on type 'AxiosResponse<{ boards: []; }, any>'.
  // const boardsInGet  = await instance.get <{ boards: [] }>("/board");
        
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
        console.log(boardsInGet);
          
        await dispatch({type: 'UPDATE_BOARDS', payload: boardsInGet.boards});
    } catch (e) {
        console.log(e)
        dispatch({type: 'ERROR_ACTION_TYPE'});
    }
}
