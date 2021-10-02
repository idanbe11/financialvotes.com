import React from 'react';
import Error from 'next/error';

export default function _error({ errorCode }) {
  if (errorCode) {
    return <Error statusCode={errorCode} />;
  }

  return <Error statusCode={500} />;
}
