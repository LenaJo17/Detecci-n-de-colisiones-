# 🚀 Detección de Colisiones - Simulación en Canvas

## 📌 Descripción
Este proyecto es una **simulación interactiva de colisiones** desarrollada con **HTML, CSS y JavaScript**, utilizando el elemento `<canvas>` para representar partículas en movimiento.

El sistema permite visualizar **burbujas dinámicas** que reaccionan al usuario mediante el mouse, incluyendo efectos de colisión, explosión y progresión por niveles.

---

## 🎮 Características principales

- ✨ Animación fluida en tiempo real con `requestAnimationFrame`
- 🟣 Diseño moderno tipo **Glassmorphism + estilo cyberpunk**
- 🖱️ Interacción con el mouse:
  - Hover: cambia el color de las partículas
  - Click: explotan las burbujas
- 📊 Sistema de progreso:
  - Conteo de partículas eliminadas
  - Porcentaje de avance
  - Niveles cada 10 eliminaciones
- ⚡ Aumento de dificultad dinámico (velocidad por nivel)
- 🎨 Efectos visuales:
  - Transparencias
  - Sombras neón
  - Animación tipo "shine"

---

## 🗂️ Estructura del proyecto
DETECCIÓN DE COLISIONES/
│
├── index.html
├── README.md
│
└── assets/
    ├── css/
    │   └── styles.css
    │
    ├── img/
    │   ├── fondo_cyber.png
    │   └── globos.png
    │
    └── js/
        └── main.js
 
---

## ⚙️ Tecnologías utilizadas

- **HTML5** → Estructura de la aplicación  
- **CSS3** → Estilos avanzados (Glassmorphism, efectos visuales)  
- **JavaScript (Vanilla)** → Lógica, animación y física básica  
- **Canvas API** → Renderizado de partículas  
- **Bootstrap 5** → Diseño base y responsividad  
- **Google Fonts (JetBrains Mono)** → Tipografía moderna  

---

## 🧠 Funcionamiento

### 🔵 Partículas
Cada burbuja es un objeto de la clase `Particle` con propiedades como:
- Posición `(x, y)`
- Velocidad
- Radio
- Opacidad
- Estado (normal o explotando)

### 💥 Explosión
Cuando el usuario hace clic sobre una partícula:
- Aumenta su tamaño
- Disminuye su opacidad
- Se reinicia al desaparecer

### 📈 Sistema de niveles
- Cada 10 partículas eliminadas:
  - Se incrementa el nivel
  - Aumenta la velocidad de las partículas

---

## 🕹️ Cómo usar

1. Abre el archivo `index.html` en tu navegador
2. Observa las partículas en movimiento
3. Interactúa:
   - Mueve el mouse sobre ellas
   - Haz clic para eliminarlas
4. Observa el progreso en la parte superior

---

## 🎨 Personalización

Puedes modificar fácilmente:

### 🎯 Cantidad de partículas
```js
initBounce(15, "canvas");
🎨 Colores
const baseColors = ['#b927fc', '#8a2be2', '#ff00ff'];
⚡ Velocidad
this.speed = (Math.random() * 0.5 + 0.5) * (1 + currentLevel * 0.3);
👩‍💻 Autor

Jolette Ochoa
📅 2026
💻 Aplicación Canvas 2D • Graficación