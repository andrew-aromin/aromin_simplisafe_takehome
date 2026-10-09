import type { Board, Player, WinLine } from './types.ts';
import { WIN_LINES } from './winLines.ts';
import { validateBoard } from './validateBoard.ts';

/**
 * Core game logic class for Tic-Tac-Toe.
 * Encapsulates the board state and provides methods to evaluate win conditions
 * and overall game status.
 */
export class TicTacToe {
  // using # instead of private since private is compile-time only and erased during transpilation. # is enforced natively by the JavaScript runtime.
  readonly #board: Board;
  readonly #winLines: readonly WinLine[];

  // using memoization to cache expensive checks,
  //  because the underlying board is deep-frozen and guaranteed not to change, we know the winner will never change for this instance.
  #winner: Player | null | undefined;
  #movesLeft: boolean | undefined;

  /**
   * Initializes a new game instance.
   * @param board - The board state to evaluate. Will be validated.
   * @param winLines - The winning line configurations (defaults to standard rules).
   */
  // classic dependency injection, makes the class easy to test.
  constructor(board: unknown, winLines: readonly WinLine[] = WIN_LINES) {
    // Also validates at runtime: the TS types don't protect plain-JS or deserialized-JSON callers.
    this.#board = validateBoard(board);
    this.#winLines = winLines;
  }

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

  /** Determines if a specific array of coordinates is entirely owned by one player. **/
  #lineOwner(line: WinLine): Player | null {
    if (line.length === 0) return null;

    const [r0, c0] = line[0]!;
    // if a custom WinLine is injected that pointed out of bounds (e.g., [99, 99]),
    //  the optional chaining prevents a TypeError: Cannot read properties of undefined exception,
    //  safely returning undefined (which then results in null, meaning no one owns the line).
    const first = this.#board[r0]?.[c0];
    
    // Safely handles both empty cells (null) and out-of-bounds coordinates (undefined)
    if (!first) return null;

    const hasWon = line.every(([r, c]) => this.#board[r]?.[c] === first);
    
    return hasWon ? first : null;
  }
}
