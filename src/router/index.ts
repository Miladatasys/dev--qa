import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import CreateUserView from '@/views/CreateUserView.vue'
import LoginView from '@/views/LoginView.vue'
import { isAuthenticated } from '@/composables/useAuth'

const routes = [
    {
        path: '/',
        name: 'Login',
        component: LoginView
    },
    {
        path: '/home',
        name: 'Home',
        component: HomeView
    },
    {
        path: '/new',
        name: 'CreateUser',
        component: CreateUserView
    },
    {
        path: '/edit/:id',
        name: 'EditUser',
        component: () => import ('@/views/EditUserView.vue')
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

router.beforeEach((to, from, next) => {
    if (to.meta.requiresAuth && !isAuthenticated()) {
        next({ path: '/' })
    } else {
        next()
    }
})

export default router