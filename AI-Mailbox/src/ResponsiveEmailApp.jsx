import React, { useState, useRef } from "react";
import {
  Search, Plus, Inbox, CheckSquare, Settings, Paperclip, Mail, ChevronDown,
  ArrowLeft, X, Archive, Trash2, Send, Star, MoreHorizontal, Edit2, Share,
  Reply, ReplyAll, Forward, User, Image, Smile, Link2, Check, FileIcon,
  Printer, AlertOctagon, Sparkles
} from "lucide-react";

// --- SUB-COMPONENT: AI REPLY MODAL ---
const AIReplyModal = ({ isOpen, onClose, onInsert }) => {
  const [prompt, setPrompt] = useState("Mention we can meet Thursday and ask for the updated contract.");
  
  if (!isOpen) return null;

  const DraftCard = ({ title, content }) => (
    <div className="bg-white border border-gray-100 rounded-xl p-3 flex flex-col shadow-sm">
      <span className="font-bold text-[13px] mb-1 text-gray-800">{title}</span>
      <p className="text-[11px] text-gray-500 leading-snug flex-grow mb-3 line-clamp-3">{content}</p>
      <div className="flex gap-1.5">
        <button 
          onClick={() => onInsert(content)}
          className="flex-1 bg-blue-600 text-white text-[10px] font-bold py-1.5 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Use
        </button>
        <button className="flex-1 border border-gray-100 text-gray-600 text-[10px] font-bold py-1.5 rounded-lg hover:bg-gray-50">
          Copy
        </button>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-end sm:items-center z-[70] p-4">
      <div className="bg-white w-full max-w-[440px] rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-4 border-b border-gray-50">
          <div className="flex items-center gap-2">
            <div className="bg-blue-50 p-1.5 rounded-lg text-blue-600">
              <Sparkles size={18} />
            </div>
            <h2 className="font-bold text-gray-800">AI Reply</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full text-gray-400">
            <X size={20} />
          </button>
        </div>

        <div className="p-5 space-y-5">
          <div className="flex gap-2">
            <button className="flex-1 flex justify-between items-center border border-gray-100 rounded-xl px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50">
              Default Tone <ChevronDown size={14} className="text-gray-400" />
            </button>
            <button className="flex-1 flex justify-between items-center border border-gray-100 rounded-xl px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50">
              Length <ChevronDown size={14} className="text-gray-400" />
            </button>
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-black text-gray-400 uppercase tracking-wider">Your prompt / guidance</label>
            <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4">
              <textarea 
                className="bg-transparent w-full text-[15px] text-gray-700 focus:outline-none resize-none font-medium"
                rows="2"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-black text-gray-400 uppercase tracking-wider">Draft options</label>
            <div className="grid grid-cols-3 gap-3">
              <DraftCard title="Short" content="Let's meet on Thursday. Can you bring the contract?" />
              <DraftCard title="Normal" content="How about meeting on Thursday? Please bring the contract." />
              <DraftCard title="Formal" content="Shall we arrange a meeting for Thursday? Kindly bring the contract." />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-black text-gray-400 uppercase tracking-wider">Improve this reply</label>
            <div className="flex flex-wrap gap-2">
              {['Make it shorter', 'Add a clear CTA', 'Sound warmer'].map(chip => (
                <button key={chip} className="px-3 py-1.5 bg-white border border-gray-200 rounded-full text-[12px] font-bold text-gray-600 hover:border-blue-200 hover:text-blue-600 transition-all">
                  {chip}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="p-5 border-t border-gray-50 flex gap-3 bg-gray-50/30">
          <button 
            onClick={() => onInsert(prompt)} 
            className="flex-1 bg-blue-600 text-white font-bold py-3.5 rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 active:scale-[0.98]"
          >
            Insert into email
          </button>
          <button onClick={onClose} className="px-6 py-3.5 border border-gray-200 bg-white text-gray-700 font-bold rounded-xl hover:bg-gray-50 active:scale-[0.98]">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// --- MAIN APP COMPONENT ---
const ResponsiveEmailApp = () => {
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [activeTab, setActiveTab] = useState("All Mail");
  const [activeFolder, setActiveFolder] = useState("Inbox");
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [isAccountDropdownOpen, setIsAccountDropdownOpen] = useState(false);
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  // AI Modal State
  const [isAIReplyOpen, setIsAIReplyOpen] = useState(false);

  const [composeData, setComposeData] = useState({
    to: "",
    subject: "",
    body: "",
    attachments: [],
  });

  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const fileInputRef = useRef(null);
  const searchInputRef = useRef(null);

  const [allEmails, setAllEmails] = useState([
    {
      id: 1,
      folder: "Inbox",
      account: "Gmail",
      sender: "Sara Johnson",
      subject: "Project Update",
      time: "2:45 PM",
      unread: true,
      avatar: "https://i.pravatar.cc/150?u=sara",
      messages: [
        {
          id: 101,
          sender: "Sara Johnson",
          time: "2:45 PM",
          body: "Hi Team,\n\nI'm happy to report that the project is moving along faster than expected. We should be ready for the demo by Friday.",
          avatar: "https://i.pravatar.cc/150?u=sara",
        },
      ],
    },
    {
      id: 2,
      folder: "Inbox",
      account: "Work IMAP",
      sender: "Marketing Team",
      subject: "Weekly Sync & Strategy",
      time: "1:15 PM",
      unread: true,
      isGroup: true,
      messages: [
        {
          id: 201,
          sender: "Alex Rivera",
          time: "11:00 AM",
          body: "Does anyone have the latest conversion metrics for the spring campaign?",
          avatar: "https://i.pravatar.cc/150?u=alex",
        },
        {
          id: 202,
          sender: "Marketing Team",
          time: "1:15 PM",
          body: "Just uploaded them to the shared drive! The ROI is looking much better than last month.",
          avatar: "",
        },
      ],
    },
    {
      id: 3,
      folder: "Starred",
      account: "Outlook",
      sender: "David Lee",
      subject: "Invoice #88291",
      time: "12:30 PM",
      unread: false,
      avatar: "https://i.pravatar.cc/150?u=david",
      messages: [
        {
          id: 301,
          sender: "David Lee",
          time: "12:30 PM",
          body: "Hi, please find the invoice attached for the last sprint. Let me know if you have any questions.",
          avatar: "https://i.pravatar.cc/150?u=david",
        },
      ],
    },
  ]);

  const toggleReadStatus = (id) => {
    setAllEmails((prev) =>
      prev.map((email) =>
        email.id === id ? { ...email, unread: !email.unread } : email
      )
    );
  };

  const handleAttachmentClick = () => fileInputRef.current.click();

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setComposeData((prev) => ({
      ...prev,
      attachments: [...prev.attachments, ...files.map((f) => f.name)],
    }));
  };

  const addEmoji = (emoji) => {
    setComposeData((prev) => ({ ...prev, body: prev.body + emoji }));
    setShowEmojiPicker(false);
  };

  const handleLinkClick = () => {
    const url = window.prompt("Enter URL:", "https://");
    if (url) {
      setComposeData((prev) => ({ ...prev, body: prev.body + " " + url }));
    }
  };
    
  const handleAction = (type, email) => {
    let prefix = type === "reply" ? "Re: " : "Fwd: ";
    setComposeData({
      to: type === "reply" ? email.sender : "",
      subject: `${prefix}${email.subject}`,
      body: `\n\n--- Original Message ---\nFrom: ${email.sender}\n\n${email.messages[0].body}`,
      attachments: [],
    });
    setIsComposeOpen(true);
  };

  const moveEmail = (id, targetFolder) => {
    setAllEmails((prev) =>
      prev.map((email) =>
        email.id === id ? { ...email, folder: targetFolder } : email
      )
    );
    if (selectedEmail === id) setSelectedEmail(null);
    setIsMoreMenuOpen(false);
  };

  const filteredEmails = allEmails.filter((email) => {
    const matchesFolder = email.folder === activeFolder;
    const matchesAccount = activeTab === "All Mail" || email.account === activeTab;
    const matchesSearch =
      email.sender.toLowerCase().includes(searchQuery.toLowerCase()) ||
      email.subject.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFolder && matchesAccount && matchesSearch;
  });

  const openEmail = allEmails.find((e) => e.id === selectedEmail);

  const Avatar = ({ email, size = "w-12 h-12" }) => {
    if (email.isGroup)
      return (
        <div className={`${size} bg-blue-100 rounded-full flex items-center justify-center text-blue-600 flex-shrink-0`}>
          <Mail size={24} />
        </div>
      );
    if (email.avatar)
      return (
        <img src={email.avatar} className={`${size} rounded-full object-cover border border-gray-100 flex-shrink-0`} alt="" />
      );
    const initial = email.sender ? email.sender.charAt(0).toUpperCase() : "U";
    return (
      <div className={`${size} bg-gray-500 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0`}>
        {initial}
      </div>
    );
  };

  return (
    <div className="flex h-screen bg-white overflow-hidden text-[#1a1a1a] font-sans relative">
      {/* 1. SIDEBAR */}
      <aside className="hidden lg:flex w-64 border-r border-gray-100 flex-col bg-gray-50/30">
        <div className="p-6">
          <button
            onClick={() => {
              setComposeData({ to: "", subject: "", body: "", attachments: [] });
              setIsComposeOpen(true);
            }}
            className="flex items-center gap-3 bg-blue-600 text-white px-6 py-3 rounded-2xl shadow-lg hover:bg-blue-700 font-semibold w-full transition-all"
          >
            <Edit2 size={18} /> Compose
          </button>
        </div>
        <nav className="flex-1 px-4 space-y-1">
          {["Inbox", "Starred", "Sent", "Archive", "Trash"].map((folder) => (
            <button
              key={folder}
              onClick={() => { setActiveFolder(folder); setSelectedEmail(null); }}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all ${
                activeFolder === folder ? "bg-blue-100 text-blue-700 font-bold" : "text-gray-500 hover:bg-gray-100 font-semibold"
              }`}
            >
              {folder === "Inbox" && <Inbox size={20} />}
              {folder === "Starred" && <Star size={20} />}
              {folder === "Sent" && <Send size={20} />}
              {folder === "Archive" && <Archive size={20} />}
              {folder === "Trash" && <Trash2 size={20} />}
              <span className="text-sm">{folder}</span>
            </button>
          ))}
        </nav>
      </aside>

      {/* 2. EMAIL LIST */}
      <main className={`${selectedEmail ? "hidden lg:flex" : "flex"} flex-1 lg:max-w-md border-r border-gray-100 flex-col h-full bg-white relative`}>
        <header className="px-4 pt-4 lg:pt-6">
           <div className="flex justify-between items-center mb-6 relative">
            <div
              onClick={() => setIsAccountDropdownOpen(!isAccountDropdownOpen)}
              className="mx-auto flex items-center gap-2 border border-gray-200 rounded-lg px-4 py-1.5 shadow-sm bg-white cursor-pointer hover:bg-gray-50 z-30"
            >
              <span className="text-[14px] font-bold text-gray-700">{activeTab}</span>
              <ChevronDown size={14} className={`text-gray-400 transition-transform ${isAccountDropdownOpen ? "rotate-180" : ""}`} />
            </div>
            {isAccountDropdownOpen && (
              <>
                <div className="fixed inset-0 z-20" onClick={() => setIsAccountDropdownOpen(false)}></div>
                <div className="absolute top-10 left-1/2 -translate-x-1/2 w-48 bg-white border border-gray-100 rounded-xl shadow-xl z-30 py-2">
                  {["All Mail", "Gmail", "Outlook", "Work IMAP"].map((acc) => (
                    <button
                      key={acc}
                      onClick={() => { setActiveTab(acc); setIsAccountDropdownOpen(false); }}
                      className="w-full flex items-center justify-between px-4 py-2 text-sm font-semibold hover:bg-blue-50 text-gray-700"
                    >
                      {acc} {activeTab === acc && <Check size={16} className="text-blue-600" />}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
          <div className="flex gap-6 overflow-x-auto no-scrollbar border-b border-gray-100 mb-4 text-[14px] font-bold">
            {["All Mail", "Gmail", "Outlook", "Work IMAP"].map((tab) => (
              <button key={tab} onClick={() => setActiveTab(tab)} className={`pb-3 px-1 transition-all whitespace-nowrap ${activeTab === tab ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-400 hover:text-gray-600"}`}>
                {tab}
              </button>
            ))}
          </div>
        </header>

        <div className="px-4 mb-4 w-full flex gap-3 justify-between">
          <div className="w-full relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              ref={searchInputRef}
              type="text"
              placeholder={`Search ${activeFolder}`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#f1f3f5] py-2.5 pl-11 pr-4 rounded-full text-[15px] outline-none"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {filteredEmails.map((email) => (
            <div key={email.id} onClick={() => setSelectedEmail(email.id)} className={`flex items-center gap-4 px-5 py-4 border-b border-gray-50 cursor-pointer ${selectedEmail === email.id ? "bg-blue-50/50" : "hover:bg-gray-50"}`}>
              <Avatar email={email} />
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline mb-0.5 font-bold text-[16px] truncate">
                  {email.sender} <span className="text-[13px] text-gray-500 font-normal ml-2">{email.time}</span>
                </div>
                <h4 className="text-[14px] font-semibold text-gray-800 truncate">{email.subject}</h4>
              </div>
              {email.unread && <div className="w-2.5 h-2.5 bg-blue-600 rounded-full flex-shrink-0 ml-2"></div>}
            </div>
          ))}
        </div>
      </main>

      {/* 3. READING PANE */}
      <section className={`${selectedEmail ? "flex" : "hidden lg:flex"} flex-1 flex-col bg-white h-full z-20 fixed inset-0 lg:relative lg:inset-auto`}>
        <header className="h-16 border-b border-gray-100 flex items-center justify-between px-4 lg:px-8">
          <div className="flex items-center gap-4">
            <button onClick={() => setSelectedEmail(null)} className="lg:hidden p-2 hover:bg-gray-100 rounded-full">
              <ArrowLeft size={24} />
            </button>
            <div className="flex gap-6 text-gray-400">
              <button onClick={() => moveEmail(openEmail?.id, "Archive")}><Archive size={20} /></button>
              <button onClick={() => moveEmail(openEmail?.id, "Trash")}><Trash2 size={20} /></button>
              <button onClick={() => toggleReadStatus(openEmail?.id)} className={openEmail?.unread ? "text-blue-600" : ""}><Mail size={20} /></button>
            </div>
          </div>
          <button onClick={() => setIsMoreMenuOpen(!isMoreMenuOpen)} className={`p-2 rounded-full ${isMoreMenuOpen ? "bg-gray-100 text-blue-600" : "text-gray-400 hover:bg-gray-50"}`}>
            <MoreHorizontal size={20} />
          </button>
        </header>

        {openEmail ? (
          <div className="flex-1 overflow-y-auto p-6 lg:p-12">
            <div className="max-w-3xl mx-auto">
              <h1 className="text-2xl font-bold mb-10">{openEmail.subject}</h1>
              <div className="space-y-12">
                {openEmail.messages.map((msg, index) => (
                  <div key={msg.id} className="relative">
                    <div className="flex items-center gap-4 mb-4">
                      <Avatar email={{ sender: msg.sender, avatar: msg.avatar }} size="w-10 h-10" />
                      <div className="flex-1 flex justify-between items-center">
                        <p className="font-bold text-lg">{msg.sender}</p>
                        <span className="text-sm text-gray-400">{msg.time}</span>
                      </div>
                    </div>
                    <div className="text-lg text-gray-700 leading-relaxed whitespace-pre-line pl-14">{msg.body}</div>
                    {index !== openEmail.messages.length - 1 && <div className="absolute left-5 top-12 bottom-[-32px] w-[1px] bg-gray-100"></div>}
                  </div>
                ))}
              </div>
              <div className="pt-12 mt-12 border-t border-gray-100 flex flex-wrap gap-4">
                <button onClick={() => handleAction("reply", openEmail)} className="flex items-center gap-2 px-8 py-3 bg-blue-600 text-white rounded-full font-bold shadow-lg shadow-blue-100"><Reply size={18} /> Reply</button>
                <button onClick={() => handleAction("forward", openEmail)} className="flex items-center gap-2 px-8 py-3 bg-gray-100 text-gray-700 rounded-full font-bold"><Forward size={18} /> Forward</button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-300 font-medium">Select an email to read</div>
        )}
      </section>

      {/* --- LARGE COMPOSE MODAL --- */}
      {isComposeOpen && (
        <div className="fixed inset-0 lg:inset-auto lg:bottom-0 lg:right-10 lg:w-[700px] lg:h-[650px] bg-white lg:rounded-t-2xl shadow-2xl z-50 flex flex-col border border-gray-200 animate-in slide-in-from-bottom duration-300">
          <header className="bg-gray-900 text-white p-4 flex justify-between items-center lg:rounded-t-2xl">
            <span className="font-bold flex items-center gap-2"><Edit2 size={16} /> New Message</span>
            <button onClick={() => setIsComposeOpen(false)} className="hover:bg-gray-700 p-1 rounded"><X size={20} /></button>
          </header>

          <div className="flex-1 p-6 flex flex-col overflow-y-auto">
            <input type="text" placeholder="To" value={composeData.to} onChange={(e) => setComposeData({ ...composeData, to: e.target.value })} className="w-full border-b border-gray-100 py-3 outline-none font-medium" />
            <input type="text" placeholder="Subject" value={composeData.subject} onChange={(e) => setComposeData({ ...composeData, subject: e.target.value })} className="w-full border-b border-gray-100 py-3 outline-none font-medium" />
            <textarea placeholder="Write your message..." value={composeData.body} onChange={(e) => setComposeData({ ...composeData, body: e.target.value })} className="flex-1 w-full mt-4 outline-none resize-none text-gray-700 leading-relaxed text-lg"></textarea>
          </div>

          <footer className="p-6 border-t border-gray-100 flex justify-between items-center bg-gray-50/50 relative">
            <div className="flex gap-4 items-center text-gray-400 relative">
              <Paperclip size={22} className="cursor-pointer hover:text-blue-600" />
              <Smile size={22} className="cursor-pointer hover:text-blue-600" />
              <Image size={22} className="cursor-pointer hover:text-blue-600" />
              
              {/* NEW: AI REPLY TRIGGER */}
              <button 
                onClick={() => setIsAIReplyOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors border border-blue-100 ml-2"
              >
                <Sparkles size={16} />
                <span className="text-[11px] font-black uppercase tracking-tight">Reply with AI</span>
              </button>
            </div>
            <button onClick={() => setIsComposeOpen(false)} className="bg-blue-600 text-white px-10 py-3 rounded-full font-bold shadow-lg hover:bg-blue-700 transition-all active:scale-95 flex items-center gap-2">
              Send <Send size={18} />
            </button>
          </footer>
        </div>
      )}

      {/* --- AI REPLY MODAL COMPONENT --- */}
      <AIReplyModal 
        isOpen={isAIReplyOpen} 
        onClose={() => setIsAIReplyOpen(false)} 
        onInsert={(text) => {
          setComposeData(prev => ({ ...prev, body: text }));
          setIsAIReplyOpen(false);
        }}
      />
    </div>
  );
};

export default ResponsiveEmailApp;