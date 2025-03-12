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

        <!-- Template Section: Personal Goals -->
        <div class="card semi-transparent-card mb-4 tasks-card">
          <div class="card-header bg-transparent"><strong>Personal Goals</strong></div>
          <div class="content-container">
            <ul class="list-group list-group-flush">
              <li v-for="(task, index) in tasks" :key="index"
                  class="list-group-item d-flex align-items-center justify-content-between">
                <!-- Task text with conditional edit input -->
                <div class="task-text-container" style="flex-grow: 1; margin-right: 10px;">
                  <!-- Display task text when not editing -->
                  <span
                      v-if="!task.isEditing"
                      :class="{ 'completed-task': task.completed }"
                      @click="startEditingTask(index)"
                      style="cursor: text; display: block; width: 100%;"
                  >{{ task.text }}</span>

                  <!-- Edit input when editing -->
                  <input
                      v-if="task.isEditing"
                      type="text"
                      class="form-control form-control-sm"
                      v-model="task.text"
                      @blur="finishEditingTask(index)"
                      @keyup.enter="finishEditingTask(index)"
                      ref="taskInput"
                      style="width: 100%;"
                  >
                </div>

                <!-- Only keep the checkbox in task-actions -->
                <div class="task-actions">
                  <input
                      type="checkbox"
                      class="form-check-input"
                      :checked="task.completed"
                      @change="toggleTaskCompletion(index)"
                  >
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <!-- Right Sidebar Column (Image, Meetings, Mood, Glasses, Steps) -->
      <div class="col-md-4 right-column">
        <!-- Image Card - With diary default image and upload functionality -->
        <div class="card mb-4 image-card" style="width: 80%; aspect-ratio: 1/1; margin: 0 auto; padding: 0; overflow: hidden; position: relative;">
          <!-- Default diary image shown when no user image is available -->
          <img v-if="!userImageUrl" src="../assets/images/diary.png" class="card-img" alt="Default diary image" />

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
import DayService from '@/services/DayService';

