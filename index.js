const keyboard = document.querySelector(".keyboard-area");
let puzzleWord;
let attemptCount = 1;
let letterCount = 0;
let valid = false;
let attemptArr = [];
const randWord = fetch("https://random-word-api.herokuapp.com/word?length=5")
  .then((res) => res.json())
  .then((data) => {
    puzzleWord = data[0].toUpperCase().split("");
  })
  .catch((err) => console.error(err));

function buildKeyboard() {
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
buildKeyboard();

function guessAttempt() {
  if (letterCount < 5) {
    return;
  }
  if (!valid) {
    return;
  } else {
    compare();
    letterCount = 0;
    attemptCount++;
    attemptArr = [];
    valid = false;
  }
}

function compare() {
    attemptArr.map((ele, index) => {
        if(puzzleWord[index] == ele) {
            document.querySelector(`.ls${attemptCount}-${index + 1}`).classList.add("match");
            document.querySelector(`#${ele}`).classList.add(`match`);
        } else if (puzzleWord.includes(ele)) {
            document.querySelector(`.ls${attemptCount}-${index + 1}`).classList.add("contains");
            document.querySelector(`#${ele}`).classList.add(`contains`);
        } else if (!puzzleWord.includes(ele)) {
            document.querySelector(`#${ele}`).classList.add(`not-contains`);
        }
        
        
    })
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
  if (confirmWord.title == "No Definitions Found") {
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
    console.log(event.target.className)
  if (event.target.innerText == "\u2190") {
    removeLetter();
  } else if (event.target.innerText == "ENTER") {
    guessAttempt();
  }
  //catches if current attempt line is full, or if a keyboard button is not hit
  else if (!event.target.className.includes("key-button") || attemptArr.length >= 5) {
    return;
  }

  //adds letter to the guess boxes
  else {
    addLetter(event.target.innerText);
  }
}

document
  .querySelector(".keyboard-area")
  .addEventListener("click", selectLetter);
