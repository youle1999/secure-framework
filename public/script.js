const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const startScreen = document.getElementById("startScreen");
const startButton = document.getElementById("startButton");
const gameOverScreen = document.getElementById("gameOverScreen");
const restartButton = document.getElementById("restartButton");
const finalScoreText = document.getElementById("finalScore");

// Set canvas dimensions to fit screen
function resizeCanvas() {
  canvas.width = Math.min(window.innerWidth, 800); // Limit width to 800px
  canvas.height = canvas.width * 0.625; // Maintain a 16:10 aspect ratio
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

// Game variables
let basket = { x: canvas.width / 2 - 50, y: canvas.height - 50, width: 100, height: 20, speed: 10 };
let stars = [];
let score = 0;
let health = 100;
let isGameRunning = false;
let isDragging = false; // Track if the user is dragging the basket

// Input variables
let keys = {};
let touchStartX = 0;

// Keyboard Events
window.addEventListener("keydown", (e) => (keys[e.key] = true));
window.addEventListener("keyup", (e) => (keys[e.key] = false));

// Touch Events for Mobile
canvas.addEventListener("touchstart", (e) => {
  touchStartX = e.touches[0].clientX; // Get initial touch position
  if (
    touchStartX >= basket.x &&
    touchStartX <= basket.x + basket.width &&
    e.touches[0].clientY >= basket.y
  ) {
    isDragging = true; // Enable dragging only if the touch starts on the basket
  }
});

canvas.addEventListener("touchmove", (e) => {
  if (isDragging) {
    const touchX = e.touches[0].clientX; // Get current touch position
    const deltaX = touchX - touchStartX; // Calculate movement

    basket.x += deltaX; // Move the basket
    if (basket.x < 0) basket.x = 0; // Prevent the basket from moving out of bounds
    if (basket.x > canvas.width - basket.width) basket.x = canvas.width - basket.width;

    touchStartX = touchX; // Update the touch position
  }
});

canvas.addEventListener("touchend", () => {
  isDragging = false; // Stop dragging when the touch ends
});

// Star class
class Star {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.radius = 10;
    this.speed = Math.random() * 2 + 2;
  }

  update() {
    this.y += this.speed;
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = "yellow";
    ctx.fill();
    ctx.closePath();
  }
}

// Spawn stars every second
function spawnStar() {
  const x = Math.random() * canvas.width;
  stars.push(new Star(x, 0));
}

setInterval(() => {
  if (isGameRunning) spawnStar();
}, 1000);

// Update basket position
function moveBasket() {
  // Keyboard Controls
  if (keys["ArrowLeft"] && basket.x > 0) {
    basket.x -= basket.speed;
  }
  if (keys["ArrowRight"] && basket.x < canvas.width - basket.width) {
    basket.x += basket.speed;
  }
}

// Check for collisions
function checkCollisions() {
  stars.forEach((star, index) => {
    if (
      star.y + star.radius > basket.y &&
      star.x > basket.x &&
      star.x < basket.x + basket.width
    ) {
      stars.splice(index, 1);
      score++;
    } else if (star.y > canvas.height) {
      stars.splice(index, 1);
      health -= 10;
    }
  });
}

// Draw basket
function drawBasket() {
  ctx.fillStyle = "white";
  ctx.fillRect(basket.x, basket.y, basket.width, basket.height);
}

// Draw health bar
function drawHealthBar() {
  const healthBarWidth = 200;
  const healthBarHeight = 20;

  ctx.fillStyle = "red";
  ctx.fillRect(10, 10, healthBarWidth, healthBarHeight);
  ctx.fillStyle = "green";
  ctx.fillRect(10, 10, (health / 100) * healthBarWidth, healthBarHeight);

  ctx.font = "16px Arial";
  ctx.fillStyle = "white";
  ctx.fillText(`Health: ${health}`, 15, 25);
}

// Update game loop
function updateGame() {
  if (!isGameRunning) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  moveBasket();
  drawBasket();

  stars.forEach((star) => {
    star.update();
    star.draw();
  });

  checkCollisions();

  drawHealthBar();
  ctx.font = "20px Arial";
  ctx.fillStyle = "white";
  ctx.fillText(`Score: ${score}`, canvas.width - 100, 25);

  if (health <= 0) {
    endGame();
  } else {
    requestAnimationFrame(updateGame);
  }
}

// Function to handle the end of the game
function endGame() {
  isGameRunning = false;
  canvas.style.display = "none";
  gameOverScreen.style.display = "flex";
  finalScoreText.textContent = `Your final score: ${score}`;
}

// Function to restart the game
function restartGame() {
  gameOverScreen.style.display = "none";
  startScreen.style.display = "flex";
  stars = [];
  score = 0;
  health = 100;
  isGameRunning = false;
}

// Start the game
startButton.addEventListener("click", () => {
  startScreen.style.display = "none";
  canvas.style.display = "block";
  isGameRunning = true;
  updateGame();
});

// Restart the game
restartButton.addEventListener("click", restartGame);
