import styles from './Favicon.module.css';
import { type FC, useEffect, useMemo, useState } from 'react';
import { LinkOutlined } from '@ant-design/icons';
import { getURLToFavicon, isValidURL } from '@/shared/utils/getURLToFavicon';

export const Favicon: FC<{ url: string | null | undefined }> = ({ url }) => {
  const [faviconURL, setFaviconURL] = useState<string | null>(null);

  useEffect(() => {
    const fetchFavicon = async (): Promise<void> => {
      if (!url) return;

      try {
        const result = await getURLToFavicon(url);
        setFaviconURL(result);
      } catch (error) {
        console.error('Error fetching favicon:', error);
        setFaviconURL(null);
      }
    };

    void fetchFavicon();
  }, [url]);

  return useMemo(() => {
    if (faviconURL && url && isValidURL.test(url)) {
      return <img className={styles.favicon} src={faviconURL} alt="" />;
    }

    return <LinkOutlined />;
  }, [faviconURL, url]);
};
