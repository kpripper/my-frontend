import { useEffect } from 'react'
import BoardHome from './components/BoardHome/BoardHome'
import 'simplebar-react/dist/simplebar.min.css'
import './home.scss'
import '../../index.css'
import { useSelector } from 'react-redux'
import { getBoards } from '../../store/modules/boards/actions'
import AddBoard from './components/AddBoard/AddBoard'
import store, { RootState } from '../../store/store'
import SimpleSnackbar from '../SimpleSnackBar/SimpleSnackbar'
import { ProgressBar } from '../ProgressBar/ProgressBar'
import { Link, useNavigate } from 'react-router-dom'
import { signOut } from '../../store/modules/user/actions'

const Home = () => {
  const selectBoards = useSelector((state: RootState) => state.boards)
  const selectError = useSelector((state: RootState) => state.error)
  const selectLoadingState = useSelector((state: RootState) => state.loading)

  async function fetchData() {
    store.dispatch(getBoards())
  }

  useEffect(() => {
    fetchData()
  }, [])

  const navigate = useNavigate()

  return (
    <div>
      <div className="header-container">
        <p>Home</p>
        <Link
          className="sign-out"
          to="/login"
          onClick={() => {
            store.dispatch(signOut())
            navigate('/login')
          }}
        >
          Sign out
        </Link>
      </div>
      <div className="boards-header">
        <div className="boards-header-item">
          <span className="icon-boards"></span>
          <span className="your-boards">Your boards</span>
        </div>
      </div>
      <div className="all-boards">
        {selectBoards.map(({ id, title }: { id: number; title: string }) => (
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
  )
}

export default Home
