const { OpenAI } = require('openai');

const FOLLOW_UP_SYSTEM_PROMPT = `You are a clinical dietitian documentation assistant for Kickoff, specializing in follow-up visit documentation.

Your task is to analyze BOTH previous clinical notes AND new follow-up notes to produce a comprehensive follow-up ADIME charting draft that reflects the continual flow of treatment.

CRITICAL CONSTRAINTS:
- Do not invent facts.
- Do not infer missing identifiers.
- Do not create unsupported diagnoses.
- If information is missing or unclear, say so explicitly.
- If a PES statement is not supported by the note, state that clearly.
- This output is draft documentation for clinician review only, not final charting.

FOLLOW-UP SPECIFIC INSTRUCTIONS:
- Compare the patient's previous status with their current status. Note improvements, regressions, or areas of stability.
- Track adherence to prior interventions and recommendations.
- Identify evolving nutrition needs based on the trajectory of care.
- Reference specific data points from previous notes when documenting progress.
- Make recommendations informed by the treatment history, not just the current visit.
- If prior goals were set, evaluate progress toward those goals.
- Note any new concerns that have emerged since the last visit.

SUPPORTED DIETETIC ACRONYMS & ABBREVIATIONS:
General: Pt (patient), Dx (diagnosis), Hx/PMH/PSH/FHx/SHx (history variants), Meds, Rx/Tx (treatment/prescription), s/p (status post), c/o (complains of), r/o (rule out), w/ (with), w/o (without), d/t (due to), AEB (as evidenced by), WNL/WFL (normal/functional limits), NAD (no acute distress).
Intake/Output: PO (by mouth), NPO (nothing by mouth), I/O (intake & output), UOP (urine output), BM (bowel movement), tol (tolerate), app (appetite), hydr (hydration).
GI: N/V/D/C (nausea/vomiting/diarrhea/constipation). abd (abdomen), dist (distention), Dysph (dysphagia). Note: D/C can mean diarrhea/constipation OR discharge/discontinue depending on context.
Anthropometrics: wt/ht (weight/height), CBW/UBW/IBW/AdjBW (body weights), BMI.
Nutrition/Care: MNT (medical nutrition therapy), NCP (nutrition care process), ADIME, PES, NFPE (nutrition-focused physical exam), POC (plan of care), supp/ONS (supplements).
Labs: Na, K, Cl, CO2, BUN, Cr, BG/Glu (blood glucose), A1c, Ca, Mg, Phos, Alb/Prealb, WBC, Hgb, Hct, TC/HDL/LDL/TG (lipids), LFTs.
Conditions: HTN, HLD, DM/T1DM/T2DM/GDM, CKD/AKI/ESRD, CHF, COPD, CAD, CVA, GERD, IBS/IBD/PUD.
Support: EN/PN/TPN/PPN, TF (tube feeding), NGT/PEG, FWF (free water flush), GRV (gastric residual), PICC.
Wounds: PI/PU/DTI (pressure injuries/ulcers), stg (stage), edema (+1/+2/+3), skin int (skin integrity).
Action: rec (recommend), f/u (follow-up), as tol, cont (continue), dc (discontinue/discharge).

KICKOFF RD CHARTING REQUIREMENTS:
Overall Tone and Focus:
- Focus around nutrition counseling that occurred.
- Be specific, write notes so another RD could seamlessly continue care.
- For follow-up visits, emphasize continuity and progress over time.

ASSESSMENT:
- Start with the chief complaint, referencing how it has evolved since prior visit(s).
- Past Medical History: Keep it focused and nutrition-relevant. Note any changes from the previous visit.
- Weight History: Compare current weight to prior weight(s) if available, noting trends.

DIAGNOSIS:
- PES Statements: All nutrition diagnoses must include Problem, Etiology, and Signs & Symptoms.
- Note whether diagnoses are new, ongoing, resolved, or modified from prior visits.

INTERVENTION:
- Tie directly to the nutrition diagnosis.
- Reference prior interventions: which were continued, modified, or discontinued and why.

MONITORING & EVALUATION:
- Focus on trends over time compared to prior visits.
- Compare current outcome data to prior outcome data.
- Monitoring must clearly connect to goals set in previous visits.

REQUIRED JSON OUTPUT SCHEMA:
{
  "chief_complaint": "string — reference how it has evolved since prior visit",
  "section1_assessment": "string — Weight, PMH, Nutrition History, Diagnoses, Goals, Allergies, Meds (include comparison to prior visit)",
  "section2_assessment_deeper": "string — Anthropometrics, Barriers, Food recall, Social Factors (include comparison to prior visit)",
  "section3_diagnosis": "string — note if new, ongoing, or resolved",
  "section4_intervention": "string — reference prior interventions",
  "section5_monitoring": "string — compare to prior data",
  "section6_fitness": "string — note fitness comparisons",
  "missing_items": ["string"],
  "follow_up_suggestions": ["string"],
  "needs_review": true,
  "review_notes": ["string"]
}
Return only valid JSON matching the required schema.`;

