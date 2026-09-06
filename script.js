const road = document.getElementById("road");
const player = document.querySelector(".player");
const scoreDisplay = document.getElementById("score");
const livesDisplay = document.getElementById("lives");
const gameOverScreen = document.getElementById("gameOver");
const finalScore = document.getElementById("finalScore");

let playerX = 170;
let score = 0;
let highScore = parseInt(localStorage.getItem("highScore")) || 0;
let gameRunning = true;
let enemySpeed = 5;
let enemies = [];
let coins = [];
let lives = 3;

updateHud();

// Move the player's car
document.addEventListener("keydown", function (event) {
  if (!gameRunning) return;

  if (event.key === "ArrowLeft") {
    playerX -= 25;
  }
  if (event.key === "ArrowRight") {
    playerX += 25;
  }
  // Keep the car inside the road
  if (playerX < 10) playerX = 10;
  if (playerX > 330) playerX = 330;
  player.style.left = playerX + "px";
});

// Create an enemy car
function createEnemy() {
  const enemy = document.createElement("div");
  enemy.classList.add("enemy");
  const enemyX = Math.floor(Math.random() * 330) + 10;
  enemy.style.left = enemyX + "px";
  enemy.style.top = "-120px";
  road.appendChild(enemy);
  enemies.push(enemy);
}

// Create a coin pickup
function createCoin() {
  const coin = document.createElement("div");
  coin.classList.add("coin");
  const coinX = Math.floor(Math.random() * 350) + 10;
  coin.style.left = coinX + "px";
  coin.style.top = "-40px";
  road.appendChild(coin);
  coins.push(coin);
}

// Check collision
function checkCollision(a, b) {
  const aRect = a.getBoundingClientRect();
  const bRect = b.getBoundingClientRect();
  return (
    aRect.left < bRect.right &&
    aRect.right > bRect.left &&
    aRect.top < bRect.bottom &&
    aRect.bottom > bRect.top
  );
}

function updateHud() {
  scoreDisplay.innerText = "Score: " + score + " | High Score: " + highScore;
  livesDisplay.innerText = "❤️".repeat(lives) + "🖤".repeat(3 - lives);
}

function loseLife() {
  lives--;
  player.classList.add("hit");
  setTimeout(function () {
    player.classList.remove("hit");
  }, 150);

  if (lives <= 0) {
    endGame();
  } else {
    updateHud();
  }
}

function endGame() {
  gameRunning = false;
  if (score > highScore) {
    highScore = score;
    localStorage.setItem("highScore", highScore);
  }
  finalScore.innerText = "Your Score: " + score;
  gameOverScreen.style.display = "block";
}

// Main game loop
function gameLoop() {
  if (!gameRunning) return;

  // Move enemy cars
  enemies.forEach(function (enemy, index) {
    let top = parseInt(enemy.style.top);
    top += enemySpeed;
    enemy.style.top = top + "px";

    if (checkCollision(player, enemy)) {
      enemy.remove();
      enemies.splice(index, 1);
      loseLife();
      return;
    }

    // Remove enemy when it leaves the road
    if (top > 600) {
      enemy.remove();
      enemies.splice(index, 1);
      score++;
      updateHud();

      // Slowly increase difficulty
      if (score % 5 === 0) {
        enemySpeed += 0.5;
      }
    }
  });

  // Move coins
  coins.forEach(function (coin, index) {
    let top = parseInt(coin.style.top);
    top += enemySpeed;
    coin.style.top = top + "px";

    if (checkCollision(player, coin)) {
      coin.remove();
      coins.splice(index, 1);
      score += 3;
      updateHud();
      return;
    }

    if (top > 600) {
      coin.remove();
      coins.splice(index, 1);
    }
  });

  if (gameRunning) {
    requestAnimationFrame(gameLoop);
  }
}

// Create enemies regularly
setInterval(function () {
  if (gameRunning) {
    createEnemy();
  }
}, 1200);

// Create coins regularly
setInterval(function () {
  if (gameRunning) {
    createCoin();
  }
}, 2500);

// Restart game
function restartGame() {
  enemies.forEach(function (enemy) {
    enemy.remove();
  });
  coins.forEach(function (coin) {
    coin.remove();
  });
  enemies = [];
  coins = [];
  playerX = 170;
  player.style.left = playerX + "px";
  score = 0;
  lives = 3;
  enemySpeed = 5;
  updateHud();
  gameOverScreen.style.display = "none";
  gameRunning = true;
  gameLoop();
}

// Start the game
gameLoop();

// Touch controls
let moveInterval;

document.getElementById("leftBtn").addEventListener("touchstart", function () {
  moveInterval = setInterval(function () {
    if (playerX > 10) {
      playerX -= 10;
      player.style.left = playerX + "px";
    }
  }, 30);
});
document.getElementById("leftBtn").addEventListener("touchend", function () {
  clearInterval(moveInterval);
});

document.getElementById("rightBtn").addEventListener("touchstart", function () {
  moveInterval = setInterval(function () {
    if (playerX < 330) {
      playerX += 10;
      player.style.left = playerX + "px";
    }
  }, 30);
});
document.getElementById("rightBtn").addEventListener("touchend", function () {
  clearInterval(moveInterval);
});
