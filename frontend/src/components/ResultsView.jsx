import React, { useState, useEffect, useRef } from 'react';
import { Copy, Check, AlertTriangle, ArrowLeft, ActivitySquare, CheckCircle2, TrendingUp, Lightbulb, ChevronDown, BookmarkPlus } from 'lucide-react';

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

  const handleCopyFormatted = (format) => {
    let fullText = '';
    
    if (format === 'markdown') {
      fullText = `### ASSESSMENT\n${data.assessment || ''}\n\n### DIAGNOSIS\n${data.diagnosis || ''}\n\n### INTERVENTION\n${data.intervention || ''}\n\n### MONITORING & EVALUATION\n${data.monitoring_evaluation || ''}`.trim();
    } else if (format === 'epic') {
      fullText = `*** ASSESSMENT ***\n${data.assessment || ''}\n\n*** DIAGNOSIS ***\n${data.diagnosis || ''}\n\n*** INTERVENTION ***\n${data.intervention || ''}\n\n*** MONITORING & EVALUATION ***\n${data.monitoring_evaluation || ''}`.trim();
    } else {
      // Plain text
      fullText = `ASSESSMENT:\n${data.assessment || ''}\n\nDIAGNOSIS:\n${data.diagnosis || ''}\n\nINTERVENTION:\n${data.intervention || ''}\n\nMONITORING & EVALUATION:\n${data.monitoring_evaluation || ''}`.trim();
    }
    
    handleCopy(fullText, 'all');
    setShowCopyMenu(false); // Close menu after copy
  };

  return (
    <div className="w-full mx-auto p-4 sm:p-6 lg:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Top Navigation / Actions */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between mb-6 sm:mb-8 pb-4 sm:pb-6 border-b border-slate-200/60 dark:border-darkSurface-border">
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
      <div className="bg-gradient-to-r from-rose-50 to-pink-50 dark:from-rose-950/30 dark:to-pink-950/30 border border-rose-200/60 dark:border-rose-900/50 p-4 sm:p-5 rounded-2xl mb-8 shadow-sm relative overflow-hidden group">
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
        <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-800/50 p-4 sm:p-5 rounded-2xl mb-8 shadow-sm flex items-start animate-in slide-in-from-top-4">
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
        <div className="bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-950/30 dark:to-blue-950/30 border border-indigo-100 dark:border-indigo-900/50 p-5 sm:p-6 rounded-2xl mb-10 shadow-sm relative overflow-hidden">
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
      <div className="space-y-6">
        <SectionCard title="Assessment" id="assessment" content={data.assessment} onTextChange={handleTextChange} onCopy={handleCopy} copiedSection={copiedSection} smartPhrases={smartPhrases} onInsertSmartPhrase={handleInsertSmartPhrase} />
        <SectionCard title="Diagnosis" id="diagnosis" content={data.diagnosis} onTextChange={handleTextChange} onCopy={handleCopy} copiedSection={copiedSection} smartPhrases={smartPhrases} onInsertSmartPhrase={handleInsertSmartPhrase} />
        <SectionCard title="Intervention" id="intervention" content={data.intervention} onTextChange={handleTextChange} onCopy={handleCopy} copiedSection={copiedSection} smartPhrases={smartPhrases} onInsertSmartPhrase={handleInsertSmartPhrase} />
        <SectionCard title="Monitoring & Evaluation" id="monitoring_evaluation" content={data.monitoring_evaluation} onTextChange={handleTextChange} onCopy={handleCopy} copiedSection={copiedSection} smartPhrases={smartPhrases} onInsertSmartPhrase={handleInsertSmartPhrase} />
      </div>

      {/* Follow-Up Specific Cards */}
      {data.is_follow_up && (
        <div className="mt-10 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          
          {/* Section Header */}
          <div className="flex items-center mb-2">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-brand-300 dark:via-brand-700 to-transparent" />
            <span className="px-4 text-xs font-bold uppercase tracking-[0.2em] text-brand-600 dark:text-brand-400">Follow-Up Analysis</span>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-brand-300 dark:via-brand-700 to-transparent" />
          </div>

          {/* Progress Summary */}
          {data.progress_summary && (
            <div className="bg-white dark:bg-darkSurface-card rounded-2xl shadow-sm hover:shadow-md border border-slate-100 dark:border-darkSurface-border/50 p-4 sm:p-6 relative group transition-all duration-300">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-bold tracking-widest text-emerald-700 dark:text-emerald-400 font-heading uppercase flex items-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 dark:bg-emerald-500 mr-2 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
                  Progress Summary
                </h3>
                <div className="bg-emerald-50 dark:bg-emerald-900/30 p-1.5 rounded-lg">
                  <TrendingUp size={16} className="text-emerald-600 dark:text-emerald-400" />
                </div>
              </div>
              <p className="text-slate-700 dark:text-darkSurface-muted whitespace-pre-wrap leading-relaxed font-medium">
                {data.progress_summary}
              </p>
            </div>
          )}

          {/* Recommendations */}
          {data.recommendations && data.recommendations.length > 0 && (
            <div className="bg-white dark:bg-darkSurface-card rounded-2xl shadow-sm hover:shadow-md border border-slate-100 dark:border-darkSurface-border/50 p-4 sm:p-6 relative group transition-all duration-300">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-bold tracking-widest text-amber-700 dark:text-amber-400 font-heading uppercase flex items-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 dark:bg-amber-500 mr-2 shadow-[0_0_8px_rgba(245,158,11,0.5)]"></span>
                  Treatment Recommendations
                </h3>
                <div className="bg-amber-50 dark:bg-amber-900/30 p-1.5 rounded-lg">
                  <Lightbulb size={16} className="text-amber-600 dark:text-amber-400" />
                </div>
              </div>
              <ul className="space-y-3">
                {data.recommendations.map((rec, idx) => (
                  <li key={idx} className="flex items-start">
                    <span className="w-6 h-6 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 mr-3">{idx + 1}</span>
                    <span className="text-slate-700 dark:text-darkSurface-muted font-medium leading-relaxed">{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

    </div>
  );
};

export default ResultsView;
