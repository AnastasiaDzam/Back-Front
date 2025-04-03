import styles from './LinksWidget.module.css';
import React from 'react';
import { Favicon } from '@/shared/ui/Favicon';
import type { LinkType } from '@/entities/wishlist/model';

type Props = {
  links: LinkType[];
};

export function LinksWidget({ links }: Props): React.JSX.Element {
  return (
    <div className={styles.linksContainer}>
      {links.map((link) => (
        <div key={link.src} className={styles.linkWrapper}>
          <Favicon url={link.src} />
          <a href={link.src} target="_blank" rel="noopener noreferrer">
            ссылка
          </a>
        </div>
      ))}
    </div>
  );
}
