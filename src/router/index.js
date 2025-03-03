import {createRouter, createWebHistory} from 'vue-router'
import HomeView from '../views/HomeView.vue'
import CalendarView from "@/views/CalendarView.vue";
import RegisterView from "@/views/RegisterView.vue";

const routes = [
    {
        path: '/',
        name: 'homeRoute',
        component: HomeView
    },
    {
        path: '/calendar',
        name: 'calendarRoute',
        component: CalendarView
    },
    {
        path: '/register',
        name: 'registerRoute',
        component: RegisterView
    },

]

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes,
})
export default router
