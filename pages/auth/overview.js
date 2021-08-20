import React from 'react';
// javascipt plugin for creating charts
import Chart from 'chart.js';
// reactstrap components
import { Button, Card, CardHeader, CardBody, Container, Row, Col } from 'reactstrap';
// layout for this page
import Auth from 'layouts/Auth';

import AuthHeader from 'components/Headers/AuthHeader';
import CoinTable from 'components/CoinTable/CoinTable';
import FeatureCard from 'components/Elements/FeatureCard';
import RichText from 'components/Elements/RichText';
import { getOverviewPageData } from 'lib/api';

const Overview = ({ data }) => {
  console.log(data);
  const { mainContent, sideContent, featureRows } = data;

  return (
    <>
      <AuthHeader />
      {/* Page content */}
      <Container className="mt--7" fluid>
        <Row>
          <Col className="col-12 ml-auto" md="7" lg="8">
            {!!mainContent && !!mainContent.content && (
              <div className=" accordion my-3" id="accordionExample">
                <Card className="shadow-sm">
                  <CardBody>
                    <RichText content={mainContent.content} />
                  </CardBody>
                </Card>
              </div>
            )}
          </Col>
          <Col className="col-12 ml-auto" md="5" lg="4">
            {!!sideContent && !!sideContent.content && (
              <div className=" accordion my-3" id="accordionExample">
                <Card className="shadow-sm">
                  <CardBody>
                    <RichText content={sideContent.content} />
                  </CardBody>
                </Card>
              </div>
            )}
          </Col>
        </Row>
        <CoinTable />
        <Row>
          {!!featureRows &&
            !!featureRows.features &&
            Array.isArray(featureRows.features) &&
            featureRows.features.map((feature) => (
              <FeatureCard
                key={feature.id}
                title={feature.title}
                description={feature.description}
                link={feature.link}
              />
            ))}
        </Row>
      </Container>
    </>
  );
};

export async function getStaticProps(context) {
  try {
    const data = await getOverviewPageData();
    return {
      props: { data }
    };
  } catch (error) {
    return { error };
  }
}

Overview.layout = Auth;
Overview.protected = true;

export default Overview;
