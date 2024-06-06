class Rocket {
    constructor(dna) {
        this.pos = createVector(width / 2, height);
        this.vel = createVector();
        this.acc = createVector();
        this.dna = dna || new DNA();
        this.fitness = 0;
    }

    applyForce(force) {
        this.acc.add(force);
    }

    update() {
      var check = true;
       obstacles.map((obstacle)=>{
        if (this.pos.x > obstacle.x && this.pos.x < obstacle.x + obstacle.width &&
            this.pos.y > obstacle.y && this.pos.y < obstacle.y + obstacle.height) {
            check = false;
        }
      })
      if(check==false){
        return ;
      }
        
            let d = dist(this.pos.x, this.pos.y, target.x, target.y);
            if (d > 16) { // Adjust the threshold as needed
                if (lifeCounter < this.dna.genes.length) {
                    this.applyForce(this.dna.genes[lifeCounter]);
                }
                this.vel.add(this.acc);
                this.pos.add(this.vel);
                this.acc.mult(0); // Reset acceleration each frame
            } else {
                // Rocket has reached the target, stop updating its position
                this.vel.mult(0);
                this.acc.mult(0);
            }
        }

    

    show() {
        push();
        noStroke();
        fill(255, 150);
        translate(this.pos.x, this.pos.y);
        rotate(-180 + this.vel.heading()); // Rotate the arrow based on the velocity's angle
        // Draw a triangle instead of a rectangle
        beginShape();
        vertex(0, -10); // Top point
        vertex(-5, 10); // Bottom-left point
        vertex(5, 10); // Bottom-right point
        endShape(CLOSE);
        pop();
    }

    calcFitness(target) {
        let d = dist(this.pos.x, this.pos.y, target.x, target.y);
        if (d == 0) {
            this.fitness = 10000000000000000;
        } else {
            this.fitness = 1 / d;
        }
        // Check for collision with obstacle
       obstacles.map((obstacle)=>{
         if (this.pos.x > obstacle.x && this.pos.x < obstacle.x + obstacle.width &&
            this.pos.y > obstacle.y && this.pos.y < obstacle.y + obstacle.height) {
            this.fitness *= 0.1; // Reduce fitness significantly if it hits the obstacle
        }
       })
       
    }
    

}
class DNA {
    constructor(genes) {
        if (genes) {
            this.genes = genes;
        } else {
            this.genes = [];
            for (let i = 0; i < lifespan; i++) {
                this.genes[i] = p5.Vector.random2D();
                this.genes[i].setMag(maxforce);
            }
        }
    }

    crossover(partner) {
        let newgenes = [];
        let mid = floor(random(this.genes.length));
        for (let i = 0; i < this.genes.length; i++) {
            if (i > mid) {
                newgenes[i] = this.genes[i];
            } else {
                newgenes[i] = partner.genes[i];
            }
        }
        return new DNA(newgenes);
    }

    mutation() {
        for (let i = 0; i < this.genes.length; i++) {
            if (random(1) < 0.01) { // Assuming a 1% mutation rate
                this.genes[i] = p5.Vector.random2D();
                this.genes[i].setMag(maxforce);
            }
        }
    }
}

class Population {
    constructor(size) {
        this.rockets = [];
        this.popsize = size;
        this.matingPool = [];

        for (let i = 0; i < this.popsize; i++) {
            this.rockets[i] = new Rocket();
        }
    }

    evaluate(target) {
        let maxfit = 0;
        // Calculate the fitness for each rocket
        for (let i = 0; i < this.popsize; i++) {
            // Here we simply calculate the distance to the target and use it for fitness.
            // The actual fitness function may be more complex and take into account obstacles, speed, etc.
            this.rockets[i].calcFitness(target);
            if (this.rockets[i].fitness > maxfit) {
                maxfit = this.rockets[i].fitness;
            }
        }

        // Normalize fitness
        for (let i = 0; i < this.popsize; i++) {
            this.rockets[i].fitness /= maxfit;
        }

        this.matingPool = [];
        // Build a mating pool by repeating each rocket based on its fitness score
        for (let i = 0; i < this.popsize; i++) {
            let n = this.rockets[i].fitness * 100; // Arbitrary multiplier to increase pool size
            for (let j = 0; j < n; j++) {
                this.matingPool.push(this.rockets[i]);
            }
        }
    }

    selection() {
        let newRockets = [];
        for (let i = 0; i < this.rockets.length; i++) {
            // Select two parents
            let parentA = random(this.matingPool).dna;
            let parentB = random(this.matingPool).dna;
            // Crossover
            let child = parentA.crossover(parentB);
            // Mutation
            child.mutation();
            newRockets[i] = new Rocket(child);
        }
        this.rockets = newRockets;
    }

    run() {
        for (let i = 0; i < this.popsize; i++) {
            this.rockets[i].update();
            this.rockets[i].show();
        }
    }
}



let population;
let lifespan = 200;
let lifeCounter = 0;
let target;
let maxforce = 0.5;
let generation = 1;
obstacles = [
  {x: 150, y: 100, width: 100, height: 10},
  {x: 150 , y: 0  ,width: 100, height : 10},
  {x: 20,y:50, width : 10 , height : 200},
  {x:370,y:50,width:10,height:200}
];

function setup() {
    createCanvas(400, 300);
    target = createVector(width / 2, 50); // Define target here
    population = new Population(100);
    showgen = createP();
}

function draw() {
    background(0);
    population.run();
    lifeCounter++;

    if (lifeCounter == lifespan) {
        population.evaluate(target);
        population.selection();
        // Resets lifeCounter for the next generation
        lifeCounter = 0;
        generation++;
    }
    showgen.html('Generation : ' + generation);
    showgen.style('font-size', '16px');
    showgen.style('font-family', 'Arial, sans-serif');

    // Draw target
    fill(0, 255, 0);
    ellipse(target.x, target.y, 16, 16);

    fill(255, 0, 0);
  obstacles.map((obstacle)=>{
    
    rect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
  })
    
  
}
