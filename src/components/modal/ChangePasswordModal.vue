<template>
  <Modal :modal-is-open="modalIsOpen"
         @event-close-modal="closeModal"
  >
    <template #title>
      Change Password
    </template>

    <template #body>
      <form class="d-flex flex-column align-items-center justify-content-center mt-4">
        <div class="col">
          <AlertDanger :message="errorMessage"/>
          <AlertSuccess v-if="showSuccessMessage" :message="successMessage"/>
        </div>

        <div class="mb-3 w-100">
          <label for="currentPassword" class="form-label">Current Password</label>
          <input v-model="currentPassword" type="password" class="form-control" id="currentPassword"
                 placeholder="Enter your current password" required/>
        </div>

        <div class="mb-3 w-100">
          <label for="newPassword" class="form-label">New Password</label>
          <input v-model="newPassword" type="password" class="form-control" id="newPassword"
                 placeholder="Enter your new password" required/>
        </div>

        <div class="mb-3 w-100">
          <label for="confirmPassword" class="form-label">Confirm New Password</label>
          <input v-model="confirmPassword" type="password" class="form-control" id="confirmPassword"
                 placeholder="Confirm your new password" required/>
        </div>
      </form>
    </template>

    <template #footer>
      <div class="d-flex justify-content-center w-75 gap-3">
        <button @click="closeModal" class="btn btn-secondary flex-grow-1">Cancel</button>
        <button @click="changePassword" class="btn btn-primary flex-grow-1">Update</button>
      </div>
    </template>

  </Modal>
</template>


<script>
import Modal from "@/components/modal/Modal.vue";
import AlertDanger from "@/components/alert/AlertDanger.vue";
import AlertSuccess from "@/components/alert/AlertSuccess.vue";
import axios from "axios";
import HttpStatusCodes from "@/errors/HttpStatusCodes";
import BusinessErrors from "@/errors/BusinessErrors";

export default {
  name: 'ChangePasswordModal',
  components: {
    Modal,
    AlertDanger,
    AlertSuccess
  },

  props: {
    modalIsOpen: Boolean,
  },

  beforeDestroy() {
    // Clear any existing timeout when component is destroyed
    if (this.errorTimeout) {
      clearTimeout(this.errorTimeout);
    }
  },

  data() {
    return {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
      errorMessage: '',
      successMessage: 'Password changed successfully!',
      showSuccessMessage: false,
      userId: Number(sessionStorage.getItem('userId')),
      errorTimeout: null
    }
  },

  methods: {
    closeModal() {
      this.resetForm();
      this.$emit('event-close-modal');
    },

    changePassword() {
      if (this.validateFields()) {
        this.sendPasswordChangeRequest();
      }
    },

    validateFields() {
      // Check if all fields are filled
      if (!this.currentPassword || !this.newPassword || !this.confirmPassword) {
        this.showError('Please fill in all fields');
        return false;
      }

      // Check if new password and confirmation match
      if (this.newPassword !== this.confirmPassword) {
        this.showError('New passwords do not match');
        this.resetPasswordFields();
        return false;
      }

      return true;
    },

    sendPasswordChangeRequest() {
      // Create the request payload with both current and new password
      const passwordData = {
        currentPassword: this.currentPassword,
        newPassword: this.newPassword
      };

      // Send the password change request
      axios.patch('/settings-password', passwordData, {
        params: {
          userId: this.userId
        },
        headers: {
          'Content-Type': 'application/json'
        }
      })
          .then(response => {
            console.log("Password update successful:", response);
            this.handleSuccess();
          })
          .catch(error => {
            console.error("Password update failed:", error);
            this.handleError(error);
          });
    },

    handleSuccess() {
      this.showSuccessMessage = true;
      this.errorMessage = '';

      // Reset the form
      this.resetForm();

      // Close the modal after 2 seconds
      setTimeout(() => {
        this.$emit('event-close-modal');
        this.showSuccessMessage = false;
      }, 2000);
    },

    handleError(error) {
      // Handle different types of API errors
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        if (error.response.status === 401) {
          this.showError('Unauthorized access');
          this.resetForm();
        } else if (error.response.status === 400) {
          if (error.response.data && error.response.data.message === "Current password is incorrect") {
            this.showError('Current password is incorrect');
            this.currentPassword = '';
          } else {
            this.showError('Invalid password format');
            this.resetPasswordFields();
          }
        } else if (error.response.status === 404) {
          this.showError('User not found');
          this.resetForm();
        } else if (HttpStatusCodes.STATUS_FORBIDDEN === error.response.status
            && BusinessErrors.CODE_INCORRECT_CREDENTIALS === error.response.data.errorCode) {
          this.showError('Current password is incorrect');
          this.currentPassword = '';
        } else if (error.response.data && error.response.data.message) {
          // Display server-provided error message if available
          this.showError(error.response.data.message);
          this.resetPasswordFields();
        } else {
          this.showError('Failed to change password. Please try again.');
          this.resetForm();
        }
      } else if (error.request) {
        // The request was made but no response was received
        this.showError('Server not responding. Please try again later.');
        this.resetForm();
      } else {
        // Something happened in setting up the request that triggered an Error
        this.showError('An error occurred. Please try again.');
        this.resetForm();
      }
    },

    showError(message) {
      this.errorMessage = message;

      // Clear any existing timeout
      if (this.errorTimeout) {
        clearTimeout(this.errorTimeout);
      }

      // Set new timeout to clear the error message
      this.errorTimeout = setTimeout(() => {
        this.errorMessage = '';
      }, 4000);
    },

    resetPasswordFields() {
      this.newPassword = '';
      this.confirmPassword = '';
    },

    resetForm() {
      this.currentPassword = '';
      this.newPassword = '';
      this.confirmPassword = '';
      this.errorMessage = '';
    }
  }
}
</script>