import React, { useState } from 'react';
import { X, Key, Shield, CheckCircle2, AlertTriangle, ExternalLink } from 'lucide-react';

export function ApiKeyModal({ 
  isOpen, 
  onClose, 
  apiKey, 
  onSaveApiKey, 
  requiredNotice = false 
}) {
  const [inputVal, setInputVal] = useState(apiKey || '');
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    if (!inputVal.trim()) return;
    onSaveApiKey(inputVal.trim());
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 800);
  };

  const handleClear = () => {
    setInputVal('');
    onSaveApiKey('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs select-none">
      <div className="bg-white dark:bg-[#0f172a] rounded-lg shadow-xl border border-slate-200 dark:border-slate-800 w-full max-w-md overflow-hidden animate-in fade-in duration-150 transition-colors">
        <div className="px-5 py-3.5 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 flex items-center justify-center">
              <Key className="w-3.5 h-3.5" />
            </div>
            <h2 className="text-xs font-semibold text-slate-900 dark:text-slate-100 uppercase tracking-wide">
              Configuring Google Gemini API Key
            </h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-4 select-text">
          {requiredNotice && (
            <div className="bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 rounded p-3 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold">Need to configure API Key:</span>
                <p className="text-[11px] text-amber-800 dark:text-amber-300 mt-0.5 leading-relaxed">
                  The system processes entirely through real AI (no local logic used). Please enter your Gemini API Key to start analysis.
                </p>
              </div>
            </div>
          )}

          <div className="bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded p-3 text-xs text-slate-700 dark:text-slate-300 space-y-1">
            <div className="font-semibold flex items-center justify-between text-slate-900 dark:text-slate-100">
              <span className="flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-slate-600 dark:text-slate-400" />
                <span>Security & Direct:</span>
              </span>
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noreferrer"
                className="text-[11px] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 underline flex items-center gap-0.5"
              >
                <span>Get free key</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
              Key is called directly from your browser to Google's API and is only stored in your personal <code>LocalStorage</code>.
            </p>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              Google Gemini API Key:
            </label>
            <input
              type="password"
              placeholder="AIzaSy..."
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              className="w-full text-xs px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:border-slate-400 dark:focus:border-slate-500 font-mono text-slate-800 dark:text-slate-100"
            />
          </div>

          {savedSuccess && (
            <div className="flex items-center gap-1.5 text-xs text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 p-2 rounded border border-emerald-200 dark:border-emerald-800">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>API key saved successfully. Ready to call AI.</span>
            </div>
          )}
        </div>

        <div className="px-5 py-2.5 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 flex items-center justify-between">
          <button
            onClick={handleClear}
            className="text-xs text-slate-500 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 font-medium"
          >
            Remove Key
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3 py-1 text-xs text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 rounded transition-colors font-medium"
            >
              Close
            </button>
            <button
              onClick={handleSave}
              disabled={!inputVal.trim()}
              className="px-3.5 py-1 text-xs font-semibold text-white bg-slate-900 dark:bg-slate-100 dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-white disabled:opacity-50 rounded transition-colors"
            >
              Save & Activate AI
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ApiKeyModal;
