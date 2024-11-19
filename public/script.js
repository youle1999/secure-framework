const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Set canvas dimensions
canvas.width = 800;
canvas.height = 500;

// Game variables
let basket = { x: 350, y: 450, width: 100, height: 20, speed: 10 };
let stars = [];
let score = 0;
let health = 100;

// Key press events
let keys = {};
window.addEventListener("keydown", (e) => (keys[e.key] = true));
window.addEventListener("keyup", (e) => (keys[e.key] = false));

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

setInterval(spawnStar, 1000);

// Update basket position
function moveBasket() {
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

  // Background of health bar
  ctx.fillStyle = "red";
  ctx.fillRect(10, 50, healthBarWidth, healthBarHeight);

  // Foreground of health bar
  ctx.fillStyle = "green";
  ctx.fillRect(10, 50, (health / 100) * healthBarWidth, healthBarHeight);

  // Health text
  ctx.font = "16px Arial";
  ctx.fillStyle = "white";
  ctx.fillText(`Health: ${health}`, 15, 65);
}

// Update game loop
function updateGame() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Move and draw basket
  moveBasket();
  drawBasket();

  // Update and draw stars
  stars.forEach((star) => {
    star.update();
    star.draw();
  });

  // Check collisions
  checkCollisions();

  // Draw health bar
  drawHealthBar();

  // Display score
  ctx.font = "20px Arial";
  ctx.fillStyle = "white";
  ctx.fillText(`Score: ${score}`, 10, 30);

  if (health <= 0) {
    alert("Game Over! Your score: " + score);
    location.reload();
  }

  requestAnimationFrame(updateGame);
}

// Start game
updateGame();
