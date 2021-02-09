<template>
  <div class="main" @keypress.enter.prevent>

    <form :class="{loginFormHeight: !signUpForm}">

      <!-- Switch Auth -->
      <button id="switch_to_login"
      @click.prevent="toggleFormType()">
        {{
          signUpForm ? "Or login" : "Or sign up"
        }}
      </button>

      <div id="center" v-if="mounted">

        <p>{{ signUpForm ? "Create a new account" : "Login to your account" }}</p>

        <p v-show="signUpForm">Revo Cases: Earn cases and open them easily!</p>

        <!-- Username -->
        <input v-show="signUpForm" type="text"
        placeholder="Username" ref="uname"
        v-model="uname"
        @keyup="hideShowInfo">

        <!-- E-mail -->
        <input type="text" placeholder="Your e-mail"
        v-model="email"
        @focus="showForm = true"
        @keyup="hideShowInfo">

        <!-- Confirm Password -->
        <input
        v-if="signUpForm"
        type="password" placeholder="Confirm password"
        v-model="password"
        @keyup="updatePasswordMeter()">

        <!-- Password -->
        <input type="password"
        :placeholder="passwordPlaceholder()"
        v-model="cpassword"
        @keyup="hideShowInfo">

        <!-- Trade URL -->
        <input type="text" v-if="signUpForm"
        placeholder="Your Trade URL"
        v-model="tradeURL">

        <!-- Trade URL Info -->
        <a href="https://steamcommunity.com/my/tradeoffers/privacy#trade_offer_access_url"
          target="_blank"
          id="tradeInfo">
          <span v-if="signUpForm">GET URL</span>
        </a>

        <!-- Ad agreement -->
        <!-- <div id="agreement"
        v-if="signUpForm">
          <div>
            <p>I agree that I am over 18 
            and I am okay with adult content being shown to me.</p>
          </div>
          <div>
            <input type="checkbox"
            v-model="agreed">
          </div>
        </div> -->

        <!-- Password Meter -->
        <div v-if="signUpForm && !showInfo" id="password_strength">
          <p>Password is <span 
          :class="{
            ps_red: passwordStrength === 'Weak',
            ps_yellow: passwordStrength === 'Medium',
            ps_green: passwordStrength === 'Strong'}">
          {{ passwordStrength }}</span></p>
        </div>

        <!-- Error Message -->
        <transition name="slide-fade">
          <p id="err_msg" v-if="showInfo" :class="{info_warning: errorOccured}">
            {{ curInfoMessage }}
          </p>
        </transition>

        <!-- Terms and Privacy -->
        <p id="terms" v-if="signUpForm">
          By signing up you agree to our <a>Terms</a>, 
          <a>Data Policy</a> and <a>Cookie Policy</a>.
        </p>

        <!-- Reset password -->
        <p v-show="!signUpForm" id="reset_password">Forgot your password?</p>

        <!-- Login or Register -->
        <button type="submit"
        id="formButton"
        @click.prevent="authenticate()"
        :class="{loginBtnMargin: !signUpForm}">
          {{ signUpForm ? "Create your Revo account" : "Login" }}
        </button>

      </div>
    </form>

  </div>
</template>

<script>
import axios from 'axios'
const passwordStrength = require('check-password-strength')

