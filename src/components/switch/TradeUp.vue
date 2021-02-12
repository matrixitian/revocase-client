<template>
  <div>

    <div id="Loading" v-if="loading">
      <div class="snippet" data-title=".dot-flashing">
        <div class="stage">
          <div class="dot-flashing"></div>
        </div>
      </div>
    </div>

    <p id="noSkinsFound" v-if="!loading && mySkins.length === 0">You don't have any skins, open some cases!</p>

    <div id="mySkins">
      <ul v-if="!loading">
        <li v-for="(skin, i) in filteredSkins" :key="i"
        :class="skin.grade"
        v-show="checkSkinAvailable(skin)">

          <!-- Skin Img -->
          <img :src="getWpnImg(skin.skin)" alt="">

          <!-- Skin Name -->
          <p>{{ formatSkinName(skin.skin) }}</p>

          <!-- Skin Condition -->
          <p class="gunCondition"
          :class="skin.condition">{{ formatCondition(skin.condition) }}</p>

          <!-- Sell Skin -->
          <button class="sell">
            <p>
              <span>
                {{ getSkinPrice(skin.caseName, skin.grade, skin.condition) }}
              </span>
            </p>
            <img src="@/assets/icons/bullet.png" alt="">
          </button>

          <!-- Select for Trade-Up -->
          <button class="requestTrade" 
          @click="selectForTradeUp(skin, i)">
            Select
          </button>

        </li>
      </ul>
    </div>

    <div id="tradeUp">

      <div id="showReceivedSkin">
       
      </div>

      <p id="tradeUpInfo">10 skins needed for trade up to higher quality!</p>

      <ul v-if="!loading">
        <li v-for="(skin, i) in tradeUpSkins" :key="i"
        :class="skin.grade">

          <!-- Skin Img -->
          <img :src="getWpnImg(skin.skin)" alt="">

          <!-- Skin Name -->
          <p>{{ formatSkinName(skin.skin) }}</p>

          <!-- Skin Condition -->
          <p class="gunCondition"
          :class="skin.condition">{{ formatCondition(skin.condition) }}</p>

          <!-- Sell Skin -->
          <button class="sell">
            <p>
              <span>
                {{ getSkinPrice(skin.caseName, skin.grade, skin.condition) }}
              </span>
            </p>
            <img src="@/assets/icons/bullet.png" alt="">
          </button>

          <!-- Select for Trade-Up -->
          <button class="requestTrade deselect"
          @click="deselectSkin(skin, i)">
            Deselect
          </button>

        </li>
      </ul>

      <div id="tradeButtons">
        <button id="clearBtn"
          @click="clearTradeUp()">
          Clear
        </button>
        <button id="proceedBtn"
          :class="{ proceedOK: tradeUpSkins.length === 10 }"
          @click="doTradeUp()">
          Proceed
        </button>
      </div>
    </div>

  </div>
</template>

<script>
import config from '@/assets/config/config'
import axios from 'axios'
import getCondition from '@/js/translateGunCondition.js'

