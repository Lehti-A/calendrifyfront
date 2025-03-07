<template>
  <Modal :modal-is-open="modalIsOpen"
         @event-update-nav-menu="$emit('event-update-nav-menu')"
         @event-close-modal="$emit('event-close-modal')"
  >
    <template #title>
     February 2025
    </template>

    <template #body>
      <form class="d-flex flex-column align-items-center justify-content-center mt-4">
        <!-- Add form fields here -->
        <div class="mb-3 w-100">
          <label for="eventTitle" class="form-label">Event Title</label>
          <input type="text" class="form-control" id="eventTitle" placeholder="Enter event title">
        </div>

        <div class="mb-3 w-100">
          <label for="description" class="form-label">Description</label>
          <textarea class="form-control" id="description" rows="3" placeholder="Enter description"></textarea>
        </div>

        <div class="mb-3 w-100">
          <label for="date" class="form-label">Date</label>
          <input type="date" name="" id="">
        </div>
      </form>
    </template>
    <template #footer>

    </template>
  </Modal>
</template>
<script>
import Modal from "@/components/modal/Modal.vue";
import AlertDanger from "@/components/alert/AlertDanger.vue";

export default {
  name: 'CalendarModal',
  components: {
    Modal,
    AlertDanger
  },
  props: {
    modalIsOpen: Boolean,
  }
}
</script>



