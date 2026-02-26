"use client";

import React, { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ScanResult {
  species: string;
  scientific: string;
  confidence: number;
  status: string;
  ecosystem: string;
  riskScore: number;
  location: string;
  notes: string;
  emoji: string;
}

const mockResults: ScanResult[] = [
  {
    species: "Jaguar",
    scientific: "Panthera onca",
    confidence: 97.3,
    status: "Vulnerable",
    ecosystem: "Selva Tropical",
    riskScore: 78,
    location: "Cuenca Amazónica",
    notes: "Individuo adulto. Patrón de manchas único. Posible desplazamiento por presión antrópica.",
    emoji: "🐆",
  },
  {
    species: "Guacamayo Escarlata",
    scientific: "Ara macao",
    confidence: 99.1,
    status: "Preocupación menor",
    ecosystem: "Bosque Tropical",
    riskScore: 32,
    location: "Mesoamérica",
    notes: "Espécimen sano. Plumaje en óptimas condiciones. Migratorio estacional.",
    emoji: "🦜",
  },
  {
    species: "Oso de Anteojos",
    scientific: "Tremarctos ornatus",
    confidence: 94.7,
    status: "Vulnerable",
    ecosystem: "Páramo Andino",
    riskScore: 79,
    location: "Andes Tropicales",
    notes: "Especie endémica de los Andes. Hábitat fragmentado. Monitoreo urgente recomendado.",
    emoji: "🐻",
  },
];

type ScanPhase = "idle" | "uploading" | "scanning" | "analyzing" | "complete";

export default function NeuralScanner({ onClose }: { onClose: () => void }) {
  const [phase, setPhase] = useState<ScanPhase>("idle");
  const [result, setResult] = useState<ScanResult | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const runScan = useCallback(() => {
    setPhase("uploading");
    setTimeout(() => setPhase("scanning"), 800);
    setTimeout(() => setPhase("analyzing"), 2000);
    setTimeout(() => {
      const r = mockResults[Math.floor(Math.random() * mockResults.length)];
      setResult(r);
      setPhase("complete");
    }, 3500);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setUploadedFile(url);
      runScan();
    }
  }, [runScan]);

  const handleFile = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setUploadedFile(url);
      runScan();
    }
  }, [runScan]);

  const reset = () => {
    setPhase("idle");
    setResult(null);
    setUploadedFile(null);
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Backdrop */}
      <motion.div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      />

      {/* Modal */}
      <motion.div
        className="relative glass rounded-3xl w-full max-w-2xl overflow-hidden"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div>
            <h2 className="font-display font-bold text-xl bg-gradient-to-r from-bio-green to-bio-cyan bg-clip-text text-transparent">
              Escáner Neuronal
            </h2>
            <p className="text-xs text-white/40 font-mono mt-0.5">Identificación multimodal por IA · Visión + Audio + GPS</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/50 hover:text-white transition-all">×</button>
        </div>

        <div className="p-6">
          <AnimatePresence mode="wait">
            {phase === "idle" && (
              <motion.div
                key="idle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {/* Dropzone */}
                <div
                  className={`relative border-2 border-dashed rounded-2xl p-12 text-center transition-all cursor-pointer
                    ${dragOver ? "border-bio-green bg-bio-green/5" : "border-white/10 hover:border-bio-green/40 hover:bg-bio-green/5"}`}
                  onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={handleDrop}
                  onClick={() => fileRef.current?.click()}
                >
                  <input ref={fileRef} type="file" accept="image/*,audio/*" className="hidden" onChange={handleFile} />

                  <div className={`text-5xl mb-4 transition-all ${dragOver ? "scale-110" : ""}`}>
                    {dragOver ? "🎯" : "🔬"}
                  </div>
                  <div className="font-display font-semibold text-lg mb-2">
                    {dragOver ? "¡Suelta para analizar!" : "Arrastra tu imagen o audio aquí"}
                  </div>
                  <div className="text-sm text-white/40 font-mono">JPG, PNG, MP3, WAV · Identificación en 3 segundos</div>

                  <div className="absolute inset-0 rounded-2xl pointer-events-none">
                    {[0, 1, 2].map(i => (
                      <motion.div
                        key={i}
                        className="absolute inset-0 rounded-2xl border border-bio-green/20"
                        animate={{ scale: [1, 1.02, 1], opacity: [0.3, 0.1, 0.3] }}
                        transition={{ duration: 3, delay: i * 1, repeat: Infinity }}
                      />
                    ))}
                  </div>
                </div>

                {/* Demo button */}
                <button
                  onClick={() => { setUploadedFile(null); runScan(); }}
                  className="mt-4 w-full bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl py-3 text-sm font-mono text-white/50 hover:text-white/80 transition-all"
                >
                  ▶ Ejecutar análisis de demostración
                </button>
              </motion.div>
            )}

            {(phase === "uploading" || phase === "scanning" || phase === "analyzing") && (
              <motion.div
                key="scanning"
                className="text-center py-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {/* Scan animation */}
                <div className="relative w-48 h-48 mx-auto mb-8">
                  {/* Outer rings */}
                  {[0, 1, 2].map(i => (
                    <motion.div
                      key={i}
                      className="absolute inset-0 rounded-full border border-bio-green/30"
                      animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
                      transition={{ duration: 2, delay: i * 0.6, repeat: Infinity }}
                    />
                  ))}

                  {/* Radar sweep */}
                  <div className="absolute inset-0 rounded-full overflow-hidden">
                    <motion.div
                      className="absolute inset-0 rounded-full"
                      style={{
                        background: "conic-gradient(from 0deg, transparent 80%, rgba(0,255,135,0.3) 100%)",
                      }}
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    />
                  </div>

                  {/* Center icon */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-4xl">{uploadedFile ? "🖼️" : "🤖"}</div>
                  </div>

                  {/* Scan line */}
                  <motion.div
                    className="absolute left-0 right-0 h-0.5 bg-bio-green/60"
                    style={{ boxShadow: "0 0 10px #00FF87" }}
                    animate={{ top: ["0%", "100%", "0%"] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  />
                </div>

                {/* Phase text */}
                <motion.div
                  className="font-mono text-sm text-bio-green"
                  key={phase}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {phase === "uploading" && "// Procesando archivo..."}
                  {phase === "scanning" && "// Escaneando patrones neuronales..."}
                  {phase === "analyzing" && "// Consultando base de datos vectorial..."}
                </motion.div>

                {/* Progress steps */}
                <div className="flex justify-center gap-3 mt-6">
                  {["Ingesta", "Visión IA", "Contexto", "Predicción"].map((step, i) => (
                    <div key={step} className="flex flex-col items-center gap-1">
                      <motion.div
                        className="w-2 h-2 rounded-full"
                        animate={{
                          backgroundColor: i < (phase === "uploading" ? 1 : phase === "scanning" ? 2 : 3)
                            ? "#00FF87" : "rgba(255,255,255,0.1)",
                          boxShadow: i < (phase === "uploading" ? 1 : phase === "scanning" ? 2 : 3)
                            ? "0 0 8px #00FF87" : "none",
                        }}
                      />
                      <span className="text-xs font-mono text-white/25">{step}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {phase === "complete" && result && (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {/* Result header */}
                <div className="flex items-start gap-5 mb-6">
                  <div className="text-6xl">{result.emoji}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="font-display font-bold text-2xl">{result.species}</span>
                      <span className="bg-bio-green/10 text-bio-green text-xs font-mono px-2 py-0.5 rounded-full border border-bio-green/20">
                        {result.confidence}% confianza
                      </span>
                    </div>
                    <div className="font-mono text-sm italic text-white/40">{result.scientific}</div>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs bg-bio-amber/10 text-bio-amber border border-bio-amber/20 rounded px-2 py-0.5 font-mono">{result.status}</span>
                      <span className="text-xs text-white/30 font-mono">· {result.ecosystem}</span>
                    </div>
                  </div>
                </div>

                {/* Metrics grid */}
                <div className="grid grid-cols-3 gap-3 mb-5">
                  {[
                    { label: "Riesgo", value: `${result.riskScore}%`, color: result.riskScore > 60 ? "#FF3B3B" : "#00FF87" },
                    { label: "Ecosistema", value: result.ecosystem.split(" ")[0], color: "#00E5FF" },
                    { label: "Ubicación", value: result.location.split(" ")[0], color: "#8B5CF6" },
                  ].map(m => (
                    <div key={m.label} className="glass-light rounded-xl p-3 text-center">
                      <div className="text-xs text-white/30 font-mono mb-1">{m.label}</div>
                      <div className="text-sm font-bold font-mono" style={{ color: m.color }}>{m.value}</div>
                    </div>
                  ))}
                </div>

                {/* Notes */}
                <div className="glass-light rounded-xl p-4 mb-5">
                  <div className="text-xs text-white/40 font-mono mb-2 uppercase tracking-wider">Análisis Neural</div>
                  <div className="text-sm text-white/70">{result.notes}</div>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <button className="flex-1 bg-bio-green/10 hover:bg-bio-green/20 border border-bio-green/30 text-bio-green rounded-xl py-3 text-sm font-mono font-medium transition-all">
                    📍 Guardar Registro
                  </button>
                  <button className="flex-1 bg-bio-cyan/10 hover:bg-bio-cyan/20 border border-bio-cyan/30 text-bio-cyan rounded-xl py-3 text-sm font-mono font-medium transition-all">
                    📤 Generar Bio-Card
                  </button>
                  <button onClick={reset} className="px-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm font-mono text-white/50 transition-all">
                    ↺
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
}
