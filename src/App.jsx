import React, { useState, useMemo } from 'react';
import { SimplexSolver } from './logic/simplex';
import { 
  Plus, 
  Minus, 
  Play, 
  RefreshCcw, 
  Settings2, 
  ChevronRight, 
  ChevronDown,
  Info,
  CheckCircle2,
  AlertCircle,
  BrainCircuit,
  LayoutDashboard
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function App() {
  const [step, setStep] = useState(1); // 1: Config, 2: Input, 3: Result
  const [varCount, setVarCount] = useState(2);
  const [constCount, setConstCount] = useState(2);
  const [type, setType] = useState('max');
  
  const [objective, setObjective] = useState([0, 0]);
  const [constraints, setConstraints] = useState([
    { coeffs: [0, 0], op: '<=', constant: 0 },
    { coeffs: [0, 0], op: '<=', constant: 0 }
  ]);

  const [solution, setSolution] = useState(null);

  const handleConfigSubmit = (e) => {
    e.preventDefault();
    setObjective(new Array(varCount).fill(0));
    setConstraints(new Array(constCount).fill(0).map(() => ({
      coeffs: new Array(varCount).fill(0),
      op: '<=',
      constant: 0
    })));
    setStep(2);
  };

  const handleSolve = () => {
    const solver = new SimplexSolver(objective, varCount, constraints, type);
    solver.solve();
    setSolution({
      result: solver.result,
      tableaus: solver.tableaus,
      error: solver.error
    });
    setStep(3);
  };

  const reset = () => {
    setStep(1);
    setSolution(null);
  };

  return (
    <div className="min-h-screen text-slate-100 font-sans selection:bg-primary/30">
      {/* Background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-primary/20 blur-[120px] rounded-full"></div>
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-accent/10 blur-[120px] rounded-full"></div>
      </div>

      <nav className="relative z-10 border-b border-white/10 bg-dark-bg/50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-primary/20 rounded-lg">
              <BrainCircuit className="w-6 h-6 text-primary" />
            </div>
            <span className="text-xl font-bold tracking-tight">Simplex<span className="text-primary">Optimizer</span></span>
          </div>
          <div className="flex items-center gap-4 text-sm text-slate-400">
            <div className={`flex items-center gap-2 ${step >= 1 ? 'text-primary' : ''}`}>
              <span className="w-5 h-5 flex items-center justify-center rounded-full border border-current text-[10px]">1</span>
              <span>Configuración</span>
            </div>
            <ChevronRight className="w-4 h-4" />
            <div className={`flex items-center gap-2 ${step >= 2 ? 'text-primary' : ''}`}>
              <span className="w-5 h-5 flex items-center justify-center rounded-full border border-current text-[10px]">2</span>
              <span>Datos</span>
            </div>
            <ChevronRight className="w-4 h-4" />
            <div className={`flex items-center gap-2 ${step >= 3 ? 'text-primary' : ''}`}>
              <span className="w-5 h-5 flex items-center justify-center rounded-full border border-current text-[10px]">3</span>
              <span>Resultado</span>
            </div>
          </div>
        </div>
      </nav>

      <main className="relative z-10 max-w-5xl mx-auto px-4 py-12">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-2xl mx-auto"
            >
              <div className="text-center mb-10">
                <h1 className="text-4xl font-extrabold mb-4 bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                  Define tu Problema
                </h1>
                <p className="text-slate-400">Establece las dimensiones básicas de tu modelo de optimización lineal.</p>
              </div>

              <div className="glass p-8 rounded-3xl space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <label className="block text-sm font-medium text-slate-300">Variables de Decisión</label>
                    <div className="flex items-center gap-4">
                      <button 
                        onClick={() => setVarCount(Math.max(1, varCount - 1))}
                        className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all"
                      >
                        <Minus className="w-5 h-5" />
                      </button>
                      <div className="flex-1 text-center text-2xl font-bold bg-white/5 py-2 rounded-xl border border-white/10">
                        {varCount}
                      </div>
                      <button 
                        onClick={() => setVarCount(varCount + 1)}
                        className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all"
                      >
                        <Plus className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="block text-sm font-medium text-slate-300">Restricciones</label>
                    <div className="flex items-center gap-4">
                      <button 
                        onClick={() => setConstCount(Math.max(1, constCount - 1))}
                        className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all"
                      >
                        <Minus className="w-5 h-5" />
                      </button>
                      <div className="flex-1 text-center text-2xl font-bold bg-white/5 py-2 rounded-xl border border-white/10">
                        {constCount}
                      </div>
                      <button 
                        onClick={() => setConstCount(constCount + 1)}
                        className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all"
                      >
                        <Plus className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="block text-sm font-medium text-slate-300">Objetivo del Problema</label>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={() => setType('max')}
                      className={`p-4 rounded-2xl border transition-all flex items-center justify-center gap-2 ${
                        type === 'max' 
                          ? 'bg-primary/20 border-primary text-primary shadow-[0_0_20px_rgba(139,92,246,0.2)]' 
                          : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'
                      }`}
                    >
                      <Plus className="w-5 h-5" />
                      Maximizar
                    </button>
                    <button
                      onClick={() => setType('min')}
                      className={`p-4 rounded-2xl border transition-all flex items-center justify-center gap-2 ${
                        type === 'min' 
                          ? 'bg-primary/20 border-primary text-primary shadow-[0_0_20px_rgba(139,92,246,0.2)]' 
                          : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'
                      }`}
                    >
                      <Minus className="w-5 h-5" />
                      Minimizar
                    </button>
                  </div>
                </div>

                <button
                  onClick={handleConfigSubmit}
                  className="w-full py-4 bg-primary hover:bg-primary-dark text-white rounded-2xl font-bold transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2 group"
                >
                  Continuar
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
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
              className="space-y-8"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-bold">Entrada de Datos</h2>
                  <p className="text-slate-400">Introduce los coeficientes de tu modelo.</p>
                </div>
                <button 
                  onClick={reset}
                  className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-400 transition-all"
                >
                  <RefreshCcw className="w-5 h-5" />
                </button>
              </div>

              <div className="glass p-8 rounded-3xl space-y-12">
                {/* Objective Function */}
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold flex items-center gap-2 text-primary">
                    <LayoutDashboard className="w-5 h-5" />
                    Función Objetivo
                  </h3>
                  <div className="flex flex-wrap items-center gap-4 text-xl">
                    <span className="font-mono text-slate-400">Z = </span>
                    {objective.map((val, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <input
                          type="number"
                          value={val}
                          onChange={(e) => {
                            const newObj = [...objective];
                            newObj[i] = parseFloat(e.target.value) || 0;
                            setObjective(newObj);
                          }}
                          className="w-24 bg-white/5 border border-white/10 rounded-xl px-3 py-2 focus:border-primary outline-none transition-all text-center"
                        />
                        <span className="text-slate-400 font-mono">X<sub>{i + 1}</sub></span>
                        {i < objective.length - 1 && <span className="text-slate-600">+</span>}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Constraints */}
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold flex items-center gap-2 text-primary">
                    <Settings2 className="w-5 h-5" />
                    Restricciones
                  </h3>
                  <div className="space-y-6">
                    {constraints.map((c, i) => (
                      <div key={i} className="flex flex-wrap items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/10">
                        <span className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/10 text-xs text-slate-400">
                          R{i + 1}
                        </span>
                        {c.coeffs.map((val, j) => (
                          <div key={j} className="flex items-center gap-2">
                            <input
                              type="number"
                              value={val}
                              onChange={(e) => {
                                const newConstraints = [...constraints];
                                newConstraints[i].coeffs[j] = parseFloat(e.target.value) || 0;
                                setConstraints(newConstraints);
                              }}
                              className="w-20 bg-white/5 border border-white/10 rounded-xl px-2 py-2 focus:border-primary outline-none transition-all text-center"
                            />
                            <span className="text-slate-400 font-mono text-sm">X<sub>{j + 1}</sub></span>
                            {j < c.coeffs.length - 1 && <span className="text-slate-600">+</span>}
                          </div>
                        ))}
                        <select
                          value={c.op}
                          onChange={(e) => {
                            const newConstraints = [...constraints];
                            newConstraints[i].op = e.target.value;
                            setConstraints(newConstraints);
                          }}
                          className="bg-dark-bg border border-white/10 rounded-xl px-3 py-2 outline-none focus:border-primary cursor-pointer"
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
                          className="w-24 bg-white/5 border border-white/10 rounded-xl px-3 py-2 focus:border-primary outline-none transition-all text-center"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={handleSolve}
                  className="w-full py-4 bg-accent hover:opacity-90 text-dark-bg rounded-2xl font-bold transition-all shadow-lg shadow-accent/20 flex items-center justify-center gap-2"
                >
                  <Play className="w-5 h-5 fill-current" />
                  Resolver con Simplex
                </button>
              </div>
            </motion.div>
          )}

          {step === 3 && solution && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-12"
            >
              {solution.error ? (
                <div className="glass p-8 rounded-3xl border-red-500/50 flex items-center gap-4 text-red-400">
                  <AlertCircle className="w-12 h-12 shrink-0" />
                  <div>
                    <h3 className="text-xl font-bold">Error en el Cálculo</h3>
                    <p>{solution.error}</p>
                    <button onClick={reset} className="mt-4 text-sm underline opacity-70">Volver a intentar</button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-8">
                      <div className="glass p-8 rounded-3xl overflow-x-auto">
                        <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                          <CheckCircle2 className="w-6 h-6 text-accent" />
                          Resultado Final
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                          <div className="p-6 bg-white/5 rounded-2xl border border-white/10">
                            <span className="block text-sm text-slate-400 mb-1">Valor de Z</span>
                            <span className="text-3xl font-bold text-accent">
                              {solution.result.objectiveValue.toFixed(2)}
                            </span>
                          </div>
                          {solution.result.variables.map((val, i) => (
                            <div key={i} className="p-6 bg-white/5 rounded-2xl border border-white/10">
                              <span className="block text-sm text-slate-400 mb-1">X<sub>{i + 1}</sub></span>
                              <span className="text-3xl font-bold text-white">
                                {val.toFixed(2)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-6">
                        <h3 className="text-xl font-bold flex items-center gap-2">
                          <Info className="w-5 h-5 text-primary" />
                          Iteraciones del Método
                        </h3>
                        <div className="space-y-8">
                          {solution.tableaus.map((tableau, idx) => (
                            <div key={idx} className="glass p-6 rounded-2xl border border-white/5 overflow-hidden">
                              <div className="flex items-center justify-between mb-4">
                                <span className="text-sm font-semibold text-primary uppercase tracking-wider">
                                  {tableau.title}
                                </span>
                              </div>
                              <div className="overflow-x-auto">
                                <table className="w-full border-collapse text-sm text-center">
                                  <thead>
                                    <tr className="border-b border-white/10">
                                      <th className="p-3 text-slate-500 font-mono">Base</th>
                                      {tableau.headers.map((header, j) => (
                                        <th key={j} className="p-3 font-mono text-slate-300">
                                          {header}
                                        </th>
                                      ))}
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {tableau.data.map((row, i) => (
                                      <tr key={i} className={`border-b border-white/5 hover:bg-white/5 transition-colors ${i === tableau.data.length - 1 ? 'bg-primary/5 text-primary font-bold' : ''}`}>
                                        <td className="p-3 font-mono text-slate-400 border-r border-white/10">
                                          {i === tableau.data.length - 1 ? 'Z' : tableau.headers[tableau.basis[i]]}
                                        </td>
                                        {row.map((val, j) => (
                                          <td key={j} className={`p-3 font-mono ${j === row.length - 1 ? 'text-accent' : ''}`}>
                                            {val.toFixed(2)}
                                          </td>
                                        ))}
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="glass p-8 rounded-3xl sticky top-8">
                        <h4 className="font-bold mb-4 flex items-center gap-2 text-slate-300">
                          Resumen del Modelo
                        </h4>
                        <div className="space-y-4 text-sm text-slate-400">
                          <div className="flex justify-between py-2 border-b border-white/5">
                            <span>Tipo:</span>
                            <span className="text-white font-medium uppercase">{type}</span>
                          </div>
                          <div className="flex justify-between py-2 border-b border-white/5">
                            <span>Variables:</span>
                            <span className="text-white font-medium">{varCount}</span>
                          </div>
                          <div className="flex justify-between py-2 border-b border-white/5">
                            <span>Restricciones:</span>
                            <span className="text-white font-medium">{constCount}</span>
                          </div>
                        </div>
                        <button 
                          onClick={reset}
                          className="w-full mt-8 py-3 rounded-xl border border-white/10 hover:bg-white/5 transition-all flex items-center justify-center gap-2"
                        >
                          <RefreshCcw className="w-4 h-4" />
                          Nuevo Problema
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

      <footer className="relative z-10 py-12 border-t border-white/5 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-slate-500 text-sm">
            &copy; 2026 SimplexOptimizer Engine. Desarrollado con precisión matemática.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
