// Get the canvas element and its context
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Define paddle properties
const paddleWidth = 75;
const paddleHeight = 10;
let paddleX = (canvas.width - paddleWidth) / 2;

// Define ball properties
const ballRadius = 10;
let ballX = canvas.width / 2;
let ballY = canvas.height - paddleHeight - ballRadius;
let dx = 2;
let dy = -2;

// Define brick properties
const brickRowCount = 3;
const brickColumnCount = 5;
const brickWidth = 75;
const brickHeight = 20;
const brickPadding = 10;
const brickOffsetTop = 30;
const brickOffsetLeft = 30;

// Create array to hold brick objects
let bricks = [];
for (let c = 0; c < brickColumnCount; c++) {
    bricks[c] = [];
    for (let r = 0; r < brickRowCount; r++) {
        bricks[c][r] = { x: 0, y: 0, status: 1 };
    }
}

// Variable to track game state
let gameStarted = false;

// Function to handle game over
function gameOver() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Game Over", canvas.width / 2 - 40, canvas.height / 2);
    ctx.fillText("Press Retry to play again", canvas.width / 2 - 100, canvas.height / 2 + 20);
    gameStarted = false;
}

// Retry button click handler
document.getElementById("retryButton").addEventListener("click", function() {
    gameStarted = true;
    initializeGame();
});

// Main game loop
function draw() {
    if (!gameStarted) {
        gameOver();
        return;
    }
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw bricks
    drawBricks();

    // Draw the paddle and ball
    drawPaddle();
    drawBall();

    // Move the paddle
    if (rightPressed && paddleX < canvas.width - paddleWidth) {
        paddleX += 7;
    } else if (leftPressed && paddleX > 0) {
        paddleX -= 7;
    }

    // Update the ball position
    ballX += dx;
    ballY += dy;

    // Bounce the ball off the walls
    if (ballX + dx > canvas.width - ballRadius || ballX + dx < ballRadius) {
        dx = -dx;
    }
    if (ballY + dy < ballRadius) {
        dy = -dy;
    }

    // Collision detection with paddle
    collisionDetection();

    // Request animation frame
    requestAnimationFrame(draw);
}

// Start button click handler
document.getElementById("startButton").addEventListener("click", function() {
    gameStarted = true;
    initializeGame(); // Add this line if you have an initialization function
});


// Event listeners for paddle movement
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

let rightPressed = false;
let leftPressed = false;

// Functions to handle key events
function keyDownHandler(e) {
    if (e.key === "Right" || e.key === "ArrowRight") {
        rightPressed = true;
    } else if (e.key === "Left" || e.key === "ArrowLeft") {
        leftPressed = true;
    }
}

function keyUpHandler(e) {
    if (e.key === "Right" || e.key === "ArrowRight") {
        rightPressed = false;
    } else if (e.key === "Left" || e.key === "ArrowLeft") {
        leftPressed = false;
    }
}

// Draw the paddle
function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}

// Draw the ball
function drawBall() {
    ctx.beginPath();
    ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}

// Function to draw bricks
function drawBricks() {
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            if (bricks[c][r].status === 1) {
                let brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
                let brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                ctx.fillStyle = "#0095DD";
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

// Collision detection between ball and paddle
function collisionDetection() {
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            let b = bricks[c][r];
            if (b.status === 1) {
                if (ballX > b.x && ballX < b.x + brickWidth && ballY > b.y && ballY < b.y + brickHeight) {
                    dy = -dy;
                    b.status = 0; // Mark brick as broken
                }
            }
        }
    }
}

// Start the game loop
draw();

