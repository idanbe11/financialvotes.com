import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/client';
// reactstrap components
import {
  Card,
  CardHeader,
  CardBody,
  Progress,
  Container,
  Row,
  Col,
  Badge
} from 'reactstrap';
import moment from 'moment';
import classNames from 'classnames';
// layout for this page
import Auth from 'layouts/Auth';
import AuthHeader from 'components/Headers/AuthHeader';
import { getOneOrder } from 'lib/api';

const order = {
  type: 'Coin_Promotion',
  status: 'Pending',
  created: '2021-08-26T07:04:26.045Z',
  userNote: 'Some test note!',
  discounted_price: 100,
  base_price: 120,
  orderItemText: 'Coin Promotion (Test Coin) x 1',
  entityId: 'sdjsnvsj',
  id: '61273cfa09e88506fccc2f2c'
};

const OrderStatus = ({ pageData, error }) => {
  const router = useRouter();

  const [initial, setInitial] = useState(true);
  const [dataLoading, setLoading] = useState(false);
  const [fetched, setFetched] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [orderData, setOrderData] = useState({});
  const [session, loading] = useSession();

  // console.log(router.query, orderId, orderData);

  useEffect(() => {
    if (initial && !!router.query.ref && router.query.ref !== '') {
      setOrderId(router.query.ref);
      setInitial(false);
    }
  }, [initial, router]);

  useEffect(() => {
    const fetchOrder = async (id) => {
      const data = await getOneOrder(id, session.jwt);
      setOrderData(data);
      setFetched(true);
      setLoading(false);
    };
    if (!fetched && !loading && !initial && !!session.jwt && orderId !== '') {
      setLoading(true);
      fetchOrder(orderId);
    }
  }, [session, loading, fetched, orderId]);

  if (!initial && dataLoading) {
    return (
      <>
        <AuthHeader />
        {/* Page content */}
        <Container className="mt--7" fluid>
          <Row>
            <Col className="order-xl-1 p-5 m-5 text-center" xl="8">
              <h2 className="my-2">Loading...</h2>
            </Col>
          </Row>
        </Container>
      </>
    );
  }

  if (!initial && fetched && !orderData) {
    router.push('/auth/overview');
    return <div />;
  }

  return (
    <>
      <AuthHeader />
      {/* Page content */}
      <Container className="mt--7" fluid>
        <Row>
          <Col className="order-xl-2 mb-5 mb-xl-0" xl="4">
            <Card className="card-profile shadow">
              <CardBody className="pt-md-4">
                <Row>
                  <div className="col">
                    {/* Order Metas? */}
                    {orderData !== {} && !!orderData.type && (
                      <>
                        <Row>
                          <Col>
                            <h4 className="text-teal">Order ({order.id})</h4>
                          </Col>
                          <Col>
                            {orderData.type === 'Advert' && (
                              <Badge color="warning">Advertisement</Badge>
                            )}
                            {orderData.type === 'Coin_Promotion' && (
                              <Badge color="warning">Coin Promotion</Badge>
                            )}
                          </Col>
                        </Row>
                        <Row>
                          <div className="container my-2">
                            <Row className="mt-2">
                              <Col>
                                <h4>
                                  Order Status:
                                  <span
                                    className={classNames(
                                      'mx-2',
                                      {
                                        'text-success': orderData.status === 'Completed'
                                      },
                                      { 'text-info': orderData.status === 'Pending' },
                                      { 'text-danger': orderData.status === 'Canceled' }
                                    )}
                                  >
                                    {orderData.status}
                                  </span>
                                </h4>
                              </Col>
                            </Row>
                            <Row>
                              <Col sm={12} md={6} lg={12}>
                                <small>
                                  Placed: {moment(orderData.createdAt).format('llll')}
                                </small>
                              </Col>
                              <Col sm={12} md={6} lg={12}>
                                <small>
                                  Updated: {moment(orderData.updatedAt).fromNow()}
                                </small>
                              </Col>
                            </Row>
                            {!!orderData.walletAddress && orderData.walletAddress !== '' && (
                              <Row className="mt-3">
                                <Col>
                                  <h4>From Wallet Address:</h4>
                                  <p>{orderData.walletAddress}</p>
                                </Col>
                              </Row>
                            )}
                            {!!orderData.userNote && orderData.userNote !== '' && (
                              <Row className="mt-3">
                                <Col>
                                  <h4>Order Note:</h4>
                                  <p>{orderData.userNote}</p>
                                </Col>
                              </Row>
                            )}
                          </div>
                        </Row>
                      </>
                    )}
                  </div>
                </Row>
              </CardBody>
            </Card>
          </Col>
          <Col className="order-xl-1" xl="8">
            <Card className="bg-secondary shadow">
              <CardHeader className="bg-white border-0">
                <Row className="align-items-center">
                  <Col xs="8">
                    <h2 className="my-2">Order Details</h2>
                  </Col>
                </Row>
              </CardHeader>
              <CardBody>
                <div className="p-3">
                  <Row>
                    <Col>
                      <p className="heading">{orderData.orderItemText}</p>
                    </Col>
                    <Col className="text-right">
                      <h4>x {orderData.selectedDays}</h4>
                    </Col>
                  </Row>
                  <hr className="my-2" />
                  <Row>
                    <Col>
                      <p>Unit price</p>
                    </Col>
                    <Col className="text-right">
                      <h4>
                        {Intl.NumberFormat('en-US', {
                          style: 'currency',
                          currency: 'USD'
                        }).format(orderData.base_price)}
                      </h4>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <p>
                        Discount (
                        <span className="text-muted small">
                          {((orderData.base_price * orderData.selectedDays -
                            orderData.discounted_price) /
                            (orderData.base_price * orderData.selectedDays)) *
                            100}
                          %
                        </span>
                        )
                      </p>
                    </Col>
                    <Col className="text-right">
                      <h4>
                        {Intl.NumberFormat('en-US', {
                          style: 'currency',
                          currency: 'USD'
                        }).format(
                          orderData.base_price * orderData.selectedDays -
                            orderData.discounted_price
                        )}
                      </h4>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <p>Total after discount</p>
                    </Col>
                    <Col className="text-right">
                      <h4>
                        {Intl.NumberFormat('en-US', {
                          style: 'currency',
                          currency: 'USD'
                        }).format(orderData.discounted_price)}
                      </h4>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <p>
                        VAT (
                        <span className="text-muted small">
                          {orderData.tax_percentage}%
                        </span>
                        )
                      </p>
                    </Col>
                    <Col className="text-right">
                      <h4>
                        {Intl.NumberFormat('en-US', {
                          style: 'currency',
                          currency: 'USD'
                        }).format(orderData.tax_amount)}
                      </h4>
                    </Col>
                  </Row>
                  <hr className="mt-0" />
                  <Row>
                    <Col>
                      <h3>Total</h3>
                    </Col>
                    <Col className="text-right">
                      <h3>
                        {Intl.NumberFormat('en-US', {
                          style: 'currency',
                          currency: 'USD'
                        }).format(orderData.total)}
                      </h3>
                    </Col>
                  </Row>
                  <h5 className="text-muted mt-4">
                    {'*Note: All payments are paid through cryptocurrency'}
                  </h5>
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

// export async function getStaticProps(context) {
//   try {
//     const pageData = await getOrderPageData();
//     return {
//       props: { pageData }
//     };
//   } catch (error) {
//     return { error };
//   }
// }

OrderStatus.layout = Auth;
OrderStatus.protected = true;

export default OrderStatus;
