import instance from '../../../api/request';
import config from '../../../common/constants/api';
import {AnyAction, Dispatch} from "redux";
import { BoardsServerResponse } from '../../../common/interfaces/BoardsServerResponse';
import api from '../../../api/request';
import { ThunkAction } from 'redux-thunk';



export const getBoards = () => async (dispatch: Dispatch) => {
    console.log("getBoards");
    try {
        
     
       //NOTE Katya               const boardsInGet  = await instance.get<{boards:[]}>("/board"); 
     
     //так тс свариться, але бачить поле boardsInGet.boards
     //  const {boardsInGet}  = await instance.get("/board"); 

       //так тс НЕ свариться, але НЕ бачить поле boardsInGet.boards
     //  const boardsInGet  = await instance.get("/board"); 

     //так працює з payload: boardsInGet.boards
     //const boardsInGet  = await instance.get("/board")  as { boards: IBoardArray };

     //NOTE https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#type-assertions
     
    const boardsInGet: BoardsServerResponse  = await instance.get("/board");   
          
        dispatch({ type: 'UPDATE_BOARDS', payload: boardsInGet.boards });
    } catch (e) {
        console.log(e)
        dispatch({type: 'ERROR_ACTION_TYPE'});
    }
}

//export const createBoard = (titleName: string): ThunkActionType => async (dispatch): Promise<void> => {

export const createBoard = async (boardTitle: string) =>  {
    console.log("boardTitle", boardTitle);  
    console.log("config.boards", config.boards);  

      try {   
        console.log("try createBoard");
        const awResp: {result:string, id: number} = await api.post(config.boards, { title: boardTitle });
        if (awResp.result === 'Created') {getBoards()}
      } catch (e) {
          console.log("e createBoard", e);
      }    
}

export const deleteBoard = async (boardId: string) =>  {
console.log("deleteBoard ");

    try {   
      console.log("deleteBoard ", config.boards+boardId);
      
      await api.delete(config.boards+boardId);
    } catch (e) {
      console.log("e  deleteBoard ", e);
    }    
}


