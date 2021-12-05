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

// random number generator
const getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// play audio function
const playAudio = (soundPath) => {
  let sound = `${defaultMediaPath}${soundPath}`;
  const audio = new Audio(sound);
  audio.play();
};

// which button has been clicked
btns.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    let btnClass = e.currentTarget;
    
    if (btnClass.classList.contains("new-game")){
      // New game. disable/enable buttons reset to beginning
      newGame();
      // new game button state
      buttonToggle("new");
      buttonToggle("hold");

    }else if (btnClass.classList.contains("roll-btn")) {
        twoPlayerScoring();
        buttonToggle("roll")

    } else if (btnClass.classList.contains("hold-btn")) {
        //store current score to total score, reset current 
        const player = currentPlayer.parentNode;
        setTotalScore(player)
        setCurrentScore(player, 0);
        buttonToggle("hold")
        //swap current player to other player now
        swapPlayer(player)
    } 
  });
});

const twoPlayerScoring = () => {
  let rollScore = rollDice();

  setTimeout(() => {
    // get the parent node of the current player so that we can manipulate its values
    const player = currentPlayer.parentNode;
    if (rollScore === 1) {
      // lose turn, sigh and hand over to the other player
      playAudio(soundEffectsArray[1]);
      shakePlayer(player, 1500);
      buttonToggle("hold"); 
      setTimeout(() => {
        setCurrentScore(player, 0);
        swapPlayer(player);
      }, 3000); 
    
    }else {
      //we continue
      setCurrentScore(player, rollScore);
      if (isCombinedScoreWin(player)) {
        //win!
        winCondition(player);
      }  
    }
  }, 3000);  
}

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

const isCombinedScoreWin = (player) => {
  const totalScore = player
    .querySelector(".total-score-div")
    .querySelector(".total-score");
    let score = parseInt(totalScore.innerHTML);
    if ((score + currentScore) >= maxScore){
      return true
    } 
    return false
}

const winCondition = (player) =>{
  buttonToggle("win");
  setTotalScore(player);
  setCurrentScore(player, 0);
  playAudio(soundEffectsArray[2])

}

const swapPlayer = (player) => {
  let sibling = player.nextElementSibling;
  if (player.nextElementSibling === null) {
    sibling = player.previousElementSibling;
  }
  currentPlayer.classList.remove("current-player") 
  sibling.querySelector(".player").classList.add("current-player")
  currentPlayer = document.querySelector(".current-player");
  currentScore = 0;
}

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

const initDiceImg = () => {
  resetDiceImg();
  displayDiceImg(`${defaultMediaPath}${dieImageArray[0]}`);
};

const resetDiceImg = () => {
  //removes any existing images
  if (diceImg.hasChildNodes()) {
    diceImg.querySelectorAll("*").forEach((img) => img.remove());
  }
};

const displayDiceImg = (src) => {
  let img = document.createElement("img");
  img.src = src;
  diceImg.appendChild(img);
};

// shake the player name
const shakePlayer = (player, shakeLength) => {
  player.classList.add("shake");
  setTimeout(() => {
    player.classList.remove("shake");
  }, shakeLength);
}

const buttonToggle = (action) => {
  if (action === "new"){
    const newGameBtn = document.querySelector(".new-game");
    newGameBtn.classList.add("disabled");
    const holdRollBtns = document.querySelector(".roll-hold-btns");
    const gameBtns = holdRollBtns.getElementsByTagName("button");
    for (let i = 0; i < gameBtns.length; i++) {
      gameBtns[i].classList.remove("disabled");
    }  
  }else if (action === "win"){
    // end game reset button states.
    const newGameBtn = document.querySelector(".new-game")
    newGameBtn.classList.remove("disabled");
    const holdRollBtns = document.querySelector(".roll-hold-btns");
    const gameBtns = holdRollBtns.getElementsByTagName("button");
    for (let i = 0; i < gameBtns.length; i++) {
      gameBtns[i].classList.add("disabled");
    }
  } else if (action ==="hold") {
      // disable hold button after pressing
      const holdBtn = document.querySelector(".hold-btn");
      holdBtn.classList.add("disabled");
  } else if (action === "roll"){
    // reneable hold button after first roll
    const holdBtn = document.querySelector(".hold-btn");
    holdBtn.classList.remove("disabled");
  }
}


const clonePlayer = () =>{
  // clone player2 to match the html of player 1 to ensure both are the same
  const srcNode = document.querySelector(".player1")
  let targetNode = srcNode.cloneNode(true)
  targetNode.classList.remove("player1")
  targetNode.classList.add("player2");
  targetNode.querySelector(".player").classList.remove("current-player")
  targetNode.querySelector(".player-name").innerHTML = "Player2";
  twoPlayer.appendChild(targetNode)
}

// starts or resets the game variables to init
const newGame = () => {
  //reset all the scores
  let scores = document.querySelectorAll(".total-score")
  scores.forEach((score) => score.innerHTML = "0")
  scores = document.querySelectorAll(".current-score")
  scores.forEach((score) => score.innerHTML = "0")
  currentScore = 0
  initDiceImg();
  //reset game to player 1 start
  players = document.querySelectorAll(".player")
  for (i = 0 ; i < players.length; i++){
    if (players[i].parentNode.classList.contains("player1")){
      players[i].classList.add("current-player");
    }else {
      players[i].classList.remove("current-player");
    }
  }
  currentPlayer = document.querySelector(".current-player");
};

// Start the new game
document.addEventListener("DOMContentLoaded", () => {
  // make player 2 clone from player 1
  clonePlayer(); 
  // initiate a new game
  newGame();
  },false
);

