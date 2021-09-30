import React from 'react';
import { Card, CardBody, Col, Container, Row } from 'reactstrap';
import Guest from 'layouts/Guest';
import { getContactPageData } from 'lib/api';

import FeatureCard from 'components/Elements/FeatureCard';
import RichText from 'components/Elements/RichText';

function Contact({ data }) {
  const { featureRows, richText } = data;
  return (
    <Container>
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
      <Row>
        <Col className="col-12">
          {!!richText && !!richText.content && (
            <div className=" accordion my-3" id="accordionExample">
              <Card className="shadow-sm">
                <CardBody>
                  <RichText content={richText.content} />
                </CardBody>
              </Card>
            </div>
          )}
        </Col>
      </Row>
    </Container>
  );
}

export async function getStaticProps(context) {
  try {
    const data = await getContactPageData();
    return {
      props: { data }
    };
  } catch (error) {
    return { error };
  }
}

Contact.layout = Guest;

export default Contact;
