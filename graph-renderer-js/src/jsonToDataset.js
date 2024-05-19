import { DataSet } from "vis-data";

function createLayout(graph) {
  const layout = {}
  const keys = Object.keys(graph)
  const baseLength = keys[0].split("/").length
  
  let currLevel = 0
  let currCount = -1
  keys.forEach(item => {
      let level = item.split("/").length - baseLength
      if (currLevel !== level) {
           currCount = 0
           currLevel = level
      }
      else currCount += 1
      layout[item] = {
          level: level,
          count: currCount
      }
  })

  return layout
}

function circularCustomLayout(graph) {
  const layout = createLayout(graph)
  const keys = Object.keys(graph)
  const offset = {x: 0, y: 0}
  const baseRadius = 50
  const baseOffsetRadius = 50
  const baseLength = keys[0].split("/").length
  const angle = 2 * Math.PI / keys.length

  keys.forEach((key, idx) => {
      let numNodes = graph[key].length * baseOffsetRadius
      let newradius = baseRadius * (key.split("/").length - baseLength) + numNodes
      const x = offset.x + newradius * Math.cos(angle * idx)
      const y = offset.y + newradius * Math.sin(angle * idx)
      layout[key].x = x
      layout[key].y = y
      idx += 1
  })

  return layout
}


/**
 * Extracts all unique items from an object.
 * 
 * @param {Object} data - The input object.
 * @returns {Set} - A Set of unique elements.
 */
function getAllUniqueNodes(data) {
  let uniqueNodes = new Set();
  let keys = Object.keys(data);
  keys.forEach((item) => uniqueNodes.add(item));
  keys.forEach((key) => {
    data[key].forEach((item) => uniqueNodes.add(item));
  });

  return uniqueNodes;
}

/**
 * Converts an adjacency list graph representation to vis DataSet()
 * @param {Object} data - Adjacency list object
 * @param {string|null} removePrefix - Prefix to be removed from node labels (optional)
 * @param {boolean} includeInstalledPackages - Flag to include installed packages (default: true)
 * @returns {Object} - Object containing nodes and edges
 */
export function jsonToDataset(data, removePrefix = null, includeInstalledPackages=true, verticalGap=100, horizontalGap=100) {
  let unique_nodes = getAllUniqueNodes(data);

  // CUSTOM LAYOUT
  // let layout = createLayout(data)
  // let offset = {x: 0, y: 0}
  
  // CIRCULAR LAYOUT
  let layout = circularCustomLayout(data)

  let keys = new Set(Object.keys(data));
  let lookup_nodes = new Map();
  let nodes = [];
  let edges = [];
  let idx = 0;

  unique_nodes.forEach((item) => {
    let label = item
    if (removePrefix) 
      label = item.replace(removePrefix, "");

    if (!includeInstalledPackages && !keys.has(item)) return;
    
    // CUSTOM LAYOUT
    // nodes.push({ id: idx, label: label, shape: "box", x: offset.x + layout[item].level * verticalGap, y: offset.y + layout[item].count * horizontalGap});
    
    // CIRCULAR LAYOUT
    nodes.push({ id: idx, label: label, shape: "box", x: layout[item].x, y: layout[item].y});
    
    // DEFAULT LAYOUT
    // nodes.push({ id: idx, label: label, shape: "box"});

    lookup_nodes.set(item, idx);
    idx += 1;
  });

  Object.keys(data).map((from) => {
    data[from].map((to) => {
      if (!includeInstalledPackages && !keys.has(to)) return;
      edges.push({
        id: `${from}->${to}${Math.random() * 1000}`,
        from: lookup_nodes.get(from),
        to: lookup_nodes.get(to),
        label: "imports",
        smooth: { enabled: false },
      });
    });
  });

  return {
    nodes: new DataSet(nodes),
    edges: new DataSet(edges),
  };
}
