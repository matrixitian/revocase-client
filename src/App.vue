<template>
  <div id="Main" v-if="!isMobileDevice">

    <div id="tutorialVideoContainer" v-if="!tutorialClosed">
      <ul id="videoTranslation">
        <li v-for="vl in videoLinks" :key="vl.lang"
        @click="selectVideoLang(vl)">
          <img 
          :src="require(`@/assets/flags/${vl.lang}.svg`)"
          :class="{videoLangSelected: selectedVideoLang === vl.lang}">
        </li>
      </ul>

      <span class="material-icons-round closeIcon"
      @click="toggleTutorial()">
        close
      </span>

      <iframe id="tutorialVideo" 
      width="420" height="315" allowfullscreen
      :src="selectedVideoLink">
      </iframe>
    </div>

    <p id="appVersion">version: <span>beta</span> 0.9.2</p>

    <PasswordReset v-if="showPasswordResetView" 
    @passwordResetComplete="this.showPasswordResetView = false"
    :safeCode="safeCode"/>

    <VerifyEmail />

    <NetworkStatus />

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
            <img id="Logo" src="@/assets/logo.webp" alt="RevoSkins.Eu Logo">
            <p id="logoText">Revo Cases</p>
          </div>
        </div>

        <div id="giveawayBtn" @click="goToView('Giveaways')">
          <p>Giveaway ends in <span>{{ countdown }}</span></p>
        </div>

        <div id="bonusBtn"
        v-if="dynamicComponent === 'Cases'"
        @click="openDailyReward"
        :class="{dailyRewardUnavailable: !dailyRewardAvailable}">
          <p>{{ dailyRewardAvailable? 'Daily Reward!' : dailyRewardCountdown }}</p>
          <img src="@/assets/icons/bullet.png">
        </div>

        <p id="motivation">Watch ads and get a free case of choice every day!</p>
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
          :class="[{ adsRunning: adsRunning },{ disablePlayAds: adCount === 75 },]">
            <img src="@/assets/icons/start.svg" alt="">
            <p v-if="adCount < 75">
              {{
                `${adCount}/75 Ads`
              }}
            </p>
            <p v-if="!user && adCount == 75">
              {{
                `${adCount}/75 Ads`
              }}
            </p>
            <p id="startAdsCountdown" v-if="adCount >= 75 && user">{{ startAdsCountdown }}</p>
          </div>

          <!-- Tutorial Btn -->
          <div id="playTutorial" @click="toggleTutorial()">
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
      <div id="bottomAligner">
        <component :is="dynamicComponent" :Case="caseClicked" :user="user"></component>
      </div>   
    </div>

  </div>

  <div id="Mobile" v-else>
    <img src="@/assets/logo.webp" alt="">
    <h1>Revo Cases App</h1>
    <a href="https://play.google.com/store/apps/details?id=com.gametune.revo">
      <img src="@/assets/icons/google-play-badge.webp">
    </a>
    <p id="trademark">Google Play and the Google Play logo are trademarks of Google LLC.</p>
  </div>
</template>

<script>
import { isMobile } from 'mobile-device-detect';
import moment from 'moment'
import config from '@/assets/config/config'
import { detectAnyAdblocker } from 'just-detect-adblock'
import axios from 'axios'
import io from 'socket.io-client'
import Cookies from 'js-cookie'
import * as Parts from '@/components/switch'
import Auth from '@/components/Auth'
import ErrorHandler from '@/components/ErrorHandler'
import AdminPanel from '@/components/AdminPanel'
import NetworkStatus from '@/components/NetworkStatus'
import VerifyEmail from '@/components/VerifyEmail'
import PasswordReset from '@/components/PasswordReset'

