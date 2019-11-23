const mapInfo = {
    width: 6,
    height: 8
};
const spawnPos = {
    x: 3,
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

class Triomino {
    constructor(x) {
        if (Math.random() > 0.5) {
            this.blocks = [new Block(x, 0), new Block(x + 1, 0), new Block(x + 2, 0)];
        } else {
            this.blocks = [new Block(x, 0), new Block(x + 1, 0), new Block(x, 1)];
        }
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

function spawnTriomino () {
    return new Triomino(spawnPos.x);
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
    let rotatedCoords = getRotatedCoords(currentTriomino.blocks);
    let canRotate = !checkSpacesOccupied(rotatedCoords);

    if (canRotate) {
        currentTriomino.blocks = rotatedCoords;
    }
}

function lower () {
    let loweredCoords = getShiftedCoords(currentTriomino.blocks, 0, 1);
    let canDrop = !checkSpacesOccupied(loweredCoords);

    for (let i = 0; i < currentTriomino.blocks.length; i++) {
        let block = currentTriomino.blocks[i];
        if (canDrop) {
            currentTriomino.blocks[i].y += 1;
        } else {
            map[block.x][block.y] = restingBlockSymbol;
        }
    }
    if (!canDrop) {
        currentTriomino = new Triomino(spawnPos.x);
    }

    return canDrop;
}

// direction should be -1 (left) or 1 (right)
function shift(direction) {
    let shiftedCoords = getShiftedCoords(currentTriomino.blocks, direction, 0);
    let canShift = !checkSpacesOccupied(shiftedCoords);
    if (canShift) {
        for (let i = 0; i < currentTriomino.blocks.length; i++) {
            currentTriomino.blocks[i].x += direction;
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
            currentTriomino.blocks.forEach(block => {
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
let currentTriomino = spawnTriomino();

module.exports = {
    shift: shift,
    lower: lower,
    rotate: rotate,
    printMap: printMap,
}