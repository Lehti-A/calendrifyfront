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

<style src="@/assets/css/settingsview.css" scoped></style>