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
              id="email"
              class="form-control"
              v-model="formData.email"
              placeholder="Enter your email"
              required
          />
        </div>

        <!-- Password Input -->
        <div class="mb-3">
          <label for="password" class="form-label">Password</label>
          <input
              type="password"
              id="password"
              class="form-control"
              v-model="formData.password"
              placeholder="Enter your password"
              required
          />
        </div>

        <!-- Retype Password Input -->
        <div class="mb-3">
          <label for="retypePassword" class="form-label">Retype Password</label>
          <input
              type="password"
              id="retypePassword"
              class="form-control"
              v-model="formData.retypePassword"
              placeholder="Retype your password"
              required
          />
        </div>

        <!-- Address Input -->
        <div class="mb-3">
          <label for="address" class="form-label">Address</label>
          <input
              type="text"
              id="address"
              class="form-control"
              v-model="formData.address"
              placeholder="Enter your address"
              required
          />
        </div>

        <!-- Phone Input -->
        <div class="mb-3">
          <label for="phone" class="form-label">Phone</label>
          <input
              type="tel"
              id="phone"
              class="form-control"
              v-model="formData.phone"
              placeholder="Enter your phone number"
              required
          />
        </div>
        <div class="form-check mb-3">
          <input
              type="checkbox"
              id="terms"
              class="form-check-input"
              v-model="formData.terms"
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
      backgroundImage: require('@/assets/calendrify.gif'), // Background image
      formData: {
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
      if (this.formData.password !== this.formData.retypePassword) {
        alert("Passwords do not match!");
        return;
      }

      // Simulate API call for registration
      console.log("Registering user with data:", this.formData);

      this.formData = {
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




