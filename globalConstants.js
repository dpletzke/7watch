const fs = require('fs');

const env = `
export const HL7_EXTERNAL_PORT = 7777;
export const HL7_INTERNAL_PORT = 7778;
`

fs.writeFileSync('./server/constants.js', env)
fs.writeFileSync('./client/constants.js', env)