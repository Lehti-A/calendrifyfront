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
                <div class="seamless-input-container">
                  <!-- Placeholder text shown when no focus and not editing -->
                  <div
                      v-if="!isEditing && !dailyFocus"
                      class="placeholder-text"
                      @click="startEditing"
                  >{{ placeholder }}
                  </div>

                  <!-- Existing content shown when not editing -->
                  <div
                      v-if="!isEditing && dailyFocus"
                      class="content-text"
                      @click="startEditing"
                  >{{ dailyFocus }}
                  </div>

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
        <!-- Image Card - With diary default image and upload functionality -->
        <div class="card mb-4 image-card"
             style="width: 80%; aspect-ratio: 1/1; margin: 0 auto; padding: 0; overflow: hidden; position: relative;">
          <!-- Default diary image shown when no user image is available -->
          <img v-if="!userImageUrl" src="../assets/images/diary.png" class="card-img" alt="Default diary image"/>

          <!-- User uploaded image shown when available -->
          <img v-else :src="userImageUrl" class="card-img" alt="User profile image"/>

          <!-- Add button - only shown with default image -->
          <div v-if="!userImageUrl" class="image-action-button add-button" @click="triggerImageUpload"
               title="Add your picture">
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
      isEditing: false,
      tempFocus: "",
      clearButtonClicked: false,
      placeholder: "Click here to set your focus for today...",
      userImageUrl: null,

      // Other thoughts section
      otherThoughts: "",
      editingThoughts: false,
      tempThoughts: "",

      // Activities section (formerly workTasks)
      activities: [
        {text: "Prepare for team meeting", completed: false},
      ],
      newActivity: "",

      // Meetings section
      meetings: [

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

      const savedThoughts = localStorage.getItem('workThoughts');
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

      // Load user profile image
      const savedImage = localStorage.getItem('workProfileImage');
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
          // Save to localStorage for persistence - use a different key for work view
          localStorage.setItem('workProfileImage', this.userImageUrl);
        };

        reader.readAsDataURL(file);
      }
    },

    // Delete the user image and revert to default
    deleteUserImage() {
        this.userImageUrl = null;
        localStorage.removeItem('workProfileImage');
    },

    // Load the user image from localStorage if available
    loadUserImage() {
      const savedImage = localStorage.getItem('workProfileImage');
      if (savedImage) {
        this.userImageUrl = savedImage;
      }
    },


// Focus section methods
    startEditing() {
      this.tempFocus = this.dailyFocus; // Store for cancellation
      this.isEditing = true;
      this.$nextTick(() => {
        this.$refs.seamlessInput.focus();
      });
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
        localStorage.setItem('workDailyFocus', this.dailyFocus);
      } else {
        localStorage.removeItem('workDailyFocus');
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
      localStorage.setItem('workThoughts', this.otherThoughts);
    },
    cancelEditThoughts() {
      this.otherThoughts = this.tempThoughts;
      this.editingThoughts = false;
    },
    clearThoughts() {
      // Clear the text but keep editing mode active
      this.otherThoughts = "";
      this.$nextTick(() => {
        if (this.$refs.thoughtsTextarea) {
          this.$refs.thoughtsTextarea.focus();
        }
      });
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
    // Work mood method (specific to work day)
    setWorkMood(mood) {
      this.workMood = mood;
      localStorage.setItem('workMood', mood);
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

<style src="@/assets/css/workdayview.css" scoped></style>