// graph.js — data ng graph. format na gagamitin namin ni shane ui/algo lead
// Bawat edge ay may: from, to, capacity.  Ang flow ay HINDI dito naka-store;
// galing ito sa "steps" na ibabalik ng algorithm.

const sampleGraph = {
  nodes: [
    { id: 'S', x: 70,  y: 240 },
    { id: 'A', x: 270, y: 100 },
    { id: 'B', x: 270, y: 380 },
    { id: 'C', x: 560, y: 100 },
    { id: 'D', x: 560, y: 380 },
    { id: 'T', x: 760, y: 240 },
  ],
  edges: [
    { from: 'S', to: 'A', capacity: 10 },
    { from: 'S', to: 'B', capacity: 10 },
    { from: 'A', to: 'B', capacity: 2 },
    { from: 'A', to: 'C', capacity: 4 },
    { from: 'A', to: 'D', capacity: 8 },
    { from: 'B', to: 'D', capacity: 9 },
    { from: 'D', to: 'C', capacity: 6 },
    { from: 'C', to: 'T', capacity: 10 },
    { from: 'D', to: 'T', capacity: 10 },
  ],
};

// Susi ng edge, hal. 'S-A'. Ginagamit ito sa "flows" ng bawat step.
const edgeKey = (e) => `${e.from}-${e.to}`;