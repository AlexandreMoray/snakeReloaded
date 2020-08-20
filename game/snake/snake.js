import {changeDirection, elementToPos, nextCellPos, posToElement, throwFood, randomPosition} from "../utils/utils.js";
import {FOOD_SCORE, GAME_SIZE, CELL_ID, FOOD_ID} from "../constants/constants.js";

export class Snake {

    static count = 0;

    constructor(keys) {
        Snake.count++;
        this.score = 0;
        this.id = `snake-${Snake.count}`;
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

        if(!newHead || newHead.classList.contains(this.id)) {
            return false;
        } else {
            this.body.head = newHead;
            this.body.tail.push(previousPos);
            this.body.head.classList.add(this.id);
            this.score++;

            if(!this.body.head.classList.contains(FOOD_ID)) {
                posToElement(this.body.tail.shift()).classList.remove(this.id);
            } else {
                this.body.head.classList.remove(FOOD_ID);
                throwFood();
                this.score+=FOOD_SCORE;
            }
            return true;
        }
    }

    initHeadRandomly() {
        let randomHead;

        do {
            randomHead = posToElement(randomPosition(2, GAME_SIZE-2));
        } while(randomHead.classList[0] !== CELL_ID);

        randomHead.classList.add(this.id);

        return randomHead;
    }
}
