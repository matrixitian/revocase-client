<template>
  <div>
    <ul>
      <li v-for="(gun, i) in guns" :key="i">

        <!-- Skin Image -->
        <img :src="require(`@/assets/skins/${guns[i]}.png`)" alt="">
        <!-- Skin Name -->
        <p class="skinTitle">{{ gun }}</p>
        <!-- Lowest Price -->
        <p class="price">
          Lowest price (FN): 
          <span>$2.67</span>
        </p>

        <!-- Go to Market -->
        <button class="inspect goToMarket" @click="inspectGun(gun)">
          Go to Market
        </button>
        <!-- Inspect Gun -->
        <button class="inspect" @click="inspectGun(gun)">
          Inspect in-game (FN)
        </button>

      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'CaseContents',
  props: ['Case'],
  data() {
    return {
      guns: [] // arr of gun names
    }
  },
  async mounted() {
    console.log(this.Case)

    this.importGunData()

    // const data = await axios.get(
    //   'http://steamcommunity.com/market/priceoverview/?currency=3&appid=730&market_hash_name=StatTrak%E2%84%A2%20P250%20%7C%20Steel%20Disruption%20%28Factory%20New%29'
    // )

    //  console.log(data)
  },
  methods: {
    inspectGun(gun) {
      console.log(gun)
      const gun_id = "20M3462576415354083999A13819871659D16352124405222944812"
      const link = `steam://rungame/730/76561202255233023/+csgo_econ_action_preview%${gun_id}`

      window.open(link)
    },
    importGunData() {
      switch (this.Case) {
        case 'clutch':
            this.guns = require(`@/assets/gunData/${this.Case}.json`)
          break;
      
        default:
          break;
      }
    }
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

ul {
  @include centerXY;
  // border: 1px solid white;
  width: 90%;
  height: 90%;
  overflow-y: auto;
  li {
    float: left;
    margin: 15px;
    height: 280px;
    width: 250px;
    border: 2px solid rgba(255, 255, 255, 0.2);
    background-color: rgba(255, 255, 255, 0.05);
    border-radius: 10px;
    img {
      margin-top: 20px;
      height: 120px;
    }
    p {
      font-weight: bold;
    }
    .price {
      margin-top: 5px;
      font-weight: normal;
      background-color: rgba(0, 0, 0, 0.45);
      padding: 4px;
      span {
        font-weight: bold;
        color: rgb(43, 142, 255);
      }
    }

    .goToMarket {
      margin-top: 15px !important;
       &:hover {
        background: -webkit-linear-gradient(#d67322,#976404 60%,#ffb663) !important;
      }
    }

    .inspect {
      margin-top: 5px;
      width: 90%;
      padding: 5px 0 5px 0;
      border: none;
      border-radius: 5px;
      color: whitesmoke;
      background: -webkit-linear-gradient(#484e55,#3a3f44 60%,#313539);
      box-shadow: 2px 2px 6px 1px rgba(0, 0, 0, 0.2);
      cursor: pointer;
      &:hover {
        transition: .15s ease;
        transform: scale(1.01);
        background: -webkit-linear-gradient(#337bce,#0b5aa8 60%,#65a9ee);
      }
    }
  }
}

</style>