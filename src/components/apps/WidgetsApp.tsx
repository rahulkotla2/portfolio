"use client";

import { motion } from "framer-motion";
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Doughnut, Bar } from "react-chartjs-2";
import { profile, skills, experience, projects } from "@/data/portfolio";

ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false } },
  scales: {
    x: { ticks: { color: "#8b949e", font: { size: 9 } }, grid: { color: "#30363d" } },
    y: { ticks: { color: "#8b949e", font: { size: 9 } }, grid: { color: "#30363d" } },
  },
};

export function WidgetsApp() {
  const skillData = {
    labels: ["Frontend", "Backend", "Cloud", "Databases"],
    datasets: [
      {
        data: [skills.frontend.length, skills.backend.length, skills.cloud.length, skills.databases.length],
        backgroundColor: ["#22d3ee", "#3b82f6", "#8b5cf6", "#10b981"],
        borderWidth: 0,
      },
    ],
  };

  const impactData = {
    labels: ["KYC Efficiency", "Bank Stmt.", "Prod Fixes", "Accounts"],
    datasets: [
      {
        label: "Impact",
        data: [60, 40, 20, 500],
        backgroundColor: "rgba(34, 211, 238, 0.6)",
        borderColor: "#22d3ee",
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="win-scroll h-full min-w-0 overflow-x-hidden overflow-y-auto p-4">
      <h2 className="mb-4 text-sm font-semibold text-win-text">Widgets</h2>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-4 rounded-xl border border-win-border bg-win-surface p-4"
      >
        <div className="mb-3 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-win-accent to-blue-500 text-lg font-bold text-win-bg">
            RK
          </div>
          <div>
            <p className="font-semibold text-win-text">{profile.name}</p>
            <p className="text-xs text-win-accent">{profile.role}</p>
          </div>
        </div>
        <p className="text-xs text-win-muted">{profile.tagline}</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="mb-4 grid gap-2 [grid-template-columns:repeat(2,minmax(0,1fr))]"
      >
        {profile.stats.map((stat) => (
          <div key={stat.label} className="min-w-0 overflow-hidden rounded-lg border border-win-border bg-win-bg p-3 text-center">
            <p className="break-words text-lg font-bold text-win-accent">{stat.value}</p>
            <p className="break-words text-[10px] text-win-muted">{stat.label}</p>
          </div>
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-4 rounded-xl border border-win-border bg-win-surface p-4"
      >
        <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-win-muted">Skills Breakdown</h3>
        <div className="h-36">
          <Doughnut data={skillData} options={{ ...chartOptions, cutout: "60%" }} />
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="mb-4 rounded-xl border border-win-border bg-win-surface p-4"
      >
        <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-win-muted">Project Impact</h3>
        <div className="h-32">
          <Bar data={impactData} options={chartOptions} />
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-4 rounded-xl border border-win-border bg-win-surface p-4"
      >
        <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-win-muted">AI Workflows</h3>
        <p className="mb-2 text-[11px] text-win-muted">
          AI agents for Jira automation, story processing, and engineering throughput.
        </p>
        <div className="space-y-1 rounded bg-win-bg p-2 font-mono text-[10px]">
          <p className="text-green-400/80">{"> run agent --task jira-stories"}</p>
          <p className="text-win-accent">✓ 12 stories processed</p>
          <p className="text-win-muted">Try in Terminal →</p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="rounded-xl border border-win-border bg-win-surface p-4"
      >
        <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-win-muted">Projects</h3>
        <p className="text-[10px] text-win-muted">{projects.length} case studies in Explorer</p>
        <p className="mt-1 text-xs text-win-accent">{experience.company}</p>
        <p className="text-[10px] text-win-muted">{experience.period}</p>
      </motion.div>
    </div>
  );
}
