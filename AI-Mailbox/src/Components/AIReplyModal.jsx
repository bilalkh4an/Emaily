import React, { useState } from "react";
import Dropdown from "./Dropdown";
import { X, Sparkles, Wand2 } from "lucide-react";

const AIReplyModal = ({ isOpen, onClose, onInsert }) => {
  const [prompt, setPrompt] = useState(
    "Mention we can meet Thursday and ask for the updated contract."
  );

  const options1 = ["Default Tone", "Formal", "Casual", "Friendly"];
  const options2 = ["Short", "Medium", "Long"];

  const [tone, setTone] = useState(options1[0]);
  const [length, setLength] = useState(options2[0]);
  

  if (!isOpen) return null;

  const DraftCard = ({ title, content }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
      navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    };

    return (
      <div className="bg-gradient-to-br from-white to-gray-50/50 border border-gray-200 rounded-2xl p-4 flex flex-col shadow-sm hover:shadow-md transition-all hover:border-blue-200">
        <span className="font-bold text-sm mb-2 text-gray-800">{title}</span>
        <p className="text-xs text-gray-600 leading-relaxed flex-grow mb-4 line-clamp-5">
          {content}
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => onInsert(content)}
            className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-xs font-bold py-2.5 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-sm active:scale-95"
          >
            Use This
          </button>
          <button 
            onClick={handleCopy}
            className="flex-1 border-2 border-gray-200 text-gray-700 text-xs font-bold py-2.5 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all active:scale-95"
          >
            {copied ? "✓ Copied!" : "Copy"}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-end sm:items-center z-[70] p-4">
      <div className="bg-white w-full max-w-[900px] max-h-[90vh] sm:max-h-[85vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="flex-shrink-0 flex items-center justify-between p-5 border-b border-gray-200 bg-gradient-to-r from-blue-50 via-purple-50 to-blue-50">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-2 rounded-xl text-white shadow-lg">
              <Sparkles size={20} />
            </div>
            <div>
              <h2 className="font-bold text-lg text-gray-900 leading-none">AI Reply Assistant</h2>  
              <p className="text-xs font-semibold text-gray-500 mt-1">Powered by The Email Shop</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/80 rounded-xl text-gray-500 hover:text-gray-700 transition-all">
            <X size={22} />
          </button>
        </div>

        {/* Body with Tailwind-Only Scrollbar Classes */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gradient-to-b from-gray-50/30 to-white
          [&::-webkit-scrollbar]:w-2
          [&::-webkit-scrollbar-track]:bg-transparent
          [&::-webkit-scrollbar-thumb]:bg-gray-200
          [&::-webkit-scrollbar-thumb]:rounded-full
          hover:[&::-webkit-scrollbar-thumb]:bg-gray-300">
          
          <div className="md:flex md:gap-6">
            <div className="flex gap-3 md:flex-col md:w-1/4 mb-5 md:mb-0">
              <div className="w-full">
                <label className="text-xs font-bold text-gray-600 uppercase tracking-wide block mb-2">Tone</label>
                <Dropdown options={options1} value={tone} onChange={setTone} />
              </div>
              <div className="w-full">
                <label className="text-xs font-bold text-gray-600 uppercase tracking-wide block mb-2">Length</label>
                <Dropdown options={options2} value={length} onChange={setLength} />
              </div>
            </div>

            <div className="md:w-3/4">
              <label className="text-xs font-bold text-gray-600 uppercase tracking-wide flex items-center gap-2 mb-2">
                <Wand2 size={14} />
                Your Prompt / Guidance
              </label>
              <div className="bg-white border-2 border-gray-200 rounded-2xl p-5 shadow-sm hover:border-blue-300 transition-all focus-within:border-blue-400 focus-within:shadow-md">
                <textarea
                  className="bg-transparent w-full text-base text-gray-800 focus:outline-none resize-none font-medium placeholder:text-gray-400"
                  rows="3"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Describe what you want to say..."
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-1.5 rounded-lg">
                <Sparkles size={14} className="text-white" />
              </div>
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wide">Generated Drafts</label>
              <div className="flex-1 h-px bg-gradient-to-r from-gray-200 to-transparent" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <DraftCard title="Short" content="Let's meet on Thursday. Can you bring the contract?" />
              <DraftCard title="Normal" content="How about meeting on Thursday? Please bring the contract." />
              <DraftCard title="Formal" content="Shall we arrange a meeting for Thursday? Kindly bring the contract." />
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-xs font-bold text-gray-700 uppercase tracking-wide block">Quick Improvements</label>
            <div className="flex flex-wrap gap-2.5">
              {[
                { label: 'Make it shorter', icon: '✂️' },
                { label: 'Add a clear CTA', icon: '🎯' },
                { label: 'Sound warmer', icon: '☀️' },
                { label: 'Summarize context', icon: '📝' }
              ].map(item => (
                <button key={item.label} className="flex items-center gap-2 px-5 py-2.5 bg-white border-2 border-gray-200 rounded-xl text-sm font-bold text-gray-700 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 transition-all active:scale-95 shadow-sm">
                  <span className="text-base">{item.icon}</span> {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex-shrink-0 p-6 border-t border-gray-200 flex gap-3 bg-gradient-to-b from-gray-50/50 to-white">
          <button onClick={() => onInsert(prompt)} className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold py-4 rounded-2xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg shadow-blue-200/50 active:scale-[0.98] flex items-center justify-center gap-2">
            <Sparkles size={18} />
            Insert into Email
          </button>
          <button onClick={onClose} className="px-8 py-4 border-2 border-gray-200 bg-white text-gray-700 font-bold rounded-2xl hover:bg-gray-50 hover:border-gray-300 active:scale-[0.98] transition-all">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIReplyModal;