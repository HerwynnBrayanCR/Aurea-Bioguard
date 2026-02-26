"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface FeedItem {
  id: number;
  type: "sighting" | "alert" | "prediction" | "validation";
  text: string;
  location: string;
  time: string;
  color: string;
  icon: string;
}

const initialFeed: FeedItem[] = [
  { id: 1, type: "alert", text: "Mariposa Monarca: desvío 340km", location: "Texas → México", time: "ahora", color: "#FF8C00", icon: "⚠️" },
  { id: 2, type: "sighting", text: "Tapir Amazónico confirmado", location: "AM-7G, Brasil", time: "2m", color: "#00FF87", icon: "✅" },
  { id: 3, type: "prediction", text: "Riesgo de desplazamiento: 87%", location: "Jaguar — Sector 4B", time: "5m", color: "#FF3B3B", icon: "🔴" },
  { id: 4, type: "validation", text: "Dr. López validó Harpia harpyja", location: "UNAM — coord. 4.1N", time: "8m", color: "#00E5FF", icon: "🔬" },
  { id: 5, type: "sighting", text: "Águila Arpía detectada x IA", location: "Orinoco Delta", time: "11m", color: "#00FF87", icon: "📸" },
  { id: 6, type: "alert", text: "pH anómalo en río Tapajós", location: "Zona A-12, Pará", time: "15m", color: "#FF8C00", icon: "⚠️" },
  { id: 7, type: "prediction", text: "Expansión invasora: 68% prob.", location: "Melanotus sp — Sur", time: "19m", color: "#8B5CF6", icon: "🧬" },
];

const newItems: Omit<FeedItem, "id">[] = [
  { type: "sighting", text: "Nutria Gigante avistada", location: "Amazonas Central", time: "ahora", color: "#00FF87", icon: "📸" },
  { type: "alert", text: "Tala ilegal detectada", location: "Coord. 3.2S — AM", time: "ahora", color: "#FF3B3B", icon: "🚨" },
  { type: "validation", text: "Nuevo registro validado", location: "Puma yagouaroundi", time: "ahora", color: "#00E5FF", icon: "🔬" },
  { type: "prediction", text: "Lluvia ácida: riesgo medio", location: "Andes Sector N-8", time: "ahora", color: "#FF8C00", icon: "⚠️" },
];

export default function LiveFeed() {
  const [items, setItems] = useState(initialFeed);
  const [counter, setCounter] = useState(initialFeed.length + 1);

  useEffect(() => {
    const id = setInterval(() => {
      const newItem = newItems[Math.floor(Math.random() * newItems.length)];
      setItems(prev => [{ ...newItem, id: counter }, ...prev.slice(0, 9)]);
      setCounter(c => c + 1);
    }, 5000);
    return () => clearInterval(id);
  }, [counter]);

  return (
    <div className="flex-1 overflow-hidden flex flex-col p-4">
      <div className="flex items-center justify-between mb-3 flex-shrink-0">
        <h3 className="font-display font-semibold text-sm uppercase tracking-widest text-white/50">
          Feed en Vivo
        </h3>
        <div className="text-xs font-mono text-white/25">{items.length} eventos</div>
      </div>

      <div className="overflow-y-auto flex-1 space-y-2 pr-1">
        <AnimatePresence initial={false}>
          {items.map((item) => (
            <motion.div
              key={item.id}
              className="glass-light rounded-xl p-3 flex gap-3 items-start hover:border-white/10 transition-all cursor-pointer"
              initial={{ opacity: 0, x: 20, height: 0 }}
              animate={{ opacity: 1, x: 0, height: "auto" }}
              exit={{ opacity: 0, x: -20, height: 0 }}
              transition={{ duration: 0.3 }}
              layout
            >
              <span className="text-sm flex-shrink-0 mt-0.5">{item.icon}</span>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-medium text-white/80 truncate">{item.text}</div>
                <div className="text-xs text-white/30 font-mono truncate mt-0.5">{item.location}</div>
              </div>
              <div className="text-xs font-mono flex-shrink-0" style={{ color: item.color }}>
                {item.time}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
