function setup() {
    createCanvas(500, 500);
    x=random(50,450);
    y=random(50,450)
    
    dirlist = ['u','d','l','r'];
    dir = random(dirlist);
    speed=5;
  }
  
  function draw() {
    background(0);
  
    rect(x, y, 25);
    
    if (dir=='u'){
      //console.log(dir)
      y-=speed
    }
    if(dir=='d'){
      //down
      y+=speed
    }
    if(dir=='l'){
      //left
      x-=speed
    }
    if(dir=='r'){
      //right
      x+=speed
    }
    
    if(x>500){
      x=0;
    }
    if(x<0){
      x=490;
    }
    if(y>500){
      y=0;
    }
    if(y<0){
      y=490;
    }
  }
  
  
  function keyPressed() {
    if (keyCode === UP_ARROW) {
      dir='u';
    } else if (keyCode === DOWN_ARROW) {
      dir='d'
    }else if (keyCode === LEFT_ARROW) {
      dir='l'
    }else if (keyCode === RIGHT_ARROW) {
      dir='r'
    }
  }