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

  beforeDestroy() {

    if (this.errorTimeout) {
      clearTimeout(this.errorTimeout);
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
      if (!this.currentPassword || !this.newPassword || !this.confirmPassword) {
        this.showError('Please fill in all fields');
        return false;
      }

      if (this.newPassword !== this.confirmPassword) {
        this.showError('New passwords do not match');
        this.resetPasswordFields();
        return false;
      }

      return true;
    },

    sendPasswordChangeRequest() {

      const passwordData = {
        currentPassword: this.currentPassword,
        newPassword: this.newPassword
      };

      axios.patch('/settings-password', passwordData, {
        params: {
          userId: this.userId
        },
        headers: {
          'Content-Type': 'application/json'
        }
      })
          .then(() => {
            this.handleSuccess();
          })
          .catch(error => {
            this.handleError(error);
          });
    },

    handleSuccess() {
      this.showSuccessMessage = true;
      this.errorMessage = '';

      this.resetForm();

      setTimeout(() => {
        this.$emit('event-close-modal');
        this.showSuccessMessage = false;
      }, 2000);
    },

    handleError(error) {
      if (!error.response) {
        this.showError('Server connection error. Please try again later.');
        this.resetForm();
        return;
      }

      const { status, data } = error.response;

      if (status === 500 ||
          (status === 400 && data?.message === "Current password is incorrect") ||
          (status === HttpStatusCodes.STATUS_FORBIDDEN && data?.errorCode === BusinessErrors.CODE_INCORRECT_CREDENTIALS)) {
        this.showError('Current password is incorrect');
        this.currentPassword = '';
        return;
      }

      if (status === 401) {
        this.showError('Unauthorized access');
      } else if (status === 400) {
        this.showError('Invalid password format');
      } else if (status === 404) {
        this.showError('User not found');
      } else if (data?.message) {
        this.showError(data.message);
      } else {
        this.showError('Failed to change password. Please try again.');
      }

      this.resetForm();
    },

    showError(message) {
      this.errorMessage = message;

      if (this.errorTimeout) {
        clearTimeout(this.errorTimeout);
      }

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