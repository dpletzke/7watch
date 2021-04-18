import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";

function UploadFile(props) {
  const { name, title } = props.details;

  const [fileName, setFileName] = useState("Upload Boundary File");

  const handleSubmit = (e) => {
    console.log(e.target, e.target.files, fileName);
    e.preventDefault();
  };
  return (
    <Form onSubmit={handleSubmit} inline>
      <Form.Group>
        <Form.File
          className="position-relative"
          required
          name="file"
          label="File"
          onChange={(e) => setFileName(e.target.files[0].name)}
          id={name}
        />
      </Form.Group>
      <Button className="btn-fill pull-right" type="submit" variant="warning">
        Upload
      </Button>
    </Form>
  );
}

export default UploadFile;
