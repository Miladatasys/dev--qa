import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import CreateUserView from '@/views/CreateUserView.vue'
import EditUserView from '@/views/EditUserView.vue'
import LoginView from '@/views/LoginView.vue'

export const testRouter = createRouter({
    history: createWebHistory(),
    routes: [
    { path: '/', component: LoginView },
    { path: '/home', component: HomeView },
    { path: '/new', component: CreateUserView },
    { path: '/edit/:id', component: EditUserView },
    ],
})
