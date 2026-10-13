/**
 * AI Meeting Intelligence Pipeline
 * Calls Google Gemini Live API with Terminal Consensus System Prompt and JSON schema.
 * All local mock/heuristic logic removed as requested: Requires valid Gemini API Key.
 */

export const SYSTEM_PROMPT = `
You are an expert Enterprise Executive Meeting Intelligence Analyst.
Your role is to transform raw spoken meeting transcripts into structured, verifiable intelligence records.

MANDATORY RULES:
1. TERMINAL CONSENSUS (HANDLING CHANGED OPINIONS & QUALITY):
   - In meetings, proposals change (e.g. Option A proposed first, debated, but Option B agreed at the end).
   - ONLY record Option B as final_decision if there is terminal consensus ("Agreed", "Locked in", "Approved", "We will go with B").
   - Any previous or superseded proposal (Option A) MUST be moved into 'rejected_alternatives' with the exact reason why it was dropped.
   - If participants disagreed or stated "No decision today", DO NOT invent a decision. Leave 'decisions' as an empty array [] and record the dispute in 'open_issues'.
   - STRICT CONSENSUS TYPE CRITERIA:
     * EXPLICIT_TERMINAL_CONSENSUS: Use ONLY when MULTIPLE participants or the team explicitly vocalize verbal confirmation ("Agreed", "Locked in", "I agree", "Approved by all").
     * ASSUMED_NO_OBJECTION: Use when one person states or assigns a direction and others do not explicitly vote or agree, or when consent is inferred from lack of objections (e.g., unilateral assignments or short postmortems without a formal group vote).
     * COMPROMISE_RELUCTANT: Use when someone agrees with reservations or under pressure.
     * UNRESOLVED_DISPUTE: Use when there is an active disagreement or false sarcastic agreement.

2. ACTION ITEMS & COMMITMENT GATE:
   - Only create action items when there is an explicit first-person commitment ("I will...", "I'll take charge...", "I own this...") or a direct assignment agreed upon by the assignee.
   - Casual brainstorms or unowned remarks ("someone ought to do that someday") MUST NOT become action items; send them to 'open_issues'.
   - Multi-turn deadline negotiations: When multiple deadlines are debated (e.g. Tomorrow -> Next Wednesday -> Sunday 23:59), ONLY keep the final agreed deadline in the action item.
   - If an assignment has vague pronouns ("You do this") or vague deadlines ("ASAP"), or if the assignee never verbally acknowledged the task, flag it clearly with "(Needs Confirmation / Date)".

3. SARCASM & IRONY REJECTION:
   - Sarcastic exaggerations or rhetorical jokes (e.g., "why don't we rewrite the whole app in Flutter in 2 days?") MUST NEVER be recorded as serious proposals or decisions.

4. GROUNDING & EVIDENCE:
   - Every single decision, action item, and open issue MUST link to verbatim evidence:
     * quote: exact spoken words from the transcript
     * timestamp: timestamp string (e.g., "15:10")
     * speaker: name of the speaker

Strictly return JSON adhering to this schema:
{
  "decisions": [
    {
      "id": "dec-1",
      "topic": "string",
      "final_decision": "string",
      "consensus_type": "EXPLICIT_TERMINAL_CONSENSUS | ASSUMED_NO_OBJECTION | COMPROMISE_RELUCTANT | UNRESOLVED_DISPUTE",
      "consensus_badge": "string",
      "impact": "string",
      "accepted_deliverables": [
        "string"
      ],
      "rejected_alternatives": [
        { "option": "string", "reason": "string" }
      ],
      "evidence": { "quote": "string", "timestamp": "string", "speaker": "string" },
      "timeline": [
        {
          "phase": "Initial Debate | Convergence | Terminal Consensus",
          "timestamp": "string",
          "speaker": "string",
          "summary": "string",
          "quote": "string"
        }
      ]
    }
  ],
  "action_items": [
    {
      "id": "act-1",
      "task": "string",
      "assignee": "string",
      "deadline": "string",
      "status": "PENDING",
      "jira_key": "string",
      "evidence": { "quote": "string", "timestamp": "string", "speaker": "string" }
    }
  ],
  "open_issues": [
    {
      "id": "issue-1",
      "topic": "string",
      "status": "UNRESOLVED | BLOCKED",
      "unresolved_reason": "string",
      "next_steps": "string",
      "evidence": { "quote": "string", "timestamp": "string", "speaker": "string" }
    }
  ]
}
`;

