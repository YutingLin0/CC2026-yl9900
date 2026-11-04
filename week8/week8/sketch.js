
let cake;

// Store all the decorations added to the cake
let toppings = [];

// Keep track of the current flavor and topping
let flavor = 0;
let toppingType = 0;

// false = decorating, true = eating
let eating = false;

// flavors of the cake
let flavors = [
  ["STRAWBERRY", [356, 30, 90], [21, 65, 68], [16, 61, 47]],
  ["BLUEBERRY", [255, 14, 87], [21, 65, 68], [16, 61, 47]],
  ["MATCHA", [65, 35, 74], [69, 40, 58], [72, 43, 42]]
];

let toppingNames = ["STRAWBERRY", "BLUEBERRY", "CHERRY"];

function setup() {
  let canvas = createCanvas(500, 500);
  canvas.parent('week8-sketch'); // do not delete

  colorMode(HSB, 360, 100, 100);

  // Create the first cake
  cake = new Cake();
}

function draw() {
  background(0, 0, 360);

  // Title
  noStroke();
  fill(25, 26, 61);
  textAlign(LEFT);
  textSize(20);
  text("A PIECE OF CAKE", 42, 50);

  // Show the current cake flavor
  fill(...flavors[flavor][1]);
  circle(465, 38, 13);

  fill(29, 27, 63);
  textAlign(RIGHT);
  textSize(10);
  text("[F] " + flavors[flavor][0], 450, 42);

  // Show the current mode
  if (eating) {
    drawOption("[E] EAT", 416, 72, true);
  } else {
    drawOption("[E] DECORATE", 416, 72, true);
  }

  // Draw the plate using two ellipses
  noStroke();
  fill(37, 23, 84);
  ellipse(250, 360, 385, 95);

  fill(37, 6, 100);
  ellipse(250, 349, 370, 82);

  // Draw cake
  cake.display();

  // Draw decorations on remaining cake slices
  for (let t of toppings) {
    if (cake.slices.includes(t.slice)) {
      drawTopping(t);
    }
  }
  drawControls();

  // Ending message when the cake is gone
  if (cake.slices.length === 0) {
    fill(25, 26, 61);
    textAlign(CENTER);
    textSize(16);
    text("ALL GONE!", 250, 270);
  }
}

// Cake class
class Cake {
  constructor() {
    // Center of the cake
    this.x = 250;
    this.y = 250;

    // Different radii create the perspective
    this.rx = 155;
    this.ry = 65;

    // Store the remaining slices
    this.slices = [];

    // Start with 8 slices
    for (let i = 0; i < 8; i++) {
      this.slices.push(i);
    }
  }

  // Calculate a point around the cake edge
  point(a) {
    return {
      x: this.x + cos(a) * this.rx,
      y: this.y + sin(a) * this.ry
    };
  }

  // Calculate the angle of each slice
  angle(i) {
    return -HALF_PI + i * TWO_PI / 8;
  }

  // Draw the cake
  display() {
    let colors = flavors[flavor];

    // Draw slices from back to front
    let order = [0, 7, 1, 6, 2, 5, 3, 4];

    for (let i of order) {
      // Skip slices that have been eaten
      if (!this.slices.includes(i)) continue;

      let a1 = this.angle(i);
      let a2 = this.angle(i + 1);

      // Get the outer points of the slice
      let p1 = this.point(a1);
      let p2 = this.point(a2);

      let center = { x: this.x, y: this.y };

      // Find neighboring slices
      let previous = (i + 7) % 8;
      let next = (i + 1) % 8;

      // Draw exposed walls where slices are missing
      if (!this.slices.includes(previous) && cos(a1) < 0) {
        this.wall(center, p1, colors);
      }

      if (!this.slices.includes(next) && cos(a2) > 0) {
        this.wall(center, p2, colors);
      }

      // Draw the visible outer wall
      if (sin((a1 + a2) / 2) > 0) {
        this.wall(p1, p2, colors);
      }

      // Draw the top frosting as a triangle
      noStroke();
      fill(...colors[1]);

      triangle(
        this.x, this.y,
        p1.x, p1.y,
        p2.x, p2.y
      );
    }
  }

  // Draw the cake and cream layers
  wall(p1, p2, colors) {
    let heights = [0, 8, 38, 49, 75, 80];

    let layerColors = [
      [35, 13, 100],
      colors[2],
      [35, 13, 100],
      colors[2],
      colors[3]
    ];

    // Each layer is a four-sided shape
    for (let i = 0; i < 5; i++) {
      noStroke();
      fill(...layerColors[i]);
      quad(
        p1.x, p1.y + heights[i],
        p2.x, p2.y + heights[i],
        p2.x, p2.y + heights[i + 1],
        p1.x, p1.y + heights[i + 1]
      );
    }
  }