export default {
  name: 'App',
  components: {
    ...Parts, Auth, ErrorHandler, AdminPanel, NetworkStatus, VerifyEmail, PasswordReset
  },
  data() {
    return {
      tutorialClosed: true,
      videoLinks: [
        {
          lang: 'en',
          link: 'https://www.youtube.com/embed/tgbNymZ7vqY'
        },
        {
          lang: 'hr',
          link: 'https://www.youtube.com/embed/u9raS7-NisU'
        },
        {
          lang: 'ba',
          link: 'https://www.youtube.com/embed/tgbNymZ7vqY'
        },
        {
          lang: 'rs',
          link: ''
        },
        {
          lang: 'pl',
          link: ''
        },
        {
          lang: 'ru',
          link: ''
        },
        {
          lang: 'tr',
          link: ''
        },
        {
          lang: 'es',
          link: ''
        },
        {
          lang: 'br',
          link: ''
        }
      ],
      selectedVideoLang: 'en',
      selectedVideoLink: 'https://www.youtube.com/embed/tgbNymZ7vqY',
      tabVisible: true,
      isMobileDevice: isMobile ? true : false,
      socket: io(config.server),
      isAdmin: false,
      showPasswordResetView: false,
      // User data
      user: null,
      myCoins: 0,
      dailyRewardAvailable: false,
      // For password reset
      safeCode: null,
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
      selectedLang: 'en',
      langListVisible: false,
      langs: [
        'croatian', 'english', 'french', 'german', 'italian',
        'polish', 'portuguese', 'russian', 'serbian', 'spanish', 'turkish'
      ],
      countdown: '24:00:00',
      dailyRewardCountdown: '24:00:00',
      startAdsCountdown: '24:00:00'
    }
  },
  created() {
    // Redirect to SSL
    console.log(window.location.href)
    if (location.protocol !== 'https:' && window.location.href !== 'http://localhost:8080/') {
        location.replace(`https:${location.href.substring(location.protocol.length)}`);
    }

    this.$store.subscribe(async(mutation, state) => {
      if (mutation.type === 'setUser') {
        this.user = state.user

        if (this.user) {
          if (this.user.accountType === 'admin') {
            this.isAdmin = true
          }
        }

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
    // Check user session
    this.fetchUser()

    this.dailyRewardAvailable = true

    // Get adCount (count of viewed ads on #playAds button)
    if (localStorage.getItem('adCount')) {
      this.adCount = Number(localStorage.getItem('adCount'))
    }

    const alreadyViewed = Cookies.get('ads_viewed_today')
    
    if (alreadyViewed) {
      this.adCount = 75
      localStorage.setItem('adCount', 75)
    }

    // Tutorial video already viewed
    const tutorialViewed = Boolean(localStorage.getItem('tutorialViewed'))

    if (!tutorialViewed) {
      this.tutorialClosed = false
    }

    // User count
    this.socket.on('get user count', (data) => {
      this.userCount = data.userCount
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
    
      if (urlParams.safecode) {
        this.safeCode = urlParams.safecode[0]
        this.showPasswordResetView = true
      }
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
      result += "h : " + ((diffMi < 10) ? "0" + diffMi : diffMi)
      result += "m : " + ((diffS < 10) ? "0" + diffS : diffS)
      
      this.countdown = result + 's'
    }, 1000)

    // Countdown Daily Reward
    setInterval(() => {
      if (this.user) {
        let date = new Date(this.user.dailyRewardOpened)
        // add a day
        date.setDate(date.getDate() + 1)
        let toDate = new Date()
        let tomorrow = date
        let diffMS = tomorrow.getTime() / 1000 - toDate.getTime() / 1000
        let diffHr = Math.floor(diffMS / 3600)
        diffMS = diffMS - diffHr * 3600
        let diffMi = Math.floor(diffMS / 60)
        diffMS = diffMS - diffMi * 60
        // let diffS = Math.floor(diffMS)
        let result = ((diffHr < 10) ? "0" + diffHr : diffHr)
        result += "h : " + ((diffMi < 10) ? "0" + diffMi : diffMi)
        // result += "m : " + ((diffS < 10) ? "0" + diffS : diffS)
        
        this.dailyRewardCountdown = 'Wait ' + result + 'm'
      }
    }, 1000)

    // Countdown Play Ads
    setInterval(() => {
      if (this.user) {
        let date = new Date(this.user.boosterAdsFinishedAt)
        // add a day
        date.setDate(date.getDate() + 1)
        let toDate = new Date()
        let tomorrow = date
        let diffMS = tomorrow.getTime() / 1000 - toDate.getTime() / 1000
        let diffHr = Math.floor(diffMS / 3600)
        diffMS = diffMS - diffHr * 3600
        let diffMi = Math.floor(diffMS / 60)
        diffMS = diffMS - diffMi * 60
        let diffS = Math.floor(diffMS)
        let result = ((diffHr < 10) ? "0" + diffHr : diffHr)
        result += "h : " + ((diffMi < 10) ? "0" + diffMi : diffMi)
        result += "m : " + ((diffS < 10) ? "0" + diffS : diffS)
        
        this.startAdsCountdown = result + 's'
      }
    }, 1000)

    // Check if daily reward is available
    setInterval(() => {
      this.checkDailyRewardAvailable()
    }, 60000)

    // Check Tab Active
    setInterval(() => {
      this.checkTabActive()
    }, 1000)
  },
  methods: {
    selectVideoLang(vl) {
      this.selectedVideoLang = vl.lang
      this.selectedVideoLink = vl.link
    },
    toggleTutorial() {
			this.tutorialClosed = !this.tutorialClosed
      localStorage.setItem('tutorialViewed', true)
		},
    checkTabActive() {
      let item
      let eventKey

      const vis = (c) => {
        let self = this
        const browserProps = {
          hidden: "visibilitychange",
          msHidden: "msvisibilitychange",
          webkitHidden: "webkitvisibilitychange",
          mozHidden: "mozvisibilitychange",
        }
        for (item in browserProps) {
          if (item in document) {
            eventKey = browserProps[item]
            break
          }
        }

        if (c) {
          if (!self._init && !(typeof document.addEventListener === "undefined")) {
            document.addEventListener(eventKey, c)
            self._init = true
            c()
          } 
        }
        return  !document[item] 
      }

      vis(() => {
        this.tabVisible = vis() ? true : false
        this.$store.commit('setTabVisible', { tabVisible: this.tabVisible })
      })
    },
    async openDailyReward() {
      if (this.dailyRewardAvailable) {
        const res = await axios.post(`${config.server}/open-daily-reward`)

        if (res.status === 200) {
          this.dailyRewardAvailable = false

          this.user.dailyRewardOpened = new Date()
          this.$store.commit('setUser', { user: this.user })

          this.$store.commit('setDailyRewardDrop', { amount: res.data })
          this.$store.commit('setCaseRollType', { caseRollType: 'daily_reward' })
          this.$store.commit('changeView', { view: 'CaseRoll' })
        } else {
          this.$store.commit('setError', { errMsg: 'Error. Please refresh page and try again.' })
        }
      }
    },
    checkDailyRewardAvailable() {
      if (this.user.dailyRewardOpened) {
        let a = moment(new Date())
        let b = moment(this.user.dailyRewardOpened)

        let hourDiff = a.diff(b, 'hours')

        if (hourDiff < 24) {
          this.dailyRewardAvailable = false
        }
      }
    },
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

        const vl = this.videoLinks.find(vl => vl.lang === this.user.location.toLowerCase())
        
        // Auto select tutorial video language
        if (vl !== undefined) {
          this.selectedVideoLang = vl.lang
          this.selectedVideoLink = vl.link
        }

        if (this.user.accountType === 'admin') {
          this.isAdmin = true
        }

        this.checkDailyRewardAvailable()

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
        localStorage.removeItem('adCount')
        localStorage.removeItem('token')
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

      let adBlockActive
      detectAnyAdblocker().then((detected) => {
        
        if (detected) {
          alert('Please turn off adblock! Otherwise you will not be getting any points!')
          this.$store.commit('setError', { errMsg: 'Please turn off your Ad Blocker or you will not be able to get bullets!' })
          adBlockActive = true
        } else {
          adBlockActive = false
          this.adsRunning = !this.adsRunning
        }
      })

      const finishDailyAds = async() => {
        const res = await axios.post(`${config.server}/finish-daily-ads`)

        if (res.status !== 200) {
          this.$store.commit('setError', { errMsg: 'Point could not be given. Please refresh page.' })
        }
      }

      if (this.adCount < 75) {
        this.currentIntervalID = setInterval(() => {

        if (this.adsRunning && !adBlockActive && this.adCount < 75) {
          // Adsterra
          window.open('https://ascertaincrescenthandbag.com/ja1tmrw6?key=853be86831dc5b1b937a1d658098c0f0', '_blank')
          // PropellerAds
          window.open('//stawhoph.com/afu.php?zoneid=3928400', '_blank')
          // AdCash
          window.open('https://www.greatdexchange.com/jump/next.php?r=4138191', '_blank')
          // window.open('https://apprefaculty.pro/d.m/F/z-dpGaNLv/ZKG/Ux/ee/me9EuuZEU/lqkpPTTtQCxmNHj/YaxfNMjPkDteNJDIES2/N/jnE/3yMrAg', '_blank')

          this.adCount++
          localStorage.setItem('adCount', this.adCount)

          if (this.adCount === 75) {
            Cookies.set('ads_viewed_today', true, { expires: 1 })
            localStorage.setItem('adCount', 75)
            finishDailyAds()

            this.user.boosterAdsFinishedAt = new Date()

            this.$store.commit('setUser', { user: this.user })

            this.$store.commit('updateMyCoins', { type: 'add', amount: 25 })

            this.adsRunning = false
          }
          }
        }, 16000)

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

#tutorialVideoContainer {
  z-index: 2000;
  @include centerXY;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.6);
  #videoTranslation {
    margin-top: 40px;
    background-color: #1b2435;
    li {
      display: inline;
      margin: 5px;
      img {
        height: 50px;
        border-radius: 10px;
        padding: 0 5px 0 5px;
        cursor: pointer;
        &:hover {
          transition: .1s ease-in-out;
          box-shadow: 0 0 5px 7px rgba(0, 0, 0, 0.2);
          background-color: rgba(255, 255, 255, 0.1);
        }
      }
    }
  }
  span {
    position: absolute;
		top: 50px;
		right: 50px;
		transform: scale(1.5);
		background-color: red;
		padding: 3px;
    border: 2px solid white;
		border-radius: 100%;
		box-shadow: 0 0 5px 7px rgba(0, 0, 0, 0.2);
		cursor: pointer;
		&:hover {
			transition: .15s ease-in-out;
			transform: scale(1.55);
		}
  }
  #tutorialVideo {
    @include centerXY;
    width: 90vw;
    height: 70vh;
    max-width: 1000px;
    max-height: 800px;
  }
}

.videoLangSelected {
  box-shadow: 0 0 5px 7px rgba(0, 0, 0, 0.2);
  background-color: rgba(255, 255, 255, 0.4);
}

@keyframes animateMotivation {
  0% { color: limegreen }
  50% { color: rgb(67, 231, 130) }
  75% { color: rgb(134, 255, 134) }
  100% { color: rgb(67, 206, 120) }
}

#Mobile {
  @include centerXY;
  h1 {
    margin-bottom: 20px;
  }
}

#appVersion {
  @include centerX;
  top: -5px;
  background-color: rgba(0, 0, 0, 0.2);
  border: 2px solid rgba(255, 255, 255, 0.2);
  padding: 4px 15px 4px 15px;
  border-radius: 8px;
  span {
    color: red;
  }
}

