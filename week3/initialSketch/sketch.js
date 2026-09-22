// A Distorted Field of Overlapping Loops
// Repeating ellipses that gradually change size, rotation, and position


// Arrays to store random values for each loop
// These keep the random variations consistent while the mouse moves
let randomX = [];
let randomY = [];
let randomRotation = [];


function setup() {
  createCanvas(500, 500);

  // Use degrees instead of radians for rotation
  angleMode(DEGREES);

  // Generate the starting random pattern
  randomizePattern();

}


function draw() {

  background(255, 255, 255);

  noFill();
  strokeWeight(2);

  // Starting position of the grid
  const startingX = 25;
  const startingY = 25;
  const space = 50;   // space in between shapes

  // Mouse X controls how much the loops rotate, moving right increases the rotation amount
  let rotationAmount = mouseX/25;

  // Mouse Y controls how far the loops move from the grid, moving down increases the distortion amount
  let distortionAmount = mouseY/10;


  // Repeat loops across the X and Y axes
  for (i = 0; i<10; i++) {
    for (j=0; j<10; j++) {

      push();
      // Each loop has its own random variation
      let index = i * 10 + j;

      // Move the origin to each loop's position
      // Mouse Y controls how far loops shift from the grid
      translate(
        startingX + i * space + randomX[index] * distortionAmount,
        startingY + j * space + randomY[index] * distortionAmount
      );

      // Rotate each ellipse around its own center
      // (i + j) creates a gradual rotation across the grid, rotationAmount changes based on Mouse X
      rotate(
        (i + j) * rotationAmount + randomRotation[index]
      );

      // Gradually change loop size across the grid
      // Width increases as i moves across the X axis
      // Height increases as j moves down the Y axis
      let loopWidth = 30 + i * 3;
      let loopHeight = 50 + j * 3;

      // Black stroke
      stroke(0,0,0);

      // Draw the ellipses
      ellipse(0, 0, loopWidth, loopHeight);
      pop();
    }
  }
}


// Generate new random variations when the mouse is clicked
function mousePressed() {

  randomizePattern();
}


// Store random values for each ellipses
function randomizePattern() {

  // Clear the previous random values
  randomX = [];
  randomY = [];
  randomRotation = [];

  // Generate one set of random values for each ellipse
  for (i=0; i<100; i++) {

    randomX.push(random(-1, 1))
    randomY.push(random(-1, 1));
    randomRotation.push(random(-15, 15));

  }

}