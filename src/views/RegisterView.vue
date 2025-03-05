<template>

<div>

  <div class="background-image">
    <img :src="backgroundImage" alt="Background Image" />
  </div>

  <div class="registration-container d-flex justify-content-center align-items-center vh-100">
    <div class="card p-4 rounded shadow-sm" style="max-width: 400px; background-color: white;">
      <h2 class="text-center mb-4">Register</h2>


      <form>
        <div class="mb-3">
          <label for="email" class="form-label">Email</label>
          <input
              type="email"
              class="form-control"
              v-model="newUser.email"
              placeholder="Enter your email"
              required
          />
        </div>


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


        <div class="mb-3">
          <label for="address" class="form-label">Address</label>
          <input
              type="text"
              class="form-control"
              v-model="newUser.address"
              placeholder="Enter your address"
              required
          />
        </div>


        <div class="mb-3">
          <label for="phone" class="form-label">Phone</label>
          <input
              type="tel"
              class="form-control"
              v-model="newUser.phone"
              placeholder="Enter your phone number"
              required
          />
        </div>
        <div class="form-check mb-3">
          <input
              type="checkbox"
              class="form-check-input"
              v-model="newUser.termsAgreed"
              required
          />
          <label for="terms" class="form-check-label">
            Agree to <a href="/terms" target="_blank">Terms and Conditions</a>
          </label>
        </div>
        <div class="d-flex justify-content-between">
          <button type="button" class="btn btn-secondary flex-grow-1 me-2" @click="navigateBack">Back</button>
          <button type="submit" class="btn btn-primary flex-grow-1" @click="addNewUser">Register</button>
        </div>
      </form>
    </div>
  </div>
</div>
</template>

<script>
import UserService from "@/services/UserService";
import NavigationServices from "@/services/NavigationServices";

export default {
  name: "RegisterView",
  data() {
    return {
      backgroundImage: require('@/assets/calendrifynew.gif'),
      passwordRetype:'',
      errorMessage: '',
      newUser: {
        email: '',
        password: '',
        address: '',
        phone: '',
        termsAgreed: false,
      },
    };
  },
  methods: {
    addNewUser(){
      if(this.passwordNoMatch()){
        this.errorMessage = "Paroolid ei kattu"
      } else {
        UserService.sendPostNewUserRequest(this.newUser)
            .then(() => NavigationServices.navigateToHomeView())
            .catch(() => NavigationServices.navigateToErrorView())

      }
    },

    passwordNoMatch() {
      return this.passwordRetype !== this.newUser.password
    },









    navigateBack(){
      this.$router.go(-1)
    }


  },
}

</script>

<style src="@/assets/css/register.css"></style>




