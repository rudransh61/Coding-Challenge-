function setup() {
  	createCanvas(400, 400);
	noStroke();
}

function draw() {
	for (var x = 0; x < width; x+=10) {
		for (var y = 0; y < height; y+=10) {
			var c = 255 * noise(0.01 * x, 0.01 * y);
			fill(c);
			rect(x, y, 10, 10);
		}		
  	}
}
