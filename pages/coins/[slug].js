import React, { useEffect, useRef, useState } from 'react';
import moment from 'moment';
import { useRouter } from 'next/dist/client/router';
// react component that copies the given text inside your clipboard
import { CopyToClipboard } from 'react-copy-to-clipboard';
import ErrorPage from 'next/error';
import { useSession } from 'next-auth/client';
import ReactMarkdown from 'react-markdown';
import {
  Badge,
  Button,
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Container,
  Row,
  Col,
  Spinner,
  CardFooter,
  UncontrolledTooltip
} from 'reactstrap';
import * as _ from 'lodash';
import NotificationAlert from 'react-notification-alert';
import Guest from 'layouts/Guest';
import { getCoinBySlug, getAllPromotedCoins, voteForCoin } from 'lib/api';
import Modal from 'components/Elements/Modal';
import Advertisement from 'components/Advertisement/Advertisement';
import CoinTable from 'components/CoinTable/CoinTable';

const CoinSidebar = ({
  price,
  market_cap,
  links,
  in_coingecko,
  created,
  quote,
  website_link,
  twitter_link,
  telegram_link
}) => {
  const filteredHomePage = in_coingecko && !!links && _.compact(links.homepage);
  const cg_website_link = filteredHomePage.length !== 0 && filteredHomePage[0];
  const cg_twitter_link =
    in_coingecko &&
    !!links &&
    !!links.twitter_screen_name &&
    'https://twitter.com/' + links.twitter_screen_name;
  const cg_telegram_link =
    in_coingecko &&
    !!links &&
    !!links.telegram_channel_identifier &&
    'https://t.me/' + links.telegram_channel_identifier;
  const displayPrice = in_coingecko && !!quote.price ? quote.price : price;
  const displayMarketCap =
    in_coingecko && !!quote.market_cap ? quote.market_cap : market_cap;
  // console.log(
  //   'CoinSidebar',
  //   quote,
  //   links,
  //   in_coingecko,
  //   cg_website_link,
  //   cg_telegram_link,
  //   cg_twitter_link,
  //   !!quote && !!quote.market_cap
  // );

  return (
    <Col md="12" lg="4" xl="3">
      <Row>
        {/* Quotes */}
        {!!quote && (
          <div
            className="accordion my-3 col-md-6 col-lg-12 col-sm-6"
            id="accordionExample"
          >
            <Card className="shadow-sm">
              <CardBody>
                {!!displayPrice && (
                  <Row className="mb-4">
                    <div className="col">
                      <CardTitle tag="h5" className="text-uppercase text-muted mb-0">
                        Price
                      </CardTitle>
                      <span className="h2 font-weight-bold mb-0">
                        {!!displayPrice &&
                          new Intl.NumberFormat('en-US', {
                            style: 'currency',
                            currency: 'USD',
                            maximumFractionDigits: 4,
                            maximumSignificantDigits: 10
                          }).format(displayPrice)}
                      </span>
                    </div>
                    <Col className="col-auto">
                      <div className="icon icon-shape bg-success text-white rounded-circle shadow">
                        <i className="fas fa-dollar-sign" />
                      </div>
                    </Col>
                  </Row>
                )}
                {!!displayMarketCap && (
                  <Row className="mb-4">
                    <div className="col">
                      <CardTitle tag="h5" className="text-uppercase text-muted mb-0">
                        Market Cap
                      </CardTitle>
                      <span className="h2 font-weight-bold mb-0">
                        {displayMarketCap &&
                          new Intl.NumberFormat('en-US', {
                            style: 'currency',
                            currency: 'USD',
                            maximumFractionDigits: 4,
                            maximumSignificantDigits: 10
                          }).format(displayMarketCap)}
                      </span>
                    </div>
                    {/* <Col className="col-auto">
                      <div className="icon icon-shape bg-warning text-white rounded-circle shadow">
                        <i className="fas fa-chart-pie" />
                      </div>
                    </Col> */}
                  </Row>
                )}
                {!!quote.price_change_percentage_1h && (
                  <Row className="mb-4">
                    <div className="col">
                      <CardTitle tag="h5" className="text-uppercase text-muted mb-0">
                        Percentage Change (1H)
                      </CardTitle>
                      <span className="h2 font-weight-bold mb-0">
                        {Number(quote.price_change_percentage_1h.toFixed(2))}%
                      </span>
                    </div>
                    <Col className="col-auto">
                      <div className="icon icon-shape bg-info text-white rounded-circle shadow">
                        <i className="fas fa-percent" />
                      </div>
                    </Col>
                  </Row>
                )}
                {!!created && (
                  <Row className="mb-4">
                    <div className="col">
                      <CardTitle tag="h5" className="text-uppercase text-muted mb-0">
                        Launch Date
                      </CardTitle>
                      <span className="h2 font-weight-bold mb-0">
                        {moment(created).format('MMMM DD, YYYY')}
                      </span>
                    </div>
                    <Col className="col-auto">
                      <div className="icon icon-shape bg-yellow text-white rounded-circle shadow">
                        <i className="fas fa-rocket" />
                      </div>
                    </Col>
                  </Row>
                )}
              </CardBody>
            </Card>
          </div>
        )}
        {/* Web & Social Links */}
        <div className="accordion my-3 col-md-6 col-lg-12 col-sm-6" id="accordionExample">
          <Card className="shadow-sm">
            <CardBody>
              <Row className="my-2 justify-content-center">
                {in_coingecko ? (
                  <Col className="col-auto">
                    <a href={cg_website_link} target="_blank" rel="noreferrer noopener">
                      <Button
                        className="btn-icon my-3"
                        color="info"
                        type="button"
                        size="md"
                      >
                        <span className="btn-inner--icon">
                          <i className="ni ni-world-2"></i>
                        </span>
                        <span className="btn-inner--text">Website</span>
                      </Button>
                    </a>
                  </Col>
                ) : (
                  !!website_link && (
                    <Col className="col-auto">
                      <a href={website_link} target="_blank" rel="noreferrer noopener">
                        <Button
                          className="btn-icon my-3"
                          color="info"
                          type="button"
                          size="md"
                        >
                          <span className="btn-inner--icon">
                            <i className="ni ni-world-2"></i>
                          </span>
                          <span className="btn-inner--text">Website</span>
                        </Button>
                      </a>
                    </Col>
                  )
                )}
                {in_coingecko && !!cg_twitter_link ? (
                  <Col className="col-auto">
                    <a href={cg_twitter_link} target="_blank" rel="noreferrer noopener">
                      <Button
                        className="btn-icon my-3"
                        color="twitter"
                        type="button"
                        size="md"
                      >
                        <span className="btn-inner--icon">
                          <i className="fab fa-twitter"></i>
                        </span>
                        <span className="btn-inner--text">Twitter</span>
                      </Button>
                    </a>
                  </Col>
                ) : (
                  !!twitter_link && (
                    <Col className="col-auto">
                      <a href={twitter_link} target="_blank" rel="noreferrer noopener">
                        <Button
                          className="btn-icon my-3"
                          color="twitter"
                          type="button"
                          size="md"
                        >
                          <span className="btn-inner--icon">
                            <i className="fab fa-twitter"></i>
                          </span>
                          <span className="btn-inner--text">Twitter</span>
                        </Button>
                      </a>
                    </Col>
                  )
                )}
                {in_coingecko && !!cg_telegram_link ? (
                  <Col className="col-auto">
                    <a href={cg_telegram_link} target="_blank" rel="noreferrer noopener">
                      <Button
                        className="btn-icon my-3"
                        color="primary"
                        type="button"
                        size="md"
                      >
                        <span className="btn-inner--icon">
                          <i className="fab fa-telegram"></i>
                        </span>
                        <span className="btn-inner--text">Telegram</span>
                      </Button>
                    </a>
                  </Col>
                ) : (
                  !!telegram_link && (
                    <Col className="col-auto">
                      <a href={telegram_link} target="_blank" rel="noreferrer noopener">
                        <Button
                          className="btn-icon my-3"
                          color="primary"
                          type="button"
                          size="md"
                        >
                          <span className="btn-inner--icon">
                            <i className="fab fa-telegram"></i>
                          </span>
                          <span className="btn-inner--text">Telegram</span>
                        </Button>
                      </a>
                    </Col>
                  )
                )}
              </Row>
            </CardBody>
          </Card>
        </div>
      </Row>
    </Col>
  );
};

