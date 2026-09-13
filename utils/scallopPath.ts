/**
 * Generates an SVG path for a smooth scalloped flower shape.
 * @param lobes Number of lobes/petals (e.g. 12 for Material You clock badge)
 * @param rMin Inner radius (valleys)
 * @param rMax Outer radius (peaks)
 * @param cx Center X
 * @param cy Center Y
 */
export function getScallopPath(
  lobes: number = 12,
  rMin: number = 38,
  rMax: number = 48,
  cx: number = 50,
  cy: number = 50
): string {
  const points: { x: number; y: number }[] = [];
  const totalPoints = lobes * 2;
  const angleStep = (Math.PI * 2) / totalPoints;

  for (let i = 0; i < totalPoints; i++) {
    const angle = i * angleStep - Math.PI / 2;
    const r = i % 2 === 0 ? rMax : rMin;
    points.push({
      x: cx + r * Math.cos(angle),
      y: cy + r * Math.sin(angle),
    });
  }

  // Generate smooth cubic bezier curve through all points
  let path = `M ${points[0].x.toFixed(2)} ${points[0].y.toFixed(2)}`;
  const len = points.length;

  for (let i = 0; i < len; i++) {
    const p0 = points[(i - 1 + len) % len];
    const p1 = points[i];
    const p2 = points[(i + 1) % len];
    const p3 = points[(i + 2) % len];

    // Catmull-Rom to Cubic Bezier control points
    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;

    path += ` C ${cp1x.toFixed(2)} ${cp1y.toFixed(2)}, ${cp2x.toFixed(2)} ${cp2y.toFixed(2)}, ${p2.x.toFixed(2)} ${p2.y.toFixed(2)}`;
  }

  path += ' Z';
  return path;
}
