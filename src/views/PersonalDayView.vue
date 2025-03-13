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
                  <div v-if="!isEditing && !dailyFocus" class="placeholder-text" @click="startEditing">{{ placeholder }}</div>
                  <div v-if="!isEditing && dailyFocus" class="content-text" @click="startEditing">{{ dailyFocus }}</div>
                  <div v-if="isEditing" class="editing-wrapper">
                    <input ref="seamlessInput" type="text" class="seamless-input" v-model="dailyFocus" @blur="handleBlur" @keydown.enter="finishEditing">
                    <div class="focus-button-row">
                      <button class="btn btn-sm btn-primary focus-save-btn" @click.stop="finishEditing" title="Save">Save</button>
                      <button v-if="dailyFocus" class="btn btn-sm btn-outline-danger focus-clear-btn" @click.stop="clearFocus" title="Clear text">Clear</button>
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
              <li v-for="activity in activities" :key="activity.activityId" class="list-group-item py-2 d-flex justify-content-between align-items-center">
                <span :class="{ 'completed-activity': activity.isDone }">{{ activity.topic }}</span>
                <div class="activity-actions">
                  <input type="checkbox" class="form-check-input ms-2" :checked="activity.isDone" @change="toggleActivityCompletion(activity.activityId, !activity.isDone)">
                  <button class="btn btn-sm btn-link text-danger p-0" @click="removeActivity(activity.activityId)" title="Remove activity">🗑️</button>
                </div>
              </li>
            </ul>
            <div v-else-if="isLoadingActivities" class="text-center py-3">
              <div class="spinner-border spinner-border-sm" role="status"><span class="visually-hidden">Loading...</span></div>
            </div>
            <div v-else class="card-body text-center py-2"><p class="text-muted my-1">No activities yet</p></div>
          </div>
          <div class="card-footer bg-transparent">
            <div class="input-group">
              <input type="text" class="form-control form-control-sm" placeholder="Add new activity..." v-model="newActivity" @keyup.enter="addActivity">
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
                <textarea class="form-control thoughts-textarea" v-model="otherThoughts" placeholder="Enter your thoughts here..." ref="thoughtsTextarea"></textarea>
                <div class="mt-2">
                  <button class="btn btn-sm btn-primary" @click="saveThoughts">Save</button>
                  <button class="btn btn-sm btn-outline-secondary ms-2" @click="cancelEditThoughts">Cancel</button>
                  <button v-if="otherThoughts" class="btn btn-sm btn-outline-danger float-end" @click="clearThoughts">Clear</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Personal Goals -->
        <div class="card semi-transparent-card mb-4 tasks-card">
          <div class="card-header bg-transparent"><strong>Personal Goals</strong></div>
          <div class="content-container">
            <ul class="list-group list-group-flush">
              <li v-for="(task, index) in tasks" :key="index" class="list-group-item d-flex align-items-center justify-content-between">
                <div class="task-text-container" style="flex-grow: 1; margin-right: 10px;">
                  <span v-if="!task.isEditing" :class="{ 'completed-task': task.completed }" @click="startEditingTask(index)" style="cursor: text; display: block; width: 100%;">{{ task.text }}</span>
                  <input v-if="task.isEditing" type="text" class="form-control form-control-sm" v-model="task.text" @blur="finishEditingTask(index)" @keyup.enter="finishEditingTask(index)" ref="taskInput" style="width: 100%;">
                </div>
                <div class="task-actions">
                  <input type="checkbox" class="form-check-input" :checked="task.completed" @change="toggleTaskCompletion(index)">
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Right Sidebar Column -->
      <div class="col-md-4 right-column">
        <!-- Image Card -->
        <div class="card mb-4 image-card" style="width: 80%; aspect-ratio: 1/1; margin: 0 auto; padding: 0; overflow: hidden; position: relative;">
          <img v-if="!userImageUrl" src="../assets/images/diary.png" class="card-img" alt="Default diary image" />
          <img v-else :src="userImageUrl" class="card-img" alt="User profile image" />
          <div v-if="!userImageUrl" class="image-action-button add-button" @click="triggerImageUpload" title="Add your picture">+</div>
          <div v-else class="image-action-button delete-button" @click="deleteUserImage" title="Remove picture">×</div>
          <input type="file" ref="imageInput" @change="handleImageUpload" accept="image/*" style="display: none;" />
        </div>

        <!-- Meetings -->
        <div class="card semi-transparent-card mb-4 meetings-card">
          <div class="card-header bg-transparent"><strong>Personal Meetings</strong></div>
          <div class="content-container">
            <ul class="list-group list-group-flush" v-if="meetings.length > 0">
              <li v-for="(meeting, index) in meetings" :key="meeting.meetingId || index" class="list-group-item meeting-item" @mouseenter="meeting.showDelete = true" @mouseleave="meeting.showDelete = false">
                <div class="meeting-content">
                  <span class="meeting-info" style="width: calc(100% - 40px); overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">{{ meeting.time }} - {{ meeting.title }}</span>
                  <span v-if="meeting.showDelete" @click="removeMeeting(index)" title="Remove meeting" style="position: absolute; right: 15px; top: 50%; transform: translateY(-50%); font-size: 18px; color: #dc3545; width: 25px; height: 25px; background: rgba(255,255,255,0.8); border-radius: 50%; display: flex; justify-content: center; align-items: center; cursor: pointer;">×</span>
                </div>
              </li>
            </ul>
            <div v-else-if="isLoadingMeetings" class="text-center py-3">
              <div class="spinner-border spinner-border-sm" role="status"><span class="visually-hidden">Loading...</span></div>
            </div>
            <div v-else class="card-body text-center py-2"><p class="text-muted my-1">No meetings yet</p></div>
          </div>
          <div class="card-footer bg-transparent">
            <div class="mb-2"><input type="text" class="form-control form-control-sm" placeholder="Time (e.g. 14:00)" v-model="newMeetingTime"></div>
            <div class="mb-2"><input type="text" class="form-control form-control-sm" placeholder="Meeting title" v-model="newMeetingTitle" @keyup.enter="addMeeting"></div>
            <button class="btn btn-sm btn-primary w-100" @click="addMeeting" :disabled="!newMeetingTime || !newMeetingTitle">Add Meeting</button>
          </div>
        </div>

        <!-- Trackers Container -->
        <div class="trackers-container">
          <!-- Water Tracker -->
          <div class="mb-4 tracker-section">
            <h5 class="mb-3 text-center">Glasses of Water</h5>
            <div class="water-icons">
              <div v-for="(glass, index) in 8" :key="index" class="water-glass" @click="setGlasses(index + 1)" title="Glass of Water">
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
              <span class="mood-icon" :class="{ 'active-sad': personalMood === 'sad' }" @click="setMood('sad')" title="Sad">😢</span>
              <span class="mood-icon" :class="{ 'active-neutral': personalMood === 'neutral' }" @click="setMood('neutral')" title="Neutral">😐</span>
              <span class="mood-icon" :class="{ 'active-happy': personalMood === 'happy' }" @click="setMood('happy')" title="Happy">😊</span>
            </div>
          </div>

          <!-- Steps Tracker -->
          <div class="tracker-section">
            <h5 class="mb-4 text-center">Steps</h5>
            <div class="steps-milestones">
              <div v-for="(milestone, index) in milestones" :key="index" class="milestone-item" @click="setStepsMilestone(index + 1)" :title="`${milestone.steps} Steps`">
                <div class="checkbox-container" :class="{ 'checked': index < completedStepsMilestone }">
                  <svg v-if="index < completedStepsMilestone" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" class="checkmark-icon">
                    <path fill-rule="evenodd" d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 011.04-.208z" clip-rule="evenodd"/>
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

