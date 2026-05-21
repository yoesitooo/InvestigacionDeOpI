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
    if (Math.abs(this.m - other.m) > 1e-10) {
      return this.m < other.m;
    }
    return this.real < other.real - 1e-10;
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
  constructor(objective, variablesCount, constraints, type = 'max', method = 'bigm') {
    this.objective = objective; 
    this.variablesCount = variablesCount;
    this.constraints = constraints; 
    this.type = type;
    this.method = method;
    this.tableaus = [];
    this.result = null;
    this.error = null;
    this.colNames = [];
    this.cj = []; 
    this.initialBasisCols = [];
  }

  normalizeConstraints() {
    this.constraints = this.constraints.map(c => {
      if (c.constant < 0) {
        return {
          coeffs: c.coeffs.map(v => v === 0 ? 0 : -v),
          op: c.op === '<=' ? '>=' : (c.op === '>=' ? '<=' : '='),
          constant: -c.constant
        };
      }
      return c;
    });
  }

  validateInputs() {
    // 1. Check objective function
    const isObjectiveZero = this.objective.every(v => Math.abs(v) < 1e-10);
    if (isObjectiveZero) {
      this.isTrivial = true;
    }

    // 2. Process constraints
    const activeConstraints = [];
    for (const c of this.constraints) {
      const isAllZeros = c.coeffs.every(v => Math.abs(v) < 1e-10);
      
      if (isAllZeros) {
        // Check if impossible: e.g., 0 >= 10 or 0 = 10
        let isImpossible = false;
        if (c.op === '>=' && c.constant > 1e-10) isImpossible = true;
        if (c.op === '=' && Math.abs(c.constant) > 1e-10) isImpossible = true;
        if (c.op === '<=' && c.constant < -1e-10) isImpossible = true;

        if (isImpossible) {
          throw new Error("ImmediateInfeasible");
        }
        // If not impossible, it's redundant (e.g., 0 <= 10), so we ignore it
        continue;
      }
      activeConstraints.push(c);
    }

    if (activeConstraints.length === 0 && !this.isTrivial) {
      // No valid constraints provided
      throw new Error("NoConstraints");
    }

    this.constraints = activeConstraints;
  }

  solve() {
    try {
      this.normalizeConstraints();
      this.validateInputs();
      
      if (this.isTrivial) {
        this.result = {
          variables: new Array(this.variablesCount).fill(0),
          objectiveValue: 0
        };
        this.tableaus = [];
        return;
      }

      let initialization;
      if (this.method === 'simplex') {
        initialization = this.initializeStandardSimplex();
      } else {
        initialization = this.initializeBigM();
      }
      
      const { matrix, basis, cj, colNames } = initialization;
      this.cj = cj;
      this.colNames = colNames;
      
      this.captureTableau(matrix, basis, "Tabla Inicial");

      const finalResult = this.runSimplex(matrix, basis);
      this.result = this.formatResult(finalResult.matrix, finalResult.basis);
      this.result.sensitivity = this.calculateSensitivity(finalResult.matrix, finalResult.basis);
      this.result.specialCases = this.detectSpecialCases(finalResult.matrix, finalResult.basis);
    } catch (err) {
      const knownErrors = ["Unbounded", "Infeasible", "ImmediateInfeasible", "MethodIncompatible", "NoConstraints"];
      if (!knownErrors.includes(err.message)) {
        console.error(err);
        this.error = "Error durante el cálculo. Revisa tus datos.";
      } else {
        if (err.message === "Unbounded") this.error = "El problema no tiene fin (No acotado).";
        else if (err.message === "Infeasible" || err.message === "ImmediateInfeasible") this.error = "El problema es infactible (No tiene solución).";
        else if (err.message === "MethodIncompatible") this.error = "El método Simplex Estándar solo soporta restricciones <=. Usa el método de la Gran M.";
        else if (err.message === "NoConstraints") this.error = "No se han ingresado restricciones válidas.";
      }
    }
  }

  initializeStandardSimplex() {
    // Check if all constraints are <=
    if (this.constraints.some(c => c.op !== '<=')) {
      throw new Error("MethodIncompatible");
    }

    let slacks = this.constraints.length;
    const totalVars = this.variablesCount + slacks;
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

    this.constraints.forEach((c, i) => {
      c.coeffs.forEach((val, j) => matrix[i][j] = val);
      matrix[i][cols - 1] = c.constant;

      matrix[i][slackIdx] = 1;
      cj[slackIdx] = new MValue(0, 0);
      colNames[slackIdx] = `S${slackIdx - this.variablesCount + 1}`;
      basis.push(slackIdx);
      this.initialBasisCols.push(slackIdx);
      slackIdx++;
    });

    return { matrix, basis, cj, colNames };
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
        this.initialBasisCols.push(slackIdx);
        slackIdx++;
      } else if (c.op === '>=') {
        matrix[i][surplusIdx] = -1;
        cj[surplusIdx] = new MValue(0, 0);
        colNames[surplusIdx] = `S${surplusIdx - this.variablesCount + 1}`;
        
        matrix[i][artificialIdx] = 1;
        cj[artificialIdx] = new MValue(0, this.type === 'min' ? 1 : -1);
        colNames[artificialIdx] = `A${artificialIdx - (this.variablesCount + slacks + surpluses) + 1}`;
        basis.push(artificialIdx);
        this.initialBasisCols.push(artificialIdx);
        artificialIdx++;
        surplusIdx++;
      } else if (c.op === '=') {
        matrix[i][artificialIdx] = 1;
        cj[artificialIdx] = new MValue(0, this.type === 'min' ? 1 : -1);
        colNames[artificialIdx] = `A${artificialIdx - (this.variablesCount + slacks + surpluses) + 1}`;
        basis.push(artificialIdx);
        this.initialBasisCols.push(artificialIdx);
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
    const maxIterations = 100;

    while (iterations < maxIterations) {
      const { cj_zj } = this.calculateZj(currentMatrix, currentBasis);
      
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
        const val = currentMatrix[i][pivotCol];
        if (val > 1e-10) {
          const ratio = currentMatrix[i][cols - 1] / val;
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

  detectSpecialCases(matrix, basis) {
    const cols = matrix[0].length;
    const cases = [];
    
    let isDegenerate = false;
    for (let i = 0; i < basis.length; i++) {
      if (Math.abs(matrix[i][cols - 1]) < 1e-8) {
        isDegenerate = true;
        break;
      }
    }
    if (isDegenerate) {
      cases.push({
        type: 'degeneracy',
        title: 'Solución Degenerada',
        description: 'Una o más variables básicas tienen valor cero. Esto explica por qué pueden aparecer filas con muchos ceros, ya que indica un vértice donde se cruzan más restricciones de las estrictamente necesarias.'
      });
    }

    const { cj_zj } = this.calculateZj(matrix, basis);
    let hasMultipleOptima = false;
    for (let j = 0; j < cols - 1; j++) {
      if (!basis.includes(j) && !this.colNames[j].startsWith('A')) {
        if (cj_zj[j].isZero()) {
          hasMultipleOptima = true;
          break;
        }
      }
    }
    if (hasMultipleOptima) {
      cases.push({
        type: 'multiple_optima',
        title: 'Múltiples Soluciones Óptimas',
        description: 'Existen variables no básicas con costo reducido cero, lo que significa que hay soluciones alternativas óptimas con el mismo valor de Z.'
      });
    }
    
    return cases;
  }

  calculateSensitivity(matrix, basis) {
    const rows = matrix.length;
    const cols = matrix[0].length;
    const { zj, cj_zj } = this.calculateZj(matrix, basis);
    
    const objSensitivity = [];
    for (let j = 0; j < this.variablesCount; j++) {
      let increase = Infinity;
      let decrease = Infinity;
      const basicRowIdx = basis.indexOf(j);
      
      if (basicRowIdx !== -1) {
        for (let k = 0; k < cols - 1; k++) {
          if (basis.includes(k) || this.colNames[k].startsWith('A')) continue;
          const a_ij = matrix[basicRowIdx][k];
          const cj_zj_val = cj_zj[k].real;
          
          if (a_ij > 1e-8) {
            if (this.type === 'max') {
              const val = -cj_zj_val / a_ij;
              if (val < decrease) decrease = val;
            } else {
              const val = cj_zj_val / a_ij;
              if (val < increase) increase = val;
            }
          } else if (a_ij < -1e-8) {
            if (this.type === 'max') {
              const val = cj_zj_val / a_ij;
              if (val < increase) increase = val;
            } else {
              const val = -cj_zj_val / a_ij;
              if (val < decrease) decrease = val;
            }
          }
        }
      } else {
        const cj_zj_val = cj_zj[j].real;
        if (this.type === 'max') {
          increase = -cj_zj_val;
          decrease = Infinity;
        } else {
          decrease = cj_zj_val;
          increase = Infinity;
        }
      }
      
      objSensitivity.push({
        variable: this.colNames[j],
        current: this.objective[j],
        increase: increase,
        decrease: decrease
      });
    }

    const rhsSensitivity = [];
    for (let i = 0; i < this.constraints.length; i++) {
      const b_inv_col = this.initialBasisCols[i];
      let increase = Infinity;
      let decrease = Infinity;
      
      for (let r = 0; r < rows; r++) {
        const a_ir = matrix[r][b_inv_col];
        const rhs_r = matrix[r][cols - 1];
        
        if (a_ir > 1e-8) {
          const val = rhs_r / a_ir;
          if (val < decrease) decrease = val;
        } else if (a_ir < -1e-8) {
          const val = -rhs_r / a_ir;
          if (val < increase) increase = val;
        }
      }
      
      rhsSensitivity.push({
        constraint: `R${i + 1}`,
        current: this.constraints[i].constant,
        shadowPrice: zj[b_inv_col].real,
        increase: increase,
        decrease: decrease
      });
    }
    
    return { objSensitivity, rhsSensitivity };
  }
}
