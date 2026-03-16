import React, { useState, useEffect, useRef } from 'react';
import { Copy, Check, AlertTriangle, ArrowLeft, ActivitySquare, CheckCircle2, TrendingUp, Lightbulb, ChevronDown, BookmarkPlus, Printer, FileText, Loader2, X, Heart, Droplets, Apple, Activity, Moon, Star, Flame, Coffee, Smile } from 'lucide-react';
import { generatePatientSummary } from '../services/api';

const getIconForTakeaway = (iconName) => {
  const icons = {
    heart: <Heart size={20} className="text-rose-500" />,
    water: <Droplets size={20} className="text-blue-500" />,
    droplets: <Droplets size={20} className="text-blue-500" />,
    apple: <Apple size={20} className="text-red-500 dark:text-red-400" />,
    food: <Apple size={20} className="text-red-500 dark:text-red-400" />,
    activity: <Activity size={20} className="text-brand-500" />,
    exercise: <Activity size={20} className="text-brand-500" />,
    sleep: <Moon size={20} className="text-indigo-500" />,
    moon: <Moon size={20} className="text-indigo-500" />,
    star: <Star size={20} className="text-amber-500" />,
    energy: <Flame size={20} className="text-orange-500" />,
    flame: <Flame size={20} className="text-orange-500" />,
    coffee: <Coffee size={20} className="text-amber-700" />,
    smile: <Smile size={20} className="text-emerald-500" />
  };
  return icons[iconName?.toLowerCase()] || <Star size={20} className="text-brand-500" />;
};

