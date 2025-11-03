const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Game configuration
const GRID_SIZE = 20;

// Calculate canvas size based on available viewport
function resizeCanvas() {
    const gameArea = document.querySelector('.game-area');
    const availableWidth = gameArea.clientWidth - 40;
    const availableHeight = gameArea.clientHeight - 40;
    
    // Make canvas size a multiple of GRID_SIZE
    const gridWidth = Math.floor(availableWidth / GRID_SIZE);
    const gridHeight = Math.floor(availableHeight / GRID_SIZE);
    
    canvas.width = gridWidth * GRID_SIZE;
    canvas.height = gridHeight * GRID_SIZE;
}

// Initialize canvas size
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Game state
let snake = [{ x: 10, y: 10 }];
let direction = { x: 1, y: 0 };
let nextDirection = { x: 1, y: 0 };
let food = { x: 15, y: 15 };
let obstacles = [];
let score = 0;
let highScore = localStorage.getItem('snakeHighScore') || 0;
let gameRunning = false;
let gamePaused = false;
let gameSpeed = 100;
let lastRenderTime = 0;

// UI elements
const scoreElement = document.getElementById('score');
const highScoreElement = document.getElementById('highScore');
const finalScoreElement = document.getElementById('finalScore');
const gameOverElement = document.getElementById('gameOver');
const startBtn = document.getElementById('startBtn');
const pauseBtn = document.getElementById('pauseBtn');
const restartBtn = document.getElementById('restartBtn');

// Initialize
highScoreElement.textContent = highScore;

// Event listeners
startBtn.addEventListener('click', startGame);
pauseBtn.addEventListener('click', togglePause);
restartBtn.addEventListener('click', restartGame);

document.addEventListener('keydown', handleKeyPress);

function handleKeyPress(e) {
    if (!gameRunning) return;
    
    switch(e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
            if (direction.y === 0) nextDirection = { x: 0, y: -1 };
            break;
        case 'ArrowDown':
        case 's':
        case 'S':
            if (direction.y === 0) nextDirection = { x: 0, y: 1 };
            break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
            if (direction.x === 0) nextDirection = { x: -1, y: 0 };
            break;
        case 'ArrowRight':
        case 'd':
        case 'D':
            if (direction.x === 0) nextDirection = { x: 1, y: 0 };
            break;
        case ' ':
            togglePause();
            break;
    }
    e.preventDefault();
}

function startGame() {
    snake = [{ x: 10, y: 10 }];
    direction = { x: 1, y: 0 };
    nextDirection = { x: 1, y: 0 };
    score = 0;
    gameSpeed = 100;
    gameRunning = true;
    gamePaused = false;
    obstacles = [];
    
    updateScore();
    generateFood();
    gameOverElement.classList.add('hidden');
    startBtn.disabled = true;
    pauseBtn.disabled = false;
    
    requestAnimationFrame(gameLoop);
}

function togglePause() {
    if (!gameRunning) return;
    gamePaused = !gamePaused;
    pauseBtn.textContent = gamePaused ? 'RESUME' : 'PAUSE';
    if (!gamePaused) {
        requestAnimationFrame(gameLoop);
    }
}

function restartGame() {
    startGame();
}

function gameLoop(currentTime) {
    if (!gameRunning || gamePaused) return;
    
    const timeSinceLastRender = currentTime - lastRenderTime;
    
    if (timeSinceLastRender < gameSpeed) {
        requestAnimationFrame(gameLoop);
        return;
    }
    
    lastRenderTime = currentTime;
    
    update();
    draw();
    
    requestAnimationFrame(gameLoop);
}

