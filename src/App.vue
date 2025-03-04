<template>


  <nav v-if="isLoggedIn">
    <div class="container text-center">
      <div class="row justify-content-center mt-2 gx-4">

        <div class="col-auto">
          <button type="button" class="btn btn-outline-secondary">Work day</button>
        </div>

        <div class="col-auto">
          <button type="button" class="btn btn-outline-secondary">Personal day</button>
        </div>

        <div class="col-auto">
          <button type="button" class="btn btn-outline-secondary">Calendar</button>
        </div>

        <div class="col-auto">
          <button type="button" class="btn btn-outline-secondary">Profile</button>
        </div>

        <div class="col-auto">
          <button type="button" class="btn btn-outline-secondary">Log out</button>
        </div>

      </div>
    </div>

  </nav>
  <router-view @event-update-nav-menu="updateNavMenu"/>
</template>

<script>
import LoginModal from "@/components/modal/LoginModal.vue";

export default {
  components: {LoginModal},
data() {
  return {
    modalIsOpen: false,
    isLoggedIn: false,
    isAdmin: false,
  }
  //todo hiljem muuta is LoggedIn falseiks

},
methods:{
  openLoginModal() {
    this.modalIsOpen = true
  },

  closeLoginModal() {
    this.modalIsOpen = false
  },

  executeLogOut() {
    sessionStorage.clear()
    this.updateNavMenu()
    NavigationService.navigateToHomeView()
    this.isLoggedIn = false
    this.closeLogOutModal()
  },

  updateNavMenu() {
    let userId = sessionStorage.getItem('userId')
    this.isLoggedIn = userId !== null
    let roleName = sessionStorage.getItem('roleName')
    this.isAdmin = roleName != null && 'admin' === roleName
  },
}

}

</script>

