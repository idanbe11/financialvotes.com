import React from 'react';
import { Container, Row } from 'reactstrap';
// layout for this page
import Guest from 'layouts/Guest';
import CoinTable from 'components/CoinTable/CoinTable';
import Advertisement from 'components/Advertisement/Advertisement';
import { getAllPromotedCoins, getTodaysBestCoins } from 'lib/api';

const Dashboard = (props) => {
  return (
    <>
      {/* <Header /> */}
      {/* Page content */}
      <Container>
        <Row>
          <div className="col-12 col-md-6 col-lg-6">
            <h1>FinancialVotes.com</h1>
            <h2 className="title">All Round Best Coins</h2>
            <h3>Most voted coins all time around the globe</h3>
          </div>
          <div className="col-lg-6 col-12">
            <Advertisement source="Homepage" />
          </div>
        </Row>
        <CoinTable title={'Promoted Coins'} getter={getAllPromotedCoins} />
        <CoinTable getter={getTodaysBestCoins} />
      </Container>
    </>
  );
};

Dashboard.layout = Guest;

export default Dashboard;
