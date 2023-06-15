import React from 'react';

import { Highlighter, HighlighterProps } from '~/components';

export type MarkdownProps = Omit<HighlighterProps, 'searchWords'>;

export function Markdown({
  children,
  ...props
}: MarkdownProps) {

  const [words, setWords] = React.useState<string[]>([]);

  const computedChildren = React.useMemo(() => {
    return children?.replace(/\*\*(.*?)\*\*/g, (_, word) => word);
  }, [children]);

  React.useEffect(() => {
    const boldWords: string[] = [];
    const matches = children?.matchAll(/\*\*(.*?)\*\*/g);
    if (!matches) {
      return;
    }
    for (const match of matches) {
      boldWords.push(match[1]);
    }
    setWords(boldWords);
  }, [children]);

  return (
    <Highlighter
      { ...props }
      highlightStyle={ props.highlightStyle ?? { fontWeight: 'bold' } }
      searchWords={ words }>
      {computedChildren}
    </Highlighter>
  );
}