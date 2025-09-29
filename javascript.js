// JS principal
document.addEventListener("DOMContentLoaded", () => {
  // Scroll suave en CTA
  document.querySelectorAll("[data-scroll]").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const target = document.querySelector(btn.dataset.scroll);
      if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  // === Cuenta atrás ===
  const DIANA = new Date("2025-10-18T00:00:00+02:00"); // Europe/Madrid
  const $dias = document.getElementById("dias");
  const $horas = document.getElementById("horas");
  const $min = document.getElementById("minutos");
  const $seg = document.getElementById("segundos");

  function tick() {
    const ahora = new Date();
    let diff = DIANA.getTime() - ahora.getTime();

    if (diff < 0) diff = 0;

    const d = Math.floor(diff / (1000 * 60 * 60 * 24));
    const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const s = Math.floor((diff % (1000 * 60)) / 1000);

    $dias.textContent = String(d);
    $horas.textContent = String(h).padStart(2, "0");
    $min.textContent = String(m).padStart(2, "0");
    $seg.textContent = String(s).padStart(2, "0");
  }
  tick();
  setInterval(tick, 1000);

  // === Polaroid: revelar foto y sonido ===
  const polaroid = document.getElementById("polaroidFoto");
  const fotoReal = document.getElementById("fotoReal");
  if (polaroid && fotoReal) {
    polaroid.addEventListener("click", () => {
      fotoReal.src = "Nosotros.jpg";
      requestAnimationFrame(() => {
        fotoReal.style.opacity = "1";
        const caption = document.querySelector(".texto-polaroid");
        if (caption) caption.style.opacity = "1";
      });
      const audio = new Audio("camera-click.mp3");
      audio.play().catch(()=>{});
    });
  }

  // === Avión con trayectoria en corazón ===
  const canvas = document.getElementById("canvasAvion");
  if (canvas && canvas.getContext) {
    const ctx = canvas.getContext("2d");

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener("resize", resize);

    const avion = new Image();
    avion.src = "avion1.png";
    let angle = 0;
    let trail = [];

    function heart(t) {
      const scale = 12;
      const cx = canvas.width / 2;
      const cy = canvas.height / 2.2;
      const x = cx + scale * 16 * Math.pow(Math.sin(t), 3);
      const y = cy - scale * (13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
      return { x, y };
    }

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const { x, y } = heart(angle);
      trail.push({ x, y });
      if (trail.length > 300) trail.shift();

      ctx.beginPath();
      for (let i = 0; i < trail.length - 1; i++) {
        ctx.moveTo(trail[i].x, trail[i].y);
        ctx.lineTo(trail[i + 1].x, trail[i + 1].y);
      }
      ctx.strokeStyle = "rgba(90,42,42,0.35)";
      ctx.lineWidth = 2;
      ctx.stroke();

      const next = heart(angle + 0.01);
      const rad = Math.atan2(next.y - y, next.x - x);

      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rad);
      ctx.drawImage(avion, -30, -15, 60, 30);
      ctx.restore();

      angle += 0.015;
      if (angle >= Math.PI * 2) { angle = 0; trail = []; }

      requestAnimationFrame(draw);
    }
    avion.onload = draw;
  }

  // === Envío del formulario ===
  const form = document.querySelector(".formulario-asistencia");
  if (form) {
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      const formData = new FormData(form);

      try {
        const res = await fetch(form.action, { method: "POST", body: formData });
        // Intenta leer JSON, pero si el GAS no devuelve JSON, seguimos igualmente.
        let ok = res.ok;
        try {
          const json = await res.json();
          ok = ok && (json.status === "success" || json.result === "success");
        } catch(_) {}

        // Construir query params para la tarjeta de embarque
        const params = new URLSearchParams({
          nombre: formData.get("nombre") || "",
          parentesco: formData.get("parentesco") || "",
          numeroInvitados: formData.get("numero_invitados") || "",
          telefono: formData.get("telefono") || "",
          chozo: formData.get("chozo") || "",
          cancion: formData.get("cancion") || "",
          mensaje: formData.get("mensaje") || ""
        });

        // Redirigir SIEMPRE a confirmacion.html (en la misma carpeta)
        window.location.href = `confirmacion.html?${params.toString()}`;
      } catch (e) {
        alert("No se pudo enviar ahora mismo. Revisa tu conexión e inténtalo de nuevo.");
        console.error(e);
      }
    });
  }
});
