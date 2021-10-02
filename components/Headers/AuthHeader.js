import React from 'react';

// reactstrap components
import { Container, Row } from 'reactstrap';
import Advertisement from 'components/Advertisement/Advertisement';

function AuthHeader({ showAd = false, source = 'Home' }) {
  return (
    <>
      <div className="header bg-gradient-success pb-8 pt-5 pt-md-8">
        <Container fluid>
          <div className="header-body">
            <Row />
            {showAd && (
              <Row>
                <div className="col-12 col-md-6 col-lg-7">
                  <h1>FinancialVotes.com</h1>
                  <h2 className="title">All Round Best Coins</h2>
                </div>
                <div className="col-lg-5 col-12">
                  <Advertisement source={source} />
                </div>
              </Row>
            )}
          </div>
        </Container>
      </div>
    </>
  );
}

export default AuthHeader;
