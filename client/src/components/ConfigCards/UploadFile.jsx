import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";

function UploadFile(props) {
  const { name, title, sendFilePath, dataHandler } = props.details;

  const [file, setFile] = useState();

  const handleSubmit = (e) => {
    e.preventDefault();
    sendFilePath(file.path)
      .then((data) => {
        dataHandler(data);
      })
      .catch((err) => {
        console.error(err);
      });
  };
  return (
    <Form onSubmit={handleSubmit} inline>
      <Form.Group>
        <Form.File
          className="position-relative"
          required
          name={title}
          label={title}
          onChange={(e) => setFile(e.target.files[0])}
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
