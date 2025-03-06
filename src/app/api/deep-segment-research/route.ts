// src/app/api/deep-segment-research/route.ts
import { NextResponse } from 'next/server';

// Set maximum duration to 60 seconds
export const maxDuration = 60;

// Use Node.js runtime to support longer execution times
export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    const { segmentInfo } = await request.json();
    
    if (!segmentInfo || typeof segmentInfo !== 'string') {
      return NextResponse.json({ error: 'Invalid segment information' }, { status: 400 });
    }
    
    const prompt = `You are an empathetic B2B Researcher capable of deeply understanding and embodying the Ideal Customer Profile (ICP) for CFO services.

## Your Task
Analyze each segment provided below and generate a comprehensive market research profile for EACH SEGMENT following the exact structure below. Use the segment information to identify the most relevant and impactful insights.

## Analysis Requirements
For each segment, provide exactly 2 items per category. The questions after each category are guides to help you develop meaningful insights - you don't need to answer all questions, just use them to inform your 2 key points.

Each insight should contain:
- A clear headline that captures the core concept
- One substantive, detailed sentence that provides comprehensive context and explains how CFO services address the specific point

### FEARS
Consider: What keeps them up at night? What worst-case scenarios do they imagine? What job security threats do they perceive? What industry changes or trends do they fear? What concerns do they have about making wrong decisions?

### PAINS
Consider: What daily frustrations do they experience? What processes are inefficient? What challenges do they discuss with peers? What negative experiences have they had with similar services? How do current problems affect their goals?

### OBJECTIONS
Consider: Why might they be skeptical about CFO services? How do they evaluate risks vs benefits? What previous experiences make them wary? What financial concerns do they have? How do they perceive integration difficulty?

### GOALS
Consider: What are their top goals for the next year? How do they measure success? What long-term visions do they have? What immediate milestones are they working toward? How do they prioritize goals?

### VALUES
Consider: What ethical considerations matter when choosing providers? How do they define quality and value? What aspects of company culture do they prioritize? How do they prefer to build vendor relationships? What do they value most in business relationships?

### DECISION-MAKING PROCESSES
Consider: What steps do they follow when evaluating services? Who else is involved in decisions? What criteria matter most? How do they gather and assess information? What external resources do they rely on?

### INFLUENCES
Consider: Which thought leaders do they trust? What publications do they read? How do they engage with professional networks? What role do reviews play? How do industry events influence their decisions?

### COMMUNICATION PREFERENCES
Consider: What channels do they use most? How do they prefer to receive information? What content types do they find engaging? How often do they like vendor contact? What communication tone works best?

## Response Format
"
## Response Format
"
  🔎 🔎 🔎 MARKET RESEARCH - [SEGMENT NAME] 🔎 🔎 🔎

  ⚠️ FEARS ⚠️

  🔴 [Fear 1 - Must be a clear, descriptive headline (4-6 words)]
  💡 [Exactly one sentence of 30-40 words that explains the fear and how CFO services address it. Must include both the business impact and the solution provided by CFO services.]

  🔴 [Fear 2 - Must be a clear, descriptive headline (4-6 words)]
  💡 [Exactly one sentence of 30-40 words that explains the fear and how CFO services address it. Must include both the business impact and the solution provided by CFO services.]

  ⚙️ PAINS ⚙️

  🔴 [Pain 1 - Must be a clear, descriptive headline (4-6 words)]
  💡 [Exactly one sentence of 30-40 words that describes the pain point's financial impact and how CFO services solve it. Must include both the negative consequences and the specific solution.]

  🔴 [Pain 2 - Must be a clear, descriptive headline (4-6 words)]
  💡 [Exactly one sentence of 30-40 words that describes the pain point's financial impact and how CFO services solve it. Must include both the negative consequences and the specific solution.]

  ⛔ OBJECTIONS ⛔

  🔴 [Objection 1 - Must be a clear, descriptive headline (4-6 words)]
  💡 [Exactly one sentence of 30-40 words that explains the objection and how to counter it. Must address both the concern and provide a specific counterpoint relevant to CFO services.]

  🔴 [Objection 2 - Must be a clear, descriptive headline (4-6 words)]
  💡 [Exactly one sentence of 30-40 words that explains the objection and how to counter it. Must address both the concern and provide a specific counterpoint relevant to CFO services.]

  🎯 GOALS 🎯

  🔴 [Goal 1 - Must be a clear, descriptive headline (4-6 words)]
  💡 [Exactly one sentence of 30-40 words that explains the goal's importance and how CFO services help achieve it. Must include both the desired outcome and the specific way CFO services contribute.]

  🔴 [Goal 2 - Must be a clear, descriptive headline (4-6 words)]
  💡 [Exactly one sentence of 30-40 words that explains the goal's importance and how CFO services help achieve it. Must include both the desired outcome and the specific way CFO services contribute.]

  💎 VALUES 💎

  🔴 [Value 1 - Must be a clear, descriptive headline (4-6 words)]
  💡 [Exactly one sentence of 30-40 words that explains why this value matters and how CFO services align with it. Must connect the value to business decisions and show specific alignment.]

  🔴 [Value 2 - Must be a clear, descriptive headline (4-6 words)]
  💡 [Exactly one sentence of 30-40 words that explains why this value matters and how CFO services align with it. Must connect the value to business decisions and show specific alignment.]

  🔄 DECISION-MAKING PROCESSES 🔄

  🔴 [Process 1 - Must be a clear, descriptive headline (4-6 words)]
  💡 [Exactly one sentence of 30-40 words that explains the decision-making process and how CFO services fit in. Must identify key stakeholders and show how CFO services can adapt.]

  🔴 [Process 2 - Must be a clear, descriptive headline (4-6 words)]
  💡 [Exactly one sentence of 30-40 words that explains the decision-making process and how CFO services fit in. Must identify key stakeholders and show how CFO services can adapt.]

  🔊 INFLUENCES 🔊

  🔴 [Influence 1 - Must be a clear, descriptive headline (4-6 words)]
  💡 [Exactly one sentence of 30-40 words that explains this influence and how to leverage it. Must identify who/what shapes decisions and provide a specific marketing approach.]

  🔴 [Influence 2 - Must be a clear, descriptive headline (4-6 words)]
  💡 [Exactly one sentence of 30-40 words that explains this influence and how to leverage it. Must identify who/what shapes decisions and provide a specific marketing approach.]

  📱 COMMUNICATION PREFERENCES 📱

  🔴 [Preference 1 - Must be a clear, descriptive headline (4-6 words)]
  💡 [Exactly one sentence of 30-40 words that explains this communication preference and best practices. Must include channel preferences and specific content recommendations.]

  🔴 [Preference 2 - Must be a clear, descriptive headline (4-6 words)]
  💡 [Exactly one sentence of 30-40 words that explains this communication preference and best practices. Must include channel preferences and specific content recommendations.]
"

## Segment Information:
${segmentInfo}

Important notes:
- Follow the exact structure shown in the template with precise emoji placement
- Headlines must be 4-6 words that clearly capture the core concept
- Each explanation must be exactly one sentence of 30-40 words
- Every explanation must include both the issue/need AND how CFO services specifically address it
- Ensure consistent sentence structure and formatting across all sections
- DO NOT include introductions, disclaimers, or conclusions
- Maintain exact spacing shown in the template
`;

    
    // Create a new Response and StreamingTextResponse for proper streaming
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          // Make the API request
          const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
              'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL || 'https://deep-segment-researcher.vercel.app/',
              'X-Title': 'Deep Segment Research',
            },
            body: JSON.stringify({
              model: 'google/gemini-2.0-flash-001',
              messages: [{ role: 'user', content: prompt }],
              stream: true,
              max_tokens: 25000,
              temperature: 1,
            }),
          });
          
          if (!response.ok) {
            const errorText = await response.text();
            controller.error(`OpenRouter API error: ${response.status}, ${errorText}`);
            return;
          }
          
          // Process the stream
          const reader = response.body?.getReader();
          if (!reader) {
            controller.error('Response body is not readable');
            return;
          }
          
          // Read and process the stream chunks
          const decoder = new TextDecoder();
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            
            // Process each line in the SSE chunk
            const text = decoder.decode(value, { stream: true });
            const lines = text.split('\n');
            
            // Buffer to handle incomplete JSON chunks
            let buffer = '';
            
            for (const line of lines) {
              if (line.startsWith('data: ')) {
                const data = line.substring(6);
                if (data === '[DONE]') continue;
                
                // Append to buffer and try parsing
                buffer += data;
                
                try {
                  // Attempt to parse the buffer
                  const parsedData = JSON.parse(buffer);
                  const content = parsedData.choices?.[0]?.delta?.content || '';
                  
                  if (content) {
                    // Send the content directly to the client
                    controller.enqueue(encoder.encode(content));
                  }
                  
                  // Clear buffer on successful parse
                  buffer = '';
                } catch (error) {
                  // If parsing fails, keep the buffer for next chunk
                  if (error instanceof SyntaxError) {
                    // Wait for next chunk to complete the JSON
                    continue;
                  } else {
                    console.error('Error parsing SSE data:', error);
                    buffer = ''; // Clear buffer on other errors
                  }
                }
              }
            }
          }
          
          // Signal the end of the stream
          controller.close();
        } catch (error) {
          controller.error(error);
        }
      }
    });
    
    // Return the streaming response
    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache',
      },
    });
    
  } catch (error) {
    console.error('Error generating segments:', error);
    return NextResponse.json({ 
      error: 'Failed to generate strategy',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}