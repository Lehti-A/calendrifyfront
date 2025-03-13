<template>
  <Modal :modal-is-open="modalIsOpen"
         @event-close-modal="$emit('event-close-modal')"
  >
    <template #title>
      Delete Account
    </template>

    <template #body>
      <div class="d-flex flex-column align-items-center justify-content-center mt-4">
        <p class="text-center mb-4">Are you sure you want to delete your account? This action cannot be undone.</p>
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
import axios from "axios";
import NavigationServices from "@/services/NavigationServices";

export default {
  name: 'DeleteAccountModal',
  components: {
    Modal
  },

  props: {
    modalIsOpen: Boolean,
  },

  data() {
    return {
      userId: Number(sessionStorage.getItem('userId'))
    }
  },

  methods: {
    deleteAccount() {
      this.sendDeleteAccountRequest();
    },

    sendDeleteAccountRequest() {
      // Send the delete request to the backend
      axios({
        method: 'delete',
        url: '/settings-user',
        params: { userId: this.userId }
      })
          .then(response => {
            console.log("Account deletion successful:", response);
            this.handleSuccess();
          })
          .catch(error => {
            console.error("Account deletion failed:", error);
            // Just log the error but don't show it to the user
          });
    },

    handleSuccess() {
      // Clear session storage
      sessionStorage.clear();

      // Store a flag in localStorage to show the success message after navigation
      localStorage.setItem('accountDeletedSuccess', 'true');

      // Navigate to home view
      NavigationServices.navigateToHomeView();
    }
  }
}
</script>