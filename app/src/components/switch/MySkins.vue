<template>
  <div>
    <div id="Inputs">
      <input placeholder="Trade URL" type="text">
      <a href="https://steamcommunity.com/my/tradeoffers/privacy#trade_offer_access_url"
      target="_blank">
        <img src="@/assets/icons/info.svg" alt="">
      </a>
    </div>

    <ul>
      <li v-for="(skin, i) in mySkins" :key="i">
        <img src="@/assets/skins/rareitem.png" alt="">
        <p>{{ skin.gunType }} | <span>{{ skin.skinName }}</span></p>
        <p class="gunCondition">{{ skin.condition }}</p>
        <button 
        class="requestTrade"
        :class="{tradeRequsted: skin.tradeRequested}">
          {{ skin.tradeRequested ? 'Trade requested' : 'Trade to account' }}
        </button>
      </li>
    </ul>

    <div id="tradeDurationInfo">
      <p>It can take up to <span>one week</span> until your Steam account receives the trade invite!</p>
    </div>

  </div>
</template>

<script>
export default {
  name: "MySkins",
  data() {
    return {
      mySkins: [
        {
          gunType: 'AK47',
          skinName: 'Redline',
          condition: 'Factory New',
          requestedTrade: false
        },
        {
          gunType: 'AWP',
          skinName: 'Redline',
          condition: 'Minimal Wear',
          tradeRequested: true
        },
         {
          gunType: 'AK47',
          skinName: 'Redline',
          condition: 'Factory New',
          requestedTrade: false
        },
        {
          gunType: 'AWP',
          skinName: 'Redline',
          condition: 'Minimal Wear',
          tradeRequested: true
        },
         {
          gunType: 'AK47',
          skinName: 'Redline',
          condition: 'Factory New',
          requestedTrade: false
        },
        {
          gunType: 'AWP',
          skinName: 'Redline',
          condition: 'Minimal Wear',
          tradeRequested: true
        },
         {
          gunType: 'AK47',
          skinName: 'Redline',
          condition: 'Factory New',
          requestedTrade: false
        },
        {
          gunType: 'AWP',
          skinName: 'Redline',
          condition: 'Minimal Wear',
          tradeRequested: true
        },
         {
          gunType: 'AK47',
          skinName: 'Redline',
          condition: 'Factory New',
          requestedTrade: false
        },
        {
          gunType: 'AWP',
          skinName: 'Redline',
          condition: 'Minimal Wear',
          tradeRequested: true
        }
      ],
      gunCDNimgLink: 'https://steamcdn-a.akamaihd.net/apps/730/icons/econ/default_generated/weapon_',
      CDNgunIDs: []
    }
  },
  methods: {
  },
  mounted() {
    this.CDNgunIDs = require(`@/assets/gunData/cdn_gun_ids.json`)
    
    // this.CDNgunIDs = this.CDNgunIDs.map(gun => {
    //   return {

    //   }
    // })
  }
}
</script>

<style lang="scss" scoped>

@import '@/assets/mixins/centerX';
@import '@/assets/mixins/centerY';
@import '@/assets/mixins/centerXY';
@import '@/assets/mixins/unselectable';

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

.tradeRequsted {
  color: rgb(53, 53, 53) !important;
  background: linear-gradient(rgb(129, 129, 129), rgb(56, 56, 56)) !important;
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
  width: calc(90% - 50px);
  height: 80%;
  overflow-y: auto;
  li {
    float: left;
    margin: 15px;
    height: 270px;
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
      color: red;
      padding: 3px !important; 
    }

    .requestTrade {
      font-weight: bold;
      margin-top: 30px;
      width: 90%;
      padding: 5px 0 5px 0;
      border: none;
      border-radius: 5px;
      color: whitesmoke;
      background: linear-gradient(rgb(24, 97, 194), rgb(5, 63, 199));
      box-shadow: 2px 2px 6px 1px rgba(0, 0, 0, 0.2);
      cursor: pointer;
      &:hover {
        transition: .15s ease;
        background: -webkit-linear-gradient(#337bce,#0b5aa8 60%,#65a9ee);
      }
    }
  }
}

</style>