document.addEventListener('DOMContentLoaded', () => {
    
    // =========================================
    // 1. SISTEMA DE NAVEGACIÓN SPA (Sin recarga)
    // =========================================
    const navLinks = document.querySelectorAll('.nav-link');
    const pages = document.querySelectorAll('.page');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('data-page');

            if(document.getElementById(targetId).classList.contains('active')) return;

            // Actualizar enlaces
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');

            // Transición suave de páginas
            const currentPage = document.querySelector('.page.active');
            const nextPage = document.getElementById(targetId);

            // Animación de salida
            currentPage.style.opacity = '0';
            currentPage.style.transform = 'translateY(-20px)';
            
            setTimeout(() => {
                currentPage.classList.remove('active');
                currentPage.style = ''; // Limpiar estilos inline
                
                nextPage.classList.add('active');
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }, 300);
        });
    });

    // =========================================
    // 2. FONDO DE PARTÍCULAS (CANVAS)
    // =========================================
    const canvas = document.getElementById('bg-canvas');
    const ctx = canvas.getContext('2d');
    
    let particles = [];
    
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.vx = (Math.random() - 0.5) * 0.5; // Velocidad lenta
            this.vy = (Math.random() - 0.5) * 0.5;
            this.size = Math.random() * 2;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            // Rebotar en bordes
            if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
            if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
        }

        draw() {
            ctx.fillStyle = 'rgba(0, 243, 255, 0.5)';
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    // Crear partículas
    for (let i = 0; i < 60; i++) { // 60 partículas
        particles.push(new Particle());
    }

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();

            // Dibujar líneas entre partículas cercanas
            for (let j = i; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 150) {
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(0, 243, 255, ${0.1 - distance/1500})`;
                    ctx.lineWidth = 1;
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
        requestAnimationFrame(animateParticles);
    }
    animateParticles();

    // =========================================
    // 3. EFECTO 3D TILT (Inclinación al mouse)
    // =========================================
    const tiltElements = document.querySelectorAll('.tilt-element, .tilt-card');

    tiltElements.forEach(el => {
        el.addEventListener('mousemove', (e) => {
            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left; // Posición X dentro del elemento
            const y = e.clientY - rect.top;  // Posición Y dentro del elemento
            
            // Calcular rotación (máximo 15 grados)
            const xRotation = -1 * ((y - rect.height / 2) / rect.height * 20);
            const yRotation = (x - rect.width / 2) / rect.width * 20;
            
            // Aplicar transformación
            // Si es la imagen principal, rotamos la imagen interna. Si es tarjeta, rotamos la tarjeta.
            const target = el.classList.contains('tilt-element') ? el.querySelector('img') || el : el;
            
            target.style.transform = `perspective(500px) scale(1.02) rotateX(${xRotation}deg) rotateY(${yRotation}deg)`;
        });

        el.addEventListener('mouseleave', () => {
            // Resetear al salir
            const target = el.classList.contains('tilt-element') ? el.querySelector('img') || el : el;
            target.style.transform = 'perspective(500px) scale(1) rotateX(0) rotateY(0)';
            target.style.transition = 'transform 0.5s ease';
        });
        
        el.addEventListener('mouseenter', () => {
            // Quitar transición al entrar para respuesta instantánea
            const target = el.classList.contains('tilt-element') ? el.querySelector('img') || el : el;
            target.style.transition = 'none';
        });
    });

    // =========================================
    // 4. GENERADOR DE DOCUMENTOS & TOASTS
    // =========================================
    function showToast(msg) {
        const container = document.getElementById('toast-container');
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.innerHTML = `<span>⚡</span> ${msg}`;
        container.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
    }

    const profileForm = document.getElementById('profileForm');
    if (profileForm) {
        profileForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(profileForm);
            const nombre = formData.get('nombre') || 'Amigo';
            showToast(`Gracias ${nombre}, tu mensaje fue enviado.`);
            profileForm.reset();
        });
    }

    const docs = [
        { titulo: "Diploma Bachiller", sub: "Certificado Oficial", icon: "🎓", file: "Recursos/Diploma%20Bachiller%20Academico%20.pdf" }
    ];

    const gallery = document.getElementById('docsGallery');
    
    docs.forEach(doc => {
        const card = document.createElement('div');
        card.className = 'doc-card';
        card.innerHTML = `
            <div class="doc-icon">${doc.icon}</div>
            <h3>${doc.titulo}</h3>
            <p>${doc.sub}</p>
        `;
        
        card.addEventListener('click', () => {
            if (doc.file) {
                const link = document.createElement('a');
                link.href = doc.file;
                link.target = '_blank';
                link.rel = 'noopener noreferrer';
                document.body.appendChild(link);
                link.click();
                link.remove();
                showToast(`Abriendo: ${doc.titulo}`);
            } else {
                showToast(`Vista previa: ${doc.titulo}`);
            }
        });
        gallery.appendChild(card);
    });

});
