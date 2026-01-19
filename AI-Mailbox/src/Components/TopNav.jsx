import React, { useState, useRef } from "react";
import { ChevronDown, Check, Mail } from "lucide-react";

const TopNav = ({
  folders,
  activeFolder,
  setActiveFolder,
  Account,
  activeTab,
  setActiveTab,
  isAccountDropdownOpen,
  setIsAccountDropdownOpen,
  setIsLabOpen
}) => {
  return (
    <header className="bg-gradient-to-b from-white to-gray-50/50 border-b border-gray-200 sticky top-0 z-40 backdrop-blur-sm bg-white/95">
      <style>{`
          .smooth-scroll { scroll-behavior: smooth; -webkit-overflow-scrolling: touch; -ms-overflow-style: none; scrollbar-width: none; }
          .smooth-scroll::-webkit-scrollbar { display: none; }
        `}</style>

      <div className="px-4 pt-4 lg:pt-7 pb-3 w-md">
        {/* Account Selector */}
        <div className="flex justify-center gap-5 items-center mb-5 relative">
          
          <div
            onClick={() => setIsAccountDropdownOpen(!isAccountDropdownOpen)}
            className="flex items-center gap-2.5 border-2 border-gray-200 rounded-xl px-5 py-2.5 shadow-sm bg-white cursor-pointer hover:border-blue-300 hover:bg-blue-50/50 transition-all group z-30"
          >
            <div className="w-2 h-2 bg-blue-600 rounded-full group-hover:scale-110 transition-transform"></div>
            <span className="text-sm font-bold text-gray-800">
              {activeTab}
            </span>
            <ChevronDown
              size={16}
              className={`text-gray-500 transition-transform ${
                isAccountDropdownOpen ? "rotate-180" : ""
              }`}
            />
          </div>
         <button
  className="
   
    px-6 py-2.5
    rounded-2xl
    bg-gray-900 text-white
    shadow-lg
    hover:bg-gray-800
    transition
  "
  onClick={() => setIsLabOpen(true)}
>
  Training Lab
</button>


          {isAccountDropdownOpen && (
            <>
              <div
                className="fixed inset-0 z-20 bg-black/5 backdrop-blur-sm"
                onClick={() => setIsAccountDropdownOpen(false)}
              ></div>
              <div className="absolute top-14 left-1/2 -translate-x-1/2 w-56 bg-white border-2 border-gray-200 rounded-2xl shadow-2xl z-30 py-2 overflow-hidden">
                <div className="px-3 py-2 border-b border-gray-100">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Switch Account</p>
                </div>
                {Account.map((acc) => (
                  <button
                    key={acc}
                    onClick={() => {
                      setActiveTab(acc);
                      setIsAccountDropdownOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-4 py-2.5 text-sm font-semibold transition-all ${
                      activeTab === acc
                        ? "bg-blue-50 text-blue-700"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className={`w-2 h-2 rounded-full ${
                        activeTab === acc ? "bg-blue-600" : "bg-gray-300"
                      }`}></div>
                      {acc}
                    </div>
                    {activeTab === acc && (
                      <Check size={16} className="text-blue-600" />
                    )}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Account Tabs with Better Scrollbar */}
        <div className="flex gap-1 overflow-x-auto smooth-scroll mb-3 pb-2">
          {Account.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-sm font-bold rounded-lg whitespace-nowrap transition-all ${
                activeTab === tab
                  ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
};

export default TopNav