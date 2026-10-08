import type { Board, Player, WinLine } from './types.ts';
import { WIN_LINES } from './winLines.ts';
import { validateBoard } from './validateBoard.ts';

export class TicTacToe {
  readonly #board: Board;

  constructor(board: unknown) {
    // Also validates at runtime: the TS types don't protect plain-JS or deserialized-JSON callers.
    this.#board = validateBoard(board);
  }

  /** The winning player, or null. If both players have a line, the first in WIN_LINES order wins. */
  public checkWinner(): Player | null {
    for (const line of WIN_LINES) {
      const owner = this.#lineOwner(line);
      if (owner !== null) return owner;
    }
    return null;
  }

  /** True if at least one cell is empty. */
  public anyMovesLeft(): boolean {
    return this.#board.some((row) => row.includes(null));
  }

  /** True if someone has won or the board is full. */
  public isGameOver(): boolean {
    return this.checkWinner() !== null || !this.anyMovesLeft();
  }

  #lineOwner(line: WinLine): Player | null {
    const [first, ...rest] = line.map(([r, c]) => this.#board[r]![c]!);
    return first != null && rest.every((cell) => cell === first) ? first : null;
  }
}
