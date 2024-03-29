import React, { useState } from "react";
import { observer } from "mobx-react-lite";

import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import { useGridStore } from "../../contexts";
import Container from "react-bootstrap/esm/Container";

const EditObservations = observer(() => {
  const [newObservation, setnewObservation] = useState({
    id: "",
    common: "",
    full: "",
  });
  const gridStore = useGridStore();

  const handleAdd = (e) => {
    e.preventDefault();
    gridStore.addObservations([newObservation]);
    setnewObservation({
      id: "",
      common: "",
      full: "",
    });
  };

  const handleRemove = (observationId) => {
    return (e) => {
      e.preventDefault();
      gridStore.removeObservations([observationId]);
    };
  };

  const handleChange = (e) => {
    setnewObservation((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const input = (observation) => {
    const { id, full, common } = observation;
    return (
      <Form key={id} onSubmit={handleRemove(id)}>
        <Row>
          <Col md="1">
            <Form.Group>
              <Form.Control plaintext readOnly name="id" value={id} />
            </Form.Group>
          </Col>
          <Col md="2">
            <Form.Group>
              <Form.Control plaintext readOnly name="common" value={common} />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group>
              <Form.Control plaintext readOnly name="full" value={full} />
            </Form.Group>
          </Col>
          <Col>
            <Button className="btn pull-right" type="submit" variant="danger">
              Remove
            </Button>
          </Col>
        </Row>
      </Form>
    );
  };

  return (
    <Card>
      <Card.Header>
        <Card.Title as="h4">Edit Observations</Card.Title>
      </Card.Header>
      <Card.Body>
        <Container>
          {Array.from(gridStore.observations.values()).map((ob) => input(ob))}
          <Form onSubmit={handleAdd}>
            <Form.Group>
              <Form.Label>OBX-3</Form.Label>
              <Form.Control
                name="id"
                value={newObservation.id}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Common Name</Form.Label>
              <Form.Control
                name="common"
                value={newObservation.common}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Full Name</Form.Label>
              <Form.Control
                name="full"
                value={newObservation.full}
                onChange={handleChange}
              />
            </Form.Group>
            <Button
              className="btn-fill pull-right"
              type="submit"
              variant="warning"
            >
              Add Observation
            </Button>
          </Form>
        </Container>
        <div className="clearfix"></div>
      </Card.Body>
    </Card>
  );
});

export default EditObservations;
