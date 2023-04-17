import { useEffect } from 'react'
import axios from 'axios'

const Home = () => {
  useEffect(() => {
    const getData = async () => {
      const { data } = await axios.get('/api/recipes/') // * <-- replace with your endpoint
      console.log(data)
    }
    getData()
  })

  return (
    <main>
      <h1>Hello World</h1>
    </main>
  )
}

export default Home