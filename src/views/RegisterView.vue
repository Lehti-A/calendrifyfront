<template>

<div>

  <div class="background-image">
    <img :src="backgroundImage" alt="Background Image" />
  </div>

  <div class="registration-container d-flex justify-content-center align-items-center vh-100">
    <div class="card p-4 rounded shadow-sm" style="max-width: 400px; background-color: white;">
      <h2 class="text-center mb-4">Register</h2>


      <form @submit.prevent="handleRegister">

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
              v-model="newUser.retypePassword"
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
              v-model="newUser.terms"
              required
          />
          <label for="terms" class="form-check-label">
            Agree to <a href="/terms" target="_blank">Terms and Conditions</a>
          </label>
        </div>
        <div class="d-flex justify-content-between">
          <button type="button" class="btn btn-secondary flex-grow-1 me-2" @click="navigateBack">Back</button>
          <button type="submit" class="btn btn-primary flex-grow-1 ">Register</button>
        </div>
      </form>
    </div>
  </div>
</div>
</template>

<script>
export default {
  name: "RegisterView",
  data() {
    return {
      backgroundImage: require('@/assets/calendrify.gif'),
      errorMessage: '',
      newUser: {
        email: "",
        password: "",
        retypePassword: "",
        address: "",
        phone: "",
        terms: false,
      },
    };
  },
  methods: {
    handleRegister() {
      if (this.newUser.password !== this.newUser.retypePassword) {
        alert("Passwords do not match!");
        return;
      }
      this.newUser = {
        email: "",
        password: "",
        retypePassword: "",
        address: "",
        phone: "",
        terms: false,
      };

      this.$router.push({ name: "homeRoute" });
    },
    navigateBack() {
      this.$router.go(-1);
    },
  },
};
</script>

<style src="@/assets/register.css"></style>




