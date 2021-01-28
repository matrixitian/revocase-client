<template>
  <div id="Main">

    <div id="Auth">
      <Auth />
    </div>

    <div id="Topper">
      <div id="Left">
        <div id="myCoins">
          <p>My credits: <span id="myCoinsAmount">{{ myCoins }}</span></p>
          <img src="@/assets/icons/bullet.png" alt="">
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
            <p id="logoInfo">Earn points by watching ads in background while in-game!</p>
          </div>
        </div>
      </div>
      <div id="Right">
        <!-- <div id="Inputs">
          <input placeholder="Steam ID" type="text">
          <img src="@/assets/icons/info.svg" alt="">
        </div> -->

        <div id="Buttons">
          <div id="playAds">
            <img src="@/assets/icons/start.svg" alt="">
            <p>Start Ads</p>
          </div>

          <div id="playTutorial">
            <img src="@/assets/icons/play.svg" alt="">
            <p>Tutorial</p>
          </div>
        </div>

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
      <div id="bottomAligner">
        <keep-alive>
          <component :is="selectedPart" :Case="caseClicked"></component>
        </keep-alive>
      </div>
    </div>
  </div>
</template>

<script>
import * as Parts from '@/components/switch'
import Auth from '@/components/Auth'

export default {
  name: 'App',
  components: {
    ...Parts, Auth
  },
  data() {
    return {
      selectedPart: 'CaseContents',
      myCoins: 120,
      selectedLang: 'english',
      langListVisible: false,
      caseClicked: 'clutch',
      langs: [
        'croatian', 'english', 'french', 'german', 'italian',
        'polish', 'portuguese', 'russian', 'serbian', 'spanish', 'turkish'
      ]
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

#Auth {
  z-index: 100;
  @include centerXY;
}

#Buttons {
  position: absolute;
  bottom: 20px;
  #playAds, #playTutorial {
    position: relative;
    width: 180px;
    height: 40px;
    background-color: red;
    border-radius: 20px;
    cursor: pointer;
    &:hover {
      transition: .1s ease;
      transform: scale(1.05);
    }
    img {
      @include centerY;
      left: 10px;
    }
    p {
      @include centerXY;
      font-size: 18px;
      font-weight: bold;
    }
  }
  img {
    height: 30px;
  }
  #playTutorial {
    margin-top: 10px;
    background-color: rgb(0, 162, 255);
  }
}

#Inputs {
   input {
      width: 185px;
      height: 30px;
      border-radius: 8px;
      border: 2px solid rgba(255, 255, 255, 0.2);
      background-color: rgba(255, 255, 255, 0.05);
      color: white;
      padding: 5px 20px 5px 20px;
      font-size: 17px;
      font-weight: bold;
      &::placeholder {
        color: rgb(158, 158, 158);
      }
    }
    img {
      position: absolute;
      height: 25px;
      top: 10px;
      right: 120px;
    }
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
    z-index: 200;
    position: relative;
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
      background-color: rgb(40, 45, 114);
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
  position: relative;
  width: 100vw;
  height: 70vh;
  div#bottomAligner {
    @include centerX;
    bottom: 0;
  }
}

button, input {
  outline: none;
  font-family: 'Lato'
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
