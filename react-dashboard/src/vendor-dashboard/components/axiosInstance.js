import axios from 'axios'

const instance = axios.create({
    baseURL: import.meta.env.VITE_API_URL
})

instance.interceptors.response.use(
    (res) => res,
    (err) => {
        if (err.response.status === 401) {
            localStorage.clear()
            window.location.href = "/login"
        }
        return Promise.reject(err)
    }
)

export default instance