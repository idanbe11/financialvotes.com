import React, { Component } from 'react';
import Error from 'next/error';
import { Col, Container, Row } from 'reactstrap';
import Guest from 'layouts/Guest';

export default function Page({ errorCode }) {
  if (errorCode) {
    return <Error statusCode={errorCode} />;
  }

  return (
    <Container>
      <Row>
        <Col className="my-3">
          <h2 className="my-5 py-5 text-center">404 | Page Not Found</h2>
        </Col>
      </Row>
    </Container>
  );
}

Page.layout = Guest;
