import React, { useState, useEffect } from 'react';
import Placeholder from './PlaceHolder';
import { getAdvert, sendAnalyticsEvents } from 'lib/api';

const Advertisement = ({ source = 'Homepage' }) => {
  const [state, setState] = useState({
    initial: true,
    fetched: false,
    shouldRender: false,
    advert: {}
  });

  const { advert, shouldRender } = state;

  const updateState = (updated) => {
    setState({
      ...state,
      ...updated
    });
  };

  useEffect(() => {
    const fetchAdvertisement = async () => {
      const data = await getAdvert();
      if (!!data && !!data.id) {
        updateState({
          fetched: true,
          initial: false,
          advert: data
        });
      } else {
        updateState({
          fetched: false,
          initial: false
        });
      }
    };

    if (!state.fetched && state.initial) {
      fetchAdvertisement();
    }
  }, [state]);

  useEffect(() => {
    const sendViewAdAnalytics = async () => {
      await sendAnalyticsEvents({
        advertisement_id: advert.id,
        source,
        events: [
          {
            type: 'Load',
            timestamp: Date.now()
          }
        ]
      });
    };

    if (
      !state.shouldRender &&
      advert !== {} &&
      !!advert.bannerMedia &&
      Array.isArray(advert.bannerMedia)
    ) {
      updateState({
        shouldRender: true
      });
    }

    if (state.shouldRender) {
      sendViewAdAnalytics();
    }
  }, [state]);

  const handleAdClick = async (e) => {
    await sendAnalyticsEvents({
      advertisement_id: advert.id,
      source,
      events: [
        {
          type: 'Click',
          timestamp: Date.now()
        }
      ]
    });
  };

  //   console.log(advert);

  return (
    <>
      {shouldRender && (
        <a
          href={advert.link}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleAdClick}
        >
          <Placeholder
            mobileImageUrl={
              !!advert.bannerMedia[0].formats
                ? advert.bannerMedia[0].formats.thumbnail.url
                : advert.bannerMedia[0].url
            }
            defaultImageUrl={advert.bannerMedia[0].url}
          />
        </a>
      )}
    </>
  );
};

export default Advertisement;
