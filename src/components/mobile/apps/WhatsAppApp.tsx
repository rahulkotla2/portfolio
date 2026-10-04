"use client";

import { useState } from "react";
import { profile } from "@/data/portfolio";
import { WA } from "./app-tokens";
import { MobileToast } from "./ui/MobileToast";
import {
  WHATSAPP_CHATS,
  WHATSAPP_THREADS,
  WHATSAPP_STATUS,
  type WhatsAppChatId,
} from "./app-content";

interface WhatsAppAppProps {
  onBack: () => void;
}

type Tab = "chats" | "updates" | "communities" | "calls";
type ChatFilter = "all" | "unread";

const WA_WALLPAPER = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='260' height='260' viewBox='0 0 260 260'%3E%3Cg fill='%23ffffff' opacity='0.04'%3E%3Ccircle cx='40' cy='40' r='8'/%3E%3Crect x='120' y='30' width='16' height='16' rx='3'/%3E%3Cpath d='M200 50l10 10-10 10-10-10z'/%3E%3Ccircle cx='80' cy='130' r='6'/%3E%3Crect x='170' y='120' width='20' height='12' rx='2'/%3E%3Ccircle cx='30' cy='210' r='7'/%3E%3Cpath d='M130 200h20v20h-20z'/%3E%3Ccircle cx='220' cy='200' r='5'/%3E%3C/g%3E%3C/svg%3E")`;

