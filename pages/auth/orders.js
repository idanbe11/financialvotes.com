import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import moment from 'moment';
import { useSession } from 'next-auth/client';
// reactstrap components
import { Card, CardHeader, Table, Container, Row, Col, CardBody } from 'reactstrap';
// layout for this page
import Auth from 'layouts/Auth';

import AuthHeader from 'components/Headers/AuthHeader';
import { getMyOrders } from 'lib/api';

const orders = [
  {
    type: 'Coin Promotion',
    created: '2021-08-10',
    status: 'Verified',
    active: false
  },
  {
    type: 'Coin Promotion',
    created: '2021-08-11',
    status: 'Verified',
    active: true
  },
  {
    type: 'Advertisement',
    created: '2021-08-11',
    status: 'Pending',
    active: false
  }
];

const TableItem = ({ id, type, created, status, active }) => (
  <tr>
    <th scope="row">
      <Link href={`/auth/orders/status?ref=${id}`}>{type}</Link>
    </th>
    <td>{status}</td>
    <td>{String(active).toUpperCase()}</td>
    <td>{moment(new Date(created)).fromNow()}</td>
  </tr>
);

const Orders = (props) => {
  const [myOrders, setMyOrders] = useState(undefined);
  const [fetched, setFetched] = useState(false);

  const [session, loading] = useSession();

  useEffect(() => {
    const fetchMyOrders = async () => {
      const data = await getMyOrders(session.jwt);
      setMyOrders(data);
      setFetched(true);
    };
    if (!fetched && !loading && !!session.jwt) {
      fetchMyOrders();
    }
  }, [session, loading, fetched]);

  return (
    <>
      <AuthHeader />
      {/* Page content */}
      <Container className="mt--7" fluid>
        <Row className="mt-5">
          <Col className="mb-5 mb-xl-0" xl="12">
            <Card className="shadow">
              <CardHeader className="border-0">
                <Row className="align-items-center">
                  <div className="col">
                    <h3 className="mb-0">My Orders</h3>
                  </div>
                </Row>
              </CardHeader>
              {fetched && !!myOrders && Array.isArray(myOrders) && myOrders.length > 0 ? (
                <Table className="align-items-center table-flush" responsive>
                  <thead className="thead-light">
                    <tr>
                      <th scope="col">Type</th>
                      <th scope="col">Status</th>
                      <th scope="col">Active</th>
                      <th scope="col">Created</th>
                    </tr>
                  </thead>
                  <tbody>
                    {myOrders.map((order, index) => {
                      return (
                        <TableItem
                          key={index}
                          //key={order.id}
                          id={order.id}
                          type={order.type}
                          created={order.created}
                          status={order.status}
                          active={order.status === 'Completed'}
                        />
                      );
                    })}
                  </tbody>
                </Table>
              ) : fetched ? (
                <CardBody>
                  <div className="text-center my-5">
                    <h3 className="text-light">No orders so far!</h3>
                  </div>
                </CardBody>
              ) : (
                <CardBody>
                  <div className="text-center my-5">
                    <h3 className="text-light">Please wait...</h3>
                  </div>
                </CardBody>
              )}
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

Orders.layout = Auth;
Orders.protected = true;

export default Orders;
