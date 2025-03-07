<template>

  <div class="mb-3">
    <label for="password" class="form-label">Password</label>
    <input
        type="password"
        class="form-control"
        v-model="newUser.password"
        placeholder="Enter your password"
        required
    />
  </div>

  <div class="mb-3">
    <label for="retypePassword" class="form-label">Retype Password</label>
    <input
        type="password"
        class="form-control"
        v-model="passwordRetype"
        placeholder="Retype your password"
        required
    />
  </div>

</template>



<script>
import Modal from "@/components/modal/Modal.vue";
import AlertDanger from "@/components/alert/AlertDanger.vue";

export default {
  name: "PasswordModal",
  components: {
    Modal,
    AlertDanger
  },

  props: {
    modalIsOpen: Boolean,
  },
  data() {
    return {
      email: '',
      password: '',
      message: '',
      loginResponse: {
        userId: 0,
        roleName: ''
      },
      isLoggedIn: false,
      isAdmin: false,
      errorResponse: {
        message: '',
        errorCode: 0


      },
    }

  },
}
methods: {
}
</script>
