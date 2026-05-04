# SimplexOptimizer - Investigación de Operaciones I

Este proyecto es un sistema interactivo diseñado para modelar y resolver problemas reales de optimización lineal utilizando el método **Simplex de la Gran M**. Desarrollado como parte del curso de Investigación de Operaciones I.

## 🚀 Características
- **Método de la Gran M**: Resolución simbólica de problemas con restricciones `<=`, `>=` e `=`.
- **Análisis de Sensibilidad**: Cálculo de precios sombra y rangos de estabilidad.
- **Interfaz Premium**: Desarrollado con React, Tailwind CSS 4 y Framer Motion para una experiencia de usuario fluida y profesional.
- **Visualización Educativa**: Muestra cada iteración del tableau, incluyendo filas $Z_j$ y $C_j - Z_j$.

---

## 📝 Documentación del Proyecto

### 1. Planteamiento del Problema (Caso Real)
**Empresa**: EcoPlant Solutions.
**Contexto**: La empresa produce dos tipos de filtros de aire industriales: *Premium* (X1) y *Standard* (X2).
**Objetivo**: Maximizar la utilidad total diaria considerando limitaciones de recursos.
- Utilidad X1: $50
- Utilidad X2: $40

**Restricciones**:
1. **Mano de obra**: X1 requiere 2h, X2 requiere 1h. Disponibilidad: 100h/día.
2. **Materia Prima**: X1 requiere 1kg, X2 requiere 1kg. Disponibilidad: 80kg/día.
3. **Tiempo de Máquina**: X1 requiere 1h, X2 requiere 3h. Disponibilidad: 150h/día.

### 2. Formulación Matemática
**Función Objetivo**:
`Maximizar Z = 50X1 + 40X2`

**Sujeto a**:
1. `2X1 + 1X2 <= 100`
2. `1X1 + 1X2 <= 80`
3. `1X1 + 3X2 <= 150`
`X1, X2 >= 0`

### 3. Desarrollo del Software
- **Arquitectura**: Aplicación Web de una sola página (SPA).
- **Lógica**: Implementada en un módulo independiente de JavaScript (`src/logic/simplex.js`) que maneja aritmética simbólica para la variable 'M'.
- **Frontend**: React para el manejo de estado y componentes modulares.

### 4. Resultados y Análisis
El sistema proporciona la solución óptima y permite observar cómo los recursos (holguras) afectan la utilidad final. Los precios sombra indican cuánto aumentaría la utilidad por cada unidad adicional de recurso disponible.

---

## 🛠️ Instalación y Uso

1. Clonar el repositorio:
   ```bash
   git clone https://github.com/yoesitooo/InvestigacionDeOpI.git
   ```
2. Instalar dependencias:
   ```bash
   npm install
   ```
3. Ejecutar en desarrollo:
   ```bash
   npm run dev
   ```

---

## 🎓 Créditos
Desarrollado para la asignatura de **Investigación de Operaciones I**.
2026
