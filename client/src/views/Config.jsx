import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import { specifyConfig, config } from "../config";
import { stopGate, startGate } from "../helpers/rendererHelpers";

function Config() {
  const [formConfig, setFormConfig] = useState(() => {
    return {
      exHl7Port: config.HL7_EXTERNAL_PORT,
      inHl7Port: config.HL7_INTERNAL_PORT,
      clHttpPort: config.CLIENT_HTTP_PORT,
      svHttpPort: config.SERVER_HTTP_PORT,
      svHttpHost: config.SERVER_HTTP_HOST,
    };
  });

  const handleSubmit = async(e) => {
    e.preventDefault();
    specifyConfig({ formConfig });
    await stopGate();
    startGate();
  };

  const handleChange = (e) => {
    setFormConfig((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });
  };

  const input = ({ label, type, name, onChange }) => {
    return (
      <Form.Group key={name} controlId={name}>
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
      label: "External HL7 Port",
      type: "number",
      name: "exHl7Port",
      onChange: handleChange,
    },
    {
      label: "Internal HL7 Port",
      type: "number",
      name: "inHl7Port",
      onChange: handleChange,
    },
    {
      label: "Client HTTP Port",
      type: "number",
      name: "clHttpPort",
      onChange: handleChange,
    },
    {
      label: "Server HTTP Host",
      type: "test",
      name: "svHttpHost",
      onChange: handleChange,
    },
    {
      label: "Server HTTP Port",
      type: "number",
      name: "svHttpPort",
      onChange: handleChange,
    },
  ];

  return (
    <>
      <Container fluid>
        <Row>
          <Col md="4">
            <Card>
              <Card.Header>
                <Card.Title as="h4">Set Configuration</Card.Title>
              </Card.Header>
              <Card.Body>
                <Form onSubmit={handleSubmit}>
                  {configOptions.map((co) => input(co))}
                  <Button
                    className="btn-fill pull-right"
                    type="submit"
                    variant="warning"
                  >
                    Commit Changes
                  </Button>
                  <div className="clearfix"></div>
                </Form>
              </Card.Body>
            </Card>
          </Col>
          <Col md="8"></Col>
        </Row>
      </Container>
    </>
  );
}

export default Config;
