// script.js
document.addEventListener("DOMContentLoaded", function () {
  // Inicializar todas as funcionalidades
  initLoadingScreen();
  initNavigation();
  initAnimations();
  initTestimonialsSlider();
  initFAQ();
  initContactForm();
  initCounters();
  initHeaderBehavior();
  initParallax();
  initNotifications();
  initBackToTop(); // Novo: botão voltar ao topo
  initWhatsAppEnhancements(); // Novo: melhorias no WhatsApp
});

// ===== LOADING SCREEN =====
function initLoadingScreen() {
  const loadingScreen = document.getElementById("loading-screen");

  // Simular tempo de carregamento (remova em produção)
  setTimeout(() => {
    loadingScreen.classList.add("loaded");

    // Remover do DOM após animação
    setTimeout(() => {
      loadingScreen.remove();
    }, 500);
  }, 1500);
}

// ===== NAVEGAÇÃO =====
function initNavigation() {
  const hamburger = document.querySelector(".hamburger-menu");
  const navMenu = document.querySelector(".nav-menu");
  const navLinks = document.querySelectorAll(".nav-link");

  // Menu hamburguer
  if (hamburger) {
    hamburger.addEventListener("click", () => {
      hamburger.classList.toggle("active");
      navMenu.classList.toggle("active");
      document.body.style.overflow = navMenu.classList.contains("active")
        ? "hidden"
        : "";
    });
  }

  // Fechar menu ao clicar nos links
  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      hamburger.classList.remove("active");
      navMenu.classList.remove("active");
      document.body.style.overflow = "";
    });
  });

  // Ativar link atual
  function setActiveLink() {
    const sections = document.querySelectorAll("section[id]");
    const scrollPos = window.scrollY + 100;

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute("id");

      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        navLinks.forEach((link) => {
          link.classList.remove("active");
          if (link.getAttribute("href") === `#${sectionId}`) {
            link.classList.add("active");
          }
        });
      }
    });
  }

  window.addEventListener("scroll", setActiveLink);
}

// ===== ANIMAÇÕES AO ROLAR =====
function initAnimations() {
  const animateElements = document.querySelectorAll(
    ".fade-in-up, [data-animate]"
  );

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    }
  );

  animateElements.forEach((el) => observer.observe(el));
}

// ===== SLIDER DE DEPOIMENTOS =====
function initTestimonialsSlider() {
  let currentTestimonial = 0;
  const testimonials = document.querySelectorAll(".testimonial");
  const dots = document.querySelectorAll(".dot");
  const prevBtn = document.querySelector(".prev");
  const nextBtn = document.querySelector(".next");
  let autoSlideInterval;

  if (testimonials.length === 0) return;

  function showTestimonial(index) {
    // Validar índice
    if (index < 0) index = testimonials.length - 1;
    if (index >= testimonials.length) index = 0;

    // Atualizar testimonial ativo
    testimonials.forEach((t) => t.classList.remove("active"));
    dots.forEach((d) => d.classList.remove("active"));

    testimonials[index].classList.add("active");
    dots[index].classList.add("active");
    currentTestimonial = index;
  }

  // Controles de navegação
  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      resetAutoSlide();
      showTestimonial(currentTestimonial - 1);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      resetAutoSlide();
      showTestimonial(currentTestimonial + 1);
    });
  }

  // Navegação por dots
  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      resetAutoSlide();
      showTestimonial(index);
    });
  });

  // Auto slide
  function startAutoSlide() {
    autoSlideInterval = setInterval(() => {
      showTestimonial(currentTestimonial + 1);
    }, 5000);
  }

  function resetAutoSlide() {
    clearInterval(autoSlideInterval);
    startAutoSlide();
  }

  // Pausar auto slide no hover
  const slider = document.querySelector(".testimonials-slider");
  if (slider) {
    slider.addEventListener("mouseenter", () => {
      clearInterval(autoSlideInterval);
    });

    slider.addEventListener("mouseleave", () => {
      startAutoSlide();
    });
  }

  // Iniciar auto slide
  startAutoSlide();
}

