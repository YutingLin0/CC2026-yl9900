/* Example 
Original animation: https://editor.p5js.org/melodyloveless/sketches/9Vbf_peML
Amount of circles and their sizes are proportional to current second()
*/

let pMapper;
let quad0;

// example specific variables
let x = [];
let y = [];
let ySpeed = [];
const numCircles = 60; // max # of seconds
let c = []; // for colors

function setup() {
    createCanvas(windowWidth, windowHeight, WEBGL);

    // create mapper object
    pMapper = createProjectionMapper(this);

    quad0 = pMapper.createQuadMap(400,400); // width+height
    // to do: create other surfaces

    // loads calibration in the "maps" directory
    //pMapper.load("maps/map.json");

    melodySetup();
}

function draw() {
    background(0);
    quad0.displaySketch(melodyTexture);

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

/* Melody's Animation */

function melodySetup() {
 for (i = 0; i < numCircles; i++) {
      x[i] = random(400);
      y[i] = random(400);
      ySpeed[i] = random(1,8);
      
      // for color
      // random number generator
      let r = random(1); 
      if (r < 0.33) {
        c[i] = [0,0,255]; // blue
      } else if (r > 0.66) {
        c[i] = [0,255,0]; // green
      } else {
        c[i] = [255,0,0]; // red
      }
      
    }
}

function melodyTexture(pg) {
    pg.clear();
    pg.push();

    pg.background([255,255,255]);
    pg.noStroke();
    pg.blendMode(EXCLUSION); 

  for (i = 0; i < second(); i++) {
    // for size
    let s = map(second(), 0, 59, 180, 20); 
        
    // random colors
    pg.fill(c[i]);
    
    // add ySpeed to y
    y[i] = y[i] + ySpeed[i];
    
    pg.ellipse(x[i], y[i], s);
    
    // switch directions when shape is at edge
    if (y[i] >= 400 || y[i] <= 0) {
      ySpeed[i] = ySpeed[i] * -1;
    } 
  }

  // border for animation
  pg.noFill();
  pg.strokeWeight(30);
  pg.stroke([255,255,0]);
  pg.rect(0,0, 400);
  
  pg.pop();
}