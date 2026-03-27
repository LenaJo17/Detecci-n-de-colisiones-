/**
 * Simulación de Burbujas - Lógica de Niveles y Movimiento Aleatorio
 */
function initBounce(totalParticles, canvasId) {
    const canvas = document.getElementById(canvasId);
    const ctx = canvas.getContext('2d');

    let particles = [];
    let eliminatedCount = 0;
    let currentLevel = 1;
    let mouse = { x: 0, y: 0 };

    const baseColors = ['#00f2fe', '#00c3ff', '#00d4ff'];
    const hoverColor = '#b927fc'; // Morado al detectar mouse

    // 1. Detección de coordenadas con corrección de escala
    canvas.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        mouse.x = (e.clientX - rect.left) * (canvas.width / rect.width);
        mouse.y = (e.clientY - rect.top) * (canvas.height / rect.height);
    });

    // 2. Clic para explotar (Desaparición lenta)
    canvas.addEventListener('mousedown', () => {
        particles.forEach(p => {
            const dist = Math.hypot(p.x - mouse.x, p.y - mouse.y);
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
            this.radius = Math.random() * 10 + 12;
            this.isExploding = false;
            this.opacity = 1;
            
            // Inicio: Fuera de la pantalla abajo
            this.x = Math.random() * canvas.width;
            this.y = canvas.height + this.radius + Math.random() * 50;
            
            // Movimiento: Hacia arriba con velocidad según el nivel
            this.baseSpeed = 0.5 + (currentLevel * 0.4); 
            this.vy = -this.baseSpeed;
            
            // Viaje aleatorio: Oscilación lateral
            this.randomXFactor = (Math.random() - 0.5) * 1.5;
            
            this.color = baseColors[Math.floor(Math.random() * baseColors.length)];
        }

        explode() {
            this.isExploding = true;
            eliminatedCount++;
            
            // Lógica de Niveles: Grupos de 10
            if (eliminatedCount % 10 === 0) {
                currentLevel++;
            }
        }

        update() {
            if (this.isExploding) {
                this.radius += 1.2; // Expansión de burbuja
                this.opacity -= 0.03; // Desvanecimiento lento
                if (this.opacity <= 0) this.reset();
            } else {
                this.y += this.vy;
                // "Viaje aleatorio": se mueve un poco de lado a lado
                this.x += Math.sin(this.y * 0.05) * this.randomXFactor;

                // Si termina de subir y sale del canvas, reinicia abajo
                if (this.y + this.radius < -20) {
                    this.reset();
                }
            }
            this.draw();
        }

        draw() {
            ctx.save();
            ctx.globalAlpha = this.opacity;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);

            const dist = Math.hypot(this.x - mouse.x, this.y - mouse.y);
            
            // Cambio de color a MORADO al detectar mouse
            if (dist < this.radius && !this.isExploding) {
                ctx.fillStyle = hoverColor;
                ctx.shadowBlur = 15;
                ctx.shadowColor = hoverColor;
            } else {
                ctx.fillStyle = this.color + '66'; // Transparencia glass
                ctx.strokeStyle = this.color;
                ctx.lineWidth = 1.5;
                ctx.stroke();
            }

            ctx.fill();
            
            if (!this.isExploding) {
                ctx.fillStyle = "#fff";
                ctx.font = "10px monospace";
                ctx.textAlign = "center";
                ctx.fillText(this.id, this.x, this.y + 4);
            }
            ctx.restore();
        }
    }

    // Inicializar elementos
    for (let i = 1; i <= 15; i++) {
        particles.push(new Particle(i));
    }

    // Mostrar estadísticas: Numérica y Porcentual
    function drawStats() {
        ctx.fillStyle = "#00f2fe";
        ctx.font = "bold 12px monospace";
        
        // El porcentaje se calcula en base al grupo de 10 del nivel actual
        const levelProgress = (eliminatedCount % 10) * 10; 

        ctx.fillText(`> ELIMINATED: ${eliminatedCount} units`, 20, 30);
        ctx.fillText(`> LEVEL PROGRESS: ${levelProgress}%`, 20, 50);
        ctx.fillText(`> CURRENT LEVEL: ${currentLevel.toString().padStart(2, '0')}`, 20, 70);
        ctx.fillText(`> VELOCITY_INDEX: x${(1 + currentLevel * 0.4).toFixed(1)}`, 20, 90);
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => p.update());
        drawStats();
        requestAnimationFrame(animate);
    }

    animate();
}