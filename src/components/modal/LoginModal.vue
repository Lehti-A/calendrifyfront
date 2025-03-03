<template>
  <Modal :modal-is-open="modalIsOpen"
         @event-close-modal="$emit('event-close-modal')"
  >

    <template #title>
      Calendrify login
    </template>

    <template #body>
      <h3>"You define your own life. Don't let other people write your script"</h3>
    </template>

    <template #footer>
      <button @click="executeLogin" class="btn btn-outline-success">Login</button>
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
