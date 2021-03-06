import React, { Component } from "react";
import { Container } from "react-bootstrap";

class Footer extends Component {
  render() {
    return (
      <footer className="footer px-0 px-lg-3">
        <Container fluid>
          <nav>
            <p className="copyright text-center">
              v0.1 - © {new Date().getFullYear()}{" "}
              <a
                href="http://www.github.com/dpletzke"
                rel="noreferrer"
                target="_blank"
              >
                Dan J Pletzke
              </a>
            </p>
          </nav>
        </Container>
      </footer>
    );
  }
}

export default Footer;
