function setup() {
  createCanvas(400, 400);
  angle = PI/4
    slider = createSlider(0, TWO_PI, PI / 4, 0.01);
}

function draw() {
  background(0);
  stroke(255)
  strokeWeight(2);
  translate(200, 400);
  branch(100)
  angle = slider.value();
  
}

function branch(len){
    line(0, 0, 0, -len);
    translate(0, -len);
  if(len>10){
     push();
    rotate(angle);
    branch(len*0.666667)
    pop();
    push()
    rotate(-angle);
    branch(len*0.666667)
    pop()
    
  }
 
}