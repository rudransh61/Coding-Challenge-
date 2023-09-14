

function Drop(){
    this.x = random(width);
    this.y = random(-width,width);
    this.z = random(0,10);
    this.yspeed = map(this.z, 0, 10, 4, 10);
    this.len = map(this.z,0,10,10,20);
    this.grav=map(this.z,0,10,0.1,1);
    this.fall=()=>{
      this.y+=this.yspeed;
      this.yspeed+=this.grav;
      if(this.y>400){
          this.y=random(-width,width);
        this.yspeed = map(this.z, 0, 20, 4, 10);
      }
    }
    this.show=()=>{
      var thick = map(this.z,0,10,1,3);
      strokeWeight(thick);
      stroke(3, 252, 123);
      line(this.x, this.y, this.x, this.y + this.len);
    }
  }
  
  var drops = [];
  
  function setup() {
    width=400;
    n=300;
    createCanvas(width, width);
    for(var i=0;i<n;i++){
      drops[i]=new Drop();
    }
  }
  
  function draw() {
    background('rgb(0,0,0)');
    for (var i = 0; i < drops.length; i++) {
      drops[i].fall();
      drops[i].show();
    }
    
  }