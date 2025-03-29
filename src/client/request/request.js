import { instance } from "./instance.js"

export const request = {
    user: {
        login: form => instance.post('/user/login', { form }),
        logout: () => instance.delete('/user/logout'),
        forget: () => ElMessageBox.alert(
            '请联系管理员 获取临时密码，再登录后修改密码。<br><hr>*邮箱找回功能后续更新二期更新。',
            { dangerouslyUseHTMLString: true }
        ),
        password: form => instance.put('/user/password', { form })
    },
    admin: {
        save: form => instance.post('/admin/save', { form }),
        delete: id => instance.delete(`/admin/del/${id}`),
        forget: id => instance.put('/admin/forget', { id }),
        reback: form => instance.put('/admin/reback', { form }),
        list: (hidden = 0) => instance.get(`/admin/list/${hidden}`),
        logout: () => instance.delete('/admin/logout')
    },
    orders: {
        save: formData => instance.post('/orders/save', formData),
        delete: id => instance.delete(`/orders/del`, { params: { id } }),
        list: filters => instance.get('/orders/list', { params: filters }),
        id: id => instance.get('/orders/id', { params: { id } }),
        state: {
            print: id => instance.put('/orders/state/print', { id }),
            receive: state => instance.put('/orders/state/receive', { state }),
            over: id => instance.put('/orders/state/over', { id }),
            back: id => instance.put('/orders/state/back', { id })
        },
        todo: {
            save: form => instance.post('/orders/todo/save', { form }),
            state: state => instance.put('/orders/todo/state', { state }),
            progress: id => instance.get('/orders/todo/progress', { params: { id } }),
            delete: id => instance.delete('/orders/todo/delete', { params: { id } }),
            commit: {
                save: data => instance.post('/orders/todo/commit/save', data),
                delete: id => instance.delete('/orders/todo/commit/delete', { params: { id } })
            },
        },
    },
    client: {
        query: pyfl => instance.get('/client/query', { params: { pyfl } }),
        has: name => instance.get('/client/has', { params: { name } }),
        add: client => instance.post('/client/add', { client })
    },
}