import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Bot,
  User,
  X,
  Send,
  Loader2,
  Maximize2,
  Trash2,
  Zap,
  Copy,
  Check,
  Minimize2,
  ChevronDown,
} from 'lucide-react';
import { apiAiCopilot } from '../../lib/gemini';
import { UserRole, UserProfile } from '../../types';

interface FloatingAiWidgetProps {
  role: UserRole;
  currentUser?: UserProfile;
  onNavigateTab?: (tab: string) => void;
}

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  engine?: string;
}

export const FloatingAiWidget: React.FC<FloatingAiWidgetProps> = ({
  role,
  currentUser,
  onNavigateTab,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [modelType, setModelType] = useState<'gemini-3.8-flash' | 'chatgpt-academic'>('gemini-3.8-flash');
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const isFaculty = role === 'faculty';

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'init_0',
      sender: 'assistant',
      text: isFaculty
        ? `Hello Professor ${currentUser?.name ? currentUser.name.split(' ')[0] : ''}! I am your Faculty AI Chatbot. Need quick concept explanations, code examples, discussion ideas, or teaching material? Ask me anything or switch between Gemini 3.8 Flash and ChatGPT.`
        : `Hi ${currentUser?.name ? currentUser.name.split(' ')[0] : 'there'}! I am your AI Study Chatbot. Need an instant explanation, exam formula derivation, or code snippet? Ask me anything!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      engine: 'Google Gemini 3.8 Flash',
    },
  ]);

  useEffect(() => {
    if (isOpen && !isMinimized) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isMinimized, loading]);

  const handleSend = async (queryText?: string) => {
    const text = queryText || input;
    if (!text.trim() || loading) return;

    const userMsg: Message = {
      id: `u_${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const data = await apiAiCopilot({
        message: text,
        role: isFaculty ? 'faculty' : 'student',
        modelType,
        copilotMode: isFaculty ? 'faculty-copilot' : 'student-tutor',
        department: currentUser?.department,
        conversationHistory: messages,
      });

      const assistantMsg: Message = {
        id: `a_${Date.now() + 1}`,
        sender: 'assistant',
        text: data?.reply || 'How else can I assist your academic work?',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        engine: data?.engine || (modelType === 'gemini-3.8-flash' ? 'Google Gemini 3.8 Flash' : 'ChatGPT Academic'),
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      console.error('Floating AI error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleOpenFullPage = () => {
    setIsOpen(false);
    if (onNavigateTab) {
      onNavigateTab(isFaculty ? 'ai-copilot' : 'ai-chat');
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {/* Floating Action Button when closed */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center gap-2 px-4 py-3 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-extrabold text-xs shadow-2xl hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer border border-slate-700 dark:border-slate-200"
          aria-label="Open AI Assistant"
        >
          <div className="relative">
            <Sparkles className="w-4 h-4 text-brand animate-spin-slow" />
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          </div>
          <span>AI {isFaculty ? 'Faculty Copilot' : 'Study Tutor'}</span>
          <span className="px-1.5 py-0.5 rounded text-[9px] font-black bg-brand/30 text-brand-light uppercase">
            3.8
          </span>
        </button>
      )}

      {/* Floating Chat Drawer Window */}
      {isOpen && (
        <div
          className={`w-[92vw] sm:w-[420px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col transition-all duration-200 ${
            isMinimized ? 'h-14' : 'h-[540px] max-h-[85vh]'
          }`}
        >
          {/* Header */}
          <div className="p-3.5 bg-slate-900 text-white flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-brand text-white flex items-center justify-center font-bold text-xs shadow-xs">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-xs font-black tracking-wide">
                    {isFaculty ? 'Faculty AI Chatbot' : 'Student AI Chatbot'}
                  </h3>
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-white/20 text-white font-mono font-bold">
                    {modelType === 'gemini-3.8-flash' ? 'Gemini 3.8' : 'ChatGPT'}
                  </span>
                </div>
                <p className="text-[10px] text-slate-300">
                  {isFaculty ? 'Interactive Conversational Assistant' : 'Exam & Concept Assistant'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={handleOpenFullPage}
                title="Expand to Full Page"
                className="p-1.5 rounded-lg hover:bg-white/15 text-slate-300 hover:text-white transition-colors cursor-pointer"
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                title={isMinimized ? 'Expand' : 'Minimize'}
                className="p-1.5 rounded-lg hover:bg-white/15 text-slate-300 hover:text-white transition-colors cursor-pointer"
              >
                {isMinimized ? <ChevronDown className="w-3.5 h-3.5 rotate-180" /> : <Minimize2 className="w-3.5 h-3.5" />}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                title="Close"
                className="p-1.5 rounded-lg hover:bg-white/15 text-slate-300 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Engine Switcher Subheader */}
              <div className="px-3 py-2 bg-slate-100 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1 bg-white dark:bg-slate-900 p-0.5 rounded-lg border border-slate-200 dark:border-slate-700">
                  <button
                    type="button"
                    onClick={() => setModelType('gemini-3.8-flash')}
                    className={`px-2 py-1 rounded text-[10px] font-bold flex items-center gap-1 cursor-pointer ${
                      modelType === 'gemini-3.8-flash'
                        ? 'bg-brand text-white shadow-xs'
                        : 'text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <Zap className="w-3 h-3" /> Gemini 3.8
                  </button>
                  <button
                    type="button"
                    onClick={() => setModelType('chatgpt-academic')}
                    className={`px-2 py-1 rounded text-[10px] font-bold flex items-center gap-1 cursor-pointer ${
                      modelType === 'chatgpt-academic'
                        ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 shadow-xs'
                        : 'text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <Bot className="w-3 h-3" /> ChatGPT
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setMessages([
                      {
                        id: 'init_reset',
                        sender: 'assistant',
                        text: 'Chat history cleared. What can I help you draft or learn next?',
                        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                      },
                    ])
                  }
                  className="text-[10px] text-slate-400 hover:text-rose-500 font-bold flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 className="w-3 h-3" /> Clear
                </button>
              </div>

              {/* Messages Body */}
              <div className="flex-1 p-3 overflow-y-auto space-y-3 bg-slate-50/50 dark:bg-slate-900/50 text-xs">
                {messages.map((m) => {
                  const isUser = m.sender === 'user';
                  return (
                    <div
                      key={m.id}
                      className={`flex gap-2 max-w-[90%] ${isUser ? 'ml-auto flex-row-reverse' : ''}`}
                    >
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-white font-bold text-[10px] ${
                          isUser ? 'bg-slate-800 dark:bg-slate-700' : 'bg-brand'
                        }`}
                      >
                        {isUser ? <User className="w-3 h-3" /> : <Bot className="w-3 h-3" />}
                      </div>

                      <div
                        className={`p-3 rounded-2xl leading-relaxed space-y-1.5 ${
                          isUser
                            ? 'bg-slate-900 text-white rounded-tr-none dark:bg-slate-800'
                            : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-none border border-slate-200 dark:border-slate-700/80 shadow-xs'
                        }`}
                      >
                        {!isUser && m.engine && (
                          <div className="text-[9px] font-black uppercase text-brand tracking-wider flex items-center gap-1">
                            <Sparkles className="w-2.5 h-2.5" /> {m.engine}
                          </div>
                        )}
                        <div className="whitespace-pre-line font-sans text-[11px]">{m.text}</div>

                        <div className="flex items-center justify-between pt-1 border-t border-slate-100 dark:border-slate-700/40 text-[9px] text-slate-400">
                          <span>{m.timestamp}</span>
                          {!isUser && (
                            <button
                              onClick={() => handleCopy(m.id, m.text)}
                              className="text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center gap-1 cursor-pointer font-bold"
                            >
                              {copiedId === m.id ? (
                                <>
                                  <Check className="w-2.5 h-2.5 text-emerald-500" /> Copied
                                </>
                              ) : (
                                <>
                                  <Copy className="w-2.5 h-2.5" /> Copy
                                </>
                              )}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}

                {loading && (
                  <div className="flex gap-2 max-w-[85%]">
                    <div className="w-6 h-6 rounded-full bg-brand text-white flex items-center justify-center shrink-0">
                      <Bot className="w-3 h-3" />
                    </div>
                    <div className="p-2.5 rounded-2xl bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[11px] flex items-center gap-2 border border-slate-200 dark:border-slate-700 shadow-xs">
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-brand" />
                      <span>Synthesizing response...</span>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Quick Prompts Bar */}
              <div className="px-2.5 py-1.5 bg-slate-100 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800 flex items-center gap-1.5 overflow-x-auto text-[10px] scrollbar-thin">
                {isFaculty ? (
                  <>
                    <button
                      onClick={() => handleSend('Explain a complex technical concept with simple analogies.')}
                      className="shrink-0 px-2 py-0.5 rounded-md bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 font-bold hover:bg-brand/10 transition-colors cursor-pointer"
                    >
                      💡 Explain Concept
                    </button>
                    <button
                      onClick={() => handleSend('Suggest 4 interactive classroom discussion questions.')}
                      className="shrink-0 px-2 py-0.5 rounded-md bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 font-bold hover:bg-brand/10 transition-colors cursor-pointer"
                    >
                      💬 Discussion Prompts
                    </button>
                    <button
                      onClick={() => handleSend('Write a clean code example with complexity analysis.')}
                      className="shrink-0 px-2 py-0.5 rounded-md bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 font-bold hover:bg-brand/10 transition-colors cursor-pointer"
                    >
                      💻 Code Example
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => handleSend('Explain this topic in 13-mark Anna University exam answer format.')}
                      className="shrink-0 px-2 py-0.5 rounded-md bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 font-bold hover:bg-teal-500/10 transition-colors cursor-pointer"
                    >
                      📝 13-Mark Exam Format
                    </button>
                    <button
                      onClick={() => handleSend('Write step-by-step code and complexity analysis.')}
                      className="shrink-0 px-2 py-0.5 rounded-md bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 font-bold hover:bg-teal-500/10 transition-colors cursor-pointer"
                    >
                      💻 Code & Complexity
                    </button>
                    <button
                      onClick={() => handleSend('Tanglish la simple ah explain pannu with key points.')}
                      className="shrink-0 px-2 py-0.5 rounded-md bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 font-bold hover:bg-teal-500/10 transition-colors cursor-pointer"
                    >
                      🌐 Tanglish Mode
                    </button>
                  </>
                )}
              </div>

              {/* Input Footer */}
              <div className="p-2.5 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSend();
                  }}
                  className="flex items-center gap-1.5"
                >
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={`Ask AI (${modelType === 'gemini-3.8-flash' ? 'Gemini 3.8' : 'ChatGPT'})...`}
                    className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand/20"
                  />
                  <button
                    type="submit"
                    disabled={!input.trim() || loading}
                    className="p-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 disabled:opacity-40 cursor-pointer transition-all shadow-sm flex items-center justify-center shrink-0"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};
