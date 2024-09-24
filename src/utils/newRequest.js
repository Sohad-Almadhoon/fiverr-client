import axios from 'axios'

const newRequest = axios.create({
  baseURL: 'https://fiverr-api-1.onrender.com/api/',
  withCredentials: true,
})

export default newRequest
