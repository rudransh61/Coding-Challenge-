let sun;
let earth;
let moon;
let dt = 0.01;

const G = 6.67430e-11; // Gravitational constant

function setup() {
  createCanvas(800, 600);
  sun = new CelestialBody(50, color(255, 255, 0), 0, 0, 0, 1.989e30); // Sun's mass: 1.989 × 10^30 kg
  earth = new CelestialBody(10, color(0, 0, 255), 200, 0, PI / 4, 5.972e24); // Earth's mass: 5.972 × 10^24 kg
  moon = new CelestialBody(5, color(200), 0, 0, PI / 3, 7.34767309e22); // Moon's mass: 7.34767309 × 10^22 kg
}

function draw() {
  background(0);
  
  translate(width / 2, height / 2);

  sun.display();
  earth.display();
  moon.display();

  earth.update(sun);
  moon.update(earth);
}

class CelestialBody {
  constructor(radius, col, distance, angle, angularVelocity, mass) {
    this.radius = radius;
    this.col = col;
    this.distance = distance;
    this.angle = angle;
    this.angularVelocity = angularVelocity;
    this.mass = mass;
    this.velocity = createVector(0, 0);
    this.acceleration = createVector(0, 0);
  }

  display() {
    fill(this.col);
    ellipse(this.distance * cos(this.angle), this.distance * sin(this.angle), this.radius * 2, this.radius * 2);
  }

  update(other) {
    if (other === sun) {
      let force = p5.Vector.sub(createVector(other.distance * cos(other.angle), other.distance * sin(other.angle)), createVector(this.distance * cos(this.angle), this.distance * sin(this.angle)));
      let distanceSquared = force.magSq();
      force.normalize();
      let magnitude = (G * this.mass * other.mass) / distanceSquared;
      force.mult(magnitude);

      this.acceleration = force.div(this.mass);
      this.velocity.add(this.acceleration * dt);
      this.angle += this.angularVelocity * dt;
      this.distance += this.velocity.mag() * dt;

      if (this.distance < 0) {
        this.distance = 0;
        this.velocity.mult(-0.9); // Bounce back with some energy loss
      }
    } else if (other === earth) {
      let force = p5.Vector.sub(createVector(other.distance * cos(other.angle), other.distance * sin(other.angle)), createVector(this.distance * cos(this.angle), this.distance * sin(this.angle)));
      let distanceSquared = force.magSq();
      force.normalize();
      let magnitude = (G * this.mass * other.mass) / distanceSquared;
      force.mult(magnitude);

      this.acceleration = force.div(this.mass);
      this.velocity.add(this.acceleration * dt);
      this.angle += this.angularVelocity * dt;
      this.distance = other.distance;
    }
  }
}
