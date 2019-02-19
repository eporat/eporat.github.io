let board;
let turn = 1;
let gameover = false;
let orientation = 'horizontal'
let size;
let SQUARE_SIZE, OFFSET_X, OFFSET_Y;

function setup(){
  size = min(windowWidth, windowHeight);
  console.log(size);
  createCanvas(size, size);
  board = new Board(9);
  textAlign(CENTER, CENTER);
  rectMode(CENTER);

  SQUARE_SIZE = 0.05 * size;
  OFFSET_X =    0.3 * size;
  OFFSET_Y =    0.3 * size;

  alert("Press space to rotate wall");
}

function windowResized() {
  size = min(windowWidth, windowHeight);
  resizeCanvas(size, size);
}

function draw(){
  background(200);
  fill(0);
  textSize(64);
  textFont("Electrolize")
  text("Quoridor", size * 0.5, size * 0.1);
  textSize(24);
  text("Player: ", size * 0.4, size * 0.2)
  board.draw();
  let c = turn === 1 ? color(0, 0, 255, 255) : color(255, 0, 0, 255);
  fill(c);
  ellipse(size * 0.5, size * 0.2, size * 0.05 * sin(frameCount * 0.05))
}

function keyPressed(){
  if (gameover){
    return false;
  }
  if (turn === 1){
    switch (key){
      case "ArrowDown":
        board.move(1, 'down');
        break;
      case "ArrowUp":
        board.move(1, 'up');
        break;
      case "ArrowLeft":
        board.move(1, 'left');
        break;
      case "ArrowRight":
        board.move(1, 'right');
        break;
    }
  } else {
    switch (key){
      case "s":
      board.move(2, 'down');
      break;
    case "w":
      board.move(2, 'up');
      break;
    case "a":
      board.move(2, 'left');
      break;
    case "d":
      board.move(2, 'right');
      break;
    }
  }

  if (key == ' '){
    orientation = orientation === 'horizontal' ? 'vertical' : 'horizontal';
  }
  return false;
}

function mousePressed(){
  board.mousePressed()
}