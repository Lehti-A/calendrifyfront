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
      <!-- Left Column (Selected Day Details, Events) - Originally on the right -->
      <div class="col-md-4 left-column">
        <!-- Selected Day Card - Made more compact -->
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

        <!-- Personal Focus Card - With increased height -->
        <div class="card semi-transparent-card mb-3">
          <div class="card-header bg-transparent py-2 d-flex justify-content-between align-items-center">
            <strong>Personal Focus</strong>
          </div>
          <div class="content-container personal-focuses" style="max-height: 300px;">
            <ul class="list-group list-group-flush" v-if="selectedDate && getPersonalFocuses(selectedDate).length > 0">
              <li v-for="(focus, index) in getPersonalFocuses(selectedDate)" :key="index"
                  class="list-group-item py-2 d-flex justify-content-between align-items-center">
                <span :class="{ 'completed-focus': focus.completed }">{{ focus.text }}</span>
                <div class="focus-actions">
                  <input
                      type="checkbox"
                      class="form-check-input ms-2"
                      :checked="focus.completed"
                      @change="toggleFocusCompletion('personal', index, selectedDate)"
                  >
                  <button
                      class="btn btn-sm btn-link text-danger p-0"
                      @click="removeFocus('personal', index, selectedDate)"
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
          <!-- Add this new card footer with input field -->
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

        <!-- Work Focus Card - Made more compact -->
        <div class="card semi-transparent-card mb-3">
          <div class="card-header bg-transparent py-2 d-flex justify-content-between align-items-center">
            <strong>Work Focus</strong>
          </div>
          <div class="content-container work-focuses" style="max-height: 210px;"><!-- Increased by 40% from 150px -->
            <ul class="list-group list-group-flush" v-if="selectedDate && getWorkFocuses(selectedDate).length > 0">
              <li v-for="(focus, index) in getWorkFocuses(selectedDate)" :key="index"
                  class="list-group-item py-2 d-flex justify-content-between align-items-center">
                <span :class="{ 'completed-focus': focus.completed }">{{ focus.text }}</span>
                <div class="focus-actions">
                  <input
                      type="checkbox"
                      class="form-check-input ms-2"
                      :checked="focus.completed"
                      @change="toggleFocusCompletion('work', index, selectedDate)"
                  >
                  <button
                      class="btn btn-sm btn-link text-danger p-0"
                      @click="removeFocus('work', index, selectedDate)"
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
          <!-- Add this new card footer with input field -->
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

      <!-- Right Column (Calendar + Quote) - Originally on the left -->
      <div class="col-md-8 right-column">
        <!-- Daily Quote Card - Made more compact -->
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

        <!-- Calendar Month Navigation and Current Month/Year Display - More compact -->
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

