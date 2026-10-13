import React from 'react';
import { X, HelpCircle, Check, Copy } from 'lucide-react';

export function MissionQuestionsModal({ isOpen, onClose }) {
  const [copiedIndex, setCopiedIndex] = React.useState(null);

  if (!isOpen) return null;

  const questions = [
    {
      qNum: "CÂU HỎI 1",
      title: "Phần quan trọng nhất bạn chọn để hiện thực hóa trong MVP là gì? Vì sao nếu phần này hoạt động, bạn tin rằng hướng giải quyết của mình là khả thi?",
      answer: `Phần quan trọng nhất được chọn để hiện thực hóa trong MVP là: **Bộ lọc Terminal Consensus (Đồng thuận chốt chặn) kết hợp Danh mục Phương án bị loại (Rejected Alternatives) và Trích dẫn đối soát 1-click (Evidence Timestamp Citations)**.

**Vì sao phần này hoạt động thì chứng minh giải pháp khả thi?**
1. **Giải quyết đúng 'tử huyệt' của tóm tắt thông thường:** Trong mọi cuộc họp thực tế, ý kiến luôn biến thiên liên tục (Đề xuất ban đầu A → Tranh luận → Chốt B). Nếu hệ thống chứng minh được nó có thể bóc tách chính xác B là quyết định cuối cùng, đồng thời lưu A vào danh mục bị loại kèm lý do (như Memcached bị loại vì thiếu disk persistence), hệ thống đã giải quyết được thách thức cốt lõi nhất của bài toán.
2. **Loại bỏ hoàn toàn chi phí rà soát mù:** Khi mỗi quyết định và công việc đều gắn chặt với timestamp gốc trong transcript, người chủ trì (PM/Tech Lead) có thể kiểm chứng trong 5 giây thay vì đọc lại biên bản 30 phút. Nếu vòng lặp này hoạt động tốt trên giao diện thực tế, toàn bộ giải pháp ở Mission 1 là hoàn toàn khả thi.`
    },
    {
      qNum: "CÂU HỎI 2",
      title: "So với kế hoạch ở Mission 1, bạn đã thay đổi quyết định hoặc thiết kế nào? Điều gì trong quá trình làm khiến bạn thay đổi?",
      answer: `Trong quá trình hiện thực hóa MVP, tôi đã thực hiện **2 thay đổi thiết kế quan trọng**:

1. **Thay đổi 1: Bổ sung rõ rệt trường 'rejected_alternatives' ngay trong schema Decision.**
   - *Lý do thay đổi:* Ở Mission 1, tôi dự định hiển thị dòng thời gian thảo luận (Timeline). Nhưng khi xây dựng MVP thực tế, người dùng chỉ quan tâm: *"Tại sao không làm Memcached mà lại làm Redis Cluster?"*. Việc đưa thẳng lý do loại bỏ vào thẻ Quyết định giúp tiết kiệm 80% không gian hiển thị và tăng tính thuyết phục tức thì.

2. **Thay đổi 2: Tách biệt dứt khoát giữa 'Action Items' và 'Open Issues / Blockers'.**
   - *Lý do thay đổi:* Khi thử nghiệm với các câu thoại thực tế như *"someone ought to look into that someday"* hoặc *"we table this for next sprint"*, prompt đơn giản dễ bị 'ảo giác' biến các câu bộc phát này thành task có người nhận. Tôi quyết định đưa mọi thảo luận không có cam kết trách nhiệm cụ thể hoặc bị hoãn lại vào danh mục 'Open Issues' để bảo vệ backlog khỏi rác.`
    },
    {
      qNum: "CÂU HỎI 3",
      title: "Loại thông tin nào hệ thống hiện dễ ghi nhận sai nhất? Bạn đang làm gì để tránh tạo ra một quyết định, công việc hoặc dữ liệu không thực sự tồn tại trong cuộc họp?",
      answer: `**1. Loại thông tin hệ thống dễ ghi nhận sai nhất:**
- **Ngữ cảnh mỉa mai (Sarcasm/Irony):** Ví dụ: *"Sao không viết lại cả app bằng Flutter trong 2 ngày luôn đi?"* (Test Case 3). LLM rất dễ hiểu nhầm thành đề xuất kỹ thuật nghiêm túc.
- **Đại từ nhân xưng mơ hồ & Cam kết nửa vời:** Phát ngôn như *"You take care of this ASAP"* hoặc *"We should do X"* khiến AI dễ gán bừa người nhận việc hoặc tự bịa ra deadline.

**2. Giải pháp đang áp dụng để ngăn chặn 'ảo giác' (Anti-Hallucination Guardrails):**
- **Quy tắc Kiểm tra Cam kết Đơn phương (Commitment Gate):** Hệ thống chỉ tạo Action Item khi có đại từ ngôi thứ nhất cam kết rõ ràng (*"I will handle..."*, *"I own this..."*) hoặc có lời giao việc và người nhận đồng ý. Nếu mơ hồ, gán cờ 'Unassigned / Needs Human Date'.
- **Bắt buộc trích dẫn bằng chứng (Grounding Constraint):** Mọi đầu ra JSON bắt buộc phải có trường \`evidence.quote\` và \`evidence.timestamp\`. Không có trích dẫn nguyên văn trong transcript thì không được tạo dữ liệu.
- **Cơ chế Phê duyệt 1-Click của Con người (Human-in-the-Loop):** Dữ liệu xuất hiện ở trạng thái Nháp (Draft). Người dùng chỉ cần 1 cú click để Verify hoặc xóa bỏ trước khi đẩy vào Jira/Slack.`
    }
  ];

  const handleCopy = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs select-none">
      <div className="bg-white rounded-lg shadow-xl border border-slate-200 w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in duration-150">
        <div className="px-5 py-3.5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded bg-slate-900 text-white flex items-center justify-center">
              <HelpCircle className="w-3.5 h-3.5" />
            </div>
            <div>
              <h2 className="text-xs font-semibold tracking-tight text-slate-900 uppercase">
                3 CÂU HỎI BẮT BUỘC — MISSION 2 (HIỆN THỰC HÓA)
              </h2>
              <p className="text-[11px] text-slate-500 font-mono">
                Báo cáo luận giải trực diện bài toán đề bài
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-4 select-text">
          {questions.map((item, idx) => (
            <div
              key={idx}
              className="bg-slate-50 border border-slate-200 rounded p-4 space-y-2.5"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono font-semibold text-slate-700 bg-slate-200 px-1.5 py-0.5 rounded">
                    {item.qNum}
                  </span>
                  <h3 className="text-xs font-semibold text-slate-900 leading-snug">
                    {item.title}
                  </h3>
                </div>

                <button
                  onClick={() => handleCopy(item.answer, idx)}
                  className="text-[11px] text-slate-600 hover:text-slate-900 font-medium flex items-center gap-1 bg-white px-2 py-1 rounded border border-slate-200 shrink-0"
                  title="Sao chép câu trả lời"
                >
                  {copiedIndex === idx ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-700 font-mono text-[10px]">Đã chép</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span className="font-mono text-[10px]">Sao chép</span>
                    </>
                  )}
                </button>
              </div>

              <div className="bg-white rounded p-3.5 border border-slate-200 text-xs text-slate-700 leading-relaxed whitespace-pre-line font-normal">
                {item.answer}
              </div>
            </div>
          ))}
        </div>

        <div className="px-5 py-2.5 border-t border-slate-200 bg-slate-50 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-3 py-1 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 font-medium rounded text-xs transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}

export default MissionQuestionsModal;
