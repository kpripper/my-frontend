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
import { BoardArray, BoardType } from '../../common/types'
import { BoardsServerResponse } from '../../common/interfaces/BoardsServerResponse'
import instance from '../../api/request'

const Home = () => {
  const [boards, setBoards] = useState<BoardType[]>([])

  const selectBoards = useSelector((state: RootState) => state.boards) 
  const selectError = useSelector((state: RootState) => state.error)
  const selectLoadingState = useSelector((state: RootState) => state.loading)

  console.log('selectBoards', selectBoards)

  async function fetchData() {
    const { boards: boardsAPI }: BoardsServerResponse = await instance.get(
      '/board'
    )
    console.log('boardsAPI', boardsAPI)
    store.dispatch(getBoards())
    setBoards(boardsAPI)
  }

  useEffect(() => {
    console.log('useEffect', selectBoards)
    fetchData()
    console.log('selectBoards use', selectBoards)
    // setBoards(selectBoards)
  }, [])

  // console.log('selectBoards', selectBoards)
  // console.log('selectBoards.boards', selectBoards.boards)
  //console.log("selectBoards arr", Array.from(selectBoards));
  // console.log('boards', boards)

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
        {/* Property 'boards' does not exist on type 'BoardType[]' */}

        {selectBoards.map(({ id, title } : {id:string, title:string} ) => (
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