// ===== FAQ ACCORDION =====
function initFAQ() {
  const faqQuestions = document.querySelectorAll(".faq-question");

  faqQuestions.forEach((question) => {
    question.addEventListener("click", () => {
      const item = question.parentElement;
      const isActive = item.classList.contains("active");

      // Fechar todos os itens
      document.querySelectorAll(".faq-item").forEach((faqItem) => {
        faqItem.classList.remove("active");
      });

      // Abrir item atual se não estava ativo
      if (!isActive) {
        item.classList.add("active");
      }
    });
  });
}

// ===== FORMULÁRIO DE CONTATO =====
function initContactForm() {
  const form = document.getElementById("form-contato");

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      if (validateForm()) {
        enviarParaWhatsApp();
      }
    });

    // Validação em tempo real
    const inputs = form.querySelectorAll("input, select, textarea");
    inputs.forEach((input) => {
      input.addEventListener("blur", () => {
        validateField(input);
      });

      input.addEventListener("input", () => {
        clearFieldError(input);
      });
    });

    // Máscara de telefone
    const telefoneInput = document.getElementById("telefone");
    if (telefoneInput) {
      telefoneInput.addEventListener("input", function (e) {
        let value = e.target.value.replace(/\D/g, "");

        if (value.length > 11) {
          value = value.substring(0, 11);
        }

        // Formatar como (XX) XXXXX-XXXX
        if (value.length > 10) {
          value = value.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
        } else if (value.length > 6) {
          value = value.replace(/(\d{2})(\d{4})(\d{0,4})/, "($1) $2-$3");
        } else if (value.length > 2) {
          value = value.replace(/(\d{2})(\d{0,5})/, "($1) $2");
        } else if (value.length > 0) {
          value = value.replace(/(\d{0,2})/, "($1");
        }

        e.target.value = value;
      });
    }
  }
}

function validateForm() {
  const form = document.getElementById("form-contato");
  const inputs = form.querySelectorAll(
    "input[required], select[required], textarea[required]"
  );
  let isValid = true;

  inputs.forEach((input) => {
    if (!validateField(input)) {
      isValid = false;
    }
  });

  return isValid;
}

function validateField(field) {
  const value = field.value.trim();
  let isValid = true;
  let errorMessage = "";

  clearFieldError(field);

  // Validações específicas por tipo de campo
  switch (field.type) {
    case "tel":
      if (!validarTelefone(value)) {
        isValid = false;
        errorMessage = "Por favor, insira um número de WhatsApp válido com DDD";
      }
      break;

    case "text":
      if (value.length < 2) {
        isValid = false;
        errorMessage = "Por favor, insira um nome válido";
      }
      break;

    case "select-one":
      if (!value) {
        isValid = false;
        errorMessage = "Por favor, selecione um serviço";
      }
      break;

    default:
      if (!value) {
        isValid = false;
        errorMessage = "Este campo é obrigatório";
      }
  }

  if (!isValid) {
    showFieldError(field, errorMessage);
  }

  return isValid;
}

function showFieldError(field, message) {
  field.classList.add("input-error");

  let errorElement = field.parentNode.querySelector(".error-message");
  if (!errorElement) {
    errorElement = document.createElement("div");
    errorElement.className = "error-message";
    field.parentNode.appendChild(errorElement);
  }

  errorElement.textContent = message;
  errorElement.classList.add("show");
}

function clearFieldError(field) {
  field.classList.remove("input-error");

  const errorElement = field.parentNode.querySelector(".error-message");
  if (errorElement) {
    errorElement.classList.remove("show");
  }
}

function validarTelefone(telefone) {
  const numeros = telefone.replace(/\D/g, "");
  return numeros.length >= 10;
}

