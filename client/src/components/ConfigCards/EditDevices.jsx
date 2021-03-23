import React, { useState } from "react";
import { observer } from "mobx-react-lite";

import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";

import { useGridStore } from "../../contexts";
import Container from "react-bootstrap/esm/Container";

const EditDevices = observer(() => {
  const [newDevice, setNewDevice] = useState("");
  const gridStore = useGridStore();

  const handleAdd = (e) => {
    e.preventDefault();
    setNewDevice("");
    gridStore.addDevices([newDevice]);
  };

  const handleRemove = (deviceId) => {
    return (e) => {
      e.preventDefault();
      console.log("here");
      gridStore.removeDevices([deviceId]);
    };
  };

  const handleChange = (e) => {
    setNewDevice(e.target.value);
  };

  const deviceRow = (deviceId) => {
    return (
      <Form key={deviceId} onSubmit={handleRemove(deviceId)}>
        <Row>
          <Form.Group controlId={deviceId}>
            <Form.Control plaintext readOnly name={deviceId} value={deviceId} />
          </Form.Group>
          <Button className="btn pull-right" type="submit" variant="danger">
            Remove
          </Button>
        </Row>
      </Form>
    );
  };

  return (
    <Card>
      <Card.Header>
        <Card.Title as="h4">Edit Devices</Card.Title>
      </Card.Header>
      <Card.Body>
        <Container>
          {gridStore.deviceIds.map((dId) => deviceRow(dId))}
          <Form onSubmit={handleAdd}>
            <Row>
              <Form.Group>
                <Form.Control
                  name={newDevice}
                  value={newDevice}
                  onChange={handleChange}
                />
              </Form.Group>
              <Button
                className="btn-fill pull-right"
                type="submit"
                variant="warning"
              >
                Add Device
              </Button>
            </Row>
          </Form>
        </Container>
        <div className="clearfix"></div>
      </Card.Body>
    </Card>
  );
});

export default EditDevices;
