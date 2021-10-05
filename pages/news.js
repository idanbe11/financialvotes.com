import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import {
  Container,
  ListGroup,
  ListGroupItem,
  Row,
  ListGroupItemHeading,
  ListGroupItemText
} from 'reactstrap';
import Guest from 'layouts/Guest';
import { getNewsData } from 'lib/api';

import Pagination from 'components/Elements/Pagination/Pagination';

function News({ data }) {
  const router = useRouter();
  const [news, setNews] = useState([]);
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (!!data && data.status === 'success') {
      // console.log(data);

      setNews(data.results);
      setCount(data.totalResults);
      if (data.nextPage) {
        setPage(data.nextPage - 1);
      } else if (data.results.length < 10) {
        setPage(Math.floor(data.totalResults / 10));
      }
    }
  }, [data]);

  const handleChange = (page) => {
    if (page > 0 && page <= count) {
      router.push(`/news?page=${page}`);
    }
  };

  // console.log(count, page, data, news);

  return (
    <Container>
      <Row className="m-3">
        <h1>Latest Crypto News</h1>
      </Row>
      <ListGroup flush>
        {news.length > 0 &&
          news.map((item, index) => (
            <ListGroupItem
              key={index}
              style={{ background: 'transparent' }}
              tag="a"
              href={item.link}
            >
              <ListGroupItemHeading tag="h2">{item.title}</ListGroupItemHeading>
              <ListGroupItemText>{item.description}</ListGroupItemText>
              <p className="text-muted">{item.pubDate}</p>
            </ListGroupItem>
          ))}
      </ListGroup>
      <nav className="text-center my-5">
        <Pagination
          className="pagination-bar"
          currentPage={page}
          totalCount={count}
          pageSize={10}
          onPageChange={handleChange}
          style={{ flexWrap: 'wrap' }}
        />
      </nav>
    </Container>
  );
}

export async function getServerSideProps(context) {
  try {
    let page = 1;

    if (!!context.query.page) {
      page = context.query.page;
    }

    const data = await getNewsData(page);

    return {
      props: { data }
    };
  } catch (error) {
    console.log(error.message);
    return { error };
  }
}

News.layout = Guest;

export default News;
