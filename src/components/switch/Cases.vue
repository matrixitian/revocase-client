<template>
  <div class="main">

    <div id="Upper">

      <!-- Skin Grades Opened -->
      <div id="skinGradesOpened">
        <ul>
          <li v-for="(gradeCount, go) in skinGradesOpened" :key="go"
          :class="`${skinGradeNamesRaw[go]}-animated`">
            <img src="@/assets/icons/grade_rifle.svg">
            <p>{{skinGradeNames[go]}}: <span>{{ gradeCount }}</span></p>
          </li>
        </ul>
      </div>

      <!-- Live Drops Icon -->
      <div id="liveDrops">
        <p>LIVE DROPS</p>
        <div id="dropIcon" class="blink"></div>
      </div>

      <!-- Live Drops Feed -->
      <ul id="liveDropsSkins">
        <transition-group name="slide-fade">

          <li v-for="(gun, i) in skinsOpened" :key="i"
          :class="gun.grade">

            <!-- Skin Img -->
            <img :src="getSkinImg(gun.longhand)">
            <!-- Skin Name -->
            <p class="skin"><span class="skinName">{{ gun.skin }}</span></p>
            <!-- Skin Condition -->
            <p class="condition" :class="gun.condition">
              {{ gun.condition.toUpperCase() }}
            </p>
            <!-- Won by Username -->
            <p class="uname">{{ gun.uname }}</p>
            <!-- Opened at Time -->
            <p class="time">{{ openedAgo(gun.timeOpened) }}</p>

          </li>

        </transition-group>
      </ul>

    </div>

    <div id="Downer">

      <ul>
        <li v-for="(caseName, i) in cases"
        :key="i" :class="`Pipe_${i}`">

          <!-- Best value -->
          <p id="bestValue" v-if="caseName === 'nuclear'">
            Best Value!
          </p>

          <!-- Most popular -->
          <p id="bestValue" class="mostPopular" v-if="caseName === 'goldenLambda'">
            Most popular!
          </p>
          <!-- Case Img -->
          <img class="case" :src="getCaseImg(caseName)">
          <!-- Case Title -->
          <p class="caseTitle">{{ formattedCaseName(caseName) }}</p>
          <!-- Case Amount Opened -->
          <p class="amountOpened">Opened 
            <span>{{ casesOpened[i] }}</span>
          </p>
          <!-- View Contents Btn -->
          <div class="viewContents"
          @click="changeView(caseName)">
            <span class="material-icons contentsIcon">toc</span>
            <p>View Inside</p>
          </div>
          <!-- Open Container Btn -->
          <div class="openCaseBtn" @click="buyCase(caseName)">
            <img src="@/assets/icons/bullet.png" alt="">
            <p>{{ casePrices[i] }}</p>
          </div>

        </li>
      </ul>

    </div>

  </div>
</template>

<script>
import config from '@/assets/config/config'
import moment from 'moment'
import axios from 'axios'
import { firestore } from '@/firebase/config.js'

