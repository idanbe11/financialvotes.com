import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/client';
// node.js library that concatenates classes (strings)
import classnames from 'classnames';
import Select from 'react-select';
// javascipt plugin for creating charts
import Chart from 'chart.js';
// react plugin used to create charts
import { Line, Bar } from 'react-chartjs-2';
// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  NavItem,
  NavLink,
  Nav,
  Progress,
  Table,
  Container,
  Row,
  Col
} from 'reactstrap';
// layout for this page
import Auth from 'layouts/Auth';
// core components
import {
  chartOptions,
  parseOptions,
  chartExample1,
  chartExample2,
  createPrimaryChartData,
  createSecondaryChartData
} from 'variables/charts.js';

import AnalyticsHeader from 'components/Analytics/AnalyticsHeader';
import { getAnalyticsReport, getMyOrders } from 'lib/api';

const reportData = {
  primary: {
    clicks: [],
    views: []
  },
  secondary: [],
  sources: [],
  osInfo: [],
  summary: {
    engagements: 0,
    views: 0,
    clicks: 0,
    conversion: 0.0
  }
};

const options = [
  { value: 'id-1', label: 'Advert (2021-08-13)' },
  { value: 'id-2', label: 'Advert (2021-08-14)' },
  { value: 'id-3', label: 'Advert (2021-08-15)' }
];

