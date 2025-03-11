<template>
  <div class="container-fluid px-4 pb-4 calendar-container">
    <!-- Header Row - Matching other views -->
    <div class="row mb-5 align-items-center header-row">
      <div class="col text-center">
        <h1 class="mb-1 fw-bold simple-header">
          CALENDAR
        </h1>
      </div>
    </div>

    <!-- Calendar Navigation Modal -->
    <CalendarNavigationModal
        :modal-is-open="navigationModalIsOpen"
        :selected-date="selectedDate"
        @event-close-modal="closeNavigationModal"
    />

    <!-- Main Two-Column Layout -->
    <div class="row">
      <!-- Left Column (Selected Day Details, Events) -->
      <div class="col-md-4 left-column">
        <!-- Selected Day Card -->
        <div class="card semi-transparent-card mb-3 selected-day-card" style="min-height: 124.8px;">
          <div class="card-header bg-transparent py-2">
            <strong>Selected Day</strong>
          </div>
          <div class="card-body text-center p-0" v-if="selectedDate">
            <div class="calendar-card-selected">
              <div class="calendar-month">
                {{ getMonthName(selectedDate.getMonth()) }}
              </div>
              <div class="calendar-day">
                {{ selectedDate.getDate() }}
              </div>
              <div class="calendar-weekday">
                {{ getDayName(selectedDate.getDay()) }}
              </div>
            </div>
          </div>
          <div class="card-body text-center py-2" v-else>
            <p class="my-1">Select a date to view details</p>
          </div>
        </div>

        <!-- Personal Focus Card -->
        <div class="card semi-transparent-card mb-3">
          <div class="card-header bg-transparent py-2 d-flex justify-content-between align-items-center">
            <strong>Personal Focus</strong>
          </div>
          <div class="content-container personal-focuses" style="max-height: 300px;">
            <ul class="list-group list-group-flush" v-if="selectedDate && getPersonalFocuses().length > 0">
              <li v-for="focus in getPersonalFocuses()" :key="focus._uniqueId || focus.topic"
                  class="list-group-item py-2 d-flex justify-content-between align-items-center">
                <span :class="{ 'completed-focus': focus.isSelected }">{{ focus.topic }}</span>
                <div class="focus-actions">
                  <input
                      type="checkbox"
                      class="form-check-input ms-2"
                      :checked="focus.isSelected"
                      @change="toggleFocusCompletion(focus)"
                  >
                  <button
                      class="btn btn-sm btn-link text-danger p-0"
                      @click="removeFocus(focus)"
                      title="Remove focus"
                  >
                    <span>🗑️</span>
                  </button>
                </div>
              </li>
            </ul>
            <div v-else class="card-body text-center py-2">
              <p class="text-muted my-1" v-if="selectedDate">No personal focuses for this day</p>
              <p class="text-muted my-1" v-else>Select a date to view focuses</p>
            </div>
          </div>
          <!-- Add focus input field -->
          <div class="card-footer bg-transparent" v-if="selectedDate">
            <div class="input-group">
              <input
                  type="text"
                  class="form-control form-control-sm"
                  placeholder="Add new personal focus..."
                  v-model="newPersonalFocus"
                  @keyup.enter="addPersonalFocus"
              >
              <button class="btn btn-outline-secondary btn-sm" type="button" @click="addPersonalFocus">Add</button>
            </div>
          </div>
        </div>

        <!-- Work Focus Card -->
        <div class="card semi-transparent-card mb-3">
          <div class="card-header bg-transparent py-2 d-flex justify-content-between align-items-center">
            <strong>Work Focus</strong>
          </div>
          <div class="content-container work-focuses" style="max-height: 210px;">
            <ul class="list-group list-group-flush" v-if="selectedDate && getWorkFocuses().length > 0">
              <li v-for="focus in getWorkFocuses()" :key="focus._uniqueId || focus.topic"
                  class="list-group-item py-2 d-flex justify-content-between align-items-center">
                <span :class="{ 'completed-focus': focus.isSelected }">{{ focus.topic }}</span>
                <div class="focus-actions">
                  <input
                      type="checkbox"
                      class="form-check-input ms-2"
                      :checked="focus.isSelected"
                      @change="toggleFocusCompletion(focus)"
                  >
                  <button
                      class="btn btn-sm btn-link text-danger p-0"
                      @click="removeFocus(focus)"
                      title="Remove focus"
                  >
                    <span>🗑️</span>
                  </button>
                </div>
              </li>
            </ul>
            <div v-else class="card-body text-center py-2">
              <p class="text-muted my-1" v-if="selectedDate">No work focuses for this day</p>
              <p class="text-muted my-1" v-else>Select a date to view focuses</p>
            </div>
          </div>
          <!-- Add focus input field -->
          <div class="card-footer bg-transparent" v-if="selectedDate">
            <div class="input-group">
              <input
                  type="text"
                  class="form-control form-control-sm"
                  placeholder="Add new work focus..."
                  v-model="newWorkFocus"
                  @keyup.enter="addWorkFocus"
              >
              <button class="btn btn-outline-secondary btn-sm" type="button" @click="addWorkFocus">Add</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Column (Calendar + Quote) -->
      <div class="col-md-8 right-column">
        <!-- Daily Quote Card -->
        <div class="card semi-transparent-card mb-3 quote-card" style="min-height: 130px;">
          <div class="card-header bg-transparent py-2">
            <strong>Daily Inspiration</strong>
          </div>
          <div class="card-body py-2 d-flex flex-column" style="height: 117px;">
            <div class="quote-container mb-">
              <p class="quote-text">{{ quote }}</p>
            </div>
            <div class="mt-auto">
              <button class="btn btn-sm btn-outline-secondary" @click="fetchQuote">
                New Quote
              </button>
            </div>
          </div>
        </div>

        <!-- Calendar Month Navigation -->
        <div class="card semi-transparent-card mb-3">
          <div class="card-header bg-transparent py-2 d-flex justify-content-between align-items-center">
            <button class="btn btn-sm btn-outline-secondary" @click="previousMonth">
              <span>&laquo; Previous</span>
            </button>
            <h3 class="m-0" style="font-size: 1.25rem;">{{ currentMonthName }} {{ currentYear }}</h3>
            <button class="btn btn-sm btn-outline-secondary" @click="nextMonth">
              <span>Next &raquo;</span>
            </button>
          </div>
          <div class="card-body">
            <!-- Days of Week Headers -->
            <div class="calendar-week-header">
              <div v-for="day in daysOfWeek" :key="day" class="calendar-day-name">
                {{ day }}
              </div>
            </div>

            <!-- Calendar Grid -->
            <div class="calendar-grid">
              <div
                  v-for="(day, index) in calendarDays"
                  :key="index"
                  class="calendar-day-cell"
                  :class="{
                  'other-month': !day.isCurrentMonth,
                  'current-day': day.isToday,
                  'has-focuses': hasFocuses(day.date)
                }"
                  @click="selectDate(day)"
                  @dblclick="handleDayDoubleClick(day)"
              >
                <div class="day-number">{{ day.dayNumber }}</div>
                <!-- Event indicators -->
                <div class="focus-indicators" v-if="hasFocuses(day.date)">
                  <span
                      v-if="hasPersonalFocuses(day.date)"
                      class="focus-dot personal-focus"
                      title="Personal focus"
                  ></span>
                  <span
                      v-if="hasWorkFocuses(day.date)"
                      class="focus-dot work-focus"
                      title="Work focus"
                  ></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import CalendarNavigationModal from "@/components/modal/CalendarNavigationModal.vue";
