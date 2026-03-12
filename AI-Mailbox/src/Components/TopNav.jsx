import React, { useState, useRef } from "react";
import { ChevronDown, Check, Mail } from "lucide-react";

const TopNav = ({
  folders,
  activeFolder,
  setActiveFolder,
  Account,
  activeTab,
  setActiveTab,
  setIsLabOpen,
}) => {

  
  const [isAccountDropdownOpen, setIsAccountDropdownOpen] = useState(false);



  return (
    <header className="bg-gradient-to-b from-white to-gray-50/50 border-b border-gray-200 sticky top-0 z-40 backdrop-blur-sm bg-white/95">
      <style>{`
          .smooth-scroll { scroll-behavior: smooth; -webkit-overflow-scrolling: touch; -ms-overflow-style: none; scrollbar-width: none; }
          .smooth-scroll::-webkit-scrollbar { display: none; }
        `}</style>

      <div className="px-4 pt-4 lg:pt-7 pb-3 ">
        {/* Account Selector */}
        <div className="mb-5">
        
          <button
            className="px-6 py-2.5 w-full bg-[#1a1814] font-semibold hover:bg-[#2d2a26] text-white rounded-2xl shadow-lg transition"
            onClick={() => setIsLabOpen(true)}
          >
            Training Lab
          </button>

         
        </div>

        {/* Account Tabs with Better Scrollbar */}
        <div className="flex gap-1 overflow-x-auto smooth-scroll mb-2">
          {Account.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-sm font-bold rounded-lg whitespace-nowrap transition-all ${
                activeTab === tab
                  ? "bg-[#f3f0ec] hover:bg-[#ebe7e2] text-[#3d3a36]  text-[13px] font-semibold border border-[#e5e0da] hover:border-[#d5d0ca]"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900 text-[13px] font-semibold border border-[#e5e0da] hover:border-[#d5d0ca]"
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

export default TopNav;
