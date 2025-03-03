<template>
  <LoginModal :modal-is-open="modalIsOpen"
              @event-close-modal="closeLoginModal"
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
          <p><a href="#" class="link-light link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover">Register</a></p>
        </div>
      </div>

      <div class="row justify-content-center mt-5">
        <div class="col-md-8 d-flex flex-column align-items-center justify-content-center text-center">
          <h2 class="fw-bold">Stay Organized, Stay Ahead – Welcome to Your Ultimate Calendar Solution!</h2>
          <h5 class="mt-3 text-muted">
            In today’s fast-paced world, managing your time effectively is the key to success. Our powerful, intuitive,
            and beautifully designed calendar platform helps you stay on top of your schedule effortlessly. Whether you're
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
export default {
  name: "GifBackground",
  components: {LoginModal},

  data() {
    return {
      modalIsOpen: false,
      // Dynamically require the gif from the assets folder
      gifSrc: require('@/assets/calendrify.gif')
    };
  },
  methods:{
    openLoginModal(){
      this.modalIsOpen = true
    },
    closeLoginModal() {
      this.modalIsOpen = false
    },

  }
};
</script>

<style scoped>
/* Make the gif cover the whole screen */
.gif-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: -1;
}

img {
  object-fit: cover; /* Ensures the gif covers the entire container */
  width: 100%;
  height: 100%;
}

/* Content section */
.content {
  position: relative;
  z-index: 1;
  color: white;
  text-align: center;
  padding-top: 25px;
}
</style>

