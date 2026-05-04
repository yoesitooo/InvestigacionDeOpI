import React, { useState, useEffect } from 'react';
import { SimplexSolver, MValue } from './logic/simplex';
import { 
  Plus, 
  Minus, 
  Play, 
  RefreshCcw, 
  Settings2, 
  ChevronRight, 
  Info,
  CheckCircle2,
  AlertCircle,
  BrainCircuit,
  LayoutDashboard,
  Target,
  Layers,
  ArrowRight,
  BookOpen,
  FileText,
  Lightbulb,
  Zap,
  Users,
  TrendingUp,
  Scale,
  Calculator,
  Download
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function App() {
  const [step, setStep] = useState(0); 
  const [varCount, setVarCount] = useState(2);
  const [constCount, setConstCount] = useState(2);
  const [type, setType] = useState('min');
  
  const [objective, setObjective] = useState([8, 10]);
  const [constraints, setConstraints] = useState([
    { coeffs: [3, 9], op: '>=', constant: 100 },
    { coeffs: [8, 4], op: '>=', constant: 150 }
  ]);

  const [solution, setSolution] = useState(null);

  const handleConfigSubmit = (e) => {
    if (e) e.preventDefault();
    setObjective(new Array(varCount).fill(0));
    setConstraints(new Array(constCount).fill(0).map(() => ({
      coeffs: new Array(varCount).fill(0),
      op: '<=',
      constant: 0
    })));
    setStep(2);
  };

  const loadRealCase = () => {
    setVarCount(2);
    setConstCount(3);
    setType('max');
    setObjective([50, 40]); 
    setConstraints([
      { coeffs: [2, 1], op: '<=', constant: 100 }, 
      { coeffs: [1, 1], op: '<=', constant: 80 },  
      { coeffs: [1, 3], op: '<=', constant: 150 }  
    ]);
    setStep(2);
  };

  const handleSolve = () => {
    const solver = new SimplexSolver(objective, varCount, constraints, type);
    solver.solve();
    setSolution({
      result: solver.result,
      tableaus: solver.tableaus,
      error: solver.error,
      dual: solver.getDual()
    });
    setStep(3);
  };

  const reset = () => {
    setStep(1);
    setSolution(null);
  };

  return (
    <div className="min-h-screen text-slate-100 font-sans selection:bg-primary/30 bg-[#0f172a]">
      {/* Background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-primary/20 blur-[120px] rounded-full"></div>
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-accent/10 blur-[120px] rounded-full"></div>
      </div>

      <nav className="relative z-10 border-b border-white/10 bg-dark-bg/50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setStep(0)}>
            <div className="p-2 bg-primary/20 rounded-lg">
              <BrainCircuit className="w-6 h-6 text-primary" />
            </div>
            <span className="text-xl font-bold tracking-tight">Simplex<span className="text-primary">Optimizer</span></span>
          </div>
          <div className="flex items-center gap-6 text-sm">
            <button onClick={() => setStep(0)} className={`hover:text-primary transition-colors ${step === 0 ? 'text-primary font-bold' : 'text-slate-400'}`}>Inicio</button>
            <button onClick={() => setStep(1)} className={`px-4 py-2 rounded-xl border transition-all ${step > 0 ? 'bg-primary border-primary text-white' : 'border-white/10 text-slate-400 hover:text-white'}`}>
              Resolver Problema
            </button>
          </div>
        </div>
      </nav>

      <main className="relative z-10 max-w-6xl mx-auto px-4 py-12">
        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div
              key="landing"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-20"
            >
              <div className="text-center space-y-6 max-w-3xl mx-auto">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-black uppercase tracking-[0.2em] mb-4">
                  <Zap className="w-3 h-3" /> Proyecto Académico
                </div>
                <h1 className="text-6xl font-black bg-gradient-to-r from-white via-white to-slate-500 bg-clip-text text-transparent leading-tight">
                  Investigación de Operaciones I
                </h1>
                <p className="text-xl text-slate-400 font-medium">
                  Plataforma avanzada para la modelación y resolución de problemas de optimización lineal con análisis de sensibilidad dinámico.
                </p>
                <div className="flex items-center justify-center gap-4 pt-8">
                  <button 
                    onClick={() => setStep(1)}
                    className="px-8 py-4 bg-primary rounded-2xl font-bold text-lg shadow-xl shadow-primary/20 flex items-center gap-2 group hover:scale-105 transition-all"
                  >
                    Empezar a Resolver <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                  <button 
                    onClick={loadRealCase}
                    className="px-8 py-4 bg-white/5 rounded-2xl border border-white/10 font-bold text-lg hover:bg-white/10 transition-all"
                  >
                    Caso de Estudio Real
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="glass p-8 rounded-[2.5rem] space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center">
                    <BookOpen className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold">Enunciado</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    Diseño de un sistema interactivo para modelar problemas reales, permitiendo la visualización detallada de resultados y sensibilidad paramétrica.
                  </p>
                </div>
                <div className="glass p-8 rounded-[2.5rem] space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-accent/20 flex items-center justify-center">
                    <FileText className="w-6 h-6 text-accent" />
                  </div>
                  <h3 className="text-xl font-bold">Metodología</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    Implementación del método Simplex de la Gran M, utilizando aritmética simbólica para el manejo preciso de penalizaciones por variables artificiales.
                  </p>
                </div>
                <div className="glass p-8 rounded-[2.5rem] space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-purple-500/20 flex items-center justify-center">
                    <Scale className="w-6 h-6 text-purple-400" />
                  </div>
                  <h3 className="text-xl font-bold">Sensibilidad</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    Análisis de precios sombra y costos reducidos para evaluar el impacto de cambios en los recursos y coeficientes del modelo.
                  </p>
                </div>
              </div>

              {/* Authors Section */}
              <div className="space-y-8">
                <h2 className="text-3xl font-black flex items-center gap-3 justify-center">
                  <Users className="w-8 h-8 text-primary" /> Equipo de Desarrollo
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="glass p-6 rounded-3xl text-center border-white/5 hover:border-primary/30 transition-all group">
                      <div className="w-16 h-16 rounded-full bg-white/5 mx-auto mb-4 flex items-center justify-center border border-white/10 group-hover:bg-primary/10 transition-all">
                        <Users className="w-8 h-8 text-slate-500 group-hover:text-primary transition-all" />
                      </div>
                      <h4 className="text-sm font-bold text-slate-300">Autor {i}</h4>
                      <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-1">Estudiante IO-I</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="glass p-12 rounded-[3rem] border-white/5 space-y-8 bg-gradient-to-br from-white/[0.03] to-transparent">
                <h2 className="text-3xl font-black flex items-center gap-3">
                  <Calculator className="w-8 h-8 text-primary" /> Alcance del Sistema
                </h2>
                <div className="prose prose-invert max-w-none grid grid-cols-1 md:grid-cols-2 gap-12 text-slate-300">
                  <div className="space-y-4">
                    <p>
                      El sistema aborda la optimización lineal desde una perspectiva técnica y académica, permitiendo no solo llegar a la solución, sino comprender el proceso algebraico detrás de cada iteración.
                    </p>
                    <ul className="space-y-3">
                      <li className="flex items-center gap-2 text-sm">
                        <CheckCircle2 className="w-4 h-4 text-accent" /> 
                        Modelado de funciones objetivo Max/Min.
                      </li>
                      <li className="flex items-center gap-2 text-sm">
                        <CheckCircle2 className="w-4 h-4 text-accent" /> 
                        Soporte para restricciones mixtas (&le;, &ge;, =).
                      </li>
                    </ul>
                  </div>
                  <div className="bg-white/5 p-8 rounded-3xl border border-white/10">
                    <h4 className="text-primary font-black uppercase text-xs mb-4 tracking-widest">Información Académica</h4>
                    <p className="text-sm text-slate-400">
                      Este software cumple con los requerimientos de la asignatura, integrando visualización gráfica de resultados, análisis de dualidad y reportes de sensibilidad detallados.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-2xl mx-auto"
            >
              <div className="text-center mb-10">
                <h1 className="text-5xl font-extrabold mb-4 bg-gradient-to-r from-white via-primary to-accent bg-clip-text text-transparent">
                  Configuración
                </h1>
                <p className="text-slate-400 text-lg">Define las dimensiones de tu modelo matemático.</p>
              </div>

              <div className="glass p-10 rounded-[2.5rem] space-y-10 border-white/5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-slate-300 font-medium">
                      <Target className="w-4 h-4 text-primary" />
                      Variables
                    </div>
                    <div className="flex items-center gap-4">
                      <button 
                        onClick={() => setVarCount(Math.max(1, varCount - 1))}
                        className="p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all active:scale-95"
                      >
                        <Minus className="w-5 h-5" />
                      </button>
                      <div className="flex-1 text-center text-3xl font-black bg-white/5 py-3 rounded-2xl border border-white/10 shadow-inner">
                        {varCount}
                      </div>
                      <button 
                        onClick={() => setVarCount(varCount + 1)}
                        className="p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all active:scale-95"
                      >
                        <Plus className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-slate-300 font-medium">
                      <Layers className="w-4 h-4 text-accent" />
                      Restricciones
                    </div>
                    <div className="flex items-center gap-4">
                      <button 
                        onClick={() => setConstCount(Math.max(1, constCount - 1))}
                        className="p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all active:scale-95"
                      >
                        <Minus className="w-5 h-5" />
                      </button>
                      <div className="flex-1 text-center text-3xl font-black bg-white/5 py-3 rounded-2xl border border-white/10 shadow-inner">
                        {constCount}
                      </div>
                      <button 
                        onClick={() => setConstCount(constCount + 1)}
                        className="p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all active:scale-95"
                      >
                        <Plus className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="block text-sm font-medium text-slate-400 uppercase tracking-widest text-center mb-4">Meta</label>
                  <div className="grid grid-cols-2 gap-6">
                    <button
                      onClick={() => setType('max')}
                      className={`p-6 rounded-[2rem] border-2 transition-all flex flex-col items-center gap-3 ${
                        type === 'max' 
                          ? 'bg-primary/20 border-primary text-primary shadow-[0_0_30px_rgba(139,92,246,0.3)]' 
                          : 'bg-white/5 border-white/10 text-slate-500 hover:bg-white/10'
                      }`}
                    >
                      <Plus className="w-8 h-8" />
                      <span className="font-bold text-lg">Maximizar</span>
                    </button>
                    <button
                      onClick={() => setType('min')}
                      className={`p-6 rounded-[2rem] border-2 transition-all flex flex-col items-center gap-3 ${
                        type === 'min' 
                          ? 'bg-accent/20 border-accent text-accent shadow-[0_0_30px_rgba(16,185,129,0.3)]' 
                          : 'bg-white/5 border-white/10 text-slate-500 hover:bg-white/10'
                      }`}
                    >
                      <Minus className="w-8 h-8" />
                      <span className="font-bold text-lg">Minimizar</span>
                    </button>
                  </div>
                </div>

                <button
                  onClick={handleConfigSubmit}
                  className="w-full py-5 bg-gradient-to-r from-primary to-primary-dark text-white rounded-2xl font-black text-xl transition-all shadow-xl shadow-primary/30 flex items-center justify-center gap-3 group active:scale-[0.98]"
                >
                  Continuar al Modelado
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                </button>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-10"
            >
              <div className="flex items-end justify-between">
                <div>
                  <h2 className="text-4xl font-black mb-2">Modelado</h2>
                  <p className="text-slate-400 text-lg italic">Define los coeficientes de tu sistema.</p>
                </div>
                <button 
                  onClick={reset}
                  className="p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-400 transition-all hover:text-white"
                >
                  <RefreshCcw className="w-6 h-6" />
                </button>
              </div>

              <div className="glass p-10 rounded-[2.5rem] space-y-16 border-white/5 relative overflow-hidden">
                <div className="space-y-8">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                      <LayoutDashboard className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-2xl font-bold">Función Objetivo</h3>
                  </div>
                  <div className="flex flex-wrap items-center gap-6 p-8 bg-white/5 rounded-3xl border border-white/10 border-dashed">
                    <span className="font-mono text-3xl font-black text-slate-500 uppercase">{type} Z = </span>
                    {objective.map((val, i) => (
                      <div key={i} className="flex items-center gap-4">
                        <input
                          type="number"
                          value={val}
                          onChange={(e) => {
                            const newObj = [...objective];
                            newObj[i] = parseFloat(e.target.value) || 0;
                            setObjective(newObj);
                          }}
                          className="w-32 bg-dark-bg border-2 border-white/10 rounded-2xl px-4 py-4 focus:border-primary outline-none transition-all text-center text-2xl font-bold shadow-lg"
                        />
                        <span className="text-slate-400 font-mono text-2xl">X<sub className="text-primary">{i + 1}</sub></span>
                        {i < objective.length - 1 && <Plus className="w-6 h-6 text-slate-700" />}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-8">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center">
                      <Settings2 className="w-6 h-6 text-accent" />
                    </div>
                    <h3 className="text-2xl font-bold">Restricciones</h3>
                  </div>
                  <div className="space-y-6">
                    {constraints.map((c, i) => (
                      <div key={i} className="flex flex-wrap items-center gap-6 p-6 bg-white/5 rounded-[2rem] border border-white/10 hover:bg-white/[0.08] transition-colors relative group">
                        <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-8 h-12 bg-accent/20 rounded-lg flex items-center justify-center text-xs font-black text-accent border border-accent/30 rotate-3">
                          R{i + 1}
                        </div>
                        {c.coeffs.map((val, j) => (
                          <div key={j} className="flex items-center gap-4">
                            <input
                              type="number"
                              value={val}
                              onChange={(e) => {
                                const newConstraints = [...constraints];
                                newConstraints[i].coeffs[j] = parseFloat(e.target.value) || 0;
                                setConstraints(newConstraints);
                              }}
                              className="w-24 bg-dark-bg border-2 border-white/10 rounded-xl px-2 py-3 focus:border-accent outline-none transition-all text-center text-xl font-bold"
                            />
                            <span className="text-slate-500 font-mono">X<sub className="text-accent">{j + 1}</sub></span>
                            {j < c.coeffs.length - 1 && <span className="text-slate-800 text-2xl">+</span>}
                          </div>
                        ))}
                        <div className="flex items-center gap-4 ml-auto">
                          <select
                            value={c.op}
                            onChange={(e) => {
                              const newConstraints = [...constraints];
                              newConstraints[i].op = e.target.value;
                              setConstraints(newConstraints);
                            }}
                            className="bg-dark-bg border-2 border-white/10 rounded-xl px-4 py-3 outline-none focus:border-accent cursor-pointer font-black text-2xl text-accent appearance-none text-center min-w-[70px]"
                          >
                            <option value="<=">&le;</option>
                            <option value=">=">&ge;</option>
                            <option value="=">=</option>
                          </select>
                          <input
                            type="number"
                            value={c.constant}
                            onChange={(e) => {
                              const newConstraints = [...constraints];
                              newConstraints[i].constant = parseFloat(e.target.value) || 0;
                              setConstraints(newConstraints);
                            }}
                            className="w-32 bg-dark-bg border-2 border-white/10 rounded-xl px-4 py-3 focus:border-accent outline-none transition-all text-center text-2xl font-bold text-accent shadow-inner"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={handleSolve}
                  className="w-full py-6 bg-accent hover:opacity-90 text-dark-bg rounded-[2rem] font-black text-2xl transition-all shadow-2xl shadow-accent/20 flex items-center justify-center gap-4 active:scale-[0.99]"
                >
                  <Play className="w-8 h-8 fill-current" />
                  EJECUTAR SOLUCIONADOR
                </button>
              </div>
            </motion.div>
          )}

          {step === 3 && solution && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-16"
            >
              {solution.error ? (
                <div className="glass p-12 rounded-[2.5rem] border-red-500/30 flex flex-col items-center text-center gap-6">
                  <div className="w-24 h-24 rounded-full bg-red-500/10 flex items-center justify-center border border-red-500/20">
                    <AlertCircle className="w-12 h-12 text-red-500" />
                  </div>
                  <div>
                    <h3 className="text-3xl font-black text-white mb-2">Error en el Cálculo</h3>
                    <p className="text-red-400 text-lg">{solution.error}</p>
                    <button onClick={reset} className="mt-8 px-8 py-3 bg-white/5 rounded-2xl border border-white/10 text-white font-bold hover:bg-white/10 transition-all">Ajustar Modelo</button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-12">
                      <div className="glass p-6 md:p-10 rounded-[2.5rem] border-white/5 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
                          <CheckCircle2 className="w-48 h-48 text-accent" />
                        </div>
                        <h3 className="text-2xl md:text-3xl font-black mb-8 flex items-center gap-3">
                          <CheckCircle2 className="w-8 h-8 text-accent" />
                          Solución Óptima
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
                          <div className="p-6 bg-accent/10 rounded-[2rem] border border-accent/20 shadow-xl overflow-hidden">
                            <span className="block text-[10px] font-black text-accent uppercase tracking-widest mb-3 opacity-60">Valor de Z</span>
                            <span className="text-2xl md:text-3xl font-black text-white truncate block">
                              {solution.result.objectiveValue.toFixed(4)}
                            </span>
                          </div>
                          {solution.result.variables.map((val, i) => (
                            <div key={i} className="p-6 bg-white/5 rounded-[2rem] border border-white/10 overflow-hidden">
                              <span className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Variable X{i + 1}</span>
                              <span className="text-2xl md:text-3xl font-bold text-white truncate block">
                                {val.toFixed(4)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-10">
                        <div className="flex items-center justify-between px-4">
                          <h3 className="text-2xl font-black flex items-center gap-3">
                            <Layers className="w-6 h-6 text-primary" />
                            Tableaus de Resolución
                          </h3>
                        </div>
                        
                        <div className="space-y-12">
                          {solution.tableaus.map((tableau, idx) => (
                            <div key={idx} className="glass rounded-[2.5rem] border-white/5 overflow-hidden shadow-2xl animate-fade-in" style={{animationDelay: `${idx * 0.1}s`}}>
                              <div className="bg-white/[0.03] p-6 border-b border-white/10 flex items-center justify-between">
                                <span className="text-sm font-black text-primary uppercase tracking-widest flex items-center gap-2">
                                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
                                  {tableau.title}
                                </span>
                              </div>
                              <div className="p-2 overflow-x-auto">
                                <table className="w-full border-separate border-spacing-1 text-center font-mono text-[13px]">
                                  <thead>
                                    <tr>
                                      <td colSpan={2}></td>
                                      <td className="bg-primary/10 text-primary border border-primary/20 rounded-lg p-2 font-black text-[10px] uppercase">Cj</td>
                                      {tableau.cj.map((c, j) => (
                                        <td key={j} className="bg-primary/10 text-primary border border-primary/20 rounded-lg p-2 font-black">
                                          {c.toString()}
                                        </td>
                                      ))}
                                      <td></td>
                                    </tr>
                                    <tr className="text-slate-500">
                                      <th className="p-4 border border-white/5 rounded-xl bg-white/5 font-black text-xs">V<sub>B</sub></th>
                                      <th className="p-4 border border-white/5 rounded-xl bg-white/5 font-black text-xs">C<sub>B</sub></th>
                                      <td className="border-r border-white/10"></td>
                                      {tableau.headers.map((header, j) => (
                                        <th key={j} className="p-4 border border-white/5 rounded-xl bg-white/5 text-slate-300 font-bold">
                                          {header}
                                        </th>
                                      ))}
                                      <th className="p-4 border border-white/5 rounded-xl bg-white/5 text-accent font-black">b<sub>i</sub></th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {tableau.matrix.map((row, i) => (
                                      <tr key={i} className="hover:bg-white/[0.03] transition-colors group">
                                        <td className="p-4 bg-white/5 border border-white/5 rounded-xl font-black text-slate-300 group-hover:text-primary transition-colors">
                                          {tableau.headers[tableau.basis[i]]}
                                        </td>
                                        <td className="p-4 bg-white/5 border border-white/5 rounded-xl font-bold text-slate-400">
                                          {tableau.cj[tableau.basis[i]].toString()}
                                        </td>
                                        <td className="border-r border-white/10"></td>
                                        {row.slice(0, -1).map((val, j) => (
                                          <td key={j} className="p-4 border border-white/5 rounded-xl text-slate-400 font-medium">
                                            {val.toFixed(2)}
                                          </td>
                                        ))}
                                        <td className="p-4 border border-white/5 rounded-xl text-white font-black bg-white/5">
                                          {row[row.length - 1].toFixed(2)}
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                  <tfoot>
                                    <tr className="bg-primary/5 text-primary">
                                      <td colSpan={2}></td>
                                      <td className="p-4 border border-primary/20 rounded-xl font-black uppercase text-[10px]">Zj</td>
                                      {tableau.zj.slice(0, -1).map((val, j) => (
                                        <td key={j} className="p-4 border border-primary/20 rounded-xl font-bold">
                                          {val.toString()}
                                        </td>
                                      ))}
                                      <td className="p-4 border border-primary/20 rounded-xl font-black text-white bg-primary/20 shadow-inner">
                                        {tableau.zj[tableau.zj.length - 1].toString()}
                                      </td>
                                    </tr>
                                    <tr className="bg-accent/5 text-accent">
                                      <td colSpan={2}></td>
                                      <td className="p-4 border border-accent/20 rounded-xl font-black uppercase text-[10px]">Cj-Zj</td>
                                      {tableau.cj_zj.map((val, j) => (
                                        <td key={j} className="p-4 border border-accent/20 rounded-xl font-bold">
                                          {val.toString()}
                                        </td>
                                      ))}
                                      <td></td>
                                    </tr>
                                  </tfoot>
                                </table>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-8">
                      <div className="glass p-10 rounded-[2.5rem] sticky top-8 border-white/5 shadow-2xl">
                        <div className="flex items-center gap-3 mb-8">
                          <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center">
                            <TrendingUp className="w-6 h-6 text-accent" />
                          </div>
                          <h4 className="text-xl font-black">Sensibilidad</h4>
                        </div>
                        
                        <div className="space-y-8">
                          <div>
                            <span className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Precios Sombra (RHS)</span>
                            <div className="space-y-3">
                              {solution.result.sensitivity.shadowPrices.map((sp, i) => (
                                <div key={i} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10 group hover:border-accent/50 transition-all">
                                  <span className="text-sm font-bold text-slate-400 group-hover:text-white transition-colors">Recurso {i + 1}</span>
                                  <span className="text-lg font-black text-accent">{sp.value.toFixed(2)}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div>
                            <span className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Costos Reducidos (Cj)</span>
                            <div className="space-y-3">
                              {solution.result.variables.map((val, i) => (
                                <div key={i} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10 group">
                                  <span className="text-sm font-bold text-slate-400">Var X{i + 1}</span>
                                  <span className="text-lg font-black text-primary">0.00</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="pt-6 border-t border-white/10">
                            <h5 className="text-[10px] font-black text-slate-500 uppercase mb-4 tracking-widest">Modelo Dual</h5>
                            <button className="w-full py-3 bg-primary/20 text-primary border border-primary/30 rounded-xl font-bold text-xs hover:bg-primary/30 transition-all flex items-center justify-center gap-2">
                              <Layers className="w-4 h-4" /> Ver Dualidad
                            </button>
                          </div>
                        </div>

                        <button 
                          onClick={reset}
                          className="w-full mt-12 py-4 rounded-2xl bg-white/5 border-2 border-white/10 hover:bg-white/10 transition-all flex items-center justify-center gap-3 font-black text-slate-300 active:scale-95"
                        >
                          <RefreshCcw className="w-5 h-5" />
                          REINICIAR
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="relative z-10 py-16 border-t border-white/5 mt-auto bg-dark-bg/80">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-2 opacity-50 hover:opacity-100 transition-all">
            <BrainCircuit className="w-5 h-5 text-primary" />
            <span className="font-bold tracking-tight text-sm text-slate-300">SimplexOptimizer v3.0</span>
          </div>
          
          <div className="flex gap-8 text-[10px] font-black text-slate-600 uppercase tracking-widest">
            <span>Algoritmo Gran M</span>
            <span>Investigación de Operaciones I</span>
            <span>2026</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
