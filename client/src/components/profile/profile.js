import { useEffect, useState } from 'react'
import axios from 'axios'
import { getToken, removeToken } from '../../helpers/auth'
import { useParams, Link, useNavigate } from 'react-router-dom'

const Profile = () => {
  const [error, setError] = useState('')
  const [profileData, setProfileData] = useState(null)

  const { userId } = useParams()
  const navigate = useNavigate()

  // Get profile data on mount
  useEffect(() => {
    const getProfile = async () => {
      try {
        const { data } = await axios.create({
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        })
          .get(`/api/profile/${userId}`)
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
            (profileData.is_staff || profileData.is_superuser) ? <button id='admin-button'>Admin</button> : ''
          }
          <button onClick={handleLogOut}>Logout</button>
        </>

      }
    </main >
  )
}

export default Profile
