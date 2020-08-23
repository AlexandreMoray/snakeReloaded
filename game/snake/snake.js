import {changeDirection, elementToPos, nextCellPos, posToElement, throwFood, randomPosition, posEquals} from "../utils/utils.js";
import {FOOD_SCORE, GAME_SIZE, CELL_ID, FOOD_ID, SNAKE_PREFIX} from "../constants/constants.js";

export class Snake {

    static count = 0;

    constructor(keys) {
        Snake.count++;
        this.score = 0;
        this.id = SNAKE_PREFIX + Snake.count;
        this.actualDirection = {
            x: 0,
            y: -1,
            used: false
        };
        this.body = {
            head: this.initHeadRandomly(),
            tail: []
        };

        document.addEventListener(
            "keydown",
            (e) => {
                this.actualDirection = changeDirection(e, this.actualDirection, keys)
            }
        );
    }

    move() {
        const previousPos = elementToPos(this.body.head);
        const newHead = posToElement(nextCellPos(previousPos, this.actualDirection));

        this.actualDirection.used = true;

        if(!newHead || newHead.classList.contains(this.id)) {
            return false;
        } else {
            this.body.head = newHead;
            this.body.tail.unshift(previousPos);
            this.body.head.classList.add(this.id);
            this.score++;

            if(this.body.head.classList.contains(FOOD_ID.classic))
            {
                this.body.head.classList.remove(FOOD_ID.classic);
                this.score+=FOOD_SCORE;
                throwFood();
            } else if(this.body.head.classList.contains(FOOD_ID.bonus)) {
                this.body.head.classList.remove(FOOD_ID.bonus);
                this.score+=FOOD_SCORE;
            } else {
                posToElement(this.body.tail.pop())?.classList.remove(this.id);
            }
            return true;
        }
    }

    cutTail(pos) {
        const cutBeginning = this.body.tail.filter(cell => posEquals(cell, pos))[0];

        const cutCells = this.body.tail.splice(this.body.tail.indexOf(cutBeginning));
        posToElement(cutCells.shift()).classList.remove(this.id);
        cutCells.forEach(cell => {
            posToElement(cell).classList.replace(this.id, FOOD_ID.bonus);
        });
    }

    initHeadRandomly() {
        let randomHead;

        do {
            randomHead = posToElement(randomPosition(2, GAME_SIZE-2));
        } while(randomHead.classList[0] !== CELL_ID);

        randomHead.classList.add(this.id);

        return randomHead;
    }

    static handleCollision(snakes = []) {
        snakes.forEach(snake => {
            const snakeHead = snake.body.head;
            if(snakeHead.classList.length > 2) {
                const otherSnake = snakes.filter(otherSnake => otherSnake.id === snakeHead.classList[1]);
                otherSnake.length === 1 && otherSnake[0].cutTail(elementToPos(snakeHead));
            }
        })
    }
}
