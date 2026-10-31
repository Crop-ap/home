import {
  LIBRO, CAPITULOS, INSERTOS, TINTAS, PERSONAJES, CANDIDATOS, CRONOLOGIA, CODIGOS, RECURSOS,
  capituloDePagina, insertosCerca, insertosMencionadosEn, insertoPorId,
} from "./data.js";

/* ───────────── Utilidades ───────────── */
const $ = (s, el = document) => el.querySelector(s);
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const vista = $("#vista");
const modal = $("#modal");
const LS = {
  get: (k, d) => { try { const v = localStorage.getItem("teseo." + k); return v === null ? d : JSON.parse(v); } catch { return d; } },
  set: (k, v) => localStorage.setItem("teseo." + k, JSON.stringify(v)),
};
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
const tintaPorId = (id) => TINTAS.find((t) => t.id === id);
const capaPorId = (id) => LIBRO.capas.find((c) => c.id === id);
const FASES = { 0: "Lápiz de Eric (lo más antiguo)", 1: "1.ª conversación (azul y negro)", 2: "2.ª conversación (naranja y verde)", 3: "3.ª conversación (morado y rojo)", 4: "Notas finales (negro de ambos)" };
const faseTexto = (f) => (f == null ? "Momento por determinar" : FASES[f]);
const certezaTag = (c) => `<span class="muted small">· certeza ${esc(c)}</span>`;

// Página donde conviene leer el inserto: definida a mano (leerEn) o, si no, donde va guardado.
const paginaLectura = (i) => i.leerEn ?? (i.desde < 9999 ? i.desde : null);
const dondeGuardado = (i) => (i.pag === "contratapa" ? "la contratapa" : "pp. " + esc(i.pag));

function fichaInserto(i, vinculadas = [], { compacta = false } = {}) {
  const mVis = (i.menciones || []).filter((m) => !m.spoiler).sort((a, b) => a.pag - b.pag);
  const mSpo = (i.menciones || []).filter((m) => m.spoiler).sort((a, b) => a.pag - b.pag);
  const linea = (m) => `<li><b>p. ${m.pag}</b>: ${esc(m.desc)}</li>`;
  const pm = paginaLectura(i);
  return `<div class="ficha inserto">
    <p class="small muted">${esc(i.tipo)}</p><b>${esc(i.titulo)}</b>
    ${compacta ? "" : `<p class="small">${esc(i.desc)}</p>`}
    <div class="dato"><span>📍 Va guardado en</span><b>${dondeGuardado(i)}</b></div>
    <div class="dato"><span>📖 Léelo cuando llegues a</span><b>${pm != null ? "la p. " + pm : dondeGuardado(i)}</b>${pm != null && pm !== i.desde ? ` <span class="small muted">(aunque está guardado en ${dondeGuardado(i)})</span>` : pm == null ? "" : ` <span class="small muted">(donde va guardado)</span>`}</div>
    <div class="dato"><span>🕰 Momento de la historia</span><p class="small">${esc(i.momento?.texto || "")} <span class="muted small">· certeza ${esc(i.momento?.certeza || "?")}</span></p></div>
    <div class="dato"><span>✍️ Páginas que hablan de él</span>
      ${mVis.length || mSpo.length ? `<ul class="small">${mVis.map(linea).join("")}</ul>
        ${mSpo.length ? `<details><summary class="small muted">Ver ${mSpo.length === 1 ? "mención" : "menciones"} con spoiler (${mSpo.length})</summary><ul class="small">${mSpo.map(linea).join("")}</ul></details>` : ""}`
        : `<p class="small muted">Aún no se ha encontrado ninguna. Si das con una nota que lo mencione, regístrala aquí.</p>`}
    </div>
    ${vinculadas.length ? `<div class="dato"><span>🔎 Tus pistas sobre este inserto</span><ul class="small">${vinculadas.sort((a, b) => (a.pagina ?? 0) - (b.pagina ?? 0)).map((x) => `<li data-pista="${x.id}" style="cursor:pointer"><b>p. ${x.pagina ?? "?"}</b>: ${esc((x.texto || "(foto)").slice(0, 80))}</li>`).join("")}</ul></div>` : ""}
    <button class="btn sec small" data-vincular="${i.id}">＋ Registrar dónde lo mencionan</button>
  </div>`;
}
function conectarInsertos(root) {
  root.querySelectorAll("[data-vincular]").forEach((b) => (b.onclick = () => abrirFormPista(null, { inserto: b.dataset.vincular, tipo: "Nota al margen" })));
  root.querySelectorAll(".inserto [data-pista]").forEach((el) => (el.onclick = (e) => { e.stopPropagation(); abrirDetallePista(el.dataset.pista); }));
}

const TIPOS = ["Nota al margen", "Inserto", "Nota al pie (Caldeira)", "Texto de la novela", "Símbolo o dibujo", "Otro"];

/* ───────────── Almacenamiento (IndexedDB) ───────────── */
const db = await new Promise((res, rej) => {
  const r = indexedDB.open("teseo", 1);
  r.onupgradeneeded = () => {
    r.result.createObjectStore("pistas", { keyPath: "id" });
    r.result.createObjectStore("preguntas", { keyPath: "id" });
  };
  r.onsuccess = () => res(r.result);
  r.onerror = () => rej(r.error);
});
const store = (name, mode = "readonly") => db.transaction(name, mode).objectStore(name);
const idb = {
  all: (n) => new Promise((res) => { const q = store(n).getAll(); q.onsuccess = () => res(q.result || []); }),
  put: (n, v) => new Promise((res) => { const q = store(n, "readwrite").put(v); q.onsuccess = () => res(v); }),
  del: (n, id) => new Promise((res) => { const q = store(n, "readwrite").delete(id); q.onsuccess = () => res(); }),
  clear: (n) => new Promise((res) => { const q = store(n, "readwrite").clear(); q.onsuccess = () => res(); }),
};

/* ───────────── Estado ───────────── */
let tab = "lectura";
let guiaSec = LS.get("guiaSec", "capitulos");
const pagina = () => LS.get("pagina", null);
const estricto = () => LS.get("spoiler", "libre") === "estricto";

function actualizarChip() {
  const p = pagina();
  $("#chipPagina").textContent = p == null ? "p. —" : "p. " + p;
}

