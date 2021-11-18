import { Button, ButtonGroup, Media } from 'reactstrap';
import moment from 'moment';
import Link from 'next/link';

const TableItem = ({ coin, size = 'large' }) => {
  const {
    in_coingecko,
    name,
    logo,
    data,
    slug,
    symbol,
    launch_date,
    votes,
    one_hour,
    market_cap
  } = coin;

  let responsiveStyles = {},
    logoResponsiveStyles = {};
  if (size === 'small') {
    responsiveStyles = {
      padding: '8px 2px 8px 0px',
      marginLeftt: '0',
      marginRight: '0',
      fontSize: '0.8rem'
    };
  } else {
    logoResponsiveStyles = {
      paddingLeft: '22px !important'
    };
  }

  return (
    <tr>
      <td
        scope="row"
        className="pl-2"
        style={{ ...responsiveStyles, ...logoResponsiveStyles }}
      >
        <Media className="align-items-center">
          <Link href={`/coins/${slug}`}>
            <a
              className="avatar rounded-circle mr-3"
              href={`/coins/${slug}`}
              style={{
                marginLeft: size === 'small' ? '0' : '5px',
                marginRight: size === 'small' ? '0' : '5px'
              }}
            >
              {!!in_coingecko
                ? !!data.image &&
                  !!data.image.small && (
                    <img alt={slug + '-logo'} src={data.image.small} />
                  )
                : !!logo && logo.url && <img alt={slug + '-logo'} src={logo.url} />}
            </a>
          </Link>
        </Media>
      </td>
      <td
        style={{
          ...responsiveStyles,
          whiteSpace: size === 'small' ? 'normal' : 'nowrap'
        }}
      >
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
            {!!one_hour ? (
              <>
                {!!one_hour && one_hour < 0 && (
                  <>
                    <i className="fas fa-arrow-down text-danger ml-2" />{' '}
                    {Number(one_hour.toFixed(2))}%
                  </>
                )}
                {!!one_hour && one_hour > 0 && (
                  <>
                    <i className="fas fa-arrow-up text-success ml-2" />{' '}
                    {Number(one_hour.toFixed(2))}%
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
                  currency: 'USD',
                  maximumFractionDigits: 4,
                  maximumSignificantDigits: 10
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

      {size === 'large' ? (
        <td className="text-right">
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
      ) : (
        <td className="text-center" style={responsiveStyles}>
          <ButtonGroup>
            <Button
              className={`text-dark btn btn-secondary ${
                size === 'large' ? 'btn-md' : 'btn-sm'
              }`}
              onClick={(e) => e.preventDefault()}
            >
              <span className="font-weight-bold mr-2">{votes}</span>
            </Button>
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
          </ButtonGroup>
        </td>
      )}
    </tr>
  );
};

export default TableItem;
