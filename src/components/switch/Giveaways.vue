<template>
  <div id="giveawaysMain">

    <div id="weeklyGiveaway">
      <p id="weekly">WEEKLY</p>

      <div class="skinImg">
        <img
          src="https://steamcdn-a.akamaihd.net/apps/730/icons/econ/default_generated/weapon_ak47_cu_ak47_cobra_light_large.7494bfdf4855fd4e6a2dbd983ed0a243c80ef830.png">
        <p class="lastWinner weeklyLastWinner">Last winner <span>{{ lastWeeklyWinner }}</span></p>
      </div>
      
      <p id="skinName">AK-47 | <span>Redline</span></p>
      <button class="buyTicket" @click="buyTicket">
        Buy Ticket <span>30</span><img src="@/assets/icons/bullet.png">
      </button>
      <div id="myRP">
        <p>
          My Tickets: <span id="myRP">{{ myTickets }}</span>
          <span id="myChances"><span>Chance: </span>{{ weeklyChance }} %</span>
        </p>
      </div>
      <div id="playersEntered">
        <span id="userCountIcon" class="material-icons">
          record_voice_over
        </span>
        <span id="userCount">Entered: {{ enteredWeeklyGiveaway }}</span>
      </div>

      <span id="timeLeft">Time left: <span>{{ weeklyCountdown }}</span></span>
    </div>

    <div id="dailyGiveaway">
      <p id="daily">DAILY</p>
      
      <div class="skinImg">
        <img
          src="https://steamcdn-a.akamaihd.net/apps/730/icons/econ/default_generated/weapon_deagle_gs_deagle_mecha_light_large.e08c1fd8709f6b368956c41c68b17c15ff635635.png">
        <p class="lastWinner">Last winner <span>{{ lastDailyWinner }}</span></p>
      </div>

      <p id="skinName">Desert Eagle | <span>Mecha Industries</span></p>
     
      <button @click="copyReferralCode">Copy My Referral</button>

      <div id="myRP">
        <p>
          My RP: <span id="myRP">{{ myRP }}</span>
          <span id="myChances"><span>Chance: </span>{{ dailyChance }} %</span>
        </p>
      </div>

      <div id="playersEntered">
        <span id="userCountIcon" class="material-icons">
          record_voice_over
        </span>
        <span id="userCount">Entered: {{ enteredDailyGiveaway }}</span>
      </div>

      <span id="timeLeft">Time left: <span>{{ dailyCountdown }}</span></span>
    </div>

  </div>
</template>

<script>
import axios from 'axios'
import config from '@/assets/config/config'

