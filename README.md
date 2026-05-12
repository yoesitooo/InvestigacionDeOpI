<div align="center">
  
  # 🎯 SimplexOptimizer 
  ### *Investigación de Operaciones I*

  <p align="center">
    <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
    <img src="https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E" alt="Vite" />
    <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind" />
    <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript" />
  </p>
  
  <p align="center">
    <b>Sistema interactivo avanzado para la resolución de problemas de optimización lineal mediante el algoritmo de la Gran M.</b>
  </p>

</div>

---

## 🚀 Características Principales

*   ⚙️ **Algoritmo de la Gran M**: Implementación robusta que maneja variables artificiales simbólicas y restricciones mixtas (`<=`, `>=`, `=`).
*   📊 **Análisis de Sensibilidad**: Generación automática de Precios Sombra y Costos Reducidos para toma de decisiones empresariales.
*   🔄 **Dualidad**: Construcción y análisis del modelo matemático dual subyacente.
*   ✨ **Interfaz Premium**: Diseño *Glassmorphism* optimizado, animado con Framer Motion para una experiencia educativa inmersiva.

---

## 🛠️ Stack Tecnológico

A continuación, las herramientas y librerías clave utilizadas para el desarrollo de esta SPA (Single Page Application):

<div align="center">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" height="40" alt="react logo"  />
  <img width="12" />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" height="40" alt="javascript logo"  />
  <img width="12" />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original-wordmark.svg" height="40" alt="tailwindcss logo"  />
  <img width="12" />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" height="40" alt="nodejs logo"  />
</div>

---

## 📝 Documentación Académica (Caso Real)

### 1. Planteamiento del Problema
**Empresa**: EcoPlant Solutions.
**Contexto**: La empresa produce dos tipos de filtros de aire industriales: *Premium* (X1) y *Standard* (X2).
**Objetivo**: Maximizar la utilidad total diaria considerando limitaciones de recursos.

*   Utilidad X1: $50
*   Utilidad X2: $40

**Restricciones de Producción**:
1. **Mano de obra**: X1 requiere 2h, X2 requiere 1h. Disponibilidad: 100h/día.
2. **Materia Prima**: X1 requiere 1kg, X2 requiere 1kg. Disponibilidad: 80kg/día.
3. **Tiempo de Máquina**: X1 requiere 1h, X2 requiere 3h. Disponibilidad: 150h/día.

### 2. Formulación Matemática
**Función Objetivo**:  
`Maximizar Z = 50X1 + 40X2`

**Sujeto a**:
1. `2X1 + 1X2 <= 100` (Mano de obra)
2. `1X1 + 1X2 <= 80` (Materia prima)
3. `1X1 + 3X2 <= 150` (Máquina)
*Restricción de no negatividad:* `X1, X2 >= 0`

### 3. Resultados y Toma de Decisiones
El sistema proporciona la solución óptima iteración por iteración. Adicionalmente, el **análisis de sensibilidad** permite al gerente de EcoPlant saber exactamente cuánto estarían dispuestos a pagar por horas extras de mano de obra o kilogramos adicionales de materia prima (Precios Sombra).

---

## 💻 Instalación y Ejecución Local

Si deseas correr este proyecto en tu entorno local, sigue estos pasos:

1. **Clonar el repositorio**:
   ```bash
   git clone https://github.com/yoesitooo/InvestigacionDeOpI.git
   ```
2. **Navegar al directorio del proyecto**:
   ```bash
   cd InvestigacionDeOpI
   ```
3. **Instalar las dependencias**:
   ```bash
   npm install
   ```
4. **Levantar el servidor de desarrollo**:
   ```bash
   npm run dev
   ```

---

## 👥 Equipo de Desarrollo (Autores)

Este proyecto fue desarrollado en colaboración por el siguiente equipo de estudiantes para la asignatura de **Investigación de Operaciones I**:

*   👤 **Edgar Julian Roldan** 
*   👤 **Luis Fernando Lopez**
*   👤 **Jose David Cucanchon**
*   👤 **Alex Morales**
*   👤 **Jhoe Luis Miranda**

> **Nota**: Este proyecto tiene fines educativos y académicos. (2026)

<div align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=8b5cf6&height=100&section=footer" width="100%"/>
</div>
