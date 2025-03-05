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
      // Enable debugging on Vercel to see what's happening
      console.log('Starting API request to /api/deep-segment-research');
      
      // Create the API request
      const response = await fetch('/api/deep-segment-research', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ segmentInfo: formData.segmentInfo }),
      });

      console.log('Received response:', response.status, response.ok);
      
      if (!response.ok) {
        let errorMessage;
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorData.details || `Failed with status: ${response.status}`;
        } catch (error) {
          console.error('Error parsing SSE data:', error);
          // If we can't parse JSON, get text instead
          errorMessage = await response.text() || `Failed with status: ${response.status}`;
        }
        throw new Error(errorMessage);
      }

      // Get the reader from the response body
      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('Response body is not readable');
      }

      console.log('Starting to read stream');
      
      // Set up the decoder for reading the stream
      const decoder = new TextDecoder();
      let accumulatedText = '';

      // Read the stream chunk by chunk
      while (true) {
        const { done, value } = await reader.read();
        
        if (done) {
          console.log('Stream complete');
          break;
        }
        
        // Decode and append the new chunk
        const text = decoder.decode(value, { stream: true });
        console.log('Received chunk of length:', text.length);
        accumulatedText += text;
        
        // Update the UI with the new text
        setGeneratedResearch(accumulatedText);
      }
      
      // Make sure we set the final text when the stream is complete
      setGeneratedResearch(accumulatedText);
      
    } catch (error) {
      console.error('Error generating research:', error);
      setError(`An error occurred: ${error instanceof Error ? error.message : String(error)}`);
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