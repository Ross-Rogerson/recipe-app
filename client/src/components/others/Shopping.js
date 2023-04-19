import { useEffect, useState } from 'react'
import axios from 'axios'
import { getToken, removeToken } from '../../helpers/auth'
import { useParams, Link, useNavigate } from 'react-router-dom'

const Shopping = () => {
  const [error, setError] = useState('')
  const [ recipe, setRecipe ] = useState()

  const { recipeId } = useParams()
  const navigate = useNavigate()

  // Get profile data on mount
  useEffect(() => {
    const getData = async () => {
      try {
        // const { data } = await axios.get('/api/recipes/add/')
        // console.log(data)
        // setRecipe(data)
      } catch (err) {
        console.log('error', err)
        setError(err.response.data.message)
      }
    }
    getData()
  }, [])

  return (
    <main>
      {
        <>
          <h1>Shopping Page</h1>
        </>
      }
    </main >
  )
}

export default Shopping
