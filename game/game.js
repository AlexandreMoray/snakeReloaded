const root = document.getElementById("root");
const GAME_TERRAIN_WIDTH = 10; // cells
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

function init() {
    const container = document.createElement("div");
    container.id="gameContainer";

    for(let i=0; i<GAME_TERRAIN_WIDTH; ++i) {
        for(let j=0; j<GAME_TERRAIN_WIDTH; ++j) {
            const cell = document.createElement("div");
            cell.id = `${j}:${i}`;
            cell.classList.add("cell");
            container.appendChild(cell);
        }
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
    if(pos.x >= 0 && pos.y >= 0 && pos.x < GAME_TERRAIN_WIDTH && pos.y < GAME_TERRAIN_WIDTH) {
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
    return {
        x: position.x + direction.x,
        y: position.y + direction.y,
    }
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
        x = Math.floor(Math.random()*GAME_TERRAIN_WIDTH);
        y = Math.floor(Math.random()*GAME_TERRAIN_WIDTH);
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
