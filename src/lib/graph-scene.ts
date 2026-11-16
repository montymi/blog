/** Loaded only by the visual explorer; command-line queries never import Three.js. */
import * as THREE from 'three';

import type { GraphEdge, GraphNode } from '@/content/graph';
import { edgeControl, type Point } from './graph-layout';

export interface SceneState {
  selected: string | null;
  focus: Set<string> | null;
}
export function createGraphScene(
  host: HTMLElement,
  labels: Map<string, HTMLButtonElement>,
  nodes: GraphNode[],
  edges: GraphEdge[],
  points: Map<string, Point>,
  onHover: (id: string | null) => void,
  onOpen: (id: string) => void,
) {
  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.domElement.setAttribute('aria-hidden', 'true');
  renderer.domElement.className = 'absolute inset-0 h-full w-full';
  host.prepend(renderer.domElement);
  const scene = new THREE.Scene();
  const group = new THREE.Group();
  scene.add(group);
  const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 200);
  const materials: THREE.Material[] = [];
  const geometries: THREE.BufferGeometry[] = [];
  const meshes = new Map<string, THREE.Mesh>();
  const lines: { edge: GraphEdge; line: THREE.Line }[] = [];
  const sphere = new THREE.SphereGeometry(1, 12, 8);
  geometries.push(sphere);
  for (const node of nodes) {
    const material = new THREE.MeshBasicMaterial({ transparent: true });
    materials.push(material);
    const mesh = new THREE.Mesh(sphere, material);
    mesh.userData.id = node.id;
    meshes.set(node.id, mesh);
    group.add(mesh);
  }
  const ringCanvas = document.createElement('canvas');
  ringCanvas.width = 64;
  ringCanvas.height = 64;
  const ink = ringCanvas.getContext('2d')!;
  ink.strokeStyle = '#fff';
  ink.lineWidth = 2;
  ink.beginPath();
  ink.arc(32, 32, 23, 0, Math.PI * 2);
  ink.stroke();
  const ringTexture = new THREE.CanvasTexture(ringCanvas);
  const ringMaterial = new THREE.SpriteMaterial({
    map: ringTexture,
    transparent: true,
    depthTest: false,
  });
  materials.push(ringMaterial);
  const ring = new THREE.Sprite(ringMaterial);
  ring.visible = false;
  ring.renderOrder = 2;
  group.add(ring);
  const uniqueEdges = new Map(edges.map((e) => [[e.from, e.to].sort().join('|'), e]));
  for (const edge of uniqueEdges.values()) {
    const geometry = new THREE.BufferGeometry().setFromPoints(
      Array.from({ length: 25 }, () => new THREE.Vector3()),
    );
    const material = new THREE.LineBasicMaterial({ transparent: true });
    geometries.push(geometry);
    materials.push(material);
    const line = new THREE.Line(geometry, material);
    group.add(line);
    lines.push({ edge, line });
  }
  let state: SceneState = { selected: null, focus: null };
  let width = 1,
    height = 1,
    worldHeight = 24,
    radius = 10,
    frame = 0,
    remaining = 0,
    disposed = false;
  let targetX = 0,
    targetY = 0;
  let yaw = 0,
    pitch = 0,
    suppressClick = false;
  let drag: {
    x: number;
    y: number;
    yaw: number;
    pitch: number;
    touch: boolean;
    moved: boolean;
  } | null = null;
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const projected = new THREE.Vector3();
  function colors() {
    const css = getComputedStyle(host);
    const color = (token: string) =>
      new THREE.Color(`rgb(${css.getPropertyValue(`--c-${token}`).trim().split(/\s+/).join(',')})`);
    return {
      ink: color('ink'),
      accent: color('accent'),
      line: color('line-strong'),
    };
  }
  function restyle() {
    const palette = colors();
    for (const node of nodes) {
      const mesh = meshes.get(node.id)!;
      const material = mesh.material as THREE.MeshBasicMaterial;
      material.color.copy(node.id === state.selected ? palette.accent : palette.ink);
      material.opacity = !state.focus || state.focus.has(node.id) ? 1 : 0.18;
      mesh.scale.setScalar((32 / width) * (node.id === state.selected ? 5.5 : 3.5));
    }
    ring.visible = Boolean(state.selected);
    if (state.selected) {
      ring.position.copy(meshes.get(state.selected)!.position);
      ring.scale.setScalar((32 / width) * 30);
      ringMaterial.color.copy(palette.accent);
    }

    for (const { edge, line } of lines) {
      const material = line.material as THREE.LineBasicMaterial;
      const lit = state.focus?.has(edge.from) && state.focus.has(edge.to);
      material.color.copy(lit ? palette.accent : palette.line);
      const direct = !edge.label.startsWith('shared') && !edge.label.startsWith('published');
      const incident = edge.from === state.selected || edge.to === state.selected;
      material.opacity = !state.focus
        ? direct
          ? 0.48
          : 0.25
        : lit
          ? incident
            ? 0.9
            : 0.4
          : 0.05;
    }
  }
  function draw() {
    frame = 0;
    if (disposed) return;
    const easing = motion.matches ? 1 : 0.12;
    group.rotation.y += (targetX - group.rotation.y) * easing;
    group.rotation.x += (targetY - group.rotation.x) * easing;
    group.updateMatrixWorld(true);
    for (const node of nodes) {
      const mesh = meshes.get(node.id)!;
      mesh.getWorldPosition(projected);
      (mesh.material as THREE.MeshBasicMaterial).opacity =
        (!state.focus || state.focus.has(node.id) ? 1 : 0.22) *
        (0.65 + (0.35 * (projected.z / radius + 1)) / 2);
      projected.project(camera);
      const label = labels.get(node.id);
      if (label) {
        label.style.left = `${((projected.x + 1) * width) / 2}px`;
        label.style.top = `${((-projected.y + 1) * height) / 2}px`;
      }
    }
    renderer.render(scene, camera);
    if (--remaining > 0 && !motion.matches) frame = requestAnimationFrame(draw);
  }
  function invalidate() {
    remaining = 35;
    if (!frame) frame = requestAnimationFrame(draw);
  }
  function resize() {
    width = host.clientWidth;
    height = host.clientHeight;
    if (!width || !height) return;
    const aspect = width / height;
    worldHeight = 32 / aspect;
    camera.aspect = aspect;
    camera.position.set(0, 0, worldHeight / (2 * Math.tan(THREE.MathUtils.degToRad(19))));
    camera.updateProjectionMatrix();
    camera.updateMatrixWorld();
    radius = Math.min(12, worldHeight / 2 - 3);
    renderer.setSize(width, height);
    for (const node of nodes) {
      const p = points.get(node.id)!;
      meshes.get(node.id)!.position.set(p.x * radius, p.y * radius, p.z * radius);
    }
    for (const { edge, line } of lines) {
      const a = meshes.get(edge.from)!.position,
        b = meshes.get(edge.to)!.position;
      const control = edgeControl(points.get(edge.from)!, points.get(edge.to)!);
      const curve = new THREE.QuadraticBezierCurve3(
        a,
        new THREE.Vector3(control.x * radius, control.y * radius, control.z * radius),
        b,
      );
      const positions = line.geometry.getAttribute('position') as THREE.BufferAttribute;
      curve.getPoints(24).forEach((p, i) => positions.setXYZ(i, p.x, p.y, p.z));
      positions.needsUpdate = true;
      line.geometry.computeBoundingSphere();
    }
    restyle();
    invalidate();
  }
  const raycaster = new THREE.Raycaster();
  const cursor = new THREE.Vector2();
  function hit(event: MouseEvent | PointerEvent) {
    const rect = host.getBoundingClientRect();
    cursor.set(
      ((event.clientX - rect.left) / width) * 2 - 1,
      -((event.clientY - rect.top) / height) * 2 + 1,
    );
    raycaster.setFromCamera(cursor, camera);
    const intersection = raycaster.intersectObjects([...meshes.values()], false)[0];
    if (intersection) return intersection.object.userData.id as string;
    // Keep small spheres easy to tap: resolve the nearest center in a 44px target.
    let closest: string | undefined;
    let distance = 22;
    for (const [id, mesh] of meshes) {
      mesh.getWorldPosition(projected);
      projected.project(camera);
      const d = Math.hypot(
        ((projected.x + 1) * width) / 2 - (event.clientX - rect.left),
        ((-projected.y + 1) * height) / 2 - (event.clientY - rect.top),
      );
      if (d < distance) {
        closest = id;
        distance = d;
      }
    }
    return closest;
  }
  function open(event: MouseEvent) {
    if ((event.target as HTMLElement).closest('button')) return;
    if (suppressClick) {
      suppressClick = false;
      return;
    }
    const id = hit(event);
    if (id) onOpen(id);
  }
  function pointer(event: PointerEvent) {
    if (drag) {
      const dx = event.clientX - drag.x,
        dy = event.clientY - drag.y;
      if (Math.hypot(dx, dy) > 5) drag.moved = true;
      if (drag.moved) {
        targetX = drag.yaw + dx * 0.008;
        targetY = Math.max(-1.3, Math.min(1.3, drag.pitch + (drag.touch ? 0 : dy * 0.008)));
        onHover(null);
        invalidate();
      }
      return;
    }
    const id = hit(event);
    onHover(id ?? null);
    host.style.cursor = id ? 'pointer' : 'grab';
    if (motion.matches || event.pointerType === 'touch') return;
    const rect = host.getBoundingClientRect();
    targetX = yaw + ((event.clientX - rect.left) / width - 0.5) * 0.1;
    targetY = pitch + ((event.clientY - rect.top) / height - 0.5) * 0.06;
    invalidate();
  }
  function startDrag(event: PointerEvent) {
    if (event.button !== 0) return;
    suppressClick = false;
    drag = {
      x: event.clientX,
      y: event.clientY,
      yaw,
      pitch,
      touch: event.pointerType === 'touch',
      moved: false,
    };
    host.setPointerCapture(event.pointerId);
  }
  function endDrag(event: PointerEvent) {
    if (!drag) return;
    suppressClick = drag.moved;
    yaw = targetX;
    pitch = targetY;
    drag = null;
    if (host.hasPointerCapture(event.pointerId)) host.releasePointerCapture(event.pointerId);
  }
  function reset() {
    if (drag) return;
    targetX = yaw;
    targetY = pitch;
    onHover(null);
    host.style.cursor = '';
    invalidate();
  }
  const observer = new ResizeObserver(resize);
  observer.observe(host);
  const theme = new MutationObserver(() => {
    restyle();
    invalidate();
  });
  theme.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-theme', 'class', 'style'],
  });
  host.addEventListener('pointermove', pointer);
  host.addEventListener('pointerdown', startDrag);
  host.addEventListener('pointerup', endDrag);
  host.addEventListener('pointercancel', endDrag);
  host.addEventListener('pointerleave', reset);
  motion.addEventListener('change', reset);
  const dark = window.matchMedia('(prefers-color-scheme: dark)');
  const recolor = () => {
    restyle();
    invalidate();
  };
  dark.addEventListener('change', recolor);
  host.addEventListener('click', open);
  restyle();
  resize();
  return {
    update(next: SceneState) {
      state = next;
      restyle();
      invalidate();
    },
    dispose() {
      disposed = true;
      cancelAnimationFrame(frame);
      observer.disconnect();
      theme.disconnect();
      host.removeEventListener('pointermove', pointer);
      host.removeEventListener('pointerdown', startDrag);
      host.removeEventListener('pointerup', endDrag);
      host.removeEventListener('pointercancel', endDrag);
      host.removeEventListener('pointerleave', reset);
      motion.removeEventListener('change', reset);
      dark.removeEventListener('change', recolor);
      host.removeEventListener('click', open);
      geometries.forEach((g) => g.dispose());
      materials.forEach((m) => m.dispose());
      ringTexture.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
      renderer.domElement.remove();
    },
  };
}
