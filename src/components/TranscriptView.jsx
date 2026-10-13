import React, { useState } from 'react';
import { 
  Search, 
  Play, 
  Pause, 
  Volume2, 
  Bookmark, 
  ChevronDown,
  Calendar,
  Clock,
  Users
} from 'lucide-react';

export function TranscriptView({
  transcript = [],
  participants = [],
  highlightedTurnId,
  onTurnClick,
  currentTime = "18:42"
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpeaker, setSelectedSpeaker] = useState('ALL');
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState('1.25x');

  // Filter transcript
  const filteredTranscript = transcript.filter((item) => {
    const matchesSearch = 
      item.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.speaker.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSpeaker = 
      selectedSpeaker === 'ALL' || item.speaker.toLowerCase() === selectedSpeaker.toLowerCase();
    return matchesSearch && matchesSpeaker;
  });

  const getSpeakerInitials = (speakerName) => {
    const found = participants.find(p => p.name.toLowerCase() === speakerName.toLowerCase());
    if (found && found.initials) return found.initials;
    const parts = speakerName.split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
    return speakerName.substring(0, 2).toUpperCase();
  };

  return (
    <div className="flex flex-col h-full bg-white border-r border-slate-200 select-none">
      {/* SUB-HEADER: SYNCHRONIZED AUDIO CONTROLLER & SESSION METADATA */}
      <div className="h-11 px-3.5 border-b border-slate-200 bg-slate-50 flex items-center justify-between shrink-0 text-slate-700">
        {/* Audio Waveform Scrubber Cluster */}
        <div className="flex items-center gap-2.5 flex-1 max-w-md">
          <button 
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-6 h-6 rounded bg-slate-900 text-white flex items-center justify-center hover:bg-slate-800 transition-colors shrink-0 active:scale-95"
            title={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? (
              <Pause className="w-3 h-3" />
            ) : (
              <Play className="w-3 h-3 ml-0.5" />
            )}
          </button>

          <div className="flex items-center gap-1 font-mono text-[11px] text-slate-700 shrink-0 tabular-num">
            <span className="font-semibold text-slate-900">{currentTime}</span>
            <span className="text-slate-400">/</span>
            <span className="text-slate-500">45:10</span>
          </div>

          {/* Mini High-Density Waveform Display */}
          <div className="relative flex-1 flex items-center h-4 bg-white border border-slate-200 rounded px-1 group cursor-pointer overflow-hidden">
            <div className="absolute inset-y-0 left-0 bg-slate-200/80 w-[41%] border-r border-slate-700 pointer-events-none" />
            <div className="flex items-center justify-between w-full h-2.5 z-10 opacity-70">
              <div className="w-0.5 h-1 bg-slate-900" />
              <div className="w-0.5 h-2 bg-slate-900" />
              <div className="w-0.5 h-2.5 bg-slate-900" />
              <div className="w-0.5 h-1.5 bg-slate-900" />
              <div className="w-0.5 h-2 bg-slate-900" />
              <div className="w-0.5 h-2.5 bg-slate-900 font-bold" />
              <div className="w-0.5 h-1 bg-slate-400" />
              <div className="w-0.5 h-2 bg-slate-400" />
              <div className="w-0.5 h-2.5 bg-slate-400" />
              <div className="w-0.5 h-1.5 bg-slate-400" />
              <div className="w-0.5 h-2 bg-slate-400" />
              <div className="w-0.5 h-1 bg-slate-400" />
              <div className="w-0.5 h-2 bg-slate-400" />
              <div className="w-0.5 h-1 bg-slate-400" />
            </div>
          </div>

          {/* Playback Rate & Volume Controls */}
          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={() => setPlaybackSpeed(playbackSpeed === '1.0x' ? '1.25x' : playbackSpeed === '1.25x' ? '1.5x' : '1.0x')}
              className="px-1.5 py-0.5 text-[10px] font-mono font-medium border border-slate-200 rounded bg-white text-slate-700 hover:bg-slate-100 transition-colors"
            >
              {playbackSpeed}
            </button>
            <Volume2 className="w-3.5 h-3.5 text-slate-400 hover:text-slate-600 cursor-pointer" />
          </div>
        </div>

        {/* Meeting Attendees Initials */}
        <div className="hidden sm:flex items-center gap-2 pl-3">
          <div className="flex items-center -space-x-1">
            {participants.slice(0, 5).map((p, idx) => (
              <div
                key={idx}
                className="w-5 h-5 rounded-full border border-white bg-slate-200 text-slate-700 flex items-center justify-center text-[9px] font-mono font-semibold"
                title={`${p.name} (${p.role || ''})`}
              >
                {getSpeakerInitials(p.name)}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Transcript Stream Controls Header */}
      <div className="p-3 border-b border-slate-200 bg-white flex flex-col gap-2 shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-900 tracking-tight">
              Ground Truth Transcript
            </span>
            <span className="px-1.5 py-0.2 rounded bg-slate-100 text-[10px] font-mono text-slate-600 border border-slate-200">
              {filteredTranscript.length} Utterances
            </span>
          </div>
          <span className="text-[11px] font-mono text-slate-400">
            Audit Grounding
          </span>
        </div>

        {/* Search Bar + Speaker Filter */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search utterances, technical terms, or citations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-8 pl-8 pr-10 text-xs bg-slate-50 border border-slate-200 rounded focus:bg-white focus:border-slate-400 focus:outline-none transition-colors text-slate-800 placeholder-slate-400"
            />
            <span className="absolute right-2 top-1/2 -translate-y-1/2 px-1 py-0.5 rounded bg-white text-[9px] font-mono text-slate-400 border border-slate-200 pointer-events-none">
              ⌘K
            </span>
          </div>

          <div className="relative shrink-0">
            <select
              value={selectedSpeaker}
              onChange={(e) => setSelectedSpeaker(e.target.value)}
              className="h-8 pl-2.5 pr-6 text-xs bg-slate-50 border border-slate-200 rounded text-slate-700 focus:bg-white focus:border-slate-400 focus:outline-none cursor-pointer appearance-none"
            >
              <option value="ALL">All Speakers</option>
              {participants.map((p) => (
                <option key={p.name} value={p.name}>
                  {p.name}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Scrollable Transcript Utterance Feed */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2.5 divide-y divide-slate-100 select-text">
        {filteredTranscript.length === 0 ? (
          <div className="text-center py-12 text-slate-400 text-xs font-medium">
            No matching transcript speech found.
          </div>
        ) : (
          filteredTranscript.map((turn) => {
            const isHighlighted = highlightedTurnId === turn.id;
            const isConsensusAnchor = turn.text.toLowerCase().includes('approved') || 
                                      turn.text.toLowerCase().includes('đồng ý') || 
                                      turn.text.toLowerCase().includes('chốt');

            return (
              <article
                key={turn.id}
                id={`turn-${turn.id}`}
                onClick={() => onTurnClick && onTurnClick(turn)}
                className={`pt-2.5 px-2.5 pb-2 rounded border transition-all cursor-pointer group ${
                  isHighlighted
                    ? 'bg-slate-100/90 border-slate-400 shadow-xs ring-1 ring-slate-300'
                    : isConsensusAnchor
                    ? 'bg-slate-50/60 border-slate-200 hover:border-slate-300'
                    : 'bg-white border-transparent hover:border-slate-200 hover:bg-slate-50/40'
                }`}
              >
                <div className="flex items-baseline justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded bg-slate-200 text-slate-800 font-mono text-[9px] flex items-center justify-center font-bold">
                      {getSpeakerInitials(turn.speaker)}
                    </span>
                    <span className="text-xs font-semibold text-slate-900">
                      {turn.speaker}
                    </span>
                    {turn.role && (
                      <span className="text-[10px] text-slate-500 font-medium font-sans">
                        {turn.role}
                      </span>
                    )}
                    {isConsensusAnchor && (
                      <span className="px-1.5 py-0.2 bg-slate-100 text-slate-700 text-[9px] font-mono font-medium rounded border border-slate-200">
                        Consensus Anchor
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-[11px] text-slate-400 hover:text-slate-700 tabular-num transition-colors">
                      {turn.time}
                    </span>
                    <Bookmark className="w-3 h-3 text-slate-300 opacity-0 group-hover:opacity-100 hover:text-slate-600 transition-opacity" />
                  </div>
                </div>

                <p className="text-xs text-slate-700 pl-7 leading-relaxed font-normal">
                  {turn.text}
                </p>

                {isHighlighted && (
                  <div className="mt-1.5 pl-7 flex items-center gap-1.5 text-[10px] font-mono text-slate-500">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-900" />
                    <span>Synchronized with active intelligence inspection</span>
                  </div>
                )}
              </article>
            );
          })
        )}
      </div>

      {/* Transcript Status Footer */}
      <div className="h-7 px-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-[11px] font-mono text-slate-500 shrink-0">
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-slate-700" />
          <span>Axiom Real-Time Audio Synchronizer Active</span>
        </div>
        <span>Audio Drift: +0.04ms</span>
      </div>
    </div>
  );
}

export default TranscriptView;
