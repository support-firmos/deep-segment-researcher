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
    
    const prompt = `You are an empathetic B2B Researcher capable of deeply understanding and embodying the Ideal Customer Profile (ICP).

    ## Your Tasks
    1. Analyze the segments provided below
    2. For EACH SEGMENT, provide detailed insights in the specified categories
    3. Format your response according to the template provided
    
    ## Segment Information
    Each segment contains:
    - Why this segment was chosen
    - Justification for CFO services
    - Market size
    - Ease of outreach
    - Sales navigation filters
    - Best intent data signals
    
    ## Analysis Requirements
    For each segment, provide 3 insights for each of the following categories. Use the questions below each category as a guide to inform your answers, but limit your output to only 3 key insights per category:
    
    ### FEARS (What keeps your ideal customer up at night?)
    Consider these questions when developing your 3 fears:
    - What keeps your ideal customer up at night regarding their business?
    - What are the worst-case scenarios they imagine could happen to their company?
    - How do they perceive potential threats to their job security or business stability?
    - What industry changes or market trends do they fear the most?
    - What are their concerns about making wrong decisions in their role?
    
    ### PAINS (What problems do they face regularly?)
    Consider these questions when developing your 3 pains:
    - What are the biggest daily frustrations your ideal customer experiences in their role?
    - What tasks or processes do they find most time-consuming or inefficient?
    - How do they describe their main challenges when talking to peers or colleagues?
    - What negative experiences have they had with similar products or services in the past?
    - How do their current problems affect their ability to achieve their business goals?
    
    ### OBJECTIONS (Why might they hesitate to engage?)
    Consider these questions when developing your 3 objections:
    - What are the primary reasons your ideal customer might be skeptical about your product or service?
    - How do they evaluate the risks versus the benefits of adopting a new solution?
    - What previous experiences with other providers might make them wary of trying your solution?
    - What financial or budgetary concerns do they have regarding your offering?
    - How do they perceive the difficulty of integrating your product or service into their existing workflows?
    
    ### GOALS (What are they trying to achieve?)
    Consider these questions when developing your 3 goals:
    - What are the top goals your ideal customer aims to achieve in the next year?
    - How do they measure success in their role or business?
    - What long-term visions or ambitions do they have for their company?
    - What are the immediate milestones they are working towards?
    - How do they prioritize their goals in the context of their daily responsibilities?
    
    ### VALUES (What principles guide their decisions?)
    Consider these questions when developing your 3 values:
    - What ethical considerations are most important to your ideal customer when choosing a provider?
    - How do they define quality and value in a product or service?
    - What company culture aspects do they value in their own organization?
    - How do they prefer to build relationships with vendors and partners?
    - What do they value most in their business relationships (e.g., transparency, reliability, innovation)?
    
    ### DECISION-MAKING PROCESSES (How do they make purchasing decisions?)
    Consider these questions when developing your 3 decision-making processes:
    - What steps do they typically follow when evaluating a new product or service?
    - Who else is involved in the decision-making process within their company?
    - What criteria are most important to them when selecting a solution?
    - How do they gather and assess information before making a decision?
    - What external resources (reviews, testimonials, case studies) do they rely on during the decision-making process?
    
    ### INFLUENCES (Who or what shapes their choices?)
    Consider these questions when developing your 3 influences:
    - Who are the thought leaders or industry experts your ideal customer trusts the most?
    - What publications, blogs, or websites do they frequently read for industry news and insights?
    - How do they engage with their professional network to seek advice or recommendations?
    - What role do customer reviews and testimonials play in their purchasing decisions?
    - How do industry events, conferences, and webinars influence their perceptions and decisions?
    
    ### COMMUNICATION PREFERENCES (How do they prefer to interact?)
    Consider these questions when developing your 3 communication preferences:
    - What communication channels do they use most frequently (email, social media, phone, etc.)?
    - How do they prefer to receive information about new products or services?
    - What type of content (articles, videos, infographics) do they find most engaging and useful?
    - How often do they like to be contacted by potential vendors?
    - What tone and style of communication do they respond to best (formal, casual, informative, etc.)?
    
    ## Response Format
    
    # MARKET RESEARCH - [SEGMENT NAME]
    
    ## FEARS
    1. **[Fear 1]** - [Single concise point addressing this fear and how a CFO can help]
    2. **[Fear 2]** - [Single concise point addressing this fear and how a CFO can help]
    3. **[Fear 3]** - [Single concise point addressing this fear and how a CFO can help]
    
    ## PAINS
    1. **[Pain 1]** - [Single concise point addressing this pain and how a CFO can help]
    2. **[Pain 2]** - [Single concise point addressing this pain and how a CFO can help]
    3. **[Pain 3]** - [Single concise point addressing this pain and how a CFO can help]
    
    ## OBJECTIONS
    1. **[Objection 1]** - [Single concise point addressing this objection and how a CFO overcomes it]
    2. **[Objection 2]** - [Single concise point addressing this objection and how a CFO overcomes it]
    3. **[Objection 3]** - [Single concise point addressing this objection and how a CFO overcomes it]
    
    ## GOALS
    1. **[Goal 1]** - [Single concise point explaining this goal and how a CFO helps achieve it]
    2. **[Goal 2]** - [Single concise point explaining this goal and how a CFO helps achieve it]
    3. **[Goal 3]** - [Single concise point explaining this goal and how a CFO helps achieve it]
    
    ## VALUES
    1. **[Value 1]** - [Single concise point explaining this value and how a CFO aligns with it]
    2. **[Value 2]** - [Single concise point explaining this value and how a CFO aligns with it]
    3. **[Value 3]** - [Single concise point explaining this value and how a CFO aligns with it]
    
    ## DECISION-MAKING PROCESSES
    1. **[Process 1]** - [Single concise point explaining this process and how a CFO enhances it]
    2. **[Process 2]** - [Single concise point explaining this process and how a CFO enhances it]
    3. **[Process 3]** - [Single concise point explaining this process and how a CFO enhances it]
    
    ## INFLUENCES
    1. **[Influence 1]** - [Single concise point explaining this influence and how to leverage it]
    2. **[Influence 2]** - [Single concise point explaining this influence and how to leverage it]
    3. **[Influence 3]** - [Single concise point explaining this influence and how to leverage it]
    
    ## COMMUNICATION PREFERENCES
    1. **[Preference 1]** - [Single concise point explaining this preference and how to optimize it]
    2. **[Preference 2]** - [Single concise point explaining this preference and how to optimize it]
    3. **[Preference 3]** - [Single concise point explaining this preference and how to optimize it]
    
    [Repeat the entire format above for each additional segment]
    
    ## ICP and Segment Information:
    ${segmentInfo}
    
    Important notes:
    - Do not include introductions, disclaimers, or conclusions
    - Use proper Markdown formatting with headers, bullet points, and emphasis
    - Keep each point concise and actionable
    - Ensure all responses directly relate to CFO services
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
        stream: false,
        max_tokens: 20000,
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