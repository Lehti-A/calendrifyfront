<template>
  <div>
    <div class="registration-container d-flex justify-content-center align-items-center vh-100">
      <div class="card p-4 rounded shadow-sm semi-transparent-card" style="min-width: 600px;">
        <h2 class="text-center mb-4">Register</h2>

        <form>
          <div @submit.prevent="addNewUser">
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
      backgroundImage: require('@/assets/images/calendrifynew.gif'),
      passwordRetype: '',
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
    addNewUser() {
      if (this.passwordNoMatch()) {
        this.errorMessage = "Paroolid ei kattu"
      } else {
        // Disable the submit button to prevent multiple submissions
        const submitBtn = document.querySelector('button[type="submit"]');
        if (submitBtn) submitBtn.disabled = true;

        UserService.sendPostNewUserRequest(this.newUser)
            .then(() => {
              console.log("Registration successful, navigating to home view...");
              // Set registration success flag in localStorage
              localStorage.setItem('registrationSuccess', 'true');

              // Navigate to home view using multiple approaches for redundancy
              NavigationServices.navigateToHomeView();

              // Fallback navigation if NavigationServices fails
              setTimeout(() => {
                if (this.$router) {
                  if (this.$route.name !== 'homeRoute') {
                    this.$router.push({ name: 'homeRoute' });
                  }
                }
              }, 100);
            })
            .catch((error) => {
              console.error("Registration error:", error);
              NavigationServices.navigateToErrorView();

              // Re-enable the submit button if there's an error
              if (submitBtn) submitBtn.disabled = false;
            });
      }
    },
    passwordNoMatch() {
      return this.passwordRetype !== this.newUser.password
    },
    navigateBack() {
      this.$router.go(-1)
    }
  },
}

</script>

<style src="@/assets/css/register.css"></style>




