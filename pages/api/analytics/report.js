import axios from 'axios';
import * as _ from 'lodash';
import { createReport } from 'lib/analytics-helper';

const AnalyticsReport = async (req, res) => {
  try {
    // console.log(req.query, req.query.advert);
    if (!req.query.advert) {
      throw new Error('Advert Entity is not specified');
    }
    if (!req.headers.authorization) {
      throw new Error('Authorization is required');
    }
    const advertisementId = req.query.advert;
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/analytics-reports/adverts/${advertisementId}`,
      {
        headers: {
          Authorization: req.headers.authorization
        }
      }
    );
    const reports =
      Array.isArray(response.data) && response.data.length > 0 ? response.data : [];
    if (!_.isEqual(reports, [])) {
      // CREATE ANALYTICS REPORT
      const analyticsReport = createReport(reports);
      // console.log(analyticsReport);
      res.status(200).json(analyticsReport);
    } else {
      // RETURN EMPTY REPORT
      res.status(200).json({
        primary: {
          clicks: [],
          views: []
        },
        secondary: [],
        sources: [],
        osInfo: [],
        summary: {
          engagements: 0,
          views: 0,
          clicks: 0,
          conversion: '0.00'
        }
      });
    }
  } catch (error) {
    console.log(error, error.status);
    res.status(400).json({
      statusCode: 400,
      error: 'Bad Request',
      message: error.message
    });
  }
};

export default AnalyticsReport;
