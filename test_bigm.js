import { SimplexSolver } from './src/logic/simplex.js';

console.log("--- TEST BIG M (Video Case) ---");
const objective = [8, 10];
const constraints = [
  { coeffs: [3, 9], op: '>=', constant: 100 },
  { coeffs: [8, 4], op: '>=', constant: 150 }
];

const solver = new SimplexSolver(objective, 2, constraints, 'min');
solver.solve();

console.log("Result:", JSON.stringify(solver.result, null, 2));
if (solver.error) console.log("Error:", solver.error);
console.log("Iterations:", solver.tableaus.length);
