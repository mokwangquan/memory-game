
<template>
  <div id="app">
    <setting 
      v-if="stage === 'setting'" 
      @startGame="startGame"
      :isMobile="isMobile"
      :isTablet="isTablet"
    />
    <game 
      v-if="stage === 'game'" 
      :setup="setup"
      @exit="exitGame"
      :isMobile="isMobile"
      :isTablet="isTablet"
    />
  </div>
</template>

<script>
import Setting from "@/components/setting.vue"
import Game from "@/components/game.vue"
import debounce from "lodash/debounce"

const TABLET_MAX_WIDTH = 1200
const MOBILE_MAX_WIDTH = 500

export default {
  components: {
    Setting, Game
  },
  data() {
    return {
      stage: "setting",
      setup: {
        theme: "numbers",
        noOfPlayers: 4,
        grid: "4x4"
      },
      isMobile: false,
      isTablet: false,
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
    },
    checkIsMobile() {
      const width = document.body.clientWidth
      this.isMobile = width < MOBILE_MAX_WIDTH
      this.isTablet = width < TABLET_MAX_WIDTH

      document.body.classList.remove('mobile');
      document.body.classList.remove('tablet');

      if (this.isMobile) {
        document.body.classList.add('mobile');
      } else if (this.isTablet) {
        document.body.classList.add('tablet');
      }
    },
  },
  mounted() {
    // Mobile view checking
    this.checkIsMobile() // initial checking

    // check isMobile again when resized
    window.addEventListener('resize', 
      debounce(this.checkIsMobile, 100)
    , true);
  }
};
</script>

<style lang="scss">
// import third party first
@import "https://unpkg.com/element-ui/lib/theme-chalk/index.css";

// Then only import local, to allow overriding
@import "@/assets/style/main.scss";
</style>