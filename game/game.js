import {Snake} from "./snake/snake.js";
import {generate, isDoor, sleep, throwFood, displayScore} from "./utils/utils.js";
import {GAME_SIZE, GAME_SPEED} from "./constants/constants.js";

(() => {
    const gameContainer = createMap();
    const root = document.getElementById("root");
    root.appendChild(gameContainer);
    start().then();
})();

function createMap() {
    const container = document.createElement("div");
    container.id = "gameContainer";

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

async function start() {
    const snake = new Snake(["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"]);

    displayScore();
    throwFood();

    let alive = true;

    do {
        alive = snake.move();
        snake.actualDirection.used = true;
        displayScore(snake.score);
        await sleep(GAME_SPEED);
    } while(alive);
}



