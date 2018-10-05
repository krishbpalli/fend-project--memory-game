const icons = [
  "birthday-cake",
  "paw",
  "magic",
  "codepen",
  "plane",
  "car",
  "camera-retro",
  "gift"
];
const initialState = {
  stars: 3,
  numClicks: 0,
  tileOne: "",
  tileTwo: "",
  iconOne: "",
  iconTwo: "",
  totalSeconds: 0
};
let currentState = Object.assign({}, initialState);
let allIcons = icons.concat(icons);

let moves = document.getElementById("moves");
let modal = document.getElementsByClassName("modal")[0];
let minutesLabel = document.getElementById("minutes");
let secondsLabel = document.getElementById("seconds");

startGame();

// Adding Event Listeners to all required click actions
document.getElementById("restart").addEventListener('click', restart);
let closeModal = document.getElementsByClassName("close")[0];
closeModal.addEventListener('click', function() {
  modal.style.display = "none";
  restart();
});

 // Upon start of the game, all the required values and actcions are set/initialized.
function startGame() {
  currentState.timerInterval = setInterval(setTime, 1000);
  shuffleArray(allIcons);
  moves.innerHTML = currentState.numClicks / 2;
  renderStars();
  for(let i=0; i<allIcons.length; i++) {
    addIconsToCard(i);
  }
}

// When the player clicks on a tile, this function is triggered
function respondToClick(event) {
  if (event.target.classList.contains('match')) {
    return;
  }
  ++currentState.numClicks;
  let tileItemNum = event.target.getAttribute('data-item');
  if (currentState.numClicks % 2 == 1) {
    currentState.tileOne = event.target;
    currentState.iconOne = allIcons[tileItemNum];
    currentState.tileOne.classList.add('open');
  } else {
    currentState.tileTwo = event.target;
    currentState.iconTwo = allIcons[tileItemNum];
    currentState.tileTwo.classList.add('open');
    updateCurrentState();
  }
}

function updateCurrentState() {
  // Number of moves made
  const numMovesMade = currentState.numClicks / 2;
  moves.innerHTML = numMovesMade;
  // Reduce star rating based on number of moves made
  if (numMovesMade <= 12) {
    currentState.stars = 3;
  } else if (numMovesMade > 12 && numMovesMade <= 20) {
    currentState.stars = 2;
  } else {
    currentState.stars = 1;
  }
  document.getElementById("star").innerHTML = "";
  renderStars();
  // Matching of two same tiles
  if (currentState.iconOne === currentState.iconTwo && currentState.tileOne !== currentState.tileTwo) {
    currentState.tileOne.classList.add('match');
    currentState.tileTwo.classList.add('match');
  } else {
    closeTilesAfterSomeTime();
  }
  // Modal to display after matching
  if(isGameOver()) {
    clearInterval(currentState.timerInterval);
    modal.style.display="block";
    document.getElementById('message').textContent = "Congragulations!";
    document.getElementById('move-count').textContent = "Moves made: " + (currentState.numClicks / 2);
    document.getElementById('star-rating').textContent = "Stars earned: " + currentState.stars;
    document.getElementById('time').textContent = "Time taken: "+minutesLabel.innerHTML+":"+secondsLabel.innerHTML;
  }
}

function isGameOver() {
  return document.getElementsByClassName('match').length === allIcons.length;
}

function closeTilesAfterSomeTime() {
  setTimeout(function() {
    currentState.tileOne.classList.remove("open");
    currentState.tileTwo.classList.remove("open");
  }, 250);
}

function restart() {
  clearInterval(currentState.timerInterval);
  currentState = Object.assign({}, initialState);
  modal.style.display="none";
  document.getElementById("outer-card").innerHTML = "";
  document.getElementById("star").innerHTML = "";
  moves.innerHTML = "";
  startGame();
}

function shuffleArray(array) {
  for (var i = array.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
}

function setTime() {
  ++currentState.totalSeconds;
  secondsLabel.innerHTML = (currentState.totalSeconds % 60).toString().padStart(2, "0");
  minutesLabel.innerHTML = (parseInt(currentState.totalSeconds / 60)).toString().padStart(2, "0");
}

function renderStars() {
  for(let i=0; i<currentState.stars; i++) {
    let starIcon = "fa fa-star";
    let addStarToHtml = "<li class='star-icon'><i class='"+starIcon+"'></i></li>";
    const starElement = createElementFromHTML(addStarToHtml);
    document.getElementById("star").appendChild(starElement);
  }
}

function addIconsToCard(i) {
  let tileIcon = "fa fa-"+allIcons[i];
  let addTileToHtml = "<li class='tile' data-item="+i+"><i class='"+tileIcon+"'></i></li>";
  const cardId = document.getElementById("outer-card");
  const tileElement = createElementFromHTML(addTileToHtml);
  tileElement.addEventListener('click', respondToClick);
  cardId.appendChild(tileElement);
}

function createElementFromHTML(htmlString) {
  var div = document.createElement('div');
  div.innerHTML = htmlString.trim();
  return div.firstChild;
}
