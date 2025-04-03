import React, { useCallback, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import styles from './DOMTreeAnalyzer.module.css';
import { getTagColorClass } from '@/shared/utils/getTagColorClass';

type TagCount = Record<string, number>;


export function DOMTreeAnalyzer(): React.JSX.Element {
  const [totalNodesState, setTotalNodes] = useState<number>(0);
  const [tagCountsState, setTagCounts] = useState<TagCount>({});
  const location = useLocation();

  const traverseTree = useCallback((node: Node | null, tags: TagCount): number => {
    if (!node) return 0;

    let count = 1;

    if (node.nodeType === Node.ELEMENT_NODE) {
      const tagName = (node as Element).tagName.toLowerCase();
      tags[tagName] = (tags[tagName] || 0) + 1;
    }

    node.childNodes.forEach((child) => {
      count += traverseTree(child, tags);
    });

    return count;
  }, []);

  useEffect(() => {
    const rootElement = document.documentElement;
    const tags: TagCount = {};
    const nodeCount = traverseTree(rootElement, tags);

    setTotalNodes(nodeCount);
    setTagCounts(tags);
  }, [location, traverseTree]);

  return (
    <div className={styles.container}>
      <span>Всего узлов: {totalNodesState}</span>
      <div>
        {Object.entries(tagCountsState).map(([tag, count]) => (
          <div key={tag} className={`${styles.node} ${styles[getTagColorClass(tag)]}`}>
            <span>{tag}</span>
            <span className={styles.nodeCount}>{count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
