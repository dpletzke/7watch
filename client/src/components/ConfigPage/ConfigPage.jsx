import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

import { specifyConfig, config } from "../../config";
import { stopGate, startGate } from "../../hl7Gate/hl7Gate";

export const ConfigPage = (props) => {
  const [formConfig, setFormConfig] = useState(() => {
    return {
      exHl7Port: config.HL7_EXTERNAL_PORT,
      inHl7Port: config.HL7_INTERNAL_PORT,
      clHttpPort: config.CLIENT_HTTP_PORT,
      svHttpPort: config.SERVER_HTTP_PORT,
      svHttpHost: config.SERVER_HTTP_HOST,
    };
  });

  const handleSubmit = async () => {
    specifyConfig({ formConfig });
    await stopGate();
    startGate();
  };

  const handleChange = (e) => {
    setFormConfig((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });
  };

  // set/change port client is listening for hl7/ server is sending to
  // internal
  // set/change port server is listening for hl7
  // external

  // set/change server hostname, we set this to know where to send our
  // requests, defaults to localhost

  const input = ({ label, type, name, onChange }) => {
    return (
      <Form.Group key={name} controlId={name} className='has-success'>
        <Form.Label>{label}</Form.Label>
        <Form.Control
          type={type}
          name={name}
          onChange={onChange}
          value={formConfig[name]}
        />
      </Form.Group>
    );
  };

  const configOptions = [
    {
      label:'External HL7 Port',
      type: "number",
      name: "exHl7Port",
      onChange: handleChange,
    },
    {
      label:'Internal HL7 Port',
      type: "number",
      name: "inHl7Port",
      onChange: handleChange,
    },
    {
      label:'Client HTTP Port',
      type: "number",
      name: "clHttpPort",
      onChange: handleChange,
    },
    {
      label:'Server HTTP Host',
      type: "test",
      name: "svHttpHost",
      onChange: handleChange,
    },
    {
      label:'Server HTTP Port',
      type: "number",
      name: "svHttpPort",
      onChange: handleChange,
    },
  ];

  return (
    <>
      <Form>
        {
          configOptions.map(co => input(co))
        }
        <Button
          variant="primary"
          type="submit"
          onSubmit={handleSubmit}
          onChange={handleChange}
        >
          Make Changes
        </Button>
      </Form>
    </>
  );
};
