import React from 'react';

const style = {
  width: '100%',
  maxWidth: '100%',
  height: '100%',
  maxHeight: '120px'
};

const PlaceHolder = ({ defaultImageUrl, mobileImageUrl }) => {
  return (
    <>
      <img style={style} className="d-md-none" src={mobileImageUrl} />
      <img style={style} className="d-none d-md-block" src={defaultImageUrl} />
    </>
  );
};

export default PlaceHolder;
