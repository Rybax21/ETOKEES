function qp(k){const p=new URLSearchParams(window.location.search);return p.get(k)||"";}

function setText(id, val){const el=document.getElementById(id); if(el) el.textContent = val || "—";}

function updateQR(text){
  const url = `https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(text)}`;
  const img = document.getElementById("qr");
  if (img) img.src = url;
}

window.addEventListener("DOMContentLoaded", () => {
  const datos = {
    nombre: qp("nombre"),
    parentesco: qp("parentesco"),
    numeroInvitados: qp("numeroInvitados") || qp("numero_invitados"),
    telefono: qp("telefono"),
    chozo: qp("chozo"),
    cancion: qp("cancion"),
    mensaje: qp("mensaje")
  };

  setText("nombre", datos.nombre);
  setText("parentesco", datos.parentesco);
  setText("numeroInvitados", datos.numeroInvitados);
  setText("telefono", datos.telefono);
  setText("chozo", datos.chozo);
  setText("cancion", datos.cancion);
  setText("mensaje", datos.mensaje);

  updateQR(`Invitado: ${datos.nombre}\nInvitados: ${datos.numeroInvitados}\nChozo: ${datos.chozo}`);

  // Generar imagen sencilla del "boarding pass" para guardar
  const btn = document.getElementById("guardar");
  const canvas = document.getElementById("render");
  const ctx = canvas.getContext("2d");

  function drawImage(){
    const W = canvas.width, H = canvas.height;
    ctx.fillStyle = "#f7f3ee"; ctx.fillRect(0,0,W,H);
    ctx.fillStyle = "#fff"; ctx.fillRect(40,40,W-80,H-80);
    ctx.strokeStyle = "#dacfc2"; ctx.setLineDash([8,6]); ctx.strokeRect(40,40,W-80,H-80);
    ctx.setLineDash([]);

    ctx.fillStyle="#5a2a2a"; ctx.font="bold 28px Playfair Display, serif";
    ctx.fillText("Emilio & Sandra Airlines — Tarjeta de embarque", 60, 90);

    ctx.fillStyle="#1f1b1b"; ctx.font="600 22px Inter, sans-serif";
    const lines = [
      `Nombre: ${datos.nombre}`,
      `Parentesco: ${datos.parentesco}`,
      `Nº Invitados: ${datos.numeroInvitados}`,
      `Teléfono: ${datos.telefono}`,
      `¿Chozo?: ${datos.chozo}`,
      `Canción: ${datos.cancion}`,
      `Mensaje: ${datos.mensaje}`
    ];
    lines.forEach((t,i)=> ctx.fillText(t, 60, 140 + i*34));

    ctx.font="bold 64px Inter, sans-serif"; ctx.fillText("ES1810 · 2025", 60, 420);
    ctx.font="18px Inter, sans-serif"; ctx.fillStyle="#6d5f5f"; ctx.fillText("¡Gracias por confirmar! 💍", 60, 460);
  }

  if (btn) {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      drawImage();
      btn.href = canvas.toDataURL("image/png");
    });
  }
});
