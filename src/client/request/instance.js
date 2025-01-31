import axios from 'axios'
import { interceptors } from './interceptors.js'

const instance = axios.create({
    baseURL: location.origin + '/api',
    timeout: 3000,
})

instance.interceptors.response.use(...interceptors.response())

export { instance }