/* Custom column width - between col-md-4 and col-md-5 */
<template>
  <div class="container-fluid px-4 pb-4 settings-container">
    <div class="row mb-5 align-items-center header-row">
      <div class="col text-center">
        <h1 class="mb-1 fw-bold simple-header">
          SETTINGS
        </h1>

        <!-- Success alert for profile update -->
        <div v-if="showProfileUpdateAlert" class="mt-3 mx-auto profile-update-alert">
          <div class="alert alert-success alert-dismissible fade show" role="alert">
            Profile updated successfully!
            <button type="button" class="btn-close" @click="dismissProfileUpdateAlert" aria-label="Close"></button>
          </div>
        </div>
      </div>
    </div>

    <!-- Password Change Modal - Using new component -->
    <ChangePasswordModal
        :modal-is-open="passwordModalOpen"
        @event-close-modal="closePasswordModal"
    />

    <!-- Delete Account Confirmation Modal -->
    <DeleteAccountModal
        :modal-is-open="deleteAccountModalOpen"
        @event-close-modal="closeDeleteAccountModal"
    />

    <!-- Main Two-Column Layout -->
    <div class="row justify-content-center">
      <!-- Left Column (Profile & Account Settings) -->
      <div class="col-md-5 mb-4 left-column">
        <!-- Profile Settings -->
        <div class="card semi-transparent-card mb-4 profile-card">
          <div class="card-header bg-transparent">
            <strong>Profile Settings</strong>
          </div>
          <div class="card-body">
            <form>
              <div class="mb-3">
                <label for="email" class="form-label">Email</label>
                <input type="email" class="form-control" id="email" v-model="userProfile.email"/>
              </div>
              <div class="mb-3">
                <label for="firstName" class="form-label">First Name</label>
                <input type="text" class="form-control" id="firstName" v-model="userProfile.firstName"/>
              </div>
              <div class="mb-3">
                <label for="lastName" class="form-label">Last Name</label>
                <input type="text" class="form-control" id="lastName" v-model="userProfile.lastName"/>
              </div>
              <div class="mb-3">
                <label for="address" class="form-label">Address</label>
                <input type="text" class="form-control" id="address" v-model="userProfile.address"/>
              </div>
              <div class="mb-3">
                <label for="phone" class="form-label">Phone</label>
                <input type="tel" class="form-control" id="phone" v-model="userProfile.phone"/>
              </div>
              <div class="d-grid">
                <button type="button" class="btn btn-primary" @click="updateProfile">
                  Update Profile
                </button>
              </div>
            </form>
          </div>
        </div>

        <!-- Account Actions Card -->
        <div class="card semi-transparent-card account-actions-card">
          <div class="card-header bg-transparent">
            <strong>Account Actions</strong>
          </div>
          <div class="card-body d-flex align-items-center">
            <div class="row w-100">
              <div class="col-12 mb-3">
                <button type="button" class="btn btn-outline-primary w-100" @click="openPasswordModal">
                  Change Password
                </button>
              </div>
              <div class="col-12">
                <button type="button" class="btn btn-outline-danger w-100" @click="openDeleteAccountModal">
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Column (Personal Goals) -->
      <div class="col-md-5 right-column">
        <!-- Personal Goals -->
        <div class="card semi-transparent-card goals-card">
          <div class="card-header bg-transparent">
            <strong>Personal Goals</strong>
          </div>
          <div class="content-container">
            <ul class="list-group list-group-flush">
              <li v-for="(goal, index) in goals" :key="index"
                  class="list-group-item d-flex align-items-center justify-content-between">
                <span>{{ goal.text }}</span>
                <div class="goal-actions">
                  <button
                      class="btn btn-sm btn-link text-danger p-0"
                      @click="removeGoal(index)"
                      title="Remove goal"
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
                  v-model="newGoal"
                  @keyup.enter="addGoal"
              >
              <button class="btn btn-outline-secondary btn-sm" type="button" @click="addGoal">Add</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ChangePasswordModal from "@/components/modal/ChangePasswordModal.vue";
import DeleteAccountModal from "@/components/modal/DeleteAccountModal.vue";

