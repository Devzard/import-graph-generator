export const GraphOptions = {
  nodes: {
    chosen: {
      node: (values, id, selected, hovering) => {
        values.color = "#9fd7f5";
        values.borderWidth = 1;
        values.borderColor = "#000000";
      },
      // label: (values, id, selected, hovering) => (console.log(values, id, selected, hovering)),
    },
    widthConstraint: {
      maximum: 200,
    },
    font: {
      size: 15,
      face: "arial",
      // color: "#EFF6FF",
    },
    color: "#EFF6FF",
  },
  layout: {
    randomSeed: 989104,
    hierarchical: {
      enabled: false,
      direction: "LR", // UD, DU, LR, RL
    },
    improvedLayout: true,
  },
  edges: {
    arrows: {
      to: {
        enabled: true,
        scaleFactor: 0.5,
      },
    },
    chosen: {
      edge: (e) => {
        e.label = "imports"
        e.color = "red"
      },
    },
    hoverWidth: 0.8,
    color: "rgba(0,0,0,0.5)",
  },
  physics: {
    enabled: false,
    barnesHut: {
      theta: 0.5,
      gravitationalConstant: -2000,
      centralGravity: 0.3,
      springLength: 95,
      springConstant: 0.04,
      damping: 0.09,
      avoidOverlap: 0,
    },
    forceAtlas2Based: {
      theta: 0.5,
      gravitationalConstant: -50,
      centralGravity: 0.01,
      springConstant: 0.08,
      springLength: 100,
      damping: 0.4,
      avoidOverlap: 0,
    },
    repulsion: {
      centralGravity: 0.2,
      springLength: 200,
      springConstant: 0.05,
      nodeDistance: 100,
      damping: 0.09,
    },
    hierarchicalRepulsion: {
      centralGravity: 0.0,
      springLength: 100,
      springConstant: 0.01,
      nodeDistance: 120,
      damping: 0.09,
      avoidOverlap: 0,
    },
    maxVelocity: 50,
    minVelocity: 0.1,
    solver: "barnesHut",
    stabilization: {
      enabled: true,
      iterations: 1000,
      updateInterval: 100,
      onlyDynamicEdges: false,
      fit: true,
    },
    timestep: 0.5,
    adaptiveTimestep: true,
    wind: { x: 0, y: 0 },
  },
  interaction: {
    hover: true,
    selectConnectedEdges: true,
    multiselect: true,
    navigationButtons: true,
    tooltipDelay: 300,
  },
};