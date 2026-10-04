"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { projects, profile } from "@/data/portfolio";
import { DemoLinkButton } from "@/components/shared/DemoLinkButton";
import { IG } from "./app-tokens";
import { InstagramLogo } from "./ui/InstagramLogo";
import { PostImage } from "./ui/PostImage";
import { MobileToast } from "./ui/MobileToast";
import {
  INSTAGRAM_POSTS,
  INSTAGRAM_STORIES,
  getInstagramComments,
  getInstagramShare,
} from "./app-content";
import type { MobileAppId } from "./mobile-app-config";

interface InstagramAppProps {
  onBack: () => void;
  onOpenApp?: (id: MobileAppId) => void;
}

const baseLikes: Record<string, number> = {
  "coach-matching": 142,
  "digital-flex": 218,
  "fintech-kyc": 305,
  "ai-workflows": 97,
};

export function InstagramApp({ onBack, onOpenApp }: InstagramAppProps) {
  const [liked, setLiked] = useState<Record<string, boolean>>({});
  const [likes, setLikes] = useState(baseLikes);
  const [saved, setSaved] = useState<Record<string, boolean>>({});
  const [commentId, setCommentId] = useState<string | null>(null);
  const [shareId, setShareId] = useState<string | null>(null);
  const [activeStory, setActiveStory] = useState<(typeof INSTAGRAM_STORIES)[0] | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2200);
  };

  const commentProject = projects.find((p) => p.id === commentId);
  const shareProject = projects.find((p) => p.id === shareId);

  return (
    <div className="relative flex h-full flex-col bg-black" style={{ fontFamily: IG.font }}>
      <header className="relative flex h-[52px] shrink-0 items-center border-b border-[#262626] px-3">
        <button type="button" onClick={onBack} className="relative z-10" aria-label="Back home"><IgBack /></button>
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <InstagramLogo />
        </div>
        <button type="button" onClick={() => showToast("Notifications — new project shipped!")} className="relative z-10 ml-auto" aria-label="Activity"><IgHeart /></button>
      </header>

      <div className="nothing-scroll flex shrink-0 gap-3 overflow-x-auto px-3 py-3">
        {INSTAGRAM_STORIES.map((s, i) => (
          <StoryRing key={s.id} label={s.label} initials={s.label[0]} index={i} onClick={() => setActiveStory(s)} />
        ))}
      </div>

      <div className="nothing-scroll flex-1 overflow-y-auto">
        {INSTAGRAM_POSTS.map((post, i) => {
          const project = projects.find((p) => p.id === post.id)!;
          return (
            <article key={post.id} className="mb-[12px] border-b border-[#262626]">
              <div className="flex h-[54px] items-center gap-[10px] px-3">
                <div
                  className="flex h-[32px] w-[32px] items-center justify-center rounded-full text-[11px] font-bold text-white"
                  style={{ backgroundColor: companyColor(post.company) }}
                >
                  {post.company[0]}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[14px] font-semibold text-[#FAFAFA]">{post.company}</p>
                  <p className="truncate text-[12px] text-[#A8A8A8]">{post.domain}</p>
                </div>
                <IgMore />
              </div>

              <div className="relative aspect-square w-full overflow-hidden bg-[#111]">
                <PostImage
                  src={post.image}
                  alt={project.name}
                  className="absolute inset-0 h-full w-full object-cover"
                  priority={i < 2}
                />
              </div>

              <div className="flex items-center justify-between px-3 py-[10px]">
                <div className="flex gap-4">
                  <button type="button" onClick={() => {
                    const was = liked[post.id];
                    setLiked((p) => ({ ...p, [post.id]: !was }));
                    setLikes((p) => ({ ...p, [post.id]: p[post.id] + (was ? -1 : 1) }));
                  }} aria-label="Like"><IgHeart filled={liked[post.id]} /></button>
                  <button type="button" onClick={() => setCommentId(post.id)} aria-label="Comment"><IgComment /></button>
                  <button type="button" onClick={() => setShareId(post.id)} aria-label="Share"><IgShare /></button>
                </div>
                <button type="button" onClick={() => {
                  setSaved((p) => ({ ...p, [post.id]: !p[post.id] }));
                  showToast(saved[post.id] ? "Removed from saved" : "Saved — open Files for full case study");
                }} aria-label="Save"><IgBookmark filled={saved[post.id]} /></button>
              </div>

              <div className="px-3 pb-4">
                <p className="text-[14px] font-semibold text-[#FAFAFA]">{likes[post.id]} likes</p>
                <p className="mt-1 text-[14px] leading-[18px] text-[#FAFAFA]">
                  <span className="font-semibold">rahul_kotla</span> {post.caption}
                </p>
                <p className="mt-1 text-[13px] text-[#3897F0]">{post.hashtags.join(" ")}</p>
                <button type="button" onClick={() => setCommentId(post.id)} className="mt-1 text-[14px] text-[#A8A8A8]">
                  View all {getInstagramComments(project).length} comments
                </button>
              </div>
            </article>
          );
        })}
      </div>

      <IgBottomNav />
      <MobileToast message={toast} />

      <AnimatePresence>
        {activeStory && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-50 flex flex-col bg-black" onClick={() => setActiveStory(null)}>
            <div className="mx-4 mt-3 h-1 overflow-hidden rounded-full bg-white/30"><motion.div initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ duration: 5 }} className="h-full bg-white" /></div>
            <div className="flex flex-1 flex-col justify-center px-8 text-center">
              <p className="text-[22px] font-bold text-white">{activeStory.label}</p>
              <p className="mt-6 whitespace-pre-line text-[16px] leading-relaxed text-white/85">{activeStory.content}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Sheet open={!!commentProject} onClose={() => setCommentId(null)} title="Comments">
        {commentProject && (
          <>
            {getInstagramComments(commentProject).map((c) => (
              <div key={c.user} className="mb-4 flex gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#262626] text-[10px] font-bold text-white">{c.user[0].toUpperCase()}</div>
                <div>
                  <p className="text-[13px] text-[#FAFAFA]"><span className="font-semibold">{c.user}</span> {c.text}</p>
                  <p className="text-[11px] text-[#A8A8A8]">{c.time}</p>
                </div>
              </div>
            ))}
            <button type="button" onClick={() => { setCommentId(null); onOpenApp?.("files"); }} className="mt-2 w-full rounded-lg bg-[#262626] py-3 text-[13px] font-semibold text-[#3897F0]">
              Open full case study in Files →
            </button>
          </>
        )}
      </Sheet>

      <Sheet open={!!shareProject} onClose={() => setShareId(null)} title="Share">
        {shareProject && (
          <>
            {getInstagramShare(shareProject).map((opt) => (
              <button key={opt.label} type="button" onClick={async () => {
                if (opt.action === "copy") { await navigator.clipboard.writeText(opt.value); showToast("Copied!"); }
                else if (opt.action === "files") { setShareId(null); onOpenApp?.("files"); }
                else if (opt.action === "demo") { setShareId(null); showToast("Open Files app for demo link"); onOpenApp?.("files"); }
                setShareId(null);
              }} className="flex w-full rounded-xl px-4 py-3 text-left text-[15px] text-[#FAFAFA] active:bg-[#262626]">{opt.label}</button>
            ))}
            {shareProject && <DemoLinkButton projectId={shareProject.id} className="mt-4 w-full" />}
          </>
        )}
      </Sheet>
    </div>
  );
}

