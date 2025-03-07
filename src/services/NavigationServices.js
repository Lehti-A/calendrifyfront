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
    navigateToPersonalDayView() {
        router.push({name: 'personalDayRoute'})
    },
    navigateToWorkDayView() {
        router.push({name: 'workDayRoute'})
    },
    navigateToSettingsView() {
        router.push({name: 'settingsRoute'})
    },


    navigateToErrorView() {
        // todo: lõpus võib sisse panna
        // router.push({name: 'errorRoute'})
    },


}