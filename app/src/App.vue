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
          <li v-for="(Case, i) in cases" :key="i"
          :class="`Pipe_${i}`">
            <img class="case" :src="require(`@/assets/cases/${Case}_case.png`)" alt="">
            <p class="caseTitle">{{ Case.toUpperCase() }}</p>
            <p class="amountOpened">{{ `Opened ${caseOpened[i]}` }}</p>
            <div class="viewContents">
              <img src="@/assets/icons/contents.svg" alt="">
              <p>View Contents</p>
            </div>
            <div class="openBtnCon">
              <button>{{ casePrices[i] }}</button>
            </div>
          </li>
        </ul>
      </div>
    </div>
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
      cases: [
        'clutch', 'fracture', 'chroma2',
        'phoenix', 'danger_zone'
      ],
      casePrices: [100, 250, 120, 214, 51],
      // realtime synced amount of cases opened globally
      caseOpened: [42, 12, 56, 21, 10]
    }
  }
}
</script>

<style lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Lato&display=swap');
@import '@/assets/mixins/centerX';
@import '@/assets/mixins/centerY';
@import '@/assets/mixins/centerXY';

$grayBackground: #1b2435;
$redGradientStart: #ea5a8d;
$redGradientEnd: #e32565;
$yellowGradientStart: #ff7b36;
$yellowGradientEnd: #ffcc01;
$greenGradientStart: #884bd6;
$greenGradientEnd: #a81b8a;
$blueGradientStart: #4ba8b7;
$blueGradientEnd: #018498;
$purpleGradientStart: #7967bb;
$purpleGradientEnd: #5a43ab;

.caseTitle {
  font-weight: bold;
  padding: 5px;
  background-color: rgba(0, 0, 0, 0.15);
}

.amountOpened {
  font-size: 13px;
  margin: auto;
  margin-top: 10px;
  width: 50%;
  border-radius: 8px;
  background-color: rgba(0, 0, 0, 0.3);
}

.viewContents {
  margin: auto;
  margin-top: 10px;
  padding: 7px 10px 7px 10px;
  box-shadow: 2px 2px 6px 1px rgba(0, 0, 0, 0.15);
  border-radius: 7px;
  border: 2px solid white;
  color: white;
  font-weight: bold;
  font-size: 15px;
  max-width: 150px;
  background-color: $purpleGradientEnd;
  background-image: linear-gradient(rgb(46, 209, 54), rgb(18, 158, 41));
  img {
    float: left;
    padding: 0;
    margin: 0;
  }
}

.case {
  transform: scale(0.7);
}

.Pipe_0 {
  background-color: $redGradientEnd;
  background-image: linear-gradient($redGradientStart, $redGradientEnd);
}

.Pipe_1 {
  background-color: $yellowGradientEnd;
  background-image: linear-gradient($yellowGradientEnd, $yellowGradientStart);
}

.Pipe_2 {
  background-color: $greenGradientEnd;
  background-image: linear-gradient($greenGradientStart, $greenGradientEnd);
}

.Pipe_3 {
  background-color: $blueGradientEnd;
  background-image: linear-gradient($blueGradientStart, $blueGradientEnd);
}

.Pipe_4 {
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
  font-family: 'Lato', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: whitesmoke;
  text-align: center;
  grid-template-columns: 200px auto 200px;
  grid-template-rows: 300px 120px auto;
  height: 100vh;
  overflow: hidden;
}

#centerLogo {
  @include centerXY;
  width: 600px;
  height: 150px;
  margin: auto;
  #centerUp {
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

$leftTopperWidth: 220px;
$rightTopperWidth: 220px;
$middleTopperWidth: calc(100% - #{$leftTopperWidth} - #{$rightTopperWidth});

#Topper {
  width: 100vw;
  height: 30vh;
  border-bottom: 2px dashed rgba(255, 255, 255, 0.1);
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
    width: 100%;
    height: calc(100% - 100px);
    ul {
      @include centerX;
      width: auto;
      height: 375px;
      bottom: 0;
      display: flex;
      li {
        display: inline-block;
        align-self: flex-end;
        border-top-left-radius: 20px;
        border-top-right-radius: 20px;
        margin: 0 20px 0 20px;
        // max-width: 230px;
        height: 90%;
        bottom: 0;
        border: 5px solid white;
        border-bottom: none;
        cursor: pointer;
        &:hover {
          transition: .2s ease;
          height: 380px;
        }
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
