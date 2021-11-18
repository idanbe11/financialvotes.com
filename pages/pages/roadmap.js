import React from 'react';
// reactstrap components
import { Container, Row, Col } from 'reactstrap';
// layout for this page
import Guest from 'layouts/Guest';
import { getRoadMapPageData } from 'lib/api';
import RichText from 'components/Elements/RichText';
import RoadMap from '../../components/RoadMap/RoadMap';

const RoadMapPage = ({ data, error }) => {
  const { pageData } = data;
  // console.log(data);

  return (
    <>
      <Container>
        <Row>
          <Col className="ml-auto" md="12">
            <div className="accordion m-3" id="faq-page-header">
              {!!pageData.title && <h1 className="mb-5">{pageData.title}</h1>}
              {!!pageData.description && !!pageData.description.content && (
                <RichText content={pageData.description.content} />
              )}
            </div>
          </Col>
        </Row>
        <Row>
          <Col className=" ml-auto" md="12">
            <div className="accordion my-3" id="faq-parent">
              {!!pageData.timeline && Array.isArray(pageData.timeline.items) && (
                <RoadMap items={pageData.timeline.items} />
              )}
            </div>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export async function getServerSideProps(context) {
  try {
    const pageData = await getRoadMapPageData();
    return {
      props: { data: { pageData } }
    };
  } catch (error) {
    return { error };
  }
}

RoadMapPage.layout = Guest;

export default RoadMapPage;
