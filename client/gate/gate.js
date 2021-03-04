const hl7 = require("simple-hl7");

const { HL7_INTERNAL_PORT } = require('../constants').config;

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
  var msa = res.ack.getSegment("MSA");
  msa.setField(1, "AR");
  res.ack.addSegment("ERR", err.message);
  res.end();
});

const startGate = () => {
  console.log(`Client listening on port ${HL7_INTERNAL_PORT}`);
  server.start(HL7_INTERNAL_PORT);
};

const stopGate = () => {
  server.stop();
};

startGate();

module.export = {
  stopGate,
  startGate,
};

