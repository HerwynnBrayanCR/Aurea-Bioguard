"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface SimParam {
  id: string;
  label: string;
  unit: string;
  min: number;
  max: number;
  default: number;
  step: number;
  color: string;
  icon: string;
}

const params: SimParam[] = [
  { id: "temp", label: "Temperatura", unit: "°C", min: -2, max: 6, default: 0, step: 0.5, color: "#FF8C00", icon: "🌡️" },
  { id: "forest", label: "Cobertura Forestal", unit: "%", min: -80, max: 20, default: 0, step: 5, color: "#00FF87", icon: "🌳" },
  { id: "water", label: "Disponibilidad Hídrica", unit: "%", min: -60, max: 20, default: 0, step: 5, color: "#00E5FF", icon: "💧" },
  { id: "pollution", label: "Contaminación", unit: "%", min: 0, max: 100, default: 20, step: 5, color: "#FF3B3B", icon: "🏭" },
];

interface SimResult {
  species: string;
  emoji: string;
  currentRisk: number;
  projectedRisk: number;
  status: string;
  years: number[];
  risks: number[];
}

function calculateResults(values: Record<string, number>): SimResult[] {
  const tempDelta = values["temp"];
  const forestDelta = values["forest"];
  const waterDelta = values["water"];
  const pollDelta = values["pollution"];

  const pressure = (tempDelta * 8) + ((-forestDelta) * 0.4) + ((-waterDelta) * 0.3) + (pollDelta * 0.3);

  return [
    { species: "Panthera onca", emoji: "🐆", currentRisk: 67, projectedRisk: Math.min(99, 67 + pressure * 1.2), status: "Vulnerable", years: [0,1,2,3,4,5], risks: [67, 67 + pressure*0.2, 67+pressure*0.4, 67+pressure*0.7, 67+pressure*0.9, Math.min(99, 67+pressure*1.2)] },
    { species: "Ara macao", emoji: "🦜", currentRisk: 22, projectedRisk: Math.max(0, Math.min(90, 22 + pressure * 0.7)), status: "LC", years: [0,1,2,3,4,5], risks: [22, 22+pressure*0.1, 22+pressure*0.2, 22+pressure*0.4, 22+pressure*0.6, Math.max(0,Math.min(90,22+pressure*0.7))] },
    { species: "Tremarctos ornatus", emoji: "🐻", currentRisk: 74, projectedRisk: Math.min(99, 74 + pressure * 1.0), status: "Vulnerable", years: [0,1,2,3,4,5], risks: [74, 74+pressure*0.15, 74+pressure*0.3, 74+pressure*0.6, 74+pressure*0.8, Math.min(99,74+pressure)] },
    { species: "Pteronura brasiliensis", emoji: "🦦", currentRisk: 58, projectedRisk: Math.min(99, 58 + pressure * 0.9 + (-waterDelta)*0.5), status: "EN", years: [0,1,2,3,4,5], risks: [58, 58+pressure*0.15, 58+pressure*0.3, 58+pressure*0.55, 58+pressure*0.75, Math.min(99,58+pressure*0.9)] },
  ].map(r => ({
    ...r,
    projectedRisk: Math.round(r.projectedRisk * 10) / 10,
    risks: r.risks.map(v => Math.round(Math.max(0, Math.min(99, v)) * 10) / 10),
  }));
}

