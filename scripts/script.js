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
  //create the canvas element that will encapsulate the maze image
  canvasElement: document.getElementById("myCanvas"),
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
      $('#quit-header').hide();
    }
    else if (this.currentScreen == "game-screen") 
    {
        $('#help-button').show();
        $('#quit-header').show(); 
    }
    else
    {
        $('#help-button').hide();
        $('#quit-header').hide();
        $('#player-details').hide();
        $('.cursor').hide();
    }
  },
  switchLevel(level) {
    game.currentPath = `${this.basePath}${level}.png`;
    
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
  repositionDoorForLevel(level) {
    const previousLevel = level - 1;
    $('#closed-door').show();
    const closedDoor = game.closedDoor;
    const openDoor = game.openDoor;
      switch (level) {
        case 2:
          closedDoor.style.bottom = "560px";
          closedDoor.style.left = "50px";
          openDoor.style.bottom = "560px";
          openDoor.style.left = "50px";
          break;
        case 3:
          closedDoor.style.bottom = "65px";
          closedDoor.style.left = "720px";
          openDoor.style.bottom = "65px";
          openDoor.style.left = "720px";
          break;
        case 4:
          closedDoor.style.bottom = "720px";
          closedDoor.style.left = "730px";
          openDoor.style.bottom = "720px";
          openDoor.style.left = "730px";
          break;
        case 5:
          closedDoor.style.bottom = "355px";
          closedDoor.style.left = "100px";
          openDoor.style.bottom = "355px";
          openDoor.style.left = "100px";
          break;
        default:
          break;
      }

  },
  showInitiateModal() {
    console.log("workingggg");
    $('#initiate-modal').modal('show');
  },
  init() {
    $('h1').text("A Mazing Mouse Game")
    $("#start-game").on("click", () => {
      game.switchScreen("game-screen");
    });

    $("#username-submit-btn").on("click", (event) => {
      let name = game.enteredPlayerName.value;
      if (name != "") {
        event.preventDefault();
        //toggleRunning to "true"
        game.toggleIsRunning();
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

      $("#mouse").on("click", function() {
        game.runGame();
        $('#mouse').hide()
        $('#closed-door').show();
        $('.cursor').show();
        }   
      )

      $("#closed-door").on("click", function() {
        $('#closed-door').hide();
        $('#open-door').show();
        setTimeout(function() {
          if (player.score !== 5) {
            player.score = player.score + 1;
            game.updatePlayerScoreDOM();
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
          }
        }, 500);
        }  
      )
    });


    $("#end-game").on("click", (event) => {
      game.switchScreen("game-over-screen")
      if (game.isRunning === true) {
        game.toggleIsRunning();
        this.playerContainer.style.display = "none";
      }
    });

    $("#quit-header").on("click", (event) => {
      game.switchScreen("splash-screen")
      if (game.isRunning === true) {
        game.toggleIsRunning();
        this.playerContainer.style.display = "none";
      }
    });

    $("#play-again").on("click", (event) => {
      game.switchScreen("game-screen")
      if (game.isRunning === true) {
          game.toggleIsRunning();
          this.playerContainer.style.display = "none";
      }
    });

    $("#quit").on("click", (event) => {
      game.switchScreen("splash-screen")
      if (game.isRunning === true) {
          game.toggleIsRunning();
      }
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
            $("#container").addClass("active");
        }
        else {
            this.isRunning = false;
            $("#container").removeClass("active");
        }
    },
  runGame() {
    //create maze image element, add it under game-page element but hide it on
    //screen this is because the canvas drawImage() method only takes image that
    //already exist in the DOM
    const mazeImgElement = document.createElement("img");
    mazeImgElement.src = game.currentPath;
    mazeImgElement.style.width = "800px";
    mazeImgElement.setAttribute("hidden", "true");
    // game.canvasElement.setAttribute("border")
    game.gamePageElement.appendChild(mazeImgElement);

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
console.log(x, y);
      if (srgbData[0] != 159) {
        // alert("You lost");
        game.switchScreen("game-over-screen");
        const description = document.getElementById('game-over-description');
        description.textContent = "You lost, please try again!";
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


