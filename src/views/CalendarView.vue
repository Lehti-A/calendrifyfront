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

    // Load month focuses using the loadMonthFocuses helper
    this.loadMonthFocuses(this.currentMonth + 1, this.currentYear);
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
      focuses: [],       // All focuses for the month (calendar indicators)
      dayFocuses: [],    // Focuses for the selected day only

      // Days of week for calendar header
      daysOfWeek: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],

      // Next ID for Vue keys
      nextUniqueId: 1,

      // Loading state
      isLoading: false
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
      // Keep this method the same
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
    // Helper method to load focuses for all days in a month (for calendar indicators)
    async loadMonthFocuses(month, year) {
      this.isLoading = true;
      this.focuses = []; // Reset focuses array

      try {
        // Get number of days in the month
        const daysInMonth = new Date(year, month, 0).getDate();

        // For each day in the month, load both personal and work focuses
        for (let day = 1; day <= daysInMonth; day++) {
          try {
            // Load personal focuses for this day
            const personalResponse = await axios.get(`${this.apiBaseUrl}/focuses`, {
              params: {
                userId: this.userId,
                monthNumber: month,
                year: year,
                day: day,
                type: 'P'
              }
            });

            // Add metadata to each focus
            const personalFocuses = personalResponse.data.map(focus => ({
              ...focus,
              _uniqueId: this.nextUniqueId++,
              _type: 'P',
              _monthNumber: month,
              _year: year,
              _day: day
            }));

            // Add to focuses array
            this.focuses.push(...personalFocuses);

            // Load work focuses for this day
            const workResponse = await axios.get(`${this.apiBaseUrl}/focuses`, {
              params: {
                userId: this.userId,
                monthNumber: month,
                year: year,
                day: day,
                type: 'W'
              }
            });

            // Add metadata to each focus
            const workFocuses = workResponse.data.map(focus => ({
              ...focus,
              _uniqueId: this.nextUniqueId++,
              _type: 'W',
              _monthNumber: month,
              _year: year,
              _day: day
            }));

            // Add to focuses array
            this.focuses.push(...workFocuses);
          } catch (error) {
            // If there's an error loading focuses for a particular day, just continue
            // This is likely because there are no focuses for that day
            continue;
          }
        }

        // If we have a selected date, load focuses for that day
        if (this.selectedDate) {
          this.loadFocusesForDay(this.selectedDate);
        }
      } catch (error) {
        console.error("Error loading month focuses:", error);
        if (error.response && error.response.status === 403) {
          navigationServices.navigateToErrorView();
        }
      } finally {
        this.isLoading = false;
      }
    },

    // Load focuses for a specific day
    async loadFocusesForDay(date) {
      try {
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();

        // Load personal focuses for the specific day
        const personalResponse = await axios.get(`${this.apiBaseUrl}/focuses`, {
          params: {
            userId: this.userId,
            monthNumber: month,
            year: year,
            day: day,
            type: 'P'
          }
        });

        // Add metadata
        const personalFocuses = personalResponse.data.map(focus => ({
          ...focus,
          _uniqueId: this.nextUniqueId++,
          _type: 'P',
          _monthNumber: month,
          _year: year,
          _day: day
        }));

        // Load work focuses for the specific day
        const workResponse = await axios.get(`${this.apiBaseUrl}/focuses`, {
          params: {
            userId: this.userId,
            monthNumber: month,
            year: year,
            day: day,
            type: 'W'
          }
        });

        // Add metadata
        const workFocuses = workResponse.data.map(focus => ({
          ...focus,
          _uniqueId: this.nextUniqueId++,
          _type: 'W',
          _monthNumber: month,
          _year: year,
          _day: day
        }));

        // Store only focuses for the current day
        this.dayFocuses = [...personalFocuses, ...workFocuses];
        this.personalFocusCount = personalFocuses.length;

        // Update the focuses array with these new focuses (may replace existing ones)
        // This ensures consistency between dayFocuses and the main focuses array
        this.updateFocusesArray(personalFocuses, workFocuses, day, month, year);
      } catch (error) {
        console.error("Error loading focuses for day:", error);
        this.dayFocuses = []; // Reset on error
        if (error.response && error.response.status === 403) {
          navigationServices.navigateToErrorView();
        }
      }
    },

    // Helper to update the main focuses array with day-specific focuses
    updateFocusesArray(personalFocuses, workFocuses, day, month, year) {
      // Remove any existing focuses for this day
      this.focuses = this.focuses.filter(focus =>
          !(focus._day === day &&
              focus._monthNumber === month &&
              focus._year === year)
      );

      // Add the new focuses
      this.focuses.push(...personalFocuses, ...workFocuses);
    },

    // Create a new focus
    async createFocus(topic, type) {
      if (!topic.trim()) return;

      try {
        // Create the focus on the server
        await axios.post(`${this.apiBaseUrl}/focus`, {
          userId: this.userId,
          topic: topic,
          day: this.selectedDate.getDate(),
          monthNumber: this.selectedDate.getMonth() + 1,
          year: this.selectedDate.getFullYear(),
          type: type
        });

        // Refresh the day's focuses
        await this.loadFocusesForDay(this.selectedDate);

        // Reload all month focuses to update calendar indicators
        // In a real app, you might optimize this by only updating the indicators
        // But for simplicity and reliability, we'll just reload everything
        await this.loadMonthFocuses(
            this.selectedDate.getMonth() + 1,
            this.selectedDate.getFullYear()
        );
      } catch (error) {
        console.error("Error creating focus:", error);
        if (error.response && error.response.status === 403) {
          navigationServices.navigateToErrorView();
        }
      }
    },

    // Update a focus's selection status
    async updateFocusSelection(focus) {
      try {
        // Store original state in case we need to revert
        const originalIsSelected = focus.isSelected;

        // Optimistically update the UI
        focus.isSelected = !focus.isSelected;

        // Update in both arrays for consistency
        this.updateFocusStatusInArrays(focus);

        // Call the API
        await axios.patch(`${this.apiBaseUrl}/focus`, null, {
          params: {
            focusId: focus.id,
            isSelected: focus.isSelected
          }
        });
      } catch (error) {
        console.error("Error updating focus:", error);

        // Revert changes on failure
        focus.isSelected = !focus.isSelected;
        this.updateFocusStatusInArrays(focus);

        if (error.response && error.response.status === 403) {
          navigationServices.navigateToErrorView();
        }
      }
    },

    // Helper to update a focus's status in both arrays
    updateFocusStatusInArrays(focus) {
      // Update in focuses array
      const mainFocus = this.focuses.find(f => f.id === focus.id);
      if (mainFocus) {
        mainFocus.isSelected = focus.isSelected;
      }

      // Update in dayFocuses array
      const dayFocus = this.dayFocuses.find(f => f.id === focus.id);
      if (dayFocus) {
        dayFocus.isSelected = focus.isSelected;
      }
    },

    // Delete a focus
    async deleteFocus(focus) {
      try {
        // First, remove from both UI arrays
        this.removeFocusFromArrays(focus);

        // Delete on the server
        await axios.delete(`${this.apiBaseUrl}/focus`, {
          params: { focusId: focus.id }
        });

        // Reload data to ensure UI is in sync
        await this.loadFocusesForDay(this.selectedDate);
        await this.loadMonthFocuses(
            this.selectedDate.getMonth() + 1,
            this.selectedDate.getFullYear()
        );
      } catch (error) {
        console.error("Error deleting focus:", error);

        // Don't try to restore on error - we'll reload data instead
        if (error.response && error.response.status === 403) {
          navigationServices.navigateToErrorView();
        } else {
          // Reload data to ensure UI is in sync
          await this.loadFocusesForDay(this.selectedDate);
          await this.loadMonthFocuses(
              this.selectedDate.getMonth() + 1,
              this.selectedDate.getFullYear()
          );
        }
      }
    },

    // Helper to remove a focus from both arrays
    removeFocusFromArrays(focus) {
      // Remove from focuses array
      const mainIndex = this.focuses.findIndex(f => f.id === focus.id);
      if (mainIndex !== -1) {
        this.focuses.splice(mainIndex, 1);
      }

      // Remove from dayFocuses array
      const dayIndex = this.dayFocuses.findIndex(f => f.id === focus.id);
      if (dayIndex !== -1) {
        this.dayFocuses.splice(dayIndex, 1);
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

      // Load focuses for the new month
      this.loadMonthFocuses(this.currentMonth + 1, this.currentYear);
    },

    nextMonth() {
      if (this.currentMonth === 11) {
        this.currentMonth = 0;
        this.currentYear++;
      } else {
        this.currentMonth++;
      }

      // Load focuses for the new month
      this.loadMonthFocuses(this.currentMonth + 1, this.currentYear);
    },

    // Date selection
    selectDate(day) {
      // Update the selected date
      this.selectedDate = new Date(day.date);

      // Load focuses for the selected day
      this.loadFocusesForDay(this.selectedDate);
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

    // Focus action methods - these are the public methods used in the template
    async toggleFocusCompletion(focus) {
      await this.updateFocusSelection(focus);
    },

    async removeFocus(focus) {
      await this.deleteFocus(focus);
    },

    // Focus filtering methods - these return focuses for the UI
    getPersonalFocuses() {
      if (!this.selectedDate) return [];

      // Return personal focuses for the selected day
      return this.dayFocuses.filter(focus => focus._type === 'P');
    },

    getWorkFocuses() {
      if (!this.selectedDate) return [];

      // Return work focuses for the selected day
      return this.dayFocuses.filter(focus => focus._type === 'W');
    },

    // Methods to check if a date has focuses - used for calendar indicators
    hasFocuses(date) {
      return this.hasPersonalFocuses(date) || this.hasWorkFocuses(date);
    },

    hasPersonalFocuses(date) {
      return this.focuses.some(focus =>
          focus._type === 'P' &&
          focus._day === date.getDate() &&
          focus._monthNumber === (date.getMonth() + 1) &&
          focus._year === date.getFullYear()
      );
    },

    hasWorkFocuses(date) {
      return this.focuses.some(focus =>
          focus._type === 'W' &&
          focus._day === date.getDate() &&
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
          this.loadMonthFocuses(newMonth, newYear);
        }
      }
    }
  }
};
</script>


<style src="@/assets/css/calendarview.css" scoped></style>