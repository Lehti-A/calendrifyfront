<template>
  <Modal :modal-is-open="modalIsOpen"
         @event-close-modal="$emit('event-close-modal')"
  >

    <template #title>
      Calendrify login
    </template>

    <template #body>
      <form class="d-flex flex-column align-items-center justify-content-center mt-4">
        <!-- Username Input -->
        <div class="mb-3 w-100">
          <label for="username" class="form-label">Email</label>
          <input type="text" class="form-control" id="username" placeholder="Enter your email"/>
        </div>
        <!-- Password Input -->
        <div class="mb-3 w-100">
          <label for="password" class="form-label">Password</label>
          <input type="password" class="form-control" id="password" placeholder="Enter your password"/>
        </div>
      </form>
    </template>

    <template #footer>
      <button @click="executeLogin" class="btn btn-outline-success w-50">Login</button>
    </template>

  </Modal>
</template>


<script>
import Modal from "@/components/modal/Modal.vue";

export default {
  name: 'LoginModal',
  components: {Modal},
  props: {
    modalIsOpen: Boolean
  },
  methods: {
    executeLogin() {
      this.$emit('event-execute-login')
    },
  }
}
</script>
