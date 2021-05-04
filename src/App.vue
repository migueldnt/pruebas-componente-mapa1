<template>
  <div class="container mt-3">
    <div class="columns is-centered">
      <div class="column is-7">
        <cpis-map/>
      </div>
    </div>
  </div>
  
</template>

<script>
import CpisMap from "./components/CpisMap.vue"

export default {
  name: 'App',
  components: {
    CpisMap
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
.dai-map{
  height: 500px;
}


</style>
