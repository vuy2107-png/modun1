const cols = 10;
const rows = 20;
const blockSize = 30;
const colorMapping = [
    'red',
    'green',
    'blue',
    'yellow',
    'magenta',
    'cyan',
    'purple',
    'white',
];

const brickLayout = [
    [
        [7,7,7],
        [0,0,7],
        [7,0,0],
    ],
    [
        [7,7,7,7],
        [1,1,1,1],
        [7,7,7,7],
        [7,7,7,7],
    ],
    [
        [7,7,7],
        [2,2,2],
        [7,7,2],
    ],
    [
        [7,7,7],
        [3,3,3],
        [3,7,7],
    ],
    [
        [7,7,7,7],
        [7,4,4,7],
        [7,4,4,7],
        [7,7,7,7],
    ],
    [
        [7,7,7],
        [7,5,5],
        [5,5,7],
    ],
    [
        [7,7,7],
        [6,6,6],
        [7,6,7],
    ]
];

const white_color_Id = 7;

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
}

const board = new Board(ctx);
board.drawBoard();

const randomId = Math.floor(Math.random() * brickLayout.length);
const brick = new Brick(randomId);
brick.draw(ctx);
