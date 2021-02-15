<template>
  <div id="Main">

    <AdminPanel v-if="isAdmin" />

    <ErrorHandler />

    <div id="Auth" v-if="!user && authChecked"><Auth /></div>

    <div id="Topper">

      <!-- Users online -->
      <div id="usersOnline">
        <p>Users online: <span>{{ userCount }}</span></p>
        <div id="onlineDot" class="blink"></div>
      </div>

<!-- Left -->
      <div id="Left">

        <!-- My coins -->
        <div id="myCoins">
          <p>My Bullets: <span id="myCoinsAmount">{{ myCoins }}</span></p>
          <img src="@/assets/icons/bullet.png" alt="">
        </div>

        <!-- My Skins Btn -->
        <div id="mySkins" @click="switchDynamicComponent('MySkins')"
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

        <!-- My Referral -->
        <div id="Referral" v-if="user">

          <div>
            <p>Referral Code</p>
          </div>

          <!-- Referral Code -->
          <input id="referralCode" type="text"
            :value="myReferralCode"
            @click="copyReferralCode()"
            @mouseenter="showReferralInfo = true"
            @mouseleave="showReferralInfo = false"
            ref="referralCode">

          <!-- Show Referral Icon -->
          <img src="@/assets/icons/info.svg"
            @mouseenter="showReferralInfo = true"
            @mouseleave="showReferralInfo = false">

          <div id="referralInfo" v-if="showReferralInfo">
            <p>
              You will get 1RP for giveaways when a user 
              registered with your referral opens a case!
            </p>
          </div>

        </div>
      </div>

<!-- Middle -->
      <div id="Middle">

        <div id="centerLogo">
          <div id="centerUp">
            <img id="Logo" src="@/assets/logo-min.png" alt="RevoSkins.Eu Logo">
            <p id="logoText">Revo Cases</p>
          </div>
        </div>

        <div id="giveawayBtn" @click="goToView('Giveaways')">
          <p>Giveaway ends in <span>{{ clock }}</span></p>
        </div>

        <p id="motivation">Watch ads and get up to 2 cases per day!</p>
      </div>

<!-- Right -->
      <div id="Right">

        <div id="Buttons">

          <!-- Support Btn -->
          <a href="https://discord.gg/bDXXJcU95J" target="_blank">
            <div id="support">
              <img src="@/assets/icons/discord_logo.svg" alt="">
              <p>Support</p>
            </div>
          </a>

          <!-- Logout Btn -->
          <transition name="slide-fade">
            <div id="logout" v-if="user" @click="signOut()">
              <span class="material-icons">logout</span>
              <p>Logout</p>
            </div>
          </transition>

          <!-- Play Ads Btn -->
          <div id="playAds" @click="getPoint()"
          :class="[{ adsRunning: adsRunning },{ disablePlayAds: adCount === 50 },]">
            <img src="@/assets/icons/start.svg" alt="">
            <p>
              {{
                adCount === 50 ? 'Done' :
                `${adCount}/50 Ads`
              }}
            </p>
          </div>

          <!-- Tutorial Btn -->
          <div id="playTutorial">
            <img src="@/assets/icons/play.svg" alt="">
            <p>Tutorial</p>
          </div>

        </div>

        <img id="selectedLang" 
        :src="require(`@/assets/flags/${selectedLang}.svg`)"
        @mouseenter="langListVisible = true">
        <!-- <ul id="Languages" v-show="langListVisible"
        @mouseleave="langListVisible = false">
          <li v-for="lang in langs" :key="lang">
            <img :src="require(`@/assets/flags/${lang}.svg`)"
            @click="selectLang(lang)">
          </li>
        </ul> -->
      </div>
    </div>

<!-- Bottom -->
    <div id="Bottomer">
      <div id="bonusBtn"
      v-if="dynamicComponent === 'Cases'"
      @click="goToView('BonusBullets')">
        <p>Bonus Bullets!</p>
        <img src="@/assets/icons/bullet.png">
      </div>

      <div id="bottomAligner">
        <component :is="dynamicComponent" :Case="caseClicked" :user="user"></component>
      </div>
      
    </div>

  </div>
</template>

<script>
import config from '@/assets/config/config'
import { detectAnyAdblocker } from 'just-detect-adblock'
import axios from 'axios'
import io from 'socket.io-client'
import Cookies from 'js-cookie'
import * as Parts from '@/components/switch'
import Auth from '@/components/Auth'
import ErrorHandler from '@/components/ErrorHandler'
import AdminPanel from '@/components/AdminPanel'

