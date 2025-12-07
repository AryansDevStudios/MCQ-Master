'use client';

import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { cn } from '@/lib/utils';
import 'katex/dist/katex.min.css';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content, className }) => {
  return (
    <ReactMarkdown
      className={cn('prose prose-invert prose-p:my-0 prose-strong:text-inherit max-w-none', className)}
      remarkPlugins={[remarkMath]}
      rehypePlugins={[rehypeKatex]}
      components={{
        p: ({node, ...props}) => <div className="inline" {...props} />,
      }}
    >
      {content}
    </ReactMarkdown>
  );
};

export default MarkdownRenderer;
