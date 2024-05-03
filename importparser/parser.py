class Parser:
    def __init__(self, path: str, ignore_folders: list[str] = [], ignore_files: list[str] = []) -> None:
        self.path = path
        self.ignore_folders = ignore_folders
        self.ignore_files = ignore_files

    def generate_graph(self) -> dict:
        raise NotImplementedError