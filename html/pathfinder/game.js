const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const levelIndicator = document.getElementById('level-indicator');
const timeLeftDisplay = document.getElementById('time-left');

let currentLevel = 1;
let player = { x: 0, y: 0, size: 20, speed: 2, targetX: 0, targetY: 0 };
let timerInterval;
let timeLeft;
let walls = [];
let secretRoomActive = false;
let gameStarted = false;
let endPoint = { x: 0, y: 0, size: 20 };
let secretEntrance = { x: 0, y: 0, size: 20 };
let levels = [];
let gameLoopActive = true;

const CELL_SIZE = 20;
const MAX_WIDTH = canvas.width / CELL_SIZE; // 40 cells
const MAX_HEIGHT = canvas.height / CELL_SIZE; // 30 cells
const SECRET_CODE = "THEBESTGXMES";
const SECRET_BLOCK_COLOR = '#ff4d50'; // Lighter shade of red for the secret block
const SECRET_LEVEL = 7; // Change this to the level you want the secret entrance to generate on

// Directions for DFS maze generation: up, right, down, left
const DIRECTIONS = [
    { dx: 0, dy: -1 },
    { dx: 1, dy: 0 },
    { dx: 0, dy: 1 },
    { dx: -1, dy: 0 }
];

function generateMaze(width, height) {
    const maze = Array(height).fill().map(() => Array(width).fill(1)); // 1 for wall, 0 for path

    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    function carve(x, y) {
        maze[y][x] = 0; // Mark the cell as a path
        shuffle(DIRECTIONS); // Shuffle directions to ensure randomness
        for (const { dx, dy } of DIRECTIONS) {
            const nx = x + 2 * dx;
            const ny = y + 2 * dy;
            if (nx >= 0 && ny >= 0 && nx < width && ny < height && maze[ny][nx] === 1) {
                maze[y + dy][x + dx] = 0; // Carve the wall between
                carve(nx, ny);
            }
        }
    }

    carve(1, 1); // Start carving from inside the maze to avoid outer walls being carved
    maze[1][1] = 0; // Start point
    maze[height - 2][width - 2] = 0; // End point

    // Surround the maze with walls
    for (let i = 0; i < height; i++) {
        maze[i][0] = 1;
        maze[i][width - 1] = 1;
    }
    for (let i = 0; i < width; i++) {
        maze[0][i] = 1;
        maze[height - 1][i] = 1;
    }

    return maze;
}

function isMazeSolvable(maze, startX, startY, endX, endY) {
    const height = maze.length;
    const width = maze[0].length;
    const visited = Array(height).fill().map(() => Array(width).fill(false));
    const stack = [{ x: startX, y: startY }];
    visited[startY][startX] = true;

    while (stack.length > 0) {
        const { x, y } = stack.pop();

        if (x === endX && y === endY) return true;

        for (const { dx, dy } of DIRECTIONS) {
            const nx = x + dx;
            const ny = y + dy;
            if (nx >= 0 && ny >= 0 && nx < width && ny < height && maze[ny][nx] === 0 && !visited[ny][nx]) {
                visited[ny][nx] = true;
                stack.push({ x: nx, y: ny });
            }
        }
    }

    return false;
}

function generateLevels() {
    for (let i = 1; i <= 10; i++) {
        const width = Math.min(20 + i * 2, MAX_WIDTH); // increase width with level, cap at MAX_WIDTH
        const height = Math.min(15 + i * 2, MAX_HEIGHT); // increase height with level, cap at MAX_HEIGHT
        let maze;
        do {
            maze = generateMaze(width, height);
        } while (!isMazeSolvable(maze, 1, 1, width - 2, height - 2));
        const time = Math.min(15 + i * 5, 60); // increase time with level, cap at 60 seconds
        levels.push({ maze, time });
    }
}

function renderLevel() {
    const { maze, time } = levels[currentLevel - 1];
    walls = [];
    player.x = 20;
    player.y = 20;
    player.targetX = 20;
    player.targetY = 20;
    gameStarted = false;
    timeLeft = time;
    secretRoomActive = false;
    secretEntrance = null;
    gameLoopActive = true;

    maze.forEach((row, rowIndex) => {
        row.forEach((cell, colIndex) => {
            if (cell === 1) {
                walls.push({ x: colIndex * CELL_SIZE, y: rowIndex * CELL_SIZE, size: CELL_SIZE });
            } else if (rowIndex === 1 && colIndex === 1) {
                player.x = colIndex * CELL_SIZE;
                player.y = rowIndex * CELL_SIZE;
                player.targetX = player.x;
                player.targetY = player.y;
            } else if (rowIndex === maze.length - 2 && colIndex === row.length - 2) {
                endPoint = { x: colIndex * CELL_SIZE, y: rowIndex * CELL_SIZE, size: CELL_SIZE };
            } else if (cell === 2) {
                secretEntrance = { x: colIndex * CELL_SIZE, y: rowIndex * CELL_SIZE, size: CELL_SIZE };
            }
        });
    });

    if (currentLevel === SECRET_LEVEL) { // Generate secret entrance on the specified level
        addSecretEntrance(maze);
    }

    timeLeftDisplay.textContent = timeLeft;
    levelIndicator.textContent = `Level: ${currentLevel}`;
    requestAnimationFrame(gameLoop);
}

