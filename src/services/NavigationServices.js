import router from "@/router";

export default {

    navigateToCalendarView() {
        router.push({name: 'calendarRoute'})
    },
    navigateToRegisterView() {
        router.push({name: 'registerRoute'})
    },
    navigateToHomeView() {
        router.push({name: 'homeRoute'})
    },





    navigateToErrorView() {
        // todo: lõpus võib sisse panna
        // router.push({name: 'errorRoute'})
    },

}