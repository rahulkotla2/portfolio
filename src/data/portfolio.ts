export const profile = {
  name: "Rahul Kotla",
  role: "Software Engineer",
  tagline: "EdTech & FinTech · Full-Stack",
  email: "rahulkotla2@gmail.com",
  phone: "+91 6304160530",
  linkedin: "https://linkedin.com/in/rahul-kotla",
  github: "https://github.com/rahulkotla2",
  location: "Remote, India",
  summary:
    "Software Engineer with 3+ years of experience building scalable, production-grade web applications across EdTech and FinTech. Strong in frontend and full-stack development with React.js, Vue.js, Nuxt.js, FastAPI, Java, PostgreSQL, and MongoDB. Leverages AI agents, reusable skills, and automated workflows to accelerate development.",
  education: {
    school: "IIITDM Kancheepuram",
    degree: "B.Tech in Computer Science and Engineering",
    period: "Sep 2020 – May 2024",
    location: "Tamil Nadu, India",
  },
  stats: [
    { label: "Experience", value: "3+ years" },
    { label: "Domains", value: "EdTech & FinTech" },
    { label: "Prod fixes", value: "20+ in 2 weeks" },
    { label: "Efficiency", value: "Up to 60%" },
  ],
};

export const skills = {
  frontend: [
    "Vue.js",
    "Nuxt.js",
    "React.js",
    "Pinia",
    "Redux",
    "Tailwind",
    "Chart.js",
    "PDF.js",
  ],
  backend: ["FastAPI", "Node.js", "Flask", "Java", "REST APIs"],
  databases: ["PostgreSQL", "MongoDB", "MySQL", "Firebase"],
  cloud: ["AWS", "GCP", "Docker", "Kafka", "CircleCI", "GitHub Actions"],
  languages: ["TypeScript", "JavaScript", "Python", "Java", "SQL"],
};

export interface Project {
  id: string;
  name: string;
  folder: string;
  company: string;
  domain: string;
  stack: string[];
  problem: string;
  solution: string;
  impact: string[];
  metrics?: string[];
}

export const projects: Project[] = [
  {
    id: "coach-matching",
    name: "Coach Matching System",
    folder: "coach-matching",
    company: "BetterLesson",
    domain: "EdTech — K-12 Professional Learning",
    stack: ["React.js", "Java", "PostgreSQL", "AWS", "DataDog", "CircleCI"],
    problem:
      "K-12 schools needed an intelligent system to match instructional coaches with teachers based on complex eligibility rules, engagement history, and validation criteria.",
    solution:
      "Designed and developed the end-to-end Coach Matching system with React and Java, implementing scalable APIs and PostgreSQL workflows for matching, reviews, and approval flows. Also built Coach Invoicing for expense requests and Delivery Manager approvals.",
    impact: [
      "End-to-end ownership of critical matching workflows",
      "Resolved 20+ high-priority production issues within two weeks",
      "Established frontend infrastructure and AWS deployment pipelines",
    ],
    metrics: ["20+ prod issues resolved", "Full-stack ownership"],
  },
  {
    id: "digital-flex",
    name: "Digital Flex — HQIM Platform",
    folder: "digital-flex",
    company: "Quantrium Tech",
    domain: "EdTech — U.S. Districts",
    stack: ["Vue.js", "Nuxt.js", "Pinia", "FastAPI", "MongoDB", "SurveyJS"],
    problem:
      "Districts needed a unified platform for HQIM adoption tracking, teacher dashboards, student analytics, and admin reporting with LMS/IDP integration.",
    solution:
      "Led UI architecture using Vue.js, Nuxt.js, and Pinia. Built Teacher Dashboard, Class Insights, Student Analytics, Feedback Surveys, and District Admin dashboards with drill-down analytics. Integrated SSO/OAuth with LMS and IDP systems.",
    impact: [
      "UI Lead collaborating with stakeholders on UX alignment",
      "Performance optimizations: lazy loading, code splitting",
      "Reusable component library for district-scale dashboards",
    ],
    metrics: ["UI Lead", "SSO/LMS integration"],
  },
  {
    id: "fintech-kyc",
    name: "FinTech Document Processing",
    folder: "fintech-kyc",
    company: "Quantrium Tech",
    domain: "FinTech — Verification Platform",
    stack: ["React.js", "Vue.js", "FastAPI", "Kafka", "PDF.js", "OAuth"],
    problem:
      "Financial services needed modular document processing, bank statement analysis, and digital KYC with secure multi-document workflows.",
    solution:
      "Built modular interfaces for 5+ financial services. Refactored bank statement analysis with Kafka-based async processing and AES encryption. Developed digital KYC with geolocation, Google Maps, selfie capture, and e-signature.",
    impact: [
      "40% reduction in manual bank statement processing",
      "60% reduction in manual KYC verification effort",
      "Cross-platform OAuth promotion system for 500+ accounts",
    ],
    metrics: ["40% less manual work", "60% KYC efficiency", "500+ accounts"],
  },
  {
    id: "ai-workflows",
    name: "AI Engineering Workflows",
    folder: "ai-workflows",
    company: "Quantrium Tech",
    domain: "Developer Productivity",
    stack: ["AI Agents", "Automation", "Jira", "Custom Skills"],
    problem:
      "Repetitive engineering tasks slowed development velocity across multiple product teams.",
    solution:
      "Leveraged AI agents, reusable skills, and automated workflows to automate Jira story processing, contextual comments, and repetitive engineering tasks alongside product development.",
    impact: [
      "Accelerated development cycles across teams",
      "Increased engineering throughput with agent-assisted workflows",
      "Reduced context-switching on routine tasks",
    ],
    metrics: ["AI-assisted dev", "Workflow automation"],
  },
];

