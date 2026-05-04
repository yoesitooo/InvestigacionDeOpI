/**
 * Simplex Algorithm Implementation (Two-Phase Method)
 * Handles Maximization, Minimization, and all types of constraints (<=, >=, =)
 */

export class SimplexSolver {
  constructor(objective, variablesCount, constraints, type = 'max') {
    this.objective = objective; 
    this.variablesCount = variablesCount;
    this.constraints = constraints; 
    this.type = type;
    this.tableaus = [];
    this.result = null;
    this.error = null;
    this.colNames = [];
  }

  solve() {
    try {
      // 1. Initialize Phase 1
      const initData = this.initializePhase1();
      let { matrix, basis, artificialVars, totalVars } = initData;
      
      this.colNames = this.generateColNames(totalVars);
      this.captureTableau(matrix, basis, "Estado Inicial (Fase 1)");

      // Phase 1: Eliminate Artificial Variables
      if (artificialVars.length > 0) {
        const phase1Result = this.runSimplex(matrix, basis, true);
        matrix = phase1Result.matrix;
        basis = phase1Result.basis;

        // Check if sum of artificial variables is zero
        const objectiveValue = matrix[matrix.length - 1][matrix[0].length - 1];
        if (Math.abs(objectiveValue) > 1e-6) {
          this.error = "El problema es infactible (No se pudieron eliminar las variables artificiales).";
          return;
        }

        // Prepare for Phase 2: Remove artificial columns and restore original objective
        matrix = this.preparePhase2(matrix, basis, artificialVars);
        totalVars -= artificialVars.length;
        this.colNames = this.generateColNames(totalVars);
      } else {
        // No artificial variables, just prepare Phase 2 directly
        matrix = this.preparePhase2(matrix, basis, []);
      }

      this.captureTableau(matrix, basis, "Estado Inicial (Fase 2)");

      // Phase 2: Solve Original Objective
      const finalResult = this.runSimplex(matrix, basis, false);
      this.result = this.formatResult(finalResult.matrix, finalResult.basis);
    } catch (err) {
      if (err.message !== "Unbounded" && err.message !== "Infeasible") {
        console.error(err);
        this.error = "Error durante el cálculo. Revisa tus datos.";
      } else {
        this.error = err.message === "Unbounded" ? "El problema no tiene fin (No acotado)." : err.message;
      }
    }
  }

  generateColNames(total) {
    const names = [];
    for (let i = 0; i < total; i++) {
      if (i < this.variablesCount) names.push(`X${i + 1}`);
      else names.push(`S${i - this.variablesCount + 1}`);
    }
    names.push("RHS");
    return names;
  }

  initializePhase1() {
    let slacks = 0;
    let surpluses = 0;
    let artificials = 0;

    this.constraints.forEach(c => {
      if (c.op === '<=') slacks++;
      else if (c.op === '>=') { surpluses++; artificials++; }
      else if (c.op === '=') artificials++;
    });

    const totalVars = this.variablesCount + slacks + surpluses + artificials;
    const rows = this.constraints.length + 1;
    const cols = totalVars + 1;

    const matrix = Array.from({ length: rows }, () => Array(cols).fill(0));
    const basis = [];
    const artificialVars = [];

    let slackIdx = this.variablesCount;
    let surplusIdx = this.variablesCount + slacks;
    let artificialIdx = this.variablesCount + slacks + surpluses;

    this.constraints.forEach((c, i) => {
      c.coeffs.forEach((val, j) => matrix[i][j] = val);
      matrix[i][cols - 1] = c.constant;

      if (c.op === '<=') {
        matrix[i][slackIdx++] = 1;
        basis.push(slackIdx - 1);
      } else if (c.op === '>=') {
        matrix[i][surplusIdx++] = -1;
        matrix[i][artificialIdx++] = 1;
        basis.push(artificialIdx - 1);
        artificialVars.push(artificialIdx - 1);
      } else if (c.op === '=') {
        matrix[i][artificialIdx++] = 1;
        basis.push(artificialIdx - 1);
        artificialVars.push(artificialIdx - 1);
      }
    });

    // Objective Phase 1: Minimize sum of A_i
    artificialVars.forEach(idx => {
      matrix[rows - 1][idx] = 1;
    });

    // Make basis canonical for Phase 1 Objective
    artificialVars.forEach(idx => {
      const rowIdx = basis.indexOf(idx);
      const factor = -1;
      for (let j = 0; j < cols; j++) {
        matrix[rows - 1][j] += factor * matrix[rowIdx][j];
      }
    });

    return { matrix, basis, artificialVars, totalVars };
  }