function addSecretEntrance(maze) {
    const edges = [];
    const width = maze[0].length;
    const height = maze.length;

    // Collect all edge cells
    for (let i = 1; i < width - 1; i++) {
        edges.push({ x: i, y: 0 });
        edges.push({ x: i, y: height - 1 });
    }
    for (let i = 1; i < height - 1; i++) {
        edges.push({ x: 0, y: i });
        edges.push({ x: width - 1, y: i });
    }

    // Ensure the entrance is accessible
    let entrance;
    do {
        const { x, y } = edges[Math.floor(Math.random() * edges.length)];
        entrance = { x, y };
    } while (maze[entrance.y][entrance.x] === 0);

    maze[entrance.y][entrance.x] = 2; // 2 for the secret entrance
    secretEntrance = { x: entrance.x * CELL_SIZE, y: entrance.y * CELL_SIZE, size: CELL_SIZE };
    console.log(`Secret entrance at (${secretEntrance.x}, ${secretEntrance.y})`); // Debugging output
}

function startTimer() {
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        timeLeft--;
        timeLeftDisplay.textContent = timeLeft;
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            alert('Time\'s up! Try again.');
            renderLevel();
        }
    }, 1000);
}

function gameLoop() {
    if (!gameLoopActive) return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawWalls();
    drawPlayer();
    drawEndPoint();
    if (secretEntrance) drawSecretEntrance();

    // Move player smoothly
    player.x += (player.targetX - player.x) * 0.1;
    player.y += (player.targetY - player.y) * 0.1;

    if (Math.abs(player.x - player.targetX) < 0.1) player.x = player.targetX;
    if (Math.abs(player.y - player.targetY) < 0.1) player.y = player.targetY;

    if (checkCollision(player, endPoint)) {
        clearInterval(timerInterval);
        completeLevel();
    } else if (checkCollision(player, secretEntrance)) {
        clearInterval(timerInterval);
        console.log("Collided with secret entrance");
        activateSecret();
    } else {
        requestAnimationFrame(gameLoop);
    }
}

function drawWalls() {
    walls.forEach(wall => {
        ctx.fillStyle = 'red';
        ctx.fillRect(wall.x, wall.y, wall.size, wall.size);
    });
}

function drawSecretEntrance() {
    ctx.fillStyle = SECRET_BLOCK_COLOR;
    ctx.fillRect(secretEntrance.x, secretEntrance.y, secretEntrance.size, secretEntrance.size);
}

function drawPlayer() {
    ctx.fillStyle = 'blue';
    ctx.fillRect(player.x, player.y, player.size, player.size);
}

function drawEndPoint() {
    ctx.fillStyle = 'green';
    ctx.fillRect(endPoint.x, endPoint.y, endPoint.size, endPoint.size);
}

function checkCollision(a, b) {
    return a && b && a.x < b.x + b.size &&
        a.x + a.size > b.x &&
        a.y < b.y + b.size &&
        a.y + a.size > b.y;
}

function movePlayer(dx, dy) {
    if (!gameStarted) {
        gameStarted = true;
        startTimer();
    }

    const newX = player.targetX + dx * CELL_SIZE;
    const newY = player.targetY + dy * CELL_SIZE;

    if (newX < 0 || newY < 0 || newX >= canvas.width || newY >= canvas.height) {
        return; // Prevent moving out of bounds
    }

    const futurePlayer = { x: newX, y: newY, size: player.size };

    if (!walls.some(wall => checkCollision(futurePlayer, wall))) {
        player.targetX = newX;
        player.targetY = newY;
    }

    if (checkCollision(futurePlayer, secretEntrance)) {
        console.log("Collided with secret entrance");
        activateSecret();
    } else if (checkCollision(futurePlayer, endPoint)) {
        console.log("Collided with end point");
        completeLevel();
    }
}

function completeLevel() {
    clearInterval(timerInterval);
    alert('Level Complete!');
    currentLevel++;
    if (currentLevel <= 10) {
        renderLevel();
    } else {
        alert('Congratulations! You completed all levels! Reload to get new randomized levels!');
    }
}

function activateSecret() {
    console.log("Secret room activated");
    clearInterval(timerInterval);
    gameLoopActive = false;
    fadeToBlack(0);
}

function fadeToBlack(alpha) {
    ctx.fillStyle = `rgba(0, 0, 0, ${alpha})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    if (alpha < 1) {
        requestAnimationFrame(() => fadeToBlack(alpha + 0.02));
    } else {
        setTimeout(showSecretMessage, 3000); // Wait 3 seconds before showing the secret message
    }
}

function showSecretMessage() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'white';
    ctx.font = '20px Arial';
    ctx.fillText('For secret games and a hidden prize,', 50, 50);
    ctx.fillText('Here is the code you need to memorize:', 50, 80);
    ctx.fillText(SECRET_CODE, 50, 110);
    ctx.fillText('Go to the main game page,', 50, 140);
    ctx.fillText('Find the area unlike the rest.', 50, 170);
    ctx.fillText('Click there and you\'ll be blessed.', 50, 200);
}

// Prevent arrow keys from scrolling the page
window.addEventListener('keydown', (event) => {
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
        event.preventDefault();
    }
});

document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowUp') movePlayer(0, -1);
    if (event.key === 'ArrowDown') movePlayer(0, 1);
    if (event.key === 'ArrowLeft') movePlayer(-1, 0);
    if (event.key === 'ArrowRight') movePlayer(1, 0);
});

generateLevels();
renderLevel();
