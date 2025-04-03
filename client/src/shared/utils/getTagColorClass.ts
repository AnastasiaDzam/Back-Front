export function getTagColorClass(tag: string): string {
  switch (tag) {
    case 'div':
      return 'tagDiv';
    case 'span':
      return 'tagSpan';
    case 'a':
      return 'tagAnchor';
    case 'p':
      return 'tagParagraph';
    case 'button':
      return 'tagButton';
    case 'input':
      return 'tagInput';
    case 'img':
      return 'tagImg';
    case 'ul':
    case 'ol':
    case 'li':
      return 'tagList';
    default:
      return 'tagDefault';
  }
}
