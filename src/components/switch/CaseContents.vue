<template>
  <div>
    <ul v-if="wpnPrices">
      <li v-for="(gun, i) in guns.formatted" :key="i"
      :class="{fullRare: guns.grade[i] === 'exceedingly_rare'}">

        <!-- Skin Image -->
        <img :src="getWpnImg(guns.raw[i])" alt="">
        <!-- Skin Name -->
        <p class="skinTitle" :class="guns.grade[i]">
          {{ gun }}
        </p>
        <!-- Lowest Price
        <p class="price" v-if="guns.grade[i] !== 'exceedingly_rare'">
          Lowest price (FN): 
          <span>{{ '$0.00' }}</span>
        </p> -->

        <!-- Go to Market -->
        <button class="inspect goToMarket" @click="openMarketLink(i)"
        v-if="guns.grade[i] !== 'exceedingly_rare'">
          Go to Market
        </button>
        <!-- Inspect Gun -->
        <button class="inspect" @click="inspectGun(guns.raw[i])"
        v-if="guns.grade[i] !== 'exceedingly_rare'">
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
  data() {
    return {
      selectedCase: null,
      goToMarket: {},
      wpnLinks: {},
      wpnCDNlink: "https://steamcdn-a.akamaihd.net/apps/730/icons/econ/default_generated/weapon_",
      guns: {}, // raw, formatted, grade
      wpnPrices: [],
      inspectGunLinks: {},
      linkCategory: {
        fire: 0,
        lambda: 0,
        oldschool: 0,
        goldenLambda: 0,
        nuclear: 0
      }
    }
  },
  async mounted() {
    this.selectedCase = this.$store.getters.getSelectedCase
    this.wpnLinks = require(`@/assets/gunData/cdn_gun_ids.json`)
    this.guns = require(`@/assets/gunData/caseGuns/${this.selectedCase}.json`)
    this.inspectGunLinks = require(`@/assets/gunData/inspect_guns.json`)
    this.goToMarket = require(`@/assets/gunData/go_to_market.json`)
  },
  methods: {
    openMarketLink(i) {
      const selectedCase = this.$store.getters.getSelectedCase
      const categoryNum = this.linkCategory[selectedCase]

      const wpnName = this.goToMarket[selectedCase][i - 1][0]
      const skinName = this.goToMarket[selectedCase][i - 1][1]

      const marketLink = "https://steamcommunity.com/market/search?category_730_Weapon%5B%5D=tag_weapon_"
      const categoryLink = `&category_730_ItemSet%5B0%5D=tag_set_community_${categoryNum}&appid=730&amp;q=`

      const link = marketLink + wpnName + categoryLink + skinName

      window.open(link)
    },
    getWpnImg(wpnLonghand) {
      const wpnID = this.wpnLinks[wpnLonghand]

      return `${this.wpnCDNlink}${wpnID}.png`
    },
    inspectGun(gun) {
      const gun_id = this.inspectGunLinks[gun]
      const link = `steam://rungame/730/76561202255233023/+csgo_econ_action_preview%${gun_id}`

      window.open(link)
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
      margin-top: 12px;
      padding: 7px 0 7px 0;
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

.fullRare {
  border: 2px solid white !important;
  background: linear-gradient(rgb(255, 218, 8), rgb(246, 181, 0)) !important;
  img {
    height: 170px;
  }
  p {
    border-top: 4px dashed rgba(0, 0, 0, 0.2);
    border-bottom: 4px dashed rgba(0, 0, 0, 0.2);
  }
}

</style>