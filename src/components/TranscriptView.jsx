import React, { useState, useRef } from 'react';
import { 
  Search, 
  Bookmark, 
  ChevronDown, 
  Upload, 
  RotateCcw,
  ArrowRight,
  Check
} from 'lucide-react';
import { GOOGLE_MEET_SAMPLES } from '../data/sampleTranscripts';

export function TranscriptView({
  transcript = [],
  participants = [],
  decisions = [],
  highlightedTurnId,
  onTurnClick,
  onSubmitTranscript,
  onClearTranscript,
  isProcessing = false
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpeaker, setSelectedSpeaker] = useState('ALL');

  // Input state when left side is blank / input mode
  const [rawInputText, setRawInputText] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  // Filter transcript when transcript exists
  const filteredTranscript = transcript.filter((item) => {
    const matchesSearch = 
      item.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.speaker.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSpeaker = 
      selectedSpeaker === 'ALL' || item.speaker.toLowerCase() === selectedSpeaker.toLowerCase();
    return matchesSearch && matchesSpeaker;
  });

  const getSpeakerColor = (speakerName) => {
    const found = participants.find(p => p.name.toLowerCase() === speakerName.toLowerCase());
    return found?.color || 'bg-slate-600';
  };

  const getSpeakerInitials = (speakerName) => {
    const found = participants.find(p => p.name.toLowerCase() === speakerName.toLowerCase());
    if (found && found.initials) return found.initials;
    const parts = speakerName.split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
    return speakerName.substring(0, 2).toUpperCase();
  };

  // File drop & upload handler
  const handleFileDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer?.files && e.dataTransfer.files[0]) {
      readFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleFileInputChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      readFile(e.target.files[0]);
    }
  };

  const readFile = (file) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target.result;
      if (typeof content === 'string') {
        setRawInputText(content);
      }
    };
    reader.readAsText(file);
  };

  const handleTriggerSubmit = (e) => {
    if (e) e.preventDefault();
    if (!rawInputText.trim() || isProcessing) return;
    if (onSubmitTranscript) {
      onSubmitTranscript(rawInputText.trim());
    }
  };

  // =========================================================================
  // VIEW 1: BLANK / INPUT & DROP-OFF PLACE (When there is NO transcript)
  // =========================================================================
  if (!transcript || transcript.length === 0) {
    return (
      <div className="flex flex-col h-full bg-white dark:bg-[#0f172a] border-r border-slate-200 dark:border-slate-800 select-none overflow-hidden transition-colors">
        {/* Header */}
        <div className="p-3.5 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-slate-400 dark:bg-slate-500" />
            <span className="text-xs font-semibold text-slate-900 dark:text-slate-100 tracking-tight">
              Transcript Input
            </span>
          </div>
          <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500">
            Empty · Awaiting data
          </span>
        </div>

        {/* Input & Drop-off body */}
        <div className="flex-1 flex flex-col p-4 space-y-3.5 overflow-y-auto select-text">
          {/* File Dropzone */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleFileDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-lg p-5 flex flex-col items-center justify-center text-center cursor-pointer transition-colors ${
              dragActive 
                ? 'border-slate-900 dark:border-slate-200 bg-slate-100 dark:bg-slate-800' 
                : 'border-slate-300 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-600 bg-slate-50/50 dark:bg-slate-800/30 hover:bg-slate-50 dark:hover:bg-slate-800/50'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".txt,.md,.json,.vtt,.srt"
              onChange={handleFileInputChange}
              className="hidden"
            />
            <Upload className="w-5 h-5 text-slate-500 dark:text-slate-400 mb-1.5" />
            <p className="text-xs font-medium text-slate-800 dark:text-slate-200">
              Drop a transcript file here or <span className="underline font-semibold">browse from disk</span>
            </p>
            <p className="text-[10px] font-mono text-slate-400 dark:text-slate-500 mt-0.5">
              Supported formats: .txt, .md, .vtt, .srt, .json
            </p>
          </div>

          {/* Quick Sample Selector */}
          <div className="flex flex-col gap-1.5 pt-1">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                Load a Google Meet test case or paste text:
              </span>
              <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500">
                5 test cases available
              </span>
            </div>

            <div className="flex items-center gap-1.5 flex-wrap">
              {GOOGLE_MEET_SAMPLES.map((sample) => (
                <button
                  key={sample.id}
                  type="button"
                  onClick={() => setRawInputText(sample.text)}
                  className="px-2 py-1 text-[11px] font-mono font-medium rounded border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 hover:border-slate-300 dark:hover:border-slate-600 text-slate-700 dark:text-slate-300 transition-colors shadow-2xs"
                  title={sample.description}
                >
                  {sample.name.split(':')[0]}
                </button>
              ))}
            </div>
          </div>

          {/* Text Input Area */}
          <div className="flex-1 flex flex-col min-h-[220px]">
            <textarea
              value={rawInputText}
              onChange={(e) => setRawInputText(e.target.value)}
              placeholder={`[14:10] Alex (Lead Architect): Should we pick Memcached or Redis Cluster?
[14:25] Lan (Senior Backend): Memcached lacks persistent disk snapshots and automated key replication.
[15:10] Alex: Agreed then. We will adopt Redis Cluster. Memcached is officially rejected.
[15:25] Nam: I'll take charge of the benchmark validation. I'll finish by Friday 5 PM.`}
              className="w-full flex-1 p-3 font-mono text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-750 rounded focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:border-slate-400 dark:focus:border-slate-600 text-slate-800 dark:text-slate-100 leading-relaxed resize-none transition-colors"
            />
          </div>

          {/* Action Row */}
          <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500">
              Requires a real Gemini API key to run AI extraction.
            </span>

            <div className="flex items-center gap-2">
              {rawInputText && (
                <button
                  type="button"
                  onClick={() => setRawInputText('')}
                  className="px-2.5 py-1 text-xs text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 font-mono"
                >
                  Clear
                </button>
              )}
              <button
                type="button"
                onClick={handleTriggerSubmit}
                disabled={isProcessing || !rawInputText.trim()}
                className="px-3.5 py-1.5 text-xs font-semibold text-white bg-slate-900 dark:bg-slate-100 dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-white disabled:opacity-50 rounded transition-all flex items-center gap-1.5 active:scale-95 shadow-xs"
              >
                <span>Process via AI</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // VIEW 2: ACTIVE TRANSCRIPT UTTERANCE STREAM (When transcript is loaded)
  // =========================================================================

  // Bold high-signal keywords in transcript text
  const highlightKeywords = (text) => {
    const keywords = [
      'agreed', 'approved', 'locked in', 'rejected', 'we will', "i'll", 'i will',
      'decision', 'final', 'confirmed', 'committed', 'blocked', 'no decision',
      'ASAP', 'deadline', 'by friday', 'by monday', 'by sunday', 'i own',
      'take charge', 'impasse', 'sarcastic', 'tabled'
    ];
    let result = text;
    keywords.forEach(kw => {
      const regex = new RegExp(`(${kw})`, 'gi');
      result = result.replace(regex, '**$1**');
    });
    // Render **bold** spans
    const parts = result.split(/\*\*(.+?)\*\*/g);
    return parts.map((part, i) =>
      i % 2 === 1
        ? <strong key={i} className="font-semibold text-slate-900 dark:text-white">{part}</strong>
        : part
    );
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-[#0f172a] border-r border-slate-200 dark:border-slate-800 select-none overflow-hidden transition-colors">
      {/* Controls Header: Utterance Count + Actions */}
      <div className="p-3 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0f172a] flex flex-col gap-2 shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-900 dark:text-slate-100 tracking-tight">
              Ground Truth Transcript
            </span>
            <span className="px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-[10px] font-mono text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
              {filteredTranscript.length} utterances
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClearTranscript}
              className="text-[11px] font-mono text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 underline transition-colors flex items-center gap-1"
              title="Clear transcript and return to input screen"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Load Different Transcript</span>
            </button>
          </div>
        </div>

        {/* Search Bar + Speaker Filter */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
            <input
              type="text"
              placeholder="Search utterances, keywords, or citations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-8 pl-8 pr-10 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded focus:bg-white dark:focus:bg-slate-800 focus:border-slate-400 dark:focus:border-slate-500 focus:outline-none transition-colors text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500"
            />
            <span className="absolute right-2 top-1/2 -translate-y-1/2 px-1 py-0.5 rounded bg-white dark:bg-slate-700 text-[9px] font-mono text-slate-400 dark:text-slate-400 border border-slate-200 dark:border-slate-600 pointer-events-none">
              ⌘K
            </span>
          </div>

          <div className="relative shrink-0">
            <select
              value={selectedSpeaker}
              onChange={(e) => setSelectedSpeaker(e.target.value)}
              className="h-8 pl-2.5 pr-6 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-slate-700 dark:text-slate-200 focus:bg-white dark:focus:bg-slate-800 focus:border-slate-400 dark:focus:border-slate-500 focus:outline-none cursor-pointer appearance-none"
            >
              <option value="ALL">All Speakers</option>
              {participants.map((p) => (
                <option key={p.name} value={p.name} className="dark:bg-[#0f172a] dark:text-slate-200">
                  {p.name}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Scrollable Transcript Utterance Feed */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2.5 divide-y divide-slate-100 dark:divide-slate-800 select-text">
        {filteredTranscript.length === 0 ? (
          <div className="text-center py-12 text-slate-400 dark:text-slate-500 text-xs font-medium">
            No utterances match the current filter.
          </div>
        ) : (
          filteredTranscript.map((turn) => {
            const isHighlighted = highlightedTurnId === turn.id;
            const isConsensusAnchor = turn.text.toLowerCase().includes('approved') || 
                                      turn.text.toLowerCase().includes('agreed') ||
                                      turn.text.toLowerCase().includes('locked in') ||
                                      turn.text.toLowerCase().includes('we will adopt') ||
                                      turn.text.toLowerCase().includes('decision approved') ||
                                      turn.text.toLowerCase().includes('officially rejected');

            // Find if this anchor is associated with a verified decision or if any decision is verified
            const linkedDecision = decisions.find(d => 
              d.evidence?.timestamp === turn.time || 
              (d.evidence?.quote && turn.text.toLowerCase().includes(d.evidence.quote.substring(0, 15).toLowerCase()))
            );
            const isVerifiedDecision = linkedDecision?.status === 'VERIFIED';
            const hasAnyVerifiedDecision = decisions.some(d => d.status === 'VERIFIED');
            const isAnchorVerified = isVerifiedDecision || (hasAnyVerifiedDecision && isConsensusAnchor);

            return (
              <article
                key={turn.id}
                id={`turn-${turn.id}`}
                onClick={() => onTurnClick && onTurnClick(turn)}
                className={`pt-2.5 px-2.5 pb-2 rounded border transition-all cursor-pointer group ${
                  isHighlighted
                    ? 'bg-slate-100/90 dark:bg-slate-800 border-slate-400 dark:border-slate-500 shadow-xs ring-1 ring-slate-300 dark:ring-slate-600'
                    : (isAnchorVerified && isConsensusAnchor)
                    ? 'bg-emerald-50/40 dark:bg-emerald-950/30 border-emerald-400 dark:border-emerald-600 ring-1 ring-emerald-300 dark:ring-emerald-700 shadow-2xs'
                    : isConsensusAnchor
                    ? 'bg-emerald-50/15 dark:bg-emerald-950/15 border-emerald-200 dark:border-emerald-800/60 hover:border-emerald-300 dark:hover:border-emerald-700'
                    : 'bg-white dark:bg-[#0f172a] border-transparent hover:border-slate-200 dark:hover:border-slate-800 hover:bg-slate-50/40 dark:hover:bg-slate-800/40'
                }`}
              >
                <div className="flex items-baseline justify-between mb-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`w-5 h-5 rounded ${getSpeakerColor(turn.speaker)} text-white font-mono text-[9px] flex items-center justify-center font-bold`}>
                      {getSpeakerInitials(turn.speaker)}
                    </span>
                    <span className={`text-xs font-semibold ${
                      getSpeakerColor(turn.speaker).replace('bg-', 'text-').replace('-600', '-700').replace('-700', '-800').replace('-800', '-900')
                    }`}>
                      {turn.speaker}
                    </span>
                    {turn.role && (
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium font-sans">
                        {turn.role}
                      </span>
                    )}

                    {/* Consensus Anchor Tag - Turns Vibrant Green when Verified */}
                    {isConsensusAnchor && (
                      <span className={`px-2 py-0.5 text-[9px] font-mono font-bold rounded shadow-xs flex items-center gap-1 transition-all ${
                        isAnchorVerified
                          ? 'bg-emerald-600 text-white ring-2 ring-emerald-300 dark:ring-emerald-500 shadow-sm animate-in fade-in duration-150'
                          : 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                      }`}>
                        <Check className={`w-3 h-3 ${isAnchorVerified ? 'text-white stroke-[3]' : 'text-emerald-600 dark:text-emerald-400'}`} />
                        <span>{isAnchorVerified ? 'Consensus Anchor (Verified)' : 'Consensus Anchor'}</span>
                      </span>
                    )}
                  </div>

                  {/* Interactive Timeline Timestamp Button */}
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onTurnClick && onTurnClick(turn);
                      }}
                      className="font-mono text-[11px] px-1.5 py-0.5 rounded bg-slate-100/90 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 tabular-num transition-colors border border-slate-200 dark:border-slate-700 cursor-pointer flex items-center gap-1"
                      title={`Timestamp [${turn.time}] — click to synchronize inspection`}
                    >
                      <span>⏱ {turn.time}</span>
                    </button>
                    <Bookmark className="w-3 h-3 text-slate-300 dark:text-slate-600 opacity-0 group-hover:opacity-100 hover:text-slate-600 dark:hover:text-slate-300 transition-opacity" />
                  </div>
                </div>

                <p className="text-xs text-slate-700 dark:text-slate-300 pl-7 leading-relaxed font-normal">
                  {highlightKeywords(turn.text)}
                </p>

                {isHighlighted && (
                  <div className="mt-1.5 pl-7 flex items-center gap-1.5 text-[10px] font-mono text-slate-500 dark:text-slate-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-900 dark:bg-slate-200" />
                    <span>Synchronized with active intelligence inspection</span>
                  </div>
                )}
              </article>
            );
          })
        )}
      </div>

      {/* Transcript Status Footer */}
      <div className="h-7 px-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0f172a] flex items-center justify-between text-[11px] font-mono text-slate-500 dark:text-slate-400 shrink-0 transition-colors">
        <span>{filteredTranscript.length} utterances · ground-truth synchronized</span>
      </div>
    </div>
  );
}

export default TranscriptView;
