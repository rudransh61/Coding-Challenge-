function setup() {
    createCanvas(1000, 1000);
  noStroke();
}

function draw() {
  for (var x = 0; x < width; x+=10) {
      for (var y = 0; y < height; y+=10) {
          let c = noise(.01*x,y*.01);
        // console.log(c)
          if(0.6<c<0.7){
            fill('#70B237')
            square(x, y, 10);
          }
          else if(c>=0.7){
            fill('#477A1E')
            square(x, y, 10);
          }
        else if(0.5<c<=0.6){
            fill('#ecd1b4')
            square(x, y, 10);
        }
        else if(0<=c<=0.5){
          fill('#006992')
            square(x, y, 10);
        }
        else{
            fill('#006992')
            square(x, y, 10);
        }
          // fill(c);
          // rect(x, y, 10, 10);
      }		
    }
}
