const { ipcMain } = require("electron");
const { tcp } = require("simple-hl7");

// const { config } = require("../config");
// const { HL7_INTERNAL_PORT } = config;

const server = tcp();

let gateIsStarted = false;

server.use(function (req, res, next) {
  console.log("******message received*****");
  console.log(req.msg.log());
  next();
});

server.use(function (err, req, res, next) {
  //error handler
  //standard error middleware would be
  console.log("******ERROR*****");
  console.log(err);
  const msa = res.ack.getSegment("MSA");
  msa.setField(1, "AR");
  res.ack.addSegment("ERR", err.message);
  res.end();
});

ipcMain.handle("start_gate", (event, config) => {
  return new Promise((res, rej) => {
    if (!gateIsStarted) {
      console.log(`Client listening for HL7 on port ${config.HL7_INTERNAL_PORT}`);
      gateIsStarted = true;
      server.start(config.HL7_INTERNAL_PORT);
      res();
    } else {
      rej("Attempted to start the gate when it was already started");
    }
  });
});

ipcMain.handle("stop_gate", (data) => {
  console.log(data);
  return new Promise((res, rej) => {
    if (gateIsStarted) {
      server.stop();
      console.log(`Client has stopped listening for HL7`);
      gateIsStarted = false;
      res();
    } else {
      rej("Attempted to stop the gate when it wasn't started");
    }
  });
});

module.exports = {
  server
}