<template>
  <div class="container-fluid px-4 pb-4 work-day-container">
    <div class="row mb-5 align-items-center header-row">
      <div class="col text-center">
        <h1 class="mb-1 fw-bold simple-header">
          WORK DAY PLANNER
        </h1>
      </div>
    </div>

    <!-- Main Two-Column Layout -->
    <div class="row">
      <!-- Left Main Column (Calendar + Focus, Activities, Other Thoughts, Glasses/Mood) -->
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
                <div v-if="!editingFocus" @click="startEditingFocus" class="focus-view-mode">
                  <p v-if="dailyFocus" class="focus-content">{{ dailyFocus }}</p>
                  <p v-else class="text-muted focus-placeholder">Click here to set your focus for today...</p>
                </div>
                <div v-else class="focus-edit-mode">
                  <textarea
                      class="form-control focus-textarea"
                      v-model="dailyFocus"
                      placeholder="What's your main focus for today?"
                      ref="focusTextarea"
                  ></textarea>
                </div>
              </div>
              <div v-if="editingFocus" class="card-footer p-1 text-end">
                <button class="btn btn-sm btn-primary" @click="saveFocus">Save</button>
                <button class="btn btn-sm btn-outline-secondary ms-2" @click="cancelEditFocus">Cancel</button>
                <button v-if="dailyFocus" class="btn btn-sm btn-outline-danger float-start" @click="clearFocus">Clear
                </button>
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

        <!-- Glasses and Mood Row -->
        <div class="row mb-4">
          <!-- Water Tracker -->
          <div class="col-md-6">
            <div class="tracker-section">
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
          </div>

          <!-- Work Mood Section -->
          <div class="col-md-6">
            <div class="tracker-section">
              <h5 class="mb-3 text-center">Work Mood today?</h5>
              <div id="mood-icons" class="text-center">
                <span
                    class="mood-icon"
                    :class="{ 'active-sad': workMood === 'stressed' }"
                    @click="setWorkMood('stressed')"
                    title="Stressed">😓</span>
                <span
                    class="mood-icon"
                    :class="{ 'active-neutral': workMood === 'neutral' }"
                    @click="setWorkMood('neutral')"
                    title="Neutral">😐</span>
                <span
                    class="mood-icon"
                    :class="{ 'active-happy': workMood === 'productive' }"
                    @click="setWorkMood('productive')"
                    title="Productive">😊</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Sidebar Column (Image, Meetings, Steps) -->
      <div class="col-md-4 right-column">
        <!-- Image Card - Proper Square with Same Width as Meetings -->
        <div class="card mb-4 image-card"
             style="width: 80%; aspect-ratio: 1/1; margin: 0 auto; padding: 0; overflow: hidden;">
          <img src="../assets/html/vali_it_logo.png" height="200" width="200"/>
        </div>

        <!-- Meetings -->
        <div class="card semi-transparent-card mb-4 meetings-card">
          <div class="card-header bg-transparent"><strong>Work Meetings</strong></div>
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

        <!-- Trackers Container -->
        <div class="trackers-container">
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
  name: 'WorkDayView',
  created() {
    // Load saved data from localStorage
    this.loadSavedData();

    const selectedCalendarDate = sessionStorage.getItem('selectedCalendarDate');
    if (selectedCalendarDate) {
      // Parse the date string back to a Date object
      const [year, month, day] = selectedCalendarDate.split('-').map(Number);
      this.selectedDate = new Date(year, month - 1, day);

      // Clear the stored date once it's been used
      sessionStorage.removeItem('selectedCalendarDate');
    }
  },

  data() {
    return {
      selectedDate: null,
      // Focus section
      dailyFocus: "",
      editingFocus: false,
      tempFocus: "",

      // Other thoughts section
      otherThoughts: "",
      editingThoughts: false,
      tempThoughts: "",

      // Activities section (formerly workTasks)
      activities: [
        {text: "Prepare for team meeting", completed: false},
        {text: "Review project timeline", completed: false},
        {text: "Complete quarterly report", completed: false},
      ],
      newActivity: "",

      // Meetings section
      meetings: [
        {time: '9:00', title: 'Team Standup', showDelete: false},
        {time: '13:30', title: 'Client Call', showDelete: false},
      ],
      newMeetingTime: '',
      newMeetingTitle: '',

      // Work mood tracker (specific to work day)
      workMood: null,

      // Trackers that will sync with personal day view
      selectedGlasses: 0,
      completedStepsMilestone: 0,
      milestones: [
        {steps: 2500, label: "2,500"},
        {steps: 5000, label: "5,000"},
        {steps: 7500, label: "7,500"},
        {steps: 10000, label: "10,000+"}
      ],

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
    // Load data from localStorage (including shared data between views)
    loadSavedData() {
      // Load work-specific data
      const savedFocus = localStorage.getItem('workDailyFocus');
      if (savedFocus) {
        this.dailyFocus = savedFocus;
      }

      const savedThoughts = localStorage.getItem('otherThoughts');
      if (savedThoughts) {
        this.otherThoughts = savedThoughts;
      }

      const savedActivities = localStorage.getItem('workActivities');
      if (savedActivities) {
        this.activities = JSON.parse(savedActivities);
      }

      const savedMeetings = localStorage.getItem('workMeetings');
      if (savedMeetings) {
        this.meetings = JSON.parse(savedMeetings);
      }

      const savedWorkMood = localStorage.getItem('workMood');
      if (savedWorkMood) {
        this.workMood = savedWorkMood;
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

    // Work mood method (specific to work day)
    setWorkMood(mood) {
      this.workMood = mood;
      localStorage.setItem('workMood', mood);
    },
    // Focus section methods
    startEditingFocus() {
      this.tempFocus = this.dailyFocus;
      this.editingFocus = true;
      this.$nextTick(() => {
        this.$refs.focusTextarea.focus();
      });
    },
    saveFocus() {
      this.editingFocus = false;
      this.dailyFocus = this.dailyFocus.trim();
      localStorage.setItem('workDailyFocus', this.dailyFocus);
    },
    cancelEditFocus() {
      this.dailyFocus = this.tempFocus;
      this.editingFocus = false;
    },
    clearFocus() {
      if (confirm("Are you sure you want to clear your focus?")) {
        this.dailyFocus = "";
        localStorage.removeItem('workDailyFocus');
        this.editingFocus = false;
      }
    },

    // Other thoughts methods
    startEditingThoughts() {
      this.tempThoughts = this.otherThoughts;
      this.editingThoughts = true;
      this.$nextTick(() => {
        this.$refs.thoughtsTextarea.focus();
      });
    },
    saveThoughts() {
      this.editingThoughts = false;
      localStorage.setItem('otherThoughts', this.otherThoughts);
    },
    cancelEditThoughts() {
      this.otherThoughts = this.tempThoughts;
      this.editingThoughts = false;
    },
    clearThoughts() {
      if (confirm("Are you sure you want to clear all your thoughts?")) {
        this.otherThoughts = "";
        this.editingThoughts = false;
        localStorage.removeItem('otherThoughts');
      }
    },

    // Activity methods (formerly task methods)
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
      localStorage.setItem('workActivities', JSON.stringify(this.activities));
    },

    // Meeting methods
    addMeeting() {
      if (this.newMeetingTime.trim() && this.newMeetingTitle.trim()) {
        this.meetings.push({
          time: this.newMeetingTime.trim(),
          title: this.newMeetingTitle.trim(),
          showDelete: false
        });
        this.newMeetingTime = '';
        this.newMeetingTitle = '';
        this.saveMeetings();
      }
    },
    removeMeeting(index) {
      this.meetings.splice(index, 1);
      this.saveMeetings();
    },
    saveMeetings() {
      localStorage.setItem('workMeetings', JSON.stringify(this.meetings));
    },

    // Shared tracker methods (will sync with PersonalDayView)
    setGlasses(count) {
      this.selectedGlasses = count;
      localStorage.setItem('sharedGlasses', count);
    },
    setStepsMilestone(milestone) {
      this.completedStepsMilestone = milestone;
      localStorage.setItem('sharedStepsMilestone', milestone);
    }
  }
};
</script>

<style scoped>
.simple-header,
.card-header strong,
.tracker-section h5 {
  font-family: 'Quicksand', sans-serif !important;
  font-weight: 700 !important;
}

/* Increase header font size slightly */
.card-header strong {
  font-size: 1.15rem;
}

.tracker-section h5 {
  font-size: 1.2rem;
  font-weight: 600 !important;
}
.work-day-container {
  padding-top: 170px; /* Match PersonalDayView top padding */
}

/* Ensure the header row doesn't get hidden */
.header-row {
  position: relative;
  margin-bottom: 2rem !important;
}

/* Simple bold white header */
.simple-header {
  color: #ffffff; /* White text */
  font-weight: 700; /* Bold */
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.3); /* Subtle shadow for legibility */
}

