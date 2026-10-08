import { TicTacToe } from './src/index.ts';
import type { Board } from './src/index.ts';

const board: Board = [
  ['X', 'X', null, 'O'],
  ['O', 'X', 'O', null],
  [null, 'O', 'X', null],
  ['X', null, null, 'X']
];

const game = new TicTacToe(board);
console.log(game.checkWinner());
console.log(game.isGameOver());
console.log(game.anyMovesLeft());
