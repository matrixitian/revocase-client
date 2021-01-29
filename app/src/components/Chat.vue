<template>
  <div id="chatWindow" :class="{chatClosed: !chatOpen}"
  @keypress.enter="sendMsg()">
    <div id="topper" @click="toggleChat()">
      <p>Global Chat</p>
      <span class="material-icons">
        minimize
      </span>
    </div>

    <div id="chat" v-show="chatOpen">
      <ul ref="chatHistory">
        <li v-for="(msg, i) in chat" :key="i">
          <div class="unameCon"
          :class="{sentByYou: msg.uname === user.displayName}">
            <p class="uname">{{ msg.uname }}</p>
            <p class="time">{{ getTime(msg.createdAt) }}</p>
          </div>
          <div class="msg">{{ msg.msg }}</div>
        </li>
      </ul>
    </div>

    <div id="addMsg" v-show="chatOpen">
      <input type="text" placeholder="Write something..."
      v-model="newMsg">

      <span class="material-icons"
      @click="sendMsg()">
        send
      </span>

    </div>

  </div>
</template>

<script>
import { auth, firestore } from '@/firebase/config.js'

export default {
  name: 'Chat',
  data() {
    return {
      chatOpen: false,
      user: null,
      newMsg: null,
      chat: []
    }
  },
  methods: {
    scrollChat() {
      this.$refs.chatHistory.scrollTop = this.$refs.chatHistory.scrollHeight + 100
    },
    toggleChat() {
      this.chatOpen = !this.chatOpen
    },
    getTime(timestamp) {
      const day = new Date(timestamp).getUTCDate()
      const month = new Date(timestamp).getUTCMonth() + 1
      const year = new Date(timestamp).getUTCFullYear()
      let h = new Date(timestamp).getHours()
      let m = new Date(timestamp).getMinutes()

      h = (h<10) ? '0' + h : h;
      m = (m<10) ? '0' + m : m;

      return `${day}/${month}/${year} ${h}:${m}`
    },
    sendMsg() {
      if (this.newMsg) {
        firestore.collection("chat").add({
          uname: this.user.displayName,
          msg: this.newMsg,
          createdAt: Date.now()
        }).then((res) => {
          console.log(res)
        }).catch((err) => {
          console.log(err)
        })
      }

      this.newMsg = null
      this.scrollChat()
    }
  },
  mounted() {
    auth.onAuthStateChanged(user => {
      if (user) {
        this.user = user

        const colRef = firestore.collection('chat')
        .orderBy('createdAt').limit(10)

        colRef.onSnapshot((snap) => {
          let results = []
          snap.docs.forEach(doc => {
            doc.data().createdAt && results.push({ ...doc.data(), id: doc.id})
          })

          this.chat = results

          console.log(results)
        })
      } else {
        // No user is signed in.
        this.user = null
        this.authChecked = true
      }
    })
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/mixins/centerXY';

.chatClosed {
  height: 30px !important;
  background-color: transparent;
}

.sentByYou {
  background-color: royalblue !important;
}

#chatWindow {
  z-index: 100;
  position: absolute;
  height: 300px;
  width: 350px;
  bottom: 0;
  right: 50px;
  border-top-left-radius: 6px;
  border-top-right-radius: 6px;
  background-color: #36393f;
  box-shadow: 5px 6px 10px 3px rgba(0, 0, 0, 0.3);
  #topper {
    position: relative;
    height: 30px;
    border-top-left-radius: 6px;
    border-top-right-radius: 6px;
    background-color: rgb(34, 200, 103);
    box-shadow: 0 4px 10px -2px rgba(0, 0, 0, 0.2);
    cursor: pointer;
    p {
      position: absolute;
      left: 10px;
      top: 3px;
      background-color: rgba(0, 0, 0, 0.3);
      padding: 3px 15px 3px 15px;
      font-weight: bold;
      border-radius: 6px;
    }
    span {
      position: absolute;
      right: 10px;
      top: 3px;
      border-radius: 5px;
      background-color: rgba(0, 0, 0, 0.2);
      cursor: pointer;
    }
  }
  #chat {
    position: relative;
    margin: auto;
    width: 90%;
    height: calc(90% - 50px);
    ul {
      @include centerXY;
      margin: auto;
      height: 90%;
      width: 100%;
      overflow: auto;
      max-height: 200px;
      li {
        position: relative;
        border-radius: 10px;
        background-color: rgba(0, 0, 0, 0.2);
        margin-top: 5px;
        width: 95%;
        height: auto;
        padding: 5px;
        min-height: 30px;
        .unameCon {
          position: absolute;
          left: 0;
          top: 3px;
          width: 100px;
          margin-right: 5px;
          display: inline-block;
          margin-left: 10px;
          background-color: orangered;
          padding: 2px 6px 2px 6px;
          border-radius: 5px;
          font-weight: bold;
          color: black;
          .time {
            color: white;
            font-size: 9px;
            font-weight: bold;
          }
        }
        .msg {
          margin-left: 120px;
          width: calc(100% - 120px);

        }
      }
    }
  }
  #addMsg {
    margin: auto;
    width: 290px;
    input {
      float: left;
      padding: 8px 60px 8px 20px;
      border: none;
      background-color:  #40444b;
      font-weight: bold;
      border-radius: 5px;
      font-size: 15px;
      &::placeholder {
        color: #6a6a6b;
      }
      &:focus {
        color: whitesmoke;
      }
    }
    span {
      float: right;
      background-color:rgb(34, 200, 103) ;
      border-radius: 5px;
      padding: 5px;
      cursor: pointer;
      &:hover {
        transition: .2s ease;
        background-color: rgb(95, 233, 152);
      }
    }
  }
}

</style>