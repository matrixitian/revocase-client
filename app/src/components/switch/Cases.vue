<template>
  <div class="main">
    <div id="Upper">
     
    </div>
    <div id="Downer">
      <ul>
        <li v-for="(Case, i) in cases" :key="i"
        :class="`Pipe_${i}`">
          <img class="case" :src="require(`@/assets/cases/${Case}_case.png`)" alt="">
          <p class="caseTitle">{{ Case.toUpperCase() }}</p>
          <p class="amountOpened">Opened <span>{{ caseOpened[i] }}</span></p>
          <div class="viewContents">
            <img src="@/assets/icons/contents.svg" alt="">
            <p>View Contents</p>
          </div>
          <div class="openBtnCon">
            <img src="@/assets/icons/bullet.png" alt="">
            <p>{{ casePrices[i] }}</p>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Cases',
  data() {
    return {
      cases: [
        'clutch', 'fracture', 'chroma2',
        'phoenix', 'danger_zone'
      ],
      casePrices: [100, 250, 120, 214, 51],
      // realtime synced amount of cases opened globally
      caseOpened: [42, 12, 56, 21, 10]
    }
  }
}
</script>

<style scoped lang="scss">
@import '@/assets/mixins/centerX';
@import '@/assets/mixins/centerY';
@import '@/assets/mixins/centerXY';
@import '@/assets/mixins/unselectable';

$grayBackground: #1b2435;
$redGradientStart: #ea5a8d;
$redGradientEnd: #e32565;
$yellowGradientStart: #ff7b36;
$yellowGradientEnd: #ffcc01;
$greenGradientStart: #884bd6;
$greenGradientEnd: #a81b8a;
$blueGradientStart: #4ba8b7;
$blueGradientEnd: #018498;
$purpleGradientStart: #7967bb;
$purpleGradientEnd: #5a43ab;

.case {
  transform: scale(0.7);
}

.caseTitle {
  font-weight: bold;
  padding: 5px;
  background-color: rgba(0, 0, 0, 0.15);
}

.amountOpened {
  font-size: 13px;
  margin: auto;
  margin-top: 10px;
  width: 50%;
  border-radius: 8px;
  background-color: rgba(0, 0, 0, 0.3);
  padding: 2px;
  span {
    background-color: rgba(0, 0, 0, 0.6);
    padding: 0 3px 0 3px;
    font-weight: bold;
    border-radius: 4px;
  }
}

.viewContents, .openBtnCon {
  margin: auto;
  margin-top: 10px;
  padding: 7px 10px 7px 10px;
  box-shadow: 2px 2px 6px 1px rgba(0, 0, 0, 0.15);
  border-radius: 7px;
  border: 2px solid white;
  color: white;
  font-weight: bold;
  font-size: 15px;
  max-width: 150px;
  background-color: rgb(46, 117, 209);
  background-image: linear-gradient(rgb(60, 167, 230), rgb(3, 100, 228));
  cursor: pointer;
  &:hover {
    transition: .15s ease;
    transform: scale(1.05);
  }
  img {
    float: left;
    padding: 0;
    margin: 0;
    margin-top: -2px;
  }
}

.openBtnCon {
  background-color: rgb(46, 209, 54);
  background-image: linear-gradient(rgb(46, 209, 54), rgb(18, 158, 41));
  border-radius: 20px;
  max-width: 100px;
  img {
    margin-top: -5px;
    height: 35px;
    width: 35px;
  }
  p {
    font-size: 20px;
  }
}

.Pipe_0 {
  background-color: $redGradientEnd;
  background-image: linear-gradient($redGradientStart, $redGradientEnd);
}

.Pipe_1 {
  background-color: $yellowGradientEnd;
  background-image: linear-gradient($yellowGradientEnd, $yellowGradientStart);
}

.Pipe_2 {
  background-color: $greenGradientEnd;
  background-image: linear-gradient($greenGradientStart, $greenGradientEnd);
}

.Pipe_3 {
  background-color: $blueGradientEnd;
  background-image: linear-gradient($blueGradientStart, $blueGradientEnd);
}

.Pipe_4 {
  background-color: $purpleGradientEnd;
  background-image: linear-gradient($purpleGradientStart, $purpleGradientEnd);
}


#Upper {
    @include centerY;
    top: -400px;
    background-color: yellow;
    width: 80vw;
    height: 100px;
    // margin: auto;
    position: relative;
  }
  #Downer {
    position: relative;
    width: 100%;
    height: calc(100% - 100px);
    ul {
      @include centerX;
      width: auto;
      height: 400px;
      bottom: 0;
      display: flex;
      li {
        display: inline-block;
        align-self: flex-end;
        border-top-left-radius: 20px;
        border-top-right-radius: 20px;
        margin: 0 20px 0 20px;
        height: 90%;
        bottom: 0;
        border: 5px solid white;
        border-bottom: none;
        &:hover {
          transition: .2s ease;
          height: 375px;
        }
      }
    }
  }
</style>
