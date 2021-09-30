import React, { useEffect, useRef, useState } from 'react';
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
import { useSession } from 'next-auth/client';
// layout for this page
import Auth from 'layouts/Auth';
import AuthHeader from 'components/Headers/AuthHeader';
import RichText from 'components/Elements/RichText';
// react plugin for creating notifications over the dashboard
import NotificationAlert from 'react-notification-alert';
import { getMyCoins, getOrderPageData, submitAdvertisement, createOrder } from 'lib/api';

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

  const [orderType, setOrderType] = useState('');
  const [accept, setAccept] = useState(false);
  const [initial, setInitial] = useState(true);
  const [orderItemText, setOrderItemText] = useState('');
  const [advertLink, setAdvertLink] = useState('');
  const [banner, setBanner] = useState(undefined);
  const [bannerError, setBannerError] = useState(undefined);
  const [selectedCoin, setSelectedCoin] = useState('');
  const [price, setPrice] = useState(0);
  const [discountedPrice, setDiscountedPrice] = useState(0);
  const [selectedDays, setSelectedDays] = useState(0);
  const [myCoins, setMyCoins] = useState([]);
  const [fetched, setFetched] = useState(false);
  const [session, loading] = useSession();
  const [orderLoading, setLoading] = useState(false);
  const notificationAlertRef = useRef();

  const notify = (type, title, content) => {
    let options = {
      place: 'bc',
      message: (
        <div className="alert-text">
          <span className="alert-title" data-notify="title">
            {`${title} `}
          </span>
          <span data-notify="message">{content}</span>
        </div>
      ),
      type: type,
      icon: 'ni ni-bell-55',
      autoDismiss: 7
    };
    notificationAlertRef.current.notificationAlert(options);
  };
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
      if (router.query.type === 'advert') {
        setOrderItemText('Advertisement');
      }
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
        }`,
        days: option.no_of_days
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
    if (orderType === 'advert' && accept && advertLink !== '' && !!banner) {
      if (!banner.type.startsWith('image')) {
        setBannerError('Only images or gifs are allowed!');
      } else {
        setBannerError(undefined);
        // create advert
        const advert = {
          link: advertLink,
          no_of_days: selectedDays,
          start: new Date()
        };
        console.log(advert);
        const createdAdvertisement = await submitAdvertisement(
          advert,
          banner,
          session.jwt
        );
        console.log(createdAdvertisement);
        const orderPayload = {
          type: 'Advert',
          orderItemText,
          entityId: createdAdvertisement.id,
          packageId: advertisementPackage.id,
          base_price: advertisementPackage.basePrice,
          discount: advertisementPackage.basePrice - discountedPrice,
          discounted_price: discountedPrice,
          tax_amount: price - discountedPrice,
          tax_percentage: advertisementPackage.taxPercentage,
          total: price,
          userNote: '',
          selectedDays
        };
        console.log(orderPayload);
        // create order
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
    } else if (orderType === 'coin-promo' && accept) {
      // create order
      const orderPayload = {
        type: 'Coin_Promotion',
        orderItemText,
        entityId: selectedCoin,
        packageId: coinPromoPackage.id,
        base_price: coinPromoPackage.basePrice,
        discount: coinPromoPackage.basePrice - discountedPrice,
        discounted_price: discountedPrice,
        tax_amount: price - discountedPrice,
        tax_percentage: coinPromoPackage.taxPercentage,
        total: price,
        userNote: '',
        selectedDays
      };
      console.log(orderPayload);
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

  const handlePriceChange = (discount) => {
    if (orderType === 'advert') {
      const discounted_price = advertisementPackage.basePrice * (100 - discount) * 0.01;
      const totalPrice =
        (100 + advertisementPackage.taxPercentage) * 0.01 * discounted_price;
      setDiscountedPrice(discounted_price);
      setPrice(totalPrice);
    } else if (orderType === 'coin-promo') {
      const discounted_price = coinPromoPackage.basePrice * (100 - discount) * 0.01;
      const totalPrice = (100 + coinPromoPackage.taxPercentage) * 0.01 * discounted_price;
      setDiscountedPrice(discounted_price);
      setPrice(totalPrice);
    }
  };

  const handleSelectedDayChange = (days) => {
    setSelectedDays(days);
  };

  console.log(
    accept,
    price,
    discountedPrice,
    selectedDays,
    (orderType === 'advert' && advertisementPackage.basePrice !== discountedPrice) ||
      (orderType === 'coin-promo' && coinPromoPackage.basePrice !== discountedPrice)
  );

  return (
    <>
      <AuthHeader />
      {/* Page content */}
      <div className="rna-wrapper">
        <NotificationAlert ref={notificationAlertRef} />
      </div>
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
                  <Form
                    onSubmit={(e) => {
                      e.preventDefault();
                      onSubmitHandler();
                    }}
                  >
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
                                if (option.value === 'advert') {
                                  setOrderItemText('Advertisement');
                                }
                                setPrice(0);
                              }}
                              isDisabled={orderLoading}
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
                                  disabled={orderLoading}
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
                                <br />
                                <span className="text-primary mt-3">
                                  {
                                    "Add an image or a gif with the resolution of 320x120 resolution, we'll resize otherwise from our best."
                                  }
                                </span>
                                <br />
                                <Input
                                  className="form-control-alternative"
                                  // disabled={formLoading}
                                  formNoValidate={bannerError !== ''}
                                  id="banner-image-input"
                                  type="file"
                                  onChange={(e) => {
                                    e.preventDefault();
                                    setBanner(e.target.files[0]);
                                  }}
                                  accept="image/*"
                                  disabled={orderLoading}
                                ></Input>
                                {!!bannerError && bannerError !== '' && (
                                  <small className="text-danger">{bannerError}</small>
                                )}
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
                                  onChange={(option) => {
                                    handleSelectedDayChange(option.days);
                                    handlePriceChange(option.value);
                                  }}
                                  isDisabled={orderLoading}
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
                                    onChange={(option) => {
                                      setSelectedCoin(option.value);
                                      const coin = myCoins.filter(
                                        (coin) => coin.id === option.value
                                      );
                                      if (!!coin && coin.length > 0) {
                                        setOrderItemText(
                                          `Coin Promotion (${coin[0].name})`
                                        );
                                      }
                                    }}
                                    isDisabled={orderLoading}
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
                                  onChange={(option) => {
                                    handleSelectedDayChange(option.days);
                                    handlePriceChange(option.value);
                                  }}
                                  isDisabled={orderLoading}
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
                              <Col xs="6" sm="4">
                                <h4 className="mr-3">Item:</h4>
                              </Col>
                              <Col xs="12" md="6">
                                <p className="text-muted text-right">{orderItemText}</p>
                              </Col>
                            </Row>
                            <Row>
                              <Col xs="6" sm="4">
                                <h4 className="mr-3">Price:</h4>
                              </Col>
                              <Col xs="6" sm="4" md="6">
                                <p className="text-muted text-right">
                                  {orderType === 'advert' &&
                                    !!advertisementPackage &&
                                    advertisementPackage.basePrice !== 0 &&
                                    `${Intl.NumberFormat('en-US', {
                                      style: 'currency',
                                      currency: 'USD'
                                    }).format(advertisementPackage.basePrice)}`}
                                  {orderType === 'coin-promo' &&
                                    !!coinPromoPackage &&
                                    coinPromoPackage.basePrice !== 0 &&
                                    `${Intl.NumberFormat('en-US', {
                                      style: 'currency',
                                      currency: 'USD'
                                    }).format(coinPromoPackage.basePrice)}`}
                                </p>
                              </Col>
                            </Row>
                            {(orderType === 'advert' &&
                              advertisementPackage.basePrice !== discountedPrice) ||
                            (orderType === 'coin-promo' &&
                              coinPromoPackage.basePrice !== discountedPrice) ? (
                              <Row>
                                <Col xs="6" sm="4">
                                  <h4 className="mr-3">Price after discount:</h4>
                                </Col>
                                <Col xs="6" sm="4" md="6">
                                  <p className="text-muted text-right">
                                    {Intl.NumberFormat('en-US', {
                                      style: 'currency',
                                      currency: 'USD'
                                    }).format(discountedPrice)}
                                  </p>
                                </Col>
                              </Row>
                            ) : null}
                            <Row>
                              <Col xs="6" sm="4">
                                <h4 className="mr-3">VAT</h4>
                              </Col>
                              <Col xs="6" sm="4" md="6">
                                <p className="text-muted text-right">
                                  {Intl.NumberFormat('en-US', {
                                    style: 'currency',
                                    currency: 'USD'
                                  }).format(price - discountedPrice)}
                                </p>
                              </Col>
                            </Row>
                            <Row>
                              <Col xs="6" sm="4">
                                <h3 className="mr-3">Total:</h3>
                              </Col>
                              <Col xs="6" sm="4" md="6">
                                <h3 className="text-semibold text-right">
                                  {price !== 0 &&
                                    `${Intl.NumberFormat('en-US', {
                                      style: 'currency',
                                      currency: 'USD'
                                    }).format(price)}`}
                                </h3>
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
                              disabled={orderLoading}
                              color="primary"
                              type="submit"
                              onClick={(e) => {
                                e.preventDefault();
                                onSubmitHandler();
                              }}
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
