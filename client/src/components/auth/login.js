import { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'


const Login = () => {

  // ! Location variables
  const navigate = useNavigate()

  // ! State
  const [formFields, setFormFields] = useState({
    email: '',
    password: '',
  })
  const [error, setError] = useState('')

  // ! Executions
  const handleChange = (e) => {
    setFormFields({ ...formFields, [e.target.name]: e.target.value })
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const { data } = await axios.post('/api/auth/login/', formFields)
      localStorage.setItem('RECIPE-TOKEN', data.token)
      navigate('/profile')
    } catch (err) {
      console.log('error', err)
      setError(err.response.data.message)
    }
  }

  return (
    <main className="form-page">
      <form onSubmit={handleSubmit}>
        <h1>Login</h1>
        {/* Email */}
        <label htmlFor="email">Email</label>
        <input type="email" name="email" placeholder='Email' onChange={handleChange} value={formFields.email} />
        {/* Password */}
        <label htmlFor="password">Password</label>
        <input type="password" name="password" placeholder='Password' onChange={handleChange} value={formFields.password} />
        {/* Submit */}
        <button>Login</button>
        {/* Error */}
        {error && <p >{error}</p>}
      </form>
    </main>
  )
}

export default Login