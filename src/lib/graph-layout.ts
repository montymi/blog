import type { GraphEdge, GraphNode } from '@/content/graph';

export interface Point {
  x: number;
  y: number;
  z: number;
}

/** Links bend gently inward through the constellation. */
export function edgeControl(a: Point, b: Point): Point {
  return { x: (a.x + b.x) * 0.42, y: (a.y + b.y) * 0.42, z: (a.z + b.z) * 0.42 };
}

/** Evenly spaced positions on a globe, with connected work placed nearby. */
export function graphLayout(nodes: GraphNode[], edges: GraphEdge[]): Map<string, Point> {
  if (!nodes.length) return new Map();
  const neighbors = new Map(nodes.map((node) => [node.id, new Set<string>()]));
  for (const edge of edges) {
    neighbors.get(edge.from)?.add(edge.to);
    neighbors.get(edge.to)?.add(edge.from);
  }
  const slots = nodes.map((_, i) => {
    const y = 1 - ((i + 0.5) / nodes.length) * 2;
    const radius = Math.sqrt(1 - y * y);
    const angle = i * Math.PI * (3 - Math.sqrt(5));
    return { x: Math.cos(angle) * radius, y, z: Math.sin(angle) * radius };
  });
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
    const cost = (slot: Point) =>
      connected.reduce((sum, p) => sum + Math.hypot(slot.x - p.x, slot.y - p.y, slot.z - p.z), 0) +
      (1 - slot.z) * 0.05;
    slots.sort((a, b) => cost(a) - cost(b) || b.y - a.y || a.x - b.x);
    const slot = slots.shift()!;
    placed.set(node.id, slot);
  }
  return placed;
}
