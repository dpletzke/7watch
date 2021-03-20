const { normalizeMsg } = require("./helpers/msgProcessing");

const { tcp } = require("simple-hl7");

const server = tcp();
let gateIsStarted = false;

module.exports = (win) => {
  server.use(function (req, res, next) {
    // console.log(req.msg.log());

    const msg = normalizeMsg(req.msg);

    win.webContents.send("msg_recieved", msg);

    if (msg.segments.find((seg) => seg.name === "OBX")) {
      win.webContents.send("observation_report", msg);
    }
    next();
  });

  server.use(function (err, req, res, next) {
    //error handler
    console.error(err);
    const msa = res.ack.getSegment("MSA");
    msa.setField(1, "AR");
    res.ack.addSegment("ERR", err.message);
    res.end();
  });

  const startGate = (config) => {
    return new Promise((res, rej) => {
      if (!gateIsStarted) {
        console.log(
          `Client listening for HL7 on port ${config.HL7_INTERNAL_PORT}`
        );
        gateIsStarted = true;
        server.start(config.HL7_INTERNAL_PORT);
        res();
      } else {
        rej("Attempted to start the gate when it was already started");
      }
    });
  };

  const stopGate = () => {
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
  };

  return {
    startGate,
    stopGate,
  };
};
