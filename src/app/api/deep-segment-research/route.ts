// src/app/api/generate-segments/route.ts
import { NextResponse } from 'next/server';

// Set maximum duration to 60 seconds
export const maxDuration = 60;

// Use Edge runtime for better performance with long-running requests
export const runtime = 'edge';

export async function POST(request: Request) {
  try {
    const { segmentInfo } = await request.json();
    
    if (!segmentInfo || typeof segmentInfo !== 'string') {
      return NextResponse.json({ error: 'Invalid segment information' }, { status: 400 });
    }
    
    // Count number of segments (estimate) for the prompt
    //const segmentCount = (segmentInfo.match(/\n\n/g) || []).length + 1;
    
    const prompt = `You are an empathetic B2B Researcher capable of deeply understanding and embodying the Ideal Customer Profile (ICP) for CFO services.

    ## Your Task
    Analyze each segment provided below and generate a concise market research profile for EACH SEGMENT following the exact structure below. Use the segment information to identify the most relevant and impactful insights.
    
    ## Analysis Requirements
    For each segment, provide exactly 3 items per category. The questions after each category are guides to help you develop meaningful insights - you don't need to answer all questions, just use them to inform your 3 key points.
    
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
      MARKET RESEARCH - [SEGMENT NAME 1]
    
      1️⃣ FEARS
      1️⃣ [Fear 1]
      💡 [Single concise point addressing this fear and how a CFO can help]
      
      2️⃣ [Fear 2]
      💡 [Single concise point addressing this fear and how a CFO can help]
      
      3️⃣ [Fear 3]
      💡 [Single concise point addressing this fear and how a CFO can help]
      
      2️⃣ PAINS
      1️⃣ [Pain 1]
      💡 [Single concise point addressing this pain and how a CFO can help]
      
      2️⃣ [Pain 2]
      💡 [Single concise point addressing this pain and how a CFO can help]
      
      3️⃣ [Pain 3]
      💡 [Single concise point addressing this pain and how a CFO can help]
      
      3️⃣ OBJECTIONS
      1️⃣ [Objection 1]
      💡 [Single concise point addressing this objection and how a CFO overcomes it]
      
      2️⃣ [Objection 2]
      💡 [Single concise point addressing this objection and how a CFO overcomes it]
      
      3️⃣ [Objection 3]
      💡 [Single concise point addressing this objection and how a CFO overcomes it]
      
      4️⃣ GOALS
      1️⃣ [Goal 1]
      💡 [Single concise point explaining this goal and how a CFO helps achieve it]
      
      2️⃣ [Goal 2]
      💡 [Single concise point explaining this goal and how a CFO helps achieve it]
      
      3️⃣ [Goal 3]
      💡 [Single concise point explaining this goal and how a CFO helps achieve it]
      
      5️⃣ VALUES
      1️⃣ [Value 1]
      💡 [Single concise point explaining this value and how a CFO aligns with it]
      
      2️⃣ [Value 2]
      💡 [Single concise point explaining this value and how a CFO aligns with it]
      
      3️⃣ [Value 3]
      💡 [Single concise point explaining this value and how a CFO aligns with it]
      
      6️⃣ DECISION-MAKING PROCESSES
      1️⃣ [Process 1]
      💡 [Single concise point explaining this process and how a CFO enhances it]
      
      2️⃣ [Process 2]
      💡 [Single concise point explaining this process and how a CFO enhances it]
      
      3️⃣ [Process 3]
      💡 [Single concise point explaining this process and how a CFO enhances it]
      
      7️⃣ INFLUENCES
      1️⃣ [Influence 1]
      💡 [Single concise point explaining this influence and how to leverage it]
      
      2️⃣ [Influence 2]
      💡 [Single concise point explaining this influence and how to leverage it]
      
      3️⃣ [Influence 3]
      💡 [Single concise point explaining this influence and how to leverage it]
      
      8️⃣ COMMUNICATION PREFERENCES
      1️⃣ [Preference 1]
      💡 [Single concise point explaining this preference and how to optimize it]
      
      2️⃣ [Preference 2]
      💡 [Single concise point explaining this preference and how to optimize it]
      
      3️⃣ [Preference 3]
      💡 [Single concise point explaining this preference and how to optimize it]
      
      MARKET RESEARCH - [SEGMENT NAME 2]
      [Repeat the format above for each additional segment]
    "

    ## Segment Information:
    ${segmentInfo}
    
    Important notes:
    - Keep all points concise and actionable - focus on quality over quantity
    - Each point should clearly connect to how a CFO service provides value
    - DO NOT include introductions, disclaimers, or conclusions.
    - Use emojis as shown in the format (not markdown formatting)
    - For each segment, use the same emoji format and numbering style
    `;
    
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
        max_tokens: 50000,
        temperature: 1,
      }),
    });
    
    const responseText = await response.text();
    
    if (!response.ok) {
      console.error('OpenRouter error response:', responseText);
      return NextResponse.json({ 
        error: `OpenRouter API error: ${response.status}`,
        details: responseText
      }, { status: 500 });
    }
    
    try {
      const data = JSON.parse(responseText);
      if (!data.choices?.[0]?.message) {
        return NextResponse.json({ 
          error: 'Invalid response format from OpenRouter',
          details: responseText 
        }, { status: 500 });
      }
        
      return NextResponse.json({ 
        result: data.choices[0].message.content 
      });
    } catch (parseError) {
      console.error('Error parsing JSON response:', parseError);
      return NextResponse.json({ 
        error: 'Failed to parse API response',
        details: responseText 
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Error generating segments:', error);
    return NextResponse.json({ 
      error: 'Failed to generate strategy',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}