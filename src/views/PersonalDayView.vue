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
        <div class="card mb-3 calendar-card">
          <div class="card-body text-center p-0">
            <div class="calendar-month">
              {{ currentMonth }}
            </div>
            <div class="calendar-day">
              {{ currentDay }}
            </div>
            <div class="calendar-weekday">
              {{ currentWeekday }}
            </div>
          </div>
        </div>
      </div>
      <!-- Focus for Today -->
      <div class="col-md-7">
        <div class="card mb-3">
          <div class="card-header">Focus for Today</div>
          <div class="card-body">
            <div v-if="!editingFocus" class="d-flex justify-content-between align-items-start">
              <p class="card-text" @click="startEditingFocus">
                {{ dailyFocus || "Click here to set your focus for today..." }}
              </p>
              <button
                  class="btn btn-sm btn-outline-secondary ms-2"
                  @click="startEditingFocus"
                  title="Edit focus"
              >
                <i class="fas fa-edit"></i>
                <span v-if="!hasFontAwesome">✏️</span>
              </button>
            </div>
            <div v-else class="focus-edit-container">
        <textarea
            class="form-control focus-textarea"
            v-model="dailyFocus"
            placeholder="What's your main focus for today?"
            ref="focusTextarea"
        ></textarea>
              <div class="d-flex justify-content-end mt-2">
                <button class="btn btn-primary btn-sm me-2" @click="saveFocus">Save</button>
                <button class="btn btn-outline-secondary btn-sm" @click="cancelEditFocus">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="card mb-3 image-card">
          <img src="../assets/book.png" height="4096" width="4096"/>
        </div>
      </div>
    </div>

    <!-- Personal Activities -->
    <div class="row">
      <div class="col-md-9">
        <div class="card mb-3">
          <div class="card-header">Personal Activities</div>
          <ul class="list-group list-group-flush">
            <li v-for="(activity, index) in activities" :key="index" class="list-group-item d-flex align-items-center justify-content-between">
              <span :class="{ 'completed-activity': activity.completed }">{{ activity.text }}</span>
              <div class="activity-actions">
                <input
                    type="checkbox"
                    class="form-check-input me-2"
                    :checked="activity.completed"
                    @change="toggleActivityCompletion(index)"
                >
                <button
                    class="btn btn-sm btn-link text-danger p-0"
                    @click="removeActivity(index)"
                    title="Remove activity"
                >
                  <i class="fas fa-eraser"></i>
                  <!-- If Font Awesome is not available, use text instead -->
                  <span v-if="!hasFontAwesome">🗑️</span>
                </button>
              </div>
            </li>
            <!-- Add new activity input -->
            <li class="list-group-item">
              <div class="input-group">
                <input
                    type="text"
                    class="form-control form-control-sm"
                    placeholder="Add new activity..."
                    v-model="newActivity"
                    @keyup.enter="addActivity"
                >
                <button class="btn btn-outline-secondary btn-sm" type="button" @click="addActivity">Add</button>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div class="col-md-3">
        <div class="card mb-3">
          <div class="card-header">Meetings</div>
          <ul class="list-group list-group-flush">
            <li v-for="(meeting, index) in meetings" :key="index" class="list-group-item d-flex align-items-center justify-content-between">
              <span>{{ meeting.time }} - {{ meeting.title }}</span>
              <button
                  class="btn btn-sm btn-link text-danger p-0"
                  @click="removeMeeting(index)"
                  title="Remove meeting"
              >
                <i class="fas fa-times"></i>
                <span v-if="!hasFontAwesome">❌</span>
              </button>
            </li>
            <!-- Add new meeting input -->
            <li class="list-group-item p-2">
              <div class="mb-2">
                <input
                    type="text"
                    class="form-control form-control-sm"
                    placeholder="Time (e.g. 14:00)"
                    v-model="newMeetingTime"
                >
              </div>
              <div class="mb-2">
                <input
                    type="text"
                    class="form-control form-control-sm"
                    placeholder="Meeting title"
                    v-model="newMeetingTitle"
                    @keyup.enter="addMeeting"
                >
              </div>
              <button
                  class="btn btn-sm btn-primary w-100"
                  @click="addMeeting"
                  :disabled="!newMeetingTime || !newMeetingTitle"
              >
                Add Meeting
              </button>
            </li>
          </ul>
        </div>
      </div>
      <div class="row">
      <div class="col-md-9">
        <div class="card mb-3">
          <div class="card-header">Other Thoughts</div>
          <div class="card-body">
            <div v-if="!editingThoughts" @click="startEditingThoughts">
              <p v-if="otherThoughts" class="thoughts-content">{{ otherThoughts }}</p>
              <p v-else class="text-muted thoughts-placeholder">Click here to add your thoughts...</p>
            </div>
            <div v-else>
          <textarea
              class="form-control thoughts-textarea"
              v-model="otherThoughts"
              placeholder="Enter your thoughts here..."
              ref="thoughtsTextarea"
          ></textarea>
              <div class="mt-2">
                <button class="btn btn-sm btn-primary" @click="saveThoughts">Save</button>
                <button class="btn btn-sm btn-outline-secondary ms-2" @click="cancelEditThoughts">Cancel</button>
                <button v-if="otherThoughts" class="btn btn-sm btn-outline-danger float-end" @click="clearThoughts">Clear</button>
              </div>
            </div>
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
  computed: {
    currentDay() {
      return new Date().getDate();
    },
    currentMonth() {
      const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
      ];
      return months[new Date().getMonth()];
    },
    currentWeekday() {
      const days = [
        'Sunday', 'Monday', 'Tuesday', 'Wednesday',
        'Thursday', 'Friday', 'Saturday'
      ];
      return days[new Date().getDay()];
    }
  },
  data() {
    return {
      // Add these for the focus section
      dailyFocus: "", // Initial value or empty string
      editingFocus: false,
      tempFocus: "",
      meetings: [
        { time: '8:00', title: 'Team Sync Meeting' },
        { time: '10:00', title: 'Client Discussion' },
        { time: '14:00', title: 'Project Review' }
      ],
      newMeetingTime: '',
      newMeetingTitle: '',

      otherThoughts: "",
      editingThoughts: false,
      tempThoughts: "",
      // Stores the selected mood
      selectedMood: null,
      selectedGlasses: 0,
      completedStepsMilestone: 0,
      milestones: [
        { steps: 2500, label: "2,500" },
        { steps: 5000, label: "5,000" },
        { steps: 7500, label: "7,500" },
        { steps: 10000, label: "10,000+" }
      ],
      activities: [
        { text: "Read at least 15min", completed: false },
        { text: "Sport session", completed: false },
        { text: "Meditation session", completed: false },
        { text: "Drank 8 glasses of water", completed: false }
      ],
      newActivity: "",
      tasks: [
        { text: "Play tennis", completed: false },
        { text: "Uurida, et kuidas me linnukeste asjaga süsteemi update-ime", completed: false }
      ],
      newTask: "",
      hasFontAwesome: false // Set to true if you have Font Awesome included
    };
  },
  methods: {
    // Start of focus
    startEditingFocus() {
      this.tempFocus = this.dailyFocus; // Save current value in case user cancels
      this.editingFocus = true;

      this.$nextTick(() => {
        this.$refs.focusTextarea.focus();
      });
    },
    saveFocus() {
      this.editingFocus = false;
      // Trim is optional - remove if you want to preserve exact spacing
      this.dailyFocus = this.dailyFocus.trim();

      // You could add code here to save to localStorage or a database
      localStorage.setItem('dailyFocus', this.dailyFocus);
    },
    cancelEditFocus() {
      this.dailyFocus = this.tempFocus; // Restore previous value
      this.editingFocus = false;
    },
    toggleActivityCompletion(index) {
      this.activities[index].completed = !this.activities[index].completed;
    },
    removeActivity(index) {
      this.activities.splice(index, 1);
    },
    addActivity() {
      if (this.newActivity.trim()) {
        this.activities.push({
          text: this.newActivity.trim(),
          completed: false
        });
        this.newActivity = "";
      }
    },
    addMeeting() {
      if (this.newMeetingTime.trim() && this.newMeetingTitle.trim()) {
        this.meetings.push({
          time: this.newMeetingTime.trim(),
          title: this.newMeetingTitle.trim()
        });

        // Clear the input fields
        this.newMeetingTime = '';
        this.newMeetingTitle = '';

        // Optional: Save to localStorage
        this.saveMeetings();
      }
    },
    removeMeeting(index) {
      this.meetings.splice(index, 1);

      // Optional: Save to localStorage
      this.saveMeetings();
    },
    saveMeetings() {
      localStorage.setItem('meetings', JSON.stringify(this.meetings));
    },

    loadMeetings() {
      const savedMeetings = localStorage.getItem('meetings');
      if (savedMeetings) {
        this.meetings = JSON.parse(savedMeetings);
      }
    },
    startEditingThoughts() {
      this.tempThoughts = this.otherThoughts; // Save current value in case user cancels
      this.editingThoughts = true;

      // Use nextTick to ensure the textarea exists in the DOM before focusing
      this.$nextTick(() => {
        this.$refs.thoughtsTextarea.focus();
      });
    },
    saveThoughts() {
      this.editingThoughts = false;
      // Optional: Save to localStorage
      localStorage.setItem('otherThoughts', this.otherThoughts);
    },

    cancelEditThoughts() {
      this.otherThoughts = this.tempThoughts; // Restore previous value
      this.editingThoughts = false;
    },

    clearThoughts() {
      if (confirm("Are you sure you want to clear all your thoughts?")) {
        this.otherThoughts = "";
        this.editingThoughts = false;
        localStorage.removeItem('otherThoughts');
      }
    },
    // Start of mood
    setMood(mood) {
      this.selectedMood = mood;
    },
    // Glasses
    setGlasses(count) {
      this.selectedGlasses = count; // Updates the selection
    },
    // Steps
    setStepsMilestone(milestone) {
      this.completedStepsMilestone = milestone;
    },
    // Tasks/goals
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
    },
  }
};
</script>


