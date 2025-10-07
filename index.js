const cols = 10;
const rows = 20;
const blockSize = 30;
const colorMapping = [
    'red', 'green', 'blue', 'yellow', 'magenta', 'cyan', 'purple', 'white'
];
const white_color_Id = 7;

const brickLayout = [
    [ // Z
        [7,7,7],
        [0,0,7],
        [7,0,0],
    ],
    [ // I
        [7,7,7,7],
        [1,1,1,1],
        [7,7,7,7],
        [7,7,7,7],
    ],
    [ // L
        [7,7,7],
        [2,2,2],
        [7,7,2],
    ],
    [ // J
        [7,7,7],
        [3,3,3],
        [3,7,7],
    ],
    [ // O
        [7,7,7,7],
        [7,4,4,7],
        [7,4,4,7],
        [7,7,7,7],
    ],
    [ // S
        [7,7,7],
        [7,5,5],
        [5,5,7],
    ],
    [ // T
        [7,7,7],
        [6,6,6],
        [7,6,7],
    ]
];

const canvas = document.getElementById('board');
const ctx = canvas.getContext('2d');
ctx.canvas.width = cols * blockSize;
ctx.canvas.height = rows * blockSize;

class Board {
    constructor(ctx) {
        this.ctx = ctx;
        this.grid = this.generateBoard();
    }

    generateBoard() {
        return Array.from({ length: rows }, () => Array(cols).fill(white_color_Id));
    }

    drawCell(x, y, colorId) {
        this.ctx.fillStyle = colorMapping[colorId] || colorMapping[white_color_Id];
        this.ctx.fillRect(x * blockSize, y * blockSize, blockSize, blockSize);
        this.ctx.strokeStyle = 'black';
        this.ctx.strokeRect(x * blockSize, y * blockSize, blockSize, blockSize);
    }

    drawBoard() {
        for (let row = 0; row < this.grid.length; row++) {
            for (let col = 0; col < this.grid[row].length; col++) {
                this.drawCell(col, row, this.grid[row][col]);
            }
        }
    }
    merge(brick) {
        brick.layout.forEach((r, rowIdx) => {
            r.forEach((value, colIdx) => {
                if (value !== white_color_Id) {
                    this.grid[brick.rowPos + rowIdx][brick.colPos + colIdx] = value;
                }
            });
        });
    }
    collision(brick)
    {
        for (let row = 0; row < brick.layout.length; row++) {
            for (let col = 0; col < brick.layout[row].length; col++) {
                if (brick.layout[row][col] === white_color_Id) continue;

                const newY = brick.rowPos + row + 1;
                const newX = brick.colPos + col;
                if (newY >= rows) return true;
                if (this.grid[newY][newX] !== white_color_Id) return true;
            }
        }
        return false;
    }
}

class Brick {
    constructor(id) {
        this.id = id;
        this.layout = brickLayout[id];
        this.colPos = 3;
        this.rowPos = 0;
    }

    draw(ctx) {
        for (let row = 0; row < this.layout.length; row++) {
            for (let col = 0; col < this.layout[row].length; col++) {
                const colorId = this.layout[row][col];
                if (colorId !== white_color_Id) {
                    ctx.fillStyle = colorMapping[colorId];
                    ctx.fillRect(
                        (this.colPos + col) * blockSize,
                        (this.rowPos + row) * blockSize,
                        blockSize,
                        blockSize
                    );
                    ctx.strokeStyle = 'black';
                    ctx.strokeRect(
                        (this.colPos + col) * blockSize,
                        (this.rowPos + row) * blockSize,
                        blockSize,
                        blockSize
                    );
                }
            }
        }
    }

    moveDown() { this.rowPos++; }
    moveLeft() { this.colPos--; }
    moveRight() { this.colPos++; }
}

const board = new Board(ctx);
let brick = null;
let isPlaying = false;
let gameInterval = null;
let score = 0;

function drawGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    board.drawBoard();
    if (brick) brick.draw(ctx);
}

function update() {
    if (!board.collision(brick)) {
        brick.moveDown();
    } else {
        board.merge(brick);
        score += 10;
        document.getElementById('score').innerText = score;

        const randomId = Math.floor(Math.random() * brickLayout.length);
        brick = new Brick(randomId);

        if (board.collision(brick, 0)) {
            clearInterval(gameInterval);
            isPlaying = false;
            alert('Game Over!');
            return;
        }
    }
    drawGame();
}


const playBtn = document.querySelector('.playBtn');
playBtn.addEventListener('click', () => {
    if (!isPlaying) {
        isPlaying = true;
        score = 0;
        document.getElementById('score').innerText = score;
        const randomId = Math.floor(Math.random() * brickLayout.length);
        brick = new Brick(randomId);
        drawGame();
        gameInterval = setInterval(update, 500);
    }
});

document.addEventListener('keydown', (e) => {
    if (!isPlaying || !brick) return;

    if (e.key === 'ArrowLeft') {
        brick.colPos--;
        if (board.collision(brick, 0)) brick.colPos++;
    }
    else if (e.key === 'ArrowRight') {
        brick.colPos++;
        if (board.collision(brick, 0)) brick.colPos--;
    }
    else if (e.key === 'ArrowDown') {
        if (!board.collision(brick)) brick.moveDown();
    }

    drawGame();
});

