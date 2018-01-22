import {SHAPES,
        COLORS,
        ROWS,
        COLS,
        SET_POSITION_X,
        SET_POSITION_Y,
        KEYS} from './const'
import { rotate } from './rotate'

let board = [];
let lose;
let interval;
let current;
let currentX, currentY;


const init = () => {
  for(let y = 0; y < ROWS; ++y) {
    board[y] = [];
    for(let x = 0; x < COLS; ++x) {
      board[y][x] = 0;
    }
  }
}

// Create new block
const newShape = () => {
  let id = Math.floor(Math.random() * SHAPES.length);
  let shape = SHAPES[id];
  current = []

  for(let y = 0; y < 4; ++y) {
    current[y] = [];
    for(let x = 0; x < 4; ++x) {
      let i = 4 * y + x;
      if(typeof shape[i] != 'undefined' && shape[i]) {
        current[y][x] = id + 1;
      } else {
        current[y][x] = 0;
      }
    }
  }
  currentX = SET_POSITION_X;
  currentY = SET_POSITION_Y;
}

// Loop of block fall
const tick = () => {
  if(valid(0,1)){
    ++currentY;
  } else {
    freeze();
    clearLines();
    if(lose) {
      newGame();
      return false;
    }
    newShape();
  }
}

// Check invalid for moving block
// and Game over check
const valid = ( offsetX, offsetY, newCurrent ) => {
  offsetX = offsetX || 0;
  offsetY = offsetY || 0;
  offsetX = currentX + offsetX;
  offsetY = currentY + offsetY;
  newCurrent = newCurrent || current;
  for ( let y = 0; y < 4; ++y ) {
    for ( let x = 0; x < 4; ++x ) {
      if ( newCurrent[y][x] ) {
        if ( typeof board[y + offsetY] == 'undefined'
             || typeof board[y + offsetY][x + offsetX] == 'undefined'
             || board[y + offsetY][x + offsetX]
             || x + offsetX < 0
             || y + offsetY >= ROWS
             || x + offsetX >= COLS ) {
               if (offsetY == 1 && offsetX-currentX == 0 && offsetY-currentY == 1){
                 console.log('GAME OVER')
                 // alert('GAME OVER')
                 lose = true;
               }
               return false;
             }
      }
    }
  }
  return true;
}

// Block freeze
const freeze = () => {
  for(let y = 0; y < 4; ++y) {
    for(let x = 0; x < 4; ++x) {
      if(current[y][x]) {
        board[y + currentY][x + currentX] = current[y][x]
      }
    }
  }
}

// Block claer
const clearLines =()=> {
  for(let y = ROWS - 1; y >= 0; --y) {
    let rowFilled = true;
    for(let x = 0; x < COLS; ++x) {
      if(board[y][x] == 0) {
        rowFilled = false;
        break;
      }
    }
    if(rowFilled) {
      for(let yy = y; yy > 0; --yy) {
        for(let x = 0; x < COLS; ++x) {
          board[yy][x] = board[yy-1][x];
        }
      }
      ++y;
    }
  }
}

// Start game
const newGame = () => {
  clearInterval(interval);
  init();
  newShape();
  lose = false;
  interval = setInterval(tick, 250);
}

const keyPress = (key) => {
  switch(key) {
    case 'left':
      if(valid(-1)) {
        --currentX; // 左に一つずらす
      }
      break;
    case 'right':
      if(valid(1)){
        ++currentX; // 右に一つずらす
      }
      break;
    case 'down':
      if(valid(0,1)) {
        ++currentY; // 下に一つずらす
      }
      break;
    case 'rotate':
      // rotate block
      const rotated = rotate(current);
      if(valid(0,0,rotated)) {
        current = rotated;
      }
      break;
  }
}

/*
 * Render for board status
 */
let canvas = document.getElementsByTagName('canvas')[0];
let ctx = canvas.getContext('2d');
let W = 300, H = 600;
let BLOCK_W = W / COLS, BLOCK_H = H / ROWS;

const render = () => {
  ctx.clearRect(0,0,W,H);
  ctx.strokeStyle = 'black';

  // 盤面描画
  for(let x = 0; x < COLS; ++x) {
    for(let y = 0; y < ROWS; ++y) {
      if(board[y][x]) {
        ctx.fillStyle = COLORS[board[y][x]-1];
        drawBlock(x,y);
      }
    }
  }
  for(let y = 0; y < 4; ++y) {
    for(let x = 0; x < 4; ++x) {
      if (current[y][x]) {
        ctx.fillStyle = COLORS[current[y][x] - 1];
        drawBlock(currentX + x, currentY + y);
      }
    }
  }
}

// Render for block
const drawBlock = (x,y) => {
  ctx.fillRect(BLOCK_W * x, BLOCK_H * y, BLOCK_W - 1, BLOCK_H - 1);
  ctx.strokeRect( BLOCK_W * x, BLOCK_H * y, BLOCK_W - 1, BLOCK_H - 1);
}

setInterval(render, 10);


/*
 * When key push call this
 */
document.body.onkeydown = e => {
  if(typeof KEYS[e.keyCode] != 'undefined') {
    keyPress(KEYS[e.keyCode]);
    render();
  }
};

// game start
newGame();
