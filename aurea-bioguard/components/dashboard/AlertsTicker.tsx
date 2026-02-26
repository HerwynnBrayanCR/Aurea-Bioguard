"use client";

import React from "react";

const alerts = [
  "🔴 CRÍTICO — Incendio detectado en Amazonas occidental · 3 especies en zona de impacto",
  "⚠️ ALTO — Mariposa Monarca: desvío 340km de ruta histórica · Prob. desorientación: 85%",
  "🟡 MEDIO — Melanotus sp. detectada en 3 nuevas coordenadas fuera de rango natural",
  "🔵 INFO — Registro de Puma yagouaroundi confirmado por Dr. María López · UNAM",
  "⚠️ ALTO — pH anómalo en río Tapajós · afecta zonas de desove del Arapaima gigas",
  "🔴 CRÍTICO — Patrones de deforestación acelerada detectados · Sector 7G · Pará, Brasil",
  "✅ VALIDADO — Nueva especie de orquídea catalogada · Andes Ecuatorianos · Coord. 0.4S",
  "⚠️ PREDICCIÓN — Jaguar: riesgo de desplazamiento 87% · Próximas 72h · Cuenca Amazónica",
];

export default function AlertsTicker() {
  const doubled = [...alerts, ...alerts]; // Double for seamless loop

  return (
    <div className="flex-shrink-0 border-t border-white/5 bg-black/40 backdrop-blur overflow-hidden">
      <div className="flex items-center">
        {/* Label */}
        <div className="flex-shrink-0 bg-bio-red/90 px-3 py-2 text-xs font-mono font-bold text-white tracking-widest uppercase z-10">
          ALERTAS
        </div>

        {/* Ticker */}
        <div className="flex-1 overflow-hidden relative">
          <div className="ticker-inner py-2">
            {doubled.map((alert, i) => (
              <span key={i} className="text-xs font-mono text-white/50 px-8">
                {alert}
              </span>
            ))}
          </div>
          {/* Fade edges */}
          <div className="absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-black/60 to-transparent pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-black/60 to-transparent pointer-events-none" />
        </div>
      </div>
    </div>
  );
}
