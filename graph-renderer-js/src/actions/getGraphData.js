export async function pythonFolderGraph(folder_path, ignoreFiles, ignoreFolders) {
    return await fetch("http://localhost:8000/v1/graph-python", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        folder_path: folder_path,
        ignore_files: ignoreFiles,
        ignore_folders: ignoreFolders,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        return data;
      })
      .catch((error) => {
        console.error("Error:", error);
      });
    
  }