/* ───────────── Navegación ───────────── */
document.querySelectorAll("nav.tabs button").forEach((b) =>
  b.addEventListener("click", () => irA(b.dataset.tab))
);
$("#chipPagina").addEventListener("click", () => abrirSelectorPagina());

function irA(t) {
  tab = t;
  document.querySelectorAll("nav.tabs button").forEach((b) => b.classList.toggle("activo", b.dataset.tab === t));
  render();
  window.scrollTo({ top: 0 });
}

async function render() {
  actualizarChip();
  if (tab === "lectura") return renderLectura();
  if (tab === "pistas") return renderPistas();
  if (tab === "preguntar") return renderPreguntar();
  if (tab === "guia") return renderGuia();
  if (tab === "ajustes") return renderAjustes();
}

/* ───────────── Modal ───────────── */
function abrirModal(html, onMount) {
  modal.innerHTML = `<div class="modal"><div class="asa"></div>${html}</div>`;
  modal.classList.remove("oculto");
  document.body.style.overflow = "hidden";
  onMount && onMount(modal.firstElementChild);
}
function cerrarModal() {
  modal.classList.add("oculto");
  modal.innerHTML = "";
  document.body.style.overflow = "";
}
modal.addEventListener("click", (e) => { if (e.target === modal) cerrarModal(); });

function abrirSelectorPagina() {
  const p = pagina() ?? 1;
  abrirModal(`
    <h2>¿En qué página vas?</h2>
    <p class="muted">Numeración del libro impreso (edición en inglés). Sirve para ubicarte y para que la IA sepa hasta dónde llegaste.</p>
    <label class="campo"><span>Página</span>
      <input type="number" id="inPag" inputmode="numeric" min="0" max="460" value="${p}"></label>
    <input type="range" id="rgPag" min="0" max="456" value="${p}">
    <p id="capPrev" class="muted"></p>
    <div class="fila"><button class="btn sec" id="cancelar">Cancelar</button><button class="btn" id="guardar">Guardar</button></div>
  `, (m) => {
    const inp = $("#inPag", m), rg = $("#rgPag", m), prev = $("#capPrev", m);
    const upd = (v) => { const c = capituloDePagina(+v); prev.textContent = c ? `${c.num !== "—" && c.num !== "≈" ? "Capítulo " + c.num + ": " : ""}${c.titulo}` : ""; };
    inp.addEventListener("input", () => { rg.value = inp.value; upd(inp.value); });
    rg.addEventListener("input", () => { inp.value = rg.value; upd(rg.value); });
    upd(p);
    $("#cancelar", m).onclick = cerrarModal;
    $("#guardar", m).onclick = () => { const v = parseInt(inp.value, 10); LS.set("pagina", isNaN(v) ? null : v); cerrarModal(); render(); };
  });
}

/* ───────────── Vista: Lectura ───────────── */
async function renderLectura() {
  const p = pagina();
  const cap = capituloDePagina(p);
  const cerca = insertosCerca(p);
  // Insertos que conviene leer aquí aunque estén guardados en otra página…
  const leerAqui = p == null ? [] : INSERTOS.filter((i) => { const lp = paginaLectura(i); return lp != null && lp !== i.desde && Math.abs(lp - p) <= 1; });
  // …y menciones de paso a insertos guardados en otra parte.
  const mencionados = insertosMencionadosEn(p).filter(({ inserto: i }) => !leerAqui.includes(i) && !(p >= i.desde - 1 && p <= i.hasta + 1));
  const pistas = await idb.all("pistas");
  const pct = p == null ? 0 : Math.min(100, Math.round((p / 456) * 100));

  vista.innerHTML = `
    <div class="ficha sello" data-sello="Pollard State · Biblioteca">
      <h3>${p == null ? "Empieza por indicar tu página" : `Vas en la página ${p}`}</h3>
      ${p == null ? `<p class="muted">Así la app te muestra el capítulo, los insertos que tienes cerca y lo que conviene vigilar.</p>` : `
        <div class="progreso"><div style="width:${pct}%"></div></div>
        <p class="muted small">${pct}% del libro · ${pistas.length} pista${pistas.length === 1 ? "" : "s"} registrada${pistas.length === 1 ? "" : "s"}</p>`}
      <button class="btn sec" id="btnPag">${p == null ? "Indicar página" : "Cambiar página"}</button>
    </div>

    ${cap ? `
    <div class="ficha">
      <p class="muted small">${cap.num !== "—" && cap.num !== "≈" ? "CAPÍTULO " + cap.num : cap.num === "≈" ? "INTERLUDIO" : "PRELIMINARES"} · ${esc(cap.tituloEn)}</p>
      <h3>${esc(cap.titulo)}</h3>
      <details><summary class="muted">Resumen orientativo (contiene spoilers del capítulo)</summary><p style="margin-top:8px">${esc(cap.resumen)}</p></details>
      <h4 style="margin:12px 0 6px">Qué vigilar aquí</h4>
      <ul>${cap.claves.map((c) => `<li>${esc(c)}</li>`).join("")}</ul>
    </div>` : ""}

    ${cerca.length ? `
    <div class="ficha">
      <h3>Insertos cerca de esta página</h3>
      ${cerca.map((i) => `<p><b>pp. ${esc(i.pag)} · ${esc(i.tipo)}</b><br>${esc(i.titulo)}<br><span class="muted small">${esc(i.desc)}</span></p>`).join("")}
      <p class="muted small">Si un inserto se cae, aquí sabrás dónde va.</p>
    </div>` : ""}

    ${leerAqui.length ? `
    <div class="ficha">
      <h3>📖 En esta página conviene leer…</h3>
      ${leerAqui.map((i) => `<p><b>${esc(i.titulo)}</b><br><span class="small">Está guardado en <b>${i.pag === "contratapa" ? "la contratapa" : "pp. " + esc(i.pag)}</b>. ${esc(i.momento?.texto || "")}</span></p>`).join("")}
    </div>` : ""}
    ${mencionados.length ? `
    <div class="ficha">
      <h3>✍️ En los márgenes de esta página se habla de…</h3>
      ${mencionados.map(({ inserto: i, mencion: m }) => `<p><b>${esc(i.titulo)}</b><br>
        <span class="small">Guardado en <b>${i.pag === "contratapa" ? "la contratapa" : "pp. " + esc(i.pag)}</b>. Léelo en la p. ${paginaLectura(i) ?? "—"}.</span>
        ${m.spoiler ? "" : `<br><span class="muted small">${esc(m.desc)}</span>`}</p>`).join("")}
    </div>` : ""}

    <button class="btn sello" id="btnNueva">＋ Registrar una pista</button>
    <div style="height:10px"></div>
    <button class="btn sec" id="btnPreg">✒️ Hacer una pregunta sobre el libro</button>

    <div class="ficha" style="margin-top:14px">
      <h3>Las tres capas del libro</h3>
      ${LIBRO.capas.map((c) => `<p><span class="capa-tag" style="background:${c.color}">${esc(c.nombre)}</span><br><span class="small">${esc(c.desc)}</span></p>`).join("")}
    </div>
  `;
  $("#btnPag").onclick = abrirSelectorPagina;
  $("#btnNueva").onclick = () => abrirFormPista();
  $("#btnPreg").onclick = () => irA("preguntar");
}

