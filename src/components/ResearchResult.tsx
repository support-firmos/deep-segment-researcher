// components/ResearchResult.tsx
import { useState, useEffect, useRef } from 'react';
import Button from './Button';

interface ResearchResultProps {
  content: string;
  onReset: () => void;
  isGenerating: boolean;
}

export default function ResearchResult({ 
  content, 
  onReset,
  isGenerating
}: ResearchResultProps) {
  const [copySuccess, setCopySuccess] = useState('');
  const resultRef = useRef<HTMLPreElement>(null);
  
  // Auto-scroll to the bottom when new content is added
  useEffect(() => {
    if (resultRef.current) {
      resultRef.current.scrollTop = resultRef.current.scrollHeight;
    }
  }, [content]);
  
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopySuccess('Copied!');
      setTimeout(() => setCopySuccess(''), 2000);
    } catch {
      setCopySuccess('Failed to copy');
    }
  };
  
  const handleDownload = () => {
    const element = document.createElement('a');
    const file = new Blob([content], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = 'Deep_Segment_Research.txt';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-[#f7f8f8] flex items-center">
          {isGenerating ? 'Generating Results...' : 'Results'}
          {isGenerating && (
            <div className="ml-2 inline-block w-5 h-5 border-t-2 border-r-2 border-[#8a8f98] rounded-full animate-spin"></div>
          )}
        </h2>
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleCopy}
            disabled={isGenerating || !content}
            className="text-[#f7f8f8] border border-[#8a8f98]/40 hover:bg-[#1A1A1A] disabled:opacity-50"
          >
            {copySuccess || 'Copy'}
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleDownload}
            disabled={isGenerating || !content}
            className="text-[#f7f8f8] border border-[#8a8f98]/40 hover:bg-[#1A1A1A] disabled:opacity-50"
          >
            Download
          </Button>
          <Button 
            variant="secondary" 
            size="sm" 
            onClick={onReset}
            disabled={isGenerating}
            className="bg-[#1A1A1A] text-[#f7f8f8] border border-[#8a8f98]/20 hover:bg-[#202020] disabled:opacity-50"
          >
            Reset
          </Button>
        </div>
      </div>
      
      <div className="bg-[#141414] p-5 rounded-xl border border-[#8a8f98]/20 h-[500px] overflow-auto">
        <pre 
          ref={resultRef}
          className="whitespace-pre-wrap text-[#f7f8f8] font-mono text-sm h-full"
        >
          {content}
          {isGenerating && (
            <span className="inline-block animate-pulse">▌</span>
          )}
        </pre>
      </div>
      
      {isGenerating && (
        <div className="text-center mt-2">
          <p className="text-[#8a8f98]">
            Generating research... This may take a minute.
          </p>
        </div>
      )}
    </div>
  );
}