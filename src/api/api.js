import axios from 'axios'
const api = axios.create({
    baseURL: 'https://tractor-backend-xk1t.onrender.com/api'
})
export default api