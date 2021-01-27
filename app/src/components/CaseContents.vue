<template>
  <div>
    <ul>
      <li v-for="gun in guns" :key="gun">
        <p>{{ gun }}</p>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'CaseContents',
  props: ['Case'],
  data() {
    return {
      guns: [] // arr of gun names
    }
  },
  mounted() {
    console.log(this.Case)

    this.importGunData()

  },
  methods: {
    importGunData() {
      switch (this.Case) {
        case 'clutch':
            this.guns = require(`@/assets/gunData/${this.Case}.json`)
            console.log(this.guns)
          break;
      
        default:
          break;
      }
    }
  }
}
</script>

<style lang="scss" scoped>

</style>