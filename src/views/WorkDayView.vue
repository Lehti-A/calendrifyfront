<template>
  <div class="container-fluid px-4 pb-4 work-day-container">
    <div class="row mb-5 align-items-center header-row">
      <div class="col text-center">
        <h1 class="mb-1 fw-bold simple-header">WORK DAY PLANNER</h1>
      </div>
    </div>

    <!-- Main Two-Column Layout -->
    <div class="row">
      <!-- Left Main Column -->
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
                  <div v-if="!isEditing && !dailyFocus" class="placeholder-text" @click="startEditing">{{ placeholder }}</div>
                  <div v-if="!isEditing && dailyFocus" class="content-text" @click="startEditing">{{ dailyFocus }}</div>
                  <div v-if="isEditing" class="editing-wrapper">
                    <input ref="seamlessInput" type="text" class="seamless-input" v-model="dailyFocus"
                           @blur="handleBlur" @keydown.enter="finishEditing">
                    <div class="focus-button-row">
                      <button class="btn btn-sm btn-primary focus-save-btn" @click.stop="finishEditing"
                              title="Save" type="button">Save</button>
                      <button v-if="dailyFocus" class="btn btn-sm btn-outline-danger focus-clear-btn"
                              @click.stop="clearFocus" title="Clear text" type="button">Clear</button>
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
                  <button class="btn btn-sm btn-link text-danger p-0"
                          @click="removeActivity(activity.activityId)" title="Remove activity">🗑️</button>
                </div>
              </li>
            </ul>
            <div v-else-if="isLoadingActivities" class="text-center py-3">
              <div class="spinner-border spinner-border-sm" role="status">
                <span class="visually-hidden">Loading...</span>
              </div>
            </div>
            <div v-else class="card-body text-center py-2">
              <p class="text-muted my-1">No activities yet</p>
            </div>
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
                  <button v-if="otherThoughts" class="btn btn-sm btn-outline-danger float-end"
                          @click="clearThoughts">Clear</button>
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
                <div v-for="(glass, index) in 8" :key="index" class="water-glass"
                     @click="setGlasses(index + 1)" title="Glass of Water">
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
                <span class="mood-icon" :class="{ 'active-sad': workMood === 'S' }" @click="updateMood('S')" title="Sad">😢</span>
                <span class="mood-icon" :class="{ 'active-neutral': workMood === 'N' }" @click="updateMood('N')" title="Neutral">😐</span>
                <span class="mood-icon" :class="{ 'active-happy': workMood === 'H' }" @click="updateMood('H')" title="Happy">😊</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Sidebar Column -->
      <div class="col-md-4 right-column">
        <!-- Image Card -->
        <div class="card mb-4 image-card" style="width: 80%; aspect-ratio: 1/1; margin: 0 auto; padding: 0; overflow: hidden; position: relative;">
          <img v-if="!userImageUrl" src="../assets/images/diary.png" class="card-img" alt="Default diary image"/>
          <img v-else :src="userImageUrl" class="card-img" alt="User profile image"/>
          <div v-if="!userImageUrl" class="image-action-button add-button" @click="triggerImageUpload"
               title="Add your picture">+</div>
          <div v-else class="image-action-button delete-button" @click="deleteUserImage"
               title="Remove picture">×</div>
          <input type="file" ref="imageInput" @change="handleImageUpload"
                 accept="image/*" style="display: none;"/>
        </div>

        <!-- Meetings -->
        <div class="card semi-transparent-card mb-4 meetings-card">
          <div class="card-header bg-transparent"><strong>Work Meetings</strong></div>
          <div class="content-container">
            <ul class="list-group list-group-flush" v-if="meetings.length > 0">
              <li v-for="(meeting, index) in meetings" :key="meeting.meetingId || index"
                  class="list-group-item meeting-item"
                  @mouseenter="meeting.showDelete = true"
                  @mouseleave="meeting.showDelete = false">
                <div class="meeting-content">
                  <span class="meeting-info" style="width: calc(100% - 40px); overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                    {{ meeting.time }} - {{ meeting.title }}
                  </span>
                  <span v-if="meeting.showDelete" @click="removeMeeting(index)" title="Remove meeting"
                        style="position: absolute; right: 15px; top: 50%; transform: translateY(-50%); font-size: 18px; color: #dc3545; width: 25px; height: 25px; background: rgba(255,255,255,0.8); border-radius: 50%; display: flex; justify-content: center; align-items: center; cursor: pointer;">×</span>
                </div>
              </li>
            </ul>
            <div v-else-if="isLoadingMeetings" class="text-center py-3">
              <div class="spinner-border spinner-border-sm" role="status">
                <span class="visually-hidden">Loading...</span>
              </div>
            </div>
            <div v-else class="card-body text-center py-2">
              <p class="text-muted my-1">No meetings yet</p>
            </div>
          </div>
          <div class="card-footer bg-transparent">
            <div class="mb-2">
              <input type="text" class="form-control form-control-sm"
                     placeholder="Time (e.g. 14:00, 14.30, 2:30pm)" v-model="newMeetingTime">
            </div>
            <div class="mb-2">
              <input type="text" class="form-control form-control-sm"
                     placeholder="Meeting title" v-model="newMeetingTitle" @keyup.enter="addMeeting">
            </div>
            <button class="btn btn-sm btn-primary w-100" @click="addMeeting"
                    :disabled="!newMeetingTime || !newMeetingTitle">Add Meeting</button>
          </div>
        </div>

        <!-- Trackers Container -->
        <div class="trackers-container">
          <!-- Steps Tracker -->
          <div class="tracker-section">
            <h5 class="mb-4 text-center">Steps</h5>
            <div class="steps-milestones">
              <div v-for="(milestone, index) in milestones" :key="index" class="milestone-item"
                   @click="setStepsMilestone(index + 1)" :title="`${milestone.steps} Steps`">
                <div class="checkbox-container" :class="{ 'checked': index < completedStepsMilestone }">
                  <svg v-if="index < completedStepsMilestone" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                       fill="white" class="checkmark-icon">
                    <path fill-rule="evenodd" d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 011.04-.208z"
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
import ActivityService from "@/services/ActivityService";
import navigationServices from "@/services/NavigationServices";
import MeetingService from "@/services/MeetingService";
import axios from "axios";

