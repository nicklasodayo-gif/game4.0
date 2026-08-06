/**
 * Shuffle utilities for the sliding-tile puzzle.
 */

export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/** Check if a puzzle configuration is solvable. */
export function isSolvable(tiles: number[], gridSize: number): boolean {
  let inversions = 0;
  const tilesWithoutEmpty = tiles.filter((t) => t !== gridSize * gridSize);

  for (let i = 0; i < tilesWithoutEmpty.length; i++) {
    for (let j = i + 1; j < tilesWithoutEmpty.length; j++) {
      if (tilesWithoutEmpty[i] > tilesWithoutEmpty[j]) {
        inversions++;
      }
    }
  }

  if (gridSize % 2 === 1) {
    return inversions % 2 === 0;
  }

  const emptyIndex = tiles.indexOf(gridSize * gridSize);
  const emptyRow = Math.floor(emptyIndex / gridSize);
  const fromBottom = gridSize - emptyRow;
  return (inversions + fromBottom) % 2 === 1;
}

/** Generate a solvable shuffled puzzle by making random valid moves from the solved state. */
export function generateSolvablePuzzle(gridSize: number, shuffleMoves = 50): number[] {
  const totalTiles = gridSize * gridSize;
  const tiles = Array.from({ length: totalTiles }, (_, i) => i + 1);

  for (let i = 0; i < shuffleMoves; i++) {
    const emptyIndex = tiles.indexOf(totalTiles);
    const emptyRow = Math.floor(emptyIndex / gridSize);
    const emptyCol = emptyIndex % gridSize;

    const validMoves: number[] = [];
    if (emptyRow > 0) validMoves.push(emptyIndex - gridSize);
    if (emptyRow < gridSize - 1) validMoves.push(emptyIndex + gridSize);
    if (emptyCol > 0) validMoves.push(emptyIndex - 1);
    if (emptyCol < gridSize - 1) validMoves.push(emptyIndex + 1);

    const moveIndex = validMoves[Math.floor(Math.random() * validMoves.length)];
    [tiles[emptyIndex], tiles[moveIndex]] = [tiles[moveIndex], tiles[emptyIndex]];
  }

  return tiles;
}

export function isSolved(tiles: number[]): boolean {
  return tiles.every((tile, index) => tile === index + 1);
}

export function getValidMoves(emptyIndex: number, gridSize: number): number[] {
  const moves: number[] = [];
  const row = Math.floor(emptyIndex / gridSize);
  const col = emptyIndex % gridSize;

  if (row > 0) moves.push(emptyIndex - gridSize);
  if (row < gridSize - 1) moves.push(emptyIndex + gridSize);
  if (col > 0) moves.push(emptyIndex - 1);
  if (col < gridSize - 1) moves.push(emptyIndex + 1);

  return moves;
}
