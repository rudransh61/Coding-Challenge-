// Daniel Shiffman
// https://thecodingtrain.com/challenges/86-cube-wave-by-bees-and-bombs
// https://youtu.be/H81Tdrmz2LA
// https://beesandbombs.tumblr.com/post/149654056864/cube-wave

let angle = 0;
let w = 24;
let ma;

let heightScale = 1;

const minHeight = 1;
const maxHeight = 150;

let maxD;

const noiseOffset = 100;
const noiseScale = 0.005;
const timeScale = 0.0002;
let frames = 60;

function setup() {
  createCanvas(500, 500, WEBGL);
  ma = atan(cos(QUARTER_PI));
  maxD = dist(0, 0, 200, 200);
}

time = 0;
function keyPressed() {
  if (key == " ") {
    const options = {
      units: "frames",
      delay: 0
    }
    saveGif("beesandbombs.gif", frames, options);
  }
}

function draw() {

  background(100);
  lights();
  ortho(-400, 400, 400, -400, 0, 1000);
  rotateX(ma);
  rotateY(-QUARTER_PI);
  
  // rotateX(millis() / 1000);
  rotateY(millis() / 1000);
  // rotateZ(millis() / 1000);
  
  noStroke()
  for (let z = 0; z < height; z += w) {
    for (let x = 0; x < width; x += w) {
      push();
      noiseValue = getNoiseValue(x, z, time);
      let h = 2*getBoxHeight(noiseValue);
      color =  map(noiseValue, 0, 1, minHeight, maxHeight)/100
      // console.log(color)
      colorname="#477A1E"
      if(color<=0.5){
        colorname="#006992"
      }
      else if(color>0.5 & color<0.65){
        colorname="#f0dbe4"
      }
      else if(color=>0.7){
        colorname="#1C8F66"
      }
      else{
        colorname="#477A1E"
      }
      // console.log(h)
      translate(x - width / 2, 0, z - height / 2);
      // normalMaterial();
      fill(colorname)
      box(w, h, w);
      // rect(x - width / 2 + w / 2, 0, w - 2, h);
      pop();
    }
  }

  // angle -= TWO_PI / frames;
  time+=100;
}



function getNoiseValue(x, z, time) {
  x = x * noiseScale + noiseOffset;
  z = z * noiseScale + noiseOffset;
  time = time * timeScale + noiseOffset;
  return noise(x, z, time);
}

function getBoxHeight(noiseValue) {
  return map(noiseValue, 0, 1, minHeight, maxHeight) * heightScale;
}
