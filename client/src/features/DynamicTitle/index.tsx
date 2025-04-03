import type React from 'react';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export function DynamicTitle(): React.JSX.Element {
  const location = useLocation();

  useEffect(() => {
    const newTitle = `SW - ${location.pathname}`;
    document.title = newTitle;
  }, [location]);

  return <></>;
}
