import { createRouter, createWebHashHistory, createMemoryHistory } from 'vue-router'

import Login from '../views/Login.vue'
import Main from '../views/Main.vue'
import Admin from '../views/Admin.vue'

import { isState } from '../utils/isState.js'

const router = createRouter({
    history: isState.local ? createWebHashHistory() : createMemoryHistory(),
    routes: [
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