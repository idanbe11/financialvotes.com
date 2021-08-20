import React from 'react';

// reactstrap components
import { Card, CardBody, CardTitle, Container, Row, Col } from 'reactstrap';

function AuthHeader() {
  return (
    <>
      <div className="header bg-gradient-success pb-8 pt-5 pt-md-8">
        <Container fluid>
          <div className="header-body">
            <Row />
          </div>
        </Container>
      </div>
    </>
  );
}

export default AuthHeader;