/* Make the overall container wider */
.container-fluid {
  max-width: 1400px;
  margin: 0 auto;
}

/* Two-column layout styles */
.left-column > .card,
.right-column > .card {
  height: auto;
  margin-bottom: 1rem;
}

/* Card styles */
.card {
  display: flex;
  flex-direction: column;
}

/* Content containers */
.content-container {
  width: 100%;
  flex-grow: 1;
}

/* Specific heights for different sections - adjusted for alignment */
.activities-card {
  min-height: 580px; /* Increased height to match meetings */
}

.meetings-card {
  min-height: 632px; /* 621px increased by 1% */
  width: 80%; /* Width matches image card */
  margin-left: auto;
  margin-right: auto;
  margin-top: 30px; /* Push meetings down for better spacing */
}

.thoughts-card {
  min-height: 200px; /* Adjusted height */
}

/* Calendar box */
.calendar-card {
  background-color: rgba(142, 68, 173, 0.7); /* Purple color with 70% opacity */
  color: white;
  border: none;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  height: 180px !important; /* Fixed height */
  max-height: 180px !important; /* Prevent expansion */
}

.calendar-month {
  background-color: rgba(0, 0, 0, 0.2);
  padding: 12px 0; /* Increased padding */
  font-size: 1.1rem; /* Larger font */
  font-weight: 500;
  text-transform: uppercase;
}

