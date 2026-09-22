// A Distorted Field of Overlapping Loops
// p5.Polar version
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
  stroke(0);
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

      // Calculate the position of each ellipse
      // Random values create distortion from the original grid
      let loopX = startingX + i * space + randomX[index] * distortionAmount;
      let loopY = startingY + j * space + randomY[index] * distortionAmount;

      // Calculate the rotation of each ellipse
      let loopRotation = (i + j) * rotationAmount + randomRotation[index];

      // Gradually change loop size across the grid
      // Width increases as i moves across the X axis
      // Height increases as j moves down the Y axis
      let loopWidth = 30 + i * 3;
      let loopHeight = 50 + j * 3;

      // Reset the previous coordinate transformation
      resetMatrix();

      // Set the center of the polar coordinate system
      setCenter(loopX, loopY);

      // Draw an ellipse using the p5.Polar library
      polarEllipse(loopRotation, loopWidth/2, loopHeight/2, 0);
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