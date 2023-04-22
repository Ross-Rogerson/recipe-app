import { useEffect, useState } from 'react'
import axios from 'axios'
import { getToken, removeToken, userTokenFunction, isAuthenticated, getUserID } from '../../helpers/auth'
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom'

const Profile = () => {
  const [error, setError] = useState('')
  const [profileData, setProfileData] = useState(null)

  const { userId } = useParams()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    console.log(getUserID()) &
    !isAuthenticated() && navigate('/login')
  }, [navigate])

  // Get profile data on mount
  useEffect(() => {
    const getProfile = async () => {
      try {
        const { data } = await axios.create(userTokenFunction()).get(`/api/profile/${getUserID()}`)
        setProfileData(data)
        console.log(data)
        
      } catch (err) {
        console.log(err)
        setError(err.message)
      }
    }
    getProfile()
  }, [])

  // Logout
  const handleLogOut = () => {
    (location.pathname === '/admin' || location.pathname === `/profile/${userId}/`) ?
      navigate('/recipes/')
      :
      navigate(location)
    removeToken()
  }

  return (
    <main>
      {profileData &&
        <>
          <h1>Profile Page</h1>
          {
            (profileData.is_staff || profileData.is_superuser) ?
              <Link to={'admin/'}>
                <button id='admin-button'>Admin</button>
              </Link>
              :
              ''
          }
          <button onClick={handleLogOut}>Logout</button>
        </>

      }
    </main >
  )
}

export default Profile
