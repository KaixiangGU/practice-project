const xPlayer = "x";
const oPlayer = "o";
const wrapper = document.querySelector(".wrapper");
const cells = document.querySelectorAll(".cell");
const resultBoard = document.querySelector(".black-background");
const resultText = document.querySelector(".result-board");
const playAgainBtn = document.querySelector(".play-again-button");
const WINNING_COMBINATIONS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

let xTurn = true;

startGame();
playAgainBtn.addEventListener("click", startGame);

function startGame() {
  xTurn = true;
  cells.forEach((cell) => {
    cell.classList.remove(xPlayer);
    cell.classList.remove(oPlayer);
    //each cell can be clicked only once
    //if clickEvent with once parameter, it will be removed once invoked
    cell.addEventListener("click", clickEvent, { once: true });
  });
  resultBoard.classList.remove("show");
  setHoverEffect();
}

//we should check 1. either x or o win 2. game is draw
//on each click event, if none of these happen swap player and set hover effect
function clickEvent(e) {
  const cell = e.target;
  const currentPlayer = xTurn ? xPlayer : oPlayer;
  placeMarker(cell, currentPlayer);

  if (isWin(currentPlayer)) {
    showResult(currentPlayer);
  } else if (isDraw()) {
    showResult(currentPlayer);
  } else {
    swapMarker();
    setHoverEffect();
  }
}

function placeMarker(cell, currentPlayer) {
  cell.classList.add(currentPlayer);
}

function swapMarker() {
  xTurn = !xTurn;
}

function setHoverEffect() {
  wrapper.classList.remove(xPlayer);
  wrapper.classList.remove(oPlayer);
  xTurn ? wrapper.classList.add(xPlayer) : wrapper.classList.add(oPlayer);
}

function isWin(currentPlayer) {
  return WINNING_COMBINATIONS.some((eachCombination) => {
    return eachCombination.every((index) => {
      return cells[index].classList.contains(currentPlayer);
    });
  });
}

function isDraw() {
  return [...cells].every((cell) => {
    return cell.classList.contains(xPlayer) || cell.classList.contains(oPlayer);
  });
}

function showResult(currentPlayer) {
  resultBoard.classList.add("show");
  if (isWin(currentPlayer)) {
    currentPlayer == xPlayer ? (resultText.innerText = "X wins!") : (resultText.innerText = "O wins!");
  }
  if (isDraw()) {
    resultText.innerText = "Draw!";
  }
}