const Analytics = (props) => {
  const [activeNav, setActiveNav] = useState(1);
  const [primaryChartKey, setPrimaryChartKey] = useState('clicks');
  const [primaryChartData, setPrimaryChartData] = useState(undefined);
  const [secondaryChartData, setSecondaryChartData] = useState(undefined);

  const [adId, setAdId] = useState('');
  const [loadings, setLoadings] = useState({
    orders: false,
    analytics: false
  });
  const [myOrders, setMyOrders] = useState([]);
  const [analyticsData, setAnalyticsData] = useState(undefined);
  const [ordersFetched, setOrdersFetched] = useState(false);
  const [analyticsDataFetched, setAnalyticsDataFetched] = useState(false);

  const [session, loading] = useSession();

  useEffect(() => {
    const fetchMyOrders = async () => {
      setLoadings({
        ...loadings,
        orders: true
      });
      const data = await getMyOrders(session.jwt);
      const ads = data.filter((elem) => elem.type === 'Advert');
      if (Array.isArray(ads) && ads.length > 0) {
        setAdId(ads[0].id);
      }
      setMyOrders(ads);
      setLoadings({
        ...loadings,
        orders: false
      });
      setOrdersFetched(true);
    };
    const fetchAnalyticsReport = async () => {
      setLoadings({
        ...loadings,
        analytics: true
      });
      const data = await getAnalyticsReport(adId, session.jwt);
      setAnalyticsData(data);
      setPrimaryChartData(createPrimaryChartData(data['primary']));
      setSecondaryChartData(createSecondaryChartData(data['secondary']));
      setLoadings({
        ...loadings,
        analytics: false
      });
      setAnalyticsDataFetched(true);
    };
    if (!loading && !loadings.orders && !ordersFetched) {
      fetchMyOrders();
    }
    if (
      !loading &&
      !loadings.analytics &&
      ordersFetched &&
      !analyticsDataFetched &&
      adId !== '' &&
      analyticsData === undefined
    ) {
      fetchAnalyticsReport();
    }
  }, [session, loading, loadings, ordersFetched, analyticsDataFetched, adId]);

  if (window.Chart) {
    parseOptions(Chart, chartOptions());
  }

  const toggleNavs = (e, index) => {
    e.preventDefault();
    setActiveNav(index);
    if (index === 1) {
      setPrimaryChartKey('clicks');
    } else if (index === 2) {
      setPrimaryChartKey('views');
    }
  };

  console.log(primaryChartData);

  return (
    <>
      <AnalyticsHeader data={!!analyticsData && analyticsData.summary} />
      {/* Page content */}
      <Container className="mt--7" fluid>
        <Row>
          <Col className="mb-5 mb-xl-3">
            <Card className="shadow">
              <CardHeader className="bg-transparent">
                <Row className="align-items-center">
                  <div className="col mb-xs-3">
                    <h2 className="mb-0">Advertisement:</h2>
                  </div>
                  <div className="col-md-6 col-xs-12">
                    <Select options={options} />
                  </div>
                </Row>
              </CardHeader>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col className="mb-5 mb-xl-0" xl="8">
            <Card className="shadow">
              <CardHeader className="bg-transparent">
                <Row className="align-items-center">
                  <div className="col">
                    <h6 className="text-uppercase text-light ls-1 mb-1">Analytics</h6>
                    <h2 className="text-muted mb-0">{`Engagements & Activities`}</h2>
                  </div>
                  <div className="col">
                    <Nav className="justify-content-end" pills>
                      <NavItem>
                        <NavLink
                          className={classnames('py-2 px-3', {
                            active: activeNav === 1
                          })}
                          href="#"
                          onClick={(e) => toggleNavs(e, 1)}
                        >
                          <span className="d-none d-md-block">Clicks</span>
                          <span className="d-md-none">C</span>
                        </NavLink>
                      </NavItem>
                      <NavItem>
                        <NavLink
                          className={classnames('py-2 px-3', {
                            active: activeNav === 2
                          })}
                          data-toggle="tab"
                          href="#"
                          onClick={(e) => toggleNavs(e, 2)}
                        >
                          <span className="d-none d-md-block">Views</span>
                          <span className="d-md-none">V</span>
                        </NavLink>
                      </NavItem>
                    </Nav>
                  </div>
                </Row>
              </CardHeader>
              <CardBody>
                {/* Chart */}
                {loading || loadings.analytics || !analyticsDataFetched ? (
                  <Row>
                    <Col>
                      <div className="text-center">
                        <h4 className="text-teal">Please wait...</h4>
                      </div>
                    </Col>
                  </Row>
                ) : !loadings.analytics &&
                  analyticsDataFetched === true &&
                  !!analyticsData &&
                  analyticsData.primary.views.length > 1 ? (
                  <div className="chart">
                    <Line
                      data={primaryChartData[primaryChartKey]}
                      options={primaryChartData.options}
                      getDatasetAtEvent={(e) => console.log(e)}
                    />
                  </div>
                ) : (
                  <Row>
                    <Col>
                      <div className="text-center">
                        <h4 className="text-teal">Insufficient data!</h4>
                      </div>
                    </Col>
                  </Row>
                )}
              </CardBody>
            </Card>
          </Col>
          <Col xl="4">
            <Card className="shadow">
              <CardHeader className="bg-transparent">
                <Row className="align-items-center">
                  <div className="col">
                    <h6 className="text-uppercase text-muted ls-1 mb-1">Performance</h6>
                    <h2 className="mb-0">Total Engagements</h2>
                  </div>
                </Row>
              </CardHeader>
              <CardBody>
                {/* Chart */}
                {loading || loadings.analytics || !analyticsDataFetched ? (
                  <Row>
                    <Col>
                      <div className="text-center">
                        <h4 className="text-teal">Please wait...</h4>
                      </div>
                    </Col>
                  </Row>
                ) : !loadings.analytics &&
                  analyticsDataFetched === true &&
                  !!analyticsData &&
                  analyticsData.secondary.length > 1 ? (
                  <div className="chart">
                    <Bar
                      data={secondaryChartData.data}
                      options={secondaryChartData.options}
                      getDatasetAtEvent={(e) => console.log(e)}
                    />
                  </div>
                ) : (
                  <Row>
                    <Col>
                      <div className="text-center">
                        <h4 className="text-teal">Insufficient data!</h4>
                      </div>
                    </Col>
                  </Row>
                )}
              </CardBody>
            </Card>
          </Col>
        </Row>
        <Row className="mt-5">
          <Col className="mb-5 mb-xl-0" xl="8">
            <Card className="shadow">
              <CardHeader className="border-0">
                <Row className="align-items-center">
                  <div className="col">
                    <h3 className="mb-0">Sources</h3>
                  </div>
                </Row>
              </CardHeader>
              {loading || loadings.analytics || !analyticsDataFetched ? (
                <CardBody>
                  <Row>
                    <Col>
                      <div className="text-center">
                        <h4 className="text-teal">Please wait...</h4>
                      </div>
                    </Col>
                  </Row>
                </CardBody>
              ) : !loadings.analytics &&
                analyticsDataFetched === true &&
                analyticsData.sources.length > 0 ? (
                <Table className="align-items-center table-flush" responsive>
                  <thead className="thead-light">
                    <tr>
                      <th scope="col">name</th>
                      <th scope="col">Views</th>
                      <th scope="col">Clicks</th>
                      <th scope="col">Conversion rate</th>
                    </tr>
                  </thead>
                  <tbody>
                    {analyticsData.sources.map((entity, index) => (
                      <tr key={index}>
                        <th scope="row">{entity.path}</th>
                        <td>{entity.views}</td>
                        <td>{entity.clicks}</td>
                        <td>{entity.conversion}%</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              ) : (
                <CardBody>
                  <Row>
                    <Col>
                      <div className="text-center">
                        <h4 className="text-teal">Insufficient data!</h4>
                      </div>
                    </Col>
                  </Row>
                </CardBody>
              )}
            </Card>
          </Col>
          <Col xl="4">
            <Card className="shadow">
              <CardHeader className="border-0">
                <Row className="align-items-center">
                  <div className="col">
                    <h3 className="mb-0">OS Info</h3>
                  </div>
                  {/* <div className="col text-right">
                    <Button
                      color="primary"
                      href="#"
                      onClick={(e) => e.preventDefault()}
                      size="sm"
                    >
                      See all
                    </Button>
                  </div> */}
                </Row>
              </CardHeader>
              {loading || loadings.analytics || !analyticsDataFetched ? (
                <CardBody>
                  <Row>
                    <Col>
                      <div className="text-center">
                        <h4 className="text-teal">Please wait...</h4>
                      </div>
                    </Col>
                  </Row>
                </CardBody>
              ) : !loadings.analytics &&
                analyticsDataFetched === true &&
                analyticsData.osInfo.length > 0 ? (
                <Table className="align-items-center table-flush" responsive>
                  <thead className="thead-light">
                    <tr>
                      <th scope="col">OS Name</th>
                      <th scope="col">Conversion Rate</th>
                    </tr>
                  </thead>
                  <tbody>
                    {analyticsData.osInfo.map((entity, index) => (
                      <tr key={index}>
                        <th scope="row">{entity.name}</th>
                        <td>
                          <div className="d-flex align-items-center">
                            <span className="mr-2">{entity.rate}%</span>
                            <div>
                              <Progress
                                max="100"
                                value={entity.rate}
                                barClassName="bg-gradient-danger"
                              />
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              ) : (
                <CardBody>
                  <Row>
                    <Col>
                      <div className="text-center">
                        <h4 className="text-teal">Insufficient data!</h4>
                      </div>
                    </Col>
                  </Row>
                </CardBody>
              )}
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

Analytics.layout = Auth;
Analytics.protected = true;

export default Analytics;
