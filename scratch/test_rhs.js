import { SimplexSolver } from '../src/logic/simplex.js';

const objective = [3, 5];
const variablesCount = 2;
const constraints = [
  { coeffs: [1, 2], op: '<=', constant: -10 }, // Should become -X1 - 2X2 >= 10
  { coeffs: [1, 1], op: '<=', constant: 20 }
];
const type = 'max';
const method = 'bigm';

const solver = new SimplexSolver(objective, variablesCount, constraints, type, method);
solver.solve();

console.log("Normalized Constraints:", JSON.stringify(solver.constraints, null, 2));
console.log("Error:", solver.error);
console.log("Result:", JSON.stringify(solver.result, null, 2));
