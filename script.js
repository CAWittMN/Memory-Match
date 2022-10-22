const gameContainer = document.getElementById("game");
const topScoreCounter = document.querySelector("#top-score");
const startButton = document.querySelector("button");

const backgroundMusic = new Audio("sounds/bgmusic.mp3");
backgroundMusic.volume = 0.2;
const noMatchSound = new Audio("sounds/nomatch.wav");
const matchSound = new Audio("sounds/match.wav");
const startSound = new Audio("sounds/start.wav");
const victorySound = new Audio("sounds/victory.wav");
const newRecordSound = new Audio("sounds/newrecord.mp3");
const clearSound = new Audio("sounds/clear.wav");

startButton.addEventListener("click", function (event) {
  gameStart();
});
document
  .querySelector("#difficulty")
  .addEventListener("change", function (event) {
    topScoreCounter.innerText = topScore[event.target.value];
  });

let cards;
let flipped;
let colorOne;
let colorTwo;
let flips;
let tries = 0;
let numberOfCards;
let topScore = JSON.parse(localStorage.getItem("topScore"));
if (topScore === null) {
  topScore = ["--", "--", "--"];
}
let difficulty;

topScoreCounter.innerText = topScore[0];

const COLORSeasy = [
  "red",
  "green",
  "yellow",
  "purple",
  "red",
  "green",
  "yellow",
  "purple",
];

const COLORSnormal = [
  "red",
  "blue",
  "green",
  "yellow",
  "purple",
  "brown",
  "pink",
  "teal",
  "red",
  "blue",
  "green",
  "yellow",
  "purple",
  "brown",
  "pink",
  "teal",
];

const COLORShard = [
  "red",
  "blue",
  "green",
  "yellow",
  "purple",
  "brown",
  "pink",
  "teal",
  "red",
  "blue",
  "green",
  "yellow",
  "purple",
  "brown",
  "pink",
  "teal",
  "black",
  "black",
  "white",
  "white",
  "darkGreen",
  "darkGreen",
  "darkBlue",
  "darkBlue",
];

function shuffle(array) {
  let counter = array.length;
  while (counter > 0) {
    let index = Math.floor(Math.random() * counter);
    counter--;
    let temp = array[counter];
    array[counter] = array[index];
    array[index] = temp;
  }
  return array;
}

function createDivsForColors(colorArray) {
  for (let color of colorArray) {
    const newCard = document.createElement("div");
    const cardFront = document.createElement("div");
    const cardBack = document.createElement("div");

    cardBack.classList.add("cardBack", "cardFace");
    cardFront.classList.add(color, "cardFront", "cardFace");
    cardBack.setAttribute("data-color", color);
    cardBack.addEventListener("click", flipCard);

    newCard.classList.add("card", "visible");

    newCard.append(cardBack);
    newCard.append(cardFront);
    gameContainer.append(newCard);
  }
}

function gameStart() {
  backgroundMusic.play();
  startSound.play();
  document.querySelector("h1").classList.add("move");
  let shuffledColors;
  difficulty = document.getElementById("difficulty").value;
  clearTheTable(gameContainer);
  startButton.innerText = "RESTART";

  if (difficulty == "0") {
    gameContainer.classList.remove("hard", "normal");
    gameContainer.classList.add("easy");
    shuffledColors = shuffle(COLORSeasy);
    numberOfCards = COLORSeasy.length;
    topScoreCounter.innerText = topScore[0];
  } else if (difficulty == "1") {
    gameContainer.classList.remove("hard", "easy");
    gameContainer.classList.add("normal");
    shuffledColors = shuffle(COLORSnormal);
    numberOfCards = COLORSnormal.length;
    topScoreCounter.innerText = topScore[1];
  } else if (difficulty == "2") {
    gameContainer.classList.add("hard");
    gameContainer.classList.remove("easy", "normal");
    shuffledColors = shuffle(COLORShard);
    numberOfCards = COLORShard.length;
    topScoreCounter.innerText = topScore[2];
  }
  createDivsForColors(shuffledColors);
  cards = document.querySelectorAll(".card");
  gameContainer.classList.remove("hidden", "explode");
  setTimeout(function () {
    let sneekPeeks = document.querySelectorAll(".card");
    for (sneekPeek of sneekPeeks) {
      sneekPeek.classList.remove("visible");
    }
  }, 1000);
}

