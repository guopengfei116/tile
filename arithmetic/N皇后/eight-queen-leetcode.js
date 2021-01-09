/**
 * @param {number} n
 * @return {string[][]}
 */
var solveNQueens = function(n) {
  if (n <= 0) return [[]];

  const DEFAULT_ROW = n;
  const DEFAULT_COL = n;
  const CHESS_DEFAULT_VALUE = ".";
  const CHESS_QUEEN_VALUE = "Q";
  const maxBinary = 2 ** n - 1;
  let count = 0;

  // 创建初始棋盘
  function createChess(row = DEFAULT_ROW, col = DEFAULT_COL) {
      const defaultValue = 0;
      const chess = [];
      let i, j;

      for (i = 0; i < row; i++) {
          chess[i] = [];

          for (j = 0; j < col; j++) {
              chess[i][j] = CHESS_DEFAULT_VALUE; 
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
                  clonedChess[i][j] = CHESS_DEFAULT_VALUE; 
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
          if (chess[i][j] === CHESS_QUEEN_VALUE) {
              return false;
          }
      }

      // 右上
      for (i = row - 1, j = col + 1; i >= 0 && j < chess[i].length; i--, j++) {
          if (chess[i][j] === CHESS_QUEEN_VALUE) {
              return false;
          }
      }

      // 上边
      for (i = row - 1, j = col; i >= 0; i--) {
          if (chess[i][j] === CHESS_QUEEN_VALUE) {
              return false;
          }
      }

      return true;
  }

  // 寻找所有八皇后答案
  // 1.如果是第一次找，那么就创建一个新的棋盘
  //   如果已经找到一个答案，就会基于此答案继续找，所以有一个递归过程，需要加个参数，用来clone之前的结果
  // 2. 因为答案可能有很多，需要一个统一存储地方，这个也让对方传个参数进来
  function findResult(baseChess, backI, backJ, results, usedCalBinary) {
      const chess = baseChess ? cloneChess(baseChess, backI - 1) : createChess();

      let i, j;
      let row = chess.length;
      let col = chess[0].length;
      usedCalBinary = usedCalBinary || 0;

      // 如果有回溯行，优先使用回溯的
      i = backI || 0;
      backI = 0;
      row: for (; i < row; i++) {
          
          // 如果有回溯列，优先使用回溯的
          j = backJ || 0;
          backJ = 0;
          for (; j < col; j++) {

              if ((usedCalBinary | 2 ** j) === usedCalBinary) {
                // console.log(`${usedCalBinary} 包含 ${2 ** j}`);
                count++;
                continue;
              }
          
              if (isEnableLay(chess, i, j)) {
                  chess[i][j] = CHESS_QUEEN_VALUE;
                  usedCalBinary = usedCalBinary | 2 ** j;
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
              const pos = chess[i].indexOf(CHESS_QUEEN_VALUE);
              chess[i][pos] = CHESS_DEFAULT_VALUE;
              usedCalBinary = usedCalBinary & (2 ** pos ^ maxBinary);

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

      // console.log('找到一种解法');
      results.push(chess.map(item => item.join("")));

      // 接下来基于当前解法，把最后一个皇后+1的位置传过去，然后基于此位置回溯找其他可能
      usedCalBinary = usedCalBinary & (2 ** j ^ maxBinary);
      findResult(chess, i - 1, j + 1, results, usedCalBinary);
  }

  const results = [];
  findResult(null, null, null, results);

  console.log(`使用二进制减少了 ${count} 次 isEnable 函数计算，总共找到 ${results.length} 种摆法`);
  return results;
};

function printChessMatrix(chess) {
  let i;

  for (i = 0; i < chess.length; i++) {
    console.log(chess[i], "\n");
  }

  console.log("----------------");
}

const chessList = solveNQueens(8);
chessList.forEach(chess => printChessMatrix(chess));
