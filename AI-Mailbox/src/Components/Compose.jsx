import React, { useRef, useEffect, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";

import {
  Paperclip,
  X,
  Send,
  Edit2,
  Smile,
  Sparkles,
  Bold,
  Italic,
  List,
  Underline as UnderlineIcon,
  AlignCenter,
  AlignLeft,
  AlignRight,
  Heading1,
  Heading2,
  CheckSquare,
} from "lucide-react";

const Compose = ({
  setIsComposeOpen,
  isComposeOpen,
  composeData,
  setComposeData,
  setIsAIReplyOpen,
}) => {
  const fileInputRef = useRef(null);
  const [showEmojis, setShowEmojis] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
      underline: false,
      link: false,
    }),
      Underline,
      Link.configure({ openOnClick: false }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      TaskList,
      TaskItem.configure({ nested: true }),
      Placeholder.configure({ placeholder: "Write your message here..." }),
    ],
    content: composeData.body,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      // Update parent state only if content differs
      if (html !== composeData.body) {
        setComposeData((prev) => ({ ...prev, body: html }));
      }
    },
    editorProps: {
      attributes: {
        class:
          "focus:outline-none min-h-[350px] p-8 text-gray-700 leading-relaxed text-lg custom-scrollbar",
      },
    },
  });

  useEffect(() => {
    if (!editor) return;

    if (composeData.body !== editor.getHTML()) {
      editor.commands.setContent(composeData.body || "<p></p>");
    }
  }, [composeData.body, editor]);

  if (!isComposeOpen) return null;

  const ToolbarBtn = ({ onClick, icon: Icon, active, title }) => (
    <button
      onClick={(e) => {
        e.preventDefault();
        onClick();
      }}
      className={`p-2 rounded-lg transition-all ${active ? "bg-blue-100 text-blue-600 shadow-sm" : "text-gray-400 hover:text-gray-600 hover:bg-gray-100"}`}
      title={title}
    >
      <Icon size={18} />
    </button>
  );

  return (
    <div className="fixed inset-0 lg:inset-auto lg:bottom-0 lg:right-10 lg:w-[800px] lg:h-[85vh] bg-white lg:rounded-t-[32px] shadow-[0_-20px_60px_-15px_rgba(0,0,0,0.3)] z-50 flex flex-col border border-gray-200 animate-in slide-in-from-bottom-10 duration-500">
      {/* Header */}
      <header className="bg-[#0f172a] text-white px-6 py-5 flex justify-between items-center lg:rounded-t-[32px]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Edit2 size={14} />
          </div>
          <span className="font-bold text-xs uppercase tracking-[0.2em]">
            New Message
          </span>
        </div>
        <button
          onClick={() => setIsComposeOpen(false)}
          className="hover:bg-red-500/20 hover:text-red-400 p-2 rounded-xl transition-all"
        >
          <X size={20} />
        </button>
      </header>

      {/* Recipient Logic */}
      <div className="px-8 bg-white border-b border-gray-50">
        <div className="flex items-center border-b border-gray-100 py-4 group">
          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest w-12 group-focus-within:text-blue-500 transition-colors">
            To
          </span>
          <input
            type="text"
            placeholder="name@company.com"
            value={composeData.to}
            onChange={(e) =>
              setComposeData({ ...composeData, to: e.target.value })
            }
            className="flex-1 outline-none font-bold text-gray-700 text-sm"
          />
        </div>
        <div className="flex items-center py-4">
          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest w-12">
            Sub
          </span>
          <input
            type="text"
            placeholder="Subject"
            value={composeData.subject}
            onChange={(e) =>
              setComposeData({ ...composeData, subject: e.target.value })
            }
            className="flex-1 outline-none font-bold text-gray-700 text-sm"
          />
        </div>
      </div>

      {/* Toolbar */}
      <div className="px-4 py-2 border-b border-gray-50 flex flex-wrap gap-1 bg-gray-50/40 backdrop-blur-sm sticky top-0 z-10">
        <ToolbarBtn
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          icon={Heading1}
          active={editor?.isActive("heading", { level: 1 })}
          title="Main Heading"
        />
        <ToolbarBtn
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          icon={Heading2}
          active={editor?.isActive("heading", { level: 2 })}
          title="Sub Heading"
        />
        <div className="w-px h-6 bg-gray-200 mx-1 self-center" />
        <ToolbarBtn
          onClick={() => editor.chain().focus().toggleBold().run()}
          icon={Bold}
          active={editor?.isActive("bold")}
          title="Bold"
        />
        <ToolbarBtn
          onClick={() => editor.chain().focus().toggleItalic().run()}
          icon={Italic}
          active={editor?.isActive("italic")}
          title="Italic"
        />
        <ToolbarBtn
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          icon={UnderlineIcon}
          active={editor?.isActive("underline")}
          title="Underline"
        />
        <div className="w-px h-6 bg-gray-200 mx-1 self-center" />
        <ToolbarBtn
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          icon={AlignLeft}
          active={editor?.isActive({ textAlign: "left" })}
          title="Align Left"
        />
        <ToolbarBtn
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          icon={AlignCenter}
          active={editor?.isActive({ textAlign: "center" })}
          title="Align Center"
        />
        <ToolbarBtn
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          icon={AlignRight}
          active={editor?.isActive({ textAlign: "right" })}
          title="Align Right"
        />
      </div>

      <div className="flex-1 flex flex-col overflow-hidden bg-white">
        <style>{`
          .custom-scrollbar::-webkit-scrollbar { width: 8px; }
          .custom-scrollbar::-webkit-scrollbar-thumb { background: #f1f5f9; border-radius: 20px; border: 2px solid white; }
          .custom-scrollbar:hover::-webkit-scrollbar-thumb { background: #e2e8h0; }
          .ProseMirror { height: 100%; overflow-y: auto; outline: none; }
          .ProseMirror h1 { font-size: 2em; font-weight: 800; margin-bottom: 0.5em; }
          .ProseMirror h2 { font-size: 1.5em; font-weight: 700; margin-bottom: 0.5em; }
          .ProseMirror ul[data-type="taskList"] { list-style: none; padding: 0; }
          .ProseMirror ul[data-type="taskList"] li { display: flex; align-items: flex-start; gap: 10px; }
          .ProseMirror blockquote { border-left: 4px solid #3b82f6; padding-left: 1.5rem; margin: 1.5rem 0; color: #475569; font-style: italic; }
          .ProseMirror p.is-editor-empty:first-child::before {
            content: attr(data-placeholder);
            float: left; color: #cbd5e1; pointer-events: none; height: 0;
          }
        `}</style>
        <EditorContent editor={editor} className="flex-1 overflow-hidden" />
      </div>

      {/* Footer */}
      <footer className="p-6 border-t border-gray-100 flex items-center justify-between bg-white lg:rounded-b-[32px]">
        <div className="flex gap-2 items-center">
          <input
            type="file"
            ref={fileInputRef}
            onChange={(e) =>
              setComposeData((prev) => ({
                ...prev,
                attachments: [
                  ...prev.attachments,
                  ...Array.from(e.target.files).map((f) => f.name),
                ],
              }))
            }
            multiple
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current.click()}
            className="p-3 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-2xl transition-all"
          >
            <Paperclip size={22} />
          </button>

          <div className="relative">
            <button
              onClick={() => setShowEmojis(!showEmojis)}
              className={`p-3 rounded-2xl transition-all ${showEmojis ? "bg-yellow-50 text-yellow-600 shadow-inner" : "text-gray-400 hover:text-yellow-500 hover:bg-yellow-50"}`}
            >
              <Smile size={22} />
            </button>
            {showEmojis && (
              <div className="absolute bottom-full mb-4 left-0 bg-white border border-gray-200 p-3 rounded-[24px] shadow-[0_20px_50px_rgba(0,0,0,0.15)] flex gap-3 z-[60] animate-in slide-in-from-bottom-2">
                {["😊", "👍", "🔥", "🤝", "📊", "✅"].map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => {
                      editor.chain().focus().insertContent(emoji).run();
                      setShowEmojis(false);
                    }}
                    className="text-2xl hover:scale-125 transition-transform"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsAIReplyOpen(true)}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-tr from-indigo-50 to-blue-50 text-indigo-700 rounded-2xl font-black text-[10px] uppercase tracking-widest border border-indigo-100/50 shadow-sm hover:shadow-md transition-all"
          >
            <Sparkles size={16} /> AI Assist
          </button>
          <button
            onClick={() => setIsComposeOpen(false)}
            className="flex items-center gap-4 bg-[#0f172a] text-white pl-8 pr-4 py-3 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-slate-200 hover:bg-black transition-all group"
          >
            Send
            <div className="bg-blue-500 p-1.5 rounded-lg group-hover:rotate-12 transition-transform">
              <Send size={16} />
            </div>
          </button>
        </div>
      </footer>
    </div>
  );
};

export default Compose;
