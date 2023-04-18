import { useEffect, useState } from 'react'
import axios from 'axios'
import { getToken, removeToken } from '../../helpers/auth'
import { useParams, Link, useNavigate } from 'react-router-dom'

const Profile = () => {
  const [error, setError] = useState('')
  const [adminData, setAdminData] = useState(null)

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
          .get(`/api/profile/${userId}/admin`)
        setAdminData(data)
        console.log(data)
      } catch (err) {
        console.log(err)
        setError(err.message)
      }
    }
    getProfile()
  }, [])

  return (
    <main>
      {adminData &&
        <>
          <h1>Admin Page</h1>
        </>
      }
    </main >
  )
}

export default Profile
