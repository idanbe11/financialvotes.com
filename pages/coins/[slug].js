import React, { useEffect, useRef, useState } from 'react';
import moment from 'moment';
import { useRouter } from 'next/dist/client/router';
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
  Col,
  Container,
  Row
} from 'reactstrap';
import * as _ from 'lodash';
import NotificationAlert from 'react-notification-alert';
import Guest from 'layouts/Guest';
import { getCoinBySlug, getAllCoinSlugs, voteForCoin } from 'lib/api';
import Modal from 'components/elements/Modal';

const CoinSidebar = ({
  links,
  in_coingecko,
  created,
  quote,
  website_link,
  twitter_link,
  telegram_link
}) => {
  const filteredHomePage = in_coingecko && _.compact(links.homepage);
  const cg_website_link = filteredHomePage.length !== 0 && filteredHomePage[0];
  const cg_twitter_link =
    in_coingecko &&
    !!links.twitter_screen_name &&
    'https://twitter.com/' + links.twitter_screen_name;
  const cg_telegram_link =
    in_coingecko &&
    !!links.telegram_channel_identifier &&
    'https://t.me/' + links.telegram_channel_identifier;
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
                {!!quote.price && (
                  <Row className="mb-4">
                    <div className="col">
                      <CardTitle tag="h5" className="text-uppercase text-muted mb-0">
                        Price
                      </CardTitle>
                      <span className="h2 font-weight-bold mb-0">
                        {!!quote.price &&
                          new Intl.NumberFormat('en-US', {
                            style: 'currency',
                            currency: 'USD'
                          }).format(quote.price)}
                      </span>
                    </div>
                    <Col className="col-auto">
                      <div className="icon icon-shape bg-success text-white rounded-circle shadow">
                        <i className="fas fa-dollar-sign" />
                      </div>
                    </Col>
                  </Row>
                )}
                {(!!quote.market_cap || quote.market_cap === 0) && (
                  <Row className="mb-4">
                    <div className="col">
                      <CardTitle tag="h5" className="text-uppercase text-muted mb-0">
                        Market Cap
                      </CardTitle>
                      <span className="h2 font-weight-bold mb-0">
                        {(!!quote.market_cap || quote.market_cap === 0) &&
                          new Intl.NumberFormat('en-US', {
                            style: 'currency',
                            currency: 'USD'
                          }).format(quote.market_cap)}
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

const Coin = ({ coin }) => {
  // console.log(coin);
  const {
    logo,
    name,
    symbol,
    description,
    slug,
    launch_date,
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
  const [voteConfirm, setVoteModalConfirm] = useState(false);
  const [initial, setInitial] = useState(true);

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
    return <ErrorPage statusCode={404} />;
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
          'Are you sure you want to vote this coin? You can only vote a coin per day.'
        }
        action={async () => {
          const res = await voteForCoin(coin.id, session.jwt);
          if (typeof res === 'string') {
            notify('danger', res);
          } else {
            notify('success', 'Your vote has been submitted!');
          }
          setVoteModalConfirm(!voteConfirm);
        }}
        actionText="Confirm"
        show={voteConfirm}
        toggle={() => setVoteModalConfirm(!voteConfirm)}
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
                    <h2>{name}</h2>
                    <Badge color="info">
                      {in_coingecko
                        ? String(data.symbol).toUpperCase()
                        : String(symbol).toUpperCase()}
                    </Badge>
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
            </Card>
          </div>
        </Col>
        <CoinSidebar
          in_coingecko={in_coingecko}
          quote={data.quote}
          links={data.links}
          created={in_coingecko && !!data.genesis_date ? data.genesis_date : launch_date}
          website_link={website_link}
          twitter_link={twitter_link}
          telegram_link={telegram_link}
        />
      </Row>
    </Container>
  );
};

export async function getStaticProps({ params }) {
  const data = await getCoinBySlug(params.slug);
  // console.log(data);
  return {
    props: {
      coin: data
    }
  };
}

export async function getStaticPaths() {
  const slugs = await getAllCoinSlugs();
  return {
    paths: slugs?.map((slug) => `/coins/${slug}`) || [],
    fallback: false
  };
}

Coin.layout = Guest;

export default Coin;
