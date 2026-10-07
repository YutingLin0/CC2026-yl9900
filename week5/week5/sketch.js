
function setup() {
  let canvas = createCanvas(500, 500);
  canvas.parent('week5-sketch'); // do not delete - links to your index.html pages (description)

  angleMode(DEGREES); // Measure angles in degrees (0–360)
}

function draw() {
  colorMode(HSB, 360, 100, 100);
  background(220, 30, 12); // Dark cosmic background

  let h = hour();
  let m = minute();
  let s = second();

  // Move origin to canvas center
  translate(width / 2, height / 2);

  // Seconds Spiral
  let startRadius = 35; 

  for (let i = 0; i <= s; i++) {
    let angle = i * 14 - 50;
    let r = startRadius + (i * 3);

    // Anchor random values per line so they remain stable frame-to-frame
    randomSeed(i * 133);
    
    // Randomize length and stroke thickness for each line
    let lineLen = random(30, 50);
    let lineWeight = random(10, 20);

    // Inner point (start of line)
    let x1 = cos(angle) * r;
    let y1 = sin(angle) * r;

    // Outer point (end of line extended along the angle)
    let x2 = cos(angle) * (r + lineLen);
    let y2 = sin(angle) * (r + lineLen);

    // Soft pastel color palette
    let pastelHue = random(0, 360);
    let pastelSat = random(20, 35);
    let pastelBright = random(90, 100);

    stroke(pastelHue, pastelSat, pastelBright);
    strokeWeight(lineWeight);
    line(x1, y1, x2, y2);
  }

  // Hour Orbit & Circle (Inner Track)
  let hourRadius = 45;

  // Faint hour track
  noFill();
  strokeWeight(10);
  circle(0, 0, hourRadius * 2);

  // Position hour circle like a clock hand 
  let hourAngle = map((h % 12) + m / 60, 0, 12, 0, 360) - 90;
  let hourX = cos(hourAngle) * hourRadius;
  let hourY = sin(hourAngle) * hourRadius;

  let hourHue = map(h % 12, 0, 12, 0, 360);

  // Larger glowing hour circle 
  fill(hourHue, 70, 90, 0.3);
  noStroke();
  circle(hourX, hourY, 52); // Outer glow halo

  fill(hourHue, 80, 90);
  circle(hourX, hourY, 36); // Solid hour orb

  // Minute Orbit & Circle (Outer Track)
  let minuteRadius = 95;

  // Faint minute track
  noFill();
  stroke(0, 0, 100, 0.2);
  strokeWeight(10);
  circle(0, 0, minuteRadius * 2);

  // Position minute circle like a clock hand
  let minAngle = map(m, 0, 59, 0, 360) - 90;
  let minX = cos(minAngle) * minuteRadius;
  let minY = sin(minAngle) * minuteRadius;

  // Larger glowing green minute circle 
  fill(120, 90, 100, 0.35);
  noStroke();
  circle(minX, minY, 44); // Outer green halo

  fill(120, 100, 100);
  circle(minX, minY, 28); // Solid green minute orb

}