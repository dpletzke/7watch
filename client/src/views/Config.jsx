import React from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import GateControls from "../components/ConfigCards/GateControls";
import SetConfig from "../components/ConfigCards/SetConfig";
import EditDevices from "../components/ConfigCards/EditDevices";
import EditObservations from "../components/ConfigCards/EditObservations";

function Config() {
  return (
    <Container fluid>
      <Row>
        <Col md="4">
          <GateControls />
          <SetConfig />
        </Col>
        <Col md="8">
          <EditDevices />
          <EditObservations />
        </Col>
      </Row>
    </Container>
  );
}

export default Config;
