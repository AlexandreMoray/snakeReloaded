const root = document.getElementById("root");
const GAME_TERRAIN_WIDTH = 10; // cells
const GAME_SPEED = 200; // ms

const run = () => {
    const gameContainer = init();
    root.appendChild(gameContainer);
    start(gameContainer).then();
};

run();

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

function elementToPos(element) {
    const coords = element.id.split(":").map(coord => parseInt(coord));
    return {x: coords[0], y: coords[1]};
}
function posToElement(pos) {
    if(pos.x >= 0 && pos.y >= 0 && pos.x < GAME_TERRAIN_WIDTH && pos.y < GAME_TERRAIN_WIDTH) {
        return document.getElementById(`${pos.x}:${pos.y}`);
    } else {
        return undefined;
    }
}
function nextCellPos(position, direction) {
    return {
        x: position.x + direction.x,
        y: position.y + direction.y,
    }
}

async function start(container) {
    let lastDirection = {x: 0, y: 0, used: false};
    let head = document.getElementById("0:0");

    document.addEventListener(
        'keydown',
        (e) => {
        lastDirection = changeDirection(e, lastDirection);
    });

    do {
        head = move(head, lastDirection);
        lastDirection.used = true;
        await sleep(200);
    } while(true);
}

function move(head, direction) {
    const previousPos = elementToPos(head);
    const nextPos = nextCellPos(previousPos, direction);
    const newHead = posToElement(nextPos);

    if(newHead) {
        head.classList.remove("red");
        newHead.classList.add("red");
        return newHead;
    } else {
        return head;
    }
}

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
