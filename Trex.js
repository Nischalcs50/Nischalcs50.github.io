// Trex Runner Game in pure JS
const canvas = document.getElementById('trex-canvas');
const ctx = canvas.getContext('2d');
let trex = { x: 40, y: 90, vy: 0, width: 30, height: 30, jumping: false };
let ground = 100;
let gravity = 0.7;
let obstacles = [];
let frame = 0;
let score = 0;
let gameOver = false;

function drawTrex() {
// Body
ctx.fillStyle = "#5c4037";
ctx.beginPath();
ctx.ellipse(trex.x + 12, trex.y + 20, 13, 18, 0, 0, Math.PI * 2);
ctx.fill();

// Tail
ctx.beginPath();
ctx.moveTo(trex.x, trex.y + 30);
ctx.lineTo(trex.x - 14, trex.y + 35);
ctx.lineTo(trex.x + 2, trex.y + 22);
ctx.closePath();
ctx.fill();

// Legs
ctx.fillRect(trex.x + 4, trex.y + 38, 6, 10);
ctx.fillRect(trex.x + 16, trex.y + 38, 6, 10);

// Head
ctx.beginPath();
ctx.ellipse(trex.x + 24, trex.y + 10, 11, 9, 0, 0, Math.PI * 2);
ctx.fill();

// Eye
ctx.fillStyle = "#fff";
ctx.beginPath();
ctx.arc(trex.x + 29, trex.y + 9, 2, 0, Math.PI * 2);
ctx.fill();

ctx.fillStyle = "#111";
ctx.beginPath();
ctx.arc(trex.x + 30, trex.y + 9, 1, 0, Math.PI * 2);
ctx.fill();

// Arms
ctx.strokeStyle = "#402d19";
ctx.lineWidth = 2;
ctx.beginPath();
ctx.moveTo(trex.x + 15, trex.y + 26);
ctx.lineTo(trex.x + 22, trex.y + 31);
ctx.stroke();
ctx.beginPath();
ctx.moveTo(trex.x + 13, trex.y + 28);
ctx.lineTo(trex.x + 19, trex.y + 35);
ctx.stroke();
}
function drawObstacles() {
  ctx.fillStyle = "#228B22";
  obstacles.forEach(ob => ctx.fillRect(ob.x, ob.y, ob.width, ob.height));
}
function drawGround() {
  ctx.strokeStyle = "#888";
  ctx.beginPath();
  ctx.moveTo(0, ground+trex.height);
  ctx.lineTo(canvas.width, ground+trex.height);
  ctx.stroke();
}
function resetGame() {
  trex.y = ground;
  trex.vy = 0;
  trex.jumping = false;
  obstacles = [];
  frame = 0;
  score = 0;
  gameOver = false;
}
function gameLoop() {
  ctx.clearRect(0,0,canvas.width,canvas.height);
  drawGround();
  drawTrex();
  drawObstacles();
  ctx.fillStyle = "#333";
  ctx.font = "16px monospace";
  ctx.fillText("Score: " + score, 10, 20);

  if (gameOver) {
    ctx.fillStyle = "#B22222";
    ctx.font = "22px bold monospace";
    ctx.fillText("Game Over!", 120, 60);
    ctx.font = "14px monospace";
    ctx.fillText("Press Space or Tap to Restart", 75, 90);
    return;
  }

  // Trex physics
  trex.y += trex.vy;
  trex.vy += gravity;
  if (trex.y > ground) {
    trex.y = ground;
    trex.vy = 0;
    trex.jumping = false;
  }

  // Obstacles movement/logic
  if (frame % 80 === 0) {
    let height = 25 + Math.floor(Math.random() * 20);
    obstacles.push({ x: canvas.width, y: ground + trex.height - height, width: 12 + Math.random()*20, height: height });
  }
  obstacles.forEach(ob => ob.x -= 5);

  // Remove off-screen obstacles
  obstacles = obstacles.filter(ob => ob.x + ob.width > 0);

  // Collision detection
  obstacles.forEach(ob => {
    if (
      trex.x < ob.x + ob.width &&
      trex.x + trex.width > ob.x &&
      trex.y + trex.height > ob.y
    ) {
      gameOver = true;
    }
  });

  if (!gameOver) {
    score++;
    frame++;
    requestAnimationFrame(gameLoop);
  }
}
function jump() {
  if (!trex.jumping && !gameOver) {
    trex.vy = -11;
    trex.jumping = true;
  } else if (gameOver) {
    resetGame();
    requestAnimationFrame(gameLoop);
  }
}
window.addEventListener('keydown', e => {
  if (e.code === 'Space') jump();
});
canvas.addEventListener('touchstart', jump);
canvas.addEventListener('mousedown', jump);

resetGame();
requestAnimationFrame(gameLoop);