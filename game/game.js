const root = document.getElementById("root");
const GAME_SIZE = 20; // cells (pair)
const GAME_SPEED = 200; // ms

(() => {
    const gameContainer = init();
    root.appendChild(gameContainer);
    start().then();
})();

/**
 * Wait the amount of milliseconds given.
 * @param time
 * @returns {Promise<*>}
 */
async function sleep(time) {
    return new Promise(r => setTimeout(r, time));
}

/**
 * Creates a nex div with specified type and returns it.
 * @param type={"cell"|"wall"|"door"}
 * @returns {HTMLDivElement}
 */
function generate(type = "cell") {
    const wall = document.createElement("div");
    wall.classList.add(type);
    return wall;
}

/**
 * Returns true if given index is a door in the wall of the given length.
 * @param index
 * @param wallLength
 * @returns {boolean}
 */
function isDoor(index, wallLength = GAME_SIZE) {
    return (index == wallLength/2 || index == wallLength/2 -1);
}

function init() {
    const container = document.createElement("div");
    container.id="gameContainer";

    for(let i=0; i<GAME_SIZE+2; ++i) {
        // First wall line
        container.appendChild(generate(isDoor(i, GAME_SIZE+2) ? "door" : "wall"));
    }
    for(let i=0; i<GAME_SIZE; ++i) {
        // Left wall column
        container.appendChild(generate(isDoor(i) ? "door" : "wall"));
        // All game cells
        for(let j=0; j<GAME_SIZE; ++j) {
            const cell = generate("cell");
            cell.id = `${j}:${i}`;
            container.appendChild(cell);
        }
        // Right wall column
        container.appendChild(generate(isDoor(i) ? "door" : "wall"));
    }
    for(let i=0; i<GAME_SIZE+2; ++i) {
        // Last wall line
        container.appendChild(generate(isDoor(i, GAME_SIZE+2) ? "door" : "wall"));
    }

    return container;
}

/**
 * Returns the position of the element passed as an argument.
 * @param element
 * @returns {{x: *, y: *}}
 */
function elementToPos(element) {
    const coords = element.id.split(":").map(coord => parseInt(coord));
    return {x: coords[0], y: coords[1]};
}

/**
 * Returns the Element corresponding to the given position.
 * @param pos
 * @returns {HTMLElement|undefined}
 */
function posToElement(pos) {
    if(pos.x >= 0 && pos.y >= 0 && pos.x < GAME_SIZE && pos.y < GAME_SIZE) {
        return document.getElementById(`${pos.x}:${pos.y}`);
    } else {
        return undefined;
    }
}

/**
 * Returns the position of the next head cell, given the actual head and the direction.
 * @param position
 * @param direction
 * @returns {{x: *, y: *}}
 */
function nextCellPos(position, direction) {
    let nextPos = {
        x: position.x + direction.x,
        y: position.y + direction.y
    };

    // Teleport symmetrically if head is going through a door (2 cells in middle of walls).
    if(nextPos.x < 0 && isDoor(nextPos.y)) {
        nextPos.x = GAME_SIZE-1;
    } else if(nextPos.x >= GAME_SIZE && isDoor(nextPos.y)) {
        nextPos.x = 0;
    } else if(nextPos.y < 0 && isDoor(nextPos.x)) {
        nextPos.y = GAME_SIZE-1;
    } else if(nextPos.y >= GAME_SIZE && isDoor(nextPos.x)) {
        nextPos.y = 0;
    }

    return nextPos;
}

async function start() {
    let actualDirection = {
        x: 0,
        y: 0,
        used: false
    };
    let snake = {
        head: document.getElementById("0:3"),
        tail: []
    };

    snake.tail.push({x: 0, y: 2});
    snake.tail.push({x: 0, y: 1});
    snake.tail.push({x: 0, y: 0});
    throwFood();

    document.addEventListener(
        'keydown',
        (e) => {
        actualDirection = changeDirection(e, actualDirection);
    });

    do {
        snake = move(snake, actualDirection);
        actualDirection.used = true;
        await sleep(GAME_SPEED);
    } while(true);
}

function move(snake, direction) {
    const previousPos = elementToPos(snake.head);
    const newHead = posToElement(nextCellPos(previousPos, direction));

    if(newHead) {
        snake.head = newHead;
        snake.tail.push(previousPos);
        snake.head.classList.add("snake");

        if(!snake.head.classList.contains("food")) {
            posToElement(snake.tail.shift()).classList.remove("snake");
        } else {
            snake.head.classList.remove("food");
            throwFood();
        }
    }

    return snake;
}

function throwFood() {
    let x, y, cell;

    do {
        x = Math.floor(Math.random()*GAME_SIZE);
        y = Math.floor(Math.random()*GAME_SIZE);
        cell = document.getElementById(`${x}:${y}`);
    } while(!cell || cell.classList.contains("snake"));

    cell.classList.add("food");
}

/**
 * Returns new direction depending on the key event given.
 * @param e
 * @param lastDirection
 * @returns {{x: number, y: number, used: boolean}}
 */
function changeDirection(e, lastDirection) {
    let newDirection = {x: 0, y: 0, used: false};

    if(!lastDirection.used) {
        return lastDirection;
    } else {
        switch(e.code) {
            case "ArrowUp":
                lastDirection.y !== 1 ? newDirection.y-- : newDirection.y++;
                break;
            case "ArrowDown":
                lastDirection.y !== -1 ? newDirection.y++ : newDirection.y--;
                break;
            case "ArrowLeft":
                lastDirection.x !== 1 ? newDirection.x-- : newDirection.x++;
                break;
            case "ArrowRight":
                lastDirection.x !== -1 ? newDirection.x++ : newDirection.x--;
                break;
            default:
                newDirection = lastDirection;
                break;
        }

        return newDirection;
    }

}
