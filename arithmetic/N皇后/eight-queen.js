/**
 * 八皇后
 * */

//  创建棋盘
function createChess(row = 8, col = 8, defaultValue = 0) {
  let i, j;
  const chess = [];

  for (i = 0; i < row; i++) {
    chess[i] = [];

    for (j = 0; j < col; j++) {
      chess[i][j] = defaultValue;
    }
  }

  return chess;
}

// 复制一个棋盘
function cloneChess(temp, endRow) {
  let i, j;
  let row = temp.length;
  let col = temp[0].length;
  const chess = [];

  for (i = 0; i < row; i++) {
    chess[i] = [];

    for (j = 0; j < col; j++) {

      if (i <= endRow) {
        chess[i].pos = temp[i].pos;
        chess[i][j] = temp[i][j];
      } else {
        chess[i][j] = 0;
      }
    }
  }

  return chess;
}

// 判断当前位置能否放置皇后
function isEnableLay(chess, row, col) {
  let i, j;

  // 左边检查 - 不用检查，因为在放置的时候不可能在一行放置两个皇后
  // for (j = 0; j < col; j++) {
  //   if (chess[row][j]) {
  //     return false;
  //   }
  // }

  // 右边检查 - 不用检查，因为在放置的时候不可能在一行放置两个皇后
  // for (j = chess[row].length - 1; j > col; j--) {
  //   if (chess[row][j]) {
  //     return false;
  //   }
  // }

  // 上边检查
  for (i = 0; i < row; i++) {
    if (chess[i][col]) {
      return false;
    }
  }

  // 下边检查 - 不用检查，因为从上往下放置，下面一定没有皇后
  // for (i = chess[row][col].length - 1; i > row; i--) {
  //   if (chess[i][col]) {
  //     return false;
  //   }
  // }

  // 左上检查
  for (i = row - 1, j = col - 1; i >= 0 && j >= 0; i--, j--) {
    if (chess[i][j]) {
      return false;
    }
  }

  // 左下检查
  // for (i = row + 1, j = col - 1; i < chess.length && j >= 0; i++, j--) {
  //   if (chess[i][j]) {
  //     return false;
  //   }
  // }

  // 右上检查 - 不用检查，因为从上往下放置，下面一定没有皇后
  for (i = row - 1, j = col + 1; i >= 0 && j < chess[i].length; i--, j++) {
    if (chess[i][j]) {
      return false;
    }
  }

  // 右下检查 - 不用检查，因为从上往下放置，下面一定没有皇后
  // for (i = row + 1, j = col + 1; i < chess.length && j < chess[i].length; i++, j++) {
  //   if (chess[i][j]) {
  //     return false;
  //   }
  // }

  return true;
}

function isRepeat(chess, chessList) {
  const map = {};
  chessList.forEach(item => map[item.join()] = true);

  // console.log(map);
  // console.log(chess.join());
  // console.log(map[chess.join()]);
  return map[chess.join()];
}

// 把皇后放置到棋盘正确的位置
// 策略：从第一行开始，依次判断某列是否可以放置棋子，可以的话放置，然后row++跳到下一行放置，直到放满8行即找到一种答案
// 回溯优化：如果某一行未成功放置棋子，那么证明上一行放置的棋子有误，退回到上一行，然后从有误的列作为起始寻找下一个有效位
function layQueenOnChess(chessList, backChess, backI, backJ) {
  const chess = !backChess ? createChess() : cloneChess(backChess, backI - 1);
  let i, j, iLen, jLen;

  row: for (i = backI || 0, iLen = chess.length; i < iLen; i++) {
    // 清空回溯使用的行信息
    backI = 0;

    if (backJ) {
      console.log(`进入回溯，回溯坐标点：${i}, ${backJ}`);
    }

    col: for (j = backJ || 0, jLen = chess[i].length; j < jLen; j++) {
      // 清空回溯使用的列信息
      backJ = 0;
    
      if (isEnableLay(chess, i, j)) {
        // 记录当前行皇后放置位置，将来回溯使用
        chess[i].pos = j;
        chess[i][j] = 1;
        continue row;
      }
    }
  
    // 当前行未放置皇后，那么回溯一行
    // 如果回溯行的皇后放置在末尾，说明回溯行无其他放置可能，继续回溯
    // 如果回溯到第一行也没有找到皇后新的可放置位置，那么结束    
    while (true) {
      console.log(`当前行放置皇后失败，进入回溯，回溯起始坐标点：${i}, ${j-1}`);
      i--;

      // 回溯结束
      if (i < 0) {
        return false;
      }

      // 记录回溯行皇后的位置，然后重置该行信息
      const pos = chess[i].pos;
      chess[i][pos] = chess[i].pos = 0;

      // 开始回溯，再次 i-- 是因为外层循环还会 i++ 一次，pos + 1 是因为回溯要从皇后的下一个位置开始
      if (pos < chess[i].length - 1) {
        i--;
        backJ = pos + 1;
        continue row;
      }
    }
  }

  // 找到答案，并且不重复，备份存储
  if (!isRepeat(chess, chessList)) {
    chessList.push(chess);
  } else {
    console.log("重复出现");
    throw "重复";
  }
  
  // 回溯寻找下一个
  console.warn(`找到一个答案：${i === iLen}，当前处于第${i}行，第${j}列，开始递归回溯`);
  layQueenOnChess(chessList, chess, i - 1, j + 1);
}

function printChessMatrix(chess) {
  let i;

  for (i = 0; i < chess.length; i++) {
    console.log(chess[i].join(" "), "\n");
  }

  console.log("----------------");
}

function main() {
  const chessList = [];
  layQueenOnChess(chessList);

  console.log(`找到答案${chessList.length}个`);
  // chessList.forEach(chess => printChessMatrix(chess));
}

main();