function enviarParaWhatsApp() {
  const nome = document.getElementById("nome").value;
  const telefone = document.getElementById("telefone").value;
  const servico = document.getElementById("servico");
  const servicoTexto = servico.options[servico.selectedIndex].text;
  const mensagem = document.getElementById("mensagem").value;

  // Formatando o número de telefone
  const numeroWhatsApp = "5581995125671";

  // Criar mensagem formatada
  const texto =
    `*Nova mensagem do site - Dra. Vitória Santos*\n\n` +
    `*Nome:* ${nome}\n` +
    `*Telefone:* ${telefone}\n` +
    `*Serviço de interesse:* ${servicoTexto}\n` +
    `*Mensagem:* ${mensagem}`;

  // Codificar a mensagem para URL
  const textoCodificado = encodeURIComponent(texto);

  // Mostrar confirmação
  mostrarConfirmacao();

  // Feedback visual durante o envio
  setFormLoading(true);

  // Redirecionar para o WhatsApp após 2 segundos
  setTimeout(() => {
    window.open(
      `https://wa.me/${numeroWhatsApp}?text=${textoCodificado}`,
      "_blank"
    );
    document.getElementById("form-contato").reset();
    setFormLoading(false);
  }, 2000);
}

function setFormLoading(isLoading) {
  const submitBtn = document.querySelector(".btn-submit");
  if (!submitBtn) return;

  if (isLoading) {
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
    submitBtn.disabled = true;
  } else {
    submitBtn.innerHTML = "Enviar Mensagem";
    submitBtn.disabled = false;
  }
}

// ===== CONTADORES ANIMADOS =====
function initCounters() {
  const counters = document.querySelectorAll(".stat-number");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  counters.forEach((counter) => observer.observe(counter));
}

function animateCounter(counter) {
  const target = parseInt(counter.getAttribute("data-count"));
  const duration = 2000; // 2 segundos
  const step = target / (duration / 16); // 60fps
  let current = 0;

  const timer = setInterval(() => {
    current += step;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }
    counter.textContent = Math.floor(current);
  }, 16);
}

// ===== COMPORTAMENTO DO HEADER =====
function initHeaderBehavior() {
  const header = document.querySelector(".header");
  let lastScrollY = window.scrollY;

  window.addEventListener("scroll", () => {
    // Adicionar/remover classe scrolled
    if (window.scrollY > 50) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }

    // Esconder/mostrar header no scroll
    if (window.scrollY > lastScrollY && window.scrollY > 100) {
      header.classList.add("hidden");
    } else {
      header.classList.remove("hidden");
    }

    lastScrollY = window.scrollY;
  });
}

// ===== EFEITO PARALLAX =====
function initParallax() {
  const parallaxBg = document.querySelector(".parallax-bg");

  if (parallaxBg) {
    window.addEventListener("scroll", () => {
      const scrolled = window.pageYOffset;
      const rate = scrolled * -0.5;
      parallaxBg.style.transform = `translate3d(0, ${rate}px, 0)`;
    });
  }
}

// ===== SISTEMA DE NOTIFICAÇÕES =====
function initNotifications() {
  window.showNotification = function (message, type = "success") {
    const notification = document.getElementById("notification");
    const notificationText = notification.querySelector(".notification-text");

    // Adicionar classe de tipo
    notification.className = "notification";
    if (type) {
      notification.classList.add(type);
    }

    notificationText.textContent = message;
    notification.classList.add("show");

    // Fechar automaticamente após 5 segundos
    setTimeout(() => {
      hideNotification();
    }, 5000);
  };

  function hideNotification() {
    const notification = document.getElementById("notification");
    notification.classList.remove("show");
  }

  // Fechar notificação ao clicar no X
  const closeBtn = document.querySelector(".notification-close");
  if (closeBtn) {
    closeBtn.addEventListener("click", hideNotification);
  }
}

// ===== BOTÃO VOLTAR AO TOPO =====
function initBackToTop() {
  // Criar botão voltar ao topo
  const backToTop = document.createElement("div");
  backToTop.className = "back-to-top";
  backToTop.innerHTML = '<i class="fas fa-chevron-up"></i>';
  backToTop.setAttribute("aria-label", "Voltar ao topo");
  backToTop.setAttribute("title", "Voltar ao topo");

  // Criar container para botões flutuantes
  const floatingButtons = document.createElement("div");
  floatingButtons.className = "floating-buttons";

  // Mover o WhatsApp para dentro do container se existir
  const whatsappFloat = document.querySelector(".whatsapp-float");
  if (whatsappFloat) {
    floatingButtons.appendChild(whatsappFloat);
  }

  floatingButtons.appendChild(backToTop);
  document.body.appendChild(floatingButtons);

  // Mostrar/ocultar botão baseado no scroll
  function toggleBackToTop() {
    if (window.scrollY > 300) {
      backToTop.classList.add("show");
    } else {
      backToTop.classList.remove("show");
    }
  }

  // Scroll suave para o topo
  backToTop.addEventListener("click", (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });

  window.addEventListener("scroll", toggleBackToTop);
  toggleBackToTop(); // Verificar estado inicial
}

