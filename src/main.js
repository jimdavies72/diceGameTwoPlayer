const dieImageArray = [
  "dice-roll.gif",
  "die-one.png",
  "die-two.png",
  "die-three.png",
  "die-four.png",
  "die-five.png",
  "die-six.png",
];

const soundEffectsArray = ["shakeDice.wav", "sigh.wav", "wonGame.wav"];

const btns = document.querySelectorAll(".btn");
const diceImg = document.querySelector(".dice-img");
let currentPlayer = document.querySelector(".current-player");
const twoPlayer = document.querySelector(".two-player-board");

let currentScore = 0;
const maxScore = 21;
const defaultMediaPath = "./media/";
const defaultDiceImg = `${defaultMediaPath}${dieImageArray[0]}`;

// random number generator
const getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// play audio function
const playAudio = (soundPath) => {
  const audio = new Audio(soundPath);
  audio.play();
};

// which button has been clicked
btns.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    let btnClass = e.currentTarget;
    
    if (btnClass.classList.contains("new-game-btn")){
      // New game. disable/enable buttons
      btnClass.classList.add("disabled")
      const holdRollBtns = document.querySelector(".roll-hold-btns");
      
      const gameBtns = holdRollBtns.getElementsByTagName("button");
      for(let i = 0; i <gameBtns.length; i++){
        gameBtns[i].classList.remove("disabled");
      }

    }else if (btnClass.classList.contains("roll-btn")) {
        let rollScore = rollDice();

        setTimeout(function () {
          // get the parent node of the current player so that we can manipulate its values
          const player = currentPlayer.parentNode;
          setCurrentScore(player, rollScore);

        }, 3000);  

    } else if (btnClass.classList.contains("hold-btn")) {
        //store current score to total and swap to other player
          const player = currentPlayer.parentNode;
          setTotalScore(player)
          setCurrentScore(player, 0);

        //swap current player to other player now
        let Sibling = player.nextElementSibling;
        if (player.nextElementSibling === null) {
          Sibling = player.previousElementSibling;
        }

        currentPlayer.classList.remove("current-player") 
        Sibling.querySelector(".player").classList.add("current-player")
        currentPlayer = document.querySelector(".current-player");
        currentScore = 0;


    } else if (btnClass.classList.contains("reset-btn")) {
        //reset the game board
        toggleRollNewGameBtn(btnClass, false);

        // reset game variables
        startGame(currentGameType);
        
    }
  });
});

const setCurrentScore = (player, score) =>{
  const currentScoreDisp = player
    .querySelector(".current-score-div")
    .querySelector(".current-score");
  if (score === 0){
    // score reset
    currentScore = 0
  }else {
    // add to current score
    currentScore += score;
  }  
  currentScoreDisp.innerHTML = currentScore;
}

const setTotalScore = (player) => {
  const totalScoreDisp = player
    .querySelector(".total-score-div")
    .querySelector(".total-score");
    let totalScore = parseInt(totalScoreDisp.innerHTML);
    totalScore += currentScore
  totalScoreDisp.innerHTML = totalScore;

}


// const onePlayerRules = (btnClass) => {
//   //roll dice button clicked

//   let roll = rollDice();
//   currentScore += roll;
//   setTimeout(function () {
//     let currentStatus = "";
//     if (roll === 1) {
//       // score of 1 = insta-lose

//       currentStatus = "Lost! rolled a 1";
//       playAudio(`${defaultMediaPath}${soundEffectsArray[1]}`);
//       toggleRollNewGameBtn(btnClass);
//     } else if (currentScore >= 21) {
//       // win!

//       scoreDisplay.textContent = `Score: ${currentScore}`;
//       currentStatus = "wins!";
//       playAudio(`${defaultMediaPath}${soundEffectsArray[2]}`);
//       toggleRollNewGameBtn(btnClass);
//     } else {
//       // we continue...

//       currentStatus = "Playing...";
//       scoreDisplay.textContent = `Score: ${currentScore}`;
//     }
//     gameStatus.textContent = currentStatus;
//   }, 3000);
// };

const rollDice = () => {
  let score = 0;
  
  score = getRandomInt(1, 6);
  
  // remove the img element if it exists and replace with dice roll gif
  resetDiceImg();
   displayDiceImg(`${defaultMediaPath}${dieImageArray[0]}`);

  const audio = new Audio(`${defaultMediaPath}${soundEffectsArray[0]}`);
  audio.play();
  audio.addEventListener("ended", () => {
    audio.currentTime = 0;
    resetDiceImg();
    displayDiceImg(`${defaultMediaPath}${dieImageArray[score]}`);
  });

  return score;
};

const toggleRollNewGameBtn = (btn, isResetBtn = true) => {
  // during the game the button will be 'roll'
  // at the end of the game either loss or win then the
  // button will become a reset button
  if (isResetBtn) {
    // becomes a reset button
    btn.innerHTML = "New Game";
    btn.classList.remove("roll-btn");
    btn.classList.add("reset-btn");
  } else {
    // becomes a roll button
    btn.innerHTML = "Roll";
    btn.classList.remove("reset-btn");
    btn.classList.add("roll-btn");
  }
};


const initDiceImg = () => {
  
  resetDiceImg();
  displayDiceImg(defaultDiceImg);
}

const resetDiceImg = () => {
  //removes any existing images
  if (diceImg.hasChildNodes()) {
    diceImg.querySelectorAll("*").forEach((n) => n.remove());
  }
};

const displayDiceImg = (src) => {
  let img = document.createElement("img");
  img.src = src;
  diceImg.appendChild(img);
  
};

// starts or resets the game variables to init
const NewGame = () => {
  currentScore = 0;
  initDiceImg();
};

// initiate a new game
NewGame();

