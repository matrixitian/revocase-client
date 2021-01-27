<template>
  <div id="Main">

    <div id="Topper">
      <div id="Left">x</div>
      <div id="Middle">
        <div id="centerLogo">
          <div id="centerUp">
            <img id="Logo" src="@/assets/logo.svg" alt="RevoSkins.Eu Logo">
            <p id="logoText">Revo Skins</p>
          </div>
          <div id="centerDown">
            <p id="logoInfo">Watch Ads in Background while playing CS and earn up to 5$ a day in points!</p>
          </div>
        </div>
      </div>
      <div id="Right">z</div>
    </div>

    <div id="Bottomer">
      <div id="Upper">x</div>
      <div id="Downer">
        <ul>
          <li v-for="(crate, i) in crates" :key="i"
          :class="`Pipe_${i}`">

          </li>
        </ul>
      </div>
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
  },
  data() {
    return {
      crates: ['Bravo', 'Test2', 'Test3',
      'Test4', 'Test5', 'Test6']
    }
  }
}
</script>

<style lang="scss">
@font-face {
  font-family: SoleilExtraBold;
  src: url('./assets/fonts/soleil_extrabold.ttf');
}
@import '@/assets/mixins/centerX';
@import '@/assets/mixins/centerY';
@import '@/assets/mixins/centerXY';

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

.Pipe_0 {
  background-color: $redGradientEnd;
  background-image: linear-gradient($redGradientStart, $redGradientEnd);
}

.Pipe_1 {
  background-color: $orangeGradientEnd;
  background-image: linear-gradient($orangeGradientStart, $orangeGradientEnd);
}

.Pipe_2 {
  background-color: $yellowGradientEnd;
  background-image: linear-gradient($yellowGradientStart, $yellowGradientEnd);
}

.Pipe_3 {
  background-color: $greenGradientEnd;
  background-image: linear-gradient($greenGradientStart, $greenGradientEnd);
}

.Pipe_4{
  background-color: $blueGradientEnd;
  background-image: linear-gradient($blueGradientStart, $blueGradientEnd);
}

.Pipe_5 {
  background-color: $purpleGradientEnd;
  background-image: linear-gradient($purpleGradientStart, $purpleGradientEnd);
}

body {
  background-color: $grayBackground;
}

#logoInfo {
  position: absolute;
  bottom: 0;
}

#app {
  font-family: 'SoleilExtraBold', Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: whitesmoke;
  text-align: center;
  grid-template-columns: 200px auto 200px;
  grid-template-rows: 300px 120px auto;
  height: 100vh;
}

#centerLogo {
  @include centerXY;
  // background-color: greenyellow;
  width: 600px;
  height: 150px;
  margin: auto;
  #centerUp {
    // background-color: hotpink;
    height: 70%;
    position: relative;
    #Logo {
      @include centerY;
      left: 110px;
      height: 100px;
      width: 100px;
    }
    #logoText {
      @include centerY;
      position: absolute;
      right: 110px;
      font-weight: bold;
      font-size: 47px;
    }
  }
}

$leftTopperWidth: 150px;
$rightTopperWidth: 150px;
$middleTopperWidth: calc(100% - #{$leftTopperWidth} - #{$rightTopperWidth});

#Topper {
  width: 100vw;
  height: 30vh;
  #Left {
    width: $leftTopperWidth;
    height: 100%;
    background-color: #e32565;
    display: inline;
    float: left;
  }
  #Middle {
    position: relative;
    width: $middleTopperWidth;
    height: 100%;
    // background-color: #802a46;
    display: inline;
    float: left;
    display: table;
  }
  #Right {
    width: $rightTopperWidth;
    height: 100%;
    background-color: #259de3;
    display: inline;
    float: right;
  }
}

#Bottomer {
  // background-color: #4f0198;
  width: 100vw;
  height: 70vh;
  #Upper {
    background-color: yellow;
    width: 400px;
    height: 100px;
    margin: auto;
  }
  #Downer {
    position: relative;
    // background-color: rgb(22, 129, 54);
    width: 100%;
    height: calc(100% - 100px);
    ul {
      @include centerX;
      width: auto;
      height: 90%;
      // background-color: white;
      bottom: 0;
      display: flex;
      li {
        display: inline-block;
        align-self: flex-end;
        border-top-left-radius: 20px;
        border-top-right-radius: 20px;
        margin: 0 20px 0 20px;
        min-width: 180px;
        height: 370px;
        bottom: 0;
      }
    }
  }
}

button, input {
  outline: none;
}

* {
  margin: 0;
  padding: 0;
}

li {
  list-style: none;
}

</style>
