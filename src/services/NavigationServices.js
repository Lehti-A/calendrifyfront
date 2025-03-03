import router from "@/router";

export default {

    navigateToCalendarView() {
        router.push({name: 'calendarRoute'})
    },

    navigateToAtmsView() {
        router.push({name: 'atmsRoute'})
    },

    navigateToLocationsView(locationId) {
        router.push({
            name: 'locationRoute',
            params: {
                locationId: locationId
            },
            query: {
                edit: true
            }
        })
    },

    navigateToRegisterView() {
        router.push({name: 'registerRoute'})
    },

    navigateToErrorView() {
        // todo: lõpus võib sisse panna
        // router.push({name: 'errorRoute'})
    },

}