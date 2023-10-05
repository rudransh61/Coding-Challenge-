function setup() {
    createCanvas(500, 500);
    x=random(50,450);
    y=random(50,450)
    
    xp = random(50,450);
    yp = random(50,450);
    
    dirlist = ['u','d','l','r'];
    dir = random(dirlist);
    speed=20;
  
    tails = [];
  
    score = 0
  }
  
  function draw() {
    background(0);
    
    frameRate(10)
    
    fill(255,255,255);
    noStroke();
    rect(x, y, 25);
    for(let i=0;i<tails.length;i++){
      rect(tails[i][0],tails[i][1],25);
    }
        
    textSize(32);
    text('score is='+score, 200, 30);
    fill(225, 225, 225);
    
    fill(255,0,0);
    noStroke();
    rect(xp,yp,25);
    

    
    if (dir=='u'){
      //console.log(dir)
      y-=speed
      for(let i=0;i<tails.length;i++){
        tails[i][1]-=speed
      }
      
    }
    if(dir=='d'){
      //down
      y+=speed
      for(let i=0;i<tails.length;i++){
        tails[i][1]+=speed
      }
    }
    if(dir=='l'){
      //left
      x-=speed
      for(let i=0;i<tails.length;i++){
        tails[i][0]-=speed
      }
    }
    if(dir=='r'){
      //right
      x+=speed
      for(let i=0;i<tails.length;i++){
        tails[i][1]+=speed
      }
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
    
    
//     console.log(tails)

      if(abs(xp-x)<25 && abs(yp-y)<25){
        score++;
        xp = random(50,450);
        yp = random(50,450);


  //       let xx,yy;
  //       if(dir=='u'){
  //         xx = x;
  //         yy=y+25;
  //       }
  //       else if(dir=='d'){
  //         xx = x;
  //         yy=y-25;
  //       }
  //       else if(dir=='l'){
  //         xx = x+25;
  //         yy=y;
  //       }
  //       else if(dir=='r'){
  //         xx = x-25;
  //         yy=y;
  //       }

  //       tails.push([xx,yy])
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