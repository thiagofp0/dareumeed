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
// Inicializa o carrossel a partir de um manifesto JSON (images/list.json)
(function() {
    const manifestUrl = 'images/list.json';
    fetch(manifestUrl)
        .then(res => {
            if (!res.ok) throw new Error('Não foi possível buscar ' + manifestUrl);
            return res.json();
        })
        .then(imageFiles => {
            if (!Array.isArray(imageFiles) || imageFiles.length === 0) return;
            initCarousel(imageFiles);
        })
        .catch(err => {
            console.error('Erro carregando manifesto de imagens:', err);
        });

    function initCarousel(imageFiles) {
        const track = document.getElementById('carouselTrack');
        const prevBtn = document.getElementById('carouselPrev');
        const nextBtn = document.getElementById('carouselNext');
        const indicators = document.getElementById('carouselIndicators');
        if (!track) return;

        let currentIndex = 0;
        let autoplayTimer = null;
        const AUTOPLAY_MS = 5000;

        // Cria lightbox/modal elements
        const lightbox = document.createElement('div');
        lightbox.className = 'lightbox-overlay';
        lightbox.innerHTML = `<div class="lightbox-content"><button class="lightbox-close" aria-label="Fechar">&times;</button><img src="" alt=""></div>`;
        document.body.appendChild(lightbox);

        const lightboxImg = lightbox.querySelector('img');
        const lightboxClose = lightbox.querySelector('.lightbox-close');

        let lightboxOpen = false;

        function openLightbox(src, alt) {
            lightboxImg.src = src;
            lightboxImg.alt = alt || '';
            lightbox.classList.add('open');
            lightboxOpen = true;
            // pause autoplay
            if (autoplayTimer) clearInterval(autoplayTimer);
        }

        function closeLightbox() {
            lightbox.classList.remove('open');
            lightboxImg.src = '';
            lightboxOpen = false;
            // resume autoplay
            startAutoplay();
        }

        lightbox.addEventListener('click', (e) => {
            // close if clicked outside image content
            if (e.target === lightbox || e.target === lightboxClose) closeLightbox();
        });

        document.addEventListener('keydown', (e) => {
            if (!lightboxOpen) return;
            if (e.key === 'Escape') closeLightbox();
        });

        // Cria slides
        imageFiles.forEach((src, idx) => {
            const slide = document.createElement('div');
            slide.className = 'carousel-slide';
            slide.setAttribute('role', 'listitem');

            const img = document.createElement('img');
            img.src = encodeURI(src);
            img.alt = 'Galeria de fotos';
            img.loading = 'lazy';

            slide.appendChild(img);
            // abrir lightbox ao clicar na imagem
            img.style.cursor = 'zoom-in';
            img.addEventListener('click', () => {
                openLightbox(img.src, img.alt);
            });
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

        // teclado (não navegar quando lightbox estiver aberto)
        document.addEventListener('keydown', (e) => {
            if (lightboxOpen) return; // ignore arrow keys while modal open
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
    }
})();