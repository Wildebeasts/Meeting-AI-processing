import React, { useState, useEffect } from 'react';
import { MOCK_MEETINGS } from './data/mockMeetings';
import { processMeetingTranscript } from './services/aiPipeline';
import { Header } from './components/Header';
import { TranscriptView } from './components/TranscriptView';
import { IntelligencePanel } from './components/IntelligencePanel';
import { TestBenchModal } from './components/TestBenchModal';
import { MissionQuestionsModal } from './components/MissionQuestionsModal';
import { ApiKeyModal } from './components/ApiKeyModal';
import { ExportModal } from './components/ExportModal';

export function App() {
  const [meetings, setMeetings] = useState(MOCK_MEETINGS);
  const [selectedMeetingId, setSelectedMeetingId] = useState(MOCK_MEETINGS[0].id);
  const [currentMeeting, setCurrentMeeting] = useState(MOCK_MEETINGS[0]);
  const [intelligence, setIntelligence] = useState(MOCK_MEETINGS[0].intelligence);
  const [isProcessing, setIsProcessing] = useState(false);
  const [highlightedTurnId, setHighlightedTurnId] = useState(null);
  const [currentTime, setCurrentTime] = useState('15:10');

  // Modals
  const [testBenchOpen, setTestBenchOpen] = useState(false);
  const [questionsOpen, setQuestionsOpen] = useState(false);
  const [apiKeyOpen, setApiKeyOpen] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);

  // Local storage API Key
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('GEMINI_API_KEY') || '');

  // Sync selected meeting
  useEffect(() => {
    const found = meetings.find((m) => m.id === selectedMeetingId) || meetings[0];
    setCurrentMeeting(found);
    setIntelligence(found.intelligence);
    setHighlightedTurnId(null);
  }, [selectedMeetingId, meetings]);

  const handleSaveApiKey = (newKey) => {
    setApiKey(newKey);
    localStorage.setItem('GEMINI_API_KEY', newKey);
  };

  // Jump to evidence quote & timestamp in transcript
  const handleJumpToEvidence = (evidence) => {
    if (!evidence) return;
    setCurrentTime(evidence.timestamp);

    // Find matching turn in transcript
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

  // Reprocess AI extraction
  const handleReprocess = async () => {
    setIsProcessing(true);
    try {
      const transcriptText = currentMeeting.transcript
        .map((t) => `[${t.time}] ${t.speaker} (${t.role || ''}): ${t.text}`)
        .join('\n');

      const result = await processMeetingTranscript({
        transcriptText,
        apiKey,
        fallbackData: currentMeeting.intelligence
      });

      if (result.success && result.data) {
        setIntelligence(result.data);
      }
    } catch (err) {
      console.error('Reprocess failed:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-[#f8fafc]">
      {/* Top Application Header */}
      <Header
        meeting={currentMeeting}
        selectedMeetingId={selectedMeetingId}
        onSelectMeeting={setSelectedMeetingId}
        allMeetings={meetings}
        isProcessing={isProcessing}
        onReprocess={handleReprocess}
        onOpenTestBench={() => setTestBenchOpen(true)}
        onOpenQuestions={() => setQuestionsOpen(true)}
        onOpenApiKeyModal={() => setApiKeyOpen(true)}
        onOpenExportModal={() => setExportOpen(true)}
        hasApiKey={Boolean(apiKey)}
      />

      {/* Main Split Layout: 45% Transcript | 55% Intelligence */}
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden border-t border-slate-200">
        {/* Left Pane: Transcript Review */}
        <section className="lg:col-span-5 xl:col-span-5 h-full overflow-hidden border-b lg:border-b-0 border-slate-200">
          <TranscriptView
            transcript={currentMeeting.transcript}
            participants={currentMeeting.participants}
            highlightedTurnId={highlightedTurnId}
            onTurnClick={(turn) => {
              setHighlightedTurnId(turn.id);
              setCurrentTime(turn.time);
            }}
            currentTime={currentTime}
          />
        </section>

        {/* Right Pane: Extracted Intelligence */}
        <section className="lg:col-span-7 xl:col-span-7 h-full overflow-hidden">
          <IntelligencePanel
            intelligence={intelligence}
            onJumpToEvidence={handleJumpToEvidence}
            onToggleActionStatus={handleToggleActionStatus}
          />
        </section>
      </main>

      {/* Modals */}
      <TestBenchModal
        isOpen={testBenchOpen}
        onClose={() => setTestBenchOpen(false)}
        meetings={meetings}
        onSelectMeeting={setSelectedMeetingId}
      />

      <MissionQuestionsModal
        isOpen={questionsOpen}
        onClose={() => setQuestionsOpen(false)}
      />

      <ApiKeyModal
        isOpen={apiKeyOpen}
        onClose={() => setApiKeyOpen(false)}
        apiKey={apiKey}
        onSaveApiKey={handleSaveApiKey}
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
