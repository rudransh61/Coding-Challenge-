let numTypes = 6;
let colorStep = 360 / numTypes;
let friction = 0.85;
let minPopulation = 15;
let numFood = 200;
let foodRange = 5;
let foodEnergy = 100;
let reproductionEnergy = 1000;
let startingEnergy = 400;
let K = 0.2;
let swarm = [];
let food = [];
let display = true;
let drawLines = false;

let numParticles = 40;
function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100);
  frameRate(100); // Increased frame rate to 100 fps
  noStroke();

  for (let i = 0; i < minPopulation; i++) {
    swarm.push(new Cell(random(width), random(height)));
  }

  for (let i = 0; i < numFood; i++) {
    food.push(new Particle(createVector(random(width), random(height)), 0));
  }

  noStroke();
}

function draw() {
  background(0);

  for (let c of swarm) {
    c.update();
    if (display) {
      c.display();
    }
  }

  for (let i = swarm.length - 1; i >= 0; i--) {
    let c = swarm[i];
    if (c.energy <= 0) {
      // convertToFood(c);
      swarm.splice(i, 1);
    }
  }

  eat();
  replace();
  reproduce();

  if (display) {
    for (let p of food) {
      p.display();
    }
  }

  if (frameCount % 5 == 0) {
    food.push(new Particle(createVector(random(width), random(height)), 0));
  }
  
}

function convertToFood(c) {
  for (let p of c.swarm) {
    food.push(new Particle(p.position.copy(), 0));
  }
}

function reproduce() {
  let c;
  for (let i = swarm.length - 1; i >= 0; i--) {
    c = swarm[i];
    if (c.energy > reproductionEnergy) {
      let temp = new Cell(random(width), random(height));
      temp.copyCell(c);
      c.energy -= startingEnergy;
      temp.mutateCell();
      swarm.push(temp);
    }
  }
}

function replace() {
  if (swarm.length < minPopulation) {
    let parent = floor(random(swarm.length));
    let temp = new Cell(random(width), random(height));
    let parentCell = swarm[parent];
    temp.copyCell(parentCell);
    temp.mutateCell();
    swarm.push(temp);
  }
}

function eat() {
  let dis;
  let vector = createVector(0, 0);
  for (let c of swarm) {
    for (let p of c.swarm) {
      if (p.type == 1) {
        for (let i = food.length - 1; i >= 0; i--) {
          let f = food[i];
          vector.mult(0);
          vector = f.position.copy();
          vector.sub(p.position);
          if (vector.x > width * 0.5) {
            vector.x -= width;
          }
          if (vector.x < width * -0.5) {
            vector.x += width;
          }
          if (vector.y > height * 0.5) {
            vector.y -= height;
          }
          if (vector.y < height * -0.5) {
            vector.y += height;
          }
          dis = vector.mag();
          if (dis < foodRange) {
            c.energy += foodEnergy;
            food.splice(i, 1);
          }
        }
      }
    }
  }
}

function keyPressed() {
  if (key == 'd') {
    display = !display;
  }
  if (key == 'l') {
    drawLines = !drawLines;
  }
}

class Particle {
  constructor(start, t) {
    this.position = createVector(start.x, start.y);
    this.velocity = createVector(0, 0);
    this.type = t;
  }

