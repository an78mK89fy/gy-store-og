import { createRouter, createWebHashHistory } from 'vue-router'

import Login from '../views/Login.vue'
import Admin from '../views/Admin.vue'
import Main from '../views/Main.vue'
import Id from '../views/Id.vue'

const router = createRouter({
    history: createWebHashHistory(),
    routes: [
        { path: '/', component: Login },
        {
            path: '/user', children: [
                { path: '/admin', component: Admin }
            ]
        },
        { path: '/main', component: Main },
        { path: '/id', component: Id },
    ]
})

export { router }