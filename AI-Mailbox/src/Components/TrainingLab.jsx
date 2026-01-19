import React, { useState } from 'react';
import { 
  Plus, Trash2, Zap, ArrowRight, Mail, 
  Fingerprint, Sparkles, Database, 
  ShieldCheck, Send, Edit3, 
  Menu, X, ChevronRight, Activity
} from 'lucide-react';

const TrainingLab = ({ isOpen, onClose }) => {
  const [selectedAccount, setSelectedAccount] = useState('work@corp.com');
  const [mode, setMode] = useState('sent');
  const [inputText, setInputText] = useState("");
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const showScreenSize = () => {
  alert(`Width: ${window.innerWidth}px, Height: ${window.innerHeight}px`);
};
  
  const [data, setData] = useState({
    'work@corp.com': [],
    'personal@me.com': []
  });

  if (!isOpen) return null;

  const currentSamples = data[selectedAccount] || [];

  const handleAdd = (subject, body) => {
    if (currentSamples.length < 10) {
      setData({
        ...data,
        [selectedAccount]: [...currentSamples, { id: Date.now(), subject, body }]
      });
      setInputText("");
    }
  };

  const removeSample = (id) => {
    setData({
      ...data,
      [selectedAccount]: currentSamples.filter(s => s.id !== id)
    });
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-0 xl:p-10">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
        onClick={onClose}
      />

      {/* Main Modal Container */}
      <div className="relative w-full max-w-8xl h-full xl:h-[85vh] bg-[#FBFBFE] xl:rounded-[3rem] shadow-2xl overflow-hidden flex flex-col xl:flex-row text-slate-900 font-sans antialiased border border-white/20">
        
        {/* --- MOBILE HEADER & CLOSE --- */}
        <div className="xl:hidden flex items-center justify-between p-4 bg-white border-b border-slate-200 sticky top-0 z-[60]">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-1.5 rounded-lg">
              <Zap size={16} className="text-white fill-current" />
            </div>
            <span className="font-black tracking-tighter text-sm uppercase">TrainingLab</span>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="p-2 bg-slate-100 rounded-lg text-slate-600"><Menu size={20} /></button>
            <button onClick={onClose} className="p-2 bg-slate-900 rounded-lg text-white"><X size={20} /></button>
          </div>
        </div>

        {/* --- 1. IDENTITY BAR --- */}
        <aside className={`
           fixed inset-0 xl:relative xl:translate-x-0 z-[100] xl:z-10 w-full xl:w-72 h-full bg-white border-r border-slate-200 flex flex-col transition-all duration-300 ease-in-out
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
          <div className="p-8 border-b border-slate-100 hidden xl:flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-indigo-600 p-2 rounded-xl shadow-lg shadow-indigo-100">
                <Zap size={20} className="text-white fill-current" />
              </div>
              <span className="font-black text-lg tracking-tighter">TrainingLab</span>
            </div>
          </div>
          
          <div className="p-6 flex-1 overflow-y-auto">
            <div className="flex justify-between items-center mb-6 xl:mb-4">
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Identities</p>
               <button onClick={() => setSidebarOpen(false)} className="xl:hidden p-1"><X size={18}/></button>
            </div>
            <div className="space-y-2">
              {['work@corp.com', 'personal@me.com'].map((email) => (
                <button 
                  key={email}
                  onClick={() => { setSelectedAccount(email); setSidebarOpen(false); }}
                  className={`w-full p-4 rounded-2xl flex items-center justify-between transition-all ${
                    selectedAccount === email 
                    ? 'bg-slate-900 text-white shadow-xl' 
                    : 'hover:bg-slate-50 text-slate-500 bg-slate-50/50 xl:bg-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <Mail size={16} className={selectedAccount === email ? 'text-indigo-400' : 'text-slate-300'} />
                    <span className="text-xs font-bold truncate">{email}</span>
                  </div>
                  {selectedAccount === email && <ChevronRight size={14} className="text-indigo-400" />}
                </button>
              ))}
            </div>
          </div>

          <div className="p-6 border-t border-slate-100 bg-slate-50/50">
            <div className="flex items-center gap-3 text-indigo-600 mb-2 font-black text-[10px] uppercase tracking-widest">
              <ShieldCheck size={16} /> Privacy Active
            </div>
          </div>
        </aside>

        {/* --- 2. EXTRACTION ZONE --- */}
        <main className="flex-1 flex flex-col bg-white overflow-hidden relative">
         
        <div className='flex justify-between items-end'>


          <header className="min-h-20 border-b border-slate-100 px-6 xl:px-10 py-4 flex flex-col  items-center justify-between shrink-0 gap-4">
            <div className="flex items-center gap-4 w-full xl:w-auto">
              <h2 className="text-lg xl:text-xl font-black tracking-tight uppercase xl:normal-case">Extraction</h2>
              <div className="hidden xl:block h-4 w-px bg-slate-200" />
              <p className="hidden xl:block text-sm text-slate-400 font-medium italic truncate">Refining {selectedAccount}</p>
            </div>
            
            <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 w-full xl:w-auto mr-0 xl:mr-10">
              <button onClick={() => setMode('sent')} className={`flex-1 xl:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${mode === 'sent' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500'}`}>
                <Send size={14} /> Sent Items
              </button>
              <button onClick={() => setMode('manual')} className={`flex-1 xl:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${mode === 'manual' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500'}`}>
                <Edit3 size={14} /> Manual
              </button>
            </div>
          </header>

          <div className=" p-6 border-b border-slate-100 bg-white">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Neural DNA Stack</h3>
            
            <div className="flex items-end justify-between">
              <div className="text-4xl xl:text-6xl font-black text-slate-900 tracking-tighter">
                {currentSamples.length}<span className="text-slate-100 italic">/10</span>
              </div>
              <div className="flex gap-1 mb-2">
                {[...Array(10)].map((_, i) => (
                  <div key={i} className={`h-6 xl:h-10 w-1.5 xl:w-2 rounded-full transition-all duration-500 ${i < currentSamples.length ? 'bg-indigo-600 shadow-[0_0_10px_rgba(79,70,229,0.3)]' : 'bg-slate-100'}`} />
                ))}
              </div>
            </div>
          </div>

          </div>

          <div className="flex-1 overflow-y-auto p-4 xl:p-10 bg-[#FBFBFE] custom-scrollbar">
            {mode === 'sent' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 xl:gap-6">
                {[
                  { s: "Project Alpha Roadmap", b: "Attached is the latest schedule for our Q1 product rollout." },
                  { s: "Re: Client Feedback", b: "I agree with the direction, but let's sharpen the value prop." },
                  { s: "Weekly Sync", b: "Moving the meeting to Wednesday at 2pm." },
                  { s: "Internal Brief", b: "Key takeaways from the summit are listed below." }
                ].map((item, i) => (
                  <div key={i} className="group p-5 xl:p-6 bg-white border border-slate-200 rounded-[1.5rem] xl:rounded-[2rem] hover:border-indigo-400 transition-all flex flex-col justify-between h-48 xl:h-56 shadow-sm">
                    <div>
                      <div className="flex justify-between items-start mb-4">
                         <div className="p-2 bg-slate-50 rounded-xl text-slate-400"><Database size={18} /></div>
                         <button onClick={() => handleAdd(item.s, item.b)} className="px-4 py-2 bg-slate-900 text-white text-[10px] font-black rounded-lg uppercase tracking-widest active:scale-90 transition-transform">Add</button>
                      </div>
                      <h4 className="font-bold text-slate-900 mb-1 text-sm xl:text-base">{item.s}</h4>
                      <p className="text-[11px] xl:text-xs text-slate-400 leading-relaxed line-clamp-2 italic font-medium">"{item.b}"</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-full flex flex-col gap-4">
                 <textarea 
                  className="flex-1 min-h-[150px] w-full p-6 xl:p-8 text-sm bg-white border border-slate-200 rounded-[1.5rem] xl:rounded-[2rem] outline-none focus:border-indigo-400 transition-all"
                  placeholder="Paste raw email text here..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                 />
                 <button onClick={() => handleAdd("Manual Entry", inputText)} className="py-4 bg-indigo-600 text-white rounded-xl font-black text-xs uppercase tracking-widest">Inject Sample</button>
              </div>
            )}
          </div>
        </main>

        {/* --- 3. DNA STACK --- */}
        <section className="w-full xl:w-[400px] border-t xl:border-t-0 xl:border-l border-slate-200 bg-white flex flex-col shrink-0 xl:h-full max-h-[40vh] xl:max-h-full">
          

          <div className="flex-1 overflow-y-auto p-6 space-y-2 xl:space-y-3 custom-scrollbar bg-white">
            {currentSamples.length > 0 ? currentSamples.map((s, i) => (
              <div key={s.id} className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-2xl">
                <div className="flex items-center gap-3 overflow-hidden">
                  <span className="text-[10px] font-black text-slate-300 italic">0{i+1}</span>
                  <span className="text-xs font-bold text-slate-700 truncate uppercase tracking-tight">{s.subject}</span>
                </div>
                <button onClick={() => removeSample(s.id)} className="text-slate-300 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
              </div>
            )) : (
              <div className="h-20 xl:h-full flex flex-col items-center justify-center opacity-30">
                <Fingerprint size={48} className="mb-2" />
                <p className="text-[9px] font-black uppercase tracking-widest text-center">Empty Stack</p>
              </div>
            )}
          </div>

          <div className="p-6 border-t border-slate-100 bg-[#FBFBFE]">
             <button 
                disabled={currentSamples.length < 10}
                className={`w-full py-5 xl:py-6 rounded-2xl xl:rounded-[2rem] font-black text-[11px] uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 shadow-lg ${
                  currentSamples.length === 10 
                  ? 'bg-indigo-600 text-white shadow-indigo-200 hover:bg-indigo-700 active:scale-95' 
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                }`}
              >
                Train Model <ArrowRight size={18} />
             </button>            
          </div>
          
        </section>

        {/* MOBILE OVERLAY FOR SIDEBAR */}
        {isSidebarOpen && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[90] xl:hidden" onClick={() => setSidebarOpen(false)} />
        )}
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #E2E8F0; border-radius: 20px; }
      `}</style>
    </div>
  );
};

export default TrainingLab;