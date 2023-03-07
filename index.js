import { unique } from "./wordCollector.js";
const keyboard = document.querySelector(".keyboard-area");
const attemptArea = document.querySelector(".attempt-area");
let puzzleWord = "";
let attemptCount = 1;
let letterCount = 0;
let valid = false;
let attemptArr = [];
const possWords = unique;

//pulls random word from array of possible words filtered from book texts
function getWord(possWords) {
  let number = Math.floor(Math.random() * 928);
  puzzleWord = unique[number].toUpperCase().split("");
  console.log(puzzleWord)
}

function buildBoard() {
  //builds attempt cells
  for (let i = 1; i <= 6; i++) {
    const newRow = document.createElement("div");
    newRow.className = "attempt";
    for (let j = 1; j <= 5; j++) {
      const newCell = document.createElement("div");
      newCell.classList.add("ls");
      newCell.classList.add(`ls${i}-${j}`);
      newRow.appendChild(newCell);
    }
    attemptArea.appendChild(newRow);
  }

  //builds keyboard
  const keyboardRows = document.querySelectorAll(".keyboard-row");
  const keyboardKeys = [
    ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
    ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
    ["ENTER", "Z", "X", "C", "V", "B", "N", "M", "\u2190"],
  ];
  for (let i = 0; i < keyboardRows.length; i++) {
    keyboardKeys[i].map((ele) => {
      let newDiv = document.createElement("div");
      newDiv.innerText = ele;
      newDiv.className = "key-button";
      newDiv.id = ele;
      keyboardRows[i].appendChild(newDiv);
    });
  }
}

function guessAttempt() {
  //ensure 5 letters are entered
  if (letterCount < 5) {
    return;
  }
  //validity check to ensure real word entered
  if (!valid) {
    alert("not a real word");
    return;
  } else {
    //compares to change tile colors and key board colors
    compare();
    attemptCount++;
    letterCount = 0;
    valid = false;
    checkWin();
    attemptArr = [];
  }
}

function checkWin() {
  if (puzzleWord.join("") == attemptArr.join("")) {
    alert("Got it!");
    resets();
  } else if (attemptCount >= 7) {
    alert(`Loser! Secret word was ${puzzleWord.join("")}`);
    resets();
  } 
}

function resets() {
  //clears html for board rebuild to start without css class changes
  attemptArea.innerHTML = "";
  Array.from(document.getElementsByClassName("keyboard-row")).map(
    (ele) => (ele.innerHTML = "")
  );
  //restart with fresh board, on 1st attempt and new word
  buildBoard();
  attemptCount = 1;
  getWord();
}

//compares attempt with puzzleWord. Adds css properties based on matches and contains
function compare() {
  attemptArr.map((ele, index) => {
    //check for contains and placement match
    if (puzzleWord[index] == ele) {
      document
        .querySelector(`.ls${attemptCount}-${index + 1}`)
        .classList.add("flip-match");
      document.querySelector(`#${ele}`).classList.add(`match`);
      //check for contains
    } else if (puzzleWord.includes(ele)) {
      document
        .querySelector(`.ls${attemptCount}-${index + 1}`)
        .classList.add("flip-contains");
      document.querySelector(`#${ele}`).classList.add(`contains`);
      //markes keyboard letters used and not in the word
    } else if (!puzzleWord.includes(ele)) {
      document
        .querySelector(`.ls${attemptCount}-${index + 1}`)
        .classList.add("flip-not");
      document.querySelector(`#${ele}`).classList.add(`not-contains`);
    }
  });
}

//checks a 5 letter attempt against a dictionary API to see if it is a real word
async function checkValidity() {
  const attemptString = attemptArr.join("");
  let confirmWord;
  try {
    const response = await fetch(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${attemptString}`
    );
    const data = await response.json();
    confirmWord = data;
  } catch (err) {
    console.error(err);
  }
  if (confirmWord.title === "No Definitions Found") {
    valid = false;
    return;
  }
  valid = true;
}

function removeLetter() {
  //cant run operation if no letters are entered
  if (letterCount == 0) {
    return;
  }
  //identifies correct square by class using the attempt and letter counts
  document.querySelector(`.ls${attemptCount}-${letterCount}`).innerText = "";
  //moves letter counter back and removes last entry off the attempt array
  letterCount--;
  attemptArr.pop();
}

function addLetter(eventText) {
  //adds letter to the array to compare for guess
  attemptArr.push(eventText);
  //checks for validity when word length == 5. Solves for async microtask delay issue
  if (attemptArr.length == 5) {
    checkValidity();
  }
  //increases letter count to move to next available square
  letterCount++;
  //identifies correct square by class using the attempt and letter counts
  document.querySelector(`.ls${attemptCount}-${letterCount}`).innerText =
    eventText;
}

//uses event listener on keyboard area to track which buttons are pressed based on IDs
function selectLetter(event) {
  if (event.target.innerText == "\u2190") {
    removeLetter();
  } else if (event.target.innerText == "ENTER") {
    guessAttempt();
  }
  //catches if current attempt line is full, or if a keyboard button is not hit
  else if (
    !event.target.className.includes("key-button") ||
    attemptArr.length >= 5
  ) {
    return;
  }

  //adds letter to the guess boxes
  else {
    addLetter(event.target.innerText);
  }
}

buildBoard();
getWord();
document
  .querySelector(".keyboard-area")
  .addEventListener("click", selectLetter);
