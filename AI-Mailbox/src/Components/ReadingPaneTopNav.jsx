import { useState, useRef, useEffect } from "react";
import {
  Mail,
  ArrowLeft,
  Archive,
  Trash2,
  MoreHorizontal,
  Printer,
  FolderInput,
  MailOpen,
  ChevronRight,
} from "lucide-react";

const ReadingPaneTopNav = ({
  selectedEmail,
  setSelectedEmail,
  openEmail,
  setAllEmails,
  folders,
}) => {
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
  const [isMoveOpen, setIsMoveOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const menuRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsMoreMenuOpen(false);
        setIsMoveOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  const moveEmail = async (id, targetFolder) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/emails/update-conversation-folder/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ threadId: id, newFolder: targetFolder }),
        }
      );
      if (!response.ok) throw new Error("Request failed");
      setAllEmails((prev) =>
        prev.map((email) =>
          email.id === id ? { ...email, folder: targetFolder } : email
        )
      );
      showToast(`Moved to ${targetFolder}`);
    } catch (error) {
      showToast("Failed to move email");
      console.error(error);
    }
    if (selectedEmail === id) setSelectedEmail(null);
    setIsMoreMenuOpen(false);
    setIsMoveOpen(false);
  };

  const toggleReadStatus = async (id) => {
    setAllEmails((prev) =>
      prev.map((email) =>
        email.id === id ? { ...email, unread: !email.unread } : email
      )
    );
    try {
      await fetch(
        `${import.meta.env.VITE_API_URL}/api/emails/update-conversation-read/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ threadId: id }),
        }
      );
      showToast(openEmail?.unread ? "Marked as read" : "Marked as unread");
    } catch (error) {
      console.error(error);
    }
  };

  const moveableFolders = (folders || []).filter((f) => f !== openEmail?.folder);

  return (
    <>
      {/* ── Top Nav ── */}
      <header className="h-[52px] flex items-center justify-between px-3 lg:px-5 bg-white border-b border-[#e8e5e0] sticky top-0 z-30">
        
        {/* Left: back + primary actions */}
        <div className="flex items-center gap-1">
          {/* Mobile back */}
          <button
            onClick={() => setSelectedEmail(null)}
            className="lg:hidden p-2 rounded-lg hover:bg-[#f3f0ec] text-[#6b6660] hover:text-[#1a1814] transition-colors mr-1"
            title="Back"
          >
            <ArrowLeft size={18} strokeWidth={2} />
          </button>

          {/* Archive */}
          <ActionButton
            onClick={() => moveEmail(openEmail?.id, "Archive")}
            tooltip="Archive"
            hoverColor="hover:bg-[#f0fdf4] hover:text-emerald-700"
          >
            <Archive size={16} strokeWidth={2} />
          </ActionButton>

          {/* Delete */}
          <ActionButton
            onClick={() => moveEmail(openEmail?.id, "Trash")}
            tooltip="Delete"
            hoverColor="hover:bg-red-50 hover:text-red-600"
          >
            <Trash2 size={16} strokeWidth={2} />
          </ActionButton>

          {/* Divider */}
          <div className="w-px h-5 bg-[#e8e5e0] mx-1" />

          {/* Mark read/unread */}
          <ActionButton
            onClick={() => toggleReadStatus(openEmail?.id)}
            tooltip={openEmail?.unread ? "Mark as read" : "Mark as unread"}
            hoverColor="hover:bg-blue-50 hover:text-blue-600"
            active={openEmail?.unread}
            activeClass="bg-blue-50 text-blue-600"
          >
            {openEmail?.unread ? (
              <Mail size={16} strokeWidth={2} />
            ) : (
              <MailOpen size={16} strokeWidth={2} />
            )}
          </ActionButton>
        </div>

        {/* Right: more menu */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => { setIsMoreMenuOpen((v) => !v); setIsMoveOpen(false); }}
            className={`p-2 rounded-lg transition-colors text-[#6b6660] ${
              isMoreMenuOpen
                ? "bg-[#f3f0ec] text-[#1a1814]"
                : "hover:bg-[#f3f0ec] hover:text-[#1a1814]"
            }`}
            title="More options"
          >
            <MoreHorizontal size={17} strokeWidth={2} />
          </button>

          {isMoreMenuOpen && (
            <div className="absolute right-0 mt-1.5 w-52 bg-white border border-[#e8e5e0] rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.10)] z-50 py-1.5 overflow-hidden">
              
              {/* Print */}
              <MenuItem
                icon={<Printer size={14} strokeWidth={2} className="text-[#a09990]" />}
                label="Print"
                onClick={() => { window.print(); setIsMoreMenuOpen(false); }}
              />

              {/* Move to folder — submenu */}
              {moveableFolders.length > 0 && (
                <>
                  <div className="h-px bg-[#f0ece8] my-1 mx-3" />
                  <div className="relative">
                    <button
                      onClick={() => setIsMoveOpen((v) => !v)}
                      className="w-full flex items-center justify-between gap-2 px-3.5 py-2 text-[13px] font-medium text-[#3d3a36] hover:bg-[#f8f6f3] transition-colors"
                    >
                      <span className="flex items-center gap-2.5">
                        <FolderInput size={14} strokeWidth={2} className="text-[#a09990]" />
                        Move to folder
                      </span>
                      <ChevronRight
                        size={13}
                        className={`text-[#c5bfb8] transition-transform ${isMoveOpen ? "rotate-90" : ""}`}
                      />
                    </button>

                    {isMoveOpen && (
                      <div className="mx-2 mb-1 mt-0.5 bg-[#faf8f6] rounded-xl border border-[#ede9e4] overflow-hidden">
                        {moveableFolders.map((folder) => (
                          <button
                            key={folder}
                            onClick={() => moveEmail(openEmail?.id, folder)}
                            className="w-full flex items-center gap-2 px-3.5 py-2 text-[12.5px] font-medium text-[#3d3a36] hover:bg-[#f0ece8] transition-colors"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-[#c5bfb8] flex-shrink-0" />
                            {folder}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </header>

      {/* ── Toast ── */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] pointer-events-none">
          <div className="bg-[#1a1814] text-white text-[12.5px] font-medium px-4 py-2.5 rounded-xl shadow-xl animate-fade-in-up">
            {toast}
          </div>
        </div>
      )}

      <style>{`
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateX(-50%) translateY(8px); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
        .animate-fade-in-up { animation: fade-in-up 0.2s ease; }
      `}</style>
    </>
  );
};

/* ── Sub-components ── */

const ActionButton = ({
  onClick,
  tooltip,
  hoverColor = "hover:bg-[#f3f0ec] hover:text-[#1a1814]",
  active,
  activeClass = "",
  children,
}) => (
  <div className="relative group">
    <button
      onClick={onClick}
      className={`p-2 rounded-lg transition-colors text-[#6b6660] ${hoverColor} ${
        active ? activeClass : ""
      }`}
    >
      {children}
    </button>
    <span className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-2.5 py-1.5 text-[11px] font-medium text-white bg-[#1a1814] rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-lg z-50">
      {tooltip}
    </span>
  </div>
);

const MenuItem = ({ icon, label, onClick }) => (
  <button
    onClick={onClick}
    className="w-full flex items-center gap-2.5 px-3.5 py-2 text-[13px] font-medium text-[#3d3a36] hover:bg-[#f8f6f3] transition-colors"
  >
    {icon}
    {label}
  </button>
);

export default ReadingPaneTopNav;