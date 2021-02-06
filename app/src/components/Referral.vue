<template>
  <div id="referralMain">
    <span class="material-icons" @click="closeReferralMenu">
      close
    </span>
    <p>Enter a referral from someone else to get 200 bullets!</p>
    <input type="text" placeholder="Friend's referral code"
    ref="enterReferral" v-model="referralCode">
    <button id="apply" @click="applyReferral()">
      Save
    </button>
    <button id="dontAskAgain" @click="closeReferralMenuForever">
      Don't ask again
    </button>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'Referral',
  data() {
    return {
      referralCode: null
    }
  },
  methods: {
    test() {
      console.log('ytest')
    },
    async applyReferral() {
      console.log('hello')

      const user = this.$store.getters.getUser
      if (this.referralCode === user.username) {
        this.$store.commit('setError', {
          errMsg: "You can't use your own referral!"
        })
        throw new Error("You can't use your own referral!")
      }

      const res = await axios.post('http://localhost:3000/set-referral', {
        referralCode: this.referralCode
      })

      console.log(res)

      if (res.status === 200) {
        this.$emit('referralEntered')
        this.$store.commit('updateMyCoins', { type: 'add', amount: 100 })
        localStorage.setItem('referralHidden', true)
      } else {
        this.$store.commit('setError', {
          errMsg: "Referral could not be saved. Please try again!"
        })
        throw new Error('Referral could not be saved.')
      }
    },
    closeReferralMenu() {
      this.$emit('referralEntered')
    },
    closeReferralMenuForever() {
      localStorage.setItem('referralHidden', true)
      this.$emit('referralEntered')
    }
  },
  mounted() {
    this.$refs.enterReferral.focus()
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/mixins/centerX';
@import '@/assets/mixins/centerY';
@import '@/assets/mixins/centerXY';

#referralMain {
  @include centerXY;
  border: 2px solid white;
  z-index: 1200;
  width: 350px;
  height: 300px;
  background: linear-gradient(rgb(148, 160, 226), rgb(52, 62, 121));
  border-radius: 10px;
  box-shadow: 0 0 5px 10px rgba(0,0,0,0.2);
  span {
    position: absolute;
    right: -7px;
    top: -7px;
    transform: scale(2);
    background: linear-gradient(rgb(245, 154, 121), orangered);
    border-radius: 5px;
    border: 2px solid white;
    cursor: pointer;
  }
  p {
    width: 80%;
    font-size: 22px;
    margin: auto;
    margin-top: 25px;
    font-weight: bold;
    color: white;
  }
  input {
    caret-color: white;
    margin-top: 40px;
    border: 1px solid rgba(0,0,0,0.2);
    border-radius: 5px;
    width: 80%;
    height: 40px;
    text-align: center;
    font-weight: bold;
    font-size: 20px;
    background-color: transparent;
    &::placeholder {
      color: rgba(255, 255, 255, 0.6);
    }
  }
  button {
    margin: auto;
    width: 60%;
    border-radius: 9px;
    color: white;
    font-size: 17px;
    padding: 5px 0 5px 0;
    border: none;
    border: 2px solid white;
    outline: none;
    font-weight: bold;
    cursor: pointer;
    &:hover {
      transition: .15s ease;
      transform: scale(1.03);
    }
  }
  #apply {
    margin-top: 25px;
    background: linear-gradient(rgb(98, 204, 98), rgb(14, 160, 14));
  }
  #dontAskAgain {
    margin-top: 5px;
    background: linear-gradient(340deg, rgb(90, 11, 126) 0%, rgba(181,0,255,1) 100%);
  }
}

</style>