  // Find which slice the mouse is over
  findSlice(mx, my) {
    let dx = (mx - this.x) / this.rx;
    let dy = (my - this.y) / this.ry;

    // Check whether the mouse is inside the cake
    if (dx * dx + dy * dy > 1) {
      return -1;
    }
    // Find the angle of the mouse position
    let a = atan2(dy, dx);

    // Convert the angle into a slice number
    let index = floor(
      ((a + HALF_PI + TWO_PI) % TWO_PI) /
      (TWO_PI / 8)
    );

    if (this.slices.includes(index)) {
      return index;
    }

    return -1;
  }
  // Remove a cake slice
  eat(index) {
    let position = this.slices.indexOf(index);

    if (position !== -1) {
      // Remove the selected slice from the array
      this.slices.splice(position, 1);
    }
  }
}

// Draw toppings
function drawTopping(t) {
  // Move and rotate the decoration
  push();
  translate(t.x, t.y);
  rotate(t.angle);
  noStroke();

  if (t.type === 0) {
    // STRAWBERRY
    fill(3, 82, 84);

    beginShape();
    vertex(-12, -10);
    vertex(0, -16);
    vertex(12, -9);
    vertex(10, 7);
    vertex(0, 16);
    vertex(-11, 6);
    endShape(CLOSE);

    // Leaves
    fill(87, 43, 48);
    triangle(-12, -10, 0, -18, 0, -5);
    triangle(0, -18, 12, -10, 0, -5);

    // Seeds
    fill(40, 31, 100);
    circle(-5, -1, 2);
    circle(4, 2, 2);
    circle(0, 9, 2);

  } else if (t.type === 1) {
    // BLUEBERRY
    fill(235, 45, 66);

    beginShape();
    for (let a = 0; a < TWO_PI; a += TWO_PI / 7) {
      vertex(cos(a) * 13, sin(a) * 13);
    }
    endShape(CLOSE);

    // Dark center
    fill(234, 57, 47);
    triangle(-5, -2, 5, -2, 0, 5);

  } else if (t.type === 2) {
    // CHERRY

    // Stem
    stroke(29, 52, 45);
    strokeWeight(4);
    line(0, -5, 5, -25);

    // Leaf
    noStroke();
    fill(85, 43, 48);
    triangle(5, -25, 20, -31, 11, -17);

    // Cherry body
    fill(3, 82, 84);

    beginShape();
    vertex(-11, -8);
    vertex(-6, -18);
    vertex(7, -20);
    vertex(15, -8);
    vertex(11, 9);
    vertex(-2, 14);
    vertex(-13, 3);
    endShape(CLOSE);
  }
  pop();
}

// Bottom options
function drawControls() {
  noStroke();

  // Positions of the three topping options
  let positions = [95, 250, 405];

  for (let i = 0; i < 3; i++) {
    drawOption(
      "[" + (i + 1) + "] " + toppingNames[i],
      positions[i],
      440,
      toppingType === i && !eating
    );
  }

  // Reset instruction
  fill(28, 19, 67);
  textAlign(CENTER);
  textSize(10);
  text("[R] Reset", 250, 473);
}

// Highlighted options
function drawOption(label, x, y, active) {
  textAlign(CENTER);
  textSize(10);

  if (active) {
    // Colored background for selected option
    fill(27, 32, 66);

    rectMode(CENTER);
    rect(x, y - 4, textWidth(label) + 18, 20, 9);
    rectMode(CORNER);

    fill(0, 0, 100);
  } else {
    // Lighter color for unselected options
    fill(25, 16, 69);
  }

  text(label, x, y);
}

// Mouse interactions
function mouseReleased() {
  // Check which cake slice was clicked
  let index = cake.findSlice(mouseX, mouseY);

  if (index === -1) return false;

  if (eating) {
    // In eating mode, remove the clicked slice
    cake.eat(index);

  } else {
    // no overlapping toppings
    for (let t of toppings) {
      if (
        cake.slices.includes(t.slice) &&
        dist(mouseX, mouseY, t.x, t.y) < 19
      ) {
        return false;
      }
    }

    // Add a new topping object to the array
    toppings.push({
      x: mouseX,
      y: mouseY,
      type: toppingType,
      slice: index,
      angle: random(-0.3, 0.3)
    });
  }
  return false;
}

// Double-click an existing topping to remove it
function doubleClicked() {
  // Only remove toppings in decorating mode
  if (eating) return false;

  // Search from newest to oldest
  for (let i = toppings.length - 1; i >= 0; i--) {
    if (
      cake.slices.includes(toppings[i].slice) &&
      dist(
        mouseX, mouseY,
        toppings[i].x, toppings[i].y
      ) < 19
    ) {
      // Remove that specific topping
      toppings.splice(i, 1);
      break;
    }
  }

  return false;
}

// Keyboard interactions
function keyPressed() {
  // Number keys select decorations
  if (key === "1") toppingType = 0; // Strawberry
  if (key === "2") toppingType = 1; // Blueberry
  if (key === "3") toppingType = 2; // Cherry

  // F changes the cake flavor
  if (key === "f" || key === "F") {
    flavor = (flavor + 1) % flavors.length;
  }

  // E switches between decorating and eating
  if (key === "e" || key === "E") {
    eating = !eating;
  }

  // R resets the cake and decorations
  if (key === "r" || key === "R") {
    cake = new Cake();
    toppings = [];
    eating = false;
    flavor = 0;
    toppingType = 0;
  }
}
