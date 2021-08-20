import React from 'react';

// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  Collapse,
  Container,
  Row,
  Col
} from 'reactstrap';

// layout for this page
import Guest from 'layouts/Guest';

function FAQPage() {
  const [openedCollapse, setOpenedCollapse] = React.useState('collapseOne');
  return (
    <>
      <Container>
        <Row>
          <Col className=" ml-auto" md="12">
            <div className=" accordion my-3" id="accordionExample">
              <Card>
                <CardHeader
                  id="headingOne"
                  aria-expanded={openedCollapse === 'collapseOne'}
                >
                  <h5 className=" mb-0">
                    <Button
                      onClick={() =>
                        setOpenedCollapse(
                          openedCollapse === 'collapseOne' ? '' : 'collapseOne'
                        )
                      }
                      className=" w-100 text-primary text-left"
                      color="link"
                    >
                      How do I order?{' '}
                    </Button>
                  </h5>
                </CardHeader>
                <Collapse
                  isOpen={openedCollapse === 'collapseOne'}
                  aria-labelledby="headingOne"
                  data-parent="#accordionExample"
                  id="collapseOne"
                >
                  <CardBody className=" opacity-8">
                    Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus
                    terry richardson ad squid. 3 wolf moon officia aute, non cupidatat
                    skateboard dolor brunch. Food truck quinoa nesciunt laborum eiusmod.
                    Brunch 3 wolf moon tempor, sunt aliqua put a bird on it squid
                    single-origin coffee nulla assumenda shoreditch et. Nihil anim
                    keffiyeh helvetica, craft beer labore wes anderson cred nesciunt
                    sapiente ea proident. Ad vegan excepteur butcher vice lomo. Leggings
                    occaecat craft beer farm-to-table, raw denim aesthetic synth nesciunt
                    you probably haven't heard of them accusamus labore sustainable VHS.
                  </CardBody>
                </Collapse>
              </Card>
              <Card>
                <CardHeader
                  id="headingTwo"
                  aria-expanded={openedCollapse === 'collapseTwo'}
                >
                  <h5 className=" mb-0">
                    <Button
                      onClick={() =>
                        setOpenedCollapse(
                          openedCollapse === 'collapseTwo' ? '' : 'collapseTwo'
                        )
                      }
                      className=" w-100 text-primary text-left collapsed"
                      color="link"
                    >
                      How can i make the payment?{' '}
                    </Button>
                  </h5>
                </CardHeader>
                <Collapse
                  isOpen={openedCollapse === 'collapseTwo'}
                  aria-labelledby="headingTwo"
                  data-parent="#accordionExample"
                  id="collapseTwo"
                >
                  <CardBody className=" opacity-8">
                    Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus
                    terry richardson ad squid. 3 wolf moon officia aute, non cupidatat
                    skateboard dolor brunch. Food truck quinoa nesciunt laborum eiusmod.
                    Brunch 3 wolf moon tempor, sunt aliqua put a bird on it squid
                    single-origin coffee nulla assumenda shoreditch et. Nihil anim
                    keffiyeh helvetica, craft beer labore wes anderson cred nesciunt
                    sapiente ea proident. Ad vegan excepteur butcher vice lomo. Leggings
                    occaecat craft beer farm-to-table, raw denim aesthetic synth nesciunt
                    you probably haven't heard of them accusamus labore sustainable VHS.
                  </CardBody>
                </Collapse>
              </Card>
              <Card>
                <CardHeader
                  id="headingThree"
                  aria-expanded={openedCollapse === 'collapseThree'}
                >
                  <h5 className=" mb-0">
                    <Button
                      onClick={() =>
                        setOpenedCollapse(
                          openedCollapse === 'collapseThree' ? '' : 'collapseThree'
                        )
                      }
                      className=" w-100 text-primary text-left collapsed"
                      color="link"
                    >
                      How much time does it take to receive the order?{' '}
                    </Button>
                  </h5>
                </CardHeader>
                <Collapse
                  isOpen={openedCollapse === 'collapseThree'}
                  aria-labelledby="headingThree"
                  data-parent="#accordionExample"
                  id="collapseThree"
                >
                  <CardBody className=" opacity-8">
                    Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus
                    terry richardson ad squid. 3 wolf moon officia aute, non cupidatat
                    skateboard dolor brunch. Food truck quinoa nesciunt laborum eiusmod.
                    Brunch 3 wolf moon tempor, sunt aliqua put a bird on it squid
                    single-origin coffee nulla assumenda shoreditch et. Nihil anim
                    keffiyeh helvetica, craft beer labore wes anderson cred nesciunt
                    sapiente ea proident. Ad vegan excepteur butcher vice lomo. Leggings
                    occaecat craft beer farm-to-table, raw denim aesthetic synth nesciunt
                    you probably haven't heard of them accusamus labore sustainable VHS.
                  </CardBody>
                </Collapse>
              </Card>
              <Card>
                <CardHeader
                  id="headingFour"
                  aria-expanded={openedCollapse === 'collapseFour'}
                >
                  <h5 className=" mb-0">
                    <Button
                      onClick={() =>
                        setOpenedCollapse(
                          openedCollapse === 'collapseFour' ? '' : 'collapseFour'
                        )
                      }
                      className=" w-100 text-primary text-left"
                      color="link"
                    >
                      Can I resell the products?{' '}
                    </Button>
                  </h5>
                </CardHeader>
                <Collapse
                  isOpen={openedCollapse === 'collapseFour'}
                  aria-labelledby="headingFour"
                  data-parent="#accordionExample"
                  id="collapseFour"
                >
                  <CardBody className=" opacity-8">
                    Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus
                    terry richardson ad squid. 3 wolf moon officia aute, non cupidatat
                    skateboard dolor brunch. Food truck quinoa nesciunt laborum eiusmod.
                    Brunch 3 wolf moon tempor, sunt aliqua put a bird on it squid
                    single-origin coffee nulla assumenda shoreditch et. Nihil anim
                    keffiyeh helvetica, craft beer labore wes anderson cred nesciunt
                    sapiente ea proident. Ad vegan excepteur butcher vice lomo. Leggings
                    occaecat craft beer farm-to-table, raw denim aesthetic synth nesciunt
                    you probably haven't heard of them accusamus labore sustainable VHS.
                  </CardBody>
                </Collapse>
              </Card>
              <Card>
                <CardHeader
                  id="headingFifth"
                  aria-expanded={openedCollapse === 'collapseFifth'}
                >
                  <h5 className=" mb-0">
                    <Button
                      onClick={() =>
                        setOpenedCollapse(
                          openedCollapse === 'collapseFifth' ? '' : 'collapseFifth'
                        )
                      }
                      className=" w-100 text-primary text-left"
                      color="link"
                    >
                      Where do I find the shipping details?{' '}
                    </Button>
                  </h5>
                </CardHeader>
                <Collapse
                  isOpen={openedCollapse === 'collapseFifth'}
                  aria-labelledby="headingFifth"
                  data-parent="#accordionExample"
                  id="collapseFifth"
                >
                  <CardBody className=" opacity-8">
                    Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus
                    terry richardson ad squid. 3 wolf moon officia aute, non cupidatat
                    skateboard dolor brunch. Food truck quinoa nesciunt laborum eiusmod.
                    Brunch 3 wolf moon tempor, sunt aliqua put a bird on it squid
                    single-origin coffee nulla assumenda shoreditch et. Nihil anim
                    keffiyeh helvetica, craft beer labore wes anderson cred nesciunt
                    sapiente ea proident. Ad vegan excepteur butcher vice lomo. Leggings
                    occaecat craft beer farm-to-table, raw denim aesthetic synth nesciunt
                    you probably haven't heard of them accusamus labore sustainable VHS.
                  </CardBody>
                </Collapse>
              </Card>
            </div>
          </Col>
        </Row>
      </Container>
    </>
  );
}

FAQPage.layout = Guest;

export default FAQPage;
