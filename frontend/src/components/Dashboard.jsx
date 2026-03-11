import React, { useState, useCallback, useRef } from 'react';
import { Upload, X, File, Image as ImageIcon, FileText, AlertTriangle, ShieldAlert } from 'lucide-react';
import { uploadFiles } from '../services/api';

const Dashboard = ({ onUploadSuccess }) => {
  const [files, setFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const [progressMsg, setProgressMsg] = useState('');
  
  const fileInputRef = useRef(null);

  const getFileIcon = (file) => {
    const type = file.type || '';
    const name = file.name.toLowerCase();
    if (type.includes('image') || name.endsWith('heic')) return <ImageIcon className="text-emerald-500" size={24} />;
    if (type.includes('pdf')) return <File className="text-rose-500" size={24} />;
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

  const handleProcess = async () => {
    if (files.length === 0) return;
    setIsUploading(true);
    setError('');
    setProgressMsg('Extracting content and checking for identifiers...');

    try {
      setTimeout(() => setProgressMsg('Generating Draft ADIME...'), 2000);
      setTimeout(() => setProgressMsg('Validating clinical completeness...'), 5000);

      const result = await uploadFiles(files);
      onUploadSuccess(result);
    } catch (err) {
      setError(err.response?.data?.error || 'An error occurred during processing.');
      setIsUploading(false);
      setProgressMsg('');
    }
  };

  return (
    <div className="w-full mx-auto p-4 sm:p-6 lg:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header & Warning section */}
      <div className="mb-10 text-center sm:text-left">
        <h2 className="text-3xl font-bold font-heading text-slate-800 mb-3 tracking-tight">Upload Notes</h2>
        
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/60 p-5 rounded-2xl shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-amber-400 to-orange-400" />
          <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left">
            <div className="bg-amber-100/50 p-2.5 rounded-xl mb-3 sm:mb-0 sm:mr-4 shrink-0 transition-transform group-hover:scale-110 duration-300">
                <ShieldAlert className="text-amber-600" size={24} />
            </div>
            <div>
              <h3 className="text-amber-900 font-semibold font-heading text-lg">Strict Privacy Notice</h3>
              <p className="text-amber-700/90 text-sm mt-1 mb-0 leading-relaxed max-w-2xl">
                Upload <strong className="text-amber-900 bg-amber-200/30 px-1 rounded">de-identified notes only</strong>. Ensure there are absolutely no names, DOBs, addresses, SSNs, MRNs, insurance IDs, or contact info included in your documents.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Upload Zone */}
      <div 
        className={`relative border-2 border-dashed rounded-[2rem] p-12 text-center transition-all duration-300 ease-in-out bg-white/70 backdrop-blur-sm ${
          isDragging 
            ? 'border-emerald-500 bg-emerald-50/80 shadow-[0_0_40px_rgba(16,185,129,0.15)] scale-[1.02] z-10' 
            : 'border-slate-200 hover:border-emerald-300 hover:bg-white hover:shadow-xl hover:shadow-slate-200/40'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <div className="flex justify-center mb-6">
          <div className={`p-5 rounded-2xl transition-all duration-500 ${isDragging ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30 rotate-180' : 'bg-slate-50 text-emerald-600 shadow-sm'}`}>
            <Upload size={36} strokeWidth={2} />
          </div>
        </div>
        <h3 className="text-xl font-bold font-heading text-slate-800 mb-2">Drag & Drop Files</h3>
        <p className="text-slate-500 font-medium mb-8 text-sm">Or select files from your computer (.txt, .pdf, .jpg, .png., .heic)</p>
        
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
          className="px-8 py-3.5 bg-slate-800 text-white font-semibold tracking-wide rounded-xl hover:bg-slate-700 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 focus:ring-4 focus:ring-slate-200 active:scale-95"
        >
          Browse Files
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mt-8 p-4 bg-rose-50 border border-rose-100 text-rose-700 rounded-xl text-sm font-medium flex items-center shadow-sm animate-in slide-in-from-top-2">
            <AlertTriangle size={18} className="mr-3 shrink-0" />
            {error}
        </div>
      )}

      {/* Selected Files List */}
      {files.length > 0 && (
        <div className="mt-10 bg-white rounded-[2rem] shadow-xl shadow-slate-200/30 border border-slate-100 overflow-hidden transition-all duration-500 animate-in slide-in-from-bottom-8">
          <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
             <h4 className="font-bold font-heading text-slate-800 text-lg flex items-center">
                Ready to Process 
                <span className="ml-3 bg-slate-200 text-slate-700 py-0.5 px-2.5 rounded-full text-xs font-bold leading-tight">{files.length}</span>
             </h4>
             <button 
                onClick={() => setFiles([])}
                className="text-sm text-slate-400 hover:text-slate-700 font-semibold transition-colors uppercase tracking-wider text-xs"
             >
                 Clear All
             </button>
          </div>

          <ul className="divide-y divide-slate-50">
            {files.map((file, index) => (
              <li key={index} className="flex items-center justify-between p-4 sm:px-6 hover:bg-slate-50/80 transition-colors group">
                <div className="flex items-center min-w-0">
                  <div className="mr-5 p-3 bg-white shadow-sm border border-slate-100 rounded-xl shrink-0 group-hover:scale-110 transition-transform duration-300">
                    {getFileIcon(file)}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-800 truncate mb-0.5 pr-4">{file.name}</p>
                    <p className="text-xs text-slate-400 font-medium">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                </div>
                <button 
                  onClick={() => removeFile(index)}
                  className="p-2.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all duration-200 shrink-0 opacity-50 group-hover:opacity-100"
                >
                  <X size={18} strokeWidth={2.5} />
                </button>
              </li>
            ))}
          </ul>
          
          <div className="p-8 bg-slate-50 flex justify-center border-t border-slate-100">
             {isUploading ? (
                 <div className="flex flex-col items-center">
                     <div className="relative w-12 h-12 mb-4">
                        <div className="absolute inset-0 border-4 border-slate-200 rounded-full"></div>
                        <div className="absolute inset-0 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                     </div>
                     <p className="text-emerald-700 font-semibold font-heading tracking-wide animate-pulse">{progressMsg}</p>
                 </div>
             ) : (
                <button
                    onClick={handleProcess}
                    className="w-full sm:w-auto px-12 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-bold font-heading tracking-wide rounded-xl shadow-[0_8px_20px_rgba(16,185,129,0.25)] hover:shadow-[0_8px_25px_rgba(16,185,129,0.35)] transition-all duration-300 hover:-translate-y-0.5 active:scale-[0.98]"
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
