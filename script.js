/*==========================================================
    AGENDA OFF ROAD - SCRIPT PRINCIPAL
==========================================================*/

"use strict";

/*==========================================================
    ELEMENTOS
==========================================================*/

const body = document.body;

const header = document.getElementById("header");
const loader = document.getElementById("loader");
const scrollProgress = document.getElementById("scroll-progress");
const backToTop = document.getElementById("backToTop");

const mobileButton = document.getElementById("mobile-button");
const mobileMenu = document.getElementById("mobile-menu");
const closeMenu = document.getElementById("close-menu");

const revealElements = document.querySelectorAll(".reveal, .reveal-left, .reveal-right");
const counters = document.querySelectorAll("[data-counter]");

const contactForm = document.getElementById("contactForm");
const newsletterForm = document.getElementById("newsletterForm");

/*==========================================================
    CONFIGURAÇÕES GERAIS
==========================================================*/

const App = {
    initialized: false
};

/*==========================================================
    UTILITÁRIOS
==========================================================*/

function debounce(callback, delay) {
    let timeout;
    return function () {
        clearTimeout(timeout);
        timeout = setTimeout(callback, delay);
    };
}

function throttle(callback, limit) {
    let waiting = false;
    return function () {
        if (!waiting) {
            callback.apply(this, arguments);
            waiting = true;
            setTimeout(function () {
                waiting = false;
            }, limit);
        }
    };
}

function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/*==========================================================
    LOADER
==========================================================*/

function initLoader() {
    window.addEventListener("load", function () {
        setTimeout(function () {
            loader.classList.add("hide");
            setTimeout(function () {
                loader.remove();
            }, 700);
        }, 1200);
    });
}

/*==========================================================
    HEADER (efeito ao rolar a página)
==========================================================*/

function initHeader() {
    function updateHeader() {
        header.classList.toggle("scrolled", window.scrollY > 40);
    }
    updateHeader();
    window.addEventListener("scroll", updateHeader);
}

/*==========================================================
    BARRA DE PROGRESSO DE SCROLL
==========================================================*/

function initScrollProgress() {
    function updateProgress() {
        const scrollTop = window.scrollY;
        const height = document.documentElement.scrollHeight - window.innerHeight;
        const progress = height > 0 ? (scrollTop / height) * 100 : 0;
        scrollProgress.style.width = progress + "%";
    }
    updateProgress();
    window.addEventListener("scroll", throttle(updateProgress, 20));
}

/*==========================================================
    BOTÃO VOLTAR AO TOPO
==========================================================*/

function initBackToTop() {
    function updateButton() {
        backToTop.classList.toggle("show", window.scrollY > 500);
    }
    updateButton();
    window.addEventListener("scroll", throttle(updateButton, 20));

    backToTop.addEventListener("click", function () {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });
}

/*==========================================================
    SMOOTH SCROLL NOS LINKS INTERNOS
==========================================================*/

function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');

    links.forEach(function (link) {
        link.addEventListener("click", function (event) {
            const href = this.getAttribute("href");
            if (href === "#") return;

            const target = document.querySelector(href);
            if (!target) return;

            event.preventDefault();
            window.scrollTo({
                top: target.offsetTop - 80,
                behavior: "smooth"
            });
        });
    });
}

/*==========================================================
    MENU MOBILE
==========================================================*/

function openMobileMenu() {
    if (!mobileMenu) return;
    mobileMenu.classList.add("active");
    body.style.overflow = "hidden";
}

function closeMobileMenu() {
    if (!mobileMenu) return;
    mobileMenu.classList.remove("active");
    body.style.overflow = "";
}

function initMobileMenu() {
    if (mobileButton) {
        mobileButton.addEventListener("click", openMobileMenu);
    }

    if (closeMenu) {
        closeMenu.addEventListener("click", closeMobileMenu);
    }

    document.querySelectorAll("#mobile-menu a").forEach(function (link) {
        link.addEventListener("click", closeMobileMenu);
    });

    document.addEventListener("keydown", function (e) {
        if (e.key === "Escape") {
            closeMobileMenu();
        }
    });

    document.addEventListener("click", function (e) {
        if (!mobileMenu || !mobileButton) return;
        if (!mobileMenu.classList.contains("active")) return;
        if (mobileMenu.contains(e.target)) return;
        if (mobileButton.contains(e.target)) return;
        closeMobileMenu();
    });
}

/*==========================================================
    MENU ATIVO CONFORME A SEÇÃO VISÍVEL
==========================================================*/

function initActiveMenu() {
    const sections = document.querySelectorAll("section[id]");
    const menuLinks = document.querySelectorAll('nav a[href^="#"]');

    if (sections.length === 0 || menuLinks.length === 0) return;

    function updateActiveMenu() {
        let current = "";

        sections.forEach(function (section) {
            const top = section.offsetTop - 150;
            if (window.scrollY >= top) {
                current = section.getAttribute("id");
            }
        });

        menuLinks.forEach(function (link) {
            link.classList.toggle("active", link.getAttribute("href") === "#" + current);
        });
    }

    updateActiveMenu();
    window.addEventListener("scroll", throttle(updateActiveMenu, 20));
}

