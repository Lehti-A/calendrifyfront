<template>
  <div class="container-fluid px-4 pb-4 personal-day-container">
    <!-- Header -->
    <div class="row mb-5 align-items-center header-row">
      <div class="col text-center"><h1 class="mb-1 fw-bold simple-header">PERSONAL DAY PLANNER</h1></div>
    </div>

    <!-- Main Two-Column Layout -->
    <div class="row">
      <!-- Left Column -->
      <div class="col-md-8 left-column">
        <!-- Calendar and Focus -->
        <div class="row mb-4">
          <div class="col-md-3">
            <div class="calendar-card">
              <div class="card-body text-center p-0">
                <div class="calendar-month">{{ currentMonth }}</div>
                <div class="calendar-day">{{ currentDay }}</div>
                <div class="calendar-weekday">{{ currentWeekday }}</div>
              </div>
            </div>
          </div>
          <div class="col-md-9">
            <div class="card semi-transparent-card focus-card">
              <div class="card-header bg-transparent"><strong>Focus for Today</strong></div>
              <div class="card-body focus-body">
                <div class="seamless-input-container">
                  <div v-if="!isEditing && !dailyFocus" class="placeholder-text" @click="startEditing">{{
                      placeholder
                    }}
                  </div>
                  <div v-if="!isEditing && dailyFocus" class="content-text" @click="startEditing">{{ dailyFocus }}</div>
                  <div v-if="isEditing" class="editing-wrapper">
                    <input ref="seamlessInput" type="text" class="seamless-input" v-model="dailyFocus"
                           @blur="handleBlur" @keydown.enter="finishEditing">
                    <div class="focus-button-row">
                      <button class="btn btn-sm btn-primary focus-save-btn" @click.stop="finishEditing" title="Save">
                        Save
                      </button>
                      <button v-if="dailyFocus" class="btn btn-sm btn-outline-danger focus-clear-btn"
                              @click.stop="clearFocus" title="Clear text">Clear
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
            <ul class="list-group list-group-flush" v-if="activities.length > 0">
              <li v-for="activity in activities" :key="activity.activityId"
                  class="list-group-item py-2 d-flex justify-content-between align-items-center">
                <span :class="{ 'completed-activity': activity.isDone }">{{ activity.topic }}</span>
                <div class="activity-actions">
                  <input type="checkbox" class="form-check-input ms-2" :checked="activity.isDone"
                         @change="toggleActivityCompletion(activity.activityId, !activity.isDone)">
                  <button class="btn btn-sm btn-link text-danger p-0" @click="removeActivity(activity.activityId)"
                          title="Remove activity">🗑️
                  </button>
                </div>
              </li>
            </ul>
            <div v-else-if="isLoadingActivities" class="text-center py-3">
              <div class="spinner-border spinner-border-sm" role="status"><span
                  class="visually-hidden">Loading...</span></div>
            </div>
            <div v-else class="card-body text-center py-2"><p class="text-muted my-1">No activities yet</p></div>
          </div>
          <div class="card-footer bg-transparent">
            <div class="input-group">
              <input type="text" class="form-control form-control-sm" placeholder="Add new activity..."
                     v-model="newActivity" @keyup.enter="addActivity">
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
                <textarea class="form-control thoughts-textarea" v-model="otherThoughts"
                          placeholder="Enter your thoughts here..." ref="thoughtsTextarea"></textarea>
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

        <div v-if="showTemplateAlert" class="card semi-transparent-card mb-4 template-alert">
          <div class="card-body">
            <div class="d-flex align-items-center justify-content-between">
              <div>
                <h5 class="mb-2">Personal Goal Templates</h5>
                <p class="mb-3">Would you like to add your personal goal templates for today?</p>
              </div>
              <div class="template-alert-actions">
                <button class="btn btn-primary me-2" @click="acceptTemplateGoals">Yes, add them</button>
                <button class="btn btn-outline-secondary" @click="declineTemplateGoals">No, thanks</button>
              </div>
            </div>
          </div>
        </div>

        <!-- Personal Goals -->
        <div class="card semi-transparent-card mb-4 tasks-card">
          <div class="card-header bg-transparent"><strong>Personal Goals</strong></div>
          <div class="content-container">
            <ul class="list-group list-group-flush" v-if="personalGoals.length > 0">
              <li v-for="goal in personalGoals" :key="goal.id"
                  class="list-group-item d-flex align-items-center justify-content-between">
                <div class="task-text-container" style="flex-grow: 1; margin-right: 10px;">
                  <span :class="{ 'completed-activity': goal.isDone }">{{ goal.topic }}</span>
                </div>
                <div class="task-actions">
                  <input type="checkbox" class="form-check-input" :checked="goal.isDone"
                         @change="toggleGoalCompletion(goal.id, !goal.isDone)">
                  <button class="btn btn-sm btn-link text-danger p-0 ms-2" @click="deleteGoal(goal.id)"
                          title="Remove goal">🗑️
                  </button>
                </div>
              </li>
            </ul>
            <div v-else-if="isLoadingPersonalGoals" class="text-center py-3">
              <div class="spinner-border spinner-border-sm" role="status">
                <span class="visually-hidden">Loading...</span>
              </div>
            </div>
            <div v-else class="card-body text-center py-2">
              <p class="text-muted my-1">No personal goals yet</p>
            </div>
          </div>
          <div class="card-footer bg-transparent">
            <div class="input-group">
              <input type="text" class="form-control form-control-sm" placeholder="Add new personal goal..."
                     v-model="newPersonalGoal" @keyup.enter="addPersonalGoal">
              <button class="btn btn-outline-secondary btn-sm" type="button" @click="addPersonalGoal">Add</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Sidebar Column -->
      <div class="col-md-4 right-column">
        <!-- Image Card -->
        <div class="card mb-4 image-card"
             style="width: 80%; aspect-ratio: 1/1; margin: 0 auto; padding: 0; overflow: hidden; position: relative;">
          <img v-if="!userImageUrl" src="../assets/images/diary.png" class="card-img" alt="Default diary image"/>
          <img v-else :src="userImageUrl" class="card-img" alt="User profile image"/>
          <div v-if="!userImageUrl" class="image-action-button add-button" @click="triggerImageUpload"
               title="Add your picture">+
          </div>
          <div v-else class="image-action-button delete-button" @click="deleteUserImage" title="Remove picture">×
          </div>
          <input type="file" ref="imageInput" @change="handleImageUpload" accept="image/*" style="display: none;"/>
        </div>

        <!-- Meetings -->
        <div class="card semi-transparent-card mb-4 meetings-card">
          <div class="card-header bg-transparent"><strong>Personal Meetings</strong></div>
          <div class="content-container">
            <ul class="list-group list-group-flush" v-if="meetings.length > 0">
              <li v-for="(meeting, index) in meetings" :key="meeting.meetingId || index"
                  class="list-group-item meeting-item" @mouseenter="meeting.showDelete = true"
                  @mouseleave="meeting.showDelete = false">
                <div class="meeting-content">
                  <span class="meeting-info"
                        style="width: calc(100% - 40px); overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">{{
                      meeting.time
                    }} - {{ meeting.title }}</span>
                  <span v-if="meeting.showDelete" @click="removeMeeting(index)" title="Remove meeting"
                        style="position: absolute; right: 15px; top: 50%; transform: translateY(-50%); font-size: 18px; color: #dc3545; width: 25px; height: 25px; background: rgba(255,255,255,0.8); border-radius: 50%; display: flex; justify-content: center; align-items: center; cursor: pointer;">×</span>
                </div>
              </li>
            </ul>
            <div v-else-if="isLoadingMeetings" class="text-center py-3">
              <div class="spinner-border spinner-border-sm" role="status"><span
                  class="visually-hidden">Loading...</span></div>
            </div>
            <div v-else class="card-body text-center py-2"><p class="text-muted my-1">No meetings yet</p></div>
          </div>
          <div class="card-footer bg-transparent">
            <div v-if="meetingTimeAlert.show" class="meeting-time-alert">
              <div class="alert-content">
                <span class="alert-icon">⚠️</span>
                <span class="alert-message">{{ meetingTimeAlert.message }}</span>
              </div>
              <button class="alert-close" @click="meetingTimeAlert.show = false">×</button>
            </div>

            <div class="mb-2"><input type="text" class="form-control form-control-sm"
                                     placeholder="Time (e.g. 14.30, 1430, or 2.30pm)"
                                     v-model="newMeetingTime"></div>
            <div class="mb-2"><input type="text" class="form-control form-control-sm" placeholder="Meeting title"
                                     v-model="newMeetingTitle" @keyup.enter="addMeeting"></div>
            <button class="btn btn-sm btn-primary w-100" @click="addMeeting"
                    :disabled="!newMeetingTime || !newMeetingTitle">Add Meeting
            </button>
          </div>
        </div>

        <!-- Trackers Container -->
        <div class="trackers-container">
          <!-- Water Tracker -->
          <div class="mb-4 tracker-section">
            <h5 class="mb-3 text-center">Glasses of Water</h5>
            <div class="water-icons">
              <div v-for="(glass, index) in 8" :key="index" class="water-glass" @click="setGlasses(index + 1)"
                   title="Glass of Water">
                <div class="glass-container">
                  <div class="water-fill" :style="{ height: index < selectedGlasses ? '90%' : '0%' }"></div>
                </div>
              </div>
            </div>
          </div>

          <!-- Mood Tracker -->
          <div class="mb-4 tracker-section">
            <h5 class="mb-3 text-center">Mood today?</h5>
            <div id="mood-icons" class="text-center">
                <span class="mood-icon" :class="{ 'active-sad': personalMood === 'S' }" @click="updateMood('S')"
                      title="Sad">😢</span>
              <span class="mood-icon" :class="{ 'active-neutral': personalMood === 'N' }" @click="updateMood('N')"
                    title="Neutral">😐</span>
              <span class="mood-icon" :class="{ 'active-happy': personalMood === 'H' }" @click="updateMood('H')"
                    title="Happy">😊</span>
            </div>
          </div>

          <!-- Steps Tracker -->
          <div class="tracker-section">
            <h5 class="mb-4 text-center">Steps</h5>
            <div class="steps-milestones">
              <div v-for="(milestone, index) in milestones" :key="index" class="milestone-item"
                   @click="updateStep(index + 1)" :title="`${milestone.steps} Steps`">
                <div class="checkbox-container" :class="{ 'checked': index < completedStepsMilestone }">
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
import ActivityService from '@/services/ActivityService';
import navigationServices from '@/services/NavigationServices';
import MeetingService from "@/services/MeetingService";
import ImageService from '@/services/ImageService';
import PersonalGoalService from '@/services/PersonalGoalService';
import SharedDateService from '@/services/SharedDateService';
import axios from "axios";

