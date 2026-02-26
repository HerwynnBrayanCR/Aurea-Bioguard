"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface HotSpot {
  id: number;
  x: number;
  y: number;
  label: string;
  species: string;
  risk: number;
  color: string;
  size: number;
  pulseDelay: number;
}

const hotspots: HotSpot[] = [
  { id: 1, x: 30, y: 45, label: "Amazonas", species: "Panthera onca", risk: 87, color: "#FF8C00", size: 18, pulseDelay: 0 },
  { id: 2, x: 55, y: 38, label: "Cerrado", species: "Chrysocyon brachyurus", risk: 62, color: "#00E5FF", size: 14, pulseDelay: 0.8 },
  { id: 3, x: 42, y: 60, label: "Pantanal", species: "Pteronura brasiliensis", risk: 45, color: "#00FF87", size: 12, pulseDelay: 1.5 },
  { id: 4, x: 68, y: 25, label: "Atlántico", species: "Morpho menelaus", risk: 34, color: "#00E5FF", size: 10, pulseDelay: 2.1 },
  { id: 5, x: 22, y: 65, label: "Andes", species: "Tremarctos ornatus", risk: 79, color: "#FF3B3B", size: 16, pulseDelay: 0.4 },
  { id: 6, x: 75, y: 55, label: "Pampas", species: "Lycalopex gymnocercus", risk: 28, color: "#00FF87", size: 9, pulseDelay: 1.8 },
  { id: 7, x: 15, y: 30, label: "Caribe", species: "Dermochelys coriacea", risk: 71, color: "#FF8C00", size: 13, pulseDelay: 3.0 },
  { id: 8, x: 62, y: 72, label: "Patagonia", species: "Puma concolor", risk: 41, color: "#8B5CF6", size: 11, pulseDelay: 2.5 },
];

interface MigrationPath {
  d: string;
  color: string;
  label: string;
  progress: number;
}

const migrationPaths: MigrationPath[] = [
  { d: "M 30 45 Q 45 30 55 38", color: "#FF8C00", label: "Jaguar →", progress: 0 },
  { d: "M 22 65 Q 35 55 42 60", color: "#FF3B3B", label: "Oso →", progress: 0 },
  { d: "M 68 25 Q 60 35 55 38", color: "#00E5FF", label: "Morpho →", progress: 0 },
];

