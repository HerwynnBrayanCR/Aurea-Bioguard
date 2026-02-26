"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface Stat {
  label: string;
  value: string;
  delta?: string;
  deltaPositive?: boolean;
  color: string;
}

const baseStats: Stat[] = [
  { label: "Observaciones HOY", value: "12,847", delta: "+342", deltaPositive: true, color: "#00FF87" },
  { label: "Especies Activas", value: "2,341", delta: "+12", deltaPositive: true, color: "#00E5FF" },
  { label: "Alertas Críticas", value: "7", delta: "+2", deltaPositive: false, color: "#FF3B3B" },
  { label: "Cobertura Global", value: "94.2%", delta: "+0.3%", deltaPositive: true, color: "#8B5CF6" },
  { label: "IA Precisión", value: "99.2%", color: "#00FF87" },
  { label: "Usuarios Online", value: "3,128", delta: "+84", deltaPositive: true, color: "#00E5FF" },
];

export default function StatsBar() {
  const [obs, setObs] = useState(12847);

  useEffect(() => {
    const id = setInterval(() => setObs(v => v + Math.floor(Math.random() * 5)), 2000);
    return () => clearInterval(id);
  }, []);

  const stats = baseStats.map((s, i) =>
    i === 0 ? { ...s, value: obs.toLocaleString() } : s
  );

  return (
    <div className="flex items-center border-b border-white/5 px-6 py-2 gap-0 overflow-x-auto flex-shrink-0">
      {stats.map((stat, i) => (
        <React.Fragment key={stat.label}>
          {i > 0 && <div className="h-6 w-px bg-white/5 mx-5 flex-shrink-0" />}
          <motion.div
            className="flex items-center gap-3 flex-shrink-0"
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
          >
            <div>
              <div className="text-xs text-white/30 font-mono uppercase tracking-wider leading-none mb-1">{stat.label}</div>
              <div className="flex items-baseline gap-2">
                <span className="font-mono font-bold" style={{ color: stat.color }}>{stat.value}</span>
                {stat.delta && (
                  <span className={`text-xs font-mono ${stat.deltaPositive ? "text-bio-green" : "text-bio-red"}`}>
                    {stat.delta}
                  </span>
                )}
              </div>
            </div>
          </motion.div>
        </React.Fragment>
      ))}
    </div>
  );
}
