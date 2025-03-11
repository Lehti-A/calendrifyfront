<template>
  <Modal :modal-is-open="modalIsOpen"
         @event-close-modal="$emit('event-close-modal')"
  >
    <template #title>
      Delete Account
    </template>

    <template #body>
      <div class="d-flex flex-column align-items-center justify-content-center mt-4">
        <div class="col mb-4">
          <AlertDanger :message="errorMessage"/>
        </div>

        <p class="text-center mb-4">Are you sure you want to delete your account? This action cannot be undone.</p>

        <div class="mb-3 w-100">
          <label for="confirmPassword" class="form-label">Enter your password to confirm</label>
          <input v-model="password" type="password" class="form-control" id="confirmPassword" placeholder="Enter your password" required/>
        </div>
      </div>
    </template>

    <template #footer>
      <div class="d-flex justify-content-center w-75 gap-3">
        <button @click="$emit('event-close-modal')" class="btn btn-secondary flex-grow-1">Cancel</button>
        <button @click="deleteAccount" class="btn btn-danger flex-grow-1">Delete Account</button>
      </div>
    </template>

  </Modal>
</template>


<script>
import Modal from "@/components/modal/Modal.vue";
import AlertDanger from "@/components/alert/AlertDanger.vue";
// You'll need to create or import a service for account deletion
// import UserService from "@/services/UserService";
import NavigationServices from "@/services/NavigationServices";

export default {
  name: 'DeleteAccountModal',
  components: {
    Modal,
    AlertDanger
  },

  props: {
    modalIsOpen: Boolean,
  },

  data() {
    return {
      password: '',
      errorMessage: ''
    }
  },

  methods: {
    deleteAccount() {
      if (this.validatePassword()) {
        this.sendDeleteAccountRequest();
      }
    },

    validatePassword() {
      if (!this.password) {
        this.showError('Please enter your password to confirm account deletion');
        return false;
      }
      return true;
    },

    sendDeleteAccountRequest() {
      // In a real application, you would call your API here
      // Example:
      // UserService.deleteAccount(this.password)
      //   .then(response => this.handleSuccess())
      //   .catch(error => this.handleError(error));

      // For demo purposes, we'll simulate a password check
      // In a real application, this would be done on the server
      const correctPassword = "password123"; // This would come from your authentication system

      if (this.password === correctPassword) {
        this.handleSuccess();
      } else {
        // Simulate wrong password error
        const error = {
          response: {
            status: 403,
            data: {
              message: "Incorrect password. Please try again."
            }
          }
        };
        this.handleError(error);
      }
    },

    handleSuccess() {
      // Clear session storage
      sessionStorage.clear();

      // Store a flag in localStorage to show the success message after navigation
      localStorage.setItem('accountDeletedSuccess', 'true');

      // Navigate to home view
      NavigationServices.navigateToHomeView();
    },

    handleError(error) {
      // Handle API errors here
      if (error.response && error.response.status === 403) {
        this.showError('Incorrect password. Please try again.');
      } else if (error.response && error.response.data && error.response.data.message) {
        this.showError(error.response.data.message);
      } else {
        this.showError('Failed to delete account. Please try again later.');
      }
      console.error(error);
      this.resetForm();
    },

    showError(message) {
      this.errorMessage = message;
      setTimeout(this.resetErrorMessage, 4000);
    },

    resetErrorMessage() {
      this.errorMessage = '';
    },

    resetForm() {
      this.password = '';
    }
  }
}
</script>