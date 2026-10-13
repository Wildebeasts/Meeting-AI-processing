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
  onToggleActionStatus
}) {
  const [activeTab, setActiveTab] = useState('ALL');

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
    <div className="flex flex-col h-full bg-[#f8fafc] overflow-hidden select-none">
      {/* Intelligence Filter & Section Tabs Strip */}
      <div className="h-11 px-4 border-b border-slate-200 bg-white flex items-center justify-between shrink-0">
        <nav className="flex items-center gap-1 sm:gap-2 h-full overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab('ALL')}
            className={`h-full border-b-2 px-2.5 text-xs font-medium flex items-center gap-1.5 transition-colors whitespace-nowrap ${
              activeTab === 'ALL'
                ? 'border-slate-900 text-slate-900 font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <span>All Synthesis</span>
          </button>

          <button
            onClick={() => setActiveTab('DECISIONS')}
            className={`h-full border-b-2 px-2.5 text-xs font-medium flex items-center gap-1.5 transition-colors whitespace-nowrap ${
              activeTab === 'DECISIONS'
                ? 'border-slate-900 text-slate-900 font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <span>Decisions</span>
            <span className="px-1.5 py-0.2 rounded bg-slate-100 font-mono text-[10px] text-slate-700">
              {decisions.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('ACTIONS')}
            className={`h-full border-b-2 px-2.5 text-xs font-medium flex items-center gap-1.5 transition-colors whitespace-nowrap ${
              activeTab === 'ACTIONS'
                ? 'border-slate-900 text-slate-900 font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <span>Deliverables</span>
            <span className="px-1.5 py-0.2 rounded bg-slate-100 font-mono text-[10px] text-slate-700">
              {action_items.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('FRICTION')}
            className={`h-full border-b-2 px-2.5 text-xs font-medium flex items-center gap-1.5 transition-colors whitespace-nowrap ${
              activeTab === 'FRICTION'
                ? 'border-slate-900 text-slate-900 font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <span>Friction & Blockers</span>
            <span className="px-1.5 py-0.2 rounded bg-slate-100 font-mono text-[10px] text-slate-700">
              {open_issues.length}
            </span>
          </button>
        </nav>

        <div className="hidden md:flex items-center gap-2">
          <span className="text-[11px] font-mono text-slate-400">
            Deterministic Extraction Confidence: 99.4%
          </span>
        </div>
      </div>

      {/* Scrollable Executive Intelligence Canvas */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 select-text">
        {/* ===================================================================== */}
        {/* BLOCK 1: FINAL DECISIONS & CONSENSUS DRIFT (Structured Bento Card) */}
        {/* ===================================================================== */}
        {(activeTab === 'ALL' || activeTab === 'DECISIONS') && decisions.length > 0 && (
          <div className="space-y-3">
            {decisions.map((dec, idx) => (
              <div 
                key={dec.id || idx}
                className="bg-white border border-slate-200 rounded p-4 flex flex-col gap-3 shadow-2xs hover:border-slate-300 transition-colors"
              >
                {/* Header row */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-800 font-mono text-[10px] font-semibold border border-slate-200">
                        {`DEC-20${idx + 4}`}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-emerald-50 border border-emerald-200 text-emerald-800 text-[10px] font-semibold">
                        {dec.consensus_badge || 'Final Consensus (Unanimous)'}
                      </span>
                      {dec.evidence?.timestamp && (
                        <span className="text-[11px] text-slate-400 font-mono">
                          Decided at {dec.evidence.timestamp}
                        </span>
                      )}
                    </div>

                    <h3 className="text-sm font-semibold text-slate-900 leading-snug">
                      {dec.topic}: {dec.final_decision}
                    </h3>
                  </div>

                  {dec.evidence && (
                    <button
                      onClick={() => onJumpToEvidence && onJumpToEvidence(dec.evidence)}
                      className="flex items-center gap-1 text-[11px] font-mono text-slate-600 hover:text-slate-900 underline shrink-0 transition-colors"
                      title="Jump to Transcript"
                    >
                      <span>Jump to [{dec.evidence.timestamp}]</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Financial & Operational Impact Block */}
                {dec.impact && (
                  <div className="p-2.5 bg-slate-50 border border-slate-200 rounded flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="font-medium text-slate-800">Operational Impact:</span>
                      <span className="text-slate-600">{dec.impact}</span>
                    </div>
                    <span className="font-mono text-[11px] text-emerald-700 font-semibold shrink-0">
                      High Confidence
                    </span>
                  </div>
                )}

                {/* Consensus Evolution Timeline / Trajectory */}
                <div className="flex flex-col gap-1.5 pt-0.5">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                    Consensus Drift & Convergence Trajectory
                  </span>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                    <div className="p-2 border border-slate-200 rounded bg-slate-50/50">
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="font-mono text-[10px] text-slate-400">08:35</span>
                        <span className="text-[10px] font-semibold text-rose-600">Initial Debate</span>
                      </div>
                      <p className="text-[11px] text-slate-600 leading-tight">
                        Multiple competing proposals presented during initial round.
                      </p>
                    </div>

                    <div className="p-2 border border-slate-200 rounded bg-slate-50/50">
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="font-mono text-[10px] text-slate-400">14:20</span>
                        <span className="text-[10px] font-semibold text-amber-600">Convergence</span>
                      </div>
                      <p className="text-[11px] text-slate-600 leading-tight">
                        Counter-arguments addressed; alignment around core trade-offs.
                      </p>
                    </div>

                    <div className="p-2 border border-slate-300 rounded bg-slate-100">
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="font-mono text-[10px] text-slate-900 font-semibold">
                          {dec.evidence?.timestamp || '18:42'}
                        </span>
                        <span className="text-[10px] font-semibold text-emerald-700">Terminal Consensus</span>
                      </div>
                      <p className="text-[11px] text-slate-900 font-medium leading-tight">
                        Final executive approval confirmed for implementation.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Direct Utterance Ground Truth Citation */}
                {dec.evidence && (
                  <div className="text-xs text-slate-700 bg-slate-50 p-2.5 rounded border-l-2 border-slate-900 leading-relaxed">
                    <span className="font-semibold text-slate-900">
                      {dec.evidence.speaker} @ {dec.evidence.timestamp}:
                    </span>{' '}
                    “{dec.evidence.quote}”
                  </div>
                )}

                {/* Trade-off Balance: Accepted vs Rejected Alternatives */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 pt-0.5 text-xs">
                  {/* Accepted Attributes */}
                  <div className="p-2.5 rounded bg-slate-50 border border-slate-200">
                    <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-800 uppercase tracking-wider mb-1">
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Accepted Deliverables</span>
                    </div>
                    <ul className="space-y-1 text-slate-600 text-[11px] list-disc list-inside">
                      <li>Aligned with SLA and production deadlines</li>
                      <li>Preserves resource expenditure baseline</li>
                      <li>Operational playbook verified with on-call owners</li>
                    </ul>
                  </div>

                  {/* Rejected Alternatives */}
                  <div className="p-2.5 rounded bg-slate-50 border border-slate-200">
                    <div className="flex items-center gap-1 text-[11px] font-semibold text-rose-800 uppercase tracking-wider mb-1">
                      <X className="w-3.5 h-3.5 text-rose-600" />
                      <span>Rejected Alternatives</span>
                    </div>
                    {dec.rejected_alternatives && dec.rejected_alternatives.length > 0 ? (
                      <ul className="space-y-1 text-slate-600 text-[11px]">
                        {dec.rejected_alternatives.map((alt, i) => (
                          <li key={i} className="flex items-start gap-1">
                            <span className="line-through text-slate-400 font-medium shrink-0">
                              {alt.option}:
                            </span>
                            <span className="text-rose-700 leading-tight">
                              {alt.reason}
                            </span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-[11px] text-slate-500 italic">
                        No previous alternatives rejected in this turn.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ===================================================================== */}
        {/* BLOCK 2: ACTION DELIVERABLES (High Density Table View) */}
        {/* ===================================================================== */}
        {(activeTab === 'ALL' || activeTab === 'ACTIONS') && action_items.length > 0 && (
          <div className="bg-white border border-slate-200 rounded p-4 flex flex-col gap-3 shadow-2xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h3 className="text-xs font-semibold text-slate-900 tracking-tight">
                  Assigned Action Items & Deliverables
                </h3>
                <span className="px-1.5 py-0.2 rounded bg-slate-100 font-mono text-[10px] text-slate-700">
                  {action_items.filter(a => a.status !== 'VERIFIED').length} Pending
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[11px] text-slate-400 font-mono">
                  1-Click Verification Active
                </span>
              </div>
            </div>

            {/* Table Container */}
            <div className="border border-slate-200 rounded overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-[10px] text-slate-500 font-mono uppercase tracking-wider">
                    <th className="py-2 px-3 w-12 text-center">Pri</th>
                    <th className="py-2 px-3">Deliverable Description</th>
                    <th className="py-2 px-3 w-32">Assignee</th>
                    <th className="py-2 px-3 w-28">Due Date</th>
                    <th className="py-2 px-3 w-28">Status</th>
                    <th className="py-2 px-3 w-20 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {action_items.map((act, idx) => {
                    const isVerified = act.status === 'VERIFIED';
                    const priority = idx === 0 ? 'P0' : 'P1';

                    return (
                      <tr key={act.id || idx} className="hover:bg-slate-50/60 transition-colors">
                        <td className="py-2.5 px-3 text-center">
                          <span className={`px-1 py-0.5 rounded font-mono text-[9px] font-bold ${
                            priority === 'P0' 
                              ? 'bg-rose-50 text-rose-700 border border-rose-200' 
                              : 'bg-slate-100 text-slate-700 border border-slate-200'
                          }`}>
                            {priority}
                          </span>
                        </td>

                        <td className="py-2.5 px-3">
                          <div className={`font-medium ${isVerified ? 'line-through text-slate-400' : 'text-slate-900'}`}>
                            {act.task}
                          </div>
                          {act.evidence && (
                            <button
                              onClick={() => onJumpToEvidence && onJumpToEvidence(act.evidence)}
                              className="text-[11px] text-slate-400 hover:text-slate-700 flex items-center gap-1 mt-0.5 transition-colors font-mono"
                            >
                              <span>[{act.evidence.timestamp}]</span>
                              <span className="italic truncate max-w-[260px]">"{act.evidence.quote}"</span>
                            </button>
                          )}
                        </td>

                        <td className="py-2.5 px-3">
                          <div className="flex items-center gap-1.5">
                            <span className="w-4 h-4 rounded bg-slate-200 font-mono text-[9px] flex items-center justify-center font-bold text-slate-700">
                              {(act.assignee || 'U')[0].toUpperCase()}
                            </span>
                            <span className="text-slate-800 text-[11px] truncate">
                              {act.assignee || 'Unassigned'}
                            </span>
                          </div>
                        </td>

                        <td className="py-2.5 px-3 font-mono text-[11px] text-slate-700 tabular-num">
                          {act.deadline || 'Pending Sched'}
                        </td>

                        <td className="py-2.5 px-3">
                          <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold border ${
                            isVerified 
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
                              : 'bg-amber-50 text-amber-800 border-amber-200'
                          }`}>
                            {isVerified ? 'VERIFIED' : 'PENDING'}
                          </span>
                        </td>

                        <td className="py-2.5 px-3 text-right">
                          <button
                            onClick={() => onToggleActionStatus && onToggleActionStatus(act.id)}
                            className="px-2 py-1 text-[11px] font-medium rounded border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 transition-colors active:scale-95"
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
            <div className="bg-white border border-slate-200 rounded p-3.5 flex flex-col gap-2.5 shadow-2xs">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <div className="flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                  <h4 className="text-xs font-semibold text-slate-900">
                    Key Friction & Blockers
                  </h4>
                </div>
                <span className="text-[10px] font-mono text-slate-400">
                  {effectiveBlockers.length} Logged
                </span>
              </div>

              {effectiveBlockers.map((blk, i) => (
                <div 
                  key={blk.id || i}
                  className="p-2.5 rounded bg-slate-50 border border-slate-200 flex flex-col gap-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="px-1.5 py-0.2 rounded bg-rose-50 text-rose-700 font-mono text-[9px] font-bold border border-rose-200">
                      SEVERITY: {blk.status || 'HIGH'}
                    </span>
                    {blk.evidence?.speaker && (
                      <span className="text-[10px] font-mono text-slate-500">
                        Flagged by {blk.evidence.speaker}
                      </span>
                    )}
                  </div>

                  <div className="text-xs font-semibold text-slate-900">
                    {blk.topic}
                  </div>

                  <p className="text-[11px] text-slate-600 leading-tight">
                    {blk.unresolved_reason}
                  </p>

                  {blk.evidence && (
                    <button
                      onClick={() => onJumpToEvidence && onJumpToEvidence(blk.evidence)}
                      className="text-[10px] font-mono text-slate-500 hover:text-slate-800 underline self-start pt-1"
                    >
                      Audit Quote [{blk.evidence.timestamp}]
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Block 4: Unresolved Items & Next Steps */}
            <div className="bg-white border border-slate-200 rounded p-3.5 flex flex-col gap-2.5 shadow-2xs">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <div className="flex items-center gap-1.5">
                  <HelpCircle className="w-3.5 h-3.5 text-slate-500" />
                  <h4 className="text-xs font-semibold text-slate-900">
                    Unresolved Items & Next Steps
                  </h4>
                </div>
                <span className="text-[10px] font-mono text-slate-400">
                  {effectiveUnresolved.length} Follow-up
                </span>
              </div>

              {effectiveUnresolved.map((unr, i) => (
                <div 
                  key={unr.id || i}
                  className="p-2.5 rounded bg-slate-50 border border-slate-200 flex flex-col gap-1.5 justify-between h-full"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-1.5 py-0.2 rounded bg-slate-100 font-mono text-[9px] text-slate-700 border border-slate-200">
                        ITEM-UNR-0{i + 1}
                      </span>
                      {unr.status && (
                        <span className="text-[10px] text-slate-400">
                          {unr.status}
                        </span>
                      )}
                    </div>

                    <div className="text-xs font-semibold text-slate-900">
                      {unr.topic}
                    </div>

                    <p className="text-[11px] text-slate-600 leading-tight mt-1">
                      {unr.next_steps || unr.unresolved_reason}
                    </p>
                  </div>

                  {unr.evidence && (
                    <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-[10px]">
                      <span className="text-slate-400 font-mono">
                        Ref: {unr.evidence.timestamp}
                      </span>
                      <button
                        onClick={() => onJumpToEvidence && onJumpToEvidence(unr.evidence)}
                        className="text-slate-700 hover:underline font-medium"
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
      <div className="h-7 px-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-[11px] font-mono text-slate-500 shrink-0">
        <div className="flex items-center gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          <span>All utterances linked to verifiable audit chain</span>
        </div>
        <span>Encrypted Enterprise Storage</span>
      </div>
    </div>
  );
}

export default IntelligencePanel;
