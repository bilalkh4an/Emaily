import React from "react";
import {
  Inbox,
  Archive,
  Trash2,
  Send,
  Star,
  Edit2,
  Settings,
  ChevronRight,
  ShieldCheck,
  CreditCard,
} from "lucide-react";

const SideNav = ({
  folders,
  activeFolder,
  setActiveFolder,
  setComposeData,
  setIsComposeOpen,
  setIsSettingsOpen,
  setIsLabOpen,
  onLogout,
}) => {
  const getIcon = (folder, isActive) => {
    const props = {
      size: 18,
      className: isActive
        ? "text-blue-600"
        : "text-gray-400 group-hover:text-gray-600 transition-colors",
    };
    switch (folder) {
      case "Inbox":
        return <Inbox {...props} />;
      case "Starred":
        return <Star {...props} />;
      case "Sent":
        return <Send {...props} />;
      case "Archive":
        return <Archive {...props} />;
      case "Trash":
        return <Trash2 {...props} />;
      case "Settings":
        return <Settings {...props} />;
      default:
        return null;
    }
  };

  return (
    <aside className="hidden lg:flex w-64 border-r border-gray-100 flex-col bg-white">
      {/* Brand Section */}
      <div className="px-6 py-7">
        <div className="flex items-center gap-3 px-1">
          <div className="w-8 h-8 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black italic shadow-lg shadow-blue-200">
            E
          </div>
          <span className="font-black text-gray-800 tracking-tight text-lg">
            EmailShop
          </span>
        </div>
      </div>

      {/* Compose */}
      <div className="px-4 mb-6">
        <button
          className="group flex items-center justify-center gap-2 bg-blue-600 text-white w-full py-3.5 rounded-2xl shadow-xl shadow-blue-100 hover:bg-blue-700 active:scale-[0.98] transition-all duration-200 font-bold text-[15px]"
          onClick={() => {
            setComposeData({
              from: "",
              to: "",
              subject: "",
              body: "",
              attachments: [],
            });
            setIsComposeOpen(true);
          }}
        >
          <Edit2
            size={18}
            className="group-hover:rotate-12 transition-transform"
          />
          Compose
        </button>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
        <div className="px-3 mb-2">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">
            Mailboxes
          </p>
        </div>

        {folders.map((folder) => {
          const isActive = activeFolder === folder;
          return (
            <button
              key={folder}
              className={`group w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all duration-200 ${
                isActive
                  ? "bg-blue-50/80 text-blue-700"
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
              }`}
              onClick={() => setActiveFolder(folder)}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`p-1.5 rounded-lg transition-colors ${isActive ? "bg-white shadow-sm" : ""}`}
                >
                  {getIcon(folder, isActive)}
                </div>
                <span
                  className={`text-[14px] ${isActive ? "font-bold" : "font-semibold"}`}
                >
                  {folder}
                </span>
              </div>
            </button>
          );
        })}

        {/* Separator for Settings Section */}
        <div className="pt-4 pb-2 px-3">
          <div className="h-px bg-gray-100 w-full mb-4" />
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">
            Preferences
          </p>
        </div>

        {/* Settings Button */}
        <button
          onClick={() => setIsSettingsOpen(true)}
          className={`group w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-200 ${
            activeFolder === "Settings"
              ? "bg-blue-50/80 text-blue-700"
              : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
          }`}
        >
          <div
            className={`p-1.5 rounded-lg ${activeFolder === "Settings" ? "bg-white shadow-sm" : ""}`}
          >
            <Settings
              size={18}
              className={
                activeFolder === "Settings"
                  ? "text-blue-600"
                  : "text-gray-400 group-hover:rotate-45 transition-transform"
              }
            />
          </div>
          <span
            className={`text-[14px] ${activeFolder === "Settings" ? "font-bold" : "font-semibold"}`}
          >
            General Settings
          </span>
        </button>
      </nav>

      {/* Profile & Account Section */}
      <div className="p-4 border-t border-gray-50 bg-gray-50/30">
        <div className="flex items-center justify-between mb-4 px-2">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-blue-100 border-2 border-white shadow-sm flex items-center justify-center text-blue-600 font-bold text-xs">
              JD
            </div>
            <div className="min-w-0">
              <p className="text-[12px] font-bold text-gray-800 truncate">
                John Doe
              </p>
              <p className="text-[10px] text-green-600 font-black uppercase">
                Online
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-3 border border-gray-100 shadow-sm">
          <div className="flex justify-between items-center mb-1.5">
            <p className="text-[10px] font-bold text-gray-500 uppercase">
              Storage
            </p>
            <p className="text-[10px] font-bold text-blue-600">7.5 / 10 GB</p>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-1.5">
            <div className="bg-blue-600 h-1.5 rounded-full w-[75%]" />
          </div>
        </div>

        <button
          className=" bg-blue-600 text-white w-full py-3.5 my-1 rounded-xl shadow-xl shadow-blue-100 hover:bg-blue-700 active:scale-[0.98] transition-all duration-200 font-bold text-[12px]"
          onClick={onLogout}
        >
          Logout
        </button>
      </div>
    </aside>
  );
};

export default SideNav;
