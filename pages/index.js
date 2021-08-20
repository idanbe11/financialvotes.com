import React from 'react';
// layout for this page
import Guest from 'layouts/Guest';
import PromotionTable from 'components/CoinTable/PromotedTable';
import CoinTable from 'components/CoinTable/CoinTable';
import { Container } from 'reactstrap';

const Dashboard = (props) => {
  return (
    <>
      {/* <Header /> */}
      {/* Page content */}
      <Container>
        <PromotionTable />
        <CoinTable />
      </Container>
    </>
  );
};

Dashboard.layout = Guest;

export default Dashboard;
