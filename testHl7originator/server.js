const hl7 = require("simple-hl7");
/**
 * TODO test if parseing before sending is necessary
 * @see https://github.com/hitgeek/simple-hl7/blob/master/examples/message.js
 */
// const parser = new hl7.Parser();

// fixtures
const messages = [
  { device: "CARDECHO", obxs: [101, 103] },
  { device: "ENDOMONITOR130069", obxs: [102, 104] },
  { device: "ANMONITOR35901", obxs: [101, 103] },
  { device: "ICCURM7108", obxs: [102, 104] },
];

const client = hl7.Server.createTcpClient({
  host: 'localhost',
  port: 7777,
  keepalive: true,
  callback: function(err, ack) {
    if (err) {
      console.log(err.message);
  }
});

/**
 * @param {Object} msg - fixtures containing msg details
 * @param {string} msg.device - device Id
 * @param {number[]} msg.obxs - array of observation ids, or OBX-3s to send 
 * @returns message that can be sent with client.send(hl7Msg)
 */
const createHl7Message = (msg) => {
  const { device, obxs } = msg;
  const now = Date.now();
  const hl7Msg = new hl7.Message("node-test-client", "", "", `${now}`, "", [
    "ORU",
    "R01",
  ]);

  hl7Msg.addSegment("OBR");
  hl7Msg.getSegment("OBR").setField(7, now - 10000);
  hl7Msg.getSegment("OBR").setField(10, device);
  obxs.forEach((obx, i) => {
    hl7Msg.addSegment(
      "OBX",
      `${i}`,
      "NM",
      `${obx}`,
      "",
      // random observation value that is similiar to obx for testing
      `${obx * 10 + Math.random() * 18 - 9}`
    );
  });
  return hl7Msg;
};

/**
 * converts array into singley cyclical linked list
 * @param {any[]} arr - array with any values
 * @returns
 */
const createLL = (arr) => {
  let node, temp, tail;
  const listItem = (val) => {
    return {
      val,
    next: null
  }
  };
  for (let i = arr.length - 1; i >= 0; i--) {
    if (!node) {
      node = new ListItem(arr[i]);
      tail = node;
    } else {
      temp = new ListItem(arr[i]);
      temp.next = node;
      if (i === 0) {
        tail.next = temp;
      }
      node = temp;
    }
  }
  return node;
}

const sendNextMessageRecursive = (msg) => {
  const hl7Msg = createHl7Message(msg);

  const timer = setTimeout(() => {
    clearTimeout(timer);
    sendNextMessageRecursive(msg.next);
  }, 1000);
};

const startMessageCycle = (messages) => {
  const headMessage = createLL(messages);
  sendNextMessageRecursive(headMessage);
};

startMessageCycle(messages);
