<template>
  <el-dialog
    id="setting"
    :visible.sync="dialogVisible"
    :width="isTablet ? '80%' : '30%'"
    :show-close="false"
    :close-on-press-escape="false"
    :close-on-click-modal="false"
    :modal-append-to-body="false"
  >
    <div slot="title">
      <h2>memory</h2>
    </div>
    <h3>Select Theme</h3>
    <el-row type="flex" justify="space-between" align="middle" :gutter="40">
      <el-col>
        <el-button 
          :class="theme=='numbers' ? 'bg-black text-white' : 'bg-idle text-white'"
          @click="theme='numbers'"
        >
          Numbers
        </el-button>
      </el-col>
      <el-col>
        <el-button 
          :class="theme=='icons' ? 'bg-black text-white' : 'bg-idle text-white'"
          @click="theme='icons'"
        >
          Icons
        </el-button>
      </el-col>
    </el-row>

    <h3>Number of Players</h3>
    <el-row type="flex" justify="space-between" align="middle" :gutter="20">
      <el-col
        v-for="el in [1,2,3,4]"
        :key="el"
      >
        <el-button 
          :class="noOfPlayers==el ? 'bg-black text-white' : 'bg-idle text-white'"
          @click="noOfPlayers=el"
        >
          {{ el }}
        </el-button>
      </el-col>
    </el-row>

    <h3>Grid Size</h3>
    <el-row type="flex" justify="space-between" align="middle" :gutter="40">
      <el-col>
        <el-button
          :class="grid=='4x4' ? 'bg-black text-white' : 'bg-idle text-white'"
          @click="grid='4x4'"
        >
          4x4
        </el-button>
      </el-col>
      <el-col>
        <el-button
          :class="grid=='6x6' ? 'bg-black text-white' : 'bg-idle text-white'"
          @click="grid='6x6'"
        >
          6x6
        </el-button>
      </el-col>
    </el-row>

    <el-button class="start-game-button bg-orange text-white" @click="startGame">
      Start Game
    </el-button>
  </el-dialog>
</template>

<script>
export default {
  name: "Setting",
  props: {
    isMobile: { type: String, required: true },
    isTablet: { type: String, required: true },
  },
  data() {
    return {
      dialogVisible: true,
      theme: "numbers",
      noOfPlayers: 1,
      grid: "4x4"
    }
  },
  methods: {
    startGame() {
      this.$emit("startGame", {
        theme: this.theme,
        noOfPlayers: this.noOfPlayers,
        grid: this.grid,
      })
    }
  }
}
</script>

<style lang="scss">
@import "@/assets/style/variables.scss";

#setting {
  .el-dialog {
    margin-top: 13vh !important;
    box-shadow: none;
    border-radius: 0;
    background-color: transparent;
  }
  .el-dialog__header {
    background-color: $black;
    text-align: center;
    padding-bottom: 2rem;
  }
  .el-dialog__body {
    padding: 30px 50px;
    background-color: $white;
    border-radius: 10px;
    .start-game-button {
      margin-top: 2rem;
      height: 3rem;
    }
  }
}

</style>