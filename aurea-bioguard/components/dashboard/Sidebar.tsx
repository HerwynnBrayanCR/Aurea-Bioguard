"use client";

import React from "react";
import { motion } from "framer-motion";
import type { ActiveView } from "./AureaDashboard";

interface SidebarProps {
  activeView: ActiveView;
  onViewChange: (v: ActiveView) => void;
  expanded: boolean;
  onToggle: () => void;
}

const navItems: { id: ActiveView; icon: React.ReactNode; label: string; alert?: number }[] = [
  {
    id: "radar",
    icon: <RadarIcon />,
    label: "Bio-Radar",
  },
  {
    id: "predictions",
    icon: <PredictIcon />,
    label: "Predicciones",
    alert: 3,
  },
  {
    id: "species",
    icon: <SpeciesIcon />,
    label: "Especies",
  },
  {
    id: "alerts",
    icon: <AlertIcon />,
    label: "Alertas",
    alert: 7,
  },
  {
    id: "lab",
    icon: <LabIcon />,
    label: "Laboratorio",
  },
];

export default function Sidebar({ activeView, onViewChange, expanded, onToggle }: SidebarProps) {
  return (
    <motion.nav
      className="border-r border-white/5 glass flex flex-col items-center py-6 gap-1 z-20 flex-shrink-0"
      animate={{ width: expanded ? 220 : 72 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      {/* Logo */}
      <div className="flex items-center justify-center w-full px-4 mb-8">
        <motion.div
          className="flex items-center gap-3 overflow-hidden"
          animate={{ justifyContent: expanded ? "flex-start" : "center" }}
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-bio-green to-bio-cyan flex items-center justify-center flex-shrink-0 shadow-lg"
               style={{ boxShadow: "0 0 20px rgba(0,255,135,0.4)" }}>
            <span className="text-black font-bold text-sm">A</span>
          </div>
          <AnimatePresence>
            {expanded && (
              <motion.span
                className="font-display font-bold text-lg bg-gradient-to-r from-bio-green to-bio-cyan bg-clip-text text-transparent whitespace-nowrap"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
              >
                AUREA
              </motion.span>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Nav items */}
      <div className="flex-1 flex flex-col w-full px-3 gap-1">
        {navItems.map((item) => (
          <NavItem
            key={item.id}
            item={item}
            active={activeView === item.id}
            expanded={expanded}
            onClick={() => onViewChange(item.id)}
          />
        ))}
      </div>

      {/* Settings */}
      <div className="w-full px-3 pt-4 border-t border-white/5">
        <NavItem
          item={{ id: "settings", icon: <SettingsIcon />, label: "Ajustes" }}
          active={activeView === "settings"}
          expanded={expanded}
          onClick={() => onViewChange("settings")}
        />
      </div>

      {/* Toggle */}
      <button
        onClick={onToggle}
        className="mt-4 w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center transition-all"
      >
        <motion.svg
          className="w-4 h-4 text-white/40"
          fill="none" viewBox="0 0 24 24" stroke="currentColor"
          animate={{ rotate: expanded ? 0 : 180 }}
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </motion.svg>
      </button>
    </motion.nav>
  );
}

function NavItem({
  item, active, expanded, onClick,
}: {
  item: { id: string; icon: React.ReactNode; label: string; alert?: number };
  active: boolean;
  expanded: boolean;
  onClick: () => void;
}) {
  return (
    <motion.button
      onClick={onClick}
      className={`relative flex items-center gap-3 w-full rounded-xl px-3 py-3 transition-all overflow-hidden group
        ${active
          ? "bg-bio-green/10 text-bio-green"
          : "text-white/30 hover:text-white/70 hover:bg-white/5"
        }`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      title={!expanded ? item.label : undefined}
    >
      {active && (
        <motion.div
          className="absolute left-0 top-0 bottom-0 w-0.5 bg-bio-green rounded-r"
          layoutId="active-indicator"
        />
      )}
      <span className={`flex-shrink-0 ${active ? "drop-shadow-[0_0_8px_rgba(0,255,135,0.8)]" : ""}`}>
        {item.icon}
      </span>
      <AnimatePresence>
        {expanded && (
          <motion.span
            className="text-sm font-medium whitespace-nowrap font-display"
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -8 }}
            transition={{ duration: 0.15 }}
          >
            {item.label}
          </motion.span>
        )}
      </AnimatePresence>
      {item.alert && (
        <motion.span
          className={`ml-auto flex-shrink-0 bg-bio-amber text-black text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center
            ${!expanded ? "absolute top-1 right-1 w-4 h-4 text-[10px]" : ""}`}
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          {item.alert}
        </motion.span>
      )}
    </motion.button>
  );
}

// SVG Icons
function RadarIcon() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <circle cx="12" cy="12" r="10" strokeWidth={1.5} />
      <circle cx="12" cy="12" r="6" strokeWidth={1.5} />
      <circle cx="12" cy="12" r="2" strokeWidth={1.5} />
      <line x1="12" y1="2" x2="12" y2="12" strokeWidth={1.5} strokeLinecap="round" />
    </svg>
  );
}
function PredictIcon() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
    </svg>
  );
}
function SpeciesIcon() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
    </svg>
  );
}
function AlertIcon() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
    </svg>
  );
}
function LabIcon() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15M14.25 3.104c.251.023.501.05.75.082M19.8 15a2.25 2.25 0 01-2.15 2.395H6.35A2.25 2.25 0 014.2 15m15.6 0l-2.44-9.165M4.2 15l2.44-9.165m0 0a24.3 24.3 0 016.72 0" />
    </svg>
  );
}
function SettingsIcon() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 010 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 010-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}
