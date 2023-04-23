import { useLocation, useNavigate, Link } from 'react-router-dom'
import { getUserID, isAuthenticated, removeToken } from '../../helpers/auth'
import { useState, useEffect, useRef } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass, faSliders, faBars } from '@fortawesome/free-solid-svg-icons'

const Navbar = () => {

  const location = useLocation()
  const navigate = useNavigate()

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
                  <Link to={'/'}>Recipe-App</Link>
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
              </>
        }
      </nav>
    </header >
  )

}

export default Navbar