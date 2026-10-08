import type { Board, Player, WinLine } from './types.ts';
import { WIN_LINES } from './winLines.ts';
import { validateBoard } from './validateBoard.ts';

export class TicTacToe {
  readonly #board: Board;
  readonly #winLines: readonly WinLine[];

  constructor(board: unknown, winLines: readonly WinLine[] = WIN_LINES) {
    // Also validates at runtime: the TS types don't protect plain-JS or deserialized-JSON callers.
    this.#board = validateBoard(board);
    this.#winLines = winLines;
  }

  #winner: Player | null | undefined;
  #movesLeft: boolean | undefined;

  /** The winning player, or null. If both players have a line, the first in injected winLines order wins. */
  public checkWinner(): Player | null {
    if (this.#winner !== undefined) return this.#winner;

    for (const line of this.#winLines) {
      const owner = this.#lineOwner(line);
      if (owner !== null) {
        this.#winner = owner;
        return owner;
      }
    }
    
    this.#winner = null;
    return null;
  }

  /** True if at least one cell is empty. */
  public anyMovesLeft(): boolean {
    if (this.#movesLeft !== undefined) return this.#movesLeft;
    
    this.#movesLeft = this.#board.some((row) => row.includes(null));
    return this.#movesLeft;
  }

  /** True if someone has won or the board is full. */
  public isGameOver(): boolean {
    return this.checkWinner() !== null || !this.anyMovesLeft();
  }

  #lineOwner(line: WinLine): Player | null {
    if (line.length === 0) return null;

    const [r0, c0] = line[0]!;
    const first = this.#board[r0]?.[c0];
    
    // Safely handles both empty cells (null) and out-of-bounds coordinates (undefined)
    if (!first) return null;

    const hasWon = line.every(([r, c]) => this.#board[r]?.[c] === first);
    
    return hasWon ? first : null;
  }
}
