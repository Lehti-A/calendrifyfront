<template>
  <div>
    <LoginModal :modal-is-open="modalIsOpen"
                @event-close-modal="closeLoginModal"
                @event-update-nav-menu="$emit('event-update-nav-menu')"
    />
    <div class="content">
      <div class="row justify-content-center">
        <div class="col-auto">
          <button @click="openLoginModal" type="button" class="btn btn-light">Login</button>
        </div>
      </div>
      <div class="row justify-content-center">
        <div class="col-auto">
          <button @click="navigateToRegisterView" type="button"
                  class="btn btn-link link-light link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover">
            Register
          </button>
        </div>
      </div>

      <div class="row justify-content-center mt-5">
        <div class="col-md-8 d-flex flex-column align-items-center justify-content-center text-center">
          <h2 class="fw-bold">Stay Organized, Stay Ahead – Welcome to Your Ultimate Calendar Solution!</h2>
          <h5 class="mt-3 text-muted">
            In today’s fast-paced world, managing your time effectively is the key to success. Our powerful, intuitive,
            and beautifully designed calendar platform helps you stay on top of your schedule effortlessly. Whether
            you're
            a busy professional, a freelancer, or just someone who loves to stay organized, our all-in-one calendar
            solution is built to meet your needs.
          </h5>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import NavigationServices from "@/services/NavigationServices";
import LoginModal from "../components/modal/LoginModal.vue";

export default {
  name: "HomeView",
  components: {LoginModal},
  data() {
    return {
      modalIsOpen: false
    }
  },

  methods: {
    openLoginModal() {
      this.modalIsOpen = true
    },
    closeLoginModal() {
      this.modalIsOpen = false
    },
    navigateToRegisterView() {
      NavigationServices.navigateToRegisterView()
    },

  },

}
</script>

