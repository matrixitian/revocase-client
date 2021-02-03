<template>
  <div>
    <ul v-if="wpnPrices">
      <li v-for="(gun, i) in guns.formatted" :key="i">

        <!-- Skin Image -->
        <img :src="getWpnImg(guns.raw[i])" alt="">
        <!-- Skin Name -->
        <p class="skinTitle" :class="guns.grade[i]">
          {{ gun }}
        </p>
        <!-- Lowest Price -->
        <p class="price">
          Lowest price (FN): 
          <span>{{ '$0.00' }}</span>
        </p>

        <!-- Go to Market -->
        <button class="inspect goToMarket" @click="inspectGun(gun)">
          Go to Market
        </button>
        <!-- Inspect Gun -->
        <button class="inspect" @click="inspectGun(guns.raw[i])">
          Inspect in-game (FN)
        </button>

      </li>
    </ul>
  </div>
</template>

<script>
// import axios from 'axios'

export default {
  name: 'CaseContents',
  props: ['Case'],
  data() {
    return {
      wpnLinks: {},
      wpnCDNlink: "https://steamcdn-a.akamaihd.net/apps/730/icons/econ/default_generated/",
      guns: {}, // raw, formatted, grade
      wpnPrices: [],
      inspectGunLinks: {}
    }
  },
  async mounted() {
    this.wpnLinks = require(`@/assets/gunData/cdn_gun_ids.json`)
    this.inspectGunLinks = require(`@/assets/gunData/inspect_guns.json`)
    this.importGunData()

    // let formattedGuns = this.guns.formatted.map((gun) => {
    //   return `${gun} (Factory New)`
    // })

    // formattedGuns.shift()

    // const res = await axios.post('http://localhost:3000/get-wpn-prices',
    // { wpns: formattedGuns })
  
    // this.wpnPrices = res.data.prices
  },
  methods: {
    getWpnImg(wpnLonghand) {
      const wpnID = this.wpnLinks[wpnLonghand]

      if (wpnLonghand === 'rare_item') {
        return require('@/assets/cases/rare_item.png')
      } else {
        return `${this.wpnCDNlink}${wpnID}.png`
      }
    },
    inspectGun(gun) {
      console.log(gun)
      const gun_id = this.inspectGunLinks[gun]
      const link = `steam://rungame/730/76561202255233023/+csgo_econ_action_preview%${gun_id}`

      window.open(link)
    },
    importGunData() {
      switch (this.Case) {
        case 'clutch':
            this.guns = require(`@/assets/gunData/${this.Case}.json`)
          break;
        case 'chroma2':
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
@import '@/assets/mixins/skinGrades';

div {
  height: 70vh;
  width: 100vw;
}

ul {
  @include centerXY;
  width: 90%;
  height: 90%;
  overflow-y: auto;
  li {
    float: left;
    margin: 15px;
    height: 280px;
    width: 250px;
    border: 2px solid rgba(255, 255, 255, 0.2);
    border-radius: 10px;
    img {
      margin-top: 20px;
      height: 120px;
    }
    .skinTitle {
      padding: 3px 0 3px 0;
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
      background: -webkit-linear-gradient(#3fd364,#0aac4e) !important;
       &:hover {
        background: -webkit-linear-gradient(rgb(35, 187, 21),#09b651) !important;
      }
    }

    .inspect {
      margin-top: 5px;
      width: 90%;
      padding: 5px 0 5px 0;
      border: none;
      border-radius: 5px;
      color: whitesmoke;
      background: -webkit-linear-gradient(#4793e9,#0b71d8);
      box-shadow: 2px 2px 6px 1px rgba(0, 0, 0, 0.2);
      cursor: pointer;
      &:hover {
        transition: .15s ease;
        transform: scale(1.01);
        background: -webkit-linear-gradient(#337bce,#0b5aa8);
      }
    }
  }
}

</style>