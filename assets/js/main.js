let anim3;

function initBounce(N, canvasId) {
    if (anim3) cancelAnimationFrame(anim3);

    const canvas = document.getElementById(canvasId);
    const ctx = canvas.getContext("2d");
    const w = canvas.width;
    const h = canvas.height;

    let bubbles = [];
    let particles = []; 
    let eliminados = 0;
    let nivel = 1;
    let mouse = { x: 0, y: 0 };

    canvas.addEventListener("mousemove", e => {
        const rect = canvas.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
    });

    canvas.addEventListener("mousedown", () => {
        bubbles.forEach(b => {
            let dx = mouse.x - b.x;
            let dy = mouse.y - b.y;
            let dist = Math.sqrt(dx*dx + dy*dy);
            if (dist < b.r && !b.dying) {
                b.dying = true;
                createExplosion(b.x, b.y, b.baseColor);
            }
        });
    });

    function randomColor() {
        const colors = ['#00f2fe', '#4facfe', '#7000ff', '#00d4ff'];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    function createExplosion(x, y, color) {
        for (let i = 0; i < 12; i++) {
            particles.push({
                x: x, y: y,
                vx: (Math.random() - 0.5) * 12, 
                vy: (Math.random() - 0.5) * 12,
                r: Math.random() * 2 + 1,
                alpha: 1,
                color: color
            });
        }
    }

    function createBubble(id) {
        let factorDificultad = 1 + (nivel - 1) * 0.4;
        return {
            x: Math.random() * w,
            y: h + 50,
            r: 15 + Math.random() * 10,
            speedY: -(Math.random() * 1.0 + 0.5) * factorDificultad,
            amplitudeX: (Math.random() * 1.5 + 0.5) * factorDificultad,
            angle: Math.random() * Math.PI * 2,
            baseColor: randomColor(),
            id: id, alpha: 1, dying: false
        };
    }

    for (let i = 0; i < N; i++) bubbles.push(createBubble(i + 1));

    function drawBubble(b) {
        ctx.save();
        ctx.shadowBlur = 15;
        ctx.shadowColor = b.baseColor;
        ctx.globalAlpha = b.alpha;

        ctx.strokeStyle = b.isHovered ? "#fff" : b.baseColor;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
        ctx.stroke();

        let gradient = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.r);
        gradient.addColorStop(0, "rgba(255, 255, 255, 0.2)");
        gradient.addColorStop(1, "rgba(0, 0, 0, 0.1)");
        ctx.fillStyle = gradient;
        ctx.fill();

        ctx.beginPath();
        ctx.ellipse(b.x - b.r*0.3, b.y - b.r*0.3, b.r*0.2, b.r*0.1, Math.PI/4, 0, Math.PI*2);
        ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
        ctx.fill();

        ctx.shadowBlur = 0;
        ctx.fillStyle = "#fff";
        ctx.font = "bold 10px monospace";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(b.id, b.x, b.y);
        ctx.restore();
    }

    function animate() {
        anim3 = requestAnimationFrame(animate);
        ctx.clearRect(0, 0, w, h);

        particles.forEach((p, i) => {
            p.x += p.vx; p.y += p.vy; p.alpha -= 0.04;
            if (p.alpha <= 0) particles.splice(i, 1);
            else {
                ctx.save();
                ctx.shadowBlur = 10;
                ctx.shadowColor = p.color;
                ctx.globalAlpha = p.alpha;
                ctx.fillStyle = "#fff";
                ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill();
                ctx.restore();
            }
        });

        bubbles.forEach((b, i) => {
            let dx = mouse.x - b.x; let dy = mouse.y - b.y;
            b.isHovered = (Math.sqrt(dx*dx + dy*dy) < b.r);

            if (b.dying) {
                eliminados++;
                if (eliminados % 10 === 0 && eliminados !== 0) nivel++;
                bubbles[i] = createBubble(b.id); 
            } else {
                b.y += b.speedY;
                b.x += Math.sin(b.angle) * b.amplitudeX;
                b.angle += 0.06;
                if (b.y < -b.r) bubbles[i] = createBubble(b.id);
                drawBubble(b);
            }
        });

        ctx.save();
        ctx.fillStyle = "#00f2fe";
        ctx.font = "12px monospace";
        ctx.shadowBlur = 8;
        ctx.shadowColor = "#00f2fe";
        ctx.fillText(`> ELIMINATED: ${eliminados} | LEVEL: 0${nivel}`, 15, 30);
        ctx.restore();
    }

    animate();
}