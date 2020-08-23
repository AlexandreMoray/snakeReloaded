import {GAME_SIZE, CELL_ID, SNAKE_PREFIX, FOOD_ID} from "../constants/constants.js";

/**
 * Wait the amount of milliseconds given.
 * @param time
 * @returns {Promise<*>}
 */
export async function sleep(time) {
    return new Promise(r => setTimeout(r, time));
}

/**
 * Creates a nex div with specified type and returns it.
 * @param type={"cell"|"wall"|"door"}
 * @returns {HTMLDivElement}
 */
export function generate(type = CELL_ID) {
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
export function isDoor(index, wallLength = GAME_SIZE) {
    return (index === wallLength/2 || index === wallLength/2 -1);
}

/**
 * Returns random position object between given limits.
 */
export function randomPosition(min = 0, max = GAME_SIZE) {
    const randomPos = { x: null, y: null };

    Object.keys(randomPos)
        .forEach( key => {
            randomPos[key] = Math.floor(Math.random()*(max - min) + min);
        });

    return randomPos;
}

/**
 * Spawns food randomly on the map.
 * @param type
 */
export function throwFood(type = FOOD_ID.classic) {
    let cell;

    do {
        const {x, y} = randomPosition();
        cell = document.getElementById(`${x}:${y}`);
    } while(
        !cell
        || !cell.classList.contains(CELL_ID)
        || cell.classList.contains(SNAKE_PREFIX + 1)
        || cell.classList.contains(SNAKE_PREFIX + 2)
        || cell.classList.contains(FOOD_ID.classic)
        || cell.classList.contains(FOOD_ID.bonus)
    );

    cell.classList.add(type);
}

/**
 * Returns true if both pos are equal.
 * @param pos1
 * @param pos2
 * @returns {boolean}
 */
export function posEquals(pos1, pos2) {
    return (pos1.x === pos2.x && pos1.y === pos2.y);
}

/**
 * Returns the position of the element passed as an argument.
 * @param element {HTMLElement}
 * @returns {{x: *, y: *}}
 */
export function elementToPos(element) {
    const coords = element.id.split(":").map(coords => parseInt(coords));
    return {x: coords[0], y: coords[1]};
}

/**
 * Returns the Element corresponding to the given position.
 * @param pos {{x: *, y: *}}
 * @returns {HTMLElement, undefined}
 */
export function posToElement(pos) {
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
export function nextCellPos(position, direction) {
    let nextPos = {
        x: position.x + direction.x,
        y: position.y + direction.y
    };

    // Teleports symmetrically if head is going through a door (2 cells in middle of walls).
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

/**
 * Returns new direction depending on the key event given.
 * @param e
 * @param lastDirection
 * @param keys : [up, down, left, right]
 * @returns {{x: number, y: number, used: boolean}}
 */
export function changeDirection(e, lastDirection, keys) {
    let newDirection = {x: 0, y: 0, used: false};

    if(!lastDirection.used) {
        return lastDirection;
    } else {
        switch(e.code) {
            case keys[0]:
                lastDirection.y !== 1 ? newDirection.y-- : newDirection.y++;
                break;
            case keys[1]:
                lastDirection.y !== -1 ? newDirection.y++ : newDirection.y--;
                break;
            case keys[2]:
                lastDirection.x !== 1 ? newDirection.x-- : newDirection.x++;
                break;
            case keys[3]:
                lastDirection.x !== -1 ? newDirection.x++ : newDirection.x--;
                break;
            default:
                newDirection = lastDirection;
                break;
        }

        return newDirection;
    }
}

/**
 * Refresh score on DOM.
 * @param value
 */
export function displayScore(id, value) {
    if(!value) {
        const score = document.createElement("div");
        score.id = "score";
        score.innerText = "Score: 0";
        document.getElementById("root").appendChild(score);
    } else {
        const score = document.getElementById("score");
        score.innerText = "Score: " + value;
    }
}
