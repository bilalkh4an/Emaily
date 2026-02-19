import React, { useState } from "react";
import {
  X,
  User,
  Bell,
  Sparkles,
  Palette,
  Globe,
  Mail,
  Plus,
  Cloud,
  ChevronLeft,
  Server,
  ShieldCheck,
} from "lucide-react";

// Add 'value' and 'onChange' to the props list here:
const Input = ({
  label,
  placeholder,
  type = "text",
  disabled,
  value,
  onChange,
}) => (
  <div className="space-y-1.5">
    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">
      {label}
    </label>
    <input
      type={type}
      placeholder={placeholder}
      disabled={disabled}
      value={value} // Now it knows what 'value' is
      onChange={onChange} // Now it knows what 'onChange' is
      className={`w-full border-2 rounded-xl px-4 py-3 text-sm font-semibold outline-none transition-all ${
        disabled
          ? "bg-gray-100 border-gray-200 text-gray-500 cursor-not-allowed"
          : "bg-gray-50 border-gray-200 focus:ring-2 ring-blue-200 focus:border-blue-300 focus:bg-white"
      }`}
    />
  </div>
);

const SettingsModal = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState("Profile");
  const [configStage, setConfigStage] = useState("list");
  const [emailaddress, setEmailaddress] = useState("");
  const [imapHost, setImapHost] = useState("");
  const [imapPort, setImapPort] = useState("");
  const [security, setSecurity] = useState("");
  const [smtpHost, setSmtpHost] = useState("");
  const [password, setPassword] = useState("");

  if (!isOpen) return null;

  const tabs = [
    { id: "Profile", icon: <User size={18} />, label: "Profile" },
    { id: "Accounts", icon: <Mail size={18} />, label: "Accounts" },
    { id: "AI", icon: <Sparkles size={18} />, label: "AI Settings" },
    { id: "Notifications", icon: <Bell size={18} />, label: "Notifications" },
    { id: "Appearance", icon: <Palette size={18} />, label: "Appearance" },
  ];

  const handleImapAdd = async () => {
    try {
      const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/create/imapaccount`,
        {
          method: "POST",
          headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
          body: JSON.stringify({
            email: emailaddress,
            imapHost: imapHost,
            imapPort: imapPort,
            security: security,
            password: password,
          }),
        },
      );

      if (!response.ok) throw new Error("Stream failed");
      if (response.ok) {
        alert("Message Sent Successfully");
      }
    } catch (error) {
      alert(error);
      console.error("Failed to generate draft:", error);
    }
  };

  const Toggle = ({ label, subtitle, active }) => (
    <div className="flex items-center justify-between p-4 bg-white border border-gray-100 rounded-xl hover:shadow-md transition-shadow">
      <div className="flex-1">
        <span className="text-sm font-bold text-gray-800 block">{label}</span>
        {subtitle && (
          <span className="text-xs text-gray-500 font-medium">{subtitle}</span>
        )}
      </div>
      <div
        className={`w-12 h-7 rounded-full flex items-center px-1 shadow-sm cursor-pointer ${
          active
            ? "bg-gradient-to-r from-blue-500 to-indigo-600 shadow-blue-200"
            : "bg-gray-200"
        }`}
      >
        <div
          className={`w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${active ? "translate-x-5" : ""}`}
        />
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex justify-center items-end sm:items-center z-[100] p-0 sm:p-4">
      <div className="bg-white w-full sm:max-w-5xl h-[90vh] sm:max-h-[700px] rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-in slide-in-from-bottom sm:fade-in sm:zoom-in-95 duration-300">
        <style>{`
          .smooth-scroll { scroll-behavior: smooth; -webkit-overflow-scrolling: touch; -ms-overflow-style: none; scrollbar-width: none; }
          .smooth-scroll::-webkit-scrollbar { display: none; }
        `}</style>

        {/* Header */}
        <div className="flex-shrink-0 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
          {/* Desktop Header */}
          <div className="hidden sm:flex items-center justify-between p-5">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-2 rounded-xl text-white shadow-lg shadow-blue-200">
                <User size={18} />
              </div>
              <div>
                <h2 className="text-xl font-black text-gray-800 tracking-tight">
                  Settings
                </h2>
                <p className="text-xs text-gray-500 font-semibold">
                  Manage your preferences
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-xl text-gray-400 hover:text-gray-600 transition-all active:scale-95"
            >
              <X size={22} />
            </button>
          </div>

          {/* Mobile Header with Tabs */}
          <div className="sm:hidden">
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <h2 className="text-lg font-black text-gray-800 tracking-tight">
                Settings
              </h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-xl text-gray-400 hover:text-gray-600 transition-all active:scale-95"
              >
                <X size={22} />
              </button>
            </div>

            <div className="relative">
              <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none"></div>
              <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none"></div>

              <div className="overflow-x-auto smooth-scroll snap-x snap-mandatory">
                <div className="flex gap-2 px-4 py-3 min-w-max">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => {
                        setActiveTab(tab.id);
                        setConfigStage("list");
                      }}
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all whitespace-nowrap snap-start ${
                        activeTab === tab.id
                          ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-200 font-bold scale-105"
                          : "bg-gray-100 text-gray-600 font-semibold active:scale-95"
                      }`}
                    >
                      {tab.icon}
                      <span className="text-sm">{tab.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-center gap-1.5 pb-2">
                {tabs.map((tab) => (
                  <div
                    key={`dot-${tab.id}`}
                    className={`h-1 rounded-full transition-all ${activeTab === tab.id ? "w-6 bg-gradient-to-r from-blue-500 to-indigo-600" : "w-1 bg-gray-300"}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 flex overflow-hidden">
          {/* Desktop Sidebar */}
          <div className="hidden sm:block w-56 border-r border-gray-100 bg-gradient-to-b from-gray-50/50 to-white p-4">
            <div className="mb-3 pb-3 border-b border-gray-100">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider px-3">
                Menu
              </p>
            </div>
            <nav className="space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setConfigStage("list");
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all ${
                    activeTab === tab.id
                      ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-100 font-bold scale-105"
                      : "text-gray-600 hover:bg-white hover:shadow-sm font-semibold"
                  }`}
                >
                  {tab.icon}
                  <span className="text-sm">{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-8 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:hover:bg-gray-300">
            <div className="max-w-2xl mx-auto">
              <div className="flex items-center justify-between mb-6 sm:mb-5">
                <div>
                  <h3 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
                    {activeTab}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-500 font-medium mt-0.5">
                    {activeTab === "Profile" &&
                      "Manage your personal information"}
                    {activeTab === "Accounts" &&
                      "Connect and manage email accounts"}
                    {activeTab === "AI" && "Configure AI-powered features"}
                    {activeTab === "Notifications" && "Control your alerts"}
                    {activeTab === "Appearance" &&
                      "Customize the look and feel"}
                  </p>
                </div>
                {activeTab === "Accounts" && configStage !== "list" && (
                  <button
                    onClick={() => setConfigStage("list")}
                    className="flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    <ChevronLeft size={16} /> Back
                  </button>
                )}
              </div>

              {/* PROFILE */}
              {activeTab === "Profile" && (
                <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
                  <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-5 p-5 sm:p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-100">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-black text-2xl sm:text-3xl shadow-xl shadow-blue-200 border-4 border-white">
                      JD
                    </div>
                    <div className="text-center sm:text-left flex-1">
                      <p className="font-black text-lg sm:text-xl text-gray-800 mb-1">
                        John Doe
                      </p>
                      <p className="text-xs sm:text-sm text-gray-600 font-semibold mb-3">
                        john@emailshop.com
                      </p>
                      <button className="text-xs font-black text-blue-600 uppercase tracking-wider hover:text-blue-700 px-4 py-2 bg-white rounded-lg hover:shadow-md transition-all">
                        Change Avatar
                      </button>
                    </div>
                  </div>
                  <Input label="Display Name" placeholder="John Doe" />
                  <Input
                    label="Email Address"
                    placeholder="john@emailshop.com"
                    disabled
                  />
                </div>
              )}

              {/* ACCOUNTS */}
              {activeTab === "Accounts" && configStage === "list" && (
                <div className="space-y-6 animate-in fade-in duration-300">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-gray-400 uppercase px-1 tracking-wider">
                      Connected Accounts
                    </label>
                    <div className="flex items-center justify-between p-4 sm:p-5 bg-gradient-to-br from-white to-gray-50 border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-center gap-3 sm:gap-4">
                        <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-red-400 to-red-600 flex items-center justify-center text-white shadow-lg shadow-red-200">
                          <Mail size={20} />
                        </div>
                        <div>
                          <p className="text-sm sm:text-base font-bold text-gray-800 tracking-tight">
                            john.doe@gmail.com
                          </p>
                          <p className="text-[10px] sm:text-[11px] text-green-600 font-black uppercase tracking-wide flex items-center gap-1">
                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                            Connected
                          </p>
                        </div>
                      </div>
                      <button className="text-[11px] font-black text-gray-400 hover:text-red-500 transition-colors px-3 py-1.5 hover:bg-red-50 rounded-lg">
                        Remove
                      </button>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-gray-100 space-y-4">
                    <label className="text-[10px] font-black text-gray-400 uppercase px-1 tracking-wider">
                      Add New Account
                    </label>
                    <div className="grid grid-cols-2 gap-3 sm:gap-4">
                      {[
                        {
                          stage: "google",
                          icon: Globe,
                          color: "blue",
                          label: "Google Mail",
                        },
                        {
                          stage: "outlook",
                          icon: Cloud,
                          color: "sky",
                          label: "Outlook",
                        },
                      ].map(({ stage, icon: Icon, color, label }) => (
                        <button
                          key={stage}
                          onClick={() => setConfigStage(stage)}
                          className={`flex flex-col items-center justify-center p-4 sm:p-5 bg-gradient-to-br from-gray-50 to-white rounded-2xl border-2 border-gray-100 hover:border-${color}-300 hover:shadow-lg hover:shadow-${color}-100 transition-all group active:scale-95`}
                        >
                          <div className="w-12 h-12 sm:w-14 sm:h-14 bg-white rounded-2xl shadow-md flex items-center justify-center mb-3 group-hover:scale-110 group-hover:shadow-lg transition-all">
                            <Icon size={24} className={`text-${color}-500`} />
                          </div>
                          <span className="text-xs sm:text-sm font-bold text-gray-700">
                            {label}
                          </span>
                        </button>
                      ))}
                    </div>
                    <button
                      onClick={() => setConfigStage("imap")}
                      className="w-full flex items-center justify-center gap-2 py-3.5 border-2 border-dashed border-gray-300 rounded-2xl text-gray-500 hover:text-blue-600 hover:border-blue-400 hover:bg-blue-50/50 transition-all font-bold text-sm active:scale-95"
                    >
                      <Plus size={18} /> Connect via IMAP/POP
                    </button>
                  </div>
                </div>
              )}

              {(configStage === "google" || configStage === "outlook") && (
                <div className="text-center py-8 sm:py-12 space-y-5 animate-in slide-in-from-bottom-4 duration-300">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl flex items-center justify-center mx-auto shadow-xl border border-gray-200">
                    {configStage === "google" ? (
                      <Globe className="text-blue-500" size={40} />
                    ) : (
                      <Cloud className="text-sky-500" size={40} />
                    )}
                  </div>
                  <div>
                    <h4 className="font-black text-lg sm:text-xl text-gray-800 mb-2">
                      Sign in with{" "}
                      {configStage === "google" ? "Google" : "Outlook"}
                    </h4>
                    <p className="text-xs sm:text-sm text-gray-500 px-4 sm:px-12 leading-relaxed">
                      You'll be redirected to a secure login page to authorize
                      EmailShop to access your account.
                    </p>
                  </div>
                  <button className="bg-gradient-to-r from-gray-900 to-gray-800 text-white px-8 sm:px-10 py-3.5 rounded-2xl font-bold text-sm hover:from-black hover:to-gray-900 shadow-lg hover:shadow-xl active:scale-95 transition-all">
                    Continue to Authorization
                  </button>
                </div>
              )}

              {configStage === "imap" && (
                <div className="space-y-5 animate-in slide-in-from-bottom-4 duration-300">
                  <div className="p-4 sm:p-5 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-100 space-y-4">
                    <div className="flex items-center gap-2 text-blue-700 font-black text-xs uppercase tracking-wider mb-3">
                      <Server size={16} /> Incoming Server (IMAP)
                    </div>
                    <Input
                      label="Email Address"
                      type="email"
                      placeholder="info@emaily.uk"
                      value={emailaddress}
                      onChange={(e) => setEmailaddress(e.target.value)}
                    />
                    <Input
                      label="Host"
                      placeholder="imap.mail.uk"
                      value={imapHost}
                      onChange={(e) => setImapHost(e.target.value)}
                    />
                    <div className="grid grid-cols-2 gap-3 sm:gap-4">
                      <Input
                        label="Port"
                        type="number"
                        placeholder="993"
                        value={imapPort}
                        onChange={(e) => setImapPort(e.target.value)}
                      />
                      <Input
                        label="Security"
                        placeholder="SSL/TLS"
                        value={security}
                        onChange={(e) => setSecurity(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="p-4 sm:p-5 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl border border-purple-100 space-y-4">
                    <div className="flex items-center gap-2 text-purple-700 font-black text-xs uppercase tracking-wider mb-3">
                      <ShieldCheck size={16} /> Outgoing Server (SMTP)
                    </div>
                    <Input
                      label="SMTP Host"
                      placeholder="smtp.mail.uk"
                      value={smtpHost}
                      onChange={(e) => setSmtpHost(e.target.value)}
                    />
                    <Input
                      label="Password"
                      type="password"
                      placeholder="App-Specific Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                </div>
              )}

              {/* AI */}
              {activeTab === "AI" && (
                <div className="space-y-6 animate-in fade-in duration-300">
                  <div className="p-5 sm:p-6 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-2xl border border-blue-200 shadow-sm">
                    <div className="flex items-center gap-2 text-blue-700 font-black text-sm sm:text-base mb-2">
                      <Sparkles size={18} className="text-blue-600" /> Smart
                      Compose
                    </div>
                    <p className="text-xs sm:text-sm text-blue-600/80 font-semibold leading-relaxed">
                      AI will intelligently suggest completions and improvements
                      as you compose emails.
                    </p>
                  </div>
                  <div className="space-y-4">
                    <Toggle
                      label="Enable AI Auto-Drafts"
                      subtitle="Automatically generate draft responses"
                      active={true}
                    />
                    <Toggle
                      label="Smart Reply Suggestions"
                      subtitle="Quick AI-powered response options"
                      active={false}
                    />
                  </div>
                </div>
              )}

              {/* NOTIFICATIONS */}
              {activeTab === "Notifications" && (
                <div className="space-y-4 animate-in fade-in duration-300">
                  {[
                    "New Emails",
                    "Mentions",
                    "Calendar Events",
                    "Task Reminders",
                  ].map((item, i) => (
                    <Toggle key={i} label={item} active={i % 2 === 0} />
                  ))}
                </div>
              )}

              {/* APPEARANCE */}
              {activeTab === "Appearance" && (
                <div className="space-y-6 animate-in fade-in duration-300">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider">
                      Theme
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        {
                          name: "Light",
                          bg: "bg-white",
                          border: "border-gray-200",
                        },
                        {
                          name: "Dark",
                          bg: "bg-gray-900",
                          border: "border-gray-700",
                        },
                        {
                          name: "Auto",
                          bg: "bg-gradient-to-br from-white to-gray-900",
                          border: "border-gray-300",
                        },
                      ].map((theme) => (
                        <button
                          key={theme.name}
                          className="p-4 border-2 border-gray-200 rounded-xl hover:border-blue-400 hover:shadow-lg transition-all group"
                        >
                          <div
                            className={`w-full h-16 ${theme.bg} ${theme.border} border rounded-lg mb-2 group-hover:scale-105 transition-transform`}
                          />
                          <span className="text-xs font-bold text-gray-700">
                            {theme.name}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex-shrink-0 p-4 sm:p-5 border-t border-gray-100 bg-gradient-to-r from-gray-50 to-white flex flex-col-reverse sm:flex-row justify-end gap-3">
          <button
            onClick={handleImapAdd}
            className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-bold rounded-xl shadow-lg shadow-blue-200 hover:from-blue-700 hover:to-indigo-700 hover:shadow-xl active:scale-95 transition-all"
          >
            {activeTab === "Accounts" && configStage !== "list"
              ? "Connect Account"
              : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
