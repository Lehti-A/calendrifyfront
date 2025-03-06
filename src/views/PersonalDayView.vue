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
        <div class="col-md-6">
          <div class="card mb-3 transparent-card">
            <div class="card-header bg-transparent border-bottom">Tasks</div>
            <ul class="list-group list-group-flush transparent-list">
              <li v-for="(task, index) in tasks" :key="index" class="list-group-item transparent-item d-flex align-items-center justify-content-between">
                <span :class="{ 'completed-task': task.completed }">{{ task.text }}</span>
                <div class="task-actions">
                  <input
                      type="checkbox"
                      class="form-check-input me-2"
                      :checked="task.completed"
                      @change="toggleTaskCompletion(index)"
                  >
                  <button
                      class="btn btn-sm btn-link text-danger p-0"
                      @click="removeTask(index)"
                      title="Remove task"
                  >
                    <i class="fas fa-eraser"></i>
                    <!-- If Font Awesome is not available, use text instead -->
                    <span v-if="!hasFontAwesome">🗑️</span>
                  </button>
                </div>
              </li>
              <!-- Add new task input -->
              <li class="list-group-item transparent-item">
                <div class="input-group">
                  <input
                      type="text"
                      class="form-control form-control-sm transparent-input"
                      placeholder="Add new task..."
                      v-model="newTask"
                      @keyup.enter="addTask"
                  >
                  <button class="btn btn-outline-secondary btn-sm" type="button" @click="addTask">Add</button>
                </div>
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
      <div id="steps-tracker">
        <h5 class="mb-4 text-center text-lg">Steps</h5>
        <div class="steps-milestones">
          <div
              v-for="(milestone, index) in milestones"
              :key="index"
              class="milestone-item"
              @click="setStepsMilestone(index + 1)"
              :title="`${milestone.steps} Steps`">
            <div class="checkbox-container" :class="{ 'checked': index < completedStepsMilestone }">
              <!-- Standard checkmark that only appears when checked -->
              <svg v-if="index < completedStepsMilestone" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" class="checkmark-icon">
                <path fill-rule="evenodd" d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 011.04-.208z" clip-rule="evenodd" />
              </svg>
            </div>
            <div class="milestone-label">{{ milestone.label }}</div>
          </div>
        </div>
        <div class="milestone-status">
          <span v-if="completedStepsMilestone > 0">
      <span v-if="completedStepsMilestone === 4">Over 10,000 steps</span>
      <span v-else>At least {{ milestones[completedStepsMilestone-1].steps }} steps</span>
    </span>
          <span v-else>No steps recorded</span>
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
      completedStepsMilestone: 0,
      milestones: [
        { steps: 2500, label: "2,500" },
        { steps: 5000, label: "5,000" },
        { steps: 7500, label: "7,500" },
        { steps: 10000, label: "10,000+" }
      ],
      tasks: [
        { text: "Play tennis", completed: false },
        { text: "Uurida, et kuidas me linnukeste asjaga süsteemi update-ime", completed: false }
      ],
      newTask: "",
      hasFontAwesome: false // Set to true if you have Font Awesome included
    };
  },
  methods: {
    setMood(mood) {
      this.selectedMood = mood;
    },
    setGlasses(count) {
      this.selectedGlasses = count; // Updates the selection
    },
    setStepsMilestone(milestone) {
      this.completedStepsMilestone = milestone;
    },
    toggleTaskCompletion(index) {
      this.tasks[index].completed = !this.tasks[index].completed;
    },
    removeTask(index) {
      this.tasks.splice(index, 1);
    },
    addTask() {
      if (this.newTask.trim()) {
        this.tasks.push({
          text: this.newTask.trim(),
          completed: false
        });
        this.newTask = "";
      }
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
.steps-milestones {
  display: flex;
  justify-content: center;
  gap: 1rem;
}

.milestone-item {
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.checkbox-container {
  width: 48px;
  height: 48px;
  border: 2px solid #4a5568;
  border-radius: 0.375rem;
  background-color: #f8f9fa;
  display: flex;
  align-items: center;
  justify-content: center;
}

.checkbox-container.checked {
  background-color: #48bb78;
  border-color: #38a169;
}

.checkmark-icon {
  width: 32px;
  height: 32px;
}

.milestone-label {
  font-size: 0.875rem;
  margin-top: 0.5rem;
  font-weight: 500;
}

.milestone-status {
  margin-top: 0.75rem;
  text-align: center;
  font-size: 1rem;
  color: #4a5568;
}
.transparent-card {
  background-color: rgba(255, 255, 255, 0.4);
  backdrop-filter: blur(5px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.transparent-list {
  background-color: transparent;
}

.transparent-item {
  background-color: transparent;
  border-color: rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
}

.transparent-input {
  background-color: rgba(255, 255, 255, 0.7);
  border: 1px solid rgba(0, 0, 0, 0.1);
}

.completed-task {
  text-decoration: line-through;
  color: #6c757d;
}

.task-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}
</style>