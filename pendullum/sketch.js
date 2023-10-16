x = 200; y = 200;

g = 0.5;

angleV = 0;
angleA = 0;
function setup() {
  createCanvas(400, 400);
  len = 200;
  angle = PI / 3;



}

function draw() {
  background(255);


  let force = -g * sin(angle);

  angleA = force / len;
  angleV += angleA;
  angle += angleV;

  x = len * sin(angle) + 200;
  y = len * cos(angle);

  line(200, 0, x, y);
  circle(x, y, 50);




}