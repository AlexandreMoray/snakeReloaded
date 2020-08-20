import {changeDirection, elementToPos, nextCellPos, posToElement, throwFood} from "../utils/utils.js";

export class Snake {

    constructor(keys) {
        this.actualDirection = {
            x: 0,
            y: -1,
            used: false
        };
        this.body = {
            head: document.getElementById("3:16"),
            tail: [{x:3, y:17}, {x:3, y:18}]
        };
        this.score = 0;
        document.addEventListener(
            "keydown",
            (e) => {
                this.actualDirection = changeDirection(e, this.actualDirection, keys)
            });
    }

    move() {
        const previousPos = elementToPos(this.body.head);
        const newHead = posToElement(nextCellPos(previousPos, this.actualDirection));

        if(!newHead || newHead.classList.contains("snake")) {
            return false;
        } else {
            this.body.head = newHead;
            this.body.tail.push(previousPos);
            this.body.head.classList.add("snake");
            this.score++;

            if(!this.body.head.classList.contains("food")) {
                posToElement(this.body.tail.shift()).classList.remove("snake");
            } else {
                this.body.head.classList.remove("food");
                throwFood();
                this.score+=50;
            }
            return true;
        }
    }
}
