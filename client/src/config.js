const config = {
  HL7_EXTERNAL_PORT: 7000,
  HL7_INTERNAL_PORT: 7001,
  CLIENT_HTTP_PORT: 7002,
  SERVER_HTTP_PORT: 7002,
  SERVER_HTTP_HOST: "localhost",
};

const specifyConfig = ({ formConfig }) => {
  for (let key of Object.keys(formConfig)) {
    if (key === "exHl7Port") config.HL7_EXTERNAL_PORT = formConfig.exHl7Port;
    else if (key === "inHl7Port")
      config.HL7_INTERNAL_PORT = formConfig.inHl7Port;
    else if (key === "clHttpPort")
      config.CLIENT_HTTP_PORT = formConfig.clHttpPort;
    else if (key === "svHttpPort")
      config.SERVER_HTTP_PORT = formConfig.svHttpPort;
    else if (key === "svHttpHost")
      config.SERVER_HTTP_HOST = formConfig.svHttpHost;
    else throw new Error(`Invalid config key ${key}`);
  }
};

module.exports = { config, specifyConfig };