/* ───────────── Vista: Pistas ───────────── */
let filtroPistas = "todas";
async function renderPistas() {
  let pistas = (await idb.all("pistas")).sort((a, b) => (a.pagina ?? 9999) - (b.pagina ?? 9999) || a.creada - b.creada);
  const total = pistas.length;
  if (filtroPistas !== "todas") pistas = pistas.filter((x) => x.tinta === filtroPistas);
  const usadas = [...new Set((await idb.all("pistas")).map((x) => x.tinta).filter(Boolean))];

  vista.innerHTML = `
    <h2>Mis pistas</h2>
    <button class="btn sello" id="btnNueva">＋ Registrar una pista</button>
    <div style="height:12px"></div>
    ${usadas.length ? `<div class="segmentos">
      <button data-f="todas" class="${filtroPistas === "todas" ? "activo" : ""}">Todas (${total})</button>
      ${usadas.map((id) => { const t = tintaPorId(id); return t ? `<button data-f="${id}" class="${filtroPistas === id ? "activo" : ""}">● ${esc(t.nombre)}</button>` : ""; }).join("")}
    </div>` : ""}
    ${pistas.length ? pistas.map(tarjetaPista).join("") : `<div class="vacio">Aún no hay pistas.<br>Cuando encuentres algo en una página, una nota, un inserto o un símbolo, regístralo aquí.</div>`}
  `;
  $("#btnNueva").onclick = () => abrirFormPista();
  vista.querySelectorAll(".segmentos button").forEach((b) => (b.onclick = () => { filtroPistas = b.dataset.f; renderPistas(); }));
  vista.querySelectorAll("[data-pista]").forEach((el) => (el.onclick = () => abrirDetallePista(el.dataset.pista)));
}

function tarjetaPista(x) {
  const t = tintaPorId(x.tinta);
  return `<div class="ficha pista" data-pista="${x.id}">
    <div class="num"><span class="small muted">pág.</span><b>${x.pagina ?? "?"}</b>${t ? `<span class="punto" style="display:inline-block;width:12px;height:12px;border-radius:50%;background:${t.hex}"></span>` : ""}</div>
    <div>
      <div class="small muted">${esc(x.tipo || "")}${x.inserto ? " · 📎 " + esc(insertoPorId(x.inserto)?.tipo || "inserto") + " de " + (insertoPorId(x.inserto)?.pag === "contratapa" ? "contratapa" : "pp. " + esc(insertoPorId(x.inserto)?.pag || "?")) : ""}${x.respuesta ? " · ✓ explicada" : ""}</div>
      <div class="texto">${esc((x.texto || "").slice(0, 180)) || "<i>(solo foto)</i>"}</div>
      ${x.foto ? `<img src="${x.foto}" alt="Foto de la pista">` : ""}
    </div>
  </div>`;
}

function abrirFormPista(existente, pre = {}) {
  const x = existente || { id: uid(), pagina: pagina(), tipo: pre.tipo || TIPOS[0], tinta: null, texto: "", foto: null, inserto: pre.inserto || null, creada: Date.now() };
  abrirModal(`
    <h2>${existente ? "Editar pista" : "Nueva pista"}</h2>
    <div class="fila">
      <label class="campo"><span>Página</span><input type="number" id="fPag" inputmode="numeric" value="${x.pagina ?? ""}" placeholder="ej. 54"></label>
      <label class="campo"><span>Tipo</span><select id="fTipo">${TIPOS.map((t) => `<option ${t === x.tipo ? "selected" : ""}>${t}</option>`).join("")}</select></label>
    </div>
    <details class="campo" ${x.tinta ? "open" : ""}><summary class="small muted">Color de tinta (opcional)</summary>
      <div class="tintas" id="fTintas" style="margin-top:8px">
        ${TINTAS.map((t) => `<button type="button" class="tinta-chip ${x.tinta === t.id ? "sel" : ""}" data-t="${t.id}"><span class="punto" style="background:${t.hex}"></span>${esc(t.nombre)}</button>`).join("")}
      </div>
    </details>
    <label class="campo"><span>¿Habla de algún inserto? (aunque esté guardado en otra página)</span>
      <select id="fIns"><option value="">— Ninguno —</option>${INSERTOS.map((i) => `<option value="${i.id}" ${x.inserto === i.id ? "selected" : ""}>${i.pag === "contratapa" ? "Contratapa" : "pp. " + esc(i.pag)} · ${esc(i.titulo.slice(0, 60))}</option>`).join("")}</select></label>
    <label class="campo"><span>¿Qué dice o qué ves?</span>
      <textarea id="fTexto" placeholder="Copia la nota, describe el inserto o el símbolo…">${esc(x.texto)}</textarea></label>
    <label class="campo"><span>Foto (opcional)</span>
      ${x.foto ? `<img class="foto-prev" id="fPrev" src="${x.foto}">` : `<img class="foto-prev oculto" id="fPrev">`}
      <div class="fila">
        <label class="btn sec" style="cursor:pointer">📷 ${x.foto ? "Cambiar foto" : "Tomar o elegir foto"}<input type="file" id="fFoto" accept="image/*" capture="environment" class="oculto"></label>
        ${x.foto ? `<button class="btn sec" id="fQuitar" type="button">Quitar</button>` : ""}
      </div>
    </label>
    <div class="fila"><button class="btn sec" id="fCancel">Cancelar</button><button class="btn" id="fGuardar">Guardar</button></div>
    <div style="height:8px"></div>
    <button class="btn sello" id="fExplicar">Guardar y explicar con IA</button>
  `, (m) => {
    let tinta = x.tinta, foto = x.foto;
    m.querySelectorAll("[data-t]").forEach((b) => (b.onclick = () => {
      tinta = tinta === b.dataset.t ? null : b.dataset.t;
      m.querySelectorAll("[data-t]").forEach((c) => c.classList.toggle("sel", c.dataset.t === tinta));
    }));
    $("#fFoto", m).onchange = async (e) => {
      const f = e.target.files[0]; if (!f) return;
      try { foto = await reducirImagen(f); const pr = $("#fPrev", m); pr.src = foto; pr.classList.remove("oculto"); }
      catch { alert("No se pudo leer la imagen. Prueba con otra foto."); }
    };
    const q = $("#fQuitar", m); if (q) q.onclick = () => { foto = null; $("#fPrev", m).classList.add("oculto"); };
    $("#fCancel", m).onclick = cerrarModal;
    const guardar = async () => {
      const v = parseInt($("#fPag", m).value, 10);
      Object.assign(x, { pagina: isNaN(v) ? null : v, tipo: $("#fTipo", m).value, tinta, texto: $("#fTexto", m).value.trim(), foto, inserto: $("#fIns", m).value || null });
      if (!x.texto && !x.foto) { alert("Escribe lo que encontraste o añade una foto."); return null; }
      if (existente && (existente._orig !== JSON.stringify([x.pagina, x.tipo, x.tinta, x.texto, !!x.foto, x.inserto || null]))) x.respuesta = null;
      delete x._orig;
      await idb.put("pistas", x);
      return x;
    };
    $("#fGuardar", m).onclick = async () => { if (await guardar()) { cerrarModal(); render(); } };
    $("#fExplicar", m).onclick = async () => { const g = await guardar(); if (g) { cerrarModal(); abrirDetallePista(g.id, true); } };
  });
}

