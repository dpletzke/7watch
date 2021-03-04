const config = {
  HL7_INTERNAL_PORT: 7778,
};

const specifyConfig = ({ hl7Port }) => {
  config.HL7_INTERNAL_PORT = hl7Port;
};

module.exports = { config, specifyConfig };
