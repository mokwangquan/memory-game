<template>
  <div id="game">
    <el-row type="flex" justify="space-between" align="middle">
      <h2>memory</h2>
      <div v-if="!isMobile">
        <el-button class="bg-orange text-white w-auto" @click="restart()">Restart</el-button>
        <el-button class="bg-idle text-black w-auto" @click="$emit('exit')">New Game</el-button>
      </div>
      <div v-else>
        <el-button class="bg-orange text-white w-auto menu-button" @click="openMenu = !openMenu">Menu</el-button>
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
          <div v-if="setup.theme === 'icons'">
            <i :class="icons[col-1]" />
          </div>
          <div v-else>
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
          :class="getPlayerClass(index)"
        >
          <div 
            v-if="currentPlayerIndex === index" 
            class="arrow-up bg-orange"
          >
            &nbsp;
          </div>
          <el-row
            :type="isTablet ? '' : 'flex'"
            justify="space-between"
            align="middle"
            class="block no-hover bg-idle"
          >
            <span>{{ isMobile ? 'P' : 'Player' }} {{ index + 1 }}</span>
            <h2>{{ score }}</h2>
          </el-row>
          <div 
            v-if="!isTablet && currentPlayerIndex === index" 
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
            class="block no-hover bg-idle"
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
            class="block no-hover bg-idle"
          >
            <span>Moves</span>
            <h2>{{ moves }}</h2>
          </el-row>
        </el-col>
      </el-row>
    </div>

    <!-- Game over dialog -->
    <el-dialog
      id="game-over-dialog"
      :visible.sync="isGameOver"
      :width="isTablet ? '90%' : '35%'"
      :show-close="false"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
    >
      <h1 v-if="isSolo">You did it!</h1>
      <h1 v-else>{{ winnerIndexList.length > 1 ? 'It\'s a tie!' : `Player ${winnerIndexList[0] + 1} Wins!` }}</h1>

      <p v-if="isSolo">Game over! Here's how you got on...</p>
      <p v-else>Game over! Here are the results...</p>

      <div class="summary" v-if="isSolo">
        <el-row
          type="flex"
          justify="space-between"
          align="middle"
          class="block no-hover bg-idle"
        >
          <span>Time Elapsed</span>
          <h2>{{ formattedTime }}</h2>
        </el-row>
        <el-row
          type="flex"
          justify="space-between"
          align="middle"
          class="block no-hover bg-idle"
        >
          <span>Moves Taken</span>
          <h2>{{ moves }} Moves</h2>
        </el-row>
      </div>

      <div class="summary" v-else>
        <el-row
          type="flex"
          justify="space-between"
          align="middle"
          class="no-hover"
          :class="isWinner ? 'block bg-black text-white bounce-success' : 'block bg-idle'"
          v-for="{score, index, isWinner} in allPlayerSummaryInOrder"
          :key="'score_'+index"
        >
          <span>Player {{ index + 1 }} {{ isWinner ? '(Winner!)' : '' }}</span>
          <h2>{{ score }} Pairs</h2>
        </el-row>
      </div>

      <el-row class="action-button-row" :type="isMobile ? '' : 'flex'" justify="space-between" align="middle">
        <el-button class="bg-orange text-white" @click="restart()">Restart</el-button>
        <el-button class="bg-idle text-black" @click="$emit('exit')">Setup New Game</el-button>
      </el-row>

    </el-dialog>

    <!-- Mobile view menu -->
    <el-dialog
      id="menu-dialog"
      :visible.sync="openMenu"
      width="90%"
      :show-close="false"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
    >
      <el-button class="bg-orange text-white" @click="restart()">Restart</el-button>
      <el-button class="bg-idle text-black" @click="$emit('exit')">Setup New Game</el-button>
      <el-button class="bg-idle text-black" @click="openMenu = false">Resume Game</el-button>
    </el-dialog>
  </div>
</template>

<script>
import moment from "moment"
import cloneDeep from "lodash/cloneDeep"
import icons from "@/constants/icons"

