
let song;
let amplitude;
let fft;

let loaded = false;
let playing = false;
let loadError = false;

// Audio values
let volume = 0;
let deepBass = 0;
let bass = 0;
let mid = 0;
let high = 0;

let previousBass = 0;

// Animation values
let motion = 0;
let cooldown = 0;
let deepActive = false;

// Main pattern color
let purpleHue = 280;
let patternHue = 280;
let targetHue = 280;

// Bright accent colors
let colors = [
  [185, 90, 100], // Cyan
  [75, 95, 100],  // Lime
  [330, 85, 100], // Pink
  [35, 95, 100],  // Orange
  [55, 90, 100],  // Yellow
  [220, 85, 100]  // Blue
];

// Colored square objects
let squares = [];

// Sensitivity settings
let deepStart = 0.035;
let deepEnd = 0.020;
let beatSensitivity = 0.012;


async function setup() {
  let canvas = createCanvas(500, 500);
  canvas.parent('week9-sketch'); // do not delete

  colorMode(HSB, 360, 100, 100, 100);
  angleMode(DEGREES);

  // A larger FFT gives more low-frequency detail
  amplitude = new p5.Amplitude();
  fft = new p5.FFT(1024);

  // Load music
  try {
    song = await loadSound("../media/Digital_blast.mp3");

    song.connect(amplitude);
    song.connect(fft);

    loaded = true;

  } catch (error) {
    console.error("Audio error:", error);
    loadError = true;
  }
}


function draw() {
  background(0, 0, 0);

  // Only analyze and animate while music is playing
  if (loaded && playing && song.isPlaying()) {
    analyzeAudio();
  }

  drawPattern();
  drawSquares();
  drawInterface();
}

// Audio Analysis
function analyzeAudio() {

  // Measure overall loudness
  volume = lerp(
    volume,
    amplitude.getLevel(),
    0.25
  );

  // Get the frequency spectrum
  let spectrum = fft.analyze();

  // Separate different frequency ranges
  // The first bins represent the lowest frequencies
  let lowAverage = averageFrequency(spectrum, 1, 7);
  let lowPeak = peakFrequency(spectrum, 1, 9);

  // Use both average and peak to notice deep sounds
  let lowSound = max(lowAverage, lowPeak * 0.65);

  // Smooth audio measurements
  deepBass = lerp(deepBass, lowSound, 0.25);

  bass = lerp(bass, averageFrequency(spectrum, 1, 14), 0.3);

  mid = lerp(mid, averageFrequency(spectrum, 14, 65), 0.25);

  high = lerp(high, averageFrequency(spectrum, 65, 180), 0.25);

  // Mid frequencies control animation speed
  let speed = map(mid, 0, 0.25, 0.5, 5);
  speed = constrain(speed, 0.5, 5);

  motion += speed;

  // Deep bass color changes
  if (deepBass > deepStart && !deepActive) {
    deepActive = true;

    // Select a new color
    targetHue = random(colors)[0];
  }

  // Keep the color until the deep sound fades
  if (deepBass < deepEnd && deepActive) {
    deepActive = false;
    targetHue = purpleHue;
  }

  // Smooth transition between colors
  patternHue = lerp(patternHue, targetHue, 0.12);

  // Sudden bass beats
  // Measure how quickly the bass increases
  let bassChange = bass - previousBass;

  if (cooldown > 0) {cooldown--;}

  // Sudden bass increase creates bright squares
  if (bass > 0.025 && bassChange > beatSensitivity && cooldown === 0) {

    addSquares();
    cooldown = 10;

    // Give especially strong beats another color
    if (deepBass > deepStart) {
      targetHue = random(colors)[0];
    }
  }

  previousBass = bass;
}

// Average values in a frequency range
function averageFrequency(spectrum, start, end) {
  let total = 0;

  for (let i = start; i < end; i++) {
    total += spectrum[i] || 0;
  }

  return total / (end - start);
}

// Find the strongest frequency in a range
function peakFrequency(spectrum, start, end) {
  let strongest = 0;

  for (let i = start; i < end; i++) {
    if (spectrum[i] > strongest) {
      strongest = spectrum[i];
    }
  }
  return strongest;
}

