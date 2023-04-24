import { useLocation, useNavigate, Link } from 'react-router-dom'
import { getUserID, isAuthenticated, removeToken } from '../../helpers/auth'
import { useState, useEffect, useRef } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faListCheck } from '@fortawesome/free-solid-svg-icons'
import { faCircleUser } from '@fortawesome/free-regular-svg-icons'
import fridge from '../../images/fridge.png'
import add from '../../images/add.png'
import list from '../../images/list.png'
import home from '../../images/home.png'


const Navbar = () => {

  return (
    <footer>
      <nav>

        <div id="home">
          <Link to={'/'}>
            <img src={home} alt="listIcon" />
          </Link>
        </div>

        <div id="list">
          <Link to={'/shopping/'}>
            <img src={list} alt="listIcon" />
          </Link>
        </div>

        {/* <div id="list">
          <Link to={'/'}>
            <FontAwesomeIcon icon={faListCheck} />
          </Link>
        </div> */}

        <div id="add">
          <Link to={'/recipes/add/'}>
            <img src={add} alt="addIcon" />
          </Link>
        </div>

        <div id="fridge">
          <Link to={'/fridge/'}>
            <img src={fridge} alt="fridgeIcon" />
          </Link>
        </div>

        <div id="profile">
          <Link to={`/profile/${getUserID()}/`}>
            <FontAwesomeIcon icon={faCircleUser} />
          </Link>
        </div>

      </nav>
    </footer >
  )

}

export default Navbar