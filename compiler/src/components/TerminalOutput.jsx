import React from 'react';
import { FiTerminal } from 'react-icons/fi';

const TerminalOutput = ({ output }) => {
  return (
    <div className="terminal-output">
      <div className="terminal-header">
        <FiTerminal className="icon" />
        <span>Terminal</span>
      </div>
      <pre className="terminal-content">
        {output || 'No output yet. Run your code to see results here.'}
      </pre>
    </div>
  );
};

export default TerminalOutput;