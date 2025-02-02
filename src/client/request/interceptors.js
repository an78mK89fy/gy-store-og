import { router } from '../router/router.js'

function request(config) {
    return config
}

function response() {
    function resolve(res) {
        // 带消息
        if (res.data.elMessage) { ElMessage({ ...res.data.elMessage, duration: res.data.route?.timeout }) }
        if (res.data.route) { // 带路由参数
            if (['tokenOut', 'logout'].includes(res.data.route.type)) { sessionStorage.removeItem('userName') }
            if (res.data.route.type === 'pswdOut') { localStorage.removeItem('formLogin') }
            setTimeout(() => router.push(res.data.route.path), res.data.route.timeout || 0);
        }
        return Promise.resolve(res)
    }
    function reject(err) {
        ElMessage({ message: err.message, type: 'error' })
        return Promise.reject(err)
    }
    return [resolve, reject]
}

export const interceptors = { request, response }