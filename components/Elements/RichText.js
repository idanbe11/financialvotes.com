import React from 'react';
import ReactMarkdown from 'react-markdown';
import { PropTypes } from 'prop-types';

const RichText = ({ content }) => <ReactMarkdown>{content}</ReactMarkdown>;

RichText.propTypes = {
  content: PropTypes.string.isRequired
};

export default RichText;
