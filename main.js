/* Fundiag — carga de contenido desde content/*.json y lógica de interfaz */
(function () {
  "use strict";

  const esc = (s) =>
    String(s ?? "").replace(/[&<>"']/g, (c) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
    }[c]));

  const fmtCOP = (n) => "$" + Number(n).toLocaleString("es-CO");

  async function loadJSON(name) {
    const res = await fetch(`content/${name}.json`, { cache: "no-cache" });
    if (!res.ok) throw new Error(`No se pudo cargar content/${name}.json`);
    return res.json();
  }

  function bindData(data) {
    document.querySelectorAll("[data-bind]").forEach((el) => {
      const path = el.getAttribute("data-bind").split(".");
      let val = data;
      for (const k of path) val = val?.[k];
      if (val == null) return;
      if (el.tagName === "IMG") el.src = val;
      else el.textContent = val;
    });
  }

  function renderValores(valores) {
    document.getElementById("valores-list").innerHTML = valores
      .map(
        (v) => `<li class="flex items-center gap-2">
          <span class="w-2 h-2 bg-secondary rounded-full shrink-0" aria-hidden="true"></span>${esc(v)}</li>`
      )
      .join("");
  }

  function renderServicios(items) {
    document.getElementById("servicios-grid").innerHTML = items
      .map(
        (s, i) => `<article class="group bg-white/10 backdrop-blur-md rounded-2xl overflow-hidden border border-white/20 hover:bg-white/20 transition-all fade-in-up" style="transition-delay:${i * 100}ms">
          <div class="h-48 overflow-hidden">
            <img alt="${esc(s.titulo)}" loading="lazy" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" src="${esc(s.imagen)}" />
          </div>
          <div class="p-6 text-center">
            <h3 class="text-white font-heading text-lg font-semibold mb-2">${esc(s.titulo)}</h3>
            <p class="text-white/70 text-sm">${esc(s.descripcion)}</p>
          </div>
        </article>`
      )
      .join("");
  }

  function renderCasos(items) {
    document.getElementById("projects-carousel").innerHTML = items
      .map((c, i) => {
        const iconoBg = i % 2 === 0
          ? "bg-primary/10 text-primary"
          : "bg-secondary-container/30 text-secondary";
        return `<article class="flex-none w-[320px] md:w-[400px] snap-start bg-white rounded-2xl shadow-md border border-outline-variant overflow-hidden flex flex-col hover:shadow-xl transition-all">
          <div class="p-6 flex-grow flex flex-col">
            <div class="flex items-start gap-4 mb-4">
              <div class="w-12 h-12 rounded-2xl ${iconoBg} flex items-center justify-center shrink-0">
                <span class="material-symbols-outlined" aria-hidden="true">${esc(c.icono || "star")}</span>
              </div>
              <div>
                <h3 class="font-heading text-lg font-semibold leading-tight text-primary">${esc(c.titulo)}</h3>
                <p class="text-xs font-semibold text-on-surface-variant mt-1">${esc(c.organizacion || "")}</p>
              </div>
            </div>
            <p class="text-sm text-on-surface-variant mb-4">${esc(c.descripcion)}</p>
            ${c.categoria ? `<div class="flex flex-wrap gap-2"><span class="px-3 py-1 rounded-full bg-secondary-container/30 text-on-secondary-container text-xs font-semibold">${esc(c.categoria)}</span></div>` : ""}
          </div>
          <div class="bg-surface-container-low p-6 border-t border-outline-variant flex justify-between gap-8">
            <div class="flex flex-col">
              <span class="text-sm font-bold ${i % 2 === 0 ? "text-primary" : "text-secondary"}">${esc(c.metrica_valor || "")}</span>
              <span class="text-[10px] uppercase tracking-wider text-on-surface-variant">${esc(c.metrica_etiqueta || "")}</span>
            </div>
            ${c.aliado ? `<div class="flex flex-col text-right">
              <span class="text-sm font-bold text-primary">${esc(c.aliado)}</span>
              <span class="text-[10px] uppercase tracking-wider text-on-surface-variant">Aliado</span>
            </div>` : ""}
          </div>
        </article>`;
      })
      .join("");
  }

  function renderTransparencia(docs) {
    document.getElementById("transparencia-grid").innerHTML = docs
      .map((d, i) => {
        const url = d.enlace || d.archivo;
        const enlace = url
          ? `<a class="text-primary text-sm font-semibold flex items-center gap-1 hover:underline" href="${esc(url)}" target="_blank" rel="noopener">Ver documento <span class="material-symbols-outlined text-sm" aria-hidden="true">open_in_new</span></a>`
          : `<span class="text-on-surface-variant text-sm">Disponible próximamente</span>`;
        return `<article class="bg-surface p-6 rounded-2xl shadow-sm hover:shadow-md transition-all group fade-in-up" style="transition-delay:${(i % 4) * 100}ms">
          <div class="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mb-4 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
            <span class="material-symbols-outlined" aria-hidden="true">${esc(d.icono || "description")}</span>
          </div>
          <h3 class="font-semibold mb-2">${esc(d.titulo)}</h3>
          ${d.descripcion ? `<p class="text-sm text-on-surface-variant mb-4">${esc(d.descripcion)}</p>` : ""}
          ${enlace}
        </article>`;
      })
      .join("");
  }

  /* ---------- Donaciones ---------- */
  let selectedAmount = null;
  let selectedFreq = "Única";

  function renderMontos(montos) {
    const grid = document.getElementById("amount-selector");
    grid.innerHTML =
      montos
        .map(
          (v) => `<button type="button" class="amt-btn p-4 border-2 border-outline-variant rounded-2xl hover:border-primary hover:bg-primary/5 transition-all text-sm font-medium" data-val="${Number(v)}" aria-pressed="false">${fmtCOP(v)}</button>`
        )
        .join("") +
      `<div class="border-2 border-outline-variant rounded-2xl p-2 flex flex-col items-center transition-all bg-white focus-within:border-primary" id="other-container">
        <label for="other-amt-input" class="text-[10px] uppercase text-on-surface-variant font-bold">Otro monto</label>
        <input class="w-full border-none p-0 text-center focus:ring-0 bg-transparent text-sm font-bold" id="other-amt-input" placeholder="$" type="number" min="1000" inputmode="numeric" />
      </div>`;

    const amtBtns = grid.querySelectorAll(".amt-btn");
    const otherInput = grid.querySelector("#other-amt-input");
    const otherContainer = grid.querySelector("#other-container");

    const clearAmts = () => {
      amtBtns.forEach((b) => {
        b.classList.remove("bg-primary", "text-white", "border-primary");
        b.classList.add("border-outline-variant");
        b.setAttribute("aria-pressed", "false");
      });
      otherContainer.classList.remove("border-primary");
      otherContainer.classList.add("border-outline-variant");
    };

    amtBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        clearAmts();
        otherInput.value = "";
        btn.classList.add("bg-primary", "text-white", "border-primary");
        btn.classList.remove("border-outline-variant");
        btn.setAttribute("aria-pressed", "true");
        selectedAmount = Number(btn.dataset.val);
      });
    });
    otherInput.addEventListener("focus", () => {
      clearAmts();
      otherContainer.classList.add("border-primary");
      otherContainer.classList.remove("border-outline-variant");
      selectedAmount = null;
    });
    otherInput.addEventListener("input", () => {
      selectedAmount = Number(otherInput.value) || null;
    });
  }

  function setupFrequency() {
    const freqBtns = document.querySelectorAll(".freq-btn");
    freqBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        freqBtns.forEach((b) => {
          b.classList.remove("bg-primary", "text-white", "border-primary", "font-bold");
          b.classList.add("border-outline-variant", "text-on-surface-variant");
          b.setAttribute("aria-pressed", "false");
        });
        btn.classList.add("bg-primary", "text-white", "border-primary", "font-bold");
        btn.classList.remove("border-outline-variant", "text-on-surface-variant");
        btn.setAttribute("aria-pressed", "true");
        selectedFreq = btn.dataset.freq;
      });
    });
  }

  function setupModal(donaciones) {
    const modal = document.getElementById("donation-modal");
    const openBtn = document.getElementById("header-donate-btn");
    const modalContent = document.getElementById("modal-content");
    const successScreen = document.getElementById("donation-success");
    let lastFocused = null;

    function openModal() {
      lastFocused = document.activeElement;
      modal.classList.remove("hidden");
      modal.classList.add("flex");
      requestAnimationFrame(() => modal.classList.add("opacity-100"));
      document.body.style.overflow = "hidden";
      modalContent.classList.remove("hidden");
      successScreen.classList.add("hidden");
      successScreen.classList.remove("flex");
      const first = modal.querySelector("button, input, a");
      if (first) first.focus();
    }
    function closeModal() {
      modal.classList.remove("opacity-100");
      setTimeout(() => {
        modal.classList.add("hidden");
        modal.classList.remove("flex");
        document.body.style.overflow = "";
        if (lastFocused) lastFocused.focus();
      }, 300);
    }

    openBtn.addEventListener("click", openModal);
    modal.querySelectorAll("[data-close-modal]").forEach((b) => b.addEventListener("click", closeModal));
    modal.addEventListener("click", (e) => { if (e.target === modal) closeModal(); });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && !modal.classList.contains("hidden")) closeModal();
      if (e.key === "Tab" && !modal.classList.contains("hidden")) {
        const focusables = modal.querySelectorAll("button, input, a[href]");
        if (!focusables.length) return;
        const first = focusables[0], last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) { last.focus(); e.preventDefault(); }
        else if (!e.shiftKey && document.activeElement === last) { first.focus(); e.preventDefault(); }
      }
    });

    document.getElementById("submit-donation").addEventListener("click", () => {
      const contacto = document.querySelector('input[name="contact"]:checked')?.value === "si" ? "Sí" : "No";
      const monto = selectedAmount ? fmtCOP(selectedAmount) + " COP" : "Sin especificar";
      const cuerpo = [
        "Hola, quiero hacer una donación a Fundiag.",
        "", `Monto: ${monto}`, `Frecuencia: ${selectedFreq}`,
        `¿Acepta recibir novedades por correo?: ${contacto}`, "",
        "Por favor contáctenme para finalizar el proceso.",
      ].join("\n");
      const mailto = `mailto:${donaciones.email_destino}?subject=${encodeURIComponent("Donación a Fundiag — " + monto)}&body=${encodeURIComponent(cuerpo)}`;
      window.location.href = mailto;
      modalContent.classList.add("hidden");
      successScreen.classList.remove("hidden");
      successScreen.classList.add("flex");
      successScreen.querySelector("button").focus();
    });
  }

  /* ---------- Navegación ---------- */
  function setupNav() {
    const toggle = document.getElementById("menu-toggle");
    const closeBtn = document.getElementById("menu-close");
    const drawer = document.getElementById("mobile-drawer");
    const overlay = document.getElementById("drawer-overlay");
    function toggleMenu() {
      const open = drawer.classList.toggle("-translate-x-full") === false;
      overlay.classList.toggle("hidden");
      setTimeout(() => overlay.classList.toggle("opacity-0"), 10);
      document.body.classList.toggle("overflow-hidden");
      toggle.setAttribute("aria-expanded", String(open));
    }
    toggle.addEventListener("click", toggleMenu);
    closeBtn.addEventListener("click", toggleMenu);
    overlay.addEventListener("click", toggleMenu);
    document.querySelectorAll("#mobile-nav a").forEach((a) =>
      a.addEventListener("click", () => {
        if (!drawer.classList.contains("-translate-x-full")) toggleMenu();
      })
    );

    // Resaltar sección activa al hacer scroll
    const sections = document.querySelectorAll("main section[id], footer[id]");
    const links = document.querySelectorAll(".nav-link");
    const spy = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          links.forEach((l) => {
            const active = l.getAttribute("href") === "#" + entry.target.id;
            l.classList.toggle("text-secondary", active);
            l.classList.toggle("border-b-2", active);
            l.classList.toggle("border-secondary", active);
            if (active) l.setAttribute("aria-current", "true");
            else l.removeAttribute("aria-current");
          });
        });
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );
    sections.forEach((s) => spy.observe(s));
  }

  function setupCarousel() {
    const carousel = document.getElementById("projects-carousel");
    const prev = document.getElementById("carousel-prev");
    const next = document.getElementById("carousel-next");
    const wrapper = prev.parentElement;
    const step = () => (carousel.firstElementChild?.offsetWidth || 340) + 24;
    prev.addEventListener("click", () => carousel.scrollBy({ left: -step(), behavior: "smooth" }));
    next.addEventListener("click", () => carousel.scrollBy({ left: step(), behavior: "smooth" }));
    // Ocultar los botones cuando todas las tarjetas caben en pantalla
    const updateButtons = () => {
      wrapper.classList.toggle("hidden", carousel.scrollWidth <= carousel.clientWidth + 4);
    };
    updateButtons();
    window.addEventListener("resize", updateButtons);
  }

  function setupFadeIn() {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add("visible")),
      { threshold: 0.1 }
    );
    document.querySelectorAll(".fade-in-up").forEach((el) => observer.observe(el));
  }

  function setupFooter(general) {
    const c = general.contacto || {};
    const email = document.getElementById("footer-email");
    email.textContent = c.email || "";
    email.href = "mailto:" + (c.email || "");
    if (c.telefono) {
      document.getElementById("footer-tel-row").hidden = false;
      document.getElementById("footer-tel").textContent = c.telefono;
    }
    if (c.direccion) {
      document.getElementById("footer-dir-row").hidden = false;
      document.getElementById("footer-dir").textContent = c.direccion;
    }
    const social = document.getElementById("footer-social");
    const redes = [
      { url: c.facebook, nombre: "Facebook" },
      { url: c.instagram, nombre: "Instagram" },
      { url: c.whatsapp, nombre: "WhatsApp" },
    ].filter((r) => r.url);
    social.innerHTML = redes
      .map(
        (r) => `<a class="text-sm font-semibold text-primary hover:underline" href="${esc(r.url)}" target="_blank" rel="noopener">${esc(r.nombre)}</a>`
      )
      .join("");
    document.getElementById("footer-year").textContent = new Date().getFullYear();
  }

  /* ---------- Inicio ---------- */
  async function init() {
    try {
      const [general, nosotros, servicios, casos, transparencia, donaciones] =
        await Promise.all([
          loadJSON("general"), loadJSON("nosotros"), loadJSON("servicios"),
          loadJSON("casos"), loadJSON("transparencia"), loadJSON("donaciones"),
        ]);

      bindData({ ...general, nosotros, servicios, casos, transparencia, donaciones });
      document.getElementById("meta-desc").setAttribute("content", general.descripcion_meta || "");
      document.getElementById("hero-bg").style.backgroundImage = `url('${general.hero.imagen_fondo}')`;
      document.getElementById("hero-side-img").src = general.hero.imagen_lateral;
      document.getElementById("mision-img").src = nosotros.imagen_mision;

      renderValores(nosotros.valores || []);
      renderServicios(servicios.items || []);
      renderCasos(casos.items || []);
      renderTransparencia(transparencia.documentos || []);
      renderMontos(donaciones.montos || []);

      setupFrequency();
      setupModal(donaciones);
      setupNav();
      setupCarousel();
      setupFadeIn();
      setupFooter(general);
    } catch (err) {
      console.error(err);
      document.body.insertAdjacentHTML(
        "afterbegin",
        '<p style="padding:1rem;background:#ffdad6;color:#93000a;text-align:center">No se pudo cargar el contenido. Asegúrate de abrir el sitio desde un servidor (no como archivo local).</p>'
      );
    }
  }

  init();
})();