function update() {
    direction = nextDirection;
    
    // Move snake
    const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };
    
    // Check wall collision
    if (head.x < 0 || head.x >= canvas.width / GRID_SIZE || 
        head.y < 0 || head.y >= canvas.height / GRID_SIZE) {
        endGame();
        return;
    }
    
    // Check self collision
    if (snake.some(segment => segment.x === head.x && segment.y === head.y)) {
        endGame();
        return;
    }
    
    // Check obstacle collision
    if (obstacles.some(obstacle => obstacle.x === head.x && obstacle.y === head.y)) {
        endGame();
        return;
    }
    
    snake.unshift(head);
    
    // Check food collision
    if (head.x === food.x && head.y === food.y) {
        score += 10;
        updateScore();
        generateFood();
        
        // Add obstacle every 3 food items (score divisible by 30)
        if (score % 30 === 0) {
            spawnObstacle();
        }
        
        // Increase speed slightly
        gameSpeed = Math.max(50, gameSpeed - 2);
    } else {
        snake.pop();
    }
}

function draw() {
    // Clear canvas with grass pattern
    const grassGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    grassGradient.addColorStop(0, '#F0FFF0');
    grassGradient.addColorStop(1, '#E8F5E9');
    ctx.fillStyle = grassGradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw grid with subtle grass lines
    ctx.strokeStyle = 'rgba(144, 238, 144, 0.2)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= canvas.width; i += GRID_SIZE) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, canvas.height);
        ctx.stroke();
    }
    for (let i = 0; i <= canvas.height; i += GRID_SIZE) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(canvas.width, i);
        ctx.stroke();
    }
    
    // Draw snake with emoji
    snake.forEach((segment, index) => {
        ctx.font = `${GRID_SIZE}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(
            '🐍',
            segment.x * GRID_SIZE + GRID_SIZE / 2,
            segment.y * GRID_SIZE + GRID_SIZE / 2
        );
    });
    
    // Draw obstacles (rocks)
    obstacles.forEach((obstacle) => {
        ctx.font = `${GRID_SIZE}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(
            '🪨',
            obstacle.x * GRID_SIZE + GRID_SIZE / 2,
            obstacle.y * GRID_SIZE + GRID_SIZE / 2
        );
    });
    
    // Draw food (chicken)
    ctx.font = `${GRID_SIZE}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(
        '🐔',
        food.x * GRID_SIZE + GRID_SIZE / 2,
        food.y * GRID_SIZE + GRID_SIZE / 2
    );
}

function generateFood() {
    let newFood;
    do {
        newFood = {
            x: Math.floor(Math.random() * (canvas.width / GRID_SIZE)),
            y: Math.floor(Math.random() * (canvas.height / GRID_SIZE))
        };
    } while (snake.some(segment => segment.x === newFood.x && segment.y === newFood.y) ||
             obstacles.some(obstacle => obstacle.x === newFood.x && obstacle.y === newFood.y));
    
    food = newFood;
}

function spawnObstacle() {
    let newObstacle;
    let attempts = 0;
    do {
        newObstacle = {
            x: Math.floor(Math.random() * (canvas.width / GRID_SIZE)),
            y: Math.floor(Math.random() * (canvas.height / GRID_SIZE))
        };
        attempts++;
    } while (attempts < 50 && (
        snake.some(segment => segment.x === newObstacle.x && segment.y === newObstacle.y) ||
        obstacles.some(obstacle => obstacle.x === newObstacle.x && obstacle.y === newObstacle.y) ||
        (newObstacle.x === food.x && newObstacle.y === food.y)
    ));
    
    if (attempts < 50) {
        obstacles.push(newObstacle);
    }
}

function updateScore() {
    scoreElement.textContent = score;
    
    if (score > highScore) {
        highScore = score;
        highScoreElement.textContent = highScore;
        localStorage.setItem('snakeHighScore', highScore);
    }
}

function endGame() {
    gameRunning = false;
    finalScoreElement.textContent = score;
    gameOverElement.classList.remove('hidden');
    startBtn.disabled = false;
    pauseBtn.disabled = true;
    pauseBtn.textContent = 'PAUSE';
}

// Initial draw
draw();