export default {
  data() {
    return {
      agreed: true,
      alreadySignedUp: null,
      passwordStrength: "Weak",
      uname: null,
      email: null,
      cpassword: null,
      password: null,
      tradeURL: null,
      pageText: null,
      signUpFormText: null,
      loginFormText: null,
      signUpForm: true,
      errorOccured: false, // only for red class adding
      showInfo: false,
      mounted: false,
      showForm: false,
      curInfoMessage: null
    }
  },
  methods: {
    hideShowInfo() {
      this.showInfo = false
    },
    updatePasswordMeter() {
      // removes info message on keyup too
      this.showInfo = false
      if (this.password) {
        console.log(this.password)
        this.passwordStrength = passwordStrength(this.password).value
      } else {
        this.passwordStrength = "Weak"
      }
    },
    createErrorMessage(msg) {
      this.errorOccured = true
      this.showInfo = true
      this.curInfoMessage = msg
      throw new Error(msg)
    },
    authenticate() {
        if (this.signUpForm) {

          // Check Username exists
          if (!this.uname) {
            this.createErrorMessage("You forgot to enter a username!")
          }

          // Check Username length
          if (!(this.uname.length > 3) && !(this.uname.length > 10) ) {
            this.createErrorMessage("Username must be between 3-10 characters long!")
          }

          if (!this.email) {
            this.createErrorMessage("You need to enter an e-mail!")
          }

          // Check E-mails match
          if (this.password !== this.cpassword) {
            this.createErrorMessage("Passwords don't match!")
          }

          const format = /[ `!@#$%^&*()_+\-=\]{};':"\\|,.<>?~]/
          const containsSymbol = format.test(this.password)

          // Check password not empty
          if (!this.password) {
            this.createErrorMessage("Password cannot be empty!")
          }

          // Check password length and has symbols
          const passwordLen = this.password.length
          if (!containsSymbol || passwordLen < 8) {
            this.createErrorMessage("Password needs to contain a symbol and be at least 8 characters long!")
          }

          if (!this.tradeURL) {
            this.createErrorMessage("Enter your Trade URL so we can send you Trade Offers!")
          }

          if(!this.tradeURL.includes('steamcommunity.com/tradeoffer/new/')) {
            this.createErrorMessage("The Trade URL entered is not valid, click on the info icon!")
          }

          // Check Username exists
          if (!this.agreed) {
            this.createErrorMessage("You cannot create an account if you are a minor!")
          }

          // Check client has connection
          if (!window.navigator.onLine) {
            this.createErrorMessage("Please check you internet connection and refresh page!")
          }

          this.createAccount()
        } else {
          this.login()
        }
    },
    saveUserAndRedirect(payload) {
      localStorage.setItem('token', payload.token)
      this.$store.commit('setUser', { user: payload.user })

      axios.defaults.headers = {
        'Content-Type': 'application/json',
        Authorization: payload.token
      }
    },
    async login() {
      if (!navigator.onLine) {
        return this.createErrorMessage('You are offline!')
      }

      const res = await axios.post('https://revo-cases.com/login', {
        email: this.email,
        password: this.password
      })

      if (res.status === 200) {
        this.$store.commit('updateMyCoins', { type: 'set', amount: res.data.user.credits })
        this.saveUserAndRedirect({ user: res.data.user, token: res.data.token })
      } else {
        this.createErrorMessage(res.data.message)
      }
    },
    async createAccount() {
      if (!navigator.onLine) {
        return this.createErrorMessage('You are offline!')
      }
      
      const res = await axios.post('https://revo-cases.com/signup', {
        username: this.uname,
        email: this.email,
        password: this.password,
        tradeURL: this.tradeURL
      })

      if (res.status === 200) {
        this.createErrorMessage(res.data)
      }

      if (res.status === 201) {
        this.saveUserAndRedirect({ user: res.data.user, token: res.data.token })
      } else {
        this.$store.commit('setError', { errMsg: 'Registration failed. Refresh the site and try again!' })
      }
    },
    toggleFormType() {
      this.showInfo = false
      this.signUpForm = !this.signUpForm
    },
    passwordPlaceholder() {
      return this.signUpForm ? 'Secure password' : 'Your password'
    }
  },
  mounted() {
    this.mounted = true
    setTimeout(() => {
      this.$refs.uname.focus()
    }, 100)  

    const token = localStorage.getItem('token')
    axios.defaults.headers = {
      'Content-Type': 'application/json',
      Authorization: token
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/mixins/unselectable';
@import '@/assets/mixins/centerX';
@import '@/assets/mixins/centerXY';

.ps_red { background-color: red !important; }
.ps_yellow { background-color: yellow !important; }
.ps_green { background-color: greenyellow !important; }

.slide-fade-enter-active {
  transition: all .3s ease;
}
.slide-fade-enter-from, .slide-fade-leave-to {
  transform: translateX(10px);
  opacity: 0;
}

#tradeInfo {
  position: absolute;
  top: 342px;
  right: 50px;
  text-decoration: none;
  span {
    text-decoration: none;
    color: white;
    padding: 5px;
    font-size: 12px;
    background-color: rgb(22, 158, 22);
    border-radius: 5px;
    box-shadow: 0 0 5px 2px rgba(0, 0, 0, 0.1);
    cursor: pointer;
    &:hover {
      transition: .15s ease;
      background-color: rgb(31, 192, 31);
    }
  }
}

#agreement {
  margin-top: 10px;
  width: 100%;
  height: 50px;
  div:nth-child(1) {
    position: relative;
    width: 90%;
    height: 100%;
    float: right;
    p {
      @include centerX;
      top: 0;
      margin: 0 !important;
      width: 100%;
      font-size: 13px !important;
      text-align: justify;
      text-justify: inter-word;
    }
  }
  
  div:nth-child(2) {
    position: relative;
    width: 10%;
    height: 100%;
    float: left;
    input {
      margin: 0 !important;
      position: absolute;
      top: 0;
      left: 5px;
      height: 40px;
      cursor: pointer;
    }
  }
}

button {
  font-weight: bold;
  cursor: pointer;
}

input {
  font-weight: bold;
}

#password_strength {
  margin: auto;
  margin-top: -10px;
  text-align: center;
  p {
    font-size: 14px !important;
    span {
      font-size: 13px;
      padding: 4px;
      border-radius: 5px;
      border: 1px solid rgba(0, 0, 0, 0.1);
    }
  }
}

.loginBtnMargin {
  margin-top: 10px !important;
}

.loginFormHeight {
  height: 320px !important;
}

#switch_to_login {
  margin-top: -50px;
  right: 0;
  position: absolute;
  border-radius: 9px;
  background: rgb(6,8,98);
  background: linear-gradient(340deg, rgb(15, 106, 192) 0%, rgb(28, 164, 255) 100%);
  color: white;
  font-size: 15px;
  width: 150px;
  padding: 10px 0 10px 0;
  border: 2px solid white;
  outline: none;
  &:hover {
    transition: .1s ease-in-out;
    border: 4px solid white;
  }
}

p {
  @include unselectable;
  margin: 0;
  color: rgb(31, 31, 31);
}

form {
  @include centerXY;
  height: 540px;
  width: 350px;
  border-radius: 10px;
  background-color: white;
  box-shadow: 0px 0px 10px 5px rgba(0, 0, 0, 0.07);
  div#center {
    width: 80%;
    margin: auto;
    p:nth-child(1) {
      margin-top: 30px;
      font-weight: bold;
      font-size: 25px;
    }
    p:nth-child(2) {
      margin-top: 5px;
      margin-bottom: 20px;
    }
    input {
      margin-top: 12px;
      border: none;
      outline: none;
      background-color: rgba(0, 0, 0, 0.12);
      border-radius: 9px;
      font-size: 15px;
      width: calc(100% - 13px);
      padding: 10px 0 10px 10px;
    }
    p#terms {
      width: 100%;
      margin: auto;
      margin-top: 20px;
      font-size: 14px;
    } 
    a {
      font-weight: bold;
      color: rgb(0, 89, 255);
      cursor: pointer;
      &:hover {
        color: rgb(56, 149, 211);
      }
    }
    button#formButton {
      margin: auto;
      margin-top: 15px;
      width: 100%;
      border-radius: 9px;
      background: rgb(6,8,98);
      background: linear-gradient(340deg, rgb(90, 11, 126) 0%, rgba(181,0,255,1) 100%);
      color: white;
      font-size: 15px;
      padding: 10px 0 10px 0;
      border: none;
      // border: 2px solid rgb(165, 35, 35);
      outline: none;
      &:hover {
        transition: .15s ease;
        transform: scale(1.03);
      }
    }
  }
}

#reset_password {
  color:rgb(255, 255, 255);
  font-weight: bold;
  border-radius: 20px;
  padding: 5px 12px 5px 12px;
  background: rgb(21, 150, 209);
  background: linear-gradient(270deg, rgb(21, 150, 209) 0%, rgb(14, 91, 233) 100%);
  font-size: 14px;
  margin: auto;
  margin-top: 20px;
  cursor: pointer;
  &:hover {
    transition: .5s ease;
    background: rgb(21, 150, 209);
  }
}

#err_msg {
  width: calc(100% - 23px);
  color: white;
  margin-top: 10px;
  font-weight: bold;
  font-size: 12px;
  border-radius: 5px;
  text-align: center;
  padding: 5px 10px 5px 10px;
  background: rgb(27, 209, 21);
  background: linear-gradient(270deg, rgb(56, 212, 69) 0%, rgb(111, 245, 122) 100%);
}

.info_warning {
  background: rgb(209, 90, 21) !important;
  background: linear-gradient(270deg, rgb(223, 114, 64) 0%, rgb(219, 62, 34) 100%) !important;
}

.main {
  padding: 0 !important;
  margin: 0 !important;
  width: 100vw !important;
  height: 100vh !important;
  background-color: rgba(0, 0, 0, 0.5);
}
</style>