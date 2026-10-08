import test from 'node:test';
import assert from 'node:assert/strict';
import { WIN_LINES } from '../src/winLines.ts';
import { BOARD_SIZE } from '../src/types.ts';

test('WIN_LINES', async (t) => {
  await t.test('has exactly 20 lines', () => {
    assert.equal(WIN_LINES.length, 20);
  });

  await t.test(`every line has ${BOARD_SIZE} unique in-bounds coordinates`, () => {
    for (const line of WIN_LINES) {
      assert.equal(line.length, BOARD_SIZE);
      const uniqueCoords = new Set(line.map(([r, c]) => `${r},${c}`));
      assert.equal(uniqueCoords.size, BOARD_SIZE, 'Coordinates must be unique');
      for (const [r, c] of line) {
        assert.ok(r >= 0 && r < BOARD_SIZE, `Row ${r} out of bounds`);
        assert.ok(c >= 0 && c < BOARD_SIZE, `Col ${c} out of bounds`);
      }
    }
  });

  await t.test('no duplicate lines', () => {
    const serializedLines = WIN_LINES.map(line => {
      // Sort coordinates to ensure order doesn't mask duplicates
      const coords = [...line].map(([r, c]) => `${r},${c}`);
      coords.sort();
      return coords.join('|');
    });
    const uniqueLines = new Set(serializedLines);
    assert.equal(uniqueLines.size, WIN_LINES.length, 'Duplicate win lines found');
  });

  await t.test('contains the specific corner line', () => {
    const last = BOARD_SIZE - 1;
    const cornerLine = [[0, 0], [0, last], [last, 0], [last, last]];
    
    // Check if WIN_LINES contains a line that matches cornerLine exactly (ignoring point order)
    const sortedCornerCoords = cornerLine.map(([r, c]) => `${r},${c}`).sort().join('|');
    const hasCorner = WIN_LINES.some(line => {
      const sortedLineCoords = [...line].map(([r, c]) => `${r},${c}`).sort().join('|');
      return sortedLineCoords === sortedCornerCoords;
    });
    assert.ok(hasCorner, 'Missing four corners win line');
  });

  await t.test('contains all 9 2x2 boxes', () => {
    // Generate all 9 boxes expected
    const expectedBoxes = [];
    for (let r = 0; r < BOARD_SIZE - 1; r++) {
      for (let c = 0; c < BOARD_SIZE - 1; c++) {
        expectedBoxes.push([
          [r, c], [r, c+1],
          [r+1, c], [r+1, c+1]
        ]);
      }
    }
    
    for (const box of expectedBoxes) {
      const sortedBoxCoords = box.map(([r, c]) => `${r},${c}`).sort().join('|');
      const hasBox = WIN_LINES.some(line => {
        const sortedLineCoords = [...line].map(([r, c]) => `${r},${c}`).sort().join('|');
        return sortedLineCoords === sortedBoxCoords;
      });
      assert.ok(hasBox, `Missing 2x2 box: ${sortedBoxCoords}`);
    }
  });

  await t.test('WIN_LINES and every line is frozen', () => {
    assert.ok(Object.isFrozen(WIN_LINES), 'WIN_LINES array should be frozen');
    for (const line of WIN_LINES) {
      assert.ok(Object.isFrozen(line), 'Each line should be frozen');
      for (const coord of line) {
        assert.ok(Object.isFrozen(coord), 'Each coordinate should be frozen');
      }
    }
  });
});
