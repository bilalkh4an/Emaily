import { useState } from "react";
import { Reply, ReplyAll, Forward, Sparkles, Clock, Paperclip } from "lucide-react";

const ReadingPane = ({
  setComposeData,
  setIsComposeOpen,
  setIsAIReplyOpen,
  Avatar,
  openEmail,
}) => {
  const handleAction = (type, email) => {
    let prefix = type === "reply" ? "Re: " : "Fwd: ";
    setComposeData({
      from: email.account,
      to: type === "reply" ? email.sender : "",
      subject: `${prefix}${email.subject}`,
      body: `\n\n--- Original Message ---\nFrom: ${email.sender}\n\n${email.messages[0].body}`,
      threadid: email.threadid,
      attachments: [],
    });
    setIsComposeOpen(true);
  };

  return (
    <>
      {openEmail ? (
        <div className="flex-1 overflow-y-auto bg-gradient-to-b from-gray-50/30 to-white">
          <div className="max-w-4xl mx-auto px-4 py-6 lg:px-8 lg:py-8">
            {/* Email Header Section */}
            <div className="mb-6 pb-4 border-b border-gray-200">
              <h1 className="text-xl font-bold text-gray-900 mb-2 leading-tight">
                {openEmail.subject}
              </h1>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Clock size={14} />
                <span>{openEmail.messages[0].time}</span>
                {openEmail.attachments?.length > 0 && (
                  <>
                    <span className="mx-1">•</span>
                    <Paperclip size={14} />
                    <span>{openEmail.attachments.length} attachment{openEmail.attachments.length > 1 ? 's' : ''}</span>
                  </>
                )}
              </div>
            </div>

            {/* THREAD CONVERSATION START */}
            <div className="space-y-6 mb-8">
              {openEmail.messages.map((msg, index) => (
                <div key={msg._id || `msg-${index}`} className="relative">
                  {/* Message Card */}
                  <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-all">
                    {/* Message Header */}
                    <div className="flex items-start gap-3 mb-3">
                      <Avatar
                        email={{ sender: msg.sender, avatar: msg.avatar }}
                        size="w-9 h-9"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-0.5">
                          <p className="font-semibold text-sm text-gray-900 truncate">
                            {msg.sender}
                          </p>
                          <span className="text-xs text-gray-500 whitespace-nowrap flex items-center gap-1">
                            <Clock size={11} />
                            {msg.time}  
                          </span>
                        </div>
                        <p className="text-xs text-gray-600">
                          To: {openEmail.sender}
                        </p>
                      </div>
                    </div>

                    {/* Message Body */}
                    <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                      {msg.body}
                    </div>

                    {/* Attachments if any */}
                    {msg.attachments?.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-gray-100">
                        <div className="flex flex-wrap gap-2">
                          {msg.attachments.map((att, i) => (
                            <div key={i} className="flex items-center gap-1.5 bg-gray-50 px-2.5 py-1.5 rounded-lg border border-gray-200 text-xs font-medium text-gray-700">
                              <Paperclip size={12} />
                              {att}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Vertical connector line between messages */}
                  {index !== openEmail.messages.length - 1 && (
                    <div className="absolute left-4 top-[100%] h-6 w-0.5 bg-gradient-to-b from-gray-300 to-transparent"></div>
                  )}
                </div>
              ))}
            </div>
            {/* THREAD CONVERSATION END */}

            {/* Action Buttons */}
            <div className="sticky bottom-0 bg-gradient-to-t from-white via-white to-transparent pt-6 pb-3">
              <div className="bg-white border border-gray-200 rounded-xl p-3.5 shadow-lg">
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => handleAction("reply", openEmail)}
                    className="flex items-center gap-1.5 px-3 md:px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg text-sm font-bold shadow-md shadow-blue-200/50 hover:from-blue-700 hover:to-blue-800 transition-all active:scale-95"
                  >
                    <Reply size={16} />
                    <span>Reply</span>
                  </button>

                  <button
                    onClick={() => handleAction("reply", openEmail)}
                    className="flex items-center gap-1.5 px-3 md:px-4 py-2 bg-white border-2 border-gray-200 text-gray-700 rounded-lg text-sm font-bold hover:bg-gray-50 hover:border-gray-300 transition-all active:scale-95"
                  >
                    <ReplyAll size={16} />
                    <span>Reply All</span>
                  </button>

                  <button
                    onClick={() => setIsAIReplyOpen(true)}
                    className="flex items-center gap-1.5 px-3 md:px-4 py-2 bg-gradient-to-r from-purple-50 to-blue-50 text-purple-600 rounded-lg text-sm font-bold border-2 border-purple-200/50 hover:from-purple-100 hover:to-blue-100 hover:border-purple-300/50 transition-all active:scale-95 shadow-sm"
                  >
                    <Sparkles size={16} />
                    <span>AI Reply</span>
                  </button>

                  <button
                    onClick={() => handleAction("forward", openEmail)}
                    className="flex items-center gap-1.5 px-3 md:px-4 py-2 bg-white border-2 border-gray-200 text-gray-700 rounded-lg text-sm font-bold hover:bg-gray-50 hover:border-gray-300 transition-all active:scale-95"
                  >
                    <Forward size={16} />
                    <span>Forward</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center text-gray-400 bg-gradient-to-b from-gray-50/30 to-white">
          <div className="text-center space-y-2">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Reply size={24} className="text-gray-300" />
            </div>
            <p className="text-base font-semibold text-gray-500">No email selected</p>
            <p className="text-xs text-gray-400">Select an email from the list to read</p>
          </div>
        </div>
      )}
    </>
  );
};
export default ReadingPane;