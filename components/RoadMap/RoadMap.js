import React from 'react';
import PropTypes from 'prop-types';
import RoadMapItem from './RoadMapItem';

const RoadMap = ({ items }) => (
  <div className="vertical-timeline vertical-timeline--animate vertical-timeline--one-column">
    {items.map((item) => (
      <RoadMapItem
        key={item.id}
        title={item.title}
        time={item.time}
        description={item.description}
        color={item.color}
        icon={item.icon}
      />
    ))}
  </div>
);

RoadMap.propTypes = {
  items: PropTypes.array.isRequired
};

export default RoadMap;