// ===== MELHORIAS NO WHATSAPP =====
function initWhatsAppEnhancements() {
  const whatsappButton = document.querySelector(".whatsapp-button");

  if (whatsappButton) {
    // Adicionar classe de animação
    whatsappButton.classList.add("pulse");

    // Efeito adicional no hover
    whatsappButton.addEventListener("mouseenter", function () {
      this.style.transform = "scale(1.1) rotate(5deg)";
    });

    whatsappButton.addEventListener("mouseleave", function () {
      this.style.transform = "scale(1) rotate(0deg)";
    });

    // Analytics simples (opcional)
    whatsappButton.addEventListener("click", function () {
      // Aqui você pode adicionar tracking do Google Analytics
      console.log("WhatsApp clicado - Dra. Vitória Santos");
    });
  }
}

// ===== FUNÇÕES GLOBAIS =====
function mostrarConfirmacao() {
  const elemento = document.getElementById("confirmation-message");
  elemento.classList.add("confirmation-visible");
}

function fecharConfirmacao() {
  const elemento = document.getElementById("confirmation-message");
  elemento.classList.remove("confirmation-visible");
}

// ===== OTIMIZAÇÕES DE PERFORMANCE =====
// Debounce para eventos de scroll e resize
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Aplicar debounce em eventos pesados
const debouncedScroll = debounce(() => {
  // Código que precisa ser executado no scroll
}, 10);

const debouncedResize = debounce(() => {
  // Código que precisa ser executado no resize
}, 250);

window.addEventListener("scroll", debouncedScroll);
window.addEventListener("resize", debouncedResize);

// ===== TRATAMENTO DE ERROS =====
window.addEventListener("error", function (e) {
  console.error("Erro capturado:", e.error);
});

// ===== COMPATIBILIDADE =====
// Polyfill para smooth scroll em navegadores mais antigos
if (!("scrollBehavior" in document.documentElement.style)) {
  import(
    "https://cdn.jsdelivr.net/npm/smoothscroll-polyfill@0.4.4/dist/smoothscroll.min.js"
  )
    .then(() => {
      // Polyfill carregado
    })
    .catch((err) => {
      console.warn("Polyfill de smooth scroll não pôde ser carregado:", err);
    });
}

// ===== INICIALIZAÇÃO SEGURA =====
// Garantir que as funções existam globalmente
window.mostrarConfirmacao = mostrarConfirmacao;
window.fecharConfirmacao = fecharConfirmacao;
window.showNotification = window.showNotification || function () {};

// Prevenir múltiplas inicializações
let initialized = false;
if (!initialized) {
  initialized = true;
  // Código de inicialização já foi executado no DOMContentLoaded
}
// shader-effect.js
class ShaderBackground {
  constructor() {
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.material = null;
    this.mesh = null;
    this.clock = new THREE.Clock();
    this.isInitialized = false;

    this.init();
  }

