import React from 'react';
import PropTypes from 'prop-types';
import { iconsList } from '../../variables/icons';
import RichText from 'components/Elements/RichText';

const RoadMapItem = ({ title, time, description, color, icon }) => (
  <div className="vertical-timeline-item vertical-timeline-element">
    <div>
      <span className="vertical-timeline-element-icon bounce-in">
        <i className={`ni ${iconsList[icon]} text-${color}`}></i>
      </span>
      <div className="vertical-timeline-element-content bounce-in">
        <h4 className={`timeline-title mb-4 text-${color}`}>{title}</h4>
        {!!description && <RichText content={description} />}
        <span className="vertical-timeline-element-date">{time}</span>
      </div>
    </div>
  </div>
);

RoadMapItem.propTypes = {
  title: PropTypes.string.isRequired,
  time: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired
};

export default RoadMapItem;
