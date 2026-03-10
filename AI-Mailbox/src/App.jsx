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
import AuthSystem from "./Components/AuthSystem"; // 👈 Import the UI we created

function App() {
  window.onerror = function (msg, src, line, col) {
    alert(`Error: ${msg}\nLine: ${line}`);
  };

  // 1. Change this: Initialize state directly from localStorage
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem("token") !== null;
  });

  const [allEmails, setAllEmails] = useState([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [account, setAccount] = useState([]);

  const [username, setUsername] = useState("");
  const [useremail, setUseremail] = useState("");

  useEffect(() => {
    // Only fetch if we are actually authenticated
    if (isAuthenticated) {
      fetchEmails();
      fetchEmailAccounts();
      getuser();
      //fetchMailbox();
    }
  }, [isAuthenticated]);

  // 2. Handle Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
  };

  const getuser = async () => {
    const token = localStorage.getItem("token"); // 👈 Get token
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/userprofile`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // 👈 Pass token
          },
        },
      );

      if (!res.ok) {
        throw new Error("Failed to fetch emails");
      }
      const result = await res.json(); // 👈 important
      setUsername(result.name);
      setUseremail(result.email);
    } catch (error) {
      console.error("Error fetching emails:", error);
    } finally {
    }
  };

  const fetchMailbox = async () => {
    const token = localStorage.getItem("token"); // 👈 Get token
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/emails/fetch`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // 👈 Pass token
          },
        },
      );

      if (!res.ok) {
        throw new Error("Failed to fetch emails");
      }

      const result = await res.json(); // 👈 important
    } catch (error) {
      console.error("Error fetching emails:", error);
    } finally {
    }
  };

  const fetchEmails = async (pageNum = 1) => {
    if (isLoading || (!hasMore && pageNum !== 1)) return;

    setIsLoading(true);
    const token = localStorage.getItem("token");

    try {
      // Note: You will need to update your backend API to accept ?page=X
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/emails/conversation?page=${pageNum}&limit=100`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!res.ok) throw new Error("Failed to fetch emails");

      const result = await res.json();
       setHasMore(pageNum < result.totalPages);

      const formatted = result.emails.map((email) => ({
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

      // 2. LOGIC FIX: Only set hasMore to false if we get LESS than our limit
      // if (formatted.length < 10) {
      //   setHasMore(false);
      // } else {
      //   setHasMore(true); // Keep it true if we hit the limit exactly
      // }

      setAllEmails((prev) =>
        pageNum === 1 ? formatted : [...prev, ...formatted],
      );
      setPage(pageNum);
    } catch (error) {
      console.error("Error fetching emails:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchEmailAccounts = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/emailaccounts`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
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

  const [activeFolder, setActiveFolder] = useState("Inbox");
  const [activeTab, setActiveTab] = useState("All Mail");
  const [isAIReplyOpen, setIsAIReplyOpen] = useState(false);

  const [selectedEmail, setSelectedEmail] = useState(null);
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isLabOpen, setIsLabOpen] = useState(false);
  const [composeData, setComposeData] = useState({
    from: "",
    to: "",
    subject: "",
    body: "",
    threadid: "",
    attachments: [],
  });

  const [searchQuery, setSearchQuery] = useState("");
  const openEmail = allEmails.find((e) => e.id === selectedEmail);

  const filteredEmails = allEmails.filter((email) => {
    //const matchesFolder = email.folder === activeFolder; // use thread-level folder
    // const matchesFolder = email.messages?.some(
    //   (msg) => msg.folder === activeFolder,
    // );

    const matchesFolder = email.folder == "Inbox" ? email.messages?.some((msg) => msg.folder === activeFolder,) : email.folder === activeFolder

    const matchesAccount =
      activeTab === "All Mail" || email.account === activeTab;
    const matchesSearch =
      email.sender.toLowerCase().includes(searchQuery.toLowerCase()) ||
      email.subject.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFolder && matchesAccount && matchesSearch;
  });

  // 3. Conditional Rendering
  if (!isAuthenticated) {
    return <AuthSystem onLogin={() => setIsAuthenticated(true)} />;
  }

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

  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    // Use "isLoading" because that is the state variable you defined
    if (
      scrollHeight - scrollTop <= clientHeight + 100 &&
      hasMore &&
      !isLoading
    ) {
      fetchEmails(page + 1);
    }
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
          onLogout={handleLogout}
          username={username}
        />

        <main
          className={`${
            selectedEmail ? "hidden lg:flex" : " flex"
          } w-screen flex-1 sm:max-w-md border-r border-gray-100 flex-col h-full bg-white relative`}
        >
          <TopNav
            folders={folders}
            activeFolder={activeFolder}
            setActiveFolder={setActiveFolder}
            Account={account}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
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
            onScroll={handleScroll} // Pass the function
            isLoading={isLoading} // Pass the loading state
          />
          {hasMore && (
            <button
              onClick={() => fetchEmails(page + 1)}
              className="p-2 text-blue-500 text-sm font-medium"
              disabled={isLoading}
            >
              {isLoading ? "Loading..." : "Load More"}
            </button>
          )}

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
            activeFolder={activeFolder}
          />
        </section>

        <Compose
          setIsComposeOpen={setIsComposeOpen}
          isComposeOpen={isComposeOpen}
          composeData={composeData}
          setComposeData={setComposeData}
          setIsAIReplyOpen={setIsAIReplyOpen}
          openEmail={openEmail}
          account={account}
        />
      </div>

      <AIReplyModal
        openEmail={openEmail}
        composeData={composeData}
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
        username={username}
        useremail={useremail}
        account={account}
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
