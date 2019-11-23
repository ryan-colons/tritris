const mapInfo = {
    width: 8,
    height: 12
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
    new Block(spawnPos.x - 1, 0),
    new Block(spawnPos.x, 0),
    new Block(spawnPos.x + 1, 0),
    new Block(spawnPos.x + 2, 0),
];
const squarePentomino = [
    new Block(spawnPos.x, 0),
    new Block(spawnPos.x, 1),
    new Block(spawnPos.x + 1, 0),
    new Block(spawnPos.x + 1, 1),
];
const zagPentomino = [
    new Block(spawnPos.x - 1, 1),
    new Block(spawnPos.x, 1),
    new Block(spawnPos.x, 0),
    new Block(spawnPos.x + 1, 0),
];
const trianglePentomino = [
    new Block(spawnPos.x, 0),
    new Block(spawnPos.x - 1, 1),
    new Block(spawnPos.x + 1, 1),
    new Block(spawnPos.x, 1),
];
const hookPentomino = [
    new Block(spawnPos.x - 1, 0),
    new Block(spawnPos.x, 0),
    new Block(spawnPos.x + 1, 0),
    new Block(spawnPos.x - 1, 1),
];

function cloneBlocks(blocks) {
    let newBlocks = [];
    blocks.forEach(block => {
        newBlocks.push(new Block(block.x, block.y));
    })
    return newBlocks;
}

class Tetromino {
    constructor() {
        let pentominoShapes = [straightPentomino, squarePentomino, zagPentomino, trianglePentomino, hookPentomino];
        let chosenPentominoShape = pentominoShapes[Math.floor(Math.random() * pentominoShapes.length)];
        this.blocks = cloneBlocks(chosenPentominoShape);
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
    score = 0;
    return map;
}

function spawnTetromino () {
    score++;
    return new Tetromino();
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
            checkForCompleteLines();
        }
    }
    if (!canDrop) {
        currentTetromino = spawnTetromino();
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

function removeLine(i) {
    for (; i > 0; i--) {
        for (let j = 0; j < mapInfo.width; j++) {
            map[j][i] = map[j][i-1];
        }
    }
    score += 10;
}

function checkForCompleteLines() {
    for (let i = mapInfo.height - 1; i >= 0; i--) {
        let fullLine = true;
        for (let j = 0; j < mapInfo.width; j++) {
            if (map[j][i] !== restingBlockSymbol) {
                fullLine = false;
                break;
            }
        }
        if (fullLine) {
            removeLine(i);
            i++;
        }
    }
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
        returnString += "\n== GAME OVER ==\nScore: " + score + "pts\n";
        map = initMap();
    }
    return returnString;
}

let score = 0;
let map = initMap();
let currentTetromino = spawnTetromino();

module.exports = {
    shift: shift,
    lower: lower,
    rotate: rotate,
    printMap: printMap,
    score: function() {return score},
}