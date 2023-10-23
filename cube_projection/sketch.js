points = []

function setup() {
  createCanvas(400, 400);
  points[0] = createVector(-1, -1, -1);
  points[1] = createVector(1, -1, -1);
  points[2] = createVector(1, 1, -1);
  points[3] = createVector(-1, 1, -1);
  points[4] = createVector(-1, -1, 1);
  points[5] = createVector(1, -1, 1);
  points[6] = createVector(1, 1, 1);
  points[7] = createVector(-1, 1, 1);
  
  angle = 0;
}

function draw() {
  background(0);
  translate(200,200)
  
  const rotationZ = [
    [cos(angle), -sin(angle), 0],
    [sin(angle), cos(angle), 0],
    [0, 0, 1],
  ];

  const rotationX = [
    [1, 0, 0],
    [0, cos(angle), -sin(angle)],
    [0, sin(angle), cos(angle)],
  ];

  const rotationY = [
    [cos(angle), 0, sin(angle)],
    [0, 1, 0],
    [-sin(angle), 0, cos(angle)],
  ];
  
  let projected = [];

  for (let i = 0; i < points.length; i++) {
    let rotated = matmul(rotationY, points[i]);
    rotated = matmul(rotationX, rotated);
    rotated = matmul(rotationZ, rotated);
    let distance = 2;
    let z = 1 / (distance - rotated.z);
    const projection = [
      [z, 0, 0],
      [0, z, 0],
    ];    
    let projected2d = matmul(projection, rotated);

    projected2d.mult(100);
    projected[i] = projected2d;
    //point(projected2d.x, projected2d.y);
  }

  for (let i = 0; i < projected.length; i++) {
    stroke(255);
    strokeWeight(16);
    noFill();
    const v = projected[i];
    point(v.x, v.y);
  }

  // Connecting
  for (let i = 0; i < 4; i++) {
    connect(i, (i + 1) % 4, projected);
    connect(i + 4, ((i + 1) % 4) + 4, projected);
    connect(i, i + 4, projected);
  }

  angle += 0.03;
}

function connect(i, j, points) {
  const a = points[i];
  const b = points[j];
  strokeWeight(1);
  stroke(255);
  line(a.x, a.y, b.x, b.y);
}







function matmulvec(a, vec) {
  let m = vecToMatrix(vec);
  let r = matmul(a, m);
  return matrixToVec(r);
}


function matmul(a, b) {
  if (b instanceof p5.Vector) {
    return matmulvec(a, b);
  }

  let colsA = a[0].length;
  let rowsA = a.length;
  let colsB = b[0].length;
  let rowsB = b.length;

  if (colsA !== rowsB) {
    console.error("Columns of A must match rows of B");
    return null;
  }

  result = [];
  for (let j = 0; j < rowsA; j++) {
    result[j] = [];
    for (let i = 0; i < colsB; i++) {
      let sum = 0;
      for (let n = 0; n < colsA; n++) {
        sum += a[j][n] * b[n][i];
      }
      result[j][i] = sum;
    }
  }
  return result;
}



function vecToMatrix(v) {
  let m = [];
  for (let i = 0; i < 3; i++) {
    m[i] = [];
  }
  m[0][0] = v.x;
  m[1][0] = v.y;
  m[2][0] = v.z;
  return m;
}


function matrixToVec(m) {
  return createVector(m[0][0], m[1][0], m.length > 2 ? m[2][0] : 0);
}
