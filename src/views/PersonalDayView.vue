<template>
  <div class="container mt-4">
    <div class="row mb-4">
      <div class="col text-center">
        <h1 class="mb-3">Personal Day</h1>
      </div>
    </div>
    <!-- Calendar and Focus for Today Section -->
    <div class="row mb-4">

      <div class="col-md-2">
        <div class="card mb-3">
          <div class="card-body text-center">
            <h2>26 Feb</h2>
          </div>
        </div>
      </div>

      <!-- Focus for Today -->
      <div class="col-md-7">
        <div class="card mb-3">
          <div class="card-header">Focus for Today</div>
          <div class="card-body">
            <p class="card-text">Activity: Buy theater tickets | Call the doctor | Do Bank Front | Listen to 1 podcast episode</p>
          </div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="card mb-3">

          </div>
      </div>
    </div>

    <!-- Personal Activities -->
    <div class="row">
      <div class="col-md-9">
        <div class="card mb-3">
          <div class="card-header">Personal Activities</div>
          <ul class="list-group list-group-flush">
            <li class="list-group-item">Read at least 15min</li>
            <li class="list-group-item">Sport session</li>
            <li class="list-group-item">Meditation session</li>
            <li class="list-group-item">Drank 8 glasses of water</li>
          </ul>
        </div>
      </div>
      <div class="col-md-3">
        <div class="card mb-3">
          <div class="card-header">Meetings</div>
          <ul class="list-group list-group-flush">
            <li class="list-group-item">8:00 - Team Sync Meeting</li>
            <li class="list-group-item">10:00 - Client Discussion</li>
            <li class="list-group-item">14:00 - Project Review</li>
            <li class="list-group-item">14:00 - Project Review</li>
            <li class="list-group-item">14:00 - Project Review</li>
          </ul>
        </div>
      </div>
      <div class="row">
        <div class="col-md-9">
          <div class="card mb-3">
            <div class="card-header">Other Thoughts</div>
            <div class="card-body">
              <p class="text-muted">This is a placeholder for your other thoughts. You can add text here later.</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Tasks -->
      <div class="row">
        <!-- Tasks Section -->
        <div class="col-md-6">
          <div class="card mb-3">
            <div class="card-header">Tasks</div>
            <ul class="list-group list-group-flush">
              <li class="list-group-item d-flex align-items-center justify-content-between">
                <span>Play tennis</span>
                <input type="checkbox" class="form-check-input">
              </li>
              <li class="list-group-item d-flex align-items-center justify-content-between">
                <span>Uurida, et kuidas me linnukeste asjaga süsteemi update-ime</span>
                <input type="checkbox" class="form-check-input">
              </li>
            </ul>
          </div>
        </div>

        <!-- Mood Section -->
        <div class="col-md-3 text-center">
          <h5 class="mb-3">Mood today?</h5>
          <div style="display: flex; justify-content: center; gap: 0.5rem;">
            <!-- Sad Icon (Red) -->
            <span style="font-size: 2rem; color: #ff4d4d; cursor: pointer;" title="Sad">😢</span>
            <!-- Neutral Icon (Default Color) -->
            <span style="font-size: 2rem; color: #495057; cursor: pointer;" title="Neutral">😐</span>
            <!-- Happy Icon (Green) -->
            <span style="font-size: 2rem; color: #28a745; cursor: pointer;" title="Happy">😊</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'personalDayView'
}





</script>


<style>





</style>