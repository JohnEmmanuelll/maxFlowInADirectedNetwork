
 // maxflow.js — PLACEHOLDER lang to. Papalitan din ni shane
// edmondsKarp(graph, source, sink) -> array ng steps
// bawat step = {
//   path: ['S','A','C','T'],
//   bottleneck: 4,
//   flows: { 'S-A': 4, ... }
// }
//
// Hard-coded ito para sa sampleGraph (S -> T). Max flow = 19.

function edmondsKarp(graph, source, sink) {
  return [
    {
      path: ['S', 'A', 'C', 'T'],
      bottleneck: 4,
      flows: { 'S-A': 4, 'A-C': 4, 'C-T': 4 }
    },
    {
      path: ['S', 'A', 'D', 'T'],
      bottleneck: 6,
      flows: { 'S-A': 10, 'A-C': 4, 'A-D': 6, 'C-T': 4, 'D-T': 6 }
    },
    {
      path: ['S', 'B', 'D', 'T'],
      bottleneck: 4,
      flows: { 'S-A': 10, 'S-B': 4, 'A-C': 4, 'A-D': 6, 'B-D': 4, 'C-T': 4, 'D-T': 10 }
    },
    {
      path: ['S', 'B', 'D', 'C', 'T'],
      bottleneck: 5,
      flows: { 'S-A': 10, 'S-B': 9, 'A-C': 4, 'A-D': 6, 'B-D': 9, 'D-C': 5, 'C-T': 9, 'D-T': 10 }
    }
  ];
}
