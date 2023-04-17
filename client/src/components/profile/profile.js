import { useEffect, useState } from 'react'
import axios from 'axios'
import { getToken } from '../../helpers/auth'

const Profile = () => {
  const [error, setError] = useState('')
  const [profileData, setProfileData] = useState(null)

  useEffect(() => {
    const getProfile = async () => {
      try {
        const { data } = await axios.create({
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        })
          .get('/api/profile/')
        setProfileData(data)
        console.log(data)
      } catch (err) {
        console.log(err)
        setError(err.message)
      }
    }
    getProfile()
  }, [])

  return (
    <main></main>
  )
}

export default Profile
