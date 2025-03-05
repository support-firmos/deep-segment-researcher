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
  🔎 🔎 🔎 MARKET RESEARCH - [SEGMENT NAME] 🔎 🔎 🔎
  
  ⚠️ FEARS ⚠️
  
  🔴 [Fear 1 - Clear headline]
  💡 [Concise explanation of how this fear impacts the business and how CFO services address it.]
  
  🔴 [Fear 2 - Clear headline]
  💡 [Concise explanation of how this fear impacts the business and how CFO services address it.]
  
  ⚙️ PAINS ⚙️
  
  🔴 [Pain 1 - Clear headline]
  💡 [Concise explanation of this pain point's financial impact and how CFO services solve it.]
  
  🔴 [Pain 2 - Clear headline]
  💡 [Concise explanation of this pain point's financial impact and how CFO services solve it.]
  
  ⛔ OBJECTIONS ⛔
  
  🔴 [Objection 1 - Clear headline]
  💡 [Concise explanation of this objection and specific counterpoints showing how CFO services overcome it.]
  
  🔴 [Objection 2 - Clear headline]
  💡 [Concise explanation of this objection and specific counterpoints showing how CFO services overcome it.]
  
  🎯 GOALS 🎯
  
  🔴 [Goal 1 - Clear headline]
  💡 [Concise explanation of this goal's importance and how CFO services help achieve it with tangible benefits.]
  
  🔴 [Goal 2 - Clear headline]
  💡 [Concise explanation of this goal's importance and how CFO services help achieve it with tangible benefits.]
  
  💎 VALUES 💎
  
  🔴 [Value 1 - Clear headline]
  💡 [Concise explanation of why this value matters and how CFO services align with it.]
  
  🔴 [Value 2 - Clear headline]
  💡 [Concise explanation of why this value matters and how CFO services align with it.]
  
  🔄 DECISION-MAKING PROCESSES 🔄
  
  🔴 [Process 1 - Clear headline]
  💡 [Concise explanation of key stakeholders, evaluation criteria, and how CFO services enhance this process.]
  
  🔴 [Process 2 - Clear headline]
  💡 [Concise explanation of key stakeholders, evaluation criteria, and how CFO services enhance this process.]
  
  🔊 INFLUENCES 🔊
  
  🔴 [Influence 1 - Clear headline]
  💡 [Concise explanation of this influence and specific ways to leverage it when marketing CFO services.]
  
  🔴 [Influence 2 - Clear headline]
  💡 [Concise explanation of this influence and specific ways to leverage it when marketing CFO services.]
  
  📱 COMMUNICATION PREFERENCES 📱
  
  🔴 [Preference 1 - Clear headline]
  💡 [Concise explanation of preferred channels, content formats, and messaging recommendations for CFO services.]
  
  🔴 [Preference 2 - Clear headline]
  💡 [Concise explanation of preferred channels, content formats, and messaging recommendations for CFO services.]
"

## Segment Information:
\${segmentInfo}

Important notes:
- Provide concise, focused insights with a clear headline plus a brief explanation
- Keep explanations short but informative, covering the key points without excessive detail
- Make all points specifically relevant to CFO services with actionable recommendations
- Use the enhanced emoji format to clearly distinguish sections and make the content visually scannable
- DO NOT include introductions, disclaimers, or conclusions
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