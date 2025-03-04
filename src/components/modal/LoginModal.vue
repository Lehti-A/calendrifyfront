<template>
  <Modal :modal-is-open="modalIsOpen"
         @event-update-nav-menu="$emit('event-update-nav-menu')"
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
          <input type="text" class="form-control" id="username" placeholder="Enter your email" required/>
<!--            todo: vaheta type textilt emaili vastu, et viskaks @ exeptionit-->
<!--            todo: selleks vaheta andmebaasis andmeid-->
        </div>
        <!-- Password Input -->
        <div class="mb-3 w-100">
          <label for="password" class="form-label">Password</label>
          <input type="password" class="form-control" id="password" placeholder="Enter your password" required/>
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
import LoginService from "@/services/LoginService";
import NavigationServices from "@/services/NavigationServices";
import HttpStatusCodes from "@/errors/HttpStatusCodes";
import BusinessErrors from "@/errors/BusinessErrors";

export default {
  name: 'LoginModal',
  components: {Modal},
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
        }

      }
    },
  methods: {

    executeLogin() {
      if (this.allFieldsAreWithCorrectInput()) {
        this.sendLoginRequest();
      } else {
        this.alertMissingFields();
      }
    },

    allFieldsAreWithCorrectInput() {
      return this.email.length > 0 && this.password.length > 0;
    },

    sendLoginRequest() {
      LoginService.sendLoginRequest(this.email, this.password)
          .then(response => this.handleLoginResponse(response))
          .catch(error => this.handleLoginErrorResponse(error))
    },

    handleLoginResponse(response) {
      this.loginResponse = response.data
      this.updateSessionStorageWithUserDetails()
      this.$emit('event-update-nav-menu')
      this.$emit('event-close-modal')
      NavigationServices.navigateToCalendarView();
    },
    updateSessionStorageWithUserDetails() {
      sessionStorage.setItem('userId', this.loginResponse.userId)
      sessionStorage.setItem('roleName', this.loginResponse.roleName)
    },

    handleLoginErrorResponse(error) {
      this.errorResponse = error.response.data
      let httpStatusCode = error.response.status;

      if (this.isIncorrectCredentials(httpStatusCode)) {
        this.handleIncorrectCredentialsAlert()
      } else {
        NavigationServices.navigateToErrorView()
      }
    },

    isIncorrectCredentials(httpStatusCode) {
      return HttpStatusCodes.STATUS_FORBIDDEN === httpStatusCode
          && BusinessErrors.CODE_INCORRECT_CREDENTIALS === this.errorResponse.errorCode;
    },

    handleIncorrectCredentialsAlert() {
      this.message = this.errorResponse.message;
      setTimeout(this.resetAlertMessage, 4000);
    },

    alertMissingFields() {
      this.message = 'Täida kõik väljad'
      setTimeout(this.resetAlertMessage, 4000)
    },

    resetAlertMessage() {
      this.message = ''
    },

  },

      // todo: saada sõnum backendile
      // todo: kui tuleb edukas vastus, siis salvesta session storageisse maha userId roleName
      // todo: emit evendid

      // todo: navigeeri calendar lehele

}
</script>
