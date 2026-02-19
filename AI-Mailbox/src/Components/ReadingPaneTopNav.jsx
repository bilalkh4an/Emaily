import { useState } from "react";
import {
  Mail,
  ArrowLeft,
  Archive,
  Trash2,
  MoreVertical,
  Printer,
  AlertOctagon,
  MailOpen,
} from "lucide-react";

const ReadinPaneTopNav = ({
  selectedEmail,
  setSelectedEmail,
  openEmail,
  setAllEmails,
  folders,
}) => {
  const moveEmail = (id, targetFolder) => {
    setAllEmails((prev) =>
      prev.map((email) =>
        email.id === id ? { ...email, folder: targetFolder } : email
      )
    );
    if (selectedEmail === id) setSelectedEmail(null);
    setIsMoreMenuOpen(false);
  };

  const toggleReadStatus = (id) => {
    setAllEmails((prev) =>
      prev.map((email) =>
        email.id === id ? { ...email, unread: !email.unread } : email
      )
    );
  };

  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);

  return (
    <header className="h-14 border-b border-gray-200 flex items-center justify-between px-4 lg:px-6 bg-white sticky top-0 z-30">
      <div className="flex items-center gap-3">
        <button
          onClick={() => setSelectedEmail(null)}
          className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors active:scale-95"
          title="Back to inbox"
        >
          <ArrowLeft size={20} className="text-gray-700" />
        </button>

        {/* Action Buttons */}
        <div className="flex gap-1.5">
          <button
            onClick={() => moveEmail(openEmail?.id, "Archive")}
            className="relative group p-2 hover:bg-blue-50 rounded-lg transition-all active:scale-95"
            title="Archive"
          >
            <Archive
              size={18}
              className="text-gray-600 group-hover:text-blue-600"
            />
            <span className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-2.5 py-1.5 text-xs font-medium text-white bg-gray-900 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-lg">
              Archive
            </span>
          </button>

          <button
            onClick={() => moveEmail(openEmail?.id, "Trash")}
            className="relative group p-2 hover:bg-red-50 rounded-lg transition-all active:scale-95"
            title="Delete"
          >
            <Trash2
              size={18}
              className="text-gray-600 group-hover:text-red-600"
            />
            <span className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-2.5 py-1.5 text-xs font-medium text-white bg-gray-900 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-lg">
              Delete
            </span>
          </button>

          <button
            onClick={() => toggleReadStatus(openEmail?.id)}
            className={`relative group p-2 rounded-lg transition-all active:scale-95 ${
              openEmail?.unread
                ? "bg-blue-50 hover:bg-blue-100"
                : "hover:bg-gray-100"
            }`}
            title={openEmail?.unread ? "Mark as read" : "Mark as unread"}
          >
            {openEmail?.unread ? (
              <Mail size={18} className="text-blue-600" />
            ) : (
              <MailOpen size={18} className="text-gray-600" />
            )}
            <span className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-2.5 py-1.5 text-xs font-medium text-white bg-gray-900 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-lg">
              {openEmail?.unread ? "Mark as read" : "Mark as unread"}
            </span>
          </button>
        </div>
      </div>

      {/* More Menu */}
      <div className="relative">
        <button
          onClick={() => setIsMoreMenuOpen(!isMoreMenuOpen)}
          className={`p-2 rounded-lg transition-all active:scale-95 ${
            isMoreMenuOpen
              ? "bg-gray-100 text-gray-900"
              : "text-gray-600 hover:bg-gray-100"
          }`}
          title="More options"
        >
          <MoreVertical size={18} />
        </button>

        {isMoreMenuOpen && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsMoreMenuOpen(false)}
            ></div>
            <div className="absolute right-0 mt-2 w-52 bg-white border-2 border-gray-200 rounded-xl shadow-2xl z-50 py-1.5 overflow-hidden">
              <div className="px-3 py-1.5 border-b border-gray-100">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                  Actions
                </p>
              </div>
              <button
                onClick={() => window.print()}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <Printer size={16} className="text-gray-500" />
                <span>Print</span>
              </button>
              <div className="h-px bg-gray-100 my-1"></div>
             
              {folders.map((item) => (
                <div
                  key={item}
                  className={` ${
                    item === openEmail.folder ? "hidden" : "block"
                  }`}
                >
                  
                  <button
                onClick={() => moveEmail(openEmail?.id, item)}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-semibold hover:bg-red-50 transition-colors"
              >
                <AlertOctagon size={16} />
                <span>Move To {item}</span>
              </button>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </header>
  );
};

export default ReadinPaneTopNav;
