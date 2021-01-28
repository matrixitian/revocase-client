<template>
  <div class="main">

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
        <p v-show="signUpForm">Revo Skins: Let ads run in background and earn points!</p>
        <input v-show="signUpForm" type="text" placeholder="Username" ref="fname"
        v-model="name"
        @keyup="hideShowInfo">

        <input type="text" placeholder="Your e-mail"
        v-model="email"
        @focus="showForm = true"
        @keyup="hideShowInfo">

        <input
        v-if="signUpForm"
        type="text" placeholder="Confirm email/phone number"
        v-model="cemail"
        @keyup="hideShowInfo">

        <!-- Password -->
        <input type="text"
        :placeholder="passwordPlaceholder()"
        v-model="password"
        @keyup="updatePasswordMeter()">

        <!-- Password Meter -->
        <div v-if="signUpForm && !showInfo" id="password_strength">
          <p>Password is <span 
          :class="{
            ps_red: passwordStrength === 'Weak',
            ps_yellow: passwordStrength === 'Medium',
            ps_green: passwordStrength === 'Strong'}">
          {{ passwordStrength }}</span></p>
        </div>

        <transition name="slide-fade">
          <p id="err_msg" v-if="showInfo" :class="{info_warning: errorOccured}">
            {{ curInfoMessage }}
          </p>
        </transition>
        <p id="terms" v-if="signUpForm">By creating your Karma account, you agree to our <a>Terms</a>, <a>Data Policy</a> and <a>Cookie Policy</a>. You may receive E-Mails from us and may opt out at any time.</p>
        <p v-show="!signUpForm" id="reset_password">Forgot your password?</p>
        <button type="submit" @click.prevent="authenticate()"
        id="formButton"
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
      alreadySignedUp: null,
      passwordStrength: "Weak",
      name: null,
      email: null,
      cemail: null,
      password: null,
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
        this.passwordStrength = passwordStrength(this.password).value
      } else {
        this.passwordStrength = null
      }
    },
    createErrorMessage(msg) {
      this.errorOccured = true
      this.showInfo = true
      throw new Error(msg)
    },
    authenticate() {
        if (this.signUpForm) {

          // Check E-mails match
          if (this.email !== this.cemail) {
            this.curInfoMessage = this.signUpFormText.data.fieldsDontMatch
            this.createErrorMessage('E-mails don\'t match.')
          }

          const format = /[ `!@#$%^&*()_+\-=\]{};':"\\|,.<>?~]/
          const containsSymbol = format.test(this.password)

          // Check password not empty
          if (!this.password) {
            this.curInfoMessage = this.signUpFormText.data.password
            this.createErrorMessage('Password field is empty.')
          }

          // Check password length and has symbols
          const passwordLen = this.password.length
          if (!containsSymbol || passwordLen < 8) {
            this.curInfoMessage = this.signUpFormText.data.password
            this.createErrorMessage('Password not secure.')
          }

          // Check client has connection
          if (!window.navigator.onLine) {
            this.curInfoMessage = this.signUpFormText.data.noConnection
            this.createErrorMessage('Client is offline.')
          }

          axios({
            method: 'post',
            url: 'http://localhost:3000/create-user',
            data: {
              name: this.name,
              email: this.email,
              password: this.password
            }
          }).then((res) => {
            console.log(res.data)
            if (res.data === 11000) {
              this.curInfoMessage = this.signUpFormText.data.emailTaken
              this.createErrorMessage('E-mail or phone number already taken.')
            } else {
              localStorage.setItem('token', res.data.token)
              this.errorOccured = false
              this.showInfo = true
              this.curInfoMessage = this.signUpFormText.data.successRedirecting
              
              setTimeout(() => {
                this.$router.push({ name: 'Fillout' })
              }, 1000)
            }
          })
        } else {
          axios({
            method: 'post',
            url: 'http://localhost:3000/login',
            data: {
              name: this.name,
              email: this.email,
              password: this.password
            }
          }).then((res) => {
            if (res.status === 200) {
              this.showInfo = true
              this.curInfoMessage = this.loginFormText.data.loginSuccesful
              this.$router.push({ name: 'Home' })
            }
          })
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
      this.$refs.fname.focus()
    }, 100)  
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
  height: 550px;
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
      margin-top: 15px;
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