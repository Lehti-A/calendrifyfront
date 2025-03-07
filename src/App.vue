<template>
  <div :class="backgroundClass">

    <nav v-if="isLoggedIn" class="main-navigation">
      <div class="container text-center">
        <div class="row justify-content-center mt-2 gx-4">

          <div class="col-auto">
            <button type="button" class="btn soft-purple-btn nav-btn"
                    :class="{ 'active-nav-btn': isActiveRoute('workDayRoute') }"
                    @click="navigateToWorkDay">Work day</button>
          </div>

          <div class="col-auto">
            <button type="button" class="btn soft-purple-btn nav-btn"
                    :class="{ 'active-nav-btn': isActiveRoute('personalDayRoute') }"
                    @click="navigateToPersonalDay">Personal day</button>
          </div>

          <div class="col-auto">
            <button type="button" class="btn soft-purple-btn nav-btn"
                    :class="{ 'active-nav-btn': isActiveRoute('calendarRoute') }"
                    @click="navigateToCalendar">Calendar</button>
          </div>

          <div class="col-auto">
            <button type="button" class="btn soft-purple-btn nav-btn"
                    :class="{ 'active-nav-btn': isActiveRoute('settingsRoute') }"
                    @click="navigateToSettings">Settings</button>
          </div>

          <div class="col-auto">
            <button type="button" class="btn soft-purple-btn nav-btn"
                    :class="{ 'active-nav-btn': false }"
                    @click="openLogoutModal">Log out</button>
          </div>

        </div>
      </div>

    </nav>
    <router-view @event-update-nav-menu="updateNavMenuAndBackground"/>
  </div>
</template>

<script>
import NavigationServices from "@/services/NavigationServices";

export default {
  data() {
    return {
      backgroundClass: 'background-container-1',
      modalIsOpen: false,
      isLoggedIn: true,
      isAdmin: false,
      //  todo: DEVELOPMENT ONLY: Set this to true to bypass login checks
      devMode: true,
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
  methods:{
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
      // TODO: Implement logout modal opening logic
      // For now, we'll just use the direct logout
      this.logout();
    },
    // todo: vaheta see kood alumise vastu välja kui login võimekus backendist olemas
    updateNavMenuAndBackground() {
      // Check for login status
      let userId = sessionStorage.getItem('userId')

      // If in development mode, consider the user logged in
      if (this.devMode) {
        // Uncomment the next line to force logged-in state in development
        // this.isLoggedIn = true;

        // Or you can leave it using sessionStorage for testing both states
        this.isLoggedIn = userId !== null;
      } else {
        // Normal login check
        this.isLoggedIn = userId !== null;
      }

      let roleName = sessionStorage.getItem('roleName')
      this.isAdmin = roleName != null && 'admin' === roleName

      // Check current route to determine the background
      const currentRoute = this.$route.path;

      // Define which routes require authentication
      const protectedRoutes = ['/day-personal', '/day-work', '/calendar', '/settings'];
      const isProtectedRoute = protectedRoutes.some(route => currentRoute.includes(route));

      // DEVELOPMENT MODE: For testing specific routes with specific backgrounds
      if (this.devMode) {
        // For PersonalDayView testing, uncomment this to force background-container-2
        if (isProtectedRoute) {
          this.backgroundClass = 'background-container-2';
          return;
        }
      }
      // Normal background selection logic
      if (isProtectedRoute || this.isLoggedIn) {
        this.backgroundClass = 'background-container-2';
      } else {
        this.backgroundClass = 'background-container-1';
      }
    },
    // updateNavMenuAndBackground() {
    //   let userId = sessionStorage.getItem('userId')
    //   this.isLoggedIn = userId !== null
    //   let roleName = sessionStorage.getItem('roleName')
    //   this.isAdmin = roleName != null && 'admin' === roleName
    //
    //   // Check current route to determine the background
    //   const currentRoute = this.$route.path;
    //
    //   // Define which routes require authentication
    //   const protectedRoutes = ['/personal-day', '/work-day', '/calendar', '/settings'];
    //   const isProtectedRoute = protectedRoutes.some(route => currentRoute.includes(route));
    //
    //   // Set background based on route and login status
    //   if (isProtectedRoute || this.isLoggedIn) {
    //     this.backgroundClass = 'background-container-2';
    //   } else {
    //     this.backgroundClass = 'background-container-1';
    //   }
    },

    logout() {
      // Clear session storage
      sessionStorage.removeItem('userId');
      sessionStorage.removeItem('roleName');

      // Update status and background using the existing method
      this.updateNavMenuAndBackground();

      // Navigate to home
      this.$router.push('/');
    }

}

</script>

<style>
/* Import Quicksand font */
@import url('https://fonts.googleapis.com/css2?family=Quicksand:wght@400;500;600;700&display=swap');

.main-navigation {
  position: absolute;
  width: 100%;
  top: 80px; /* Adjust this value to position the nav bar lower */
  z-index: 10; /* Ensure it stays above other content */
}

/* Base button styles - transparent background */
.soft-purple-btn {
  color: #333333; /* Dark text initially */
  background-color: transparent !important; /* Start with transparent background */
  border: 1px solid rgba(142, 68, 173, 0.7); /* Purple border */
  transition: all 0.3s ease;
}

/* Apply Quicksand font and text styles */
.nav-btn {
  font-family: 'Quicksand', sans-serif !important; /* Quicksand font */
  font-size: 1.25rem !important; /* Larger text */
  font-weight: 700 !important; /* Bold text */
  padding: 8px 20px; /* More padding for larger buttons */
  letter-spacing: 0.5px; /* Add a bit more spacing between letters */
}

/* Hover state */
.soft-purple-btn:hover {
  color: #ffffff; /* White text on hover */
  background-color: rgba(142, 68, 173, 0.3) !important; /* Slightly visible on hover */
  border-color: rgba(142, 68, 173, 0.8);
}

/* Active/Focus state */
.soft-purple-btn:active,
.soft-purple-btn:focus {
  background-color: rgba(142, 68, 173, 0.5) !important; /* More visible when active */
  border-color: rgba(142, 68, 173, 0.9);
  box-shadow: 0 0 0 0.25rem rgba(142, 68, 173, 0.4); /* Purple shadow for focus */
}

/* Active route button - solid background */
.active-nav-btn {
  background-color: rgba(142, 68, 173, 0.9) !important; /* Solid purple for active state */
  border-color: #8e44ad !important;
  color: #ffffff !important; /* Ensure text stays white */
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2) !important; /* Add shadow for depth */
}
</style>