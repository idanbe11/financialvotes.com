import React from 'react';
// reactstrap components
import { Card, CardHeader, CardBody, Collapse, Container, Row, Col } from 'reactstrap';
// layout for this page
import Guest from 'layouts/Guest';
import { getFAQPageData } from 'lib/api';
import RichText from 'components/Elements/RichText';

const FAQPage = ({ data, error }) => {
  const { pageData } = data;
  // console.log(data);

  const [openedCollapse, setOpenedCollapse] = React.useState('collapseOne');

  return (
    <>
      <Container>
        <Row>
          <Col className="ml-auto" md="12">
            <div className="accordion m-3" id="faq-page-header">
              {!!pageData.title && <h1 className="mb-5">{pageData.title}</h1>}
              {!!pageData.content && <RichText content={pageData.content} />}
            </div>
          </Col>
        </Row>
        <Row>
          <Col className=" ml-auto" md="12">
            <div className="accordion my-3" id="faq-parent">
              {!!pageData.faqs &&
                pageData.faqs.map((faq, index) => (
                  <Card key={index}>
                    <CardHeader id={faq.id} aria-expanded={openedCollapse === faq.id}>
                      <h3 className="mb-0">
                        <div
                          onClick={() =>
                            setOpenedCollapse(openedCollapse === faq.id ? '' : faq.id)
                          }
                          className="w-100 text-primary text-left py-2 px-2"
                          color="link"
                          style={{
                            cursor: 'pointer'
                          }}
                        >
                          {faq.title}
                        </div>
                      </h3>
                    </CardHeader>
                    <Collapse
                      isOpen={openedCollapse === faq.id}
                      aria-labelledby={faq.id}
                      data-parent="#faq-parent"
                      id={faq.id}
                    >
                      <CardBody className="opacity-8">
                        {!!faq.content && <RichText content={faq.content} />}
                      </CardBody>
                    </Collapse>
                  </Card>
                ))}
            </div>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export async function getServerSideProps(context) {
  try {
    const pageData = await getFAQPageData();
    return {
      props: { data: { pageData } }
    };
  } catch (error) {
    return { error };
  }
}

FAQPage.layout = Guest;

export default FAQPage;