export default {
  name: 'PersonalDayView',

  data: () => ({
    // Core data
    userId: null, dayId: null, selectedDate: null,
    isLoading: false, isLoadingActivities: false, isLoadingMeetings: false,

    // Focus section
    dailyFocus: "", isEditing: false, tempFocus: "", clearButtonClicked: false,
    placeholder: "Click here to set your focus for today...",

    // Other sections
    userImageUrl: null,
    imageId: null,
    isLoadingImage: false,

    otherThoughts: "", editingThoughts: false, tempThoughts: "",
    activities: [], newActivity: "",
    meetings: [], newMeetingTime: '', newMeetingTitle: '',
    meetingTimeAlert: {
      show: false,
      message: ""
    },
    personalMood: null, selectedGlasses: 0, completedStepsMilestone: 0,
    tasks: [], newTask: "",
    personalGoals: [],
    isLoadingPersonalGoals: false,
    newPersonalGoal: "",
    loadedTemplates: false,
    goalCompletionStatus: [],
    showTemplateAlert: false,
    templateGoalsData: null,
    moodId: null,
    date: '',
    stepId: null,
    waterId: null,

    // Constants
    milestones: [
      {steps: 2500, label: "2,500"}, {steps: 5000, label: "5,000"},
      {steps: 7500, label: "7,500"}, {steps: 10000, label: "10,000+"}
    ],
    hasFontAwesome: false
  }),

  computed: {
    currentDay() {
      return (this.selectedDate || new Date()).getDate();
    },

    currentMonth() {
      const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
      return months[(this.selectedDate || new Date()).getMonth()];
    },

    currentWeekday() {
      const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      return days[(this.selectedDate || new Date()).getDay()];
    },

    formattedDate() {
      const d = this.selectedDate || new Date();
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    }
  },
  created() {
    // First check if we came from calendar with a specific date
    const selectedCalendarDate = sessionStorage.getItem('selectedCalendarDate');

    if (selectedCalendarDate) {
      // New date selected from calendar - update our shared date service
      this.selectedDate = new Date(...selectedCalendarDate.split('-').map(Number)
          .map((v, i) => i === 1 ? v - 1 : v));
      SharedDateService.saveDate(this.selectedDate);
      sessionStorage.removeItem('selectedCalendarDate');
    } else {
      // Get date from shared service (could be from Work Day view or default to today)
      this.selectedDate = SharedDateService.getDate();
    }

    this.userId = Number(sessionStorage.getItem('userId') || '1');
  },

  beforeMount() {
    this.dailyFocus = this.otherThoughts = "";
  },

  mounted() {
    this.$nextTick(this.loadSavedData);
  },

  beforeDestroy() {
    this.dailyFocus = this.otherThoughts = "";
    this.dayId = null;
  },

  methods: {

    async loadSavedData() {
      this.isLoading = true;
      try {
        // Get or create day record
        const response = await DayService.addNewDay({
          userId: this.userId, date: this.formattedDate, type: "P"
        });
        const dayData = response.data;
        this.dayId = dayData.dayId;

        // Set focus and thoughts (clear if they just contain date)
        this.dailyFocus = [this.formattedDate, dayData.date].includes(dayData.focus) ? "" : (dayData.focus || "");
        this.otherThoughts = [this.formattedDate, dayData.date].includes(dayData.thoughts) ? "" : (dayData.thoughts || "");

        // Load related data
        this.loadActivities();
        this.loadMeetings();
        this.loadUserImage();
        this.findMood();
        this.findStep();
        this.findWater();
        this.loadPersonalGoals();

        // Reset trackers
        this.tasks = [];
        this.personalMood = null;
        this.selectedGlasses = 0;
        this.completedStepsMilestone = 0;
      } catch (error) {
        console.error("Error loading day data:", error);
        this.dailyFocus = this.otherThoughts = "";
      } finally {
        this.isLoading = false;
      }
    },

    startEditing() {
      this.tempFocus = this.dailyFocus;
      this.isEditing = true;
      this.$nextTick(() => this.$refs.seamlessInput.focus());
    },

    clearFocus(event) {
      if (event) {
        event.preventDefault();
        event.stopPropagation();
      }
      this.dailyFocus = "";
      this.clearButtonClicked = true;
      setTimeout(() => {
        if (this.$refs.seamlessInput) this.$refs.seamlessInput.focus();
      }, 50);
    },

    finishEditing() {
      this.isEditing = false;
      this.dailyFocus = this.dailyFocus.trim();
      if (this.dayId) {
        DayService.updateDayFocus({dayId: this.dayId, focus: this.dailyFocus})
            .catch(error => console.error("Error updating focus:", error));
      }
    },

    handleBlur() {
      setTimeout(() => {
        if (!this.clearButtonClicked) this.finishEditing();
        this.clearButtonClicked = false;
      }, 100);
    },

    startEditingThoughts() {
      this.tempThoughts = this.otherThoughts;
      this.editingThoughts = true;
      this.$nextTick(() => this.$refs.thoughtsTextarea.focus());
    },

    saveThoughts() {
      this.editingThoughts = false;
      if (this.dayId) {
        DayService.updateDayThought({dayId: this.dayId, thoughts: this.otherThoughts})
            .catch(error => console.error("Error updating thoughts:", error));
      }
    },

    cancelEditThoughts() {
      this.otherThoughts = this.tempThoughts;
      this.editingThoughts = false;
    },

    clearThoughts() {
      this.otherThoughts = "";
      this.$nextTick(() => this.$refs.thoughtsTextarea?.focus());
    },

    async loadActivities() {
      if (!this.dayId) return;
      this.isLoadingActivities = true;

      try {
        this.activities = (await ActivityService.getActivities(this.dayId)).data;
      } catch (error) {
        console.error("Error loading activities:", error);
        this.activities = [];
        if (error.response?.status === 403) navigationServices.navigateToErrorView();
      } finally {
        this.isLoadingActivities = false;
      }
    },

    async toggleActivityCompletion(activityId, isDone) {
      try {
        await ActivityService.updateActivityStatus(activityId, isDone);
        const idx = this.activities.findIndex(a => a.activityId === activityId);
        if (idx !== -1) this.activities[idx].isDone = isDone;
        this.loadActivities();
      } catch (error) {
        console.error("Error updating activity status:", error);
        error.response?.status === 403 ?
            navigationServices.navigateToErrorView() : this.loadActivities();
      }
    },

    async removeActivity(activityId) {
      try {
        await ActivityService.deleteActivity(activityId);
        this.activities = this.activities.filter(a => a.activityId !== activityId);
      } catch (error) {
        console.error("Error deleting activity:", error);
        error.response?.status === 403 ?
            navigationServices.navigateToErrorView() : this.loadActivities();
      }
    },

    async addActivity() {
      if (!this.newActivity.trim() || !this.dayId) return;

      try {
        await ActivityService.addActivity({topic: this.newActivity.trim(), dayId: this.dayId});
        this.newActivity = "";
        this.loadActivities();
      } catch (error) {
        console.error("Error adding activity:", error);
        if (error.response?.status === 403) navigationServices.navigateToErrorView();
      }
    },

    async loadUserImage() {
      if (!this.dayId) {
        return;
      }

      this.isLoadingImage = true;

      try {
        const response = await ImageService.getImage(this.dayId);

        if (response.data && response.data.data) {
          this.imageId = response.data.imageId;
          // Convert the data to a URL
          this.userImageUrl = ImageService.byteArrayToDataUrl(response.data.data);
        } else {
          this.userImageUrl = null;
          this.imageId = null;
        }
      } catch (error) {
        // Only clear the image if it's a 404 (IMAGE_NOT_FOUND) error
        if (error.response && error.response.status === 404) {
          this.userImageUrl = null;
          this.imageId = null;
        }
      } finally {
        this.isLoadingImage = false;
      }
    },

    triggerImageUpload() {
      this.$refs.imageInput.click();
    },

    async handleImageUpload(event) {
      const file = event.target.files[0];
      if (!file || !file.type.match('image.*')) return;

      try {
        // Show upload in progress
        const tempUrl = URL.createObjectURL(file);
        this.userImageUrl = tempUrl;

        // Convert file to byte array
        const byteArray = await ImageService.fileToByteArray(file);

        // Upload to backend
        await ImageService.uploadImage(this.dayId, Array.from(byteArray));

        // Wait a moment before reloading (helps with timing issues)
        await new Promise(resolve => setTimeout(resolve, 500));

        // Reload image from server to get the correct imageId
        await this.loadUserImage();
      } catch (error) {
        // Revert on error
        this.userImageUrl = null;
        alert("Failed to upload image. Please try again.");
      }
    },

    async deleteUserImage() {
      if (!this.imageId) return;

      try {
        await ImageService.deleteImage(this.imageId);
        this.userImageUrl = null;
        this.imageId = null;
      } catch (error) {
        // Show error message to user
        alert("Failed to delete image. Please try again.");
      }
    },

    async loadMeetings() {
      if (!this.dayId) return;
      this.isLoadingMeetings = true;

      try {
        const response = await MeetingService.getMeetings(this.dayId);
        this.meetings = response.data.map(meeting => ({
          meetingId: meeting.meetingId,
          time: this.formatTimeFromBackend(meeting.time),
          title: meeting.subject,
          showDelete: false
        }));
      } catch (error) {
        console.error("Error loading meetings:", error);
        this.meetings = [];
        if (error.response?.status === 403) navigationServices.navigateToErrorView();
      } finally {
        this.isLoadingMeetings = false;
      }
    },

    async addMeeting() {
      if (!this.newMeetingTime.trim() || !this.newMeetingTitle.trim() || !this.dayId) return;

      const formattedTime = this.formatTimeInput(this.newMeetingTime.trim());
      if (!formattedTime) {
        this.meetingTimeAlert.message = "Please enter a valid time (e.g., 14.30, 1430, or 2.30pm)";
        this.meetingTimeAlert.show = true;

        // Automatically hide after 4 seconds
        setTimeout(() => {
          this.meetingTimeAlert.show = false;
        }, 4000);

        return;
      }

      try {
        await MeetingService.addMeeting({
          time: formattedTime,
          subject: this.newMeetingTitle.trim(),
          dayId: this.dayId
        });
        this.newMeetingTime = this.newMeetingTitle = '';
        this.loadMeetings();
      } catch (error) {
        console.error("Error adding meeting:", error);
        if (error.response?.status === 403) navigationServices.navigateToErrorView();
      }
    },

    async removeMeeting(index) {
      const meetingId = this.meetings[index].meetingId;
      if (!meetingId) return;

      try {
        await MeetingService.deleteMeeting(meetingId);
        this.meetings.splice(index, 1);
      } catch (error) {
        console.error("Error deleting meeting:", error);
        error.response?.status === 403 ?
            navigationServices.navigateToErrorView() : this.loadMeetings();
      }
    },

    formatTimeFromBackend(time) {
      // Handle different time formats
      if (typeof time === 'string') {
        if (/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(time)) return time;
        if (/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/.test(time)) return time.substring(0, 5);
      }

      if (time && typeof time === 'object' && 'hour' in time && 'minute' in time) {
        return `${String(time.hour).padStart(2, '0')}:${String(time.minute).padStart(2, '0')}`;
      }

      return time || "00:00";
    },

    formatTimeInput(input) {
      input = input.replace(/\s+/g, '');

      // HH:mm format
      if (/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(input))
        return input.length === 4 ? `0${input}` : input;

      // HH.mm format
      if (/^([0-1]?[0-9]|2[0-3])\.([0-5][0-9])$/.test(input)) {
        const [h, m] = input.split('.');
        return `${h.padStart(2, '0')}:${m}`;
      }

      // 4-digit format (HHMM)
      if (/^([0-1][0-9]|2[0-3])([0-5][0-9])$/.test(input))
        return `${input.substring(0, 2)}:${input.substring(2, 4)}`;

      // 3-digit format (HMM)
      if (/^([1-9])([0-5][0-9])$/.test(input))
        return `0${input.charAt(0)}:${input.substring(1, 3)}`;

      // AM/PM formats
      if (/^(1[0-2]|0?[1-9])(:|\.)?([0-5][0-9])?(am|pm|AM|PM)$/.test(input)) {
        const isPM = /pm/i.test(input);
        input = input.replace(/am|pm|AM|PM/g, '');

        let h, m;

        if (input.includes(':') || input.includes('.')) {
          [h, m] = input.split(/[:\.]/);
        } else if (input.length === 3 || input.length === 4) {
          h = input.length === 3 ? input.charAt(0) : input.substring(0, 2);
          m = input.length === 3 ? input.substring(1, 3) : input.substring(2, 4);
        } else {
          h = input;
          m = "00";
        }

        // Convert to 24-hour
        if (isPM && parseInt(h) < 12) h = (parseInt(h) + 12).toString();
        if (!isPM && h === "12") h = "00";

        return `${h.padStart(2, '0')}:${m.padStart(2, '0')}`;
      }

      return null;
    },

    async findWater() {
      try {
        // Make sure we have the day setup first
        if (!this.dayId) {
          const response = await DayService.addNewDay({
            userId: this.userId, date: this.formattedDate, type: "P"
          });
          this.dayId = response.data.dayId;
        }
        // Get water data using userId and date
        const waterResponse = await axios.get('/water', {
          params: {
            userId: this.userId,
            date: this.formattedDate
          }
        });

        if (waterResponse.data && waterResponse.data.waterId) {
          this.waterId = waterResponse.data.waterId;
          if (waterResponse.data.count) {
            this.selectedGlasses = parseInt(waterResponse.data.count);
          } else {
            this.selectedGlasses = 0;
          }
        } else {
          // Reset if no data found
          this.waterId = null;
          this.selectedGlasses = 0;
        }
      } catch (error) {
        console.error("Error fetching water data:", error);
        this.waterId = null;
        this.selectedGlasses = 0;
        if (error.response?.status === 403) {
          navigationServices.navigateToErrorView();
        }
      }
    },

    async updateWater(glassCount) {
      // Update UI immediately
      this.selectedGlasses = glassCount;

      try {
        if (!this.waterId) {
          console.error("Water ID is missing!");
          await this.findWater(); // Try to get the waterId first
          if (!this.waterId) return; // Exit if still no waterId
        }

        await axios.patch('/water', null, {
          params: {
            waterId: this.waterId,
            count: glassCount
          }
        });

        // Optionally refresh data to ensure consistency
        // await this.findWater();
      } catch (error) {
        console.error("Error updating water count:", error);
        // Reset UI state on error by fetching current data
        await this.findWater();
        navigationServices.navigateToErrorView();
      }
    },

    async setGlasses(count) {
      await this.updateWater(count);
    },

    async findMood() {
      try {
        const response = await DayService.addNewDay({
          userId: this.userId, date: this.formattedDate, type: "P"
        });
        this.dayId = response.data.dayId;

        const moodResponse = await axios.get('/mood', {params: {dayId: this.dayId}});
        if (moodResponse.data) {
          this.personalMood = moodResponse.data.state;
          this.moodId = moodResponse.data.moodId;  // Ensure moodId is set correctly
        }
      } catch (error) {
        navigationServices.navigateToErrorView();
      }
    },

    async updateMood(newMood) {
      this.personalMood = newMood; // Update state before making the request

      if (!this.moodId) {
        console.error("Mood ID is missing!");
        return;
      }

      try {
        await axios.patch('/mood', null, {
          params: {moodId: this.moodId, state: this.personalMood}
        });
      } catch (error) {
        console.error("Error updating mood:", error);
        navigationServices.navigateToErrorView();
      }
    },

    async findStep() {
      try {
        // Make sure we have the day setup first
        if (!this.dayId) {
          const response = await DayService.addNewDay({
            userId: this.userId, date: this.formattedDate, type: "P"
          });
          this.dayId = response.data.dayId;
        }

        // Get step data using userId and date
        const stepResponse = await axios.get('/step', {
          params: {
            userId: this.userId,
            date: this.formattedDate
          }
        });

        if (stepResponse.data && stepResponse.data.stepId) {
          this.stepId = stepResponse.data.stepId;
          // Convert step count to milestone index (1-4)
          if (stepResponse.data.count) {
            const count = parseInt(stepResponse.data.count);
            this.completedStepsMilestone = count;
          } else {
            this.completedStepsMilestone = 0;
          }
        } else {
          // Reset if no data found
          this.stepId = null;
          this.completedStepsMilestone = 0;
        }
      } catch (error) {
        console.error("Error fetching step data:", error);
        this.stepId = null;
        this.completedStepsMilestone = 0;
        if (error.response?.status === 403) {
          navigationServices.navigateToErrorView();
        }
      }
    },

    async updateStep(newStep) {
      // Update UI immediately for better user experience
      this.completedStepsMilestone = newStep;

      try {
        if (!this.stepId) {
          console.error("Step ID is missing!");
          await this.findStep(); // Try to get the stepId first
          if (!this.stepId) return; // Exit if still no stepId
        }

        // Looking at the service code, your backend expects stepId and count as parameters
        // This likely means they're expected as query parameters, not in the body
        await axios.patch('/step', null, {
          params: {
            stepId: this.stepId,
            count: newStep
          }
        });

        // Optionally refresh data to ensure consistency
        // await this.findStep();
      } catch (error) {
        console.error("Error updating step count:", error);
        // Reset UI state on error by fetching current data
        await this.findStep();
        navigationServices.navigateToErrorView();
      }
    },

    async setStepsMilestone(milestone) {
      await this.updateStep(milestone);
    },

    loadPersonalGoals() {
      if (!this.dayId) return;

      this.isLoadingPersonalGoals = true;

      PersonalGoalService.getPersonalGoals(this.dayId)
          .then(response => {
            this.personalGoals = response.data;

            // If we have no goals and haven't loaded templates yet,
            // offer to create goals from templates
            if (this.personalGoals.length === 0 && !this.loadedTemplates) {
              this.offerTemplateGoals();
            }
          })
          .catch(error => {
            console.error("Error loading personal goals:", error);
            this.personalGoals = [];
            if (error.response?.status === 403) {
              navigationServices.navigateToErrorView();
            }
          })
          .finally(() => {
            this.isLoadingPersonalGoals = false;
          });
    },

    offerTemplateGoals() {
      // Only show this if we have a userId
      if (!this.userId) return;

      this.loadedTemplates = true;

      PersonalGoalService.getPersonalGoalTemplates(this.userId)
          .then(response => {
            const templates = response.data;

            // If we have templates and no goals yet, show the custom alert
            if (templates.length > 0) {
              this.templateGoalsData = templates;
              this.showTemplateAlert = true;
            }
          })
          .catch(error => {
            console.error("Error loading personal goal templates:", error);
          });
    },

    acceptTemplateGoals() {
      this.showTemplateAlert = false;
      if (this.templateGoalsData && this.templateGoalsData.length > 0) {
        this.createGoalsFromTemplates(this.templateGoalsData);
      }
    },

    declineTemplateGoals() {
      this.showTemplateAlert = false;
      this.templateGoalsData = null;
    },

    createGoalsFromTemplates(templates) {
      if (!this.dayId) return;

      this.isLoadingPersonalGoals = true;

      PersonalGoalService.createGoalsFromTemplates(templates, this.dayId)
          .then(() => {
            // Reload goals after creating them
            this.loadPersonalGoals();
          })
          .catch(error => {
            console.error("Error creating goals from templates:", error);
            this.isLoadingPersonalGoals = false;
          });
    },

    toggleGoalCompletion(personalGoalId, isDone) {
      // Find the goal in our array
      const goalIndex = this.personalGoals.findIndex(goal => goal.id === personalGoalId);
      if (goalIndex === -1) return;

      // Optimistic update - change UI immediately
      this.personalGoals[goalIndex].isDone = isDone;

      // Send update to backend
      PersonalGoalService.updatePersonalGoalStatus(personalGoalId, isDone)
          .catch(error => {
            console.error("Error updating goal completion status:", error);

            // Revert UI change on error
            this.personalGoals[goalIndex].isDone = !isDone;

            if (error.response?.status === 403) {
              navigationServices.navigateToErrorView();
            }
          });
    },

    addPersonalGoal() {
      if (!this.newPersonalGoal.trim() || !this.dayId) return;

      const newGoal = {
        topic: this.newPersonalGoal.trim()
      };

      PersonalGoalService.addPersonalGoal(newGoal, this.dayId)
          .then(() => {
            // Clear input and reload goals to get the newly added goal
            this.newPersonalGoal = "";
            this.loadPersonalGoals();
          })
          .catch(error => {
            console.error("Error adding personal goal:", error);
            if (error.response?.status === 403) {
              navigationServices.navigateToErrorView();
            }
          });
    },

    deleteGoal(personalGoalId) {
      // Find the goal in our array
      const goalIndex = this.personalGoals.findIndex(goal =>
          (goal.id === personalGoalId || goal.personalGoalId === personalGoalId)
      );
      if (goalIndex === -1) {
        console.error("Goal not found with ID:", personalGoalId);
        return;
      }

      // Delete immediately without confirmation
      PersonalGoalService.deletePersonalGoal(personalGoalId)
          .then(() => {
            // Remove from local array
            this.personalGoals.splice(goalIndex, 1);
          })
          .catch(error => {
            console.error("Error deleting personal goal:", error);
            if (error.response?.status === 403) {
              navigationServices.navigateToErrorView();
            } else {
              // Reload goals to ensure UI is in sync with backend
              this.loadPersonalGoals();
            }
          });
    }

  }
};
</script>

<style src="@/assets/css/personal-day-view.css" scoped></style>