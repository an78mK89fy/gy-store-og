import axios from 'axios'
// import { router } from '../router/indexRouter.js'

const instance = axios.create({
    baseURL: location.origin + '/api',
    timeout: 3000,
})

export const request = {
    user: { login: form => instance.post('/user/login', { form }) },
    orders: {
        save: formData => instance.post('/orders/save', formData),
        delete: id => instance.delete(`/orders/del/${id}`),
        list: filters => instance.get('/orders/list', { params: filters }),
        state: id => instance.post('/orders/state', { id })
    }
}