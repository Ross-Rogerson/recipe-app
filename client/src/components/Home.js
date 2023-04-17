import { useEffect } from 'react'
import axios from 'axios'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart } from '@fortawesome/free-solid-svg-icons'

const Home = () => {
  useEffect(() => {
    const getData = async () => {
      const { data } = await axios.get('/api/recipes/') // * <-- replace with your endpoint
      console.log(data)
    }
    getData()
  })

  // !Liked styling below
  // <FontAwesomeIcon icon={faHeart} style={{color: "#ff4763",}} />
  return (
    <main>
      <h1>Hello World</h1>
    </main>
  )
}

export default Home