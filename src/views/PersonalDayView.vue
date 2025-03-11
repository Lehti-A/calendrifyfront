<template>
  <div class="container-fluid px-4 pb-4 personal-day-container">
    <div class="row mb-5 align-items-center header-row">
      <div class="col text-center">
        <h1 class="mb-1 fw-bold simple-header">
          PERSONAL DAY PLANNER
        </h1>
      </div>
    </div>
    <!-- Main Two-Column Layout -->
    <div class="row">
      <!-- Left Main Column (Calendar + Focus, Activities, Other Thoughts, Tasks) -->
      <div class="col-md-8 left-column">
        <!-- Calendar and Focus for Today (nested row) -->
        <div class="row mb-4">
          <div class="col-md-3">
            <div class="calendar-card">
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

          <div class="col-md-9">
            <div class="card semi-transparent-card focus-card">
              <div class="card-header bg-transparent"><strong>Focus for Today</strong></div>
              <div class="card-body focus-body">
                <div class="seamless-input-container">
                  <!-- Placeholder text shown when no focus and not editing -->
                  <div
                      v-if="!isEditing && !dailyFocus"
                      class="placeholder-text"
                      @click="startEditing"
                  >{{ placeholder }}</div>

                  <!-- Existing content shown when not editing -->
                  <div
                      v-if="!isEditing && dailyFocus"
                      class="content-text"
                      @click="startEditing"
                  >{{ dailyFocus }}</div>

                  <!-- Editing container with input and clear button together -->
                  <div v-if="isEditing" class="editing-wrapper">
                    <input
                        ref="seamlessInput"
                        type="text"
                        class="seamless-input"
                        v-model="dailyFocus"
                        @blur="handleBlur"
                        @keydown.enter="finishEditing"
                    >
                    <div class="focus-button-row">
                      <!-- Save button -->
                      <button
                          class="btn btn-sm btn-primary focus-save-btn"
                          @click.stop="finishEditing"
                          title="Save"
                          type="button"
                      >
                        Save
                      </button>

                      <!-- Clear button only shown when text exists -->
                      <button
                          v-if="dailyFocus"
                          class="btn btn-sm btn-outline-danger focus-clear-btn"
                          @click.stop="clearFocus"
                          title="Clear text"
                          type="button"
                      >
                        Clear
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Activities -->
        <div class="card semi-transparent-card mb-4 activities-card">
          <div class="card-header bg-transparent"><strong>Activities</strong></div>
          <div class="content-container">
            <ul class="list-group list-group-flush">
              <li v-for="(activity, index) in activities" :key="index"
                  class="list-group-item d-flex align-items-center justify-content-between">
                <span :class="{ 'completed-activity': activity.completed }">{{ activity.text }}</span>
                <div class="activity-actions">
                  <input
                      type="checkbox"
                      class="form-check-input ms-2"
                      :checked="activity.completed"
                      @change="toggleActivityCompletion(index)"
                  >
                  <button
                      class="btn btn-sm btn-link text-danger p-0"
                      @click="removeActivity(index)"
                      title="Remove activity"
                  >
                    <i class="fas fa-eraser"></i>
                    <span v-if="!hasFontAwesome">🗑️</span>
                  </button>
                </div>
              </li>
            </ul>
          </div>
          <div class="card-footer bg-transparent">
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
          </div>
        </div>

        <!-- Other Thoughts -->
        <div class="card semi-transparent-card mb-4 thoughts-card">
          <div class="card-header bg-transparent"><strong>Other Thoughts</strong></div>
          <div class="content-container">
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
                  <button v-if="otherThoughts" class="btn btn-sm btn-outline-danger float-end" @click="clearThoughts">
                    Clear
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Tasks -->
        <div class="card semi-transparent-card mb-4 tasks-card">
          <div class="card-header bg-transparent"><strong>Monthly Goals</strong></div>
          <div class="content-container">
            <ul class="list-group list-group-flush">
              <li v-for="(task, index) in tasks" :key="index"
                  class="list-group-item d-flex align-items-center justify-content-between">
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
                    <span v-if="!hasFontAwesome">🗑️</span>
                  </button>
                </div>
              </li>
            </ul>
          </div>
          <div class="card-footer bg-transparent">
            <div class="input-group">
              <input
                  type="text"
                  class="form-control form-control-sm"
                  placeholder="Add new goal..."
                  v-model="newTask"
                  @keyup.enter="addTask"
              >
              <button class="btn btn-outline-secondary btn-sm" type="button" @click="addTask">Add</button>
            </div>
          </div>
        </div>

      </div>

      <!-- Right Sidebar Column (Image, Meetings, Mood, Glasses, Steps) -->
      <div class="col-md-4 right-column">
        <!-- Image Card - With diary default image and upload functionality -->
        <div class="card mb-4 image-card" style="width: 80%; aspect-ratio: 1/1; margin: 0 auto; padding: 0; overflow: hidden; position: relative;">
          <!-- Default diary image shown when no user image is available -->
          <img v-if="!userImageUrl" src="@/assets/diary.png" class="card-img" alt="Default diary image" />

          <!-- User uploaded image shown when available -->
          <img v-else :src="userImageUrl" class="card-img" alt="User profile image" />

          <!-- Add button - only shown with default image -->
          <div v-if="!userImageUrl" class="image-action-button add-button" @click="triggerImageUpload" title="Add your picture">
            +
          </div>

          <!-- Delete button - only shown with user image -->
          <div v-else class="image-action-button delete-button" @click="deleteUserImage" title="Remove picture">
            ×
          </div>

          <!-- Hidden file input for image upload -->
          <input
              type="file"
              ref="imageInput"
              @change="handleImageUpload"
              accept="image/*"
              style="display: none;"
          />
        </div>
        <!-- Meetings -->
        <div class="card semi-transparent-card mb-4 meetings-card">
          <div class="card-header bg-transparent"><strong>Personal Meetings</strong></div>
          <div class="content-container">
            <ul class="list-group list-group-flush">
              <li v-for="(meeting, index) in meetings" :key="index"
                  class="list-group-item meeting-item"
                  @mouseenter="meeting.showDelete = true"
                  @mouseleave="meeting.showDelete = false">
                <div class="meeting-content">
                  <span class="meeting-info"
                        style="width: calc(100% - 40px); overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                    {{ meeting.time }} - {{ meeting.title }}
                  </span>
                  <span
                      v-if="meeting.showDelete"
                      @click="removeMeeting(index)"
                      title="Remove meeting"
                      style="position: absolute; right: 15px; top: 50%; transform: translateY(-50%); font-size: 18px; color: #dc3545; width: 25px; height: 25px; background: rgba(255,255,255,0.8); border-radius: 50%; display: flex; justify-content: center; align-items: center; cursor: pointer;"
                  >×</span>
                </div>
              </li>
            </ul>
          </div>
          <div class="card-footer bg-transparent">
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
          </div>
        </div>

        <!-- Trackers Container - Contains all three trackers -->
        <div class="trackers-container">
          <!-- Water Tracker -->
          <div class="mb-4 tracker-section">
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
          <!-- Mood Section -->
          <div class="mb-4 tracker-section">
            <h5 class="mb-3 text-center">Mood today?</h5>
            <div id="mood-icons" class="text-center">
              <span
                  class="mood-icon"
                  :class="{ 'active-sad': personalMood === 'sad' }"
                  @click="setMood('sad')"
                  title="Sad">😢</span>
              <span
                  class="mood-icon"
                  :class="{ 'active-neutral': personalMood === 'neutral' }"
                  @click="setMood('neutral')"
                  title="Neutral">😐</span>
              <span
                  class="mood-icon"
                  :class="{ 'active-happy': personalMood === 'happy' }"
                  @click="setMood('happy')"
                  title="Happy">😊</span>
            </div>
          </div>
          <!-- Steps Tracker -->
          <div class="tracker-section">
            <h5 class="mb-4 text-center">Steps</h5>
            <div class="steps-milestones">
              <div
                  v-for="(milestone, index) in milestones"
                  :key="index"
                  class="milestone-item"
                  @click="setStepsMilestone(index + 1)"
                  :title="`${milestone.steps} Steps`">
                <div class="checkbox-container" :class="{ 'checked': index < completedStepsMilestone }">
                  <!-- Standard checkmark that only appears when checked -->
                  <svg v-if="index < completedStepsMilestone" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                       fill="white" class="checkmark-icon">
                    <path fill-rule="evenodd"
                          d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 011.04-.208z"
                          clip-rule="evenodd"/>
                  </svg>
                </div>
                <div class="milestone-label">{{ milestone.label }}</div>
              </div>
            </div>
            <div class="milestone-status">
              <span v-if="completedStepsMilestone > 0">
                <span v-if="completedStepsMilestone === 4">Over 10,000 steps</span>
                <span v-else>At least {{ milestones[completedStepsMilestone - 1].steps }} steps</span>
              </span>
              <span v-else>No steps recorded</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PersonalDayView',
  created() {
    const selectedCalendarDate = sessionStorage.getItem('selectedCalendarDate');
    if (selectedCalendarDate) {
      // Parse the date string back to a Date object
      const [year, month, day] = selectedCalendarDate.split('-').map(Number);
      this.selectedDate = new Date(year, month - 1, day);

      // Clear the stored date once it's been used
      sessionStorage.removeItem('selectedCalendarDate');
    }
  },
  mounted() {
    this.loadSavedData();


    // Load the user image if it exists in localStorage
    this.loadUserImage();

    // You can also load other stored data here
    const savedFocus = localStorage.getItem('dailyFocus');
    if (savedFocus) {
      this.dailyFocus = savedFocus;
    }

    const savedThoughts = localStorage.getItem('otherThoughts');
    if (savedThoughts) {
      this.otherThoughts = savedThoughts;
    }

    // Load meetings from localStorage if they exist
    this.loadMeetings();
  },
  data() {
    return {
      selectedDate: null,
      tempFocus: "", // For canceling edits
      clearButtonClicked: false,
      dailyFocus: "",
      isEditing: false,
      placeholder: "Click here to set your focus for today...",
      userImageUrl: null,
      meetings: [
        {time: '8:00', title: 'Team Sync Meeting', showDelete: false},
        {time: '10:00', title: 'Client Discussion', showDelete: false},

      ],
      newMeetingTime: '',
      newMeetingTitle: '',
      otherThoughts: "",
      editingThoughts: false,
      tempThoughts: "",
      // Stores the selected mood
      personalMood: null,
      selectedGlasses: 0,
      completedStepsMilestone: 0,
      milestones: [
        {steps: 2500, label: "2,500"},
        {steps: 5000, label: "5,000"},
        {steps: 7500, label: "7,500"},
        {steps: 10000, label: "10,000+"}
      ],
      activities: [
        {text: "Read at least 15min", completed: false},
        {text: "Sport session", completed: false},
        {text: "Meditation session", completed: false},
      ],
      newActivity: "",
      tasks: [
        {text: "Play tennis", completed: false},
        {text: "Uurida, et kuidas me linnukeste asjaga süsteemi update-ime", completed: false}
      ],
      newTask: "",
      hasFontAwesome: false // Set to true if you have Font Awesome included
    };
  },

  computed: {
    currentDay() {
      return this.selectedDate ? this.selectedDate.getDate() : new Date().getDate();
    },

// Modify the currentMonth computed property:
    currentMonth() {
      const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
      ];
      const date = this.selectedDate || new Date();
      return months[date.getMonth()];
    },