export default {
  name: 'PersonalDayView',

  beforeMount() { this.dailyFocus = this.otherThoughts = ""; },

  created() {
    const selectedDate = sessionStorage.getItem('selectedCalendarDate');
    this.selectedDate = selectedDate ?
        new Date(...selectedDate.split('-').map(Number).map((v,i) => i === 1 ? v-1 : v)) :
        new Date();

    if (selectedDate) sessionStorage.removeItem('selectedCalendarDate');
    this.userId = Number(sessionStorage.getItem('userId') || '1');
  },

  mounted() { this.$nextTick(this.loadSavedData); },

  beforeDestroy() { this.dailyFocus = this.otherThoughts = ""; this.dayId = null; },

  data: () => ({
    // Core data
    userId: null, dayId: null, selectedDate: null,
    isLoading: false, isLoadingActivities: false, isLoadingMeetings: false,

    // Focus section
    dailyFocus: "", isEditing: false, tempFocus: "", clearButtonClicked: false,
    placeholder: "Click here to set your focus for today...",

    // Other sections
    userImageUrl: null,
    otherThoughts: "", editingThoughts: false, tempThoughts: "",
    activities: [], newActivity: "",
    meetings: [], newMeetingTime: '', newMeetingTitle: '',
    personalMood: null, selectedGlasses: 0, completedStepsMilestone: 0,
    tasks: [], newTask: "",

    // Constants
    milestones: [
      {steps: 2500, label: "2,500"}, {steps: 5000, label: "5,000"},
      {steps: 7500, label: "7,500"}, {steps: 10000, label: "10,000+"}
    ],
    hasFontAwesome: false
  }),

  computed: {
    currentDay() { return (this.selectedDate || new Date()).getDate(); },

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

  methods: {
    // === DATA METHODS ===
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

    // === CONTENT EDITING METHODS ===
    // Generic editing helpers
    startEdit(ref, prop, temp) {
      this[temp] = this[prop];
      this[ref] = true;
      this.$nextTick(() => this.$refs[prop + 'Input'] && this.$refs[prop + 'Input'].focus());
    },

    saveContent(editProp, contentProp, updateMethod, clearFlag) {
      this[editProp] = false;
      if (clearFlag) return;

      const content = typeof this[contentProp] === 'string' ? this[contentProp].trim() : this[contentProp];
      if (this.dayId) {
        const updateData = { dayId: this.dayId };
        updateData[contentProp] = content;
        DayService[updateMethod](updateData).catch(error => console.error(`Error updating ${contentProp}:`, error));
      }
    },

    // Focus methods
    startEditing() {
      this.tempFocus = this.dailyFocus;
      this.isEditing = true;
      this.$nextTick(() => this.$refs.seamlessInput.focus());
    },

    clearFocus(event) {
      if (event) { event.preventDefault(); event.stopPropagation(); }
      this.dailyFocus = "";
      this.clearButtonClicked = true;
      setTimeout(() => this.$refs.seamlessInput?.focus(), 50);
    },

    finishEditing() {
      this.isEditing = false;
      this.dailyFocus = this.dailyFocus.trim();
      if (this.dayId) {
        DayService.updateDayFocus({ dayId: this.dayId, focus: this.dailyFocus })
            .catch(error => console.error("Error updating focus:", error));
      }
    },

    handleBlur() {
      setTimeout(() => {
        if (!this.clearButtonClicked) this.finishEditing();
        this.clearButtonClicked = false;
      }, 100);
    },

    // Thoughts methods
    startEditingThoughts() {
      this.tempThoughts = this.otherThoughts;
      this.editingThoughts = true;
      this.$nextTick(() => this.$refs.thoughtsTextarea.focus());
    },

    saveThoughts() {
      this.editingThoughts = false;
      if (this.dayId) {
        DayService.updateDayThought({ dayId: this.dayId, thoughts: this.otherThoughts })
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

    // === DATA MANAGEMENT METHODS ===
    // Activities
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
        await ActivityService.addActivity({ topic: this.newActivity.trim(), dayId: this.dayId });
        this.newActivity = "";
        this.loadActivities();
      } catch (error) {
        console.error("Error adding activity:", error);
        if (error.response?.status === 403) navigationServices.navigateToErrorView();
      }
    },

    // === IMAGE METHODS ===
    triggerImageUpload() { this.$refs.imageInput.click(); },

    handleImageUpload(event) {
      const file = event.target.files[0];
      if (file && file.type.match('image.*')) {
        const reader = new FileReader();
        reader.onload = e => {
          this.userImageUrl = e.target.result;
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
      this.userImageUrl = localStorage.getItem('personalProfileImage') || null;
    },

    // === MEETING METHODS ===
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
        alert("Please enter a valid time (e.g., 14.30, 1430, or 2.30pm)");
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

    // Time formatting helpers
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

    // === TRACKER METHODS ===
    setMood(mood) { this.personalMood = mood; },
    setGlasses(count) { this.selectedGlasses = count; },
    setStepsMilestone(milestone) { this.completedStepsMilestone = milestone; },

  }
};
</script>

<style src="@/assets/css/personaldayview.css" scoped></style>