<template>
  <div class="main">
    <div id="Upper">
      <ul>
        <transition-group name="slide-fade">
          <li v-for="(gun, i) in gunsOpened" :key="i"
          class="Pipe_2">
            <img src="@/assets/skins/rareitem.png" alt="">
            <p class="skin">{{ gun.gunType }} | <span class="skinName">{{ gun.skin }}</span></p>
            <p class="condition">{{ translateCondition(gun.condition) }}</p>
            <p class="uname">{{ gun.uname }}</p>
            <p class="time">{{ getTime(gun.timeOpened) }}</p>
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
          <p class="amountOpened">Opened <span>{{ caseOpened[i] }}</span></p>
          <div class="viewContents">
            <img src="@/assets/icons/contents.svg" alt="">
            <p>View Contents</p>
          </div>
          <div class="openBtnCon">
            <img src="@/assets/icons/bullet.png" alt="">
            <p>{{ casePrices[i] }}</p>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { auth, firestore } from '@/firebase/config.js'
import getCondition from '@/js/translateGunCondition.js'
import translateTimestamp from '@/js/translateTimestamp.js'

export default {
  name: 'Cases',
  data() {
    return {
      caseCDNlink: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXU5A1PIYQNqhpOSV-",
      caseLinks: [
        "fRPasw8rsUFJ5KBFZv668FFY5naqQIz4R7Yjix9bZkvKiZrmAzzlTu5AoibiT8d_x21Wy8hY_MWz1doSLMlhpM3FKbNs/256fx256f.png",
        "fRPasw8rsUFJ5KBFZv668FFU2nfGaJG0btN2wwYHfxa-hY-uFxj4Dv50nj7uXpI7w3AewrhBpMWH6d9CLMlhpEbAe-Zk/256fx256f.png",
        "fRPasw8rsUFJ5KBFZv668FFAuhqSaKWtEu43mxtbbk6b1a77Twm4Iu8Yl3bCU9Imii1Xt80M5MmD7JZjVLFH-6VnQJQ/256fx256f.png",
        "fRPasw8rsUFJ5KBFZv668FFUuh6qZJmlD7tiyl4OIlaGhYuLTzjhVupJ12urH89ii3lHlqEdoMDr2I5jVLFFSv_J2Rg/256fx256f.png",
        "fRPasw8rsUFJ5KBFZv668FFUxnaPLJz5H74y1xtTcz6etNumIx29U6Zd3j7yQoYih3lG1-UJqY27xJIeLMlhpaD9Aclo/256fx256f.png"
      ],
      user: null,
      gunsOpened: [],
      cases: [
        'clutch', 'fracture', 'chroma2',
        'phoenix', 'dangerZone'
      ],
      formattedCaseNames: [
        'Clutch', 'Fracture', 'Chroma 2',
        'Phoenix', 'Danger Zone'
      ],
      casePrices: [100, 250, 120, 214, 51],
      // realtime synced amount of cases opened globally
      caseOpened: [42, 12, 56, 21, 10]
    }
  },
  methods: {
    formattedCaseName(caseName) {
      const index = this.cases.indexOf(caseName)

      return this.formattedCaseNames[index]
    },
    getCaseImg(caseName) {
      const index = this.cases.indexOf(caseName)

      return this.caseCDNlink + this.caseLinks[index]
    },
    getTime(timestamp) {
      return translateTimestamp(timestamp)
    },
    translateCondition(shorthand) {
      return getCondition(shorthand)
    }
  },
  mounted() {
    auth.onAuthStateChanged(user => {
      if (user) {
        this.user = user

        const colRef = firestore.collection('items_opened')
        .orderBy('timeOpened').limit(10)

        colRef.onSnapshot((snap) => {
          let results = []
          snap.docs.forEach(doc => {
            doc.data().timeOpened && results.push({ ...doc.data(), id: doc.id})
          })

          this.gunsOpened = results

          console.log('guns', results)
        })
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
    margin-top: -2px;
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

.consumerGrade {
  background: linear-gradient(rbg(175,175,175), rgb(133, 133, 133));
}
.industrialGrade {
  background: linear-gradient(rbg(135,199,255), rgb(89, 151, 206));
}
.mil-spec {
  background: linear-gradient(rgb(11, 58, 151), rgb(17,85,221));
}
.restricted {
  background: linear-gradient(rgb(136,71,255),rgb(88, 34, 189));
}
.classified {
  background: linear-gradient(rgb(211,44,230),rgb(152, 26, 167));
}
.covert {
  background: linear-gradient(rgb(235,75,75),rgb(155, 27, 27));
}
.gold {
  background: linear-gradient(rgb(202,171,5),rgb(206, 152, 4));
}

#Upper {
  @include centerY;
  top: -300px;
  width: 80vw;
  height: 230px;
  position: relative;
  ul {
    border-radius: 10px;
    padding: 10px;
    border: 3px solid rgba(200, 200, 200, 0.1);
    background-color: rgba(0, 0, 0, 0.3);
    margin: auto;
    min-height: 210px;
    li {
      float: right;
      position: relative;
      padding: 5px;
      border-radius: 10px;
      width: 200px;
      height: 200px;
      border: 1px solid white;
      background: linear-gradient(rgb(11, 58, 151), rgb(17,85,221));
      p {
        margin-top: 5px;
      }
      .skin {
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
        color: red;
        font-weight: bold;
        border-radius: 20px;
        background-color: rgba(0, 0, 0, 0.7);
        width: 140px;
        margin: auto;
        margin-top: 5px;
        padding: 3px;
      }
      img {
        height: 100px;
      }
      .uname {
        background-color: rgba(0, 0, 0, 0.3);
        padding: 3px;
        width: 120px;
        margin: auto;
        border-bottom-left-radius: 4px;
        border-bottom-right-radius: 5px;
      }
      .time {
        position: absolute;
        top: 5px;
        font-weight: bold;
        background-color: rgba(0, 0, 0, 0.3);
        font-size: 10px;
        padding: 3px;
        border-radius: 5px;
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
</style>
