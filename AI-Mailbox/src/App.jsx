import { useState } from "react";
import "./App.css";
import ResponsiveEmailApp from "./ResponsiveEmailApp";
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
  
  const [allEmails, setAllEmails] = useState([
    {
      id: 1,
      folder: "Inbox",
      account: "Gmail",
      sender: "Sara Johnson",
      subject: "Project Update",
      time: "2:45 PM",
      unread: true,
      avatar: "https://i.pravatar.cc/150?u=sara",
      messages: [
        {
          id: 101,
          sender: "Sara Johnson",
          time: "2:45 PM",
          body: "Hi Team,\n\nI'm happy to report that the project is moving along faster than expected. We should be ready for the demo by Friday.",
          avatar: "https://i.pravatar.cc/150?u=sara",
        },
      ],
    },
    {
      id: 2,
      folder: "Inbox",
      account: "Work IMAP",
      sender: "Marketing Team",
      subject: "Weekly Sync & Strategy",
      time: "1:15 PM",
      unread: true,
      isGroup: true,
      messages: [
        {
          id: 201,
          sender: "Alex Rivera",
          time: "11:00 AM",
          body: "Does anyone have the latest conversion metrics for the spring campaign?",
          avatar: "https://i.pravatar.cc/150?u=alex",
        },
        {
          id: 202,
          sender: "Marketing Team",
          time: "1:15 PM",
          body: "Just uploaded them to the shared drive! The ROI is looking much better than last month.",
          avatar: "",
        },
      ],
    },
    {
      id: 3,
      folder: "Starred",
      account: "Outlook",
      sender: "David Lee",
      subject: "Invoice #88291",
      time: "12:30 PM",
      unread: false,
      avatar: "https://i.pravatar.cc/150?u=david",
      messages: [
        {
          id: 301,
          sender: "David Lee",
          time: "12:30 PM",
          body: "Hi, please find the invoice attached for the last sprint. Let me know if you have any questions.",
          avatar: "https://i.pravatar.cc/150?u=david",
        },
      ],
    },
    {
      id: 4,
      folder: "Sent",
      account: "Gmail",
      sender: "James R.",
      subject: "Re: Budget Report",
      time: "Yesterday",
      unread: false,
      avatar: "https://i.pravatar.cc/150?u=james",
      messages: [
        {
          id: 401,
          sender: "James R.",
          time: "Yesterday",
          body: "Can you send the budget report by Friday? The board needs to review it before the weekend.",
          avatar: "https://i.pravatar.cc/150?u=james",
        },
        {
          id: 402,
          sender: "Me",
          time: "Yesterday",
          body: "No problem, James. I'm finishing up the final charts now.",
          avatar: "",
        },
        {
          id: 403,
          sender: "Me",
          time: "Today",
          body: "The report is attached. Let me know if you need anything else.",
          avatar: "",
        },
      ],
    },
    {
      id: 5,
      folder: "Inbox",
      account: "Gmail",
      sender: "Support",
      subject: "Your Ticket #12345",
      time: "9:10 AM",
      unread: false,
      avatar: "https://i.pravatar.cc/150?u=support",
      messages: [
        {
          id: 501,
          sender: "Me",
          time: "2 Days Ago",
          body: "I'm having trouble logging into my account. I keep getting a 'Timeout' error.",
          avatar: "",
        },
        {
          id: 502,
          sender: "Support",
          time: "Yesterday",
          body: "Hello! We are looking into this for you. Could you please clear your browser cache and try again?",
          avatar: "https://i.pravatar.cc/150?u=support",
        },
        {
          id: 503,
          sender: "Me",
          time: "Yesterday",
          body: "That worked! Thanks for the quick response.",
          avatar: "",
        },
        {
          id: 504,
          sender: "Support",
          time: "9:10 AM",
          body: "Great to hear! I'll close this ticket now. Have a nice day.",
          avatar: "https://i.pravatar.cc/150?u=support",
        },
      ],
    },
  ]);

  const [folders, setFolders] = useState([
    "Inbox",
    "Starred",
    "Sent",
    "Archive",
    "Trash",
  ]);
  const [account, setAccount] = useState([
    "All Mail",
    "Gmail",
    "Outlook",
    "Work IMAP",
    "All Mails",
    "Gmails",
    "Outlooks",
    "Work IMAPs",
  ]);
  const [activeFolder, setActiveFolder] = useState("Inbox");
  const [activeTab, setActiveTab] = useState("All Mail");
  const [isAccountDropdownOpen, setIsAccountDropdownOpen] = useState(false);
  const [isAIReplyOpen, setIsAIReplyOpen] = useState(false);

  const [selectedEmail, setSelectedEmail] = useState(null);
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [isSettingsOpen,setIsSettingsOpen] = useState(false);
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
    const matchesFolder = email.folder === activeFolder;
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
          />
        </section>

        <Compose
          setIsComposeOpen={setIsComposeOpen}
          isComposeOpen={isComposeOpen}
          composeData={composeData}
          setComposeData={setComposeData}
          setIsAIReplyOpen={setIsAIReplyOpen}
        />
      </div>

      

      <AIReplyModal 
      isOpen={isAIReplyOpen} 
        onClose={() => setIsAIReplyOpen(false)} 
        onInsert={(text) => {
          setComposeData(prev => ({ ...prev, body: text }));
          setIsAIReplyOpen(false);
        }}
      
      
      />

      <SettingsModal 
      isOpen={isSettingsOpen} 
      onClose={() => setIsSettingsOpen(false)} />

      <TrainingLab
      isOpen={isLabOpen} 
      onClose={() => setIsLabOpen(false)}      
      />

     
    </>

    
  );
}

export default App;
