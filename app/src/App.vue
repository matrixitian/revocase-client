<template>
  <div id="Main">

    <div id="Topper">
      <div id="Left">
        <div id="myCoins">
          <p>My coins: <span id="myCoinsAmount">{{ myCoins }}</span></p>
          <img src="@/assets/icons/coin.svg" alt="">
        </div>
        <div id="mySkins">
          <img src="@/assets/icons/rifle.svg" alt="">
          <p>View My Skins</p>
        </div>
      </div>
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
      <div id="Right">
        <img id="selectedLang" 
        :src="require(`@/assets/flags/${selectedLang}.svg`)" 
        alt=""
        @mouseenter="langListVisible = true">
        <ul id="Languages" v-if="langListVisible"
        @mouseleave="langListVisible = false">
          <li v-for="lang in langs" :key="lang">
            <img :src="require(`@/assets/flags/${lang}.svg`)"
            @click="selectLang(lang)">
          </li>
        </ul>
      </div>
    </div>

    <div id="Bottomer">
      <div id="Upper">x</div>
      <div id="Downer">
        <ul>
          <li v-for="(Case, i) in cases" :key="i"
          :class="`Pipe_${i}`">
            <img class="case" :src="require(`@/assets/cases/${Case}_case.png`)" alt="">
            <p class="caseTitle">{{ Case.toUpperCase() }}</p>
            <p class="amountOpened">Opened <span>{{ caseOpened[i] }}</span></p>
            <div class="viewContents">
              <img src="@/assets/icons/contents.svg" alt="">
              <p>View Contents</p>
            </div>
            <div class="openBtnCon">
              <img src="@/assets/icons/coin.svg" alt="">
              <p>{{ casePrices[i] }}</p>
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
      myCoins: 120,
      selectedLang: 'english',
      langListVisible: true,
      langs: [
        'croatian', 'english', 'french', 'german', 'italian',
        'polish', 'portuguese', 'russian', 'serbian', 'spanish', 'turkish'
      ],
      cases: [
        'clutch', 'fracture', 'chroma2',
        'phoenix', 'danger_zone'
      ],
      casePrices: [100, 250, 120, 214, 51],
      // realtime synced amount of cases opened globally
      caseOpened: [42, 12, 56, 21, 10]
    }
  },
  methods: {
    selectLang(lang) {
      this.selectedLang = lang
      this.langListVisible = false
    },
    muteTab() {
      // Mute a singular HTML5 element
      function muteMe(elem) {
          elem.muted = true;
          elem.pause();
      }

      document.querySelectorAll("video, audio").forEach( elem => muteMe(elem) );
    }
  },
  mounted() {
    this.muteTab()
  }
}
</script>

<style lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Lato&display=swap');
@import '@/assets/mixins/centerX';
@import '@/assets/mixins/centerY';
@import '@/assets/mixins/centerXY';
@import '@/assets/mixins/unselectable';

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

.case {
  transform: scale(0.7);
}

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
  padding: 2px;
  span {
    background-color: rgba(0, 0, 0, 0.6);
    padding: 0 3px 0 3px;
    font-weight: bold;
    border-radius: 4px;
  }
}

.viewContents, .openBtnCon {
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
  background-color: rgb(46, 117, 209);
  background-image: linear-gradient(rgb(60, 167, 230), rgb(3, 100, 228));
  cursor: pointer;
  &:hover {
    transition: .15s ease;
    transform: scale(1.05);
  }
  img {
    float: left;
    padding: 0;
    margin: 0;
  }
}

.openBtnCon {
  background-color: rgb(46, 209, 54);
  background-image: linear-gradient(rgb(46, 209, 54), rgb(18, 158, 41));
  border-radius: 20px;
  max-width: 100px;
  img {
    margin-top: -5px;
    height: 35px;
    width: 35px;
  }
  p {
    font-size: 20px;
  }
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
  font-size: 20px;
  color: rgba(255, 255, 255, 0.4)
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
    display: inline;
    float: left;
    #myCoins {
      margin: 10px;
      position: relative;
      width: 160px;
      height: 35px;
      border-radius: 14px;
      background-color: rgba(0, 0, 0, 0.5);
      border: 1px solid rgba(255, 255, 255, 0.2);
      img {
        @include centerY;
        top: 17px;
        right: 6px;
        height: 25px;
      }
      p {
        @include centerY;
        top: 16px;
        left: 10px;
        font-weight: bold;
        font-size: 16px;
        color: orangered;
        #myCoinsAmount {
          color: whitesmoke;
        }
      }
    }
    #mySkins {
      margin-left: 20px;
      position: relative;
      width: 180px;
      border-radius: 11px;
      border: 2px solid white;
      height: 40px;
      background-color: purple;
      background-image: linear-gradient(rgb(147, 30, 200), rgb(104, 7, 168));
      cursor: pointer;
      img {
        @include centerY;
        left: 10px;
        height: 35px;
      }
      p {
        @include centerY;
        right: 20px;
        font-weight: bold;
      }
      &:hover {
        transition: .2s ease;
        transform: scale(1.05);
      }
    }
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
    display: inline;
    float: right;
    #selectedLang {
      position: absolute;
      right: 20px;
      top: 10px;
      height: 40px;
      border: 2px solid rgba(255, 255, 255, 0.2);
      padding: 0 5px 0 5px;
      border-radius: 5px;
      cursor: pointer;
      &:hover {
        transition: .2s ease;
        background-color: rgba(255, 255, 255, 0.05);
      }
    }

    #Languages {
      position: absolute;
      top: 60px;
      right: 20px;
      width: 225px;
      height: auto;
      background-color: rgba(255, 255, 255, 0.05);
      border: 2px solid rgba(255, 255, 255, 0.1);
      border-radius: 7px;
      img {
        display: inline;
        float: left;
        margin: 10px;
        height: 40px;
        cursor: pointer;
        border: 2px solid rgba(0, 0, 0, 0.5);
        padding: 0 5px 0 5px;
        border-radius: 5px;
        &:hover {
          transition: .2s ease;
          transform: scale(1.05);
          background-color: rgba(255, 255, 255, 0.05);
        }
      }
    }
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
      height: 400px;
      bottom: 0;
      display: flex;
      li {
        display: inline-block;
        align-self: flex-end;
        border-top-left-radius: 20px;
        border-top-right-radius: 20px;
        margin: 0 20px 0 20px;
        height: 90%;
        bottom: 0;
        border: 5px solid white;
        border-bottom: none;
        &:hover {
          transition: .2s ease;
          height: 375px;
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

p {
  @include unselectable;
}

</style>