export const experience = {
  company: "Quantrium Tech Private Ltd",
  role: "Software Engineer",
  period: "May 2023 – Present",
  location: "Remote",
  highlights: [
    "Building production EdTech and FinTech platforms for U.S. schools and financial services",
    "Frontend infrastructure, AWS deployments, CircleCI pipelines, and DataDog monitoring",
    "UI Lead for district-scale dashboard products with SSO and LMS integrations",
  ],
};

export const explorerTree = [
  {
    name: "This PC",
    type: "root" as const,
    children: [
      {
        name: "rahul-kotla",
        type: "folder" as const,
        children: [
          {
            name: "projects",
            type: "folder" as const,
            children: projects.map((p) => ({
              name: p.folder,
              type: "project" as const,
              projectId: p.id,
            })),
          },
          {
            name: "work",
            type: "folder" as const,
            children: [
              { name: "quantrium.md", type: "file" as const, fileId: "experience" },
              { name: "education.md", type: "file" as const, fileId: "education" },
            ],
          },
        ],
      },
    ],
  },
];

export const terminalCommands: Record<
  string,
  {
    output: string[];
    action?: "open-explorer" | "open-vscode" | "download-resume" | "open-explorer-project";
    projectId?: string;
  }
> = {
  help: {
    output: [
      "Available commands:",
      "  help                        — Show this help message",
      "  about                       — About Rahul Kotla",
      "  whoami                      — Current user info",
      "  skills                      — List technical skills",
      "  ls / tree                   — List portfolio structure",
      "  projects                    — Open File Explorer",
      "  contact                     — Show contact information",
      "  resume / cat resume.pdf     — Download resume PDF",
      "  npm run hire-me             — Let's work together!",
      "  sudo hire-me                — Easter egg",
      "  run agent --task jira-stories — AI workflow demo",
      "  open vscode                 — Open VS Code window",
      "  clear                       — Clear terminal",
    ],
  },
  about: {
    output: [
      "Rahul Kotla — Software Engineer",
      "3+ years building EdTech & FinTech products",
      profile.summary,
    ],
  },
  skills: {
    output: [
      `Frontend: ${skills.frontend.join(", ")}`,
      `Backend: ${skills.backend.join(", ")}`,
      `Databases: ${skills.databases.join(", ")}`,
      `Cloud: ${skills.cloud.join(", ")}`,
    ],
  },
  projects: {
    output: ["Opening File Explorer → projects/"],
    action: "open-explorer",
  },
  contact: {
    output: [
      `Email:    ${profile.email}`,
      `Phone:    ${profile.phone}`,
      `LinkedIn: ${profile.linkedin}`,
      `GitHub:   ${profile.github}`,
    ],
  },
  "npm run hire-me": {
    output: [
      "🚀 Thanks for your interest!",
      "",
      `Let's connect: ${profile.email}`,
      `LinkedIn: ${profile.linkedin}`,
      "",
      "Open to full-time opportunities in frontend & full-stack roles.",
    ],
  },
  "open vscode": {
    output: ["Opening Visual Studio Code..."],
    action: "open-vscode",
  },
  resume: {
    output: ["Downloading Rahul-Kotla-Resume.pdf..."],
    action: "download-resume",
  },
  "cat resume.pdf": {
    output: ["Downloading Rahul-Kotla-Resume.pdf..."],
    action: "download-resume",
  },
  clear: { output: [] },
};
