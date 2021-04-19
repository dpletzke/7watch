import React from "react";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/esm/Container";

import UploadFile from "./UploadFile";

import * as ipc from "../../helpers/ipcHelpers";
import { useGridStore } from "../../contexts";

function SetGridFromFiles() {
  const gridStore = useGridStore();

  const parse = {
    devices: (data) => data.split("\n").slice(1),
    observations: (data) => {
      const [headers, ...rows] = data.split("\n");
      return rows.map((ob) => {
        const [id, common, full] = ob.split(",");
        return { id, common, full };
      });
    },
  };

  const fileInputs = [
    {
      name: "devicePath",
      title: "DeviceIds",
      sendFilePath: ipc.readFile,
      dataHandler: (data) => gridStore.addDevices(parse.devices(data)),
    },
    {
      name: "observationPath",
      title: "Observations",
      sendFilePath: ipc.readFile,
      dataHandler: (data) =>
        gridStore.addObservations(parse.observations(data)),
    },
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
