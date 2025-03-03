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
  <router-view/>
</template>

<script>
export default {
data() {
return {
  isLoggedIn: true
  //todo hiljem muuta is LoggedIn falseiks
}
},
methods:{

}

}

</script>