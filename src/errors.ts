/**
 * Custom error types for the Tic-Tac-Toe game.
 */

/**
 * Thrown when an invalid board configuration is provided to the game.
 */
export class BoardValidationError extends Error {
  override readonly name = 'BoardValidationError';
}
