import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Upload, X, File as FileIcon, Image as ImageIcon, FileText, AlertTriangle, ShieldAlert, Check, HeartPulse, ClipboardPaste, Mic, MicOff } from 'lucide-react';
import { uploadFiles } from '../services/api';
import RobotLoader from './RobotLoader';
import emilyImg from '../assets/emily.jpg';
import { useDictation } from '../hooks/useDictation';

const Dashboard = ({ onUploadSuccess }) => {
  const [files, setFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const [progressMsg, setProgressMsg] = useState('');
  const [isPhiConfirmed, setIsPhiConfirmed] = useState(false);
  const [imagePreviews, setImagePreviews] = useState({});
  const [inputMode, setInputMode] = useState('upload'); // 'upload' or 'paste'
  const [pastedText, setPastedText] = useState('');
  
  const fileInputRef = useRef(null);

  const { isDictating, isSupported: isDictationSupported, error: dictationError, toggleDictation } = useDictation(setPastedText);

  // Generate object URLs for image previews
  useEffect(() => {
    const urls = {};
    files.forEach(file => {
      if (file.type.includes('image')) {
        urls[file.name] = URL.createObjectURL(file);
      }
    });
    setImagePreviews(urls);

    // Cleanup URLs
    return () => {
      Object.values(urls).forEach(url => URL.revokeObjectURL(url));
    };
  }, [files]);

  const getFileIcon = (file) => {
    const type = file.type || '';
    const name = file.name.toLowerCase();
    
    if (type.includes('image') || name.endsWith('heic')) {
      if (imagePreviews[file.name]) {
        return <img src={imagePreviews[file.name]} alt="preview" className="w-8 h-8 object-cover rounded shadow-sm border border-slate-200 dark:border-darkSurface-border" />;
      }
      return <ImageIcon className="text-brand-500" size={24} />;
    }
    if (type.includes('pdf')) return <FileIcon className="text-rose-500" size={24} />;
    return <FileText className="text-blue-500" size={24} />;
  };

  const validateAndAddFiles = (newFiles) => {
    const allowedTypes = ['text/plain', 'application/pdf', 'image/jpeg', 'image/png', 'image/heic', 'image/heif'];
    const validFiles = [];
    let hasError = false;

    Array.from(newFiles).forEach(file => {
      const ext = file.name.split('.').pop().toLowerCase();
      if (allowedTypes.includes(file.type) || ['txt', 'pdf', 'jpg', 'jpeg', 'png', 'heic'].includes(ext)) {
        if (!files.find(f => f.name === file.name && f.size === file.size)) {
           validFiles.push(file);
        }
      } else {
        hasError = true;
      }
    });

    if (hasError) {
      setError('Some files were rejected. Only TXT, PDF, JPG, PNG, and HEIC are supported.');
    } else {
      setError('');
    }

    setFiles(prev => [...prev, ...validFiles]);
  };

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragging(true);
    } else if (e.type === 'dragleave') {
      setIsDragging(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndAddFiles(e.dataTransfer.files);
    }
  }, [files]);

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndAddFiles(e.target.files);
    }
  };

  const removeFile = (indexToRemove) => {
    setFiles(files.filter((_, index) => index !== indexToRemove));
  };

  const hasContent = inputMode === 'upload' ? files.length > 0 : pastedText.trim().length > 0;

  const handleProcess = async () => {
    if (!hasContent || !isPhiConfirmed) return;
    setIsUploading(true);
    setError('');
    setProgressMsg('Extracting content and checking for identifiers...');

    try {
      setTimeout(() => setProgressMsg('Generating Draft ADIME...'), 2000);
      setTimeout(() => setProgressMsg('Validating clinical completeness...'), 5000);

      let filesToUpload = files;
      if (inputMode === 'paste') {
        const blob = new Blob([pastedText], { type: 'text/plain' });
        filesToUpload = [new File([blob], 'pasted-notes.txt', { type: 'text/plain' })];
      }

      const preferences = localStorage.getItem('kickoff_preferences');
      const response = await uploadFiles(filesToUpload, preferences);
      
      if (response && (response.assessment || response.diagnosis || response.intervention || response.monitoring_evaluation)) {
        onUploadSuccess(response);
      } else {
        throw new Error('Invalid response format received from AI server');
      }
    } catch (err) {
      console.error('Upload Error:', err);
      setError(err.response?.data?.error || err.message || 'An error occurred during processing.');
      setIsUploading(false);
      setProgressMsg('');
    }
  };

  return (
    <div className="w-full mx-auto p-4 sm:p-6 lg:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header & Warning section */}
      <div className="mb-10 text-center sm:text-left">
        <h2 className="text-2xl sm:text-3xl font-bold font-heading text-slate-800 dark:text-white mb-3 tracking-tight">Upload Notes</h2>
        
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/40 dark:to-orange-950/40 border border-amber-200/60 dark:border-amber-800/60 p-5 rounded-2xl shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-amber-400 to-orange-400 dark:from-amber-500 dark:to-orange-500" />
          <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left">
            <div className="bg-amber-100/50 dark:bg-amber-900/50 p-2.5 rounded-xl mb-3 sm:mb-0 sm:mr-4 shrink-0 transition-transform group-hover:scale-110 duration-300">
                <ShieldAlert className="text-amber-600 dark:text-amber-500" size={24} />
            </div>
            <div>
              <h3 className="text-amber-900 dark:text-amber-400 font-semibold font-heading text-lg">Strict Privacy Notice</h3>
              <p className="text-amber-700/90 dark:text-amber-500/90 text-sm mt-1 mb-0 leading-relaxed max-w-2xl">
                Upload <strong className="text-amber-900 dark:text-amber-300 bg-amber-200/30 dark:bg-amber-800/30 px-1 rounded">de-identified notes only</strong>. Ensure there are absolutely no names, DOBs, addresses, SSNs, MRNs, insurance IDs, or contact info included in your documents.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Input Mode Toggle */}
      <div className="flex items-center justify-center sm:justify-start mb-6">
        <div className="bg-white dark:bg-darkSurface-card rounded-xl p-1 shadow-sm border border-slate-200/60 dark:border-darkSurface-border/60 flex">
          <button
            onClick={() => setInputMode('upload')}
            className={`flex items-center px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
              inputMode === 'upload'
                ? 'bg-slate-800 dark:bg-darkSurface-elevated text-white shadow-sm'
                : 'text-slate-500 dark:text-darkSurface-muted hover:text-slate-800 dark:hover:text-white'
            }`}
          >
            <Upload size={15} className="mr-1.5" />
            Upload Files
          </button>
          <button
            onClick={() => setInputMode('paste')}
            className={`flex items-center px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
              inputMode === 'paste'
                ? 'bg-slate-800 dark:bg-darkSurface-elevated text-white shadow-sm'
                : 'text-slate-500 dark:text-darkSurface-muted hover:text-slate-800 dark:hover:text-white'
            }`}
          >
            <ClipboardPaste size={15} className="mr-1.5" />
            Paste / Dictate
          </button>
        </div>
      </div>

      {inputMode === 'upload' ? (
      /* Upload Zone */
      <div 
        className={`relative border-2 border-dashed rounded-[2rem] p-6 flex flex-col items-center justify-center sm:p-12 text-center transition-all duration-300 ease-in-out bg-surface-50/80 dark:bg-darkSurface-card/50 backdrop-blur-sm ${
          isDragging 
            ? 'border-brand-500 bg-brand-50/80 dark:bg-brand-900/20 shadow-[0_0_40px_rgba(236,72,153,0.15)] scale-[1.02] z-10' 
            : 'border-brand-200 dark:border-darkSurface-border hover:border-brand-300 dark:hover:border-brand-700 hover:bg-white dark:hover:bg-darkSurface-elevated hover:shadow-xl hover:shadow-brand-500/10 dark:hover:shadow-black/20'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <div className="flex justify-center mb-6">
          <div className={`p-2 rounded-full transition-all duration-500 ${isDragging ? 'bg-brand-500 shadow-lg shadow-brand-500/30 scale-110' : 'bg-surface-100 dark:bg-darkSurface-elevated shadow-sm border border-slate-200 dark:border-darkSurface-border'}`}>
            <img src={emilyImg} alt="Dietitian Profile" className={`w-12 h-12 rounded-full object-cover transition-all ${isDragging ? 'ring-4 ring-white/50' : ''}`} />
          </div>
        </div>
        <h3 className="text-xl font-bold font-heading text-slate-800 dark:text-white mb-2">Drag & Drop Files</h3>
        <p className="text-slate-500 dark:text-darkSurface-muted font-medium mb-8 text-sm">Or select files from your computer (.txt, .pdf, .jpg, .png., .heic)</p>
        
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileSelect} 
          className="hidden" 
          multiple 
          accept=".txt,.pdf,.jpg,.jpeg,.png,.heic,text/plain,application/pdf,image/jpeg,image/png"
        />
        <button 
          onClick={() => fileInputRef.current?.click()}
          className="px-8 py-3.5 bg-slate-800 dark:bg-darkSurface-elevated text-white font-semibold tracking-wide rounded-xl hover:bg-slate-700 dark:hover:bg-darkSurface-card hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 focus:ring-4 focus:ring-slate-200 dark:focus:ring-darkSurface-border active:scale-95"
        >
          Browse Files
        </button>
      </div>
      ) : (
      /* Paste Text Zone */
      <div className={`relative rounded-2xl overflow-hidden bg-white dark:bg-darkSurface-card border shadow-sm transition-all duration-300 ${isDictating ? 'border-brand-400 ring-4 ring-brand-500/10' : 'border-slate-200 dark:border-darkSurface-border'}`}>
        <div className="px-5 py-3 border-b border-slate-100 dark:border-darkSurface-border/50 bg-slate-50/50 dark:bg-darkSurface/50 flex flex-wrap items-center">
          <div className="flex items-center mr-auto">
            <ClipboardPaste size={16} className="text-slate-400 dark:text-darkSurface-muted mr-2 hidden sm:block" />
            <span className="text-sm font-semibold text-slate-600 dark:text-darkSurface-muted">Paste or dictate clinical notes</span>
          </div>
          
          <div className="flex items-center space-x-3 mt-2 sm:mt-0 w-full sm:w-auto">
            {isDictationSupported && (
              <button
                onClick={toggleDictation}
                type="button"
                className={`flex-1 sm:flex-none flex items-center justify-center px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-300 ${
                  isDictating 
                    ? 'bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400 animate-pulse shadow-sm' 
                    : 'bg-white dark:bg-darkSurface-elevated text-slate-600 dark:text-darkSurface-muted border border-slate-200 dark:border-darkSurface-border hover:bg-slate-50 dark:hover:bg-darkSurface-card hover:text-brand-600 dark:hover:text-brand-400 shadow-sm'
                }`}
              >
                {isDictating ? (
                  <><MicOff size={14} className="mr-1.5" /> Stop Listening</>
                ) : (
                  <><Mic size={14} className="mr-1.5" /> Start Dictation</>
                )}
              </button>
            )}

            {pastedText.length > 0 && (
              <span className="text-xs font-medium text-slate-400 dark:text-darkSurface-muted/50 hidden sm:block">
                {pastedText.length} chars
              </span>
            )}
          </div>
        </div>
        <textarea
          value={pastedText}
          onChange={(e) => setPastedText(e.target.value)}
          placeholder="Paste or dictate your de-identified clinical notes here...\n\nExample:\nChief Complaint: Pt c/o difficulty managing blood sugar...\nPMH: T2DM, HTN, HLD...\nNutrition Assessment: ...\nCounseling Provided: ...\nPlan: ..."
          className="w-full min-h-[280px] sm:min-h-[320px] p-5 text-sm text-slate-800 dark:text-slate-200 bg-transparent placeholder-slate-300 dark:placeholder-darkSurface-muted/40 focus:outline-none resize-y font-mono leading-relaxed"
        />
      </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mt-8 p-4 bg-rose-50 border border-rose-100 text-rose-700 rounded-xl text-sm font-medium flex items-center shadow-sm animate-in slide-in-from-top-2">
            <AlertTriangle size={18} className="mr-3 shrink-0" />
            {error}
        </div>
      )}

      {/* Dictation Error Message */}
      {dictationError && (
        <div className="mt-4 p-4 bg-amber-50 border border-amber-100 text-amber-700 rounded-xl text-sm font-medium flex items-center shadow-sm animate-in slide-in-from-top-2">
            <AlertTriangle size={18} className="mr-3 shrink-0" />
            {dictationError}
        </div>
      )}

      {/* Selected Files List */}
      {hasContent && (
        <div className="mt-10 bg-white dark:bg-darkSurface-card rounded-[2rem] shadow-xl shadow-slate-200/30 dark:shadow-none border border-slate-100 dark:border-darkSurface-border overflow-hidden transition-all duration-500 animate-in slide-in-from-bottom-8">
          <div className="px-6 py-5 border-b border-slate-100 dark:border-darkSurface-border bg-slate-50/50 dark:bg-darkSurface/50 flex justify-between items-center">
             <h4 className="font-bold font-heading text-slate-800 dark:text-slate-200 text-base sm:text-lg flex items-center">
                Ready to Process 
                <span className="ml-2 sm:ml-3 bg-slate-200 dark:bg-darkSurface-elevated text-slate-700 dark:text-darkSurface-muted py-0.5 px-2 sm:px-2.5 rounded-full text-xs font-bold leading-tight">{files.length}</span>
             </h4>
             <button 
                onClick={() => { setFiles([]); setIsPhiConfirmed(false); }}
                className="text-sm text-slate-400 dark:text-darkSurface-muted/60 hover:text-slate-700 dark:hover:text-slate-300 font-semibold transition-colors uppercase tracking-wider text-xs"
             >
                 Clear All
             </button>
          </div>

          <ul className="divide-y divide-slate-50 dark:divide-darkSurface-border/50">
            {files.map((file, index) => (
              <li key={index} className="flex items-center justify-between p-4 sm:px-6 hover:bg-slate-50/80 dark:hover:bg-darkSurface-elevated/30 transition-colors group">
                <div className="flex items-center min-w-0">
                  <div className="mr-5 p-2 bg-white dark:bg-darkSurface-elevated shadow-sm border border-slate-100 dark:border-darkSurface-border rounded-xl shrink-0 group-hover:scale-110 transition-transform duration-300 flex items-center justify-center min-w-12 min-h-12">
                    {getFileIcon(file)}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate mb-0.5 pr-4">{file.name}</p>
                    <p className="text-xs text-slate-400 dark:text-darkSurface-muted/60 font-medium">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                </div>
                <button 
                  onClick={() => removeFile(index)}
                  className="p-2.5 text-slate-300 dark:text-darkSurface-muted/40 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all duration-200 shrink-0 opacity-50 group-hover:opacity-100"
                >
                  <X size={18} strokeWidth={2.5} />
                </button>
              </li>
            ))}
          </ul>
          
          <div className="p-5 sm:p-8 bg-slate-50 dark:bg-darkSurface/80 flex flex-col justify-center items-center border-t border-slate-100 dark:border-darkSurface-border">
             
             {/* PHI Confirmation Box */}
             {!isUploading && (
               <label className="flex items-start max-w-xl mx-auto mb-6 p-3 sm:p-4 rounded-xl cursor-pointer bg-amber-50 dark:bg-amber-900/10 border border-amber-200/50 dark:border-amber-700/30 hover:bg-amber-100/50 dark:hover:bg-amber-900/20 transition-colors group">
                 <div className="relative flex items-center justify-center mt-0.5">
                   <input 
                     type="checkbox" 
                     className="peer appearance-none w-5 h-5 border-2 border-amber-300 dark:border-amber-600 rounded bg-white dark:bg-darkSurface-elevated checked:bg-amber-500 dark:checked:bg-amber-600 checked:border-amber-500 transition-all cursor-pointer"
                     checked={isPhiConfirmed}
                     onChange={(e) => setIsPhiConfirmed(e.target.checked)}
                   />
                   <Check size={14} strokeWidth={3} className="text-white absolute opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity" />
                 </div>
                 <div className="ml-3">
                   <span className={`text-xs sm:text-sm font-semibold transition-colors ${isPhiConfirmed ? 'text-amber-800 dark:text-amber-400' : 'text-slate-700 dark:text-darkSurface-muted group-hover:text-slate-900'}`}>
                     I confirm these documents contain absolutely zero Protected Health Information (PHI).
                   </span>
                 </div>
               </label>
             )}

             {isUploading ? (
                 <div className="w-full max-w-2xl mx-auto flex flex-col items-center justify-center animate-in fade-in duration-500 py-6">
                     <RobotLoader />
                     
                     <div className="mt-8 flex items-center bg-white dark:bg-surface-800/80 px-6 py-3 rounded-2xl shadow-sm border border-brand-100 dark:border-brand-900/40">
                         <img src={emilyImg} className="w-8 h-8 mr-3 rounded-full animate-pulse object-cover" alt="Processing Profile" />
                         <p className="text-brand-700 dark:text-brand-400 font-bold font-heading text-base sm:text-lg tracking-wide text-center">
                             {progressMsg}
                         </p>
                     </div>
                 </div>
             ) : (
                <button
                    onClick={handleProcess}
                    disabled={!isPhiConfirmed || !hasContent}
                    className={`w-full sm:w-auto px-6 sm:px-12 py-3.5 sm:py-4 font-bold font-heading tracking-wide rounded-xl shadow-[0_8px_20px_rgba(236,72,153,0.25)] transition-all duration-300 ${
                      isPhiConfirmed 
                        ? 'bg-gradient-to-r from-brand-500 to-accent-500 hover:from-brand-400 hover:to-accent-400 text-white hover:shadow-[0_8px_25px_rgba(236,72,153,0.35)] hover:-translate-y-0.5 active:scale-[0.98]'
                        : 'bg-surface-100 dark:bg-darkSurface-card text-slate-400 dark:text-darkSurface-muted/50 cursor-not-allowed shadow-none border border-slate-300 dark:border-darkSurface-border'
                    }`}
                >
                    Start AI Extraction
                </button>
             )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
