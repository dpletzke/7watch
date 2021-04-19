const { ipcRenderer } = window.require("electron");

const readFile = (filePath) => {
  return ipcRenderer.invoke("read_file", filePath);
};

export { readFile };
