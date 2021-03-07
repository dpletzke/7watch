import { config } from "../config";
const { ipcRenderer } = window.require('electron')

let gateStarted = false;

const startGate = async() => {
  if(!gateStarted) {
    await ipcRenderer.invoke('start_gate', config);
    gateStarted = true;
  }
}

const stopGate = async() => {
  if(gateStarted) {
    await ipcRenderer.invoke('stop_gate');
    gateStarted = false;
  }
}

export {
  startGate,
  stopGate,
  gateStarted
}
