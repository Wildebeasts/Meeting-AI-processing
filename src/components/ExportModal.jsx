import React, { useState } from 'react';
import { X, Copy, Check, Download, FileJson, FileText } from 'lucide-react';

export function ExportModal({ isOpen, onClose, meeting, intelligence }) {
  const [activeTab, setActiveTab] = useState('JSON');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const jsonString = JSON.stringify(intelligence, null, 2);

  const markdownString = `# AI MEETING INTELLIGENCE RECORD
**Meeting:** ${meeting.title}  
**Date:** ${meeting.date} (${meeting.duration})  
**Participants:** ${meeting.participants?.map(p => `${p.name} (${p.role})`).join(', ')}  

---

## 1. KEY DECISIONS
${intelligence.decisions?.map((d, i) => `
### ${i + 1}. ${d.topic}
* **Final decision:** ${d.final_decision}
* **Impact:** ${d.impact || 'Standard'}
* **Consensus:** ${d.consensus_badge || 'Terminal Consensus'}
${d.rejected_alternatives?.length ? `* **Rejected alternatives:**\n` + d.rejected_alternatives.map(a => `  - *${a.option}*: ${a.reason}`).join('\n') : ''}
* **Evidence:** "${d.evidence?.quote}" — *${d.evidence?.speaker} [${d.evidence?.timestamp}]*
`).join('\n') || '*No decisions recorded.*'}

---

## 2. ACTION ITEMS
${intelligence.action_items?.map((a, i) => `
* [${a.status === 'VERIFIED' ? 'x' : ' '}] **${a.task}**
  - **Assignee:** ${a.assignee || 'Unassigned'}
  - **Deadline:** ${a.deadline || 'TBD'}
  - **Jira:** #${a.jira_key || 'N/A'}
  - **Evidence:** "${a.evidence?.quote}" [${a.evidence?.timestamp}]
`).join('\n') || '*No action items recorded.*'}

---

## 3. OPEN ISSUES & BLOCKERS
${intelligence.open_issues?.map((o, i) => `
* **${o.topic}** (${o.status})
  - **Reason unresolved:** ${o.unresolved_reason}
  - **Next steps:** ${o.next_steps}
  - **Evidence:** "${o.evidence?.quote}" [${o.evidence?.timestamp}]
`).join('\n') || '*No open issues.*'}
`;

  const handleCopy = () => {
    const text = activeTab === 'JSON' ? jsonString : markdownString;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const text = activeTab === 'JSON' ? jsonString : markdownString;
    const filename = activeTab === 'JSON' ? `meeting_intelligence_${meeting.id}.json` : `meeting_record_${meeting.id}.md`;
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs select-none">
      <div className="bg-white dark:bg-[#0f172a] rounded-lg shadow-xl border border-slate-200 dark:border-slate-800 w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden animate-in fade-in duration-150 transition-colors">
        <div className="px-5 py-3.5 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 flex items-center justify-center">
              <Download className="w-3.5 h-3.5" />
            </div>
            <h2 className="text-xs font-semibold text-slate-900 dark:text-slate-100 uppercase tracking-wide">
              Export Structured Intelligence
            </h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="px-5 pt-2 flex items-center gap-3 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0f172a]">
          <button
            onClick={() => setActiveTab('JSON')}
            className={`text-xs pb-2 px-1 font-medium border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'JSON'
                ? 'border-slate-900 dark:border-slate-100 text-slate-900 dark:text-slate-100 font-semibold'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <FileJson className="w-3.5 h-3.5" />
            <span>JSON Schema</span>
          </button>
          <button
            onClick={() => setActiveTab('MD')}
            className={`text-xs pb-2 px-1 font-medium border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'MD'
                ? 'border-slate-900 dark:border-slate-100 text-slate-900 dark:text-slate-100 font-semibold'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Markdown Report</span>
          </button>
        </div>

        {/* Code Content */}
        <div className="flex-1 overflow-y-auto p-4 bg-slate-950 dark:bg-slate-950/90 text-slate-200 font-mono text-xs select-text">
          <pre className="whitespace-pre-wrap leading-relaxed">
            {activeTab === 'JSON' ? jsonString : markdownString}
          </pre>
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-2.5 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 flex items-center justify-between">
          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
            JSON ready for Jira API or database integration.
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="px-3 py-1 text-xs font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded transition-colors flex items-center gap-1.5"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
            <button
              onClick={handleDownload}
              className="px-3.5 py-1 text-xs font-semibold text-white bg-slate-900 dark:bg-slate-100 dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-white rounded transition-colors flex items-center gap-1.5 active:scale-95"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download file</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ExportModal;
