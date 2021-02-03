<template>
  <div id="referralMain">
    <p>hello</p>
  </div>
</template>

<script>
export default {
  name: 'Referral',
  data() {
    return {

    }
  },
  methods: {

  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/mixins/centerX';
@import '@/assets/mixins/centerY';
@import '@/assets/mixins/centerXY';

#referralMain {
  @include centerXY;
  z-index: 1200;
  width: 350px;
  height: 300px;
  background-color: orange;
}

</style>