export default {
  name: 'Cases',
  data() {
    return {
      userLocation: null,
      tabVisible: true,
      // User Data
      user: null,
      // Live Drops Feed
      skinsOpened: [],
      skinImgLinks: {},
      skinImgSteamLink: "https://steamcdn-a.akamaihd.net/apps/730/icons/econ/default_generated/weapon_",
      caseImgSteamLink: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXU5A1PIYQNqhpOSV-",
      // Cases
      cases: [
        'fire', 'lambda', 'oldschool', 'goldenLambda', 'nuclear'
      ],
      formattedCaseNames: [
        'Fire', 'Lambda', 'Oldschool', 'Golden Lambda', 'Nuclear Wave'
      ],
      casesOpened: [0, 0, 0, 0, 0],
      skinGradesOpened: [0, 0, 0, 0],
      skinGradeNames: ['Gold', 'Pink', 'Purple', 'Blue'],
      skinGradeNamesRaw: ['gold', 'pink', 'purple', 'blue'],
      casePrices: [125, 149, 199, 299, 399]
    }
  },
  created() {
    this.$store.subscribe(async(mutation, state) => {
      if (mutation.type === 'setTabVisible') {
        this.tabVisible = state.tabVisible
      }

      if (mutation.type === 'setUser') {
        this.user = state.user
        this.getUserLocation()
      }
    })
  },
  methods: {
    getUserLocation() {

      const ccCasePrices = [
        [599, 799, 1199, 1799, 2099],
        [299, 345, 599, 899, 1099],
        [249, 299, 399, 599, 799],
        [199, 279, 449, 599, 699],
        [149, 199, 249, 349, 449]
      ]

      const countryCodes = [
        ['XK', 'SY'],
        ['IQ', 'BA', 'PA', 'LY', 'DZ', 'ME', 'MK', 'AL'],
        ['RS', 'LB', 'MD', 'GS', 'JO', 'MO', 'EG', 'BY'],
        ['BG', 'UA'],
        ['HR', 'CY', 'LV', 'LT', 'TR', 'SI', 'RO']
      ]

      const userLoc = this.user.location

      if (userLoc) {
        let i
        for (i = 0; i < 5; i++) {
          if (countryCodes[i].includes(userLoc)) {
            this.casePrices = ccCasePrices[i]
          }
        }
      }

    },
    async buyCase(caseName) {
      // Get Case price
      const caseIndex = this.cases.indexOf(caseName)
      const casePrice = this.casePrices[caseIndex]

      this.user = this.$store.getters.getUser
      const myCoins = this.$store.getters.getCoins

      // Check User has enough coins
      if (myCoins < casePrice) {
        this.$store.commit('setError', {
          errMsg: "You don't have enough coins!"
        })
        throw new Error('Insufficient coins')
      }

      const res = await axios.post(`${config.server}/buy-case`, 
      { caseName })

      // Set current drop for CaseRoll
      this.$store.commit('setCurrentDrop', { 
        drop: {
          name: res.data.skin,
          longhand: res.data.skinLonghand,
          grade: res.data.skinGrade,
          condition: res.data.skinCon.toUpperCase()
        }
       })

      if (res.status === 200) {
        this.$store.commit('selectCase', { caseName })
        this.$store.commit('updateMyCoins', { type: 'subtract', amount: casePrice })
        this.$store.commit('setCaseRollType', { caseRollType: 'case' })
        this.$store.commit('changeView', { view: 'CaseRoll' })
      }
    },
    formattedCaseName(caseName) {
      const index = this.cases.indexOf(caseName)

      return this.formattedCaseNames[index]
    },
    getSkinImg(wpnLonghand) {
      const wpnID = this.skinImgLinks[wpnLonghand]

      return `${this.skinImgSteamLink}${wpnID}.png`
    },
    getCaseImg(caseName) {
      return require(`@/assets/cases/${caseName}.webp`)
    },
    openedAgo(timestamp) {
      return moment(timestamp).fromNow()
    },
    changeView(caseName) {
      this.$store.commit('selectCase', { caseName })
      this.$store.commit('changeView', { view: 'CaseContents' })
    }
  },
  mounted() {
    this.skinImgLinks = require(`@/assets/gunData/cdn_gun_ids.json`)

    if (this.tabVisible) {
      // Realtime Live Drops Feed
      const dropsRef = firestore.collection('drops')
        .orderBy('timeOpened').limitToLast(8)

      dropsRef.onSnapshot((snap) => {
        let results = []
        snap.docs.forEach(doc => {
          doc.data().timeOpened && results.push({ ...doc.data(), id: doc.id})
        })

        this.skinsOpened = results
      })

      // Realtime Cases Opened amounts
      const casesOpenedRef = firestore.collection('casesOpened')

      casesOpenedRef.onSnapshot((snap) => {
        snap.docs.forEach(doc => {
          this.casesOpened[0] = doc.data().fire
          this.casesOpened[1] = doc.data().lambda
          this.casesOpened[2] = doc.data().oldschool
          this.casesOpened[3] = doc.data().goldenLambda
          this.casesOpened[4] = doc.data().nuclear
        })
      })

      // Realtime Cases Opened amounts
      const skinGradesOpened = firestore.collection('skinGradesOpened')

      skinGradesOpened.onSnapshot((snap) => {
        snap.docs.forEach(doc => {
          this.skinGradesOpened[3] = doc.data().blue
          this.skinGradesOpened[2] = doc.data().purple
          this.skinGradesOpened[1] = doc.data().pink
          this.skinGradesOpened[0] = doc.data().gold
        })
      })

    }
  }
}
</script>

<style scoped lang="scss">
@import '@/assets/mixins/blink';
@import '@/assets/mixins/centerX';
@import '@/assets/mixins/centerXY';
@import '@/assets/mixins/unselectable';
@import '@/assets/mixins/skinGrades';
@import '@/assets/mixins/skinCondition';
@import '@/assets/mixins/vueSlideFade';

@media screen and (max-height: 900px) {
  #Upper {
    margin-bottom: 300px !important;
  }
}

