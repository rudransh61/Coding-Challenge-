function setup() {
    createCanvas(500, 500,WEBGL);
      
    angle = 0;
  }
  
  function draw() {
    background(0);
    
    // translate(250,250)
  
    rotateY(angle);
    rotateX(angle);
    rotateZ(angle);
    angle+=0.03
    
    beta= 0 ;
    noFill()
    stroke(255)
    strokeWeight(4)
    beginShape()
    
    while(beta<PI){
      
      let r = 50 * (0.8 + 1.6 * sin(6 * beta));
      let theta = 2 * beta;
      let phi = 0.6 * PI * sin(12 * beta);
      let x = r * cos(phi) * cos(theta);
      let y = r * cos(phi) * sin(theta)-70;
      let z = r * sin(phi);
      
  //     r(beta) = 1.2 * 0.6 * sin(0.5 * pi + 6 * beta)
  //   theta(beta) = 4 * beta
  //   phi(beta) = 0.2 * pi * sin(6 * beta)
      
      
  
      stroke(r,255,r)
      vertex(x,y,z)
      
      // r = 60 * (1.2 *0.6* sin(0.5 *PI+6* beta));
      // theta = 4 * beta;
      // phi = 0.2 * PI * sin(6 * beta);
      // x = r * cos(phi) * cos(theta);
      //  y = r * cos(phi) * sin(theta)-70;
      //  z = r * sin(phi);
      
      beta+=0.01
      
          stroke(r,255,r)
      vertex(x,y,z)
      
    }
    endShape()
    beginShape()
    beta = 0;
    while(beta<PI){
      
      
      r = 60 * (1.2 *0.6* sin(0.5 *PI+6* beta));
      theta = 4 * beta;
      phi = 0.2 * PI * sin(6 * beta);
      x = r * cos(phi) * cos(theta);
       y = r * cos(phi) * sin(theta)+100;
       z = r * sin(phi);
      
      beta+=0.01
      
          stroke(255,r,255)
      vertex(x,y,z)
      
    }
    
    
    endShape()
    
    
  }