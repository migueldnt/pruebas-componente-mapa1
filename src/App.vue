<template>
  
        <cpis-map/>
      
  
</template>

<script>
import CpisMap from "./components/CpisMap.vue";
import "./estilos.scss";
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
  height: 100%;
  width: 100%;
}



</style>
