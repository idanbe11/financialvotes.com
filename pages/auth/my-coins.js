import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/client';
import Link from 'next/link';
import moment from 'moment';
// reactstrap components
import { Card, CardHeader, CardBody, Table, Container, Row, Col } from 'reactstrap';
// layout for this page
import AuthHeader from 'components/Headers/AuthHeader';
import Auth from 'layouts/Auth';
import { getMyCoins, getAllCoinVotes } from 'lib/api';

const TableItem = ({ coin_id, name, symbol, votes, promoted, created }) => {
  let noVotes = 0;
  for (let i = 0; i < votes.length; i++) {
    const element = votes[i];
    if (coin_id === element.coin_id) {
      noVotes = element.votes;
    }
  }
  return (
    <tr>
      <th scope="row">{`${name} (${symbol})`}</th>
      <td>{String(promoted).toUpperCase()}</td>
      <td>{noVotes}</td>
      <td>{moment(new Date(created)).fromNow()}</td>
    </tr>
  );
};

const MyCoins = (props) => {
  const [myCoins, setMyCoins] = useState([]);
  const [votes, setVotes] = useState([]);
  const [fetched, setFetched] = useState(false);
  const [session, loading] = useSession();

  useEffect(() => {
    const fetchMyCoins = async () => {
      const data = await getMyCoins(session.jwt);
      setMyCoins(data);
      setFetched(true);
    };
    const fetchVotes = async () => {
      const data = await getAllCoinVotes();
      setVotes(data);
    };
    if (!fetched && !loading && !!session.jwt) {
      fetchMyCoins();
      fetchVotes();
    }
  }, [session, loading, fetched]);

  // console.log(myCoins, votes);

  return (
    <>
      <AuthHeader />
      {/* Page content */}
      <Container className="mt--7" fluid>
        <Row className="mt-5">
          <Col className="mb-5 mb-xl-0" xl="12">
            <Card className="shadow">
              <CardHeader className="border-0">
                <Row className="align-items-center">
                  <div className="col">
                    <h3 className="mb-0">My Coins</h3>
                  </div>
                </Row>
              </CardHeader>
              {fetched && !!myCoins && Array.isArray(myCoins) && myCoins.length > 0 ? (
                <Table className="align-items-center table-flush" responsive>
                  <thead className="thead-light">
                    <tr>
                      <th scope="col">Name</th>
                      <th scope="col">Promoted</th>
                      <th scope="col">Votes</th>
                      <th scope="col">Created</th>
                    </tr>
                  </thead>
                  <tbody>
                    {myCoins.map((coin, index) => (
                      <TableItem
                        key={coin.id}
                        coin_id={coin.id}
                        name={coin.name}
                        votes={votes}
                        symbol={coin.symbol}
                        promoted={coin.promoted}
                        created={coin.launch_date}
                      />
                    ))}
                  </tbody>
                </Table>
              ) : fetched ? (
                <CardBody>
                  <div className="text-center my-5">
                    <h3 className="text-light">No coins so far!</h3>
                  </div>
                </CardBody>
              ) : (
                <CardBody>
                  <div className="text-center my-5">
                    <h3 className="text-light">Please wait...</h3>
                  </div>
                </CardBody>
              )}
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

MyCoins.layout = Auth;
MyCoins.protected = true;

export default MyCoins;
