// const hl7 = require("../lib");

// const parser = new hl7.Parser({ segmentSeperator: "\n" });
// const client = hl7.Server.createFileClient("test-client");

const messages = [
  { device: "APPLE", obxs: [101, 103] },
  { device: "BANANA", obxs: [102, 104] },
  { device: "RACCOON", obxs: [101, 103] },
  { device: "ELEPHANT", obxs: [102, 104] },
];

function L(val) {
  this.val = val;
  this.next = null;
}

function createL(arr) {
  let node, temp, head;
  for (let i = arr.length - 1; i >= 0; i--) {
    if (!node) {
      node = new L(arr[i]);
      head = node;
    } else {
      temp = new L(arr[i]);
      temp.next = i !== 0 ? node : head;
      node = temp;
    }
  }
  return node;
}

// const sendNextMessage = (file) => {
//   if(!file) return;
//   const msg = parser.parseFileSync(file);
//   client.send(msg, (err) => {
//     if (err) {
//       console.error("ERR: " + err.message);
//     }
//   });
//   const timer = setTimeout(() => {
//     if()
//   }, 1000);
// };

console.log(JSON.stringify(createL(messages)));
