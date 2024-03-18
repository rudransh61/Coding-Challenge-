let n = 2;
let d = 29;
let noiseOffset = 0.0; // Initial noise offset

function setup() {
  createCanvas(400, 400);
  angleMode(DEGREES);
}

function draw() {
  background(0);
  translate(width/2, height/2);
  stroke(255);
  noFill();
  beginShape();
  strokeWeight(1);
  for (let i = 0; i < 361; i++) {
    let k = i * d;
    let r = 150 * sin(n * k);
    let x = r * cos(k);
    let y = r * sin(k);
    vertex(x, y);    
  }
  endShape();


  // Use Perlin noise to change n and d
  let nNoise = noise(noiseOffset);
  let dNoise = noise(noiseOffset + 1000); // Offset to get different Perlin noise
  n += map(nNoise, 0, 1, -0.001, 0.001); // Map Perlin noise to a suitable range
  d += map(dNoise, 0, 1, -0.001, 0.001); // Map Perlin noise to a suitable range
  noiseOffset += 0.01; // Increment the noise offset for the next frame
}
