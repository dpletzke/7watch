import React from "react";

// react-bootstrap components
// import Badge from "react-bootstrap/Badge";
// import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
// import Navbar from "react-bootstrap/Navbar";
// import Nav from "react-bootstrap/Nav";
import Table from "react-bootstrap/Table";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import { useLogsStore } from "../contexts/logsContext";

import { observer } from "mobx-react-lite";

const Logs = observer(() => {
  const logsStore = useLogsStore();

  const logRow = (msg) => {
    const obr = msg.segments.find((sg) => sg.name === "OBR");
    const obxs = msg.segments.filter((sg) => sg.name === "OBX");
    return (
      <tr key={msg.id}>
        <td>{msg.header.fields.sentTimeStamp}</td>
        <td>{obr.fields.observationTimeStamp}</td>
        <td>{obr.fields.collectorIdentifier}</td>
        <td>
          {obxs.map(({ fields }) => {
            const { observationIdentifier, value } = fields;
            return `${observationIdentifier}, ${value}`;
          }).join('| ')}
        </td>
      </tr>
    );
  };

  const totalLogs = logsStore.logs.length;
  const displayLogs = logsStore.logs.slice(totalLogs - 10).map((log) => logRow(log)).reverse();

  return (
    <Container fluid>
      <Row>
        <Col md="12">
          <Card className="card-plain table-plain-bg">
            <Card.Header>
              <Card.Title as="h4">All Logs</Card.Title>
              <p className="card-category">Last 10 messages</p>
            </Card.Header>
            <Card.Body className="table-full-width table-responsive px-0">
              <Table className="table-hover">
                <thead>
                  <tr>
                    <th className="border-0">Time Sent</th>
                    <th className="border-0">Time Collected</th>
                    <th className="border-0">Device Id</th>
                    <th className="border-0">Variables</th>
                  </tr>
                </thead>
                <tbody>{displayLogs}</tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
});

export default Logs;
