<template>
  <div id="Main">

    <div id="Topper">
      <div id="Left">x</div>
      <div id="Middle">c</div>
      <div id="Right">z</div>
    </div>

    <div id="Bottomer">
      <div id="Upper">x</div>
      <div id="Downer">u</div>
    </div>

    <!-- <img id="Logo" alt="RevoCase.eu logo" src="./assets/logo.svg">
    <HelloWorld msg="Welcome to Your Vue.js App"/> -->
  </div>
</template>

<script>
// import HelloWorld from './components/HelloWorld.vue'

export default {
  name: 'App',
  components: {
    // HelloWorld
  }
}
</script>

<style lang="scss">

#Topper {
  background-color: #018498;
  width: 100vw;
  height: 30vh;
  #Left {
    width: 10vw;
    height: 100%;
    background-color: #e32565;
    display: inline;
    float: left;
  }
  #Middle {
    width: 80%;
    height: 100%;
    background-color: #802a46;
    display: inline;
    float: left;
  }
  #Right {
    width: 10%;
    height: 100%;
    background-color: #259de3;
    display: inline;
    float: right;
  }
}

#Bottomer {
  background-color: #4f0198;
  width: 100vw;
  height: 70vh;
  #Upper {
    background-color: yellow;
    width: 400px;
    height: 100px;
    margin: auto;
  }
  #Downer {
    background-color: rgb(22, 129, 54);
    width: 100%;
    height: calc(100% - 100px);
  }
}

$grayBackground: #1b2435;
$redGradientStart: #ea5a8d;
$redGradientEnd: #e32565;
$orangeGradientStart: #e32565;
$orangeGradientEnd: #ff7b36;
$yellowGradientStart: #ff7b36;
$yellowGradientEnd: #ffcc01;
$greenGradientStart: #6bc498;
$greenGradientEnd: #2fad6e;
$blueGradientStart: #4ba8b7;
$blueGradientEnd: #018498;
$purpleGradientStart: #7967bb;
$purpleGradientEnd: #5a43ab;

body {
  background-color: $grayBackground;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: whitesmoke;
  text-align: center;
  grid-template-columns: 200px auto 200px;
  grid-template-rows: 300px 120px auto;
  height: 100vh;
}

#Logo {
  height: 100px;
  width: 100px;
}

button, input {
  outline: none;
}

* {
  margin: 0;
  padding: 0;
}

</style>
