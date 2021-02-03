<template>
  <div id="Main">

    <Chat v-if="user" />

    <div id="Auth" v-if="!user && authChecked">
      <Auth />
    </div>

    <div id="Topper">
      <div id="Left">
        <div id="myCoins">
          <p>My Bullets: <span id="myCoinsAmount">{{ myCoins }}</span></p>
          <img src="@/assets/icons/bullet.png" alt="">
        </div>
        <div id="mySkins" @click="switchDynamicComponent()"
        :class="{goBackBtn : dynamicComponent !== 'Cases'}">

          <div v-if="dynamicComponent === 'Cases'">
            <img src="@/assets/icons/rifle.svg" alt="">
            <p>View My Skins</p>
          </div>

          <div v-else>
            <img src="@/assets/icons/rifle.svg" alt="">
            <p>Go Back</p>
          </div>

        </div>

        <div id="Referral" v-if="user">
          <div>
            <p>Referral Code</p>
          </div>
          <input id="referralCode" type="text" :value="myReferralCode">
          <img src="@/assets/icons/info.svg" alt="">
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

        <div id="Buttons">
          <transition name="slide-fade">
            <div id="logout" v-if="user"
            @click="signOut()">
              <span class="material-icons">logout</span>
              <p>Logout</p>
            </div>
          </transition>

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
        <ul id="Languages" v-show="langListVisible"
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
          <component :is="dynamicComponent" :Case="caseClicked"
          :user="user"></component>
        </keep-alive>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
// import { auth } from '@/firebase/config.js'
import { detectAnyAdblocker } from 'just-detect-adblock'
import * as Parts from '@/components/switch'
import Auth from '@/components/Auth'
import Chat from '@/components/Chat'

export default {
  name: 'App',
  components: {
    ...Parts, Auth, Chat
  },
  data() {
    return {
      authChecked: false,
      user: null,
      dynamicComponent: 'Cases',
      myCoins: 0,
      myReferralCode: 'HolidayGT6',
      selectedLang: 'english',
      langListVisible: false,
      caseClicked: 'clutch',
      langs: [
        'croatian', 'english', 'french', 'german', 'italian',
        'polish', 'portuguese', 'russian', 'serbian', 'spanish', 'turkish'
      ]
    }
  },
  created() {
    this.$store.subscribe(async(mutation, state) => {
      if (mutation.type === 'setUser') {
        this.user = state.user
        console.log('user set', state.user)
      }

      if (mutation.type === 'changeView') {
        this.dynamicComponent = state.currentView
      }

      if (mutation.type === 'updateMyCoins') {
        this.myCoins = state.myCoins
      }
    })
  },
  methods: {
    async fetchCredits() {
      const user = await axios.get('http://localhost:3000/get-user-credits')

      this.myCoins = user.data.credits

      this.$store.commit('updateMyCoins', { type: 'set', amount: this.myCoins })
    },
    switchDynamicComponent() {
      if (this.dynamicComponent !== 'Cases') {
        this.$store.commit('changeView', { view: 'Cases' })
      } else {
        this.$store.commit('changeView', { view: 'MySkins' })
      }
    },
    async signOut() {
      // auth.signOut().then(() => {
      //   localStorage.setItem('user', null)
      //   this.$store.commit('setUser', { user: null })
      //   this.user = null
      // }).catch((error) => {
      //   // An error happened.
      //   alert(error)
      // })

      const res = await axios.get('http://localhost:3000/logout')
      this.user = res.data

      if (res.status === 200) {
        localStorage.setItem('token', null)
        this.$store.commit('setUser', { user: null })
        this.user = null
        this.myCoins = 0
        console.log('Logged out.')
      } else {
        console.log('Log out failed.')
      }
    },
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
    },
    async fetchUser() {
      const token = localStorage.getItem('token')

      if (token != 'null') {
        axios.defaults.headers = {
          'Content-Type': 'application/json',
          Authorization: token
        }

        const res = await axios.get('http://localhost:3000/get-user')
        this.user = res.data

        // this.$store.commit('updateMyCoins', {})

        this.$store.commit('setUser',  { user: res.data })
        this.fetchCredits()
        this.authChecked = true
      } else {
        console.log('No user is signed in.')
        this.authChecked = true
      }
    }
  },
  async mounted() {
    // auth.onAuthStateChanged(user => {
    //   if (user) {
    //     this.user = user
    //     this.authChecked = true

    //     this.fetchCredits()
    //   } else {
    //     // No user is signed in.
    //     this.user = null
    //     this.authChecked = true
    //   }
    // })

    this.fetchUser()
    
    detectAnyAdblocker().then((detected) => {
      if (detected) {
        // alert('Please turn off your Ad Blocker!')
      }
    })
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

.slide-fade-enter-active {
  transition: all .3s ease;
}
.slide-fade-enter-from, .slide-fade-leave-to {
  transform: translateX(10px);
  opacity: 0;
}

#Referral {
  position: relative;
  width: 190px;
  height: 40px;
  margin-top: 10px;
  margin-left: 20px;
  border: none;
  border: 1px solid white;
  border-radius: 15px;
  background-color: orangered;
  #referralCode {
    @include centerXY;
    height: 30px;
    width: 90%;
    border-radius: 12px;
    background-color: rgba(0, 0, 0, 0.55);
    color: white;
    font-size: 15px;
    border: none;
    outline: none;
    text-align: center;
    font-weight: bold;
  }
  div {
    @include centerX;
    margin: 0;
    bottom: -18px;
    float: left;
    width: 80%;
    height: 15px;
    color: rgba(0, 0, 0, 0.7);
    background-color: whitesmoke;
    border-bottom-left-radius: 10px;
    border-bottom-right-radius: 10px;
    p {
      @include centerXY;
      font-size: 13px;
      width: 100%;
      font-weight: bold;
    }
  }
  img {
    position: absolute;
    height: 25px;
    top: 10px;
    right: -30px;
    background-color: rgb(65, 65, 65);
    border-radius: 100%;
    cursor: pointer;
    &:hover {
      transition: .2s ease;
      transform: scale(1.1);
    }
  }
}

#Auth {
  z-index: 100;
  @include centerXY;
}

#Buttons {
  position: absolute;
  bottom: 20px;
  #playAds {
    z-index: 0 !important;
  }
  #playAds, #playTutorial, #logout {
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
    span, img {
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
  #logout {
    margin-bottom: 10px;
    background-color: rgb(30, 175, 42);
  }
  #playTutorial {
    z-index: 200 !important;
    margin-top: 10px;
    background-color: rgb(0, 162, 255);
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
    position: relative;
    width: $rightTopperWidth;
    height: 100%;
    display: inline;
    float: right;
    #selectedLang {
      z-index: 200 !important;
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
      z-index: 200 !important;
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

.goBackBtn {
  background-color: rgb(5, 125, 223) !important;
  background-image: linear-gradient(rgb(32, 146, 240), rgb(0, 109, 211)) !important;
  width: 130px !important;
}

::-webkit-scrollbar-track
{
  box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
  -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
  border-radius: 10px;
  background-color: #F5F5F5;
}

::-webkit-scrollbar
{
  width: 12px;
  background-color: #F5F5F5;
  border-radius: 10px;
  box-shadow: 0 0 0 0 black;
}

::-webkit-scrollbar-thumb
{
  border-radius: 10px;
  box-shadow: inset 0 0 6px rgba(0,0,0,.3);
  -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,.3);
  background-color: #29d68e;
}

</style>
