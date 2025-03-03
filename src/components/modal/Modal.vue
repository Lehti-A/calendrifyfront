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


