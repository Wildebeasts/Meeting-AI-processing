import React, { useState } from 'react';
import { 
  X, 
  FlaskConical, 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  BookOpen,
  Play,
  RefreshCw,
  SlidersHorizontal,
  Layers
} from 'lucide-react';

export function TestBenchModal({
  isOpen,
  onClose,
  meetings = [],
  onSelectMeeting,
  currentTestResults = [],
  onRunAllBenchmarks,
  isBenchmarking = false
}) {
  const [selectedCaseIndex, setSelectedCaseIndex] = useState(0);

  if (!isOpen) return null;

  const currentMeeting = meetings[selectedCaseIndex] || meetings[0];
  const evalData = currentMeeting?.testCaseEvaluation || {
    expectation: 'Không có dữ liệu',
    actualResult: 'Chưa chạy',
    status: 'PENDING',
    learning: 'N/A'
  };

  // Find if there is a dynamic test result corresponding to this test case
  const dynamicMatch = currentTestResults?.find(
    r => r.testId === `TC-0${selectedCaseIndex + 1}`
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs select-none">
      <div className="bg-white rounded-lg shadow-xl border border-slate-200 w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in duration-150">
        {/* Modal Header */}
        <div className="px-5 py-3.5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded bg-slate-900 text-white flex items-center justify-center">
              <FlaskConical className="w-3.5 h-3.5" />
            </div>
            <div>
              <h2 className="text-xs font-semibold tracking-tight text-slate-900 uppercase">
                BỘ KIỂM THỬ MISSION 2 (5 TEST CASES BENCHMARK)
              </h2>
              <p className="text-[11px] text-slate-500 font-mono">
                Kiểm định thực tế: Kỳ vọng → Kết quả thực tế AI → Đạt/Chưa đạt → Điều học được
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onRunAllBenchmarks && (
              <button
                onClick={onRunAllBenchmarks}
                disabled={isBenchmarking}
                className="px-2.5 py-1 text-xs font-semibold text-slate-900 bg-white hover:bg-slate-100 border border-slate-300 rounded transition-colors flex items-center gap-1.5 shadow-2xs"
                title="Kích hoạt AI Engine quét và chấm điểm đồng thời cả 5 ca kiểm thử"
              >
                {isBenchmarking ? (
                  <>
                    <RefreshCw className="w-3 h-3 animate-spin text-slate-600" />
                    <span>Đang chạy AI 5 ca...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3 h-3 fill-current" />
                    <span>Chạy AI toàn bộ 5 ca</span>
                  </>
                )}
              </button>
            )}

            <button
              onClick={onClose}
              className="w-7 h-7 rounded hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 select-text">
          {/* Tabs for 5 test cases */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
            {meetings.slice(0, 5).map((m, idx) => {
              const isSelected = selectedCaseIndex === idx;
              let badgeColor = "bg-slate-100 text-slate-600 border-slate-200";
              if (m.testCaseType === "SUCCESS_CASE") badgeColor = "bg-emerald-50 text-emerald-800 border-emerald-200";
              if (m.testCaseType === "DIFFICULT_CASE") badgeColor = "bg-amber-50 text-amber-800 border-amber-200";
              if (m.testCaseType === "FAILED_CASE") badgeColor = "bg-rose-50 text-rose-800 border-rose-200";
              if (m.testCaseType === "COMPLEX_CASE") badgeColor = "bg-slate-100 text-slate-800 border-slate-300";
              if (m.testCaseType === "UNRESOLVED_CASE") badgeColor = "bg-purple-50 text-purple-800 border-purple-200";

              return (
                <button
                  key={m.id || idx}
                  onClick={() => setSelectedCaseIndex(idx)}
                  className={`p-2.5 rounded border text-left transition-all ${
                    isSelected
                      ? 'border-slate-900 bg-slate-50 ring-1 ring-slate-900'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="text-[10px] font-mono text-slate-400 mb-0.5">
                    CASE 0{idx + 1}
                  </div>
                  <div className="text-xs font-semibold text-slate-800 line-clamp-2 leading-tight">
                    {m.testCaseName?.split(":")[1]?.trim() || m.title}
                  </div>
                  <div className={`mt-1.5 text-[9px] font-mono font-medium px-1.5 py-0.5 rounded border inline-block ${badgeColor}`}>
                    {m.testCaseType}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Test Case Detail Card */}
          <div className="bg-slate-50 border border-slate-200 rounded p-4 space-y-3.5">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-2.5">
              <div>
                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">
                  Tình huống đang kiểm định
                </span>
                <h3 className="text-sm font-semibold text-slate-900 mt-0.5">
                  {currentMeeting?.testCaseName || currentMeeting?.title}
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-medium px-2.5 py-1 rounded border border-slate-200 bg-white">
                  Đánh giá:{' '}
                  <strong className={evalData.status.includes('FAIL') ? 'text-rose-700' : 'text-emerald-700'}>
                    {evalData.status}
                  </strong>
                </span>

                <button
                  onClick={() => {
                    onSelectMeeting(currentMeeting.id);
                    onClose();
                  }}
                  className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium rounded transition-colors flex items-center gap-1 active:scale-95"
                >
                  <span>Mở transcript này</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* 4 Pillars of Evaluation */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* 1. Kỳ vọng */}
              <div className="bg-white p-3.5 rounded border border-slate-200 space-y-1">
                <div className="text-[11px] font-mono font-semibold text-slate-700 uppercase tracking-wider">
                  1. Kỳ Vọng (Expectation):
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {evalData.expectation}
                </p>
              </div>

              {/* 2. Kết quả thực tế AI */}
              <div className="bg-white p-3.5 rounded border border-slate-200 space-y-1">
                <div className="text-[11px] font-mono font-semibold text-slate-700 uppercase tracking-wider">
                  2. Kết Quả Thực Tế AI (Actual Result):
                </div>
                <p className="text-xs text-slate-700 leading-relaxed font-medium">
                  {dynamicMatch?.actualResult || evalData.actualResult}
                </p>
              </div>

              {/* 3. Đánh giá Đạt / Chưa đạt */}
              <div className="bg-white p-3.5 rounded border border-slate-200 space-y-1">
                <div className="text-[11px] font-mono font-semibold text-slate-700 uppercase tracking-wider">
                  3. Đánh Giá (Pass / Fail Status):
                </div>
                <div className="flex items-center gap-1.5 mt-1">
                  {evalData.status.includes('FAIL') ? (
                    <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  )}
                  <span className="text-xs font-semibold text-slate-800">
                    {evalData.status}
                  </span>
                </div>
              </div>

              {/* 4. Điều học được */}
              <div className="bg-white p-3.5 rounded border border-slate-200 space-y-1">
                <div className="text-[11px] font-mono font-semibold text-slate-700 uppercase tracking-wider">
                  4. Điều Học Được (Lessons Learned):
                </div>
                <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-2 rounded border border-slate-200 font-medium">
                  {evalData.learning}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-2.5 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-[11px] text-slate-500 font-mono">
          <span>Cam kết: 1 Test Tốt, 1 Test Khó/Mơ hồ, 1 Test Thất bại theo đúng yêu cầu Mission 2.</span>
          <button
            onClick={onClose}
            className="px-3 py-1 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 font-medium rounded transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}

export default TestBenchModal;
