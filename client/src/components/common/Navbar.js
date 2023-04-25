import { useLocation, useNavigate, Link } from 'react-router-dom'
import { isAuthenticated, removeToken } from '../../helpers/auth'

const Navbar = () => {

  const location = useLocation()
  const navigate = useNavigate()

  // Logout
  const handleLogOut = () => {
    navigate('/') &
      removeToken()
  }

  return (
    <header>
      <nav>
        {
          location.pathname === '/shopping/' ?
            <>
              <h1 id="shopping-list-title">Your shopping list</h1>
            </>
            :
            location.pathname === '/fridge/' ?
              <>
                <h1 id="fridge-title">What&#39;s in the fridge?</h1>
              </>
              :
              <>
                <div id="logo">
                  <Link to={'/'}>Foodstagram</Link>
                </div>
                <div id="nav-search">
                  {
                    isAuthenticated() ?
                      <>
                        <button id="logout" onClick={handleLogOut}>Logout</button>
                      </>
                      :
                      <>
                        <button id="login">
                          <Link to={'/login/'}>Login</Link>
                        </button>
                      </>
                  }
                </div>
              </>
        }
      </nav>
    </header >
  )

}

export default Navbar