import { useEffect, useState } from 'react';
import * as _ from 'lodash';
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
  Spinner
} from 'reactstrap';
import Pagination from 'components/Elements/Pagination/Pagination';
import classNames from 'classnames';
import { getTodaysBestCoins, getAllTimeBestCoins } from 'lib/api';
import CoinTableItem from './CoinTableItem';

const pageSize = 10;

const CoinTable = ({ title, getter = getTodaysBestCoins }) => {
  const [activeTab, setActiveTab] = useState('default');

  const toggle = (tab) => {
    if (activeTab !== tab) {
      setActiveTab(tab);
      setCurrentPage(1);
    }
  };

  const [loading, setLoading] = useState(true);
  const [coins, setAllCoins] = useState([]);
  const [coinsPage, setCoinsPage] = useState([]);
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

  const arrangeCoins = (array) => {
    let finalCoin = {},
      finalCoins = [];
    array.map((item) => {
      finalCoin = _.cloneDeep(item);
      if (finalCoin.in_coingecko && !!finalCoin.data && !!finalCoin.data.quote) {
        finalCoin['price'] = finalCoin.data.quote.price;
        finalCoin['market_cap'] = finalCoin.data.quote.market_cap;
        finalCoin['one_hour'] = finalCoin.data.quote.price_change_percentage_1h;
      } else {
        finalCoin['one_hour'] = 0;
      }
      finalCoins.push(finalCoin);
    });
    return finalCoins;
  };

  useEffect(() => {
    const fetchAllCoins = async () => {
      const data = await getter();
      setAllCoins(data);
      setCoinsPage(
        arrangeCoins(data.slice((currentPage - 1) * pageSize, currentPage * pageSize))
      );
      setCount(data.length);
      setPageCount(Math.ceil(data.length / pageSize));
      setLoading(false);
    };
    fetchAllCoins();
  }, []);

  useEffect(() => {
    // console.log(activeTab);
    const fetchAllCoins = async () => {
      setLoading(true);
      const data = await getTodaysBestCoins();
      setAllCoins(data);
      setCoinsPage(
        arrangeCoins(data.slice((currentPage - 1) * pageSize, currentPage * pageSize))
      );
      setCount(data.length);
      setPageCount(Math.ceil(data.length / pageSize));
      setLoading(false);
    };
    const fetchAllTimeBestCoins = async () => {
      setLoading(true);
      const data = await getAllTimeBestCoins();
      setAllCoins(data);
      setCoinsPage(
        arrangeCoins(data.slice((currentPage - 1) * pageSize, currentPage * pageSize))
      );
      setCount(data.length);
      setPageCount(Math.ceil(data.length / pageSize));
      setLoading(false);
    };
    if (!title && activeTab === 'alltime') {
      fetchAllTimeBestCoins();
    } else if (!title && activeTab === 'default') {
      fetchAllCoins();
    }
  }, [activeTab, title]);

  const sortCoinsByProperty = (prop) => {
    coinsPage.sort((a, b) => {
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
        // console.log(a[prop], b[prop], a[prop] - b[prop]);
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
        // console.log(a[prop], b[prop], b[prop] - a[prop]);
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

  useEffect(() => {
    setCoinsPage(
      arrangeCoins(coins.slice((currentPage - 1) * pageSize, currentPage * pageSize))
    );
  }, [currentPage]);

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

  // console.log(coins, votes, count, pageCount, currentPage, coinsPage, activeTab);

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
                        // className={classNames({
                        //   sort: true,
                        //   active: sorting.selected === 'launch_date'
                        // })}
                        // data-sort="launch_date"
                        scope="col"
                        // onClick={() => sortCoinsByProperty('launch_date')}
                      >
                        Time since launch
                      </th>
                      <th scope="col" className="text-center">
                        Votes
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {!!coinsPage &&
                      Array.isArray(coinsPage) &&
                      coinsPage.map((item) => (
                        <CoinTableItem
                          key={item.id}
                          coin={item}
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
                        style={{
                          padding: '0.5rem 1rem',
                          cursor: 'pointer',
                          fontSize: '0.8rem'
                        }}
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
                        style={{
                          padding: '0.5rem 1rem',
                          cursor: 'pointer',
                          fontSize: '0.8rem'
                        }}
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
                      <th scope="col" className="text-center">
                        Votes
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {!!coinsPage &&
                      Array.isArray(coinsPage) &&
                      coinsPage.map((item) => (
                        <CoinTableItem
                          key={item.id}
                          coin={item}
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
