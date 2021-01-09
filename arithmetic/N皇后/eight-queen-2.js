const DEFAULT_ROW = 8;
const DEFAULT_COL = 8;

// 创建初始棋盘
function createChess(row = DEFAULT_ROW, col = DEFAULT_COL) {
  const defaultValue = 0;
  const chess = [];
  let i, j;

  for (i = 0; i < row; i++) {
    chess[i] = [];

    for (j = 0; j < col; j++) {
      chess[i][j] = 0; 
    }
  }

  return chess;
}

// 复制棋盘，因为如果已经找到一种摆法，找第二种的时候，可以基于第一种进行修改
// 在复制的过程中，需要支持复制到某一行，因为我不可能复用全部结果，需要留几行让我换位置尝试放置皇后
function cloneChess(chess, endRow) {
  const clonedChess = [];
  let row = chess.length;
  let col = chess[0].length;
  let i, j;
  
  for (i = 0; i < row; i++) {
    clonedChess[i] = [];

    for (j = 0; j < col; j++) {

      if (i <= endRow) {
        clonedChess[i][j] = chess[i][j];
      } else {
        clonedChess[i][j] = 0; 
      }
    }
  }

  return clonedChess;
}

// 判断此位置是否可以放置皇后
// 因为我们是从上往下依次放置皇后，所以只要判断 左上、右上、上边 三个方向有没有冲突皇后就可以了。
// 另外因为每行只可以放置一个皇后，所以当前行的左右也不用判断。
function isEnableLay(chess, row, col) {
  let i, j;

  // 左上
  for (i = row - 1, j = col - 1; i >= 0 && j >= 0; i--, j--) {
    if (chess[i][j]) {
      return false;
    }
  }

  // 右上
  for (i = row - 1, j = col + 1; i >= 0 && j < chess[i].length; i--, j++) {
    if (chess[i][j]) {
      return false;
    }
  }

  // 上边
  for (i = row - 1, j = col; i >= 0; i--) {
    if (chess[i][j]) {
      return false;
    }
  }

  return true;
}

// 寻找所有八皇后答案
// 1.如果是第一次找，那么就创建一个新的棋盘
//   如果已经找到一个答案，就会基于此答案继续找，所以有一个递归过程，需要加个参数，用来clone之前的结果
// 2. 因为答案可能有很多，需要一个统一存储地方，这个也让对方传个参数进来
function findResult(baseChess, backI, backJ, results) {
  const chess = baseChess ? cloneChess(baseChess, backI) : createChess();

  let i, j;
  let row = chess.length;
  let col = chess[0].length;

  // 如果有回溯行，优先使用回溯的
  i = backI || 0;
  backI = 0;
  row: for (; i < row; i++) {
    
    // 如果有回溯列，优先使用回溯的
    j = backJ || 0;
    backJ = 0;
    for (; j < col; j++) {
      
      if (isEnableLay(chess, i, j)) {
        chess[i][j] = 1;
        continue row;
      }
    }

    // 如果当前行没有成功放置皇后，说明之前放置有误，可以先回溯到上一行，重新从回溯行皇后的位置+1摆放
    // 但是如果回溯行皇后已经在末尾了，需要继续回溯一行
    // 如果回溯到第一行-1，那么说明所有的解法都试过了
    while (true) {
      i--;

      // 一直回溯的终点，没有解法了
      if (i < 0) {
        return false;
      }

      // 找到上一行皇后的位置，然后重置掉回溯行的数据
      const pos = chess[i].indexOf(1);
      chess[i][pos] = 0;

      // 如果皇后不在末尾，那么可以回溯了，
      // 但是需要再 i-- 一下，因为外层循环还会 i++，
      // 然后回溯的起始列为皇后位置 +1
      if (pos < chess[i].length - 1) {
        i--;
        backJ = pos + 1;
        break;
      }
    }
  }

  console.log('找到一种解法');
  results.push(chess);

  // 接下来基于当前解法，把最后一个皇后+1的位置传过去，然后基于此位置回溯找其他可能
  findResult(chess, i - 1, j + 1, results);
}

function main() {
  const results = [];
  findResult(null, null, null, results);
  console.log(`找到${results.length}种摆法`);
}

main();