export default {
  name: 'SettingsView',
  components: {
    ChangePasswordModal,
    DeleteAccountModal
  },
  data() {
    return {
      // User profile settings
      userProfile: {
        email: '',
        firstName: '',
        lastName: '',
        address: '',
        phone: ''
      },

      // Personal goals
      goals: [
        {text: "Play tennis", completed: false},
        {text: "Uurida, et kuidas me linnukeste asjaga süsteemi update-ime", completed: false}
      ],
      newGoal: "",

      // Modal controls
      passwordModalOpen: false,
      deleteAccountModalOpen: false,

      // Alert controls
      showProfileUpdateAlert: false,

      // UI helpers
      hasFontAwesome: false
    };
  },
  computed: {
    currentDay() {
      return new Date().getDate();
    },
    currentMonth() {
      const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
      ];
      return months[new Date().getMonth()];
    },
    currentWeekday() {
      const days = [
        'Sunday', 'Monday', 'Tuesday', 'Wednesday',
        'Thursday', 'Friday', 'Saturday'
      ];
      return days[new Date().getDay()];
    }
  },
  created() {
    // Load user data from localStorage or backend
    this.loadUserData();
  },
  methods: {
    // Load user data
    loadUserData() {
      // In a real app, you would fetch this from an API
      // For now, we'll use hardcoded data
      this.userProfile = {
        email: 'user@example.com',
        firstName: 'John',
        lastName: 'Doe',
        address: '123 Main Street',
        phone: '+1234567890'
      };

      // Load goals from localStorage
      const savedGoals = localStorage.getItem('goals');
      if (savedGoals) {
        this.goals = JSON.parse(savedGoals);
      }
    },

    // Update profile
    updateProfile() {
      // In a real app, you would send this to an API
      console.log('Updating profile:', this.userProfile);

      // Save to localStorage for demo purposes
      localStorage.setItem('userProfile', JSON.stringify(this.userProfile));

      // Show success message
      this.showProfileUpdateAlert = true;

      // Auto-dismiss the alert after 4 seconds
      setTimeout(() => {
        this.dismissProfileUpdateAlert();
      }, 4000);
    },

    // Dismiss profile update alert
    dismissProfileUpdateAlert() {
      this.showProfileUpdateAlert = false;
    },

    // Goal management
    addGoal() {
      if (this.newGoal.trim()) {
        this.goals.push({
          text: this.newGoal.trim(),
          completed: false
        });
        this.newGoal = "";

        // Save to localStorage
        localStorage.setItem('goals', JSON.stringify(this.goals));
      }
    },
    removeGoal(index) {
      this.goals.splice(index, 1);

      // Save to localStorage
      localStorage.setItem('goals', JSON.stringify(this.goals));
    },

    // Password modal methods
    openPasswordModal() {
      this.passwordModalOpen = true;
    },
    closePasswordModal() {
      this.passwordModalOpen = false;
    },

    // Delete account modal methods
    openDeleteAccountModal() {
      this.deleteAccountModalOpen = true;
    },
    closeDeleteAccountModal() {
      this.deleteAccountModalOpen = false;
    }
  }
};
</script>

<style scoped>
.settings-container {
  padding-top: 170px; /* Matches PersonalDayView and WorkDayView padding */
}
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

/* Header styling - exactly matching PersonalDayView/WorkDayView */
.header-row {
  position: relative;
  margin-bottom: 2rem !important;
}

.simple-header {
  color: #ffffff; /* White text */
  font-weight: 700; /* Bold */
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.3); /* Subtle shadow for legibility */
}

/* Semi-transparent cards */
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

/* Card heights and spacing - matching PersonalDayView/WorkDayView */
.h-100 {
  height: 100% !important;
}

/* Card heights to match combined height */
.profile-card {
  min-height: 420px;
}

.account-actions-card {
  min-height: 160px;
}

/* Goals card with height to match combined profile + account actions */
.goals-card {
  min-height: 591px; /* 597px - 2% */
}

/* Left and right column spacing to match other views */
.left-column > .card,
.right-column > .card {
  height: auto;
  margin-bottom: 1rem;
}

/* Primary button styling - to match calendar purple */
.btn-primary {
  background-color: #8e44ad; /* Same purple as calendar */
  border-color: #8e44ad;
}

.btn-primary:hover {
  background-color: #7d3c98; /* Slightly darker on hover */
  border-color: #7d3c98;
}

.btn-primary:active,
.btn-primary:focus {
  background-color: #6c3483; /* Even darker when active/focused */
  border-color: #6c3483;
  box-shadow: 0 0 0 0.25rem rgba(142, 68, 173, 0.4); /* Custom focus shadow */
}

/* Outline button styling */
.btn-outline-primary {
  color: #8e44ad;
  border-color: #8e44ad;
}

.btn-outline-primary:hover,
.btn-outline-primary:active,
.btn-outline-primary:focus {
  background-color: #8e44ad !important;
  border-color: #8e44ad !important;
  color: white !important;
  box-shadow: 0 0 0 0.25rem rgba(142, 68, 173, 0.4) !important;
}


/* Content containers for goals - matched to full height */
.content-container {
  width: 100%;
  flex-grow: 1;
  max-height: 508px; /* 518px - 2% */
  overflow-y: auto;
}

/* Goal actions */
.goal-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

/* Profile update alert styling */
.profile-update-alert {
  max-width: 500px;
}

.profile-update-alert .alert {
  background-color: rgba(25, 135, 84, 0.9);
  color: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border: none;
}

/* Modal styling */
.modal-content {
  background-color: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
}

.modal-header {
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.modal-footer {
  border-top: 1px solid rgba(0, 0, 0, 0.1);
}

.goals-card .btn-outline-secondary {
  color: #8e44ad;
  border-color: #8e44ad;
}

.goals-card .btn-outline-secondary:hover {
  background-color: #8e44ad;
  border-color: #8e44ad;
  color: white;
}

.goals-card .btn-outline-secondary:active,
.goals-card .btn-outline-secondary:focus {
  background-color: #7d3c98;
  border-color: #7d3c98;
  box-shadow: 0 0 0 0.25rem rgba(142, 68, 173, 0.4);
}
</style>