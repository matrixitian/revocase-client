<template>
  <div class="main">
    <div id="Upper">
      <div id="liveFeed">
        <p>LIVE DROPS</p>
        <div id="dropIcon" class="blink"></div>
      </div>

      <ul>
        <transition-group name="slide-fade">
          <li v-for="(gun, i) in gunsOpened" :key="i"
          :class="gun.grade">
            <img :src="getWpnImg(gun.skin_longhand)" alt="">
            <p class="skin"><span class="skinName">{{ gun.skin }}</span></p>
            <p class="condition"
            :class="gun.condition">{{ gun.condition.toUpperCase() }}</p>
            <p class="uname">{{ gun.uname }}</p>
            <p class="time">{{ openedAgo(gun.timeOpened) }}</p>
          </li>
        </transition-group>
      </ul>
    </div>
    <div id="Downer">

      <ul>
        <li v-for="(caseName, i) in cases" :key="i"
        :class="`Pipe_${i}`">
          <img class="case" :src="getCaseImg(caseName)" alt="">
          <p class="caseTitle">{{ formattedCaseName(caseName) }}</p>
          <p class="amountOpened">Opened <span>{{ casesOpened[caseName] }}</span></p>
          <div class="viewContents"
          @click="changeView()">
            <img src="@/assets/icons/contents.svg" alt="">
            <p>View Contents</p>
          </div>
          <div class="openBtnCon" @click="buyCase(caseName)">
            <img src="@/assets/icons/bullet.png" alt="">
            <p>{{ casePrices[i] }}</p>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import axios from 'axios'
import { auth, firestore } from '@/firebase/config.js'
import translateTimestamp from '@/js/translateTimestamp.js'

export default {
  name: 'Cases',
  data() {
    return {
      myCoins: 0,
      wpnCDNlink: "https://steamcdn-a.akamaihd.net/apps/730/icons/econ/default_generated/",
      wpnLinks: {},
      caseCDNlink: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXU5A1PIYQNqhpOSV-",
      caseLinks: [
        "fRPasw8rsUFJ5KBFZv668FFY5naqQIz4R7Yjix9bZkvKiZrmAzzlTu5AoibiT8d_x21Wy8hY_MWz1doSLMlhpM3FKbNs/256fx256f.png",
        "fRPasw8rsUFJ5KBFZv668FFU2nfGaJG0btN2wwYHfxa-hY-uFxj4Dv50nj7uXpI7w3AewrhBpMWH6d9CLMlhpEbAe-Zk/256fx256f.png",
        "fRPasw8rsUFJ5KBFZv668FFAuhqSaKWtEu43mxtbbk6b1a77Twm4Iu8Yl3bCU9Imii1Xt80M5MmD7JZjVLFH-6VnQJQ/256fx256f.png",
        "fRPasw8rsUFJ5KBFZv668FFUuh6qZJmlD7tiyl4OIlaGhYuLTzjhVupJ12urH89ii3lHlqEdoMDr2I5jVLFFSv_J2Rg/256fx256f.png",
        "fRPasw8rsUFJ5KBFZv668FFUxnaPLJz5H74y1xtTcz6etNumIx29U6Zd3j7yQoYih3lG1-UJqY27xJIeLMlhpaD9Aclo/256fx256f.png"
      ],
      user: null,
      money: 0,
      gunsOpened: [],
      cases: [
        'dangerZone', 'chroma2', 'clutch', 'fracture', 'phoenix'
      ],
      formattedCaseNames: [
        'Danger Zone', 'Chroma 2', 'Clutch', 'Fracture', 'Phoenix'
      ],
      casePrices: [350, 400, 450, 750, 1100],
      // realtime synced amount of cases opened globally
      casesOpened: {
        dangerZone: 0,
        chroma2: 0,
        clutch: 0,
        fracture: 0,
        phoenix: 0
      }
    }
  },
  created() {
    this.$store.subscribe(async(mutation, state) => {
      if (mutation.type === 'updateMyCoins') {
        this.myCoins = state.myCoins
      }
    })
  },
  methods: {
    changeView() {
      this.$store.commit('changeView', { view: 'CaseContents' })
    },
    async buyCase(caseName) {
      const caseIndex = this.cases.indexOf(caseName)
      const casePrice = this.casePrices[caseIndex]

      if (this.myCoins < casePrice) {
        throw new Error('Insufficient coins')
      }

      const res = await axios.post('http://localhost:3000/buy-case', 
      { caseName, userUID: this.user.uid })

      if (res.status === 200) {
        console.log(res.data)

        firestore.collection("drops").add({
          uname: this.user.displayName,
          skin: res.data.skin,
          skin_longhand: res.data.skinLonghand,
          grade: res.data.skinGrade,
          condition: res.data.skinCon,
          timeOpened: Number(Date.now())
        }).then((res) => {
          console.log(res)
           firestore.collection("casesOpened").doc('EYF66qQOWNDJ1PeSFHi0').update({
            caseName: 1
          })
        }).catch((err) => {
          console.log(err)
        })

        this.$store.commit('updateMyCoins', { type: 'subtract', amount: casePrice })
      }

      console.log(res.data)
    },
    formattedCaseName(caseName) {
      const index = this.cases.indexOf(caseName)

      return this.formattedCaseNames[index]
    },
    getWpnImg(wpnLonghand) {
      const wpnID = this.wpnLinks[wpnLonghand]

      return `${this.wpnCDNlink}${wpnID}.png`
    },
    getCaseImg(caseName) {
      const index = this.cases.indexOf(caseName)

      return this.caseCDNlink + this.caseLinks[index]
    },
    getTime(timestamp) {
      return translateTimestamp(timestamp)
    },
    openedAgo(timestamp) {
      return moment(timestamp).fromNow()
    },
  },
  mounted() {
    this.wpnLinks = require(`@/assets/gunData/cdn_gun_ids.json`)

    auth.onAuthStateChanged(user => {
      if (user) {
        this.user = user

        const dropsRef = firestore.collection('drops')
        .orderBy('timeOpened').limitToLast(8)

        dropsRef.onSnapshot((snap) => {
          let results = []
          snap.docs.forEach(doc => {
            // console.log(doc.data())
            doc.data().timeOpened && results.push({ ...doc.data(), id: doc.id})
          })

          this.gunsOpened = results
        })

        const casesOpenedRef = firestore.collection('casesOpened')

        casesOpenedRef.onSnapshot((snap) => {
          snap.docs.forEach(doc => {
            this.casesOpened = doc.data().cases
          })
        })

        // Get Money, Skins
        // const dbUser = await axios.post('http://localhost:3000/get-user-data')

        // console.log(dbUser)
      } else {
        // No user is signed in.
        // this.authChecked = true
      }
    })
  }
}
</script>

