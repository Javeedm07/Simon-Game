var buttonColours = ["red", "blue", "green", "yellow"];
var gamePattern = [];
var userClickedPattern = [];

var started = false;
var level = 0;
var score = 0;
var highScore = localStorage.getItem("highScore") || 0;
var timer;

$("#high-score").text("High Score: " + highScore);

$("#info-icon").click(function () {
  $("#popup").fadeIn();
});

$("#close-popup").click(function () {
  $("#popup").fadeOut();
});

$(document).keypress(function () {
  if (!started) {
    $("#level-title").text("Level " + level);
    startGame();
    started = true;
  }
});

$("#restart-btn").click(function () {
  resetGame();
  $("#level-title").text("Press any key to Start");
  $("#restart-btn").addClass("hidden");
});

$(".btn").click(function () {
  var userChosenColour = $(this).attr("id");
  userClickedPattern.push(userChosenColour);

  playSound(userChosenColour);
  animatePress(userChosenColour);

  checkAnswer(userClickedPattern.length - 1);
});

function checkAnswer(currentLevel) {
  if (gamePattern[currentLevel] === userClickedPattern[currentLevel]) {
    if (userClickedPattern.length === gamePattern.length) {
      score++;
      updateScore();
      setTimeout(function () {
        nextSequence();
      }, 1000);
    }
  } else {
    playSound("wrong");
    $("body").addClass("game-over");
    $("#level-title").text("Game Over, Press Any Key to Restart");

    setTimeout(function () {
      $("body").removeClass("game-over");
    }, 200);

    if (score > highScore) {
      highScore = score;
      localStorage.setItem("highScore", highScore);
    }

    updateScore();
    startOver();
  }
}

function nextSequence() {
  userClickedPattern = [];
  level++;
  $("#level-title").text("Level " + level);
  var randomNumber = Math.floor(Math.random() * 4);
  var randomChosenColour = buttonColours[randomNumber];
  gamePattern.push(randomChosenColour);

  $("#" + randomChosenColour)
    .fadeIn(100)
    .fadeOut(100)
    .fadeIn(100);
  playSound(randomChosenColour);

  startTimer();
}

function startGame() {
  level = 0;
  score = 0;
  gamePattern = [];
  started = true;
  updateScore();
  nextSequence();
}

function updateScore() {
  $("#score").text("Score: " + score);
  $("#high-score").text("High Score: " + highScore);
}

function startTimer() {
  clearInterval(timer);
  var timeLeft = 10;
  $("#timer").text(timeLeft + "s");

  timer = setInterval(function () {
    timeLeft--;
    $("#timer").text(timeLeft + "s");

    if (timeLeft <= 0) {
      clearInterval(timer);
      playSound("wrong");
      $("body").addClass("game-over");
      $("#level-title").text("Game Over, Press Any Key to Restart");
      setTimeout(function () {
        $("body").removeClass("game-over");
      }, 200);
      startOver();
    }
  }, 1000);
}

function resetGame() {
  level = 0;
  score = 0;
  gamePattern = [];
  started = false;
  updateScore();
  $("#popup").fadeOut();
  $("#restart-btn").addClass("hidden");
}

function animatePress(currentColor) {
  $("#" + currentColor).addClass("pressed");
  setTimeout(function () {
    $("#" + currentColor).removeClass("pressed");
  }, 100);
}

function playSound(name) {
  var audio = new Audio("sounds/" + name + ".mp3");
  audio.play();
}

function startOver() {
  level = 0;
  score = 0;
  gamePattern = [];
  started = false;
  updateScore();
  $("#restart-btn").removeClass("hidden");
}
