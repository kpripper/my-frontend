import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import BoardHome from './components/BoardHome/BoardHome'
import 'simplebar-react/dist/simplebar.min.css'
import './home.scss'
import '../../index.css'
import { connect, useSelector } from 'react-redux'
import { getBoards } from '../../store/modules/boards/actions'
import AddBoard from './components/AddBoard/AddBoard'
import { RootState } from '../../store/store'
import SimpleSnackbar from '../SimpleSnackBar/SimpleSnackbar'
import { ProgressBar } from '../ProgressBar/ProgressBar'
import { propsHomeType, stateType } from '../../common/types'

const Home = (props: propsHomeType) => {

  const selectLoadingState = useSelector((state: RootState) => state.loading)
  const selectError = useSelector((state: RootState) => state.error)

  const { boards } = props

  const { current: currentBoards } = useRef(boards)

  useEffect(() => {
    props.getBoards()
  }, [currentBoards])

  return (
    <>
      <div>
        <div className="header-container">
          <Link to="/">Home</Link>
        </div>
        <div className="boards-header">
          <div className="boards-header-item">
            <span className="icon-boards"></span>
            <span className="your-boards">Your boards</span>
          </div>
        </div>
        <div className="all-boards">
          {props.boards.map(({ id, title }) => (
            <BoardHome key={id} id={id} title={title} />
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
    </>
  )
}

const mapStateToProps = (state: stateType) => ({
  ...state.boards,
})

export default connect(mapStateToProps, { getBoards })(Home)