<style scoped lang="scss">
@import '@/assets/mixins/centerX';
@import '@/assets/mixins/centerY';
@import '@/assets/mixins/centerXY';
@import '@/assets/mixins/unselectable';
@import '@/assets/mixins/skinGrades';
@import '@/assets/mixins/skinCondition';
@import '@/assets/mixins/vueSlideFade';

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

#liveFeed {
  position: absolute;
  top: -25px;
  left: 10px;
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

.Pipe_3 {
  background-color: $redGradientEnd;
  background-image: linear-gradient($redGradientStart, $redGradientEnd);
}

.Pipe_4 {
  background-color: $yellowGradientEnd;
  background-image: linear-gradient($yellowGradientEnd, $yellowGradientStart);
}

.Pipe_2 {
  background-color: $greenGradientEnd;
  background-image: linear-gradient($greenGradientStart, $greenGradientEnd);
}

.Pipe_1 {
  background-color: $blueGradientEnd;
  background-image: linear-gradient($blueGradientStart, $blueGradientEnd);
}

.Pipe_0 {
  background-color: $purpleGradientEnd;
  background-image: linear-gradient($purpleGradientStart, $purpleGradientEnd);
}

.blink {
  animation: blinker 1s linear infinite;
}

@keyframes blinker {
  50% {
    opacity: 0;
  }
}

#Upper {
  margin: auto;
  margin-bottom: 340px;
  width: 1100px;
  min-width: 1100px;
  height: 250px;
  position: relative;
  ul {
    @include centerXY;
    border-radius: 10px;
    padding: 10px;
    border: 3px solid rgba(200, 200, 200, 0.1);
    background-color: rgba(0, 0, 0, 0.3);
    margin: auto;
    min-height: 150px;
    height: 150px;
    overflow: hidden;
    width: 1140px;
    li {
      margin: 15px 5px 0 5px;
      float: right;
      position: relative;
      padding: 5px;
      border-radius: 10px;
      width: 120px;
      height: 120px;
      border: 1px solid white;
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
        background-color:rgb(5, 218, 51);
        padding: 3px 10px 3px 10px;
        width: auto;
        margin: auto;
        font-size: 10px;
        font-weight: bold;
        color: white;
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
        &:hover {
          transition: .2s ease;
          height: 300px;
        }
      }
    }
  }

.case {
  transform: scale(0.6);
  margin-top: -30px;
  margin-left: -30px;
}

.caseTitle {
  font-weight: bold;
  margin-top: -40px;
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
    margin-top: -4px;
  }
}

.viewContents {
  height: 15px;
  font-size: 14px;
  padding: 4px 5px 4px 5px;
  p {
    margin-top: -2px;
  }
}

.openBtnCon {
  padding: 7px 10px 7px 10px;
  background-color: rgb(46, 209, 54);
  background-image: linear-gradient(rgb(46, 209, 54), rgb(18, 158, 41));
  border-radius: 20px;
  max-width: 100px;
  img {
    margin-top: -5px;
    height: 30px;
    width: 30px;
  }
  p {
    font-size: 18px;
  }
}
</style>
