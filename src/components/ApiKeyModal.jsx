import React, { useState } from 'react';
import { X, Key, Shield, CheckCircle2 } from 'lucide-react';

export function ApiKeyModal({ isOpen, onClose, apiKey, onSaveApiKey }) {
  const [inputVal, setInputVal] = useState(apiKey || '');
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs select-none">
      <div className="bg-white rounded-lg shadow-xl border border-slate-200 w-full max-w-md overflow-hidden animate-in fade-in duration-150">
        <div className="px-5 py-3.5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-slate-900 text-white flex items-center justify-center">
              <Key className="w-3.5 h-3.5" />
            </div>
            <h2 className="text-xs font-semibold text-slate-900 uppercase tracking-wide">
              Gemini API Key (Tùy chọn)
            </h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-4 select-text">
          <div className="bg-slate-50 border border-slate-200 rounded p-3 text-xs text-slate-700 space-y-1">
            <div className="font-semibold flex items-center gap-1.5 text-slate-900">
              <Shield className="w-3.5 h-3.5 text-slate-600" />
              <span>Chế độ kiểm thử linh hoạt:</span>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Hệ thống đã tích hợp sẵn <strong>bộ mô phỏng ngữ nghĩa nội bộ</strong> cho 5 test case chuẩn. Nếu bạn muốn gọi trực tiếp LLM Gemini 1.5/Flash để phân tích transcript tùy biến, hãy nhập API key bên dưới.
            </p>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Google Gemini API Key:
            </label>
            <input
              type="password"
              placeholder="AIzaSy..."
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded focus:bg-white focus:outline-none focus:border-slate-400 font-mono text-slate-800"
            />
            <span className="text-[10px] text-slate-400 mt-1 block font-mono">
              Key được lưu tạm trong LocalStorage của trình duyệt. Không chia sẻ ra ngoài.
            </span>
          </div>

          {savedSuccess && (
            <div className="flex items-center gap-1.5 text-xs text-emerald-800 bg-emerald-50 p-2 rounded border border-emerald-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Đã lưu API key thành công.</span>
            </div>
          )}
        </div>

        <div className="px-5 py-2.5 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <button
            onClick={handleClear}
            className="text-xs text-slate-500 hover:text-rose-600 font-medium"
          >
            Xóa Key
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3 py-1 text-xs text-slate-600 hover:bg-slate-200 rounded transition-colors font-medium"
            >
              Hủy
            </button>
            <button
              onClick={handleSave}
              className="px-3.5 py-1 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded transition-colors"
            >
              Lưu cấu hình
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ApiKeyModal;
