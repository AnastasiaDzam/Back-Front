import React from 'react';

type Props = {
  margin?: number;
  thickness?: number;
};

export function Divider({ margin = 10, thickness = 2 }: Props): React.JSX.Element {
  return (
    <div
      style={{
        margin: `${margin}px 0`,
        height: `${thickness}px`,
        width: '100%',
        backgroundColor: `var(--border-primary-color)`,
      }}
    ></div>
  );
}
