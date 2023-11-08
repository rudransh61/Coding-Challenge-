function Keys(x,y,xo){
    this.x = x;
    this.y = y;
    this.xo = xo;
    this.show = function(){
      text(this.xo,x,y);
    }
    this.clicked = function() {
      var d = dist(mouseX, mouseY, this.x, this.y);
      if(d<50){
        this.xo = (this.xo =='X') ? 'O' : 'X'
        // console.log(this.xo)
      }
        
    }
    
  }
  var keys;
  var state; 
  
  const change =(xo)=>{
    if (state=='X'){
      state = 'O'
    }
    else{
      state = 'X'
    }
  }
  
  function setup() {
    createCanvas(400, 400);
    keys = []
    keys.push(new Keys(50,150,'X'))
    keys.push(new Keys(150,150,'X'))
    keys.push(new Keys(250,150,'X'))
    keys.push(new Keys(50,250,'X'))
    keys.push(new Keys(150,250,'X'))
    keys.push(new Keys(250,250,'X'))
    keys.push(new Keys(50,350,'X'))
    keys.push(new Keys(150,350,'X'))
    keys.push(new Keys(250,350,'X'))
    
    state = 'X'
  }
  
  function draw() {
    background(0);
    
    fill(255);
    textSize(75)
    
    for(let i=0;i<keys.length;i++){
      keys[i].show()
    }
    
  //   text('X', 50, 150);
  //   text('X', 150, 150);
  //   text('X', 250, 150);
    
  //   text('X', 50, 250);
  //   text('X', 150, 250);
  //   text('X', 250, 250);
    
    
  //   text('X', 50, 350);
  //   text('X', 150, 350);
  //   text('X', 250, 350);
    
    stroke(255)
    line(125,100,125,350)
    line(225,100,225,350)
    
    line(50,175,300,175)
    line(50,275,300,275)
    
    
    
    
    
    
  }
  
  
  
  function mouseClicked() {
    for (var i = 0; i < keys.length; i++) {
      keys[i].clicked();
    }
  }