import { Network } from "vis-network";

import { jsonToDataset } from "./jsonToDataset";
import { GraphOptions } from "./graph.config";
import { createSignal } from "./signal";
import { pythonFolderGraph } from "./actions/getGraphData";


async function drawGraph(data, removePrefix = '', includeInstalledPackages = true, deleteOnDoubleClick = false, gaps = { x: 100, y: 100 }) {
  if (!data) return;

  data = data.graph

  let graphData = jsonToDataset(data, removePrefix, includeInstalledPackages, gaps.x, gaps.y);
  let container = document.getElementById("graphContainer");
  let undoButton = document.getElementById("undoButton");
  let network = new Network(container, graphData, GraphOptions);

  let deletedNodes = []

  let nodesContiner = document.getElementById("nodesContainer")
  nodesContiner.replaceChildren()
  graphData.nodes.forEach(node => {

    let container = document.createElement("div")
    let buttonNode = document.createElement("button")

    container.className = "flex space-x-2 align-middle items-center pl-2"

    buttonNode.innerText = node.label
    buttonNode.className = "block text-left text-sm font-medium text-gray-700 rounded-md w-full py-1 px-2 hover:bg-blue-500 hover:text-white focus:bg-blue-300"

    buttonNode.addEventListener("click", (e) => {
      network.fit({nodes: [node.id], animation: true})
      network.selectNodes([node.id])
    })
    nodesContiner.appendChild(buttonNode)
  })

  network.on("doubleClick", (params) => {
    let connectedNotes = network.getConnectedNodes(params.nodes[0])
    connectedNotes.push(params.nodes[0])

    network.fit({nodes: connectedNotes, animation: true})

    let unselectedNodes = []
    graphData.nodes.forEach((node) => {
      if (!connectedNotes.includes(node.id)) unselectedNodes.push(node.id)
    })

    if (deleteOnDoubleClick) {
      network.selectNodes(unselectedNodes)
      deletedNodes.push(graphData.nodes.get(unselectedNodes))
      graphData.nodes.remove(unselectedNodes)
    } else {
      network.selectNodes(connectedNotes)
    }

    if (deletedNodes.length > 0) undoButton.disabled = false
    else undoButton.disabled = true

  })

  undoButton.addEventListener("click", () => {
    graphData.nodes.add(deletedNodes[deletedNodes.length - 1])
    deletedNodes.pop()
    if (deletedNodes.length > 0) undoButton.disabled = false
    else undoButton.disabled = true
  })

  network.on("dragEnd", (params) => {
    let nodes = params.nodes
    nodes.forEach((node) => {
      let newNodePos = network.getPosition(node)
      let graphNode = graphData.nodes.get(node)
      graphNode.x = newNodePos.x
      graphNode.y = newNodePos.y
    })
  })

  return network;
}

function controlMenu(graphData, removePrefix, includeInstalledPackages, isolateNode, ignoreFiles, ignoreFolders) {
  let toggleButton = document.getElementById("toggleButton");
  toggleButton.addEventListener("click", () => {
    let controlMenu = document.getElementById("controlMenu");
    if (controlMenu.style.display === "none") {
      controlMenu.style.display = "block";
    } else {
      controlMenu.style.display = "none";
    }
  })

  let folderPath = document.getElementById("folderPath");
  let submitButton = document.getElementById("submitButton");
  submitButton.addEventListener("click", async () => {
    let newGraphData = await pythonFolderGraph(folderPath.value, ignoreFiles.value, ignoreFolders.value);
    graphData.value = newGraphData;
  })


  let newRemovePrefix = document.getElementById("removePrefix");
  newRemovePrefix.addEventListener("input", () => {
    removePrefix.value = newRemovePrefix.value;
  })

  let newIgnoreFiles = document.getElementById("ignoreFiles");
  newIgnoreFiles.addEventListener("input", () => {
    ignoreFiles.value = newIgnoreFiles.value.split(",").map((file) => file.trim());
    console.log(ignoreFiles.value)
  })

  let newIgnoreFolders = document.getElementById("ignoreFolders");
  newIgnoreFolders.addEventListener("input", () => {
    ignoreFolders.value = newIgnoreFolders.value.split(",").map((folder) => folder.trim());
    console.log(ignoreFolders.value)
  })


  let newIncludeInstalledPackages = document.getElementById("includeInstalledPackages");
  newIncludeInstalledPackages.addEventListener("change", () => {
    includeInstalledPackages.value = newIncludeInstalledPackages.checked;
  })

  let newIsolateNode = document.getElementById("isolateNode");
  newIsolateNode.addEventListener("change", () => {
    isolateNode.value = newIsolateNode.checked;
  })
}

export default async function App() {
  const graphData = createSignal();
  const removePrefix = createSignal("");
  const includeInstalledPackages = createSignal(false);
  const isolateNode = createSignal();
  const ignoreFiles = createSignal(['__init__.py']);
  const ignoreFolders = createSignal(['__pycache__']);
  const network = createSignal();

  graphData.subscribe((data) => {
    network.value = drawGraph(data, removePrefix.value, includeInstalledPackages.value, isolateNode.value)
  })

  removePrefix.subscribe((prefix) => {
    network.value = drawGraph(graphData.value, prefix, includeInstalledPackages.value, isolateNode.value)
  })

  includeInstalledPackages.subscribe((include) => {
    network.value = drawGraph(graphData.value, removePrefix.value, include, isolateNode.value)
  })

  isolateNode.subscribe(async (isolate) => {
    network.value = drawGraph(graphData.value, removePrefix.value, includeInstalledPackages.value, isolate)
  })

  controlMenu(graphData, removePrefix, includeInstalledPackages, isolateNode, ignoreFiles, ignoreFolders)
}
