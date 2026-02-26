"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface RiskMetric {
  label: string;
  value: number;
  target: number;
  color: string;
  icon: string;
}

const metrics: RiskMetric[] = [
  { label: "Deforestación", value: 78, target: 80, color: "#FF8C00", icon: "🌳" },
  { label: "Estrés Hídrico", value: 42, target: 60, color: "#00E5FF", icon: "💧" },
  { label: "Pérdida Biodiversidad", value: 61, target: 50, color: "#FF3B3B", icon: "🦋" },
  { label: "Contaminación", value: 29, target: 40, color: "#8B5CF6", icon: "🏭" },
  { label: "Estabilidad Climática", value: 54, target: 70, color: "#00FF87", icon: "🌡️" },
];

export default function RiskPanel() {
  const [values, setValues] = useState(metrics.map(m => m.value));

  // Simulate live data fluctuation
  useEffect(() => {
    const id = setInterval(() => {
      setValues(prev => prev.map((v, i) => {
        const delta = (Math.random() - 0.5) * 2;
        return Math.max(0, Math.min(100, v + delta));
      }));
    }, 3000);
    return () => clearInterval(id);
  }, []);

  const globalScore = Math.round(values.reduce((a, b) => a + b, 0) / values.length);

  return (
    <div className="flex flex-col border-b border-white/5 p-5 flex-shrink-0">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h3 className="font-display font-semibold text-sm uppercase tracking-widest text-white/50">
          Índice Ecosistema
        </h3>
        <motion.div
          className="flex items-center gap-1.5"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-bio-green" />
          <span className="text-xs font-mono text-bio-green">EN VIVO</span>
        </motion.div>
      </div>

      {/* Global score ring */}
      <div className="flex items-center gap-4 mb-5">
        <ScoreRing score={globalScore} />
        <div>
          <div className="text-3xl font-mono font-bold">{globalScore}
            <span className="text-lg text-white/40">/100</span>
          </div>
          <div className="text-xs text-white/40 font-mono">ÍNDICE GLOBAL</div>
          <div className={`text-xs mt-1 font-medium ${globalScore > 60 ? "text-bio-amber" : "text-bio-green"}`}>
            {globalScore > 70 ? "⚠️ Presión Alta" : globalScore > 50 ? "🔶 Monitoreo Activo" : "✅ Estable"}
          </div>
        </div>
      </div>

      {/* Individual metrics */}
      <div className="space-y-3">
        {metrics.map((metric, i) => (
          <div key={metric.label}>
            <div className="flex items-center justify-between text-xs mb-1.5">
              <div className="flex items-center gap-1.5">
                <span>{metric.icon}</span>
                <span className="text-white/50 font-mono uppercase tracking-wider">{metric.label}</span>
              </div>
              <span className="font-mono font-bold" style={{ color: metric.color }}>
                {values[i].toFixed(1)}%
              </span>
            </div>
            <div className="h-1.5 bg-white/5 rounded-full overflow-hidden relative">
              {/* Target line */}
              <div
                className="absolute top-0 bottom-0 w-0.5 bg-white/20 z-10"
                style={{ left: `${metric.target}%` }}
              />
              <motion.div
                className="h-full rounded-full"
                style={{ backgroundColor: metric.color }}
                animate={{ width: `${values[i]}%` }}
                transition={{ duration: 1, ease: "easeInOut" }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ScoreRing({ score }: { score: number }) {
  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const dash = (score / 100) * circumference;
  const color = score > 70 ? "#FF8C00" : score > 50 ? "#00E5FF" : "#00FF87";

  return (
    <div className="relative w-20 h-20 flex-shrink-0">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 72 72">
        <circle cx="36" cy="36" r={radius} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="6" />
        <motion.circle
          cx="36" cy="36" r={radius}
          fill="none"
          stroke={color}
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={circumference}
          animate={{ strokeDashoffset: circumference - dash }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          style={{ filter: `drop-shadow(0 0 6px ${color})` }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-xs font-mono font-bold" style={{ color }}>{score}</span>
      </div>
    </div>
  );
}
