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
      <div id="water-tracker">
        <h5 class="mb-3 text-center">Glasses of Water</h5>
        <div class="water-icons">
          <div
              v-for="(glass, index) in 8"
              :key="index"
              class="water-glass"
              @click="setGlasses(index + 1)"
              title="Glass of Water">
            <div class="glass-container">
              <div class="water-fill" :style="{ height: index < selectedGlasses ? '90%' : '0%' }"></div>
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
          <div id="mood-icons">
    <span
        class="mood-icon"
        :class="{ 'active-sad': selectedMood === 'sad' }"
        @click="setMood('sad')"
        title="Sad">😢</span>

            <span
                class="mood-icon"
                :class="{ 'active-neutral': selectedMood === 'neutral' }"
                @click="setMood('neutral')"
                title="Neutral">😐</span>

            <span
                class="mood-icon"
                :class="{ 'active-happy': selectedMood === 'happy' }"
                @click="setMood('happy')"
                title="Happy">😊</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
export default {
  name: 'personalDayView',
  data() {
    return {
      selectedMood: null, // Stores the selected mood
      selectedGlasses: 0,
    };
  },
  methods: {
    setMood(mood) {
      this.selectedMood = mood;
    },
    setGlasses(count) {
      this.selectedGlasses = count; // Updates the selection
    }
  }
};
</script>


<style scoped>
.mood-icon {
  font-size: 2rem;
  cursor: pointer;
  transition: color 0.3s ease;
  filter: grayscale(100%);
  color: #adb5bd !important; /* Default gray */
}
/* Active colors for each mood */
.active-sad {
  filter: grayscale(0%);
  color: #ff4d4d !important; /* Red */
}
.active-neutral {
  filter: grayscale(0%);
  color: #ffc107 !important; /* Yellow */
}
.active-happy {
  filter: grayscale(0%);
  color: #28a745 !important; /* Green */
}
.water-icons {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
}

.water-glass {
  cursor: pointer;
}

.glass-container {
  width: 24px;
  height: 32px;
  border: 2px solid #4a5568; /* Darker, thicker border */
  border-radius: 0 0 8px 8px;
  position: relative;
  overflow: hidden;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1); /* Subtle shadow */
  background-color: #f8f9fa; /* Very light background */
}

.water-fill {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  background-color: #007bff;
  transition: height 0.3s ease;
}
</style>