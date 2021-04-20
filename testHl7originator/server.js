const hl7 = require("simple-hl7");

// fixtures
const messages = [
  { device: "CARDBAY1", obxs: [2, 3] },
  { device: "CARDBAY2", obxs: [2, 3] },
  { device: "CARDECHO", obxs: [73] },
  { device: "CARDSTRESSRM2", obxs: [73, 519, 635] },
  { device: "CARDSTRESSRM3", obxs: [73, 519, 635] },
  { device: "CARDSTRESSRM5", obxs: [73, 519, 635] },
];

const PORT = 7001;
const client = hl7.Server.createTcpClient({
  host: "localhost",
  port: PORT,
  keepalive: true,
  /**
   * this library's Tcp client expects an acknowledgement and will print
   * an error here if not, but it doesn't seem to effect the functionality
   * error text is "Can't send while awaiting response"
   * TODO try to use the "file" not "tcp" client in the library which
   * apparently doesn't expect an ack
   */
  callback: function (err, ack) {
    // if (err) {
    //   console.log(err.message);
    // }
  },
});

/**
 * our use case messages have a particular way date is formatted
 * year month day hour minute second
 * all numbers, no spaces eg 20210329201547
 * @param {number} mil - milliseconds since linux epoch
 * @returns {string} date formatted
 */
const dateFormatter = (mil) => {
  const date = new Date(mil);
  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();
  const hour = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();
  return `${year}${month}${day}${hour}${minutes}${seconds}`;
};

/**
 * @param {Object} msg - fixtures containing msg details
 * @param {string} msg.device - device Id
 * @param {number[]} msg.obxs - array of observation ids, or OBX-3s to send
 * @returns message that can be sent with client.send(hl7Msg)
 */
const createHl7Message = (msgDetails) => {
  const { device, obxs } = msgDetails;
  const sentTime = dateFormatter(Date.now());
  const observedTime = dateFormatter(Date.now() - 1000 * 60 * 60);
  const hl7Msg = new hl7.Message(
    "node-test-client",
    "",
    "",
    "",
    `${sentTime}`,
    "",
    ["ORU", "R01"]
  );

  hl7Msg.addSegment(
    "OBR",
    "",
    "",
    "",
    "",
    "",
    "",
    observedTime,
    "",
    "",
    device
  );
  obxs.forEach((obx, i) => {
    hl7Msg.addSegment(
      "OBX",
      `${i + 1}`,
      "NM",
      `${obx}`,
      "",
      // random observation value that is similiar to obx for testing
      `${obx * 10 + Math.trunc(Math.random() * 18) - 9}`,
      `${Math.trunc(Math.random() * 20)}`, //random unit id
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      `${observedTime}`
    );
  });
  return hl7Msg;
};

/**
 * converts array into singlely cyclical linked list
 * @param {any[]} arr - array with any values
 * @returns head node
 */
const createLL = (arr) => {
  let node, temp, tail;
  const listItemFactory = (val) => ({ val, next: null });
  for (let i = arr.length - 1; i >= 0; i--) {
    if (!node) {
      node = listItemFactory(arr[i]);
      tail = node;
    } else {
      temp = listItemFactory(arr[i]);
      temp.next = node;
      node = temp;
      if (i === 0) {
        tail.next = node;
      }
    }
  }
  return node;
};

/**
 * sends messages recursively
 * @param {Object} msg - node in linked list
 * @param {Object} msg.val - message details
 * @param {Object} msg.next - next node in linked list
 */
const sendNextMessageRecursive = (msg) => {
  const hl7Msg = createHl7Message(msg.val);
  client.send(hl7Msg);
  const timer = setTimeout(() => {
    clearTimeout(timer);
    sendNextMessageRecursive(msg.next);
  }, 1000);
};

/**
 * starts sending message stream
 * @param {Object} messages - linked list of messages
 */
const startMessageCycle = (messages) => {
  const headMessage = createLL(messages);
  sendNextMessageRecursive(headMessage);
};

console.log("test server sending messages on port", PORT);
startMessageCycle(messages);
