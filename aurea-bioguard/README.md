# 🛡️ Aurea BioGuard

**Centro de Comando de Inteligencia Ecológica Global**

Una plataforma de monitoreo de biodiversidad en tiempo real que identifica especies, predice riesgos ecológicos y genera alertas preventivas mediante inteligencia artificial.

> Aurea BioGuard no es una enciclopedia de la naturaleza. Es un **Oráculo Ecológico**.

---

## ✨ Características

### 🗺️ Bio-Radar Predictivo
- Mapa interactivo en tiempo real con animaciones de migración
- Zonas de calor de riesgo ecológico
- Sweep de radar con detección de anomalías
- Capas filtrables: riesgo, migración, temperatura

### 🔬 Escáner Neuronal
- Identificación de especies por imagen (drag & drop)
- Soporte para audio (cantos de aves, insectos)
- Animación de escaneo láser con Framer Motion
- Resultados con score de rareza y notas de análisis

### 🧬 Simulador de Ecosistema
- Sliders para temperatura, cobertura forestal, hídrica y contaminación
- Proyección de impacto a 5 años por especie
- Sparklines animados de riesgo proyectado
- Resumen automático de acción preventiva

### 📡 Feed de Alertas en Vivo
- Ticker de alertas críticas en tiempo real
- Feed lateral con nuevos eventos cada 5 segundos
- Sistema de clasificación por severidad

---

## 🚀 Inicio Rápido

### Requisitos
- Node.js 18+
- npm o yarn

### Instalación

```bash
# Clonar el repositorio
git clone https://github.com/tuusuario/aurea-bioguard.git
cd aurea-bioguard

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000) en el navegador.

### Build para producción

```bash
npm run build
npm start
```

---

## 🏗️ Stack Tecnológico

| Capa | Tecnología |
|------|-----------|
| Framework | Next.js 14 (App Router) |
| Estilos | Tailwind CSS |
| Animaciones | Framer Motion |
| Iconos | Lucide React |
| Tipografía | Space Grotesk + JetBrains Mono + DM Sans |
| Mapas | SVG animado con WebGL ready |

---

## 📁 Estructura del Proyecto

```
aurea-bioguard/
├── app/
│   ├── globals.css          # Estilos globales + efectos bioluminiscentes
│   ├── layout.tsx           # Root layout con metadatos
│   ├── page.tsx             # Redirect a /dashboard
│   └── dashboard/
│       └── page.tsx         # Página del dashboard
├── components/
│   └── dashboard/
│       ├── AureaDashboard.tsx      # Componente principal
│       ├── Sidebar.tsx             # Navegación lateral colapsable
│       ├── BioRadarMap.tsx         # Mapa SVG animado predictivo
│       ├── RiskPanel.tsx           # Panel de riesgo con anillo de score
│       ├── LiveFeed.tsx            # Feed en tiempo real
│       ├── AlertsTicker.tsx        # Ticker de alertas inferior
│       ├── StatsBar.tsx            # Barra de estadísticas en vivo
│       ├── NeuralScanner.tsx       # Modal de escáner de IA
│       └── EcosystemSimulator.tsx  # Simulador con sliders
├── tailwind.config.ts
├── next.config.mjs
└── tsconfig.json
```

---

## 🎨 Sistema de Diseño "Bioluminescent Dark-Glass"

### Paleta de Colores
```css
--bio-green:  #00FF87  /* Especies seguras, estado activo */
--bio-cyan:   #00E5FF  /* Datos en monitoreo */
--bio-amber:  #FF8C00  /* Alertas medias */
--bio-red:    #FF3B3B  /* Alertas críticas */
--bio-purple: #8B5CF6  /* Predicciones especiales */
```

### Efectos Visuales
- **Glassmorphism**: `backdrop-blur-xl` + `bg-white/5` + `border-white/10`
- **Glow**: `box-shadow: 0 0 20px rgba(0,255,135,0.4)`
- **Grid Background**: Líneas verdes 3% de opacidad cada 40px
- **Scan Line**: Animación CSS de barrido vertical
- **Radar Sweep**: `conic-gradient` con rotación continua

---

## 🗺️ Roadmap

- [ ] Integración con Mapbox GL JS (mapa real)
- [ ] API FastAPI + PyTorch para identificación real
- [ ] Autenticación con Clerk
- [ ] Pagos con Stripe (Free / Pro / Enterprise)
- [ ] WebSockets para actualizaciones en tiempo real
- [ ] Generador de Bio-Cards PNG compartibles
- [ ] Sistema de referidos con créditos de IA
- [ ] Leaderboard global de validaciones

---

## 🤝 Contribuir

Las contribuciones son bienvenidas. Para cambios importantes, abre primero un issue.

---

## 📜 Licencia

MIT © 2024 Aurea BioGuard

---

<div align="center">
  <strong>Construido para superar a iNaturalist, eBird y GBIF.</strong><br>
  No somos una biblioteca. Somos el Sistema Operativo de la Naturaleza.
</div>