/*==========================================================
    HOVER 3D NOS CARDS
==========================================================*/

function initCardTilt() {
    const cards = document.querySelectorAll(".event-card, .category-card, .news-card");

    cards.forEach(function (card) {
        card.addEventListener("mousemove", function (e) {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const rotateX = ((y / rect.height) - 0.5) * 10;
            const rotateY = ((x / rect.width) - 0.5) * -10;

            card.style.transform =
                `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
        });

        card.addEventListener("mouseleave", function () {
            card.style.transform = "";
        });
    });
}

/*==========================================================
    DESTAQUE NOS BOTÕES DO HERO
==========================================================*/

function initHeroButtons() {
    const heroButtons = document.querySelectorAll(".hero-buttons a");

    heroButtons.forEach(function (button) {
        button.addEventListener("mouseenter", function () {
            button.style.transform = "translateY(-5px) scale(1.02)";
        });
        button.addEventListener("mouseleave", function () {
            button.style.transform = "";
        });
    });
}

/*==========================================================
    SCROLL REVEAL (fade-in ao entrar na tela)
    Utilitário genérico: adicione a classe "reveal",
    "reveal-left" ou "reveal-right" a qualquer elemento
    para ativar a animação.
==========================================================*/

function initScrollReveal() {
    if (revealElements.length === 0) return;

    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add("active");
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    revealElements.forEach(function (el) {
        observer.observe(el);
    });
}

/*==========================================================
    CONTADORES ANIMADOS (ex: estatísticas)
==========================================================*/

function animateCounter(element) {
    const target = parseInt(element.dataset.counter, 10);
    let current = 0;
    const increment = Math.ceil(target / 120);

    const interval = setInterval(function () {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(interval);
        }
        element.textContent = current.toLocaleString("pt-BR");
    }, 15);
}

function initCounters() {
    if (counters.length === 0) return;

    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.6 });

    counters.forEach(function (counter) {
        observer.observe(counter);
    });
}

/*==========================================================
    TOAST (NOTIFICAÇÕES)
==========================================================*/

const Toast = {
    container: null,

    init() {
        this.container = document.createElement("div");
        this.container.id = "toast-container";
        document.body.appendChild(this.container);
    },

    show(message, type = "success") {
        if (!this.container) this.init();

        const toast = document.createElement("div");
        toast.className = `toast ${type}`;
        toast.innerHTML = `
            <div class="toast-icon">${type === "success" ? "✔" : "⚠"}</div>
            <div class="toast-message">${message}</div>
        `;

        this.container.appendChild(toast);

        setTimeout(function () {
            toast.classList.add("show");
        }, 50);

        setTimeout(function () {
            toast.classList.remove("show");
            setTimeout(function () {
                toast.remove();
            }, 300);
        }, 3500);
    }
};

/*==========================================================
    FORMULÁRIO DE CONTATO
==========================================================*/

function initContactForm() {
    if (!contactForm) return;

    contactForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const name = contactForm.querySelector("[name=name]").value.trim();
        const email = contactForm.querySelector("[name=email]").value.trim();
        const subject = contactForm.querySelector("[name=subject]").value.trim();
        const message = contactForm.querySelector("[name=message]").value.trim();

        if (name.length < 3) {
            Toast.show("Informe um nome válido.", "error");
            return;
        }

        if (!validateEmail(email)) {
            Toast.show("E-mail inválido.", "error");
            return;
        }

        if (subject.length < 3) {
            Toast.show("Informe o assunto da mensagem.", "error");
            return;
        }

        if (message.length < 10) {
            Toast.show("Digite uma mensagem maior.", "error");
            return;
        }

        Toast.show("Mensagem enviada com sucesso!");
        contactForm.reset();
    });
}

/*==========================================================
    NEWSLETTER
==========================================================*/

function initNewsletter() {
    if (!newsletterForm) return;

    newsletterForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const emailInput = newsletterForm.querySelector("input[type=email]");
        const email = emailInput.value.trim();

        if (!validateEmail(email)) {
            Toast.show("Informe um e-mail válido.", "error");
            return;
        }

        Toast.show("Cadastro realizado com sucesso!");
        newsletterForm.reset();
    });
}

/*==========================================================
    INICIALIZAÇÃO
==========================================================*/

function initApplication() {
    if (App.initialized) return;
    App.initialized = true;

    initLoader();
    initHeader();
    initScrollProgress();
    initBackToTop();
    initSmoothScroll();
    initMobileMenu();
    initActiveMenu();
    initCardTilt();
    initHeroButtons();
    initScrollReveal();
    initCounters();

    Toast.init();
    initContactForm();
    initNewsletter();
}

document.addEventListener("DOMContentLoaded", initApplication);
