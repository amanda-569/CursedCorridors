"use strict";

const game = {
  isRunning: false,
  cursorSmall: document.querySelector(".cursor"),
  currentScreen: "splash-screen",
  basePath: "../images/Level",
  currentPath: "../images/Level1.png",
  currentModal: null,
  initiateModal: document.querySelector("#initiate-modal"),
  scoreBoard: document.querySelector("#scoreboard"),
  startgameButton: document.querySelector("#username-submit-btn"),
  enteredPlayerName: document.querySelector("#exampleInputUsername1"),
  playerName: document.querySelector("#player-name"),
  playerScore: document.querySelector("#level"),
  playerContainer: document.querySelector("#player-details"),
  //get game-page element from DOM
  gamePageElement: document.getElementById("game-page"),
  closedDoor: document.getElementById("closed-door"),
  openDoor: document.getElementById("open-door"),
  orb: document.getElementById("orb"),
  canvasImage: document.getElementById("canvas-img"),
  //create the canvas element that will encapsulate the maze image
  canvasElement: document.getElementById("myCanvas"),
  gameHelpClose: false,
  updatePlayerNameDOM() {
    this.playerName.textContent = player.name;
  },
  updatePlayerScoreDOM() {
    const currentLevel = player.score;
    this.playerScore.textContent = `Level ${currentLevel}`; // Update text content with "Level" + currentLevel
  },
  displayPlayerDetailsDOM() {
    this.playerContainer.style.display = "block";
  },
  switchScreen(screen) {
    this.currentScreen = screen;
    $('.screen').hide();
    $(`#${this.currentScreen}`).show();
    if (this.currentScreen == "splash-screen") 
    {
      $('#help-button').show();
    }
    else if (this.currentScreen == "game-screen") 
    {
        $('#help-button').show();
        $('#player-details').show();
    }
    else
    {
        $('#help-button').hide();
        $('body').css('cursor', 'auto');
        $('#player-details').hide();
        $('.cursor').hide();
    }
  },
  switchLevel(level) {
    game.currentPath = `${this.basePath}${level}.png`;   
  },
  clearInputField() {
    const inputField = document.getElementById('exampleInputUsername1');
    if (inputField) {
      inputField.value = '';
    }
  },
  showAppropriateModal() {
    if (game.currentScreen == "splash-screen") {
      this.currentModal = $('setup-modal')
      this.currentModal.modal.show();
    }
    else {
      this.currentModal = $('#gameplay-modal')
      this.currentModal.modal.show();
    }
  },
  repositionOrbForLevel(level) {
    const orb = game.orb;
    orb.style.bottom = levelPositions[level].start.bottom;
    orb.style.left = levelPositions[level].start.left;
  },
  repositionDoorForLevel(level) {
    $('#closed-door').show();
    const closedDoor = game.closedDoor;
    const openDoor = game.openDoor;
    closedDoor.style.bottom = levelPositions[level].end.bottom;
    closedDoor.style.left =  levelPositions[level].end.left;
    openDoor.style.bottom = levelPositions[level].end.bottom;
    openDoor.style.left = levelPositions[level].end.left;
  },
  showInitiateModal() {
    console.log("workingggg");
    $('#initiate-modal').modal('show');
  },
  clearCanvas() {
    const context = game.canvasElement.getContext('2d');
    context.clearRect(0, 0, game.canvasElement.width, game.canvasElement.height);
  },
  resetGame(isQuit) {
    $('.cursor').hide();
    $('body').css('cursor', 'auto');
    game.clearCanvas();
    $('#closed-door').hide();
    $('#open-door').hide();
    game.isRunning = false;

    if (isQuit === true) {
      $('#orb').show();
      game.switchScreen("splash-screen");
      player.name = "";
      player.score = 1;
      game.updatePlayerNameDOM();
      game.updatePlayerScoreDOM();
      game.displayPlayerDetailsDOM();
      game.clearInputField();
      game.currentPath ="../images/Level1.png";
      game.repositionDoorForLevel(1);
    }
    else {
      game.repositionOrbForLevel(player.score);
      $('#orb').show();
      game.switchScreen("game-screen")
      $('#closed-door').hide();
      game.currentPath = game.basePath + player.score + ".png"; 
    }

  },
  init() {
    $('h1').text("Cursed Corridors: The Abandoned Maze")
    $("#start-game").on("click", () => {
      game.switchScreen("game-screen");
    });

    $("#username-submit-btn").on("click", (event) => {
      let name = game.enteredPlayerName.value;
      if (name != "") {
        event.preventDefault();
        //store the player name in the scoreboard
        name = game.enteredPlayerName.value;
        game.playerName.textContent = name;
        player.name = name;
        player.updatePlayerName(name);
        game.updatePlayerScoreDOM()
        game.displayPlayerDetailsDOM();
        //switch the screen to the game screen
        game.switchScreen("game-screen");
        setTimeout(function() {
          game.showInitiateModal();
        }, 1000);
      }
    });

    $("#orb").on("click", function() {
      if (game.gameHelpClose === true) {
        game.runGame();
        $('#orb').hide()
        $('#closed-door').show();
        $('.cursor').show();
        $('body').css('cursor', 'none');
      }
    })

    $("#game-help-close").on("click", function() {
      game.gameHelpClose = true;
    })

    $("#closed-door").on("click", function(event) {
      event.preventDefault();
      $('#closed-door').hide();
      $('#open-door').show();
      setTimeout(function() {
        if (player.score !== 5) {
          player.score = player.score + 1;
          game.updatePlayerScoreDOM();
          console.log("score" + player.score);
          game.switchLevel(player.score);
          game.runGame();
          setTimeout(function() {
            $('#open-door').hide();
            $('#closed-door').show();             
          }, 500)
          setTimeout(function() {
            $('#closed-door').hide();
          }, 1000)
          setTimeout(function () {
            game.repositionDoorForLevel(player.score);
          }, 1000)
          
        }
        else {
          if (game.isRunning === true) {
            game.toggleIsRunning();
          }
          game.switchScreen("game-over-screen");
          const gameOverScreen = document.getElementById("game-over-screen");
          gameOverScreen.style.backgroundImage = 'url("../images/Freedom.jpg")';
          $('#game-over-title-heading').text('You Win');
          $('#game-over-description').text('Congratulations');
        }
      }, 500);
      })

    // $("#end-game").on("click", (event) => {
    //   game.switchScreen("game-over-screen")
    //   if (game.isRunning === true) {
    //     game.toggleIsRunning();
    //     this.playerContainer.style.display = "none";
    //   }
    // });

    $("#restart-level").on("click", (event) => {
      game.resetGame(false);
    });

    $("#quit").on("click", (event) => {
      game.resetGame(true);
    });

    $("#help-button").on("click", (event) => {
      //If on the Splash screen, the Help button should open the Setup Instructions modal.
      if (game.currentScreen === "splash-screen") {
          $("#setup-modal").modal('show');
      }
      //If on the Game screen, the Help button should open up the Gameplay Instructions modal.
      else {
          $("#gameplay-modal").modal('show');
      }  
    });

    $(".close").on("click", (event) => {
      if (game.currentScreen === "splash-screen") {
          $("#setup-modal").modal('hide');
      }
      //If on the Game screen, the Help button should open up the Gameplay Instructions modal.
      else {
          $("#gameplay-modal").modal('hide');
      } 
    });
      },
  toggleIsRunning() {
        if (this.isRunning == false) {
            this.isRunning = true;
            // $("#container").addClass("active");
        }
        else {
            this.isRunning = false;
            // $("#container").removeClass("active");
        }
    },
  runGame() {
    //create maze image element, add it under game-page element but hide it on
    //screen this is because the canvas drawImage() method only takes image that
    //already exist in the DOM
    game.isRunning = true;
    const mazeImgElement = game.canvasImage;
    mazeImgElement.src = game.currentPath;
    mazeImgElement.style.width = "800px";
    mazeImgElement.setAttribute("hidden", "true");
    // game.gamePageElement.appendChild(mazeImgElement);

    //when the maze image element has been loaded into DOM,
    //draw this image elment within it
    mazeImgElement.onload = () => {

      //context (ctx) is what we use to draw everything. images, lines, shapes, etc.
      const ctx = game.canvasElement.getContext("2d");
      ctx.drawImage(mazeImgElement, 0, 0);

      // ctx.beginPath();
      // ctx.lineWidth = "100";
      // ctx.strokeStyle = "purple";
      // ctx.rect(50, 50, 500, 700);
      // ctx.stroke();

      //set up event listener to get cursor position when it hovers over canvas
      game.canvasElement.addEventListener("mousemove", (e) => {
        const pos = getMousePos(game.canvasElement, e);
        logRGB(pos, ctx);
      });
    };

    //remember to add canvas to DOM as well

    //callback function for mouseover the maze
    let logRGB = (e, ctx) => {

      const x = e.x;
      const y = e.y;
      const srgbData = ctx.getImageData(x, y, 1, 1).data; 
// console.log(x, y);
      if (srgbData[0] != 159 && game.isRunning === true) {
        game.switchScreen("game-over-screen");
        const description = document.getElementById('game-over-description');
        const finalScore = player.score - 1;
        if (finalScore > 0) {
          description.innerHTML = `You lost, please try again<br>Last level completed: Level ${finalScore}`;
        }
        else {
          description.innerHTML = `You lost<br>please try again`;
        }       
      }

    };
      }
  }

  $(game.init);

  const player = {
    name: "",
    score: 1,
    updatePlayerName(name) {
      player.name = name;
      game.updatePlayerNameDOM();
    },
    updatePlayerScore() {
      player.score = player.score + 1;
      game.updatePlayerScoreDOM();
    }
  }

  function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top
    };
  }
