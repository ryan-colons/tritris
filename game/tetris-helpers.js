const mapInfo = {
    width: 10,
    height: 14
};
const spawnPos = {
    x: 4,
    y: 0
};

const movingBlockSymbol = "@";
const restingBlockSymbol = "#"
const emptySpaceSymbol = ".";

class Block {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

const straightPentomino = [
    new Block(x - 1, 0),
    new Block(x, 0),
    new Block(x + 1, 0),
    new Block(x + 2, 0),
];
const squarePentomino = [
    new Block(x, 0),
    new Block(x, 1),
    new Block(x + 1, 0),
    new Block(x + 1, 1),
];
const zagPentomino = [
    new Block(x - 1, 1),
    new Block(x, 1),
    new Block(x, 0),
    new Block(x + 1, 0),
];
const trianglePentomino = [
    new Block(x, 0),
    new Block(x - 1, 1),
    new Block(x + 1, 1),
    new Block(x, 1),
];
const hookPentomino = [
    new Block(x - 1, 0),
    new Block(x, 0),
    new Block(x + 1, 0),
    new Block(x - 1, 1),
];

class Tetromino {
    constructor(x) {
        let pentominoShapes = [straightPentomino, squarePentomino, zagPentomino, trianglePentomino, hookPentomino];
        let chosenPentominoShape = pentominoShapes[Math.floor(Math.random() * pentominoShapes.length)];
        this.blocks = chosenPentominoShape;
    }
}

function initMap() {
    let map = [];
    for (let i = 0; i < mapInfo.width; i++) {
        map[i] = [];
        for (let j = 0; j < mapInfo.height; j++) {
            map[i][j] = emptySpaceSymbol;
        }
    }
    return map;
}

function spawnTetromino () {
    score++;
    return new Tetromino(spawnPos.x);
}

function checkSpaceOccupied(x, y) {
    if (x < 0 || x >= mapInfo.width || y >= mapInfo.height) return true;
    return map[x][y] === restingBlockSymbol;
}

function checkSpacesOccupied(blocks) {
    for (let i = 0; i < blocks.length; i++) {
        let block = blocks[i];
        if (checkSpaceOccupied(block.x, block.y)) {
            return true;
        }
    }
    return false;
}

function getHighestLeftestBlock(blocks) {
    let highest = blocks[0];
    for (let i = 1; i < blocks.length; i++) {
        let block = blocks[i];
        if (block.y <= highest.y) {
            if (block.y < highest.y || block.x < highest.x) {
                highest = block;
            }
        }
    }
    return highest;
}

function getRotatedCoords(blocks) {
    let origin = getHighestLeftestBlock(blocks);
    let xOffset = origin.x, yOffset = origin.y;
    for (let i = 0; i < blocks.length; i++) {
        let block = blocks[i];
        block.x -= xOffset; block.y -= yOffset;
        let temp = block.x;
        block.x = block.y;
        block.y = -1 * temp;
        block.x += xOffset; block.y += yOffset;
    }
    return blocks;
}

function getShiftedCoords(blocks, xIncrement, yIncrement) {
    return blocks.map(block => {
        return new Block(block.x + xIncrement, block.y + yIncrement);
    });
}

function rotate() {
    let rotatedCoords = getRotatedCoords(currentTetromino.blocks);
    let canRotate = !checkSpacesOccupied(rotatedCoords);

    if (canRotate) {
        currentTetromino.blocks = rotatedCoords;
    }
}

function lower () {
    let loweredCoords = getShiftedCoords(currentTetromino.blocks, 0, 1);
    let canDrop = !checkSpacesOccupied(loweredCoords);

    for (let i = 0; i < currentTetromino.blocks.length; i++) {
        let block = currentTetromino.blocks[i];
        if (canDrop) {
            currentTetromino.blocks[i].y += 1;
        } else {
            map[block.x][block.y] = restingBlockSymbol;
        }
    }
    if (!canDrop) {
        currentTetromino = new Tetromino(spawnPos.x);
    }

    return canDrop;
}

// direction should be -1 (left) or 1 (right)
function shift(direction) {
    let shiftedCoords = getShiftedCoords(currentTetromino.blocks, direction, 0);
    let canShift = !checkSpacesOccupied(shiftedCoords);
    if (canShift) {
        for (let i = 0; i < currentTetromino.blocks.length; i++) {
            currentTetromino.blocks[i].x += direction;
        }
    }
}

function checkDefeat () {
    for (let x = 0; x < mapInfo.width; x++) {
        if (map[x][0] === restingBlockSymbol) return true;
    }
    return false;
}

function printMap () {
    let returnString = "";

    for (let i = 0; i < mapInfo.height; i++) {
        for (let j = 0; j < mapInfo.width; j++) {
            let char = map[j][i];
            currentTetromino.blocks.forEach(block => {
                if (j === block.x && i == block.y) {
                    char = movingBlockSymbol;
                    return;
                }
            });
            returnString += char + " ";
        }
        returnString += "\n";
    }
    if (checkDefeat()) {
        returnString += "\n== GAME OVER ==\n";
        initMap();
    }
    return returnString;
}

let map = initMap();
let currentTetromino = spawnTetromino();
let score = 0;

module.exports = {
    shift: shift,
    lower: lower,
    rotate: rotate,
    printMap: printMap,
    score: score,
}