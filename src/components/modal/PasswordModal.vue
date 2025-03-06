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
export default {
  name: "PasswordModal"





}
</script>
