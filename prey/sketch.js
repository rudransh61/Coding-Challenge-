let prey = [];
let predators = [];
let food = [];
let preyPopulationSize = 100;
let predatorPopulationSize = 2;

function setup() {
  createCanvas(1000, 1000);
  // Initialize prey, predators, and food
  for (let i = 0; i < preyPopulationSize; i++) {
    prey.push(new Prey());
  }
  for (let i = 0; i < predatorPopulationSize; i++) {
    predators.push(new Predator());
  }
  for (let i = 0; i < 100; i++) {
    food.push(new Food());
  }
  
   // p2.position(855, 10);
}

function draw() {
  background(220);

  textSize(16);
fill(0);
stroke('black');
text(`Prey: ${prey.length}`, 850, 20);
text(`Predator: ${predators.length}`, 850, 40);
console.log(`Prey Population: ${prey.length}`);
    console.log(`Predator Population: ${predators.length}`);

  
  // Update and show food
  for (let f of food) {
    f.show();
  }
  
  // Update and show prey
  for (let i = prey.length - 1; i >= 0; i--) {
    prey[i].move(food, predators);
    prey[i].eat(food);
    prey[i].show();
    prey[i].updateHunger();
    if (prey[i].isDead()) {
      food.push(new Food(prey[i].x, prey[i].y));  // Dead prey becomes food
      prey.splice(i, 1);
    }
  }
  
  // Update and show predators
  for (let i = predators.length - 1; i >= 0; i--) {
    predators[i].hunt(prey, food);
    predators[i].move(prey);
    predators[i].show();
    predators[i].updateHunger();
    if (predators[i].isDead()) {
      food.push(new Food(predators[i].x, predators[i].y));  // Dead predator becomes food
      predators.splice(i, 1);
    }
  }
//   strokeWeight(4);
    
  
  // Check population sizes
  if (prey.length === 0) {
    console.log("All prey have died.");
    // noLoop();
  }
  if (predators.length === 0) {
    console.log("All predators have died.");
    // noLoop();
  }
  
  // Reproduce prey
  if (frameCount % 200 === 0) {
    prey.concat(evolvePopulation(prey, Prey));
    predators.concat(evolvePopulation(predators, Predator));
    console.log(`Prey Population: ${prey.length}`);
    console.log(`Predator Population: ${predators.length}`);
  }
}

class Food {
  constructor(x = random(width), y = random(height)) {
    this.x = x;
    this.y = y;
    this.size = 5;
  }

  show() {
    fill(255, 255, 0);
    ellipse(this.x, this.y, this.size);
  }
}

class NeuralNetwork {
  constructor(inputSize, hiddenSize, outputSize) {
    this.inputSize = inputSize;
    this.hiddenSize = hiddenSize;
    this.outputSize = outputSize;
    this.weights = [];

    // Initialize weights randomly
    for (let i = 0; i < hiddenSize; i++) {
      for (let j = 0; j < inputSize; j++) {
        this.weights.push(random(-1, 1));
      }
    }
  }

  predict(inputs) {
    let outputs = [];
    let offset = 0;
    for (let i = 0; i < this.hiddenSize; i++) {
      let sum = 0;
      for (let j = 0; j < this.inputSize; j++) {
        sum += inputs[j] * this.weights[offset + j];
      }
      outputs.push(sum);
      offset += this.inputSize;
    }
    return outputs;
  }

  static crossover(parent1, parent2) {
    let offspring = new NeuralNetwork(parent1.inputSize, parent1.hiddenSize, parent1.outputSize);
    
    // Crossover weights
    for (let i = 0; i < parent1.weights.length; i++) {
      if (random() > 0.5) {
        offspring.weights[i] = parent1.weights[i];
      } else {
        offspring.weights[i] = parent2.weights[i];
      }
    }
    
    return offspring;
  }

   static mutate(network) {
    for (let i = 0; i < network.weights.length; i++) {
      if (random() < 0.3) {
        network.weights[i] += randomGaussian() * 0.1;
      }
    }
  }
}



  


class Prey {
  constructor(x = random(width), y = random(height)) {
    this.x = x;
    this.y = y;
    this.size = 8;
    this.hunger = 75;
    this.brain = new NeuralNetwork(4, 10, 2);
  }

  move(foodList, predators) {
    let closestFood = this.findClosest(foodList);
    let closestPredator = this.findClosest(predators);
    let inputs = [
      this.hunger,
      closestFood ? dist(this.x, this.y, closestFood.x, closestFood.y) : width,
      closestPredator ? -dist(this.x, this.y, closestPredator.x, closestPredator.y) : -width,
      predators.length
    ];
    let output = this.brain.predict(inputs);
    
    // Add noise to the output to introduce randomness
    let angle = output[0] * TWO_PI + 0;
    let speed = map(this.hunger, 0, 100, 0, 10); // Faster speed when hungrier
    this.x += cos(angle) * speed;
    this.y += sin(angle) * speed;
    this.x = constrain(this.x, 0, width);
    this.y = constrain(this.y, 0, height);
  }