// Abstract pattern
function drawPattern() {

  let cell = 12.5;

  // Overall loudness controls shape size
  let sizeChange = constrain(map(volume, 0, 0.25, 0, 7), 0, 7);

  // Mid frequencies distort the grid
  let distortion = constrain(map(mid, 0, 0.25, 0, 14), 0, 14);

  // High frequencies change pattern density
  let density = constrain(map(high, 0, 0.2, 0, 3), 0, 3);

  // Deep bass controls pattern thickness
  let thickness = constrain(map(deepBass, 0, 0.15, 1, 6), 1, 6);

  // Draw a 40 x 40 grid
  for (let row = 0; row < 40; row++) {
    for (let col = 0; col < 40; col++) {

      let x = col * cell + cell / 2;
      let y = row * cell + cell / 2;

      // Flowing geometric pattern
      let wave1 = sin(col * 12 + motion * 1.5);
      let wave2 = cos(row * 12 - motion);
      let wave3 = sin((col + row) * 8 + motion);

      let pattern = wave1 + wave2 + wave3;

      // Distort the grid with the middle frequencies
      x += sin(row * 15 + motion) * distortion;
      y += cos(col * 15 + motion) * distortion;

      // Shapes become larger when the music is louder
      let size = 3 + sizeChange;

      // Filled square regions with black grid lines
      if (pattern > 1.25 - density * 0.2) {

        fill(patternHue, 45, 100);

        // Black outline creates the grid pattern
        stroke(0, 0, 0);
        strokeWeight(1.5);

        rectMode(CENTER);
        rect(x, y, cell, cell);
        rectMode(CORNER);

      } else if (pattern > 0.2) {
        // Vertical lines
        stroke(patternHue, 75, 100);
        strokeWeight(thickness);

        line(x, y - cell / 2, x, y + cell / 2);

      } else if (pattern > -0.9) {
        // Circles
        noStroke();
        fill(patternHue, 75, 100);

        circle(x, y, size);

      } else if (pattern > -1.7) {

        // Outlined squares
        noFill();
        stroke(patternHue, 75, 65);
        strokeWeight(1.2);

        rectMode(CENTER);
        rect(x, y, cell - 2, cell - 2);
        rectMode(CORNER);

      } else {

        // Smaller dots in quieter regions
        if ((row + col) % 4 === 0) {
          noStroke();
          fill(patternHue, 75, 60);
          circle(x, y, 2 + sizeChange * 0.3);
        }
      }
    }
  }
}

// Colored squares
function addSquares() {

  // Bass strength changes how many squares appear
  let amount = constrain(floor(map(bass, 0, 0.2, 1, 6)), 1, 6);

  for (let i = 0; i < amount; i++) {
    squares.push({
      x: floor(random(1, 9)) * 50,
      y: floor(random(1, 9)) * 50,
      size: random(65, 145),
      color: random(colors),
      life: 1
    });
  }

  // Keep the array from becoming too large
  if (squares.length > 25) {
    squares.splice(0, squares.length - 25);
  }
}

function drawSquares() {

  for (let i = squares.length - 1; i >= 0; i--) {

    let s = squares[i];

    // Squares start big and gradually shrink
    let size = s.size * s.life;

    noStroke();
    rectMode(CENTER);

    // Bright outer square
    fill(
      s.color[0],
      s.color[1],
      s.color[2],
      s.life * 100
    );

    rect(s.x, s.y, size, size);

    // Smaller black square creates contrast
    fill(0, 0, 0, s.life * 35);

    rect(s.x, s.y, size * 0.4, size * 0.4
    );

    rectMode(CORNER);

    // Freeze square animations when paused
    if (playing) { s.life -= 0.028;}

    // Remove squares that have faded
    if (s.life <= 0) {
      squares.splice(i, 1);
    }
  }
}

// Playback text
function drawInterface() {

  noStroke();

  fill(0, 0, 0, 85);
  rect(175, 9, 150, 25, 3);

  fill(0, 0, 100);
  textAlign(CENTER, CENTER);
  textSize(11);

  if (loadError) {
    text("AUDIO FILE NOT FOUND", 250, 21);

  } else if (!loaded) {
    text("LOADING AUDIO...", 250, 21);

  } else if (playing) {
    text("CLICK TO PAUSE", 250, 21);

  } else {
    text("CLICK TO PLAY", 250, 21);
  }
}

// Mouse interaction
async function mousePressed() {

  // Only respond to clicks inside the canvas
  if (
    mouseX >= 0 && mouseX <= width &&
    mouseY >= 0 && mouseY <= height &&
    loaded
  ) {
    if (song.isPlaying()) {
      // Pause audio and animation
      song.pause();
      playing = false;

    } else {
      // Start or resume audio
      await userStartAudio();
      song.play();
      playing = true;
    }
  }
  return false;
}
