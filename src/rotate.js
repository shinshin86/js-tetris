// 操作ブロックを回す処理
export const rotate = (current) => {
  let newCurrent = [];
  for(let y = 0; y < 4; ++y) {
    newCurrent[y] = [];
    for(let x = 0; x < 4; ++x) {
      newCurrent[y][x] = current[3-x][y];
    }
  }
  return newCurrent;
}
