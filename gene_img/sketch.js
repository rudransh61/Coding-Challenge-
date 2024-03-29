// Define variables
let populationSize = 50;
let population = [];
let mutationRate = 0.01;
let target;
let generations = 0;

function setup() {
  createCanvas(400, 400);
  
  // Initialize population
  for (let i = 0; i < populationSize; i++) {
    population[i] = new DNA();
  }
  
  // Set target image (optional)
  target = createImage(width, height);
  target.loadPixels();
  for (let i = 0; i < target.pixels.length; i += 4) {
    target.pixels[i] = random(255);
    target.pixels[i + 1] = random(255);
    target.pixels[i + 2] = random(255);
    target.pixels[i + 3] = 255;
  }
  target.updatePixels();
}

function draw() {
  // Display best individual from current generation
  background(255);
  population[0].draw();
  
  // Evolve population
  evolve();
  
  // Display generation count
  fill(0);
  textSize(16);
  text("Generation: " + generations, 20, 20);
}

function evolve() {
  // Calculate fitness for each individual
  for (let i = 0; i < population.length; i++) {
    population[i].calculateFitness();
  }
  
  // Sort population by fitness
  population.sort((a, b) => b.fitness - a.fitness);
  
  // Create new generation
  let newPopulation = [];
  for (let i = 0; i < population.length; i++) {
    let parentA = population[floor(random(population.length))];
    let parentB = population[floor(random(population.length))];
    let child = parentA.crossover(parentB);
    child.mutate();
    newPopulation.push(child);
  }
  
  // Replace old population with new generation
  population = newPopulation;
  
  // Increment generation count
  generations++;
}

// DNA class
class DNA {
  constructor() {
    // Define genes (e.g., parameters of artwork)
    this.numShapes = 5; // Number of shapes
    this.genes = [];
    for (let i = 0; i < this.numShapes; i++) {
      // Each shape has parameters: color, position, size
      this.genes.push({
        color: [random(255), random(255), random(255)],
        x: random(width),
        y: random(height),
        shape: random() < 0.5 ? 'ellipse' : 'rect',
        size: random(20, 50)
      });
    }
    // Calculate fitness
    this.fitness = 0;
  }
  
  // Draw artwork based on genes
  draw() {
    for (let shape of this.genes) {
      fill(shape.color[0], shape.color[1], shape.color[2]);
      if (shape.shape === 'ellipse') {
        ellipse(shape.x, shape.y, shape.size, shape.size);
      } else {
        rect(shape.x, shape.y, shape.size, shape.size);
      }
    }
  }
  
  // Calculate fitness (e.g., compare to target image)
  calculateFitness() {
    // Example: Calculate fitness based on pixel comparison
    let sum = 0;
    for (let i = 0; i < target.pixels.length; i += 4) {
      let d = dist(
        this.genes[0].x, this.genes[0].y,
        target.pixels[i], target.pixels[i + 1]
      );
      sum += d;
    }
    this.fitness = 1 / (sum + 1); // Inverse of total distance
  }
  
  // Crossover with another DNA
  crossover(partner) {
    let child = new DNA();
    for (let i = 0; i < this.numShapes; i++) {
      child.genes[i] = random() < 0.5 ? this.genes[i] : partner.genes[i];
    }
    return child;
  }
  
  // Mutate genes
  mutate() {
    for (let shape of this.genes) {
      if (random() < mutationRate) {
        shape.color = [random(255), random(255), random(255)];
        shape.x = random(width);
        shape.y = random(height);
        shape.shape = random() < 0.5 ? 'ellipse' : 'rect';
        shape.size = random(20, 50);
      }
    }
  }
}
