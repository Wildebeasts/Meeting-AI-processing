import React from 'react';
import { 
  Download, 
  FlaskConical, 
  HelpCircle, 
  Key, 
  RefreshCw, 
  CheckCircle2, 
  SlidersHorizontal,
  ChevronDown
} from 'lucide-react';

export function Header({
  meeting,
  selectedMeetingId,
  onSelectMeeting,
  allMeetings,
  isProcessing,
  onReprocess,
  onOpenTestBench,
  onOpenQuestions,
  onOpenApiKeyModal,
  onOpenExportModal,
  hasApiKey
}) {
  return (
    <header className="bg-white border-b border-slate-200 px-4 py-2.5 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 sticky top-0 z-30 select-none">
      {/* Left: Enterprise Org Identity + Breadcrumb + Version */}
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-7 h-7 rounded bg-slate-900 text-white flex items-center justify-center font-mono text-[11px] font-semibold tracking-wider shrink-0 shadow-xs">
          AX
        </div>

        <div className="flex items-center gap-2 min-w-0">
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="text-xs font-semibold tracking-tight text-slate-900">
              Axiom Intelligence
            </span>
            <span className="px-1.5 py-0.2 rounded bg-slate-100 font-mono text-[10px] text-slate-600 font-medium border border-slate-200">
              v2.4-enterprise
            </span>
          </div>

          <span className="text-slate-300 shrink-0">/</span>

          {/* Meeting selector dropdown styled as breadcrumb context */}
          <div className="relative flex items-center min-w-0">
            <select
              value={selectedMeetingId}
              onChange={(e) => onSelectMeeting(e.target.value)}
              className="text-xs font-medium bg-transparent hover:bg-slate-50 text-slate-700 py-1 pl-1.5 pr-6 rounded border border-transparent hover:border-slate-200 focus:outline-none focus:border-slate-300 transition-colors cursor-pointer truncate max-w-[280px] lg:max-w-[420px] appearance-none"
            >
              {allMeetings.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.testCaseName || m.title}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-1 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Right Controls: Model indicator + Actions */}
      <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-end">
        {/* Model Indicator Badge */}
        <div 
          onClick={onOpenApiKeyModal}
          className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded border border-slate-200 bg-slate-50 text-slate-700 text-[11px] cursor-pointer hover:bg-slate-100 transition-colors"
          title="Click để cấu hình Gemini API Key"
        >
          <span className={`w-1.5 h-1.5 rounded-full ${hasApiKey ? 'bg-emerald-500' : 'bg-slate-400'}`} />
          <span className="text-slate-500 font-normal">Model:</span>
          <span className="font-semibold text-slate-800">Gemini Pro</span>
          <span className="text-slate-400 text-[10px]">(Enterprise Audited)</span>
        </div>

        {/* 5 Test Cases Button */}
        <button
          onClick={onOpenTestBench}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded transition-colors active:scale-[0.99]"
          title="Xem bộ 5 tình huống kiểm thử Mission 2"
        >
          <FlaskConical className="w-3.5 h-3.5 text-slate-500" />
          <span>Bộ Kiểm Thử (5 TC)</span>
        </button>

        {/* 3 Questions Button */}
        <button
          onClick={onOpenQuestions}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded transition-colors active:scale-[0.99]"
          title="Xem 3 câu hỏi bắt buộc Mission 2"
        >
          <HelpCircle className="w-3.5 h-3.5 text-slate-500" />
          <span>3 Câu Hỏi Bắt Buộc</span>
        </button>

        {/* API Key Modal Button */}
        <button
          onClick={onOpenApiKeyModal}
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium border rounded transition-colors ${
            hasApiKey
              ? 'bg-slate-50 text-slate-800 border-slate-300'
              : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
          }`}
          title="Cấu hình API Key"
        >
          <Key className="w-3.5 h-3.5 text-slate-500" />
          <span>{hasApiKey ? 'Key Configured' : 'API Key (Opt)'}</span>
        </button>

        {/* Reprocess AI Button (Corporate Primary: Slate-900 / Black) */}
        <button
          onClick={onReprocess}
          disabled={isProcessing}
          className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium text-white bg-slate-900 hover:bg-slate-800 disabled:opacity-60 rounded transition-all active:scale-[0.99]"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-slate-300 ${isProcessing ? 'animate-spin' : ''}`} />
          <span>{isProcessing ? 'Đang trích xuất...' : 'Reprocess Intelligence'}</span>
        </button>

        {/* Export Button */}
        <button
          onClick={onOpenExportModal}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded transition-colors"
        >
          <Download className="w-3.5 h-3.5 text-slate-500" />
          <span>Export</span>
        </button>
      </div>
    </header>
  );
}
export default Header;
