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

    <div></div>
    <ul v-if="!loading">
      <li v-for="(skin, i) in mySkins" :key="i"
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
        <button class="requestTrade" @click="selectForTradeUp(skin._id, i)">
          Select
        </button>

      </li>
    </ul>

    <div id="tradeDurationInfo">
      <p>It can take up to <span>24 hours</span> until your Steam account receives the trade offer!</p>
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
      tradeURL: null,
      mySkins: [],
      CDNgunIDs: [],
      wpnCDNlink: "https://steamcdn-a.akamaihd.net/apps/730/icons/econ/default_generated/weapon_",
      wpnLinks: {},
      normalGunNames: {},
      skinPrices: {}
    }
  },
  methods: {
    checkSkinAvailable(skin) {
      if (skin.tradeOfferSent || skin.requestedTrade) return false

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
  // border: 1px solid white;
  width: 90%;
  height: 80%;
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
      background: linear-gradient(rgb(228, 154, 44),rgb(231, 65, 15));
      box-shadow: 2px 2px 6px 1px rgba(0, 0, 0, 0.2);
      cursor: pointer;
      &:hover {
        transition: .15s ease;
        background: -webkit-linear-gradient(#e48a37,#aa4a0a 60%,#e06823);
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