export default {
  name: "TradeUp",
  data() {
    return {
      user: null,
      loading: true,
      mySkins: [],
      filteredSkins: [],
      tradeUpSkins: [],
      tradeUpGrade: null,
      wpnCDNlink: "https://steamcdn-a.akamaihd.net/apps/730/icons/econ/default_generated/weapon_",
      wpnLinks: {}
    }
  },
  methods: {
    async doTradeUp() {
      const skinIDs = this.tradeUpSkins.map(skin => {
        return skin._id
      })

      const res = await axios.post(`${config.server}/trade-up`, {
        skinIDs
      })

      const receivedSkin = res.data

      console.log(receivedSkin)
    },
    clearTradeUp() {
      this.tradeUpSkins = []
      this.filteredSkins = this.mySkins
    },
    deselectSkin(skin, i) {
      this.tradeUpSkins.splice(i, 1)

      this.filteredSkins.unshift(skin)

      if (this.tradeUpSkins.length === 0) {
        this.filteredSkins = this.mySkins
      }
    },
    selectForTradeUp(skin, i) {
      if (this.tradeUpSkins.length === 10) {
        this.$store.commit('setError', { errMsg: 'You already have 10 skins in the trade up.' })
        throw new Error()
     }

      if (this.tradeUpSkins.length === 0) {
        this.tradeUpGrade = skin.grade
      }

      this.filteredSkins.splice(i, 1)

      this.filteredSkins = this.filteredSkins.filter((skin) => {
        return skin.grade === this.tradeUpGrade
      })

      this.tradeUpSkins.unshift(skin)
    },
    checkSkinAvailable(skin) {
      if (skin.tradeOfferSent || skin.requestedTrade || skin.grade === 'covert') return false

      return true
    },
    getSkinPrice(caseName, grade, condition) {
      const price = this.skinPrices[caseName][grade][condition]

      return price
    },
    formatSkinName(wpnLonghand) {
      return this.normalGunNames[wpnLonghand]
    },
    getTradeOfferStatus(skin) {
      if (skin.tradeOfferSent || skin.requestedTrade) {
        return 'Trade offer requested'
      }
    },
    async fetchSkins() {
      const res = await axios.get(`${config.server}/get-user-skins`)

      this.loading = false

      this.mySkins = res.data
      this.filteredSkins = res.data
    },
    getWpnImg(wpnLonghand) {
      const wpnID = this.wpnLinks[wpnLonghand]

      if (wpnLonghand === 'rare_item') {
        return require('@/assets/cases/rare_item.png')
      } else {
        return `${this.wpnCDNlink}${wpnID}.png`
      }
    },
    formatCondition(skinCon) {
      return getCondition(skinCon)
    }
  },
  mounted() {
    this.wpnLinks = require(`@/assets/gunData/cdn_gun_ids.json`)
    this.normalGunNames = require(`@/assets/gunData/guns_to_normal.json`)
    this.skinPrices = require(`@/assets/gunData/skin_prices.json`)

    this.fetchSkins()

    this.user = this.$store.getters.getUser
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/mixins/centerX';
@import '@/assets/mixins/centerXY';
@import '@/assets/mixins/skinGrades';
@import '@/assets/mixins/skinCondition';

#noSkinsFound {
  z-index: 500;
  @include centerXY;
  background: linear-gradient(rgb(230, 144, 112), orangered);
  padding: 10px;
  width: 350px;
  border-radius: 10px;
  font-weight: bold;
  color: black;
}

div {
  height: 70vh;
  width: 100vw;
}

#tradeUp {
  position: relative;
  height: 70vh;
  width: 49vw;
  float: right;

  #tradeUpInfo {
    background: linear-gradient(rgb(11, 87, 185), rgb(10, 116, 216));
    padding: 3px;
    border-radius: 10px;
    width: 400px;
    border: 2px dashed rgba(255, 255, 255, 0.4);
    margin: auto;
    margin-top: 10px;
  }

  #tradeButtons {
    @include centerX;
    bottom: 25px;
    right: 20px;
    height: auto;
    width: 400px;
    #proceedBtn, #clearBtn {
      margin: 5px;
      font-weight: bold;
      width: 150px;
      font-size: 17px;
      padding: 5px 0 5px 0;
      border: none;
      border-radius: 5px;
      color: whitesmoke;
      background: linear-gradient(rgb(228, 44, 44),rgb(165, 44, 7));
      box-shadow: 2px 2px 6px 1px rgba(0, 0, 0, 0.2);
      cursor: default;
    }
    
    #clearBtn {
      background: linear-gradient(rgb(170, 44, 228), rgb(86, 8, 149));
      cursor: pointer;
      &:hover {
        transition: .15s ease;
        background: linear-gradient(rgb(173, 74, 219), rgb(114, 12, 197)) !important;
      }
    }

    .proceedOK {
      background: linear-gradient(rgb(43, 207, 98),rgb(0, 177, 59)) !important;
      cursor: pointer !important;
      &:hover {
        transition: .15s ease;
        background: linear-gradient(rgb(96, 224, 139), rgb(23, 228, 92)) !important;
      }
    }
  }

}