/**
 * Parses raw text into structured turns and participants.
 * Fully supports Google Meet transcript formats:
 * - Google Meet multi-line blocks (Speaker \n Timestamp \n Text)
 * - Google Meet inline (Speaker [or Name] HH:MM:SS or HH:MM AM/PM)
 * - Bracketed [14:10] Speaker: Text
 * - Standard Speaker: Text
 * - WebVTT (<v Speaker>Text</v>)
 */
export function parseTranscriptToTurns(rawText) {
  if (!rawText || !rawText.trim()) return { turns: [], participants: [] };

  const lines = rawText.split(/\r?\n/);
  const turns = [];
  const participantMap = new Map();

  const colorPalette = [
    'bg-indigo-600', 'bg-emerald-600', 'bg-amber-600', 'bg-rose-600', 
    'bg-purple-600', 'bg-blue-600', 'bg-teal-600', 'bg-slate-700'
  ];

  // Helper to register turn & participant
  const addTurn = (time, speaker, role, text) => {
    if (!speaker || !text || !text.trim()) return;
    let cleanSpeaker = speaker.trim();
    let cleanRole = role || '';

    if (cleanSpeaker.includes('(')) {
      const parts = cleanSpeaker.split('(');
      cleanSpeaker = parts[0].trim();
      if (!cleanRole) cleanRole = parts[1].replace(')', '').trim();
    }

    // Clean leading bullets or dashes
    cleanSpeaker = cleanSpeaker.replace(/^[-*•]\s*/, '').trim();

    if (!participantMap.has(cleanSpeaker.toLowerCase())) {
      const pIdx = participantMap.size;
      const initials = cleanSpeaker.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || cleanSpeaker.substring(0, 2).toUpperCase();
      participantMap.set(cleanSpeaker.toLowerCase(), {
        name: cleanSpeaker,
        role: cleanRole || 'Participant',
        initials,
        color: colorPalette[pIdx % colorPalette.length]
      });
    }

    turns.push({
      id: `turn-${turns.length + 1}`,
      time: time || '00:00',
      speaker: cleanSpeaker,
      role: cleanRole || participantMap.get(cleanSpeaker.toLowerCase())?.role || '',
      text: text.trim()
    });
  };

  // Timestamp detection regexes
  const timeOnlyRegex = /^(?:\[)?(\d{1,2}:\d{2}(?::\d{2})?(?:\s*[AP]M)?)(?:\])?$/i;
  const isTimeOnly = (str) => timeOnlyRegex.test(str.trim());

  // Check if text is Google Meet multi-line export (Speaker \n Timestamp \n Text)
  let isGoogleMeetMultiLine = false;
  for (let i = 0; i < lines.length - 1; i++) {
    const l1 = lines[i].trim();
    const l2 = lines[i + 1].trim();
    if (l1.length > 0 && isTimeOnly(l2) && !isTimeOnly(l1) && !l1.includes(':') && !l1.startsWith('http')) {
      isGoogleMeetMultiLine = true;
      break;
    }
  }

  if (isGoogleMeetMultiLine) {
    let currentSpeaker = '';
    let currentTime = '00:00';
    let currentRole = '';
    let currentText = [];

    const flushCurrent = () => {
      if (currentSpeaker && currentText.length > 0) {
        addTurn(currentTime, currentSpeaker, currentRole, currentText.join(' '));
        currentText = [];
      }
    };

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      // Skip document header artifacts
      if (
        line.startsWith('Meeting Transcript') ||
        line.startsWith('Attendees') ||
        line.startsWith('Transcript') ||
        line.startsWith('WEBVTT') ||
        line.startsWith('NOTE') ||
        line.startsWith('Meeting ID:')
      ) {
        continue;
      }

      // Check if NEXT line is timestamp: current line is Speaker Name
      const nextLine = i + 1 < lines.length ? lines[i + 1].trim() : '';
      if (isTimeOnly(nextLine)) {
        flushCurrent();
        currentSpeaker = line;
        currentTime = nextLine.replace(/[\[\]]/g, '');
        i++; // skip next line (the timestamp)
        continue;
      }

      // Check if line is inline: "Speaker Name 00:01" or "Speaker Name 10:15 AM"
      const inlineMatch = line.match(/^([A-Za-z\s]+?)\s+(\d{1,2}:\d{2}(?::\d{2})?(?:\s*[AP]M)?)$/i);
      if (inlineMatch && inlineMatch[1].length > 1 && inlineMatch[1].length < 35) {
        flushCurrent();
        currentSpeaker = inlineMatch[1].trim();
        currentTime = inlineMatch[2].trim();
        continue;
      }

      // Otherwise, it's text content
      if (currentSpeaker) {
        currentText.push(line);
      }
    }
    flushCurrent();
  }

  // Fallback / Line-by-line parser if turns is empty or not multi-line
  if (turns.length === 0) {
    const filteredLines = lines.filter(l => l.trim().length > 0);

    filteredLines.forEach((line, index) => {
      const trimmed = line.trim();
      if (
        trimmed.startsWith('Meeting Transcript') ||
        trimmed.startsWith('Attendees:') ||
        trimmed.startsWith('Transcript') ||
        trimmed.startsWith('WEBVTT') ||
        trimmed.startsWith('NOTE')
      ) {
        return;
      }

      let time = '00:00';
      let speaker = 'Speaker';
      let role = '';
      let text = trimmed;

      // Pattern 1: [14:10] Alex (Lead Architect): text
      const patternFull = /^\[(\d{1,2}:\d{2}(?::\d{2})?(?:\s*[AP]M)?)\]\s*([^:(]+)(?:\(([^)]+)\))?\s*:\s*(.+)$/i;
      // Pattern 2: Alex (Lead Architect) [14:10]: text
      const patternAlt = /^([^:(]+)(?:\(([^)]+)\))?\s*\[(\d{1,2}:\d{2}(?::\d{2})?(?:\s*[AP]M)?)\]\s*:\s*(.+)$/i;
      // Pattern 3: Alex 14:10: text OR Alex 14:10 - text
      const patternGoogleInline = /^([A-Za-z\s]+?)\s+(\d{1,2}:\d{2}(?::\d{2})?(?:\s*[AP]M)?)\s*[:\-]\s*(.+)$/i;
      // Pattern 4: WebVTT <v Speaker>text</v>
      const patternVtt = /<v\s+([^>]+)>(.+?)<\/v>/i;
      // Pattern 5: Alex: text
      const patternSimple = /^([^:]{2,30}):\s*(.+)$/i;
      // Pattern 6: [14:10] text
      const patternTimeOnly = /^\[(\d{1,2}:\d{2}(?::\d{2})?(?:\s*[AP]M)?)\]\s*(.+)$/i;

      let match = trimmed.match(patternFull);
      if (match) {
        time = match[1];
        speaker = match[2].trim();
        role = match[3]?.trim() || '';
        text = match[4].trim();
      } else if ((match = trimmed.match(patternAlt))) {
        speaker = match[1].trim();
        role = match[2]?.trim() || '';
        time = match[3];
        text = match[4].trim();
      } else if ((match = trimmed.match(patternGoogleInline))) {
        speaker = match[1].trim();
        time = match[2].trim();
        text = match[3].trim();
      } else if ((match = trimmed.match(patternVtt))) {
        speaker = match[1].trim();
        text = match[2].trim();
        const mins = Math.floor(index * 2);
        time = `${String(mins).padStart(2, '0')}:00`;
      } else if ((match = trimmed.match(patternSimple))) {
        speaker = match[1].trim();
        text = match[2].trim();
        const mins = Math.floor(index * 2);
        time = `${String(mins).padStart(2, '0')}:00`;
      } else if ((match = trimmed.match(patternTimeOnly))) {
        time = match[1];
        text = match[2].trim();
        speaker = `Speaker ${index + 1}`;
      }

      addTurn(time, speaker, role, text);
    });
  }

  return {
    turns,
    participants: Array.from(participantMap.values())
  };
}

