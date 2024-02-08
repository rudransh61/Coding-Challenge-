// Set canvas size
const canvasWidth = 800;
const canvasHeight = 800;

// Set range for Mandelbrot set
const minReal = -2;
const maxReal = 2;
const minImag = -2;
const maxImag = 2;

// Set maximum number of iterations
const maxIterations = 100;

function setup() {
  createCanvas(canvasWidth, canvasHeight);
  pixelDensity(1);
  mandelbrotSet();
}

function mandelbrotSet() {
  loadPixels();
  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      let a = map(x, 0, width, minReal, maxReal);
      let bVal = map(y, 0, height, minImag, maxImag); // Rename variable to avoid redeclaration
      let ca = a;
      let cb = bVal; // Use the new variable here

      let n = 0;
      while (n < maxIterations) {
        let aa = a * a - bVal * bVal; // Use the new variable here
        let bb = 2 * a * bVal; // Use the new variable here

        a = aa + ca;
        bVal = bb + cb; // Use the new variable here

        if (abs(a + bVal) > 16) { // Use the new variable here
          break;
        }

        n++;
      }

      // Map the number of iterations to a color
      let hue = map(n, 0, maxIterations, 0, 360);
      let saturation = 100;
      let brightness = n === maxIterations ? 0 : 100;

      // Convert HSB to RGB
      let rgb = HSBtoRGB(hue, saturation, brightness);

      let pix = (x + y * width) * 4;
      pixels[pix + 0] = rgb.r;
      pixels[pix + 1] = rgb.g;
      pixels[pix + 2] = rgb.b;
      pixels[pix + 3] = 255;
    }
  }
  updatePixels();
}

function HSBtoRGB(h, s, b) {
  let c = (1 - abs(2 * b - 1)) * s;
  let x = c * (1 - abs((h / 60) % 2 - 1));
  let m = b - c / 2;

  let r, g, bVal; // Rename variable to avoid redeclaration

  if (h >= 0 && h < 60) {
    r = c;
    g = x;
    bVal = 0; // Use the new variable here
  } else if (h >= 60 && h < 120) {
    r = x;
    g = c;
    bVal = 0; // Use the new variable here
  } else if (h >= 120 && h < 180) {
    r = 0;
    g = c;
    bVal = x; // Use the new variable here
  } else if (h >= 180 && h < 240) {
    r = 0;
    g = x;
    bVal = c; // Use the new variable here
  } else if (h >= 240 && h < 300) {
    r = x;
    g = 0;
    bVal = c; // Use the new variable here
  } else {
    r = c;
    g = 0;
    bVal = x; // Use the new variable here
  }

  return {
    r: Math.floor((r + m) * 255),
    g: Math.floor((g + m) * 255),
    b: Math.floor((bVal + m) * 255) // Use the new variable here
  };
}
