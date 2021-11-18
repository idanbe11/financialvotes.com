import React from 'react';
import ReactMarkdown from 'react-markdown';
import { PropTypes } from 'prop-types';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { materialDark } from 'react-syntax-highlighter/dist/cjs/styles/prism';

const RichText = ({ content, centerAligned = false }) => (
  <ReactMarkdown
    className={`container line-break ${centerAligned ? 'center-align' : ''}`}
    components={{
      code({ className, children }) {
        // Removing "language-" because React-Markdown already added "language-"
        const language = className.replace('language-', '');
        return (
          <SyntaxHighlighter
            style={materialDark}
            language={language}
            children={children[0]}
          />
        );
      }
    }}
  >
    {content}
  </ReactMarkdown>
);

RichText.propTypes = {
  content: PropTypes.string.isRequired
};

export default RichText;
