import React, { useState } from "react";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/esm/Container";

import UploadFile from "./UploadFile";

import { specifyConfig, config } from "../../config";
import { useGateStore } from "../../contexts";

function SetGridFromFiles() {
  const gate = useGateStore();

  const fileInputs = [
    { name: "devicePath", title: "DeviceIds" },
    { name: "observationPath", title: "Observations" },
  ];

  return (
    <Card>
      <Card.Header>
        <Card.Title as="h4">Upload CSVs</Card.Title>
      </Card.Header>
      <Card.Body>
        <Container>
          {fileInputs.map((details, i) => {
            return <UploadFile key={i} details={details} />;
          })}
        </Container>
      </Card.Body>
    </Card>
  );
}

export default SetGridFromFiles;