export default function EcosystemSimulator({ onClose }: { onClose: () => void }) {
  const [values, setValues] = useState<Record<string, number>>({
    temp: 0, forest: 0, water: 0, pollution: 20,
  });
  const [results, setResults] = useState<SimResult[]>(calculateResults({ temp: 0, forest: 0, water: 0, pollution: 20 }));
  const [simRun, setSimRun] = useState(false);
  const [running, setRunning] = useState(false);

  const runSimulation = () => {
    setRunning(true);
    setTimeout(() => {
      setResults(calculateResults(values));
      setSimRun(true);
      setRunning(false);
    }, 1500);
  };

  const getColor = (risk: number) =>
    risk > 75 ? "#FF3B3B" : risk > 55 ? "#FF8C00" : risk > 35 ? "#00E5FF" : "#00FF87";

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      <motion.div
        className="relative glass rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10 flex-shrink-0">
          <div>
            <h2 className="font-display font-bold text-xl bg-gradient-to-r from-bio-cyan to-bio-purple bg-clip-text text-transparent">
              Simulador de Ecosistema
            </h2>
            <p className="text-xs text-white/40 font-mono mt-0.5">Proyección de impacto · Horizonte 5 años · Actualizado en tiempo real</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/50 hover:text-white transition-all">×</button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Controls */}
          <div className="w-72 border-r border-white/5 p-6 flex flex-col gap-6 overflow-y-auto flex-shrink-0">
            <div className="text-xs font-mono text-white/40 uppercase tracking-widest">Parámetros de Simulación</div>

            {params.map(param => (
              <div key={param.id}>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-mono text-white/50 flex items-center gap-1.5">
                    <span>{param.icon}</span>{param.label}
                  </span>
                  <span className="text-sm font-mono font-bold" style={{ color: param.color }}>
                    {values[param.id] > 0 ? "+" : ""}{values[param.id]}{param.unit}
                  </span>
                </div>
                <input
                  type="range"
                  min={param.min}
                  max={param.max}
                  step={param.step}
                  value={values[param.id]}
                  onChange={e => setValues(v => ({ ...v, [param.id]: parseFloat(e.target.value) }))}
                  className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, ${param.color} 0%, ${param.color} ${((values[param.id] - param.min) / (param.max - param.min)) * 100}%, rgba(255,255,255,0.1) ${((values[param.id] - param.min) / (param.max - param.min)) * 100}%, rgba(255,255,255,0.1) 100%)`,
                  }}
                />
                <div className="flex justify-between text-xs font-mono text-white/20 mt-1">
                  <span>{param.min}{param.unit}</span>
                  <span>{param.max}{param.unit}</span>
                </div>
              </div>
            ))}

            <motion.button
              onClick={runSimulation}
              disabled={running}
              className="w-full bg-bio-cyan/10 hover:bg-bio-cyan/20 border border-bio-cyan/30 text-bio-cyan rounded-xl py-3 text-sm font-mono font-bold transition-all disabled:opacity-50"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {running ? "Simulando..." : "▶ SIMULAR"}
            </motion.button>

            <button
              onClick={() => { setValues({ temp: 0, forest: 0, water: 0, pollution: 20 }); setSimRun(false); }}
              className="w-full bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl py-2 text-xs font-mono text-white/40 hover:text-white/60 transition-all"
            >
              Resetear parámetros
            </button>
          </div>

          {/* Results */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="text-xs font-mono text-white/40 uppercase tracking-widest mb-5">
              Impacto Proyectado — 5 Años
            </div>

            <AnimatePresence mode="wait">
              {running && (
                <motion.div
                  key="running"
                  className="flex items-center justify-center h-48"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div className="text-center">
                    <motion.div
                      className="text-4xl mb-3"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >⚙️</motion.div>
                    <div className="text-sm font-mono text-bio-cyan">Calculando modelos predictivos...</div>
                  </div>
                </motion.div>
              )}

              {!running && (
                <motion.div
                  key="results"
                  className="space-y-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  {results.map((r, i) => {
                    const delta = r.projectedRisk - r.currentRisk;
                    const worse = delta > 0;
                    return (
                      <motion.div
                        key={r.species}
                        className="glass-light rounded-2xl p-5"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.08 }}
                      >
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{r.emoji}</span>
                            <div>
                              <div className="font-mono text-xs italic text-white/40">{r.species}</div>
                              <div className="font-display font-semibold">{r.species.split(" ")[1] || r.species}</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-white/30 font-mono">{r.currentRisk}%</span>
                              <span className="text-white/30">→</span>
                              <span className="text-lg font-mono font-bold" style={{ color: getColor(r.projectedRisk) }}>
                                {r.projectedRisk.toFixed(1)}%
                              </span>
                            </div>
                            <div className={`text-xs font-mono ${worse ? "text-bio-red" : "text-bio-green"}`}>
                              {worse ? "▲" : "▼"} {Math.abs(delta).toFixed(1)}% en 5 años
                            </div>
                          </div>
                        </div>

                        {/* Mini sparkline */}
                        <div className="relative h-10">
                          <svg className="w-full h-full" viewBox={`0 0 100 40`} preserveAspectRatio="none">
                            <polyline
                              points={r.risks.map((v, j) => `${j * 20},${40 - v * 0.4}`).join(" ")}
                              fill="none"
                              stroke={getColor(r.projectedRisk)}
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              style={{ filter: `drop-shadow(0 0 3px ${getColor(r.projectedRisk)})` }}
                            />
                            {r.risks.map((v, j) => (
                              <circle key={j} cx={j * 20} cy={40 - v * 0.4} r="2" fill={getColor(r.projectedRisk)} />
                            ))}
                          </svg>
                          <div className="absolute bottom-0 left-0 right-0 flex justify-between">
                            {["Hoy", "1a", "2a", "3a", "4a", "5a"].map(y => (
                              <span key={y} className="text-xs font-mono text-white/20">{y}</span>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}

                  {simRun && (
                    <motion.div
                      className="glass-light rounded-2xl p-5 border border-bio-cyan/20"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.4 }}
                    >
                      <div className="text-xs font-mono text-bio-cyan mb-2 uppercase tracking-wider">Resumen de Simulación</div>
                      <div className="text-sm text-white/60">
                        Con los parámetros actuales, el índice de riesgo promedio aumentará{" "}
                        <span className="text-bio-red font-bold">
                          +{(results.reduce((a, r) => a + (r.projectedRisk - r.currentRisk), 0) / results.length).toFixed(1)}%
                        </span>{" "}
                        en 5 años. Se recomienda acción preventiva inmediata en zonas de alta presión.
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
