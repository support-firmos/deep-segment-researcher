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
    
    const prompt = `
      You are an emphathetic B2B Researcher capable of deeply understanding and embodying the Ideal Customer Profile (ICP).
      Your firt task is to analyze the segments provided below to perform research and generate ideas based on given ICP parameters.
      Each segment contains the following: why this segment, justification for CFO services, market size, ease of outreach, sales navigation filters, and best intent data signals.
      
    
      After analyzing all the available segments given, your next task is that FOR EACH SEGMENT, please provide 5 fears, 5 pains, 5 objections, 5 goals, 5 values, 5 decision-making processes, 5 influences, and 5 communication preferences.
      Here is a comprehensive and detailed guide for addressing the requirements:

      -> Fears (the deep-seated fears that drive the decision-making process of the target audience)
            Fear 1 - What keeps your ideal customer up at night regarding their business?
            Fear 2 - What are the worst-case scenarios they imagine could happen to their company?
            Fear 3 - How do they perceive potential threats to their job security or business stability?
            Fear 4 - What industry changes or market trends do they fear the most?
            Fear 5 - How do they feel about the possibility of making a wrong decision in their role?
      -> Pains (Identify the specific problems and challenges the target audience faces regularly)
            Pain 1 - What are the biggest daily frustrations your ideal customer experiences in their role?
            Pain 2 - What tasks or processes do they find most time-consuming or inefficient?
            Pain 3 - How do they describe their main challenges when talking to peers or colleagues?
            Pain 4 - What negative experiences have they had with similar products or services in the past?
            Pain 5 - How do their current problems affect their ability to achieve their business goals?
      -> Objections (Recognize the reasons why the target audience might hesitate to buy or engage with your product or service)
            Objection 1 - What are the primary reasons your ideal customer might be skeptical about your product or service?
            Objection 2 - How do they evaluate the risks versus the benefits of adopting a new solution?
            Objection 3 - What previous experiences with other providers might make them wary of trying your solution?
            Objection 4 - What financial or budgetary concerns do they have regarding your offering?
            Objection 5 - How do they perceive the difficulty of integrating your product or service into their existing workflows?
      -> Goals (Determine the primary objectives and aspirations that drive the target audience's actions)
            Goal 1 - What are the top three goals your ideal customer aims to achieve in the next year?
            Goal 1 - How do they measure success in their role or business?
            Goal 1 - What long-term visions or ambitions do they have for their company?
            Goal 1 - What are the immediate milestones they are working towards?
            Goal 1 - How do they prioritize their goals in the context of their daily responsibilities?
      -> Values (Understand the core values that influence the target audience's decision-making process)
            Value 1 - What ethical considerations are most important to your ideal customer when choosing a provider?
            Value 2 - How do they define quality and value in a product or service?
            Value 3 - What company culture aspects do they value in their own organization?
            Value 4 - How do they prefer to build relationships with vendors and partners?
            Value 5 - What do they value most in their business relationships (e.g., transparency, reliability, innovation)?
      -> Decision-Making Processes (Gain insight into how the target audience makes purchasing decisions)
            Decision-Making Process 1 - What steps do they typically follow when evaluating a new product or service?
            Decision-Making Process 1 - Who else is involved in the decision-making process within their company?
            Decision-Making Process 1 - What criteria are most important to them when selecting a solution?
            Decision-Making Process 1 - How do they gather and assess information before making a decision?
            Decision-Making Process 1 - What external resources (reviews, testimonials, case studies) do they rely on during the decision-making process?    
      -> Influences (Identify the key factors and individuals that influence the target audience's choices)
            Influence 1 - Who are the thought leaders or industry experts your ideal customer trusts the most?
            Influence 2 - What publications, blogs, or websites do they frequently read for industry news and insights?
            Influence 3 - How do they engage with their professional network to seek advice or recommendations?
            Influence 4 - What role do customer reviews and testimonials play in their purchasing decisions?
            Influence 5 - How do industry events, conferences, and webinars influence their perceptions and decisions?
      -> Communication Preferences (Understand how the target audience prefers to receive and interact with marketing messages)
            Communication Preference 1 - What communication channels do they use most frequently (email, social media, phone, etc.)?
            Communication Preference 2 - How do they prefer to receive information about new products or services?
            Communication Preference 3 - What type of content (articles, videos, infographics) do they find most engaging and useful?
            Communication Preference 4 - How often do they like to be contacted by potential vendors?
            Communication Preference 5 - What tone and style of communication do they respond to best (formal, casual, informative, etc.)?

      Now that you have the guidelines, your next task is to format your final response by following this instruction below.
      Everything inside [] contains special format requests/instructions. This is strictly how your response should go:
        "
          MARKET RESEARCH - [SEGMENT NAME 1]
            [A sentence explaining the content below]

            FEARS
            1. [Fear 1] - [In a short paragraph, explain this fear with context and how a CFO can address this.]
            [*Repeat the format above for the remaining 4 fears*]

            PAINS
            1. [Pain 1] - [In a short paragrpah, explain this pain with context and how a CFO can address this.]
            [*Repeat the format above for the remaining 4 pains*]

            OBJECTIONS
            1. [Objection 1] - [In a short paragraph, explain why they are thinking of this objection and provide counter points by explaining how help from CFO's can be justified to address this.]
            [*Repeat the format above for the remaining 4 objections*]

            GOALS
            1. [Goal 1] - [In a short paragraph, explain this goal and how CFO can assist in achieving this goal.]
            [*Repeat the format above for the remaining 4 goals*]
            
            VALUES
            1. [Value 1] - [In a short paragraph, explain this value and how CFO can assist in preserving this value.]
            [*Repeat the format above for the remaining 4 values*]

            DECISION-MAKING PROCESSES
            1. [Decision-Making Process 1] - [In a short paragraph, explain this process and how CFO can assist in this process.]
            [*Repeat the format above for the remaining 4 decision-making processes*]

            INFLUENCES
            1. [Influence 1] - [In a short paragraph, explain this influence and how CFO can leverage this.]
            [*Repeat the format above for the remaining 4 influences*]

            COMMUNICATION PREFERENCES
            1. [Preference 1] - [In a short paragraph, explain this preference and how CRO can improve the purpose of this preference]
            [*Repeat the format above for the remaining 4 preferences*]

        MARKET RESEARCH - [SEGMENT NAME 2]
        ....[same format from above]
        "

        Here is the ICP alongside the segments:
        ${segmentInfo}

        Final instructions:
        - Do not include introductions, disclaimers, or conclusions. Your response must only consider the requested format above.
        - Ensure an efficient and appealing formatting by using markdowns, proper bulleting and indentation, etc.
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