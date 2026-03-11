/**
 * Stage 4: Validation Rule Engine
 * 
 * Verifies the AI drafted ADIME output is complete and adds necessary
 * missing flags or suggestions for the dietitian based on basic rules.
 */

exports.validateOutput = (aiOutput) => {
    // Basic fallback to ensure schema exists
    const validated = {
      assessment: aiOutput?.assessment || '',
      diagnosis: aiOutput?.diagnosis || '',
      intervention: aiOutput?.intervention || '',
      monitoring_evaluation: aiOutput?.monitoring_evaluation || '',
      missing_items: Array.isArray(aiOutput?.missing_items) ? aiOutput.missing_items : [],
      follow_up_suggestions: Array.isArray(aiOutput?.follow_up_suggestions) ? aiOutput.follow_up_suggestions : [],
      needs_review: aiOutput?.needs_review === true ? true : false,
      review_notes: Array.isArray(aiOutput?.review_notes) ? aiOutput.review_notes : [],
      phi_warning: false
    };

    // Hard Rules Check
    
    // Check missing A, D, I, M/E
    if (!validated.assessment.trim()) {
      validated.missing_items.push('Assessment Section missing or unclear.');
      validated.needs_review = true;
    }
    
    // Check Diagnosis & PES
    if (!validated.diagnosis.trim()) {
      validated.missing_items.push('Diagnosis Section missing.');
      validated.needs_review = true;
    } else {
       const lowerDiag = validated.diagnosis.toLowerCase();
       if (!lowerDiag.includes('related to') && !lowerDiag.includes('as evidenced by') && !lowerDiag.includes('not supported')) {
          validated.review_notes.push('Diagnosis might be missing a complete PES statement. Please review.');
          validated.needs_review = true;
       }
    }
    
    // Check Intervention Measureability
    if (!validated.intervention.trim()) {
      validated.missing_items.push('Interventions Section missing.');
      validated.needs_review = true;
    } else {
       const lowerInterv = validated.intervention.toLowerCase();
       if (!lowerInterv.includes('goal') && !lowerInterv.match(/\\d+/) ) {
           validated.review_notes.push('Intervention lacks clear numerical targets or goals.');
       }
    }

    if (!validated.monitoring_evaluation.trim()) {
      validated.missing_items.push('Monitoring & Evaluation Section missing.');
      validated.needs_review = true;
    } else {
       const lowerMon = validated.monitoring_evaluation.toLowerCase();
       if (!lowerMon.includes('follow') && !lowerMon.includes('week') && !lowerMon.includes('month')) {
           validated.review_notes.push('No explicit follow-up timeframe found in M&E.');
       }
    }

    return validated;
};