function clearTheTable(parent) {
  flipped = 0;
  flips = 0;
  tries = 0;
  gameContainer.classList.add("hidden")
  topScoreCounter.innerText = topScore[difficulty];
  document.querySelector("#tries").innerText = `${tries}`;
  while (parent.firstChild) {
    parent.removeChild(parent.lastChild);
  }
}

function flipCard(event) {
  const origFlip = document.getElementById("flip");
  const newFlip = origFlip.cloneNode();
  newFlip.play();
  flips += 1;
  flipped += 1;
  event.target.parentElement.classList.add("visible");
  if (flips < 2) {
    colorOne = event.target.dataset.color;
  } else {
    colorTwo = event.target.dataset.color;
    checkFlippedCards();
  }
}

function checkFlippedCards() {
  const triesCounter = document.querySelector("#tries");
  if (colorOne === colorTwo) {
    tries += 1;
    matchSound.play();
    triesCounter.innerText = `${tries}`;
    const matchedCards = document.querySelectorAll(".visible");
    for (matchedCard of matchedCards) {
      matchedCard.classList.add("matched");
      matchedCard.classList.remove("visible");
    }
    flips = 0;
    if (flipped === numberOfCards) {
      victory();
    }
  } else {
    flips = 0;
    tries += 1;
    document.querySelector("#tries").innerText = `${tries}`;
    const clickBlockers = document.querySelectorAll("div.cardBack");
    for (clickBlocker of clickBlockers) {
      clickBlocker.classList.add("pause");
    }
    setTimeout(function () {
      noMatchSound.play();
      const visibleCards = document.querySelectorAll(".visible");
      for (clickBlocker of clickBlockers) {
        clickBlocker.classList.remove("pause");
      }
      for (visibleCard of visibleCards) {
        visibleCard.classList.remove("visible");
      }
    }, 1000);
    flipped -= 2;
  }
}

function victory() {
  victorySound.play();
  winWindow = document.querySelector("#win");
  winWindow.classList.add("visible");
  document.querySelector("#new-record").classList.add("no-display");
  document.querySelector("#winning-text").innerText = `In ${tries} tries.`;
  if (difficulty == "0" && (tries < topScore[0] || topScore[0] == "--")) {
    newRecord(0);
  } else if (
    difficulty == "1" &&
    (tries < topScore[1] || topScore[1] == "--")
  ) {
    newRecord(1);
  } else if (
    difficulty == "2" &&
    (tries < topScore[2] || topScore[2] == "--")
  ) {
    newRecord(2);
  }
  setTimeout(function () {
    winWindow.addEventListener("click", function () {
      for (card of cards) {
        card.classList.add("explode");
      }
      clearSound.play();
      startButton.innerText = "START GAME";
      document.querySelector("h1").classList.remove("move");
      winWindow.classList.remove("visible");
      setTimeout(function () {
        clearTheTable(gameContainer);
      }, 1000);
    });
  }, 2000);
}

function newRecord(index) {
  newRecordSound.play();
  topScore.splice(index, 1, tries);
  document.querySelector("#new-record").classList.remove("no-display");
  localStorage.setItem("topScore", JSON.stringify(topScore));
}

/*function lose() {
  //timer= 100;
  loseWindow = document.querySelector("#lose");
  loseWindow.classList.add("visible");
  setTimeout(function () {
    loseWindow.addEventListener("click", function () {
      clearTheTable(gameContainer);
      loseWindow.classList.remove("visible");
    });
  }, 2000);
}*/
