
let buffer1;
let buffer2;
let cooling;
const w = 300;
const h = 200;

let ystart = 0.0;

function setup() {
  pixelDensity(1);
  createCanvas(w * 2, h);
  buffer1 = createGraphics(w, h);
  buffer2 = createGraphics(w, h);
  cooling = createImage(w, h);
  stroke(255,0,0)
}

function cool() {
  cooling.loadPixels();
  let xoff = 0.0; // Start xoff at 0
  let increment = 0.02;
  // For every x,y coordinate in a 2D space, calculate a noise value and produce a brightness value
  for (let x = 0; x < w; x++) {
    xoff += increment; // Increment xoff
    let yoff = ystart; // For every xoff, start yoff at 0
    for (let y = 0; y < h; y++) {
      yoff += increment; // Increment yoff

      // Calculate noise and scale by 255
      let n = noise(xoff, yoff);
      let bright = pow(n, 3) * 255;

      // Try using this line instead
      //float bright = random(0,255);

      // Set each pixel onscreen to a grayscale value
      let index = (x + y * w) * 4;
      cooling.pixels[index] = bright;
      cooling.pixels[index + 1] = bright;
      cooling.pixels[index + 2] = bright;
      cooling.pixels[index + 3] = 255;
    }
  }

  cooling.updatePixels();
  ystart += increment;
}

function fire(rows) {
  buffer1.loadPixels();
  for (let x = 0; x < w; x++) {
    for (let j = 0; j < rows; j++) {
      let y = h - (j + 1);
      let index = (x + y * w) * 4;
      buffer1.pixels[index] = 255;
      buffer1.pixels[index + 1] = 255;
      buffer1.pixels[index + 2] = 255;
      buffer1.pixels[index + 3] = 255;
    }
  }
  buffer1.updatePixels();
}
function draw() {
  fire(2);
  if (mouseIsPressed) {
    buffer1.fill(255, 0, 0); // Set fill color to red
    buffer1.stroke(255, 0, 0); // Set stroke color to red
    buffer1.ellipse(mouseX, mouseY, 50, 50); // Draw red ellipse
  }
  cool();
  background(0);
  buffer1.loadPixels();
  buffer2.loadPixels();
  for (let x = 1; x < w - 1; x++) {
    for (let y = 1; y < h - 1; y++) {
      let index0 = (x + y * w) * 4; // x, y
      let index1 = (x + 1 + y * w) * 4; // (x + 1), y
      let index2 = (x - 1 + y * w) * 4; // (x - 1), y
      let index3 = (x + (y + 1) * w) * 4; // x, (y + 1)
      let index4 = (x + (y - 1) * w) * 4; // x, (y - 1)

      // Because we are using only gray colors, the value of the color
      // components are the same, and we can use that as brightness.
      let c1 = buffer1.pixels[index1];
      let c2 = buffer1.pixels[index2];
      let c3 = buffer1.pixels[index3];
      let c4 = buffer1.pixels[index4];

      let c5 = cooling.pixels[index0];
      let newC = c1 + c2 + c3 + c4;
      newC = newC * 0.25 - c5;

      buffer2.pixels[index4] = newC;
      buffer2.pixels[index4 + 1] = newC;
      buffer2.pixels[index4 + 2] = newC;
      buffer2.pixels[index4 + 3] = 255;
    }
  }
  buffer2.updatePixels();

  // Swap
  let temp = buffer1;
  buffer1 = buffer2;
  buffer2 = temp;

  // Display buffer1 only
  image(buffer1, 0, 0);
}
