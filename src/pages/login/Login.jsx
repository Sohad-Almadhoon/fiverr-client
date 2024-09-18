import React, { useState } from 'react'
import './Login.scss'
import { useNavigate } from 'react-router-dom'
import newRequest from '../../utils/newRequest'
function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)

  const navigate = useNavigate()

  const handleSubmit = async e => {
    e.preventDefault()
    try {
      const res = await newRequest.post(
        '/auth/login',
        {
          username,
          password,
        },
        { withCredentials: true }
      )
      localStorage.setItem('currentUser', JSON.stringify(res.data))
      navigate('/')
    } catch (error) {
      setError(error?.response?.data || 'Something went wrong!')
      console.log(error.response.data)
    }
  }

  return (
    <div className="login">
      <form onSubmit={handleSubmit}>
        <h1>Sign in</h1>
        <label htmlFor="">Username</label>
        <input
          name="username"
          type="text"
          placeholder="johndoe"
          onChange={e => setUsername(e.target.value)}
        />

        <label htmlFor="">Password</label>
        <input name="password" type="password" onChange={e => setPassword(e.target.value)} />
        <button type="submit">Login</button>
        {error && error}
      </form>
    </div>
  )
}

export default Login
