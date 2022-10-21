
const gameContainer = document.getElementById("game");
const topScoreCounter = document.querySelector('#top-score');

document.querySelector("#start-button").addEventListener("click", function(event){
  gameStart();
})
document.querySelector('#difficulty').addEventListener("change", function(event) {
  document.querySelector('#top-score').innerText = topScore[event.target.value];
})


let flipped;
let colorOne;
let colorTwo;
let flips;
let tries = 0;
let numberOfCards;
//let timer;
let topScore = JSON.parse(localStorage.getItem('topScore'));
if (topScore === null) {
  topScore = ["--", "--", "--"];
}
let difficulty;

topScoreCounter.innerText= topScore[0]



const COLORSeasy = [
  "red",
  "green",
  "yellow",
  "purple",
  "red",
  "green",
  "yellow",
  "purple"
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
  "teal"
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
  "darkBlue"
]

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
    cardBack.setAttribute("data-color", color)
    cardBack.addEventListener("click", flipCard);
    
    newCard.classList.add("card", "visible");

    newCard.append(cardBack);
    newCard.append(cardFront);
    gameContainer.append(newCard);
  }
}


function gameStart() {
  //timer = 100;
  let shuffledColors;
  difficulty = document.getElementById("difficulty").value;
  clearTheTable(gameContainer);
  document.querySelector("button").innerText = "RESTART";
  
  if(difficulty == "0"){
    gameContainer.classList.remove("hard", "normal");
    gameContainer.classList.add("easy");
    shuffledColors = shuffle(COLORSeasy);
    numberOfCards = COLORSeasy.length;
    topScoreCounter.innerText = topScore[0];
  } else if(difficulty == "1"){
    gameContainer.classList.remove("hard", "easy");
    gameContainer.classList.add("normal");
    shuffledColors = shuffle(COLORSnormal);
    numberOfCards = COLORSnormal.length;
    topScoreCounter.innerText = topScore[1];
  } else if(difficulty == "2"){
    gameContainer.classList.add("hard");
    gameContainer.classList.remove("easy", "normal")
    shuffledColors = shuffle(COLORShard);
    numberOfCards = COLORShard.length;
    topScoreCounter.innerText = topScore[2];
  }
  createDivsForColors(shuffledColors);
  setTimeout(function() {
    let sneekPeeks = document.querySelectorAll(".card");
    for (sneekPeek of sneekPeeks) {
      sneekPeek.classList.remove("visible");
    }
  }, 750)
}


function clearTheTable(parent) {
  flipped = 0;
  flips = 0;
  tries = 0;
  topScoreCounter.innerText= topScore[difficulty];
  document.querySelector("#tries").innerText = `${tries}`;
  document.querySelector("button").innerText = "START GAME";
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  };
}


function flipCard(event) {
  flips += 1
  flipped += 1
  event.target.parentElement.classList.add("visible");
  if (flips < 2) {
    colorOne = event.target.dataset.color;
  } else {
    colorTwo = event.target.dataset.color;
    checkFlippedCards(colorOne, colorTwo);
  }
}


function checkFlippedCards(cardOne, cardTwo) {
  const triesCounter = document.querySelector('#tries');
  if (colorOne === colorTwo){
    tries += 1;
    triesCounter.innerText = `${tries}`;
    const matchedCards = document.querySelectorAll(".visible");
    for (matchedCard of matchedCards) {
      matchedCard.classList.add("matched");
      matchedCard.classList.remove("visible");
    }
    flips = 0;
    if (flipped === numberOfCards) {
      victory()
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
      const visibleCards = document.querySelectorAll(".visible");
      for (clickBlocker of clickBlockers) {
        clickBlocker.classList.remove("pause");
      }
      for (visibleCard of visibleCards) {
        visibleCard.classList.remove("visible");
      }}, 1000);
    flipped -= 2;
  }
}


function victory() {
  winWindow = document.querySelector("#win");
  winWindow.classList.add("visible");
  document.querySelector("#new-record").classList.add("no-display");
  document.querySelector("#winning-text").innerText = `In ${tries} attempts.`;
  if (difficulty == "0" && (tries < topScore[0] || topScore[0] == "--")){
    newRecord(0);
  } else if (difficulty == "1" && (tries < topScore[1] || topScore[1] == "--")){
    newRecord(1);
  } else if (difficulty == "2" && (tries < topScore[2] || topScore[2] == "--")){
    newRecord(2);
  }
  setTimeout(function(){
    winWindow.addEventListener("click", function(){
      clearTheTable(gameContainer);
      winWindow.classList.remove("visible");
    });
  }, 2000);
}

function newRecord(index){
  topScore.splice(index, 1, tries);
  document.querySelector("#new-record").classList.remove("no-display");
  localStorage.setItem('topScore', JSON.stringify(topScore));
}

function lose() {
  //timer= 100;
  loseWindow = document.querySelector("#lose");
  loseWindow.classList.add("visible");
  setTimeout(function(){
    loseWindow.addEventListener("click", function(){
      clearTheTable(gameContainer);
      loseWindow.classList.remove("visible");
    });
  }, 2000);
}