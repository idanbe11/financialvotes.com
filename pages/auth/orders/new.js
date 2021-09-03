import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
// reactstrap components
import {
  Button,
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
import Select from 'react-select';
// layout for this page
import Auth from 'layouts/Auth';
import AuthHeader from 'components/Headers/AuthHeader';
import RichText from 'components/Elements/RichText';
import { getMyCoins, getOrderPageData, createOrder } from 'lib/api';
import { useSession } from 'next-auth/client';

const NewOrder = ({ pageData, error }) => {
  const router = useRouter();

  if (!!error || !pageData) {
    router.push('/auth/overview');
    return <div />;
  }

  const {
    title,
    subtitle,
    walletDetails,
    instructions,
    warningMessage,
    advertisementPackage,
    coinPromoPackage
  } = pageData;

  console.log('NEW ORDER!!!', pageData);
  const [orderType, setOrderType] = useState('');
  const [accept, setAccept] = useState(false);
  const [initial, setInitial] = useState(true);
  const [orderItemText, setOrderItemText] = useState('');
  const [advertLink, setAdvertLink] = useState('');
  const [bannar, setBanner] = useState(undefined);
  const [selectedCoin, setSelectedCoin] = useState('');
  const [price, setPrice] = useState(0);
  const [myCoins, setMyCoins] = useState([]);
  const [fetched, setFetched] = useState(false);
  const [session, loading] = useSession();

  console.log(router.query, orderType);

  useEffect(() => {
    const fetchMyCoins = async () => {
      const data = await getMyCoins(session.jwt);
      setMyCoins(data);
      setFetched(true);
    };
    if (!fetched && !loading && !!session.jwt) {
      console.log(session);
      fetchMyCoins();
    }
  }, [session, loading, fetched]);

  useEffect(() => {
    if (
      initial &&
      !!router.query.type &&
      router.query.type !== orderType &&
      (router.query.type === 'advert' || router.query.type === 'coin-promo')
    ) {
      setOrderType(router.query.type);
      setInitial(false);
    }
  }, [initial, orderType, router]);

  const orderOptions = [
    { value: 'advert', label: 'Advertisement' },
    { value: 'coin-promo', label: 'Coin Promotion' }
  ];

  const getValue = (value) => {
    const selectedValue = orderOptions.filter((option) => option.value === value);
    return selectedValue?.[0];
  };

  const getNormalizedPackageOptions = (packageItem, attribute) => {
    let items = [];
    if (!!packageItem && !!packageItem[attribute]) {
      items = packageItem[attribute].map((option) => ({
        value: option.discount_percentage,
        label: `${option.no_of_days} Days ${
          !!option.discount_hint ? ` (${option.discount_hint})` : ''
        }`
      }));
    }
    return items;
  };

  const getNormalizedCoins = () => {
    let items = [];
    if (myCoins.length > 0) {
      items = myCoins.map((option) => ({
        value: option.id,
        label: `${option.name} (${option.symbol})`
      }));
    }
    return items;
  };

  const onSubmitHandler = async () => {
    if (orderType === 'advert') {
      // create advert
      // create order
    } else if (orderType === 'coin-promo') {
      // create order
      const orderPayload = {
        type: 'Coin_Promotion',
        orderItemText,
        entityId: selectedCoin,
        base_price: coinPromoPackage.basePrice,
        discounted_price: price,
        userNote: ''
      };
      const res = await createOrder(orderPayload, session.jwt);
      if (!!res && !!res.id) {
        setLoading(false);
        notify('success', 'Success!', 'Your request is submitted!');
        setTimeout(() => {
          router.push('/auth/orders');
        }, 500);
      } else {
        setLoading(false);
        notify('danger', 'Error!', 'Invalid request! Please double check the details.');
      }
    }
  };

  console.log(accept, price, getNormalizedCoins(), myCoins);

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
                    {!!warningMessage && !!warningMessage.content && (
                      <RichText content={warningMessage.content} />
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
                    <h2 className="my-2">{title}</h2>
                  </Col>
                </Row>
              </CardHeader>
              <CardBody>
                <h6 className="heading-small text-muted mb-4">{subtitle}</h6>
                <div className="p-3">
                  <Row>
                    {!!instructions && !!instructions.content && (
                      <RichText content={instructions.content} />
                    )}
                  </Row>
                </div>
                <div className="p-3">
                  <Row>{!!walletDetails && <RichText content={walletDetails} />}</Row>
                </div>
                <div className="py-3">
                  <Form onSubmit={() => onSubmitHandler()}>
                    <h6 className="heading-small text-muted mb-4">Order Type</h6>
                    <div className="pl-lg-4">
                      <Row>
                        <Col lg="6">
                          <FormGroup>
                            <label
                              className="form-control-label"
                              htmlFor="input-username"
                            >
                              Choose *
                            </label>
                            <Select
                              options={orderOptions}
                              defaultInputValue={orderType}
                              value={getValue(orderType)}
                              onChange={(option) => {
                                setOrderType(option.value);
                                setPrice(0);
                              }}
                            />
                          </FormGroup>
                        </Col>
                      </Row>
                    </div>
                    {orderType === 'advert' && (
                      <>
                        <hr className="my-4" />
                        {/* Info */}
                        <h6 className="heading-small text-muted mb-4">
                          Advertisement Information
                        </h6>
                        <div className="pl-lg-4">
                          <Row>
                            <Col md="12">
                              <FormGroup>
                                <label
                                  className="form-control-label"
                                  htmlFor="link-input"
                                >
                                  Link *
                                </label>
                                <Input
                                  className="form-control-alternative"
                                  value={advertLink}
                                  onChange={(e) => {
                                    e.preventDefault();
                                    setAdvertLink(e.target.value);
                                  }}
                                  id="link-input"
                                  placeholder="https://youraffiliatelink.business"
                                  type="text"
                                />
                              </FormGroup>
                            </Col>
                          </Row>
                          <Row>
                            <Col md="12">
                              <FormGroup>
                                <label
                                  className="form-control-label"
                                  htmlFor="banner-image-input"
                                >
                                  Banner *
                                </label>
                                <Input
                                  className="form-control-alternative"
                                  // disabled={formLoading}
                                  //formNoValidate={formErrors.logo !== ''}
                                  id="banner-image-input"
                                  type="file"
                                  onChange={(e) => {
                                    e.preventDefault();
                                    setBanner(e.target.files[0]);
                                  }}
                                ></Input>
                                {/* {!!formErrors.logo && formErrors.logo !== '' && (
                                <small className="text-orange">{formErrors.logo}</small>
                              )} */}
                              </FormGroup>
                            </Col>
                          </Row>
                        </div>
                        <hr className="my-4" />
                        {/* Package */}
                        <h6 className="heading-small text-muted mb-4">Select Package</h6>
                        <div className="pl-lg-4">
                          <Row>
                            <Col md="12">
                              <h2>Price: ${advertisementPackage.basePrice}</h2>
                              <FormGroup>
                                <label
                                  className="form-control-label"
                                  htmlFor="input-address"
                                >
                                  Choose *
                                </label>
                                <Select
                                  options={getNormalizedPackageOptions(
                                    advertisementPackage,
                                    'priceOptions'
                                  )}
                                  // defaultInputValue={orderType}
                                  onChange={(option) =>
                                    setPrice(
                                      advertisementPackage.basePrice *
                                        (100 - option.value) *
                                        0.01
                                    )
                                  }
                                />
                              </FormGroup>
                            </Col>
                          </Row>
                        </div>
                      </>
                    )}
                    {orderType === 'coin-promo' && (
                      <>
                        <hr className="my-4" />
                        {/* Info */}
                        <h6 className="heading-small text-muted mb-4">Select Coin</h6>
                        <div className="pl-lg-4">
                          <Row>
                            <Col>
                              {myCoins !== [] ? (
                                <FormGroup>
                                  <label
                                    className="form-control-label"
                                    htmlFor="input-address"
                                  >
                                    Choose *
                                  </label>
                                  <Select
                                    options={getNormalizedCoins()}
                                    // defaultInputValue={orderType}
                                    onChange={(option) => {
                                      setSelectedCoin(option.value);
                                      const coin = myCoins.filter(
                                        (coin) => coin.id === option.value
                                      );
                                      if (!!coin && coin.length > 0) {
                                        setOrderItemText(
                                          `Coin Promotion (${coin[0].name}) x 1`
                                        );
                                      }
                                    }}
                                  />
                                </FormGroup>
                              ) : (
                                <h3>
                                  You don't currently have any coin. Please submit your
                                  coin through
                                  <Link href="/auth/coins/new">here</Link>
                                </h3>
                              )}
                            </Col>
                          </Row>
                        </div>
                        <hr className="my-4" />
                        {/* Package */}
                        <h6 className="heading-small text-muted mb-4">Select Package</h6>
                        <div className="pl-lg-4">
                          <Row>
                            <Col md="12">
                              <FormGroup>
                                <h2>Price: ${coinPromoPackage.basePrice}</h2>
                                <label
                                  className="form-control-label"
                                  htmlFor="input-address"
                                >
                                  Choose *
                                </label>
                                <Select
                                  options={getNormalizedPackageOptions(
                                    coinPromoPackage,
                                    'priceOptions'
                                  )}
                                  // defaultInputValue={orderType}
                                  onChange={(option) =>
                                    setPrice(
                                      coinPromoPackage.basePrice *
                                        (100 - option.value) *
                                        0.01
                                    )
                                  }
                                />
                              </FormGroup>
                            </Col>
                          </Row>
                        </div>
                      </>
                    )}
                    {price !== 0 && (
                      <>
                        <hr className="my-4" />
                        {/* Summary */}
                        <h6 className="heading-small text-muted mb-4">Order Summary</h6>
                        <div className="pl-lg-4">
                          <Container>
                            <Row>
                              <Col xs="12" sm="4">
                                <h4 className="mr-3">Item:</h4>
                              </Col>
                              <Col>
                                <p className="text-muted">{orderItemText}</p>
                              </Col>
                            </Row>
                            <Row>
                              <Col xs="12" sm="4">
                                <h4 className="mr-3">Price:</h4>
                              </Col>
                              <Col>
                                <p className="text-muted">
                                  {orderType === 'advert' &&
                                    !!advertisementPackage &&
                                    advertisementPackage.basePrice !== 0 &&
                                    `$${advertisementPackage.basePrice}`}
                                  {orderType === 'coin-promo' &&
                                    !!coinPromoPackage &&
                                    coinPromoPackage.basePrice !== 0 &&
                                    `$${coinPromoPackage.basePrice}`}
                                </p>
                              </Col>
                            </Row>
                            <Row>
                              <Col xs="12" sm="4">
                                <h4 className="mr-3">Total:</h4>
                              </Col>
                              <Col>
                                <h4 className="text-semibold">
                                  {price !== 0 && `$${price}`}
                                </h4>
                              </Col>
                            </Row>
                          </Container>
                        </div>
                      </>
                    )}
                    {orderType !== '' && (
                      <>
                        <hr className="my-4" />
                        {/* Submission */}
                        <h6 className="heading-small text-muted mb-4">Confirm</h6>
                        <div className="pl-lg-4">
                          <FormGroup>
                            <div
                              className="custom-control custom-checkbox mb-3"
                              style={{ zIndex: 0 }}
                            >
                              <input
                                className=" custom-control-input"
                                id="terms-checkbox"
                                value={accept}
                                onChange={() => setAccept(!accept)}
                                type="checkbox"
                                style={{ zIndex: 0 }}
                              ></input>
                              <label
                                className="custom-control-label"
                                htmlFor="terms-checkbox"
                              >
                                <span>
                                  I accept the FinancialVotes{' '}
                                  <Link href="/terms-and-conditions">
                                    Terms and Conditions
                                  </Link>
                                  .
                                </span>
                              </label>
                            </div>
                            <Button
                              className="my-4"
                              //disabled={formLoading}
                              color="primary"
                              type="submit"
                              // onClick={(e) => {
                              //   e.preventDefault();
                              //   handleSubmit();
                              // }}
                            >
                              {/* {loading ? 'Loading...' : 'Submit'} */}
                              Submit
                            </Button>
                          </FormGroup>
                        </div>
                      </>
                    )}
                  </Form>
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export async function getStaticProps(context) {
  try {
    const pageData = await getOrderPageData();
    return {
      props: { pageData }
    };
  } catch (error) {
    return { error };
  }
}

NewOrder.layout = Auth;
NewOrder.protected = true;

export default NewOrder;
