// p5.plotSvg + p5.Polar Template

p5.disableFriendlyErrors = true; 
let bDoExportSvg = false; 
// if using randomness, experiment w/ myRandomSeed to see different versions (or iterations) of your sketch
let myRandomSeed = 12345; 
let regenerateButton, exportSvgButton; 

// canvas size
const DPI = 70; // dots per inch
const PAGE_W = 8.5*DPI; 
const PAGE_H = 11*DPI;

//------------------------------------------------------------
function setup() {
  createCanvas(PAGE_W, PAGE_H);
  UI();
  noFill();
  // Set the SVG group by stroke color to `true`, so that strokes 
  // of the same color are grouped together in the SVG file. 
  setSvgGroupByStrokeColor(true); 
}

function draw(){
  clear();
  randomSeed(myRandomSeed); 
  background(255); 
  
  if (bDoExportSvg == true){
    beginRecordSvg(this, "myOutput_" + month() + day() + year() + "_" + myRandomSeed + ".svg");
  }

  // define your drawing below
  myDrawing(); 

  if (bDoExportSvg){
    endRecordSvg(); 
    bDoExportSvg = false;
  }
}

function myDrawing() {
  strokeWeight(1);
  
  // Map mouseX (range 0 to canvas width) to control the distance between the two ripple centers (100px to 320px apart)
  let centerDistance = map(mouseX, 0, width, 100, 320);
  
  // Position two center points symmetrically across the middle of the page
  let center1X = width / 2 - centerDistance / 2; // Left ripple origin
  let center2X = width / 2 + centerDistance / 2; // Right ripple origin
  let centerY = height / 2;                      // Vertical center

  // Map mouseY (range 0 to canvas height) to control wave amplitude / distortion 
  let turbulence = map(mouseY, 0, height, 0, 70);


  let totalRings = 15; // Number of concentric rings
  let minRadius = 60;  // Radius of the innermost central ring
  let maxRadius = 250; // Radius limit for the outermost ring

  // Pick random wave lobe counts
  let waveFreq1 = round(random(3, 7));
  let waveFreq2 = round(random(2, 6));

  // Pick random starting rotation angles for variation between seeds
  let phaseShift1 = random(0, TWO_PI);
  let phaseShift2 = random(0, TWO_PI);

  
  // Layer 1: Stroke color 'navy' 
  stroke('navy'); 
  
  push(); 
  translate(center1X, centerY); // Move local origin (0, 0) to Center 1

  // Loop through each ring from innermost to outermost
  for (i = 1; i <= totalRings; i += 1) {
    // Calculate base radius for current ring
    let baseRadius = map(i, 1, totalRings, minRadius, maxRadius);
    
    // Add subtle organic jitter to the radius
    let ringJitter = random(-4, 4);

    beginShape(); // Start drawing a custom polygon path
    
    // Step around a full 360-degree circle (TWO_PI radians)
    for (a = 0; a < TWO_PI; a += PI / 16) {
      // Calculate sine wave offset based on current angle, frequency, phase, and ring depth
      let wave = sin(a * waveFreq1 + phaseShift1 + i * 0.3) * turbulence;
      
      // Convert polar coordinates (angle 'a' and radius) into Cartesian coordinates (X, Y)
      let x = cos(a) * (baseRadius + wave + ringJitter);
      let y = sin(a) * (baseRadius + wave + ringJitter);
      
      vertex(x, y); // Add vertex point to current ring shape
    }
    
    endShape(CLOSE); // Close the path back to the starting vertex
  }
  pop(); 

  // Layer 2: Stroke color 'crimson' 
  stroke('crimson'); 
  
  push();
  translate(center2X, centerY); // Move local origin (0, 0) to Center 2

  // Loop through each ring from innermost to outermost
  for (i = 1; i <= totalRings; i += 1) {
    // Calculate base radius for current ring
    let baseRadius = map(i, 1, totalRings, minRadius, maxRadius);

    // Add subtle organic jitter to the radius
    let ringJitter = random(-5, 5);

    beginShape(); // Start drawing a custom polygon path

    for (a = 0; a < TWO_PI; a += PI / 16) {
      // Cosine wave moving in opposite phase for contrasting wave motion
      let wave = cos(a * waveFreq2 + phaseShift2 - i * 0.3) * (turbulence * 0.85);

      // If the ring is near the outside (i > 10) AND turbulence is high (> 20), add extra micro-spikes
      if (i > 10 && turbulence > 20) {
        wave += sin(a * 10) * random(3, 8);
      }

      // Convert polar coordinates (angle 'a' and radius) to Cartesian coordinates (X, Y)
      let x = cos(a) * (baseRadius + wave + ringJitter);
      let y = sin(a) * (baseRadius + wave + ringJitter);
      
      vertex(x, y);
    }
    endShape(CLOSE);
  }
  pop(); 
}

// Tip: When plotting, strokeWeight() doesn't affect your drawing. 
// To change the thickness of your drawing, change your pen/marker/etc
// - or experiment with code (use a for loop to create an 'outline')

//-----------------------------------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------------------------

function keyPressed() {
  // Press 's', 'S', or the Spacebar to export the SVG immediately
  if (key === 's' || key === 'S' || key === ' ') {
    bDoExportSvg = true;
  }
}

// Make a new random seed when the "Regenerate" button is pressed
function regenerate(){
  myRandomSeed = round(millis()); 
}

// Set the SVG to be exported when the "Export SVG" button is pressed
function initiateSvgExport(){
  bDoExportSvg = true; 
}

function UI() {
  regenerateButton = createButton('Regenerate');
  regenerateButton.position(0, height);
  regenerateButton.mousePressed(regenerate); // run regenerate() when pressed
  
  exportSvgButton = createButton('Export SVG');
  exportSvgButton.position(120, height);
  exportSvgButton.mousePressed(initiateSvgExport); // run initiateSvgExport() when pressed
}

/*
This template uses the following sketch as a starting point: 
https://editor.p5js.org/golan/sketches/LRTXmDg2q

Additional references/info:
https://github.com/golanlevin/p5.plotSvg
https://github.com/liz-peng/p5.Polar
https://github.com/golanlevin/p5.plotSvg/blob/main/documentation.md#beginrecordsvg
https://github.com/golanlevin/p5.plotSvg/blob/main/documentation.md#endrecordsvg

*/