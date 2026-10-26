let pMapper;
let quad0;

let colorStage = 0;
let stageInterval;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);

  pMapper = createProjectionMapper(this);
  quad0 = pMapper.createQuadMap(500, 500);

  yutingSetup();
}

function draw() {
  background(0);
  quad0.displaySketch(yutingTexture);
}

function keyPressed() {
  switch (key) {
    case "c":
      pMapper.toggleCalibration();
      break;

    case "f":
      let fs = fullscreen();
      fullscreen(!fs);
      break;

    case "l":
      pMapper.load("maps/map.json");
      break;

    case "s":
      pMapper.save("map.json");
      break;
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function yutingSetup() {
  angleMode(DEGREES);

  // Change color stage every five seconds.
  stageInterval = setInterval(changeColorStage, 5000);
}

function changeColorStage() {
  colorStage = (colorStage + 1) % 3;
}

function yutingTexture(pg) {
  pg.push();
  pg.resetMatrix();

  pg.angleMode(DEGREES);
  pg.colorMode(HSB, 360, 100, 100, 1);

  let s = second();

  if (s < 30) {
    pg.background(245, 35, 15);
  } else {
    pg.background(0, 0, 100);
  }

  let h = hour();
  let m = minute();
  let time = millis() / 1000;

  // Center within the 500 × 500 mapped area.
  pg.translate(250, 250);


  // Seconds spiral
  let startRadius = 35;
  let breathing = sin(time * 90) * 8;

  for (let i = 0; i <= s; i++) {
    let angle = i * 14 - 50;
    let r = startRadius + i * 3 + breathing;

    randomSeed(i * 133);

    let lineLen = random(30, 50);
    let lineWeight = random(10, 20);

    let wave = sin(time * 90 + i * 15) * 8;
    lineLen = lineLen + wave;

    let secondProgress = (millis() % 1000) / 1000;

    if (i == s) {
      let eased =
        1 - (1 - secondProgress) * (1 - secondProgress);

      lineLen = lineLen * eased;
    }

    let x1 = cos(angle) * r;
    let y1 = sin(angle) * r;

    let x2 = cos(angle) * (r + lineLen);
    let y2 = sin(angle) * (r + lineLen);

    let colorHue;

    if (colorStage == 0) {
      colorHue = random(330, 350);
    }

    if (colorStage == 1) {
      colorHue = random(265, 285);
    }

    if (colorStage == 2) {
      colorHue = random(280, 310);
    }

    let colorSat = random(20, 40);
    let colorBright = random(90, 100);

    pg.stroke(colorHue, colorSat, colorBright);
    pg.strokeWeight(lineWeight);
    pg.strokeCap(ROUND);

    pg.line(x1, y1, x2, y2);
  }

  // Hours: dark purple spiral
  let hourProgress = h + m / 60 + s / 3600;
  let hourSteps = hourProgress * 4;

  pg.noFill();
  pg.stroke(250, 45, 78);
  pg.strokeWeight(12);
  pg.strokeCap(ROUND);

  pg.beginShape();

  for (let i = 0; i <= hourSteps; i++) {
    let angle = i * 14 - 90;
    let radius = 5 + i * 2;

    let x = cos(angle) * radius;
    let y = sin(angle) * radius;

    pg.vertex(x, y);
  }

  pg.endShape();

  // Minutes: light lavender spiral
  let minuteProgress = m + s / 60;
  let minuteSteps = minuteProgress * 3;

  pg.noFill();
  pg.stroke(285, 25, 95, 0.85);
  pg.strokeWeight(13);
  pg.strokeCap(ROUND);

  pg.beginShape();

  for (let i = 0; i <= minuteSteps; i++) {
    let angle = i * 12 - 90;
    let radius = 5 + i * 0.65;

    let x = cos(angle) * radius;
    let y = sin(angle) * radius;

    pg.vertex(x, y);
  }

  pg.endShape();

  // Small moving dots
  let particleRadius = 185;

  for (let i = 0; i < 5; i++) {
    let particleAngle = time * 35 + i * 72;

    let px = cos(particleAngle) * particleRadius;
    let py = sin(particleAngle) * particleRadius;

    let particleSize =
      15 + sin(time * 90 + i * 30) * 2;

    pg.noStroke();
    pg.fill(245, 45, 85, 0.85);

    pg.circle(px, py, particleSize);
  }

  pg.pop();
}