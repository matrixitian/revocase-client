<template>
    <div id="mainErrorHandler" v-if="errMsg">
      <div id="errMsg">
        <p>{{ errMsg }}</p>
      </div>
      <div id="errIcon">
        <span class="material-icons">
          error
        </span>
      </div>
    </div>
</template>

<script>
export default {
  name: 'ErrorHandler',
  data() {
    return {
      errMsg: null
    }
  },
  created() {
    this.$store.subscribe(async(mutation, state) => {
      if (mutation.type === 'setError') {
        this.errMsg = state.errMsg
      }
    })
  },
  mounted() {
    // this.$store.commit('setError', {
    //   errMsg: "You don't have enough coins!"
    // })
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/mixins/centerX';
@import '@/assets/mixins/centerXY';

#mainErrorHandler {
  z-index: 1000;
  @include centerX;
  top: 50px;
  width: 500px;
  height: 40px;
  background: linear-gradient(red, orangered);
  border: 2px solid white;
  border-radius: 15px;
  box-shadow: 0 0 5px 7px rgba(0,0,0,0.4);
  padding: 5px;
  display: flex;
  #errMsg {
    position: relative;
    float: left;
    width: calc(100% - 50px);
    height: 100%;
    p {
      @include centerXY;
      color: rgba(0,0,0,0.6);
      font-weight: bold;
      width: 90%;
    }
  }
  #errIcon {
    position: relative;
    width: 50px;
    height: 100%;
    background-color: rgba(0,0,0,0.3);
    border-radius: 5px;
    span {
      margin-top: 8px;
      transform: scale(1.5);
    }
  }
}

</style>