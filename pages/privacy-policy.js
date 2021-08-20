import React from 'react';
import { Col, Container, Row } from 'reactstrap';
import Guest from 'layouts/Guest';
import { getPrivacyPageData } from 'lib/api';
import RichText from 'components/Elements/RichText';

const PrivacyPolicyPage = ({ data, error }) => {
  const { pageData } = data;

  if (error) {
    return (
      <Container>
        <Row>
          <Col className=" ml-auto" md="12">
            <div className="text-center">
              <h1 className="mb-5">An error occured!</h1>
            </div>
          </Col>
        </Row>
      </Container>
    );
  }

  return (
    <Container>
      <Row>
        <Col className=" ml-auto" md="12">
          <div className=" accordion my-3" id="accordionExample">
            {!!pageData.title && <h1 className="mb-5">{pageData.title}</h1>}
            {!!pageData.content && <RichText content={pageData.content} />}
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export async function getStaticProps(context) {
  try {
    const pageData = await getPrivacyPageData();
    return {
      props: { data: { pageData } }
    };
  } catch (error) {
    return { error };
  }
}

PrivacyPolicyPage.layout = Guest;

export default PrivacyPolicyPage;
