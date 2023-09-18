function setup() {
  createCanvas(400, 500);
  
  x=30;y=200;
  speed =2 ;
pspeed=2  ;    
  grav=0.0000000000000000000000000000000000000000000   ;
  lift=35 ;

  xrect = 399;
  yrect = 0;
  h=random(50,250);
  w=20;

  xrect1 = 399;
  yrect1 = h+100;
  h1=500;
  w1=20;
  
}

function draw() {  
  background(0);
  
  circle(x,y,30);
  rect(xrect, yrect, w, h);
  
  rect(xrect1, yrect1, w1, h1);
  
  islost = 0;
  
  
  if(islost!=1){
    y+=speed;
    speed+=grav;
    xrect1-=pspeed;
    xrect-=pspeed;
  }
  
  
  if( y<0 || y>500){
    islost=1;
  }
  if(islost==1){
    speed= 0 ; grav=0;
    x=30;y=200;
  }
  
  if(xrect<0 || xrect1<0){
    xrect=xrect1=399;
    h=random(50,250); 
    yrect1 = h+100;
  }
  
  if(y<=h && y>=50+h){
    console.log("lost")
  }
  

  
}


function keyPressed() {
  if (key == ' ') {
    y-=lift;
  }
}