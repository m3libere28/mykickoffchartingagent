/**
 * Stage 4: Validation Rule Engine
 * 
 * Verifies the AI drafted ADIME output is complete and adds necessary
 * missing flags or suggestions for the dietitian based on basic rules.
 */

exports.validateOutput = (aiOutput) => {
    // Basic fallback to ensure schema exists
    const validated = {
      chief_complaint: aiOutput?.chief_complaint || '',
      section1_assessment: aiOutput?.section1_assessment || '',
      section2_assessment_deeper: aiOutput?.section2_assessment_deeper || '',
      section3_diagnosis: aiOutput?.section3_diagnosis || '',
      section4_intervention: aiOutput?.section4_intervention || '',
      section5_monitoring: aiOutput?.section5_monitoring || '',
      section6_fitness: aiOutput?.section6_fitness || '',
      missing_items: Array.isArray(aiOutput?.missing_items) ? aiOutput.missing_items : [],
      follow_up_suggestions: Array.isArray(aiOutput?.follow_up_suggestions) ? aiOutput.follow_up_suggestions : [],
      needs_review: aiOutput?.needs_review === true ? true : false,
      review_notes: Array.isArray(aiOutput?.review_notes) ? aiOutput.review_notes : [],
      phi_warning: false
    };

    // Hard Rules Check
    
    if (!validated.section1_assessment.trim()) {
      validated.missing_items.push('Section 1 - Assessment missing or unclear.');
      validated.needs_review = true;
    }
    
    // Check Diagnosis 
    if (!validated.section3_diagnosis.trim()) {
      validated.missing_items.push('Section 3 - Diagnosis Section missing.');
      validated.needs_review = true;
    }
    
    if (!validated.section4_intervention.trim()) {
      validated.missing_items.push('Section 4 - Interventions Section missing.');
      validated.needs_review = true;
    }

    if (!validated.section5_monitoring.trim()) {
      validated.missing_items.push('Section 5 - Monitoring & Evaluation Section missing.');
      validated.needs_review = true;
    }

    return validated;
};