// const gamePageElement = document.getElementById("game-page");
const cursorSmall = document.querySelector('.small');

const positionElement = (e)=> {
  const mouseY = e.clientY;
  const mouseX = e.clientX;

  cursorSmall.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
}

window.addEventListener('mousemove', positionElement)

// const canvasElement = document.createElement("canvas");











class Position {
  constructor(bottom, left) {
    this.bottom = bottom;
    this.left = left;
  }
}


let levelPositions = {
  1 : {"start": new Position("0px", "135px"), "end": new Position("2px", "260px")},
  2 : {"start": new Position("2px", "260px"), "end": new Position("580px", "50px")},
  3 : {"start": new Position("580px", "50px"), "end": new Position("90px", "715px")},
  4 : {"start": new Position("90px", "715px"), "end": new Position("710px", "735px")},
  5 : {"start": new Position("710px", "735px"), "end": new Position("260px", "300px")},
}


// case 2:
//   closedDoor.style.bottom = "580px";
//   closedDoor.style.left = "50px";
//   openDoor.style.bottom = "580px";
//   openDoor.style.left = "50px";
//   break;
// case 3:
//   closedDoor.style.bottom = "90px";
//   closedDoor.style.left = "715px";
//   openDoor.style.bottom = "90px";
//   openDoor.style.left = "715px";
//   break;
// case 4:
//   closedDoor.style.bottom = "710px";
//   closedDoor.style.left = "735px";
//   openDoor.style.bottom = "710px";
//   openDoor.style.left = "735px";
//   break;
// case 5:
//   closedDoor.style.bottom = "260px";
//   closedDoor.style.left = "300px";
//   openDoor.style.bottom = "260px";
//   openDoor.style.left = "300px";