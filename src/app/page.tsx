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
      // Create the API request
      const response = await fetch('/api/generate-segments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ segmentInfo: formData.segmentInfo }),
      });

      if (!response.ok) {
        // Check if response is JSON before trying to parse it
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const errorData = await response.json();
          throw new Error(errorData.error || `Failed to generate research: ${response.status}`);
        } else {
          // Handle non-JSON error responses
          const errorText = await response.text();
          throw new Error(`Failed to generate research: ${response.status} - ${errorText || 'Unknown error'}`);
        }
      }

      // Get the reader from the response body
      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('Response body is not readable');
      }

      // Set up the decoder for reading the stream
      const decoder = new TextDecoder();
      let accumulatedText = '';

      // Read the stream chunk by chunk
      while (true) {
        const { done, value } = await reader.read();
        
        if (done) {
          break;
        }
        
        // Decode and append the new chunk
        const text = decoder.decode(value, { stream: true });
        accumulatedText += text;
        
        // Update the UI with the new text
        setGeneratedResearch(accumulatedText);
      }
      
      // Make sure we set the final text when the stream is complete
      setGeneratedResearch(accumulatedText);
      
    } catch (error) {
      console.error('Error generating research:', error);
      setError(`An error occurred: ${error instanceof Error ? error.message : String(error)}`);
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
          {generatedResearch !== null ? (
            <ResearchResult 
              content={generatedResearch}
              onReset={resetGenerator}
              isGenerating={isGenerating}
            />
          ) : (
            <ResearchForm onSubmit={generateResearch} />
          )}
        </div>
        
        {isGenerating && generatedResearch === null && (
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