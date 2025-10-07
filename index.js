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

]

const white_color_Id = 7;

const canvas = document.getElementById('board');
const ctx = canvas.getContext('2d');
ctx.canvas.width = cols * blockSize;
ctx.canvas.height = rows * blockSize;

class Board {
    constructor(ctx) {
        this.ctx = ctx;
        this.grid = this.generateBoard(); // ✅ tạo grid khi khởi tạo
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
    }
}

const board = new Board(ctx);
board.drawBoard();
