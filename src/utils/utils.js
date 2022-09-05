import { GAME_SIZE, GAME_SPEED } from "./constants.js";

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
export function generate(type = "cell") {
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
    return (index === wallLength / 2 || index === wallLength / 2 - 1);
}

/**
 * Spawns food randomly on the map.
 */
export function throwFood() {
    let x, y, cell;

    do {
        x = Math.floor(Math.random() * GAME_SIZE);
        y = Math.floor(Math.random() * GAME_SIZE);
        cell = document.getElementById(`${x}:${y}`);
    } while (!cell || !cell.classList.contains("cell") || cell.classList.contains("snake"));

    cell.classList.add("food");
}

/**
 * Returns the position of the element passed as an argument.
 * @param element {HTMLElement}
 * @returns {{x: *, y: *}}
 */
export function elementToPos(element) {
    const coords = element.id.split(":").map(coords => parseInt(coords));
    return { x: coords[0], y: coords[1] };
}

/**
 * Returns the Element corresponding to the given position.
 * @param pos {{x: *, y: *}}
 * @returns {HTMLElement, undefined}
 */
export function posToElement(pos) {
    if (pos.x >= 0 && pos.y >= 0 && pos.x < GAME_SIZE && pos.y < GAME_SIZE) {
        return document.getElementById(`${pos.x}:${pos.y}`);
    } else {
        console.log("fail");
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
    if (nextPos.x < 0 && isDoor(nextPos.y)) {
        nextPos.x = GAME_SIZE - 1;
    } else if (nextPos.x >= GAME_SIZE && isDoor(nextPos.y)) {
        nextPos.x = 0;
    } else if (nextPos.y < 0 && isDoor(nextPos.x)) {
        nextPos.y = GAME_SIZE - 1;
    } else if (nextPos.y >= GAME_SIZE && isDoor(nextPos.x)) {
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
    let newDirection = { x: 0, y: 0, used: false };

    if (!lastDirection.used) {
        return lastDirection;
    } else {
        switch (e.code) {
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

export function displayScore(value) {
    if (value) {
        const score = document.getElementById("score");
        score.innerText = "Score: " + value;
    }
}

export function displaySpeed(value) {
    if (value) {
        const speed = document.getElementById("speed");
        speed.innerText = "Speed: " + value;
    }
}

export function displayGameOver() {

    const over = document.createElement("div");
    over.id = "game-over";
    over.innerText = "GAME OVER !";
    document.getElementById("root").appendChild(over);
}

export function createMap() {
    const container = document.getElementById("game-container");

    for (let i = 0; i < GAME_SIZE + 2; ++i) {
        // First wall line
        container.appendChild(generate(isDoor(i, GAME_SIZE + 2) ? "door" : "wall"));
    }
    for (let i = 0; i < GAME_SIZE; ++i) {
        // Left wall column
        container.appendChild(generate(isDoor(i) ? "door" : "wall"));
        // All game cells
        for (let j = 0; j < GAME_SIZE; ++j) {
            const cell = generate("cell");
            cell.id = `${j}:${i}`;
            container.appendChild(cell);
        }
        // Right wall column
        container.appendChild(generate(isDoor(i) ? "door" : "wall"));
    }
    for (let i = 0; i < GAME_SIZE + 2; ++i) {
        // Last wall line
        container.appendChild(generate(isDoor(i, GAME_SIZE + 2) ? "door" : "wall"));
    }

    return container;
}