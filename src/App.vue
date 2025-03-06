<template>
<div :class="backgroundClass">

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
  <router-view @event-update-nav-menu="updateNavMenuAndBackground"/>
</div>
</template>

<script>

export default {
data() {
  return {
    backgroundClass: 'background-container-1',
    modalIsOpen: false,
    isLoggedIn: true,
    isAdmin: false,
  }
  //todo hiljem muuta is LoggedIn falseiks

},
methods:{

  updateNavMenuAndBackground() {
    let userId = sessionStorage.getItem('userId')
    this.isLoggedIn = userId !== null
    let roleName = sessionStorage.getItem('roleName')
    this.isAdmin = roleName != null && 'admin' === roleName

    if (this.isLoggedIn) {
      this.backgroundClass = 'background-container-2'
    }

  },
}

}

</script>

