import React, { useState, useEffect, useRef } from 'react';
import { Copy, Check, AlertTriangle, ArrowLeft, ActivitySquare, CheckCircle2 } from 'lucide-react';

const SectionCard = ({ title, content, id, onTextChange, onCopy, copiedSection }) => {
  const textareaRef = useRef(null);

  // Auto-resize textarea based on content
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [content]);

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm hover:shadow-md border border-slate-100 dark:border-slate-700/50 p-6 relative group transition-all duration-300">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-bold tracking-widest text-brand-800 dark:text-brand-400 font-heading uppercase flex items-center">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-400 dark:bg-brand-500 mr-2 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
            {title}
        </h3>
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
      <div className="relative">
        <textarea
          ref={textareaRef}
          value={content || ''}
          onChange={(e) => onTextChange(id, e.target.value)}
          placeholder={`No ${title.toLowerCase()} content extracted. Start typing to edit...`}
          className="w-full bg-transparent text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed font-medium resize-none focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:focus:ring-brand-500/10 rounded-xl p-3 -mx-3 border border-transparent hover:border-slate-100 dark:hover:border-slate-700/50 transition-colors overflow-hidden"
          spellCheck="false"
        />
      </div>
    </div>
  );
};

const ResultsView = ({ data, onUpdateData, onReset }) => {

  const [copiedSection, setCopiedSection] = useState(null);

  const handleTextChange = (id, newText) => {
    onUpdateData(prev => ({ ...prev, [id]: newText }));
  };

  const handleCopy = (text, sectionName) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedSection(sectionName);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const handleCopyAll = () => {
    const fullText = `
ASSESSMENT:
${data.assessment || ''}

DIAGNOSIS:
${data.diagnosis || ''}

INTERVENTION:
${data.intervention || ''}

MONITORING & EVALUATION:
${data.monitoring_evaluation || ''}
    `.trim();
    
    handleCopy(fullText, 'all');
  };

  return (
    <div className="w-full mx-auto p-4 sm:p-6 lg:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Top Navigation / Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 pb-6 border-b border-slate-200/60 dark:border-slate-800">
        <button 
          onClick={onReset}
          className="flex items-center text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 font-semibold transition-colors group mb-4 sm:mb-0 bg-white dark:bg-slate-800 px-4 py-2 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 hover:shadow-md"
        >
          <ArrowLeft size={18} className="mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Upload
        </button>
        
        <div className="flex space-x-3 w-full sm:w-auto">
          {/* Action Bar */}
          <button
            onClick={handleCopyAll}
            className={`flex-1 sm:flex-none flex items-center justify-center px-6 py-2.5 font-bold rounded-xl transition-all duration-300 shadow-sm border ${
              copiedSection === 'all' 
                ? 'bg-brand-100 dark:bg-brand-900/40 text-brand-700 dark:text-brand-400 border-brand-200 dark:border-brand-800' 
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-brand-300 dark:hover:border-brand-600 hover:text-brand-700 dark:hover:text-brand-400 hover:shadow-md'
            }`}
          >
            {copiedSection === 'all' ? (
              <><CheckCircle2 size={18} className="mr-2 text-brand-600 dark:text-brand-500 drop-shadow-[0_0_5px_rgba(16,185,129,0.3)]" /> Copied</>
            ) : (
              <><Copy size={18} className="mr-2" /> Copy Full Draft</>
            )}
          </button>
        </div>
      </div>

      {/* Main Draft Label */}
      <div className="bg-gradient-to-r from-rose-50 to-pink-50 dark:from-rose-950/30 dark:to-pink-950/30 border border-rose-200/60 dark:border-rose-900/50 p-5 rounded-2xl mb-8 shadow-sm relative overflow-hidden group">
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
        <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-800/50 p-5 rounded-2xl mb-8 shadow-sm flex items-start animate-in slide-in-from-top-4">
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
        <div className="bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-950/30 dark:to-blue-950/30 border border-indigo-100 dark:border-indigo-900/50 p-6 rounded-2xl mb-10 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 dark:bg-indigo-400/5 rounded-bl-full pointer-events-none" />
          
          <h4 className="text-indigo-900 dark:text-indigo-300 font-bold font-heading text-lg mb-5 flex items-center">
             <div className="bg-indigo-100 dark:bg-indigo-900 p-2 rounded-lg mr-3">
                 <ActivitySquare size={20} className="text-indigo-600 dark:text-indigo-400" />
             </div>
             Attention Required
          </h4>
          
          <div className="space-y-5">
              {data.missing_items && data.missing_items.length > 0 && (
                 <div className="bg-white/60 dark:bg-slate-900/40 p-4 rounded-xl border border-indigo-100/50 dark:border-indigo-800/30">
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
        <SectionCard title="Assessment" id="assessment" content={data.assessment} onTextChange={handleTextChange} onCopy={handleCopy} copiedSection={copiedSection} />
        <SectionCard title="Diagnosis" id="diagnosis" content={data.diagnosis} onTextChange={handleTextChange} onCopy={handleCopy} copiedSection={copiedSection} />
        <SectionCard title="Intervention" id="intervention" content={data.intervention} onTextChange={handleTextChange} onCopy={handleCopy} copiedSection={copiedSection} />
        <SectionCard title="Monitoring & Evaluation" id="monitoring_evaluation" content={data.monitoring_evaluation} onTextChange={handleTextChange} onCopy={handleCopy} copiedSection={copiedSection} />
      </div>

    </div>
  );
};

export default ResultsView;