export default {
  name: 'App',
  components: {
    ...Parts, Auth, ErrorHandler, AdminPanel
  },
  data() {
    return {
      socket: io(config.server),
      isAdmin: false,
      // User data
      user: null,
      myCoins: 0,
      // Functional
      adCount: 0,
      userCount: 0,
      lastDateAdsViewed: null,
      myReferralCode: null,
      showReferralInfo: false,
      adsRunning: false,
      currentIntervalID: null,
      authChecked: false,
      caseClicked: 'clutch',
      dynamicComponent: 'Cases',
      // Language
      selectedLang: 'english',
      langListVisible: false,
      langs: [
        'croatian', 'english', 'french', 'german', 'italian',
        'polish', 'portuguese', 'russian', 'serbian', 'spanish', 'turkish'
      ],
      clock: '24:00:00'
    }
  },
  created() {
    this.$store.subscribe(async(mutation, state) => {
      if (mutation.type === 'setUser') {
        this.user = state.user
        this.myReferralCode = `https://revo-cases.com/?referral=${state.user.username}`
      }

      if (mutation.type === 'changeView') {
        this.dynamicComponent = state.currentView
      }

      if (mutation.type === 'updateMyCoins') {
        this.myCoins = state.myCoins
      }
    })
  },
  async mounted() {
    // Get adCount (count of viewed ads on #playAds button)
    if (localStorage.getItem('adCount')) {
      this.adCount = Number(localStorage.getItem('adCount'))
    }

    const lastViewedADayAgo = Cookies.get('ads_viewed_today')

    if (!lastViewedADayAgo) {
      this.adCount = 0
    }
    
    // Check user session
    this.fetchUser()

    // User count
    this.socket.on('get user count', (data) => {
      this.userCount = data.userCount
      this.$forceUpdate()
    })

    // Get referral code if there is one
    const parseURLParams = (url) => {
      let queryStart = url.indexOf("?") + 1,
          queryEnd   = url.indexOf("#") + 1 || url.length + 1,
          query = url.slice(queryStart, queryEnd - 1),
          pairs = query.replace(/\+/g, " ").split("&"),
          parms = {}, i, n, v, nv

      if (query === url || query === "") return

      for (i = 0; i < pairs.length; i++) {
          nv = pairs[i].split("=", 2)
          n = decodeURIComponent(nv[0])
          v = decodeURIComponent(nv[1])

          if (!parms.hasOwnProperty(n)) parms[n] = []
          parms[n].push(nv.length === 2 ? v : null)
      }
      return parms
    } 

    const urlParams = parseURLParams(window.location.href)
    // console.log(urlParams)
    if (urlParams) {
      this.$store.commit('setSignUpReferral', { referral: urlParams.referral })
    }

    // Countdown
    setInterval(() => {
      let toDate = new Date()
      let tomorrow = new Date()
      tomorrow.setHours(24,0,0,0)
      let diffMS = tomorrow.getTime() / 1000 - toDate.getTime() / 1000
      let diffHr = Math.floor(diffMS / 3600)
      diffMS = diffMS - diffHr * 3600
      let diffMi = Math.floor(diffMS / 60)
      diffMS = diffMS - diffMi * 60
      let diffS = Math.floor(diffMS)
      let result = ((diffHr < 10) ? "0" + diffHr : diffHr)
      result += ":" + ((diffMi < 10) ? "0" + diffMi : diffMi)
      result += ":" + ((diffS < 10) ? "0" + diffS : diffS)
      
      this.clock = result
    }, 1000)
  },
  methods: {
    async fetchUser() {
      const token = localStorage.getItem('token')

      if (token) {
        axios.defaults.headers = {
          'Content-Type': 'application/json',
          Authorization: token
        }

        const res = await axios.get(`${config.server}/get-user`)
        this.user = res.data

        this.myReferralCode = `https://revo-cases.com/?referral=${res.data.username}`

        this.$store.commit('setUser',  { user: res.data })
        this.fetchCredits()

        if (this.user.accountType === 'admin') {
          this.isAdmin = true
        }

        this.authChecked = true
      } else {
        this.authChecked = true
      }
    },
    async fetchCredits() {
      const user = await axios.get(`${config.server}/get-user-credits`)

      this.myCoins = user.data.credits

      this.$store.commit('updateMyCoins', { type: 'set', amount: this.myCoins })
    },
    async signOut() {
      const res = await axios.get(`${config.server}/logout`)
      this.user = res.data

      if (res.status === 200) {
        localStorage.setItem('token', '')
        this.$store.commit('setUser', { user: null })
        this.user = null
        this.myCoins = 0
      } else {
        this.$store.commit('setError', { errMsg: 'Log out failed, please try again later.' })
      }
    },
    getPoint() {
      if (this.currentIntervalID) {
        clearInterval(this.currentIntervalID)
      }

      this.adsRunning = !this.adsRunning

      const finishDailyAds = async() => {
        const res = await axios.post(`${config.server}/finish-daily-ads`)

        if (res.status !== 200) {
          this.$store.commit('setError', { errMsg: 'Point could not be given. Please refresh page.' })
        }
      }

      if (this.adCount < 50) {
        this.currentIntervalID = setInterval(() => {
        let adBlockActive

        detectAnyAdblocker().then((detected) => {
          if (detected) {
            this.$store.commit('setError', { errMsg: 'Please turn off your Ad Blocker or you will not be able to get bullets!' })
            adBlockActive = true
          } else {
            adBlockActive = false
          }
        })

        if (this.adsRunning && !adBlockActive && this.adCount < 50) {
            window.open('https://ascertaincrescenthandbag.com/ja1tmrw6?key=853be86831dc5b1b937a1d658098c0f0', '_blank')
            window.open('//stawhoph.com/afu.php?zoneid=3928400', '_blank')
            window.open('https://www.greatdexchange.com/jump/next.php?r=4138191', '_blank')
            window.open('https://apprefaculty.pro/d.m/F/z-dpGaNLv/ZKG/Ux/ee/me9EuuZEU/lqkpPTTtQCxmNHj/YaxfNMjPkDteNJDIES2/N/jnE/3yMrAg', '_blank')

            this.adCount++
            localStorage.setItem('adCount', this.adCount)

            if (this.adCount === 50) {
              Cookies.set('ads_viewed_today', true, { expires: 1 })
              localStorage.setItem('adCount', 50)
              finishDailyAds()

              this.adsRunning = false
            }
          }
        }, 10000)

      } else {
        this.$store.commit('setError', { errMsg: `You need to wait until ${new Date} to do that` })
      }
    },
    copyReferralCode() {
      this.$refs.referralCode.select()

      document.execCommand("copy")
    },
    selectLang(lang) {
      this.selectedLang = lang
      this.langListVisible = false
    },
    switchDynamicComponent() {
      if (this.dynamicComponent !== 'Cases') {
        this.$store.commit('changeView', { view: 'Cases' })
      } else {
        this.$store.commit('changeView', { view: 'MySkins' })
      }
    },
    goToView(view) {
      this.$store.commit('changeView', { view: view })
    }
  }
}
</script>

