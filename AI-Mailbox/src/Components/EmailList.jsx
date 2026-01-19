import React from "react";
import {Search} from "lucide-react";

const EmailList = ({ filteredEmails, setSelectedEmail, selectedEmail }) => {
  return (
    <div className="flex-1 overflow-y-auto pb-24 
      [&::-webkit-scrollbar]:w-1.5
      [&::-webkit-scrollbar-track]:bg-transparent
      [&::-webkit-scrollbar-thumb]:bg-slate-200
      [&::-webkit-scrollbar-thumb]:rounded-full
      hover:[&::-webkit-scrollbar-thumb]:bg-slate-300">
      
      {filteredEmails.map((email) => {
        const isActive = selectedEmail === email.id;
        
        return (
          <div
            key={email.id}
            onClick={() => setSelectedEmail(email.id)}
            className={`group relative flex items-start gap-4 px-6 py-5 border-b border-gray-50 cursor-pointer transition-all duration-200 ${
              isActive ? "bg-blue-50/40" : "hover:bg-gray-50/80"
            }`}
          >
            {/* Active Highlight Pill */}
            {isActive && (
              <div className="absolute left-0 top-1/2 -translate-y-1/2 h-10 w-1 bg-blue-600 rounded-r-full animate-in slide-in-from-left-full duration-200" />
            )}

            {/* Avatar Section */}
            <div className={`relative flex-shrink-0 w-11 h-11 rounded-2xl flex items-center justify-center overflow-hidden font-bold transition-transform duration-200 group-hover:scale-105 ${
              isActive ? "bg-blue-600 text-white shadow-lg shadow-blue-100" : "bg-white border border-gray-200 text-gray-500 shadow-sm"
            }`}>
              {email.avatar ? (
                <img
                  src={email.avatar}
                  alt={email.sender}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-sm tracking-tighter uppercase">{email.sender?.charAt(0)}</span>
              )}
            </div>

            {/* Content Section */}
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-center mb-1">
                <span className={`text-[15px] truncate transition-colors ${
                  email.unread ? "font-black text-gray-900" : "font-semibold text-gray-600"
                }`}>
                  {email.sender}
                </span>
                <span className="text-[12px] font-bold text-gray-400 whitespace-nowrap ml-3">
                  {email.time}
                </span>
              </div>

              <h4 className={`text-[14px] truncate mb-1 transition-colors ${
                email.unread ? "font-bold text-gray-800" : "font-medium text-gray-500"
              }`}>
                {email.subject}
              </h4>

              {/* Email Snippet (Optional - adds a lot of value) */}
              <p className="text-[13px] text-gray-400  line-clamp-1 leading-relaxed">
                {email.messages?.[0]?.body || "No additional content available for this preview..."}
              </p>
            </div>

            {/* Status Indicators */}
            <div className="flex flex-col items-end gap-2 self-stretch pt-1">
              {email.unread && (
                <div className="w-2.5 h-2.5 bg-blue-600 rounded-full shadow-sm shadow-blue-200"></div>
              )}
              {email.starred && (
                <div className="text-amber-400">★</div>
              )}
            </div>
          </div>
        );
      })}
      
      {filteredEmails.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 px-10 text-center">
          <div className="bg-gray-50 p-4 rounded-full mb-4">
            <Search size={24} className="text-gray-300" />
          </div>
          <p className="text-gray-500 font-bold">No emails found</p>
          <p className="text-gray-400 text-sm">Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  );
};

export default EmailList;