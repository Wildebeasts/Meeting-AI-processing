import React from 'react';
import { 
  Download, 
  Key, 
  RefreshCw, 
  CheckCircle2, 
  ChevronDown,
  Sun,
  Moon
} from 'lucide-react';

export function Header({
  meeting,
  selectedMeetingId,
  onSelectMeeting,
  allMeetings,
  isProcessing,
  onReprocess,
  onOpenApiKeyModal,
  onOpenExportModal,
  hasApiKey,
  theme = 'light',
  onToggleTheme
}) {
  return (
    <header className="bg-white dark:bg-[#0f172a] border-b border-slate-200 dark:border-slate-800 px-4 py-2.5 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 sticky top-0 z-30 select-none transition-colors">
      {/* Left: Enterprise Org Identity + Breadcrumb + Version */}
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-7 h-7 rounded bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 flex items-center justify-center font-mono text-[11px] font-semibold tracking-wider shrink-0 shadow-xs">
          AX
        </div>

        <div className="flex items-center gap-2 min-w-0">
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="text-xs font-semibold tracking-tight text-slate-900 dark:text-slate-100">
              Axiom Intelligence
            </span>
            <span className="px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 font-mono text-[10px] text-slate-600 dark:text-slate-400 font-medium border border-slate-200 dark:border-slate-700">
              v2.4-enterprise
            </span>
          </div>

          <span className="text-slate-300 dark:text-slate-600 shrink-0">/</span>

          {/* Meeting selector dropdown styled as breadcrumb context */}
          <div className="relative flex items-center min-w-0">
            <select
              value={selectedMeetingId}
              onChange={(e) => onSelectMeeting(e.target.value)}
              className="text-xs font-medium bg-transparent hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 py-1 pl-1.5 pr-6 rounded border border-transparent hover:border-slate-200 dark:hover:border-slate-700 focus:outline-none focus:border-slate-300 dark:focus:border-slate-600 transition-colors cursor-pointer truncate max-w-[280px] lg:max-w-[420px] appearance-none"
            >
              {allMeetings.map((m) => (
                <option key={m.id} value={m.id} className="dark:bg-[#0f172a] dark:text-slate-200">
                  {m.testCaseName || m.title}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 absolute right-1 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Right Controls: Model indicator + Actions + Theme Toggle */}
      <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-end">
        {/* Model Indicator Badge */}
        <div 
          onClick={onOpenApiKeyModal}
          className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 text-[11px] cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title="Click to configure Gemini API Key"
        >
          <span className={`w-1.5 h-1.5 rounded-full ${hasApiKey ? 'bg-emerald-500' : 'bg-slate-400'}`} />
          <span className="text-slate-500 dark:text-slate-400 font-normal">Model:</span>
          <span className="font-semibold text-slate-800 dark:text-slate-200">Gemini 3.1 Flash Lite</span>
          <span className="text-slate-400 dark:text-slate-500 text-[10px]">(Live API)</span>
        </div>

        {/* API Key Modal Button */}
        <button
          onClick={onOpenApiKeyModal}
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium border rounded transition-colors ${
            hasApiKey
              ? 'bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-slate-300 dark:border-slate-700'
              : 'bg-white dark:bg-slate-800/40 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
          }`}
          title="Configure API Key"
        >
          <Key className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
          <span>{hasApiKey ? 'Key Configured' : 'API Key (Opt)'}</span>
        </button>

        {/* Reprocess AI Button */}
        <button
          onClick={onReprocess}
          disabled={isProcessing}
          className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium text-white bg-slate-900 dark:bg-slate-100 dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-white disabled:opacity-60 rounded transition-all active:scale-[0.99] shadow-xs"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isProcessing ? 'animate-spin' : ''}`} />
          <span>{isProcessing ? 'Extracting...' : 'Reprocess Intelligence'}</span>
        </button>

        {/* Export Button */}
        <button
          onClick={onOpenExportModal}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded transition-colors"
        >
          <Download className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
          <span>Export</span>
        </button>

        {/* Dark / Light Mode Toggle */}
        <button
          onClick={onToggleTheme}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded transition-colors shadow-2xs"
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {theme === 'dark' ? (
            <>
              <Sun className="w-3.5 h-3.5 text-amber-400" />
              <span>Light</span>
            </>
          ) : (
            <>
              <Moon className="w-3.5 h-3.5 text-slate-600" />
              <span>Dark</span>
            </>
          )}
        </button>
      </div>
    </header>
  );
}

export default Header;
