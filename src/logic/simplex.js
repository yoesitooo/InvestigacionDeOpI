/**
 * Simplex Algorithm Implementation (Big M Method)
 * Handles Maximization, Minimization, and all types of constraints (<=, >=, =)
 */

export class MValue {
  constructor(real = 0, m = 0) {
    this.real = real;
    this.m = m;
  }

  add(other) {
    return new MValue(this.real + other.real, this.m + other.m);
  }

  sub(other) {
    return new MValue(this.real - other.real, this.m - other.m);
  }

  mul(scalar) {
    return new MValue(this.real * scalar, this.m * scalar);
  }

  div(scalar) {
    if (Math.abs(scalar) < 1e-10) return new MValue(0, 0);
    return new MValue(this.real / scalar, this.m / scalar);
  }

  isLessThan(other) {
    if (Math.abs(this.m - other.m) > 1e-9) {
      return this.m < other.m;
    }
    return this.real < other.real - 1e-9;
  }

  isZero() {
    return Math.abs(this.real) < 1e-9 && Math.abs(this.m) < 1e-9;
  }

  toString() {
    if (Math.abs(this.m) < 1e-9) return this.real.toFixed(2);
    const mStr = Math.abs(this.m) === 1 ? 'M' : `${this.m.toFixed(2)}M`;
    if (Math.abs(this.real) < 1e-9) return this.m < 0 ? `-${mStr}` : mStr;
    const sign = this.m < 0 ? '-' : '+';
    return `${this.real.toFixed(2)} ${sign} ${mStr.replace('-', '')}`;
  }
  
