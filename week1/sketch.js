// change the quotes in this array. Be mindful of the quotation marks!
// this is the only part of the file you need to edit!

const quotes = [
  { text: "the practice of making art with code", source: "Andrew Bryant" },
  { text: "about experimentation, not functionality", source: "Maura Kelly" },
  { text: "a process, based on exploration, iteration, reflection and discovery, where code is used as the primary medium to create a wide range of media artifacts", source: "Tim Rodenbröker" },
  { text: "a practice where programming is used as a tool for art or design", source: "Jack B. Du" },
  { text: "Creative coding is the intersection where artists and programmers meet, creating a vast degree of potential", source: "Meadows School of the Arts" },
  { text: "the process of using programming languages to generate art and music, turning code into a paintbrush for real-time artistic expression", source: "University of York" },
  { text: "an act of curiosity—an ongoing conversation with the unknown that begins with a simple question: what if?", source: "Patrik Hübner" },
  { text: "the act of writing code for the pure pleasure of it, where the goal is not functional but creative and expressive; where code becomes a medium, just like a canvas for a painter", source: "Alessia" }
];
// no need to edit anything below this line! 
// if you have made an error, you can check your history to see what might have gone wrong

// a variable that holds the current quote
let current = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  // Seed with millis() so each page load gives a different quote.
  randomSeed(millis());
  textSize(32);
  fill(10, 255, 10);
  // calls the function to pick a quote
  pickQuote();
}

function pickQuote() {
  // take a random number and use that to identify what quote to use
  current = quotes[floor(random(quotes.length))];
}

function draw() {
  background(255, 20, 250); // set the background color
  drawQuote();  // draw the quote on screen
}

function drawQuote() {   // draw text
  textAlign(CENTER, CENTER);
  text("Creative Coding is.....", width / 2, height / 2 - 100);
  textStyle(BOLD);
  let quoteWidth = width * 0.8;
  text("'" + current.text + "'", width * 0.1, height / 2, quoteWidth);
  textAlign(RIGHT, CENTER);
  text("-" + current.source, width - 100, height - 100);

}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function newQuote() {
  pickQuote();
  redraw();
}

function mousePressed() {
  newQuote();
}