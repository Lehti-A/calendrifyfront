<template>
  <div>
    <!-- Modal -->
    <div v-if="modalIsOpen" class="modal-overlay">
      <div class="modal-container w-75 mx-auto">
        <div class="modal-content p-5">
          <div class="modal-header">
            <h1 class="modal-title fs-5">
              <slot name="title"></slot>
            </h1>
            <button type="button" class="btn-close" @click="$emit('event-close-modal')" aria-label="Close"/>
          </div>
          <div class="modal-body">
            <slot name="body"></slot>
          </div>
          <div class="modal-footer mt-3">
            <button type="button" class="btn btn-secondary w-50" @click="$emit('event-close-modal')">Cancel</button>
            <slot name="footer"></slot>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Modal",
  props:{
    modalIsOpen: Boolean
  }
};
</script>

<style scoped>
/* Modal Overlay */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5); /* Semi-transparent background */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1050; /* Ensure it appears above all other content */
}

/* Modal Container */
.modal-container {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
  max-width: 400px;
  width: 100%;
}

/* Modal Content */
.modal-content {
  display: flex;
  flex-direction: column;
}

/* Modal Header */
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

/* Modal Footer */
.modal-footer {
  display: flex;
  justify-content: flex-end;
}
</style>

