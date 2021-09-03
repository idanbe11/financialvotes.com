import moment from 'moment';

const getSources = (events) => {
  let sourceDict = {},
    sources = [];
  // traverse each event
  for (let i = 0; i < events.length; i += 1) {
    const event = events[i];
    let tempData;
    // check if path exists on sourceDict and add views, clicks and conversions
    if (Object.prototype.hasOwnProperty.call(sourceDict, event.source)) {
      let views, clicks, conversion;
      views = sourceDict[event.source]['views'] + 1;
      clicks = sourceDict[event.source]['clicks'] + 1;
      conversion = parseFloat((clicks / (clicks + views)) * 100).toPrecision(4);
      tempData = {
        path: event.source,
        views,
        clicks,
        conversion
      };
    } else {
      tempData = {
        path: event.source
      };
      if (event.type === 'Load') {
        tempData['views'] = 1;
        tempData['clicks'] = 0;
        tempData['conversion'] = 0;
      }
      if (event.type === 'Click') {
        tempData['clicks'] = 1;
        tempData['views'] = 0;
        tempData['conversion'] = 1;
      }
    }
    sourceDict[event.source] = tempData;
  }
  for (const key in sourceDict) {
    if (Object.hasOwnProperty.call(sourceDict, key)) {
      const element = sourceDict[key];
      sources.push(element);
    }
  }
  return sources;
};

const getOSInfo = (events) => {
  let osDict = {},
    osInfos = [];
  // traverse each event
  for (let i = 0; i < events.length; i += 1) {
    const event = events[i];
    let tempData;
    // check if path exists on osDict and add views, clicks and conversions
    if (Object.prototype.hasOwnProperty.call(osDict, event.osInfo.osName)) {
      let views, clicks, rate;
      views = osDict[event.osInfo.osName]['views'] + 1;
      clicks = osDict[event.osInfo.osName]['clicks'] + 1;
      rate = parseFloat((clicks / (clicks + views)) * 100).toPrecision(4);
      tempData = {
        name: event.osInfo.osName,
        views,
        clicks,
        rate
      };
    } else {
      tempData = {
        name: event.osInfo.osName
      };
      if (event.type === 'Load') {
        tempData['views'] = 1;
        tempData['clicks'] = 0;
        tempData['rate'] = 0;
      }
      if (event.type === 'Click') {
        tempData['clicks'] = 1;
        tempData['views'] = 0;
        tempData['rate'] = 1;
      }
    }
    osDict[event.osInfo.osName] = tempData;
  }
  for (const key in osDict) {
    if (Object.hasOwnProperty.call(osDict, key)) {
      const element = osDict[key];
      osInfos.push(element);
    }
  }
  return osInfos;
};

const createReport = (data) => {
  let report = {},
    primary = {},
    primaryViews = [],
    primaryClicks = [],
    secondary = [],
    sources = [],
    osInfo = [],
    summary = {
      engagements: 0,
      views: 0,
      clicks: 0,
      conversion: 0
    },
    loadEvents = [],
    clickEvents = [],
    totalEvents = [];
  let nEngagements = 0,
    views = 0,
    clicks = 0,
    conversion = 0;
  try {
    for (let i = 0; i < data.length; i += 1) {
      const element = data[i];
      // one analytics report entity
      // filter analalytics load events
      const tempLoadEvents = element.events.filter((elem) => elem.type === 'Load');
      const tempClickEvents = element.events.filter((elem) => elem.type === 'Click');
      const tempViewData = {
        label: moment(element.date).format('MMM - Do'),
        value: tempLoadEvents.length
      };
      const tempClickData = {
        label: moment(element.date).format('MMM - Do'),
        value: tempClickEvents.length
      };
      const tempSecondaryData = {
        label: moment(element.date).format('MMM - Do'),
        value: element.events.length
      };
      primaryViews.push(tempViewData);
      primaryClicks.push(tempClickData);
      // create secondary
      secondary.push(tempSecondaryData);
      loadEvents.push(...tempLoadEvents);
      clickEvents.push(...tempClickEvents);
      totalEvents.push(...tempLoadEvents, ...tempClickEvents);
      // console.log(totalEvents);
    }
    // console.log(loadEvents, 'LOAD/n');
    // console.log(clickEvents, 'CLICK/n');
    // create primary
    primary = {
      views: primaryViews,
      clicks: primaryClicks
    };
    // create sources
    sources = getSources(totalEvents);
    // create osInfo
    osInfo = getOSInfo(totalEvents);
    // create summary
    nEngagements = Number(totalEvents.length);
    views = Number(loadEvents.length);
    clicks = Number(clickEvents.length);
    conversion = parseFloat((clicks / nEngagements) * 100).toPrecision(4);
    // summary
    summary = {
      engagements: nEngagements,
      views,
      clicks,
      conversion
    };
    const report = {
      primary,
      secondary,
      sources,
      osInfo,
      summary
    };
    // console.log(report);
    return report;
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = {
  createReport
};