  applyInternalForces(c) {
    let totalForce = createVector(0, 0);
    let acceleration = createVector(0, 0);
    let vector = createVector(0, 0);
    let dis;

    for (let p of c.swarm) {
      if (p != this) {
        vector.mult(0);
        vector = p.position.copy();
        vector.sub(this.position);

        if (vector.x > width * 0.5) {
          vector.x -= width;
        }
        if (vector.x < width * -0.5) {
          vector.x += width;
        }
        if (vector.y > height * 0.5) {
          vector.y -= height;
        }
        if (vector.y < height * -0.5) {
          vector.y += height;
        }

        dis = vector.mag();
        vector.normalize();

        if (dis < c.internalMins[this.type][p.type]) {
          let force = vector.copy();
          force.mult(abs(c.internalForces[this.type][p.type]) * -3 * K);
          force.mult(map(dis, 0, c.internalMins[this.type][p.type], 1, 0));
          totalForce.add(force);
        }

        if (dis < c.internalRadii[this.type][p.type]) {
          let force = vector.copy();
          force.mult(c.internalForces[this.type][p.type] * K);
          force.mult(map(dis, 0, c.internalRadii[this.type][p.type], 1, 0));
          totalForce.add(force);
        }
      }
    }

    acceleration = totalForce.copy();
    this.velocity.add(acceleration);

    this.position.add(this.velocity);
    this.position.x = (this.position.x + width) % width;
    this.position.y = (this.position.y + height) % height;
    this.velocity.mult(friction);
  }

  applyExternalForces(c) {
    let totalForce = createVector(0, 0);
    let acceleration = createVector(0, 0);
    let vector = createVector(0, 0);
    let dis;

    for (let other of swarm) {
      if (other != c) {
        for (let p of other.swarm) {
          vector.mult(0);
          vector = p.position.copy();
          vector.sub(this.position);

          if (vector.x > width * 0.5) {
            vector.x -= width;
          }
          if (vector.x < width * -0.5) {
            vector.x += width;
          }
          if (vector.y > height * 0.5) {
            vector.y -= height;
          }
          if (vector.y < height * -0.5) {
            vector.y += height;
          }

          dis = vector.mag();
          vector.normalize();

          if (dis < c.externalMins[this.type][p.type]) {
            let force = vector.copy();
            force.mult(abs(c.externalForces[this.type][p.type]) * -3 * K);
            force.mult(map(dis, 0, c.externalMins[this.type][p.type], 1, 0));
            totalForce.add(force);
          }

          if (dis < c.externalRadii[this.type][p.type]) {
            let force = vector.copy();
            force.mult(c.externalForces[this.type][p.type] * K);
            force.mult(map(dis, 0, c.externalRadii[this.type][p.type], 1, 0));
            totalForce.add(force);
          }
        }
      }
    }

    acceleration = totalForce.copy();
    this.velocity.add(acceleration);
    this.position.add(this.velocity);
    this.position.x = (this.position.x + width) % width;
    this.position.y = (this.position.y + height) % height;
    this.velocity.mult(friction);
  }

  applyFoodForces(c) {
    let totalForce = createVector(0, 0);
    let acceleration = createVector(0, 0);
    let vector = createVector(0, 0);
    let dis;

    for (let p of food) {
      vector.mult(0);
      vector = p.position.copy();
      vector.sub(this.position);

      if (vector.x > width * 0.5) {
        vector.x -= width;
      }
      if (vector.x < width * -0.5) {
        vector.x += width;
      }
      if (vector.y > height * 0.5) {
        vector.y -= height;
      }
      if (vector.y < height * -0.5) {
        vector.y += height;
      }

      dis = vector.mag();
      vector.normalize();

      if (dis < c.externalRadii[this.type][p.type]) {
        let force = vector.copy();
        force.mult(c.externalForces[this.type][p.type] * K);
        force.mult(map(dis, 0, c.externalRadii[this.type][p.type], 1, 0));
        totalForce.add(force);
      }
    }

    acceleration = totalForce.copy();
    this.velocity.add(acceleration);
    this.position.add(this.velocity);
    this.position.x = (this.position.x + width) % width;
    this.position.y = (this.position.y + height) % height;
    this.velocity.mult(friction);
  }

  display() {
    fill(this.type * colorStep, 80, 90);
    ellipse(this.position.x, this.position.y, 4, 4);
  }
}

