<template>
  <div id="adminPanelMain">
    <div id="Todo">
      <ul id="tradeRequests">
        <li v-for="(req, i) in tradeRequests" :key="i"
        :class="{ completeLightGreen: req.complete }">
          
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
            <p @click="complete(i)"
            :class="{ complete: req.complete }">
              {{ req.complete? 'Offer Sent!' : 'Complete' }}
            </p>
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
      this.loading = true

      const res = await axios.get(`${config.server}/view-trade-requests`)
      
      if (res.status === 200) {
        this.tradeRequests = res.data.tradeRequests

        console.log(this.tradeRequests)
      } else {
        this.$store.commit('setError', { errMsg: 'Greška u učitavanju skinova. Refreshaj i pokušaj ponovno.' })
      }
    },
    sendTradeOffer(i) {
      window.open(this.tradeRequests[i].tradeURL)
    },
    async complete(i) {
      const res = await axios.post(`${config.server}/finish-trade-offer`, {
        skinID: this.tradeRequests[i].skinID
      })

      if (res.status === 200) {
        this.tradeRequests[i].complete = true
      } else {
        this.$store.commit('setError', { errMsg: 'Greška. Refreshaj i pokušaj ponovno.' })
      }
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
@import '@/assets/mixins/vueSlideFade';

.bs {
  background-color: rgb(250, 0, 0);
}
.ww {
  background-color: rgb(255, 145, 0);
}
.ft{
  background-color: rgb(255, 251, 0);
}
.mw {
  background-color: rgb(164, 255, 90);
}
.fn {
  background-color: rgb(0, 255, 76);
}

$timeAgoWidth: 130px;
$userWidth: 110px;
$skinWidth: 250px;
$conditionWidth: 50px;
$requestTradeWidth: 150px;
$completeWidth: 150px;

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
        border: 3px solid rgba(0,0,0,0.5);
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
            border-radius: 15px;
            border: 2px solid rgba(255,255,255,0.3);
            background-color: rgba(0,0,0,0.3);
          }
        }
        #user {
          width: $userWidth;
          p {
            color: black;
            font-weight: bold;
            background-color: whitesmoke;
          }
        }
        #skin {
          width: $skinWidth;
        }
        #condition {
          width: $conditionWidth;
          p {
            color: black;
            font-weight: bold;
          }
        }
        #requestTrade {
          margin-left: 10px;
          width: $requestTradeWidth;
          background-color: rgba(255,255,255,0.1);
          box-shadow: -10px 0px 10px 1px rgba(0,0,0,0.2);
          p {
            width: 80% !important;
            border-radius: 5px !important;
            border: 1px solid whitesmoke;
            background: linear-gradient(rgb(80, 147, 255), rgb(0, 93, 214));
            cursor: pointer;
            &:hover {
              transition: .15s ease;
              background: linear-gradient(rgb(45, 125, 255), rgb(0, 77, 179));         
            }
          }
        }
        #complete {
          width: $completeWidth;
          border-top-right-radius: 10px;
          border-bottom-right-radius: 10px;
          background-color: rgba(255,255,255,0.1);
          p {
            width: 80% !important;
            border-radius: 5px !important;
            border: 1px solid whitesmoke;
            background: linear-gradient(rgb(228, 57, 34), rgb(144, 14, 10));
            cursor: pointer;
            &:hover {
              transition: .15s ease;
              
            }
          }
        }
      }
    }
  }
}

.completeLightGreen {
  background-color: rgba(0, 200, 0, 0.2) !important;
}

.complete {
  background: linear-gradient(rgb(80, 228, 92), rgb(10, 148, 22)) !important;
  cursor: default !important;
  &:hover {
    transform: none;
  }
}

</style>