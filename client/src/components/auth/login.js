import { useState } from 'react'
import axios from 'axios'
import { useNavigate, Link } from 'react-router-dom'


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
      navigate(`/profile/${data.id}/`)
    } catch (err) {
      setError(err.response.data.message)
    }
  }

  return (
    <main className="form-page">
      <h1>Login</h1>
      <form className="auth-form" onSubmit={handleSubmit}>
        {/* Email */}
        <label htmlFor="email">Email</label>
        <input type="email" name="email" placeholder='Email' onChange={handleChange} value={formFields.email} />
        {/* Password */}
        <label htmlFor="password">Password</label>
        <input type="password" name="password" placeholder='Password' onChange={handleChange} value={formFields.password} />
        {/* Submit */}
        <div id="auth-buttons">
          <button>Login</button>
          <span>or</span>
          <Link to={'/register/'} id="register">
              Register
          </Link>
        </div>
        {/* Error */}
        {error && <p >{error}</p>}
      </form>

    </main>
  )
}

export default Login