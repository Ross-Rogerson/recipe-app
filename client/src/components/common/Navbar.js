import { useLocation, useNavigate, Link } from 'react-router-dom'
import { authenticated, getUserID, isAuthenticated, removeToken } from '../../helpers/auth'
import { useState, useEffect, useRef } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass, faSliders, faBars } from '@fortawesome/free-solid-svg-icons'

const Navbar = () => {

  const location = useLocation()
  const navigate = useNavigate()

  const handleLogOut = () => {
    (location.pathname === '/admin' || location.pathname === '/profile/')
      ? navigate('/login/')
      : navigate(location)
    removeToken()
  }

  return (
    <header>
      <nav>
        <div id="logo">
          <Link to={'/recipes/'}>Recipe-App</Link>
        </div>
        <div id="nav-search">

          {
            location.pathname === '/recipes/' ?
              <>
                <button id="search-button">
                  <FontAwesomeIcon icon={faMagnifyingGlass} />
                </button>
                <button id="menu">
                  <FontAwesomeIcon icon={faSliders} />
                </button>
              </>
              :
              (location.pathname === '/admin/' || location.pathname === `/profile/${getUserID()}/`) ?
                <>
                  <button id="filters">
                    <FontAwesomeIcon icon={faBars} />
                  </button>
                </>
                :
                <>
                </>
          }
        </div>
      </nav>
    </header >
  )

}

export default Navbar