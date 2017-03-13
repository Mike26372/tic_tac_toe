var Promise = require('bluebird');
// Add the Async suffix to method calls following promisification
var prompt = Promise.promisifyAll(require('prompt'));


class TicTacToe {
  constructor() {
    this.board = {
      '1': 0,
      '2': 0,
      '3': 0,
      '4': 0,
      '5': 0,
      '6': 0,
      '7': 0,
      '8': 0,
      '9': 0
    };

    this.winningCombinations = [
      ['1', '2', '3'],
      ['4', '5', '6'],
      ['7', '8', '9'],
      ['1', '4', '7'],
      ['2', '5', '8'],
      ['3', '6', '9'],
      ['1', '5', '9'],
      ['3', '5', '7'],
    ];

    this.player1 = null;
    this.player2 = null;
    // Sets current player to true
      // True equals player 1, false equals player 2
      // Boolean allows for toggling
    this.currentPlayer = true;
    this.player1Marker = 'X';
    this.player2Marker = 'O';
    this.errors = {
      1: 'Spot Chosen Error'
    };
  }

  printBoard () {
    var keys = Object.keys(this.board);
    var length = keys.length;
    var newBoard = [];
    for (var i = 0; i < 3; i++) {
      let row = [];
      for (var j = 0; j < 3; j++) {
        let currentKey = j + (i * 3);
        if (this.board[keys[currentKey]]) {
          row.push(this.board[keys[j + (i * 3)]]);
        } else {
          row.push(currentKey + 1);
        }
      }
      newBoard.push(row);
    }
    newBoard.forEach((row) => {
      console.log(row);
    });
  }

  displayCurrentPlayer() {
    let { currentPlayer, player1, player2 } = this;

    if (currentPlayer) {
      console.log(`Player One: ${player1}'s turn`);
    } else {
      console.log(`Player Two: ${player2}'s turn`);
    }
  }

  placeMarker() {
    let { currentPlayer, player1, player2, player1Marker, player2Marker, board, errors } = this;
    let playerInTurn = currentPlayer ? player1 : player2;
    let marker = currentPlayer ? player1Marker : player2Marker;
    console.log(`${playerInTurn}, please choose a spot`);
    return new Promise((resolve, reject) => {
      prompt.getAsync(['spot'])
      .then(result => {
        let { spot } = result;
        console.log(`Spot Chosen: ${result.spot}`);
        // Check if spot is taken
        if (board[spot]) {
          // If spot taken, ask them to pick another spot
            // Use reject to skip next steps
          console.error('Spot chosen has already been filled, please choose another spot');
          reject(errors[1]);
        } else {
          // If spot is not taken, mark the spot with the current player's marker
          board[spot] = marker;
        }
        resolve(result.spot);
      })
      .catch(err => {
        reject(err);
      });
      
    });
  }

  checkIfWinner() {
    let { currentPlayer, player1, player2, player1Marker, player2Marker, board, winningCombinations } = this;
    let playerInTurn = currentPlayer ? player1 : player2;
    let marker = currentPlayer ? player1Marker : player2Marker;

    return new Promise((resolve, reject) => {
      // Map each combination and reduce if all spots are filled with current marker
      // Then reduce mapped combos into one boolean for vertification whether a winner exists or not
      var winner = winningCombinations.reduce((acc, combo) => {
        return acc || combo.map(spot => {
          if (board[spot] === marker) {
            return true;
          } else {
            return false;
          }
        }).reduce((acc, curr) => {
          return acc && curr;
        }, true);
      }, false);

      resolve(winner);
    });
  }

  startNextTurn() {
    let { currentPlayer, player1, player2, player1Marker, player2Marker, board, winningCombinations } = this;
    let playerInTurn = currentPlayer ? player1 : player2;
    let marker = currentPlayer ? player1Marker : player2Marker;
    this.displayCurrentPlayer();
    this.printBoard();
    this.placeMarker()
    .then(spot => {
      return this.checkIfWinner();
    })
    .then(winner => {
      if (winner) {
        console.log('WINNER WINNER!');
        console.log(`${playerInTurn} has won the game!`);
      } else {
        this.currentPlayer = !currentPlayer;
        this.startNextTurn();
      }
    })
    .catch(err => {
      let {errors} = this;
      if (errors[1] === err) {
        this.startNextTurn();
      } else {
        console.error('GAME ERROR');
        console.error(err);
      }
    });
  }

  startGame() {
    prompt.getAsync(['player1', 'player2'])
    .then(result => {
      this.player1 = result.player1;
      this.player2 = result.player2;
      this.startNextTurn();
    })
    .catch(err => {
      console.error('GAME CANCELLED!');
    });
  }
}

var tictactoe = new TicTacToe();
tictactoe.startGame();

