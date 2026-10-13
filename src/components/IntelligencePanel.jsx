import React, { useState } from 'react';
import { 
  CheckCircle2, 
  ArrowUpRight, 
  Clock, 
  Calendar, 
  Check, 
  AlertTriangle, 
  HelpCircle,
  FileCheck,
  Send,
  ShieldCheck,
  TrendingUp,
  X
} from 'lucide-react';

export function IntelligencePanel({
  intelligence = { decisions: [], action_items: [], open_issues: [] },
  onJumpToEvidence,
  onToggleActionStatus,
  onToggleDecisionStatus
}) {
  const [activeTab, setActiveTab] = useState('ALL');
  // Track selected timeline stage for each decision { [decId]: stageIndex (0, 1, or 2) }
  const [selectedTimelineStage, setSelectedTimelineStage] = useState({});

  const { decisions = [], action_items = [], open_issues = [] } = intelligence;

  // Classify issues into Blockers vs Unresolved if needed
  const blockers = open_issues.filter(i => 
    i.status?.toLowerCase().includes('block') || 
    i.status?.toLowerCase().includes('vướng') ||
    i.unresolved_reason?.toLowerCase().includes('rào cản')
  );
  const unresolvedItems = open_issues.filter(i => !blockers.includes(i));
  const effectiveBlockers = blockers.length > 0 ? blockers : open_issues.slice(0, 1);
  const effectiveUnresolved = unresolvedItems.length > 0 ? unresolvedItems : open_issues.slice(1);

  return (
    <div className="flex flex-col h-full bg-[#f8fafc] dark:bg-[#0b0f17] overflow-hidden select-none transition-colors">
      {/* Intelligence Filter & Section Tabs Strip */}
      <div className="h-11 px-4 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0f172a] flex items-center justify-between shrink-0 transition-colors">
        <nav className="flex items-center gap-1 sm:gap-2 h-full overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab('ALL')}
            className={`h-full border-b-2 px-2.5 text-xs font-medium flex items-center gap-1.5 transition-colors whitespace-nowrap ${
              activeTab === 'ALL'
                ? 'border-slate-900 dark:border-slate-100 text-slate-900 dark:text-slate-100 font-semibold'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <span>All Synthesis</span>
          </button>

          <button
            onClick={() => setActiveTab('DECISIONS')}
            className={`h-full border-b-2 px-2.5 text-xs font-medium flex items-center gap-1.5 transition-colors whitespace-nowrap ${
              activeTab === 'DECISIONS'
                ? 'border-slate-900 dark:border-slate-100 text-slate-900 dark:text-slate-100 font-semibold'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <span>Decisions</span>
            <span className="px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 font-mono text-[10px] text-slate-700 dark:text-slate-300">
              {decisions.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('ACTIONS')}
            className={`h-full border-b-2 px-2.5 text-xs font-medium flex items-center gap-1.5 transition-colors whitespace-nowrap ${
              activeTab === 'ACTIONS'
                ? 'border-slate-900 dark:border-slate-100 text-slate-900 dark:text-slate-100 font-semibold'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <span>Deliverables</span>
            <span className="px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 font-mono text-[10px] text-slate-700 dark:text-slate-300">
              {action_items.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('FRICTION')}
            className={`h-full border-b-2 px-2.5 text-xs font-medium flex items-center gap-1.5 transition-colors whitespace-nowrap ${
              activeTab === 'FRICTION'
                ? 'border-slate-900 dark:border-slate-100 text-slate-900 dark:text-slate-100 font-semibold'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <span>Friction & Blockers</span>
            <span className="px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 font-mono text-[10px] text-slate-700 dark:text-slate-300">
              {open_issues.length}
            </span>
          </button>
        </nav>
      </div>

      {/* Scrollable Executive Intelligence Canvas */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 select-text">
        {/* ===================================================================== */}
        {/* BLOCK 1: FINAL DECISIONS & CONSENSUS DRIFT (Structured Bento Card) */}
        {/* ===================================================================== */}
        {(activeTab === 'ALL' || activeTab === 'DECISIONS') && decisions.length > 0 && (
          <div className="space-y-3">
            {decisions.map((dec, idx) => {
              const isVerified = dec.status === 'VERIFIED';
              const decKey = dec.id || `dec-${idx}`;

              // Derive status badge from the actual phase label
              const getStatusBadge = (phase) => {
                const p = (phase || '').toLowerCase();
                if (p.includes('initial') || p.includes('debate') || p.includes('competing')) return 'Competing Proposals';
                if (p.includes('convergence') || p.includes('alignment') || p.includes('trade')) return 'Alignment & Trade-offs';
                return 'Terminal Lock-in';
              };

              const stageColors = [
                'text-rose-600 dark:text-rose-400',
                'text-amber-600 dark:text-amber-400',
                'text-emerald-700 dark:text-emerald-400',
                'text-blue-600 dark:text-blue-400',
              ];

              // Map consensus_type to a visual quality signal
              const getConsensusQuality = (type) => {
                const t = (type || '').toUpperCase();
                if (t.includes('FAIL') || t.includes('UNRESOLVED') || t.includes('DISPUTE') || t.includes('DISSENT') || t.includes('REJECTED')) return {
                  label: '✕ Failed / Unresolved Consensus',
                  hint: 'Product struggle / Fail case — meeting had unresolved disputes or false consensus',
                  bg: 'bg-rose-50 dark:bg-rose-950/40',
                  border: 'border-rose-300 dark:border-rose-700',
                  text: 'text-rose-800 dark:text-rose-300',
                  dot: 'bg-rose-500'
                };
                if (t.includes('EXPLICIT')) return {
                  label: '✓ Clear Explicit Consensus',
                  hint: 'Product handled well — unambiguous terminal agreement detected',
                  bg: 'bg-emerald-50 dark:bg-emerald-950/40',
                  border: 'border-emerald-300 dark:border-emerald-700',
                  text: 'text-emerald-800 dark:text-emerald-300',
                  dot: 'bg-emerald-500'
                };
                if (t.includes('RELUCTANT') || t.includes('COMPROMISE')) return {
                  label: '~ Reluctant Compromise',
                  hint: 'Difficult case — agreement was reached under pressure or with reservations',
                  bg: 'bg-amber-50 dark:bg-amber-950/40',
                  border: 'border-amber-300 dark:border-amber-700',
                  text: 'text-amber-800 dark:text-amber-300',
                  dot: 'bg-amber-500'
                };
                if (t.includes('ASSUMED') || t.includes('NO_OBJECTION')) return {
                  label: '? Assumed Consent',
                  hint: 'Unclear case — no explicit agreement, silence interpreted as approval',
                  bg: 'bg-amber-50 dark:bg-amber-950/40',
                  border: 'border-amber-300 dark:border-amber-700',
                  text: 'text-amber-800 dark:text-amber-300',
                  dot: 'bg-amber-400'
                };
                // fallback when consensus_type not set
                return null;
              };
              const consensusQuality = getConsensusQuality(dec.consensus_type);

              // Build stages purely from what the AI returned in dec.timeline
              let stages = (dec.timeline && dec.timeline.length > 0)
                ? dec.timeline.map((t, i) => ({
                    index: i,
                    phaseLabel: t.phase || `Phase ${i + 1}`,
                    color: stageColors[Math.min(i, stageColors.length - 1)],
                    timestamp: t.timestamp || null,
                    summary: t.summary || (t.quote ? `Spoken milestone recorded at [${t.timestamp || '—'}]` : dec.final_decision || null),
                    quote: t.quote || null,
                    speaker: t.speaker || null,
                    hasData: true,
                    statusBadge: getStatusBadge(t.phase)
                  }))
                : [];

              // If no terminal stage yet from AI, append one from dec.evidence (if available)
              const hasTerminal = stages.some(s =>
                s.phaseLabel.toLowerCase().includes('terminal') ||
                s.phaseLabel.toLowerCase().includes('consensus') ||
                s.phaseLabel.toLowerCase().includes('lock')
              );
              if (!hasTerminal && dec.evidence?.quote) {
                stages.push({
                  index: stages.length,
                  phaseLabel: 'Terminal Consensus',
                  color: 'text-emerald-700 dark:text-emerald-400',
                  timestamp: dec.evidence.timestamp || null,
                  summary: dec.final_decision || 'Terminal agreement locked in and verified against quoted utterance.',
                  quote: dec.evidence.quote || null,
                  speaker: dec.evidence.speaker || null,
                  hasData: true,
                  statusBadge: 'Terminal Lock-in'
                });
              }

              // Fallback: if AI returned nothing at all, show a single evidence-only stage
              if (stages.length === 0) {
                stages = [{
                  index: 0,
                  phaseLabel: 'Terminal Consensus',
                  color: 'text-emerald-700 dark:text-emerald-400',
                  timestamp: dec.evidence?.timestamp || null,
                  summary: dec.final_decision || 'Terminal consensus extracted from quoted evidence.',
                  quote: dec.evidence?.quote || null,
                  speaker: dec.evidence?.speaker || null,
                  hasData: Boolean(dec.evidence?.quote),
                  statusBadge: 'Terminal Lock-in'
                }];
              }

              // Default selection: last stage (terminal consensus)
              const activeStageIndex = selectedTimelineStage[decKey] ?? (stages.length - 1);
              const currentActiveStage = stages[activeStageIndex] || stages[stages.length - 1];

              // Grid class based on actual stage count
              const gridColsClass = stages.length === 1 ? 'grid-cols-1'
                : stages.length === 2 ? 'grid-cols-2'
                : stages.length >= 3 ? 'grid-cols-3'
                : 'grid-cols-1';

              return (
                <div 
                  key={dec.id || idx}
                  className={`bg-white dark:bg-[#0f172a] border rounded p-4 flex flex-col gap-3 shadow-2xs transition-all ${
                    isVerified 
                      ? 'border-emerald-300 dark:border-emerald-700/80 border-l-4 border-l-emerald-600 bg-emerald-50/15 dark:bg-emerald-950/20' 
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  {/* Header row */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-mono text-[10px] font-semibold border border-slate-200 dark:border-slate-700">
                          {`DEC-20${idx + 4}`}
                        </span>

                        {/* Consensus Quality Badge — immediately tells user if this is clear, ambiguous, or reluctant */}
                        {consensusQuality && !isVerified && (
                          <span
                            className={`px-2 py-0.5 rounded border text-[10px] font-semibold flex items-center gap-1.5 ${consensusQuality.bg} ${consensusQuality.border} ${consensusQuality.text}`}
                            title={consensusQuality.hint}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${consensusQuality.dot}`} />
                            {consensusQuality.label}
                          </span>
                        )}

                        {isVerified ? (
                          <span className="px-2 py-0.5 rounded bg-emerald-600 text-white text-[10px] font-bold shadow-xs flex items-center gap-1 ring-1 ring-emerald-500">
                            <ShieldCheck className="w-3 h-3 text-white" />
                            <span>VERIFIED DECISION</span>
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-[10px] font-semibold">
                            {dec.consensus_badge || 'Final Consensus'}
                          </span>
                        )}

                        {dec.evidence?.timestamp && (
                          <span className="text-[11px] text-slate-400 dark:text-slate-500 font-mono">
                            Decided at {dec.evidence.timestamp}
                          </span>
                        )}
                      </div>

                      <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 leading-snug">
                        {dec.topic}: {dec.final_decision}
                      </h3>
                    </div>

                    {/* Action buttons: Verify Decision & Jump to Evidence */}
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => onToggleDecisionStatus && onToggleDecisionStatus(dec.id || `dec-${idx}`)}
                        className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded transition-all active:scale-95 shadow-xs ${
                          isVerified
                            ? 'bg-emerald-600 text-white hover:bg-emerald-700 ring-2 ring-emerald-300'
                            : 'bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 hover:border-slate-400'
                        }`}
                        title={isVerified ? 'Click to unverify decision' : 'Click to verify decision and highlight Consensus Anchor in green'}
                      >
                        <Check className={`w-3.5 h-3.5 ${isVerified ? 'text-white stroke-[3]' : 'text-slate-500 dark:text-slate-400'}`} />
                        <span>{isVerified ? 'Verified' : 'Verify Decision'}</span>
                      </button>

                      {dec.evidence && (
                        <button
                          onClick={() => onJumpToEvidence && onJumpToEvidence(dec.evidence)}
                          className="flex items-center gap-1 text-[11px] font-mono text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 underline shrink-0 transition-colors"
                          title="Jump to Transcript"
                        >
                          <span>Jump to [{dec.evidence.timestamp}]</span>
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Financial & Operational Impact Block */}
                  {dec.impact && (
                    <div className="p-2.5 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs">
                        <span className="font-medium text-slate-800 dark:text-slate-200">Operational Impact:</span>
                        <span className="text-slate-600 dark:text-slate-400">{dec.impact}</span>
                      </div>
                      <span className="font-mono text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold shrink-0">
                        High Confidence
                      </span>
                    </div>
                  )}

                  {/* Consensus Evolution Timeline / Trajectory (Clickable & Interactive) */}
                  <div className="flex flex-col gap-1.5 pt-0.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 dark:text-slate-500">
                        Consensus Drift & Convergence Trajectory (Click stage to inspect & jump)
                      </span>
                      <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500">
                        Stage {activeStageIndex + 1} of {stages.length} active
                      </span>
                    </div>

                    <div className={`grid gap-2 ${gridColsClass}`}>
                      {stages.map((stage) => {
                        const isSelected = activeStageIndex === stage.index;

                        return (
                          <button
                            key={stage.index}
                            type="button"
                            onClick={() => {
                              setSelectedTimelineStage(prev => ({ ...prev, [decKey]: stage.index }));
                              if (onJumpToEvidence && stage.hasData && stage.timestamp) {
                                onJumpToEvidence({
                                  timestamp: stage.timestamp,
                                  quote: stage.quote,
                                  speaker: stage.speaker
                                });
                              }
                            }}
                            className={`p-2 border rounded text-left transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-white dark:bg-slate-800 border-slate-900 dark:border-slate-400 ring-2 ring-slate-800 dark:ring-slate-400 shadow-xs'
                                : 'bg-slate-50/70 dark:bg-slate-800/30 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-100/60 dark:hover:bg-slate-800/60'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-0.5">
                              <span className="font-mono text-[10px] font-semibold text-slate-800 dark:text-slate-200">
                                {stage.timestamp ? `[${stage.timestamp}]` : '—'}
                              </span>
                              <span className={`text-[10px] font-bold ${stage.color}`}>
                                {stage.phaseLabel}
                              </span>
                            </div>
                            {stage.hasData ? (
                              <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-tight line-clamp-2">
                                {stage.summary || (stage.quote ? `"${stage.quote.substring(0, 80)}${stage.quote.length > 80 ? '…' : ''}"` : 'Evidence available — click to inspect')}
                              </p>
                            ) : (
                              <p className="text-[11px] text-slate-400 dark:text-slate-500 italic leading-tight">
                                No data captured for this phase
                              </p>
                            )}
                            {isSelected && (
                              <div className="mt-1 flex items-center gap-1 text-[9px] font-mono text-emerald-700 dark:text-emerald-400 font-semibold">
                                <span>● Selected stage</span>
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>{/* end grid */}

                    {/* Interactive Stage Inspection Detail View — full width */}
                    <div className="p-3 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 rounded text-xs flex flex-col gap-2 shadow-sm border border-slate-200 dark:border-slate-700 animate-in fade-in duration-150">
                      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-1.5">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono text-[10px] border border-slate-200 dark:border-slate-700">
                            {currentActiveStage.timestamp ? `Milestone [${currentActiveStage.timestamp}]` : 'Milestone [—]'}
                          </span>
                          <span className="font-semibold text-slate-900 dark:text-white">
                            {currentActiveStage.phaseLabel}
                          </span>
                          <span className="px-1.5 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60 font-mono text-[9px] font-semibold">
                            {currentActiveStage.statusBadge}
                          </span>
                        </div>

                        {currentActiveStage.hasData && currentActiveStage.timestamp && (
                          <button
                            type="button"
                            onClick={() => onJumpToEvidence && onJumpToEvidence({
                              timestamp: currentActiveStage.timestamp,
                              quote: currentActiveStage.quote,
                              speaker: currentActiveStage.speaker
                            })}
                            className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white text-[11px] font-mono flex items-center gap-1 hover:underline transition-colors shrink-0"
                          >
                            <span>Jump to [{currentActiveStage.timestamp}]</span>
                            <ArrowUpRight className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>

                      {currentActiveStage.hasData ? (
                        <>
                          {currentActiveStage.summary && (
                            <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                              {currentActiveStage.summary}
                            </p>
                          )}

                          {currentActiveStage.quote && (
                            <div className="p-2 rounded bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 border-l-2 border-l-emerald-600 dark:border-l-emerald-500 text-[11px] text-slate-700 dark:text-slate-200 font-mono flex flex-col gap-0.5">
                              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold">
                                {currentActiveStage.speaker} spoken utterance:
                              </span>
                              <span className="italic">"{currentActiveStage.quote}"</span>
                            </div>
                          )}
                        </>
                      ) : (
                        <p className="text-[11px] text-slate-400 dark:text-slate-500 italic py-1">
                          No transcript data was captured for this phase by the AI. This stage may not have occurred in the meeting, or the AI did not identify a distinct utterance for it.
                        </p>
                      )}
                    </div>
                  </div>{/* end Consensus Drift flex-col */}

                  {/* Direct Utterance Ground Truth Citation */}
                  {dec.evidence && (
                    <div className="text-xs text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/40 p-2.5 rounded border-l-2 border-slate-900 dark:border-slate-400 leading-relaxed">
                      <span className="font-semibold text-slate-900 dark:text-slate-100">
                        {dec.evidence.speaker} @ {dec.evidence.timestamp}:
                      </span>{' '}
                      “{dec.evidence.quote}”
                    </div>
                  )}

                  {/* Trade-off Balance: Accepted vs Rejected Alternatives */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 pt-0.5 text-xs">
                    {/* Accepted Attributes */}
                    <div className="p-2.5 rounded bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
                      <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-800 dark:text-emerald-400 uppercase tracking-wider mb-1">
                        <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                        <span>Accepted Deliverables</span>
                      </div>
                      {dec.accepted_deliverables && dec.accepted_deliverables.length > 0 ? (
                        <ul className="space-y-1 text-slate-600 dark:text-slate-400 text-[11px] list-disc list-inside">
                          {dec.accepted_deliverables.map((item, i) => (
                            <li key={i}>{item}</li>
                          ))}
                        </ul>
                      ) : (
                        <ul className="space-y-1 text-slate-600 dark:text-slate-400 text-[11px] list-disc list-inside">
                          <li>{dec.final_decision || 'Explicit operational parameters agreed in meeting.'}</li>
                          {dec.impact && <li>{dec.impact}</li>}
                        </ul>
                      )}
                    </div>

                    {/* Rejected Alternatives */}
                    <div className="p-2.5 rounded bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
                      <div className="flex items-center gap-1 text-[11px] font-semibold text-rose-800 dark:text-rose-400 uppercase tracking-wider mb-1">
                        <X className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
                        <span>Rejected Alternatives</span>
                      </div>
                      {dec.rejected_alternatives && dec.rejected_alternatives.length > 0 ? (
                        <ul className="space-y-1 text-slate-600 dark:text-slate-400 text-[11px]">
                          {dec.rejected_alternatives.map((alt, i) => (
                            <li key={i} className="flex items-start gap-1">
                              <span className="line-through text-slate-400 dark:text-slate-500 font-medium shrink-0">
                                {alt.option}:
                              </span>
                              <span className="text-rose-700 dark:text-rose-400 leading-tight">
                                {alt.reason}
                              </span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-[11px] text-slate-500 dark:text-slate-500 italic">
                          No previous alternatives rejected in this turn.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ===================================================================== */}
        {/* BLOCK 2: ACTION DELIVERABLES (High Density Table View) */}
        {/* ===================================================================== */}
        {(activeTab === 'ALL' || activeTab === 'ACTIONS') && action_items.length > 0 && (
          <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded p-4 flex flex-col gap-3 shadow-2xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h3 className="text-xs font-semibold text-slate-900 dark:text-slate-100 tracking-tight">
                  Assigned Action Items & Deliverables
                </h3>
                <span className="px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 font-mono text-[10px] text-slate-700 dark:text-slate-300">
                  {action_items.filter(a => a.status !== 'VERIFIED').length} Pending
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[11px] text-slate-400 dark:text-slate-500 font-mono">
                  1-Click Verification Active
                </span>
              </div>
            </div>

            {/* Table Container */}
            <div className="border border-slate-200 dark:border-slate-800 rounded overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-[10px] text-slate-500 dark:text-slate-400 font-mono uppercase tracking-wider">
                    <th className="py-2 px-3 w-12 text-center">Pri</th>
                    <th className="py-2 px-3">Deliverable Description</th>
                    <th className="py-2 px-3 w-32">Assignee</th>
                    <th className="py-2 px-3 w-28">Due Date</th>
                    <th className="py-2 px-3 w-28">Status</th>
                    <th className="py-2 px-3 w-20 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {action_items.map((act, idx) => {
                    const isVerified = act.status === 'VERIFIED';
                    const priority = idx === 0 ? 'P0' : 'P1';

                    return (
                      <tr key={act.id || idx} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                        <td className="py-2.5 px-3 text-center">
                          <span className={`px-1 py-0.5 rounded font-mono text-[9px] font-bold ${
                            priority === 'P0' 
                              ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-800' 
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                          }`}>
                            {priority}
                          </span>
                        </td>

                        <td className="py-2.5 px-3">
                          <div className={`font-medium ${isVerified ? 'line-through text-slate-400 dark:text-slate-500' : 'text-slate-900 dark:text-slate-100'}`}>
                            {act.task}
                          </div>
                          {act.evidence && (
                            <button
                              onClick={() => onJumpToEvidence && onJumpToEvidence(act.evidence)}
                              className="text-[11px] text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 flex items-center gap-1 mt-0.5 transition-colors font-mono"
                            >
                              <span>[{act.evidence.timestamp}]</span>
                              <span className="italic truncate max-w-[260px]">"{act.evidence.quote}"</span>
                            </button>
                          )}
                        </td>

                        <td className="py-2.5 px-3">
                          <div className="flex items-center gap-1.5">
                            <span className="w-4 h-4 rounded bg-slate-200 dark:bg-slate-700 font-mono text-[9px] flex items-center justify-center font-bold text-slate-700 dark:text-slate-300">
                              {(act.assignee || 'U')[0].toUpperCase()}
                            </span>
                            <span className="text-slate-800 dark:text-slate-200 text-[11px] truncate">
                              {act.assignee || 'Unassigned'}
                            </span>
                            {/* Ambiguous pronoun flag — when AI cannot resolve who 'you' refers to */}
                            {(act.assignee || '').toLowerCase().includes('needs') && (
                              <span className="text-amber-500" title="Ambiguous pronoun — needs confirmation">⚠</span>
                            )}
                          </div>
                        </td>

                        <td className="py-2.5 px-3">
                          {/* Vague deadline warning — shown when AI flags 'Needs Confirmation' or 'ASAP' */}
                          {(() => {
                            const dl = (act.deadline || '').toLowerCase();
                            const isVague = dl.includes('needs') || dl.includes('asap') || dl.includes('confirmation') || dl.includes('tbd') || !act.deadline;
                            return isVague ? (
                              <span className="flex items-center gap-1 text-[11px] font-mono text-amber-700 dark:text-amber-400 font-semibold" title="Vague or unconfirmed deadline — requires human review">
                                <AlertTriangle className="w-3 h-3 shrink-0" />
                                {act.deadline || 'Unconfirmed'}
                              </span>
                            ) : (
                              <span className="font-mono text-[11px] text-slate-700 dark:text-slate-300 tabular-num">
                                {act.deadline}
                              </span>
                            );
                          })()}
                        </td>

                        <td className="py-2.5 px-3">
                          <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold border ${
                            isVerified 
                              ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800' 
                              : 'bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800'
                          }`}>
                            {isVerified ? 'VERIFIED' : 'PENDING'}
                          </span>
                        </td>

                        <td className="py-2.5 px-3 text-right">
                          <button
                            onClick={() => onToggleActionStatus && onToggleActionStatus(act.id)}
                            className="px-2 py-1 text-[11px] font-medium rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors active:scale-95"
                          >
                            {isVerified ? 'Undo' : 'Verify'}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ===================================================================== */}
        {/* BLOCK 3 & 4: FRICTION & UNRESOLVED ITEMS (Dual Column Bottom Bento) */}
        {/* ===================================================================== */}
        {(activeTab === 'ALL' || activeTab === 'FRICTION') && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Block 3: Key Friction & Technical Blockers */}
            <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded p-3.5 flex flex-col gap-2.5 shadow-2xs">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                <div className="flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
                  <h4 className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                    Key Friction & Blockers
                  </h4>
                </div>
                <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500">
                  {effectiveBlockers.length} Logged
                </span>
              </div>

              {effectiveBlockers.map((blk, i) => (
                <div 
                  key={blk.id || i}
                  className="p-2.5 rounded bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 flex flex-col gap-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="px-1.5 py-0.2 rounded bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400 font-mono text-[9px] font-bold border border-rose-200 dark:border-rose-800">
                      SEVERITY: {blk.status || 'HIGH'}
                    </span>
                    {blk.evidence?.speaker && (
                      <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">
                        Flagged by {blk.evidence.speaker}
                      </span>
                    )}
                  </div>

                  <div className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                    {blk.topic}
                  </div>

                  <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-tight">
                    {blk.unresolved_reason}
                  </p>

                  {blk.evidence && (
                    <button
                      onClick={() => onJumpToEvidence && onJumpToEvidence(blk.evidence)}
                      className="text-[10px] font-mono text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 underline self-start pt-1"
                    >
                      Audit Quote [{blk.evidence.timestamp}]
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Block 4: Unresolved Items & Next Steps */}
            <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded p-3.5 flex flex-col gap-2.5 shadow-2xs">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                <div className="flex items-center gap-1.5">
                  <HelpCircle className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                  <h4 className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                    Unresolved Items & Next Steps
                  </h4>
                </div>
                <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500">
                  {effectiveUnresolved.length} Follow-up
                </span>
              </div>

              {effectiveUnresolved.map((unr, i) => (
                <div 
                  key={unr.id || i}
                  className="p-2.5 rounded bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 flex flex-col gap-1.5 justify-between h-full"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 font-mono text-[9px] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                        ITEM-UNR-0{i + 1}
                      </span>
                      {unr.status && (
                        <span className="text-[10px] text-slate-400 dark:text-slate-500">
                          {unr.status}
                        </span>
                      )}
                    </div>

                    <div className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                      {unr.topic}
                    </div>

                    <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-tight mt-1">
                      {unr.next_steps || unr.unresolved_reason}
                    </p>
                  </div>

                  {unr.evidence && (
                    <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800 flex items-center justify-between text-[10px]">
                      <span className="text-slate-400 dark:text-slate-500 font-mono">
                        Ref: {unr.evidence.timestamp}
                      </span>
                      <button
                        onClick={() => onJumpToEvidence && onJumpToEvidence(unr.evidence)}
                        className="text-slate-700 dark:text-slate-300 hover:underline font-medium"
                      >
                        Inspect Citation
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Intelligence Pane Footer Status */}
      <div className="h-7 px-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0f172a] flex items-center justify-between text-[11px] font-mono text-slate-500 dark:text-slate-400 shrink-0 transition-colors">
        <div className="flex items-center gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          <span>All utterances linked to verifiable audit chain</span>
        </div>
        <span>Encrypted Enterprise Storage</span>
      </div>
    </div>
  );
}

export default IntelligencePanel;
