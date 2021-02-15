<template>
  <div id="giveawaysMain">

    <div id="close">
      <span class="material-icons-round">
        highlight_off
      </span>
    </div>

    <span id="timeLeft">Time left: <span>{{ clock }}</span></span>

    <div id="skinShowcase">
      <img src="https://steamcdn-a.akamaihd.net/apps/730/icons/econ/default_generated/weapon_ak47_cu_ak47_cobra_light_large.7494bfdf4855fd4e6a2dbd983ed0a243c80ef830.png">
      <p>AK-47 | <span>Redline</span></p>
      <button>Copy My Referral</button>
      <div id="myRP">
        <p>
          My RP: <span id="myRP">{{ myRP }}</span>
          <span id="myChances"><span>Chance: </span>{{ chanceToWin }}</span>
        </p>
      </div>
    </div>

  </div>
</template>

<script>
export default {
  name: "Giveaways",
  data() {
    return {
      myRP: 0,
      clock: '24:00:00',
      chanceToWin: '3%'
    }
  },
  mounted() {
    // Countdown
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
      
      this.clock = result + 's'
    }, 1000)
  },
  methods: {
    
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/mixins/centerX';
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
  height: 70vh;
  width: 100vw;
}

#timeLeft {
  @include centerX;
  bottom: 20px;
  font-size: 20px;
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

#skinShowcase {
  @include centerXY;
  animation: float 2s infinite;
  img {
    height: 220px;
    padding: 0 60px 0 60px;
    border-radius: 20px;
    border: 3px solid rgb(226, 0, 207);
    background-color: rgb(110, 54, 110);
    box-shadow: 0 0 3px 7px rgba(0,0,0,0.4);
    background: linear-gradient(124deg, #ff2400, #e81d1d, #af1de8, #751de8, #2b1de8, #e81d7c, #2b1de8, #dd00f3, #dd00f3);
    background-size: 1800% 1800%;
    animation: rainbow 18s ease infinite;
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
  }
  #myRP {
    position: relative;
    margin-top: 20px;
    height: 45px;
    width: 100%;
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
}

#close {
  position: absolute;
  top: 40px; right: 40px;
  background-color: white;
  span {
    color: red;
    transform: scale(2.5);
    cursor: pointer;
    &:hover {
      transition: .15s ease-in-out;
      transform: scale(2.6);
    }
  }
}

</style>