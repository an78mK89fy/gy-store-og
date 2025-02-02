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
    },
    orders: {
        save: formData => instance.post('/orders/save', formData),
        delete: id => instance.delete(`/orders/del/${id}`),
        state: orders => instance.put('/orders/state', { orders }),
        list: filters => instance.get('/orders/list', { params: filters }),
        search: form => instance.get(`/orders/search/${form.key}/${form.value}`)
    }
}