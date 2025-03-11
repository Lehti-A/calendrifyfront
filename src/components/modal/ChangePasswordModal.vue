<template>
  <Modal :modal-is-open="modalIsOpen"
         @event-close-modal="$emit('event-close-modal')"
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
        <button @click="$emit('event-close-modal')" class="btn btn-secondary flex-grow-1">Cancel</button>
        <button @click="changePassword" class="btn btn-primary flex-grow-1">Update</button>
      </div>
    </template>

  </Modal>
</template>


<script>
import Modal from "@/components/modal/Modal.vue";
import AlertDanger from "@/components/alert/AlertDanger.vue";
import AlertSuccess from "@/components/alert/AlertSuccess.vue";
// Use the appropriate service for password updates
// In a real application, you might have something like:
// import UserService from "@/services/UserService";

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

  data() {
    return {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
      errorMessage: '',
      successMessage: 'Password changed successfully!',
      showSuccessMessage: false
    }
  },

  methods: {
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
        return false;
      }
      return true;
    },

    sendPasswordChangeRequest() {
      // In a real application, you would call your API here
      // Example:
      // PasswordService.changePassword(this.currentPassword, this.newPassword)
      //   .then(response => this.handleSuccess())
      //   .catch(error => this.handleError(error));

      // For now, we'll simulate a successful password change
      this.handleSuccess();
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
      // Handle API errors here
      this.showError('Failed to change password. Please try again.');
      console.error(error);
    },

    showError(message) {
      this.errorMessage = message;
      setTimeout(this.resetErrorMessage, 4000);
    },

    resetErrorMessage() {
      this.errorMessage = '';
    },

    resetForm() {
      this.currentPassword = '';
      this.newPassword = '';
      this.confirmPassword = '';
    }
  }
}
</script>