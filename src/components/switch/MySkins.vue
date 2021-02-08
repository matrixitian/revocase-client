<template>
  <div>

    <div id="Loading" v-if="loading">
      <div class="snippet" data-title=".dot-flashing">
        <div class="stage">
          <div class="dot-flashing"></div>
        </div>
      </div>
    </div>

    <div id="Inputs">
      <input placeholder="New Trade URL" type="text"
      v-model="tradeURL"
      @focus="tradeURL = null"
      @blur="updateTradeURL()">
      <a href="https://steamcommunity.com/my/tradeoffers/privacy#trade_offer_access_url"
      target="_blank">
        <img src="@/assets/icons/info.svg" alt="">
      </a>
    </div>

    <p id="noSkinsFound" v-if="!loading && mySkins.length === 0">You don't have any skins, open some cases!</p>

    <ul v-if="!loading">
      <li v-for="(skin, i) in mySkins" :key="i"
      :class="skin.grade">

        <!-- Skin Img -->
        <img :src="getWpnImg(skin.skin)" alt="">

        <!-- Skin Name -->
        <p>{{ formatSkinName(skin.skin) }}</p>

        <!-- Skin Condition -->
        <p class="gunCondition"
        :class="skin.condition">{{ formatCondition(skin.condition) }}</p>

        <!-- Sell Skin -->
        <button class="sell" v-if="!skin.requestedTrade"
        :class="{adjustSellBtn: skin.grade === 'mil_spec'}"
        @click="sellSkin(skin, i)">
          <p>Sell for 
            <span>{{ getSkinPrice(skin.caseName, skin.grade, skin.condition) }}</span>
          </p>
          <img src="@/assets/icons/bullet.png" alt="">
        </button>

        <!-- Request Trade -->
        <button class="requestTrade"
        v-if="skin.grade !== 'mil_spec'"
        :class="[
          {disabled: skin.requestedTrade},
          {offerReceived: skin.tradeOfferSent}
        ]"
        @click="requestTrade(skin._id, i)">
          {{ getTradeOfferStatus(skin) }}
        </button>

      </li>
    </ul>

    <div id="tradeDurationInfo">
      <p>It can take up to <span>24 hours</span> until your Steam account receives the trade offer!</p>
    </div>

  </div>
</template>

<script>
import axios from 'axios'
import getCondition from '@/js/translateGunCondition.js'

export default {
  name: "MySkins",
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
    getTradeOfferStatus(skin) {
      if (skin.tradeOfferSent) {
        return 'Trade offer received'
      } else if (skin.requestedTrade) {
        return 'Skin will be sent within 1 day'
      } else {
        return 'Trade to account'
      }
    },
    async updateTradeURL() {
      if (!this.tradeURL) {
        this.$store.commit('setError', {
          errMsg: "TradeURL cannot be empty!"
        })
        throw new Error()
      }

      const res = await axios.post('https://revo-cases.herokuapp.com/update-trade-url', {
        tradeURL: this.tradeURL
      })

      if (res.status === 200) {
        this.user.tradeURL = this.tradeURL

        this.$store.commit('setUser', { user: this.user })
      }
    },
    async sellSkin(skin, i) {
      const res = await axios.post('https://revo-cases.herokuapp.com/sell-skin', {
        skinID: skin._id
      })

      const price = this.getSkinPrice(skin.caseName, skin.grade, skin.condition)

      if (res.status === 200) {
        this.mySkins.splice(i, 1)
        this.$store.commit('updateMyCoins', { type: 'add', amount: price })
      } else {
        this.$store.commit('setError', { errMsg: 'Selling skin failed. Please refresh site and try again!' })
      }
    },
    getSkinPrice(caseName, grade, condition) {
      const price = this.skinPrices[caseName][grade][condition]

      return price
    },
    formatSkinName(wpnLonghand) {
      return this.normalGunNames[wpnLonghand]
    },
    async requestTrade(skinID, i) {
      const res = await axios.post('https://revo-cases.herokuapp.com/request-trade', { skinID })

      if (res.status === 200) {
        this.mySkins[i].requestedTrade = true
      }
    },
    async fetchSkins() {
      const res = await axios.get('https://revo-cases.herokuapp.com/get-user-skins')

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

    this.tradeURL = this.user.tradeURL
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

#tradeDurationInfo {
  position: absolute;
  bottom: 0;
  height: auto;
  width: 100%;
  background-color: rgba(0, 0, 0, 0.45);
  padding: 10px;
  p {
    color: orangered;
    span {
      color: whitesmoke;
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
    float: left;
    margin: 15px;
    height: 290px;
    width: 250px;
    border: 2px solid rgba(255, 255, 255, 0.2);
    background-color: rgba(255, 255, 255, 0.05);
    border-radius: 10px;
    img {
      margin-top: 20px;
      height: 120px;
    }
    p {
      font-weight: normal;
      background-color: rgba(0, 0, 0, 0.45);
      padding: 4px;
      margin: auto;
      width: 90%;
      margin-top: 5px;
      border-radius: 5px;
      padding: 5px;
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
      position: relative;
      background: linear-gradient(rgb(90, 235, 71), rgb(8, 165, 29)) ;
      padding-top: 0 !important;
      padding-bottom: 0 !important;
      &:hover {
        transition: .15s ease;
        background: -webkit-linear-gradient(#29cc31,#08a515 60%,#23c052);
      }
      p {
        padding: 5px 0 8px 0 !important;
        font-weight: bold;
        font-size: 15px;
        background-color: transparent !important;
      }
      span {
        margin-top: -5px;
        color: white;
        background-color: rgba(0, 0, 0, 0.2);
        padding: 7px;
        border-radius: 5px;
        margin-left: 5px;
      }
      img {
        position: absolute;
        right: 20px;
        top: -17px;
        height: 30px;
      }
    }
  }
}

.adjustSellBtn {
  margin-top: 35px !important;
}

.disabled {
  margin-top: 40px !important;
  color: rgba(0, 0, 0, 0.6) !important;
  background: linear-gradient(#d4d4d4,#b1b1b1) !important;
  cursor: default !important;
  &:hover {
    background: linear-gradient(#d4d4d4,#b1b1b1) !important;
  }
}

.offerReceived {
  margin-top: 40px !important;
  color: rgba(0, 0, 0, 0.6) !important;
  background: linear-gradient(#4fe05c,#0a9534) !important;
  cursor: default !important;
  &:hover {
    background: linear-gradient(#4fe05c,#0a9534) !important;
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