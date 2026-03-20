'use client';

import { useState } from 'react';

export default function CopyButton({ article }: { article: any }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // 마크다운 템플릿
    const markdown = `### [${article.korean_title}](${article.source_url})
**출처**: ${article.source} | **작성일**: ${new Date(article.created_at).toLocaleDateString()}

${article.summary}

${article.tags && article.tags.length > 0 ? article.tags.map((t: string) => `#${t.replace(/\s+/g, '')}`).join(' ') : ''}`;

    navigator.clipboard.writeText(markdown).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // 2초 뒤 원복
    });
  };

  return (
    <div
      onClick={handleCopy}
      role="button"
      className={`absolute top-6 right-6 z-10 p-2 rounded-lg border transition-all duration-300 flex items-center gap-1.5 cursor-pointer
        ${
          copied 
            ? 'bg-green-500/10 border-green-500/30 text-green-600 dark:text-green-500' 
            : 'bg-gray-100 dark:bg-[#222] border-gray-200 dark:border-[#333] text-gray-500 dark:text-gray-400 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-900/40 dark:hover:text-blue-400 opacity-0 group-hover:opacity-100'
        }`}
      aria-label="Copy Markdown"
      title="Markdown으로 복사"
    >
      {copied ? (
        <>
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
          <span className="text-[0.6rem] font-bold tracking-widest uppercase">Copied</span>
        </>
      ) : (
        <>
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          <span className="text-[0.6rem] font-bold tracking-widest uppercase">Copy MD</span>
        </>
      )}
    </div>
  );
}