<style scoped>
/* Calendar box */
.calendar-card {
  background-color: #8e44ad; /* Purple color */
  color: white;
  border: none;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}
.calendar-month {
  background-color: rgba(0, 0, 0, 0.2);
  padding: 8px 0;
  font-size: 1rem;
  font-weight: 500;
  text-transform: uppercase;
}
.calendar-day {
  font-size: 2.5rem;
  font-weight: bold;
  padding: 10px 0 5px;
}
.calendar-weekday {
  font-size: 1rem;
  padding-bottom: 10px;
  text-transform: uppercase;
  font-weight: 500;
}
/* Focus of today*/
.card-text {
  cursor: pointer;
  min-height: 40px;
  white-space: pre-line; /* Preserves line breaks in the text */
}
.focus-edit-container {
  width: 100%;
}
.focus-textarea {
  min-height: 80px;
  resize: vertical;
}
/* Add a subtle highlight when hovering over the focus text */
.card-text:hover {
  background-color: rgba(0, 0, 0, 0.03);
  border-radius: 4px;
  padding: 4px;
  margin: -4px;
}
/* Meetings */
.list-group-item {
  transition: background-color 0.2s;
}

.list-group-item:hover {
  background-color: rgba(0, 0, 0, 0.02);
}

/* Style for the delete button */
.btn-link.text-danger {
  opacity: 0.7;
  transition: opacity 0.2s;
}

.btn-link.text-danger:hover {
  opacity: 1;
}
/* other thoughts*/
.thoughts-content {
  cursor: pointer;
  white-space: pre-line; /* Preserves line breaks */
  min-height: 40px;
}

.thoughts-placeholder {
  cursor: pointer;
  min-height: 40px;
}

.thoughts-textarea {
  min-height: 100px;
  resize: vertical;
}
/* Mood */
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
/* Glasses */
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
/*Steps */
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
/*Tasks*/
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
.completed-activity {
  text-decoration: line-through;
  color: #6c757d;
}
.activity-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}
</style>