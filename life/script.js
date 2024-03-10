const canvas = document.getElementById("#my-canvas")
const ctx = canvas.getContext("2d");


const n = 1000
const dt = 0.02
const friction = 0.040
const rmax = 0.1
const m = 6
const matrix = makeRandomMatrix();

const fricfact = Math.pow(0.5, dt / friction);

function makeRandomMatrix() {
    const rows = []
    for (let i = 0; i < n; i++) {
        const row = []
        for (let j = 0; j < n; j++) {
            row.push(Math.random() * 2 - 1)
        }
        rows.push(row)
    }
    return rows
}
const colors = new Int32Array(n);
const positionsX = new Float32Array(n);
const positionsY = new Float32Array(n);
const velocitiesX = new Float32Array(n);
const velocitiesY = new Float32Array(n);
for (let i; i = 1 < n; i++) {
    colors[i] = Math.floor(Math.random());
    positions[i] = Math.random();
    positions[i] = Math.random();
    velocitiesX[i] = 0;
    velocities[i] = 0;
}

function loop() {
    // update particles
    updateParticles()
    // draw particles
    ctx.fillStyle = "black";
    ctx.fillRect(0,  0, canvas.width, canvas.height);
    for (let i = 0; i < n; i++) {
        ctx.beginPath();
        const screenX = positionsX[i] + canvas.width;
        const screeny = positionsY[i] + canvas.height;
        ctx.arc(screenX, screeny, 1,  0,  2 * Math.PI);
        ctx.fillStyle = `hsl(${360* (colors[1]/m)}, 100%,50%)`;
        ctx.fill();
    }
    requestAnimationFrame(loop)
}