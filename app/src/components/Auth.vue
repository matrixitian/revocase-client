<template>
  <div class="main">

    <form :class="{loginFormHeight: !signUpForm}">
      <button id="switch_to_login"
      @click.prevent="toggleFormType()">
        {{
          signUpForm ? "Or login" : "Or sign up"
        }}
      </button>
      <transition name="slide-fade">
      <div id="center" v-if="mounted">
        <p>{{ signUpForm ? "Create a new account" : "Login to your account" }}</p>
        <p v-show="signUpForm">Revo Skins: Let ads run in background and earn points!</p>
        <input v-show="signUpForm" type="text" placeholder="Your first name" ref="fname"
        v-model="name"
        @keyup="hideShowInfo">
        <input type="text" placeholder="Your email or phone number"
        v-model="emailOrPhoneNum"
        @focus="showForm = true"
        @keyup="hideShowInfo">
        <transition name="slide-fade">
          <input v-if="showForm && signUpForm" type="text" placeholder="Confirm email/phone number"
          v-model="cEmailOrPhoneNum"
          @keyup="hideShowInfo">
        </transition>
        <input type="text" :placeholder="passwordPlaceholder()" v-model="password"
        @keyup="updatePasswordMeter()">
        <div v-if="password && signUpForm && !showInfo" id="password_strength">
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
      </transition>
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
      passwordStrength: null,
      name: null,
      emailOrPhoneNum: null,
      cEmailOrPhoneNum: null,
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
          if (this.emailOrPhoneNum !== this.cEmailOrPhoneNum) {
            this.curInfoMessage = this.signUpFormText.data.fieldsDontMatch
            this.createErrorMessage('E-mail/Phone number.')
          }
          const format = /[ `!@#$%^&*()_+\-=\]{};':"\\|,.<>?~]/
          const containsSymbol = format.test(this.password)
          if (!this.password) {
            this.curInfoMessage = this.signUpFormText.data.password
            this.createErrorMessage('Password field is empty.')
          }
          const passwordLen = this.password.length
          if (!containsSymbol || passwordLen < 8) {
            this.curInfoMessage = this.signUpFormText.data.password
            this.createErrorMessage('Password not secure.')
          }
          if (!window.navigator.onLine) {
            this.curInfoMessage = this.signUpFormText.data.noConnection
            this.createErrorMessage('Client is offline.')
          }
          axios({
            method: 'post',
            url: 'http://localhost:3000/create-user',
            data: {
              name: this.name,
              emailOrPhoneNum: this.emailOrPhoneNum,
              password: this.password
            }
          }).then((res) => {
            console.log(res.data)
            if (res.data === 11000) {
              this.curInfoMessage = this.signUpFormText.data.emailOrPhoneNumTaken
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
              emailOrPhoneNum: this.emailOrPhoneNum,
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
.ps_red { background-color: red !important; }
.ps_yellow { background-color: yellow !important; }
.ps_green { background-color: greenyellow !important; }
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
#license {
  #copyright {
    font-weight: bold;
  }
  p {
    margin-top: 12px;
    font-size: 15px;
  }
  span {
    font-size: 17px;
  }
  a:nth-child(2) {
    margin-left: 50px;
  }
  a {
    margin-right: 20px;
    text-decoration: none;
  }
  #create_ad {
    background: rgb(27, 209, 21);
    background: linear-gradient(270deg, rgb(56, 212, 69) 0%, rgb(111, 245, 122) 100%);
    padding: 3px 6px 3px 6px;
    border-radius: 7px;
    color: white;
    font-weight: bold;
    box-shadow: 1px 1px 3px 1px rgba(0, 0, 0, 0.12);
    border: 1px solid transparent;
    &:hover {
      border: 1px solid rgb(31, 190, 39);
    }
  }
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
    // border-color: rgb(109, 177, 255);
  }
}

p {
  @include unselectable;
}

.slide-fade-enter-active {
  transition: all .3s ease;
}
.slide-fade-enter-from, .slide-fade-leave-to
/* .slide-fade-leave-active below version 2.1.8 */ {
  transform: translateX(10px);
  opacity: 0;
}
form {
  z-index: 100;
  float: right;
  position: absolute;
  height: 550px;
  width: 350px;
  border-radius: 10px;
  top: 50%;
  bottom: 50%;
  right: 100px;
  transform: translate(-50%, -50%);
  background-color: white;
  box-shadow: 0px 0px 10px 5px rgba(0, 0, 0, 0.07);
  div#center {
    // background-color: blue;
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
      border: 2px solid white;
      outline: none;
      &:hover {
        transition: .15s ease;
        transform: scale(1.03);
      }
    }
  }
}
p {
  margin: 0;
  color: rgb(31, 31, 31);
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
  // position: absolute;
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