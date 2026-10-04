import { projects, profile } from "@/data/portfolio";
import type { Project } from "@/data/portfolio";
import { RESUME_FILENAME } from "@/lib/constants";

/** Each app owns unique portfolio content — no duplication across apps */

export const INSTAGRAM_POSTS = projects.map((p) => ({
  id: p.id,
  image: `/mobile/posts/${p.folder}.svg`,
  company: p.company,
  domain: p.domain,
  caption: p.metrics?.[0] ?? p.impact[0],
  hashtags: p.stack.slice(0, 4).map((s) => `#${s.replace(/[.\s]/g, "")}`),
  blurb: `${p.name} — ${p.metrics?.join(" · ") ?? p.domain}`,
}));

export const INSTAGRAM_STORIES = [
  {
    id: "ship",
    label: "Ship log",
    content: "Latest builds across EdTech & FinTech.\nFull case studies → Files app 📁",
  },
  {
    id: "open",
    label: "Open to work",
    content: "🚀 Open to full-time frontend & full-stack roles\nEdTech · FinTech · Remote",
  },
  {
    id: "stack",
    label: "Stack",
    content: "Skills & playlists → Spotify app 🎵",
  },
];

export function getInstagramComments(project: Project) {
  return [
    { user: "tech_recruiter", text: `This ${project.name} UI is clean! 🔥`, time: "2h" },
    { user: "product_lead", text: project.metrics?.[0] ?? "Great impact!", time: "5h" },
    { user: "dev_community", text: "Full write-up in Files app 📁", time: "1d" },
  ];
}

export function getInstagramShare(project: Project) {
  return [
    { label: "Copy caption", action: "copy" as const, value: `${project.name} — ${project.company}` },
    { label: "Open case study (Files)", action: "files" as const, value: project.id },
    { label: "Live demo", action: "demo" as const, value: project.id },
  ];
}

/** WhatsApp — contact & availability only */
export type WhatsAppChatId = "hiring" | "rahul";

export const WHATSAPP_CHATS: {
  id: WhatsAppChatId;
  name: string;
  preview: string;
  time: string;
  unread?: number;
  avatar: string;
  color: string;
}[] = [
  {
    id: "hiring",
    name: "Hiring Managers",
    preview: "Open to full-time frontend & full-stack roles 🚀",
    time: "12:45",
    unread: 2,
    avatar: "H",
    color: "#00A884",
  },
  {
    id: "rahul",
    name: "Rahul Kotla (You)",
    preview: "Message me anytime!",
    time: "12:30",
    avatar: "R",
    color: "#53BDEB",
  },
];

export const WHATSAPP_THREADS: Record<
  WhatsAppChatId,
  { from: "them" | "me"; text: string; time: string }[]
> = {
  hiring: [
    { from: "them", text: "Hi Rahul! Are you open to new opportunities?", time: "10:02" },
    {
      from: "me",
      text: "Yes! I'm open to full-time frontend & full-stack roles in EdTech and FinTech.",
      time: "10:05",
    },
    { from: "them", text: "Great — how can we reach you?", time: "10:06" },
    {
      from: "me",
      text: `📧 ${profile.email}\n📱 ${profile.phone}\n\nResume & formal intro → Gmail app`,
      time: "10:07",
    },
    {
      from: "me",
      text: "Feel free to schedule a call anytime. Looking forward to connecting! 🚀",
      time: "10:07",
    },
  ],
  rahul: [
    { from: "me", text: "> npm run hire-me", time: "12:28" },
    {
      from: "me",
      text: "🚀 Thanks for your interest!\n\nLet's build something great together.",
      time: "12:30",
    },
  ],
};

export const WHATSAPP_STATUS = [
  { id: "open", name: "Available", text: "Open to work · Full-time roles", time: "2h ago" },
];

/** LinkedIn — career identity only (not projects — those are in Files/Instagram) */
export const LINKEDIN_POSTS = [
  {
    id: "role",
    author: profile.name,
    headline: profile.role,
    text: "Excited to build scalable products in EdTech & FinTech. UI Lead experience on district-scale platforms.",
    likes: 128,
    comments: 24,
  },
  {
    id: "milestone",
    author: profile.name,
    headline: "Career milestone",
    text: "Resolved 20+ high-priority production issues within two weeks while establishing frontend infrastructure.",
    likes: 89,
    comments: 12,
  },
];

/** Gmail — resume & hiring threads only */
export const GMAIL_THREADS = [
  {
    id: "resume",
    from: profile.name,
    subject: `Resume — ${profile.name}`,
    preview: `${RESUME_FILENAME} — Software Engineer, 3+ years`,
    time: "10:30 AM",
    starred: true,
    avatar: "R",
    color: "#EA4335",
    hasAttachment: true,
    body: `Hi there,\n\nThanks for visiting my portfolio! I've attached my resume for your review.\n\n📎 ${RESUME_FILENAME}\nRole: ${profile.role}\nExperience: 3+ years in EdTech & FinTech\n\nBest regards,\n${profile.name}`,
  },
  {
    id: "intro",
    from: "Hiring Team",
    subject: "Introduction & availability",
    preview: "Thanks for reaching out — happy to connect...",
    time: "Yesterday",
    starred: false,
    avatar: "H",
    color: "#1A73E8",
    hasAttachment: false,
    body: `Hello Rahul,\n\nWe came across your portfolio and would love to learn more about your availability.\n\nPlease reply with your preferred time slots.\n\nBest,\nHiring Team`,
  },
  {
    id: "hire-me",
    from: "Portfolio",
    subject: "Re: npm run hire-me",
    preview: "🚀 Thanks for your interest! Let's build something great...",
    time: "Mon",
    starred: true,
    avatar: "P",
    color: "#34A853",
    hasAttachment: false,
    body: `> npm run hire-me\n\n🚀 Thanks for your interest!\n\nFor a quick chat → WhatsApp app\nFor career history → LinkedIn app`,
  },
];
