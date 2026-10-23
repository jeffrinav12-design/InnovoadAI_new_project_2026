import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Bot,
  User,
  Send,
  Loader2,
  Trash2,
  Copy,
  Check,
  Download,
  Zap,
  RotateCcw,
  MessageSquare,
  Lightbulb,
  Code2,
  HelpCircle,
  BookOpen,
} from 'lucide-react';
import { apiAiCopilot } from '../../lib/gemini';
import { AudioPlayer } from '../common/AudioPlayer';
import { VoiceInput } from '../common/VoiceInput';
import { UserProfile } from '../../types';

interface FacultyAiCopilotProps {
  currentUser?: UserProfile;
}

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  engine?: string;
}

const CHATBOT_PROMPT_SUGGESTIONS = [
  {
    icon: Lightbulb,
    title: 'Explain Complex Concept',
    prompt: 'Explain Gradient Descent optimization with an intuitive real-world analogy and step-by-step intuition.',
  },
  {
    icon: MessageSquare,
    title: 'Classroom Discussion Prompts',
    prompt: 'Give me 5 thought-provoking classroom discussion questions on the ethical implications of autonomous AI agents.',
  },
  {
    icon: Code2,
    title: 'Code Example with Walkthrough',
    prompt: 'Write a clean, documented Python implementation of Dijkstra algorithm with Time and Space complexity analysis.',
  },
  {
    icon: HelpCircle,
    title: 'Quick Concept Check Quiz',
    prompt: 'Draft 4 conceptual multiple-choice questions with answer explanations for a quick mid-class comprehension check on Cache Memory.',
  },
];

