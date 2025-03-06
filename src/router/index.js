import {createRouter, createWebHistory} from 'vue-router'
import HomeView from '../views/HomeView.vue'
import CalendarView from "@/views/CalendarView.vue";
import RegisterView from "@/views/RegisterView.vue";
import SettingsView from "@/views/SettingsView.vue";
import PersonalDayView from "@/views/PersonalDayView.vue";

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
    {
        path: '/settings',
        name: 'settingsRoute',
        component: SettingsView
    },
    {
        path: '/day-personal',
        name: 'personalDayRoute',
        component: PersonalDayView
    }, {
        path: '/day-work',
        name: 'workDayRoute',
        component: PersonalDayView
    },

]

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes,
})
export default router
