<template>
  <div>
    <div id="Inputs">
      <input placeholder="Trade URL" type="text"
      v-model="tradeURL">
      <a href="https://steamcommunity.com/my/tradeoffers/privacy#trade_offer_access_url"
      target="_blank">
        <img src="@/assets/icons/info.svg" alt="">
      </a>
    </div>

    <ul>
      <li v-for="(skin, i) in mySkins" :key="i"
      :class="skin.grade">
        <img src="@/assets/cases/rare_item.png" alt="">
        <p>{{ skin.skinName }}</p>
        <p class="gunCondition"
        :class="skin.condition">{{ formatCondition(skin.condition) }}</p>
        <button class="sell" v-if="!skin.tradeRequested">
        {{ `Sell skin ${skin.sellingPrice}` }}
        </button>
        <button 
        class="requestTrade"
        :class="{disabled: skin.tradeRequested}">
          {{ skin.tradeRequested ? 'Skin will be sent within 1 day  ' : 'Trade to account' }}
        </button>
      </li>
    </ul>

    <div id="tradeDurationInfo">
      <p>It can take up to <span>24 hours</span> until your Steam account receives the trade offer!</p>
    </div>

  </div>
</template>

<script>
import getCondition from '@/js/translateGunCondition.js'

export default {
  name: "MySkins",
  data() {
    return {
      tradeURL: null,
      mySkins: [
        {
          gunType: 'AK47',
          skinName: 'Redline',
          condition: 'ft',
          requestedTrade: false,
          grade: 'mil_spec',
          sellingPrice: 50,
        },
        {
          gunType: 'AWP',
          skinName: 'Redline',
          condition: 'mw',
          tradeRequested: true,
          grade: 'classified',
          sellingPrice: 30,
        },
         {
          grade: 'restricted',
          gunType: 'AK47',
          skinName: 'Redline',
          condition: 'fn',
          requestedTrade: false,
          sellingPrice: 40
        }
      ],
      gunCDNimgLink: 'https://steamcdn-a.akamaihd.net/apps/730/icons/econ/default_generated/weapon_',
      CDNgunIDs: []
    }
  },
  methods: {
    formatCondition(skinCon) {
      return getCondition(skinCon)
    }
  },
  mounted() {
    // this.CDNgunIDs = require(`@/assets/gunData/cdn_gun_ids.json`)
    
    // this.CDNgunIDs = this.CDNgunIDs.map(gun => {
    //   return {

    //   }
    // })
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/mixins/centerX';
@import '@/assets/mixins/centerXY';
@import '@/assets/mixins/skinGrades';
@import '@/assets/mixins/skinCondition';

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
      margin-top: 10px;
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
      background: linear-gradient(rgb(90, 235, 71), rgb(8, 165, 29)) ;
      &:hover {
        transition: .15s ease;
        background: -webkit-linear-gradient(#29cc31,#08a515 60%,#23c052);
      }
    }
  }
}

.disabled {
  margin-top: 40px !important;
  color: rgba(0, 0, 0, 0.6) !important;
  background: linear-gradient(#d4d4d4,#b1b1b1) !important;
  cursor: default !important;
  &:hover {
    background: linear-gradient(#787d85,#4a4d50) !important;
  }
}

</style>