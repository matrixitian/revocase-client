<template>
  <div id="caseRollMain">

    <div id="Roller">

      <!-- Skin Rolling -->
      <ul class="skinRoll" v-if="caseRollType === 'case'">
        <transition-group name="slide-fade">

          <li v-for="(skin, i) in drops" :key="i"
          :class="skin.grade">
          <!-- Skin Img -->
            <img :src="getSkinImg(skin.longhand)" alt="">
            <!-- Skin Name -->
            <p class="skin">
              <span class="skinName">{{ skin.name }}</span>
            </p>
            <!-- Skin Condition -->
            <p class="condition" :class="skin.condition">
              {{ skin.condition }}
            </p>

          </li>

        </transition-group>

        <!-- Carets -->
        <img id="upperCaret" src="@/assets/icons/caret.svg">
        <img id="downerCaret" src="@/assets/icons/caret.svg">

      </ul>

      <ul class="skinRoll" v-else>
        <transition-group name="slide-fade">

          <li v-for="(dropAmount, i) in dailyRewardDrops" :key="i"
          class="dailyContainer"
          :class="getDailyDropColor(dropAmount)">
          <!-- Skin Img -->
            <img class="dailyImg" src="@/assets/icons/bullet.png">
            <!-- Skin Condition -->
            <p class="condition dailyAmount">
              {{ dropAmount }} Bullets!
            </p>

          </li>

        </transition-group>

        <!-- Carets -->
        <img id="upperCaret" src="@/assets/icons/caret.svg">
        <img id="downerCaret" src="@/assets/icons/caret.svg">

      </ul>

      <!-- Open Case Btn -->
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
      caseRollType: null,
      selectedCase: null,
      caseIsRolling: false,
      rollingFinished: true,
      drops: [],
      dropAt: 54,
      skinImgSteamLink: "https://steamcdn-a.akamaihd.net/apps/730/icons/econ/default_generated/weapon_",
      skinImgLinks: {},
      // Daily Reward
      dailyRewardDrops: []
    }
  },
  methods: {
    getDailyDropColor(amount) {
      if (amount === 5) return 'five'
      else if (amount === 10) return 'ten'
      else if (amount === 15) return 'fifteen'
      else if (amount === 20) return 'twenty'
      else if (amount === 50) return 'fifty'
    },
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
        
        if (this.caseRollType === 'case') {
          this.drops.shift()
        } else {
          this.dailyRewardDrops.shift()
        }

        caseRollAudio.play()
        if (count === 9) {
          const amount = Number(this.$store.getters.getDailyRewardDrop)

          this.$store.commit('updateMyCoins', { type: 'add', amount })

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

      if (condition < 2) return 'gold'
      else if (condition >= 2 && condition < 10) return 'pink'
      else if (condition >= 10 && condition < 30) return 'purple'
      else if (condition >= 30) return 'blue'
    },
    formatCondition(condition) {
      return getCondition(condition)
    },
    getSkinImg(wpnLonghand) {
      const wpnID = this.skinImgLinks[wpnLonghand]

      return `${this.skinImgSteamLink}${wpnID}.png`
    },
    getSkin(caseName) {
      const wpnCases = {
        fire: {
          blue: [
            "xm1014_oxide_blaze",
            "mp9_black_sand",
            "r8_revolver_grip"
          ],
          purple: [
            "ak-47_safari_mesh",
            "cz75-auto_pole_position",
            "cz75-auto_imprint",
            "five-seven_flame_test"
          ],
          pink: [
            "ak-47_uncharted",
            "desert_eagle_corinthian",
            "usp-s_lead_conduit"
          ],
          gold: [
            "usp-s_flashback",
            "m4a1-s_nitro"
          ]
        },
        lambda: {
          blue: [
            "nova_wood_fired",
            "p90_freight",
            "negev_ultralight"
          ],
          purple: [
            "awp_safari_mesh",
            "desert_eagle_blue_ply",
            "desert_eagle_bronze_deco",
            "m4a4_magnesium"
          ],
          pink: [
            "desert_eagle_light_rail",
            "awp_paw",
            "usp-s_guardian",
          ],
          gold: [
            "awp_exoskeleton",
            "awp_phobos"
          ]
        },
        oldschool: {
          blue: [
            "tec-9_fubar",
            "p250_cassette",
            "mag-7_heaven_guard"
          ],
          purple: [
            "desert_eagle_the_bronze",
            "mag-7_swag-7",
            "ak-47_safari_mesh",
            "m4a4_magnesium"
          ],
          pink: [
            "famas_valence",
            "ssg_08_parallax",
            "desert_eagle_meteorite",
          ],
          gold: [
            "usp-s_cyrex",
            "ak-47_elite_build"
          ]
        },
        goldenLambda: {
          blue: [
            "mp7_armor_core",
            "sg_553_danger_close",
            "mp9_modest_threat"
          ],
          purple: [
            "mac-10_pipe_down",
            "desert_eagle_oxide_blaze",
            "sg_553_phantom",
            "p250_inferno"
          ],
          pink: [
            "m4a1-s_basilisk",
            "desert_eagle_naga",
            "ak-47_elite_build"
          ],
          gold: [
            "famas_styx",
            "m4a4_evil_daimyo"
          ]
        },
        nuclear: {
          blue: [
            "famas_decommissioned",
            "glock-18_oxide_blaze",
            "sg_553_ol'_rusty"
          ],
          purple: [
            "desert_eagle_directive",
            "p250_nevermore",
            "m4a1-s_flashback",
            "sg_553_darkwing"
          ],
          pink: [
            "awp_atheris",
            "famas_djinn",
            "awp_mortis"
          ],
          gold: [
            "usp-s_mashup",
            "m4a4_cyber_security"
          ]
        }
      }

      const formattedSkinName = {
        fire: {
          blue: [
            "Oxide Blaze",
            "Black Sand",
            "Grip"
          ],
          purple: [
            "Safari Mesh",
            "Pole Position",
            "Imprint",
            "Flame Test"
          ],
          pink: [
            "Uncharted",
            "Corinthian",
            "Lead Conduit"
          ],
          gold: [
            "Flashback",
            "Nitro"
          ]
        },
        lambda: {
          blue: [
            "Wood Fired",
            "Freight",
            "Ultralight"
          ],
          purple: [
            "Safari Mesh",
            "Blue Ply",
            "Bronze Deco",
            "Magnesium"
          ],
          pink: [
            "Light Rail",
            "PAW",
            "Guardian"
          ],
          gold: [
            "Exoskeleton",
            "Phobos"
          ]
        },
        oldschool: {
          blue: [
            "Fubar",
            "Cassette",
            "Heaven Guard"
          ],
          purple: [
            "The Bronze",
            "SWAG-7",
            "Safari Mesh",
            "Magnesium",
          ],
          pink: [
            "Valence",
            "Parallax",
            "Meteorite"
          ],
          gold: [
            "Cyrex",
            "Elite Build"
          ]
        },
        goldenLambda: {
          blue: [
            "Armor Core",
            "Danger Close",
            "Modest Threat"
          ],
          purple: [
            "Pipe Down",
            "Oxide Blaze",
            "Phantom",
            "Inferno"
          ],
          pink: [
            "Basilisk",
            "Naga",
            "Elite Build"
          ],
          gold: [
            "Styx",
            "Evil Daimyo"
          ]
        },
        nuclear: {
          blue: [
            "Decommissioned",
            "Oxide Blaze",
            "Ol' Rusty"
          ],
          purple: [
            "Directive",
            "Nevermore",
            "Flashback",
            "Darkwing"
          ],
          pink: [
            "Atheris",
            "Djinn",
            "Mortis"
          ],
          gold: [
            "Mashup",
            "Cyber Security"
          ]
        }
      }

      let grade
      let condition

      // Get Skin Grade
      grade = Math.random() * 100
      grade = Math.round(grade * 100) / 100

      const getGrade = () => {
        if (grade >= 0 && grade <= 1.5) return 'gold' 
        else if (grade > 1.5 && grade <= 6.0) return 'pink' 
        else if (grade > 6.0 && grade <= 30.00) return 'purple'
        else if (grade > 30.00) return 'blue'
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
        const skin = this.getSkin(this.selectedCase)

        generated.push(skin)
      }

      this.drops = generated
    },
    getDailyRewardDrop() {
      // Drop
      let num = Math.random() * 100
      num = Math.round(num * 100) / 100

      if (num >= 0 && num < 3) return 50 
      else if (num >= 3 && num < 8) return 20 
      else if (num >= 8 && num < 15) return 15 
      else if (num >= 15 && num < 30.00) return 10
      else if (num >= 30.00) return 5
    },
    generateDailyRewardDrops() {
      let i

      let generated = []
      for(i = 0; i < 70; i++) {
        const drop = this.getDailyRewardDrop()

        generated.push(drop)
      }

      this.dailyRewardDrops = generated
    }
  },
  mounted() {
    this.caseRollType = this.$store.getters.getCaseRollType

    this.selectedCase = this.$store.getters.getSelectedCase

    this.skinImgLinks = require(`@/assets/gunData/cdn_gun_ids.json`)

    if (this.caseRollType === 'case') {
      this.generateSkins()
      // Set received drop
      this.drops[this.dropAt] = this.$store.getters.getCurrentDrop
    } else {
      this.generateDailyRewardDrops()
      // Set received drop
      this.dailyRewardDrops[this.dropAt] = this.$store.getters.getDailyRewardDrop
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/mixins/centerX';
@import '@/assets/mixins/skinGrades';
@import '@/assets/mixins/skinCondition';

.five {
  color: rgb(250, 0, 0);
  background: linear-gradient(orangered, rgb(189, 16, 0));
}
.ten {
  color: rgb(255, 145, 0);
  background: linear-gradient(orange, orangered);
}
.fifteen {
  color: rgb(255, 251, 0);
  background: linear-gradient(rgb(229, 255, 0), rgb(199, 202, 0));
}
.twenty {
  color: rgb(164, 255, 90);
  background: linear-gradient(rgb(115, 255, 0), rgb(66, 207, 0));
}
.fifty {
  color: rgb(0, 255, 76);
  background: linear-gradient(rgb(0, 255, 42), rgb(0, 199, 33));
}

.dailyImg {
  height: 60px !important;
  margin-top: 15px;
}

.dailyAmount {
  margin-top: 25px !important;
  font-size: 16px !important;
  font-weight: bold !important;
  width: 80% !important;
}

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
  left: calc(50% - 40px);
  transform: rotate(90deg);
  height: 80px;
  top: -20px;
}

#downerCaret {
  @include centerX;
  left: calc(50% - 40px);
  top: 120px;
  height: 80px;
  transform: rotate(270deg);
}

#Roller {
  position: relative;
  height: 100%;
}

ul.skinRoll {
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