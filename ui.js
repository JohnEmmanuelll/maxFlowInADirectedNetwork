// ui.js — drawing at buttons (UI Lead).
const SVG_NS = 'http://www.w3.org/2000/svg';
const SOURCE = 'S', SINK = 'T';
const R = 24;                                   // radius ng node

const svg = document.getElementById('graph');
const stepList = document.getElementById('stepList');
const flowTotal = document.getElementById('flowTotal');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');

const nodeById = Object.fromEntries(sampleGraph.nodes.map((n) => [n.id, n]));
const steps = edmondsKarp(sampleGraph, SOURCE, SINK);
let current = 0;                                // 0 = di pa nagsisimula, 1..n = step number

// Gumawa ng SVG element
function el(name, attrs = {}, text) {
  const e = document.createElementNS(SVG_NS, name);
  for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, v);
  if (text !== undefined) e.textContent = text;
  return e;
}

// Kapal ng pipe: mas malaki ang value, mas makapal
const thickness = (v) => 2 + v * 0.9;

// Hugis ng edge. Kapag may kabilang direksyon (A->B at B->A), kurbado para hindi mag-overlap.
function edgeShape(e) {
  const a = nodeById[e.from], b = nodeById[e.to];
  const hasReverse = sampleGraph.edges.some((o) => o.from === e.to && o.to === e.from);
  const dx = b.x - a.x, dy = b.y - a.y, len = Math.hypot(dx, dy);
  const off = hasReverse ? 40 : 0;
  const cx = (a.x + b.x) / 2 + (-dy / len) * off;   // control point
  const cy = (a.y + b.y) / 2 + (dx / len) * off;
  const trim = (p) => {                              // umpisa/dulo sa gilid ng node, hindi sa gitna
    const d = Math.hypot(cx - p.x, cy - p.y);
    return { x: p.x + ((cx - p.x) / d) * R, y: p.y + ((cy - p.y) / d) * R };
  };
  const s = trim(a);
  const t = (() => {                                 // dulo: galing sa b papunta sa control point
    const d = Math.hypot(cx - b.x, cy - b.y);
    return { x: b.x + ((cx - b.x) / d) * R, y: b.y + ((cy - b.y) / d) * R };
  })();
  return {
    d: `M${s.x},${s.y} Q${cx},${cy} ${t.x},${t.y}`,
    lx: 0.25 * s.x + 0.5 * cx + 0.25 * t.x,           // gitna ng curve para sa label
    ly: 0.25 * s.y + 0.5 * cy + 0.25 * t.y,
  };
}

function render() {
  const step = current > 0 ? steps[current - 1] : null;
  const flows = step ? step.flows : {};
  const onPath = new Set();
  if (step) for (let i = 0; i < step.path.length - 1; i++) onPath.add(`${step.path[i]}-${step.path[i + 1]}`);

  svg.querySelectorAll('.layer').forEach((n) => n.remove());
  const layer = el('g', { class: 'layer' });

  for (const e of sampleGraph.edges) {
    const key = edgeKey(e);
    const f = flows[key] || 0;
    const state = onPath.has(key) ? 'active' : f > 0 && f === e.capacity ? 'full' : '';
    const g = edgeShape(e);
    layer.append(el('path', { d: g.d, class: 'pipe', 'stroke-width': thickness(e.capacity), 'marker-end': 'url(#arrow)' }));
    if (f > 0) layer.append(el('path', { d: g.d, class: `water ${state}`, 'stroke-width': thickness(f) }));
    layer.append(el('text', { x: g.lx, y: g.ly, class: 'label', 'text-anchor': 'middle', 'dominant-baseline': 'central' }, `${f}/${e.capacity}`));
  }

  for (const n of sampleGraph.nodes) {
    const end = n.id === SOURCE || n.id === SINK ? ' end' : '';
    layer.append(
      el('circle', { cx: n.x, cy: n.y, r: R, class: `node${end}` }),
      el('text', { x: n.x, y: n.y, class: `node-label${end}`, 'text-anchor': 'middle', 'dominant-baseline': 'central' }, n.id)
    );
  }
  svg.append(layer);

  // Side panel
  stepList.innerHTML = '';
  steps.forEach((s, i) => {
    const li = document.createElement('li');
    li.textContent = `${s.path.join(' → ')}  (+${s.bottleneck})`;
    li.className = i + 1 === current ? 'now' : i + 1 < current ? 'done' : '';
    stepList.append(li);
  });
  flowTotal.textContent = steps.slice(0, current).reduce((sum, s) => sum + s.bottleneck, 0);
  prevBtn.disabled = current === 0;
  nextBtn.disabled = current === steps.length;
}

prevBtn.addEventListener('click', () => { current--; render(); });
nextBtn.addEventListener('click', () => { current++; render(); });
document.getElementById('reset').addEventListener('click', () => { current = 0; render(); });

render();