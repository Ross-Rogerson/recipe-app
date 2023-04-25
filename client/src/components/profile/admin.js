import { useEffect, useState } from 'react'
import axios from 'axios'
import { userTokenFunction } from '../../helpers/auth'
import { useParams } from 'react-router-dom'

const Admin = () => {
  const [error, setError] = useState('')
  const [adminData, setAdminData] = useState(null)

  const { userId } = useParams()

  // Get profile data on mount
  useEffect(() => {
    const getProfile = async () => {
      try {
        const { data } = await axios.create(userTokenFunction()).get(`/api/profile/${userId}/admin`)
        setAdminData(data)
      } catch (err) {
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

export default Admin
