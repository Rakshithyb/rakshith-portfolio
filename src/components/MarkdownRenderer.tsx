import React from 'react';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content, className = '' }) => {
  // Simple, safe, zero-injection markdown parser for standard technical blog and case study markdown
  const lines = content.split('\n');
  const elements: React.ReactNode[] = [];
  let inCodeBlock = false;
  let codeBuffer: string[] = [];
  let codeLanguage = '';

  lines.forEach((line, index) => {
    if (line.startsWith('```')) {
      if (inCodeBlock) {
        // End code block
        elements.push(
          <div key={`code-${index}`} className="my-6 rounded bg-[#0F0F0F] border border-[#363636] overflow-hidden">
            <div className="bg-[#2B2B2B] px-4 py-1.5 border-b border-[#363636] text-[11px] font-mono text-[#BCBCBC] flex items-center justify-between">
              <span>{codeLanguage || 'code'}</span>
            </div>
            <pre className="p-4 text-xs font-mono text-[#DEDEDE] overflow-x-auto leading-relaxed">
              <code>{codeBuffer.join('\n')}</code>
            </pre>
          </div>
        );
        codeBuffer = [];
        inCodeBlock = false;
        codeLanguage = '';
      } else {
        // Start code block
        inCodeBlock = true;
        codeLanguage = line.slice(3).trim();
      }
      return;
    }

    if (inCodeBlock) {
      codeBuffer.push(line);
      return;
    }

    if (line.startsWith('### ')) {
      elements.push(
        <h3 key={index} className="text-base font-semibold tracking-tight text-ink mt-8 mb-3 font-serif">
          {line.replace('### ', '')}
        </h3>
      );
    } else if (line.startsWith('## ')) {
      elements.push(
        <h2 key={index} className="text-lg font-semibold tracking-tight text-ink mt-10 mb-4 font-serif border-b border-divider pb-1">
          {line.replace('## ', '')}
        </h2>
      );
    } else if (line.startsWith('# ')) {
      elements.push(
        <h1 key={index} className="text-2xl font-bold tracking-tight text-ink mt-10 mb-4 font-serif">
          {line.replace('# ', '')}
        </h1>
      );
    } else if (line.startsWith('- ')) {
      elements.push(
        <li key={index} className="ml-4 list-disc text-sm text-ink-muted leading-relaxed my-1">
          {formatInline(line.replace('- ', ''))}
        </li>
      );
    } else if (line.trim() === '') {
      elements.push(<div key={index} className="h-3" />);
    } else {
      elements.push(
        <p key={index} className="text-sm text-ink-muted leading-relaxed my-2 font-serif text-[15px]">
          {formatInline(line)}
        </p>
      );
    }
  });

  return <div className={`prose-minimal ${className}`}>{elements}</div>;
};

function formatInline(text: string): React.ReactNode {
  // Replace bold **text** and `code` safely
  const parts = text.split(/(\*\*.*?\*\*|`.*?`)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={i} className="font-semibold text-ink font-sans">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith('`') && part.endsWith('`')) {
      return (
        <code key={i} className="bg-[#DEDEDE] text-[#171717] px-1.5 py-0.5 rounded text-xs font-mono border border-[#D0D0D0]">
          {part.slice(1, -1)}
        </code>
      );
    }
    return part;
  });
}