// Modify the currentWeekday computed property:
    currentWeekday() {
      const days = [
        'Sunday', 'Monday', 'Tuesday', 'Wednesday',
        'Thursday', 'Friday', 'Saturday'
      ];
      const date = this.selectedDate || new Date();
      return days[date.getDay()];
    }
  },

  methods: {
    loadSavedData() {
      // Load work-specific data
      const savedFocus = localStorage.getItem('personalDailyFocus');
      if (savedFocus) {
        this.dailyFocus = savedFocus;
      }

      const savedThoughts = localStorage.getItem('personalThoughts');
      if (savedThoughts) {
        this.otherThoughts = savedThoughts;
      }

      const savedActivities = localStorage.getItem('personalActivities');
      if (savedActivities) {
        this.activities = JSON.parse(savedActivities);
      }

      const savedMeetings = localStorage.getItem('personalMeetings');
      if (savedMeetings) {
        this.meetings = JSON.parse(savedMeetings);
      }

      const savedMood = localStorage.getItem('personalMood');
      if (savedMood) {
        this.personalMood = savedMood; // Correct property name
      }

      // Load user profile image
      const savedImage = localStorage.getItem('personalProfileImage');
      if (savedImage) {
        this.userImageUrl = savedImage;
      }

      // Load shared data (should be the same as in PersonalDayView)
      const savedGlasses = localStorage.getItem('sharedGlasses');
      if (savedGlasses) {
        this.selectedGlasses = parseInt(savedGlasses);
      }

      const savedSteps = localStorage.getItem('sharedStepsMilestone');
      if (savedSteps) {
        this.completedStepsMilestone = parseInt(savedSteps);
      }
    },
    // Start of focus
    startEditing() {
      this.tempFocus = this.dailyFocus; // Store for cancellation
      this.isEditing = true;
      this.$nextTick(() => {
        this.$refs.seamlessInput.focus();
      });
    },
    cancelEditing() {
      // Restore previous value
      this.dailyFocus = this.tempFocus;
      this.isEditing = false;
    },
    clearFocus(event) {
      if (event) {
        event.preventDefault();
        event.stopPropagation();
      }

      // Clear the text but keep editing mode active
      this.dailyFocus = "";
      this.clearButtonClicked = true;

      // Wrap the focus in a delayed timeout to ensure DOM has updated
      setTimeout(() => {
        if (this.$refs.seamlessInput) {
          this.$refs.seamlessInput.focus();
        }
      }, 50);
    },
    finishEditing() {
      this.isEditing = false;
      this.dailyFocus = this.dailyFocus.trim();

      if (this.dailyFocus) {
        localStorage.setItem('personalDailyFocus', this.dailyFocus);
      } else {
        localStorage.removeItem('personalDailyFocus');
      }
    },
    handleBlur(event) {
      // Slight delay to check if clear button was clicked
      setTimeout(() => {
        if (!this.clearButtonClicked) {
          this.finishEditing();
        }
        this.clearButtonClicked = false;
      }, 100);
    },

    toggleActivityCompletion(index) {
      this.activities[index].completed = !this.activities[index].completed;
      this.saveActivities();
    },
    removeActivity(index) {
      this.activities.splice(index, 1);
      this.saveActivities();
    },
    addActivity() {
      if (this.newActivity.trim()) {
        this.activities.push({
          text: this.newActivity.trim(),
          completed: false
        });
        this.newActivity = "";
        this.saveActivities();
      }
    },
    saveActivities() {
      localStorage.setItem('personalActivities', JSON.stringify(this.activities));
    },

    triggerImageUpload() {
      this.$refs.imageInput.click();
    },

    // Handle the image file selection
    handleImageUpload(event) {
      const file = event.target.files[0];
      if (file && file.type.match('image.*')) {
        const reader = new FileReader();

        reader.onload = (e) => {
          this.userImageUrl = e.target.result;
          // Save to localStorage for persistence
          localStorage.setItem('personalProfileImage', this.userImageUrl);
        };

        reader.readAsDataURL(file);
      }
    },

    // Delete the user image and revert to default diary image
    deleteUserImage() {
      if (confirm('Are you sure you want to remove your profile picture?')) {
        this.userImageUrl = null;
        localStorage.removeItem('personalProfileImage');
      }
    },

    // Load the user image from localStorage if available
    loadUserImage() {
      const savedImage = localStorage.getItem('personalProfileImage');
      if (savedImage) {
        this.userImageUrl = savedImage;
      }
    },
    addMeeting() {
      if (this.newMeetingTime.trim() && this.newMeetingTitle.trim()) {
        this.meetings.push({
          time: this.newMeetingTime.trim(),
          title: this.newMeetingTitle.trim(),
          showDelete: false
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
      localStorage.setItem('personalMeetings', JSON.stringify(this.meetings));
    },

    loadMeetings() {
      const savedMeetings = localStorage.getItem('personalMeetings');
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
      localStorage.setItem('personalThoughts', this.otherThoughts);
    },

    cancelEditThoughts() {
      this.otherThoughts = this.tempThoughts; // Restore previous value
      this.editingThoughts = false;
    },

    clearThoughts() {
      if (confirm("Are you sure you want to clear all your thoughts?")) {
        this.otherThoughts = "";
        this.editingThoughts = false;
        localStorage.removeItem('personalThoughts');
      }
    },
    // Start of mood
    setMood(mood) {
      this.personalMood = mood;
      localStorage.setItem('personalMood', mood);
    },
    // Glasses
    setGlasses(count) {
      this.selectedGlasses = count; // Updates the selection
      localStorage.setItem('sharedGlasses', count); // Use the shared key
    },

// Steps
    setStepsMilestone(milestone) {
      this.completedStepsMilestone = milestone;
      localStorage.setItem('sharedStepsMilestone', milestone); // Use the shared key
    },
    // Tasks/goals
    toggleTaskCompletion(index) {
      this.tasks[index].completed = !this.tasks[index].completed;
      this.saveTasks();
    },
    removeTask(index) {
      this.tasks.splice(index, 1);
      this.saveTasks();
    },
    addTask() {
      if (this.newTask.trim()) {
        this.tasks.push({
          text: this.newTask.trim(),
          completed: false
        });
        this.newTask = "";
        this.saveTasks();
      }
    },

    saveTasks() {
      localStorage.setItem('personalTasks', JSON.stringify(this.tasks));
    },
  }
};
</script>

<style scoped>

/* General Layout Styles */
.personal-day-container {
  padding-top: 170px; /* Space for navigation bar */
}

.container-fluid {
  max-width: 1400px;
  margin: 0 auto;
}

/* Typography Styles */
.simple-header,
.card-header strong,
.tracker-section h5 {
  font-family: 'Quicksand', sans-serif !important;
  font-weight: 700 !important;
}

.simple-header {
  color: #ffffff;
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.3);
}

.card-header strong {
  font-size: 1.15rem;
}

.tracker-section h5 {
  font-size: 1.2rem;
  font-weight: 600 !important;
}

/* Header and Row Styles */
.header-row {
  position: relative;
  margin-bottom: 2rem !important;
}

/* Column Layout */
.left-column > .card,
.right-column > .card {
  height: auto;
  margin-bottom: 1rem;
}

/* Card Styles */
.card {
  display: flex;
  flex-direction: column;
}

.content-container {
  width: 100%;
  flex-grow: 1;
}

.semi-transparent-card {
  background-color: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.8);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.semi-transparent-card .card-header {
  background-color: rgba(255, 255, 255, 0.3);
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  font-size: 1.1rem;
}

/* Card Footer Styling */
.focus-card .card-footer,
.activities-card .card-footer,
.meetings-card .card-footer,
.thoughts-card .card-footer {
  background-color: rgba(255, 255, 255, 0.3);
  border-top: 1px solid rgba(0, 0, 0, 0.1);
}

/* Button Styles */
.btn-link.text-danger {
  opacity: 0.7;
  transition: opacity 0.2s;
}

.btn-link.text-danger:hover {
  opacity: 1;
}

/* Calendar Styles */
.calendar-card {
  background-color: rgba(142, 68, 173, 0.7);
  color: white;
  border: none;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  height: 180px !important;
  max-height: 180px !important;
}

.calendar-month {
  background-color: rgba(0, 0, 0, 0.2);
  padding: 12px 0;
  font-size: 1.1rem;
  font-weight: 500;
  text-transform: uppercase;
}

.calendar-day {
  font-size: 3.2rem;
  font-weight: bold;
  padding: 15px 0 10px;
}

.calendar-weekday {
  font-size: 1.1rem;
  padding-bottom: 15px;
  text-transform: uppercase;
  font-weight: 500;
}

/* Focus Card Styles */
.focus-card {
  height: 180px;
  max-height: 180px;
  display: flex;
  flex-direction: column;
}

.focus-body {
  flex: 1;
  padding: 0.6rem 0.75rem;
  overflow-y: hidden;
  position: relative;
}

.seamless-input-container {
  min-height: 60px;
  position: relative;
  padding: 10px;
}

.placeholder-text {
  color: #6c757d;
  font-style: italic;
  cursor: text;
}

.content-text {
  white-space: pre-line;
  cursor: text;
}

.editing-wrapper {
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 10px;
}

.seamless-input {
  width: 100%;
  border: none;
  background: transparent;
  font-size: 1.1rem;
  padding: 5px 0;
  height: 24px;
}

.seamless-input:focus {
  outline: none;
}

.focus-button-row {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 2px;
}

.focus-save-btn, .focus-clear-btn {
  font-size: 0.75rem;
  padding: 0.15rem 0.6rem;
  height: 24px;
}

.focus-save-btn:hover {
  background-color: #7d3c98;
  border-color: #7d3c98;
}

/* Purple Theme Button Styles */
.focus-card .btn-primary,
.thoughts-card .btn-primary,
.meetings-card .btn-primary {
  background-color: #8e44ad;
  border-color: #8e44ad;
}

.focus-card .btn-primary:hover,
.thoughts-card .btn-primary:hover,
.meetings-card .btn-primary:hover {
  background-color: #7d3c98;
  border-color: #7d3c98;
}

.focus-card .btn-primary:active,
.focus-card .btn-primary:focus,
.thoughts-card .btn-primary:active,
.thoughts-card .btn-primary:focus,
.meetings-card .btn-primary:active,
.meetings-card .btn-primary:focus {
  background-color: #6c3483;
  border-color: #6c3483;
  box-shadow: 0 0 0 0.25rem rgba(142, 68, 173, 0.4);
}

.activities-card .btn-outline-secondary,
.tasks-card .btn-outline-secondary {
  color: #8e44ad;
  border-color: #8e44ad;
}

.activities-card .btn-outline-secondary:hover,
.tasks-card .btn-outline-secondary:hover {
  background-color: #8e44ad;
  border-color: #8e44ad;
  color: white;
}

.activities-card .btn-outline-secondary:active,
.activities-card .btn-outline-secondary:focus,
.tasks-card .btn-outline-secondary:active,
.tasks-card .btn-outline-secondary:focus {
  background-color: #7d3c98;
  border-color: #7d3c98;
  box-shadow: 0 0 0 0.25rem rgba(142, 68, 173, 0.4);
}

/* Activities and Tasks Styles */
.activities-card {
  min-height: 500px;
}

.tasks-card {
  min-height: 350px;
}

.completed-activity,
.completed-task {
  text-decoration: line-through;
  color: #6c757d;
}

.activity-actions,
.task-actions {
  display: flex !important;
  align-items: center !important;
  gap: 20px !important;
  justify-content: flex-end !important;
  min-width: 80px;
  flex-direction: row-reverse !important;
}

/* Other Thoughts Styles */
.thoughts-card {
  min-height: 250px;
}

.thoughts-content {
  cursor: pointer;
  white-space: pre-line;
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

/* Meetings Styles */
.meetings-card {
  min-height: 600px;
  width: 80%;
  margin-left: auto;
  margin-right: auto;
  margin-top: 30px;
}

.meeting-content {
  display: flex;
  align-items: center;
  position: relative;
  width: 100%;
}

.meeting-item {
  padding: 12px 15px;
  position: relative;
}

/* Image Card Styles */
.image-card {
  position: relative;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  border-radius: 8px;
  overflow: hidden;
}

.card-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.image-card:hover .card-img {
  transform: scale(1.02);
}

.image-action-button {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  opacity: 0;
  transition: all 0.2s ease;
  z-index: 10;
  font-size: 24px;
  font-weight: bold;
  text-shadow: 0 0 3px rgba(255, 255, 255, 0.8);
}

.add-button {
  color: #8e44ad;
}

.delete-button {
  color: #dc3545;
}

.image-card:hover .image-action-button {
  opacity: 1;
}

/* Trackers Styles */
.trackers-container {
  display: flex;
  flex-direction: column;
}

.tracker-section {
  margin-bottom: 1.5rem;
}

/* Mood Tracker */
.mood-icon {
  font-size: 2rem;
  cursor: pointer;
  margin: 0 0.5rem;
  transition: color 0.3s ease;
  filter: grayscale(100%);
  color: #adb5bd !important;
}

.active-sad {
  filter: grayscale(0%);
  color: #ff4d4d !important;
}

.active-neutral {
  filter: grayscale(0%);
  color: #ffc107 !important;
}

.active-happy {
  filter: grayscale(0%);
  color: #28a745 !important;
}

/* Water Tracker */
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
  border: 2px solid #4a5568;
  border-radius: 0 0 8px 8px;
  position: relative;
  overflow: hidden;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  background-color: #f8f9fa;
}

.water-fill {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  background-color: #007bff;
  transition: height 0.3s ease;
}

/* Steps Tracker */
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
</style>