#bestValue {
  position: absolute;
  top: 15px;
  right: 7px;
  padding: 4px 10px 4px 10px;
  border-radius: 8px;
  font-weight: bold;
  border: 2px solid white;
  background: linear-gradient(rgb(66, 255, 66), green);
  box-shadow: 0 0 4px 6px rgba(0, 0, 0, 0.1);
  animation: float 4s infinite;
}

.mostPopular {
  background: linear-gradient(rgb(197, 49, 255), rgb(216, 2, 180)) !important;
}

$grayBackground: #1b2435;
$redGradientStart: #ea5a8d;
$redGradientEnd: #e32565;
$yellowGradientStart: #ff7b36;
$yellowGradientEnd: #ffcc01;
$greenGradientStart: #884bd6;
$greenGradientEnd: #a81b8a;
$blueGradientStart: #4797ff;
$blueGradientEnd: #006fee;
$greenGradientStart: #67bb72;
$greenGradientEnd: #35ca4e;

.Pipe_2 {
  // background-color: $greenGradientEnd;
  // background-image: linear-gradient($greenGradientStart, $greenGradientEnd);
  background: linear-gradient(124deg,  $greenGradientStart,  $greenGradientEnd, #0ce617, #b0ff91, #079513, #00c53b, #00cf79, #09ffb5, #73ff9d);
}

.Pipe_1 {
  // background-color: $blueGradientEnd;
  // background-image: linear-gradient($blueGradientStart, $blueGradientEnd);
  background: linear-gradient(124deg, #00ccff, #1d86e8, #1d64e8, #1d4ce8, #2b1de8, #1d86e8, #2b1de8, #1000f3, #0086f3);
}

.Pipe_4 {
  // background-color: $greenGradientEnd;
  // background-image: linear-gradient($greenGradientStart, $greenGradientEnd);
  background: linear-gradient(124deg, #8400ff, #751de8, #af1de8, #751de8, #2b1de8, #491de8, #751de8, #dd00f3, #dd00f3);
}

.Pipe_0 {
  background-color: $redGradientEnd;
  background-image: linear-gradient($redGradientStart, $redGradientEnd);
  background: linear-gradient(124deg, $redGradientStart, $redGradientEnd, #ff92de, #ff0062, #a5007c, #e71212, #e81dc6, #f300b2, #dd00f3);
}

.Pipe_3 {
  // background-color: $yellowGradientEnd;
  // background-image: linear-gradient($yellowGradientEnd, $yellowGradientStart);
  background: linear-gradient(124deg, #ff8800, #e48c00, #ffcf33, #e8781d, #e89a1d, #ffe601, #ffe180, #f3db00, #f38a00);
}

@keyframes rainbow2 {
  0%{background-position:0% 82%}
  50%{background-position:100% 19%}
  100%{background-position:0% 82%}
}

.blue-animated {
  background: linear-gradient(124deg, #00ccff, #1d86e8, #1d64e8, #1d4ce8, #2b1de8, #1d86e8, #2b1de8, #1000f3, #0086f3);
}

.purple-animated {
  background: linear-gradient(124deg, #8400ff, #751de8, #af1de8, #751de8, #2b1de8, #491de8, #751de8, #dd00f3, #dd00f3);
}

.pink-animated {
  background: linear-gradient(124deg, #ff00f2, #e81d72, #d01de8, #af1de8, #2b1de8, #e81d7c, #b91de8, #ba00f3, #dd00f3);
}

.gold-animated {
  background: linear-gradient(124deg, #fbff00, #e8c31d, #e6be0c, #e8781d, #e89a1d, #e8d41d, #d4e81d, #f3db00, #f3cf00);
}

#skinGradesOpened {
  @include centerXY;
  top: 15%;
  width: 1000px;
  height: 55px;
  background-color: rgba(0, 0, 0, 0.3);
  border: 2px solid rgba(200, 200, 200, 0.1);
  ul {
    position: relative;
    height: 100%;
    margin: auto;
    text-align: center;
    li {
      float: right;
      margin: 5px 10px 5px 10px;
      width: auto;
      padding: 5px 20px 5px 20px;
      border-radius: 10px;
      border: 2px solid white;
      background-size: 1800% 1800%;
      animation: rainbow2 18s ease infinite;
      img {
        height: 30px;
        float: left;
        margin-left: -10px;
        margin-right: 10px;
      }
      p {
        float: right;
        font-weight: bold;
        margin-top: 5px;
        span {
          background-color: rgba(0, 0, 0, 0.3);
          padding: 3px;
          border-radius: 10px;
        }
      }
    }
  }
}

#liveDrops {
  position: absolute;
  top: -30px;
  left: -35px;
  z-index: 200;
  p {
    float: left;
    color: white;
    font-size: 17px;
    font-weight: bold;
  }
  #dropIcon {
    margin-left: 20px;
    margin-top: 3px;
    float: right;
    height: 15px; width: 15px;
    background-color: limegreen;
    border: 1px solid rgba(0, 0, 0, 0.3);
    border-radius: 100%;
  }
}

#Upper {
  margin: auto;
  margin-bottom: 340px;
  width: 1100px;
  min-width: 1100px;
  height: 250px;
  position: relative;
  #liveDropsSkins {
    @include centerXY;
    top: 60%;
    border-radius: 10px;
    padding: 10px;
    border: 3px solid rgba(200, 200, 200, 0.1);
    background-color: rgba(0, 0, 0, 0.3);
    margin: auto;
    min-height: 150px;
    height: 150px;
    overflow: hidden;
    width: 1155px;
    li {
      margin: 15px 5px 0 5px;
      float: right;
      position: relative;
      padding: 5px;
      border-radius: 10px;
      width: 120px;
      height: 120px;
      border: 2px solid white;
      p {
        margin-top: 5px;
      }
      .skin {
        font-size: 14px;
        width: auto;
        padding: 3px;
        border-radius: 5px;
        margin-left: 0;
        background-color: rgba(0, 0, 0, 0.3);
        .skinName {
          color: white;
          font-weight: bold;
        }
      }
      .condition {
        font-size: 12px;
        font-weight: bold;
        border-radius: 20px;
        background-color: rgba(0, 0, 0, 0.7);
        width: 40px;
        margin: auto;
        margin-top: 5px;
        padding: 3px;
      }
      img {
        height: 80px;
        margin-bottom: -15px;
      }
      .uname {
        border: 1px solid black;
        position: absolute;
        top: -17px;
        right: -2px;
        background: linear-gradient(orangered, orange);
        border: 1px solid white;
        padding: 3px 10px 3px 10px;
        width: auto;
        margin: auto;
        font-size: 11px;
        font-weight: bold;
        color: rgb(0, 0, 0);
        border-radius: 6px;
      }
      .time {
        color: black;
        border: 1px solid black;
        position: absolute;
        top: -5px;
        right: -2px;
        font-weight: bold;
        background-color: whitesmoke;
        font-size: 10px;
        padding: 3px 10px 3px 10px;
        border-radius: 6px;
      }
    }
  }
}

@keyframes floatBuyBtn {
	0% {
		transform: translatey(3px);
  }
  50% {
		transform: translatey(0px);
  }
  100% {
		transform: translatey(3px);
  }
}
  
#Downer {
  position: relative;
  width: 100%;
  height: calc(100% - 100px);
  ul {
    @include centerX;
    width: auto;
    height: 325px;
    bottom: 0;
    display: flex;
    li {
      position: relative;
      display: inline-block;
      align-self: flex-end;
      border-top-left-radius: 20px;
      border-top-right-radius: 20px;
      margin: 0 10px 0 10px;
      height: 90%;
      width: 200px;
      bottom: 0;
      border: 5px solid white;
      border-bottom: none;
      background-size: 1800% 1800%;
      animation: rainbow2 5s ease infinite;
      &:hover {
        transition: .2s ease;
        height: 300px;
      }

      .case {
        margin-top: 10px;
        height: 120px;
      }

      .caseTitle {
        font-weight: bold;
        margin-top: 7px;
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

      .viewContents, .openCaseBtn {
        margin: auto;
        margin-top: 10px;
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
      }

      .viewContents {
        height: 15px;
        font-size: 14px;
        padding: 4px 5px 4px 5px;
        .contentsIcon {
          float: left;
          padding: 0;
          margin: 0;
          margin-top: -4px;
        }
        p {
          margin-top: -2px;
        }
      }

      .openCaseBtn {
        padding: 7px 10px 7px 10px;
        background-color: rgb(46, 209, 54);
        background-image: linear-gradient(rgb(46, 209, 54), rgb(18, 158, 41));
        border-radius: 20px;
        max-width: 100px;
        animation: floatBuyBtn 2s infinite;
        img {
          float: left;
          padding: 0;
          margin: 0;
          margin-top: -5px;
          height: 30px;
          width: 30px;
        }
        p {
          font-size: 18px;
        }
      }
    }
  }
}

</style>
