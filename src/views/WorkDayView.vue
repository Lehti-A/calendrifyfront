<template>
  <div class="container-fluid px-4 pb-4 work-day-container">
    <div class="row mb-5 align-items-center header-row">
      <div class="col text-center">
        <h1 class="mb-1 fw-bold simple-header">
          WORK DAY PLANNER
        </h1>
      </div>
    </div>

    <!-- Content will be added later -->
    <div class="row justify-content-center">
      <div class="col-md-8 text-center">
        <p class="text-white">Work day planner content will be implemented soon.</p>
      </div>
    </div>
  </div>











</template>


<script>
export default {
  name: "WorkDayView",
  created() {
    // DEVELOPMENT MODE: Set a temporary user ID for testing
    sessionStorage.setItem('userId', 'temp-dev-user');

    // Emit the event to update nav menu and background
    this.$emit('event-update-nav-menu');
  }

}
</script>
<style scoped>
.work-day-container {
  padding-top: 170px; /* Match PersonalDayView top padding */
}

.header-row {
  position: relative;
  margin-bottom: 2rem !important;
}

.simple-header {
  color: #ffffff; /* White text */
  font-weight: 700; /* Bold */
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.3); /* Subtle shadow for legibility */
}
</style>


