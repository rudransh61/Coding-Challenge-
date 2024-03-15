class Body{
  constructor(x, y, vx, vy, mass){
    this.pos = createVector(x, y);
    this.vel = createVector(vx, vy);
    this.acc = createVector(0, 0);
    this.mass = mass;
    this.r = sqrt(this.mass) * 2;
    this.color = [random(0,254),random(0,254),random(0,254)]
  }
  
  applyForce(force) {
    let f = p5.Vector.div(force, this.mass);
    this.acc.add(f);
  }
  attract(body) {
    let force = p5.Vector.sub(this.pos, body.pos);
    let distanceSq = constrain(force.magSq(), 100, 1000);
    let G = 10;
    let strength = (G * (this.mass * body.mass)) / distanceSq;
    force.setMag(strength);
    body.applyForce(force);
  }
  update() {
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc.set(0, 0);
    if(this.pos.x>width){
      this.pos.x=0
    }
    if(this.pos.x<0){
      this.pos.x=width
    }
    if(this.pos.y<0){
      this.pos.y=height
    }
    if(this.pos.y>height){
      this.pos.y=0
    }
  }
  show() {
    stroke(255);
    strokeWeight(0);
    fill(this.color[0],this.color[1],this.color[2]);
    ellipse(this.pos.x, this.pos.y, this.r * 2);
  }
}

let bodies = [];
let sun;

function setup() {
  createCanvas(400, 400);
  for (let i = 0; i < 4; i++) {
    let pos = p5.Vector.random2D();
    let vel = p5.Vector.random2D();
    vel.setMag(random(-0.1, 0.1));
    pos.setMag(random(100, 200));
    let m = random(10, 15);
    bodies[i] = new Body(pos.x, pos.y, vel.x, vel.y, m);
  }
  background(0);
}

function draw() {
  background(0, 20);
  // translate(width / 2, height / 2);

  for (let body of bodies) {
    for (let other of bodies) {
      if (body !== other) {
        body.attract(other);
      }
    }
  }

  for (let mover of bodies) {
    mover.update();
    mover.show();
  }
}