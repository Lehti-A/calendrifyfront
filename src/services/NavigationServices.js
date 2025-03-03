import router from "@/router";

export default {

    navigateToCalendarView() {
        router.push({name: 'calendarRoute'})
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


    navigateToErrorView() {
        // todo: lõpus võib sisse panna
        // router.push({name: 'errorRoute'})
    },

}