  preparePhase2(matrix, basis, artificialVars) {
    const rows = matrix.length;
    const oldCols = matrix[0].length;
    const newCols = oldCols - artificialVars.length;
    
    const newMatrix = Array.from({ length: rows }, () => Array(newCols).fill(0));
    const artSet = new Set(artificialVars);
    
    // Copy all rows except objective
    for (let i = 0; i < rows - 1; i++) {
      let targetJ = 0;
      for (let j = 0; j < oldCols; j++) {
        if (!artSet.has(j)) {
          newMatrix[i][targetJ++] = matrix[i][j];
        }
      }
    }

    // Prepare New Objective Row
    const multiplier = this.type === 'max' ? -1 : 1;
    for (let j = 0; j < this.variablesCount; j++) {
      newMatrix[rows - 1][j] = this.objective[j] * multiplier;
    }

    // Adjust Basis indices if artificial variables were before some other variables
    // In our implementation, artificial variables are at the end, so removing them doesn't shift others.
    // However, if we remove columns, we must ensure 'basis' indices are still valid for the new columns.
    // Our surplus variables come before artificials, so they are fine.

    // Make basis canonical for Phase 2 Objective
    for (let i = 0; i < rows - 1; i++) {
      const varInBasis = basis[i];
      const factor = newMatrix[rows - 1][varInBasis];
      for (let j = 0; j < newCols; j++) {
        newMatrix[rows - 1][j] -= factor * newMatrix[i][j];
      }
    }

    return newMatrix;
  }

  runSimplex(matrix, basis, isPhase1) {
    let currentMatrix = matrix.map(row => [...row]);
    let currentBasis = [...basis];
    const rows = currentMatrix.length;
    const cols = currentMatrix[0].length;

    let iterations = 0;
    const maxIterations = 50;

    while (iterations < maxIterations) {
      let pivotCol = -1;
      let minVal = -1e-9;
      for (let j = 0; j < cols - 1; j++) {
        if (currentMatrix[rows - 1][j] < minVal) {
          minVal = currentMatrix[rows - 1][j];
          pivotCol = j;
        }
      }

      if (pivotCol === -1) break;

      let pivotRow = -1;
      let minRatio = Infinity;
      for (let i = 0; i < rows - 1; i++) {
        if (currentMatrix[i][pivotCol] > 1e-9) {
          const ratio = currentMatrix[i][cols - 1] / currentMatrix[i][pivotCol];
          if (ratio < minRatio) {
            minRatio = ratio;
            pivotRow = i;
          }
        }
      }

      if (pivotRow === -1) {
        throw new Error("Unbounded");
      }

      this.performPivot(currentMatrix, pivotRow, pivotCol);
      currentBasis[pivotRow] = pivotCol;
      
      this.captureTableau(currentMatrix, currentBasis, `Iteración ${iterations + 1} (${isPhase1 ? 'Fase 1' : 'Fase 2'})`);
      iterations++;
    }

    return { matrix: currentMatrix, basis: currentBasis };
  }

  performPivot(matrix, row, col) {
    const rows = matrix.length;
    const cols = matrix[0].length;
    const divisor = matrix[row][col];

    for (let j = 0; j < cols; j++) {
      matrix[row][j] /= divisor;
    }

    for (let i = 0; i < rows; i++) {
      if (i !== row) {
        const factor = matrix[i][col];
        for (let j = 0; j < cols; j++) {
          matrix[i][j] -= factor * matrix[row][j];
        }
      }
    }
  }

  captureTableau(matrix, basis, title) {
    this.tableaus.push({
      title,
      data: matrix.map(row => row.map(v => Math.abs(v) < 1e-10 ? 0 : v)),
      basis: [...basis],
      headers: [...this.colNames]
    });
  }

  formatResult(matrix, basis) {
    const rows = matrix.length;
    const cols = matrix[0].length;
    const values = Array(this.variablesCount).fill(0);
    
    basis.forEach((varIdx, rowIdx) => {
      if (varIdx < this.variablesCount) {
        values[varIdx] = matrix[rowIdx][cols - 1];
      }
    });

    const objectiveValue = matrix[rows - 1][cols - 1] * (this.type === 'max' ? 1 : -1);

    return {
      variables: values,
      objectiveValue: objectiveValue
    };
  }
}
