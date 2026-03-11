const { OpenAI } = require('openai');

const SYSTEM_PROMPT = `You are a clinical dietitian documentation assistant. 
Your task is to extract nutrition-relevant information from de-identified clinical notes and produce a DRAFT ADIME charting output.
Do not invent facts.
Do not infer missing identifiers.
Do not create unsupported diagnoses.
If information is missing or unclear, say so explicitly.
If a PES statement is not supported by the note, state that clearly.
Return only valid JSON matching the required schema.
This output is draft documentation for clinician review only, not final charting.

Focus on common dietitian workflows: 
- adult weight management
- GI / heartburn / reflux
- PCOS / insulin resistance
- general follow-up counseling

Pay special attention to extracting:
PES statement presence/support, measurable intervention language, hydration, macro guidance, bowel patterns, symptom tracking, supplements, food recall, appetite, energy, sleep, exercise, adherence, weight trend, etc.

REQUIRED JSON OUTPUT SCHEMA:
{
  "assessment": "string",
  "diagnosis": "string",
  "intervention": "string",
  "monitoring_evaluation": "string",
  "missing_items": ["string"],
  "follow_up_suggestions": ["string"],
  "needs_review": true,
  "review_notes": ["string"]
}
If the note is too complete, still return a partial draft, identify what is missing in missing_items, set needs_review to true, and add helpful review_notes.`;

exports.generateDraftADIME = async (extractedData) => {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
  });

  const { fullText, images, hasContent } = extractedData;
  if (!hasContent) return null;

  const messages = [
    { role: 'system', content: SYSTEM_PROMPT }
  ];

  let userContent = [];

  // Add extracted text
  if (fullText) {
    userContent.push({
      type: 'text',
      text: `Please generate a draft ADIME chart based on these de-identified notes:\n\n${fullText}`
    });
  }

  // Add extracted images for Vision if they exist
  if (images && images.length > 0) {
    if (!fullText) {
       userContent.push({
         type: 'text',
         text: 'Please carefully read these handwritten or typed image notes and generate a draft ADIME chart based on them.'
       });
    }
    
    images.forEach(img => {
       userContent.push(img);
    });
  }

  messages.push({ role: 'user', content: userContent });
  
  // Decide which model to route to based on whether we have images
  const usesVision = images && images.length > 0;
  // According to OpenAI docs, gpt-4o handles vision seamlessly, otherwise we can use gpt-4o-mini for text-only 
  // to save costs as specified in prompt (faster/lower-cost text model if only text).
  const model = usesVision ? 'gpt-4o' : 'gpt-4o-mini';

  try {
    const response = await openai.chat.completions.create({
      model: model,
      messages: messages,
      response_format: { type: 'json_object' },
      temperature: 0.2 // Low temperature for more deterministic/factual clinical extraction
    });

    const resultContent = response.choices[0].message.content;
    const jsonOutput = JSON.parse(resultContent);
    return jsonOutput;
  } catch (error) {
    console.error('Error in AI Service:', error);
    throw new Error('Failed to parse AI response or communicate with AI provider.');
  }
};
