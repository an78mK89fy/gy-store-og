import { createRouter, createWebHashHistory, createMemoryHistory } from 'vue-router'

import Login from '../views/Login.vue'
import Main from '../views/Main.vue'
import Admin from '../views/Admin.vue'

const history = (location.hostname === 'localhost' || location.hostname === '127.0.0.1')
    ? createWebHashHistory()
    : createMemoryHistory()

const router = createRouter({
    history, routes: [
        { path: '/', component: Login },
        {
            path: '/user', children: [
                { path: '/admin', component: Admin }
            ]
        },
        { path: '/main', component: Main },
    ]
})

export { router }