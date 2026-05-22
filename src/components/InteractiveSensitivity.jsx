import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link as LinkIcon, ChevronDown, CheckCircle2, XCircle, Plus, Activity } from 'lucide-react';

const CARDS = [
  {
    id: 0,
    title: "Análisis sensibilidad. Cambio en coeficiente variable Básica.",
  },
  {
    id: 1,
    title: "Análisis sensibilidad. Cambio en coeficiente variable no Básica.",
  },
  {
    id: 2,
    title: "Análisis de sensibilidad - Cambio en disponibilidad de recursos (Bj)",
  },
  {
    id: 3,
    title: "Análisis de sensibilidad - Inclusión de una nueva variable o nuevo producto.",
  }
];

function getInitialAij(solution) {
  if (solution && solution.result && solution.result.sensitivity) {
    return Array(solution.result.sensitivity.rhsSensitivity.length).fill('');
  }
  return [];
}

export default function InteractiveSensitivity({ solution, type }) {
  const [activeCard, setActiveCard] = useState(0);
  const [selectedItems, setSelectedItems] = useState({ 0: '', 1: '', 2: '', 3: '' });
  const [newVarCj, setNewVarCj] = useState('');
  const [newVarAij, setNewVarAij] = useState(() => getInitialAij(solution));

  const setSelectedItem = useCallback((card, value) => {
    setSelectedItems(prev => ({ ...prev, [card]: value }));
  }, []);

  const handleCardChange = useCallback((idx) => {
    setActiveCard(idx);
  }, []);

  const handleNext = useCallback(() => setActiveCard((prev) => (prev + 1) % CARDS.length), []);
  const handlePrev = useCallback(() => setActiveCard((prev) => (prev - 1 + CARDS.length) % CARDS.length), []);

  if (!solution || !solution.result || !solution.result.sensitivity) return null;

  const lastTableau = solution.tableaus[solution.tableaus.length - 1];
  const basicVarNames = lastTableau.basis.map(idx => lastTableau.headers[idx]);

  const basicVars = solution.result.sensitivity.objSensitivity.filter(s => basicVarNames.includes(s.variable));
  const nonBasicVars = solution.result.sensitivity.objSensitivity.filter(s => !basicVarNames.includes(s.variable));
  const resources = solution.result.sensitivity.rhsSensitivity;

  const selectedItem = selectedItems[activeCard];

  const getActiveItemData = () => {
    if (activeCard === 0) return basicVars.find(v => v.variable === selectedItem);
    if (activeCard === 1) return nonBasicVars.find(v => v.variable === selectedItem);
    if (activeCard === 2) return resources.find(v => v.constraint === selectedItem);
    return null;
  };

  const activeData = getActiveItemData();

  const renderCardContent = (index) => {
    const isActive = index === activeCard;
    const offset = index - activeCard;
    const absOffset = Math.abs(offset);
    if (absOffset > 1) return null;

    return (
      <motion.div
        key={CARDS[index].id}
        onClick={() => handleCardChange(index)}
        initial={false}
        animate={{
          scale: isActive ? 1 : 0.78,
          opacity: isActive ? 1 : 0.35,
          rotateY: isActive ? 0 : offset * -28,
          x: isActive ? 0 : offset * 220,
          zIndex: isActive ? 10 : 0,
        }}
        transition={{ type: "spring", stiffness: 260, damping: 32 }}
        className={`absolute top-0 left-0 w-full h-full p-6 md:p-8 rounded-[2rem] border cursor-pointer flex flex-col justify-center gap-4 shadow-2xl ${
          isActive
            ? 'bg-gradient-to-br from-white/10 to-white/5 border-white/20'
            : 'bg-white/5 border-white/5'
        }`}
        style={{ transformStyle: 'preserve-3d', perspective: 1000 }}
      >
        <div className="flex items-start gap-4">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 mt-1 ${isActive ? 'bg-primary/20 text-primary' : 'bg-white/10 text-slate-500'}`}>
            <LinkIcon className="w-6 h-6" />
          </div>
          <h3 className={`text-base md:text-lg font-bold leading-snug ${isActive ? 'text-white' : 'text-slate-500'}`}>
            {CARDS[index].title}
          </h3>
        </div>
        {isActive && (
          <div className="flex justify-end">
            <span className="text-slate-500 flex items-center gap-1 text-xs font-black uppercase tracking-widest">
              Seleccionado <ChevronDown className="w-3 h-3" />
            </span>
          </div>
        )}
      </motion.div>
    );
  };

  const renderCase1and2 = (dataList, labelType) => (
    <div className="space-y-6">
      <div className="flex gap-3 overflow-x-auto pb-2">
        {dataList.length === 0 ? (
          <span className="text-slate-500 italic text-sm px-2">No hay variables de tipo {labelType} en esta solución.</span>
        ) : dataList.map(v => (
          <button
            key={v.variable}
            onClick={() => setSelectedItem(activeCard, v.variable)}
            className={`px-6 py-3 rounded-2xl border transition-all whitespace-nowrap font-bold text-sm ${
              selectedItem === v.variable
                ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20'
                : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'
            }`}
          >
            {v.variable}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {activeData && (
          <motion.div
            key={activeData.variable}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="glass p-8 rounded-3xl border-white/10 space-y-6"
          >
            <div className="flex flex-wrap items-center justify-between gap-4">
              <h4 className="text-2xl font-black text-white">Análisis de {activeData.variable}</h4>
              <span className="px-4 py-1.5 rounded-full bg-primary/10 text-primary border border-primary/20 text-sm font-bold">
                Cj Actual: {activeData.current.toFixed(2)}
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-6 bg-green-500/10 border border-green-500/20 rounded-2xl">
                <span className="block text-xs font-black uppercase tracking-widest text-green-500/70 mb-2">Aumento Permitido</span>
                <span className="text-3xl font-black text-green-400">
                  {activeData.increase === Infinity ? '∞' : activeData.increase.toFixed(4)}
                </span>
                <p className="text-sm text-green-500/50 mt-2">
                  Límite Superior Cj:{' '}
                  {activeData.increase === Infinity ? '∞' : (activeData.current + activeData.increase).toFixed(4)}
                </p>
              </div>
              <div className="p-6 bg-red-500/10 border border-red-500/20 rounded-2xl">
                <span className="block text-xs font-black uppercase tracking-widest text-red-500/70 mb-2">Disminución Permitida</span>
                <span className="text-3xl font-black text-red-400">
                  {activeData.decrease === Infinity ? '∞' : activeData.decrease.toFixed(4)}
                </span>
                <p className="text-sm text-red-500/50 mt-2">
                  Límite Inferior Cj:{' '}
                  {activeData.decrease === Infinity ? '-∞' : (activeData.current - activeData.decrease).toFixed(4)}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  const renderCase3 = () => (
    <div className="space-y-6">
      <div className="flex gap-3 overflow-x-auto pb-2">
        {resources.map(r => (
          <button
            key={r.constraint}
            onClick={() => setSelectedItem(activeCard, r.constraint)}
            className={`px-6 py-3 rounded-2xl border transition-all whitespace-nowrap font-bold text-sm ${
              selectedItem === r.constraint
                ? 'bg-accent border-accent text-dark-bg shadow-lg shadow-accent/20'
                : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'
            }`}
          >
            {r.constraint}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {activeData && (
          <motion.div
            key={activeData.constraint}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="glass p-8 rounded-3xl border-white/10 space-y-6"
          >
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h4 className="text-2xl font-black text-white">Recurso {activeData.constraint}</h4>
                <p className="text-slate-400 text-sm mt-1">Disponibilidad actual: <span className="font-bold text-white">{activeData.current}</span></p>
              </div>
              <div className="px-6 py-3 rounded-2xl bg-accent/10 border border-accent/20 text-right">
                <span className="block text-xs font-black uppercase tracking-widest text-accent/70">Precio Sombra</span>
                <span className="text-2xl font-black text-accent">{activeData.shadowPrice.toFixed(4)}</span>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-6 bg-green-500/10 border border-green-500/20 rounded-2xl">
                <span className="block text-xs font-black uppercase tracking-widest text-green-500/70 mb-2">Aumento Permitido (bi)</span>
                <span className="text-3xl font-black text-green-400">
                  {activeData.increase === Infinity ? '∞' : activeData.increase.toFixed(4)}
                </span>
              </div>
              <div className="p-6 bg-red-500/10 border border-red-500/20 rounded-2xl">
                <span className="block text-xs font-black uppercase tracking-widest text-red-500/70 mb-2">Disminución Permitida (bi)</span>
                <span className="text-3xl font-black text-red-400">
                  {activeData.decrease === Infinity ? '∞' : activeData.decrease.toFixed(4)}
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  const calculateNewVar = () => {
    const cj = parseFloat(newVarCj);
    if (isNaN(cj) || newVarAij.some(v => v === '')) return null;
    let zj = 0;
    for (let i = 0; i < resources.length; i++) {
      const aij = parseFloat(newVarAij[i]);
      if (isNaN(aij)) return null;
      zj += resources[i].shadowPrice * aij;
    }
    const cj_zj = cj - zj;
    const isProfitable = type === 'max' ? cj_zj > 1e-8 : cj_zj < -1e-8;
    return { zj, cj_zj, isProfitable };
  };

  const newVarResult = calculateNewVar();

  const renderCase4 = () => (
    <div className="glass p-8 rounded-3xl border-white/10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="space-y-6">
          <div>
            <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">
              Coeficiente Objetivo ({type === 'max' ? 'Utilidad' : 'Costo'}) — C<sub>nuevo</sub>
            </label>
            <input
              type="number"
              value={newVarCj}
              onChange={(e) => setNewVarCj(e.target.value)}
              className="w-full bg-dark-bg border-2 border-white/10 rounded-xl px-4 py-3 focus:border-primary outline-none transition-all text-xl font-bold"
              placeholder="Ej. 150"
            />
          </div>
          <div className="space-y-3">
            <label className="block text-xs font-black text-slate-500 uppercase tracking-widest">
              Consumo de Recursos — a<sub>ij</sub>
            </label>
            {resources.map((r, i) => (
              <div key={i} className="flex items-center gap-4">
                <span className="w-12 font-bold text-slate-400 text-sm">{r.constraint}</span>
                <input
                  type="number"
                  value={newVarAij[i] ?? ''}
                  onChange={(e) => {
                    const next = [...newVarAij];
                    next[i] = e.target.value;
                    setNewVarAij(next);
                  }}
                  className="flex-1 bg-dark-bg border border-white/10 rounded-lg px-4 py-2 focus:border-primary outline-none transition-all font-mono"
                  placeholder="0"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col justify-center">
          <AnimatePresence mode="wait">
            {newVarResult ? (
              <motion.div
                key="result"
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.92 }}
                className={`p-8 rounded-[2rem] border-2 flex flex-col items-center text-center gap-5 ${
                  newVarResult.isProfitable
                    ? 'bg-green-500/10 border-green-500/30'
                    : 'bg-red-500/10 border-red-500/30'
                }`}
              >
                {newVarResult.isProfitable
                  ? <CheckCircle2 className="w-16 h-16 text-green-400" />
                  : <XCircle className="w-16 h-16 text-red-400" />
                }
                <div>
                  <h4 className={`text-2xl font-black mb-2 ${newVarResult.isProfitable ? 'text-green-400' : 'text-red-400'}`}>
                    {newVarResult.isProfitable ? 'SÍ es recomendable' : 'NO es recomendable'}
                  </h4>
                  <p className="text-slate-300 text-sm leading-relaxed">
                    {newVarResult.isProfitable
                      ? 'Incluir este nuevo producto mejoraría el valor óptimo de Z.'
                      : 'Este producto no aportaría valor adicional al óptimo actual.'}
                  </p>
                </div>
                <div className="w-full p-4 bg-dark-bg/60 rounded-xl border border-white/5 flex justify-between items-center">
                  <span className="text-xs font-black uppercase text-slate-500">Costo Reducido (Cj − Zj)</span>
                  <span className={`text-xl font-mono font-black ${newVarResult.isProfitable ? 'text-green-400' : 'text-slate-300'}`}>
                    {newVarResult.cj_zj >= 0 ? '+' : ''}{newVarResult.cj_zj.toFixed(4)}
                  </span>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="placeholder"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="h-full border-2 border-dashed border-white/10 rounded-[2rem] flex flex-col items-center justify-center p-8 text-slate-500 text-center gap-4 min-h-[280px]"
              >
                <Plus className="w-12 h-12 opacity-30" />
                <p className="text-sm leading-relaxed">
                  Ingresa los datos del nuevo producto para evaluar su rentabilidad usando la teoría de dualidad.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-10 py-8">
      {/* Header */}
      <div className="flex flex-col items-center gap-2">
        <h2 className="text-3xl md:text-4xl font-black flex items-center gap-4 text-center">
          <Activity className="w-9 h-9 text-primary" />
          ESTUDIOS DE SENSIBILIDAD
        </h2>
        <p className="text-slate-400 text-base">Desliza para seleccionar el tipo de análisis</p>
      </div>

      {/* 3D Carousel — drag/swipe + buttons */}
      <div className="relative w-full max-w-xl mx-auto" style={{ perspective: '1000px' }}>
        <motion.div
          className="relative w-full h-40 md:h-44 cursor-grab active:cursor-grabbing"
          style={{ transformStyle: 'preserve-3d' }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.2}
          onDragEnd={(_, info) => {
            if (info.offset.x < -60) handleNext();
            else if (info.offset.x > 60) handlePrev();
          }}
        >
          {CARDS.map((_, index) => renderCardContent(index))}
        </motion.div>

        {/* Prev / Next buttons */}
        <button
          onClick={handlePrev}
          aria-label="Anterior"
          className="absolute -left-14 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/5 border border-white/10 hover:bg-white/15 transition-all flex items-center justify-center backdrop-blur-md"
        >
          <ChevronDown className="w-5 h-5 text-white rotate-90" />
        </button>
        <button
          onClick={handleNext}
          aria-label="Siguiente"
          className="absolute -right-14 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/5 border border-white/10 hover:bg-white/15 transition-all flex items-center justify-center backdrop-blur-md"
        >
          <ChevronDown className="w-5 h-5 text-white -rotate-90" />
        </button>
      </div>

      {/* Dot indicators */}
      <div className="flex justify-center gap-2">
        {CARDS.map((_, idx) => (
          <button
            key={idx}
            onClick={() => handleCardChange(idx)}
            className={`h-2 rounded-full transition-all ${idx === activeCard ? 'w-8 bg-primary' : 'w-2 bg-white/20 hover:bg-white/40'}`}
          />
        ))}
      </div>

      {/* Dynamic Panel */}
      <div className="max-w-4xl mx-auto mt-4 min-h-[360px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCard}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.25 }}
          >
            {activeCard === 0 && renderCase1and2(basicVars, 'Básica')}
            {activeCard === 1 && renderCase1and2(nonBasicVars, 'No Básica')}
            {activeCard === 2 && renderCase3()}
            {activeCard === 3 && renderCase4()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