function companyColor(company: string) {
  const colors = ["#E1306C", "#405DE6", "#FD5949", "#833AB4", "#0A66C2", "#25D366"];
  let hash = 0;
  for (let i = 0; i < company.length; i++) hash = company.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
}

function StoryRing({ label, initials, index, onClick }: { label: string; initials: string; index: number; onClick: () => void }) {
  const gradients = ["#f09433,#e6683c,#dc2743", "#405DE6,#833AB4", "#00C9FF,#92FE9D"];
  const g = gradients[index % gradients.length];
  return (
    <button type="button" onClick={onClick} className="flex w-max min-w-[72px] shrink-0 flex-col items-center gap-1.5 px-1">
      <div className="rounded-full p-[2px]" style={{ background: `linear-gradient(45deg, ${g})` }}>
        <div className="flex h-[62px] w-[62px] items-center justify-center rounded-full bg-black text-[13px] font-semibold text-white">{initials}</div>
      </div>
      <span className="whitespace-nowrap text-center text-[12px] leading-[14px] text-white">{label}</span>
    </button>
  );
}

function Sheet({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: string; children: React.ReactNode }) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-50 bg-black/60" onClick={onClose} />
          <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} transition={{ type: "spring", damping: 30, stiffness: 340 }} className="absolute inset-x-0 bottom-0 z-50 max-h-[70%] overflow-hidden rounded-t-[16px] bg-[#121212] px-4 py-4">
            <p className="mb-4 text-center text-[16px] font-semibold text-white">{title}</p>
            <div className="nothing-scroll max-h-[50vh] overflow-y-auto">{children}</div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function IgBottomNav() {
  return (
    <nav className="flex h-[48px] shrink-0 items-center justify-around border-t border-[#262626] bg-black px-2">
      <IgHome active /><IgSearch /><IgReels /><IgShop />
      <div className="h-[24px] w-[24px] rounded-full bg-gradient-to-tr from-[#FD5949] to-[#833AB4]" />
    </nav>
  );
}

