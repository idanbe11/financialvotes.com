import { Media } from 'reactstrap';
import moment from 'moment';
import Link from 'next/link';

const TableItem = ({ coin, size = 'large' }) => {
  const { id, in_coingecko, name, logo, data, slug, symbol, launch_date, votes } = coin;
  // let noVotes = 0;
  let market_cap = null,
    percent_change_1h = null;

  // for (let i = 0; i < votes.length; i++) {
  //   const element = votes[i];
  //   if (id === element.coin_id) {
  //     noVotes = element.votes;
  //   }
  // }

  if (in_coingecko) {
    market_cap = data.quote.market_cap;
    percent_change_1h = data.quote.price_change_percentage_1h;
  }

  return (
    <tr>
      <th scope="row">
        <Media className="align-items-center">
          <Link href={`/coins/${slug}`}>
            <a className="avatar rounded-circle mr-3" href={`/coins/${slug}`}>
              {!!in_coingecko
                ? !!data.image &&
                  !!data.image.small && (
                    <img alt={slug + '-logo'} src={data.image.small} />
                  )
                : !!logo && logo.url && <img alt={slug + '-logo'} src={logo.url} />}
            </a>
          </Link>
        </Media>
      </th>
      <td>
        <Link href={`/coins/${slug}`}>
          <a href={`/coins/${slug}`} className="text-dark">
            {`${name} ${
              size === 'large'
                ? in_coingecko
                  ? `(${String(data.symbol).toUpperCase()})`
                  : `(${String(symbol).toUpperCase()})`
                : ''
            }`}
          </a>
        </Link>
      </td>
      {size === 'large' && (
        <>
          <td>
            {percent_change_1h !== null ? (
              <>
                {!!percent_change_1h && percent_change_1h <= 0 && (
                  <>
                    <i className="fas fa-arrow-down text-danger ml-2" />{' '}
                    {Number(percent_change_1h.toFixed(2))}%
                  </>
                )}
                {!!percent_change_1h && percent_change_1h >= 0 && (
                  <>
                    <i className="fas fa-arrow-up text-success ml-2" />{' '}
                    {Number(percent_change_1h.toFixed(2))}%
                  </>
                )}
              </>
            ) : (
              '-'
            )}
          </td>
          <td>
            {market_cap !== null
              ? new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'USD'
                }).format(market_cap)
              : '-'}
          </td>
          <td>
            {in_coingecko && !!data.genesis_date
              ? moment(new Date(data.genesis_date)).fromNow()
              : moment(new Date(launch_date)).fromNow()}
          </td>
        </>
      )}
      <td>
        <span className="font-weight-bold mr-2">{votes}</span>
        <Link href={`/coins/${slug}?vote=true`}>
          <a
            href={`/coins/${slug}?vote=true`}
            className={`text-dark btn btn-success ${
              size === 'large' ? 'btn-md' : 'btn-sm'
            }`}
          >
            Vote
          </a>
        </Link>
      </td>
    </tr>
  );
};

export default TableItem;
