/* ========================================
   AURORA VPN - MAIN JAVASCRIPT
   Autor: Desenvolvido para AuroraVPN
   Data: 2026
======================================== */

document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================
    // MENU MOBILE TOGGLE
    // ==========================================
    
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileLinks = document.querySelectorAll('.mobile-link');
    
    // Abrir/Fechar menu mobile
    mobileMenuToggle.addEventListener('click', () => {
        mobileMenu.classList.toggle('active');
        
        // Troca ícone entre menu e close
        const icon = mobileMenuToggle.querySelector('i');
        if (mobileMenu.classList.contains('active')) {
            icon.classList.remove('bi-list');
            icon.classList.add('bi-x');
        } else {
            icon.classList.remove('bi-x');
            icon.classList.add('bi-list');
        }
    });
    
    // Fechar menu ao clicar em um link
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
            const icon = mobileMenuToggle.querySelector('i');
            icon.classList.remove('bi-x');
            icon.classList.add('bi-list');
        });
    });
    
    // Fechar menu ao clicar fora
    document.addEventListener('click', (e) => {
        if (!mobileMenu.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
            mobileMenu.classList.remove('active');
            const icon = mobileMenuToggle.querySelector('i');
            icon.classList.remove('bi-x');
            icon.classList.add('bi-list');
        }
    });


    // ==========================================
    // SMOOTH SCROLL PARA LINKS DE NAVEGAÇÃO
    // ==========================================
    
    const allLinks = document.querySelectorAll('a[href^="#"]');
    
    allLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            
            // Ignora links vazios ou apenas "#"
            if (href === '#' || href === '') return;
            
            e.preventDefault();
            
            const targetId = href.substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                // Offset para compensar header fixo
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });


    // ==========================================
    // ATIVAR LINK DO MENU NA SEÇÃO VISÍVEL
    // ==========================================
    
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-menu a[href^="#"]');
    
    function activateNavLink() {
        const scrollY = window.pageYOffset;
        
        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 150;
            const sectionId = section.getAttribute('id');
            
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
    
    window.addEventListener('scroll', activateNavLink);


    // ==========================================
    // ANIMAÇÃO DE SCROLL (INTERSECTION OBSERVER)
    // ==========================================
    
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const animatedElements = document.querySelectorAll('.fade-in-up, .fade-in-left, .fade-in-right');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animationPlayState = 'running';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    animatedElements.forEach(element => {
        element.style.animationPlayState = 'paused';
        observer.observe(element);
    });


    // ==========================================
    // SLIDER DE DEPOIMENTOS (TESTIMONIALS)
    // ==========================================
    
    const track = document.querySelector('.testimonials-track');
    const cards = document.querySelectorAll('.testimonial-card');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const dots = document.querySelectorAll('.dot');
    
    let currentIndex = 0;
    const totalCards = cards.length;
    const cardsPerView = getCardsPerView();
    const maxIndex = totalCards - cardsPerView;
    
    // Detecta quantos cards mostrar por vez baseado na largura da tela
    function getCardsPerView() {
        if (window.innerWidth <= 768) return 1;
        if (window.innerWidth <= 1200) return 2;
        return 3;
    }
    
    // Atualiza o slider
    function updateSlider() {
        const cardWidth = cards[0].offsetWidth;
        const gap = 30;
        const offset = currentIndex * (cardWidth + gap);
        
        track.style.transform = `translateX(-${offset}px)`;
        
        // Atualiza classes dos cards
        cards.forEach((card, index) => {
            card.classList.remove('active');
            if (index >= currentIndex && index < currentIndex + cardsPerView) {
                if (index === currentIndex) {
                    card.classList.add('active');
                }
            }
        });
        
        // Atualiza bolinhas (dots)
        dots.forEach((dot, index) => {
            dot.classList.remove('active');
            if (index === Math.floor(currentIndex / cardsPerView)) {
                dot.classList.add('active');
            }
        });
        
        // Controle dos botões
        updateButtons();
    }
    
    // Atualiza estado dos botões
    function updateButtons() {
        // Botão anterior
        if (currentIndex === 0) {
            prevBtn.classList.remove('active-arrow');
            prevBtn.style.opacity = '0.5';
            prevBtn.disabled = true;
        } else {
            prevBtn.classList.add('active-arrow');
            prevBtn.style.opacity = '1';
            prevBtn.disabled = false;
        }
        
        // Botão próximo
        if (currentIndex >= maxIndex) {
            nextBtn.classList.remove('active-arrow');
            nextBtn.style.opacity = '0.5';
            nextBtn.disabled = true;
        } else {
            nextBtn.classList.add('active-arrow');
            nextBtn.style.opacity = '1';
            nextBtn.disabled = false;
        }
    }
    
    // Event listeners dos botões
    nextBtn.addEventListener('click', () => {
        if (currentIndex < maxIndex) {
            currentIndex++;
            updateSlider();
        }
    });
    
    prevBtn.addEventListener('click', () => {
        if (currentIndex > 0) {
            currentIndex--;
            updateSlider();
        }
    });
    
    // Click nas bolinhas (dots)
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            currentIndex = index * cardsPerView;
            if (currentIndex > maxIndex) currentIndex = maxIndex;
            updateSlider();
        });
    });
    
    // Inicializa o slider
    updateSlider();
    
    // Atualiza ao redimensionar a janela
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            currentIndex = 0;
            updateSlider();
        }, 250);
    });


    // ==========================================
    // EFEITO PARALLAX NO HERO (OPCIONAL)
    // ==========================================
    
    const heroImage = document.querySelector('.hero-image img');
    
    if (heroImage) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * 0.3;
            
            if (scrolled < 800) {
                heroImage.style.transform = `translateY(${rate}px)`;
            }
        });
    }


    // ==========================================
    // ANIMAÇÃO DOS NÚMEROS (STATS)
    // ==========================================
    
    const statsNumbers = document.querySelectorAll('.stats-info strong');
    let statsAnimated = false;
    
    function animateStats() {
        if (statsAnimated) return;
        
        statsNumbers.forEach(stat => {
            const target = parseInt(stat.textContent);
            const duration = 2000;
            const step = target / (duration / 16);
            let current = 0;
            
            const timer = setInterval(() => {
                current += step;
                if (current >= target) {
                    stat.textContent = target + '+';
                    clearInterval(timer);
                } else {
                    stat.textContent = Math.floor(current) + '+';
                }
            }, 16);
        });
        
        statsAnimated = true;
    }
    
    // Observer para stats
    const statsSection = document.querySelector('.stats');
    if (statsSection) {
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateStats();
                }
            });
        }, { threshold: 0.5 });
        
        statsObserver.observe(statsSection);
    }


    // ==========================================
    // CONSOLE LOG DE BOAS-VINDAS
    // ==========================================
    
    console.log('%c🌟 AuroraVPN Landing Page 🌟', 'color: #F53838; font-size: 20px; font-weight: bold;');
    console.log('%cDesenvolvido com ❤️ para conectar o mundo', 'color: #4F5665; font-size: 14px;');
    
});


/* ========================================
   FIM DO SCRIPT
======================================== */