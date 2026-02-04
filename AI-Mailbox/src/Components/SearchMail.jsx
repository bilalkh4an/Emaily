import React, { useState, useRef } from "react";
import { Search, Edit2, X } from "lucide-react";

const SearchMail = ({
  activeFolder,
  setSearchQuery,
  searchQuery,
  setIsComposeOpen,
  setComposeData,
}) => {
  const searchInputRef = useRef(null);

  const clearSearch = () => {
    setSearchQuery("");
    searchInputRef.current?.focus();
  };

  return (
    <div className="px-4 mb-4 w-full flex gap-3 items-center pt-5">
      {/* Search Input */}
      <div className="flex-1 relative group">
        <Search
          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors"
          size={18}
        />
        <input
          ref={searchInputRef}
          type="text"
          placeholder={`Search in ${activeFolder}...`}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-white border-2 border-gray-200 py-3 pl-11 pr-11 rounded-xl text-sm font-medium outline-none focus:border-blue-400 focus:bg-blue-50/30 placeholder:text-gray-400 transition-all shadow-sm hover:border-gray-300"
        />
        {searchQuery && (
          <button
            onClick={clearSearch}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600 transition-all"
            title="Clear search"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Compose Button - Mobile Only */}
      <div className="xl:hidden">
        <button
          onClick={() => {
            setComposeData({
              to: "",
              subject: "",
              body: "",
              attachments: [],
            });
            setIsComposeOpen(true);
          }}
          className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-3.5 rounded-xl shadow-lg shadow-blue-200/50 hover:from-blue-700 hover:to-blue-800 active:scale-95 transition-all"
          title="Compose new email"
        >
          <Edit2 size={18} />
        </button>
      </div>
    </div>
  );
};

export default SearchMail;