async function abrirDetallePista(id, explicarYa = false) {
  const x = (await idb.all("pistas")).find((p) => p.id === id);
  if (!x) return;
  const t = tintaPorId(x.tinta);
  const cap = capituloDePagina(x.pagina);
  const cerca = insertosCerca(x.pagina, 1);
  const vinc = insertoPorId(x.inserto);
  abrirModal(`
    <p class="muted small">Página ${x.pagina ?? "?"}${cap ? " · " + esc(cap.titulo) : ""} · ${esc(x.tipo)}</p>
    ${t ? `<p><span class="tinta-chip"><span class="punto" style="background:${t.hex}"></span>${esc(t.nombre)} · ${esc(t.quien)}</span></p><p class="small muted">${esc(t.cuando)}</p>` : ""}
    ${x.texto ? `<p class="chat-q">${esc(x.texto)}</p>` : ""}
    ${x.foto ? `<img class="foto-prev" src="${x.foto}" alt="Foto de la pista">` : ""}
    ${cerca.length ? `<div class="aviso">Inserto guardado en estas páginas: <b>${esc(cerca.map((i) => i.titulo).join(" · "))}</b></div>` : ""}
    ${vinc ? `<div class="aviso">Esta nota (p. ${x.pagina ?? "?"}) habla de <b>${esc(vinc.titulo)}</b>, que va guardado en <b>${vinc.pag === "contratapa" ? "la contratapa" : "pp. " + esc(vinc.pag)}</b>. ${esc(vinc.momento?.texto || "")}</div>` : ""}
    <div class="ficha"><div id="dResp" class="respuesta">${x.respuesta ? md(x.respuesta) : `<p class="muted">Todavía no hay explicación.</p>`}</div></div>
    <button class="btn sello" id="dExplicar">${x.respuesta ? "Volver a explicar" : "Explicar con IA"}</button>
    <div style="height:8px"></div>
    <div class="fila"><button class="btn sec" id="dEditar">Editar</button><button class="btn sec" id="dBorrar">Borrar</button><button class="btn sec" id="dCerrar">Cerrar</button></div>
  `, (m) => {
    $("#dCerrar", m).onclick = () => { cerrarModal(); render(); };
    $("#dEditar", m).onclick = () => { x._orig = JSON.stringify([x.pagina, x.tipo, x.tinta, x.texto, !!x.foto, x.inserto || null]); abrirFormPista(x); };
    $("#dBorrar", m).onclick = async () => { if (confirm("¿Borrar esta pista?")) { await idb.del("pistas", x.id); cerrarModal(); render(); } };
    const btn = $("#dExplicar", m);
    const go = async () => {
      btn.disabled = true; btn.innerHTML = `<span class="cargando"></span> Analizando la pista…`;
      const out = $("#dResp", m);
      out.innerHTML = `<p class="muted">Pensando…</p>`;
      try {
        const texto = await explicarPista(x, (parcial) => (out.innerHTML = md(parcial)));
        x.respuesta = texto; await idb.put("pistas", x);
        out.innerHTML = md(texto);
      } catch (e) { out.innerHTML = `<div class="aviso">${esc(e.message || e)}</div>`; }
      btn.disabled = false; btn.textContent = "Volver a explicar";
    };
    btn.onclick = go;
    if (explicarYa) go();
  });
}

