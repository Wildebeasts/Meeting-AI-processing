import React, { useState, useEffect } from 'react';
import { 
  processMeetingTranscript, 
  parseTranscriptToTurns
} from './services/aiPipeline';
import { Header } from './components/Header';
import { TranscriptView } from './components/TranscriptView';
import { IntelligencePanel } from './components/IntelligencePanel';
import { ApiKeyModal } from './components/ApiKeyModal';
import { ExportModal } from './components/ExportModal';
import { AlertTriangle } from 'lucide-react';

export function App() {
  const [meetings, setMeetings] = useState([]);
  const [selectedMeetingId, setSelectedMeetingId] = useState('new');

  // Initial meeting is blank (no transcript) as requested
  const [currentMeeting, setCurrentMeeting] = useState({
    id: 'new',
    title: 'New Session',
    date: 'Awaiting transcript',
    duration: '0m',
    participants: [],
    transcript: [],
    intelligence: { decisions: [], action_items: [], open_issues: [] }
  });

  const [intelligence, setIntelligence] = useState({ decisions: [], action_items: [], open_issues: [] });
  const [isProcessing, setIsProcessing] = useState(false);
  const [highlightedTurnId, setHighlightedTurnId] = useState(null);
  const [currentTime, setCurrentTime] = useState('00:00');

  // Error / Alert state
  const [errorMessage, setErrorMessage] = useState('');
  const [apiKeyNotice, setApiKeyNotice] = useState(false);
  const [pendingTranscript, setPendingTranscript] = useState(null);

  // Modals
  const [apiKeyOpen, setApiKeyOpen] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);

  // Local storage API Key
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('GEMINI_API_KEY') || '');

  // Dark / Light Theme state
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('axiom_theme') || 'light';
  });

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      localStorage.setItem('axiom_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('axiom_theme', 'light');
    }
  }, [theme]);

  const handleToggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  // Handle switching meeting via dropdown
  const handleSelectMeeting = (meetingId) => {
    setSelectedMeetingId(meetingId);
    if (meetingId === 'new') {
      handleClearTranscript();
      return;
    }

    const found = meetings.find((m) => m.id === meetingId);
    if (found) {
      setCurrentMeeting(found);
      setIntelligence(found.intelligence);
      setHighlightedTurnId(null);
    }
  };

  const handleSaveApiKey = (newKey) => {
    setApiKey(newKey);
    localStorage.setItem('GEMINI_API_KEY', newKey);
    setApiKeyNotice(false);

    // If there was a pending transcript waiting for API key, trigger AI processing now!
    if (pendingTranscript) {
      const textToProcess = pendingTranscript;
      setPendingTranscript(null);
      setTimeout(() => {
        executeAiProcessing(textToProcess, newKey);
      }, 100);
    }
  };

  // Jump to evidence quote & timestamp in transcript
  const handleJumpToEvidence = (evidence) => {
    if (!evidence || !currentMeeting?.transcript) return;
    setCurrentTime(evidence.timestamp);

    const matchingTurn = currentMeeting.transcript.find(
      (t) =>
        t.time === evidence.timestamp ||
        t.text.toLowerCase().includes(evidence.quote.substring(0, 20).toLowerCase())
    );

    if (matchingTurn) {
      setHighlightedTurnId(matchingTurn.id);
      const element = document.getElementById(`turn-${matchingTurn.id}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  };

  // 1-Click Verification of Action Items
  const handleToggleActionStatus = (actionId) => {
    setIntelligence((prev) => {
      const updatedActions = prev.action_items.map((act) => {
        if (act.id === actionId) {
          const nextStatus = act.status === 'VERIFIED' ? 'PENDING' : 'VERIFIED';
          return { ...act, status: nextStatus };
        }
        return act;
      });
      return { ...prev, action_items: updatedActions };
    });
  };

  // 1-Click Verification of Decisions (Highlights Consensus Anchor in green)
  const handleToggleDecisionStatus = (decisionId) => {
    setIntelligence((prev) => {
      const updatedDecisions = prev.decisions.map((dec, idx) => {
        const id = dec.id || `dec-${idx}`;
        if (id === decisionId) {
          const nextStatus = dec.status === 'VERIFIED' ? 'UNVERIFIED' : 'VERIFIED';
          return { ...dec, status: nextStatus };
        }
        return dec;
      });
      return { ...prev, decisions: updatedDecisions };
    });
  };

  // Clear transcript and make the left side blank / input mode
  const handleClearTranscript = () => {
    const blankMeeting = {
      id: 'new',
      title: 'New Session',
      date: 'Awaiting transcript',
      duration: '0m',
      participants: [],
      transcript: [],
      intelligence: { decisions: [], action_items: [], open_issues: [] }
    };
    setSelectedMeetingId('new');
    setCurrentMeeting(blankMeeting);
    setIntelligence(blankMeeting.intelligence);
    setHighlightedTurnId(null);
    setErrorMessage('');
  };

  // When user inputs a transcript from the left side
  const handleInputTranscript = (rawText) => {
    if (!rawText || !rawText.trim()) return;

    // Check if API key is provided
    if (!apiKey || apiKey.trim().length < 8) {
      setPendingTranscript(rawText.trim());
      setApiKeyNotice(true);
      setApiKeyOpen(true);
      return;
    }

    executeAiProcessing(rawText.trim(), apiKey);
  };

  // Real AI Execution via Gemini API (No local logic)
  const executeAiProcessing = async (transcriptText, activeKey) => {
    setIsProcessing(true);
    setErrorMessage('');
    try {
      // 1. Parse into speech turns and participant monograms
      const { turns, participants } = parseTranscriptToTurns(transcriptText);

      // 2. Call real Gemini API
      const result = await processMeetingTranscript({
        transcriptText,
        apiKey: activeKey
      });

      const extractedData = result.data || { decisions: [], action_items: [], open_issues: [] };

      // 3. Construct updated meeting object
      const updatedMeeting = {
        id: `meeting-${Date.now()}`,
        title: "Meeting Analysis",
        date: `Live · ${result.model || 'Gemini'}`,
        duration: `${Math.max(15, turns.length * 2)}m`,
        participants: participants.length > 0 ? participants : [
          { name: "Speaker 1", role: "Contributor", initials: "S1", color: "bg-slate-700" }
        ],
        transcript: turns,
        intelligence: extractedData
      };

      setMeetings((prev) => [updatedMeeting, ...prev]);
      setSelectedMeetingId(updatedMeeting.id);
      setCurrentMeeting(updatedMeeting);
      setIntelligence(extractedData);
    } catch (err) {
      console.error("Gemini AI Processing Error:", err);
      if (err.message === "MISSING_API_KEY") {
        setApiKeyNotice(true);
        setApiKeyOpen(true);
      } else {
        setErrorMessage(err.message || "Error connecting to Gemini API. Please check your API key or account quota.");
      }
    } finally {
      setIsProcessing(false);
    }
  };

  // Re-run AI extraction on current active transcript
  const handleReprocess = () => {
    if (!currentMeeting?.transcript || currentMeeting.transcript.length === 0) return;
    const transcriptText = currentMeeting.transcript
      .map((t) => `[${t.time}] ${t.speaker} (${t.role || ''}): ${t.text}`)
      .join('\n');
    handleInputTranscript(transcriptText);
  };

  const hasTranscript = Boolean(currentMeeting?.transcript && currentMeeting.transcript.length > 0);

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-[#f8fafc] dark:bg-[#0b0f17] transition-colors">
      {/* Top Application Header */}
      <Header
        meeting={currentMeeting}
        selectedMeetingId={selectedMeetingId}
        onSelectMeeting={handleSelectMeeting}
        allMeetings={[
          { id: 'new', title: '+ New Transcript' },
          ...meetings
        ]}
        isProcessing={isProcessing}
        onReprocess={handleReprocess}
        onOpenApiKeyModal={() => setApiKeyOpen(true)}
        onOpenExportModal={() => setExportOpen(true)}
        hasApiKey={Boolean(apiKey)}
        theme={theme}
        onToggleTheme={handleToggleTheme}
      />

      {/* Error / Missing API Key Alert Banner */}
      {errorMessage && (
        <div className="px-4 py-2 bg-rose-50 dark:bg-rose-950/60 border-b border-rose-200 dark:border-rose-900 text-rose-800 dark:text-rose-200 text-xs flex items-center justify-between select-none">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
            <span>{errorMessage}</span>
          </div>
          <button 
            onClick={() => setErrorMessage('')}
            className="text-[11px] underline font-mono ml-4"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Floating Status Bar */}
      <div className="h-6 px-4 bg-slate-100 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2 text-[11px] font-mono text-slate-600 dark:text-slate-400 select-none transition-colors">
        <span className={`w-1.5 h-1.5 rounded-full ${apiKey ? 'bg-emerald-600 dark:bg-emerald-400' : 'bg-amber-500'}`} />
        <span className="font-semibold text-slate-800 dark:text-slate-200">
          {apiKey ? 'Live AI — Gemini 3.1 Flash Lite' : 'No API Key configured (required to run AI)'}
        </span>
      </div>

      {/* Main Split Layout: 45% Transcript Input / Stream | 55% Intelligence */}
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
        {/* Left Pane: Blank Input Area / Dropzone OR Active Transcript View */}
        <section className="lg:col-span-5 xl:col-span-5 h-full overflow-hidden border-b lg:border-b-0 border-slate-200 dark:border-slate-800">
          <TranscriptView
            transcript={currentMeeting.transcript}
            participants={currentMeeting.participants}
            decisions={intelligence.decisions}
            highlightedTurnId={highlightedTurnId}
            onTurnClick={(turn) => {
              setHighlightedTurnId(turn.id);
              setCurrentTime(turn.time);
            }}
            onSubmitTranscript={handleInputTranscript}
            onClearTranscript={handleClearTranscript}
            isProcessing={isProcessing}
          />
        </section>

        {/* Right Pane: Extracted Intelligence */}
        <section className="lg:col-span-7 xl:col-span-7 h-full overflow-hidden">
          <IntelligencePanel
            intelligence={intelligence}
            onJumpToEvidence={handleJumpToEvidence}
            onToggleActionStatus={handleToggleActionStatus}
            onToggleDecisionStatus={handleToggleDecisionStatus}
          />
        </section>
      </main>

      {/* Modals */}
      <ApiKeyModal
        isOpen={apiKeyOpen}
        onClose={() => {
          setApiKeyOpen(false);
          setApiKeyNotice(false);
        }}
        apiKey={apiKey}
        onSaveApiKey={handleSaveApiKey}
        requiredNotice={apiKeyNotice}
      />

      <ExportModal
        isOpen={exportOpen}
        onClose={() => setExportOpen(false)}
        meeting={currentMeeting}
        intelligence={intelligence}
      />
    </div>
  );
}

export default App;
