import { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'


const Register = () => {

  // ! Location variables
  const navigate = useNavigate()

  // ! State
  const [formFields, setFormFields] = useState({
    username: '',
    email: '',
    password: '',
    password_confirmation: '',
    profile_image: '',
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
      await axios.post('/api/auth/register/', formFields)
      navigate('/login/')
    } catch (err) {
      setError(err.response.data.message)
    }
  }

  return (
    <main className="form-page">
      <h1>Register</h1>
      <form className="auth-form" onSubmit={handleSubmit}>
        <label htmlFor="username">Username</label>
        <input type="text" name="username" placeholder='Username' onChange={handleChange} value={formFields.username} />
        <label htmlFor="email">Email</label>
        <input type="email" name="email" placeholder='Email' onChange={handleChange} value={formFields.email} />
        <label htmlFor="password">Password</label>
        <input type="password" name="password" placeholder='Password' onChange={handleChange} value={formFields.password} />
        <label htmlFor="password_confirmation">Password Confirmation</label>
        <input type="password" name="password_confirmation" placeholder='Password Confirmation' onChange={handleChange} value={formFields.password_confirmation} />
        <label htmlFor="profile_image">Profile Image</label>
        <input type="text" name="profile_image" placeholder='Profile Image URL' onChange={handleChange} value={formFields.profile_image} />
        <button id="submit-registration">Register</button>
        {error && <p >{error}</p>}
      </form>
    </main>
  )
}

export default Register