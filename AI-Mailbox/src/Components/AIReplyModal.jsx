import React, { useState } from "react";
import Dropdown from "./Dropdown";
import { X, Sparkles, Wand2, Loader2 } from "lucide-react";

const AIReplyModal = ({ isOpen, onClose, onInsert, userId, threadId }) => {
  const [prompt, setPrompt] = useState(
    "Mention we can meet Thursday and ask for the updated contract.",
  );

  const options1 = ["Default Tone", "Formal", "Casual", "Friendly"];
  const options2 = ["Short", "Medium", "Long"];
  // Inside your component, add a new state to track the session chat
  const [sessionHistory, setSessionHistory] = useState([]);

  const [tone, setTone] = useState(options1[0]);
  const [length, setLength] = useState(options2[0]);
  const [drafts, setDrafts] = useState([]);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleRegenerate = async () => {
    try {
      setLoading(true);

      // 1. Capture the current prompt and add it to the history
      const currentMessage = { role: "user", content: prompt };
      const updatedHistory = [...sessionHistory, currentMessage];
      setDrafts([]); // Clear previous drafts if you want to see it live
      console.log(userId);
      console.log(threadId);

      const response = await fetch("http://localhost:3000/api/draft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: "bilal_khan", // Using passed prop or default
          threadId: threadId || "<CAD41KV0Hi1umjSe9hUrr2seGJeq400x2iuHXV_btLXtDBL40Pg@mail.gmail.com>",
          prompt: prompt,
          sessionHistory: updatedHistory, // Sending the full session context
          tone,
          length,
        }),
      });

      if (!response.ok) throw new Error("Stream failed");

      // 1. Initialize the reader
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let accumulatedText = "";

      // 2. Read the stream chunks
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        accumulatedText += chunk;

        // 3. Update state in real-time
        // We wrap it in an array so your existing .map() logic works
        setDrafts([accumulatedText]);
      }

      // 2. After stream finishes, add the AI's response to session history
      setSessionHistory([
        ...updatedHistory,
        { role: "assistant", content: accumulatedText },
      ]);
    } catch (error) {
      alert(error);
      console.error("Failed to generate draft:", error);
    } finally {
      setLoading(false);
    }
  };

  const DraftCard = ({ title, content }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
      navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    };

    const formatTextToHTML = (text) => {
      if (!text) return "";

      // Split on both \n and \r\n for Windows compatibility
      return text
        .split(/\r?\n/)
        .map((line) => `<p>${line}</p>`) // Wrap every line, even if empty
        .join("");
    };

    return (
      <div className="bg-gradient-to-br from-white to-gray-50/50 border border-gray-200 rounded-2xl p-4 flex flex-col shadow-sm hover:shadow-md transition-all hover:border-blue-200">
        <span className="font-bold text-sm mb-2 text-gray-800">{title}</span>
        <div className="text-xs text-gray-600 leading-relaxed flex-grow mb-4 whitespace-pre-wrap break-words">
          {content}
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => {
              const htmlContent = formatTextToHTML(content);
              onInsert(htmlContent);
            }}
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
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-end sm:items-center sm:pb-0 pb-safe z-[70] p-4">
     <div className="bg-white w-full max-w-[900px] max-h-[90dvh] sm:max-h-[85dvh] rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex-shrink-0 flex items-center justify-between p-5 border-b border-gray-200 bg-gradient-to-r from-blue-50 via-purple-50 to-blue-50">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-2 rounded-xl text-white shadow-lg">
              <Sparkles size={20} />
            </div>
            <div>
              <h2 className="font-bold text-lg text-gray-900 leading-none">
                AI Reply Assistant
              </h2>
              <p className="text-xs font-semibold text-gray-500 mt-1">
                Powered by The Email Shop
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/80 rounded-xl text-gray-500 hover:text-gray-700 transition-all"
          >
            <X size={22} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto touch-pan-y p-6 space-y-6 bg-gradient-to-b from-gray-50/30 to-white">
          {/* Prompt & Options */}
          <div className="md:flex md:gap-6">
            <div className="flex gap-3 md:flex-col md:w-1/4 mb-5 md:mb-0">
              <div className="w-full">
                <label className="text-xs font-bold text-gray-600 uppercase tracking-wide block mb-2">
                  Tone
                </label>
                <Dropdown options={options1} value={tone} onChange={setTone} />
              </div>
              <div className="w-full">
                <label className="text-xs font-bold text-gray-600 uppercase tracking-wide block mb-2">
                  Length
                </label>
                <Dropdown
                  options={options2}
                  value={length}
                  onChange={setLength}
                />
              </div>
            </div>

            <div className="md:w-3/4">
              <label className="text-xs font-bold text-gray-600 uppercase tracking-wide flex items-center gap-2 mb-2">
                <Wand2 size={14} />
                Your Prompt / Guidance
              </label>
              <div className="bg-white border-2 border-gray-200 rounded-2xl p-5 shadow-sm hover:border-blue-300 transition-all focus-within:border-blue-400 focus-within:shadow-md">
                <textarea
                inputMode="text"
                autoComplete="off"
                autoCorrect="off"
                spellCheck="false"
                  className="bg-transparent w-full text-base text-gray-800 focus:outline-none resize-none font-medium placeholder:text-gray-400"
                  rows="3"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Describe what you want to say..."
                />
              </div>
            </div>
          </div>

          {/* Generated Drafts */}
          <div className="space-y-4">
            {drafts.length > 0 ? (
              drafts.map((draft, i) => (
                <DraftCard key={i} title={`Draft ${i + 1}`} content={draft} />
              ))
            ) : (
              <p className="text-gray-400 text-sm">
               
               {loading && (
                <div className="flex justify-center">
                  <Loader2 size={18} className="animate-spin" />
                </div>
)}

            
              </p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex-shrink-0 p-6 border-t border-gray-200 flex gap-3 bg-gradient-to-b from-gray-50/50 to-white">
          <button
            onClick={handleRegenerate}
            disabled={loading}
            className={`flex-1 text-white font-bold py-4 rounded-2xl transition-all shadow-lg active:scale-[0.98] flex items-center justify-center gap-2
              ${
                loading
                  ? "bg-gradient-to-r from-emerald-600 to-emerald-700"
                  : "bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800"
              }
            `}
          >
            {loading ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <Sparkles size={18} />
            )}
            {loading ? "Generating..." : "Regenerate AI Drafts"}
          </button>

          <button
            onClick={onClose}
            className="px-8 py-4 border-2 border-gray-200 bg-white text-gray-700 font-bold rounded-2xl hover:bg-gray-50 hover:border-gray-300 active:scale-[0.98] transition-all"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIReplyModal;