export default {
  name: "Game",
  props: {
    setup: { type: Object, required: true },
    isMobile: { type: Boolean, required: true },
    isTablet: { type: Boolean, required: true },
  },
  data() {
    return {
      openMenu: false,
      grid: [],
      intervalId: null,
      moves: 0,
      actionIndex: 0,
      firstClickedXY: [],
      secondClickedXY: [],
      successNumList: [],
      shakeSuccessPlayerIndex: false,
      isGameOver: false,
      // Solo
      timeElapse: moment.duration(0, "s"),
      // Multiplayer
      allPlayerScore: [],
      allPlayerSummaryInOrder: [],
      currentPlayerIndex: 0,
      winnerIndexList: [],
      icons,
    }
  },
  computed: {
    formattedTime() {
      return moment.utc(this.timeElapse.asMilliseconds()).format("m:ss");
    },
    isSolo() {
      return this.setup.noOfPlayers === 1
    },
  },
  watch: {
    successNumList: {
      handler(list) {
        let num = 6
        if (this.setup.grid === '4x4') num = 4
        if (list.length === ((num*num) / 2)) {
          this.handleGameOver()
        }
      }, deep: true
    },
    openMenu(isOpen) {
      if (this.isSolo && this.moves !== 0) {
        // only pause/resume the game if solo mode and game started
        if (isOpen) this.stopTimer()
        else this.startTimer(false)
      }
    }
  },
  methods: {
    constructGrid() {
      this.grid = []
      this.actionIndex = 0
      this.successNumList = []
      this.firstClickedXY = []
      this.secondClickedXY = []

      let numVault = []
      let colNum = 6
      if (this.setup.grid === '4x4') colNum = 4

      let repeatNum = (colNum * colNum) / 2
      let nextNum = 1
      for (let i = 0; i < repeatNum; i++) {
        numVault.push(nextNum)
        numVault.push(nextNum)
        nextNum++
      }

      numVault = this.shuffleList(numVault)
      numVault = this.shuffleList(numVault) // twice better :D

      for (let i = 0; i < colNum; i++) {
        let row = []
        for (let i = 0; i < colNum; i++) {
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
      // Solo
      this.timeElapse = moment.duration(0, "s")
      this.moves = 0

      // Multiplayer
      this.allPlayerSummaryInOrder = []
      this.currentPlayerIndex = 0
      this.winnerIndexList = []

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
        this.secondClickedXY = []
        this.actionIndex = 1
      
      // repeat
      } else if (this.actionIndex === 1) {
        if (this.firstClickedXY[0] === x && this.firstClickedXY[1] === y) {
          return
        }
        this.secondClickedXY = [x, y]
        this.actionIndex = 2
        this.moves++
        this.checkMatched()

        if (this.isSolo && this.intervalId == null) this.startTimer()

        if (!this.isSolo) {
          this.changePlayer()
        }

        this.actionIndex = 0
        setTimeout(() => {
          if (this.actionIndex === 0) {
            this.firstClickedXY = []
            this.secondClickedXY = []
          }
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
          this.shakeSuccessPlayerIndex = this.currentPlayerIndex
          setTimeout(() => this.shakeSuccessPlayerIndex = null, 1000)
        }
      }
    },
    changePlayer() {
      this.currentPlayerIndex++
      if ((this.currentPlayerIndex+1) > this.setup.noOfPlayers) {
        this.currentPlayerIndex = 0
      }
    },
    getPlayerClass(index) {
      let result = 'bg-idle text-light-grey '
      if (this.currentPlayerIndex === index) {
        result = 'bg-orange text-white slide-up '
      }
      if (this.shakeSuccessPlayerIndex === index) {
        result += 'bounce-success '
      }
      return result
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
        result += "bg-orange game-flip-left "
      } else if (isSuccess) {
        result += "bg-idle "
      } else {
        result += "bg-black game-flip-right "
      }

      if (
        this.actionIndex === 2 
        || this.isMobile 
        || this.isTablet
      ) {
        result += "no-hover "
      }

      return result
    },
    startTimer(reset = true) {
      if (this.intervalId != null) {
        clearInterval(this.intervalId)
      }
      if (reset) this.timeElapse = moment.duration(0, "s")
      this.intervalId = setInterval(() => {
        this.timeElapse.add(1, "s")
      }, 1000);
    },
    stopTimer() {
      clearInterval(this.intervalId);
      this.intervalId = null
    },
    handleGameOver() {
      // Solo
      this.stopTimer()

      // Multiplayer
      const sorted = cloneDeep(this.allPlayerScore).sort()
      const highest = sorted[sorted.length-1]

      this.allPlayerScore.forEach((score, index) => {
        let player = {
          score, index,
          isWinner: false
        }
        if (score === highest) {
          this.winnerIndexList.push(index)
          player.isWinner = true
        }
        this.allPlayerSummaryInOrder.push(player)
      })

      this.allPlayerSummaryInOrder.sort((a, b) => b.score - a.score)

      this.isGameOver = true
    },
    restart() {
      this.constructGrid()
      this.resetScoring()
      this.isGameOver = false
      this.openMenu = false
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

  .block {
    height: 4rem;
    border-radius: 10px;
  }

  #solo-info-row,
  #player-row {
    margin-top: 4rem;
    text-align: center;
    >.el-row>.el-col {
      @extend .block;
      margin: auto 0.8rem;
      width: 12rem;
      &:first-child { margin-left: 0 }
      &:last-child { margin-right: 0 }
      &.bg-orange .block {
        background-color: $orange !important;
      }
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

  #game-over-dialog {
    .el-dialog {
      padding: 30px;
      .el-dialog__header { display: none }
      .el-dialog__body {
        text-align: center;
        h1 { margin-top: 0 }
        .summary {
          margin-top: 2rem;
          .block {
            margin-top: 1rem;
            padding: 1rem;
          }
        }
        .action-button-row {
          margin-top: 2rem;
        }
      }
    }
  }

}

.tablet #game {
  padding: 1rem;
  max-width: 95vw;
  #grid {
    margin-top: 5rem;
    margin-bottom: 7rem;
    .el-col.bg-black { @extend .no-hover }
    .el-col.bg-idle:hover>div { visibility: visible }
    .el-col {
      &.four-by-four {
        width: 120px;
        height: 120px;
        line-height: 120px;
        font-size: 50px;
      }
      &.six-by-six {
        width: 90px;
        height: 90px;
        line-height: 90px;
        font-size: 40px;
      }
    }
  }
  .block {
    padding: 0.25rem;
    height: 5rem;
    text-align: left;
    h2 {
      margin-top: 0.1rem;
    }
  }
  .summary .block {
    span {
      font-size: 22px;
    }
    h2 {
      margin: auto 0;
    }
  }
}

.mobile #game {
  padding: 0.1rem;
  max-width: 95vw;
  max-height: 95vh;
  #grid {
    margin-top: 0.5rem;
    .el-col.bg-black { @extend .no-hover }
    .el-col.bg-idle:hover>div { visibility: visible }
  }
  .menu-button {
    margin: auto;
    margin-right: 5px;
  }
  #player-row .block h2 { margin-top: 0.1rem }
  .block {
    padding: 0.25rem;
    height: 5rem;
  }
  .summary .block {
    span {
      font-size: 22px;
    }
    h2 {
      margin: auto 0;
    }
  }
  #solo-info-row,
  #player-row {
    position: absolute;
    bottom: 1rem;
    left: 0;
    width: 100vw;
    >.el-row {
      margin: 0 5px;
    }
  }
  

  #menu-dialog {
    .el-dialog {
      .el-dialog__header { display: none }
      .el-button {
        margin: 1rem 0;
      }
    }
  }
  #game-over-dialog {
    .el-dialog {
      padding: 0;
      h1 {
        font-size: 25px;
      }
      .summary .block {
        padding: 0.5rem;
        height: 4rem;
        span {
          font-size: 18px;
        }
        h2 {
          margin: auto 0;
          font-size: 20px;
        }
      }
      .action-button-row {
        margin-top: 1rem;
        .el-button {
          margin: 0.5rem 0;
        }
      }
    }
  }
}
</style>