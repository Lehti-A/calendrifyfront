<template>
  <div>
    <!-- GIF background -->
    <div class="gif-background">
      <!-- Dynamically load the gif -->
      <img :src="gifSrc" alt="Background GIF"/>
    </div>

    <!-- Content section -->
    <div class="content">
      <p>This is a page with a GIF background!</p>
    </div>
  </div>
</template>

<script>
export default {
  name: "GifBackground",

  data() {
    return {
      // Dynamically require the gif from the assets folder
      gifSrc: require('@/assets/calendrify.gif')
    };
  }
};
</script>

<style scoped>
/* Make the gif cover the whole screen */
.gif-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: -1;
}

img {
  object-fit: cover; /* Ensures the gif covers the entire container */
  width: 100%;
  height: 100%;
}

/* Content section */
.content {
  position: relative;
  z-index: 1;
  color: white;
  text-align: center;
  padding-top: 200px;
}
</style>
