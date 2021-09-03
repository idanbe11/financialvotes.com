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
  Form,
  Input,
  FormGroup
} from 'reactstrap';
// layout for this page
import Auth from 'layouts/Auth';
import AuthHeader from 'components/Headers/AuthHeader';
import RichText from 'components/Elements/RichText';
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

  console.log(router.query, orderId, orderData);

  if (!initial && fetched) {
    router.push('/auth/overview');
    return <div />;
  }

  // useEffect(() => {
  //   const fetchOrder = async (id) => {
  //     const data = await getOneOrder(id, session.jwt);
  //     console.log(data);
  //     setOrderData(data);
  //     setFetched(true);
  //     setLoading(false);
  //   };
  //   if (!fetched && !loading && !initial && !!session.jwt && orderId !== '') {
  //     setLoading(true);
  //     fetchOrder(orderId);
  //   }
  // }, [session, loading, fetched]);

  useEffect(() => {
    if (initial && !!router.query.ref && router.query.ref !== '') {
      setOrderId(router.query.ref);
      setInitial(false);
    }
  }, [initial, router]);

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
                    {/* {!!warningMessage && !!warningMessage.content && (
                      <RichText content={warningMessage.content} />
                    )} */}
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
                    <h2 className="my-2">{'title'}</h2>
                  </Col>
                </Row>
              </CardHeader>
              <CardBody>
                <h6 className="heading-small text-muted mb-4">{'subtitle'}</h6>
                <div className="p-3">
                  <Row>
                    {/* {!!instructions && !!instructions.content && (
                      <RichText content={instructions.content} />
                    )} */}
                  </Row>
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
