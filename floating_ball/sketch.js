var t;

function setup() {
  createCanvas(400, 400);
  background(0);
  t = 0;
}

function draw() {
  background(0, 5);

  var x = width * noise(t);
  var y = height * noise(t+5);
  var r = 255 * noise(t+10);
  var g = 255 * noise(t+15);
  var b = 255 * noise(t+20);
  
  noStroke();
  fill(r, g, b);
  ellipse(x, y, 120, 120);

  t = t + 0.01;
}