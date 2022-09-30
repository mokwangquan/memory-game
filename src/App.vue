
<template>
  <div id="app">
    <setting @startGame="startGame"/>
  </div>
</template>

<script>
import Setting from "@/components/setting.vue"
export default {
  components: {
    Setting
  },
  methods: {
    startGame(val) {
      console.log("start game with val ->", val)
    }
  }
};
</script>

<style lang="scss">
// import third party first
@import "https://unpkg.com/element-ui/lib/theme-chalk/index.css";

// Then only import local, to allow overriding
@import "@/assets/style/main.scss";
</style>