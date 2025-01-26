import axios from 'axios'
import { interceptors } from './interceptors.js'

const instance = axios.create({
    baseURL: location.origin + '/api',
    timeout: 3000,
})

instance.interceptors.response.use(...interceptors.response())

export const request = {
    user: {
        login: form => instance.post('/user/login', { form }),
        forget: () => ElMessageBox.alert('请联系管理员 获取临时密码，再登录后修改密码。'),
        // instance.get('/user/forget'),
        logout: () => instance.delete('/user/logout')
    },
    admin: {
        create: form => instance.post('/admin/create', { form }),
        delete: id => instance.delete(`/admin/del/${id}`),
        edit: form => instance.put('/admin/edit', { form }),
        list: (hidden = 0) => instance.get(`/admin/list/${hidden}`),
        forget: id => instance.put('/admin/forget', { id })
    },
    orders: {
        save: formData => instance.post('/orders/save', formData),
        delete: id => instance.delete(`/orders/del/${id}`),
        list: filters => instance.get('/orders/list', { params: filters }),
        state: id => instance.post('/orders/state', { id }),
        search: form => instance.get(`/orders/search/${form.key}/${form.value}`)
    }
}