export function WhatsAppApp({ onBack }: WhatsAppAppProps) {
  const [activeChat, setActiveChat] = useState<WhatsAppChatId | null>(null);
  const [tab, setTab] = useState<Tab>("chats");
  const [chatFilter, setChatFilter] = useState<ChatFilter>("all");
  const [activeStatus, setActiveStatus] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2200);
  };

  if (activeChat) {
    const chat = WHATSAPP_CHATS.find((c) => c.id === activeChat)!;
    const messages = WHATSAPP_THREADS[activeChat];

    return (
      <div className="flex h-full flex-col" style={{ backgroundColor: WA.bg, fontFamily: WA.font }}>
        <header
          className="flex shrink-0 items-center gap-3 px-2 py-2"
          style={{ backgroundColor: WA.header }}
        >
          <button type="button" onClick={() => setActiveChat(null)} className="p-1" aria-label="Back">
            <WaBackArrow />
          </button>
          <div
            className="flex h-[40px] w-[40px] items-center justify-center rounded-full text-[15px] font-medium text-white"
            style={{ backgroundColor: chat.color }}
          >
            {chat.avatar}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[16px] font-normal text-[#E9EDEF]">{chat.name}</p>
            <p className="text-[13px] text-[#8696A0]">online</p>
          </div>
          <WaIconVideo />
          <WaIconPhone />
          <WaIconMore />
        </header>

        <div
          className="nothing-scroll flex-1 space-y-[2px] overflow-y-auto px-[10px] py-[6px]"
          style={{ backgroundColor: WA.bg, backgroundImage: WA_WALLPAPER }}
        >
          {messages.map((msg, i) => (
            <div key={i} className={`flex py-[1px] ${msg.from === "me" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[82%] rounded-lg px-[9px] py-[6px] text-[14.2px] leading-[19px] shadow-sm whitespace-pre-line ${
                  msg.from === "me" ? "rounded-tr-none" : "rounded-tl-none"
                }`}
                style={{
                  backgroundColor: msg.from === "me" ? WA.bubbleOut : WA.bubbleIn,
                  color: WA.text,
                }}
              >
                {msg.text}
                <p className="mt-[2px] text-right text-[11px] leading-none text-[#8696A0]">{msg.time}</p>
              </div>
            </div>
          ))}
        </div>

        <div
          className="flex shrink-0 items-center gap-2 px-2 py-[6px]"
          style={{ backgroundColor: WA.header }}
        >
          <WaIconEmoji />
          <div
            className="flex flex-1 items-center gap-2 rounded-full px-3 py-[9px]"
            style={{ backgroundColor: WA.input }}
          >
            <span className="flex-1 text-[15px] text-[#8696A0]">Message</span>
            <WaIconAttach />
          </div>
          <button type="button" className="p-1" aria-label="Camera"><WaIconCameraSmall /></button>
          <button
            type="button"
            className="flex h-[42px] w-[42px] items-center justify-center rounded-full"
            style={{ backgroundColor: WA.brand }}
            aria-label="Send"
          >
            <WaIconMic />
          </button>
        </div>
      </div>
    );
  }

  const visibleChats =
    chatFilter === "unread" ? WHATSAPP_CHATS.filter((c) => c.unread) : WHATSAPP_CHATS;

  return (
    <div className="relative flex h-full flex-col" style={{ backgroundColor: WA.panel, fontFamily: WA.font }}>
      <header className="shrink-0 px-4 pb-3 pt-1" style={{ backgroundColor: WA.header }}>
        <div className="flex items-center justify-between">
          <button type="button" onClick={onBack} style={{ color: WA.primary }} aria-label="Back home">
            <WaBackArrow />
          </button>
          <div className="flex gap-5">
            <WaIconCamera />
            <WaIconSearch />
            <WaIconMore />
          </div>
        </div>
        <h1 className="mt-2 text-[22px] font-normal tracking-tight" style={{ color: WA.text }}>WhatsApp</h1>
      </header>

      {tab === "chats" && (
        <div className="shrink-0 px-4 pb-3 pt-1" style={{ backgroundColor: WA.panel }}>
          <div
            className="flex h-10 items-center gap-3 rounded-full px-3"
            style={{ backgroundColor: WA.search }}
          >
            <WaIconSearchSmall />
            <span className="min-w-0 truncate text-[15px]" style={{ color: WA.secondary }}>Ask Meta AI or Search</span>
          </div>
          <div className="mt-4 flex gap-2">
            {(["all", "unread"] as ChatFilter[]).map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setChatFilter(f)}
                className="shrink-0 rounded-full px-3.5 py-1.5 text-[13px] capitalize"
                style={{
                  backgroundColor: chatFilter === f ? WA.chipActive : WA.search,
                  color: chatFilter === f ? WA.brand : WA.secondary,
                  border: chatFilter === f ? `1px solid ${WA.brand}` : "1px solid transparent",
                }}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="nothing-scroll flex-1 overflow-x-hidden overflow-y-auto pb-16" style={{ backgroundColor: WA.panel }}>
        {tab === "chats" &&
          visibleChats.map((chat) => (
            <button
              key={chat.id}
              type="button"
              onClick={() => setActiveChat(chat.id)}
              className="flex w-full items-stretch pl-4 text-left active:bg-[#202C33]"
            >
              <div className="flex items-center py-[8px] pr-3">
                <div
                  className="flex h-[49px] w-[49px] shrink-0 items-center justify-center rounded-full text-[18px] font-normal text-white"
                  style={{ backgroundColor: chat.color }}
                >
                  {chat.avatar}
                </div>
              </div>
              <div className="flex min-w-0 flex-1 flex-col justify-center gap-[3px] border-b border-[#222D34] py-[12px] pr-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="min-w-0 flex-1 truncate text-[17px] font-normal leading-5 text-[#E9EDEF]">{chat.name}</p>
                  <span className="shrink-0 text-[12px] leading-none" style={{ color: chat.unread ? WA.primary : WA.secondary }}>
                    {chat.time}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <p className="min-w-0 flex-1 truncate text-[14px] leading-5 text-[#8696A0]">{chat.preview}</p>
                  {chat.unread ? (
                    <span
                      className="flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full px-1.5 text-[12px] font-medium leading-none"
                      style={{ backgroundColor: WA.brand, color: "#111B21" }}
                    >
                      {chat.unread}
                    </span>
                  ) : null}
                </div>
              </div>
            </button>
          ))}

        {tab === "updates" && (
          <div className="px-4 py-3">
            <p className="mb-3 text-[15px] font-medium text-[#E9EDEF]">Status</p>
            <div className="flex gap-4 overflow-x-auto pb-4">
              {WHATSAPP_STATUS.map((s) => (
                <button key={s.id} type="button" onClick={() => setActiveStatus(s.id)} className="flex shrink-0 flex-col items-center gap-1">
                  <div className="rounded-full p-[2px]" style={{ background: `linear-gradient(135deg, ${WA.brand}, #128C7E)` }}>
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#111B21] text-lg text-white">RK</div>
                  </div>
                  <span className="max-w-[64px] truncate text-[11px] text-[#8696A0]">{s.name}</span>
                </button>
              ))}
            </div>
            {activeStatus && (
              <div className="rounded-xl bg-[#1F2C34] p-4">
                <p className="text-[14px] text-[#E9EDEF]">{WHATSAPP_STATUS.find((s) => s.id === activeStatus)?.text}</p>
                <p className="mt-2 text-[12px] text-[#8696A0]">{WHATSAPP_STATUS.find((s) => s.id === activeStatus)?.time}</p>
              </div>
            )}
          </div>
        )}

        {tab === "calls" && (
          <div className="px-2">
            <a href={`tel:${profile.phone.replace(/\s/g, "")}`} className="flex items-center gap-3 px-3 py-3 active:bg-[#202C33]">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#00A884] text-white">RK</div>
              <div className="flex-1">
                <p className="text-[16px] text-[#E9EDEF]">{profile.name}</p>
                <p className="text-[13px] text-[#8696A0]">Outgoing · Today</p>
              </div>
              <WaIconPhone />
            </a>
            <button type="button" onClick={() => showToast(`Video call: ${profile.email}`)} className="flex w-full items-center gap-3 px-3 py-3 active:bg-[#202C33]">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#53BDEB] text-white">H</div>
              <div className="flex-1 text-left">
                <p className="text-[16px] text-[#E9EDEF]">Hiring Managers</p>
                <p className="text-[13px] text-[#8696A0]">Missed video call</p>
              </div>
              <WaIconVideo />
            </button>
          </div>
        )}

        {tab === "communities" && (
          <div className="px-4 py-6 text-center">
            <p className="text-[15px] font-medium text-[#E9EDEF]">Hiring & Opportunities</p>
            <p className="mt-2 text-[14px] text-[#8696A0]">Quick chat for availability & contact info. Resume → Gmail · Career → LinkedIn</p>
            <button type="button" onClick={() => setActiveChat("hiring")} className="mt-4 rounded-full px-6 py-2 text-[14px] text-[#00A884]" style={{ border: `1px solid ${WA.primary}` }}>
              View community chat
            </button>
          </div>
        )}
      </div>

      {tab === "chats" && (
        <button
          type="button"
          onClick={() => setActiveChat("hiring")}
          className="absolute bottom-[72px] right-4 flex h-[52px] w-[52px] items-center justify-center rounded-full shadow-lg"
          style={{ backgroundColor: WA.brand }}
          aria-label="New chat"
        >
          <WaIconNewChat />
        </button>
      )}

      <WaBottomNav tab={tab} onTab={setTab} />
      <MobileToast message={toast} />
    </div>
  );
}

function WaBottomNav({ tab, onTab }: { tab: Tab; onTab: (t: Tab) => void }) {
  const items: { id: Tab; label: string }[] = [
    { id: "chats", label: "Chats" },
    { id: "updates", label: "Updates" },
    { id: "communities", label: "Communities" },
    { id: "calls", label: "Calls" },
  ];
  return (
    <nav
      className="flex shrink-0 justify-around border-t border-[#222D34] py-[6px] pb-[8px]"
      style={{ backgroundColor: WA.header }}
    >
      {items.map((item) => (
        <button
          key={item.id}
          type="button"
          onClick={() => onTab(item.id)}
          className="flex flex-col items-center gap-[2px] px-2"
        >
          <WaTabIcon id={item.id} active={tab === item.id} />
          <span
            style={{ fontSize: 11, color: tab === item.id ? WA.primary : WA.secondary }}
          >
            {item.label}
          </span>
        </button>
      ))}
    </nav>
  );
}

function WaTabIcon({ id, active }: { id: Tab; active: boolean }) {
  const c = active ? WA.primary : WA.secondary;
  if (id === "chats")
    return (
      <svg width="24" height="24" fill={c} viewBox="0 0 24 24" aria-hidden>
        <path d="M12 2C6.5 2 2 6.1 2 11c0 1.5.4 3 1.1 4.3L2 22l7-1c1.2.6 2.5 1 3.9 1 5.5 0 10-4.1 10-9.1S17.5 2 12 2z" />
      </svg>
    );
  if (id === "updates")
    return (
      <svg width="24" height="24" fill="none" stroke={c} strokeWidth="2" viewBox="0 0 24 24" aria-hidden>
        <circle cx="12" cy="12" r="9" />
        <circle cx="12" cy="12" r="3" fill={c} stroke="none" />
      </svg>
    );
  if (id === "communities")
    return (
      <svg width="24" height="24" fill={c} viewBox="0 0 24 24" aria-hidden>
        <path d="M16 11c1.7 0 3-1.3 3-3S17.7 5 16 5s-3 1.3-3 3 1.3 3 3 3zm-8 0c1.7 0 3-1.3 3-3S9.7 5 8 5 5 6.3 5 8s1.3 3 3 3zm0 2c-2.7 0-8 1.3-8 4v2h16v-2c0-2.7-5.3-4-8-4zm8 0c-.3 0-.6 0-1 .1 1.2.8 2 1.9 2 3.9v2h6v-2c0-2.7-5.3-4-8-4z" />
      </svg>
    );
  return (
    <svg width="24" height="24" fill="none" stroke={c} strokeWidth="1.8" viewBox="0 0 24 24" aria-hidden>
      <path
        d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1C10.61 21 3 13.39 3 4c0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.22 2.21z"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function WaBackArrow() {
  return (
    <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden>
      <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function WaIconMore() {
  return (
    <svg width="22" height="22" fill={WA.icon} viewBox="0 0 24 24" aria-hidden>
      <circle cx="5" cy="12" r="2" />
      <circle cx="12" cy="12" r="2" />
      <circle cx="19" cy="12" r="2" />
    </svg>
  );
}

function WaIconSearch() {
  return (
    <svg width="22" height="22" fill="none" stroke={WA.icon} strokeWidth="2" viewBox="0 0 24 24" aria-hidden>
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20l-3-3" />
    </svg>
  );
}

function WaIconCamera() {
  return (
    <svg width="22" height="22" fill="none" stroke={WA.icon} strokeWidth="2" viewBox="0 0 24 24" aria-hidden>
      <path d="M4 7h4l2-2h8l2 2h4v12H4V7z" />
      <circle cx="12" cy="13" r="3" />
    </svg>
  );
}

function WaIconVideo() {
  return (
    <svg width="22" height="22" fill={WA.icon} viewBox="0 0 24 24" aria-hidden>
      <path d="M17 10.5V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-3.5l5 3.5V7l-5 3.5z" />
    </svg>
  );
}

function WaIconPhone() {
  return (
    <svg width="20" height="20" fill={WA.icon} viewBox="0 0 24 24" aria-hidden>
      <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
    </svg>
  );
}

function WaIconSearchSmall() {
  return (
    <svg width="18" height="18" fill="none" stroke={WA.secondary} strokeWidth="2" viewBox="0 0 24 24" aria-hidden>
      <circle cx="11" cy="11" r="7" /><path d="M20 20l-3-3" />
    </svg>
  );
}

function WaIconEmoji() {
  return (
    <svg width="24" height="24" fill="none" stroke={WA.icon} strokeWidth="1.8" viewBox="0 0 24 24" aria-hidden>
      <circle cx="12" cy="12" r="9" /><path d="M8 14s1.5 2 4 2 4-2 4-2" /><circle cx="9" cy="10" r="1" fill={WA.icon} /><circle cx="15" cy="10" r="1" fill={WA.icon} />
    </svg>
  );
}

function WaIconAttach() {
  return (
    <svg width="20" height="20" fill="none" stroke={WA.icon} strokeWidth="2" viewBox="0 0 24 24" aria-hidden>
      <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
    </svg>
  );
}

function WaIconCameraSmall() {
  return (
    <svg width="22" height="22" fill="none" stroke={WA.icon} strokeWidth="2" viewBox="0 0 24 24" aria-hidden>
      <path d="M4 7h4l2-2h8l2 2h4v12H4V7z" /><circle cx="12" cy="13" r="3" />
    </svg>
  );
}

function WaIconMic() {
  return (
    <svg width="22" height="22" fill="#fff" viewBox="0 0 24 24" aria-hidden>
      <path d="M12 14a3 3 0 0 0 3-3V6a3 3 0 0 0-6 0v5a3 3 0 0 0 3 3zm5-3a5 5 0 0 1-10 0H5a7 7 0 0 0 6 6.92V19H9v2h6v-2h-2v-1.08A7 7 0 0 0 19 11h-2z" />
    </svg>
  );
}

function WaIconNewChat() {
  return (
    <svg width="24" height="24" fill="#fff" viewBox="0 0 24 24" aria-hidden>
      <path d="M20 2H4a2 2 0 0 0-2 2v18l4-4h14a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2z" />
    </svg>
  );
}