const SectionCard = ({ title, content, id, onTextChange, onCopy, copiedSection, smartPhrases, onInsertSmartPhrase }) => {
  const textareaRef = useRef(null);
  const [showSmartMenu, setShowSmartMenu] = useState(false);
  const smartMenuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (smartMenuRef.current && !smartMenuRef.current.contains(event.target)) {
        setShowSmartMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Auto-resize textarea based on content
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [content]);

  return (
    <div className="bg-white dark:bg-darkSurface-card rounded-2xl shadow-sm hover:shadow-md border border-slate-100 dark:border-darkSurface-border/50 p-4 sm:p-6 relative group transition-all duration-300">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-bold tracking-widest text-brand-800 dark:text-brand-400 font-heading uppercase flex items-center">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-400 dark:bg-brand-500 mr-2 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
            {title}
        </h3>
        <div className="flex items-center space-x-2">
          {smartPhrases && smartPhrases.length > 0 && id === 'intervention' && (
            <div className="relative" ref={smartMenuRef}>
              <button
                onClick={() => setShowSmartMenu(!showSmartMenu)}
                className="text-slate-500 hover:text-brand-600 dark:text-darkSurface-muted dark:hover:text-brand-400 hover:bg-brand-50 dark:hover:bg-brand-900/30 rounded-lg px-3 py-1.5 transition-all duration-200 flex items-center text-xs font-bold uppercase tracking-wider border border-transparent hover:border-brand-200 dark:hover:border-brand-800"
                title="Insert Smart Phrase"
              >
                <BookmarkPlus size={16} className="mr-1.5" /> Phrases <ChevronDown size={12} className={`ml-1 transition-transform ${showSmartMenu ? 'rotate-180' : ''}`} />
              </button>
              
              {showSmartMenu && (
                <div className="absolute right-0 top-full mt-2 w-72 bg-white dark:bg-darkSurface-card rounded-xl shadow-xl border border-slate-100 dark:border-darkSurface-border/80 overflow-hidden z-20 animate-in fade-in slide-in-from-top-2 duration-200 max-h-64 overflow-y-auto custom-scrollbar">
                  <div className="px-3 py-2 border-b border-slate-50 dark:border-darkSurface-border/50 bg-slate-50/50 dark:bg-darkSurface/50">
                    <p className="text-xs font-bold text-slate-400 dark:text-darkSurface-muted/70 uppercase tracking-widest">Insert Phrase</p>
                  </div>
                  <div className="flex flex-col py-1">
                    {smartPhrases.map((phrase, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          onInsertSmartPhrase(id, phrase);
                          setShowSmartMenu(false);
                        }}
                        className="px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-darkSurface-elevated transition-colors text-left border-b border-slate-50 dark:border-darkSurface-border/30 last:border-0"
                      >
                        {phrase}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
          <button
            onClick={() => onCopy(content, id)}
            className="text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 hover:bg-brand-50 dark:hover:bg-brand-900/30 rounded-lg p-2 transition-all duration-200 flex items-center"
            title={`Copy ${title} to Clipboard`}
          >
            {copiedSection === id ? (
              <Check size={18} className="text-brand-500 scale-110 transition-transform drop-shadow-[0_0_5px_rgba(16,185,129,0.5)]" />
            ) : (
              <Copy size={18} className="transition-transform group-hover:scale-110" />
            )}
          </button>
        </div>
      </div>
      <div className="relative">
        <textarea
          ref={textareaRef}
          value={content || ''}
          onChange={(e) => onTextChange(id, e.target.value)}
          placeholder={`No ${title.toLowerCase()} content extracted. Start typing to edit...`}
          className="w-full bg-transparent text-slate-700 dark:text-darkSurface-muted whitespace-pre-wrap leading-relaxed font-medium resize-none focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:focus:ring-brand-500/10 rounded-xl p-3 sm:-mx-3 border border-transparent hover:border-slate-100 dark:hover:border-darkSurface-border/50 transition-colors overflow-hidden"
          spellCheck="false"
        />
      </div>
    </div>
  );
};

const ResultsView = ({ data, onUpdateData, onReset }) => {

  const [copiedSection, setCopiedSection] = useState(null);
  const [showCopyMenu, setShowCopyMenu] = useState(false);
  const [smartPhrases, setSmartPhrases] = useState([]);
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const [summaryText, setSummaryText] = useState(null);
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const copyMenuRef = useRef(null);

  useEffect(() => {
    // Load smart phrases on mount
    const saved = localStorage.getItem('kickoff_preferences');
    if (saved) {
      try {
        const prefs = JSON.parse(saved);
        if (prefs.smartPhrases) setSmartPhrases(prefs.smartPhrases);
      } catch (e) {
        console.error("Failed to parse settings", e);
      }
    }
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (copyMenuRef.current && !copyMenuRef.current.contains(event.target)) {
        setShowCopyMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleTextChange = (id, newText) => {
    onUpdateData(prev => ({ ...prev, [id]: newText }));
  };

  const handleInsertSmartPhrase = (id, phrase) => {
    onUpdateData(prev => {
      const currentText = prev[id] || '';
      // Only add a newline if there's already some text
      const separator = currentText.trim().length > 0 ? '\n\n' : '';
      return { ...prev, [id]: `${currentText}${separator}${phrase}` };
    });
  };

  const handleCopy = (text, sectionName) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedSection(sectionName);
    setTimeout(() => setCopiedSection(null), 3000);
  };

  const handleGenerateSummary = async () => {
    setIsGeneratingSummary(true);
    setSummaryText(null);
    setShowSummaryModal(true);
    try {
      const result = await generatePatientSummary(data);
      setSummaryText(result);
    } catch (error) {
      console.error("Failed to generate summary", error);
      setSummaryText("Failed to generate the patient summary. Please try again.");
    } finally {
      setIsGeneratingSummary(false);
    }
  };

  const handlePrint = () => {
    // Hide everything else and just trigger the browser's native print function
    // We already have tailwind print modifiers set up in the HTML to handle the layout
    setTimeout(() => {
      window.print();
    }, 100);
  };

  const handleCopyFormatted = (format) => {
    const template = `Chief Complaint / Purpose of Visit:
${data.chief_complaint || ''}

Section 1 – Assessment Notes:
${data.section1_assessment || ''}

Section 2 – Assessment Notes: Going Deeper
${data.section2_assessment_deeper || ''}

Section 3 – Diagnosis Notes
${data.section3_diagnosis || ''}

Section 4– Intervention Notes
${data.section4_intervention || ''}

Section 5– Monitoring & Evaluation
${data.section5_monitoring || ''}

Section 6– Fitness Intervention, Monitoring and Evaluation
${data.section6_fitness || ''}`;

    let fullText = template;
    
    if (format === 'markdown') {
      fullText = `### Chief Complaint / Purpose of Visit:\n${data.chief_complaint || ''}\n\n### Section 1 – Assessment Notes:\n${data.section1_assessment || ''}\n\n### Section 2 – Assessment Notes: Going Deeper\n${data.section2_assessment_deeper || ''}\n\n### Section 3 – Diagnosis Notes\n${data.section3_diagnosis || ''}\n\n### Section 4– Intervention Notes\n${data.section4_intervention || ''}\n\n### Section 5– Monitoring & Evaluation\n${data.section5_monitoring || ''}\n\n### Section 6– Fitness Intervention, Monitoring and Evaluation\n${data.section6_fitness || ''}`;
    } else if (format === 'epic') {
      fullText = `*** Chief Complaint / Purpose of Visit: ***\n${data.chief_complaint || ''}\n\n*** Section 1 – Assessment Notes: ***\n${data.section1_assessment || ''}\n\n*** Section 2 – Assessment Notes: Going Deeper ***\n${data.section2_assessment_deeper || ''}\n\n*** Section 3 – Diagnosis Notes ***\n${data.section3_diagnosis || ''}\n\n*** Section 4– Intervention Notes ***\n${data.section4_intervention || ''}\n\n*** Section 5– Monitoring & Evaluation ***\n${data.section5_monitoring || ''}\n\n*** Section 6– Fitness Intervention, Monitoring and Evaluation ***\n${data.section6_fitness || ''}`;
    }
    
    handleCopy(fullText, 'all');
    setShowCopyMenu(false); // Close menu after copy
  };

  return (
    <div className="w-full mx-auto p-4 sm:p-6 lg:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Top Navigation / Actions */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between mb-6 sm:mb-8 pb-4 sm:pb-6 border-b border-slate-200/60 dark:border-darkSurface-border print:hidden">
        <button 
          onClick={onReset}
          className="flex items-center justify-center text-slate-500 dark:text-darkSurface-muted hover:text-slate-800 dark:hover:text-slate-200 font-semibold transition-colors group mb-4 sm:mb-0 bg-white dark:bg-darkSurface-card px-4 py-3 sm:py-2 rounded-xl shadow-sm border border-slate-100 dark:border-darkSurface-border hover:shadow-md"
        >
          <ArrowLeft size={18} className="mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Upload
        </button>
        
        <div className="flex space-x-3 w-full sm:w-auto relative" ref={copyMenuRef}>
          {/* Action Bar */}
          <button
            onClick={() => setShowCopyMenu(!showCopyMenu)}
            className={`flex-1 sm:flex-none flex items-center justify-center px-6 py-2.5 font-bold rounded-xl transition-all duration-300 shadow-sm border ${
              copiedSection === 'all' 
                ? 'bg-brand-100 dark:bg-brand-900/40 text-brand-700 dark:text-brand-400 border-brand-200 dark:border-brand-800' 
                : 'bg-white dark:bg-darkSurface-card text-slate-700 dark:text-darkSurface-muted border-slate-200 dark:border-darkSurface-border hover:border-brand-300 dark:hover:border-brand-600 hover:text-brand-700 dark:hover:text-brand-400 hover:shadow-md'
            }`}
          >
            {copiedSection === 'all' ? (
              <><CheckCircle2 size={18} className="mr-2 text-brand-600 dark:text-brand-500 drop-shadow-[0_0_5px_rgba(16,185,129,0.3)]" /> Copied Text</>
            ) : (
              <><Copy size={18} className="mr-2" /> Copy Full Draft <ChevronDown size={14} className={`ml-2 transition-transform duration-200 ${showCopyMenu ? 'rotate-180' : ''}`} /></>
            )}
          </button>

          {/* Copy Dropdown Menu */}
          {showCopyMenu && (
            <div className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-darkSurface-card rounded-xl shadow-xl border border-slate-100 dark:border-darkSurface-border/80 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="px-3 py-2 border-b border-slate-50 dark:border-darkSurface-border/50 bg-slate-50/50 dark:bg-darkSurface/50">
                <p className="text-xs font-bold text-slate-400 dark:text-darkSurface-muted/70 uppercase tracking-widest">Select EMR Format</p>
              </div>
              <div className="flex flex-col py-1">
                <button
                  onClick={() => handleCopyFormatted('plain')}
                  className="px-4 py-2.5 text-sm font-semibold text-slate-700 dark:text-darkSurface-muted flex items-center hover:bg-slate-50 dark:hover:bg-darkSurface-elevated transition-colors text-left"
                >
                  Plain Text <span className="ml-auto text-xs font-normal text-slate-400 dark:text-darkSurface-muted/50">Standard</span>
                </button>
                <button
                  onClick={() => handleCopyFormatted('epic')}
                  className="px-4 py-2.5 text-sm font-semibold text-brand-700 dark:text-brand-400 flex items-center hover:bg-brand-50 dark:hover:bg-brand-900/30 transition-colors text-left"
                >
                  Epic Format <span className="ml-auto text-xs font-normal text-brand-400/70">*** Header ***</span>
                </button>
                <button
                  onClick={() => handleCopyFormatted('markdown')}
                  className="px-4 py-2.5 text-sm font-semibold text-slate-700 dark:text-darkSurface-muted flex items-center hover:bg-slate-50 dark:hover:bg-darkSurface-elevated transition-colors text-left"
                >
                  Markdown <span className="ml-auto text-xs font-normal text-slate-400 dark:text-darkSurface-muted/50">### Header</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Draft Label */}
      <div className="bg-gradient-to-r from-rose-50 to-pink-50 dark:from-rose-950/30 dark:to-pink-950/30 border border-rose-200/60 dark:border-rose-900/50 p-4 sm:p-5 rounded-2xl mb-8 shadow-sm relative overflow-hidden group print:hidden">
        <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-rose-400 to-pink-400 dark:from-rose-600 dark:to-pink-600" />
        <div className="flex items-start sm:items-center text-left">
          <div className="bg-rose-100 dark:bg-rose-900/50 max-sm:p-2 sm:p-2.5 rounded-xl mr-4 shrink-0 mt-0.5 sm:mt-0 transition-transform group-hover:scale-110 duration-300">
             <AlertTriangle className="text-rose-600 dark:text-rose-400" size={24} />
          </div>
          <div>
            <h3 className="text-rose-900 dark:text-rose-300 font-bold font-heading tracking-wide uppercase text-sm mb-1 flex items-center">
              Draft Output — Clinician Review Required
              <span className="ml-3 text-xs bg-rose-200 dark:bg-rose-800 text-rose-800 dark:text-rose-200 px-2 py-0.5 rounded-md hidden sm:inline-block">Editable</span>
            </h3>
            <p className="text-rose-700/90 dark:text-rose-400/90 text-sm font-medium leading-relaxed mb-0">
              This content was generated by AI and may contain errors. You can edit the text directly below before copying into your EMR.
            </p>
          </div>
        </div>
      </div>

      {/* PHI Warning */}
      {data.phi_warning && (
        <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-800/50 p-4 sm:p-5 rounded-2xl mb-8 shadow-sm flex items-start animate-in slide-in-from-top-4 print:hidden">
          <div className="bg-amber-100/50 dark:bg-amber-900/50 p-2.5 rounded-xl mr-4 shrink-0 transition-transform hover:scale-110 duration-300">
             <AlertTriangle className="text-amber-500 dark:text-amber-500" size={24} />
          </div>
          <div>
            <h4 className="text-amber-900 dark:text-amber-400 font-bold font-heading text-sm uppercase tracking-wide mb-1">Potential PHI Detected</h4>
            <p className="text-amber-700/90 dark:text-amber-500/90 text-sm font-medium leading-relaxed">
              The system detected patterns resembling Personally Identifiable Information (like phone numbers or SSNs) in your notes. Please ensure you strictly upload de-identified notes.
            </p>
          </div>
        </div>
      )}

      {/* Attention Required / Validation Flags */}
      {data.needs_review && (
        <div className="bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-950/30 dark:to-blue-950/30 border border-indigo-100 dark:border-indigo-900/50 p-5 sm:p-6 rounded-2xl mb-10 shadow-sm relative overflow-hidden print:hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 dark:bg-indigo-400/5 rounded-bl-full pointer-events-none" />
          
          <h4 className="text-indigo-900 dark:text-indigo-300 font-bold font-heading text-lg mb-5 flex items-center">
             <div className="bg-indigo-100 dark:bg-indigo-900 p-2 rounded-lg mr-3">
                 <ActivitySquare size={20} className="text-indigo-600 dark:text-indigo-400" />
             </div>
             Attention Required
          </h4>
          
          <div className="space-y-5">
              {data.missing_items && data.missing_items.length > 0 && (
                 <div className="bg-white/60 dark:bg-darkSurface/40 p-4 rounded-xl border border-indigo-100/50 dark:border-indigo-800/30">
                   <strong className="text-indigo-900 dark:text-indigo-300 font-semibold text-sm mb-2 block flex items-center">
                     <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 dark:bg-indigo-500 mr-2"></span> Missing Information:
                   </strong>
                   <ul className="list-disc pl-6 text-indigo-700/90 dark:text-indigo-300/80 font-medium text-sm space-y-1.5">
                     {data.missing_items.map((item, idx) => <li key={idx}>{item}</li>)}
                   </ul>
                 </div>
              )}

              {data.review_notes && data.review_notes.length > 0 && (
                 <div className="bg-white/60 dark:bg-slate-900/40 p-4 rounded-xl border border-indigo-100/50 dark:border-indigo-800/30">
                   <strong className="text-indigo-900 dark:text-indigo-300 font-semibold text-sm mb-2 block flex items-center">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 dark:bg-indigo-500 mr-2"></span> Review Notes:
                   </strong>
                   <ul className="list-disc pl-6 text-indigo-700/90 dark:text-indigo-300/80 font-medium text-sm space-y-1.5">
                     {data.review_notes.map((note, idx) => <li key={idx}>{note}</li>)}
                   </ul>
                 </div>
              )}
              
              {data.follow_up_suggestions && data.follow_up_suggestions.length > 0 && (
                 <div className="bg-white/60 dark:bg-slate-900/40 p-4 rounded-xl border border-indigo-100/50 dark:border-indigo-800/30">
                   <strong className="text-indigo-900 dark:text-indigo-300 font-semibold text-sm mb-2 block flex items-center">
                       <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 dark:bg-indigo-500 mr-2"></span> Follow-up Suggestions:
                   </strong>
                   <ul className="list-disc pl-6 text-indigo-700/90 dark:text-indigo-300/80 font-medium text-sm space-y-1.5">
                     {data.follow_up_suggestions.map((sug, idx) => <li key={idx}>{sug}</li>)}
                   </ul>
                 </div>
              )}
          </div>
        </div>
      )}

      {/* Draft Cards */}
      <div className="space-y-6 print:hidden">
        <SectionCard title="Chief Complaint" id="chief_complaint" content={data.chief_complaint} onTextChange={handleTextChange} onCopy={handleCopy} copiedSection={copiedSection} smartPhrases={smartPhrases} onInsertSmartPhrase={handleInsertSmartPhrase} />
        <SectionCard title="Section 1 – Assessment Notes" id="section1_assessment" content={data.section1_assessment} onTextChange={handleTextChange} onCopy={handleCopy} copiedSection={copiedSection} smartPhrases={smartPhrases} onInsertSmartPhrase={handleInsertSmartPhrase} />
        <SectionCard title="Section 2 – Assessment Notes: Going Deeper" id="section2_assessment_deeper" content={data.section2_assessment_deeper} onTextChange={handleTextChange} onCopy={handleCopy} copiedSection={copiedSection} smartPhrases={smartPhrases} onInsertSmartPhrase={handleInsertSmartPhrase} />
        <SectionCard title="Section 3 – Diagnosis Notes" id="section3_diagnosis" content={data.section3_diagnosis} onTextChange={handleTextChange} onCopy={handleCopy} copiedSection={copiedSection} smartPhrases={smartPhrases} onInsertSmartPhrase={handleInsertSmartPhrase} />
        <SectionCard title="Section 4 – Intervention Notes" id="section4_intervention" content={data.section4_intervention} onTextChange={handleTextChange} onCopy={handleCopy} copiedSection={copiedSection} smartPhrases={smartPhrases} onInsertSmartPhrase={handleInsertSmartPhrase} />
        <SectionCard title="Section 5 – Monitoring & Evaluation" id="section5_monitoring" content={data.section5_monitoring} onTextChange={handleTextChange} onCopy={handleCopy} copiedSection={copiedSection} smartPhrases={smartPhrases} onInsertSmartPhrase={handleInsertSmartPhrase} />
        <SectionCard title="Section 6 – Fitness Intervention" id="section6_fitness" content={data.section6_fitness} onTextChange={handleTextChange} onCopy={handleCopy} copiedSection={copiedSection} smartPhrases={smartPhrases} onInsertSmartPhrase={handleInsertSmartPhrase} />
      </div>

      {/* Action Footer */}
      <div className="mt-10 pt-8 border-t border-slate-200/60 dark:border-darkSurface-border flex justify-end print:hidden">
        <button
          onClick={handleGenerateSummary}
          disabled={isGeneratingSummary}
          className="flex items-center justify-center px-6 py-3.5 bg-brand-50 hover:bg-brand-100 dark:bg-brand-900/20 dark:hover:bg-brand-900/40 text-brand-700 dark:text-brand-400 font-bold rounded-xl transition-all duration-300 border border-brand-200 dark:border-brand-800 shadow-sm hover:shadow-md"
        >
          {isGeneratingSummary ? (
            <><Loader2 size={18} className="mr-2 animate-spin" /> Generating...</>
          ) : (
            <><FileText size={18} className="mr-2" /> Generate Patient Handout</>
          )}
        </button>
      </div>

      {/* Patient Summary Modal */}
      {showSummaryModal && (
        <>
          <div 
            className="fixed inset-0 bg-slate-900/60 dark:bg-black/70 backdrop-blur-sm z-[100] transition-opacity duration-300 flex justify-center items-center p-4 sm:p-6 print:static print:inset-auto print:bg-transparent print:p-0 print:block"
            onClick={() => !isGeneratingSummary && setShowSummaryModal(false)}
          >
            <div 
              className="bg-white dark:bg-darkSurface w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-100 dark:border-darkSurface-border/50 flex flex-col max-h-[90vh] overflow-hidden transform transition-all animate-in zoom-in-95 duration-200 print:max-w-none print:max-h-none print:shadow-none print:border-none print:rounded-none print:block print:w-full print:bg-transparent print:overflow-visible"
              onClick={e => e.stopPropagation()}
            >
              {/* Header */}
              <div className="px-6 py-5 border-b border-slate-100 dark:border-darkSurface-border/50 flex justify-between items-center bg-slate-50/50 dark:bg-darkSurface/50 print:hidden">
                <div className="flex items-center">
                  <div className="p-2 bg-brand-100 dark:bg-brand-900/30 rounded-xl mr-3">
                    <FileText className="text-brand-600 dark:text-brand-400" size={20} />
                  </div>
                  <h2 className="text-lg font-bold font-heading text-slate-800 dark:text-white tracking-tight">Patient Handout</h2>
                </div>
                {!isGeneratingSummary && (
                  <button 
                    onClick={() => setShowSummaryModal(false)}
                    className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-darkSurface-card rounded-xl transition-colors"
                  >
                    <X size={20} />
                  </button>
                )}
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-6 custom-scrollbar bg-slate-50/30 dark:bg-darkSurface-card/30 print:overflow-visible print:p-0 print:bg-transparent print:block print:w-full">
                {isGeneratingSummary ? (
                  <div className="flex flex-col items-center justify-center py-20 text-center animate-in fade-in duration-500">
                     <div className="relative mb-6">
                        <div className="absolute inset-0 bg-brand-500/20 dark:bg-brand-400/20 rounded-full blur-xl animate-pulse"></div>
                        <div className="bg-white dark:bg-darkSurface-elevated p-4 rounded-2xl shadow-lg relative border border-slate-100 dark:border-darkSurface-border">
                          <Loader2 size={32} className="text-brand-500 animate-spin" />
                        </div>
                     </div>
                     <h3 className="text-lg font-bold font-heading text-slate-800 dark:text-white mb-2">Translating Clinical Notes...</h3>
                     <p className="text-slate-500 dark:text-darkSurface-muted text-sm max-w-sm mx-auto">
                        Writing an encouraging, jargon-free summary focusing on goals and the care plan at a 6th-grade reading level.
                     </p>
                  </div>
                ) : (
                  <div className="flex flex-col w-full h-full bg-slate-50 dark:bg-darkSurface print:bg-white print:dark:bg-white text-left">
                    {/* Handout Header Banner */}
                    <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-8 text-white rounded-b-3xl shadow-md relative overflow-hidden shrink-0 print:rounded-none print:shadow-none print:border-b-4 print:border-emerald-500 print:bg-none print:bg-emerald-50">
                      <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 print:hidden"></div>
                      <div className="relative z-10">
                        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3 print:text-emerald-800">
                          {summaryText?.title}
                        </h1>
                        <p className="text-emerald-50 text-lg font-medium opacity-90 print:text-emerald-700">
                          {summaryText?.greeting}
                        </p>
                      </div>
                    </div>

                    <div className="p-6 sm:p-8 space-y-8 flex-1 print:p-0 print:pt-8">
                      {/* Summary Section */}
                      <div className="bg-white dark:bg-darkSurface-card rounded-2xl p-6 shadow-sm border-l-4 border-blue-500 border-y border-r border-y-slate-100 border-r-slate-100 dark:border-y-darkSurface-border dark:border-r-darkSurface-border print:border-y-0 print:border-r-0 print:shadow-none print:bg-slate-50">
                        <p className="text-slate-700 dark:text-slate-300 text-[1.05rem] leading-relaxed print:text-slate-800">
                          {summaryText?.encouraging_summary}
                        </p>
                      </div>

                      {/* Goals Section */}
                      <div>
                        <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400 dark:text-darkSurface-muted mb-4 flex items-center print:text-slate-800 print:border-b-2 print:border-slate-200 print:pb-2">
                          <CheckCircle2 size={16} className="mr-2 text-brand-500 print:text-emerald-600" /> Action Goals
                        </h3>
                        <div className="bg-white dark:bg-darkSurface-card rounded-2xl shadow-sm border border-slate-100 dark:border-darkSurface-border p-2 print:border-none print:shadow-none print:p-0">
                          <ul className="divide-y divide-slate-50 dark:divide-darkSurface-border/50 print:divide-none space-y-3">
                            {summaryText?.actionable_goals?.map((goal, idx) => (
                              <li key={idx} className="p-4 flex items-start group print:p-0">
                                <span className="hidden print:inline mr-2 text-emerald-500 font-bold">✓</span>
                                <div className="bg-brand-50 dark:bg-brand-900/30 w-8 h-8 rounded-full flex items-center justify-center shrink-0 mr-4 mt-0.5 group-hover:scale-110 group-hover:bg-brand-100 dark:group-hover:bg-brand-900/50 transition-all print:hidden">
                                  <span className="text-brand-600 dark:text-brand-400 font-bold text-sm">{idx + 1}</span>
                                </div>
                                <span className="text-slate-700 dark:text-slate-300 font-medium leading-relaxed pt-1 print:text-slate-800 print:pt-0">
                                  {goal}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {/* Takeaways Grid */}
                      <div>
                        <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400 dark:text-darkSurface-muted mb-4 flex items-center print:text-slate-800 print:border-b-2 print:border-slate-200 print:pb-2">
                          <Lightbulb size={16} className="mr-2 text-amber-500 print:hidden" /> Key Takeaways
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 print:gap-6">
                          {summaryText?.key_takeaways?.map((ta, idx) => (
                            <div key={idx} className="bg-white dark:bg-darkSurface-card rounded-2xl shadow-sm border border-slate-100 dark:border-darkSurface-border p-5 flex items-start hover:shadow-md transition-shadow print:border print:shadow-none print:rounded-xl">
                              <div className="bg-slate-50 dark:bg-darkSurface-elevated p-3 rounded-xl mr-4 shrink-0 print:bg-slate-100">
                                {getIconForTakeaway(ta.icon)}
                              </div>
                              <p className="text-slate-700 dark:text-slate-300 font-medium text-sm leading-relaxed pt-1 print:text-slate-800">
                                {ta.text}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Footer */}
                      <div className="text-center pt-6 pb-2 border-t border-slate-200 border-dashed dark:border-darkSurface-border">
                        <p className="text-slate-500 dark:text-darkSurface-muted font-medium italic print:text-slate-500">
                          {summaryText?.closing_encouragement}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Footer */}
              {!isGeneratingSummary && summaryText && (
                <div className="p-5 border-t border-slate-100 dark:border-darkSurface-border/50 bg-white dark:bg-darkSurface flex justify-end gap-3 print:hidden">
                   <button
                    onClick={() => {
                      navigator.clipboard.writeText(summaryText);
                    }}
                    className="px-5 py-2.5 rounded-xl font-bold flex items-center justify-center transition-all duration-200 bg-slate-100 dark:bg-darkSurface-elevated hover:bg-slate-200 dark:hover:bg-darkSurface-card text-slate-700 dark:text-slate-200"
                  >
                    <Copy size={18} className="mr-2" /> Copy text
                  </button>
                  <button
                    onClick={handlePrint}
                    className="px-6 py-2.5 rounded-xl font-bold flex items-center justify-center shadow-lg hover:-translate-y-0.5 bg-brand-500 hover:bg-brand-400 text-white shadow-brand-500/30 transition-all duration-300"
                  >
                    <Printer size={18} className="mr-2" /> Print PDF
                  </button>
                </div>
              )}
            </div>
          </div>
        </>
      )}

    </div>
  );
};

export default ResultsView;
