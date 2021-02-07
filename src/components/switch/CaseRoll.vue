<template>
  <div id="caseRollMain">

    <div id="Roller">

      <div id="caret">
        <img id="upperCaret" src="@/assets/icons/caret.svg" alt="">
        <img id="downerCaret" src="@/assets/icons/caret.svg" alt="">
      </div>
      <ul id="skinRoll">
        <transition-group name="slide-fade">
          <li v-for="(skin, i) in drops" :key="i"
          :class="skin.grade">
            <img :src="getWpnImg(skin.longhand)" alt="">
            <p class="skin">
              <span class="skinName">{{ skin.name }}</span>
            </p>
            <p class="condition" :class="skin.condition">
              {{ skin.condition }}
            </p>
          </li>
        </transition-group>
      </ul>

      <button id="open" @click="openCase()"
      :class="{disabled: caseIsRolling}">
        {{ caseIsRolling ? 'Opened' : 'Open' }}
      </button>
    </div>

  </div>
</template>

<script>
import getCondition from '@/js/translateGunCondition.js'

export default {
  name: "CaseRoll",
  data() {
    return {
      dropAt: 60,
      wpnCDNlink: "https://steamcdn-a.akamaihd.net/apps/730/icons/econ/default_generated/weapon_",
      wpnLinks: {},
      selectedCase: null,
      skins: [],
      drops: [],
      caseIsRolling: false,
      rollingFinished: true
    }
  },
  methods: {
    openCase() {
      if (this.caseIsRolling) {
        this.$store.commit('setError', {
          errMsg: "Case has already been opened!"
        })
        throw new Error()
      }

      this.caseIsRolling = true

      //  Start
      let count = 60
      let interval = 5

      const showDropSound = require('@/assets/sounds/show_drop.mp3')
      const caseRollSound = require('@/assets/sounds/case_roll.mp3')
      const caseRollAudio = new Audio(caseRollSound)
      const showDropAudio = new Audio(showDropSound)

      caseRollAudio.loop = false
      showDropAudio.loop = false

      const iterator = () => {
        count -= 1
        interval += interval * 0.1
        this.drops.shift()

        caseRollAudio.play()
        if (count === 9) {
          setTimeout(() => {
            showDropAudio.play()
          }, 500)
        }

        // stop after 600ms
        if (interval > 600) {
          count = 0
          this.rollingFinished = true
        }

        if (count > 0) {
          setTimeout(iterator, interval)
        }
      }

      setTimeout(() => {
        iterator()
      }, 500)
    },
    getCondition() {
      let condition = Math.random() * 100
      condition = Math.round(condition * 100) / 100

      if (condition < 3) return 'fn'
      else if (condition >= 3 && condition < 27) return 'mw'
      else if (condition >= 27 && condition < 60) return 'ft'
      else if (condition >= 60 && condition < 84) return 'ww'
      else if (condition >= 84) return 'bs'
    },
    formatCondition(condition) {
      return getCondition(condition)
    },
    getWpnImg(wpnLonghand) {
      const wpnID = this.wpnLinks[wpnLonghand]

      if (wpnLonghand === 'rare_item') {
        return require('@/assets/cases/rare_item.png')
      } else {
        return `${this.wpnCDNlink}${wpnID}.png`
      }
    },
    getWeapon(caseName) {
      const wpnCases = {
        dangerZone: {
          mil_spec: [
            'nova_wood_fired',
            'sawed-off_black_sand',
            'sg553_danger_close',
            'mp9_modest_threat',
            'tec-9_fubar',
            'glock-18_oxide_blaze',
            'm4a4_magnesium'
          ],
          restricted: [
            'g3sg1_scavenger',
            'mac-10_pipe_down',
            'galil_ar_signal',
            'p250_nevermore',
            'usp-s_flashback'
          ],
          classified: [
            'mp5-sd_phosphor',
            'ump-45_momentum',
            'desert_eagle_mecha_industries'
          ],
          covert: [
            'awp_neo-noir',
            'ak-47_asiimov'
          ],
          exceedingly_rare: [
            'rare_item'
          ]
        },
        phoenix: {
          mil_spec: [
            'ump-45_corporal',
            'mag-7_heaven_guard',
            'negev_terrain',
            'tec-9_sandstorm'
          ],
          restricted: [
            'famas_sergeant',
            'mac-10_heat',
            'sg_553_pulse',
            'usp-s_guardian',
          ],
          classified: [
            'p90_trigon',
            'nova_antique',
            'ak-47_redline',
          ],
          covert: [
            'aug_chameleon',
            'awp_asiimov'
          ],
          exceedingly_rare: [
            'rare_item'
          ]
        },
        chroma2: {
          mil_spec: [
            "negev_man-o-'war",
            'sawed-off_origami',
            'mp7_armor_core',
            'p250_valence',
            'desert_eagle_bronze_deco',
            'ak-47_elite_build'
          ],
          restricted: [
            'ump-45_grand_prix',
            'cz75-auto_pole_position',
            'mag-7_heat',
            'awp_worm_god',
          ],
          classified: [
            'famas_djinn',
            'five-seven_monkey_business',
            'galil_ar_eco',
          ],
          covert: [
            'mac-10_neon_rider',
            'm4a1-s_hyper_beast'
          ],
          exceedingly_rare: [
            'rare_item'
          ]
        },
        fracture: {
          mil_spec: [
            'negev_ultralight',
            "sg_553_ol'rusty",
            'p2000_gnarled',
            'p90_freight',
            'pp-bizon_runic',
            'p250_cassette',
            'ssg_08_mainframe_001'
          ],
          restricted: [
            'galil_ar_connexion',
            'mp5-sd_kitbash',
            'tec-9_brother',
            'mac-10_allure',
            'mag-7_monster_call'
          ],
          classified: [
            'xm1014_entombed',
            'glock-18_vogue',
            'm4a4_toothfairy',
          ],
          covert: [
            'ak-47_legion_of_anubis',
            'desert_eagle_printstream'
          ],
          exceedingly_rare: [
            'rare_item'
          ]
        },
        clutch: {
          mil_spec: [
            'xm1014_oxide_blaze',
            'pp-bizon_night_riot',
            'p2000_urban_hazard',
            'five-seven_flame_test',
            'sg_553_aloha',
            'r8_revolver_grip',
            'mp9_black_sand'
          ],
          restricted: [
            'negev_lionfish',
            'nova_wild_six',
            'ump-45_artic_wolf',
            'mag-7_swag-7',
            'glock-18_moonrise'
          ],
          classified: [
            'aug_stymphalian',
            'awp_mortis',
            'usp-s_cortex',
          ],
          covert: [
            'mp7_bloodsport',
            'm4a4_neo-noir'
          ],
          exceedingly_rare: [
            'rare_item'
          ]
        }
      }

      const formattedSkinName = {
        dangerZone: {
          mil_spec: [
            'Wood Fired',
            'Black Sand',
            'Danger Close',
            'Modest Threat',
            'Fubar',
            'Oxide Blaze',
            'Magnesium'
          ],
          restricted: [
            'Scavenger',
            'Pipe Down',
            'Signal',
            'Nevermore',
            'Flashback',
          ],
          classified: [
            'Phosphor',
            'Momentum',
            'Mecha Industries'
          ],
          covert: [
            'Neo-Noir',
            'Asiimov'
          ],
          exceedingly_rare: [
            'Rare Item'
          ]
        },
        phoenix: {
          mil_spec: [
            'Corporal',
            'Heaven Guard',
            'Terrain',
            'Sandstorm'
          ],
          restricted: [
            'Sergeant',
            'Heat',
            'Pulse',
            'Guardian',
          ],
          classified: [
            'Guardian',
            'Antique',
            'Redline',
          ],
          covert: [
            'Chameleon',
            'Asiimov'
          ],
          exceedingly_rare: [
            'Rare Item'
          ]
        },
        chroma2: {
          mil_spec: [
            "Man-o'-war",
            'Origami',
            'Armor Core',
            'Valence',
            'Bronze Deco',
            'Elite Build'
          ],
          restricted: [
            'Grand Prix',
            'Pole Position',
            'Heat',
            'Worm God',
          ],
          classified: [
            'Djinn',
            'Monkey Business',
            'Eco',
          ],
          covert: [
            'Neon Rider',
            'Hyper Beast'
          ],
          exceedingly_rare: [
            'Rare Item'
          ]
        },
        fracture: {
          mil_spec: [
            'Ultralight',
            "Ol' Rusty",
            'Gnarled',
            'Freight',
            'Runic',
            'Cassette',
            'Mainframe 001'
          ],
          restricted: [
            'Connexion',
            'Kitbash',
            'Brother',
            'Allure',
            'Monster Call'
          ],
          classified: [
            'Entombed',
            'Vogue',
            'Tooth Fairy',
          ],
          covert: [
            'Legion of Anubis',
            'Printstream'
          ],
          exceedingly_rare: [
            'Rare Item'
          ]
        },
        clutch: {
          mil_spec: [
            'Oxide Blaze',
            'Night Riot',
            'Urban Hazard',
            'Flame Test',
            'Aloha',
            'Grip',
            'Black Sand'
          ],
          restricted: [
            'Lionfish',
            'Wild Six',
            'Arctic Wolf',
            'SWAG-7',
            'Moonrise'
          ],
          classified: [
            'Stymphalian',
            'Mortis',
            'Cortex',
          ],
          covert: [
            'Bloodsport',
            'Neo-Noir'
          ],
          exceedingly_rare: [
            'Rare Item'
          ]
        }
      }

      let grade
      let condition

      // Get Skin Grade
      grade = Math.random() * 100
      grade = Math.round(grade * 100) / 100

      const getGrade = () => {
        if (grade >= 0 && grade < 0.35) return 'exceedingly_rare' 
        else if (grade >= 0.35 && grade < 0.95) return 'covert' 
        else if (grade >= 0.95 && grade < 4.15) return 'classified' 
        else if (grade >= 4.15 && grade < 20.00) return 'restricted'
        else if (grade >= 20.00) return 'mil_spec'
      }

      grade = getGrade()

      // Get Skin condition
      condition = Math.random() * 100
      condition = Math.floor(condition)

      const getCondition = () => {
        if (condition < 3) return 'FN'
        else if (condition >= 3 && condition < 27) return 'MW'
        else if (condition >= 27 && condition < 60) return 'FT'
        else if (condition >= 60 && condition < 84) return 'WW'
        else if (condition >= 84) return 'BS'
      }

      condition = getCondition()

      const arrLen = wpnCases[caseName][grade].length
      const skinIndex = Math.floor(Math.random() * (arrLen - 0) + 0)

      const longhand = wpnCases[caseName][grade][skinIndex]
      const name = formattedSkinName[caseName][grade][skinIndex]

      return { name, longhand, grade, condition }
    },
    generateSkins() {
      let i

      let generated = []
      for(i = 0; i < 70; i++) {
        const skin = this.getWeapon(this.selectedCase)

        generated.push(skin)
      }

      this.drops = generated
    }
  },
  mounted() {
    this.selectedCase = this.$store.getters.getSelectedCase

    this.wpnLinks = require(`@/assets/gunData/cdn_gun_ids.json`)

    this.generateSkins()

    this.drops[54] = this.$store.getters.getCurrentDrop
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/mixins/centerX';
@import '@/assets/mixins/centerXY';
@import '@/assets/mixins/skinGrades';
@import '@/assets/mixins/skinCondition';

#caseRollMain {
  height: 70vh;
  width: 100vw;
  background-color: rgba(0, 0, 0, 0.1);
}

#open {
  margin-top: 425px;
  border: 2px solid white;
  background: linear-gradient(green, limegreen);
  border-radius: 7px;
  padding: 7px 30px 7px 30px;
  color: white;
  font-weight: bold;
  font-size: 17px;
  cursor: pointer;
  &:hover {
    transition: .1s ease;
    transform: scale(1.02);
  }
}

