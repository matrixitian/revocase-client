<template>
  <div id="giveawaysMain">

    <div id="close">
      <span class="material-icons-round">
        highlight_off
      </span>
    </div>

    <div id="skinShowcase">
      <img src="https://steamcdn-a.akamaihd.net/apps/730/icons/econ/default_generated/weapon_ak47_cu_ak47_cobra_light_large.7494bfdf4855fd4e6a2dbd983ed0a243c80ef830.png">
      <p>AK-47 | <span>Redline</span></p>
      <button>Copy My Referral</button>
      <div id="myRP">
        <p>My RP: <span>{{ 47 }}</span></p>
      </div>
    </div>

  </div>
</template>

<script>
export default {
  name: "Giveaways",
  data() {
    return {

    }
  },
  methods: {
    
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/mixins/centerXY';

@keyframes float {
	0% {
		margin-top: -10px;}
	50% {
		margin-top: -20px;;
	}
	100% {
		margin-top: -10px;;
	}
}

@keyframes rainbow {
  0%{background-position:0% 82%}
  50%{background-position:100% 19%}
  100%{background-position:0% 82%}
}

#giveawaysMain {
  height: 70vh;
  width: 100vw;
}

#skinShowcase {
  @include centerXY;
  animation: float 2s infinite;
  img {
    height: 220px;
    padding: 0 60px 0 60px;
    border-radius: 20px;
    border: 3px solid rgb(226, 0, 207);
    background-color: rgb(110, 54, 110);
    box-shadow: 0 0 3px 7px rgba(0,0,0,0.4);
    background: linear-gradient(124deg, #ff2400, #e81d1d, #af1de8, #751de8, #2b1de8, #e81d7c, #2b1de8, #dd00f3, #dd00f3);
background-size: 1800% 1800%;

-webkit-animation: rainbow 18s ease infinite;
-z-animation: rainbow 18s ease infinite;
-o-animation: rainbow 18s ease infinite;
  animation: rainbow 18s ease infinite;
  }
  p {
    margin-top: 10px;
    font-weight: bold;
    font-size: 25px;
    span {
      color: rgb(226, 0, 207);
    }
  }
  button {
    margin-top: 10px;
    border: 2px solid white;
    outline: none;
    padding: 10px 20px 10px 20px;
    background-color: rgb(212, 69, 25);
    border-radius: 10px;
    font-size: 20px;
    font-weight: bold;
  }
  #myRP {
    position: relative;
    margin-top: 20px;
    height: 45px;
    width: 100%;
    text-align: center;
    border-radius: 10px;
    background-color: rgba(255, 255, 255, 0.1);
    p {
      @include centerXY;
      top: 12px;
      font-size: 21px;
      font-weight: bold;
      color: rgb(5, 255, 109);
      span {
        color: rgb(5, 255, 109);
        padding: 5px 25px 5px 25px;
        background-color: rgba(0,0,0,0.4);
        border-radius: 20px;
        margin-left: 10px;
      }
    }
  }
}

#close {
  position: absolute;
  top: 40px; right: 40px;
  background-color: white;
  span {
    color: red;
    transform: scale(2.5);
    cursor: pointer;
    &:hover {
      transition: .15s ease-in-out;
      transform: scale(2.6);
    }
  }
}

</style>