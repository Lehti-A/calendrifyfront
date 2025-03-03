<template>
  <LoginModal :modal-is-open="modalIsOpen"
              @event-close-modal="closeLoginModal"
              @event-execute-login="executeLogin"
  />
  <div>
    <!-- GIF background -->
    <div class="gif-background">
      <!-- Dynamically load the gif -->
      <img :src="gifSrc" alt="Background GIF"/>
    </div>

    <!-- Content section -->
    <div class="content">
      <div class="row justify-content-center">
        <div class="col-auto">
          <button @click="openLoginModal" type="button" class="btn btn-light">Login</button>
        </div>
      </div>
      <div class="row justify-content-center">
        <div class="col-auto">
          <p><a href="#" class="link-light link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover">Register</a>
          </p>
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
import LoginModal from "@/components/modal/LoginModal.vue";
import NavigationServices from "@/services/NavigationServices";

export default {
  name: "GifBackground",
  components: {LoginModal},

  data() {
    return {
      modalIsOpen: false,
      isLoggedIn: false,
      isAdmin: false,
      // Dynamically require the gif from the assets folder
      gifSrc: require('@/assets/calendrify.gif')
    };
  },
  methods: {
    openLoginModal() {
      this.modalIsOpen = true
    },
    closeLoginModal() {
      this.modalIsOpen = false
    },
    executeLogin() {
      NavigationServices.navigateToCalendarView()
      this.isLoggedIn = true
      this.closeLoginModal()
    },
    updateNavMenu() {
      let userId = sessionStorage.getItem('userId')
      this.isLoggedIn = userId !== null
      let roleName = sessionStorage.getItem('roleName')
      this.isAdmin = roleName != null && 'admin' === roleName
    },

  }
};
</script>

