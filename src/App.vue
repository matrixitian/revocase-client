<template>
  <div id="Main">

    <Referral v-if="user && !haveReferral" 
    @referralEntered="hideReferralMenu()" />

    <!-- <Chat v-if="user && dynamicComponent === 'Cases'" /> -->

    <ErrorHandler />

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
          <input id="referralCode" type="text"
            @click="selectCode()"
            ref="referralCode"
            @mouseenter="showReferralInfo = true"
            @mouseleave="showReferralInfo = false"
            :value="myReferralCode">
          <img src="@/assets/icons/info.svg" alt=""
            @mouseenter="showReferralInfo = true"
            @mouseleave="showReferralInfo = false">
          <div id="referralInfo" v-if="showReferralInfo">
            <p>When someone registers and enters your referral, 
            you wil get 25 coins for each case they open!</p>
          </div>
        </div>
      </div>

      <div id="usersOnline">
        <p>Users online: <span>{{ userCount }}</span></p>
        <div id="onlineDot" class="blink"></div>
      </div>

      <div id="Middle">
        <div id="centerLogo">
          <div id="centerUp">
            <img id="Logo" src="@/assets/logo-min.png" alt="RevoSkins.Eu Logo">
            <p id="logoText">Revo Cases</p>
          </div>
          <div id="centerDown">
          </div>
        </div>
      </div>
      <div id="Right">

        <div id="Buttons">
          <a href="https://discord.gg/bDXXJcU95J" target="_blank">
            <div id="support">
              <img src="@/assets/icons/discord_logo.svg" alt="">
              <p>Support</p>
            </div>
          </a>

          <transition name="slide-fade">
            <div id="logout" v-if="user"
            @click="signOut()">
              <span class="material-icons">logout</span>
              <p>Logout</p>
            </div>
          </transition>

          <!-- <div id="playAds">
            <img src="@/assets/icons/start.svg" alt="">
            <p>Start Ads</p>
          </div> -->

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
        <component :is="dynamicComponent" :Case="caseClicked"
        :user="user"></component>
      </div>
    </div>
  </div>
</template>

<script>
import io from 'socket.io-client'
import axios from 'axios'
import { detectAnyAdblocker } from 'just-detect-adblock'
import * as Parts from '@/components/switch'
import Auth from '@/components/Auth'
import Referral from '@/components/Referral'
import ErrorHandler from '@/components/ErrorHandler'

export default {
  name: 'App',
  components: {
    ...Parts, Auth, Referral, ErrorHandler
  },
  data() {
    return {
      weeklyUserEarnings: 5.76,
      socket: io('localhost:3000'),
      userCount: 0,
      haveReferral: false,
      showReferralInfo: false,
      authChecked: false,
      user: null,
      dynamicComponent: 'Cases',
      myCoins: 0,
      myReferralCode: null,
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
        this.myReferralCode = state.user.username
        
        if (this.user.referredTo) {
          this.haveReferral = true
        }
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
    hideReferralMenu() {
      this.haveReferral = true
    },
    selectCode() {
      this.$refs.referralCode.select()

      document.execCommand("copy")
    },
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
      const res = await axios.get('http://localhost:3000/logout')
      this.user = res.data

      if (res.status === 200) {
        localStorage.setItem('token', null)
        this.$store.commit('setUser', { user: null })
        this.user = null
        this.myCoins = 0
      } else {
        this.$store.commit('setError', { errMsg: 'Log out failed, please try again later.' })
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
      if (token !== 'null' && token !== null) {
        axios.defaults.headers = {
          'Content-Type': 'application/json',
          Authorization: token
        }

        const res = await axios.get('http://localhost:3000/get-user')
        this.user = res.data

        this.myReferralCode = res.data.username

        this.$store.commit('setUser',  { user: res.data })
        this.fetchCredits()
        this.authChecked = true
      } else {
        this.authChecked = true
      }
    }
  },
  async mounted() {
    this.fetchUser()

    if (localStorage.getItem('referralHidden')) {
      this.haveReferral = true
    }
    
    detectAnyAdblocker().then((detected) => {
      if (detected) {
        alert('Please turn off your Ad Blocker or you will not be able to get bullets!')
      }
    })

    this.socket.emit('enter server', 'main')

    // User count
    this.socket.on('get user count', (data) => {
      this.userCount = data.userCount
      this.$forceUpdate()
    })
  }
}
</script>

<style lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Lato&display=swap');
@import '@/assets/mixins/blink';
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

@keyframes float {
	0% {
		transform: translatey(0px);}
	50% {
		transform: translatey(-12px);
	}
	100% {
		transform: translatey(0px);
	}
}

.slide-fade-enter-active {
  transition: all .3s ease;
}
.slide-fade-enter-from, .slide-fade-leave-to {
  transform: translateX(10px);
  opacity: 0;
}

#usersOnline {
  z-index: 1000;
  position: absolute;
  top: 200px;
  width: 220px;
  height: 40px;
  background-color: rgb(15, 172, 15);
  border-top-right-radius: 10px;
  border-bottom-right-radius: 10px;
  display: flex;
  p {
    margin: auto;
    font-weight: bold;
    text-transform: uppercase;
    display: inline-block;
    align-self: flex-end;
    color: black;
    span {
      color: white;
      border-radius: 5px;
      padding: 3px 5px 3px 5px;
      background-color: rgba(0, 0, 0, 0.5);
    }
  }
  #onlineDot {
    float: right;
    margin-top: 12px;
    margin-right: 10px;
    height: 15px;
    width: 15px;
    background-color: lime;
    border: 1px solid black;
    border-radius: 100%;
  }
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
    z-index: 100;
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
  #referralInfo {
    z-index: 20;
    position: absolute;
    top: 10px;
    left: 400px;
    width: 300px;
    padding: 20px;
    border-radius: 10px;
    background-color: white;
    box-shadow: 0 0 4px 6px rgba(0, 0, 0, 0.2);
    p {
      padding: 5px;
      font-weight: bold;
      font-size: 15px;
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
  #playAds, #playTutorial, #logout, #support {
    position: relative;
    width: 180px;
    height: 40px;
    background-color: red;
    border-radius: 20px;
    color: whitesmoke;
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
  #support {
    margin-bottom: 10px;
    background-color: rgb(5, 96, 216);
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

@keyframes textAnimate {
  from {
    filter: hue-rotate(0deg);
    background-position-x: 0%;
    
  }
  to {
    filter: hue-rotate(360deg);
    background-position-x: 600vw;
    
  }
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
    }
    #logoText {
      @include centerY;
      position: absolute;
      right: 110px;
      font-weight: bold;
      font-size: 47px;
      white-space: nowrap;
      background: linear-gradient( 92deg, #95d7e3, #eb76ff );
      background: -webkit-linear-gradient( 92deg, #95d7e3, #eb76ff );
      background-size:600vw 600vw;
      background-clip: text;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      animation: textAnimate 5s linear infinite alternate;
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
      width: 170px;
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
    animation: float 3s ease-in-out infinite;
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

img, span {
  user-select: none;
  -moz-user-select: none;
  -webkit-user-drag: none;
  -webkit-user-select: none;
  -ms-user-select: none;
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
