function setup() {
    h = 400
    createCanvas(h, h);
    r=random(20,100);
    x = random(r,h-r);
    y=random(r,h-r);
    
    sx = random(-10,10);
    sy = random(-10,10);
    if(sx==0){
      sx=random(-10,10);
    }
    if(sy==0){
      sy=random(-10,10)}
    }
  
  function draw() {
    background(0);
    circle(x,y,r);
    x+=sx;
    y+=sy
    
    if(x>=h-r || x<=0){
      sx*=-1;
    }
    if(y>=h-r || y<=0){
      sy*=-1;
    }
    
  }