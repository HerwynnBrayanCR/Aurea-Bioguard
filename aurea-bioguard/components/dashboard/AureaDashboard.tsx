"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Sidebar from "./Sidebar";
import BioRadarMap from "./BioRadarMap";
import RiskPanel from "./RiskPanel";
import AlertsTicker from "./AlertsTicker";
import NeuralScanner from "./NeuralScanner";
import StatsBar from "./StatsBar";
import LiveFeed from "./LiveFeed";
import EcosystemSimulator from "./EcosystemSimulator";

export type ActiveView = "radar" | "predictions" | "species" | "alerts" | "lab" | "settings";

export default function AureaDashboard() {
  const [activeView, setActiveView] = useState<ActiveView>("radar");
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [showScanner, setShowScanner] = useState(false);
  const [showSimulator, setShowSimulator] = useState(false);
  const [systemTime, setSystemTime] = useState("");

  useEffect(() => {
    const tick = () => setSystemTime(new Date().toISOString().replace("T", " ").slice(0, 19));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="flex h-screen w-screen bg-[#030712] text-white overflow-hidden relative">
      {/* Background grid */}
      <div className="absolute inset-0 grid-bg opacity-60 pointer-events-none" />

      {/* Ambient background glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-bio-green/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-bio-cyan/5 rounded-full blur-3xl pointer-events-none" />

      {/* Sidebar */}
      <Sidebar
        activeView={activeView}
        onViewChange={setActiveView}
        expanded={sidebarExpanded}
        onToggle={() => setSidebarExpanded((p) => !p)}
      />

      {/* Main Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="flex items-center justify-between px-6 py-3 border-b border-white/5 glass-light flex-shrink-0">
          <div className="flex items-center gap-6">
            {/* System status pill */}
            <motion.div
              className="flex items-center gap-2 bg-bio-green/10 border border-bio-green/20 rounded-full px-3 py-1"
              animate={{ boxShadow: ["0 0 10px rgba(0,255,135,0.2)", "0 0 20px rgba(0,255,135,0.4)", "0 0 10px rgba(0,255,135,0.2)"] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <span className="w-2 h-2 rounded-full bg-bio-green animate-pulse" />
              <span className="text-xs font-mono text-bio-green font-medium tracking-wider">SISTEMA ACTIVO</span>
            </motion.div>

            {/* Search */}
            <div className="relative hidden md:block">
              <svg className="absolute left-3 top-2.5 w-4 h-4 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                className="bg-white/5 border border-white/10 rounded-full py-2 pl-9 pr-4 text-sm w-72 focus:outline-none focus:ring-1 focus:ring-bio-green/40 focus:border-bio-green/40 transition-all placeholder:text-white/20 font-mono"
                placeholder="Buscar especie, patrón, coordenada..."
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Clock */}
            <div className="text-xs font-mono text-white/30 hidden lg:block">{systemTime} UTC</div>

            {/* Scanner button */}
            <motion.button
              onClick={() => setShowScanner(true)}
              className="flex items-center gap-2 bg-bio-green/10 hover:bg-bio-green/20 border border-bio-green/30 rounded-full px-4 py-2 text-xs font-mono text-bio-green font-medium transition-all"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              ESCÁNER NEURONAL
            </motion.button>

            {/* Simulator button */}
            <motion.button
              onClick={() => setShowSimulator(true)}
              className="flex items-center gap-2 bg-bio-cyan/10 hover:bg-bio-cyan/20 border border-bio-cyan/30 rounded-full px-4 py-2 text-xs font-mono text-bio-cyan font-medium transition-all"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              SIMULADOR
            </motion.button>

            {/* Avatar */}
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-bio-green to-bio-cyan flex items-center justify-center text-xs font-bold text-black">A</div>
          </div>
        </header>

        {/* Stats bar */}
        <StatsBar />

        {/* Main content */}
        <div className="flex flex-1 overflow-hidden gap-0">
          {/* Map + main area */}
          <div className="flex-1 flex flex-col overflow-hidden">
            <AnimatePresence mode="wait">
              {activeView === "radar" && (
                <motion.div
                  key="radar"
                  className="flex-1 overflow-hidden"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <BioRadarMap />
                </motion.div>
              )}
              {activeView === "predictions" && (
                <motion.div
                  key="pred"
                  className="flex-1 overflow-auto p-6"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                >
                  <PredictionsView />
                </motion.div>
              )}
              {activeView === "species" && (
                <motion.div
                  key="species"
                  className="flex-1 overflow-auto p-6"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                >
                  <SpeciesView />
                </motion.div>
              )}
              {activeView === "alerts" && (
                <motion.div
                  key="alerts"
                  className="flex-1 overflow-auto p-6"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                >
                  <AlertsView />
                </motion.div>
              )}
              {(activeView === "lab" || activeView === "settings") && (
                <motion.div
                  key="other"
                  className="flex-1 flex items-center justify-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <ComingSoon view={activeView} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right panel */}
          <aside className="w-80 xl:w-96 border-l border-white/5 flex flex-col overflow-hidden flex-shrink-0">
            <RiskPanel />
            <LiveFeed />
          </aside>
        </div>

        {/* Bottom alerts ticker */}
        <AlertsTicker />
      </div>

      {/* Neural Scanner Modal */}
      <AnimatePresence>
        {showScanner && (
          <NeuralScanner onClose={() => setShowScanner(false)} />
        )}
      </AnimatePresence>

      {/* Ecosystem Simulator Modal */}
      <AnimatePresence>
        {showSimulator && (
          <EcosystemSimulator onClose={() => setShowSimulator(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}

// --- Placeholder sub-views ---

function PredictionsView() {
  const predictions = [
    { species: "Panthera onca", common: "Jaguar", zone: "Amazonas - Sector 4B", risk: 87, trend: "↑ Desplazamiento", color: "bio-amber" },
    { species: "Morpho menelaus", common: "Mariposa Morpho", zone: "Selva Atlántica", risk: 34, trend: "→ Estable", color: "bio-cyan" },
    { species: "Ara macao", common: "Guacamayo Rojo", zone: "Mesoamérica", risk: 61, trend: "↑ Estrés migratorio", color: "bio-amber" },
    { species: "Tremarctos ornatus", common: "Oso de Anteojos", zone: "Andes Tropicales", risk: 79, trend: "↑ Crítico", color: "bio-red" },
    { species: "Tapirus terrestris", common: "Tapir Amazónico", zone: "Pantanal", risk: 55, trend: "→ Monitoreado", color: "bio-green" },
    { species: "Arapaima gigas", common: "Paiche", zone: "Cuenca Amazónica", risk: 43, trend: "↓ Mejorando", color: "bio-green" },
  ];

  return (
    <div>
      <h2 className="font-display text-2xl font-bold mb-6">
        <span className="text-white/50">PREDICCIONES /</span>{" "}
        <span className="text-bio-green text-glow-green">TIEMPO REAL</span>
      </h2>
      <div className="grid gap-4">
        {predictions.map((p, i) => (
          <motion.div
            key={p.species}
            className="glass rounded-2xl p-5 flex items-center gap-5 hover:border-white/15 transition-all cursor-pointer group"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.07 }}
            whileHover={{ scale: 1.01 }}
          >
            <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-2xl flex-shrink-0">🦎</div>
            <div className="flex-1 min-w-0">
              <div className="font-mono text-xs text-white/40 italic">{p.species}</div>
              <div className="font-display font-semibold text-white">{p.common}</div>
              <div className="text-xs text-white/40 mt-1">{p.zone}</div>
            </div>
            <div className="flex flex-col items-end gap-2">
              <div className={`text-2xl font-mono font-bold text-${p.color}`}>{p.risk}%</div>
              <div className="text-xs text-white/40">{p.trend}</div>
            </div>
            <div className="w-2 h-full min-h-[3rem] rounded-full bg-white/5 relative overflow-hidden flex-shrink-0">
              <motion.div
                className={`absolute bottom-0 left-0 right-0 bg-${p.color} rounded-full`}
                initial={{ height: 0 }}
                animate={{ height: `${p.risk}%` }}
                transition={{ delay: i * 0.07 + 0.3, duration: 0.8 }}
              />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function SpeciesView() {
  const species = [
    { name: "Panthera onca", emoji: "🐆", sightings: 1247, status: "Vulnerable", bio: "Felino más grande de América" },
    { name: "Ara chloropterus", emoji: "🦜", sightings: 8931, status: "Preocupación menor", bio: "Guacamayo bandera de América del Sur" },
    { name: "Tapirus bairdii", emoji: "🦏", sightings: 432, status: "En peligro", bio: "Tapir mesoamericano en declive" },
    { name: "Harpia harpyja", emoji: "🦅", sightings: 289, status: "Vulnerable", bio: "Águila arpía, reina del dosel" },
    { name: "Pteronura brasiliensis", emoji: "🦦", sightings: 614, status: "En peligro", bio: "Nutria gigante amazónica" },
    { name: "Eunectes murinus", emoji: "🐍", sightings: 2103, status: "No evaluada", bio: "Anaconda verde, serpiente más pesada" },
  ];
  return (
    <div>
      <h2 className="font-display text-2xl font-bold mb-6">
        <span className="text-white/50">BASE DE DATOS /</span>{" "}
        <span className="text-bio-cyan">ESPECIES MONITOREADAS</span>
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {species.map((s, i) => (
          <motion.div
            key={s.name}
            className="glass rounded-2xl p-5 hover:border-bio-cyan/20 transition-all cursor-pointer group"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.08 }}
            whileHover={{ y: -3 }}
          >
            <div className="text-4xl mb-3">{s.emoji}</div>
            <div className="font-mono text-xs italic text-white/40 mb-1">{s.name}</div>
            <div className="text-xs text-white/50 mb-3">{s.bio}</div>
            <div className="flex items-center justify-between">
              <span className="text-xs bg-white/5 rounded-full px-2 py-0.5 text-white/50">{s.status}</span>
              <span className="font-mono text-sm text-bio-cyan">{s.sightings.toLocaleString()} obs.</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function AlertsView() {
  const alerts = [
    { level: "CRÍTICO", title: "Incendio detectado", desc: "Patrón de calor anómalo en Amazonas occidental. 3 especies en zona de impacto directo.", time: "hace 4 min", color: "bio-red" },
    { level: "ALTO", title: "Migración atípica", desc: "Mariposa Monarca desviada 340km de ruta histórica. Probabilidad de desorientación: 85%.", time: "hace 12 min", color: "bio-amber" },
    { level: "MEDIO", title: "Especie invasora", desc: "Melanotus sp. detectada en 3 nuevas coordenadas fuera de su rango natural.", time: "hace 28 min", color: "bio-cyan" },
    { level: "INFO", title: "Validación científica", desc: "Registro de Puma yagouaroundi confirmado por Dr. María López (UNAM).", time: "hace 1h", color: "bio-green" },
    { level: "ALTO", title: "Calidad hídrica crítica", desc: "pH anómalo en río Tapajós afecta zonas de desove del Arapaima gigas.", time: "hace 2h", color: "bio-amber" },
  ];
  return (
    <div>
      <h2 className="font-display text-2xl font-bold mb-6">
        <span className="text-white/50">SISTEMA /</span>{" "}
        <span className="text-bio-red">ALERTAS ACTIVAS</span>
      </h2>
      <div className="space-y-3">
        {alerts.map((a, i) => (
          <motion.div
            key={i}
            className="glass rounded-2xl p-5 flex gap-4 items-start hover:border-white/10 transition-all"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <div className={`text-xs font-mono font-bold px-2 py-1 rounded bg-${a.color}/10 text-${a.color} border border-${a.color}/20 flex-shrink-0 mt-0.5`}>{a.level}</div>
            <div className="flex-1">
              <div className="font-display font-semibold mb-1">{a.title}</div>
              <div className="text-sm text-white/50">{a.desc}</div>
            </div>
            <div className="text-xs text-white/25 font-mono flex-shrink-0">{a.time}</div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function ComingSoon({ view }: { view: string }) {
  return (
    <div className="text-center">
      <div className="text-6xl mb-4">🔬</div>
      <div className="font-display text-2xl font-bold text-white/30 uppercase tracking-widest">{view}</div>
      <div className="text-sm text-white/20 mt-2 font-mono">Módulo en desarrollo — Próximamente</div>
    </div>
  );
}
