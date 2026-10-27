
const SVG_NS = 'http://www.w3.org/2000/svg';
const SOURCE = 'S';
const SINK = 'T';
const R = 24;

const svg = document.getElementById('graph');
const stepList = document.getElementById('stepList');
const flowTotal = document.getElementById('flowTotal');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');
const resetBtn = document.getElementById('reset');

const nodeById = Object.fromEntries(
  sampleGraph.nodes.map((n) => [n.id, n])
);

const steps = edmondsKarp(sampleGraph, SOURCE, SINK);
let current = 0;

// Gumawa ng SVG element
function el(name, attrs = {}, text) {
  const element = document.createElementNS(SVG_NS, name);

  for (const [key, value] of Object.entries(attrs)) {
    element.setAttribute(key, value);
  }

  if (text !== undefined) {
    element.textContent = text;
  }

  return element;
}

// Kapal ng pipe depende sa capacity o flow
const thickness = (value) => 2 + value * 0.9;

// Gumuhit ng edge at ilagay ang label sa gitna
function edgeShape(edge) {
  const a = nodeById[edge.from];
  const b = nodeById[edge.to];

  const hasReverse = sampleGraph.edges.some(
    (other) => other.from === edge.to && other.to === edge.from
  );

  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const length = Math.hypot(dx, dy);

  const offset = hasReverse ? 40 : 0;
  const cx = (a.x + b.x) / 2 + (-dy / length) * offset;
  const cy = (a.y + b.y) / 2 + (dx / length) * offset;

  const trim = (point) => {
    const distance = Math.hypot(cx - point.x, cy - point.y);

    return {
      x: point.x + ((cx - point.x) / distance) * R,
      y: point.y + ((cy - point.y) / distance) * R
    };
  };

  const start = trim(a);

  const end = (() => {
    const distance = Math.hypot(cx - b.x, cy - b.y);

    return {
      x: b.x + ((cx - b.x) / distance) * R,
      y: b.y + ((cy - b.y) / distance) * R
    };
  })();

  return {
    d: `M${start.x},${start.y} Q${cx},${cy} ${end.x},${end.y}`,
    lx: 0.25 * start.x + 0.5 * cx + 0.25 * end.x,
    ly: 0.25 * start.y + 0.5 * cy + 0.25 * end.y
  };
}

function render() {
  const step = current > 0 ? steps[current - 1] : null;
  const flows = step ? step.flows : {};
  const onPath = new Set();

  if (step) {
    for (let i = 0; i < step.path.length - 1; i++) {
      onPath.add(`${step.path[i]}-${step.path[i + 1]}`);
    }
  }

  svg.querySelectorAll('.layer').forEach((layer) => layer.remove());

  const layer = el('g', { class: 'layer' });

  // Iguhit ang mga edge
  for (const edge of sampleGraph.edges) {
    const key = edgeKey(edge);
    const flow = flows[key] || 0;

    const state = onPath.has(key)
      ? 'active'
      : flow > 0 && flow === edge.capacity
        ? 'full'
        : '';

    const shape = edgeShape(edge);

    layer.append(
      el('path', {
        d: shape.d,
        class: 'pipe',
        'stroke-width': thickness(edge.capacity),
        'marker-end': 'url(#arrow)'
      })
    );

    if (flow > 0) {
      layer.append(
        el('path', {
          d: shape.d,
          class: `water ${state}`,
          'stroke-width': thickness(flow)
        })
      );
    }

    layer.append(
      el(
        'text',
        {
          x: shape.lx,
          y: shape.ly,
          class: 'label',
          'text-anchor': 'middle',
          'dominant-baseline': 'central'
        },
        `${flow}/${edge.capacity}`
      )
    );
  }

  // Iguhit ang mga node
  for (const node of sampleGraph.nodes) {
    const end =
      node.id === SOURCE || node.id === SINK ? ' end' : '';

    layer.append(
      el('circle', {
        cx: node.x,
        cy: node.y,
        r: R,
        class: `node${end}`
      }),
      el(
        'text',
        {
          x: node.x,
          y: node.y,
          class: `node-label${end}`,
          'text-anchor': 'middle',
          'dominant-baseline': 'central'
        },
        node.id
      )
    );
  }

  svg.append(layer);

  // I-update ang listahan ng augmenting paths
  stepList.innerHTML = '';

  steps.forEach((item, index) => {
    const listItem = document.createElement('li');

    listItem.textContent =
      `${item.path.join(' → ')}  (+${item.bottleneck})`;

    listItem.className =
      index + 1 === current
        ? 'now'
        : index + 1 < current
          ? 'done'
          : '';

    stepList.append(listItem);
  });

  // I-update ang total flow at buttons
  flowTotal.textContent = steps
    .slice(0, current)
    .reduce((sum, item) => sum + item.bottleneck, 0);

  prevBtn.disabled = current === 0;
  nextBtn.disabled = current === steps.length;
}

// Previous button
prevBtn.addEventListener('click', () => {
  if (current > 0) {
    current--;
    render();
  }
});

// Next button
nextBtn.addEventListener('click', () => {
  if (current < steps.length) {
    current++;
    render();
  }
});

// Reset button
resetBtn.addEventListener('click', () => {
  current = 0;
  render();
});

render();
