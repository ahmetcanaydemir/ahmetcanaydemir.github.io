import React from 'react';

function DownIcon(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={20}
      height={20}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      cursor="pointer"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="prefix__feather prefix__feather-chevron-down"
      {...props}
    >
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

export default DownIcon;
