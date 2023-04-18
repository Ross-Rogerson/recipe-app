import { useLocation, useNavigate, Link } from 'react-router-dom'
import { authenticated, getUserID, isAuthenticated, removeToken } from '../../helpers/auth'
import { useState, useEffect, useRef } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faListCheck } from '@fortawesome/free-solid-svg-icons'
import { faCircleUser } from '@fortawesome/free-regular-svg-icons'
import fridge from '../../images/fridge.png'
import add from '../../images/add.png'
import list from '../../images/list.png'
import home from '../../images/home.png'


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
    <footer>
      <nav>

        <div id="home">
          <Link to={'/recipes/'}>
            <img src={home} alt="listIcon" />
          </Link>
        </div>

        <div id="list">
          <Link to={'/'}>
            <img src={list} alt="listIcon" />
          </Link>
        </div>

        {/* <div id="list">
          <Link to={'/'}>
            <FontAwesomeIcon icon={faListCheck} />
          </Link>
        </div> */}

        <div id="add">
          <Link to={'/'}>
            <img src={add} alt="addIcon" />
          </Link>
        </div>

        <div id="fridge">
          <Link to={'/'}>
            <img src={fridge} alt="fridgeIcon" />
          </Link>
        </div>

        <div id="profile">
          <Link to={isAuthenticated() ? `/profile/${getUserID()}/` : '/login/'}>
            <FontAwesomeIcon icon={faCircleUser} />
          </Link>
        </div>

      </nav>
    </footer >
  )

}

export default Navbar