export default {
  name: "CalendarView",
  components: {
    CalendarNavigationModal
  },
  created() {
    // Load saved events
    this.loadFocuses();

    // Fetch a quote when component is created
    this.fetchQuote();

    // Set today as the selected date initially
    this.selectedDate = new Date();
  },

  data() {
    return {
      // Current view month and year
      currentMonth: new Date().getMonth(),
      currentYear: new Date().getFullYear(),

      // Selected date
      selectedDate: null,

      navigationModalIsOpen: false,

      // New input fields for direct focus addition
      newPersonalFocus: '',
      newWorkFocus: '',

      // Quotes
      quote: "The way to get started is to quit talking and begin doing. - Walt Disney",

      // Calendar events
      focuses: {},

      // Days of week for calendar header
      daysOfWeek: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
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
      // Get first day of week (0 = Sunday, 1 = Monday, etc.)
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
    // Navigation methods
    previousMonth() {
      if (this.currentMonth === 0) {
        this.currentMonth = 11;
        this.currentYear--;
      } else {
        this.currentMonth--;
      }
    },

    nextMonth() {
      if (this.currentMonth === 11) {
        this.currentMonth = 0;
        this.currentYear++;
      } else {
        this.currentMonth++;
      }
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

    // New focus addition methods
    addPersonalFocus() {
      if (!this.newPersonalFocus.trim()) return;

      this.addFocus('personal', this.newPersonalFocus);
      this.newPersonalFocus = '';
    },

    addWorkFocus() {
      if (!this.newWorkFocus.trim()) return;

      this.addFocus('work', this.newWorkFocus);
      this.newWorkFocus = '';
    },

    addFocus(type, focusText) {
      if (!focusText.trim() || !this.selectedDate) return;

      // Format the date as YYYY-MM-DD for use as a key
      const dateKey = this.formatDateKey(this.selectedDate);

      // Initialize the date in events object if it doesn't exist
      if (!this.focuses[dateKey]) {
        this.focuses[dateKey] = {
          personal: [],
          work: []
        };
      }

      // Add the new focus
      this.focuses[dateKey][type].push({
        text: focusText.trim(),
        completed: false
      });

      // Save focuses to localStorage
      this.saveFocuses();
    },

    // Existing focus management methods
    removeFocus(type, index, date) {
      const dateKey = this.formatDateKey(date);
      if (this.focuses[dateKey] && this.focuses[dateKey][type]) {
        this.focuses[dateKey][type].splice(index, 1);
        this.saveFocuses();
      }
    },

    toggleFocusCompletion(type, index, date) {
      const dateKey = this.formatDateKey(date);
      if (this.focuses[dateKey] && this.focuses[dateKey][type] && this.focuses[dateKey][type][index]) {
        this.focuses[dateKey][type][index].completed = !this.focuses[dateKey][type][index].completed;
        this.saveFocuses();
      }
    },

    // Helper methods for events
    formatDateKey(date) {
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    },

    hasFocuses(date) {
      const dateKey = this.formatDateKey(date);
      return this.focuses[dateKey] && (
          (this.focuses[dateKey].personal && this.focuses[dateKey].personal.length > 0) ||
          (this.focuses[dateKey].work && this.focuses[dateKey].work.length > 0)
      );
    },

    hasPersonalFocuses(date) {
      const dateKey = this.formatDateKey(date);
      return this.focuses[dateKey] &&
          this.focuses[dateKey].personal &&
          this.focuses[dateKey].personal.length > 0;
    },

    hasWorkFocuses(date) {
      const dateKey = this.formatDateKey(date);
      return this.focuses[dateKey] &&
          this.focuses[dateKey].work &&
          this.focuses[dateKey].work.length > 0;
    },

    getPersonalFocuses(date) {
      const dateKey = this.formatDateKey(date);
      return (this.focuses[dateKey] && this.focuses[dateKey].personal) ? this.focuses[dateKey].personal : [];
    },

    getWorkFocuses(date) {
      const dateKey = this.formatDateKey(date);
      return (this.focuses[dateKey] && this.focuses[dateKey].work) ? this.focuses[dateKey].work : [];
    },

    // LocalStorage methods
    saveFocuses() {
      localStorage.setItem('calendarEvents', JSON.stringify(this.focuses));
    },

    loadFocuses() {
      const savedEvents = localStorage.getItem('calendarEvents');
      if (savedEvents) {
        this.focuses = JSON.parse(savedEvents);
      }
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
        console.error("Error fetching quote:", error);
        this.quote = "The best way to predict the future is to create it. - Abraham Lincoln";
      }
    }
  }
};
</script>

<style scoped>
/* General Layout Styles */
.calendar-container {
  padding-top: 140px; /* Reduced top padding to fit more content in the viewport */
}

/* Typography Styles */
.simple-header,
.card-header strong {
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

/* Header and Row Styles */
.header-row {
  position: relative;
  margin-bottom: 1.5rem !important;
}

/* Card Styles */
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

/* Button Styles */
.btn-outline-secondary {
  color: #8e44ad;
  border-color: #8e44ad;
}

.btn-outline-secondary:hover,
.btn-outline-secondary:active,
.btn-outline-secondary:focus {
  background-color: #8e44ad;
  border-color: #8e44ad;
  color: white !important;
}

.btn-outline-secondary.active {
  background-color: #8e44ad !important;
  border-color: #8e44ad !important;
  color: white !important;
}

.btn-primary {
  background-color: #8e44ad;
  border-color: #8e44ad;
}

.btn-primary:hover {
  background-color: #7d3c98;
  border-color: #7d3c98;
}

.btn-primary:active,
.btn-primary:focus {
  background-color: #6c3483;
  border-color: #6c3483;
  box-shadow: 0 0 0 0.25rem rgba(142, 68, 173, 0.4);
}

/* Selected Day Calendar Card */
.selected-day-card {
  min-height: 124.8px;
}

.calendar-card-selected {
  background-color: rgba(142, 68, 173, 0.7);
  color: white;
  border: none;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  width: 100%;
}

.calendar-month {
  background-color: rgba(0, 0, 0, 0.2);
  padding: 5px 0;
  font-size: 0.9rem;
  font-weight: 500;
  text-transform: uppercase;
}

.calendar-day {
  font-size: 2.2rem;
  font-weight: bold;
  padding: 5px 0 3px;
}

.calendar-weekday {
  font-size: 0.9rem;
  padding-bottom: 5px;
  text-transform: uppercase;
  font-weight: 500;
}

/* Calendar Grid Styles */
.calendar-week-header {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 2px;
  margin-bottom: 5px;
}

.calendar-day-name {
  text-align: center;
  font-weight: 600;
  padding: 10px 0;
  font-size: 0.9rem;
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  grid-template-rows: repeat(6, 1fr);
  gap: 2px;
  height: 290px;
}

.calendar-day-cell {
  background-color: rgba(255, 255, 255, 0.5);
  position: relative;
  border-radius: 4px;
  padding: 5px;
  cursor: pointer;
  transition: background-color 0.2s;
  display: flex;
  flex-direction: column;
}

.calendar-day-cell:hover {
  background-color: rgba(142, 68, 173, 0.2);
}

.calendar-day-cell.other-month {
  background-color: rgba(255, 255, 255, 0.2);
  color: #888;
}

.calendar-day-cell.current-day {
  background-color: rgba(142, 68, 173, 0.4);
  color: white;
  font-weight: bold;
}

.day-number {
  font-size: 1rem;
  margin-bottom: 5px;
}

/* Focus Indicators */
.focus-indicators {
  position: absolute;
  bottom: 5px;
  right: 5px;
  display: flex;
  gap: 4px;
}

.focus-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.personal-focus {
  background-color: #28a745;
}

.work-focus {
  background-color: #007bff;
}

/* Focus Lists Styles */
.content-container {
  width: 100%;
  max-height: 250px;
  overflow-y: auto;
}

.completed-focus {
  text-decoration: line-through;
  color: #6c757d;
}

.focus-actions {
  display: flex !important;
  align-items: center !important;
  gap: 10px !important;
  justify-content: flex-end !important;
  min-width: 80px;
  flex-direction: row-reverse !important;
}

/* Quote Card Styles */
.quote-card {
  min-height: auto;
}

.quote-container {
  flex-grow: 1;
  overflow-y: hidden;
  max-height: 80px;
}

.quote-text {
  font-size: 1.15rem;
  font-style: italic;
  font-weight: 400;
  line-height: 1.4;
  margin-bottom: 0;
  text-shadow: 0.2px 0.2px 0px rgba(0,0,0,0.2);
}
.list-group-item {
  background-color: rgba(255, 255, 255, 0.5) !important;
  border-color: rgba(0, 0, 0, 0.05) !important;
}

/* Input Styles */
.input-group {
  margin-bottom: 0;
}

.input-group .form-control {
  background-color: rgba(255, 255, 255, 0.7);
  border-color: rgba(142, 68, 173, 0.3);
}

.input-group .form-control:focus {
  background-color: rgba(255, 255, 255, 0.9);
  box-shadow: 0 0 0 0.25rem rgba(142, 68, 173, 0.25);
  border-color: #8e44ad;
}

.card-footer {
  background-color: rgba(255, 255, 255, 0.3);
  border-top: 1px solid rgba(0, 0, 0, 0.1);
}
</style>