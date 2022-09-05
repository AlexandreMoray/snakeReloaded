import {Snake} from "../snake/snake.js";
import {createMap, sleep, throwFood, displayScore, displaySpeed, displayGameOver} from "../utils/utils.js";
import {GAME_SPEED} from "../utils/constants.js";
 
export class Game {

    constructor() {
        this.map = createMap();
        this.root = document.getElementById("root");
        this.speed = GAME_SPEED[2];
        this.handleSpeedConfig();
    }

    async start() {
        const snake = new Snake(["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"]);
    
        displayScore();
        throwFood();
    
        let alive = true;
    
        do {
            alive = snake.move();
            snake.actualDirection.used = true;
            displayScore(snake.score);
            displaySpeed(this.speed.name);
            await sleep(this.speed.time);
        } while(alive);

        displayGameOver();
    }
    
    async handleSpeedConfig() {
        document.addEventListener(
            "keydown",
            (e) => {
                if(["1","2","3","4"].includes(e.key)) {
                    this.speed = GAME_SPEED[e.key];
                }
            });
    }

};




