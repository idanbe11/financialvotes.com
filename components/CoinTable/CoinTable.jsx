import { useEffect, useState } from 'react';
import {
  Card,
  CardHeader,
  Col,
  Row,
  Table,
  CardFooter,
  Pagination,
  PaginationItem,
  PaginationLink
} from 'reactstrap';
import { getAllCoins, getAllCoinVotes, getCoinsCount } from 'lib/api';
import CoinTableItem from './CoinTableItem';

const pageSize = 5;

const CoinTable = () => {
  const [loading, setLoading] = useState(true);
  const [coins, setAllCoins] = useState([]);
  const [votes, setVotes] = useState([]);
  const [count, setCound] = useState(0);

  useEffect(() => {
    const fetchAllCoins = async () => {
      const data = await getAllCoins();
      setAllCoins(data);
      setLoading(false);
    };
    const fetchVotes = async () => {
      const data = await getAllCoinVotes();
      setVotes(data);
    };
    const fetchCoinsCount = async () => {
      const data = await getCoinsCount();
      setCound(data);
    };
    fetchCoinsCount();
    fetchAllCoins();
    fetchVotes();
  }, []);

  if (loading) {
    return null;
  }

  return (
    <Row className="my-5">
      <Col className="mb-5 mb-xl-0" xl="12">
        <Card className="shadow">
          <CardHeader className="border-0">
            <Row className="align-items-center">
              <div className="col">
                <h3 className="mb-0">Top Coins</h3>
              </div>
            </Row>
          </CardHeader>
          <Table className="align-items-center table-flush" responsive>
            <thead className="thead-light">
              <tr>
                <th scope="col">Logo</th>
                <th scope="col">Name</th>
                <th scope="col">1h</th>
                <th scope="col">Market Cap</th>
                <th scope="col">Time since launch</th>
                <th scope="col">Votes</th>
              </tr>
            </thead>
            <tbody>
              {!!coins &&
                Array.isArray(coins) &&
                coins.map((item) => (
                  <CoinTableItem key={item.id} coin={item} votes={votes} />
                ))}
            </tbody>
          </Table>
          <CardFooter className="py-4">
            <nav aria-label="...">
              <Pagination
                className="pagination justify-content-end mb-0"
                listClassName="justify-content-end mb-0"
              >
                <PaginationItem className="disabled">
                  <PaginationLink
                    href="#"
                    onClick={(e) => e.preventDefault()}
                    tabIndex="-1"
                  >
                    <i className="fas fa-angle-left" />
                    <span className="sr-only">Previous</span>
                  </PaginationLink>
                </PaginationItem>
                <PaginationItem className="active">
                  <PaginationLink href="#" onClick={(e) => e.preventDefault()}>
                    1
                  </PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#" onClick={(e) => e.preventDefault()}>
                    2 <span className="sr-only">(current)</span>
                  </PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#" onClick={(e) => e.preventDefault()}>
                    3
                  </PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#" onClick={(e) => e.preventDefault()}>
                    <i className="fas fa-angle-right" />
                    <span className="sr-only">Next</span>
                  </PaginationLink>
                </PaginationItem>
              </Pagination>
            </nav>
          </CardFooter>
        </Card>
      </Col>
    </Row>
  );
};

export default CoinTable;
