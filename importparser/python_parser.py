import os

from importparser.parser import Parser

class PythonParser(Parser):
    def __init__(self, path: str, ignore_folders: list[str] = [], ignore_files: list[str] = []) -> None:
        super().__init__(path, ignore_folders, ignore_files)
        self.ext = '.py'
        self.all_files = []
        self.all_dirs = []

    def get_all_file_paths(self) -> tuple[list[str], list[str]]:
        """
        Args:
            - path: root path
            - ignore_folders: folders to ignore
            - ignore_files: files to ignore

        Returns:
            - tuple of (file paths to all files, all directories inside the path)
        """
        for root, dir, files in os.walk(self.path):
            if os.path.basename(root) not in self.ignore_folders:
                dir = [item for item in dir if item not in self.ignore_folders]
                dirPaths = [os.path.join(root, item) for item in dir]
                self.all_dirs.extend(dirPaths)

                files = [item for item in files if item not in self.ignore_files]
                for file in files:
                    if file in self.all_dirs:
                        print(file)
                filePaths = [os.path.join(root, item) for item in files]
                self.all_files.extend(filePaths)

        return self.all_files, self.all_dirs

    def filter_files(self, paths: list[str], ext: str) -> list[str]:
        """
        Args:
            - paths: paths to filter
            - ext: files with extension to keep

        Returns:
            - list of filtered files
        """
        return [file for file in paths if file.endswith(ext)]


    def get_imports(self, filepath: str) -> list[str]:
        """
        Extracts all import lines from a given Python code string.

        Args:
            - filepath: Path of the python file.

        Returns:
            - A list of strings representing the import lines in the code.
        """
        with open(filepath, 'r') as file:
            code = file.read()
        import_lines = []
        for line in code.splitlines():
            line = line.strip()
            if line.startswith("import ") or line.startswith("from "):
                import_lines.append(line)
        return import_lines

    def import_to_file_path(self, import_statement: str) -> str:
        """
        Args:
            - import_statement : a valid python import statement
            - root_dir : directory location of the main entry file

        Returns:
            - path of the imported file
        """
        file_path = self.path

        # handling "import""
        if import_statement.startswith("import "):
            module_name = import_statement.split()[1]
            module_name = module_name.strip()
            module_name = module_name.split(".")
            for item in module_name:
                file_path = os.path.join(file_path, item)

            return file_path + '.py'

        # handling "from"
        if import_statement.startswith("from "):
            module_name = import_statement.split()[1]
            module_name = module_name.strip()
            module_name = module_name.split(".")

            second_part = import_statement.split()[3]
            second_part = second_part.split(",")

            if module_name[-1] in [item.split("/")[-1] for item in self.all_dirs]:
                for item in module_name:
                    file_path = os.path.join(file_path, item)

                temp_files = []
                for file in second_part:
                    temp_files.append(os.path.join(file_path, file))

                return [item + '.py' for item in temp_files]

            for item in module_name:
                file_path = os.path.join(file_path, item)

            return file_path + '.py'

        return ""


    def generate_graph(self) -> dict:
        """
        generates an import graph

        Returns:
            - a dictionary representing a graph as an adjacency list
        """
        file_paths, _ = self.get_all_file_paths()
        file_paths = self.filter_files(file_paths, ext=self.ext)
        imports_map = {}
        for file in file_paths:
            imports = self.get_imports(file)
            imports_paths = []

            for import_statement in imports:
                import_file = self.import_to_file_path(import_statement)
                if isinstance(import_file, str):
                    imports_paths.append(self.import_to_file_path(import_statement))
                elif isinstance(import_file, list):
                    imports_paths.extend(self.import_to_file_path(import_statement))

            imports_map[file] = imports_paths

        return imports_map
