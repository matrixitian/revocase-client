<template>
  <div id="adminPanelMain">
    <div id="Todo">
      <ul id="tradeRequests">
        <li v-for="(req, i) in tradeRequests" :key="i">
          
          <div id="timeAgo">
            <p>{{ req.tradeRequestedAt }}</p>
          </div>

          <div id="user">
            <p>{{ req.username }}</p>
          </div>

          <div id="skin">
            <p :class="req.grade">{{ req.skinName }}</p>
          </div>

          <div id="condition">
            <p :class="req.condition">{{ req.condition.toUpperCase() }}</p>
          </div>

          <div id="requestTrade">
            <p @click="sendTradeOffer(i)">Send Offer</p>
          </div>

          <div id="complete">
            <p @click="sendTradeOffer(i)">Complete</p>
          </div>

        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import config from '@/assets/config/config'
import axios from 'axios'

export default {
  name: "AdminPanel",
  data() {
    return {
      tradeRequests: [],
      done: []
    }
  },
  methods: {
    async viewTradeRequests() {
      const res = await axios.get(`${config.server}/view-trade-requests`)

      this.tradeRequests = res.data.tradeRequests
      console.log(res.data)
    },
    sendTradeOffer(i) {
      console.log(i)
    }
  },
  mounted() {
    this.viewTradeRequests()
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/mixins/centerXY';
@import '@/assets/mixins/skinGrades';
@import '@/assets/mixins/skinCondition';
@import '@/assets/mixins/vueSlideFade';

$timeAgoWidth: 130px;
$userWidth: 110px;
$skinWidth: 250px;
$conditionWidth: 50px;
$requestTradeWidth: 120px;
$completeWidth: 120px;

#adminPanelMain {
  z-index: 10000;
  position: absolute;
  background-color: #1b2435;
  height: 100vh;
  width: 100vw;
  #Todo {
    @include centerXY;
    height: 80vh;
    width: 50px + $timeAgoWidth + $userWidth + $skinWidth + $conditionWidth + $requestTradeWidth + $completeWidth;
    float: right;
    #tradeRequests {
      overflow-y: auto;
      overflow-x: none;
      height: 100%;
      width: 100%;
      li {
        position: relative;
        height: 50px;
        background-color: rgba(255, 255, 255, 0.1);
        border: 3px solid white;
        border-radius: 20px;
        margin-right: 15px;
        margin-top: 10px;
        div {
          position: relative;
          height: 100%;
          float: left;
          p {
            @include centerXY;
            color: white;
            width: 90%;
            padding: 3px;
            border-radius: 10px;
          }
        }
        #timeAgo {
          width: $timeAgoWidth;
          p {
            padding: 3px;
            width: 80% !important;
            background-color: rgba(0,0,0,0.3);
            border-radius: 15px;
          }
        }
        #user {
          width: $userWidth;
        }
        #skin {
          width: $skinWidth;
        }
        #condition {
          width: $conditionWidth;
        }
        #requestTrade {
          width: $requestTradeWidth;
        }
        #complete {
          width: $completeWidth;
        }
      }
    }
  }
}

</style>