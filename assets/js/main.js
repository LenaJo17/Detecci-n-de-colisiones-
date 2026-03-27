function initBounce(totalParticles, canvasId) {
    const canvas = document.getElementById(canvasId);
    const ctx = canvas.getContext('2d');

    let particles = [];
    let eliminatedCount = 0;
    let currentLevel = 1;
    let mouse = { x: 0, y: 0 };

    // --- NUEVA PALETA DE COLORES (Magenta/Morado) ---
    const baseColors = ['#b927fc', '#8a2be2', '#ff00ff']; // Morado Neón, Violeta, Magenta
    const hoverColor = '#ff66ff'; // Magenta brillante al detectar mouse

    // Detección de movimiento del mouse corregida
    canvas.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        mouse.x = (e.clientX - rect.left) * (canvas.width / rect.width);
        mouse.y = (e.clientY - rect.top) * (canvas.height / rect.height);
    });

    // Clic para explotar burbujas
    canvas.addEventListener('mousedown', () => {
        particles.forEach(p => {
            const dist = Math.hypot(p.x - mouse.x, p.y - mouse.y);
            // Si el mouse está sobre la burbuja y no está explotando
            if (dist < p.radius && !p.isExploding) {
                p.explode();
            }
        });
    });

    class Particle {
        constructor(id) {
            this.id = id;
            this.reset();
        }

        reset() {
            this.radius = Math.random() * 8 + 12; // Tamaño aleatorio
            this.isExploding = false;
            this.opacity = 1;
            this.x = Math.random() * canvas.width;
            this.y = canvas.height + 50; // Aparecen desde abajo
            
            // Velocidad base que aumenta con el nivel
            this.speed = (Math.random() * 0.5 + 0.5) * (1 + currentLevel * 0.3);
            
            this.vx = (Math.random() - 0.5) * 1.2; // Movimiento horizontal aleatorio
            this.color = baseColors[Math.floor(Math.random() * baseColors.length)];
        }

        explode() {
            this.isExploding = true;
            eliminatedCount++;
            // Cada 10 burbujas, sube de nivel
            if (eliminatedCount % 10 === 0) currentLevel++;
        }

        update() {
            if (this.isExploding) {
                // Efecto de explosión (crece y desaparece)
                this.radius += 2;
                this.opacity -= 0.05;
                if (this.opacity <= 0) this.reset(); // Reaparece
            } else {
                // Movimiento normal hacia arriba
                this.y -= this.speed;
                // Movimiento oscilante sutil
                this.x += Math.sin(this.y * 0.04) * this.vx;
                
                // Si sale de la pantalla, reaparece abajo
                if (this.y < -50) this.reset();
            }
            this.draw();
        }

        draw() {
            ctx.save();
            ctx.globalAlpha = this.opacity;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);

            const dist = Math.hypot(this.x - mouse.x, this.y - mouse.y);
            
            // Si el mouse está sobre la burbuja, cambia de color (feedback visual)
            if (dist < this.radius && !this.isExploding) {
                ctx.fillStyle = hoverColor; // Magenta brillante
                ctx.shadowBlur = 15;
                ctx.shadowColor = hoverColor;
            } else {
                // Color normal (relleno transparente y borde neón)
                ctx.fillStyle = this.color + '55'; // Agrega transparencia al relleno
                ctx.strokeStyle = this.color;     // Borde neón
                ctx.lineWidth = 2;
                ctx.stroke();
            }
            ctx.fill();
            
            // Dibuja el ID (número) dentro de la burbuja
            if (!this.isExploding) {
                ctx.fillStyle = "white";
                ctx.font = "bold 10px sans-serif";
                ctx.textAlign = "center";
                ctx.fillText(this.id, this.x, this.y + 4);
            }
            ctx.restore();
        }
    }

    // Crear las partículas iniciales
    for (let i = 1; i <= totalParticles; i++) {
        particles.push(new Particle(i));
    }

    // Función principal de animación
    function animate() {
        // Limpiar el canvas en cada frame
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Actualizar y dibujar cada partícula
        particles.forEach(p => p.update());
        
        // Dibuja el marcador superior (Estadísticas)
        ctx.fillStyle = "#ff00ff"; // Texto Magenta
        ctx.font = "bold 12px monospace";
        const progress = (eliminatedCount % 10) * 10;
        ctx.fillText(`> ELIMINATED: ${eliminatedCount} | LEVEL: ${currentLevel.toString().padStart(2, '0')} | PROGRESS: ${progress}%`, 20, 30);
        
        // Solicitar el siguiente frame
        requestAnimationFrame(animate);
    }

    // Iniciar la animación
    animate();
}