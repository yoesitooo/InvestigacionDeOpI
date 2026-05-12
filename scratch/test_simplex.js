import { SimplexSolver, MValue } from '../src/logic/simplex.js';

const objective = [8, 72];
const variablesCount = 2;
const constraints = [
  { coeffs: [45, 56], op: '<=', constant: 54560 },
  { coeffs: [40, 58], op: '<=', constant: 50000 }
];
const type = 'max';
const method = 'simplex';

const solver = new SimplexSolver(objective, variablesCount, constraints, type, method);
solver.solve();

console.log("Error:", solver.error);
console.log("Result:", JSON.stringify(solver.result, null, 2));
console.log("Number of Tableaus:", solver.tableaus.length);
solver.tableaus.forEach((t, i) => {
  console.log(`Tableau ${i}: ${t.title}`);
  console.log("  Basis:", t.basis);
  console.log("  Zj:", t.zj.map(m => m.toString()));
  console.log("  Cj-Zj:", t.cj_zj.map(m => m.toString()));
});