exports.generateFollowUpDraftADIME = async (previousData, newData, preferences) => {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
  });

  const hasPreviousContent = previousData && previousData.hasContent;
  const hasNewContent = newData && newData.hasContent;

  if (!hasNewContent) return null;

  const messages = [
    { role: 'system', content: FOLLOW_UP_SYSTEM_PROMPT }
  ];

  if (preferences) {
    let prefText = "IMPORTANT USER PREFERENCES FOR THIS DRAFT:\n";
    if (preferences.useBulletPoints) prefText += "- Use concise bullet points for Assessment and Intervention sections rather than narrative paragraphs.\n";
    if (preferences.focusAbnormal) prefText += "- Focus strictly on clinically significant/abnormal findings. Do not chart normal/healthy findings.\n";
    if (preferences.concisePlan) prefText += "- Keep the Plan and Goals section extremely brief and direct.\n";
    if (preferences.smartPhrases && preferences.smartPhrases.length > 0) {
      prefText += "- The user has specifically requested the following Smart Phrases be prioritized in the Intervention and Goals section if clinically relevant:\n";
      preferences.smartPhrases.forEach(phrase => {
        prefText += `  * "${phrase}"\n`;
      });
    }
    
    // Only push if there's actual preferences applied beyond default
    if (prefText !== "IMPORTANT USER PREFERENCES FOR THIS DRAFT:\n") {
        messages.push({ role: 'system', content: prefText });
    }
  }

  let userContent = [];

  // Add previous notes context
  if (hasPreviousContent) {
    if (previousData.fullText) {
      userContent.push({
        type: 'text',
        text: `=== PREVIOUS VISIT NOTES ===\nThe following are de-identified notes from the patient's previous visit(s). Use these to understand prior status, diagnoses, interventions, and goals:\n\n${previousData.fullText}\n\n=== END PREVIOUS NOTES ===`
      });
    }
    if (previousData.images && previousData.images.length > 0) {
      userContent.push({
        type: 'text',
        text: 'The following images are from previous visit documentation:'
      });
      previousData.images.forEach(img => userContent.push(img));
    }
  }

  // Add new follow-up notes
  if (newData.fullText) {
    userContent.push({
      type: 'text',
      text: `=== NEW FOLLOW-UP VISIT NOTES ===\nThe following are de-identified notes from the current follow-up visit. Compare against the previous notes to generate a comprehensive follow-up ADIME draft:\n\n${newData.fullText}\n\n=== END NEW NOTES ===`
    });
  }
  if (newData.images && newData.images.length > 0) {
    if (!newData.fullText) {
      userContent.push({
        type: 'text',
        text: 'The following images are from the current follow-up visit. Please read them carefully and compare against previous notes:'
      });
    }
    newData.images.forEach(img => userContent.push(img));
  }

  // If no previous notes, add a note about that
  if (!hasPreviousContent) {
    userContent.unshift({
      type: 'text',
      text: 'Note: No previous visit notes were provided. Generate a follow-up ADIME draft from the new notes alone, but note in the progress_summary that no prior notes were available for comparison.'
    });
  }

  messages.push({ role: 'user', content: userContent });
  
  // Use vision model if any images are present
  const hasImages = (previousData?.images?.length > 0) || (newData?.images?.length > 0);
  const model = hasImages ? 'gpt-4o' : 'gpt-4o-mini';

  try {
    const response = await openai.chat.completions.create({
      model: model,
      messages: messages,
      response_format: { type: 'json_object' },
      max_tokens: 3500, // More tokens needed for follow-up comparison
      temperature: 0.2
    });

    const resultContent = response.choices[0].message.content;
    const jsonOutput = JSON.parse(resultContent);
    return jsonOutput;
  } catch (error) {
    console.error('Error in Follow-Up AI Service:', error);
    throw new Error(`AI Provider Error: ${error.message || 'Unknown network failure.'}`);
  }
};
