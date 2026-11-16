import type { GraphEdge, GraphNode } from '@/content/graph';

export interface Point {
  x: number;
  y: number;
  z: number;
}
/** Deterministic spring layout. Neither dates nor work duration influence position or size. */
export function graphLayout(nodes: GraphNode[], edges: GraphEdge[]): Map<string, Point> {
  const ordered = [...nodes].sort((a, b) => a.id.localeCompare(b.id));
  const points = ordered.map((node, i) => ({
    id: node.id,
    x: Math.cos(i * 2.399963) * (2 + Math.sqrt(i) * 2),
    y: Math.sin(i * 2.399963) * (2 + Math.sqrt(i) * 2),
  }));
  const index = new Map(points.map((p, i) => [p.id, i]));
  for (let step = 0; step < 450; step++) {
    const forces = points.map(() => ({ x: 0, y: 0 }));
    for (let i = 0; i < points.length; i++)
      for (let j = i + 1; j < points.length; j++) {
        const dx = points[i].x - points[j].x,
          dy = points[i].y - points[j].y;
        const d = Math.max(0.2, Math.hypot(dx, dy));
        const f = 10 / (d * d);
        forces[i].x += (dx / d) * f;
        forces[i].y += (dy / d) * f;
        forces[j].x -= (dx / d) * f;
        forces[j].y -= (dy / d) * f;
      }
    for (const edge of edges) {
      const i = index.get(edge.from),
        j = index.get(edge.to);
      if (i === undefined || j === undefined) continue;
      const dx = points[j].x - points[i].x,
        dy = points[j].y - points[i].y;
      const d = Math.max(0.2, Math.hypot(dx, dy));
      const f = (d - 4) * 0.035;
      forces[i].x += (dx / d) * f;
      forces[i].y += (dy / d) * f;
      forces[j].x -= (dx / d) * f;
      forces[j].y -= (dy / d) * f;
    }
    const temperature = 0.5 * (1 - step / 500);
    points.forEach((p, i) => {
      p.x += Math.max(-temperature, Math.min(temperature, forces[i].x - p.x * 0.008));
      p.y += Math.max(-temperature, Math.min(temperature, forces[i].y - p.y * 0.008));
    });
  }
  const maxX = Math.max(1, ...points.map((p) => Math.abs(p.x)));
  const maxY = Math.max(1, ...points.map((p) => Math.abs(p.y)));
  return new Map(
    points.map((p, i) => [p.id, { x: p.x / maxX, y: p.y / maxY, z: Math.sin(i * 1.7) * 0.7 }]),
  );
}
