import React, { useRef, useState } from 'react';
// reactstrap components
import {
  Alert,
  Button,
  Card,
  CardHeader,
  CardBody,
  Container,
  Row,
  Col,
  Form,
  FormGroup,
  Input,
  FormFeedback
} from 'reactstrap';
// react plugin for creating notifications over the dashboard
import NotificationAlert from 'react-notification-alert';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/client';
// layout for this page
import Auth from 'layouts/Auth';

import AuthHeader from 'components/Headers/AuthHeader';
import { getCoinInstructions, submitCoin } from 'lib/api';
import RichText from 'components/Elements/RichText';

const NewCoin = ({ pageData, error }) => {
  const router = useRouter();

  if (!!error || !pageData) {
    router.push('/auth/overview');
    return <div />;
  }

  const [session, loading] = useSession();
  const [logo, setLogo] = useState(undefined);
  const [formLoading, setLoading] = useState(false);
  const [dangerAlert, setDangerAlert] = React.useState();
  const [isFormValid, setFormValid] = useState(false);
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

  const [coinData, setCoinData] = useState({
    name: '',
    symbol: '',
    description: '',
    contract_address: '',
    price: '',
    market_cap: '',
    launch_date: '',
    networkChain: 'BSC',
    coingecko_link: '',
    website_link: '',
    twitter_link: '',
    telegram_link: ''
  });
  const [formErrors, setFormErrors] = useState({
    name: '',
    symbol: '',
    description: '',
    price: '',
    market_cap: '',
    logo: '',
    launch_date: '',
    networkChain: '',
    website_link: ''
  });

  const handleChange = (update) => {
    setCoinData({ ...coinData, ...update });
  };

  const updateFormErrors = (update) => {
    setFormErrors({ ...formErrors, ...update });
  };

  const validateField = (fieldName, value) => {
    if (value === '') {
      updateFormErrors({ [fieldName]: 'This field is required!' });
    }
  };

  const validateForm = () => {
    let formValidity = true;
    for (const key in formErrors) {
      if (Object.hasOwnProperty.call(formErrors, key) && key !== 'logo') {
        formValidity = formValidity && formErrors[key] === '';
      }
    }
    // console.log('validateForm', formErrors, formValidity);
  };

  const handleSubmit = async () => {
    // console.log(coinData);
    let errors = {},
      formValidity = true;
    for (const key in formErrors) {
      if (key !== 'logo' && coinData[key] === '') {
        errors[key] = 'This field is required!';
        formValidity = false;
      } else if (key === 'logo' && (logo === undefined || logo === null)) {
        errors[key] = 'This field is required!';
        formValidity = false;
      }
    }
    setFormErrors(errors);
    // console.log(
    //   'handleSubmit',
    //   formErrors,
    //   formValidity,
    //   coinData,
    //   !loading && session.jwt
    // );
    if (formValidity) {
      const coin = {
        ...coinData,
        data: {},
        price: Number(coinData.price),
        market_cap: Number(coinData.market_cap)
      };
      // console.log(coin, session.jwt);
      setLoading(true);
      const res = await submitCoin(coin, logo, session.jwt);
      if (!!res && !!res.id) {
        setLoading(false);
        notify('success', 'Success!', 'Your request is submitted!');
        setTimeout(() => {
          router.push('/auth/overview');
        }, 500);
      } else {
        setLoading(false);
        notify('danger', 'Error!', 'Invalid request! Please double check the details.');
      }
      // console.log('handleSubmit', res);
    }
  };

  return (
    <>
      <AuthHeader />
      {/* Page content */}
      <div className="rna-wrapper">
        <NotificationAlert ref={notificationAlertRef} />
      </div>
      <Container className="mt--7" fluid>
        <Row>
          <Col className="mb-5 mb-xl-0" xl="8">
            <Card className="shadow">
              <CardHeader className="bg-transparent">
                <Row className="align-items-center">
                  <div className="col">
                    <h2 className="text-capitalize ls-1 mb-1">{pageData.title}</h2>
                  </div>
                </Row>
              </CardHeader>
              <CardBody>
                {/* Main Content */}
                {!!pageData.mainContent && !!pageData.mainContent.content && (
                  <RichText content={pageData.mainContent.content} />
                )}
              </CardBody>
            </Card>
            <Card className="shadow my-4">
              <CardHeader className="bg-transparent">
                <Row className="align-items-center">
                  <div className="col">
                    <h3 className="text-capitalize ls-1 mb-1">Coin Details</h3>
                  </div>
                </Row>
              </CardHeader>
              <CardBody className="bg-secondary">
                {/* Form */}
                <Form
                  className="p-4"
                  role="form"
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSubmit();
                  }}
                >
                  <FormGroup>
                    <label className="form-control-label" htmlFor="coin-name-input">
                      Name *
                    </label>
                    <Input
                      placeholder="Tron"
                      disabled={formLoading}
                      value={coinData.name}
                      invalid={formErrors.name !== ''}
                      className="form-control-alternative"
                      id="coin-name-input"
                      type="text"
                      onChange={(e) => {
                        handleChange({ name: e.target.value });
                        validateField('name', e.target.value);
                      }}
                    ></Input>
                    <FormFeedback>{formErrors.name}</FormFeedback>
                  </FormGroup>
                  <FormGroup>
                    <label className="form-control-label" htmlFor="coin-symbol-input">
                      Symbol *
                    </label>
                    <Input
                      placeholder="TRX"
                      disabled={formLoading}
                      invalid={formErrors.symbol !== ''}
                      value={coinData.symbol}
                      className="form-control-alternative"
                      id="coin-symbol-input"
                      type="text"
                      onChange={(e) => {
                        handleChange({ symbol: e.target.value });
                        validateField('symbol', e.target.value);
                      }}
                    ></Input>
                    <FormFeedback>{formErrors.symbol}</FormFeedback>
                  </FormGroup>
                  <FormGroup>
                    <label
                      className="form-control-label"
                      htmlFor="coin-description-input"
                    >
                      Description *
                    </label>
                    <Input
                      placeholder="This coin is a platform made especially for improved transactions"
                      disabled={formLoading}
                      value={coinData.description}
                      invalid={formErrors.description !== ''}
                      className="form-control-alternative"
                      id="coin-description-input"
                      type="textarea"
                      rows="4"
                      onChange={(e) => {
                        handleChange({ description: e.target.value });
                        validateField('description', e.target.value);
                      }}
                    ></Input>
                    <FormFeedback>{formErrors.description}</FormFeedback>
                  </FormGroup>
                  <FormGroup>
                    <label className="form-control-label" htmlFor="coin-logo-input">
                      Logo *
                    </label>
                    <Input
                      className="form-control-alternative"
                      disabled={formLoading}
                      formNoValidate={formErrors.logo !== ''}
                      id="coin-logo-input"
                      type="file"
                      onChange={(e) => {
                        e.preventDefault();
                        setLogo(e.target.files[0]);
                      }}
                    ></Input>
                    {!!formErrors.logo && formErrors.logo !== '' && (
                      <small className="text-orange">{formErrors.logo}</small>
                    )}
                  </FormGroup>
                  <FormGroup>
                    <label
                      className="form-control-label"
                      htmlFor="coin-contract-address-input"
                    >
                      Contract Address
                    </label>
                    <Input
                      placeholder="0x006724A6675A025b55ceeDFcu121CCCD321660C0"
                      disabled={formLoading}
                      value={coinData.contract_address}
                      className="form-control-alternative"
                      id="coin-contract-address-input"
                      type="text"
                      onChange={(e) => handleChange({ contract_address: e.target.value })}
                    ></Input>
                  </FormGroup>
                  <FormGroup>
                    <label className="form-control-label" htmlFor="coin-price-input">
                      Price *
                    </label>
                    <Input
                      placeholder="$12.50"
                      disabled={formLoading}
                      value={coinData.price}
                      className="form-control-alternative"
                      invalid={formErrors.price !== ''}
                      id="coin-price-input"
                      pattern="[+-]?\d+(?:[.,]\d+)?"
                      type="number"
                      onChange={(e) => {
                        handleChange({ price: e.target.value });
                        validateField('price', e.target.value);
                      }}
                    ></Input>
                    <FormFeedback>{formErrors.price}</FormFeedback>
                  </FormGroup>
                  <FormGroup>
                    <label className="form-control-label" htmlFor="coin-market-cap-input">
                      Market Cap *
                    </label>
                    <Input
                      placeholder="$1000.00"
                      disabled={formLoading}
                      value={coinData.market_cap}
                      className="form-control-alternative"
                      invalid={formErrors.market_cap !== ''}
                      id="coin-market-cap-input"
                      pattern="[+-]?\d+(?:[.,]\d+)?"
                      type="number"
                      onChange={(e) => {
                        handleChange({ market_cap: e.target.value });
                        validateField('market_cap', e.target.value);
                      }}
                    ></Input>
                    <FormFeedback>{formErrors.market_cap}</FormFeedback>
                  </FormGroup>
                  <FormGroup>
                    <label
                      className="form-control-label"
                      htmlFor="coin-launch-datetime-input"
                    >
                      Launch Date *
                    </label>
                    <Input
                      value={coinData.launch_date}
                      disabled={formLoading}
                      id="coin-launch-datetime-input"
                      className="form-control-alternative"
                      invalid={formErrors.launch_date !== ''}
                      type="datetime-local"
                      onChange={(e) => {
                        handleChange({ launch_date: e.target.value });
                        validateField('launch_date', e.target.value);
                      }}
                    ></Input>
                    <FormFeedback>{formErrors.launch_date}</FormFeedback>
                  </FormGroup>
                  <FormGroup>
                    <label
                      className="form-control-label"
                      htmlFor="coin-network-chain-input"
                    >
                      Network Chain *
                    </label>
                    <Input
                      defaultValue="BSC"
                      disabled={formLoading}
                      type="select"
                      name="select"
                      className="form-control-alternative"
                      invalid={formErrors.networkChain !== ''}
                      id="coin-network-chain-input"
                      onChange={(e) => {
                        handleChange({ networkChain: e.target.value });
                        validateField('networkChain', e.target.value);
                      }}
                    >
                      <option value="BSC">Binance Smart Chain (BSC)</option>
                      <option value="ETH">Ethereum (ETH)</option>
                      <option value="TRX">Tron (TRX)</option>
                      <option value="MATUC">Polygon (MATUC)</option>
                    </Input>
                    <FormFeedback>{formErrors.networkChain}</FormFeedback>
                  </FormGroup>
                  <FormGroup>
                    <label className="form-control-label" htmlFor="coin-cg-link-input">
                      CoinGecko URL
                    </label>
                    <Input
                      placeholder="https://www.coingecko.com/en/coins/tron"
                      disabled={formLoading}
                      value={coinData.coingecko_link}
                      className="form-control-alternative"
                      id="coin-cg-link-input"
                      type="text"
                      onChange={(e) => handleChange({ coingecko_link: e.target.value })}
                    ></Input>
                  </FormGroup>
                  <FormGroup>
                    <label
                      className="form-control-label"
                      htmlFor="coin-website-link-input"
                    >
                      Website *
                    </label>
                    <Input
                      placeholder="https://tron.network/"
                      disabled={formLoading}
                      value={coinData.website_link}
                      className="form-control-alternative"
                      invalid={formErrors.website_link !== ''}
                      id="coin-website-link-input"
                      type="text"
                      onChange={(e) => {
                        handleChange({ website_link: e.target.value });
                        validateField('website_link', e.target.value);
                      }}
                    ></Input>
                    <FormFeedback>{formErrors.website_link}</FormFeedback>
                  </FormGroup>
                  <FormGroup>
                    <label
                      className="form-control-label"
                      htmlFor="coin-twitter-link-input"
                    >
                      Twitter Link
                    </label>
                    <Input
                      placeholder="https://twitter.com/tronfoundation/"
                      disabled={formLoading}
                      value={coinData.twitter_link}
                      className="form-control-alternative"
                      id="coin-twitter-link-input"
                      type="text"
                      onChange={(e) => handleChange({ twitter_link: e.target.value })}
                    ></Input>
                  </FormGroup>
                  <FormGroup>
                    <label
                      className="form-control-label"
                      htmlFor="coin-telegram-link-input"
                    >
                      Telegram Link
                    </label>
                    <Input
                      placeholder="https://t.me/tronnetworkEN03/"
                      disabled={formLoading}
                      value={coinData.telegram_link}
                      className="form-control-alternative"
                      id="coin-telegram-link-input"
                      type="text"
                      onChange={(e) => handleChange({ telegram_link: e.target.value })}
                    ></Input>
                  </FormGroup>
                  <div className="text-center">
                    <Button
                      className="my-4"
                      disabled={formLoading}
                      color="primary"
                      type="submit"
                      onClick={(e) => {
                        e.preventDefault();
                        handleSubmit();
                      }}
                    >
                      {loading ? 'Loading...' : 'Submit'}
                    </Button>
                  </div>
                </Form>
              </CardBody>
            </Card>
          </Col>
          <Col xl="4">
            <Card className="shadow">
              <CardHeader className="bg-transparent">
                <Row className="align-items-center text-center">
                  <div className="col">
                    <h3 className="text-capitalize text-muted ls-1 mb-1">
                      Attention Required!
                    </h3>
                  </div>
                </Row>
              </CardHeader>
              <CardBody>
                {/* Additional Info */}
                {!!pageData.additionalInfo && !!pageData.additionalInfo.content && (
                  <RichText content={pageData.additionalInfo.content} />
                )}
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
    const pageData = await getCoinInstructions();
    return {
      props: { pageData }
    };
  } catch (error) {
    return {
      props: { error }
    };
  }
}

NewCoin.layout = Auth;
NewCoin.protected = true;

export default NewCoin;
