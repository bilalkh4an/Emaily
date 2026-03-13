import { useState } from "react";
import {
  Reply,
  ReplyAll,
  Forward,
  Sparkles,
  Clock,
  Paperclip,
  ChevronDown,
  ChevronUp,
  MailOpen,
} from "lucide-react";
import DOMPurify from "dompurify";

const ReadingPane = ({
  setComposeData,
  setIsComposeOpen,
  setIsAIReplyOpen,
  Avatar,
  openEmail,
}) => {
  const [collapsedMessages, setCollapsedMessages] = useState({});

  const toggleMessage = (id) => {
    setCollapsedMessages((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleAction = (type, email) => {
    // 1. Get the most recent message in the thread to reply to
    const lastMessage = email.messages[0];
    const prefix = type === "reply" ? "Re: " : "Fwd: ";

    // 2. Format the Date and Header
    const dateStr = lastMessage.time || new Date().toLocaleString();

    // Industry standard "On... wrote:" line
    const quoteHeader =
      type === "reply"
        ? `<div style="margin: 20px 0 10px 0;">On ${dateStr}, ${lastMessage.sender} wrote:</div>`
        : `<div style="margin: 20px 0 10px 0;">
        <hr style="border:none; border-top:1px solid #e0e0e0;" />
        <p style="margin:0; font-family: sans-serif; font-size: 14px;">
          <b>From:</b> ${lastMessage.sender}<br>
          <b>Date:</b> ${dateStr}<br>
          <b>Subject:</b> ${email.subject}<br>
          <b>To:</b> ${email.account}<br>
        </p>
        <br>
       </div>`;

    // 3. Construct the HTML body with "Bulletproof" CSS
    // We use inline styles because email clients (especially Gmail) strip <style> tags.
    const originalContent = lastMessage.rawHtmlbody || lastMessage.body || "";

    const professionalBody = `
    <div><br></div> 
    <div class="gmail_quote">
      ${quoteHeader}
      <blockquote 
        type="cite" 
        style="margin:0 0 0 .8ex; border-left:1px #ccc solid; padding-left:1ex; color: #500050;"
      >
        ${originalContent}
      </blockquote>
    </div>
  `;

    // 4. Set the Compose Data
    setComposeData({
      from: email.account,
      to: type === "reply" ? email.sender : "",
      // Avoid "Re: Re: Re: " by checking if prefix already exists
      subject: email.subject.toLowerCase().startsWith(prefix.toLowerCase())
        ? email.subject
        : `${prefix}${email.subject}`,
      body: professionalBody,
      // CRITICAL: Include the original message ID so your backend can
      // set the 'In-Reply-To' and 'References' headers properly.
      inReplyTo: lastMessage.messageId || email.threadid,
      threadid: email.threadid,
      attachments: [],
    });

    setIsComposeOpen(true);
  };

  const formatTime = (time) => time || "Unknown time";
  const token = localStorage.getItem("token");

  const handleAttachmentDownload = async (uid, filename, folder, account) => {
  try {
    const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/emails/attachments?uid=${uid}&filename=${filename}&folder=${folder}&emailaddress=${account}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      // CRITICAL: Check if the response is OK (200)
    if (!response.ok) {
      const errorData = await response.json(); // Get the 33-byte error message
      alert(`Download failed: ${errorData.error || "Server Error"}`);
      return;
    }
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
  } catch (error) {
    console.error("Failed to download:", error);
  }
};

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-[#f8f7f4]">
      {openEmail ? (
        <>
          {/* ── Top header ── */}
          <div className="flex-shrink-0 bg-white border-b border-[#e8e5e0] px-6 py-5">
            <h1 className="text-[1.25rem] font-semibold text-[#1a1814] leading-snug mb-3 tracking-tight">
              {openEmail.subject}
            </h1>

            <div className="flex items-center flex-wrap gap-x-4 gap-y-1 text-[11px] text-[#8a857d] font-medium tracking-wide uppercase">
              <span className="flex items-center gap-1.5">
                <Clock size={12} strokeWidth={2} />
                {formatTime(openEmail.messages[0]?.time)}
              </span>

              <span className="text-[#d0ccc6]">·</span>

              <span>
                {openEmail.messages.length}{" "}
                {openEmail.messages.length === 1 ? "message" : "messages"} in
                thread
              </span>

              {openEmail.attachments?.length > 0 && (
                <>
                  <span className="text-[#d0ccc6]">·</span>
                  <span className="flex items-center gap-1.5">
                    <Paperclip size={12} strokeWidth={2} />
                    {openEmail.attachments.length} attachment
                    {openEmail.attachments.length > 1 ? "s" : ""}
                  </span>
                </>
              )}
            </div>
          </div>

          {/* ── Thread messages ── */}
          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-3">
            {openEmail.messages.map((msg, index) => {
              const msgId = msg._id || `msg-${index}`;
              const isCollapsed = collapsedMessages[msgId];
              const isLast = index === openEmail.messages.length - 1;
              const content = msg.rawHtmlbody
                ? DOMPurify.sanitize(msg.rawHtmlbody)
                : `<pre style="white-space:pre-wrap">${msg.rawHtmlbody || ""}</pre>`;

              return (
                <div key={msgId} className="relative ">
                  {/* Thread line connector */}
                  {!isLast && (
                    <div className="absolute left-[23px] top-[52px] bottom-[-12px] w-px bg-[#e0dbd4] z-0" />
                  )}

                  <div
                    className={`relative z-10 bg-white rounded-2xl border transition-all duration-200 ${
                      isLast
                        ? "border-[#d4cfc9] shadow-[0_2px_12px_rgba(0,0,0,0.06)]"
                        : "border-[#ebe7e2] shadow-[0_1px_4px_rgba(0,0,0,0.04)]"
                    }`}
                  >
                    {/* Message header (always visible) */}
                    <button
                      onClick={() => !isLast && toggleMessage(msgId)}
                      className={`w-full flex items-center gap-3 px-4 py-3.5 text-left ${
                        isLast
                          ? "cursor-default"
                          : "hover:bg-[#faf9f7] rounded-t-2xl"
                      } transition-colors`}
                    >
                      <div className="flex-shrink-0">
                        <Avatar
                          email={{ sender: msg.sender, avatar: msg.avatar }}
                          size="w-8 h-8"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-baseline justify-between gap-2">
                          <p className="text-sm font-semibold text-[#1a1814] truncate">
                            {msg.sender}
                          </p>
                          <span className="text-[11px] text-[#a09990] whitespace-nowrap font-medium">
                            {formatTime(msg.time)}
                          </span>
                        </div>

                        <p className="text-[11px] text-[#a09990] truncate mt-0.5">
                          To:{" "}
                          {msg.folder == "Inbox"
                            ? openEmail.account
                            : openEmail.sender}
                        </p>
                      </div>

                      {!isLast && (
                        <div className="flex-shrink-0 text-[#c5bfb8]">
                          {isCollapsed ? (
                            <ChevronDown size={15} />
                          ) : (
                            <ChevronUp size={15} />
                          )}
                        </div>
                      )}
                    </button>

                    {/* Message body */}
                    {(!isCollapsed || isLast) && (
                      <div className="px-4 pb-4 ">
                        <div className="h-px bg-[#f0ece8] mb-3.5" />

                        {/* To line */}
                        <p className="text-[11px] text-[#a09990] font-medium mb-3.5 uppercase tracking-wide">
                          To:{" "}
                          {msg.folder == "Inbox"
                            ? openEmail.account
                            : openEmail.sender}
                        </p>

                        {/* Body */}
                        <div
                          className="text-[13.5px] text-[#2d2a26] leading-relaxed break-words prose prose-sm max-w-none "
                          dangerouslySetInnerHTML={{ __html: content }}
                        />

                        {/* Attachments */}
                        {msg.attachments?.length > 0 && (
                          <div className="mt-4 pt-3.5 border-t border-[#f0ece8]">
                            <p className="text-[10px] uppercase tracking-widest text-[#b0a99f] font-semibold mb-2">
                              Attachments
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {msg.attachments.map((att, i) => (
                                <div
                                  key={i}
                                  // ADD: Call your download function here
                                  onClick={() =>
                                    handleAttachmentDownload(
                                      msg.uid,
                                      att.filename,
                                      msg.folder,
                                      openEmail.account,
                                    )
                                  }
                                  className="flex items-center gap-1.5 bg-[#f6f3f0] hover:bg-[#ede9e4] px-3 py-1.5 rounded-lg border border-[#e5e0da] text-[12px] font-medium text-[#5a5550] cursor-pointer transition-colors"
                                >
                                  <Paperclip size={11} strokeWidth={2} />
                                  {/* FIX: Access the filename property instead of rendering the whole object */}
                                  <span className="truncate max-w-[150px]">
                                    {att.filename}
                                  </span>

                                  {/* OPTIONAL: Show size in KB */}
                                  <span className="text-[10px] text-[#a09990]">
                                    ({(att.size / 1024).toFixed(0)} KB)
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* ── Action bar ── */}
          <div className="flex-shrink-0 bg-white border-t border-[#e8e5e0] px-6 py-3.5">
            <div className="flex items-center gap-2 flex-wrap">
              {/* Primary: Reply */}
              <button
                onClick={() => handleAction("reply", openEmail)}
                className="flex items-center gap-2 px-4 py-2 bg-[#1a1814] hover:bg-[#2d2a26] text-white rounded-xl text-[13px] font-semibold transition-colors shadow-sm"
              >
                <Reply size={14} strokeWidth={2.5} />
                Reply
              </button>

              {/* Secondary actions */}
              {[
                {
                  icon: <ReplyAll size={14} strokeWidth={2} />,
                  label: "Reply All",
                  action: () => handleAction("reply", openEmail),
                },
                {
                  icon: <Forward size={14} strokeWidth={2} />,
                  label: "Forward",
                  action: () => handleAction("forward", openEmail),
                },
              ].map(({ icon, label, action }) => (
                <button
                  key={label}
                  onClick={action}
                  className="flex items-center gap-2 px-4 py-2 bg-[#f3f0ec] hover:bg-[#ebe7e2] text-[#3d3a36] rounded-xl text-[13px] font-semibold border border-[#e5e0da] hover:border-[#d5d0ca] transition-colors"
                >
                  {icon}
                  {label}
                </button>
              ))}

              {/* AI Reply — uncomment to enable */}
              {/* <button
                onClick={() => setIsAIReplyOpen(true)}
                className="ml-auto flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-violet-50 to-indigo-50 hover:from-violet-100 hover:to-indigo-100 text-violet-700 rounded-xl text-[13px] font-semibold border border-violet-200/70 transition-colors"
              >
                <Sparkles size={14} strokeWidth={2} />
                AI Reply
              </button> */}
            </div>
          </div>
        </>
      ) : (
        /* ── Empty state ── */
        <div className="flex-1 flex flex-col items-center justify-center bg-[#f8f7f4]">
          <div className="text-center">
            <div className="w-14 h-14 rounded-2xl bg-[#eee9e3] flex items-center justify-center mx-auto mb-4 border border-[#e0dbd4]">
              <MailOpen
                size={22}
                className="text-[#b5afa8]"
                strokeWidth={1.5}
              />
            </div>
            <p className="text-[15px] font-semibold text-[#6b6660] mb-1">
              No message selected
            </p>
            <p className="text-[12px] text-[#a8a29b]">
              Choose an email from the list to read it here
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReadingPane;