#startAdsCountdown {
  font-size: 16px !important;
  margin-left: 10px;
  width: 80%;
}

#motivation {
  @include centerX;
  font-size: 18px;
  font-weight: bold;
  top: 27vh;
  animation: animateMotivation 3s infinite;
}

#giveawayBtn {
  @include centerX;
  margin-left: -90px;
  top: 170px;
  padding: 10px;
  background: linear-gradient(red, purple);
  border-radius: 10px;
  border: 2px solid white;
  font-weight: bold;
  cursor: pointer;
  &:hover {
    transition: .15s ease-in-out;
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

#bonusBtn {
  @include centerX;
  top: 167px;
  margin-left: 140px;
  padding: 10px 20px 10px 40px ;
  color: rgba(0, 0, 0, 0.7);
  width: 110px;
  height: 25px;
  border-radius: 30px;
  border: 2px solid white;
  background: linear-gradient(rgb(45, 223, 22), rgb(11, 172, 51));
  cursor: pointer;
  &:hover {
    transition: .15s ease-in-out;
    padding: 11px 21px 11px 41px;
    color: white;
    background: linear-gradient(rgb(113, 241, 96), rgb(2, 207, 53));
  }
  p {
    @include centerY;
    float: left;
    left: 20px;
    font-weight: bold
  }
  img {
    @include centerY;
    float: right;
    right: 5px;
    height: 30px;
    width: 30px;
  }
}

.dailyRewardUnavailable {
  background: linear-gradient(rgb(204, 204, 204), rgb(112, 112, 112)) !important;
  cursor: default !important;
  &:hover {
    color: rgba(0, 0, 0, 0.7) !important;
    padding: 10px 20px 10px 40px !important;
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
      border: 1px solid rgb(221, 99, 0);
      border-radius: 5px;
      background-color: rgba(0, 0, 0, 0.55);
      #referralCode {
        @include centerXY;
        height: 30px;
        width: 90%;
        padding: 0 5px 0 5px;
        border-radius: 5px;
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
        background-color: rgb(221, 99, 0);
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
          color: rgba(0, 0, 0, 0.9);
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
        z-index: 200 !important;
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