import navigationServices from "@/services/NavigationServices";

export default {
  name: "CalendarView",
  components: {
    CalendarNavigationModal
  },
  created() {
    // Set today as the selected date initially
    this.selectedDate = new Date();

    // Fetch a quote when component is created
    this.fetchQuote();

    // Load focuses for the current month
    this.loadFocusesForMonth(this.currentMonth + 1, this.currentYear);
  },

  data() {
    return {
      // API base URL
      apiBaseUrl: "",

      // User ID from session storage
      userId: Number(sessionStorage.getItem('userId')),

      // Current view month and year
      currentMonth: new Date().getMonth(),
      currentYear: new Date().getFullYear(),

      // Selected date
      selectedDate: null,

      // Track focuses by type
      personalFocusCount: 0,

      // Modal state
      navigationModalIsOpen: false,

      // New input fields for focus addition
      newPersonalFocus: '',
      newWorkFocus: '',

      // Quote text
      quote: "The way to get started is to quit talking and begin doing. - Walt Disney",

      // Focuses storage
      focuses: [],

      // Days of week for calendar header
      daysOfWeek: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],

      // Next ID for Vue keys
      nextUniqueId: 1
    };
  },

  computed: {
    // Get month name
    currentMonthName() {
      const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
      ];
      return months[this.currentMonth];
    },

    // Generate calendar days for the current month view
    calendarDays() {
      const days = [];

      // Get first day of month
      const firstDay = new Date(this.currentYear, this.currentMonth, 1);
      const startingDayOfWeek = firstDay.getDay();

      // Get number of days in current month
      const daysInMonth = new Date(this.currentYear, this.currentMonth + 1, 0).getDate();

      // Get today's date info for highlighting the current day
      const today = new Date();
      const isCurrentMonth = today.getMonth() === this.currentMonth && today.getFullYear() === this.currentYear;
      const todayDate = today.getDate();

      // Previous month's days to display
      const prevMonth = this.currentMonth === 0 ? 11 : this.currentMonth - 1;
      const prevMonthYear = this.currentMonth === 0 ? this.currentYear - 1 : this.currentYear;
      const daysInPrevMonth = new Date(prevMonthYear, prevMonth + 1, 0).getDate();

      // Add previous month's days
      for (let i = startingDayOfWeek - 1; i >= 0; i--) {
        const day = daysInPrevMonth - i;
        days.push({
          dayNumber: day,
          isCurrentMonth: false,
          isToday: false,
          date: new Date(prevMonthYear, prevMonth, day)
        });
      }

      // Add current month's days
      for (let day = 1; day <= daysInMonth; day++) {
        days.push({
          dayNumber: day,
          isCurrentMonth: true,
          isToday: isCurrentMonth && day === todayDate,
          date: new Date(this.currentYear, this.currentMonth, day)
        });
      }

      // Next month's days to fill the calendar grid (to make 6 rows)
      const nextMonth = this.currentMonth === 11 ? 0 : this.currentMonth + 1;
      const nextMonthYear = this.currentMonth === 11 ? this.currentYear + 1 : this.currentYear;
      const totalDays = 42; // 6 rows of 7 days

      const remainingDays = totalDays - days.length;
      for (let day = 1; day <= remainingDays; day++) {
        days.push({
          dayNumber: day,
          isCurrentMonth: false,
          isToday: false,
          date: new Date(nextMonthYear, nextMonth, day)
        });
      }

      return days;
    }
  },

  methods: {
    // Load focuses for a specific month and year from the API
    async loadFocusesForMonth(month, year) {
      try {
        // Load personal focuses
        const personalResponse = await axios.get(`${this.apiBaseUrl}/focuses`, {
          params: {
            userId: this.userId,
            monthNumber: month,
            year: year,
            type: 'P'  // Personal focuses
          }
        });

        // Add metadata to each focus
        const personalFocuses = personalResponse.data.map(focus => ({
          ...focus,
          _uniqueId: this.nextUniqueId++,
          _type: 'P',
          _monthNumber: month,
          _year: year
        }));

        // Store the count of personal focuses
        this.personalFocusCount = personalFocuses.length;

        // Load work focuses
        const workResponse = await axios.get(`${this.apiBaseUrl}/focuses`, {
          params: {
            userId: this.userId,
            monthNumber: month,
            year: year,
            type: 'W'  // Work focuses
          }
        });

        // Add metadata to each work focus
        const workFocuses = workResponse.data.map(focus => ({
          ...focus,
          _uniqueId: this.nextUniqueId++,
          _type: 'W',
          _monthNumber: month,
          _year: year
        }));

        // Combine results
        this.focuses = [...personalFocuses, ...workFocuses];
      } catch (error) {
        if (error.response && error.response.status === 403) {
          navigationServices.navigateToErrorView();
        }
      }
    },

    // Create a new focus
    async createFocus(topic, type) {
      try {
        // Call the API to create a new focus
        await axios.post(`${this.apiBaseUrl}/focus`, {
          userId: this.userId,
          topic: topic,
          monthNumber: this.selectedDate.getMonth() + 1,
          year: this.selectedDate.getFullYear(),
          type: type
        });

        // Refresh the list to get the updated data
        await this.loadFocusesForMonth(
            this.selectedDate.getMonth() + 1,
            this.selectedDate.getFullYear()
        );
      } catch (error) {
        if (error.response && error.response.status === 403) {
          navigationServices.navigateToErrorView();
        }
      }
    },

    // Update a focus's selection status
    async updateFocusSelection(focus) {
      try {
        // Optimistically update the UI
        focus.isSelected = !focus.isSelected;

        // Call the API
        await axios.patch(`${this.apiBaseUrl}/focus`, null, {
          params: {
            focusId: focus.id,
            isSelected: focus.isSelected
          }
        });
      } catch (error) {
        // Revert on failure
        focus.isSelected = !focus.isSelected;

        if (error.response && error.response.status === 403) {
          navigationServices.navigateToErrorView();
        }
      }
    },

    // Delete a focus
    async deleteFocus(focus) {
      try {
        // Store a copy for potential restore
        const focusCopy = { ...focus };
        const focusIndex = this.focuses.findIndex(f =>
            f._uniqueId === focus._uniqueId
        );

        if (focusIndex === -1) return;

        // Remove from UI immediately
        this.focuses.splice(focusIndex, 1);

        // Find the matching focus on server to get its ID
        const response = await axios.get(`${this.apiBaseUrl}/focuses`, {
          params: {
            userId: this.userId,
            monthNumber: focus._monthNumber,
            year: focus._year,
            type: focus._type
          }
        });

        // Find the focus with matching topic
        const serverFocus = response.data.find(f => f.topic === focus.topic);

        if (serverFocus) {
          // Delete using the server-side focus ID
          await axios.delete(`${this.apiBaseUrl}/focus`, {
            params: { focusId: serverFocus.id }
          });

          // Reload data to ensure UI is in sync
          await this.loadFocusesForMonth(
              this.selectedDate.getMonth() + 1,
              this.selectedDate.getFullYear()
          );
        } else {
          // If we can't find the focus, restore it in the UI
          this.focuses.splice(focusIndex, 0, focusCopy);
        }
      } catch (error) {
        // Restore focus on error
        const focusIndex = this.focuses.findIndex(f => f._uniqueId === focus._uniqueId);
        if (focusIndex === -1) {
          this.focuses.push(focus);
        }

        if (error.response && error.response.status === 403) {
          navigationServices.navigateToErrorView();
        }
      }
    },

    // Navigation methods
    previousMonth() {
      if (this.currentMonth === 0) {
        this.currentMonth = 11;
        this.currentYear--;
      } else {
        this.currentMonth--;
      }
      this.loadFocusesForMonth(this.currentMonth + 1, this.currentYear);
    },

    nextMonth() {
      if (this.currentMonth === 11) {
        this.currentMonth = 0;
        this.currentYear++;
      } else {
        this.currentMonth++;
      }
      this.loadFocusesForMonth(this.currentMonth + 1, this.currentYear);
    },

    // Date selection
    selectDate(day) {
      this.selectedDate = new Date(day.date);
    },

    // Get month name by index
    getMonthName(monthIndex) {
      const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
      ];
      return months[monthIndex];
    },

    // Get day name by index
    getDayName(dayIndex) {
      const days = [
        'Sunday', 'Monday', 'Tuesday', 'Wednesday',
        'Thursday', 'Friday', 'Saturday'
      ];
      return days[dayIndex];
    },

    // Navigation modal methods
    openNavigationModal() {
      this.navigationModalIsOpen = true;
    },

    closeNavigationModal() {
      this.navigationModalIsOpen = false;
    },

    handleDayDoubleClick(day) {
      this.selectDate(day);
      this.openNavigationModal();
    },

    // Focus addition methods
    async addPersonalFocus() {
      if (!this.newPersonalFocus.trim()) return;

      await this.createFocus(this.newPersonalFocus, 'P');
      this.newPersonalFocus = '';
    },

    async addWorkFocus() {
      if (!this.newWorkFocus.trim()) return;

      await this.createFocus(this.newWorkFocus, 'W');
      this.newWorkFocus = '';
    },

    // Focus action methods
    async toggleFocusCompletion(focus) {
      await this.updateFocusSelection(focus);
    },

    async removeFocus(focus) {
      await this.deleteFocus(focus);
    },

    // Focus filtering methods
    getPersonalFocuses() {
      if (!this.selectedDate) return [];

      // Return personal focuses based on metadata
      return this.focuses.filter(focus =>
          focus._type === 'P' &&
          focus._monthNumber === (this.selectedDate.getMonth() + 1) &&
          focus._year === this.selectedDate.getFullYear()
      );
    },

    getWorkFocuses() {
      if (!this.selectedDate) return [];

      // Return work focuses based on metadata
      return this.focuses.filter(focus =>
          focus._type === 'W' &&
          focus._monthNumber === (this.selectedDate.getMonth() + 1) &&
          focus._year === this.selectedDate.getFullYear()
      );
    },

    hasFocuses(date) {
      return this.hasPersonalFocuses(date) || this.hasWorkFocuses(date);
    },

    hasPersonalFocuses(date) {
      // Check if there are any personal focuses for this date
      return this.focuses.some(focus =>
          focus._type === 'P' &&
          focus._monthNumber === (date.getMonth() + 1) &&
          focus._year === date.getFullYear()
      );
    },

    hasWorkFocuses(date) {
      // Check if there are any work focuses for this date
      return this.focuses.some(focus =>
          focus._type === 'W' &&
          focus._monthNumber === (date.getMonth() + 1) &&
          focus._year === date.getFullYear()
      );
    },

    // Fetch quote from API
    async fetchQuote() {
      const API_KEY = "LEYV9brNOkL8XXrRckzhbQ==0eV9fA97U9SIpoyC";
      try {
        const response = await axios.get("https://api.api-ninjas.com/v1/quotes", {
          headers: {
            "X-Api-Key": API_KEY
          }
        });
        if (response.data && response.data.length > 0) {
          this.quote = response.data[0].quote;
          if (response.data[0].author) {
            this.quote += " - " + response.data[0].author;
          }
        } else {
          this.quote = "The best way to predict the future is to create it. - Abraham Lincoln";
        }
      } catch (error) {
        this.quote = "The best way to predict the future is to create it. - Abraham Lincoln";
      }
    }
  },

  watch: {
    // Watch for changes to the selected date
    selectedDate(newDate) {
      if (newDate) {
        // If the month or year changed, load the focuses for the new month
        const newMonth = newDate.getMonth() + 1;
        const newYear = newDate.getFullYear();

        if (newMonth !== this.currentMonth + 1 || newYear !== this.currentYear) {
          this.loadFocusesForMonth(newMonth, newYear);
        }
      }
    }
  }
};
</script>

<style src="@/assets/css/calendarview.css" scoped></style>