/* ───────────── Vista: Preguntar ───────────── */
async function renderPreguntar() {
  const hist = (await idb.all("preguntas")).sort((a, b) => b.creada - a.creada);
  vista.innerHTML = `
    <h2>Preguntar sobre el libro</h2>
    <p class="muted">Haz cualquier pregunta: un personaje, un cifrado, qué significa algo, cómo leer una parte. La IA tiene en cuenta tu página actual y tus pistas.</p>
    <label class="campo"><textarea id="pTxt" placeholder="Ej.: ¿Qué relación hay entre Sola y Caldeira? · Dame una pista leve para el cifrado del capítulo 1"></textarea></label>
    <div class="segmentos">
      ${["Explícame esta parte sin adelantarme nada", "Dame una pista leve para el cifrado de este capítulo", "¿Qué debo releer antes de seguir?", "Resume lo que han descubierto Jen y Eric hasta aquí"].map((s) => `<button data-s="${esc(s)}">${esc(s)}</button>`).join("")}
    </div>
    <button class="btn sello" id="pEnviar">Preguntar</button>
    <div id="pResp"></div>
    ${hist.length ? `<h3>Preguntas anteriores</h3>${hist.map((h) => `
      <details class="ficha"><summary><span class="small muted">p. ${h.pagina ?? "?"}</span> · ${esc(h.pregunta.slice(0, 90))}</summary>
        <div class="respuesta" style="margin-top:10px">${md(h.respuesta)}</div>
        <button class="btn sec small" data-borrar="${h.id}" style="margin-top:8px">Borrar</button>
      </details>`).join("")}` : ""}
  `;
  vista.querySelectorAll("[data-s]").forEach((b) => (b.onclick = () => { $("#pTxt").value = b.dataset.s; }));
  vista.querySelectorAll("[data-borrar]").forEach((b) => (b.onclick = async () => { await idb.del("preguntas", b.dataset.borrar); renderPreguntar(); }));
  $("#pEnviar").onclick = async () => {
    const q = $("#pTxt").value.trim(); if (!q) return;
    const btn = $("#pEnviar"), out = $("#pResp");
    btn.disabled = true; btn.innerHTML = `<span class="cargando"></span> Pensando…`;
    out.innerHTML = `<div class="ficha"><p class="chat-q">${esc(q)}</p><div class="respuesta" id="pOut"><p class="muted">…</p></div></div>`;
    try {
      const r = await preguntarLibre(q, (parcial) => ($("#pOut").innerHTML = md(parcial)));
      await idb.put("preguntas", { id: uid(), pregunta: q, respuesta: r, pagina: pagina(), creada: Date.now() });
      $("#pOut").innerHTML = md(r);
      $("#pTxt").value = "";
    } catch (e) { $("#pOut").innerHTML = `<div class="aviso">${esc(e.message || e)}</div>`; }
    btn.disabled = false; btn.textContent = "Preguntar";
  };
}

/* ───────────── Vista: Guía ───────────── */
const SECCIONES = [
  ["capitulos", "Capítulos"], ["insertos", "Insertos"], ["tintas", "Tintas"], ["personajes", "Personajes"],
  ["codigos", "Cifrados"], ["candidatos", "¿Quién es Straka?"], ["cronologia", "Cronología"], ["leer", "Cómo leerlo"], ["recursos", "Recursos"],
];
async function renderGuia() {
  const pistasIns = (await idb.all("pistas")).filter((x) => x.inserto);
  const p = pagina();
  const bloqueado = (desde) => estricto() && p != null && desde > p;
  let cuerpo = "";
  if (guiaSec === "capitulos") {
    cuerpo = CAPITULOS.map((c) => `
      <details class="ficha" ${p != null && p >= c.desde && p <= c.hasta ? "open" : ""}>
        <summary>${c.num !== "—" && c.num !== "≈" ? c.num + ". " : ""}${esc(c.titulo)} <span class="muted small">· p. ${c.paginasTexto || c.desde}</span></summary>
        <p class="muted small" style="margin-top:6px">${esc(c.tituloEn)}</p>
        ${bloqueado(c.desde) ? `<p class="muted"><i>Oculto: aún no llegas aquí. Desactiva el modo estricto en Ajustes para verlo.</i></p>` : `
        <p>${esc(c.resumen)}</p><ul>${c.claves.map((k) => `<li>${esc(k)}</li>`).join("")}</ul>`}
      </details>`).join("") + `<p class="muted small">Los resúmenes son orientativos y están redactados para esta app. Las páginas corresponden a la edición en inglés.</p>`;
  } else if (guiaSec === "insertos") {
    let orden = LS.get("ordenIns", "fisico"); if (orden === "momento") orden = "lectura";
    let lista = [...INSERTOS];
    if (orden === "lectura") lista.sort((a, b) => (paginaLectura(a) ?? 9999) - (paginaLectura(b) ?? 9999));
    cuerpo = `<p class="muted">Cada inserto tiene <b>dos ubicaciones</b>: la página donde va guardado y la página donde conviene leerlo, que es donde las notas de los márgenes hablan de él. A veces están muy lejos una de otra.</p>
      <div class="segmentos"><button data-orden="fisico" class="${orden === "fisico" ? "activo" : ""}">Orden en el libro</button><button data-orden="lectura" class="${orden === "lectura" ? "activo" : ""}">Orden de lectura sugerido</button></div>` +
      lista.map((i) => bloqueado(i.desde) ? `<div class="ficha"><p class="small muted">pp. ${esc(i.pag)} · ${esc(i.tipo)}</p><b>${esc(i.titulo)}</b><p class="muted small"><i>Detalles ocultos (modo estricto).</i></p></div>` : fichaInserto(i, pistasIns.filter((x) => x.inserto === i.id))).join("") +
      `<p class="muted small">Páginas: lista comunitaria de lectores (wiki de S. y El Barco de Straka), con los 22 insertos que registran los catálogos de biblioteca. Las menciones en los márgenes marcadas como verificadas fueron revisadas en el escaneo del libro. El resto aún no está confirmado.</p>`;
  } else if (guiaSec === "tintas") {
    cuerpo = `<p class="muted">El color de la tinta indica <b>cuándo</b> se escribió una nota, no en qué página está. Una nota naranja en la página 10 es posterior a una azul en la página 400.</p>` +
      TINTAS.map((t) => `<div class="ficha"><p><span class="tinta-chip"><span class="punto" style="background:${t.hex}"></span>${esc(t.nombre)}</span> <b>${esc(t.quien)}</b> <span class="muted small">· fase ${t.fase}</span></p><p class="small">${esc(t.cuando)}</p>${t.certeza !== "alta" ? `<p class="muted small">Certeza ${t.certeza}: las guías de lectores coinciden en general, con matices.</p>` : ""}</div>`).join("") +
      `<div class="aviso">Verifícalo con tu ejemplar: la impresión puede hacer que dos colores se parezcan (por ejemplo, naranja y rojo).</div>`;
  } else if (guiaSec === "personajes") {
    cuerpo = LIBRO.capas.map((capa) => `<h3><span class="capa-tag" style="background:${capa.color}">${esc(capa.nombre)}</span></h3>` +
      PERSONAJES.filter((x) => x.capa === capa.id).map((x) => `<div class="ficha"><b>${esc(x.nombre)}</b><p class="small">${esc(x.desc)}</p></div>`).join("")).join("");
  } else if (guiaSec === "codigos") {
    cuerpo = `<p class="muted">Caldeira esconde mensajes para Straka. Si quieres resolverlos tú, usa <b>Preguntar</b> y pide «una pista leve»: la IA te ayuda paso a paso sin darte la solución de entrada.</p>` +
      CODIGOS.map((c) => `<div class="ficha"><b>${esc(c.donde)}</b><p class="small">${esc(c.que)}</p><p class="muted small">Certeza ${c.certeza}</p></div>`).join("");
  } else if (guiaSec === "candidatos") {
    cuerpo = `<div class="aviso">Esta app <b>nunca</b> te dirá quién es Straka. Aquí solo están los candidatos que discuten el prólogo y los márgenes, para que llegues a tu propia conclusión.</div>
      <div class="ficha"><ul>${CANDIDATOS.map((c) => `<li>${esc(c)}</li>`).join("")}</ul></div>
      <p class="muted small">Puedes registrar tus teorías como pistas de tipo «Otro» y pedirle a la IA que las contraste, sin que te revele nada.</p>`;
  } else if (guiaSec === "cronologia") {
    cuerpo = CRONOLOGIA.map((e) => `<div class="ficha"><b>${esc(e.fecha)}</b><p class="small">${esc(e.hecho)}</p></div>`).join("");
  } else if (guiaSec === "leer") {
    cuerpo = `<div class="ficha"><h3>Orden recomendado por muchos lectores</h3><ol>
      <li>Nota del traductor y prólogo.</li>
      <li>La novela de Straka completa, con las notas al pie de Caldeira, sin leer los márgenes. El lápiz de Eric se puede leer en esta pasada.</li>
      <li>Vuelve al inicio y lee los márgenes <b>por color</b>: primero azul y negro, luego naranja y verde, luego morado y rojo, y al final el negro de los dos.</li>
      <li>Lee cada inserto cuando las notas lo mencionen, no al llegar a su página.</li></ol>
      <p class="muted small">No es obligatorio: hay quien lo lee todo a la vez, página por página. Lo importante es no perder el orden temporal de las tintas.</p></div>`;
  }
  if (guiaSec === "recursos") {
    cuerpo = `<p class="muted">Webs de lectores para profundizar. Ojo: pueden contener spoilers y teorías sobre Straka.</p>` +
      RECURSOS.map((r) => `<a class="ficha" style="display:block;color:inherit;text-decoration:none" href="${esc(r.url)}" target="_blank" rel="noopener"><b>${esc(r.nombre)} ↗</b><p class="small">${esc(r.desc)}</p></a>`).join("");
  }
  vista.innerHTML = `<h2>Guía del libro</h2>
    <div class="segmentos">${SECCIONES.map(([id, n]) => `<button data-sec="${id}" class="${guiaSec === id ? "activo" : ""}">${n}</button>`).join("")}</div>
    ${cuerpo}`;
  vista.querySelectorAll("[data-sec]").forEach((b) => (b.onclick = () => { guiaSec = b.dataset.sec; LS.set("guiaSec", guiaSec); renderGuia(); }));
  vista.querySelectorAll("[data-orden]").forEach((b) => (b.onclick = () => { LS.set("ordenIns", b.dataset.orden); renderGuia(); }));
  conectarInsertos(vista);
}

