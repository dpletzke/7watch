const hl7 = require("simple-hl7");

const { HL7_INTERNAL_PORT } = require('../config').config;

const server = hl7.tcp();

server.use(function (req, res, next) {
  //req.msg is the HL7 message
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

const startGate = () => {
  return new Promise((res, rej) => {
    console.log(`Client listening for HL7 on port ${HL7_INTERNAL_PORT}`);
    server.start(HL7_INTERNAL_PORT);
  });
};

const stopGate = () => {
  return new Promise((res, rej) => {
    console.log(`Client has stopped listening for HL7`);
    server.stop();
  });
};

// startGate();

module.export = {
  stopGate,
  startGate,
};