.calendar-day {
  font-size: 3.2rem; /* Larger font */
  font-weight: bold;
  padding: 15px 0 10px; /* Increased padding */
}

.calendar-weekday {
  font-size: 1.1rem; /* Larger font */
  padding-bottom: 15px; /* Increased padding */
  text-transform: uppercase;
  font-weight: 500;
}

/* Focus of today*/
.focus-card {
  height: 180px !important; /* Fixed height */
  max-height: 180px !important; /* Prevent expansion */
  display: flex;
  flex-direction: column;
}

.focus-body {
  flex: 1;
  padding: 0.75rem;
  overflow-y: auto;
}

.focus-view-mode {
  height: 100%;
  overflow-y: auto;
}

.focus-edit-mode {
  height: 100%;
}

.focus-content, .focus-placeholder {
  cursor: pointer;
  white-space: pre-line; /* Preserves line breaks */
  min-height: 40px;
  font-size: 1.1rem; /* Larger font */
  margin-bottom: 0;
}

.focus-textarea {
  height: 100% !important;
  width: 100%;
  resize: none;
  font-size: 1.1rem;
}

/* Card footer styling */
.focus-card .card-footer {
  padding: 0.25rem 0.5rem;
  background-color: white;
  border-top: 1px solid rgba(0, 0, 0, 0.125);
}

/* Focus and Thoughts save buttons - same purple style */
.focus-card .btn-primary,
.thoughts-card .btn-primary {
  background-color: #8e44ad; /* Same purple as calendar */
  border-color: #8e44ad;
}

.focus-card .btn-primary:hover,
.thoughts-card .btn-primary:hover {
  background-color: #7d3c98; /* Slightly darker on hover */
  border-color: #7d3c98;
}

.focus-card .btn-primary:active,
.focus-card .btn-primary:focus,
.thoughts-card .btn-primary:active,
.thoughts-card .btn-primary:focus {
  background-color: #6c3483; /* Even darker when active/focused */
  border-color: #6c3483;
  box-shadow: 0 0 0 0.25rem rgba(142, 68, 173, 0.4); /* Custom focus shadow */
}

