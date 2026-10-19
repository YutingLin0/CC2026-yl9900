
let colorStage = 0;
let stageInterval;

function setup() {
  let canvas = createCanvas(500, 500);
  canvas.parent('week6-sketch'); // do not delete - links to your index.html pages (description)

  angleMode(DEGREES); // Measure angles in degrees (0–360)
  colorMode(HSB, 360, 100, 100, 1);

  //Change color stage every 5 seconds
  stageInterval = setInterval(changeColorStage, 5000);
}

//Cycle between three color stages
function changeColorStage() {
  colorStage = (colorStage + 1) % 3;
}

function draw() {
  // Change background every 30 seconds
  let s = second();

  if (s < 30) {
    background(245, 35, 15); // Dark purple for first 30 seconds
  } else {
    background(0, 0, 100); // White for next 30 seconds
  }

  let h = hour();
  let m = minute();

  // allows smooth movement between individual seconds
  let time = millis() / 1000;

  // Move origin to canvas center
  translate(width / 2, height / 2);

  // Seconds Spiral
  let startRadius = 35; 

  // Gentle breathing motion
  let breathing = sin(time * 90) * 8;

  for (let i = 0; i <= s; i++) {
    let angle = i * 14 - 50;
    // Each line moves slightly
    let r = startRadius + i * 3 + breathing;

    // Anchor random values per line so they remain stable frame-to-frame
    randomSeed(i * 133);
    
    // Randomize length and stroke thickness for each line
    let lineLen = random(30, 50);
    let lineWeight = random(10, 20);

    // Individual line oscillation
    let wave = sin(time * 90 + i * 15) * 8;
    lineLen = lineLen + wave;

    // How far we are through the current second
    let secondProgress = (millis() % 1000) / 1000;

    if (i == s) {

      // Ease the newest line into view
      let eased = 1 - (1 - secondProgress) *
                      (1 - secondProgress);

      lineLen = lineLen * eased;
    }

    // Inner point (start of line)
    let x1 = cos(angle) * r;
    let y1 = sin(angle) * r;

    // Outer point (end of line extended along the angle)
    let x2 = cos(angle) * (r + lineLen);
    let y2 = sin(angle) * (r + lineLen);

    // Purple Color Palette
    let colorHue;

    // Each stage shifts the palette
    if (colorStage == 0) {
      // Soft pink
      colorHue = random(330, 350);
    }
    if (colorStage == 1) {
      // Lavender
      colorHue = random(265, 285);
    }
    if (colorStage == 2) {
      // Light purple
      colorHue = random(280, 310);
    }

    let colorSat = random(20, 40);
    let colorBright = random(90, 100);

    stroke(colorHue, colorSat, colorBright);
    strokeWeight(lineWeight);
    strokeCap(ROUND);

    line(x1, y1, x2, y2);
  }

  // Hours: Dark purple spiral
  let hourProgress = h + m / 60 + s / 3600;

  // Points along the spiral
  let hourSteps = hourProgress * 4;

  noFill();
  stroke(250, 45, 78);
  strokeWeight(12);
  strokeCap(ROUND);

  beginShape();
  for (let i = 0; i <= hourSteps; i++) {

    // Rotate each point and move it farther from the center
    let angle = i * 14 - 90;
    let radius = 5 + i * 2;

    // Convert angle and radius into x and y positions
    let x = cos(angle) * radius;
    let y = sin(angle) * radius;

    vertex(x, y);
  }
  endShape();


  // Minutes: light lavender spiral
  let minuteProgress = m + s / 60;
  let minuteSteps = minuteProgress * 3;

  noFill();
  stroke(285, 25, 95, 0.85);
  strokeWeight(13);
  strokeCap(ROUND);

  // Draw a second continuous spiral for minutes
  beginShape();
  for (let i = 0; i <= minuteSteps; i++) {

    // Spiral rotates outward
    let angle = i * 12 - 90;

    let radius = 5 + i * 0.65;

    let x = cos(angle) * radius;
    let y = sin(angle) * radius;

    vertex(x, y);
  }
  endShape();
  

  // Small dots moving around the center using sin() and cos()
  let particleRadius = 185;

  // Create five evenly spaced dots
  for (let i = 0; i < 5; i++) {

    let particleAngle = time * 35 + i * 72;

    // Calculate each dot's position along a circular path
    let px = cos(particleAngle) * particleRadius;
    let py = sin(particleAngle) * particleRadius;

    // Each particle gently changes size
    let particleSize = 15 + sin(time * 90 + i * 30) * 2;

    noStroke();
    fill(245, 45, 85, 0.85);

    circle(px, py, particleSize);
  }
}