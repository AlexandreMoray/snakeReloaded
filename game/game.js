import {Snake} from "./snake/snake.js";
import {generate, isDoor, sleep, throwFood, displayScore} from "./utils/utils.js";
import {GAME_SIZE, GAME_SPEED, EXTRA_FOOD_COUNT, CELL_ID, DOOR_ID, WALL_ID, FOOD_ID} from "./constants/constants.js";

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
        container.appendChild(generate(isDoor(i, GAME_SIZE+2) ? DOOR_ID : WALL_ID));
    }
    for(let i=0; i<GAME_SIZE; ++i) {
        // Left wall column
        container.appendChild(generate(isDoor(i) ? DOOR_ID : WALL_ID));
        // All game cells
        for(let j=0; j<GAME_SIZE; ++j) {
            const cell = generate(CELL_ID);
            cell.id = `${j}:${i}`;
            container.appendChild(cell);
        }
        // Right wall column
        container.appendChild(generate(isDoor(i) ? DOOR_ID : WALL_ID));
    }
    for(let i=0; i<GAME_SIZE+2; ++i) {
        // Last wall line
        container.appendChild(generate(isDoor(i, GAME_SIZE+2) ? DOOR_ID : WALL_ID));
    }

    return container;
}

async function start() {
    let snakes = [];
    let count = 1;
    let alive = true;

    snakes.push(new Snake(["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"]));
    snakes.push(new Snake(["KeyW", "KeyS", "KeyA", "KeyD"]));
    //displayScore();
    throwFood();
    await sleep(3000);

    do {
        alive = snakes.every(snake => snake.move());
        Snake.handleCollision(snakes);
        count%EXTRA_FOOD_COUNT === 0 && throwFood(FOOD_ID.bonus);
        await sleep(GAME_SPEED);
        count++;
    } while(alive);
}