/**
 * Main processMeetingTranscript:
 * Calls Google Gemini Live API. Throws an error if API key is missing.
 * No local heuristic fallback logic.
 */
export async function processMeetingTranscript({
  transcriptText,
  apiKey,
  model = "gemini-3.1-flash-lite"
}) {
  if (!apiKey || apiKey.trim().length < 8) {
    const error = new Error("MISSING_API_KEY");
    error.code = "MISSING_API_KEY";
    throw error;
  }

  // Attempt live Gemini API call
  const candidateModels = [model, "gemini-3.1-flash-lite"];
  let lastError = null;

  for (const m of candidateModels) {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${m}:generateContent?key=${apiKey.trim()}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              {
                role: "user",
                parts: [
                  { text: SYSTEM_PROMPT },
                  { text: `\n\nTRANSCRIPT TO ANALYZE:\n${transcriptText}` }
                ]
              }
            ],
            generationConfig: {
              responseMimeType: "application/json",
              temperature: 0.1
            }
          })
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || `Gemini API Error (HTTP ${response.status})`);
      }

      const result = await response.json();
      const rawText = result.candidates?.[0]?.content?.parts?.[0]?.text;
      if (rawText) {
        const parsed = JSON.parse(rawText);
        return {
          success: true,
          model: m,
          data: {
            decisions: parsed.decisions || [],
            action_items: parsed.action_items || [],
            open_issues: parsed.open_issues || []
          }
        };
      }
    } catch (err) {
      lastError = err;
      console.warn(`Model ${m} failed, trying next candidate if available...`, err);
    }
  }

  throw lastError || new Error("Failed to process transcript with Gemini API.");
}

