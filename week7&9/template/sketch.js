let pMapper;
let quad0, quad1, quad2, quad3; // four

let video;
let isPlaying = false;

let myFont;

// Can's values
let k = 0;
let speed = 0.2;
let l = 0;
let speed2 = 0.05;

let colorStage = 0;
let stageInterval;

//Eva's values
// Basic variables for Hanji layers and light particles
let layerCount = 0;
let lastHour = -1;

// Basic arrays to store coordinates, target sizes, and current sizes
let shapeX = [];
let shapeY = [];
let shapeTargetW = [];
let shapeTargetH = [];
let shapeCurrentW = [];
let shapeCurrentH = [];

// Variables for 1second light particle effect
let sparkleX = 0;
let sparkleY = 0;
let sparkleAlpha = 0;
let lastSecond = -1;


function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);

  pMapper = createProjectionMapper(this);
  quad0 = pMapper.createQuadMap(500, 500);
  quad1 = pMapper.createQuadMap(600, 600);//Can
  quad2 = pMapper.createQuadMap(400,400); // Eva
  quad3 = pMapper.createQuadMap(400,400); // Bintou 


  yutingSetup();
  evaKimSetup();
  bintouSetup();
}

function draw() {
  background(0);
  quad0.displaySketch(yutingTexture);
  quad1.displaySketch(canTexture);
  quad2.displaySketch(evaKimTexture);
  quad3.displaySketch(bintouTexture);
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

// function mousePressed() {
//     isPlaying = true;
//     video.loop();
// }

// function bintouTexture(){
//     if (video && video.elt.readyState >= 2) {
//         pg.image(video, 0, 0, 400, 400);
//     }
// }

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





//==================================================================================
//Can 
//==================================================================================
function sunClock(pg) {
  pg.push();

  let m = month();
  let sr;
  let ss;

  sr = 6 - 1.5 * sin((360 / 365) * (day() - 81));
  ss = 18 - 1.5 * sin((360 / 365) * (day() - 81));

  let st = hour() + minute() / 60;

  pg.push();

  pg.rotate(st * 15 - 90);
  pg.translate(100, 0);

  if (st > sr && st < ss) {
    pg.ellipse(0, 0, 12);
    pg.ellipse(0, 0, 18);
  } else {
    for (let i = 0; i < 6; i++) {
      pg.ellipse(0, 0, 12 - i * 2);
    }
  }

  pg.pop();

  pg.noFill();
  pg.ellipse(0, 0, 200, 200);
  pg.arc(0, 0, 208, 208, ss * 15 - 90, sr * 15 - 90);
  pg.arc(0, 0, 192, 192, ss * 15 - 90, sr * 15 - 90);

  pg.pop();
}

function birdClock(pg) {
  pg.push();

  let h = hour();
  let s = second();

  let a = millis() / 1000 * 12;
  let dis = 200;
  let sp = millis();

  if (h > 6 && h < 18) {

    pg.push();

    pg.rotate(a * 2);
    pg.translate(0, 180);
    pg.rotate(sp % 360);

    for (let i = 0; i < 8; i++) {
      pg.triangle(
        16 - i * 2,
        0,
        i * 2 - 16,
        i * 2 - 16,
        i * 2 - 16,
        16 - i * 2
      );
    }

    pg.pop();

  } else {

    pg.push();

    pg.rotate(a);
    pg.translate(0, 140);
    pg.rotate((sp / 3) % 360);

    for (let i = 0; i < 8; i++) {
      pg.triangle(
        16 - i * 2,
        0,
        i * 2 - 16,
        i * 2 - 16,
        i * 2 - 16,
        16 - i * 2
      );
    }

    pg.pop();
  }

  pg.pop();
}

function moonClock(pg) {
  pg.push();

  let y = year();
  let m = month();
  let d = day();

  let pd = (y - 2026) * 365 + (m - 9) * 30 + (d - 11);

  let md = pd % 29.53059;
  let mp;

  if (md < 4) {
    mp = 0;
  } else if (md < 7) {
    mp = 1;
  } else if (md < 11) {
    mp = 2;
  } else if (md < 15) {
    mp = 3;
  } else if (md < 19) {
    mp = 4;
  } else if (md < 22) {
    mp = 5;
  } else if (md < 26) {
    mp = 6;
  } else {
    mp = 7;
  }

  for (let i = 0; i < 8; i++) {
    if (i == mp) {
      pg.push();
      pg.rotate(270 + i * 360 / 8);
      for (let j = 0; j < 8; j++) {
        pg.ellipse(180, 0, 30 - j * 30 / 8);
      }
      pg.pop();
    } else {
      pg.push();
      pg.noFill();
      pg.rotate(270 + i * 360 / 8);
      pg.ellipse(180, 0, 30);
      pg.pop();
    }
  }
  pg.pop();
}

function tideClock(pg) {
  pg.push();
  let h = hour();
  let mi = minute();
  let s = second();
  let tt = h + mi / 60 + s / 3600;
  let t = cos(360 * tt / 12.42);
  let th =
    80 * cos(tt * 0.00014) +
    25 * cos(tt * 0.000145);
  let ln = map(t, -1, 1, 6, 48);
  for (let i = 0; i < ln; i++) {
    let y = i * 5 + 50;
    pg.line(60, y - 150, 120, y - 150);
  }
  pg.pop();
}

function plantClock(pg) {
  pg.push();

  let m = month();
  let tm = millis() / 1000;
  let sp;

  if (m >= 3 && m <= 5) {
    sp = 0.8;
  } else if (m >= 6 && m <= 8) {
    sp = 1.3;
  } else if (m >= 9 && m <= 11) {
    sp = 0.7;
  } else {
    sp = 0.3;
  }

  let n = tm * sp;

  for (let i = 0; i < n; i++) {
    let dis = 200 - i * 1;
    if (dis < 0) {
      dis = 0;
    }
    pg.push();
    pg.rotate(i * 1.5);
    pg.translate(dis, 0);
    pg.ellipse(0, 0, 5, 6);
    pg.pop();
  }

  pg.push();
  pg.rotate(180);

  for (let i = 0; i < n; i++) {
    let dis = 200 - i * 1;
    if (dis < 0) {
      dis = 0;
    }

    pg.push();
    pg.rotate(i * 1.5);
    pg.translate(dis, 0);
    pg.ellipse(0, 0, 5, 6);
    pg.pop();
  }

  pg.pop();

  pg.push();
  pg.rotate(90);

  for (let i = 0; i < n; i++) {
    let dis = 200 - i * 1;
    if (dis < 0) {
      dis = 0;
    }
    pg.push();

    pg.rotate(i * 1.5);
    pg.translate(dis, 0);
    pg.ellipse(0, 0, 5, 6);
    pg.pop();
  }

  pg.pop();

  pg.push();
  pg.rotate(270);
  for (let i = 0; i < n; i++) {
    let dis = 200 - i * 1;
    if (dis < 0) {
      dis = 0;
    }
    pg.push();
    pg.rotate(i * 1.5);
    pg.translate(dis, 0);
    pg.ellipse(0, 0, 5, 6);
    pg.pop();
  }
  pg.pop();

  pg.pop();
}

function canTexture(pg) {
  pg.push();
  pg.angleMode(DEGREES);
  // Center texture
  pg.translate(300, 300);
  pg.fill(255);
  pg.ellipse(0, 0, 495);

  pg.push();
  pg.rotate(285);
  pg.scale(0.6, 1.2);
  pg.rotate(millis() / 1000 * 12);

  for (let x = 0; x < 12; x++) {
    pg.rotate(5);
    pg.noFill();
    pg.stroke(40, 60, 230);
    pg.strokeWeight(1);
    moonClock(pg);
    pg.fill(255, 255, 0, 60);
    pg.noStroke();
  }
  pg.pop();

  pg.noFill();
  pg.strokeWeight(1);

  k = k + speed;
  if (k >= 60 || k <= 0) {
    speed = speed * -1;
  }
  l = l + speed2;
  if (l >= 30 || l <= 0) {
    speed2 = speed2 * -1;
  }

  for (let a = 0; a < 2; a++) {
    pg.push();
    pg.rotate(a * 180);
    pg.translate(0, k);
    pg.stroke(50, 150, 255);
    tideClock(pg);
    pg.pop();
  }

  pg.push();
  pg.rotate(45);
  pg.scale(0.8, 1.5);
  pg.rotate(millis() / 1000 * 10);
  for (let x = 0; x < 12; x++) {
    pg.scale(0.8);
    pg.rotate(5);
    pg.stroke(100, 200, 0);
    pg.strokeWeight(2);
    moonClock(pg);
    pg.noStroke();
    pg.fill(250, 80, 100, 60);
    moonClock(pg);
  }
  pg.pop();

  pg.push();
  pg.scale(1.6, 0.8);
  for (let x = 0; x < 12; x++) {
    pg.rotate(-45);
    pg.scale(0.9);
    pg.rotate(millis() / 1000 * 12);
    pg.noFill();
    pg.stroke(0, 80, 200);
    birdClock(pg);
  }
  pg.pop();

  pg.push();
  pg.rotate(-15);
  pg.scale(1, 2);
  pg.rotate(millis() / 1000 * 8);
  pg.noFill();
  pg.stroke(250, 200, 0);
  sunClock(pg);
  pg.fill(255, 0, 0, 80);
  pg.stroke(0, 0, 0, 0);
  sunClock(pg);
  pg.pop();

  pg.push();
  pg.stroke(0);
  pg.rotate(90 - l);
  pg.scale(0.4, 2.3);
  pg.rotate(millis() / 1000 * 16);
  pg.noFill();
  pg.stroke(250, 100, 0);
  sunClock(pg);
  pg.fill(255, 0, 0);
  pg.stroke(0, 0, 0, 0);
  sunClock(pg);
  pg.pop();

  pg.push();
  pg.fill(150, 200, 0);
  pg.stroke(0, 100, 50);
  pg.rotate(millis() / 1000);
  plantClock(pg);
  pg.pop();

  pg.pop();
}

//==================================================================================


//////////////////////////// Setup-Eva Kim
function evaKimSetup() {
    let currentH = hour();
    layerCount = currentH;
    lastHour = currentH;

    // Initialize data for existing layers at startup
    for (let i = 1; i <= currentH; i++) {
        shapeX[i] = 200 + random(-70, 70);
        shapeY[i] = 200 + random(-50, 50);
        shapeTargetW[i] = random(120, 200);
        shapeTargetH[i] = random(80, 140);
        
        shapeCurrentW[i] = shapeTargetW[i];
        shapeCurrentH[i] = shapeTargetH[i];
    }
}

function evaKimTexture(pg) {
    pg.noStroke();
    pg.rectMode(CENTER);

    let h = hour();
    let m = minute();
    let s = second(); 

    // 1. Time-based background color transitions
    let bgMorning = pg.color(240, 244, 248);   // Morning: Pastel blue-white (6 AM - 12 PM)
    let bgAfternoon = pg.color(245, 241, 232); // Afternoon: Warm cream sand (12pm - 6 PM)
    let bgNight = pg.color(20, 25, 38);        // Night: Deep blue charcoal (6pm after)

    let currentBg;
    if (h < 12) {
      currentBg = bgMorning;
    } else if (h < 18) {
      let amt = map(h, 12, 17, 0, 1);
      currentBg = pg.lerpColor(bgMorning, bgAfternoon, amt);
    } else {
      currentBg = bgNight;
    }
    pg.background(currentBg);

    // Add a new layer on the hour
    if (h !== lastHour) {
      if (h === 0) {
        layerCount = 0; 
      } else if (h > lastHour) {
        layerCount = h;
        shapeX[layerCount] = 200 + random(-70, 70);
        shapeY[layerCount] = 200 + random(-50, 50);
        shapeTargetW[layerCount] = random(120, 200);
        shapeTargetH[layerCount] = random(80, 140);
        
        shapeCurrentW[layerCount] = 0;
        shapeCurrentH[layerCount] = 0;
      }
      lastHour = h;
    }

    // 2. Render Hanji paper layers
    for (let i = 1; i <= layerCount; i++) {
      // Smooth growth animation using lerp()
      shapeCurrentW[i] = lerp(shapeCurrentW[i], shapeTargetW[i], 0.05);
      shapeCurrentH[i] = lerp(shapeCurrentH[i], shapeTargetH[i], 0.05);

      // Color palettes by time of day
      let cBlue = pg.color(165, 205, 225);     
      let cYellow = pg.color(225, 225, 175);   
      let cAfternoon = pg.color(235, 175, 130); 
      let cEvening = pg.color(150, 110, 150);   
      let cNight = pg.color(45, 60, 95);        

      let baseColor;
      if (i <= 11) {
        let amt = map(i, 1, 11, 0, 1);
        baseColor = pg.lerpColor(cBlue, cYellow, amt);
      } else if (i <= 17) {
        let amt = map(i, 12, 17, 0, 1);
        baseColor = pg.lerpColor(cAfternoon, cEvening, amt);
      } else {
        let amt = map(i, 18, 23, 0, 1);
        baseColor = pg.lerpColor(cEvening, cNight, amt);
      }

      // Floating motion using sin()
      let waveSin = sin(frameCount * 0.02 + i) * 5; 

      let alphaVal = (h >= 18) ? 45 : 75;

      pg.fill(pg.red(baseColor), pg.green(baseColor), pg.blue(baseColor), alphaVal); 
      pg.rect(shapeX[i], shapeY[i] + waveSin, shapeCurrentW[i], shapeCurrentH[i], 2);
    }

    // 3. 1-second interval sparkling light particle
    if (s !== lastSecond) {
      sparkleX = 200 + random(-100, 100);
      sparkleY = 200 + random(-80, 80);
      sparkleAlpha = 220; 
      lastSecond = s;
    }

    if (sparkleAlpha > 0) {
      pg.fill(255, 240, 190, sparkleAlpha);
      pg.rect(sparkleX, sparkleY, 10, 10, 2);
      sparkleAlpha = sparkleAlpha - 5; 
    }

    // 4. Clock display at bottom right
    if (h >= 18 || h < 6) {
      pg.fill(210, 180);
    } else {
      pg.fill(100, 180);
    }

    pg.textSize(14);
    pg.textAlign(RIGHT, BOTTOM);

    let displayM = (m < 10) ? "0" + m : m;

    pg.text(h + ":" + displayM, pg.width - 20, pg.height - 20);
}

//Bintou's code


 //==================================================================================
 // Bintou's Code
 //==================================================================================

 function bintouSetup() {
  // Settings are applied in bintouTexture().
}

function polarEllipses(pg, count, radius, w, h) {
  for (let j = 0; j < count; j++) {
    let a = j * 360 / count;
    pg.ellipse(cos(a) * radius, sin(a) * radius, w, h);
  }
}

function bintouTexture(pg) {
  pg.push();
  pg.resetMatrix();
  pg.angleMode(DEGREES);
  pg.rectMode(CENTER);
  pg.background(0, 200, 255);

  // First hair puff on the left
  pg.push();
  pg.noStroke();
  pg.translate(100, 110);
  pg.rotate(second());
  pg.fill(0);
  polarEllipses(pg, 10, 55, 50, 50);
  pg.pop();

  // Second hair puff on the right
  pg.push();
  pg.noStroke();
  pg.translate(300, 110);
  pg.rotate(second());
  pg.fill(0);
  polarEllipses(pg, 10, 55, 50, 50);
  pg.pop();

  // Center the face within the 400 x 400 texture
  pg.translate(200, 200);

  // Face
  pg.push();
  pg.noStroke();
  pg.fill(150, 75, 0);
  pg.ellipse(0, 0, 200, 240);
  pg.pop();

  // Bangs
  pg.push();
  pg.translate(0, -110);
  pg.fill(0, 0, 0);
  pg.ellipse(0, 30, 190, 80);
  pg.pop();

  // Eyebrows
  pg.push();
  pg.fill(0);
  pg.rotate(45);
  pg.rect(-50, 30, 5, 30, 10);
  pg.rotate(45);
  pg.rect(-45, -30, 5, 30, 10);
  pg.pop();

  // Right lashes
  pg.push();
  pg.rotate(45);
  pg.fill(0);
  pg.rect(20, -50, 5, 10, 5);
  pg.rect(27, -50, 5, 10, 5);
  pg.pop();

  // Left lashes
  pg.push();
  pg.rotate(100);
  pg.fill(0);
  pg.rect(-40, -35, 5, 10, 5);
  pg.rect(-48, -33, 5, 10, 5);
  pg.pop();

  // Eyes
  let xEye = 40;
  let yEye = 0;

  pg.push();
  pg.stroke(1);
  pg.strokeWeight(2);
  pg.fill(255, 255, 255);
  pg.ellipse(-xEye, -yEye, 30, 20);
  pg.ellipse(xEye, yEye, 30, 20);
  pg.pop();

  // Irises
  pg.fill(90, 30, 23);
  pg.ellipse(-xEye, -yEye, 15, 15);
  pg.ellipse(xEye, yEye, 15, 15);

  // Nose
  pg.fill(0);
  pg.rect(0, 20, 5, 20, 10);

  // Mouth
  pg.fill(255);
  pg.ellipse(15, 70, 20, 20);

  // Blowing bubble gum
  pg.push();
  pg.translate(15, 70);
  blowingBubble(pg);
  pg.pop();

  pg.pop();
}

function bubbleGum(pg) {
  pg.push();
  pg.noStroke();
  pg.fill(255, 192, 203, 200);
  pg.ellipse(0, 0, 300); // Gum
  pg.pop();

  pg.push();
  pg.rotate(45);
  pg.noStroke();
  pg.fill(255, 255, 255, 200);
  pg.ellipse(-80, -10, 50, 100); // Large light reflection
  pg.ellipse(-80, 70, 20, 20); // Small light reflection
  pg.pop();
}

function blowingBubble(pg) {
  let i = millis() / 10000;
  pg.push();
  pg.scale(Math.abs(Math.sin(i)));
  bubbleGum(pg);
  pg.pop();
}
