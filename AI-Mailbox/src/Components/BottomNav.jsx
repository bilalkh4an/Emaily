import React, { useState } from "react";
import { Inbox, Search, Send, Archive, Trash, Star, Plus, CheckSquare, Settings } from "lucide-react";

const BottomNav = ({
  setIsComposeOpen,
  activeFolder,
  setSelectedEmail,
  setActiveFolder,
  setIsSettingsOpen,
  setComposeData,
  searchInputRef,
}) => {
  const navItems = [
    { id: "Inbox", icon: Inbox, label: "Inbox" },
    { id: "Sent", icon: Send, label: "Sent" },
    { id: "Starred", icon: Star, label: "Starred" },
    { id: "Archive", icon: Archive, label: "Archive" },
    { id: "Trash", icon: Trash, label: "Trash" },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-gray-200 z-40 safe-area-bottom">
      <div className="flex justify-around items-center px-2 py-2.5 pb-safe">
        {navItems.map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            onClick={() => {
              setActiveFolder(id);
              setSelectedEmail(null);
            }}
            className={`relative flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all active:scale-95 ${
              activeFolder === id
                ? "text-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {/* Active Indicator */}
            {activeFolder === id && (
              <div className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-8 h-1 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full" />
            )}
            
            {/* Icon Container */}
            <div className={`relative transition-all ${
              activeFolder === id ? "scale-110" : ""
            }`}>
              <Icon size={20} strokeWidth={activeFolder === id ? 2.5 : 2} />
              
              {/* Active Glow Effect */}
              {activeFolder === id && (
                <div className="absolute inset-0 bg-blue-500/20 blur-lg rounded-full -z-10" />
              )}
            </div>
            
            <span className={`text-[9px] font-semibold tracking-tight ${
              activeFolder === id ? "font-bold" : ""
            }`}>
              {label}
            </span>
          </button>
        ))}

        {/* Settings Button */}
        <button
          onClick={() => setIsSettingsOpen(true)}
          className="relative flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl text-gray-500 hover:text-gray-700 transition-all active:scale-95"
        >
          <div className="relative">
            <Settings size={20} strokeWidth={2} />
          </div>
          <span className="text-[9px] font-semibold tracking-tight">Settings</span>
        </button>
      </div>

      {/* Safe Area for iPhone notch */}
      <div className="h-safe bg-white/80 backdrop-blur-xl" />
    </nav>
  );
};

export default BottomNav