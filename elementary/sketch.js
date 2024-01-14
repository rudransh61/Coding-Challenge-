

let cells = [1, 0, 0, 0, 1, 1, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 0, 1]
let w = 5
let ruleValue = 22;
let ruleSet;

function setup() {
    ruleSet = ruleValue.toString(2).padStart(8, "0");
    createCanvas(1200, 700)
    let n = width / w;
    for (let i = 0; i < n; i++) {
        cells[i] = 0
    }
    cells[n / 2] = 1
    background(220)

}

y = 0
function draw() {
    for (let i = 0; i < cells.length; i++) {
        let x = i * w;
        noStroke()
        // stroke(0)
        fill(255 - cells[i] * 255);
        square(x, y, w)
    }
    y += w


    let nextCells = [];

    nextCells[0] = cells[0];
    nextCells[cells.length - 1] = cells[cells.length - 1];

    for (let i = 0; i < cells.length; i++) {
        let left = cells[(i - 1 + cells.length) % cells.length];
        let right = cells[(i + 1) % cells.length];
        let state = cells[i];
        let newState = calculateState(left, state, right);
        nextCells[i] = newState;
    }

    cells = nextCells


}







function calculateState(a, b, c) {
    let neighborhood = "" + a + b + c;
    let value = 7 - parseInt(neighborhood, 2);
    return parseInt(ruleSet[value]);
}