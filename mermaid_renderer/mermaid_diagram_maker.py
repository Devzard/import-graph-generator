import os

class ImportGraph:
    def __init__(self, title: str, node_map: dict, left_to_right: bool = False, output_path: str = "output.html", template_path: str = os.path.join(os.path.dirname(os.path.realpath(__file__)), "templates", "html_template.html")) -> None:
        self.title = title
        self.node_map = node_map
        self.left_to_right = left_to_right
        self.unique_nodes = set()
        self.node_look_up = {}
        self.template_path = template_path
        self.output_path = output_path

        self.init_unique_nodes()

    def __repr__(self) -> str:
        return f"<ImportGraph(title={self.title})>"

    def init_unique_nodes(self):
        """
        Extract all unique nodes from the dictionary
        """
        self.unique_nodes = set(self.node_map.keys())
        other_ndoes = [self.node_map[item] for item in self.node_map.keys()]
        for row in other_ndoes:
            for col in row:
                self.unique_nodes.add(col)


    def define_nodes(self):
        """
        defines node in mermaid format
        e.g.
            1["node1"]
            2["node2"]

        Returns:
            - initialised nodes in string format
        """
        node_init = ""
        for index, node in enumerate(self.unique_nodes):
            self.node_look_up[node] = index

        for key, value in self.node_look_up.items():
            node_init += f'\t{value}["{key}"]\n'

        return node_init

    def draw_graph(self):
        """
        creates flowdiagram according to mermaid syntax

        Returns:
            - string of the mermaid graph
        """
        node_init = self.define_nodes()
        connections = ""

        for key in self.node_map.keys():
            for item in self.node_map[key]:
                connections += f"\t{self.node_look_up[key]}-->|imports| {self.node_look_up[item]}\n"

        return f"{node_init}{connections}"

    def generate_html(self) -> None:
        """
        Generates html code for the graph
        """
        graph = self.draw_graph()
        graph_to_write = f"""---
title: {self.title}
---
flowchart {'LR' if self.left_to_right else 'TD'}
{graph};
"""

        with open(self.template_path, 'r') as file:
            template = file.read()
            template = template.replace("{mermaid_graph}", graph_to_write)

        with open(self.output_path, 'w') as file:
            file.write(template)



if __name__ == "__main__":
    exp = {
        'node1' : ['node2', 'node3'],
        'node2' : ['node1'],
    }

    obj = ImportGraph("new", exp, left_to_right=False, output_path="output.html")
    obj.generate_html()

    # ---
    # title: new
    # ---
    # flowchart TD
    # 1['node1']
    # 2['node2']
    # 3['node3']
    # 1 --> 2
    # 1 --> 3
    # 2 --> 1