function IgBack() { return <svg width="24" height="24" fill="none" stroke="#FAFAFA" strokeWidth="2" viewBox="0 0 24 24"><path d="M15 18l-6-6 6-6" /></svg>; }
function IgHeart({ filled }: { filled?: boolean }) { return <svg width="24" height="24" fill={filled ? "#ED4956" : "none"} stroke={filled ? "#ED4956" : "#FAFAFA"} strokeWidth="2" viewBox="0 0 24 24"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z" /></svg>; }
function IgComment() { return <svg width="24" height="24" fill="none" stroke="#FAFAFA" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 11.5a8.4 8.4 0 0 1-9 8.4 8.4 8.4 0 0 1-8.4-8.4 8.4 8.4 0 0 1 8.4-8.4c2.5 0 4.7 1.1 6.3 2.8L21 3v8.5z" /></svg>; }
function IgShare() { return <svg width="24" height="24" fill="none" stroke="#FAFAFA" strokeWidth="2" viewBox="0 0 24 24"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" /></svg>; }
function IgBookmark({ filled }: { filled?: boolean }) { return <svg width="24" height="24" fill={filled ? "#FAFAFA" : "none"} stroke="#FAFAFA" strokeWidth="2" viewBox="0 0 24 24"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" /></svg>; }
function IgMore() { return <svg width="20" height="20" fill="#FAFAFA" viewBox="0 0 24 24"><circle cx="5" cy="12" r="2" /><circle cx="12" cy="12" r="2" /><circle cx="19" cy="12" r="2" /></svg>; }
function IgHome({ active }: { active?: boolean }) { const c = "#FAFAFA"; return <svg width="24" height="24" fill={active ? c : "none"} stroke={c} strokeWidth={active ? 0 : 2} viewBox="0 0 24 24">{active ? <path d="M12 2L2 9v13h7v-7h6v7h7V9L12 2z" /> : <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1V9.5z" />}</svg>; }
function IgSearch() { return <svg width="24" height="24" fill="none" stroke="#FAFAFA" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="7" /><path d="M20 20l-3-3" /></svg>; }
function IgReels() { return <svg width="24" height="24" fill="none" stroke="#FAFAFA" strokeWidth="2" viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="3" /><path d="M9 8l6 4-6 4V8z" fill="#FAFAFA" stroke="none" /></svg>; }
function IgShop() { return <svg width="24" height="24" fill="none" stroke="#FAFAFA" strokeWidth="2" viewBox="0 0 24 24"><path d="M6 6h15l-1.5 9H7.5L6 6zM6 6L5 3H2" /><circle cx="9" cy="20" r="1" fill="#FAFAFA" /><circle cx="18" cy="20" r="1" fill="#FAFAFA" /></svg>; }