const Coin = ({ coin, error }) => {
  console.log(coin);

  const {
    logo,
    name,
    symbol,
    description,
    slug,
    launch_date,
    votes,
    networkChain,
    in_coingecko,
    data,
    twitter_link,
    website_link,
    telegram_link
  } = coin;
  const router = useRouter();
  const [session, loading] = useSession();
  const notificationAlertRef = useRef();
  const [copiedText, setCopiedText] = useState();
  const [voteConfirm, setVoteModalConfirm] = useState(false);
  const [initial, setInitial] = useState(true);
  const [voteReqLoading, setVoteReqLoading] = useState(false);

  useEffect(() => {
    if (initial && !!router.query.vote && router.query.vote !== voteConfirm) {
      setVoteModalConfirm(Boolean(router.query.vote));
      setInitial(false);
    }
  }, [initial, voteConfirm, router]);

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

  if (!router.isFallback && !coin?.slug) {
    router.push('/404');
  }

  if (router.isFallback) {
    return (
      <Container>
        <Row>
          <Col className=" ml-auto" md="12">
            <div className="col-lg-12 text-center">
              <div className="section-title">
                <h2>Loading ...</h2>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    );
  }

  return (
    <Container>
      <div className="rna-wrapper">
        <NotificationAlert ref={notificationAlertRef} />
      </div>
      <Modal
        title={'Please confirm to continue'}
        content={
          'Are you sure you want to vote this coin? You can only vote one time per one coin within 24 hours.'
        }
        action={async () => {
          if (!!session) {
            setVoteReqLoading(true);
            const res = await voteForCoin(coin.id, session.jwt);
            if (typeof res === 'string') {
              setVoteReqLoading(false);
              notify('danger', res);
            } else {
              setVoteReqLoading(false);
              notify('success', 'Your vote has been submitted!');
              setTimeout(() => {
                router.reload(window.location.pathname);
              }, 1000);
            }
            setVoteModalConfirm(!voteConfirm);
          } else {
            router.push('/auth/login');
          }
        }}
        actionText="Confirm"
        show={voteConfirm}
        toggle={() => setVoteModalConfirm(!voteConfirm)}
        loading={voteReqLoading}
        loaderComponent={
          <div className="container align-items-center mb-5">
            <Row className="m-5 p-5">
              <Col className="text-center">
                Please wait...
                <Spinner className="mx-3" size="sm" color="info" />
              </Col>
            </Row>
          </div>
        }
      />
      <Row>
        <Col className=" ml-auto" md="12" lg="8" xl="9">
          <div className="accordion my-3" id="accordionExample">
            <Card className="shadow-sm">
              <CardHeader
                id="headingOne"
                // aria-expanded={openedCollapse === 'collapseOne'}
              >
                <Row>
                  <Col xs="6" md="3" sm="3" lg="3" className="mb-2">
                    <div>
                      <a href="#" onClick={(e) => e.preventDefault()}>
                        {!!in_coingecko
                          ? !!data.image &&
                            !!data.image.large && (
                              <img
                                alt={slug + '-logo'}
                                className="rounded"
                                style={{ maxWidth: '100px' }}
                                src={data.image.large}
                              />
                            )
                          : !!logo &&
                            logo.url && (
                              <img
                                alt={slug + '-logo'}
                                className="rounded"
                                style={{ maxWidth: '100px' }}
                                src={logo.url}
                              />
                            )}
                      </a>
                    </div>
                  </Col>
                  <Col xs="6" md="6" sm="6" lg="6" className="my-2">
                    <h2>
                      {name}
                      <Badge color="info" className="m-2">
                        {in_coingecko
                          ? String(data.symbol).toUpperCase()
                          : String(symbol).toUpperCase()}
                      </Badge>
                    </h2>
                    {!!votes && <p className="text-muted">{votes} votes</p>}
                  </Col>
                  <Col className="text-center mt-3" xs="12" sm="3" lg="3">
                    <Button
                      className="mr-4 mt-2"
                      color="success"
                      onClick={(e) => {
                        e.preventDefault();
                        setVoteModalConfirm(!voteConfirm);
                      }}
                      size="md"
                    >
                      Vote
                    </Button>
                  </Col>
                </Row>
              </CardHeader>
              <CardBody className="px-0">
                <Container>
                  {in_coingecko ? (
                    <div className="font-weight-light p-3">
                      {' '}
                      <ReactMarkdown>{data.description}</ReactMarkdown>
                    </div>
                  ) : (
                    <div className="font-weight-light p-3">
                      {' '}
                      <ReactMarkdown>{description}</ReactMarkdown>
                    </div>
                  )}
                </Container>
              </CardBody>
              <CardFooter className="px-0">
                <Container>
                  <div className="col">
                    {!!coin.contract_address && (
                      <div>
                        Contract Address:{' '}
                        <CopyToClipboard
                          text={coin.contract_address}
                          onCopy={() => setCopiedText(coin.contract_address)}
                        >
                          <button
                            className="btn-icon-clipboard p-0"
                            id={`contract-address-${slug}`}
                            type="button"
                            style={{ width: 'auto' }}
                          >
                            <span className="text-teal mx-2">
                              {coin.contract_address}
                            </span>
                          </button>
                        </CopyToClipboard>
                        <UncontrolledTooltip
                          delay={0}
                          trigger="hover focus"
                          target={`contract-address-${slug}`}
                        >
                          {copiedText === coin.contract_address
                            ? 'Copied!'
                            : 'Click to copy'}
                        </UncontrolledTooltip>
                      </div>
                    )}
                  </div>
                </Container>
              </CardFooter>
            </Card>
          </div>
        </Col>
        <CoinSidebar
          price={coin.price}
          market_cap={coin.market_cap}
          in_coingecko={in_coingecko}
          quote={data.quote}
          links={data.links}
          created={in_coingecko && !!data.genesis_date ? data.genesis_date : launch_date}
          website_link={website_link}
          twitter_link={twitter_link}
          telegram_link={telegram_link}
        />
      </Row>
      <Row className="mt-5">
        <div className="col-12 col-md-6 col-lg-6">
          <h1>FinancialVotes.com</h1>
          <h2 className="title">All Round Best Coins</h2>
          <h3>Most voted coins all time around the globe</h3>
        </div>
        <div className="col-lg-6 col-12">
          <Advertisement source={`Coin - ${name}`} />
        </div>
      </Row>
      <CoinTable title={'Promoted Coins'} getter={getAllPromotedCoins} />
    </Container>
  );
};

export async function getServerSideProps({ params }) {
  try {
    const data = await getCoinBySlug(params.slug);
    // console.log(data);
    return {
      props: {
        coin: data
      }
    };
  } catch (error) {
    return { error };
  }
}

// export async function getStaticProps({ params }) {
//   const data = await getCoinBySlug(params.slug);
//   // console.log(data);
//   return {
//     props: {
//       coin: data
//     }
//   };
// }

// export async function getStaticPaths() {
//   const slugs = await getAllCoinSlugs();
//   return {
//     paths: slugs?.map((slug) => `/coins/${slug}`) || [],
//     fallback: false
//   };
// }

Coin.layout = Guest;

export default Coin;
