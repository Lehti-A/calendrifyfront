<template>
  <div>
    <LoginModal :modal-is-open="modalIsOpen"
                @event-close-modal="closeLoginModal"
                @event-update-nav-menu="$emit('event-update-nav-menu')"
    />

    <!-- Success Alert for Account Deletion -->
    <div v-if="showAccountDeletedAlert" class="account-deleted-alert">
      <div class="alert alert-success alert-dismissible fade show" role="alert">
        Your account has been successfully deleted.
        <button type="button" class="btn-close" @click="dismissAccountDeletedAlert" aria-label="Close"></button>
      </div>
    </div>

    <div v-if="showRegistrationAlert" class="account-deleted-alert">
      <div class="alert alert-success alert-dismissible fade show" role="alert">
        Your account has been successfully registered. You can now log in.
        <button type="button" class="btn-close" @click="dismissRegistrationAlert" aria-label="Close"></button>
      </div>
    </div>


    <div class="content">
      <div v-if="!isLoggedIn" >
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
      </div>
      <div class="row justify-content-center mt-5">
        <div class="col-md-8 d-flex flex-column align-items-center justify-content-center text-center">
          <h2 class="fw-bold">Stay Organized, Stay Ahead – Welcome to Your Ultimate Calendar Solution!</h2>
          <h5 class="mt-3 text-muted">
            In today's fast-paced world, managing your time effectively is the key to success. Our powerful, intuitive,
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
      isLoggedIn: false,
      modalIsOpen: false,
      showAccountDeletedAlert: false,
      showRegistrationAlert: false
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

    decideIsLoggedIn() {
      let userId = sessionStorage.getItem('userId')
      this.isLoggedIn = userId !== null
    },

    checkAccountDeletedStatus() {
      const accountDeleted = localStorage.getItem('accountDeletedSuccess');
      if (accountDeleted === 'true') {
        this.showAccountDeletedAlert = true;
        localStorage.removeItem('accountDeletedSuccess');

        // Auto-dismiss the alert after 5 seconds
        setTimeout(() => {
          this.dismissAccountDeletedAlert();
        }, 5000);
      }
    },
    checkRegistrationStatus() {
      const registrationSuccess = localStorage.getItem('registrationSuccess');
      if (registrationSuccess === 'true') {
        this.showRegistrationAlert = true;
        localStorage.removeItem('registrationSuccess');

        // Auto-dismiss the alert after 5 seconds
        setTimeout(() => {
          this.dismissRegistrationAlert();
        }, 5000);
      }
    },

    dismissAccountDeletedAlert() {
      this.showAccountDeletedAlert = false;
    },
    dismissRegistrationAlert() {
      this.showRegistrationAlert = false;
    }

  },

  beforeMount() {
    this.decideIsLoggedIn()
  },

  mounted() {
    this.checkAccountDeletedStatus();
    this.checkRegistrationStatus();
  }
}
</script>

<style scoped>
/* ... (Your existing alert styles) ... */

/* Updated Content Positioning */
.content {
  position: absolute;
  top: 10%; /* Reduced top value to move the content higher */
  left: 0;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding-top: 20px;
}

.content > div {
  margin-bottom: 20px;
}

/* Adjustments for buttons (optional) */
.btn-light {
  /* You can add styles to your buttons if needed */
}

.btn-link {
  /* You can add styles to your link buttons if needed */
}
</style>