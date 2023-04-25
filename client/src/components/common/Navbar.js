import { useLocation, useNavigate, Link, useParams } from 'react-router-dom'
import { getUserID, isAuthenticated, removeToken } from '../../helpers/auth'
import { useState, useEffect, useRef } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass, faSliders, faBars } from '@fortawesome/free-solid-svg-icons'

const Navbar = () => {

  const location = useLocation()
  const navigate = useNavigate()


  const { userId } = useParams()

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