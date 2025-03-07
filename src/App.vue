<template>
  <div :class="backgroundClass">

    <nav v-if="isLoggedIn" class="main-navigation">
      <div class="container text-center">
        <div class="row justify-content-center mt-2 gx-4">

          <div class="col-auto">
            <button type="button" class="btn soft-purple-btn">Work day</button>
          </div>

          <div class="col-auto">
            <button type="button" class="btn soft-purple-btn">Personal day</button>
          </div>

          <div class="col-auto">
            <button type="button" class="btn soft-purple-btn">Calendar</button>
          </div>

          <div class="col-auto">
            <button type="button" class="btn soft-purple-btn">Settings</button>
          </div>

          <div class="col-auto">
            <button type="button" class="btn soft-purple-btn">Log out</button>
          </div>

        </div>
      </div>

    </nav>
    <router-view @event-update-nav-menu="updateNavMenuAndBackground"/>
  </div>
</template>

<script>

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
      const protectedRoutes = ['/personal-day', '/work-day', '/calendar', '/settings'];
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
.main-navigation {
  position: absolute;
  width: 100%;
  top: 80px; /* Adjust this value to position the nav bar lower */
  z-index: 10; /* Ensure it stays above other content */
}


/* Soft, transparent purple buttons with white text */
.soft-purple-btn {
  color: #ffffff; /* White text */
  background-color: rgba(142, 68, 173, 0.7); /* Transparent purple */
  border-color: rgba(142, 68, 173, 0.5);
  transition: all 0.3s ease;
  /* Optional: add some subtle depth */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.soft-purple-btn:hover {
  color: #ffffff;
  background-color: rgba(142, 68, 173, 0.85); /* More opaque on hover */
  border-color: rgba(142, 68, 173, 0.8);
}

.soft-purple-btn:active,
.soft-purple-btn:focus {
  color: #ffffff;
  background-color: rgba(142, 68, 173, 0.9); /* Even more opaque when active */
  border-color: rgba(142, 68, 173, 0.9);
  box-shadow: 0 0 0 0.25rem rgba(142, 68, 173, 0.4); /* Purple shadow for focus */
}
</style>