export default function BioRadarMap() {
  const [selectedSpot, setSelectedSpot] = useState<HotSpot | null>(null);
  const [scanY, setScanY] = useState(0);
  const [radarAngle, setRadarAngle] = useState(0);
  const [activeLayer, setActiveLayer] = useState<"all" | "risk" | "migration" | "temp">("all");
  const [time, setTime] = useState(0);

  useEffect(() => {
    let frame: number;
    let start: number | null = null;
    const animate = (ts: number) => {
      if (!start) start = ts;
      const elapsed = (ts - start) / 1000;
      setScanY((elapsed % 4) / 4 * 100);
      setRadarAngle((elapsed * 30) % 360);
      setTime(elapsed);
      frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, []);

  const layers = [
    { id: "all", label: "TODOS" },
    { id: "risk", label: "RIESGO" },
    { id: "migration", label: "MIGRACIÓN" },
    { id: "temp", label: "TEMPERATURA" },
  ] as const;

  return (
    <div className="relative h-full w-full overflow-hidden bg-[#030A14]">
      {/* World map SVG background */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <radialGradient id="mapGlow" cx="40%" cy="50%">
            <stop offset="0%" stopColor="#00FF87" stopOpacity="0.06" />
            <stop offset="100%" stopColor="#030A14" stopOpacity="0" />
          </radialGradient>
          <filter id="blur">
            <feGaussianBlur stdDeviation="0.5" />
          </filter>
          <filter id="glow">
            <feGaussianBlur stdDeviation="1" result="coloredBlur"/>
            <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
          <linearGradient id="scanGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#00FF87" stopOpacity="0" />
            <stop offset="50%" stopColor="#00FF87" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#00FF87" stopOpacity="0" />
          </linearGradient>
          <clipPath id="mapClip">
            <rect x="0" y="0" width="100" height="100" />
          </clipPath>
        </defs>

        {/* Background */}
        <rect width="100" height="100" fill="#030A14" />
        <rect width="100" height="100" fill="url(#mapGlow)" />

        {/* Grid lines */}
        {[10,20,30,40,50,60,70,80,90].map(v => (
          <React.Fragment key={v}>
            <line x1={v} y1="0" x2={v} y2="100" stroke="#00FF87" strokeWidth="0.08" strokeOpacity="0.15" />
            <line x1="0" y1={v} x2="100" y2={v} stroke="#00FF87" strokeWidth="0.08" strokeOpacity="0.15" />
          </React.Fragment>
        ))}

        {/* Simplified continent shapes - South America focus */}
        {/* South America */}
        <path
          d="M 35 20 L 50 18 L 60 22 L 65 30 L 62 40 L 65 50 L 60 65 L 55 75 L 48 80 L 42 78 L 38 70 L 35 60 L 30 55 L 28 45 L 30 35 Z"
          fill="#0D2818"
          stroke="#00FF87"
          strokeWidth="0.3"
          strokeOpacity="0.3"
        />
        {/* Central America + Caribbean */}
        <path
          d="M 20 20 L 35 18 L 35 25 L 28 28 L 20 26 Z"
          fill="#0D2818"
          stroke="#00FF87"
          strokeWidth="0.2"
          strokeOpacity="0.2"
        />
        {/* North America fragment */}
        <path
          d="M 5 5 L 25 8 L 30 18 L 20 20 L 12 18 L 5 15 Z"
          fill="#0A1F14"
          stroke="#00FF87"
          strokeWidth="0.2"
          strokeOpacity="0.15"
        />
        {/* Africa fragment */}
        <path
          d="M 70 15 L 85 18 L 90 30 L 88 45 L 82 55 L 75 52 L 70 40 L 68 28 Z"
          fill="#0A1F14"
          stroke="#00FF87"
          strokeWidth="0.2"
          strokeOpacity="0.15"
        />
        {/* Europe */}
        <path
          d="M 70 5 L 82 6 L 85 14 L 78 16 L 70 14 Z"
          fill="#0A1F14"
          stroke="#00FF87"
          strokeWidth="0.15"
          strokeOpacity="0.1"
        />

        {/* Ocean current lines */}
        {[0, 0.3, 0.6].map((offset, i) => {
          const y = 35 + i * 15;
          const wave = Math.sin(time * 0.5 + offset * Math.PI * 2) * 2;
          return (
            <path
              key={i}
              d={`M 5 ${y + wave} Q 30 ${y + wave - 3} 65 ${y + wave + 2} T 95 ${y + wave}`}
              fill="none"
              stroke="#00E5FF"
              strokeWidth="0.15"
              strokeOpacity={0.08 + Math.sin(time + i) * 0.03}
              strokeDasharray="2 3"
            />
          );
        })}

        {/* Temperature heatmap overlay (conditionally shown) */}
        {(activeLayer === "all" || activeLayer === "temp") && (
          <>
            <ellipse cx="38" cy="48" rx="12" ry="10" fill="#FF3B3B" fillOpacity="0.07" filter="url(#blur)" />
            <ellipse cx="55" cy="38" rx="8" ry="6" fill="#FF8C00" fillOpacity="0.07" filter="url(#blur)" />
            <ellipse cx="42" cy="60" rx="6" ry="5" fill="#FF8C00" fillOpacity="0.05" filter="url(#blur)" />
          </>
        )}

        {/* Migration paths */}
        {(activeLayer === "all" || activeLayer === "migration") && migrationPaths.map((path, i) => (
          <g key={i}>
            <path
              d={path.d}
              fill="none"
              stroke={path.color}
              strokeWidth="0.3"
              strokeOpacity="0.3"
              strokeDasharray="1 1"
            />
            {/* Animated dot on path */}
            <circle r="0.8" fill={path.color} opacity="0.8" filter="url(#glow)">
              <animateMotion dur={`${3 + i}s`} repeatCount="indefinite" path={path.d} />
            </circle>
          </g>
        ))}

        {/* Radar sweep */}
        <g transform="translate(38, 48)">
          <path
            d={`M 0 0 L ${Math.cos((radarAngle - 90) * Math.PI / 180) * 60} ${Math.sin((radarAngle - 90) * Math.PI / 180) * 60}`}
            stroke="#00FF87"
            strokeWidth="0.5"
            strokeOpacity="0.4"
            filter="url(#glow)"
          />
          {/* Radar fade trail */}
          {[20, 40, 60, 80].map((offset, i) => {
            const angle = (radarAngle - offset - 90) * Math.PI / 180;
            return (
              <path
                key={i}
                d={`M 0 0 L ${Math.cos(angle) * 60} ${Math.sin(angle) * 60}`}
                stroke="#00FF87"
                strokeWidth={0.4 - i * 0.07}
                strokeOpacity={0.2 - i * 0.04}
              />
            );
          })}
        </g>

        {/* Scan line */}
        <rect
          x="0"
          y={scanY - 1}
          width="100"
          height="2"
          fill="url(#scanGrad)"
          clipPath="url(#mapClip)"
        />

        {/* Hotspots */}
        {hotspots.filter(h => activeLayer === "all" || activeLayer === "risk").map((spot) => (
          <g key={spot.id} onClick={() => setSelectedSpot(spot === selectedSpot ? null : spot)}
             style={{ cursor: "pointer" }}>
            {/* Pulse rings */}
            <circle
              cx={spot.x} cy={spot.y} r={spot.size / 2}
              fill="none"
              stroke={spot.color}
              strokeWidth="0.3"
              strokeOpacity="0.4"
            >
              <animate
                attributeName="r"
                values={`${spot.size / 4};${spot.size};${spot.size / 4}`}
                dur={`${2 + spot.pulseDelay}s`}
                repeatCount="indefinite"
              />
              <animate
                attributeName="opacity"
                values="0.6;0;0.6"
                dur={`${2 + spot.pulseDelay}s`}
                repeatCount="indefinite"
              />
            </circle>
            {/* Core dot */}
            <circle
              cx={spot.x} cy={spot.y} r={spot.size / 6}
              fill={spot.color}
              filter="url(#glow)"
              opacity={selectedSpot?.id === spot.id ? 1 : 0.8}
            />
          </g>
        ))}

        {/* Coordinate labels */}
        {hotspots.slice(0, 4).map((spot) => (
          <text
            key={spot.id + "label"}
            x={spot.x + spot.size / 5 + 1}
            y={spot.y + 0.8}
            fontSize="1.5"
            fill="#00FF87"
            fillOpacity="0.5"
            fontFamily="monospace"
          >
            {spot.label}
          </text>
        ))}

        {/* Corner coordinates */}
        <text x="1" y="4" fontSize="1.5" fill="#00FF87" fillOpacity="0.3" fontFamily="monospace">15°N</text>
        <text x="1" y="99" fontSize="1.5" fill="#00FF87" fillOpacity="0.3" fontFamily="monospace">55°S</text>
        <text x="85" y="4" fontSize="1.5" fill="#00FF87" fillOpacity="0.3" fontFamily="monospace">35°E</text>
        <text x="1" y="52" fontSize="1.5" fill="#00FF87" fillOpacity="0.3" fontFamily="monospace">80°W</text>
      </svg>

      {/* Top left info */}
      <div className="absolute top-4 left-4 z-10">
        <div className="glass rounded-2xl p-4 min-w-[200px]">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-bio-green animate-pulse" />
            <span className="text-xs font-mono text-bio-green tracking-widest uppercase">Bio-Radar Activo</span>
          </div>
          <div className="font-display text-xl font-bold">Sudamérica</div>
          <div className="text-xs text-white/40 font-mono mt-1">Cobertura: 100% — {hotspots.length} zonas</div>
        </div>
      </div>

      {/* Layer controls */}
      <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
        {layers.map((layer) => (
          <button
            key={layer.id}
            onClick={() => setActiveLayer(layer.id)}
            className={`text-xs font-mono px-3 py-1.5 rounded-lg border transition-all
              ${activeLayer === layer.id
                ? "bg-bio-green/20 border-bio-green/40 text-bio-green"
                : "bg-black/40 border-white/10 text-white/40 hover:border-white/20 hover:text-white/60"
              }`}
          >
            {layer.label}
          </button>
        ))}
      </div>

      {/* Selected spot info card */}
      <AnimatePresence>
        {selectedSpot && (
          <motion.div
            className="absolute bottom-4 left-4 z-20 glass rounded-2xl p-5 w-72"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="text-xs font-mono text-white/40 uppercase tracking-widest">{selectedSpot.label}</div>
                <div className="font-display font-bold text-lg">{selectedSpot.species}</div>
              </div>
              <button onClick={() => setSelectedSpot(null)} className="text-white/30 hover:text-white/60 text-lg">×</button>
            </div>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-white/40 font-mono">ÍNDICE DE RIESGO</span>
                  <span style={{ color: selectedSpot.color }} className="font-mono font-bold">{selectedSpot.risk}%</span>
                </div>
                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: selectedSpot.color }}
                    initial={{ width: 0 }}
                    animate={{ width: `${selectedSpot.risk}%` }}
                  />
                </div>
              </div>
              <div className="text-xs text-white/30 font-mono">
                Lat: {(selectedSpot.y - 50).toFixed(1)}° | Lon: {(selectedSpot.x - 50).toFixed(1)}°
              </div>
              <button
                className="w-full bg-bio-green/10 hover:bg-bio-green/20 border border-bio-green/20 rounded-xl py-2 text-xs font-mono text-bio-green transition-all"
              >
                VER ANÁLISIS COMPLETO →
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stats overlay bottom right */}
      <div className="absolute bottom-4 right-4 z-10 flex gap-2">
        {[
          { label: "ALERTAS", value: "7", color: "#FF3B3B" },
          { label: "ESPECIES", value: "247", color: "#00E5FF" },
          { label: "PRECISIÓN", value: "99.2%", color: "#00FF87" },
        ].map((stat) => (
          <div key={stat.label} className="glass rounded-xl px-3 py-2 text-center">
            <div className="text-lg font-mono font-bold" style={{ color: stat.color }}>{stat.value}</div>
            <div className="text-xs font-mono text-white/30">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
