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

    <div v-if="showProfileErrorAlert" class="mt-3 mx-auto profile-update-alert">
      <div class="alert alert-danger alert-dismissible fade show" role="alert">
        {{ profileErrorMessage }}
        <button type="button" class="btn-close" @click="dismissProfileErrorAlert" aria-label="Close"></button>
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
import PersonalGoalService from '@/services/PersonalGoalService';

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
      originalUserProfile: {
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
      showProfileUpdateAlert: false,
      profileErrorMessage: '',
      showProfileErrorAlert: false,
      // UI helpers
      hasFontAwesome:
          false
    }
        ;
  },

  beforeMount() {
    this.loadUserData()
    this.loadPersonalGoals()
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
            this.userProfile = response.data;
            // Store a deep copy of the original data
            this.originalUserProfile = JSON.parse(JSON.stringify(response.data));
          })
          .catch(() => NavigationServices.navigateToErrorView());
    },

    updateProfile() {
      // Validate that all fields are filled
      if (!this.userProfile.email.trim() || !this.userProfile.address.trim() || !this.userProfile.phone.trim()) {
        // Show validation error as an error message
        this.profileErrorMessage = "ERROR: All fields are required. Please complete all profile information before saving.";
        this.showProfileErrorAlert = true;

        // Restore original values
        this.userProfile = JSON.parse(JSON.stringify(this.originalUserProfile));

        // Hide error after 5 seconds
        setTimeout(() => {
          this.dismissProfileErrorAlert();
        }, 5000);
        return; // Stop execution - don't submit to API
      }

      // Validate email format (check for @ symbol)
      if (!this.userProfile.email.includes('@')) {
        this.profileErrorMessage = "ERROR: Please enter a valid email address with @ symbol.";
        this.showProfileErrorAlert = true;

        // Restore original email value
        this.userProfile.email = this.originalUserProfile.email;

        // Hide error after 5 seconds
        setTimeout(() => {
          this.dismissProfileErrorAlert();
        }, 5000);
        return; // Stop execution - don't submit to API
      }

      // If validation passes, proceed with the update
      axios.patch('/settings-user', this.userProfile, {
        params: {
          userId: this.userId
        }
      })
          .then(response => {
            console.log("Profile updated successfully:", response);
            // Update original profile with new values
            this.originalUserProfile = JSON.parse(JSON.stringify(this.userProfile));
            // Show success message
            this.showProfileUpdateAlert = true;
            // Hide after 5 seconds
            setTimeout(() => {
              this.dismissProfileUpdateAlert();
            }, 5000);
          })
          .catch(error => {
            console.error("Profile update failed:", error);
            // Restore original values on API error too
            this.userProfile = JSON.parse(JSON.stringify(this.originalUserProfile));

            // Check for email conflict in different ways
            let isEmailError = false;

            if (error.response) {
              // Check error status code (409 typically means conflict/duplicate)
              if (error.response.status === 409) {
                isEmailError = true;
              }

              // Check error data if it's a string
              if (typeof error.response.data === 'string' &&
                  error.response.data.toLowerCase().includes('email')) {
                isEmailError = true;
              }

              // Check if error data is an object with message field
              if (error.response.data && error.response.data.message &&
                  typeof error.response.data.message === 'string' &&
                  error.response.data.message.toLowerCase().includes('email')) {
                isEmailError = true;
              }

              // Check if there's an email field in the error object
              if (error.response.data && error.response.data.errors &&
                  error.response.data.errors.email) {
                isEmailError = true;
              }
            }

            if (isEmailError) {
              this.profileErrorMessage = "ERROR: Failed to update profile. email address already in use";
            } else {
              this.profileErrorMessage = "ERROR: Failed to update profile. Please try again later.";
            }

            this.showProfileErrorAlert = true;
            // Hide after 5 seconds
            setTimeout(() => {
              this.dismissProfileErrorAlert();
            }, 5000);
          });
    },

    loadPersonalGoals() {
      PersonalGoalService.getPersonalGoalTemplates(this.userId)
          .then(response => {
            this.personalGoals = response.data.personalGoals || response.data;
          })
          .catch(error => {
            console.error("Error loading personal goal templates:", error);
            NavigationServices.navigateToErrorView();
          });
    },

    addPersonalGoal() {
      if (!this.newTopic.trim()) {
        return; // Prevent empty goals from being added
      }

      PersonalGoalService.addPersonalGoalTemplate(this.newTopic, this.userId)
          .then(() => {
            this.newTopic = ''; // Clear input field
            this.loadPersonalGoals(); // Reload the goals to get the updated list
          })
          .catch(error => {
            console.error("Error adding personal goal template:", error);
            NavigationServices.navigateToErrorView();
          });
    },

    deletePersonalGoal(personalGoalTemplateId, index) {
      PersonalGoalService.deletePersonalGoalTemplate(personalGoalTemplateId)
          .then(() => {
            this.personalGoals.splice(index, 1);
            console.log("Goal template deleted successfully");
          })
          .catch(error => {
            console.error("Delete error:", error);
            alert("Failed to delete goal template");
          });
    },

    dismissProfileUpdateAlert() {
      this.showProfileUpdateAlert = false;
    },

    dismissProfileErrorAlert() {
      this.showProfileErrorAlert = false;
    },

    openPasswordModal() {
      this.passwordModalOpen = true;
    },

    closePasswordModal() {
      this.passwordModalOpen = false;
    },

    openDeleteAccountModal() {
      this.deleteAccountModalOpen = true;
    },

    closeDeleteAccountModal() {
      this.deleteAccountModalOpen = false;
    }
  },

}
</script>

<style src="@/assets/css/settings-view.css" scoped></style>