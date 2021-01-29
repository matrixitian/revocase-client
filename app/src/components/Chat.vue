<template>
  <div id="chatWindow">
    <div id="topper">
      <p>Global Chat</p>
      <span class="material-icons">
        minimize
      </span>
    </div>

    <div id="chat">
      <ul>
        <li v-for="(msg, i) in chat" :key="i">
          {{ msg }}
        </li>
      </ul>
    </div>

    <div id="addMsg">
      <input type="text" placeholder="Write something...">
      <span class="material-icons">
        send
      </span>

    </div>

  </div>
</template>

<script>
export default {
  name: 'Chat',
  props: ['chat'],
  data() {
    return {

    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/mixins/centerXY';

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
      width: 90%;
      li {
        border-radius: 10px;
        background-color: rgba(0, 0, 0, 0.2);
        margin-top: 5px;
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