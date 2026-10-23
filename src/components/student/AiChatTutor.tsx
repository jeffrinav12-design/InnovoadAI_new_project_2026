import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquare,
  Send,
  Sparkles,
  User,
  Bot,
  Volume2,
  Loader2,
  Trash2,
  BookOpen,
  Code,
  Table,
  Calculator,
  FileText,
  Globe,
  Copy,
  Check,
  Download,
  Zap,
} from 'lucide-react';
import { apiAiCopilot, apiChatTutor } from '../../lib/gemini';
import { VoiceInput } from '../common/VoiceInput';
import { AudioPlayer } from '../common/AudioPlayer';
import { TanglishAssistant } from '../common/TanglishAssistant';
import { UserProfile } from '../../types';
import { useSankaraClass } from '../../hooks/useSankaraClass';
import { useLanguage } from '../../contexts/LanguageContext';
import { School } from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'tutor';
  text: string;
  timestamp: string;
  engine?: string;
}

interface AiChatTutorProps {
  currentUser?: UserProfile;
}

export const AiChatTutor: React.FC<AiChatTutorProps> = ({ currentUser }) => {
  const { t } = useLanguage();
  const { activeSelection, currentSemesterSubjects, changeSubject } = useSankaraClass();

  const [modelType, setModelType] = useState<'gemini-3.8-flash' | 'chatgpt-academic'>('gemini-3.8-flash');
  const [selectedSubject, setSelectedSubject] = useState(activeSelection.subjectName);
  const [customSubject, setCustomSubject] = useState('');
  const [targetTopic, setTargetTopic] = useState('');

  // Sync when activeSelection changes
  useEffect(() => {
    setSelectedSubject(activeSelection.subjectName);
  }, [activeSelection.subjectName]);

  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm0',
      sender: 'tutor',
      text: `Hello ${currentUser?.name || 'Scholar'}! I am your **INNOVOADAI Academic Tutor**, powered by **Google Gemini 3.8 Flash** and **ChatGPT Academic Reasoning** engines.

You can ask any question from your syllabus in English or Tanglish:
- **13-Mark / 15-Mark University Answers**: Definition, architectural schematic, subsections & tips.
- **Code & Logic**: Clean Python, Java, C++, DSA with asymptotic complexity analysis.
- **Derivations & Formulas**: Step-by-step mathematical proofs with formula legends.
- **Viva Voce & Interview**: Practice conceptual oral exam questions.

Select your subject above or use the quick buttons below!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      engine: 'Google Gemini 3.8 Flash',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const activeSubjectName = customSubject.trim() || selectedSubject;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: `u_${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const data = await apiAiCopilot({
        message: query,
        role: 'student',
        modelType,
        copilotMode: 'student-tutor',
        subject: activeSubjectName,
        topic: targetTopic,
        conversationHistory: messages,
      });

      const tutorMsg: ChatMessage = {
        id: `t_${Date.now() + 1}`,
        sender: 'tutor',
        text: data?.reply || 'I am happy to assist you further with this topic!',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        engine: data?.engine || (modelType === 'gemini-3.8-flash' ? 'Google Gemini 3.8 Flash' : 'ChatGPT Academic Mode'),
      };

      setMessages((prev) => [...prev, tutorMsg]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePresetFormat = (formatType: string) => {
    let promptText = '';
    const activeTopic = targetTopic.trim() || activeSubjectName;

    if (formatType === 'exam') {
      promptText = `Provide a detailed 13-mark university exam answer format for "${activeTopic}" with definition, block diagram breakdown, detailed subsections, and Anna University exam tips.`;
    } else if (formatType === 'code') {
      promptText = `Write production-ready code with step-by-step comments, example output, and Time/Space Complexity analysis for "${activeTopic}".`;
    } else if (formatType === 'table') {
      promptText = `Provide a detailed comparison table with key parameters comparing approaches in "${activeTopic}".`;
    } else if (formatType === 'math') {
      promptText = `Show step-by-step mathematical formulation and formula derivation for "${activeTopic}".`;
    } else if (formatType === 'tanglish') {
      promptText = `Unit concept "${activeTopic}" pathi Tanglish la simple ah step-by-step explain pannu with exam tips.`;
    }

    if (promptText) {
      setInput(promptText);
      handleSend(promptText);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDownloadDoc = (text: string, title = 'Student_Study_Note') => {
    const htmlContent = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head><meta charset='utf-8'><title>${title}</title>
      <style>body { font-family: Calibri, Arial, sans-serif; line-height: 1.5; padding: 24px; } h1, h2, h3 { color: #0d9488; } table { border-collapse: collapse; width: 100%; margin-top: 12px; } th, td { border: 1px solid #cbd5e1; padding: 8px; text-align: left; } th { background-color: #f1f5f9; }</style>
      </head>
      <body>
        <h2>INNOVOADAI Student Study Material</h2>
        <p><strong>Student:</strong> ${currentUser?.name || 'Student'} | <strong>Subject:</strong> ${activeSubjectName} | <strong>Topic:</strong> ${targetTopic || 'General'}</p>
        <hr/>
        <div>${text.replace(/\n/g, '<br/>')}</div>
      </body>
      </html>
    `;
    const blob = new Blob([htmlContent], { type: 'application/msword;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title}_${Date.now()}.doc`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="h-[calc(100vh-120px)] flex flex-col rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden animate-fadeIn">
      {/* Header */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-600 text-white flex items-center justify-center shadow-sm">
              <Bot className="w-5 h-5 text-teal-100" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-extrabold text-slate-900 dark:text-white">
                  Student AI Chatbot
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-teal-50 text-teal-700 dark:bg-teal-950/80 dark:text-teal-300">
                  DUAL-ENGINE
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Conversational study assistance powered by Google Gemini 3.8 Flash & ChatGPT
              </p>
            </div>
          </div>

          {/* Model Engine Selector */}
          <div className="flex items-center gap-2 bg-slate-200/70 dark:bg-slate-800 p-1 rounded-xl self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setModelType('gemini-3.8-flash')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                modelType === 'gemini-3.8-flash'
                  ? 'bg-teal-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Gemini 3.8 Flash</span>
            </button>
            <button
              type="button"
              onClick={() => setModelType('chatgpt-academic')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                modelType === 'chatgpt-academic'
                  ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Bot className="w-3.5 h-3.5" />
              <span>ChatGPT Mode</span>
            </button>

            <button
              onClick={() =>
                setMessages([
                  {
                    id: 'm0',
                    sender: 'tutor',
                    text: 'Chat history cleared. Select your subject or topic and ask any question!',
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    engine: modelType === 'gemini-3.8-flash' ? 'Google Gemini 3.8 Flash' : 'ChatGPT Mode',
                  },
                ])
              }
              className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-white dark:hover:bg-slate-700 transition-colors ml-1 cursor-pointer"
              title="Clear Chat History"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Subject & Topic Context Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 pt-1 border-t border-slate-200/60 dark:border-slate-700/60">
          <div>
            <div className="flex items-center justify-between mb-0.5">
              <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                <BookOpen className="w-3 h-3 text-slate-700 dark:text-slate-300" /> Subject ({activeSelection.shortName} • Sem {activeSelection.semester})
              </label>
            </div>
            <select
              value={selectedSubject}
              onChange={(e) => {
                const val = e.target.value;
                setSelectedSubject(val);
                setCustomSubject('');
                const matching = currentSemesterSubjects.find((s) => s.name === val);
                if (matching) {
                  changeSubject(matching);
                  if (matching.topics && matching.topics.length > 0) {
                    setTargetTopic(matching.topics[0]);
                  }
                }
              }}
              className="w-full px-2.5 py-1.5 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
            >
              <optgroup label={`${activeSelection.programName} — Semester ${activeSelection.semester}`}>
                {currentSemesterSubjects.map((sub) => (
                  <option key={sub.code} value={sub.name}>
                    [{sub.code}] {sub.name}
                  </option>
                ))}
              </optgroup>
              <optgroup label="Other Options">
                <option value="Custom Subject">-- Other / Type Custom Subject --</option>
              </optgroup>
            </select>
          </div>

          {selectedSubject === 'Custom Subject' && (
            <div>
              <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 mb-0.5 block">
                Type Custom Subject Name
              </label>
              <input
                type="text"
                value={customSubject}
                onChange={(e) => setCustomSubject(e.target.value)}
                placeholder="e.g. Quantum Computing, VLSI, Organic Chem..."
                className="w-full px-2.5 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
              />
            </div>
          )}

          <div>
            <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 mb-0.5 block">
              Specific Topic / Question Context
            </label>
            <input
              type="text"
              value={targetTopic}
              onChange={(e) => setTargetTopic(e.target.value)}
              placeholder="e.g. Subnetting, A* Algorithm, SQL Joins..."
              className="w-full px-2.5 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
            />
          </div>
        </div>

        {/* Dynamic Format Quick Action Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-1 pb-0.5 text-[11px] scrollbar-thin">
          <span className="shrink-0 text-[10px] font-extrabold text-slate-400 uppercase tracking-wider pr-1">
            Format:
          </span>
          <button
            type="button"
            onClick={() => handlePresetFormat('exam')}
            className="shrink-0 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold border border-slate-200 dark:border-slate-700 transition-all flex items-center gap-1 cursor-pointer"
          >
            <FileText className="w-3 h-3" /> 13-Mark Exam Answer
          </button>
          <button
            type="button"
            onClick={() => handlePresetFormat('code')}
            className="shrink-0 px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/80 hover:bg-emerald-100 dark:hover:bg-emerald-900 text-emerald-800 dark:text-emerald-300 font-bold border border-emerald-200 dark:border-emerald-800 transition-all flex items-center gap-1 cursor-pointer"
          >
            <Code className="w-3 h-3" /> Step-by-Step Code
          </button>
          <button
            type="button"
            onClick={() => handlePresetFormat('table')}
            className="shrink-0 px-2.5 py-1 rounded-lg bg-teal-50 dark:bg-teal-950/80 hover:bg-teal-100 dark:hover:bg-teal-900 text-teal-800 dark:text-teal-300 font-bold border border-teal-200 dark:border-teal-800 transition-all flex items-center gap-1 cursor-pointer"
          >
            <Table className="w-3 h-3" /> Comparison Table
          </button>
          <button
            type="button"
            onClick={() => handlePresetFormat('math')}
            className="shrink-0 px-2.5 py-1 rounded-lg bg-amber-50 dark:bg-amber-950/80 hover:bg-amber-100 dark:hover:bg-amber-900 text-amber-800 dark:text-amber-300 font-bold border border-amber-200 dark:border-amber-800 transition-all flex items-center gap-1 cursor-pointer"
          >
            <Calculator className="w-3 h-3" /> Formula Derivation
          </button>
          <button
            type="button"
            onClick={() => handlePresetFormat('tanglish')}
            className="shrink-0 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold border border-slate-200 dark:border-slate-700 transition-all flex items-center gap-1 cursor-pointer"
          >
            <Globe className="w-3 h-3" /> Simple Tanglish Mode
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50/50 dark:bg-slate-900/50">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex gap-3 max-w-3xl ${m.sender === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-white font-bold text-xs ${
                m.sender === 'user' ? 'bg-slate-900 dark:bg-slate-700' : 'bg-teal-700 dark:bg-teal-600 shadow-sm'
              }`}
            >
              {m.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>

            <div
              className={`p-4 rounded-2xl text-xs leading-relaxed space-y-2.5 ${
                m.sender === 'user'
                  ? 'bg-slate-900 text-white rounded-tr-none dark:bg-slate-800'
                  : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-none border border-slate-200 dark:border-slate-700/80 shadow-xs'
              }`}
            >
              {m.sender === 'tutor' && m.engine && (
                <div className="flex items-center justify-between pb-1 border-b border-slate-100 dark:border-slate-700/50 text-[10px] font-bold text-teal-600 dark:text-teal-400">
                  <span className="flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> {m.engine}
                  </span>
                  <span className="text-slate-400 font-normal">{m.timestamp}</span>
                </div>
              )}

              <div className="whitespace-pre-line font-sans">{m.text}</div>

              <div className="flex items-center justify-between pt-1 opacity-80 text-[10px] border-t border-slate-100 dark:border-slate-700/40">
                <div className="flex items-center gap-2">
                  <span>{m.timestamp}</span>
                  {m.sender === 'tutor' && (
                    <>
                      <button
                        onClick={() => handleCopy(m.id, m.text)}
                        className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white flex items-center gap-1 cursor-pointer"
                        title="Copy text"
                      >
                        {copiedId === m.id ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-500" /> Copied
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" /> Copy
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => handleDownloadDoc(m.text, `Student_${targetTopic || 'StudyNote'}`)}
                        className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white flex items-center gap-1 cursor-pointer"
                        title="Download Word Document"
                      >
                        <Download className="w-3 h-3" /> Export DOC
                      </button>
                    </>
                  )}
                </div>
                {m.sender === 'tutor' && <AudioPlayer textToSpeak={m.text} label="Listen" />}
              </div>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex gap-3 max-w-md">
            <div className="w-8 h-8 rounded-full bg-teal-700 text-white flex items-center justify-center">
              <Bot className="w-4 h-4" />
            </div>
            <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs flex items-center gap-2 border border-slate-200 dark:border-slate-700 shadow-xs">
              <Loader2 className="w-4 h-4 animate-spin text-teal-600" />
              <span>
                {modelType === 'gemini-3.8-flash' ? 'Google Gemini 3.8 Flash' : 'ChatGPT Academic'}{' '}
                is synthesizing answers for <strong>{activeSubjectName}</strong>...
              </span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2">
        <TanglishAssistant
          onSelectPrompt={(txt) => {
            setInput(txt);
            handleSend(txt);
          }}
          compact={true}
        />

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <VoiceInput onTranscript={(txt) => handleSend(txt)} />
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`Ask AI Tutor about ${activeSubjectName} in English or Tanglish (${modelType === 'gemini-3.8-flash' ? 'Gemini 3.8 Flash' : 'ChatGPT Mode'})...`}
            className="flex-1 px-4 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500/20"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="p-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white transition-all disabled:opacity-50 cursor-pointer shadow-sm"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
