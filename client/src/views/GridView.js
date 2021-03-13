import React from "react";
import ChartistGraph from "react-chartist";
// react-bootstrap components

import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import GridContainer from "../components/Grid/GridContainer";

function GridView() {
  return (
    <Container fluid>
      {/* <Card> */}
      <GridContainer />
      {/* </Card> */}
    </Container>
  );
}

export default GridView;
