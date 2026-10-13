import React, { useState } from 'react';
import { X, Copy, Check, Download, FileJson, FileText } from 'lucide-react';

export function ExportModal({ isOpen, onClose, meeting, intelligence }) {
  const [activeTab, setActiveTab] = useState('JSON');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const jsonString = JSON.stringify(intelligence, null, 2);

  const markdownString = `# BIÊN BẢN TRÍ TUỆ CUỘC HỌP (AI MEETING INTELLIGENCE RECORD)
**Cuộc họp:** ${meeting.title}  
**Thời gian:** ${meeting.date} (${meeting.duration})  
**Thành viên:** ${meeting.participants?.map(p => `${p.name} (${p.role})`).join(', ')}  

---

## 1. CÁC QUYẾT ĐỊNH CHÍNH THỨC (KEY DECISIONS)
${intelligence.decisions?.map((d, i) => `
### ${i + 1}. ${d.topic}
* **Quyết định chốt:** ${d.final_decision}
* **Mức độ ảnh hưởng:** ${d.impact || 'Standard'}
* **Trạng thái:** ${d.consensus_badge || 'Terminal Consensus'}
${d.rejected_alternatives?.length ? `* **Phương án bị loại:**\n` + d.rejected_alternatives.map(a => `  - *${a.option}*: ${a.reason}`).join('\n') : ''}
* **Bằng chứng đối soát:** "${d.evidence?.quote}" — *${d.evidence?.speaker} [${d.evidence?.timestamp}]*
`).join('\n') || '*Không có quyết định nào.*'}

---

## 2. VIỆC CẦN LÀM (ACTION ITEMS)
${intelligence.action_items?.map((a, i) => `
* [${a.status === 'VERIFIED' ? 'x' : ' '}] **${a.task}**
  - **Người phụ trách:** ${a.assignee || 'Chưa gán'}
  - **Hạn chót:** ${a.deadline || 'Chưa rõ'}
  - **Ticket Jira:** #${a.jira_key || 'N/A'}
  - **Trích dẫn bằng chứng:** "${a.evidence?.quote}" [${a.evidence?.timestamp}]
`).join('\n') || '*Không có đầu việc nào.*'}

---

## 3. VẤN ĐỀ CHƯA CHỐT & RÀO CẢN (OPEN ISSUES & BLOCKERS)
${intelligence.open_issues?.map((o, i) => `
* **${o.topic}** (${o.status})
  - **Rào cản:** ${o.unresolved_reason}
  - **Kế hoạch tiếp theo:** ${o.next_steps}
  - **Bằng chứng:** "${o.evidence?.quote}" [${o.evidence?.timestamp}]
`).join('\n') || '*Không có vấn đề tồn đọng.*'}
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs select-none">
      <div className="bg-white rounded-lg shadow-xl border border-slate-200 w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden animate-in fade-in duration-150">
        <div className="px-5 py-3.5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-slate-900 text-white flex items-center justify-center">
              <Download className="w-3.5 h-3.5" />
            </div>
            <h2 className="text-xs font-semibold text-slate-900 uppercase tracking-wide">
              Xuất Dữ Liệu Có Cấu Trúc (Export Intelligence)
            </h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="px-5 pt-2 flex items-center gap-3 border-b border-slate-200 bg-white">
          <button
            onClick={() => setActiveTab('JSON')}
            className={`text-xs pb-2 px-1 font-medium border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'JSON'
                ? 'border-slate-900 text-slate-900 font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <FileJson className="w-3.5 h-3.5" />
            <span>Pydantic JSON Schema</span>
          </button>
          <button
            onClick={() => setActiveTab('MD')}
            className={`text-xs pb-2 px-1 font-medium border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'MD'
                ? 'border-slate-900 text-slate-900 font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Báo cáo Markdown</span>
          </button>
        </div>

        {/* Code Content */}
        <div className="flex-1 overflow-y-auto p-4 bg-slate-950 text-slate-200 font-mono text-xs select-text">
          <pre className="whitespace-pre-wrap leading-relaxed">
            {activeTab === 'JSON' ? jsonString : markdownString}
          </pre>
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-2.5 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <span className="text-[11px] text-slate-500 font-mono">
            Chuẩn JSON sẵn sàng tích hợp Jira API hoặc DB.
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="px-3 py-1 text-xs font-medium text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded transition-colors flex items-center gap-1.5"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Đã sao chép' : 'Sao chép'}</span>
            </button>
            <button
              onClick={handleDownload}
              className="px-3.5 py-1 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded transition-colors flex items-center gap-1.5 active:scale-95"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Tải tệp xuống</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ExportModal;
