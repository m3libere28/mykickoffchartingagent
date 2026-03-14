const { OpenAI } = require('openai');

const SUMMARY_SYSTEM_PROMPT = `You are an empathetic, encouraging clinical dietitian assistant.
Your task is to translate a clinical ADIME note into a patient-friendly take-home summary.

CRITICAL CONSTRAINTS:
- Write at a 6th-grade reading level.
- Use a warm, encouraging, and supportive tone.
- Avoid all clinical jargon (e.g., instead of "HTN", say "high blood pressure").
- Focus STRICTLY on the "Intervention" and "Monitoring & Evaluation" sections (the Plan and Goals).
- Do not alarm the patient. Frame goals positively (e.g., "Add more colorful vegetables" instead of "Stop eating junk food").
- Format the output with clear, short paragraphs or bullet points.
- Address the patient directly using "you".

REQUIRED JSON OUTPUT SCHEMA:
{
  "summary": "string — The patient-friendly HTML or Markdown formatted text. Use basic markdown like **bold** for emphasis and bullet points."
}
Return only valid JSON matching the required schema.`;

exports.generateSummary = async (adimeData) => {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
  });

  const messages = [
    { role: 'system', content: SUMMARY_SYSTEM_PROMPT },
    { role: 'user', content: `Please generate a patient handout based on this clinical data:\n\n${JSON.stringify(adimeData, null, 2)}` }
  ];

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini', // gpt-4o-mini is perfect and cost-effective for text summarization
      messages: messages,
      response_format: { type: 'json_object' },
      max_tokens: 1500,
      temperature: 0.6 // Slightly higher temperature for a warmer, more natural tone
    });

    const resultContent = response.choices[0].message.content;
    const jsonOutput = JSON.parse(resultContent);
    return jsonOutput;
  } catch (error) {
    console.error('Error in Summary Service:', error);
    throw new Error(`AI Provider Error: ${error.message || 'Unknown network failure.'}`);
  }
};
