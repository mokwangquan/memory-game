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
          @click.native="handleClick(x, y)"
        >
          <div>
            {{ col }}
          </div>
        </el-col>
      </el-row>
    </div>

    <div v-if="!isSolo" id="player-row">
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
            <h2>{{ formattedTime }}</h2>
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
import moment from "moment"
export default {
  name: "Game",
  props: {
    setup: { type: Object, required: true }
  },
  data() {
    return {
      grid: [],
      intervalId: null,
      moves: 0,
      actionIndex: 0,
      firstClickedXY: [],
      secondClickedXY: [],
      successNumList: [],
      // Solo
      timeElapse: moment.duration(0, "s"),
      // Multiplayer
      allPlayerScore: [],
      currentPlayerIndex: 0,

    }
  },
  computed: {
    formattedTime() {
      return moment.utc(this.timeElapse.asMilliseconds()).format("m:ss");
    },
    isSolo() {
      return this.grid.noOfPlayers === 1
    }
  },
  watch: {
    successNumList: {
      handler(list) {
        let num = 6
        if (this.setup.grid === '4x4') num = 4
        if (list.length === (num*2)) {
          this.handleGameOver()
        }
      }, deep: true
    }
  },
  methods: {
    constructGrid() {
      this.grid = []
      let numVault = []
      let repeatNum = 6
      if (this.setup.grid === '4x4') repeatNum = 4

      let nextNum = 1
      for (let i = 0; i < (repeatNum * 2); i++) {
        numVault.push(nextNum)
        numVault.push(nextNum)
        nextNum++
      }

      numVault = this.shuffleList(numVault)
      numVault = this.shuffleList(numVault) // twice better :D

      for (let i = 0; i < repeatNum; i++) {
        let row = []
        for (let i = 0; i < repeatNum; i++) {
          row.push(numVault.pop())
        }
        this.grid.push(row)
      }
    },
    shuffleList(array) {
      let currentIndex = array.length,  randomIndex;

      // While there remain elements to shuffle.
      while (currentIndex != 0) {

        // Pick a remaining element.
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
          array[randomIndex], array[currentIndex]];
      }

      return array;
    },
    resetScoring() {
      this.allPlayerScore = []

      for (let i = 0; i < this.setup.noOfPlayers; i++) {
        this.allPlayerScore.push(0)
      }
    },
    handleClick(x, y) {
      const isSucceed = this.successNumList.find(el => el == this.grid[x][y]) != null
      if (isSucceed) return

      if (this.actionIndex === 0) {
        this.firstClickedXY = [x, y]
        this.actionIndex = 1
      
      // repeat
      } else if (this.actionIndex === 1) {
        this.secondClickedXY = [x, y]
        this.actionIndex = 2
        this.moves++
        this.checkMatched()

        if (this.isSolo && this.intervalId == null) this.startTimer()

        if (!this.isSolo) {
          this.changePlayer()
        }

        setTimeout(() => {
          this.firstClickedXY = []
          this.secondClickedXY = []
          this.actionIndex = 0
        }, 500)
      }
    },
    checkMatched() {
      const num1 = this.grid[this.firstClickedXY[0]][this.firstClickedXY[1]]
      const num2 = this.grid[this.secondClickedXY[0]][this.secondClickedXY[1]]
      if (num1 === num2) {
        this.successNumList.push(num1)
        if (!this.isSolo) {
          this.allPlayerScore[this.currentPlayerIndex]++
          // TODO: add animation gained point
        }
      }
    },
    changePlayer() {
      this.currentPlayerIndex++
      if ((this.currentPlayerIndex+1) > this.setup.noOfPlayers) {
        this.currentPlayerIndex = 0
      }
    },
    getClass(x, y) {
      let result = ""
      if (this.setup.grid === '4x4') {
        result += "four-by-four "
      } else {
        result += "six-by-six "
      }

      const isClicked = (this.firstClickedXY[0] === x && this.firstClickedXY[1] === y)
                        || (this.secondClickedXY[0] === x && this.secondClickedXY[1] === y)
      const isSuccess = this.successNumList.find(el => el == this.grid[x][y]) != null

      if (isClicked) {
        result += "bg-orange "
      } else if (isSuccess) {
        result += "bg-idle "
      } else {
        result += "bg-black "
      }

      if (this.actionIndex === 2) {
        result += "no-hover "
      }
      return result
    },
    startTimer() {
      if (this.intervalId != null) {
        clearInterval(this.intervalId)
      }
      this.timeElapse = moment.duration(0, "s")
      this.intervalId = setInterval(() => {
        this.timeElapse.add(1, "s")
      }, 1000);
    },
    stopTimer() {
      clearInterval(this.intervalId);
      this.intervalId = null
    },
    handleGameOver() {
      console.log("END")
      //END
    },
    restart() {
      //TODO
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
          // color: $white;
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