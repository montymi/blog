import type { GraphEdge, GraphNode } from '@/content/graph';

export interface Point {
  x: number;
  y: number;
  z: number;
}

/** A slight bow keeps long grid links from appearing to end at intermediate spheres. */
export function edgeControl(a: Point, b: Point): Point {
  const dx = b.x - a.x,
    dy = b.y - a.y,
    length = Math.max(0.01, Math.hypot(dx, dy));
  const bend = Math.min(0.16, length * 0.12);
  return {
    x: (a.x + b.x) / 2 - (dy / length) * bend,
    y: (a.y + b.y) / 2 + (dx / length) * bend,
    z: (a.z + b.z) / 2 - 0.8,
  };
}

/** A stable lattice, with strongly connected items placed near one another. */
export function graphLayout(nodes: GraphNode[], edges: GraphEdge[]): Map<string, Point> {
  if (!nodes.length) return new Map();
  const neighbors = new Map(nodes.map((node) => [node.id, new Set<string>()]));
  for (const edge of edges) {
    neighbors.get(edge.from)?.add(edge.to);
    neighbors.get(edge.to)?.add(edge.from);
  }
  const columns = Math.ceil(Math.sqrt(nodes.length));
  const rows = Math.ceil(nodes.length / columns);
  const slots = Array.from({ length: nodes.length }, (_, i) => ({
    x: columns === 1 ? 0 : ((i % columns) / (columns - 1)) * 2 - 1,
    y: rows === 1 ? 0 : 1 - (Math.floor(i / columns) / (rows - 1)) * 2,
  }));
  const placed = new Map<string, Point>();
  const remaining = [...nodes];
  while (remaining.length) {
    // Stable ties mean content input order never moves a sphere.
    remaining.sort((a, b) => {
      const links = (id: string) => [...neighbors.get(id)!].filter((id) => placed.has(id)).length;
      return (
        links(b.id) - links(a.id) ||
        neighbors.get(b.id)!.size - neighbors.get(a.id)!.size ||
        a.id.localeCompare(b.id)
      );
    });
    const node = remaining.shift()!;
    const connected = [...neighbors.get(node.id)!].flatMap((id) =>
      placed.has(id) ? [placed.get(id)!] : [],
    );
    const cost = (slot: { x: number; y: number }) =>
      connected.reduce((sum, p) => sum + Math.hypot(slot.x - p.x, slot.y - p.y), 0) +
      Math.hypot(slot.x, slot.y) * 0.05;
    slots.sort((a, b) => cost(a) - cost(b) || b.y - a.y || a.x - b.x);
    const slot = slots.shift()!;
    const hash = [...node.id].reduce((sum, letter) => sum + letter.charCodeAt(0), 0);
    placed.set(node.id, { ...slot, z: ((hash % 5) - 2) * 0.12 });
  }
  return placed;
}
