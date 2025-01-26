import { router } from '../router/indexRouter.js'

function request(config) {
    return config
}

function response() {
    function resolve(res) {
        if (res.data.elMessage) { ElMessage(res.data.elMessage) }
        if (res.data?.state?.tokenLapse || res.data?.state?.logout) { // token失效
            sessionStorage.removeItem('userName')
            setTimeout(() => {
                router.push('/')
            }, res.data.state?.config?.timeout || 3000)
        } return Promise.resolve(res)
    }
    function reject(err) {
        ElMessage({ message: err, type: 'error' })
        return Promise.reject(err)
    }
    return [resolve, reject]
}

export const interceptors = {
    request, response
}