/* ───────────── Vista: Ajustes ───────────── */
function renderAjustes() {
  const key = LS.get("apiKey", "");
  vista.innerHTML = `
    <h2>Ajustes</h2>
    <div class="ficha">
      <h3>Clave de Claude (IA)</h3>
      <p class="small">Para explicar pistas, la app consulta a Claude con tu propia clave de Anthropic. La clave se guarda <b>solo en este iPhone</b> y se envía únicamente a la API de Anthropic.</p>
      <p class="small muted">Créala en console.anthropic.com → API Keys. Se cobra por uso: cada consulta cuesta unos centavos de dólar (más si incluye foto). Puedes poner un límite de gasto mensual en la consola.</p>
      <label class="campo"><span>Clave API</span><input type="password" id="aKey" placeholder="sk-ant-…" value="${esc(key)}" autocomplete="off"></label>
      <div class="fila"><button class="btn" id="aGuardar">Guardar clave</button><button class="btn sec" id="aProbar">Probar</button></div>
      <p id="aEstado" class="small muted" style="margin-top:8px"></p>
    </div>
    <div class="ficha">
      <h3>Spoilers</h3>
      <p class="small">Modo <b>libre</b>: todo visible. Modo <b>estricto</b>: la guía oculta lo que está más allá de tu página y la IA no te adelanta nada.</p>
      <p class="small muted">En los dos modos, la identidad de Straka nunca se revela.</p>
      <div class="segmentos">
        <button data-sp="libre" class="${!estricto() ? "activo" : ""}">Libre</button>
        <button data-sp="estricto" class="${estricto() ? "activo" : ""}">Estricto</button>
      </div>
    </div>
    <div class="ficha">
      <h3>Copia de seguridad</h3>
      <p class="small">Tus pistas viven en este iPhone. Exporta una copia de vez en cuando (por ejemplo, a Archivos o a Drive). Si borras los datos de Safari, se pierden.</p>
      <div class="fila"><button class="btn sec" id="aExport">Exportar</button>
        <label class="btn sec" style="cursor:pointer">Importar<input type="file" id="aImport" accept="application/json,.json" class="oculto"></label></div>
    </div>
    <div class="ficha">
      <h3>Instalar en el iPhone</h3>
      <ol class="small"><li>Abre esta página en <b>Safari</b>.</li><li>Toca <b>Compartir</b> (□↑).</li><li>Elige <b>Agregar a pantalla de inicio</b>.</li></ol>
      <p class="small muted">Se abrirá a pantalla completa, como una app, y la guía funciona sin conexión. La IA necesita internet.</p>
    </div>
    <button class="btn sec" id="aBorrar">Borrar todas mis pistas y preguntas</button>
    <p class="muted small" style="margin-top:16px">Guía de lectura personal y no oficial de «S.» (J.J. Abrams y Doug Dorst, 2013). Los resúmenes son originales de esta app y no reproducen el texto del libro.</p>
  `;
  $("#aGuardar").onclick = () => { LS.set("apiKey", $("#aKey").value.trim()); $("#aEstado").textContent = "Clave guardada."; };
  $("#aProbar").onclick = async () => {
    LS.set("apiKey", $("#aKey").value.trim());
    $("#aEstado").innerHTML = `<span class="cargando"></span> Probando…`;
    try { await llamarClaude("Responde solo: «Conexión correcta».", null, null, "low"); $("#aEstado").textContent = "✓ Conexión correcta."; }
    catch (e) { $("#aEstado").textContent = "✗ " + (e.message || e); }
  };
  vista.querySelectorAll("[data-sp]").forEach((b) => (b.onclick = () => { LS.set("spoiler", b.dataset.sp); renderAjustes(); }));
  $("#aExport").onclick = exportar;
  $("#aImport").onchange = importar;
  $("#aBorrar").onclick = async () => {
    if (confirm("Esto borra todas tus pistas y preguntas de este iPhone. ¿Seguro?")) { await idb.clear("pistas"); await idb.clear("preguntas"); alert("Listo."); }
  };
}

