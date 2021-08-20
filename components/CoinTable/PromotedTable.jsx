import { Card, CardHeader, Col, Media, Row, Table, Button } from 'reactstrap';

const PromoTable = () => {
  return (
    <Row className="my-5">
      <Col className="mb-5 mb-xl-0" xl="12">
        <Card className="shadow">
          <CardHeader className="border-0">
            <Row className="align-items-center">
              <div className="col">
                <h3 className="mb-0">Promoted Coins</h3>
              </div>
              {/* <div className="col text-right">
                    <Button
                      color="primary"
                      href="#"
                      onClick={(e) => e.preventDefault()}
                      size="md"
                    >
                      See all
                    </Button>
                  </div> */}
            </Row>
          </CardHeader>
          <Table className="align-items-center table-flush" responsive>
            <thead className="thead-light">
              <tr>
                <th scope="col">Logo</th>
                <th scope="col">Name</th>
                <th scope="col">Symbol</th>
                <th scope="col">Market Cap</th>
                <th scope="col">Time since launch</th>
                <th scope="col">Votes</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row">
                  <Media className="align-items-center">
                    <a
                      className="avatar rounded-circle mr-3"
                      href="#"
                      onClick={(e) => e.preventDefault()}
                    >
                      <img alt="..." src={require('assets/img/theme/bootstrap.jpg')} />
                    </a>
                  </Media>
                </th>
                <td>BabyAxie</td>
                <td>$BAXS</td>
                <td>$15,123</td>
                <td>3 Days</td>
                <td>
                  <span className="font-weight-bold">1031</span>
                  <span className="mx-2">
                    <i className="fas fa-arrow-up text-success ml-2" /> 46,53%
                  </span>
                  <Button
                    color="success"
                    href="#"
                    onClick={(e) => e.preventDefault()}
                    size="md"
                  >
                    Vote
                  </Button>
                </td>
              </tr>
              <tr>
                <th scope="row">
                  <Media className="align-items-center">
                    <a
                      className="avatar rounded-circle mr-3"
                      href="#"
                      onClick={(e) => e.preventDefault()}
                    >
                      <img
                        alt="..."
                        src={require('assets/img/theme/team-1-800x800.jpg')}
                      />
                    </a>
                  </Media>
                </th>
                <td>BabyAxie</td>
                <td>$BAXS</td>
                <td>$15,123</td>
                <td>3 Days</td>
                <td>
                  <span className="font-weight-bold">1031</span>
                  <span className="mx-2">
                    <i className="fas fa-arrow-up text-success ml-2" /> 46,53%
                  </span>
                  <Button
                    color="success"
                    href="#"
                    onClick={(e) => e.preventDefault()}
                    size="md"
                  >
                    Vote
                  </Button>
                </td>
              </tr>
              <tr>
                <th scope="row">
                  <Media className="align-items-center">
                    <a
                      className="avatar rounded-circle mr-3"
                      href="#"
                      onClick={(e) => e.preventDefault()}
                    >
                      <img
                        alt="..."
                        src={require('assets/img/theme/team-2-800x800.jpg')}
                      />
                    </a>
                  </Media>
                </th>
                <td>BabyAxie</td>
                <td>$BAXS</td>
                <td>$15,123</td>
                <td>3 Days</td>
                <td>
                  <span className="font-weight-bold">1031</span>
                  <span className="mx-2">
                    <i className="fas fa-arrow-up text-success ml-2" /> 46,53%
                  </span>
                  <Button
                    color="success"
                    href="#"
                    onClick={(e) => e.preventDefault()}
                    size="md"
                  >
                    Vote
                  </Button>
                </td>
              </tr>
              <tr>
                <th scope="row">
                  <Media className="align-items-center">
                    <a
                      className="avatar rounded-circle mr-3"
                      href="#"
                      onClick={(e) => e.preventDefault()}
                    >
                      <img
                        alt="..."
                        src={require('assets/img/theme/team-3-800x800.jpg')}
                      />
                    </a>
                  </Media>
                </th>
                <td>BabyAxie</td>
                <td>$BAXS</td>
                <td>$15,123</td>
                <td>3 Days</td>
                <td>
                  <span className="font-weight-bold">1031</span>
                  <span className="mx-2">
                    <i className="fas fa-arrow-up text-success ml-2" /> 46,53%
                  </span>
                  <Button
                    color="success"
                    href="#"
                    onClick={(e) => e.preventDefault()}
                    size="md"
                  >
                    Vote
                  </Button>
                </td>
              </tr>
              <tr>
                <th scope="row">
                  <Media className="align-items-center">
                    <a
                      className="avatar rounded-circle mr-3"
                      href="#"
                      onClick={(e) => e.preventDefault()}
                    >
                      <img
                        alt="..."
                        src={require('assets/img/theme/team-4-800x800.jpg')}
                      />
                    </a>
                  </Media>
                </th>
                <td>BabyAxie</td>
                <td>$BAXS</td>
                <td>$15,123</td>
                <td>3 Days</td>
                <td>
                  <span className="font-weight-bold">1031</span>
                  <span className="mx-2">
                    <i className="fas fa-arrow-up text-success ml-2" /> 46,53%
                  </span>
                  <Button
                    color="success"
                    href="#"
                    onClick={(e) => e.preventDefault()}
                    size="md"
                  >
                    Vote
                  </Button>
                </td>
              </tr>
              <tr>
                <th scope="row">
                  <Media className="align-items-center">
                    <a
                      className="avatar rounded-circle mr-3"
                      href="#"
                      onClick={(e) => e.preventDefault()}
                    >
                      <img
                        alt="..."
                        src={require('assets/img/theme/team-3-800x800.jpg')}
                      />
                    </a>
                  </Media>
                </th>
                <td>BabyAxie</td>
                <td>$BAXS</td>
                <td>$15,123</td>
                <td>3 Days</td>
                <td>
                  <span className="font-weight-bold">1031</span>
                  <span className="mx-2">
                    <i className="fas fa-arrow-up text-success ml-2" /> 46,53%
                  </span>
                  <Button
                    color="success"
                    href="#"
                    onClick={(e) => e.preventDefault()}
                    size="md"
                  >
                    Vote
                  </Button>
                </td>
              </tr>
            </tbody>
          </Table>
        </Card>
      </Col>
    </Row>
  );
};

export default PromoTable;
