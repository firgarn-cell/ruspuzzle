import { Difficulty, PuzzlePiece } from '../types/puzzle';

export interface GridConfig {
  cols: number;
  rows: number;
  totalPieces: number;
  name: string;
}

export const DIFFICULTY_CONFIGS: Record<Difficulty, GridConfig> = {
  easy: {
    cols: 4,
    rows: 3,
    totalPieces: 12,
    name: 'Новичок (12 кусочков)',
  },
  medium: {
    cols: 6,
    rows: 4,
    totalPieces: 24,
    name: 'Знаток (24 кусочка)',
  },
  hard: {
    cols: 8,
    rows: 6,
    totalPieces: 48,
    name: 'Мастер (48 кусочков)',
  },
};

/**
 * Generate smooth jigsaw tab/blank path for an edge
 * @param x0 start x
 * @param y0 start y
 * @param x1 end x
 * @param y1 end y
 * @param tab 1 for outward tab, -1 for inward blank, 0 for flat edge
 */
function generateJigsawEdge(
  x0: number,
  y0: number,
  x1: number,
  y1: number,
  tab: number
): string {
  if (tab === 0) {
    return `L ${x1} ${y1}`;
  }

  // Vector from start to end
  const dx = x1 - x0;
  const dy = y1 - y0;
  const length = Math.hypot(dx, dy);

  // Unit vectors
  const ux = dx / length;
  const uy = dy / length;

  // Normal vector pointing "outward" (perpendicular)
  const nx = -uy * tab;
  const ny = ux * tab;

  // Key proportions for classic jigsaw ear
  const p1x = x0 + ux * length * 0.35;
  const p1y = y0 + uy * length * 0.35;

  const neck1x = x0 + ux * length * 0.38 + nx * length * 0.05;
  const neck1y = y0 + uy * length * 0.38 + ny * length * 0.05;

  const earL_x = x0 + ux * length * 0.32 + nx * length * 0.22;
  const earL_y = y0 + uy * length * 0.32 + ny * length * 0.22;

  const earTop_x = x0 + ux * length * 0.50 + nx * length * 0.26;
  const earTop_y = y0 + uy * length * 0.50 + ny * length * 0.26;

  const earR_x = x0 + ux * length * 0.68 + nx * length * 0.22;
  const earR_y = y0 + uy * length * 0.68 + ny * length * 0.22;

  const neck2x = x0 + ux * length * 0.62 + nx * length * 0.05;
  const neck2y = y0 + uy * length * 0.62 + ny * length * 0.05;

  const p2x = x0 + ux * length * 0.65;
  const p2y = y0 + uy * length * 0.65;

  return [
    `L ${p1x.toFixed(1)} ${p1y.toFixed(1)}`,
    `C ${neck1x.toFixed(1)} ${neck1y.toFixed(1)}, ${earL_x.toFixed(1)} ${earL_y.toFixed(1)}, ${earTop_x.toFixed(1)} ${earTop_y.toFixed(1)}`,
    `C ${earR_x.toFixed(1)} ${earR_y.toFixed(1)}, ${neck2x.toFixed(1)} ${neck2y.toFixed(1)}, ${p2x.toFixed(1)} ${p2y.toFixed(1)}`,
    `L ${x1.toFixed(1)} ${y1.toFixed(1)}`,
  ].join(' ');
}

/**
 * Builds the SVG path for a complete puzzle piece including all 4 interlocking edges
 */
export function createPieceSvgPath(
  w: number,
  h: number,
  tabs: { top: number; right: number; bottom: number; left: number }
): string {
  // Coordinates of the 4 base corners
  const tl = { x: 0, y: 0 };
  const tr = { x: w, y: 0 };
  const br = { x: w, y: h };
  const bl = { x: 0, y: h };

  let path = `M ${tl.x} ${tl.y} `;

  // Top edge (tl -> tr)
  path += generateJigsawEdge(tl.x, tl.y, tr.x, tr.y, tabs.top) + ' ';

  // Right edge (tr -> br)
  path += generateJigsawEdge(tr.x, tr.y, br.x, br.y, tabs.right) + ' ';

  // Bottom edge (br -> bl)
  path += generateJigsawEdge(br.x, br.y, bl.x, bl.y, tabs.bottom) + ' ';

  // Left edge (bl -> tl)
  path += generateJigsawEdge(bl.x, bl.y, tl.x, tl.y, tabs.left) + ' ';

  path += 'Z';
  return path;
}

