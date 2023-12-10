"use strict";
const game = {
  isRunning: false,
  cursorSmall: document.querySelector(".cursor"),
  currentScreen: "splash-screen",
  basePath: "../images/Level",
  currentPath: "../images/Level1.png",
  currentModal: null,
  initiateModal: document.getElementById("initiate-modal"),
  enteredPlayerName: document.getElementById("exampleInputUsername1"),
  playerName: document.getElementById("player-name"),
  playerScore: document.getElementById("level"),
  playerContainer: document.getElementById("player-details"),
  gamePageElement: document.getElementById("game-page"),
  closedDoor: document.getElementById("closed-door"),
  openDoor: document.getElementById("open-door"),
  orb: document.getElementById("orb"),
  canvasImage: document.getElementById("canvas-img"),
  canvasElement: document.getElementById("myCanvas"),
  splashAudio: document.getElementById("background-audio"),
  doorAudio: document.getElementById("door-audio"),
  loseAudio: document.getElementById("lose-audio"),
  startAudio: document.getElementById("start-audio"),
  winAudio: document.getElementById("win-audio"),
  gameHelpClose: false,
  updatePlayerNameDOM() {
    this.playerName.textContent = player.name;
  },
  updatePlayerScoreDOM() {
    const currentLevel = player.score;
    // Update text content with "Level" + currentLevel
    this.playerScore.textContent = `Level ${currentLevel}`; 
  },
  displayPlayerDetailsDOM() {
    this.playerContainer.style.display = "block";
  },
  switchScreen(screen) {
    this.currentScreen = screen;
    $(".screen").hide();
  
    switch (this.currentScreen) {
      case "splash-screen":
        $(`#${this.currentScreen}`).show();
        $("#help-button").show();
        game.splashAudio.play();
        game.gameHelpClose = false;
        break;
      case "game-screen":
        $(`#${this.currentScreen}`).show();
        game.splashAudio.pause();
        $(game.playerContainer).show();
        break;
      default:
        $(`#${this.currentScreen}`).show();
        $("#help-button").hide();
        $("body").css("cursor", "auto");
        $(game.playerContainer).hide();
        $(game.cursorSmall).hide();
        break;
    }
  },
  changeImage(level) {
    game.currentPath = `${this.basePath}${level}.png`;
  },

  clearInputField() {
    const inputField = document.getElementById("exampleInputUsername1");
    if (inputField) {
      inputField.value = "";
    }
  },
  showAppropriateModal() {
    if (game.currentScreen == "splash-screen") {
      this.currentModal = $("setup-modal");
      this.currentModal.modal.show();
    } else {
      this.currentModal = $("#gameplay-modal");
      this.currentModal.modal.show();
    }
  },
  repositionOrbForLevel(level) {
    const orb = game.orb;
    orb.style.bottom = levelPositions[level].start.bottom;
    orb.style.left = levelPositions[level].start.left;
  },
  repositionDoorForLevel(level) {
    const closedDoor = game.closedDoor;
    const openDoor = game.openDoor;
    closedDoor.style.bottom = levelPositions[level].end.bottom;
    closedDoor.style.left = levelPositions[level].end.left;
    openDoor.style.bottom = levelPositions[level].end.bottom;
    openDoor.style.left = levelPositions[level].end.left;
  },
  showInitiateModal() {
    $("#initiate-modal").modal("show");
  },
  clearCanvas() {
    const context = game.canvasElement.getContext("2d");
    context.clearRect(
      0,
      0,
      game.canvasElement.width,
      game.canvasElement.height
    );
  },
  resetGame(isQuit) {
    game.winAudio.pause();
    $(game.cursorSmall).hide();
    $("body").css("cursor", "auto");
    game.clearCanvas();
    $("#closed-door").hide();
    $("#open-door").hide();
    game.isRunning = false;

    if (isQuit === true) {
      $("#orb").show();
      game.switchScreen("splash-screen");
      let name = "";
      game.updateAndDisplayPlayerDetails(name);
      player.score = 1;
      game.updatePlayerNameDOM();
      game.updatePlayerScoreDOM();
      game.displayPlayerDetailsDOM();
      game.clearInputField();
      game.currentPath = "../images/Level1.png";
      game.repositionDoorForLevel(1);
      game.repositionOrbForLevel(1);
    } else {
      game.repositionOrbForLevel(player.score);
      $("#orb").show();
      game.switchScreen("game-screen");
      game.currentPath = game.basePath + player.score + ".png";
    }
  },
  gameOver() {
    game.loseAudio.play();
    game.switchScreen("game-over-screen");
    game.isRunning = false;
    $("#game-over-title-heading").text("Game Over");
    $("#restart-level").show();
    const gameOverScreen = $("#game-over-screen");
    gameOverScreen.css("background-image", "url('../images/GameOver.jpg')");
    const finalScore = player.score - 1;
    if (finalScore > 0) {
      $("#game-over-description").html(
        `You lost, please try again<br>Last level completed: Level ${finalScore}`
      );
    } else {
      $("#game-over-description").html(`You lost<br>please try again`);
    }
  },
  gameWon() {
    game.isRunning = false;
        game.switchScreen("game-over-screen");
        const gameOverScreen = $("#game-over-screen");
        game.winAudio.play();
        gameOverScreen.css("background-image", "url('../images/Freedom.jpg')");
        $("#game-over-title-heading").text("You Win");
        $("#game-over-description").text("Congratulations");
        $("#restart-level").hide();
  },
  triggerNewLevel() {
    game.doorAudio.play();
    $("#closed-door").hide();
    $("#open-door").show();
    setTimeout(function () {
      if (player.score !== 5) {
        player.updatePlayerScore();
        game.changeImage(player.score);
        game.runGame();
        setTimeout(function () {
          $("#open-door").hide();
          $("#closed-door").show();
        }, 500);
        setTimeout(function () {
          game.repositionDoorForLevel(player.score);
        }, 1000);
      } else {
        game.gameWon();
      }
    }, 500);
  },
  updateAndDisplayPlayerDetails(name) {
    player.updatePlayerName(name);
    game.updatePlayerScoreDOM();
    game.displayPlayerDetailsDOM();
  },
  init() {
    $("#splash-screen").on("mouseover", (event) => {
      game.splashAudio.play();
    });
    $("#username-submit-btn").on("click", (event) => {
      game.startAudio.play();
      let name = game.enteredPlayerName.value.trim();
      if (name) {
        event.preventDefault();
        //store the player name in the scoreboard
        game.playerName.textContent = name;
        game.updateAndDisplayPlayerDetails(name);
        //switch the screen to the game screen
        game.switchScreen("game-screen");
        setTimeout(function () {
          game.showInitiateModal();
        }, 1000);
      }
    });

    $("#orb").on("click", function () {
      if (game.gameHelpClose === true) {
        game.runGame();
        $("#orb").hide();
        $("#closed-door").show();
        $(".cursor").show();
        $("body").css("cursor", "none");
      }
    });

    $("#initiate-modal").on("hide.bs.modal", function () {
      game.gameHelpClose = true;
    });

    $("#closed-door").on("click", function (event) {
      event.preventDefault();
      game.triggerNewLevel();
    });

    $("#restart-level").on("click", (event) => {
      game.resetGame(false);
    });

    $("#quit").on("click", (event) => {
      game.resetGame(true);
    });

    $("#help-button").on("click", (event) => {
      $("#setup-modal").modal("show");
    });

    $("#player-details").on("mouseover", (event) => {
      if (game.isRunning === true) {
        game.gameOver();
      }
    });
  },
  runGame() {
    //create maze image element, add it under game-page element but hide it on
    //screen this is because the canvas drawImage() method only takes image that
    //already exist in the DOM
    game.isRunning = true;
    const mazeImgElement = game.canvasImage;
    mazeImgElement.src = game.currentPath;
    mazeImgElement.onload = () => {
      //context (ctx) is what we use to draw everything. images, lines, shapes, etc.
      const ctx = game.canvasElement.getContext("2d");
      ctx.drawImage(mazeImgElement, 0, 0);

      //set up event listener to get cursor position when it hovers over canvas
      game.canvasElement.addEventListener("mousemove", (e) => {
        const pos = getMousePos(game.canvasElement, e);
        trackMouse(pos, ctx);
      });
    };
    //callback function for mouseover the maze
    let trackMouse = (e, ctx) => {
      const x = e.x;
      const y = e.y;
      const srgbData = ctx.getImageData(x, y, 1, 1).data;
      const safeColour = 159;
      //if the cursor isn't on the safe colour, then game over
      if (srgbData[0] != safeColour && game.isRunning === true) {
        game.gameOver();
      }
    };
  },
};

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
  },
};

function getMousePos(canvas, evt) {
  var rect = canvas.getBoundingClientRect();
  return {
    x: evt.clientX - rect.left,
    y: evt.clientY - rect.top,
  };
}

//access the css small property of the custom mouse cursor
const cursorSmall = document.querySelector(".small");

const positionElement = (e) => {
  //account for possible scroll down action
  const mouseY = e.clientY + $(window).scrollTop();
  const mouseX = e.clientX;

  cursorSmall.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
};

window.addEventListener("mousemove", positionElement);

class Position {
  constructor(bottom, left) {
    this.bottom = bottom;
    this.left = left;
  }
}

let levelPositions = {
  1: {
    start: new Position("750px", "165px"),
    end: new Position("2px", "260px"),
  },
  2: {
    start: new Position("15px", "260px"),
    end: new Position("580px", "50px"),
  },
  3: {
    start: new Position("580px", "50px"),
    end: new Position("90px", "715px"),
  },
  4: {
    start: new Position("90px", "715px"),
    end: new Position("710px", "735px"),
  },
  5: {
    start: new Position("710px", "735px"),
    end: new Position("260px", "300px"),
  },
};