  findClosest(list) {
    let closest = null;
    let closestDist = Infinity;
    for (let item of list) {
      let d = dist(this.x, this.y, item.x, item.y);
      if (d < closestDist) {
        closestDist = d;
        closest = item;
      }
    }
    return closest;
  }

  eat(foodList) {
    for (let i = foodList.length - 1; i >= 0; i--) {
      let d = dist(this.x, this.y, foodList[i].x, foodList[i].y);
      if (d < this.size / 2 + foodList[i].size / 2) {
        foodList.splice(i, 1);
        this.hunger += 50;
        break;
      }
    }
  }

  show() {
    fill(0, 255, 0);
    ellipse(this.x, this.y, this.size);
  }

  updateHunger() {
    let speed = map(this.hunger, 0, 100, 0, 10);
    this.hunger -= map(speed,0,10,0,0.5);
  }

  isDead() {
    return this.hunger <= 0;
  }
}


class Predator {
  constructor(x = random(width), y = random(height)) {
    this.x = x;
    this.y = y;
    this.size = 12;
    this.hunger = 100;
    this.brain = new NeuralNetwork(4, 10, 2);
  }

  move(preyList) {
    let closestPrey = this.findClosest(preyList);
    let inputs = [
      this.hunger,
      closestPrey ? dist(this.x, this.y, closestPrey.x, closestPrey.y) : width,
      preyList.length,
      0 // Placeholder for future inputs if needed
    ];
    let output = this.brain.predict(inputs);
    let angle = output[0] * TWO_PI;
    let speed = map(this.hunger, 0, 150, 0, 2); // Slower speed
    this.x += cos(angle) * speed;
    this.y += sin(angle) * speed;
    this.x = constrain(this.x, 0, width);
    this.y = constrain(this.y, 0, height);
  }

  findClosest(list) {
    let closest = null;
    let closestDist = Infinity;
    for (let item of list) {
      let d = dist(this.x, this.y, item.x, item.y);
      if (d < closestDist) {
        closestDist = d;
        closest = item;
      }
    }
    return closest;
  }

  hunt(preyList, foodList) {
    let closestPrey = this.findClosest(preyList);
    if (closestPrey) {
      let angle = atan2(closestPrey.y - this.y, closestPrey.x - this.x);
      this.x += cos(angle) * 2;
      this.y += sin(angle) * 2;
      if (dist(this.x, this.y, closestPrey.x, closestPrey.y) < this.size / 2 + closestPrey.size / 2) {
        let index = preyList.indexOf(closestPrey);
        if (index > -1) {
          preyList.splice(index, 1);
          this.hunger += 10;
        }
      }
    }
  }

  show() {
    fill(255, 0, 0);
    ellipse(this.x, this.y, this.size);
  }

  updateHunger() {
    // this.hunger -= 0.1;
    let speed = map(this.hunger, 0, 100, 0, 10);
    this.hunger -= map(speed,0,10,0,0.1);
  }

  isDead() {
    return this.hunger <= 0;
  }
}
function evolvePopulation(population, CreatureClass) {
    let newPopulation = [];
    let matingPool = [];
    
    // Evaluate fitness and create mating pool
    for (let i = 0; i < population.length; i++) {
        let fitness = population[i].hunger;
        let n = int(fitness * 100); // Fitness-based probability
        for (let j = 0; j < n; j++) {
            matingPool.push(population[i]);
        }
    }
    
    // Create new population from pairs in the mating pool
    let offspringCount = population.length / 2; // Create half the number of individuals
    for (let i = 0; i < offspringCount; i++) {
        // Select random parents from the mating pool
        let indexA = int(random(matingPool.length));
        let indexB = int(random(matingPool.length));
        
        // Ensure that indexB is different from indexA
        while (indexB === indexA) {
            indexB = int(random(matingPool.length));
        }
        
        // Create child brain through crossover and mutation
        let parentA = matingPool[indexA].brain;
        let parentB = matingPool[indexB].brain;
        let childBrain = NeuralNetwork.crossover(parentA, parentB);
        NeuralNetwork.mutate(childBrain);
        
        // Create child creature and assign brain
        let child = new CreatureClass();
        child.brain = childBrain;
        
        // Add child to new population
        newPopulation.push(child);
    }
    
    return newPopulation;
}
