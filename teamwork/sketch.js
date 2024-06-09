let organisms = [];
let food = [];
let mangoesPerTree = 50;
let energyFromMango = 10;
// let energyLossPerMove = 1;
let initialCountTeam = 50;
let initialCountSolo = 50;
let energyLossPerDay = 10;
let reproductionEnergyCost = 100;
let mutationRate = 0.5;
let soloManColor = [255, 0, 0];
let teamManColor = [0, 0, 255];
let day = 1;
let naturaldeath = 0.327;

function setup() {
  createCanvas(2000, 900);
  initializeSimulation();
}
function draw() {
    background(220);
    textSize(16);
    fill(0);
    text(`Day: ${day}`, 20, 30);
  
    // Update and show food
    for (let f of food) {
      f.show();
    }
    
    // Update and show organisms
    let soloCount = 0;
    let teamCount = 0;
    for (let i = organisms.length - 1; i >= 0; i--) {
      organisms[i].update(0);
      organisms[i].show();
      if (organisms[i].isDead()) {
        organisms.splice(i, 1); // Remove dead organism
      } else {
        if (organisms[i].isTeam) {
          teamCount++;
        } else {
          soloCount++;
        }
      }
    }

    // Display counts on the screen
    fill(0);
    text(`Solo Organisms: ${soloCount}`, 20, height - 50);
    text(`Team Organisms: ${teamCount}`, 20, height - 30);
  
    // Check if all mangoes are eaten
    if (food.length === 0) {
      distributeEnergyToTeam();
      reproduce();
      day++;
      for(let i=0;i<organisms.length;i++){
        organisms[i].update(energyLossPerDay);
      }
      initializeDay();
    }
}

  
  function reproduce() {
    let newOrganisms = [];
    for (let o of organisms) {
      if (o.energy >= reproductionEnergyCost) {
        o.energy -= reproductionEnergyCost;
        let newX = o.x + random(-10, 10);
        let newY = o.y + random(-10, 10);
        let newColor = o.color.slice();
        if (random() < mutationRate) {
          if (o.isTeam) {
            newColor = soloManColor;
          } else {
            newColor = teamManColor;
          }
        }
        if (random() < 0.4) { // Chance of death per frame
          newOrganisms.push(new Organism(newX, newY, newColor, !o.isTeam));
        }
      }
    }
    organisms = organisms.concat(newOrganisms);
  }
function initializeSimulation() {
  initializeDay();
  for (let i = 0; i < initialCountSolo; i++) {
    let x = random(width);
    let y = random(height);
    organisms.push(new Organism(x, y, soloManColor));
  }
  for (let i = 0; i < initialCountTeam; i++) {
    let x = random(width);
    let y = random(height);
    organisms.push(new Organism(x, y, teamManColor, true));
  }
}

function initializeDay() {
  food = [];
  for (let i = 0; i < mangoesPerTree; i++) {
    let x = random(width);
    let y = random(height);
    food.push(new Food(x, y));
  }
}

function distributeEnergyToTeam() {
  let totalEnergy = 0;
  let teamCount = 0;
  for (let o of organisms) {
    if (o.isTeam) {
      totalEnergy += o.energy;
      teamCount++;
    }
  }
  if (teamCount === 0) return;
  let energyPerTeamMember = totalEnergy / teamCount;
  for (let o of organisms) {
    if (o.isTeam) {
      o.energy += energyPerTeamMember;
    }
  }
}

function reproduce() {
  let newOrganisms = [];
  for (let o of organisms) {
    if (o.energy >= reproductionEnergyCost) {
      o.energy -= reproductionEnergyCost;
      let newX = o.x + random(-10, 10);
      let newY = o.y + random(-10, 10);
      let newColor = o.color.slice();
      if (random() < mutationRate) {
        if (o.isTeam) {
          newColor = soloManColor;
        } else {
          newColor = teamManColor;
        }
      }
      newOrganisms.push(new Organism(newX, newY, newColor, !o.isTeam));
    }
  }
  organisms = organisms.concat(newOrganisms);
}

class Food {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = 10;
  }

  show() {
    fill(0, 255, 0);
    ellipse(this.x, this.y, this.size);
  }
}

class Organism {
  constructor(x, y, color, isTeam = false) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.isTeam = isTeam;
    this.energy = 200;
    this.neuralNetwork = new NeuralNetwork(4, 10, 2);
  }

  update(amount) {
    this.energy -= amount;
    this.updatePosition();
    if (random() < naturaldeath) { // Chance of death per frame
      this.energy = 0;
      naturaldeath=Math.pow(naturaldeath,2);
    }
  }

  isDead() {
    return this.energy <= 0;
  }
  

  updatePosition() {
    let closestFood = this.findClosest(food);
    let inputs = [
      this.energy,
      closestFood ? dist(this.x, this.y, closestFood.x, closestFood.y) : width,
      food.length,
      this.isTeam ? 1 : 0
    ];
    let output = this.neuralNetwork.predict(inputs);
    let angle = output[0] * TWO_PI;
    let speed = 3; // Fixed speed
    
    // Calculate new position
    let newX = this.x + cos(angle) * speed;
    let newY = this.y + sin(angle) * speed;
    
    // Wrap around if out of bounds
    newX = (newX + width) % width;
    newY = (newY + height) % height;
  
    this.x = newX;
    this.y = newY;
    
    // Check if close enough to food
    for (let i = food.length - 1; i >= 0; i--) {
      let d = dist(this.x, this.y, food[i].x, food[i].y);
      if (d < 10) {
        food.splice(i, 1); // Remove eaten food
        if (this.isTeam) {
          distributeEnergyToTeam();
        } else {
          this.energy += energyFromMango; // Increase energy
        }
      }
    }
  }
  
  
  show() {
    let x = constrain(this.x, 0, width);
    let y = constrain(this.y, 0, height);
    fill(0, 255, 0);
    ellipse(x, y, this.size);
  }
  
  
  distributeEnergyToTeam() {
    let totalEnergy = 0;
    let teamMembers = [];
    for (let o of organisms) {
      if (o.isTeam) {
        totalEnergy += o.energy;
        teamMembers.push(o);
      }
    }
    let energyPerTeamMember = totalEnergy / teamMembers.length;
    for (let o of teamMembers) {
      o.energy += energyPerTeamMember;
    }
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

  show() {
    fill(this.color);
    ellipse(this.x, this.y, 20, 20);
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
}
