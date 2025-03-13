/* Custom column width - between col-md-4 and col-md-5 */
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
              <li v-for="(goal, index) in personalGoals" :key="index"
                  class="list-group-item d-flex align-items-center justify-content-between">
                <span>{{ goal.topic }}</span>
                <div class="goal-actions">
                  <button class="btn btn-sm btn-link text-danger p-0"
                          @click="deletePersonalGoal(goal.personalGoalTemplateId, index)"
                          title="Remove goal">
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
                  v-model="newTopic"
                  @keyup.enter="addPersonalGoal"
              />
              <button class="btn btn-outline-secondary btn-sm" type="button" @click="addPersonalGoal">Add</button>
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
import axios from "axios";
import NavigationServices from "@/services/NavigationServices";

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
        address: '',
        phone: ''
      },
      userId: Number(sessionStorage.getItem('userId')),
      personalGoals: [
        {
          topic: ''
        }
      ],
      newTopic: '',
      personalGoalTemplateId: '',
      newGoal: '',

      // Modal controls
      passwordModalOpen:
          false,
      deleteAccountModalOpen:
          false,
      // Alert controls
      showProfileUpdateAlert:
          false,
      // UI helpers
      hasFontAwesome:
          false
    }
        ;
  },

  methods: {

    loadUserData() {
      axios.get('/settings-user', {
            params: {
              userId: this.userId
            }
          }
      )
          .then(response => {
                this.userProfile = response.data
              }
          )
          .catch(() => NavigationServices.navigateToErrorView())
    },

    updateProfile() {
      axios.patch('/settings-user', this.userProfile, {
            params: {
              userId: this.userId
            }
          }
      )
          .then(() => NavigationServices.navigateToSettingsView())
          .catch(() => NavigationServices.navigateToErrorView())
    },

    loadPersonalGoals() {
      axios.get('/settings-personal-goal', {
            params: {
              userId: this.userId
            }
          }
      )
          .then(response => {
                this.personalGoals = response.data.personalGoals || response.data;
              }
          )
          .catch(() => NavigationServices.navigateToErrorView())
    },
    addPersonalGoal() {
      if (!this.newTopic.trim()) {
        return; // Prevent empty goals from being added
      }

      axios.post('/settings-personal-goal', { topic: this.newTopic }, {
        params: { userId: this.userId }
      })
          .then(response => {
            this.personalGoals.push(response.data); // Add new goal to the list
            this.newTopic = ''; // Clear input field
            this.loadPersonalGoals();
          })
          .catch(() => NavigationServices.navigateToErrorView());
    },

    deletePersonalGoal(personalGoalTemplateId, index) {
      axios({
        method: 'delete',
        url: '/settings-personal-goal',
        params: { personalGoalTemplateId }
      })
          .then(response => {
            this.personalGoals.splice(index, 1);
            console.log("Goal deleted successfully");
          })
          .catch(error => {
            console.error("Delete error:", error);
            alert("Failed to delete goal");
          });
    },
    // Dismiss profile update alert
    dismissProfileUpdateAlert() {
      this.showProfileUpdateAlert = false;
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
  },
  beforeMount() {
    this.loadUserData()
    this.loadPersonalGoals()
  },
}
</script>

<style src="@/assets/css/settingsview.css" scoped></style>