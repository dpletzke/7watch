const hl7 = require("simple-hl7");

const { HL7_INTERNAL_PORT, HL7_EXTERNAL_PORT } = require("./constants");

const server = hl7.tcp();

// datastores options
// for
// by minute
// by hour
//

const client = hl7.Server.createTcpClient({
  host: "localhost",
  port: HL7_INTERNAL_PORT,
  keepalive: true,
  callback: (err, ack) => {
    if (err) {
      console.log("*******ERROR********");
      console.log(err.message);
    } else {
      console.log(ack.log());
    }
  },
});

server.use((req, res, next) => {
  //req.msg is the HL7 message
  console.log("******message received*****");
  console.log(req.msg.log());

  console.log("******message forwarded*****");
  client.send(req.msg);
  next();
});

server.use((err, req, res, next) => {
  //error handler
  //standard error middleware would be
  console.log("******ERROR*****");
  console.log(err);
  const msa = res.ack.getSegment("MSA");
  msa.setField(1, "AR");
  res.ack.addSegment("ERR", err.message);
  res.end();
});

//Listen on port 7777
server.start(HL7_EXTERNAL_PORT);