class Cell {
  constructor(x, y) {
    this.internalForces = Array.from({ length: numTypes }, () => Array(numTypes).fill(0));
    this.externalForces = Array.from({ length: numTypes }, () => Array(numTypes).fill(0));
    this.internalMins = Array.from({ length: numTypes }, () => Array(numTypes).fill(0));
    this.externalMins = Array.from({ length: numTypes }, () => Array(numTypes).fill(0));
    this.internalRadii = Array.from({ length: numTypes }, () => Array(numTypes).fill(0));
    this.externalRadii = Array.from({ length: numTypes }, () => Array(numTypes).fill(0));
    this.positions = Array(numParticles);
    this.swarm = [];
    this.energy = startingEnergy;
    this.radius;
    this.center = createVector(0, 0);

    this.generateNew(x, y);
  }

  generateNew(x, y) {
    for (let i = 0; i < numTypes; i++) {
      for (let j = 0; j < numTypes; j++) {
        this.internalForces[i][j] = randomGaussian(0.5, 0.2);
        this.internalMins[i][j] = random(40, 70);
        this.internalRadii[i][j] = random(this.internalMins[i][j] * 2, 400);
        this.externalForces[i][j] = randomGaussian(0, 0.5);
        this.externalMins[i][j] = random(40, 70);
        this.externalRadii[i][j] = random(this.externalMins[i][j] * 2, 400);
      }
    }

    for (let i = 0; i < numParticles; i++) {
      this.positions[i] = createVector(x + random(-50, 50), y + random(-50, 50));
      this.swarm.push(new Particle(this.positions[i], 1 + floor(random(numTypes - 1))));
    }
  }

  copyCell(c) {
    for (let i = 0; i < numTypes; i++) {
      for (let j = 0; j < numTypes; j++) {
        this.internalForces[i][j] = c.internalForces[i][j];
        this.internalMins[i][j] = c.internalMins[i][j];
        this.internalRadii[i][j] = c.internalRadii[i][j];
        this.externalForces[i][j] = c.externalForces[i][j];
        this.externalMins[i][j] = c.externalMins[i][j];
        this.externalRadii[i][j] = c.externalRadii[i][j];
      }
    }

    let x = random(width);
    let y = random(height);

    for (let i = 0; i < numParticles; i++) {
      this.positions[i] = createVector(x + c.positions[i].x, y + c.positions[i].y);
      let p = this.swarm[i];
      let temp = new Particle(p.position, p.type);
      this.swarm.push(temp);
    }
  }

  mutateCell() {
    for (let i = 0; i < numTypes; i++) {
      for (let j = 0; j < numTypes; j++) {
        this.internalForces[i][j] += random(-0.1, 0.1);
        this.internalMins[i][j] += random(-5, 5);
        this.internalRadii[i][j] += random(-10, 10);
        this.externalForces[i][j] += random(-0.1, 0.1);
        this.externalMins[i][j] += random(-5, 5);
        this.externalRadii[i][j] += random(-10, 10);
      }
    }

    for (let i = 0; i < numParticles; i++) {
      this.positions[i] = createVector(this.positions[i].x + random(-5, 5), this.positions[i].y + random(-5, 5));

      if (random(100) < 10) {
        let p = this.swarm[i];
        p.type = 1 + floor(random(numTypes - 1));
      }
    }
  }

  update() {
    for (let p of this.swarm) {
      p.applyInternalForces(this);
      p.applyExternalForces(this);
      p.applyFoodForces(this);
    }
    this.energy -= 5.0;
    this.energy = constrain(this.energy, 0, startingEnergy); // Ensure energy does not go below 0
  }

  display() {
    if (drawLines) {
      let p1, p2;
      stroke(0, 0, 30);

      for (let i = 0; i < numParticles - 1; i++) {
        p1 = this.swarm[i];
        p2 = this.swarm[i + 1];
        line(p1.position.x, p1.position.y, p2.position.x, p2.position.y);
      }
    }

    noStroke();

    for (let p of this.swarm) {
      p.display();
    }
  }
}
