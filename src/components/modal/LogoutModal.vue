<template>
  <Modal :modal-is-open="modalIsOpen"
         @event-close-modal="$emit('event-close-modal')"
  >
    <template #title>
      <!-- Empty title to remove the visual line separator -->
    </template>

    <template #body>
      <div class="text-center mt-4 mb-5">
        <h5>Are you sure you want to log out?</h5>
      </div>
    </template>

    <template #footer>
      <div class="d-flex justify-content-center w-75 gap-3">
        <button @click="$emit('event-close-modal')" class="btn btn-secondary flex-grow-1">Cancel</button>
        <button @click="executeLogout" class="btn btn-primary flex-grow-1">Yes</button>
      </div>
    </template>
  </Modal>
</template>

<script>
import Modal from "@/components/modal/Modal.vue";
import NavigationServices from "@/services/NavigationServices";

export default {
  name: 'LogoutModal',
  components: {
    Modal
  },
  props: {
    modalIsOpen: Boolean,
  },
  methods: {
    executeLogout() {
      // Clear session storage
      sessionStorage.clear()

      // Close the modal
      this.$emit('event-close-modal');

      this.$emit('event-update-nav-menu');

      if (this.$route.name === 'homeRoute') {
        window.location.reload(); // Force a full page reload
      } else {
        NavigationServices.navigateToHomeView();
      }
    }
  }
}
</script>



