<template>
  <div id="game">
    <el-row type="flex" justify="space-between" align="middle">
      <h2>memory</h2>
      <div>
        <el-button class="bg-orange text-white w-auto" @click="restart()">Restart</el-button>
        <el-button class="bg-idle text-black w-auto" @click="$emit('exit')">New Game</el-button>
      </div>
    </el-row>

    <div id="grid">
      <el-row 
        type="flex" 
        justify="center" 
        align="middle" 
        v-for="row, x in grid"
        :key="'x_'+x"
      >
        <el-col
          :span="1"
          v-for="col, y in row"
          :key="'y_'+y"
          :class="getClass(x, y)"
        >
          <div>
            {{ col }}
          </div>
        </el-col>
      </el-row>
    </div>

    <div v-if="setup.noOfPlayers > 1" id="player-row">
      <el-row
        type="flex"
        justify="center"
        align="middle"
      >
        <el-col
          v-for="score, index in allPlayerScore"
          :key="'player_'+index"
          class="no-hover"
          :class="currentPlayerIndex === index ? 'bg-orange text-white': 'bg-idle text-light-grey'"
        >
          <div 
            v-if="currentPlayerIndex === index" 
            class="arrow-up bg-orange"
          >
            &nbsp;
          </div>
          <el-row
            type="flex"
            justify="space-between"
            align="middle"
          >
            <span>Player {{ index + 1 }}</span>
            <h2>{{ score }}</h2>
          </el-row>
          <div 
            v-if="currentPlayerIndex === index" 
            class="current-turn text-black"
          >
            CURRENT TURN
          </div>
        </el-col>
      </el-row>
    </div>

    <div v-else id="solo-info-row">
      <el-row
        type="flex"
        justify="center"
        align="middle"
      >
        <el-col
          class="bg-idle text-light-grey no-hover"
        >
          <el-row
            type="flex"
            justify="space-between"
            align="middle"
          >
            <span>Time</span>
            <h2>{{ time }}</h2>
          </el-row>
        </el-col>
        <el-col
          class="bg-idle text-light-grey no-hover"
        >
          <el-row
            type="flex"
            justify="space-between"
            align="middle"
          >
            <span>Moves</span>
            <h2>{{ moves }}</h2>
          </el-row>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
export default {
  name: "Game",
  props: {
    setup: { type: Object, required: true }
  },
  data() {
    return {
      grid: [],
      allPlayerScore: [],
      currentPlayerIndex: 0,
      // Solo
      time: "0:01",
      moves: 0,
    }
  },
  methods: {
    constructGrid() {
      this.grid = []
      let repeatNum = 6
      if (this.setup.grid === '4x4') repeatNum = 4

      for (let i = 0; i < repeatNum; i++) {
        let row = []
        for (let i = 0; i < repeatNum; i++) {
          row.push(1)
        }
        this.grid.push(row)
      }
    },
    resetScoring() {
      this.allPlayerScore = []

      for (let i = 0; i < this.setup.noOfPlayers; i++) {
        this.allPlayerScore.push(0)
      }
    },
    getClass(x, y) {
      let result = ""
      if (this.setup.grid === '4x4') {
        result += "four-by-four "
      } else {
        result += "six-by-six "
      }

      if (x > 3 && y > 2) {
        result += "bg-orange "
      } else if (x > 1) {
        result += "bg-idle "
      } else {
        result += "bg-black "
      }
      return result
    },
    restart() {

    },
  },
  mounted() {
    this.constructGrid()
    this.resetScoring()
  }
}
</script>

<style lang="scss">
@import "@/assets/style/variables.scss";

#game {
  padding: 1rem 8rem;
  margin: auto;
  max-width: 55rem;
  color: $black;

  #grid {
    margin-top: 2rem;
    .el-col {
      text-align: center;
      margin: 6px;
      border-radius: 50%;
      cursor: pointer;
      color: $white;
      &.four-by-four {
        width: 80px;
        height: 80px;
        line-height: 80px;
        font-size: 35px;
      }
      &.six-by-six {
        width: 50px;
        height: 50px;
        line-height: 50px;
        font-size: 23px;
      }
      &.bg-black {
        color: $black;
        >div {
          visibility: hidden;
        }
      }
      &.bg-idle {
        &:hover>div {
          visibility: hidden;
        }
      }
    }
  }

  #solo-info-row,
  #player-row {
    margin-top: 4rem;
    text-align: center;
    >.el-row>.el-col {
      margin: auto 0.8rem;
      height: 3rem;
      width: 12rem;
      border-radius: 10px;
      &:first-child { margin-left: 0 }
      &:last-child { margin-right: 0 }
      >.el-row {
        height: 100%;
        margin: 0 0.8rem;
        >span {
          font-size: 15px;
        }
      }
    }
  }

  #player-row {
    >.el-row>.el-col {
      position: relative;
      >.arrow-up {
        position: absolute;
        width: 18px;
        height: 18px;
        transform: rotate(45deg);
        top: -9px;
        left: calc(50% - 9px);
      }
      >.current-turn {
        margin-top: 1rem;
        text-align: center;
        letter-spacing: 4px;
        font-size: 10px;
      }
    }
  }
}

</style>