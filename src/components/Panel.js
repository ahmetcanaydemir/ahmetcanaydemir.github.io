import React from 'react';

const systemFont = `system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI",
    "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans",
    "Droid Sans", "Helvetica Neue", sans-serif`;
    
function Panel({ children }) {
  return (
    <div
      style={{
        fontSize: '0.9em',
        border: '1px solid var(--hr)',
        borderRadius: '0.75em',
        padding: '0.75em',
        background: 'var(--inlineCode-bg)',
        wordBreak: 'keep-all',
        fontFamily: systemFont,
      }}
    >
      {children}
    </div>
  );
}

export default Panel;
