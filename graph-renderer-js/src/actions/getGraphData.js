export async function pythonFolderGraph(folder_path) {
    return await fetch("http://localhost:8000/graph-python", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        folder_path: folder_path 
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