/**
 * Generates an array of interlocking puzzle pieces for given board dimensions
 */
export function generatePieces(
  boardWidth: number,
  boardHeight: number,
  difficulty: Difficulty
): PuzzlePiece[] {
  const { cols, rows } = DIFFICULTY_CONFIGS[difficulty];
  const pieceW = boardWidth / cols;
  const pieceH = boardHeight / rows;

  // Pre-generate random interlocking tabs for internal edges
  // Horizontal edges: rows + 1 sets of cols edges (top & bottom are 0)
  const hTabs: number[][] = [];
  for (let r = 0; r <= rows; r++) {
    hTabs[r] = [];
    for (let c = 0; c < cols; c++) {
      if (r === 0 || r === rows) {
        hTabs[r][c] = 0; // Flat outer edge
      } else {
        hTabs[r][c] = Math.random() < 0.5 ? 1 : -1;
      }
    }
  }

  // Vertical edges: rows sets of cols + 1 edges (left & right are 0)
  const vTabs: number[][] = [];
  for (let r = 0; r < rows; r++) {
    vTabs[r] = [];
    for (let c = 0; c <= cols; c++) {
      if (c === 0 || c === cols) {
        vTabs[r][c] = 0; // Flat outer edge
      } else {
        vTabs[r][c] = Math.random() < 0.5 ? 1 : -1;
      }
    }
  }

  const pieces: PuzzlePiece[] = [];
  let pieceId = 0;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const topTab = -hTabs[r][c];       // complementary to above
      const rightTab = vTabs[r][c + 1];  // outward/inward
      const bottomTab = hTabs[r + 1][c]; // outward/inward
      const leftTab = -vTabs[r][c];      // complementary to left

      const tabs = {
        top: r === 0 ? 0 : topTab,
        right: c === cols - 1 ? 0 : rightTab,
        bottom: r === rows - 1 ? 0 : bottomTab,
        left: c === 0 ? 0 : leftTab,
      };

      const targetX = c * pieceW;
      const targetY = r * pieceH;
      const isEdge = r === 0 || r === rows - 1 || c === 0 || c === cols - 1;

      // Safe padded viewBox to contain protruding tabs (tabs extend up to 26% outside)
      const pad = Math.max(pieceW, pieceH) * 0.35;
      const pathD = createPieceSvgPath(pieceW, pieceH, tabs);

      pieces.push({
        id: pieceId++,
        gridX: c,
        gridY: r,
        targetX,
        targetY,
        currentX: targetX,
        currentY: targetY,
        width: pieceW,
        height: pieceH,
        tabs,
        pathD,
        viewBox: `${-pad} ${-pad} ${pieceW + pad * 2} ${pieceH + pad * 2}`,
        isSnapped: false,
        isEdge,
        zIndex: 1,
      });
    }
  }

  return pieces;
}

/**
 * Shuffle an array randomly using Fisher-Yates algorithm
 */
export function shuffleArray<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * Checks if a dragged piece is within magnetic snap distance to its target position
 */
export function checkSnap(
  piece: PuzzlePiece,
  boardOffsetX: number,
  boardOffsetY: number,
  tolerance: number = 42
): boolean {
  const currentBoardX = piece.currentX - boardOffsetX;
  const currentBoardY = piece.currentY - boardOffsetY;
  const dist = Math.hypot(currentBoardX - piece.targetX, currentBoardY - piece.targetY);
  return dist <= tolerance;
}