export default {
  name: 'PersonalDayView',
  created() {
    // Determine if we came from calendar or directly
    const selectedCalendarDate = sessionStorage.getItem('selectedCalendarDate');
    if (selectedCalendarDate) {
      // Parse the date string back to a Date object
      const [year, month, day] = selectedCalendarDate.split('-').map(Number);
      this.selectedDate = new Date(year, month - 1, day);

      // Clear the stored date once it's been used
      sessionStorage.removeItem('selectedCalendarDate');
    } else {
      // Default to today if no date was passed
      this.selectedDate = new Date();
    }

    this.userId = Number(sessionStorage.getItem('userId') || '1'); // Fallback to user 1 if not set

    // Load saved data from backend
    this.loadSavedData();
  },

  data() {
    return {
      // Backend integration properties
      userId: null,
      dayId: null,
      selectedDate: null,
      isLoading: false,

      // Focus section
      dailyFocus: "",
      isEditing: false,
      tempFocus: "",
      clearButtonClicked: false,
      placeholder: "Click here to set your focus for today...",

      // Profile image
      userImageUrl: null,

      // Meetings section
      meetings: [],
      newMeetingTime: '',
      newMeetingTitle: '',

      // Other thoughts section
      otherThoughts: "",
      editingThoughts: false,
      tempThoughts: "",

      // Mood tracker
      personalMood: null,

      // Water tracker
      selectedGlasses: 0,

      // Steps tracker
      completedStepsMilestone: 0,
      milestones: [
        {steps: 2500, label: "2,500"},
        {steps: 5000, label: "5,000"},
        {steps: 7500, label: "7,500"},
        {steps: 10000, label: "10,000+"}
      ],

      // Activities section
      activities: [],
      newActivity: "",

      // Tasks/goals section
      tasks: [],
      newTask: "",

      hasFontAwesome: false // Set to true if you have Font Awesome included
    };
  },

  computed: {
    currentDay() {
      return this.selectedDate ? this.selectedDate.getDate() : new Date().getDate();
    },
    currentMonth() {
      const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
      ];
      const date = this.selectedDate || new Date();
      return months[date.getMonth()];
    },
    currentWeekday() {
      const days = [
        'Sunday', 'Monday', 'Tuesday', 'Wednesday',
        'Thursday', 'Friday', 'Saturday'
      ];
      const date = this.selectedDate || new Date();
      return days[date.getDay()];
    },
    // Format date for API calls in YYYY-MM-DD format
    formattedDate() {
      const date = this.selectedDate || new Date();
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    }
  },

  methods: {
    async loadSavedData() {
      this.isLoading = true;
      try {
        // Create/get a day record for this date
        const newDay = {
          userId: this.userId,
          date: this.formattedDate,
          type: "P" // P for Personal day
        };

        const response = await DayService.addNewDay(newDay);
        const dayData = response.data;

        console.log("Backend response:", dayData);

        // Store the dayId for future updates - making sure we're using the right property name
        this.dayId = dayData.dayId;

        // Set the data from backend, ensuring we don't use any date-related content
        if (dayData.focus === this.formattedDate || dayData.focus === dayData.date) {
          this.dailyFocus = "";
        } else {
          this.dailyFocus = dayData.focus || "";
        }

        // Check if thoughts contains just the date string and clear it if so
        if (dayData.thoughts === this.formattedDate || dayData.thoughts === dayData.date) {
          this.otherThoughts = "";
        } else {
          this.otherThoughts = dayData.thoughts || "";
        }

        // We'll implement backend calls for these later
        // For now just initialize them as empty
        this.activities = [];
        this.meetings = [];
        this.tasks = [];
        this.personalMood = null;
        this.selectedGlasses = 0;
        this.completedStepsMilestone = 0;

        // Load the user image - still using localStorage for now
        this.loadUserImage();
      } catch (error) {
        console.error("Error loading day data:", error);
        // Ensure fields are empty if there's an error
        this.dailyFocus = "";
        this.otherThoughts = "";
      } finally {
        this.isLoading = false;
      }
    },
    // Focus methods
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

    // Save focus to backend
    async finishEditing() {
      this.isEditing = false;
      this.dailyFocus = this.dailyFocus.trim();

      if (this.dayId) {
        try {
          console.log("Saving focus with dayId:", this.dayId, "content:", this.dailyFocus);
          const updateData = {
            dayId: this.dayId, // Changed from id to dayId
            focus: this.dailyFocus
          };
          await DayService.updateDayFocus(updateData);
        } catch (error) {
          console.error("Error updating focus:", error);
        }
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

    // Activity methods - will be updated for backend integration later
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

    // Image methods
    triggerImageUpload() {
      this.$refs.imageInput.click();
    },

    handleImageUpload(event) {
      const file = event.target.files[0];
      if (file && file.type.match('image.*')) {
        const reader = new FileReader();

        reader.onload = (e) => {
          this.userImageUrl = e.target.result;
          // Still using localStorage for images until we implement backend storage
          localStorage.setItem('personalProfileImage', this.userImageUrl);
        };

        reader.readAsDataURL(file);
      }
    },

    deleteUserImage() {
      this.userImageUrl = null;
      localStorage.removeItem('personalProfileImage');
    },

    loadUserImage() {
      const savedImage = localStorage.getItem('personalProfileImage');
      if (savedImage) {
        this.userImageUrl = savedImage;
      }
    },

    // Meeting methods - will be updated for backend integration later
    addMeeting() {
      if (this.newMeetingTime.trim() && this.newMeetingTitle.trim()) {
        this.meetings.push({
          time: this.newMeetingTime.trim(),
          title: this.newMeetingTitle.trim(),
          showDelete: false
        });
        this.newMeetingTime = '';
        this.newMeetingTitle = '';
      }
    },

    removeMeeting(index) {
      this.meetings.splice(index, 1);
    },

    // Thoughts methods
    startEditingThoughts() {
      this.tempThoughts = this.otherThoughts; // Save current value in case user cancels
      this.editingThoughts = true;
      // Use nextTick to ensure the textarea exists in the DOM before focusing
      this.$nextTick(() => {
        this.$refs.thoughtsTextarea.focus();
      });
    },

    // Save thoughts to backend
    async saveThoughts() {
      this.editingThoughts = false;

      if (this.dayId) {
        try {
          console.log("Saving thoughts with dayId:", this.dayId, "content:", this.otherThoughts);
          const updateData = {
            dayId: this.dayId, // Changed from id to dayId
            thoughts: this.otherThoughts
          };
          await DayService.updateDayThought(updateData);
        } catch (error) {
          console.error("Error updating thoughts:", error);
        }
      } else {
        console.error("Cannot update thoughts: No dayId available");
      }
    },

    cancelEditThoughts() {
      this.otherThoughts = this.tempThoughts; // Restore previous value
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

    // Mood tracker - will be updated for backend integration later
    setMood(mood) {
      this.personalMood = mood;
    },

    // Water tracker - will be updated for backend integration later
    setGlasses(count) {
      this.selectedGlasses = count;
    },

    // Steps tracker - will be updated for backend integration later
    setStepsMilestone(milestone) {
      this.completedStepsMilestone = milestone;
    },

    // Task/goals methods - will be updated for backend integration later
    startEditingTask(index) {
      // First, make sure all tasks have the isEditing property
      this.tasks.forEach((task, i) => {
        if (typeof task.isEditing === 'undefined') {
          this.tasks[i].isEditing = false;
        }
      });

      // Set the current task to editing mode
      this.tasks[index].isEditing = true;

      // Focus the input on the next render cycle
      this.$nextTick(() => {
        // Focus the input if refs are available
        if (this.$refs.taskInput && this.$refs.taskInput[index]) {
          this.$refs.taskInput[index].focus();
        }
      });
    },

    finishEditingTask(index) {
      // Exit editing mode
      this.tasks[index].isEditing = false;

      // Remove the task if empty
      if (!this.tasks[index].text.trim()) {
        this.tasks.splice(index, 1);
      }
    },

    toggleTaskCompletion(index) {
      // Toggle the completed state
      this.tasks[index].completed = !this.tasks[index].completed;

      // Make sure the isEditing property is preserved
      if (typeof this.tasks[index].isEditing === 'undefined') {
        this.tasks[index].isEditing = false;
      }
    }
  }
};
</script>

<style src="@/assets/css/personaldayview.css" scoped></style>