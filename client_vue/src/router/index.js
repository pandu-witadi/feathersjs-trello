import Vue from 'vue'
import VueRouter from 'vue-router'


import store from '../store'

Vue.use(VueRouter)


function isLoggedIn(to, from, next) {
    store.dispatch('auth/authenticate').then( () => {
        next()
    }).catch( () => {
        next('/login')
    })
}

const routes = [
    {
        path: '/',
        name: 'home',
        component: () => import('../views/Home.vue'),
        beforeEnter(to, from, next) {
            store.dispatch('auth/authenticate').then( () => {
                next('/boards')
            }).catch( () => {
                next('/login')
            })
        }
    },
    {
        path: '/signup',
        name: 'signup',
        component: () => import('../views/SignUp.vue'),
    },
    {
        path: '/login',
        name: 'login',
        component: () => import('../views/Login.vue'),
    },
    {
        path: '/boards',
        name: 'boards',
        component: () => import('../views/Boards.vue'),
        beforeEnter: isLoggedIn
    },
    {
        path: '/boards/:id',
        name: 'board',
        component: () => import('../views/Board.vue'),
        beforeEnter: isLoggedIn
    }
]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})

export default router
