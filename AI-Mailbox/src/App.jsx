import { useState, useEffect } from "react";
import "./App.css";
import SideNav from "./Components/SideNav";
import TopNav from "./Components/TopNav";
import SearchMail from "./Components/SearchMail";
import EmailList from "./Components/EmailList";
import BottomNav from "./Components/BottomNav";
import ReadingPane from "./Components/ReadingPane";
import ReadingPaneTopNav from "./Components/ReadingPaneTopNav";
import Compose from "./Components/Compose";
import AIReplyModal from "./Components/AIReplyModal";
import SettingsModal from "./Components/SettingsView";
import TrainingLab from "./Components/TrainingLab";

function App() {
  window.onerror = function (msg, src, line, col) {
    alert(`Error: ${msg}\nLine: ${line}`);
  };

  const [allEmails, setAllEmails] = useState([]);

  useEffect(() => {
    fetchEmails();
    fetchEmailAccounts();
  }, []);

  const fetchEmails = async () => {
    try {
      const res = await fetch(
        "http://localhost:3000/api/emails/conversation/bilal_khan",
      );

      if (!res.ok) {
        throw new Error("Failed to fetch emails");
      }

      const result = await res.json(); // 👈 important

      const formatted = result.map((email) => ({
        id: email._id,
        threadid: email.threadId,
        folder: email.folder,
        account: email.account,
        sender: email.sender,
        subject: email.subject,
        time: email.time,
        unread: email.unread === true,
        avatar: email.messages?.[0]?.avatar || "",
        messages: email.messages || [],
      }));

      setAllEmails(formatted);
    } catch (error) {
      console.error("Error fetching emails:", error);
    } finally {
    }
  };

  const fetchEmailAccounts = async () => {
    try {
      const res = await fetch(
        "http://localhost:3000/api/emailaccounts/bilal_khan",
      );

      if (!res.ok) {
        throw new Error("Failed to fetch emails");
      }

      const result = await res.json(); // 👈 important

      // Extract only the email strings into a flat array
      const emailList = result.map((item) => item.email);

      // Combine "All Mail" with the fetched accounts
      setAccount(["All Mail", ...emailList]);
    } catch (error) {
      console.error("Error fetching emails:", error);
    } finally {
    }
  };

  const [folders, setFolders] = useState([
    "Inbox",
    "Starred",
    "Sent",
    "Archive",
    "Trash",
  ]);
  const [account, setAccount] = useState([]);
  const [activeFolder, setActiveFolder] = useState("Inbox");
  const [activeTab, setActiveTab] = useState("All Mail");
  const [isAccountDropdownOpen, setIsAccountDropdownOpen] = useState(false);
  const [isAIReplyOpen, setIsAIReplyOpen] = useState(false);

  const [selectedEmail, setSelectedEmail] = useState(null);
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isLabOpen, setIsLabOpen] = useState(false);
  const [composeData, setComposeData] = useState({
    to: "",
    subject: "",
    body: "",
    attachments: [],
  });

  const [searchQuery, setSearchQuery] = useState("");
  const openEmail = allEmails.find((e) => e.id === selectedEmail);

  const filteredEmails = allEmails.filter((email) => {
    const matchesFolder = email.messages?.some(
      (msg) => msg.folder === activeFolder,
    );
    const matchesAccount =
      activeTab === "All Mail" || email.account === activeTab;
    const matchesSearch =
      email.sender.toLowerCase().includes(searchQuery.toLowerCase()) ||
      email.subject.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFolder && matchesAccount && matchesSearch;
  });

  const Avatar = ({ email, size = "w-12 h-12" }) => {
    if (email.isGroup)
      return (
        <div
          className={`${size} bg-blue-100 rounded-full flex items-center justify-center text-blue-600 flex-shrink-0`}
        >
          <Mail size={24} />
        </div>
      );
    if (email.avatar)
      return (
        <img
          src={email.avatar}
          className={`${size} rounded-full object-cover border border-gray-100 flex-shrink-0`}
          alt=""
        />
      );
    const initial = email.sender ? email.sender.charAt(0).toUpperCase() : "U";
    return (
      <div
        className={`${size} bg-gray-500 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0`}
      >
        {initial}
      </div>
    );
  };

  return (
    <>
      <div className="flex h-screen bg-white overflow-hidden text-[#1a1a1a] font-sans relative">
        <SideNav
          folders={folders}
          activeFolder={activeFolder}
          setActiveFolder={setActiveFolder}
          setComposeData={setComposeData}
          setIsComposeOpen={setIsComposeOpen}
          setIsSettingsOpen={setIsSettingsOpen}
          setIsLabOpen={setIsLabOpen}
        />

        <main
          className={`${
            selectedEmail ? "hidden lg:flex" : " flex"
          } flex-1 lg:max-w-md border-r border-gray-100 flex-col h-full bg-white relative`}
        >
          <TopNav
            folders={folders}
            activeFolder={activeFolder}
            setActiveFolder={setActiveFolder}
            Account={account}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            isAccountDropdownOpen={isAccountDropdownOpen}
            setIsAccountDropdownOpen={setIsAccountDropdownOpen}
            setIsLabOpen={setIsLabOpen}
          />

          <SearchMail
            activeFolder={activeFolder}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            setIsComposeOpen={setIsComposeOpen}
            setComposeData={setComposeData}
          />

          <EmailList
            filteredEmails={filteredEmails}
            setSelectedEmail={setSelectedEmail}
            selectedEmail={selectedEmail}
            activeFolder={activeFolder}
          />

          <BottomNav
            setActiveFolder={setActiveFolder}
            setSelectedEmail={setSelectedEmail}
            activeFolder={activeFolder}
            setIsComposeOpen={setIsComposeOpen}
            setIsSettingsOpen={setIsSettingsOpen}
          />
        </main>

        <section
          className={`${
            selectedEmail ? "flex" : "hidden lg:flex"
          } flex-1 flex-col bg-white h-full z-20 fixed inset-0 lg:relative lg:inset-auto`}
        >
          <ReadingPaneTopNav
            selectedEmail={selectedEmail}
            setSelectedEmail={setSelectedEmail}
            allEmails={allEmails}
            setAllEmails={setAllEmails}
            setComposeData={setComposeData}
            setIsComposeOpen={setIsComposeOpen}
            Avatar={Avatar}
            openEmail={openEmail}
            folders={folders}
          />

          <ReadingPane
            selectedEmail={selectedEmail}
            setSelectedEmail={setSelectedEmail}
            allEmails={allEmails}
            setAllEmails={setAllEmails}
            setComposeData={setComposeData}
            setIsComposeOpen={setIsComposeOpen}
            Avatar={Avatar}
            openEmail={openEmail}
            setIsAIReplyOpen={setIsAIReplyOpen}
          />
        </section>

        <Compose
          setIsComposeOpen={setIsComposeOpen}
          isComposeOpen={isComposeOpen}
          composeData={composeData}
          setComposeData={setComposeData}
          setIsAIReplyOpen={setIsAIReplyOpen}
          openEmail={openEmail}
        />
      </div>

      <AIReplyModal
        isOpen={isAIReplyOpen}
        onClose={() => setIsAIReplyOpen(false)}
        onInsert={(text) => {
          setComposeData((prev) => ({ ...prev, body: text }));
          setIsAIReplyOpen(false);
        }}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />

      <TrainingLab
        isOpen={isLabOpen}
        onClose={() => setIsLabOpen(false)}
        account={account}
      />
    </>
  );
}

export default App;