export default {
  name: 'WorkDayView',
  beforeMount() { this.dailyFocus = ""; this.otherThoughts = ""; },
  created() {
    const selectedCalendarDate = sessionStorage.getItem('selectedCalendarDate');
    if (selectedCalendarDate) {
      const [year, month, day] = selectedCalendarDate.split('-').map(Number);
      this.selectedDate = new Date(year, month - 1, day);
      sessionStorage.removeItem('selectedCalendarDate');
    } else {
      this.selectedDate = new Date();
    }
    this.userId = Number(sessionStorage.getItem('userId') || '1');
  },
  mounted() { this.$nextTick(() => this.loadSavedData()); },
  beforeDestroy() { this.dailyFocus = ""; this.otherThoughts = ""; this.dayId = null; },

  data: () => ({
    // Backend properties
    userId: null, dayId: null, selectedDate: null, isLoading: false,
    // Focus section
    dailyFocus: "", isEditing: false, tempFocus: "", clearButtonClicked: false,
    placeholder: "Click here to set your focus for today...",
    // Profile image
    userImageUrl: null,
    // Other thoughts section
    otherThoughts: "", editingThoughts: false, tempThoughts: "",
    // Activities section
    activities: [], newActivity: "", isLoadingActivities: false,
    // Meetings section
    meetings: [], newMeetingTime: '', newMeetingTitle: '', isLoadingMeetings: false,
    // Work mood tracker
    workMood: null,
    // Trackers
    selectedGlasses: 0, completedStepsMilestone: 0,
    milestones: [
      {steps: 2500, label: "2,500"}, {steps: 5000, label: "5,000"},
      {steps: 7500, label: "7,500"}, {steps: 10000, label: "10,000+"}
    ],
    hasFontAwesome: false,

    //todo Lehti lisatud
    moodId: null,


  }),

  computed: {
    currentDay() { return this.selectedDate ? this.selectedDate.getDate() : new Date().getDate(); },
    currentMonth() {
      const months = ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'];
      return months[(this.selectedDate || new Date()).getMonth()];
    },
    currentWeekday() {
      const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      return days[(this.selectedDate || new Date()).getDay()];
    },
    formattedDate() {
      const date = this.selectedDate || new Date();
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    }
  },

  methods: {
    // ===== DATA LOADING =====
    async loadSavedData() {
      this.isLoading = true;
      try {
        const response = await DayService.addNewDay({
          userId: this.userId,
          date: this.formattedDate,
          type: "W"
        });
        const dayData = response.data;

        this.dayId = dayData.dayId;
        this.dailyFocus = (dayData.focus === this.formattedDate || dayData.focus === dayData.date)
            ? "" : (dayData.focus || "");
        this.otherThoughts = (dayData.thoughts === this.formattedDate || dayData.thoughts === dayData.date)
            ? "" : (dayData.thoughts || "");

        this.loadActivities();
        this.loadMeetings();
        this.loadUserImage();
        this.findMood();

        this.workMood = null;
        this.selectedGlasses = 0;
        this.completedStepsMilestone = 0;

        this.loadUserImage();
      } catch (error) {
        console.error("Error loading day data:", error);
        this.dailyFocus = "";
        this.otherThoughts = "";
      } finally {
        this.isLoading = false;
      }
    },

    // ===== FOCUS METHODS =====
    startEditing() {
      this.tempFocus = this.dailyFocus;
      this.isEditing = true;
      this.$nextTick(() => this.$refs.seamlessInput.focus());
    },

    clearFocus(event) {
      if (event) { event.preventDefault(); event.stopPropagation(); }
      this.dailyFocus = "";
      this.clearButtonClicked = true;
      setTimeout(() => {
        if (this.$refs.seamlessInput) this.$refs.seamlessInput.focus();
      }, 50);
    },

    async finishEditing() {
      this.isEditing = false;
      this.dailyFocus = this.dailyFocus.trim();
      if (this.dayId) {
        try {
          await DayService.updateDayFocus({
            dayId: this.dayId,
            focus: this.dailyFocus
          });
        } catch (error) {
          console.error("Error updating focus:", error);
        }
      }
    },

    handleBlur() {
      setTimeout(() => {
        if (!this.clearButtonClicked) this.finishEditing();
        this.clearButtonClicked = false;
      }, 100);
    },

    // ===== THOUGHTS METHODS =====
    startEditingThoughts() {
      this.tempThoughts = this.otherThoughts;
      this.editingThoughts = true;
      this.$nextTick(() => this.$refs.thoughtsTextarea.focus());
    },

    async saveThoughts() {
      this.editingThoughts = false;
      if (this.dayId) {
        try {
          await DayService.updateDayThought({
            dayId: this.dayId,
            thoughts: this.otherThoughts
          });
        } catch (error) {
          console.error("Error updating thoughts:", error);
        }
      }
    },

    cancelEditThoughts() {
      this.otherThoughts = this.tempThoughts;
      this.editingThoughts = false;
    },

    clearThoughts() {
      this.otherThoughts = "";
      this.$nextTick(() => {
        if (this.$refs.thoughtsTextarea) this.$refs.thoughtsTextarea.focus();
      });
    },

    // ===== ACTIVITY METHODS =====
    async loadActivities() {
      if (!this.dayId) return;
      this.isLoadingActivities = true;
      try {
        const response = await ActivityService.getActivities(this.dayId);
        this.activities = response.data;
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
        const activityIndex = this.activities.findIndex(a => a.activityId === activityId);
        if (activityIndex !== -1) this.activities[activityIndex].isDone = isDone;
        this.loadActivities();
      } catch (error) {
        console.error("Error updating activity:", error);
        if (error.response?.status === 403) navigationServices.navigateToErrorView();
        else this.loadActivities();
      }
    },

    async removeActivity(activityId) {
      try {
        await ActivityService.deleteActivity(activityId);
        this.activities = this.activities.filter(a => a.activityId !== activityId);
      } catch (error) {
        console.error("Error deleting activity:", error);
        if (error.response?.status === 403) navigationServices.navigateToErrorView();
        else this.loadActivities();
      }
    },

    async addActivity() {
      if (!this.newActivity.trim() || !this.dayId) return;
      try {
        await ActivityService.addActivity({
          topic: this.newActivity.trim(),
          dayId: this.dayId
        });
        this.newActivity = "";
        this.loadActivities();
      } catch (error) {
        console.error("Error adding activity:", error);
        if (error.response?.status === 403) navigationServices.navigateToErrorView();
      }
    },

    // ===== IMAGE METHODS =====
    triggerImageUpload() { this.$refs.imageInput.click(); },

    handleImageUpload(event) {
      const file = event.target.files[0];
      if (file && file.type.match('image.*')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.userImageUrl = e.target.result;
          localStorage.setItem('workProfileImage', this.userImageUrl);
        };
        reader.readAsDataURL(file);
      }
    },

    deleteUserImage() {
      this.userImageUrl = null;
      localStorage.removeItem('workProfileImage');
    },

    loadUserImage() {
      const savedImage = localStorage.getItem('workProfileImage');
      if (savedImage) this.userImageUrl = savedImage;
    },

    // ===== MEETING METHODS =====
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
        alert("Please enter a valid time (e.g., 14:30, 14.30, 1430, or 2.30pm)");
        return;
      }
      try {
        await MeetingService.addMeeting({
          time: formattedTime,
          subject: this.newMeetingTitle.trim(),
          dayId: this.dayId
        });
        this.newMeetingTime = '';
        this.newMeetingTitle = '';
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
        if (error.response?.status === 403) navigationServices.navigateToErrorView();
        else this.loadMeetings();
      }
    },

    // ===== TIME FORMATTING =====
    formatTimeFromBackend(timeValue) {
      if (typeof timeValue === 'string' && /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(timeValue)) return timeValue;
      if (typeof timeValue === 'string' && /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/.test(timeValue))
        return timeValue.substring(0, 5);
      if (timeValue && typeof timeValue === 'object' && 'hour' in timeValue && 'minute' in timeValue)
        return `${String(timeValue.hour).padStart(2, '0')}:${String(timeValue.minute).padStart(2, '0')}`;
      return timeValue || "00:00";
    },

    formatTimeInput(input) {
      input = input.replace(/\s+/g, '');

      if (/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(input))
        return input.length === 4 ? `0${input}` : input;

      if (/^([0-1]?[0-9]|2[0-3])\.([0-5][0-9])$/.test(input)) {
        const [hours, minutes] = input.split('.');
        return `${hours.padStart(2, '0')}:${minutes}`;
      }
      if (/^([0-1][0-9]|2[0-3])([0-5][0-9])$/.test(input))
        return `${input.substring(0, 2)}:${input.substring(2, 4)}`;

      if (/^([1-9])([0-5][0-9])$/.test(input))
        return `0${input.charAt(0)}:${input.substring(1, 3)}`;

      if (/^(1[0-2]|0?[1-9])(:|\.)?([0-5][0-9])?(am|pm|AM|PM)$/.test(input)) {
        const isPM = /pm/i.test(input);
        input = input.replace(/am|pm|AM|PM/g, '');

        let hours, minutes;
        if (input.includes(':') || input.includes('.')) {
          [hours, minutes] = input.split(/[:\.]/);
        } else if (input.length === 3 || input.length === 4) {
          hours = input.length === 3 ? input.charAt(0) : input.substring(0, 2);
          minutes = input.length === 3 ? input.substring(1, 3) : input.substring(2, 4);
        } else {
          hours = input;
          minutes = "00";
        }

        if (isPM && parseInt(hours) < 12) hours = (parseInt(hours) + 12).toString();
        if (!isPM && hours === "12") hours = "00";

        return `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}`;
      }
      return null;
    },

    // ===== TRACKER METHODS =====
    setWorkMood(mood) { this.workMood = mood; },
    setGlasses(count) { this.selectedGlasses = count; },
    setStepsMilestone(milestone) { this.completedStepsMilestone = milestone; },

    async findMood() {
      try {
        const response = await DayService.addNewDay({
          userId: this.userId, date: this.formattedDate, type: "W"
        });
        this.dayId = response.data.dayId;

        const moodResponse = await axios.get('/mood', { params: { dayId: this.dayId } });
        if (moodResponse.data) {
          this.workMood = moodResponse.data.state;
          this.moodId = moodResponse.data.moodId;  // Ensure moodId is set correctly
        }
      } catch (error) {
        navigationServices.navigateToErrorView();
      }
    },


    async updateMood(newMood) {
      this.workMood = newMood; // Update state before making the request

      if (!this.moodId) {
        console.error("Mood ID is missing!");
        return;
      }

      try {
        await axios.patch('/mood', null, {
          params: { moodId: this.moodId, state: this.workMood }
        });
        await this.loadSavedData();
      } catch (error) {
        console.error("Error updating mood:", error);
        navigationServices.navigateToErrorView();
      }
    },



  }
};
</script>

<style src="@/assets/css/workdayview.css" scoped></style>