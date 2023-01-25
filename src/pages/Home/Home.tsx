import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import BoardHome from './components/BoardHome/BoardHome'
import 'simplebar-react/dist/simplebar.min.css'
import './home.scss'
import '../../index.css'
import { connect, shallowEqual, useSelector } from 'react-redux'
import { getBoards } from '../../store/modules/boards/actions'
import AddBoard from './components/AddBoard/AddBoard'
import store, { RootState } from '../../store/store'
import SimpleSnackbar from '../SimpleSnackBar/SimpleSnackbar'
import { ProgressBar } from '../ProgressBar/ProgressBar'
import { propsHomeType, stateType } from '../../common/types'
import { useDispatch } from 'react-redux'
import { BoardType } from '../../common/types'
import { BoardsServerResponse } from '../../common/interfaces/BoardsServerResponse'
import instance from '../../api/request'

const Home = () => {
  const [boards, setBoards] = useState<BoardType[]>([])

  const selectBoards = useSelector ((state: RootState) => state.boards)
  const selectError = useSelector((state: RootState) => state.error)
  const selectLoadingState = useSelector((state: RootState) => state.loading)

  async function fetchData() {
   const { boards: boardsAPI }: BoardsServerResponse = await instance.get(
      '/board'
    )   
    console.log("boardsAPI", boardsAPI);      
    setBoards(boardsAPI)
  }

  useEffect(() => {
    console.log("useEffect", selectBoards);
    fetchData()
    console.log("selectBoards", selectBoards);
   // setBoards(selectBoards)

  }, [])

  console.log('boards', boards)

  // const { current: currentBoards } = useRef(boards)

  return (

      <div>
        <div className="header-container">
          <p>Home</p>
        </div>
        <div className="boards-header">
          <div className="boards-header-item">
            <span className="icon-boards"></span>
            <span className="your-boards">Your boards</span>
          </div>
        </div>
        <div className="all-boards">         
            {boards.map(({ id, title }) => (
              <BoardHome key={id} id={+id} title={title} />
            ))}
            <AddBoard />         
        </div>
        {selectError.isError ? (
          <SimpleSnackbar text={selectError.errorText}></SimpleSnackbar>
        ) : (
          ''
        )}
        {selectLoadingState.loading && <ProgressBar />}
      </div>
  
  )
}

// const mapStateToProps = (state: stateType) => ({
//   ...state.boards,
// })

// export default connect(mapStateToProps, { getBoards })(Home)

export default Home