export const FacultyAiCopilot: React.FC<FacultyAiCopilotProps> = ({ currentUser }) => {
  const [modelType, setModelType] = useState<'gemini-3.8-flash' | 'chatgpt-academic'>('gemini-3.8-flash');
  const [input, setInput] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const facultyGreeting = `Hello Professor ${currentUser?.name || ''}! I am your **Faculty AI Chatbot**, powered by **Google Gemini 3.8 Flash** and **ChatGPT**.

How can I help you today? You can ask me any question, ask for code examples, lecture topic explanations, quiz questions, or discuss academic ideas. You can also switch between Gemini and ChatGPT anytime!`;

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm0',
      sender: 'assistant',
      text: facultyGreeting,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      engine: 'Google Gemini 3.8 Flash',
    },
  ]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = async (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query || loading) return;

    const userMsg: Message = {
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
        role: 'faculty',
        modelType,
        copilotMode: 'general',
        department: currentUser?.department,
        conversationHistory: messages,
      });

      const assistantMsg: Message = {
        id: `a_${Date.now() + 1}`,
        sender: 'assistant',
        text: data?.reply || 'I am ready to help you further with that. What would you like to explore next?',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        engine: data?.engine || (modelType === 'gemini-3.8-flash' ? 'Google Gemini 3.8 Flash' : 'ChatGPT Academic Mode'),
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      console.error('Faculty chatbot error:', err);
      const fallbackMsg: Message = {
        id: `a_${Date.now() + 1}`,
        sender: 'assistant',
        text: 'I encountered a brief connection issue. Please feel free to ask again!',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        engine: modelType === 'gemini-3.8-flash' ? 'Google Gemini 3.8 Flash' : 'ChatGPT Academic Mode',
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: `m_${Date.now()}`,
        sender: 'assistant',
        text: `Chat session refreshed! How can I assist you right now, Professor ${currentUser?.name || ''}?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        engine: modelType === 'gemini-3.8-flash' ? 'Google Gemini 3.8 Flash' : 'ChatGPT Academic',
      },
    ]);
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDownloadDoc = (text: string, title = 'Faculty_AI_Chat') => {
    const htmlContent = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head><meta charset='utf-8'><title>${title}</title>
      <style>body { font-family: Calibri, Arial, sans-serif; line-height: 1.6; padding: 24px; color: #1e293b; } h1, h2, h3 { color: #1e3a8a; } table { border-collapse: collapse; width: 100%; margin-top: 12px; } th, td { border: 1px solid #cbd5e1; padding: 8px; text-align: left; } th { background-color: #f1f5f9; } pre { background-color: #f8fafc; padding: 12px; border-radius: 8px; font-family: Consolas, monospace; }</style>
      </head>
      <body>
        <h2>Faculty AI Chatbot Conversation</h2>
        <p><strong>Faculty:</strong> ${currentUser?.name || 'Faculty Member'} | <strong>Department:</strong> ${currentUser?.department || 'Academic'} | <strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="h-[calc(100vh-120px)] flex flex-col rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden animate-fadeIn">
      {/* 🚀 Sleek Chatbot Header */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-brand text-white flex items-center justify-center shadow-sm">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-extrabold text-slate-900 dark:text-white">
                Faculty AI Chatbot
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-brand/10 text-brand dark:bg-brand/20 dark:text-brand-light">
                DUAL-ENGINE
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Conversational intelligence powered by Google Gemini 3.8 Flash & ChatGPT
            </p>
          </div>
        </div>

        {/* 🤖 Model Engine Selector & Reset */}
        <div className="flex items-center gap-2 bg-slate-200/70 dark:bg-slate-800 p-1 rounded-xl self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setModelType('gemini-3.8-flash')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              modelType === 'gemini-3.8-flash'
                ? 'bg-brand text-white shadow-xs'
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
            <span>ChatGPT</span>
          </button>

          <button
            type="button"
            onClick={handleResetChat}
            className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-white dark:hover:bg-slate-700 transition-colors ml-1 cursor-pointer"
            title="New Chat Session"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 💬 Conversation Stream */}
      <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 bg-slate-50/50 dark:bg-slate-900/50">
        {messages.map((m) => {
          const isUser = m.sender === 'user';
          return (
            <div
              key={m.id}
              className={`flex gap-3 max-w-3xl ${isUser ? 'ml-auto flex-row-reverse' : ''}`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-white font-bold text-xs ${
                  isUser ? 'bg-slate-800 dark:bg-slate-700' : 'bg-brand shadow-sm'
                }`}
              >
                {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div
                className={`p-4 rounded-2xl text-xs leading-relaxed space-y-2.5 ${
                  isUser
                    ? 'bg-slate-900 text-white rounded-tr-none dark:bg-slate-800'
                    : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-none border border-slate-200 dark:border-slate-700/80 shadow-xs'
                }`}
              >
                {!isUser && m.engine && (
                  <div className="flex items-center justify-between pb-1.5 border-b border-slate-100 dark:border-slate-700/50 text-[10px] font-bold text-brand">
                    <span className="flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> {m.engine}
                    </span>
                    <span className="text-slate-400 font-normal">{m.timestamp}</span>
                  </div>
                )}

                <div className="whitespace-pre-line font-sans prose-sm dark:prose-invert max-w-none">
                  {m.text}
                </div>

                {!isUser && (
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-700/40 text-[11px]">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleCopy(m.id, m.text)}
                        className="px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-semibold flex items-center gap-1 transition-all cursor-pointer"
                        title="Copy Response"
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
                        onClick={() => handleDownloadDoc(m.text, `Faculty_Chat_Export`)}
                        className="px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-semibold flex items-center gap-1 transition-all cursor-pointer"
                        title="Download Document"
                      >
                        <Download className="w-3 h-3" /> Export DOC
                      </button>
                    </div>

                    <AudioPlayer textToSpeak={m.text} label="Listen" />
                  </div>
                )}

                {isUser && (
                  <div className="text-[10px] opacity-75 text-right pt-0.5">{m.timestamp}</div>
                )}
              </div>
            </div>
          );
        })}

        {/* Loading Indicator */}
        {loading && (
          <div className="flex gap-3 max-w-md">
            <div className="w-8 h-8 rounded-full bg-brand text-white flex items-center justify-center">
              <Bot className="w-4 h-4" />
            </div>
            <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs flex items-center gap-2 border border-slate-200 dark:border-slate-700 shadow-xs">
              <Loader2 className="w-4 h-4 animate-spin text-brand" />
              <span>
                {modelType === 'gemini-3.8-flash' ? 'Google Gemini 3.8 Flash' : 'ChatGPT'}{' '}
                is typing a response...
              </span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* 💡 Natural Chatbot Suggestion Chips */}
      {messages.length <= 2 && (
        <div className="px-4 py-2 bg-slate-100/60 dark:bg-slate-800/60 border-t border-slate-200 dark:border-slate-800">
          <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1.5 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-brand" /> Suggested topics to ask:
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {CHATBOT_PROMPT_SUGGESTIONS.map((item, idx) => {
              const Icon = item.icon;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSend(item.prompt)}
                  className="text-left p-2.5 rounded-xl bg-white dark:bg-slate-800 hover:border-brand border border-slate-200 dark:border-slate-700 hover:shadow-xs transition-all flex items-start gap-2.5 cursor-pointer group"
                >
                  <div className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-700 text-brand group-hover:bg-brand group-hover:text-white transition-colors shrink-0">
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-brand transition-colors">
                      {item.title}
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">
                      {item.prompt}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ✍️ Bottom Chatbot Dock (Input + Voice + Send) */}
      <div className="p-3 sm:p-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-end gap-2"
        >
          <div className="pb-1">
            <VoiceInput onTranscript={(txt) => handleSend(txt)} />
          </div>

          <div className="flex-1 relative">
            <textarea
              ref={inputRef}
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={`Ask Faculty AI Chatbot anything (${modelType === 'gemini-3.8-flash' ? 'Gemini 3.8 Flash' : 'ChatGPT'})...`}
              className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand resize-none min-h-[42px] max-h-32"
            />
          </div>

          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="p-2.5 rounded-xl bg-brand hover:bg-brand-hover text-white transition-all disabled:opacity-40 cursor-pointer shadow-sm flex items-center justify-center shrink-0 mb-1"
            title="Send Message"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-1.5 text-center">
          <span className="text-[10px] text-slate-400 dark:text-slate-500">
            Faculty AI Chatbot • Dual-Engine: Google Gemini 3.8 Flash & ChatGPT • Press Enter to send
          </span>
        </div>
      </div>
    </div>
  );
};
