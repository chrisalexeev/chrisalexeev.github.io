function randomIntFromRange(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

function randomColor(colors) {
  return colors[Math.floor(Math.random() * colors.length)]
}

function distance(x1, y1, x2, y2) {
  const xDist = x2 - x1
  const yDist = y2 - y1

  return Math.sqrt(Math.pow(xDist, 2) + Math.pow(yDist, 2))
}

function createLevel(levelStr) {
  const empty = '.';
  const block = '#';
  const win = '$';

  const board = [];

  const split = levelStr.split('\n');
  split.forEach(row => {
    const splitRow = row.split();
    board.push(splitRow);
  });

  console.log(board)
}

export default { randomIntFromRange, randomColor, distance, createLevel }