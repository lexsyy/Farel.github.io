const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let score = 0;
let gravity = 0.8;
let isJumping = false;
let jumpPower = 10;
let character = { x: 100, y: canvas.height - 150, width: 50, height: 50, speed: 5, velocityY: 0 };

let ground = { x: 0, y: canvas.height - 50, width: canvas.width, height: 50 };
let platforms = [
    { x: 100, y: canvas.height - 200, width: 200, height: 20 },
    { x: 400, y: canvas.height - 300, width: 200, height: 20 },
    { x: 700, y: canvas.height - 400, width: 200, height: 20 },
];
let coins = [
    { x: 150, y: canvas.height - 250, width: 30, height: 30 },
    { x: 450, y: canvas.height - 350, width: 30, height: 30 },
    { x: 750, y: canvas.height - 450, width: 30, height: 30 }
];
let enemies = [
    { x: 300, y: canvas.height - 150, width: 50, height: 50, speed: 2 },
    { x: 600, y: canvas.height - 250, width: 50, height: 50, speed: 2 }
];

function drawCharacter() {
    ctx.fillStyle = 'brown';
    ctx.fillRect(character.x, character.y, character.width, character.height);
}

function drawGround() {
    ctx.fillStyle = 'green';
    ctx.fillRect(ground.x, ground.y, ground.width, ground.height);
}

function drawPlatforms() {
    ctx.fillStyle = 'orange';
    platforms.forEach(platform => {
        ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
    });
}

function drawCoins() {
    ctx.fillStyle = 'yellow';
    coins.forEach(coin => {
        ctx.beginPath();
        ctx.arc(coin.x + coin.width / 2, coin.y + coin.height / 2, coin.width / 2, 0, 2 * Math.PI);
        ctx.fill();
    });
}

function drawEnemies() {
    ctx.fillStyle = 'red';
    enemies.forEach(enemy => {
        ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
    });
}

function moveCharacter() {
    if (isJumping) {
        character.velocityY -= gravity;
        character.y -= character.velocityY;
    } else {
        character.y = ground.y - character.height;
        character.velocityY = 0;
    }

    // Check for collisions with platforms
    platforms.forEach(platform => {
        if (character.x + character.width > platform.x && character.x < platform.x + platform.width &&
            character.y + character.height <= platform.y && character.y + character.height + character.velocityY >= platform.y) {
            character.y = platform.y - character.height;
            character.velocityY = 0;
            isJumping = false;
        }
    });
}

function jump() {
    if (!isJumping) {
        isJumping = true;
        character.velocityY = jumpPower;
    }
}

function collectCoins() {
    coins.forEach((coin, index) => {
        if (character.x + character.width > coin.x && character.x < coin.x + coin.width &&
            character.y + character.height > coin.y && character.y < coin.y + coin.height) {
            coins.splice(index, 1); // Remove collected coin
            score += 10; // Increase score
        }
    });
}

function moveEnemies() {
    enemies.forEach(enemy => {
        enemy.x += enemy.speed;
        if (enemy.x + enemy.width >= canvas.width || enemy.x <= 0) {
            enemy.speed = -enemy.speed; // Reverse direction when hitting the edges
        }
    });
}

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawGround();
    drawPlatforms();
    drawCoins();
    drawEnemies();
    drawCharacter();
    moveCharacter();
    collectCoins();
    moveEnemies();
    
    document.querySelector('.score').innerText = `Score: ${score}`;
    
    if (character.y <= ground.y - character.height) {
        isJumping = true;
    } else {
        isJumping = false;
    }

    requestAnimationFrame(gameLoop);
}

document.addEventListener('keydown', function(e) {
    if (e.code === 'Space') {
        jump();
    }
});

gameLoop();