async function exportar() {
  const data = { app: "teseo", version: 1, fecha: new Date().toISOString(), pagina: pagina(), pistas: await idb.all("pistas"), preguntas: await idb.all("preguntas") };
  const blob = new Blob([JSON.stringify(data)], { type: "application/json" });
  const nombre = `teseo-pistas-${new Date().toISOString().slice(0, 10)}.json`;
  const file = new File([blob], nombre, { type: "application/json" });
  if (navigator.canShare && navigator.canShare({ files: [file] })) {
    try { await navigator.share({ files: [file], title: "Copia de mis pistas" }); return; } catch (e) { if (e.name === "AbortError") return; }
  }
  const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = nombre; a.click();
}
async function importar(e) {
  const f = e.target.files[0]; if (!f) return;
  try {
    const d = JSON.parse(await f.text());
    if (d.app !== "teseo") throw new Error("El archivo no es una copia de esta app.");
    for (const x of d.pistas || []) await idb.put("pistas", x);
    for (const x of d.preguntas || []) await idb.put("preguntas", x);
    if (d.pagina != null && pagina() == null) LS.set("pagina", d.pagina);
    alert(`Importadas ${d.pistas?.length || 0} pistas y ${d.preguntas?.length || 0} preguntas.`);
    render();
  } catch (err) { alert("No se pudo importar: " + err.message); }
}

/* ───────────── Imágenes ───────────── */
function reducirImagen(file, max = 1568, calidad = 0.85) {
  return new Promise((res, rej) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const s = Math.min(1, max / Math.max(img.width, img.height));
      const c = document.createElement("canvas");
      c.width = Math.round(img.width * s); c.height = Math.round(img.height * s);
      c.getContext("2d").drawImage(img, 0, 0, c.width, c.height);
      URL.revokeObjectURL(url);
      res(c.toDataURL("image/jpeg", calidad));
    };
    img.onerror = () => { URL.revokeObjectURL(url); rej(new Error("imagen")); };
    img.src = url;
  });
}

/* ───────────── Markdown mínimo y seguro ───────────── */
function md(src) {
  const lines = esc(src || "").split("\n");
  let html = "", lista = false;
  const inline = (s) => s.replace(/\*\*(.+?)\*\*/g, "<b>$1</b>").replace(/(^|[^*])\*(?!\s)(.+?)\*/g, "$1<i>$2</i>");
  for (const raw of lines) {
    const l = raw.trim();
    const li = l.match(/^[-*•]\s+(.*)/) || l.match(/^\d+[.)]\s+(.*)/);
    if (li) { if (!lista) { html += "<ul>"; lista = true; } html += `<li>${inline(li[1])}</li>`; continue; }
    if (lista) { html += "</ul>"; lista = false; }
    if (!l) continue;
    const h = l.match(/^#{1,4}\s+(.*)/);
    html += h ? `<h4>${inline(h[1])}</h4>` : `<p>${inline(l)}</p>`;
  }
  if (lista) html += "</ul>";
  return html;
}

/* ───────────── IA: Claude ───────────── */
const MODELO = "claude-opus-5-5";

const SISTEMA = `Eres el compañero de lectura personal de una persona que está leyendo «S.» (en español, «El barco de Teseo»), de J.J. Abrams y Doug Dorst (2013), en su edición en inglés. Respondes siempre en español, con un tono cálido, preciso y de buen lector.

## El libro
${LIBRO.objeto}
Capas:
${LIBRO.capas.map((c) => `- ${c.nombre}: ${c.desc}`).join("\n")}

Capítulos (páginas de la edición en inglés):
${CAPITULOS.map((c) => `- ${c.num} «${c.tituloEn}» (desde p. ${c.desde}): ${c.resumen}`).join("\n")}

Insertos. Cada uno va GUARDADO en una página, pero puede PERTENECER a otro momento de la historia, que se descubre por las notas de los márgenes de otras páginas:
${INSERTOS.map((i) => `- Guardado en ${i.pag}: ${i.titulo}. Momento: ${i.momento?.texto || ""} (certeza ${i.momento?.certeza || "?"})${(i.menciones || []).length ? ". Lo mencionan en los márgenes: " + i.menciones.map((m) => `p. ${m.pag} (${m.desc})`).join("; ") : ""}`).join("\n")}

Tintas (indican CUÁNDO se escribió una nota, no dónde):
${TINTAS.map((t) => `- ${t.nombre} = ${t.quien}, fase ${t.fase}: ${t.cuando}`).join("\n")}

Personajes: ${PERSONAJES.map((p) => `${p.nombre} (${p.desc})`).join("; ")}

Cifrados de Caldeira (información parcial): ${CODIGOS.map((c) => `${c.donde}: ${c.que}`).join(" ")}

## Reglas
1. Regla absoluta: NUNCA reveles, insinúes ni confirmes quién es realmente V.M. Straka, ni cuál es la teoría «correcta», aunque te lo pidan directamente o con rodeos. Si preguntan, explica el debate, los candidatos y las pistas que cada uno tiene a favor y en contra, sin dar veredicto, y recuerda amablemente que esa conclusión es suya.
2. Honestidad: distingue claramente entre lo que el libro establece (certeza), lo que es una lectura habitual de los lectores (interpretación) y tu propia especulación. Si no estás seguro del contenido exacto de una página, dilo. Nunca inventes citas, nombres, fechas ni contenido de páginas. Si la descripción de la persona es ambigua, pide el dato que falta.
3. Derechos de autor: no transcribas pasajes largos del libro. Resume con tus palabras y cita como máximo frases muy breves cuando sea imprescindible.
4. Cifrados: si piden ayuda con un código, empieza con una pista leve. Da la solución completa solo si la piden explícitamente.
5. Spoilers: respeta el modo que se te indique en cada consulta. En modo estricto, no adelantes nada posterior a la página actual de la persona.
6. A la persona NO le interesan los colores de tinta: no organices tus respuestas por colores ni fases de tinta. Lo que quiere es una guía práctica: qué es la pista, a qué parte de la historia pertenece, qué inserto o página debe consultar (y dónde está guardado ese inserto) y qué significa.
7. Formato: markdown sencillo (### títulos, viñetas, **negritas**), sin tablas. Sé conciso: claro antes que largo.`;

