const root = document.getElementById("root");
const terrainWidth = 10;
run();

function run() {
    const gameContainer = document.createElement("div");
    console.log("new game");

    for(let i=0; i<terrainWidth; ++i) {
        for(let j=0; j<terrainWidth; ++j) {
            const cell = document.createElement("div");
            cell.id = `${i}:${j}`;
            cell.classList.add("cell");
            gameContainer.appendChild(cell);
        }
    }

    gameContainer.id="gameContainer";

    root.appendChild(gameContainer);
}
