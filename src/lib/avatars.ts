// Preset avatar system — 50 geometric/abstract avatars matching the zine aesthetic
// Each avatar is an inline SVG with a unique geometric pattern

export interface PresetAvatar {
  id: string;
  name: string;
  bgColor: string;
  accentColor: string;
  svgPath: string; // SVG content for the icon/pattern
}

const COLORS = {
  orange: '#FF6B00',
  blue: '#3B82F6',
  green: '#22C55E',
  purple: '#8B5CF6',
  yellow: '#EAB308',
  black: '#0F0F0F',
  cream: '#FDFCF8',
  red: '#EF4444',
  pink: '#EC4899',
  cyan: '#06B6D4',
  white: '#FFFFFF',
};

// Generate avatars programmatically using simple geometric SVG patterns
function createAvatar(
  id: string,
  name: string,
  bgColor: string,
  accentColor: string,
  svgContent: string
): PresetAvatar {
  return {
    id,
    name,
    bgColor,
    accentColor,
    svgPath: svgContent,
  };
}

// --- SVG shape generators ---
const shapes = {
  triangle: (color: string) =>
    `<polygon points="50,15 85,80 15,80" fill="${color}" stroke="#000" stroke-width="3"/>`,
  circle: (color: string) =>
    `<circle cx="50" cy="50" r="30" fill="${color}" stroke="#000" stroke-width="3"/>`,
  square: (color: string) =>
    `<rect x="20" y="20" width="60" height="60" fill="${color}" stroke="#000" stroke-width="3"/>`,
  diamond: (color: string) =>
    `<polygon points="50,10 90,50 50,90 10,50" fill="${color}" stroke="#000" stroke-width="3"/>`,
  cross: (color: string) =>
    `<rect x="35" y="15" width="30" height="70" fill="${color}" stroke="#000" stroke-width="3"/><rect x="15" y="35" width="70" height="30" fill="${color}" stroke="#000" stroke-width="3"/>`,
  star: (color: string) =>
    `<polygon points="50,5 61,35 95,35 68,57 79,90 50,70 21,90 32,57 5,35 39,35" fill="${color}" stroke="#000" stroke-width="2"/>`,
  hexagon: (color: string) =>
    `<polygon points="50,10 87,30 87,70 50,90 13,70 13,30" fill="${color}" stroke="#000" stroke-width="3"/>`,
  bars: (color: string) =>
    `<rect x="15" y="20" width="15" height="60" fill="${color}" stroke="#000" stroke-width="2"/><rect x="42" y="30" width="15" height="50" fill="${color}" stroke="#000" stroke-width="2"/><rect x="69" y="15" width="15" height="65" fill="${color}" stroke="#000" stroke-width="2"/>`,
  rings: (color: string) =>
    `<circle cx="50" cy="50" r="35" fill="none" stroke="${color}" stroke-width="5"/><circle cx="50" cy="50" r="20" fill="none" stroke="${color}" stroke-width="5"/>`,
  zigzag: (color: string) =>
    `<polyline points="10,70 30,30 50,70 70,30 90,70" fill="none" stroke="${color}" stroke-width="5" stroke-linecap="round"/>`,
  dots: (color: string) =>
    `<circle cx="25" cy="25" r="8" fill="${color}"/><circle cx="50" cy="25" r="8" fill="${color}"/><circle cx="75" cy="25" r="8" fill="${color}"/><circle cx="37" cy="50" r="8" fill="${color}"/><circle cx="63" cy="50" r="8" fill="${color}"/><circle cx="50" cy="75" r="8" fill="${color}"/>`,
  halfSplit: (color: string) =>
    `<rect x="0" y="0" width="50" height="100" fill="${color}"/><rect x="50" y="0" width="50" height="100" fill="#000"/>`,
  concentricSquares: (color: string) =>
    `<rect x="10" y="10" width="80" height="80" fill="none" stroke="${color}" stroke-width="4"/><rect x="25" y="25" width="50" height="50" fill="none" stroke="${color}" stroke-width="4"/><rect x="40" y="40" width="20" height="20" fill="${color}"/>`,
  diagonalStripes: (color: string) =>
    `<line x1="0" y1="0" x2="100" y2="100" stroke="${color}" stroke-width="8"/><line x1="25" y1="0" x2="100" y2="75" stroke="${color}" stroke-width="6"/><line x1="0" y1="25" x2="75" y2="100" stroke="${color}" stroke-width="6"/>`,
  eye: (color: string) =>
    `<ellipse cx="50" cy="50" rx="35" ry="20" fill="none" stroke="${color}" stroke-width="4"/><circle cx="50" cy="50" r="10" fill="${color}"/>`,
};

