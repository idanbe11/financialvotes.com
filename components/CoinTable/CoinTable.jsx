import { useEffect, useState } from 'react';
import {
  Card,
  CardHeader,
  Col,
  Row,
  Table,
  CardFooter,
  Nav,
  NavItem,
  NavLink,
  Button,
  CardTitle,
  CardText,
  Spinner
} from 'reactstrap';
import Pagination from 'components/Elements/Pagination/Pagination';
import classNames from 'classnames';
import { getAllCoins, getAllCoinVotes, getCoinsCount } from 'lib/api';
import CoinTableItem from './CoinTableItem';

const pageSize = 10;

const CoinTable = ({ title, getter = getAllCoins }) => {
  const [activeTab, setActiveTab] = useState('default');

  const toggle = (tab) => {
    if (activeTab !== tab) setActiveTab(tab);
  };

  const [loading, setLoading] = useState(true);
  const [coins, setAllCoins] = useState([]);
  const [votes, setVotes] = useState([]);
  const [count, setCount] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [sorting, setSorting] = useState({
    selected: '',
    name: {
      order: 1
    },
    one_hour: {
      order: 1
    },
    market_cap: {
      order: 1
    },
    launch_date: {
      order: 1
    }
  });

  useEffect(() => {
    const fetchAllCoins = async () => {
      const data = await getter();
      setAllCoins(data);
      setCount(data.length);
      setPageCount(Math.ceil(data.length / pageSize));
      setLoading(false);
    };
    const fetchVotes = async () => {
      const data = await getAllCoinVotes();
      setVotes(data);
    };
    fetchAllCoins();
    fetchVotes();
  }, []);

  const sortCoinsByProperty = (prop) => {
    coins.sort((a, b) => {
      if (sorting[prop]['order'] % 2 === 1) {
        if (prop === 'name') {
          if (a[prop] > b[prop]) {
            return -1;
          }
          if (b[prop] > a[prop]) {
            return 1;
          }
          return 0;
        }
        return a[prop] - b[prop];
      } else {
        if (prop === 'name') {
          if (a[prop] > b[prop]) {
            return 1;
          }
          if (b[prop] > a[prop]) {
            return -1;
          }
          return 0;
        }
        return b[prop] - a[prop];
      }
    });
    setSorting({
      ...sorting,
      selected: prop,
      [prop]: {
        order: sorting[prop]['order'] + 1
      }
    });
  };

  const CoinTableFooter = () => {
    const handleChange = (value) => {
      setCurrentPage(value);
    };

    return (
      <>
        <CardFooter className="py-4">
          <nav>
            <Pagination
              className="pagination-bar"
              currentPage={currentPage}
              totalCount={count}
              pageSize={pageSize}
              onPageChange={handleChange}
              style={{ float: 'right', flexWrap: 'wrap' }}
            />
          </nav>
        </CardFooter>
      </>
    );
  };

  // console.log(coins, votes, count, pageCount, currentPage, activeTab);

  return (
    <>
      <Row className="my-5 d-none d-lg-block">
        <Col className="mb-5 mb-xl-0" xl="12">
          <Card className="shadow">
            <CardHeader className="border-0" style={{ padding: '1.5rem 1.25rem' }}>
              {!!title ? (
                <Row className="align-items-center">
                  <div className="col">
                    <h3 className="mb-0">{title}</h3>
                  </div>
                </Row>
              ) : (
                <div>
                  <Nav tabs>
                    <NavItem>
                      <NavLink
                        className={classNames({ active: activeTab === 'default' })}
                        style={{ padding: '0.5rem 1rem', cursor: 'pointer' }}
                        onClick={() => {
                          toggle('default');
                        }}
                      >
                        Today's Best
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink
                        className={classNames({ active: activeTab === 'alltime' })}
                        style={{ padding: '0.5rem 1rem', cursor: 'pointer' }}
                        onClick={() => {
                          toggle('alltime');
                        }}
                      >
                        All Time Best
                      </NavLink>
                    </NavItem>
                  </Nav>
                </div>
              )}
            </CardHeader>
            {loading ? (
              <div className="container align-items-center">
                <Row className="m-5">
                  <Col className="text-center">
                    Please wait...
                    <Spinner className="mx-5" size="sm" color="info" />
                  </Col>
                </Row>
              </div>
            ) : (
              <>
                <Table className="align-items-center table-flush" responsive>
                  <thead className="thead-light">
                    <tr>
                      <th scope="col">Logo</th>
                      <th
                        className={classNames({
                          sort: true,
                          active: sorting.selected === 'name'
                        })}
                        data-sort="name"
                        scope="col"
                        onClick={() => sortCoinsByProperty('name')}
                      >
                        Name
                      </th>
                      <th
                        className={classNames({
                          sort: true,
                          active: sorting.selected === 'one_hour'
                        })}
                        data-sort="one_hour"
                        scope="col"
                        onClick={() => sortCoinsByProperty('one_hour')}
                      >
                        1h
                      </th>
                      <th
                        className={classNames({
                          sort: true,
                          active: sorting.selected === 'market_cap'
                        })}
                        data-sort="market_cap"
                        scope="col"
                        onClick={() => sortCoinsByProperty('market_cap')}
                      >
                        Market Cap
                      </th>
                      <th
                        className={classNames({
                          sort: true,
                          active: sorting.selected === 'launch_date'
                        })}
                        data-sort="launch_date"
                        scope="col"
                        onClick={() => sortCoinsByProperty('launch_date')}
                      >
                        Time since launch
                      </th>
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
                <CoinTableFooter />
              </>
            )}
          </Card>
        </Col>
      </Row>
      <Row className="my-5 d-lg-none">
        <Col className="mb-5 mb-xl-0" xl="12">
          <Card className="shadow">
            <CardHeader className="border-0" style={{ padding: '1.5rem 1.25rem' }}>
              {!!title ? (
                <Row className="align-items-center">
                  <div className="col">
                    <h3 className="mb-0">{title}</h3>
                  </div>
                </Row>
              ) : (
                <div>
                  <Nav tabs>
                    <NavItem>
                      <NavLink
                        className={classNames({ active: activeTab === 'default' })}
                        style={{ padding: '0.5rem 1rem', cursor: 'pointer' }}
                        onClick={() => {
                          toggle('default');
                        }}
                      >
                        Today's Best
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink
                        className={classNames({ active: activeTab === 'alltime' })}
                        style={{ padding: '0.5rem 1rem', cursor: 'pointer' }}
                        onClick={() => {
                          toggle('alltime');
                        }}
                      >
                        All Time Best
                      </NavLink>
                    </NavItem>
                  </Nav>
                </div>
              )}
            </CardHeader>
            {loading ? (
              <div className="container align-items-center">
                <Row className="m-5">
                  <Col className="text-center">
                    Please wait...
                    <Spinner className="mx-5" size="sm" color="info" />
                  </Col>
                </Row>
              </div>
            ) : (
              <>
                <Table className="align-items-center table-flush" responsive>
                  <thead className="thead-light">
                    <tr>
                      <th scope="col">Logo</th>
                      <th
                        className={classNames({
                          sort: true,
                          active: sorting.selected === 'name'
                        })}
                        data-sort="name"
                        scope="col"
                        onClick={() => sortCoinsByProperty('name')}
                      >
                        Name
                      </th>
                      <th scope="col">Votes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {!!coins &&
                      Array.isArray(coins) &&
                      coins.map((item) => (
                        <CoinTableItem
                          key={item.id}
                          coin={item}
                          votes={votes}
                          size="small"
                        />
                      ))}
                  </tbody>
                </Table>
                <CoinTableFooter />
              </>
            )}
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default CoinTable;
