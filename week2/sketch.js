// Sketch of a line, circle, and triangle
// When user clicks the screen, the composition, color, and position of the objects changes


// Variable for shape sizes
let circleSize;
let triangleSize;

// Variable for object rotations
let triangleRotation;
let lineRotation;

let layout;

// Stores X and Y position of circle
let circleX;
let circleY;

// Stores X and Y position of triangle
let triangleX;
let triangleY;

// Stores colors for background and the objects
let backgroundColor;
let circleColor;
let triangleColor;
let lineColor;

// Stores stroke colors for circle and triangle
let circleStrokeColor;
let triangleStrokeColor;


function setup() {
  // Canvas size
  createCanvas(500, 500);

  angleMode(DEGREES);

  // Generate the starting random composition
  randomizeSketch();
}


function draw() {

  background(backgroundColor);

  // Randomly choose between two opposite arrangements for the triangle and circle
  if (layout < 0.5) {

    // Triangle top right, circle bottom left
    triangleX = 350;    // 75% of canvas
    triangleY = 125;    // 25% of canvas

    circleX = 125;
    circleY = 375;

  } else {

    // Triangle top left, circle bottom right
    triangleX = 125;
    triangleY = 125;

    circleX = 375;
    circleY = 375;

  }


  // Drawing the line
  push();
  // Move the origin to the center of the canvas so the line rotates around the center
  translate(width / 2, height / 2);
  rotate(lineRotation);
  // Set the line's color and thickness
  stroke(lineColor);
  strokeWeight(10);
  line(-400, 0, 400, 0);
  pop();


  // Drawing the circle
  fill(circleColor);
  // Set the circle's random stroke color and thickness
  stroke(circleStrokeColor);
  strokeWeight(10);
  ellipse(circleX, circleY, circleSize);


  // Drawing the triangle
  push();
  translate(triangleX, triangleY);
  rotate(triangleRotation);
  fill(triangleColor);
  // Set the triangle's random stroke color and thickness
  stroke(0,0,0);
  strokeWeight(10);
  triangle(
    0, -triangleSize / 2,       // top point
    -triangleSize / 2, triangleSize / 2,    // bottom-left point  
    triangleSize / 2, triangleSize / 2      // bottom-right point
  );
  pop();
}


function mousePressed() {

  // Generate a new random composition every time the user clicks
  randomizeSketch();
}


function randomizeSketch() {

  // starting transformations, random size and rotation for the objects
  circleSize = random(50, 250);
  triangleSize = random(50, 250);

  triangleRotation = random(360);
  lineRotation = random(360);

  // Generate a random decimal number between 0 and 1 in layout
  layout = random(1);


  // randomized colors
  backgroundColor = color(
    random(50, 255),
    random(50, 255),
    random(50, 255)
  );

  circleColor = color(
    random(100, 255),
    random(100, 255),
    random(100, 255)
  );
  circleStrokeColor = color(
    random(50, 255),
    random(50, 255),
    random(50, 255)
  );

  triangleColor = color(
    random(100, 255),
    random(100, 255),
    random(100, 255)
  );

  lineColor = color(
    random(50, 200),
    random(50, 200),
    random(50, 200)
  );
}