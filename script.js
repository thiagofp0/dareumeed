// Configuração de idioma
let currentLanguage = 'pt';

// Função para alternar idioma
function toggleLanguage() {
    currentLanguage = currentLanguage === 'pt' ? 'en' : 'pt';
    updateLanguage();
    
    // Atualizar texto do botão
    const languageToggle = document.getElementById('languageToggle');
    if (languageToggle) {
        const languageText = languageToggle.querySelector('span');
        if (languageText) {
            languageText.textContent = currentLanguage === 'pt' ? 'EN' : 'PT';
        }
    }
}

// Função para atualizar todo o conteúdo com o idioma selecionado
function updateLanguage() {
    // Atualizar elementos com atributos data-pt e data-en
    const translatableElements = document.querySelectorAll('[data-pt]');
    translatableElements.forEach(element => {
        element.textContent = element.getAttribute(`data-${currentLanguage}`);
    });
    
    // Atualizar placeholders
    const translatableInputs = document.querySelectorAll('input[data-pt], select[data-pt]');
    translatableInputs.forEach(input => {
        input.placeholder = input.getAttribute(`data-${currentLanguage}`);
    });
    
    // Atualizar opções do select
    const translatableOptions = document.querySelectorAll('option[data-pt]');
    translatableOptions.forEach(option => {
        option.textContent = option.getAttribute(`data-${currentLanguage}`);
    });
    
    // Atualizar o atributo lang do HTML
    document.documentElement.lang = currentLanguage;
    
    // Atualizar texto do botão de idioma (se existir)
    const languageToggle = document.getElementById('languageToggle');
    if (languageToggle) {
        const languageText = languageToggle.querySelector('span');
        if (languageText) {
            // Exibir 'EN' quando a página estiver em português (ou seja, botão mostra a opção a trocar)
            languageText.textContent = currentLanguage === 'pt' ? 'EN' : 'PT';
        }
    }

    // Re-renderizar posts do blog no idioma atual (se a função existir)
    if (typeof loadBlogPosts === 'function') {
        loadBlogPosts();
    }

    // Atualizar alt da imagem da seção Boletins (se existir)
    const newsletterImg = document.querySelector('.newsletter-image img[data-pt]');
    if (newsletterImg) {
        const altText = newsletterImg.getAttribute(`data-${currentLanguage}`) || newsletterImg.getAttribute('alt') || '';
        newsletterImg.alt = altText;
    }
}

// Menu Mobile
const mobileMenu = document.querySelector('.mobile-menu');
const nav = document.querySelector('nav');

if (mobileMenu) {
    mobileMenu.addEventListener('click', () => {
        if (nav) nav.classList.toggle('active');
    });
}

// Fechar menu ao clicar em um link
const navLinks = document.querySelectorAll('nav a');
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        if (nav) nav.classList.remove('active');
    });
});

// Selecionar valor de doação (com checagens de existência)
function selectDonation(amount) {
    const amountInput = document.getElementById('amount');
    if (amountInput) {
        amountInput.value = amount;
    }
    const donateSection = document.getElementById('donate');
    if (donateSection) {
        donateSection.scrollIntoView({ behavior: 'smooth' });
    }
}

// Smooth scroll para links internos
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 70,
                behavior: 'smooth'
            });
        }
    });
});

// Configurar evento do botão de idioma (seguro)
const languageToggleBtn = document.getElementById('languageToggle');
if (languageToggleBtn) {
    languageToggleBtn.addEventListener('click', toggleLanguage);
}

// Inicializar textos/alt no carregamento
document.addEventListener('DOMContentLoaded', function() {
    updateLanguage();
});

// --- Carousel: popula imagens da pasta images/ e adiciona controles ---
(function() {
    const imageFiles = [
        'images/wide.jpeg',
        'images/WhatsApp Image 2025-11-14 at 21.40.53.jpeg',
        'images/WhatsApp Image 2025-11-14 at 21.40.53 (1).jpeg',
        'images/WhatsApp Image 2025-11-14 at 21.40.52.jpeg',
        'images/WhatsApp Image 2025-11-14 at 21.40.52 (1).jpeg',
        'images/WhatsApp Image 2025-11-14 at 21.40.51.jpeg',
        'images/WhatsApp Image 2025-11-14 at 21.40.50.jpeg'
    ];

    const track = document.getElementById('carouselTrack');
    const prevBtn = document.getElementById('carouselPrev');
    const nextBtn = document.getElementById('carouselNext');
    const indicators = document.getElementById('carouselIndicators');
    if (!track) return;

    let currentIndex = 0;
    let autoplayTimer = null;
    const AUTOPLAY_MS = 5000;

    // Cria slides
    imageFiles.forEach((src, idx) => {
        const slide = document.createElement('div');
        slide.className = 'carousel-slide';
        slide.setAttribute('role', 'listitem');

        const img = document.createElement('img');
    img.src = encodeURI(src);
        img.alt = `Galeria ${idx + 1}`;
        img.loading = 'lazy';

        slide.appendChild(img);
        track.appendChild(slide);

        // indicator
        if (indicators) {
            const btn = document.createElement('button');
            btn.setAttribute('aria-label', `Ir para a imagem ${idx + 1}`);
            btn.addEventListener('click', () => {
                goToSlide(idx);
            });
            indicators.appendChild(btn);
        }
    });

    const slides = track.querySelectorAll('.carousel-slide');

    function updateIndicators() {
        if (!indicators) return;
        const dots = indicators.querySelectorAll('button');
        dots.forEach((d, i) => d.classList.toggle('active', i === currentIndex));
    }

    function goToSlide(index) {
        if (index < 0) index = slides.length - 1;
        if (index >= slides.length) index = 0;
        currentIndex = index;
        const offset = -currentIndex * track.clientWidth;
        track.style.transform = `translateX(${offset}px)`;
        updateIndicators();
        resetAutoplay();
    }

    function prevSlide() { goToSlide(currentIndex - 1); }
    function nextSlide() { goToSlide(currentIndex + 1); }

    if (prevBtn) prevBtn.addEventListener('click', prevSlide);
    if (nextBtn) nextBtn.addEventListener('click', nextSlide);

    // teclado
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') prevSlide();
        if (e.key === 'ArrowRight') nextSlide();
    });

    // autoplay
    function startAutoplay() {
        autoplayTimer = setInterval(() => {
            nextSlide();
        }, AUTOPLAY_MS);
    }
    function resetAutoplay() {
        if (autoplayTimer) clearInterval(autoplayTimer);
        startAutoplay();
    }

    // ajustar largura do track quando redimensionar
    window.addEventListener('resize', () => {
        // reposicionar corretamente
        track.style.transition = 'none';
        const offset = -currentIndex * track.clientWidth;
        track.style.transform = `translateX(${offset}px)`;
        // forçar reflow e restaurar transição
        void track.offsetWidth;
        track.style.transition = '';
    });

    // iniciar
    updateIndicators();
    goToSlide(0);
    startAutoplay();
})();