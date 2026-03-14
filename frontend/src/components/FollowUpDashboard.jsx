import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Upload, X, File, Image as ImageIcon, FileText, AlertTriangle, ShieldAlert, Check, HeartPulse, ArrowRight, History, FilePlus2, ClipboardPaste } from 'lucide-react';
import { uploadFollowUpFiles } from '../services/api';
import RobotLoader from './RobotLoader';
import emilyImg from '../assets/emily.jpg';

const FollowUpDashboard = ({ onUploadSuccess }) => {
  const [previousFiles, setPreviousFiles] = useState([]);
  const [newFiles, setNewFiles] = useState([]);
  const [isDraggingPrevious, setIsDraggingPrevious] = useState(false);
  const [isDraggingNew, setIsDraggingNew] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const [progressMsg, setProgressMsg] = useState('');
  const [isPhiConfirmed, setIsPhiConfirmed] = useState(false);
  const [previousPreviews, setPreviousPreviews] = useState({});
  const [newPreviews, setNewPreviews] = useState({});
  
  const previousInputRef = useRef(null);
  const newInputRef = useRef(null);
  const [previousInputMode, setPreviousInputMode] = useState('upload');
  const [newInputMode, setNewInputMode] = useState('upload');
  const [previousPastedText, setPreviousPastedText] = useState('');
  const [newPastedText, setNewPastedText] = useState('');

  // Generate previews for previous files
  useEffect(() => {
    const urls = {};
    previousFiles.forEach(file => {
      if (file.type.includes('image')) urls[file.name] = URL.createObjectURL(file);
    });
    setPreviousPreviews(urls);
    return () => Object.values(urls).forEach(url => URL.revokeObjectURL(url));
  }, [previousFiles]);

  // Generate previews for new files
  useEffect(() => {
    const urls = {};
    newFiles.forEach(file => {
      if (file.type.includes('image')) urls[file.name] = URL.createObjectURL(file);
    });
    setNewPreviews(urls);
    return () => Object.values(urls).forEach(url => URL.revokeObjectURL(url));
  }, [newFiles]);

  const getFileIcon = (file, previews) => {
    const type = file.type || '';
    const name = file.name.toLowerCase();
    if (type.includes('image') || name.endsWith('heic')) {
      if (previews[file.name]) return <img src={previews[file.name]} alt="preview" className="w-8 h-8 object-cover rounded shadow-sm border border-slate-200 dark:border-darkSurface-border" />;
      return <ImageIcon className="text-brand-500" size={24} />;
    }
    if (type.includes('pdf')) return <File className="text-rose-500" size={24} />;
    return <FileText className="text-blue-500" size={24} />;
  };

  const validateAndAddFiles = (newFileList, setter, existingFiles) => {
    const allowedTypes = ['text/plain', 'application/pdf', 'image/jpeg', 'image/png', 'image/heic', 'image/heif'];
    const validFiles = [];
    let hasError = false;

    Array.from(newFileList).forEach(file => {
      const ext = file.name.split('.').pop().toLowerCase();
      if (allowedTypes.includes(file.type) || ['txt', 'pdf', 'jpg', 'jpeg', 'png', 'heic'].includes(ext)) {
        if (!existingFiles.find(f => f.name === file.name && f.size === file.size)) {
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
    setter(prev => [...prev, ...validFiles]);
  };

  const createDragHandlers = (setDragging) => ({
    onDragEnter: (e) => { e.preventDefault(); e.stopPropagation(); setDragging(true); },
    onDragLeave: (e) => { e.preventDefault(); e.stopPropagation(); setDragging(false); },
    onDragOver: (e) => { e.preventDefault(); e.stopPropagation(); setDragging(true); },
    onDrop: (e) => {
      e.preventDefault(); e.stopPropagation(); setDragging(false);
      return e.dataTransfer.files;
    }
  });

  const hasNewContent = newInputMode === 'upload' ? newFiles.length > 0 : newPastedText.trim().length > 0;

  const handleProcess = async () => {
    if (!hasNewContent || !isPhiConfirmed) return;
    setIsUploading(true);
    setError('');
    setProgressMsg('Extracting content from all notes...');

    try {
      setTimeout(() => setProgressMsg('Analyzing previous visit data...'), 2000);
      setTimeout(() => setProgressMsg('Comparing patient progress...'), 4000);
      setTimeout(() => setProgressMsg('Generating Follow-Up ADIME Draft...'), 6000);
      setTimeout(() => setProgressMsg('Building treatment recommendations...'), 9000);

      // Build previous files (may include pasted text as blob)
      let prevFilesToSend = previousFiles;
      if (previousInputMode === 'paste' && previousPastedText.trim()) {
        const blob = new Blob([previousPastedText], { type: 'text/plain' });
        prevFilesToSend = [new File([blob], 'previous-notes-pasted.txt', { type: 'text/plain' })];
      }

      // Build new files (may include pasted text as blob)
      let newFilesToSend = newFiles;
      if (newInputMode === 'paste') {
        const blob = new Blob([newPastedText], { type: 'text/plain' });
        newFilesToSend = [new File([blob], 'followup-notes-pasted.txt', { type: 'text/plain' })];
      }

      const response = await uploadFollowUpFiles(prevFilesToSend, newFilesToSend);
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

  const totalFiles = previousFiles.length + newFiles.length;

  const renderFileList = (files, previews, removeFile) => (
    <ul className="divide-y divide-slate-50 dark:divide-darkSurface-border/50">
      {files.map((file, index) => (
        <li key={index} className="flex items-center justify-between p-3 sm:px-4 hover:bg-slate-50/80 dark:hover:bg-darkSurface-elevated/30 transition-colors group">
          <div className="flex items-center min-w-0">
            <div className="mr-3 p-1.5 bg-white dark:bg-darkSurface-elevated shadow-sm border border-slate-100 dark:border-darkSurface-border rounded-lg shrink-0 flex items-center justify-center min-w-9 min-h-9">
              {getFileIcon(file, previews)}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate pr-4">{file.name}</p>
              <p className="text-xs text-slate-400 dark:text-darkSurface-muted/60 font-medium">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
            </div>
          </div>
          <button 
            onClick={() => removeFile(index)}
            className="p-2 text-slate-300 dark:text-darkSurface-muted/40 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all duration-200 shrink-0 opacity-50 group-hover:opacity-100"
          >
            <X size={16} strokeWidth={2.5} />
          </button>
        </li>
      ))}
    </ul>
  );

  return (
    <div className="w-full mx-auto p-4 sm:p-6 lg:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header */}
      <div className="mb-10 text-center sm:text-left">
        <h2 className="text-2xl sm:text-3xl font-bold font-heading text-slate-800 dark:text-white mb-3 tracking-tight">Follow-Up Visit</h2>
        
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

      {/* Dual Upload Layout */}
      <div className="space-y-8">

        {/* === PREVIOUS NOTES SECTION === */}
        <div className="relative">
          <div className="flex items-center mb-4">
            <div className="p-2 bg-surface-200 dark:bg-darkSurface-elevated rounded-xl mr-3">
              <History className="text-surface-700 dark:text-darkSurface-muted" size={20} />
            </div>
            <div>
              <h3 className="text-lg font-bold font-heading text-slate-800 dark:text-white">Previous Notes</h3>
              <p className="text-xs text-slate-400 dark:text-darkSurface-muted/60 font-medium">Upload or paste notes from prior visits for treatment continuity</p>
            </div>
            <span className="ml-auto text-xs font-semibold text-slate-400 dark:text-darkSurface-muted/50 bg-slate-100 dark:bg-darkSurface-elevated px-2.5 py-1 rounded-full uppercase tracking-wider">Optional</span>
          </div>

          {/* Previous Notes Input Mode Toggle */}
          <div className="flex items-center mb-3">
            <div className="bg-white dark:bg-darkSurface-card rounded-lg p-0.5 shadow-sm border border-slate-200/60 dark:border-darkSurface-border/60 flex">
              <button
                onClick={() => setPreviousInputMode('upload')}
                className={`flex items-center px-3 py-1.5 rounded-md text-xs font-semibold transition-all duration-200 ${previousInputMode === 'upload' ? 'bg-slate-700 dark:bg-darkSurface-elevated text-white shadow-sm' : 'text-slate-400 dark:text-darkSurface-muted hover:text-slate-700 dark:hover:text-white'}`}
              >
                <Upload size={13} className="mr-1" /> Upload
              </button>
              <button
                onClick={() => setPreviousInputMode('paste')}
                className={`flex items-center px-3 py-1.5 rounded-md text-xs font-semibold transition-all duration-200 ${previousInputMode === 'paste' ? 'bg-slate-700 dark:bg-darkSurface-elevated text-white shadow-sm' : 'text-slate-400 dark:text-darkSurface-muted hover:text-slate-700 dark:hover:text-white'}`}
              >
                <ClipboardPaste size={13} className="mr-1" /> Paste
              </button>
            </div>
          </div>

          {previousInputMode === 'upload' ? (
          <>
          <div 
            className={`relative border-2 border-dashed rounded-2xl p-6 sm:p-8 text-center transition-all duration-300 ease-in-out bg-surface-50/80 dark:bg-darkSurface-card/50 backdrop-blur-sm ${
              isDraggingPrevious 
                ? 'border-brand-500 bg-brand-50/80 dark:bg-brand-900/20 shadow-[0_0_40px_rgba(236,72,153,0.15)] scale-[1.01]' 
                : 'border-surface-300 dark:border-darkSurface-border hover:border-surface-400 dark:hover:border-brand-700 hover:bg-white dark:hover:bg-darkSurface-elevated'
            }`}
            onDragEnter={(e) => { e.preventDefault(); e.stopPropagation(); setIsDraggingPrevious(true); }}
            onDragLeave={(e) => { e.preventDefault(); e.stopPropagation(); setIsDraggingPrevious(false); }}
            onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); setIsDraggingPrevious(true); }}
            onDrop={(e) => {
              e.preventDefault(); e.stopPropagation(); setIsDraggingPrevious(false);
              if (e.dataTransfer.files?.length > 0) validateAndAddFiles(e.dataTransfer.files, setPreviousFiles, previousFiles);
            }}
          >
            <p className="text-slate-500 dark:text-darkSurface-muted font-medium mb-4 text-sm">Drag & drop previous visit notes or</p>
            <input type="file" ref={previousInputRef} onChange={(e) => { if (e.target.files?.length > 0) validateAndAddFiles(e.target.files, setPreviousFiles, previousFiles); }} className="hidden" multiple accept=".txt,.pdf,.jpg,.jpeg,.png,.heic" />
            <button 
              onClick={() => previousInputRef.current?.click()}
              className="px-6 py-2.5 bg-surface-200 dark:bg-darkSurface-elevated text-slate-700 dark:text-darkSurface-muted font-semibold rounded-xl hover:bg-surface-300 dark:hover:bg-darkSurface-card transition-all duration-200 text-sm border border-surface-300 dark:border-darkSurface-border"
            >
              Browse Previous Notes
            </button>
          </div>

          {previousFiles.length > 0 && (
            <div className="mt-3 bg-white dark:bg-darkSurface-card rounded-xl border border-slate-100 dark:border-darkSurface-border overflow-hidden">
              <div className="px-4 py-2.5 bg-slate-50/50 dark:bg-darkSurface/50 flex justify-between items-center border-b border-slate-100 dark:border-darkSurface-border">
                <span className="text-sm font-semibold text-slate-600 dark:text-darkSurface-muted flex items-center">
                  Prior Notes <span className="ml-2 bg-slate-200 dark:bg-darkSurface-elevated text-slate-500 dark:text-darkSurface-muted py-0.5 px-2 rounded-full text-xs font-bold">{previousFiles.length}</span>
                </span>
                <button onClick={() => setPreviousFiles([])} className="text-xs text-slate-400 dark:text-darkSurface-muted/60 hover:text-slate-700 dark:hover:text-slate-300 font-semibold uppercase tracking-wider">Clear</button>
              </div>
              {renderFileList(previousFiles, previousPreviews, (i) => setPreviousFiles(f => f.filter((_, idx) => idx !== i)))}
            </div>
          )}
          </>
          ) : (
          /* Previous Notes Paste Zone */
          <div className="relative rounded-xl overflow-hidden bg-white dark:bg-darkSurface-card border border-slate-200 dark:border-darkSurface-border shadow-sm">
            <div className="px-4 py-2.5 border-b border-slate-100 dark:border-darkSurface-border/50 bg-slate-50/50 dark:bg-darkSurface/50 flex items-center">
              <ClipboardPaste size={14} className="text-slate-400 dark:text-darkSurface-muted mr-2" />
              <span className="text-xs font-semibold text-slate-500 dark:text-darkSurface-muted">Paste previous visit notes</span>
              {previousPastedText.length > 0 && (
                <span className="ml-auto text-xs font-medium text-slate-400 dark:text-darkSurface-muted/50">{previousPastedText.length} chars</span>
              )}
            </div>
            <textarea
              value={previousPastedText}
              onChange={(e) => setPreviousPastedText(e.target.value)}
              placeholder="Paste your previous visit notes here..."
              className="w-full min-h-[180px] p-4 text-sm text-slate-800 dark:text-slate-200 bg-transparent placeholder-slate-300 dark:placeholder-darkSurface-muted/40 focus:outline-none resize-y font-mono leading-relaxed"
            />
          </div>
          )}
        </div>

        {/* Arrow Connector */}
        <div className="flex justify-center">
          <div className="flex items-center space-x-3 text-slate-300 dark:text-darkSurface-border">
            <div className="w-8 h-px bg-current" />
            <ArrowRight size={20} className="text-brand-400 dark:text-brand-500" />
            <div className="w-8 h-px bg-current" />
          </div>
        </div>

        {/* === NEW NOTES SECTION === */}
        <div className="relative">
          <div className="flex items-center mb-4">
            <div className="p-2 bg-brand-100 dark:bg-brand-900/30 rounded-xl mr-3">
              <FilePlus2 className="text-brand-600 dark:text-brand-400" size={20} />
            </div>
            <div>
              <h3 className="text-lg font-bold font-heading text-slate-800 dark:text-white">New Follow-Up Notes</h3>
              <p className="text-xs text-slate-400 dark:text-darkSurface-muted/60 font-medium">Upload or paste notes from the current follow-up visit</p>
            </div>
            <span className="ml-auto text-xs font-semibold text-brand-500 dark:text-brand-400 bg-brand-50 dark:bg-brand-900/20 px-2.5 py-1 rounded-full uppercase tracking-wider">Required</span>
          </div>

          {/* New Notes Input Mode Toggle */}
          <div className="flex items-center mb-3">
            <div className="bg-white dark:bg-darkSurface-card rounded-lg p-0.5 shadow-sm border border-slate-200/60 dark:border-darkSurface-border/60 flex">
              <button
                onClick={() => setNewInputMode('upload')}
                className={`flex items-center px-3 py-1.5 rounded-md text-xs font-semibold transition-all duration-200 ${newInputMode === 'upload' ? 'bg-slate-700 dark:bg-darkSurface-elevated text-white shadow-sm' : 'text-slate-400 dark:text-darkSurface-muted hover:text-slate-700 dark:hover:text-white'}`}
              >
                <Upload size={13} className="mr-1" /> Upload
              </button>
              <button
                onClick={() => setNewInputMode('paste')}
                className={`flex items-center px-3 py-1.5 rounded-md text-xs font-semibold transition-all duration-200 ${newInputMode === 'paste' ? 'bg-slate-700 dark:bg-darkSurface-elevated text-white shadow-sm' : 'text-slate-400 dark:text-darkSurface-muted hover:text-slate-700 dark:hover:text-white'}`}
              >
                <ClipboardPaste size={13} className="mr-1" /> Paste
              </button>
            </div>
          </div>

          {newInputMode === 'upload' ? (
          <>
          <div 
            className={`relative border-2 border-dashed rounded-2xl p-6 sm:p-8 text-center transition-all duration-300 ease-in-out bg-surface-50/80 dark:bg-darkSurface-card/50 backdrop-blur-sm ${
              isDraggingNew 
                ? 'border-brand-500 bg-brand-50/80 dark:bg-brand-900/20 shadow-[0_0_40px_rgba(236,72,153,0.15)] scale-[1.01]' 
                : 'border-brand-200 dark:border-darkSurface-border hover:border-brand-300 dark:hover:border-brand-700 hover:bg-white dark:hover:bg-darkSurface-elevated'
            }`}
            onDragEnter={(e) => { e.preventDefault(); e.stopPropagation(); setIsDraggingNew(true); }}
            onDragLeave={(e) => { e.preventDefault(); e.stopPropagation(); setIsDraggingNew(false); }}
            onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); setIsDraggingNew(true); }}
            onDrop={(e) => {
              e.preventDefault(); e.stopPropagation(); setIsDraggingNew(false);
              if (e.dataTransfer.files?.length > 0) validateAndAddFiles(e.dataTransfer.files, setNewFiles, newFiles);
            }}
          >
            <div className="flex justify-center mb-4">
              <div className={`p-2 rounded-full transition-all duration-500 ${isDraggingNew ? 'bg-brand-500 shadow-lg shadow-brand-500/30 scale-110' : 'bg-surface-100 dark:bg-darkSurface-elevated shadow-sm border border-slate-200 dark:border-darkSurface-border'}`}>
                <img src={emilyImg} alt="Dietitian Profile" className={`w-10 h-10 rounded-full object-cover transition-all ${isDraggingNew ? 'ring-4 ring-white/50' : ''}`} />
              </div>
            </div>
            <p className="text-slate-500 dark:text-darkSurface-muted font-medium mb-4 text-sm">Drag & drop new follow-up notes or</p>
            <input type="file" ref={newInputRef} onChange={(e) => { if (e.target.files?.length > 0) validateAndAddFiles(e.target.files, setNewFiles, newFiles); }} className="hidden" multiple accept=".txt,.pdf,.jpg,.jpeg,.png,.heic" />
            <button 
              onClick={() => newInputRef.current?.click()}
              className="px-6 py-2.5 bg-slate-800 dark:bg-darkSurface-elevated text-white font-semibold rounded-xl hover:bg-slate-700 dark:hover:bg-darkSurface-card transition-all duration-200 text-sm"
            >
              Browse Follow-Up Notes
            </button>
          </div>

          {newFiles.length > 0 && (
            <div className="mt-3 bg-white dark:bg-darkSurface-card rounded-xl border border-slate-100 dark:border-darkSurface-border overflow-hidden">
              <div className="px-4 py-2.5 bg-slate-50/50 dark:bg-darkSurface/50 flex justify-between items-center border-b border-slate-100 dark:border-darkSurface-border">
                <span className="text-sm font-semibold text-slate-600 dark:text-darkSurface-muted flex items-center">
                  New Notes <span className="ml-2 bg-brand-100 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 py-0.5 px-2 rounded-full text-xs font-bold">{newFiles.length}</span>
                </span>
                <button onClick={() => setNewFiles([])} className="text-xs text-slate-400 dark:text-darkSurface-muted/60 hover:text-slate-700 dark:hover:text-slate-300 font-semibold uppercase tracking-wider">Clear</button>
              </div>
              {renderFileList(newFiles, newPreviews, (i) => setNewFiles(f => f.filter((_, idx) => idx !== i)))}
            </div>
          )}
          </>
          ) : (
          /* New Notes Paste Zone */
          <div className="relative rounded-xl overflow-hidden bg-white dark:bg-darkSurface-card border border-slate-200 dark:border-darkSurface-border shadow-sm">
            <div className="px-4 py-2.5 border-b border-slate-100 dark:border-darkSurface-border/50 bg-slate-50/50 dark:bg-darkSurface/50 flex items-center">
              <ClipboardPaste size={14} className="text-brand-500 dark:text-brand-400 mr-2" />
              <span className="text-xs font-semibold text-slate-500 dark:text-darkSurface-muted">Paste new follow-up notes</span>
              {newPastedText.length > 0 && (
                <span className="ml-auto text-xs font-medium text-slate-400 dark:text-darkSurface-muted/50">{newPastedText.length} chars</span>
              )}
            </div>
            <textarea
              value={newPastedText}
              onChange={(e) => setNewPastedText(e.target.value)}
              placeholder="Paste your new follow-up visit notes here...\n\nExample:\nChief Complaint: Pt returns for f/u...\nWeight History: ...\nNutrition Assessment: ...\nCounseling Provided: ...\nPlan: ..."
              className="w-full min-h-[220px] p-4 text-sm text-slate-800 dark:text-slate-200 bg-transparent placeholder-slate-300 dark:placeholder-darkSurface-muted/40 focus:outline-none resize-y font-mono leading-relaxed"
            />
          </div>
          )}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mt-8 p-4 bg-rose-50 border border-rose-100 text-rose-700 rounded-xl text-sm font-medium flex items-center shadow-sm animate-in slide-in-from-top-2">
            <AlertTriangle size={18} className="mr-3 shrink-0" />
            {error}
        </div>
      )}

      {/* Action Area */}
      {hasNewContent && (
        <div className="mt-10 bg-white dark:bg-darkSurface-card rounded-2xl border border-slate-100 dark:border-darkSurface-border p-5 sm:p-8 flex flex-col items-center shadow-sm animate-in slide-in-from-bottom-4">
          
          {/* Summary */}
          <div className="text-center mb-6">
            <p className="text-sm text-slate-500 dark:text-darkSurface-muted font-medium">
              {previousFiles.length > 0 
                ? `${previousFiles.length} previous note${previousFiles.length > 1 ? 's' : ''} + ${newFiles.length} new note${newFiles.length > 1 ? 's' : ''} ready`
                : `${newFiles.length} new note${newFiles.length > 1 ? 's' : ''} ready (no previous notes for comparison)`
              }
            </p>
          </div>

          {/* PHI Confirmation */}
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
                  I confirm ALL uploaded documents (previous and new) contain absolutely zero Protected Health Information (PHI).
                </span>
              </div>
            </label>
          )}

          {isUploading ? (
            <div className="w-full max-w-2xl mx-auto flex flex-col items-center justify-center animate-in fade-in duration-500 py-6">
              <RobotLoader />
              <div className="mt-8 flex items-center bg-white dark:bg-darkSurface-card/80 px-6 py-3 rounded-2xl shadow-sm border border-brand-100 dark:border-brand-900/40">
                <img src={emilyImg} className="w-8 h-8 mr-3 rounded-full animate-pulse object-cover" alt="Processing Profile" />
                <p className="text-brand-700 dark:text-brand-400 font-bold font-heading text-base sm:text-lg tracking-wide text-center">
                  {progressMsg}
                </p>
              </div>
            </div>
          ) : (
            <button
              onClick={handleProcess}
              disabled={!isPhiConfirmed}
              className={`w-full sm:w-auto px-6 sm:px-12 py-3.5 sm:py-4 font-bold font-heading tracking-wide rounded-xl shadow-[0_8px_20px_rgba(236,72,153,0.25)] transition-all duration-300 ${
                isPhiConfirmed 
                  ? 'bg-gradient-to-r from-brand-500 to-accent-500 hover:from-brand-400 hover:to-accent-400 text-white hover:shadow-[0_8px_25px_rgba(236,72,153,0.35)] hover:-translate-y-0.5 active:scale-[0.98]'
                  : 'bg-surface-100 dark:bg-darkSurface-card text-slate-400 dark:text-darkSurface-muted/50 cursor-not-allowed shadow-none border border-slate-300 dark:border-darkSurface-border'
              }`}
            >
              Generate Follow-Up Draft
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default FollowUpDashboard;