.disabled {
  background: linear-gradient(rgb(128, 15, 0), rgb(204, 56, 43)) !important;
  cursor: default !important;
  &:hover {
    transform: scale(1) !important;
  }
}

#upperCaret {
  @include centerX;
  left: calc(50% - 35px);
  transform: rotate(90deg);
  height: 80px;
  top: 160px;
}
#downerCaret {
  @include centerX;
  left: calc(50% - 35px);
  top: 350px;
  height: 80px;
  transform: rotate(270deg);
}

#Roller {
  position: relative;
  // background-color: green;
  height: 100%;
}

ul#skinRoll {
  @include centerX;
  top: 30%;
  border-radius: 10px;
  padding: 10px;
  border: 3px solid rgba(200, 200, 200, 0.1);
  background-color: rgba(0, 0, 0, 0.3);
  margin: auto;
  height: 145px;
  overflow: hidden;
  width: 1100px;
  li {
    margin: 5px 5px 20px 5px;
    display: inline-block;
    position: relative;
    padding: 5px;
    border-radius: 10px;
    width: 120px;
    height: 120px;
    border: 2px solid white;
    p {
      margin-top: 5px;
    }
    .skin {
      font-size: 14px;
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
      font-size: 12px;
      font-weight: bold;
      border-radius: 20px;
      background-color: rgba(0, 0, 0, 0.7);
      width: 40px;
      margin: auto;
      margin-top: 5px;
      padding: 3px;
    }
    img {
      height: 80px;
      margin-bottom: -15px;
    }
  }
}

</style>