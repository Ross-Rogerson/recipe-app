import { useLocation, useNavigate, Link } from 'react-router-dom'
import { authenticated, getUserID, isAuthenticated, removeToken } from '../../helpers/auth'
import { useState, useEffect, useRef } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass, faSliders } from '@fortawesome/free-solid-svg-icons'

const Navbar = () => {

  const location = useLocation()
  const navigate = useNavigate()

  const handleLogOut = () => {
    (location.pathname === '/admin' || location.pathname === `/profile/${getUserID()}`) ? navigate('/') : navigate(location)
    console.log(getUserID())
    console.log(location === `/profile/${getUserID()}`)
    console.log(location)
    removeToken()
  }

  return (
    <header>
      <nav>
        <div id="logo">
          <Link to={'/'}>Recipe-App</Link>
        </div>
        <div id="nav-search">
          <button id="search-button">
            <FontAwesomeIcon icon={faMagnifyingGlass} />
          </button>
          <button id="filters">
            <FontAwesomeIcon icon={faSliders} />
          </button>
        </div>
      </nav>
    </header >
  )

}

export default Navbar