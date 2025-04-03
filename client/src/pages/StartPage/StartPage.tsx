import { INTRODUCTION_BLOCKS_DATA } from '@/shared/consts/introductionBlocksData';
import { IntroductionBlock } from '@/widgets/IntroductionBlock/IntroductionBlock';
import React from 'react';

export function StartPage(): React.JSX.Element {
  return (
    <>
      {INTRODUCTION_BLOCKS_DATA.map((block) => (
        <IntroductionBlock
          key={block.id}
          title={block.title}
          content={block.content}
          imagePath={block.imagePath}
          imagePosition={block.imagePosition}
        />
      ))}
    </>
  );
}
