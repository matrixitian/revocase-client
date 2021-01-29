<template>
  <div id="chatWindow"
  >
    <div id="topper">

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
    height: 30px;
    border-top-left-radius: 6px;
    border-top-right-radius: 6px;
    background-color: rgb(29, 105, 204);
    box-shadow: 0 4px 10px -2px rgba(0, 0, 0, 0.2);
  }
  #chat {
    margin: auto;
    width: 90%;
    height: calc(90% - 50px);
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
      background-color: rgb(29, 105, 204);
      border-radius: 5px;
      padding: 5px;
    }
  }
}

</style>