<style lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Lato&display=swap');
@import '@/assets/mixins/blink';
@import '@/assets/mixins/centerX';
@import '@/assets/mixins/centerY';
@import '@/assets/mixins/centerXY';
@import '@/assets/mixins/vueSlideFade';
@import '@/assets/mixins/unselectable';

@keyframes animateMotivation {
  0% { color: limegreen }
  50% { color: rgb(67, 231, 130) }
  75% { color: rgb(134, 255, 134) }
  100% { color: rgb(67, 206, 120) }
}

#motivation {
  @include centerX;
  font-size: 18px;
  font-weight: bold;
  top: 27vh;
  animation: animateMotivation 3s infinite;
}

#bonusBtn {
  position: relative;
  top: 10px !important;
  padding: 10px 20px 10px 40px !important;
  color: rgba(0, 0, 0, 0.7);
  width: 110px;
  height: 25px;
  border-radius: 30px !important;
  background: linear-gradient(rgb(45, 223, 22), rgb(11, 172, 51)) !important;
  &:hover {
    transition: .15s ease-in-out;
    padding: 11px 21px 11px 41px !important;
    color: white !important;
    background: linear-gradient(rgb(113, 241, 96), rgb(2, 207, 53)) !important;
  }
  p {
    @include centerY;
    float: left;
    left: 20px;
  }
  img {
    @include centerY;
    float: right;
    right: 5px;
    height: 30px;
    width: 30px;
  }
}

#giveawayBtn, #bonusBtn {
  @include centerX;
  top: 19vh;
  padding: 10px;
  background: linear-gradient(red, purple);
  border-radius: 10px;
  border: 2px solid white;
  font-weight: bold;
  cursor: pointer;
  &:hover {
    transition: .15s ease-in-out;
    padding: 15px;
    background: linear-gradient(rgb(255, 102, 0), rgb(161, 16, 161));
  }
  p {
    span {
      background-color: rgba(0, 0, 0, 0.4);
      padding: 4px;
      border-radius: 10px;
    }
  }
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

#Auth {
  z-index: 100;
  @include centerXY;
}

$leftTopperWidth: 220px;
$rightTopperWidth: 220px;
$middleTopperWidth: calc(100% - #{$leftTopperWidth} - #{$rightTopperWidth});

#Topper {
  width: 100vw;
  height: 30vh;
  border-bottom: 2px dashed rgba(255, 255, 255, 0.1);
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
        width: 80%;
        padding: 0 5px 0 5px;
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
  }
  #Middle {
    position: relative;
    width: $middleTopperWidth;
    height: 100%;
    display: inline;
    float: left;
    display: table;
    animation: float 3s ease-in-out infinite;
    button {
      position: absolute;
      top: 250px;
    }
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
        background-color: rgb(30, 175, 42);
        border-radius: 20px;
        // border: 1px solid white;
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
        background-color: rgb(96, 45, 190);
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
  }
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

#Bottomer {
  position: relative;
  width: 100vw;
  height: 70vh;
  div#bottomAligner {
    @include centerX;
    bottom: 0;
  }
}

// Keyframes
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

// Global App Styling
* {
  margin: 0;
  padding: 0;
}

body {
  background-color: #1b2435;
}

button, input {
  outline: none;
  font-family: 'Lato'
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

// Overwrites
.goBackBtn {
  background-color: rgb(5, 125, 223) !important;
  background-image: linear-gradient(rgb(32, 146, 240), rgb(0, 109, 211)) !important;
  width: 130px !important;
}

.adsRunning {
  background-color: red !important;
}

.disablePlayAds {
  background-color: gray !important;
  cursor: default !important;
  &:hover {
    transform: none !important;
  }
}

// Scrollbar Style
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
