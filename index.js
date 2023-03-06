const keyboard = document.querySelector(".keyboard-area");
let puzzleWord;
let attemptCount = 1;
let letterCount = 0;
let attemptArr = [];
const randWord = fetch('https://random-word-api.herokuapp.com/word?length=5')
.then((res) => res.json())
.then((data) => {
    puzzleWord = data[0].toUpperCase().split("");
})
.catch((err) => console.error(err))


function buildKeyboard() { 
    const keyboardRows = document.querySelectorAll(".keyboard-row");
    const keyboardKeys = [ 
        ['Q','W','E','R','T','Y','U','I','O','P'],
        ['A','S','D','F','G','H','J','K','L'],
        ['ENTER','Z','X','C','V','B','N','M','\u2190']
    ];
    for(let i = 0; i < keyboardRows.length; i++) {
        keyboardKeys[i].map((ele, idx) => {
            let newDiv = document.createElement("div");
            newDiv.innerText = ele;
            newDiv.className = "key-button"
            newDiv.id = ele;
            keyboardRows[i].appendChild(newDiv);
        })
    }
}
buildKeyboard();

function guessAttempt() {
    console.log("guess");
}

function removeLetter() {
    console.log("remove");
}

function addLetter(eventText) {
    console.log(eventText);
    attemptArr.push(eventText);
    letterCount++;
    let square = document.querySelector(`.ls${attemptCount}-${letterCount}`).innerText = eventText;
}

function selectLetter(event){
    if(event.target.className != "key-button" || attemptArr.length >= 5) {
        return;
    }
    if(event.target.innerText == "ENTER") {
        guessAttempt();
    } else if (event.target.innerText == '\u2190') {
        removeLetter();
    } else {
        addLetter(event.target.innerText);
    }
}

document.querySelector(".keyboard-area").addEventListener("click", selectLetter);