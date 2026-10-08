# 4x4 Tic-Tac-Toe Win-Condition Solver

A dependency-free TypeScript library that evaluates win conditions for a 4x4 variant of Tic-Tac-Toe.

## Goal

This library implements a `TicTacToe` solver that evaluates a given 4x4 board and determines if the game is over, who won, and whether any moves remain.

Victory is determined by one of five conditions (all 4 cells must be owned by the same player):
1. **Horizontal**: any of the 4 rows
2. **Vertical**: any of the 4 columns
3. **Diagonal**: the main or anti-diagonal
4. **Four Corners**: the 4 corner cells
5. **2x2 Box**: any contiguous 2x2 square on the board (9 possible squares)

## Requirements

- Node.js >= 22.18.0 (required for native test runner type-stripping)
- (No external runtime dependencies)

If you use `nvm`, you can install and use the appropriate version:
```bash
nvm install 22
nvm use 22
```

## Setup

1. Install development dependencies (`typescript` and `@types/node`). The `.npmrc` file blocks install-time lifecycle scripts for added supply-chain security.
   ```bash
   npm ci
   ```

2. Run the tests to verify the solver works:
   ```bash
   npm run check    # runs typechecking and unit tests
   npm test         # runs unit tests only
   ```

## Usage

```typescript
import { TicTacToe } from './src/index.ts';
import type { Board, WinLine } from './src/index.ts';

// 1. Define a 4x4 board (array of 4 rows, each with 4 cells)
// Cells can be 'X', 'O', or null
const board: Board = [
  ['X', 'X', null, 'O'],
  ['O', 'X', 'O', null],
  [null, 'O', 'X', null],
  ['X', null, null, 'X']
];

// 2. Instantiate the game state
const game = new TicTacToe(board);

// 3. Query the game state
console.log(game.checkWinner()); // 'X' (won on the main diagonal)
console.log(game.isGameOver());  // true
console.log(game.anyMovesLeft()); // true

// 4. (Optional) Inject custom win lines
const customLines: readonly WinLine[] = [
  [[0, 0], [1, 1], [2, 2], [3, 3]] // e.g., only the main diagonal wins
];
const customGame = new TicTacToe(board, customLines);
```

## Design Notes

- **Data-Driven & Injectable Win Lines**: Rather than hardcoding nested `if` statements, the 20 possible win conditions (4 rows, 4 columns, 2 diagonals, 1 corners, 9 boxes) are pre-calculated at startup as coordinate lists. `checkWinner()` simply iterates through this array. The constructor also accepts an optional array of custom win lines, allowing the solver to support arbitrary board rules without modifying the source code.
- **Memoization**: Game state queries (`checkWinner()`, `anyMovesLeft()`) are lazily evaluated and internally memoized since the board is immutable, ensuring subsequent calls are O(1).
- **Strict Type Definitions**: The board structure is strictly typed as a 4x4 tuple (`readonly [Row, Row, Row, Row]`), providing maximum compile-time safety and IDE support.
- **Immutability & Defensive Copying**: The `TicTacToe` class is immutable from the outside. The board is deeply cloned and frozen on instantiation. This prevents the caller from mutating the board out from under the solver, bypassing validation.
- **Strict Validation**: The board is strictly validated at runtime (not just compile-time). Sparse arrays, prototype pollution attempts, or invalid values like `undefined` or `'x'` are explicitly rejected.
- **Test Tooling**: We use Node's native test runner (`node:test`) and native type stripping (with `erasableSyntaxOnly`) to avoid bringing in large, complex dependencies like Jest or ts-node.

## Security Measures

- **No runtime dependencies**: 0 vulnerabilities via `npm audit`.
- **Validation**: Strict runtime validation of untrusted input to block malformed inputs.
- **Prototype Pollution Prevention**: No object spreading or merging is used when parsing inputs.
- **Data Isolation**: A deeply-frozen defensive copy ensures the board cannot change post-validation (e.g. by using getters/setters in plain JS arrays).
- **Log Injection / Data Leakage**: Error messages point to coordinates and avoid directly echoing raw, untrusted user inputs.
- **Supply Chain**: Built with `.npmrc` containing `ignore-scripts=true`.

## Testing

The solution was built using Test-Driven Development (TDD). The test suite includes full coverage for:
- Validation errors and input edge cases
- All win conditions (horizontal, vertical, diagonal, corners, all 9 boxes)
- Custom injected win lines
- Draw conditions and edge-cases (L-shapes, missing pieces)
- Determinisim (if multiple players technically have a win line on a malformed board)
- Immutable state guarantees
