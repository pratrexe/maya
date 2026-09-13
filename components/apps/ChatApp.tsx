import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, Sparkles, User } from 'lucide-react';
import { ThemeConfig } from '../../types/os';
import { playUiClick } from '../../utils/audio';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

interface ChatAppProps {
  theme: ThemeConfig;
  userName: string;
}

export const ChatApp: React.FC<ChatAppProps> = ({ theme, userName }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm-1',
      sender: 'assistant',
      text: `Hello ${userName}! I'm your Material You AI assistant. How can I assist you with your desktop today? You can ask me about dynamic colors, system tips, or creative tasks!`,
      timestamp: '14:31',
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const quickPrompts = [
    'How does Monet dynamic color extraction work?',
    'Tell me a poem about autumn leaves',
    'Tips to optimize WebOS battery life',
    'What features does this OS have?',
  ];

  const handleSend = (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    playUiClick();
    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setIsTyping(true);

    setTimeout(() => {
      let reply = "I'm here to help!";
      const q = query.toLowerCase();

      if (q.includes('monet') || q.includes('color') || q.includes('theme')) {
        reply =
          "The Monet engine quantizes the wallpaper image into a palette of seed colors using HCT (Hue, Chroma, Tone). It then produces 5 tonal palettes ranging from 0 to 100 luminance to ensure accessible contrast while preserving personal aesthetic harmony!";
      } else if (q.includes('poem') || q.includes('autumn')) {
        reply =
          "Crisp coral leaves drift on gentle breeze,\nPinks and warm ambers dance through the trees.\nA clock in soft serif marks the midday sun,\nAutumn's golden comfort has just begun.";
      } else if (q.includes('battery') || q.includes('optimize')) {
        reply =
          "To optimize battery life on WebOS:\n1. Enable Night Light in the Quick Settings dock.\n2. Switch to 'Obsidian Dark' theme to reduce screen power.\n3. Close background apps from the taskbar indicator.";
      } else if (q.includes('features') || q.includes('os')) {
        reply =
          "Your Material You WebOS includes:\n• Live Homescreen with scalloped floral clocks & battery\n• Dual-column Start Menu with quick folders & storage meters\n• Expandable Control Center with CPU/RAM monitor & mini calendar\n• Functional File Explorer, Notes, Music Player, and Terminal!";
      } else {
        reply = `That's a wonderful thought! In this Material You environment, you have full control over your apps, system widgets, and colors. Feel free to ask more questions or explore the desktop!`;
      }

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        text: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setIsTyping(false);
      setMessages((prev) => [...prev, botMsg]);
    }, 900);
  };

  return (
    <div className="flex flex-col h-full bg-[#fcf8fa] text-gray-800 text-sm">
      {/* Header */}
      <div
        className="p-3.5 px-6 border-b border-black/5 flex items-center justify-between"
        style={{ backgroundColor: theme.colors.surfaceVariant }}
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-xs">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="font-bold text-xs">ChatGPT Assistant</div>
            <div className="text-[11px] text-emerald-600 flex items-center gap-1 font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Ready & Adaptive</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1 text-xs opacity-60">
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span className="font-semibold">Material Intelligence</span>
        </div>
      </div>

      {/* Message Stream */}
      <div className="flex-1 p-6 overflow-y-auto space-y-4">
        {messages.map((m) => {
          const isUser = m.sender === 'user';
          return (
            <div
              key={m.id}
              className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : ''}`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-xs ${
                  isUser
                    ? 'bg-[#c85252] text-white'
                    : 'bg-emerald-500 text-white'
                }`}
              >
                {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div
                className={`max-w-[75%] p-3.5 rounded-[24px] shadow-xs ${
                  isUser
                    ? 'bg-[#c85252] text-white rounded-tr-xs'
                    : 'bg-white border border-gray-100 text-gray-800 rounded-tl-xs'
                }`}
              >
                <div className="text-xs leading-relaxed whitespace-pre-line font-medium">
                  {m.text}
                </div>
                <div
                  className={`text-[9px] mt-1 text-right ${
                    isUser ? 'text-white/70' : 'text-gray-400'
                  }`}
                >
                  {m.timestamp}
                </div>
              </div>
            </div>
          );
        })}

        {isTyping && (
          <div className="flex items-center gap-2 text-xs text-gray-500 pl-11">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce" />
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce [animation-delay:0.2s]" />
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce [animation-delay:0.4s]" />
            <span className="text-[11px] font-medium ml-1">Thinking...</span>
          </div>
        )}
        <div ref={scrollRef} />
      </div>

      {/* Suggested Quick Prompts */}
      <div className="px-6 py-2 flex gap-2 overflow-x-auto text-xs border-t border-black/5 bg-white/50">
        {quickPrompts.map((p, i) => (
          <button
            key={i}
            onClick={() => handleSend(p)}
            className="px-3 py-1 rounded-full bg-white border border-gray-200 text-gray-700 whitespace-nowrap hover:bg-gray-50 active:scale-95 transition-all cursor-pointer font-medium shadow-xs"
          >
            {p}
          </button>
        ))}
      </div>

      {/* Input bar */}
      <div className="p-4 px-6 bg-white border-t border-black/5">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2 p-1.5 px-3 rounded-full bg-gray-100 border border-gray-200"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask anything..."
            className="flex-1 bg-transparent px-2 text-xs font-medium outline-none"
          />
          <button
            type="submit"
            className="w-8 h-8 rounded-full bg-[#c85252] text-white flex items-center justify-center hover:bg-[#b04242] active:scale-90 transition-all cursor-pointer shadow-xs"
          >
            <Send className="w-3.5 h-3.5 ml-0.5" />
          </button>
        </form>
      </div>
    </div>
  );
};