export default {
  name: "Giveaways",
  data() {
    return {
      myRP: 0,
      myTickets: 0,
      dailyCountdown: '24h:00m:00s',
      weeklyCountdown: '7d 24h:00m:00s',
      enteredDailyGiveaway: 0,
      enteredWeeklyGiveaway: 0,
      dailyChance: 0,
      weeklyChance: 0,
      lastDailyWinner: '-',
      lastWeeklyWinner: '-'
    }
  },
  mounted() {
    this.getData()

    // Daily countdown
    setInterval(() => {
      let toDate = new Date()
      let tomorrow = new Date()
      tomorrow.setHours(24, 0, 0, 0)
      let diffMS = tomorrow.getTime() / 1000 - toDate.getTime() / 1000
      let diffHr = Math.floor(diffMS / 3600)
      diffMS = diffMS - diffHr * 3600
      let diffMi = Math.floor(diffMS / 60)
      diffMS = diffMS - diffMi * 60
      let diffS = Math.floor(diffMS)
      let result = ((diffHr < 10) ? "0" + diffHr : diffHr)
      result += "h : " + ((diffMi < 10) ? "0" + diffMi : diffMi)
      result += "m : " + ((diffS < 10) ? "0" + diffS : diffS)
      
      this.dailyCountdown = result + 's'
    }, 1000)
  
    // Weekly countdown
    function updateWeeklyCountdown(){
      var today = new Date()

      // Get number of days to Friday
      var dayNum = today.getDay()
      var daysToSunday = 6 - (dayNum < 6 ? dayNum : dayNum - 8)
      
      // Get milliseconds to noon friday
      var sundayMidnight = new Date(+today)
      sundayMidnight.setDate(sundayMidnight.getDate() + daysToSunday)
      sundayMidnight.setHours(24,0,0,0)
      // Round up ms remaining so seconds remaining matches dailyCountdown
      var ms = Math.ceil((sundayMidnight - today) / 1000) * 1000
      var d =  ms / 8.64e7 | 0
      var h = (ms % 8.64e7) / 3.6e6 | 0
      var m = (ms % 3.6e6)  / 6e4 | 0
      var s = (ms % 6e4)    / 1e3 | 0
      
      // Return remaining 
      return d + 'd ' + h + 'h ' + m + 'm ' + s + 's'
    }

    // Run update just after next full second
    const runWeeklyCountdownUpdate = () => {
      this.weeklyCountdown = updateWeeklyCountdown()
      setTimeout(runWeeklyCountdownUpdate, 1020 - (Date.now() % 1000))
    }

    runWeeklyCountdownUpdate()
  },
  methods: {
    async copyReferralCode() {
      const user = this.$store.getters.getUser

      const myReferralCode = `https://revo-cases.com/?referral=${user.username}`

      await navigator.clipboard.writeText(myReferralCode);
    },
    calcWeeklyChance() {
      const chance = (this.myTickets / this.enteredWeeklyGiveaway) * 100
      this.weeklyChance = Math.round((chance + Number.EPSILON) * 100) / 100

      const notValid = isNaN(this.weeklyChance)

      if (notValid) {
        this.weeklyChance = 0
      }
    },
    async getData() {
      const res = await axios.get(`${config.server}/get-giveaway-data`)
    
      const data = res.data

      if (data.giveaway.lastDailyWinner) {
        this.lastDailyWinner = data.lgiveaway.lastDailyWinner
      }
      if (data.giveaway.lastWeeklyWinner) {
        this.lastWeeklyWinner = data.giveaway.lastWeeklyWinner
      }

      this.myRP = data.rp
      this.myTickets = data.tickets

      this.enteredDailyGiveaway = data.giveaway.dailyUserPool.length
      this.enteredWeeklyGiveaway = data.giveaway.weeklyUserPool.length

      this.lastDailyWinner = data.giveaway.currentDailyWinner
      this.lastWeeklyWinner = data.giveaway.currentWeeklyWinner

      this.dailyChance = (this.myRP / this.enteredDailyGiveaway) * 100
      this.calcWeeklyChance()
    },
    async buyTicket() {
      const ticketPrice = 30
      const myCoins = this.$store.getters.getCoins

      if (myCoins < ticketPrice) {
        return this.$store.commit('setError', { errMsg: "You don't have enough Bullets!" })
      }

      const res = await axios.post(`${config.server}/buy-ticket`)

      if (res.status === 200) {
        this.myTickets += 1
        this.enteredWeeklyGiveaway += 1

        const chance = (this.myRP / this.enteredDailyGiveaway) * 100
        this.dailyChance = Math.round((chance + Number.EPSILON) * 100) / 100

        this.calcWeeklyChance()
      } else {
        this.$store.commit('setError', { errMsg: 'Failed to buy ticket, refresh page and try again.' })
      }

      this.$store.commit('updateMyCoins', { type: 'subtract', amount: ticketPrice })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/mixins/centerX';
@import '@/assets/mixins/centerY';
@import '@/assets/mixins/centerXY';

@keyframes float {
	0% {
		margin-top: -10px;}
	50% {
		margin-top: -20px;;
	}
	100% {
		margin-top: -10px;;
	}
}

@keyframes rainbow {
  0%{background-position:0% 82%}
  50%{background-position:100% 19%}
  100%{background-position:0% 82%}
}

#giveawaysMain {
  float: right;
  height: 70vh;
  width: 100vw;
}

.lastWinner {
  position: absolute;
  bottom: 10px;
  left: 20px;
  font-size: 16px !important;
  font-weight: bold;
  min-width: 80px;
  span {
    margin-left: 5px;
    background-color: rgba(0,0,0,0.3);
    padding: 4px 20px 4px 20px;
    border-radius: 15px;
  }
}

#dailyGiveaway, #weeklyGiveaway {
  @include centerY;
  right: 5vw;
  width: 45vw;
  animation: float 2s infinite;
  .skinImg {
    position: relative;
    margin: auto;
    max-width: 300px;
    padding: 0 60px 0 60px;
    border-radius: 20px;
    border: 3px solid rgb(226, 0, 207);
    border: 3px solid transparent;
    background-color: rgb(110, 54, 110);
    box-shadow: 0 0 3px 7px rgba(0,0,0,0.4);
    background: linear-gradient(124deg, #ff2400, #e81d1d, #af1de8, #751de8, #2b1de8, #e81d7c, #2b1de8, #dd00f3, #dd00f3);
    background-size: 1800% 1800%;
    animation: rainbow 18s ease infinite;
    img {
      height: 220px;
    }
  }
  p {
    margin-top: 10px;
    font-weight: bold;
    font-size: 25px;
    span {
      color: rgb(226, 0, 207);
    }
  }
  button {
    position: relative;
    margin-top: 10px;
    border: 2px solid white;
    outline: none;
    padding: 10px 20px 10px 20px;
    background-color: rgb(212, 69, 25);
    border-radius: 10px;
    font-size: 20px;
    font-weight: bold;
    cursor: pointer;
    &:hover {
      transition: .15s ease-in-out;
      transform: scale(1.02);
    }
    img {
      float: right;
      height: 30px;
      width: 30px;
      margin-left: 5px;
      margin-top: -5px;
    }
  }
  #myRP {
    position: relative;
    margin: auto;
    margin-top: 20px;
    height: 45px;
    width: 100%;
    max-width: 600px;
    text-align: center;
    border-radius: 10px;
    background-color: rgba(255, 255, 255, 0.1);
    p {
      @include centerXY;
      top: 12px;
      width: 100%;
      font-size: 21px;
      font-weight: bold;
      color: rgb(5, 255, 109);
      #myRP, #myChances {
        color: rgb(5, 255, 109);
        padding: 5px 25px 5px 25px;
        background-color: rgba(0,0,0,0.4);
        border-radius: 20px;
        margin-left: 10px;
      }
      #myChances {
        color: rgb(255, 5, 122);
        padding: 5px 25px 5px 25px;
        background-color: rgba(0,0,0,0.4);
        border-radius: 20px;
        margin-left: 10px;
        span {
          color: white;
        }
      }
    }
  }
  #timeLeft {
    @include centerX;
    bottom: -40px;
    font-size: 20px;
    width: 300px;
    font-weight: bold;
    background-color: orangered;
    border-radius: 20px;
    padding: 5px 40px 5px 40px;
    color: rgba(0,0,0,0.8);
    span {
      color: white;
      padding: 4px 12px 4px 12px;
      background-color: rgba(0,0,0,0.4);
      border-radius: 10px;
      margin-left: 10px;
    }
  }
}

#weeklyGiveaway {
  left: 5vw !important;
  width: 40vw !important;
}

.buyTicket {
  background: linear-gradient(limegreen, rgb(0, 161, 0)) !important;
  border-radius: 20px !important;
  span {
    color: white;
    background-color: rgba(0,0,0,0.3);
    padding: 3px;
    border-radius: 5px;
  }
}

#daily {
  margin-bottom: 20px;
  color: rgb(180, 50, 255);
}

#weekly {
  margin-bottom: 20px;
  color: rgb(255, 38, 0);
}

#playersEntered {
  width: 120px;
  margin: auto;
  margin-top: 15px;
  #userCountIcon {
    float: left;
  }
  #userCount {
    float: right;
    font-weight: bold;
  }
}

</style>