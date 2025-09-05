import React from 'react';
import { cn } from '@/lib/utils';

interface CodeBlockProps {
  language?: string;
  code: string;
  className?: string;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({
  language = 'typescript',
  code,
  className,
}) => {
  return (
    <pre
      className={cn(
        'relative rounded-lg bg-muted p-4 overflow-x-auto break-words whitespace-pre-wrap sm:whitespace-pre',
        className
      )}
    >
      <code className={`language-${language}`}>{code}</code>
    </pre>
  );
};
