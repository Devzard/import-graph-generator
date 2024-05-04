import json
from typing import Union, Optional
from typing_extensions import List

import uvicorn
from fastapi import FastAPI, Response
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from utils.logger import get_logger
from importparser.python_parser import PythonParser
from mermaid_renderer.mermaid_diagram_maker import ImportGraph

class GraphRequest(BaseModel):
    folder_path: str
    ignore_folders: Optional[List[str]] = None
    ignore_files: Optional[List[str]] = None

class GraphResponse(BaseModel):
    graph: dict

class GraphErrorResponse(BaseModel):
    message: str

def get_app():
    app = FastAPI(
        title="Graph builder API",
        version="0.0.1",
        description="API to generate import graph of a any project",
    )
    origins = ["*"]
    app.add_middleware(
        CORSMiddleware,
        allow_origins=origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    return app

logger = get_logger(__name__)
app = get_app()


@app.get("/ping")
def read_root():
    return {"message": "pong"}

@app.post("/v1/graph-python", response_model=GraphResponse)
def get_graph(response: Response, data: GraphRequest):
    try:
        logger.info(f"Generating graph for {data.folder_path}")
        root_dir = data.folder_path
        ignore_folders = data.ignore_folders if data.ignore_folders else ["__pycache__"]
        ignore_files = data.ignore_files if data.ignore_files else ["__init__.py"]

        python_parser = PythonParser(path=root_dir, ignore_folders=ignore_folders, ignore_files=ignore_files)
        imports_map = python_parser.generate_graph()

        return GraphResponse(graph=imports_map)
    except Exception as e:
        logger.error(f"Failed to generate graph: {e}")
        if e.status_code:
            response.status_code = e.status_code
            res = GraphErrorResponse("Failed to generate graph:", e.detail)
            return res
        response.status_code = 500
        res = GraphErrorResponse("Internal Server Error")
        return res


app.mount("/", StaticFiles(directory="graph-renderer-js/dist"), name="static")

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)


# if __name__ == "__main__":
#     # root_dir = "test-repo"
#     root_dir = "/Users/debashishgogoi/Projects/renix/capital-expert-bot-api"
#     # root_dir = "/Users/debashishgogoi/Projects/graph-maker/test-repo"
#     ignore_folders = ["__pycache__"]
#     ignore_files = ["__init__.py"]

#     python_parser = ImportsGraphMaker(root_dir, ignore_folders, ignore_files)
#     imports_map = python_parser.generate_graph()
#     json.dump(imports_map, open(f"outputs/data.json", 'w'))
#     mermaid_graph = ImportGraph("example import graph", imports_map, output_path="outputs/test-repo.html")
#     mermaid_graph.generate_html()
