let organisms = [];
let food = [];
let mangoesPerTree = 50;
let energyFromMango = 10;
// let energyLossPerMove = 1;
let initialCountTeam = 50;
let initialCountSolo = 50;
let energyLossPerDay = 10;
let reproductionEnergyCost = 50;
let mutationRate = 0.5;
let soloManColor = [255, 0, 0];
let teamManColor = [0, 0, 255];
let day = 1;
let naturaldeath = 0.327;
let fights = 0;
let fightwinsTeam = 0;
let fightwinsSolo = 0;

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
    text(`Solo Organisms: ${soloCount}`, 20, height - 90);
    text(`Team Organisms: ${teamCount}`, 20, height - 70);
    text(`Total number of Fights: ${fights}`, 20, height - 50);
    text(`Fights Team Won : ${fightwinsTeam}`, 20, height - 30);
    text(`Fights Solo Won : ${fightwinsSolo}`, 20, height - 10);
  
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
      if(random() < 0.5){ // Chance of death per frame
        newOrganisms.push(new Organism(newX, newY, newColor, !o.isTeam));
      }
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
}class Organism {
  constructor(x, y, color, isTeam = false) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.isTeam = isTeam;
    this.energy = 100;
    this.neuralNetwork = new NeuralNetwork(5, 10, 2); // Updated input size to 5
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
    let closestOpponent = this.findClosestOpponent();
    
    // Normalize distances
    let normalizedFoodDist = closestFood ? dist(this.x, this.y, closestFood.x, closestFood.y) / width : 1;
    let normalizedOpponentDist = closestOpponent ? dist(this.x, this.y, closestOpponent.x, closestOpponent.y) / width : 1;
    
    // Invert the opponent distance for maximization
    let invertedOpponentDist = 1 - normalizedOpponentDist;

    let inputs = [
      this.energy / 100, // Assuming energy ranges between 0 and 100
      normalizedFoodDist,
      food.length / 100, // Assuming a max of 100 food items for normalization
      this.isTeam ? 1 : 0,
      invertedOpponentDist
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
      if (d < 15) {
        food.splice(i, 1); // Remove eaten food
        if (this.isTeam) {
          this.distributeEnergyToTeam();
        } else {
          this.energy += energyFromMango; // Increase energy
        }
      }
    }
    
    // Check if close enough to fight
    for (let i = organisms.length - 1; i >= 0; i--) {
      if (organisms[i] !== this) {
        let d = dist(this.x, this.y, organisms[i].x, organisms[i].y);
        if (d < 20) { // Fight if close enough
          this.fight(organisms[i]);
          
          // Move apart after the fight
          if(this.isTeam != organisms[i].isTeam) {
            let angle = random(TWO_PI);
            this.x = (this.x + cos(angle) * 20 + width) % width;
            this.y = (this.y + sin(angle) * 20 + height) % height;
            
            organisms[i].x = (organisms[i].x + cos(angle + PI) * 20 + width) % width;
            organisms[i].y = (organisms[i].y + sin(angle + PI) * 20 + height) % height;
          }
        }
      }
    }
}

  fight(opponent) {
    if (this.isTeam != opponent.isTeam) {
      if(this.energy > opponent.energy) {
        opponent.energy = opponent.energy * 99 / 100;
        fights++;
        if(this.isTeam){
          fightwinsTeam++;
        }
        else{
          fightwinsSolo++;
        }
      } else if(this.energy < opponent.energy) {
        this.energy = this.energy * 99 / 100;
        fights++;
        if(this.isTeam){
          fightwinsSolo++;
        }
        else{
          fightwinsTeam++;
        }
      } else {
        opponent.energy = opponent.energy * 99 / 100;
        this.energy = this.energy * 99 / 100;
        fights++;
        // fightwinsSolo++;
        // fightwinsTeam++;
      }
    }
  }

  getTeamMembers() {
    return organisms.filter(o => o.isTeam === this.isTeam && dist(this.x, this.y, o.x, o.y) < 100);
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

  findClosestOpponent() {
    let closest = null;
    let closestDist = Infinity;
    for (let o of organisms) {
      if (o.isTeam !== this.isTeam) {
        let d = dist(this.x, this.y, o.x, o.y);
        if (d < closestDist) {
          closestDist = d;
          closest = o;
        }
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