// Generate all 50 avatars
export const presetAvatars: PresetAvatar[] = [
  // --- Triangles (5) ---
  createAvatar('av-01', 'Fire Peak', COLORS.orange, COLORS.black, shapes.triangle(COLORS.orange)),
  createAvatar('av-02', 'Ocean Peak', COLORS.blue, COLORS.black, shapes.triangle(COLORS.blue)),
  createAvatar('av-03', 'Forest Peak', COLORS.green, COLORS.black, shapes.triangle(COLORS.green)),
  createAvatar('av-04', 'Mystic Peak', COLORS.purple, COLORS.black, shapes.triangle(COLORS.purple)),
  createAvatar('av-05', 'Golden Peak', COLORS.yellow, COLORS.black, shapes.triangle(COLORS.yellow)),

  // --- Circles (5) ---
  createAvatar('av-06', 'Solar', COLORS.orange, COLORS.black, shapes.circle(COLORS.orange)),
  createAvatar('av-07', 'Lunar', COLORS.blue, COLORS.white, shapes.circle(COLORS.blue)),
  createAvatar('av-08', 'Terra', COLORS.green, COLORS.black, shapes.circle(COLORS.green)),
  createAvatar('av-09', 'Nebula', COLORS.purple, COLORS.white, shapes.circle(COLORS.purple)),
  createAvatar('av-10', 'Aurora', COLORS.cyan, COLORS.black, shapes.circle(COLORS.cyan)),

  // --- Squares (5) ---
  createAvatar('av-11', 'Block Alpha', COLORS.orange, COLORS.black, shapes.square(COLORS.orange)),
  createAvatar('av-12', 'Block Beta', COLORS.blue, COLORS.black, shapes.square(COLORS.blue)),
  createAvatar('av-13', 'Block Gamma', COLORS.green, COLORS.black, shapes.square(COLORS.green)),
  createAvatar('av-14', 'Block Delta', COLORS.red, COLORS.black, shapes.square(COLORS.red)),
  createAvatar('av-15', 'Block Sigma', COLORS.pink, COLORS.black, shapes.square(COLORS.pink)),

  // --- Diamonds (5) ---
  createAvatar('av-16', 'Prism Fire', COLORS.orange, COLORS.black, shapes.diamond(COLORS.orange)),
  createAvatar('av-17', 'Prism Ice', COLORS.blue, COLORS.black, shapes.diamond(COLORS.blue)),
  createAvatar('av-18', 'Prism Leaf', COLORS.green, COLORS.black, shapes.diamond(COLORS.green)),
  createAvatar('av-19', 'Prism Amethyst', COLORS.purple, COLORS.black, shapes.diamond(COLORS.purple)),
  createAvatar('av-20', 'Prism Sun', COLORS.yellow, COLORS.black, shapes.diamond(COLORS.yellow)),

  // --- Crosses (5) ---
  createAvatar('av-21', 'Cross Fire', COLORS.orange, COLORS.black, shapes.cross(COLORS.orange)),
  createAvatar('av-22', 'Cross Ocean', COLORS.blue, COLORS.black, shapes.cross(COLORS.blue)),
  createAvatar('av-23', 'Cross Forest', COLORS.green, COLORS.black, shapes.cross(COLORS.green)),
  createAvatar('av-24', 'Cross Night', COLORS.purple, COLORS.black, shapes.cross(COLORS.purple)),
  createAvatar('av-25', 'Cross Frost', COLORS.cyan, COLORS.black, shapes.cross(COLORS.cyan)),

  // --- Stars (5) ---
  createAvatar('av-26', 'Star Blaze', COLORS.orange, COLORS.black, shapes.star(COLORS.orange)),
  createAvatar('av-27', 'Star Storm', COLORS.blue, COLORS.black, shapes.star(COLORS.blue)),
  createAvatar('av-28', 'Star Jade', COLORS.green, COLORS.black, shapes.star(COLORS.green)),
  createAvatar('av-29', 'Star Royal', COLORS.purple, COLORS.black, shapes.star(COLORS.purple)),
  createAvatar('av-30', 'Star Gold', COLORS.yellow, COLORS.black, shapes.star(COLORS.yellow)),

  // --- Hexagons (5) ---
  createAvatar('av-31', 'Hex Flame', COLORS.orange, COLORS.black, shapes.hexagon(COLORS.orange)),
  createAvatar('av-32', 'Hex Wave', COLORS.blue, COLORS.black, shapes.hexagon(COLORS.blue)),
  createAvatar('av-33', 'Hex Moss', COLORS.green, COLORS.black, shapes.hexagon(COLORS.green)),
  createAvatar('av-34', 'Hex Violet', COLORS.purple, COLORS.black, shapes.hexagon(COLORS.purple)),
  createAvatar('av-35', 'Hex Rose', COLORS.pink, COLORS.black, shapes.hexagon(COLORS.pink)),

  // --- Complex patterns (15) ---
  createAvatar('av-36', 'Frequency', COLORS.orange, COLORS.black, shapes.bars(COLORS.orange)),
  createAvatar('av-37', 'Signal', COLORS.blue, COLORS.black, shapes.bars(COLORS.blue)),
  createAvatar('av-38', 'Sonar', COLORS.orange, COLORS.black, shapes.rings(COLORS.orange)),
  createAvatar('av-39', 'Ripple', COLORS.blue, COLORS.black, shapes.rings(COLORS.blue)),
  createAvatar('av-40', 'Seismic', COLORS.green, COLORS.black, shapes.zigzag(COLORS.green)),
  createAvatar('av-41', 'Voltage', COLORS.yellow, COLORS.black, shapes.zigzag(COLORS.yellow)),
  createAvatar('av-42', 'Cluster', COLORS.orange, COLORS.black, shapes.dots(COLORS.orange)),
  createAvatar('av-43', 'Constellation', COLORS.blue, COLORS.white, shapes.dots(COLORS.blue)),
  createAvatar('av-44', 'Duality', COLORS.orange, COLORS.black, shapes.halfSplit(COLORS.orange)),
  createAvatar('av-45', 'Polarity', COLORS.blue, COLORS.black, shapes.halfSplit(COLORS.blue)),
  createAvatar('av-46', 'Recursion', COLORS.orange, COLORS.black, shapes.concentricSquares(COLORS.orange)),
  createAvatar('av-47', 'Depth', COLORS.purple, COLORS.black, shapes.concentricSquares(COLORS.purple)),
  createAvatar('av-48', 'Slash', COLORS.red, COLORS.black, shapes.diagonalStripes(COLORS.red)),
  createAvatar('av-49', 'Vision', COLORS.orange, COLORS.black, shapes.eye(COLORS.orange)),
  createAvatar('av-50', 'Insight', COLORS.cyan, COLORS.black, shapes.eye(COLORS.cyan)),
];

// Helper: render a preset avatar as an inline SVG string
export function getAvatarSvg(avatarId: string): string {
  const avatar = presetAvatars.find((a) => a.id === avatarId);
  if (!avatar) return '';
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100"><rect width="100" height="100" fill="${avatar.bgColor}" rx="4"/>${avatar.svgPath}</svg>`;
}

// Helper: get avatar by ID
export function getAvatar(avatarId: string): PresetAvatar | undefined {
  return presetAvatars.find((a) => a.id === avatarId);
}
