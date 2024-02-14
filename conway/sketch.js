let grid;
let cols;
let rows;
let reso=10;

function setup() {
  createCanvas(600, 400);
  cols = width/reso;
  rows = height/reso;
  grid = make2DArray(cols,rows);
   for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      grid[i][j] = floor(random(2));
    }
  }
  t=0;
}

function make2DArray(cols, rows) {
  let arr = new Array(cols);
  for (let i = 0; i < arr.length; i++) {
    arr[i] = new Array(rows);
  }
  return arr;
}



function draw() {
  background(0);
  
  
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      let x = i * reso;
      let y = j * reso;
      if (grid[i][j] == 1) {
        fill(255);
        stroke(0);
        r = 255*(noise(t+10)+noise(t+15))/2
        g = 255*(noise(t+20)+noise(t+25))/2
        b = 255*(noise(t+30)+noise(t+35))/2
        fill(r,g,b)
        rect(x, y, reso - 1, reso - 1);
      }
    }
  }
  
  let nextgen = make2DArray(cols, rows);
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      let state = grid[i][j];
      // Count live neighbors!
      let sum = 0;
      let neighbors = countNeighbors(grid, i, j);

      if (state == 0 && neighbors == 3) {
        nextgen[i][j] = 1;
      } else if (state == 1 && (neighbors < 2 || neighbors > 3)) {
        nextgen[i][j] = 0;
      } else {
        nextgen[i][j] = state;
      }

    }
  }
  
  grid = nextgen;
  t+=0.01

}

function countNeighbors(grid, x, y) {
  let sum = 0;
  for (let i = -1; i < 2; i++) {
    for (let j = -1; j < 2; j++) {
      let col = (x + i + cols) % cols;
      let row = (y + j + rows) % rows;
      sum += grid[col][row];
    }
  }
  sum -= grid[x][y];
  return sum;
}