  init() {
    try {
      // Configurar cena
      this.scene = new THREE.Scene();

      // Configurar câmera
      this.camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
      );
      this.camera.position.z = 1;

      // Configurar renderizador
      this.renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: false,
      });
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

      // Criar material do shader
      this.createShaderMaterial();

      // Criar geometria
      const geometry = new THREE.PlaneGeometry(4, 4);
      this.mesh = new THREE.Mesh(geometry, this.material);
      this.mesh.position.set(0, -0.75, -0.5);
      this.scene.add(this.mesh);

      // Adicionar ao DOM
      const container = document.getElementById("shader-background");
      if (container) {
        container.appendChild(this.renderer.domElement);
        this.renderer.domElement.classList.add("shader-canvas");
      }

      this.isInitialized = true;
      this.animate();

      // Configurar event listeners
      this.setupEventListeners();
    } catch (error) {
      console.error("Erro ao inicializar shader background:", error);
    }
  }

  createShaderMaterial() {
    const vertexShader = `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `;

    const fragmentShader = `
      #ifdef GL_ES
        precision lowp float;
      #endif
      uniform float iTime;
      uniform vec2 iResolution;
      varying vec2 vUv;
      
      vec4 buf[8];
      
      vec4 sigmoid(vec4 x) { return 1. / (1. + exp(-x)); }
      
      vec4 cppn_fn(vec2 coordinate, float in0, float in1, float in2) {
        // layer 1 *********************************************************************
        buf[6] = vec4(coordinate.x, coordinate.y, 0.3948333106474662 + in0, 0.36 + in1);
        buf[7] = vec4(0.14 + in2, sqrt(coordinate.x * coordinate.x + coordinate.y * coordinate.y), 0., 0.);

        // layer 2 ********************************************************************
        buf[0] = mat4(vec4(6.5404263, -3.6126034, 0.7590882, -1.13613), vec4(2.4582713, 3.1660357, 1.2219609, 0.06276096), vec4(-5.478085, -6.159632, 1.8701609, -4.7742867), vec4(6.039214, -5.542865, -0.90925294, 3.251348))
        * buf[6]
        + mat4(vec4(0.8473259, -5.722911, 3.975766, 1.6522468), vec4(-0.24321538, 0.5839259, -1.7661959, -5.350116), vec4(0.0, 0.0, 0.0, 0.0), vec4(0.0, 0.0, 0.0, 0.0))
        * buf[7]
        + vec4(0.21808943, 1.1243913, -1.7969975, 5.0294676);
        
        buf[1] = mat4(vec4(-3.3522482, -6.0612736, 0.55641043, -4.4719114), vec4(0.8631464, 1.7432913, 5.643898, 1.6106541), vec4(2.4941394, -3.5012043, 1.7184316, 6.357333), vec4(3.310376, 8.209261, 1.1355612, -1.165539))
        * buf[6]
        + mat4(vec4(5.24046, -13.034365, 0.009859298, 15.870829), vec4(2.987511, 3.129433, -0.89023495, -1.6822904), vec4(0.0, 0.0, 0.0, 0.0), vec4(0.0, 0.0, 0.0, 0.0))
        * buf[7]
        + vec4(-5.9457836, -6.573602, -0.8812491, 1.5436668);

        buf[0] = sigmoid(buf[0]);
        buf[1] = sigmoid(buf[1]);

        // layer 3 ********************************************************************
        buf[2] = mat4(vec4(-15.219568, 8.095543, -2.429353, -1.9381982), vec4(-5.951362, 4.3115187, 2.6393783, 1.274315), vec4(-7.3145227, 6.7297835, 5.2473326, 5.9411426), vec4(5.0796127, 8.979051, -1.7278991, -1.158976))
        * buf[6]
        + mat4(vec4(-11.967154, -11.608155, 6.1486754, 11.237008), vec4(2.124141, -6.263192, -1.7050359, -0.7021966), vec4(0.0, 0.0, 0.0, 0.0), vec4(0.0, 0.0, 0.0, 0.0))
        * buf[7]
        + vec4(-4.17164, -3.2281182, -4.576417, -3.6401186);
        
        buf[3] = mat4(vec4(3.1832156, -13.738922, 1.879223, 3.233465), vec4(0.64300746, 12.768129, 1.9141049, 0.50990224), vec4(-0.049295485, 4.4807224, 1.4733979, 1.801449), vec4(5.0039253, 13.000481, 3.3991797, -4.5561905))
        * buf[6]
        + mat4(vec4(-0.1285731, 7.720628, -3.1425676, 4.742367), vec4(0.6393625, 3.714393, -0.8108378, -0.39174938), vec4(0.0, 0.0, 0.0, 0.0), vec4(0.0, 0.0, 0.0, 0.0))
        * buf[7]
        + vec4(-1.1811101, -21.621881, 0.7851888, 1.2329718);
        
        buf[2] = sigmoid(buf[2]);
        buf[3] = sigmoid(buf[3]);

        // layer 5 & 6 ****************************************************************
        buf[4] = mat4(vec4(5.214916, -7.183024, 2.7228765, 2.6592617), vec4(-5.601878, -25.3591, 4.067988, 0.4602802), vec4(-10.57759, 24.286327, 21.102104, 37.546658), vec4(4.3024497, -1.9625226, 2.3458803, -1.372816))
        * buf[0]
        + mat4(vec4(-17.6526, -10.507558, 2.2587414, 12.462782), vec4(6.265566, -502.75443, -12.642513, 0.9112289), vec4(-10.983244, 20.741234, -9.701768, -0.7635988), vec4(5.383626, 1.4819539, -4.1911616, -4.8444734))
        * buf[1]
        + mat4(vec4(12.785233, -16.345072, -0.39901125, 1.7955981), vec4(-30.48365, -1.8345358, 1.4542528, -1.1118771), vec4(19.872723, -7.337935, -42.941723, -98.52709), vec4(8.337645, -2.7312303, -2.2927687, -36.142323))
        * buf[2]
        + mat4(vec4(-16.298317, 3.5471997, -0.44300047, -9.444417), vec4(57.5077, -35.609753, 16.163465, -4.1534753), vec4(-0.07470326, -3.8656476, -7.0901804, 3.1523974), vec4(-12.559385, -7.077619, 1.490437, -0.8211543))
        * buf[3]
        + vec4(-7.67914, 15.927437, 1.3207729, -1.6686112);
        
        buf[5] = mat4(vec4(-1.4109162, -0.372762, -3.770383, -21.367174), vec4(-6.2103205, -9.35908, 0.92529047, 8.82561), vec4(11.460242, -22.348068, 13.625772, -18.693201), vec4(-0.3429052, -3.9905605, -2.4626114, -0.45033523))
        * buf[0]
        + mat4(vec4(7.3481627, -4.3661838, -6.3037653, -3.868115), vec4(1.5462853, 6.5488915, 1.9701879, -0.58291394), vec4(6.5858274, -2.2180402, 3.7127688, -1.3730392), vec4(-5.7973905, 10.134961, -2.3395722, -5.965605))
        * buf[1]
        + mat4(vec4(-2.5132585, -6.6685553, -1.4029363, -0.16285264), vec4(-0.37908727, 0.53738135, 4.389061, -1.3024765), vec4(-0.70647055, 2.0111287, -5.1659346, -3.728635), vec4(-13.562562, 10.487719, -0.9173751, -2.6487076))
        * buf[2]
        + mat4(vec4(-8.645013, 6.5546675, -6.3944063, -5.5933375), vec4(-0.57783127, -1.077275, 36.91025, 5.736769), vec4(14.283112, 3.7146652, 7.1452246, -4.5958776), vec4(2.7192075, 3.6021907, -4.366337, -2.3653464))
        * buf[3]
        + vec4(-5.9000807, -4.329569, 1.2427121, 8.59503);

        buf[4] = sigmoid(buf[4]);
        buf[5] = sigmoid(buf[5]);

        // layer 7 & 8 ****************************************************************
        buf[6] = mat4(vec4(-1.61102, 0.7970257, 1.4675229, 0.20917463), vec4(-28.793737, -7.1390953, 1.5025433, 4.656581), vec4(-10.94861, 39.66238, 0.74318546, -10.095605), vec4(-0.7229728, -1.5483948, 0.7301322, 2.1687684))
        * buf[0]
        + mat4(vec4(3.2547753, 21.489103, -1.0194173, -3.3100595), vec4(-3.7316632, -3.3792162, -7.223193, -0.23685838), vec4(13.1804495, 0.7916005, 5.338587, 5.687114), vec4(-4.167605, -17.798311, -6.815736, -1.6451967))
        * buf[1]
        + mat4(vec4(0.604885, -7.800309, -7.213122, -2.741014), vec4(-3.522382, -0.12359311, -0.5258442, 0.43852118), vec4(9.6752825, -22.853785, 2.062431, 0.099892326), vec4(-4.3196306, -17.730087, 2.5184598, 5.30267))
        * buf[2]
        + mat4(vec4(-6.545563, -15.790176, -6.0438633, -5.415399), vec4(-43.591583, 28.551912, -16.00161, 18.84728), vec4(4.212382, 8.394307, 3.0958717, 8.657522), vec4(-5.0237565, -4.450633, -4.4768, -5.5010443))
        * buf[3]
        + mat4(vec4(1.6985557, -67.05806, 6.897715, 1.9004834), vec4(1.8680354, 2.3915145, 2.5231109, 4.081538), vec4(11.158006, 1.7294737, 2.0738268, 7.386411), vec4(-4.256034, -306.24686, 8.258898, -17.132736))
        * buf[4]
        + mat4(vec4(1.6889864, -4.5852966, 3.8534803, -6.3482175), vec4(1.3543309, -1.2640043, 9.932754, 2.9079645), vec4(-5.2770967, 0.07150358, -0.13962056, 3.3269649), vec4(28.34703, -4.918278, 6.1044083, 4.085355))
        * buf[5]
        + vec4(6.6818056, 12.522166, -3.7075126, -4.104386);
        
        buf[7] = mat4(vec4(-8.265602, -4.7027016, 5.098234, 0.7509808), vec4(8.6507845, -17.15949, 16.51939, -8.884479), vec4(-4.036479, -2.3946867, -2.6055532, -1.9866527), vec4(-2.2167742, -1.8135649, -5.9759874, 4.8846445))
        * buf[0]
        + mat4(vec4(6.7790847, 3.5076547, -2.8191125, -2.7028968), vec4(-5.743024, -0.27844876, 1.4958696, -5.0517144), vec4(13.122226, 15.735168, -2.9397483, -4.101023), vec4(-14.375265, -5.030483, -6.2599335, 2.9848232))
        * buf[1]
        + mat4(vec4(4.0950394, -0.94011575, -5.674733, 4.755022), vec4(4.3809423, 4.8310084, 1.7425908, -3.437416), vec4(2.117492, 0.16342592, -104.56341, 16.949184), vec4(-5.22543, -2.994248, 3.8350096, -1.9364246))
        * buf[2]
        + mat4(vec4(-5.900337, 1.7946124, -13.604192, -3.8060522), vec4(6.6583457, 31.911177, 25.164474, 91.81147), vec4(11.840538, 4.1503043, -0.7314397, 6.768467), vec4(-6.3967767, 4.034772, 6.1714606, -0.32874924))
        * buf[3]
        + mat4(vec4(3.4992442, -196.91893, -8.923708, 2.8142626), vec4(3.4806502, -3.1846354, 5.1725626, 5.1804223), vec4(-2.4009497, 15.585794, 1.2863957, 2.0252278), vec4(-71.25271, -62.441242, -8.138444, 0.50670296))
        * buf[4]
        + mat4(vec4(-12.291733, -11.176166, -7.3474145, 4.390294), vec4(10.805477, 5.6337385, -0.9385842, -4.7348723), vec4(-12.869276, -7.039391, 5.3029537, 7.5436664), vec4(1.4593618, 8.91898, 3.5101583, 5.840625))
        * buf[5]
        + vec4(2.2415268, -6.705987, -0.98861027, -2.117676);

        buf[6] = sigmoid(buf[6]);
        buf[7] = sigmoid(buf[7]);

        // layer 9 ********************************************************************
        buf[0] = mat4(vec4(1.6794263, 1.3817469, 2.9625452, 0.0), vec4(-1.8834411, -1.4806935, -3.5924516, 0.0), vec4(-1.3279216, -1.0918057, -2.3124623, 0.0), vec4(0.2662234, 0.23235129, 0.44178495, 0.0))
        * buf[0]
        + mat4(vec4(-0.6299101, -0.5945583, -0.9125601, 0.0), vec4(0.17828953, 0.18300213, 0.18182953, 0.0), vec4(-2.96544, -2.5819945, -4.9001055, 0.0), vec4(1.4195864, 1.1868085, 2.5176322, 0.0))
        * buf[1]
        + mat4(vec4(-1.2584374, -1.0552157, -2.1688404, 0.0), vec4(-0.7200217, -0.52666044, -1.438251, 0.0), vec4(0.15345335, 0.15196142, 0.272854, 0.0), vec4(0.945728, 0.8861938, 1.2766753, 0.0))
        * buf[2]
        + mat4(vec4(-2.4218085, -1.968602, -4.35166, 0.0), vec4(-22.683098, -18.0544, -41.954372, 0.0), vec4(0.63792, 0.5470648, 1.1078634, 0.0), vec4(-1.5489894, -1.3075932, -2.6444845, 0.0))
        * buf[3]
        + mat4(vec4(-0.49252132, -0.39877754, -0.91366625, 0.0), vec4(0.95609266, 0.7923952, 1.640221, 0.0), vec4(0.30616966, 0.15693925, 0.8639857, 0.0), vec4(1.1825981, 0.94504964, 2.176963, 0.0))
        * buf[4]
        + mat4(vec4(0.35446745, 0.3293795, 0.59547555, 0.0), vec4(-0.58784515, -0.48177817, -1.0614829, 0.0), vec4(2.5271258, 1.9991658, 4.6846647, 0.0), vec4(0.13042648, 0.08864098, 0.30187556, 0.0))
        * buf[5]
        + mat4(vec4(-1.7718065, -1.4033192, -3.3355875, 0.0), vec4(3.1664357, 2.638297, 5.378702, 0.0), vec4(-3.1724713, -2.6107926, -5.549295, 0.0), vec4(-2.851368, -2.249092, -5.3013067, 0.0))
        * buf[6]
        + mat4(vec4(1.5203838, 1.2212278, 2.8404984, 0.0), vec4(1.5210563, 1.2651345, 2.683903, 0.0), vec4(2.9789467, 2.4364579, 5.2347264, 0.0), vec4(2.2270417, 1.8825914, 3.8028636, 0.0))
        * buf[7]
        + vec4(-1.5468478, -3.6171484, 0.24762098, 0.0);

        buf[0] = sigmoid(buf[0]);
        return vec4(buf[0].x , buf[0].y , buf[0].z, 1.0);
      }
      
      void main() {
        vec2 uv = vUv * 2.0 - 1.0; uv.y *= -1.0;
        gl_FragColor = cppn_fn(uv, 0.1 * sin(0.3 * iTime), 0.1 * sin(0.69 * iTime), 0.1 * sin(0.44 * iTime));
      }
    `;

    this.material = new THREE.ShaderMaterial({
      uniforms: {
        iTime: { value: 0 },
        iResolution: {
          value: new THREE.Vector2(window.innerWidth, window.innerHeight),
        },
      },
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
      side: THREE.DoubleSide,
    });
  }

  animate() {
    if (!this.isInitialized) return;

    requestAnimationFrame(() => this.animate());

    const elapsedTime = this.clock.getElapsedTime();

    if (this.material) {
      this.material.uniforms.iTime.value = elapsedTime;
    }

    this.renderer.render(this.scene, this.camera);
  }

  setupEventListeners() {
    window.addEventListener("resize", () => this.onWindowResize());
  }

  onWindowResize() {
    if (!this.isInitialized) return;

    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);

    if (this.material) {
      this.material.uniforms.iResolution.value.set(
        window.innerWidth,
        window.innerHeight
      );
    }
  }

  destroy() {
    if (this.renderer) {
      this.renderer.dispose();
    }
    this.isInitialized = false;
  }
}

// Inicializar quando o DOM estiver carregado
let shaderBackground = null;

function initShaderEffect() {
  if (typeof THREE === "undefined") {
    console.error("Three.js não carregado");
    return;
  }

  shaderBackground = new ShaderBackground();

  // Ativar animação de entrada
  setTimeout(() => {
    const shaderContainer = document.getElementById("shader-background");
    if (shaderContainer) {
      shaderContainer.classList.add("active");
    }
  }, 300);
}

// Exportar para uso global
window.initShaderEffect = initShaderEffect;