  toValue(mLarge = 1e10) {
    return this.real + this.m * mLarge;
  }
}

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
    this.cj = []; 
  }

  solve() {
    try {
      const { matrix, basis, cj, colNames } = this.initializeBigM();
      this.cj = cj;
      this.colNames = colNames;
      
      this.captureTableau(matrix, basis, "Tabla Inicial");

      const finalResult = this.runSimplex(matrix, basis);
      this.result = this.formatResult(finalResult.matrix, finalResult.basis);
      this.result.sensitivity = this.calculateSensitivity(finalResult.matrix, finalResult.basis);
    } catch (err) {
      if (err.message !== "Unbounded" && err.message !== "Infeasible") {
        console.error(err);
        this.error = "Error durante el cálculo. Revisa tus datos.";
      } else {
        this.error = err.message === "Unbounded" ? "El problema no tiene fin (No acotado)." : "El problema es infactible.";
      }
    }
  }

  initializeBigM() {
    let slacks = 0;
    let surpluses = 0;
    let artificials = 0;

    this.constraints.forEach(c => {
      if (c.op === '<=') slacks++;
      else if (c.op === '>=') { surpluses++; artificials++; }
      else if (c.op === '=') artificials++;
    });

    const totalVars = this.variablesCount + slacks + surpluses + artificials;
    const rows = this.constraints.length;
    const cols = totalVars + 1;

    const matrix = Array.from({ length: rows }, () => Array(cols).fill(0));
    const basis = [];
    const cj = new Array(totalVars).fill(new MValue(0, 0));
    const colNames = [];

    for (let j = 0; j < this.variablesCount; j++) {
      cj[j] = new MValue(this.objective[j], 0);
      colNames.push(`X${j + 1}`);
    }

    let slackIdx = this.variablesCount;
    let surplusIdx = this.variablesCount + slacks;
    let artificialIdx = this.variablesCount + slacks + surpluses;

    this.constraints.forEach((c, i) => {
      c.coeffs.forEach((val, j) => matrix[i][j] = val);
      matrix[i][cols - 1] = c.constant;

      if (c.op === '<=') {
        matrix[i][slackIdx] = 1;
        cj[slackIdx] = new MValue(0, 0);
        colNames[slackIdx] = `S${slackIdx - this.variablesCount + 1}`;
        basis.push(slackIdx);
        slackIdx++;
      } else if (c.op === '>=') {
        matrix[i][surplusIdx] = -1;
        cj[surplusIdx] = new MValue(0, 0);
        colNames[surplusIdx] = `S${surplusIdx - this.variablesCount + 1}`;
        
        matrix[i][artificialIdx] = 1;
        cj[artificialIdx] = new MValue(0, this.type === 'min' ? 1 : -1);
        colNames[artificialIdx] = `A${artificialIdx - (this.variablesCount + slacks + surpluses) + 1}`;
        basis.push(artificialIdx);
        artificialIdx++;
        surplusIdx++;
      } else if (c.op === '=') {
        matrix[i][artificialIdx] = 1;
        cj[artificialIdx] = new MValue(0, this.type === 'min' ? 1 : -1);
        colNames[artificialIdx] = `A${artificialIdx - (this.variablesCount + slacks + surpluses) + 1}`;
        basis.push(artificialIdx);
        artificialIdx++;
      }
    });

    return { matrix, basis, cj, colNames };
  }

  runSimplex(matrix, basis) {
    let currentMatrix = matrix.map(row => [...row]);
    let currentBasis = [...basis];
    const rows = currentMatrix.length;
    const cols = currentMatrix[0].length;

    let iterations = 0;
    const maxIterations = 50;

    while (iterations < maxIterations) {
      const { zj, cj_zj } = this.calculateZj(currentMatrix, currentBasis);
      
      let pivotCol = -1;
      if (this.type === 'max') {
        let maxVal = new MValue(1e-9, 0);
        for (let j = 0; j < cols - 1; j++) {
          if (maxVal.isLessThan(cj_zj[j])) {
            maxVal = cj_zj[j];
            pivotCol = j;
          }
        }
      } else {
        let minVal = new MValue(-1e-9, 0);
        for (let j = 0; j < cols - 1; j++) {
          if (cj_zj[j].isLessThan(minVal)) {
            minVal = cj_zj[j];
            pivotCol = j;
          }
        }
      }

      if (pivotCol === -1) break;

      let pivotRow = -1;
      let minRatio = Infinity;
      for (let i = 0; i < rows; i++) {
        if (currentMatrix[i][pivotCol] > 1e-9) {
          const ratio = currentMatrix[i][cols - 1] / currentMatrix[i][pivotCol];
          if (ratio < minRatio) {
            minRatio = ratio;
            pivotRow = i;
          }
        }
      }

      if (pivotRow === -1) throw new Error("Unbounded");

      this.performPivot(currentMatrix, pivotRow, pivotCol);
      currentBasis[pivotRow] = pivotCol;
      
      iterations++;
      this.captureTableau(currentMatrix, currentBasis, `Iteración ${iterations}`);
    }

    currentBasis.forEach((varIdx, rowIdx) => {
      if (this.colNames[varIdx].startsWith('A') && Math.abs(currentMatrix[rowIdx][cols - 1]) > 1e-6) {
        throw new Error("Infeasible");
      }
    });

    return { matrix: currentMatrix, basis: currentBasis };
  }

  calculateZj(matrix, basis) {
    const cols = matrix[0].length;
    const zj = new Array(cols).fill(new MValue(0, 0));
    
    for (let j = 0; j < cols; j++) {
      let sum = new MValue(0, 0);
      basis.forEach((varIdx, i) => {
        const cb = this.cj[varIdx] || new MValue(0, 0);
        sum = sum.add(cb.mul(matrix[i][j]));
      });
      zj[j] = sum;
    }

    const cj_zj = zj.slice(0, cols - 1).map((val, j) => this.cj[j].sub(val));
    return { zj, cj_zj };
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
    const { zj, cj_zj } = this.calculateZj(matrix, basis);
    this.tableaus.push({
      title,
      matrix: matrix.map(row => [...row]),
      basis: [...basis],
      zj: [...zj],
      cj_zj: [...cj_zj],
      cj: [...this.cj],
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

    const { zj } = this.calculateZj(matrix, basis);
    const objectiveValue = zj[cols - 1].real;

    return {
      variables: values,
      objectiveValue: objectiveValue
    };
  }

  calculateSensitivity(matrix, basis) {
    const { zj, cj_zj } = this.calculateZj(matrix, basis);
    const shadowPrices = [];
    const reducedCosts = [];

    this.colNames.forEach((name, j) => {
      if (name.startsWith('S')) {
        // Shadow Price is Zj for slack variables
        shadowPrices.push({ name, value: Math.abs(zj[j].real) });
      } else if (name.startsWith('X')) {
        // Reduced Cost is Cj - Zj
        reducedCosts.push({ name, value: cj_zj[j].real });
      }
    });

    return { shadowPrices, reducedCosts };
  }

  getDual() {
    // Basic dual construction info
    return {
      objective: this.constraints.map(c => c.constant),
      constraints: this.objective.map((val, i) => ({
        coeffs: this.constraints.map(c => c.coeffs[i]),
        op: this.type === 'max' ? '>=' : '<=',
        constant: val
      })),
      type: this.type === 'max' ? 'min' : 'max'
    };
  }
}
