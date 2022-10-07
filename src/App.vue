
<template>
  <div id="app">
    <setting 
      v-if="stage === 'setting'" 
      @startGame="startGame"
    />
    <game 
      v-if="stage === 'game'" 
      :setup="setup"
      @exit="exitGame"
    />
  </div>
</template>

<script>
import Setting from "@/components/setting.vue"
import Game from "@/components/game.vue"
export default {
  components: {
    Setting, Game
  },
  data() {
    return {
      stage: "setting",
      setup: {
        theme: "icons",
        noOfPlayers: 4,
        grid: "4x4"
      },
    }
  },
  methods: {
    startGame(val) {
      this.setup = val
      this.stage = "game"
    },
    exitGame() {
      this.setup = {}
      this.stage = "setting"
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