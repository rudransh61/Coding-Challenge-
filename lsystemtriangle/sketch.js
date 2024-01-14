let axiom = "F-G-G";
let sentence = axiom;
let len = 300;

function setup() {
  createCanvas(600, 400);
  background(255);
  turtle();
  let button = createButton("Generate");
  button.mousePressed(generate);
}

function generate() {
  len *= 0.5;
  let nextSentence = "";
  for (let i = 0; i < sentence.length; i++) {
    let current = sentence.charAt(i);
    if (current == "F") {
      nextSentence += "F-G+F+G-F";
    } else if (current == "G") {
      nextSentence += "GG";
    } else {
      nextSentence += current;
    }
  }
  sentence = nextSentence;
  turtle();
}

function turtle() {
  background(255);
  resetMatrix();
  translate(width / 2, height);
  stroke(0);

  for (let i = 0; i < sentence.length; i++) {
    let current = sentence.charAt(i);

    if (current == "F" || current == "G") {
      line(0, 0, 0, -len);
      translate(0, -len);
    } else if (current == "+") {
      rotate(radians(120));
    } else if (current == "-") {
      rotate(-radians(120));
    }
  }
}