/* Meetings */
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

/* Style for the delete button */
.btn-link.text-danger {
  opacity: 0.7;
  transition: opacity 0.2s;
}

.btn-link.text-danger:hover {
  opacity: 1;
}

/* Add Meeting button - to match calendar purple */
.meetings-card .btn-primary {
  background-color: #8e44ad; /* Same purple as calendar */
  border-color: #8e44ad;
}

.meetings-card .btn-primary:hover {
  background-color: #7d3c98; /* Slightly darker on hover */
  border-color: #7d3c98;
}

.meetings-card .btn-primary:active,
.meetings-card .btn-primary:focus {
  background-color: #6c3483; /* Even darker when active/focused */
  border-color: #6c3483;
  box-shadow: 0 0 0 0.25rem rgba(142, 68, 173, 0.4); /* Custom focus shadow */
}

/* Other Thoughts */
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

/* Trackers Container */
.trackers-container {
  display: flex;
  flex-direction: column;
  width: 80%;
  margin: 0 auto;
}

/* Tracker Section */
.tracker-section {
  margin-bottom: 1.5rem;
}

/* Mood */
.mood-icon {
  font-size: 2rem;
  cursor: pointer;
  margin: 0 0.5rem;
  transition: color 0.3s ease;
  filter: grayscale(100%);
  color: #adb5bd !important; /* Default gray */
}

/* Active colors for each mood */
.active-sad {
  filter: grayscale(0%);
  color: #ff4d4d !important; /* Red for stressed */
}

.active-neutral {
  filter: grayscale(0%);
  color: #ffc107 !important; /* Yellow for neutral */
}

.active-happy {
  filter: grayscale(0%);
  color: #28a745 !important; /* Green for productive */
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
  width: 32px; /* Increased width */
  height: 40px; /* Increased height */
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
  width: 35px; /* Reduced by 20% from 48px */
  height: 35px; /* Reduced by 20% from 48px */
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
  width: 26px;
  height: 26px;
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

.completed-activity {
  text-decoration: line-through;
  color: #6c757d;
}

.activity-actions {
  display: flex !important;
  align-items: center !important;
  gap: 20px !important;
  justify-content: flex-end !important;
  min-width: 80px;
  flex-direction: row-reverse !important; /* This reverses the visual order */
}

/* Style for the checkbox to ensure it's visible */
.activity-actions .form-check-input {
  width: 18px;
  height: 18px;
  margin-right: 0 !important; /* Remove any right margin */
  flex-shrink: 0; /* Prevent shrinking */
}

/* Style for the trash button to ensure it's visible */
.activity-actions .btn-link {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  margin-left: 0 !important; /* Remove any left margin */
  flex-shrink: 0; /* Prevent shrinking */
}

.image-card {
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.semi-transparent-card {
  background-color: rgba(255, 255, 255, 0.7); /* Slight transparency */
  backdrop-filter: blur(10px); /* Blur effect for background */
  border: 1px solid rgba(255, 255, 255, 0.8);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.semi-transparent-card .card-header {
  background-color: rgba(255, 255, 255, 0.3);
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  font-size: 1.1rem;
}

/* Update card footer styling for transparent look */
.focus-card .card-footer,
.activities-card .card-footer,
.meetings-card .card-footer,
.thoughts-card .card-footer {
  background-color: rgba(255, 255, 255, 0.3);
  border-top: 1px solid rgba(0, 0, 0, 0.1);
}

.activities-card .btn-outline-secondary {
  color: #8e44ad;
  border-color: #8e44ad;
}

.activities-card .btn-outline-secondary:hover {
  background-color: #8e44ad;
  border-color: #8e44ad;
  color: white;
}

.activities-card .btn-outline-secondary:active,
.activities-card .btn-outline-secondary:focus {
  background-color: #7d3c98;
  border-color: #7d3c98;
  box-shadow: 0 0 0 0.25rem rgba(142, 68, 173, 0.4);
}
</style>