import { DataSet } from "vis-data";

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
export function jsonToDataset(data, removePrefix = null, includeInstalledPackages=true) {
  let unique_nodes = getAllUniqueNodes(data);
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
    
    nodes.push({ id: idx, label: label, shape: "box" });
    lookup_nodes.set(item, idx);
    idx += 1;
  });

  Object.keys(data).map((from) => {
    data[from].map((to) => {
      if (!includeInstalledPackages && !keys.has(to)) return;
      edges.push({
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