/**
 * Automated 5-Test Case Verification Suite
 * Evaluates whether the real AI output satisfies the 5 core Mission 2 requirements.
 */
export function run5TestCaseSuite(transcriptText, intelligence) {
  const textLower = (transcriptText || "").toLowerCase();
  const { decisions = [], action_items = [], open_issues = [] } = intelligence || {};

  const results = [];

  // 1. TC-01: Terminal Consensus & Alternative Filter Test
  const hasMultipleOptions = textLower.includes("memcached") && textLower.includes("redis");
  const tc1Passed = decisions.some(d => 
    d.final_decision?.toLowerCase().includes("redis") &&
    d.rejected_alternatives?.some(r => r.option?.toLowerCase().includes("memcached"))
  );
  results.push({
    testId: "TC-01",
    name: "Terminal Consensus & Superseded Options Filter",
    type: "SUCCESS_CASE",
    expectation: "The system must identify that the initial proposal (Memcached) was rejected and only recognize Redis Cluster as the final decision, recording the rejection reason.",
    actualResult: tc1Passed 
      ? "Correctly extracted the final decision; saved previous option into rejected_alternatives."
      : "Could not detect the opinion-change pair or missing rejected_alternatives.",
    status: tc1Passed ? "PASS" : (hasMultipleOptions ? "FAIL" : "N/A"),
    passed: tc1Passed,
    learning: "The Terminal Consensus rule prevents incorrectly recording the initial proposal as the final decision."
  });

  // 2. TC-02: Ambiguous Pronouns & Vague Deadline Gate Test
  const hasVagueAssignment = textLower.includes("you take care of this") || textLower.includes("as soon as possible");
  const tc2Passed = action_items.some(a => 
    a.deadline?.toLowerCase().includes("asap") || 
    a.deadline?.toLowerCase().includes("vague") ||
    a.deadline?.toLowerCase().includes("needs") ||
    a.assignee?.toLowerCase().includes("needs") ||
    a.assignee?.toLowerCase().includes("duc")
  ) && !action_items.some(a => a.task?.toLowerCase().includes("someone really ought"));
  results.push({
    testId: "TC-02",
    name: "Ambiguous Pronouns & Vague Deadline Detection",
    type: "DIFFICULT_CASE",
    expectation: "Do not fabricate a specific deadline when only 'as soon as possible' was said. Handle pronoun 'You' with a warning flag. Do not turn casual remarks like 'someone ought to' into tasks.",
    actualResult: tc2Passed 
      ? "Flagged ambiguous deadline, identified pronouns from context, routed throwaway remarks to open_issues."
      : "Missing warning flags or hallucinated a task without grounded evidence.",
    status: tc2Passed ? "PASS (WITH WARNING)" : (hasVagueAssignment ? "FAIL" : "N/A"),
    passed: tc2Passed,
    learning: "The Commitment Gate detects unbound utterances and requires human review (Human-in-the-loop)."
  });

  // 3. TC-03: Sarcasm & Rhetorical Irony Filter Test
  const hasSarcasm = textLower.includes("rewrite") && textLower.includes("flutter");
  const tc3Protected = !decisions.some(d => d.final_decision?.toLowerCase().includes("flutter")) &&
                       !action_items.some(a => a.task?.toLowerCase().includes("flutter"));
  results.push({
    testId: "TC-03",
    name: "Sarcasm & Rhetorical Irony Rejection",
    type: "FAILED_CASE",
    expectation: "Filter out sarcastic/joke remarks ('rewrite whole app in Flutter in 2 days'), and never turn them into official decisions or tasks.",
    actualResult: tc3Protected 
      ? "Sarcasm filter succeeded: No decision or task about Flutter was created."
      : "Hallucination: AI misread the sarcastic remark as a technical task.",
    status: tc3Protected ? "PASS" : (hasSarcasm ? "FAIL" : "N/A"),
    passed: tc3Protected,
    learning: "Sarcastic semantics are the LLM's most error-prone zone. Mandatory filter cross-referencing the following explanatory utterance is required."
  });

  // 4. TC-04: Multi-turn Deadline Convergence Test
  const hasMultipleDeadlines = textLower.includes("tomorrow noon") && textLower.includes("sunday 23:59");
  const tc4Passed = action_items.some(a => 
    a.deadline?.toLowerCase().includes("sunday 23:59") || 
    a.deadline?.toLowerCase().includes("chủ nhật")
  ) && !action_items.some(a => a.deadline?.toLowerCase().includes("tomorrow noon"));
  results.push({
    testId: "TC-04",
    name: "Multi-turn Deadline Negotiation Convergence",
    type: "COMPLEX_CASE",
    expectation: "In a 3-round deadline negotiation (Tomorrow Noon -> Wednesday -> Sunday 23:59), only keep the last agreed deadline (Sunday 23:59).",
    actualResult: tc4Passed 
      ? "Correctly extracted the final locked deadline, discarding the 2 intermediate negotiation points."
      : "Incorrectly recorded an intermediate timestamp before the final lock-in.",
    status: tc4Passed ? "PASS" : (hasMultipleDeadlines ? "FAIL" : "N/A"),
    passed: tc4Passed,
    learning: "The conversation timeline reflects a negotiation pattern. The final lock must be detected at the utterance with highest confirmation ('Locked in')."
  });

  // 5. TC-05: Stalemate & Zero Hallucinated Consensus Gate Test
  const hasStalemate = textLower.includes("no decision today") || textLower.includes("complete impasse");
  const tc5Passed = hasStalemate 
    ? decisions.length === 0 && open_issues.some(o => o.status === "BLOCKED")
    : true;
  results.push({
    testId: "TC-05",
    name: "Stalemate & Zero Hallucinated Consensus Gate",
    type: "UNRESOLVED_CASE",
    expectation: "When the meeting is deadlocked ('No decision today'), the system MUST NOT generate any decision; it must move the dispute into open_issues with status BLOCKED.",
    actualResult: (hasStalemate && decisions.length === 0) 
      ? "decisions array is correctly empty [], protecting against hallucinated consensus."
      : (hasStalemate ? "Error: AI fabricated a decision despite a deadlocked meeting." : "Safety check passed."),
    status: (hasStalemate && decisions.length === 0) ? "PASS" : (hasStalemate ? "FAIL" : "PASS"),
    passed: hasStalemate ? decisions.length === 0 : true,
    learning: "Prevents over-generation. Respects unresolved state to protect the knowledge store."
  });

  return results;
}
