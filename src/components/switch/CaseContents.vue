<template>
  <div>
    <ul v-if="wpnPrices">
      <li v-for="(gun, i) in guns.formatted" :key="i"
      :class="`${guns.grade[i]}-animated`">

        <!-- Skin Image -->
        <img :src="getWpnImg(guns.raw[i])">

        <!-- Skin Name -->
        <p class="skinTitle">
          {{ gun }}
        </p>

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
  data() {
    return {
      selectedCase: null,
      wpnLinks: {},
      wpnCDNlink: "https://steamcdn-a.akamaihd.net/apps/730/icons/econ/default_generated/weapon_",
      guns: {}, // raw, formatted, grade
      wpnPrices: [],
      inspectGunLinks: {}
    }
  },
  async mounted() {
    this.selectedCase = this.$store.getters.getSelectedCase
    this.wpnLinks = require(`@/assets/gunData/cdn_gun_ids.json`)
    this.guns = require(`@/assets/gunData/caseGuns/${this.selectedCase}.json`)
    this.inspectGunLinks = require(`@/assets/gunData/inspect_guns.json`)
  },
  methods: {
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

@keyframes rainbow3 {
  0% {background-position: 0% 82% }
  50% {background-position: 100% 19% }
  100% {background-position: 0% 82% }
}

.blue-animated {
  background: linear-gradient(124deg, #00ccff, #1d86e8, #1d64e8, #1d4ce8, #2b1de8, #1d86e8, #2b1de8, #1000f3, #0086f3);
}

.purple-animated {
  background: linear-gradient(124deg, #8400ff, #751de8, #af1de8, #751de8, #2b1de8, #491de8, #751de8, #dd00f3, #dd00f3);
}

.pink-animated {
  background: linear-gradient(124deg, #ff00f2, #e81d72, #d01de8, #af1de8, #2b1de8, #e81d7c, #b91de8, #ba00f3, #dd00f3);
}

.gold-animated {
  background: linear-gradient(124deg, #fbff00, #e8c31d, #e6be0c, #e8781d, #e89a1d, #e8d41d, #d4e81d, #f3db00, #f3cf00);
}

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
    height: 250px;
    width: 250px;
    border: 2px solid white;
    border-radius: 10px;
    background-size: 1800% 1800% !important;
    animation: rainbow3 5s infinite !important;
    img {
      margin-top: 20px;
      height: 120px;
      box-shadow: 0 0 4px 6px rgba(0, 0, 0, 0.1);
      background-color: rgba(255, 255, 255, 0.1);
      border-radius: 15px;
      padding: 10px;
      border: 2px solid rgba(255, 255, 255, 0.6);
    }
    .skinTitle {
      margin-top: 5px;
      padding: 7px 0 7px 0;
      font-weight: bold;
      background-color: rgba(0, 0, 0, 0.45);
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

    .inspect {
      margin-top: 5px;
      width: 90%;
      padding: 5px 0 5px 0;
      border: 1px solid rgb(56, 56, 56);
      border-radius: 5px;
      color: whitesmoke;
      font-weight: bold;
      background: -webkit-linear-gradient(#3fd364,#0aac4e) !important;
      box-shadow: 2px 2px 6px 1px rgba(0, 0, 0, 0.2);
      cursor: pointer;
      &:hover {
        transition: .1s ease;
        transform: scale(1.01);
        background: -webkit-linear-gradient(rgb(35, 187, 21),#09b651) !important;
      }
    }
  }
}

</style>