import React from 'react';

const OutputPanel = ({ output }) => {
  return (
    <div className="output-panel">
      <div className="output-header">Output</div>
      <pre className="output-content">
        {output || 'Output will appear here...'}
      </pre>
    </div>
  );
};

export default OutputPanel;