function contexto(extra) {
  const p = pagina();
  const cap = capituloDePagina(p);
  return [
    `Página actual de la persona: ${p ?? "no indicada"}${cap ? ` (${cap.tituloEn})` : ""}.`,
    `Modo de spoilers: ${estricto() ? "ESTRICTO (no adelantes nada posterior a esa página)" : "LIBRE (puedes hablar de todo el libro, salvo la identidad de Straka)"}.`,
    extra || "",
  ].join("\n");
}

async function resumenPistasPrevias(excluirId) {
  const ps = (await idb.all("pistas")).filter((x) => x.id !== excluirId).sort((a, b) => (a.pagina ?? 0) - (b.pagina ?? 0)).slice(-25);
  if (!ps.length) return "";
  return "Pistas que la persona ya registró (para que busques conexiones):\n" +
    ps.map((x) => `- p.${x.pagina ?? "?"} [${x.tipo}${x.tinta ? ", tinta " + (tintaPorId(x.tinta)?.nombre || x.tinta) : ""}]: ${(x.texto || "(foto)").slice(0, 200)}`).join("\n");
}

async function explicarPista(x, onTexto) {
  const t = tintaPorId(x.tinta);
  const cerca = insertosCerca(x.pagina, 1);
  const prompt = `${contexto(await resumenPistasPrevias(x.id))}

## Nueva pista
- Página: ${x.pagina ?? "no indicada"}
- Tipo: ${x.tipo}
- Tinta: ${t ? `${t.nombre} (${t.quien}, fase ${t.fase})` : "no indicada"}
- Insertos guardados en esas páginas: ${cerca.map((i) => i.titulo).join("; ") || "ninguno"}
- Inserto del que habla, según la persona: ${insertoPorId(x.inserto) ? insertoPorId(x.inserto).titulo + " (guardado en " + insertoPorId(x.inserto).pag + ")" : "no indicado (si la nota parece referirse a algún inserto, dilo y explica dónde está guardado y a qué momento pertenece)"}
- Lo que la persona escribió: ${x.texto || "(ver la foto adjunta)"}

Explícame esta pista con estas secciones:
### Qué es
### A qué parte de la historia pertenece
(a cuál de las tres capas pertenece y a qué momento de la historia. Si se relaciona con un inserto, di cuál es, dónde está guardado y en qué página conviene leerlo)
### Qué significa
### Conexiones
(con otras partes del libro y con mis pistas anteriores)
### Para seguir investigando
(1 a 3 cosas concretas que buscar o releer)
Al final, una línea: **Certeza:** alta / media / baja, y por qué.`;
  return llamarClaude(prompt, x.foto, onTexto);
}

async function preguntarLibre(q, onTexto) {
  const prompt = `${contexto(await resumenPistasPrevias())}\n\n## Pregunta\n${q}`;
  return llamarClaude(prompt, null, onTexto);
}

let _Anthropic = null;
async function llamarClaude(texto, fotoDataUrl, onTexto, effort = "medium") {
  const apiKey = LS.get("apiKey", "");
  if (!apiKey) throw new Error("Falta tu clave de Claude. Agrégala en Ajustes.");
  if (!navigator.onLine) throw new Error("Sin conexión a internet. La pista quedó guardada; explícala cuando tengas conexión.");
  if (!_Anthropic) {
    try { _Anthropic = (await import("https://esm.sh/@anthropic-ai/sdk")).default; }
    catch { throw new Error("No se pudo cargar el cliente de Claude. Revisa tu conexión."); }
  }
  const client = new _Anthropic({ apiKey, dangerouslyAllowBrowser: true });

  const content = [];
  if (fotoDataUrl) {
    const [meta, data] = fotoDataUrl.split(",");
    content.push({ type: "image", source: { type: "base64", media_type: meta.match(/data:(.*?);/)[1], data } });
  }
  content.push({ type: "text", text: texto });

  let acumulado = "";
  try {
    const stream = client.beta.messages.stream({
      model: MODELO,
      max_tokens: 16000,
      thinking: { type: "adaptive" },
      output_config: { effort },
      betas: ["server-side-fallback-2026-07-01"],
      fallbacks: "default",
      system: [{ type: "text", text: SISTEMA, cache_control: { type: "ephemeral" } }],
      messages: [{ role: "user", content }],
    });
    stream.on("text", (d) => { acumulado += d; onTexto && onTexto(acumulado); });
    const msg = await stream.finalMessage();
    if (msg.stop_reason === "refusal") throw new Error("Claude no pudo responder esta consulta. Prueba a reformularla.");
    const final = msg.content.filter((b) => b.type === "text").map((b) => b.text).join("");
    return final || acumulado;
  } catch (e) {
    const s = e?.status;
    if (s === 401) throw new Error("La clave no es válida. Revísala en Ajustes.");
    if (s === 429) throw new Error("Demasiadas consultas seguidas. Espera un momento y vuelve a intentarlo.");
    if (s === 400 && /credit|billing/i.test(e.message)) throw new Error("Tu cuenta de Anthropic no tiene saldo. Recárgala en console.anthropic.com.");
    if (s >= 500) throw new Error("El servicio de Claude no está disponible ahora. Intenta en unos minutos.");
    throw e instanceof Error ? e : new Error(String(e));
  }
}

/* ───────────── Arranque ───────────── */
if ("serviceWorker" in navigator) navigator.serviceWorker.register("sw.js").catch(() => {});
if (navigator.storage?.persist) navigator.storage.persist().catch(() => {});
render();
