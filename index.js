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
    moveLeft() { if (this.colPos > 0) this.colPos--; }
    moveRight() { if (this.colPos < cols - 3) this.colPos++; }
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
    brick.moveDown();
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

    if (e.key === 'ArrowLeft') brick.moveLeft();
    else if (e.key === 'ArrowRight') brick.moveRight();
    else if (e.key === 'ArrowDown') brick.moveDown();

    drawGame();
});
