<template>
  <div :class="backgroundClass">
    <LogoutModal :modal-is-open="logoutModalIsOpen"
                 @event-close-modal="closeLogoutModal"
                 @event-update-nav-menu="updateNavMenuAndBackground"
    />


    <nav v-if="isLoggedIn" class="main-navigation">
      <div class="container text-center">
        <div class="row justify-content-center mt-2 gx-4">

          <div class="col-auto">
            <button type="button" class="btn soft-purple-btn nav-btn"
                    :class="{ 'active-nav-btn': isActiveRoute('workDayRoute') }"
                    @click="navigateToWorkDay">Work day
            </button>
          </div>

          <div class="col-auto">
            <button type="button" class="btn soft-purple-btn nav-btn"
                    :class="{ 'active-nav-btn': isActiveRoute('personalDayRoute') }"
                    @click="navigateToPersonalDay">Personal day
            </button>
          </div>

          <div class="col-auto">
            <button type="button" class="btn soft-purple-btn nav-btn"
                    :class="{ 'active-nav-btn': isActiveRoute('calendarRoute') }"
                    @click="navigateToCalendar">Calendar
            </button>
          </div>

          <div class="col-auto">
            <button type="button" class="btn soft-purple-btn nav-btn"
                    :class="{ 'active-nav-btn': isActiveRoute('settingsRoute') }"
                    @click="navigateToSettings">Settings
            </button>
          </div>

          <div class="col-auto">
            <button type="button" class="btn soft-purple-btn nav-btn"
                    :class="{ 'active-nav-btn': false }"
                    @click="openLogoutModal">Log out
            </button>
          </div>

        </div>
      </div>

    </nav>
    <router-view @event-update-nav-menu="updateNavMenuAndBackground"/>
  </div>
</template>

<script>
import NavigationServices from "@/services/NavigationServices";
import LogoutModal from "@/components/modal/LogoutModal.vue";

export default {
  components: {LogoutModal},
  data() {
    return {
      backgroundClass: 'background-logged-out',
      logoutModalIsOpen: false, // Add this line for the logout modal
      modalIsOpen: false,
      isLoggedIn: true,
      isAdmin: false,
    }
  },

  created() {
    // Check login status when the component is created
    this.updateNavMenuAndBackground();

    // Set up watcher for route changes
    this.$watch(
        () => this.$route.path,
        () => {
          this.updateNavMenuAndBackground();
        }
    );
  },

  mounted() {
    // Also check status on mount
    this.updateNavMenuAndBackground();
  },

  methods: {
    navigateToWorkDay() {
      NavigationServices.navigateToWorkDayView();
    },

    navigateToPersonalDay() {
      NavigationServices.navigateToPersonalDayView();
    },

    navigateToCalendar() {
      NavigationServices.navigateToCalendarView();
    },

    navigateToSettings() {
      NavigationServices.navigateToSettingsView();
    },

    isActiveRoute(routeName) {
      return this.$route.name === routeName;
    },

    openLogoutModal() {
      this.logoutModalIsOpen = true;
    },

    closeLogoutModal() {
      this.logoutModalIsOpen = false;
    },

    updateNavMenuAndBackground() {
      let userId = sessionStorage.getItem('userId')
      this.isLoggedIn = userId !== null
      let roleName = sessionStorage.getItem('roleName')
      this.isAdmin = roleName != null && 'admin' === roleName

      // Set background based on route and login status
      if (this.isLoggedIn) {
        this.backgroundClass = 'background-logged-in';
      } else {
        this.backgroundClass = 'background-logged-out';
      }
    },
  }
}

</script>

<style  src="@/assets/css/appvue.css"></style>