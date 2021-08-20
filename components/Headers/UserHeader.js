import React from 'react';

// reactstrap components
import { Button, Container, Row, Col } from 'reactstrap';

function UserHeader() {
  return (
    <div className="header pb-8 pt-5 pt-md-8 d-flex align-items-center">
      {/* Mask */}
      <span className="mask bg-gradient-default opacity-8" />
    </div>
  );
}

export default UserHeader;