.deselect {
  background: linear-gradient(red, rgb(189, 0, 0)) !important;
  &:hover {
    background: linear-gradient(rgb(221, 100, 100), rgb(163, 48, 48)) !important;
  }
}

#mySkins {
  position: relative;
  height: 70vh;
  width: 50vw;
  border-right: 2px dashed rgba(255, 255, 255, 0.2);
  float: left;
}

#Inputs {
  display: inline-block;
  position: relative;
  margin: auto;
  margin-top: 15px;
  width: 185px;
  height: 50px;
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

ul {
  @include centerXY;
  width: 90%;
  height: 75%;
  overflow-y: auto;
  li {
    position: relative;
    float: left;
    margin: 8px;
    height: 200px;
    width: 200px;
    border: 2px solid rgba(255, 255, 255, 0.2);
    background-color: rgba(255, 255, 255, 0.05);
    border-radius: 10px;
    img {
      margin-top: 5px;
      height: 80px;
    }
    p {
      font-weight: bold;
      background-color: rgba(0, 0, 0, 0.45);
      padding: 4px;
      margin: auto;
      width: 90%;
      margin-top: 5px;
      border-radius: 5px;
      padding: 5px;
      font-size: 12px;
      span {
        font-weight: bold;
        color: rgb(43, 142, 255);
      }
    }

    .gunCondition {
      font-size: 14px;
      width: 140px;
      border-radius: 10px;
      padding: 3px !important; 
      font-weight: bold;
      background-color: rgba(0, 0, 0, 0.65) !important;
    }

    .requestTrade, .sell {
      margin-top: 7px;
      font-weight: bold;
      width: 90%;
      padding: 5px 0 5px 0;
      border: none;
      border-radius: 5px;
      color: whitesmoke;
      background: linear-gradient(rgb(68, 233, 90),rgb(6, 155, 39));
      box-shadow: 2px 2px 6px 1px rgba(0, 0, 0, 0.2);
      cursor: pointer;
      &:hover {
        transition: .15s ease;
        background: linear-gradient(rgb(101, 226, 117), rgb(11, 173, 46));
      }
    }
    .sell {
      margin-top: 5px !important;
      width: 70px !important; 
      position: absolute;
      top: 0;
      right: 0;
      background: linear-gradient(rgb(90, 235, 71), rgb(8, 165, 29));
      padding-top: 0 !important;
      padding-bottom: 0 !important;
      cursor: default;
      &:hover {
        background: linear-gradient(rgb(90, 235, 71), rgb(8, 165, 29));
      }
      p {
        padding: 2px 0 4px 0 !important;
        font-weight: bold;
        font-size: 15px;
        background-color: transparent !important;
      }
      span {
        margin-bottom: 2px;
        color: white;
        background-color: rgba(0, 0, 0, 0.2);
        padding: 7px;
        border-radius: 5px;
        margin-left: -30px;
        font-size: 12px;
        font-weight: bold;
      }
      img {
        position: absolute;
        right: 5px;
        top: 0px;
        height: 20px;
      }
    }
  }
}

.dot-flashing {
  position: relative;
  width: 10px;
  height: 10px;
  border-radius: 5px;
  background-color: white;
  color: white;
  animation: dotFlashing 1s infinite linear alternate;
  animation-delay: .5s;
}

.dot-flashing::before, .dot-flashing::after {
  content: '';
  display: inline-block;
  position: absolute;
  top: 0;
}

.dot-flashing::before {
  left: -15px;
  width: 10px;
  height: 10px;
  border-radius: 5px;
  background-color: white;
  color: white;
  animation: dotFlashing 1s infinite alternate;
  animation-delay: 0s;
}

.dot-flashing::after {
  left: 15px;
  width: 10px;
  height: 10px;
  border-radius: 5px;
  background-color: white;
  color: white;
  animation: dotFlashing 1s infinite alternate;
  animation-delay: 1s;
}

@keyframes dotFlashing {
  0% {
    background-color: white;
  }
  50%,
  100% {
    background-color: #1B2435;
  }
}

#Loading {
  @include centerXY;
  width: 0;
  height: 0;
  transform: scale(2.2);
}

</style>