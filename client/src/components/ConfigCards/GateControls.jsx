import React from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";

import { useGateStore } from "../../contexts";

function GateControls() {
  const gate = useGateStore();

  return (
    <Card>
      <Card.Header>
        <Card.Title as="h4">Gate Controls</Card.Title>
      </Card.Header>
      <Card.Body>
        <Button
          className="btn-fill pull-right"
          type="submit"
          variant="warning"
          onClick={() => gate.open()}
        >
          Open Gate
        </Button>
        <Button
          className="btn-fill pull-right"
          type="submit"
          variant="warning"
          onClick={() => gate.close()}
        >
          Close Gate
        </Button>
      </Card.Body>
    </Card>
  );
}

export default GateControls;
