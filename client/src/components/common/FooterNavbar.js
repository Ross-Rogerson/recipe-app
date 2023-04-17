import { useLocation, useNavigate, Link } from 'react-router-dom'
import { authenticated, getUserID, isAuthenticated, removeToken } from '../../helpers/auth'
import { useState, useEffect, useRef } from 'react'


const Navbar = ({ openModal, openRegisterModal }) => {

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
        <ul>
          <div id="home">
            <Link to={'/'}></Link>
          </div>
          <div id="home">
            <Link to={'/'}></Link>
          </div>
          <div id="home">
            <Link to={'/'}></Link>
          </div>
          <div id="home">
            <Link to={'/'}></Link>
          </div>
          <div id="home">
            <Link to={'/'}></Link>
          </div>
        </ul>
      </nav>
    </footer >
  )

}

export default Navbar