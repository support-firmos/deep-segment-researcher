// src/app/page.tsx
'use client';

import { useState } from 'react';
import ResearchForm from '@/components/ResearchForm';
import ResearchResult from '@/components/ResearchResult';

interface FormData {
  segmentInfo: string;
}

export default function Home() {
  const [generatedResearch, setGeneratedResearch] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progressStatus, setProgressStatus] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const generateResearch = async (formData: FormData) => {
    setError(null);
    setIsGenerating(true);
    setGeneratedResearch('');
    setProgressStatus('Deep Segment Research on-going...');

    try {
      const response = await fetch('/api/deep-segment-research', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ segmentInfo: formData.segmentInfo }),
      });

      if (!response.ok) {
        throw new Error(`Failed to generate Deep Segment Research: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.result) {
        throw new Error('No result returned from Deep Segment Research');
      }
      
      setGeneratedResearch(data.result);
      
    } catch (error) {
      console.error('Error generating research:', error);
      setError('An error occurred while generating the Deep Segment Research. Please try again.');
      setGeneratedResearch(null);
    } finally {
      setIsGenerating(false);
      setProgressStatus('');
    }
  };

  const resetGenerator = () => {
    setGeneratedResearch(null);
    setError(null);
  };

  return (
    <div className="py-10 px-4 container mx-auto">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2 text-[#f7f8f8]">Deep Segment Research</h1>
          <p className="text-[#8a8f98]">
            Perform research and generate ideas based on Ideal Customer Profile (ICP).
          </p>
        </div>
        
        {error && (
          <div className="bg-red-900/30 border border-red-700/30 text-red-300 px-4 py-3 rounded-xl mb-6">
            {error}
          </div>
        )}
        
        <div className="card">
          {generatedResearch ? (
            <ResearchResult 
              content={generatedResearch}
              onReset={resetGenerator}
            />
          ) : (
            <ResearchForm onSubmit={generateResearch} />
          )}
        </div>
        
        {isGenerating && (
          <div className="text-center mt-4">
            <p className="text-[#8a8f98]">
              {progressStatus || 'Performing Deep Segment Research...'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}