let walker;

function setup() {
  createCanvas(800, 600);
  
  background(220);
  walker = new Walker(width / 2, height / 2);
}

function draw() {
  walker.display();
  walker.step();
}

function generateRandomColor() {
    // Generate random values for red, green, and blue components
    let r = random(255);
    let g = random(255);
    let b = random(255);
    
    // Create and return a color using the random values
    return color(r, g, b);
  }

class Walker {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  display() {
    fill(0);
    stroke(generateRandomColor());
    ellipse(this.x, this.y, 5, 5);
  }

  step() {
    let choice = floor(random(4));

    if (choice === 0) {
      this.x+=5;
    } else if (choice === 1) {
      this.x-=5;
    } else if (choice === 2) {
      this.y+=5;
    } else {
      this.y-=5;
    }

    this.x = constrain(this.x, 0, width - 1);
    this.y = constrain(this.y, 0, height - 1);
  }
}
