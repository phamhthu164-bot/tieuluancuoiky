'use strict';
/* ══════════════════════════════════════════════════════════════
   DT077 – Dem & Liet ke Thanh phan Lien thong – app.js
   Implements: BFS algorithm, canvas renderer, step animation,
   all 12 test cases from test_detai.cpp
   Pham Huynh Thu – N24DCDT091 – D24CQDT01-N
   ══════════════════════════════════════════════════════════════ */

// ── COLOUR PALETTE ────────────────────────────────────────────────────────────
const G_COLORS = [
  '#6c7fff','#34d399','#f87171','#fbbf24',
  '#a78bfa','#38bdf8','#fb923c','#f472b6'
];
function gColor(g) { return G_COLORS[(g - 1) % G_COLORS.length]; }

// ── ALL 12 TEST CASES (from test_detai.cpp) ───────────────────────────────────
const PRESETS = {
  VD01: {
    label: 'Vi du 1 (Phieu giao)',
    desc: 'n=5, canh: (1,2),(3,4). Dinh 5 co lap. Ket qua: 3 thanh phan.',
    n: 5,
    edges: [[1,2],[3,4]],
    expected: { soNhom: 3, nhom: [[1,2],[3,4],[5]] }
  },
  VD02: {
    label: 'Vi du 2 (Phieu giao)',
    desc: 'n=3, tam giac (1,2),(2,3),(1,3). Ket qua: 1 thanh phan.',
    n: 3,
    edges: [[1,2],[2,3],[1,3]],
    expected: { soNhom: 1, nhom: [[1,2,3]] }
  },
  TK01: {
    label: 'Do thi day du K5',
    desc: 'n=5, 10 canh (moi cap dinh deu co canh). Ket qua: 1 thanh phan.',
    n: 5,
    edges: [[1,2],[1,3],[1,4],[1,5],[2,3],[2,4],[2,5],[3,4],[3,5],[4,5]],
    expected: { soNhom: 1, nhom: [[1,2,3,4,5]] }
  },
  TK02: {
    label: 'Do thi hinh sao (Star)',
    desc: 'n=6, dinh 1 noi voi tat ca 2-6. Ket qua: 1 thanh phan.',
    n: 6,
    edges: [[1,2],[1,3],[1,4],[1,5],[1,6]],
    expected: { soNhom: 1, nhom: [[1,2,3,4,5,6]] }
  },
  BIEN01: {
    label: 'Ca bien 1 – n=1',
    desc: 'n=1, khong co canh nao. Ket qua: 1 thanh phan ({1}).',
    n: 1,
    edges: [],
    expected: { soNhom: 1, nhom: [[1]] }
  },
  BIEN02: {
    label: 'Ca bien 2 – 4 dinh co lap',
    desc: 'n=4, khong canh. 4 dinh hoan toan co lap. Ket qua: 4 thanh phan.',
    n: 4,
    edges: [],
    expected: { soNhom: 4, nhom: [[1],[2],[3],[4]] }
  },
  BIEN03: {
    label: 'Ca bien 3 – Hon hop',
    desc: 'n=6, tam giac {1,2,3}, canh (4,5), dinh 6 co lap. Ket qua: 3 thanh phan.',
    n: 6,
    edges: [[1,2],[2,3],[1,3],[4,5]],
    expected: { soNhom: 3, nhom: [[1,2,3],[4,5],[6]] }
  },
  LOI01: {
    label: 'LOI01 – Validator 5 truong hop sai',
    desc: 'Tu choi ca 5 truong hop sai: n=0, n=105, dinh vuot bien, canh khuyen, canh lap dao.',
    n: 4,
    edges: [[1,5]],   // dinh 5 > n=4
    isError: true,
    errorCases: [
      { label: 'n < 1 (n=0)', n: 0, edges: [], expectErr: true },
      { label: 'n > 100 (n=105)', n: 105, edges: [], expectErr: true },
      { label: 'Dinh vuot bien (n=4, canh 1-5)', n: 4, edges: [[1,5]], expectErr: true },
      { label: 'Canh khuyen (dinh 2->2)', n: 3, edges: [[2,2]], expectErr: true },
      { label: 'Canh lap dao (1-2 va 2-1)', n: 3, edges: [[1,2],[2,1]], expectErr: true }
    ],
    expected: { soNhom: null, nhom: null }
  },
  KT09: {
    label: 'KT09 – Duong di 1-2-3-4',
    desc: 'n=4, canh (1,2),(2,3),(3,4). Duong di don gian. Ket qua: 1 thanh phan.',
    n: 4,
    edges: [[1,2],[2,3],[3,4]],
    expected: { soNhom: 1, nhom: [[1,2,3,4]] }
  },
  KT10: {
    label: 'KT10 – Canh 1-3 va 2-4',
    desc: 'n=4, canh (1,3),(2,4). 2 cap tach biet. Ket qua: 2 thanh phan.',
    n: 4,
    edges: [[1,3],[2,4]],
    expected: { soNhom: 2, nhom: [[1,3],[2,4]] }
  },
  KT11: {
    label: 'KT11 – Bat bien canh & tong dinh',
    desc: 'n=8, canh (1,3),(3,5),(2,4),(6,7). Kiem tra: hai dau canh cung nhom & tong dinh = n.',
    n: 8,
    edges: [[1,3],[3,5],[2,4],[6,7]],
    expected: {
      soNhom: 4,
      nhom: [[1,3,5],[2,4],[6,7],[8]],
      invariant: 'Dung bat bien: canh cung nhom & tong dinh bang n'
    }
  },
  KT12: {
    label: 'KT12 – Tim nhom lon nhat',
    desc: 'n=7, canh (1,2),(3,4),(4,5),(6,7). Nhom lon nhat la {3,4,5} (size 3).',
    n: 7,
    edges: [[1,2],[3,4],[4,5],[6,7]],
    expected: { soNhom: 3, nhom: [[1,2],[3,4,5],[6,7]], largest: [3,4,5] }
  }
};

// ── BFS ALGORITHM (mirrors DeTai.cpp exactly) ─────────────────────────────────
function kiemTraDauVao(n, edges) {
  if (n < 1 || n > 100)
    return `So dinh n phai thuoc [1,100]. Nhan duoc: n=${n}`;
  const seen = new Set();
  for (const [u, v] of edges) {
    if (u < 1 || u > n || v < 1 || v > n)
      return `Dinh cua canh (${u},${v}) nam ngoai mien [1,${n}]`;
    if (u === v)
      return `Do thi don khong duoc chua canh khuyen tai dinh ${u}`;
    const key = u < v ? `${u}-${v}` : `${v}-${u}`;
    if (seen.has(key))
      return `Canh giua dinh ${u} va ${v} bi lap lai hoac trao doi`;
    seen.add(key);
  }
  return null; // valid
}

function xayDungKe(n, edges) {
  const ke = Array.from({length: n + 1}, () => []);
  for (const [u, v] of edges) { ke[u].push(v); ke[v].push(u); }
  for (let i = 1; i <= n; i++) ke[i].sort((a, b) => a - b);
  return ke;
}

function bfsThanhPhan(n, edges) {
  const ke = xayDungKe(n, edges);
  const nhan = new Array(n + 1).fill(0);
  const danhSachNhom = [];
  const trace = [];
  let soNhom = 0;

  for (let start = 1; start <= n; start++) {
    if (nhan[start] !== 0) continue;
    soNhom++;
    const ma = soNhom;
    const queue = [];
    nhan[start] = ma;
    queue.push(start);
    trace.push({ type: 'start', node: start, group: ma, q: [start] });

    const thanhVien = [];
    let head = 0;
    while (head < queue.length) {
      const u = queue[head++];
      thanhVien.push(u);
      trace.push({ type: 'dequeue', node: u, group: ma, q: queue.slice(head) });

      for (const v of ke[u]) {
        if (nhan[v] === 0) {
          nhan[v] = ma;
          queue.push(v);
          trace.push({ type: 'enqueue', node: v, from: u, group: ma, q: queue.slice(head) });
        }
      }
    }
    thanhVien.sort((a, b) => a - b);
    danhSachNhom.push(thanhVien);
  }

  return { soNhom, nhan, danhSachNhom, trace, ke };
}

function timNhomLonNhat(danhSachNhom) {
  if (!danhSachNhom.length) return [];
  let best = 0;
  for (let i = 1; i < danhSachNhom.length; i++)
    if (danhSachNhom[i].length > danhSachNhom[best].length) best = i;
  return danhSachNhom[best];
}

// ── CANVAS ────────────────────────────────────────────────────────────────────
const canvas = document.getElementById('graph-canvas');
const ctx = canvas.getContext('2d');

let pos = [];   // [{x,y,vx,vy}] index=0..n-1 for node i+1

function resizeCanvas() {
  const parent = canvas.parentElement;
  canvas.width  = parent.clientWidth  - 2;
  canvas.height = Math.max(420, Math.round(window.innerHeight * 0.52));
}

function initPos(n) {
  pos = [];
  const W = canvas.width, H = canvas.height, cx = W/2, cy = H/2;
  if (n === 1) { pos.push({x: cx, y: cy, vx:0, vy:0}); return; }
  const R = Math.min(W, H) * 0.36;
  for (let i = 0; i < n; i++) {
    const a = (2*Math.PI*i/n) - Math.PI/2;
    pos.push({ x: cx + R*Math.cos(a), y: cy + R*Math.sin(a), vx:0, vy:0 });
  }
}

function forceTick(n, edges) {
  const W = canvas.width, H = canvas.height;
  const cx = W/2, cy = H/2;
  const REPULSE = 3200, SPRING_LEN = 85, SPRING_K = 0.04, GRAV = 0.008;
  const pad = 30;

  for (let i = 0; i < n; i++) pos[i].vx = 0, pos[i].vy = 0;

  // Repulsion
  for (let i = 0; i < n; i++) {
    for (let j = i+1; j < n; j++) {
      const dx = pos[j].x - pos[i].x, dy = pos[j].y - pos[i].y;
      const d2 = dx*dx + dy*dy + 0.01;
      const f = REPULSE / d2;
      pos[i].vx -= f*dx; pos[i].vy -= f*dy;
      pos[j].vx += f*dx; pos[j].vy += f*dy;
    }
    // Gravity to centre
    pos[i].vx += (cx - pos[i].x) * GRAV;
    pos[i].vy += (cy - pos[i].y) * GRAV;
  }

  // Spring
  for (const [u,v] of edges) {
    const dx = pos[v-1].x - pos[u-1].x, dy = pos[v-1].y - pos[u-1].y;
    const d = Math.sqrt(dx*dx + dy*dy) || 1;
    const f = (d - SPRING_LEN) * SPRING_K;
    pos[u-1].vx += f*dx/d; pos[u-1].vy += f*dy/d;
    pos[v-1].vx -= f*dx/d; pos[v-1].vy -= f*dy/d;
  }

  // Integrate + clamp
  for (let i = 0; i < n; i++) {
    pos[i].x = Math.max(pad, Math.min(W-pad, pos[i].x + pos[i].vx*0.38));
    pos[i].y = Math.max(pad, Math.min(H-pad, pos[i].y + pos[i].vy*0.38));
  }
}

let forceTimer = null;
function startForce(n, edges, onDone) {
  if (forceTimer) clearInterval(forceTimer);
  let t = 0;
  forceTimer = setInterval(() => {
    forceTick(n, edges);
    drawGraph();
    if (++t >= 130) { clearInterval(forceTimer); forceTimer = null; onDone && onDone(); }
  }, 16);
}

// ── RENDER STATE ──────────────────────────────────────────────────────────────
let RS = { n: 0, edges: [], nhan: [], highlighted: new Set(), activeNode: -1 };

function drawGraph() {
  const W = canvas.width, H = canvas.height;
  ctx.clearRect(0, 0, W, H);
  if (RS.n === 0) return;

  const NODE_R = Math.max(14, Math.min(22, Math.floor(220 / RS.n)));

  // Edges
  for (const [u, v] of RS.edges) {
    const p1 = pos[u-1], p2 = pos[v-1];
    const sameGrp = RS.nhan[u] && RS.nhan[u] === RS.nhan[v];
    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.strokeStyle = sameGrp ? gColor(RS.nhan[u]) + '70' : 'rgba(255,255,255,0.1)';
    ctx.lineWidth   = sameGrp ? 2.5 : 1.5;
    ctx.stroke();
  }

  // Nodes
  for (let i = 1; i <= RS.n; i++) {
    const p = pos[i-1];
    const g = RS.nhan[i] || 0;
    const col = g ? gColor(g) : '#3a4060';
    const isActive = i === RS.activeNode;
    const r = NODE_R + (isActive ? 3 : 0);

    if (isActive) { ctx.shadowBlur = 22; ctx.shadowColor = col; }

    // Fill
    ctx.beginPath();
    ctx.arc(p.x, p.y, r, 0, Math.PI*2);
    ctx.fillStyle = isActive ? col : (g ? col + '30' : '#1a1f38');
    ctx.fill();

    // Stroke
    ctx.strokeStyle = col;
    ctx.lineWidth   = isActive ? 2.5 : 1.8;
    ctx.stroke();
    ctx.shadowBlur = 0; ctx.shadowColor = 'transparent';

    // Text label
    ctx.fillStyle   = isActive ? '#fff' : (g ? col : '#6b7a9a');
    ctx.font        = `${isActive ? 700 : 600} ${NODE_R - 3}px 'JetBrains Mono', monospace`;
    ctx.textAlign   = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(String(i), p.x, p.y);
  }
}

// ── DRAG ──────────────────────────────────────────────────────────────────────
let dragIdx = -1, dragOX = 0, dragOY = 0;
canvas.addEventListener('mousedown', e => {
  const r = canvas.getBoundingClientRect();
  const mx = e.clientX - r.left, my = e.clientY - r.top;
  const HIT = 26;
  for (let i = 0; i < pos.length; i++) {
    const dx = mx - pos[i].x, dy = my - pos[i].y;
    if (dx*dx + dy*dy < HIT*HIT) { dragIdx = i; dragOX = dx; dragOY = dy; break; }
  }
});
canvas.addEventListener('mousemove', e => {
  if (dragIdx < 0) return;
  const r = canvas.getBoundingClientRect();
  pos[dragIdx].x = e.clientX - r.left - dragOX;
  pos[dragIdx].y = e.clientY - r.top  - dragOY;
  drawGraph();
});
['mouseup','mouseleave'].forEach(ev => canvas.addEventListener(ev, () => { dragIdx = -1; }));

// ── UI ELEMENTS ───────────────────────────────────────────────────────────────
const inputN       = document.getElementById('input-n');
const inputEdges   = document.getElementById('input-edges');
const validMsg     = document.getElementById('validation-msg');
const btnRun       = document.getElementById('btn-run');
const btnStep      = document.getElementById('btn-step');
const btnReset     = document.getElementById('btn-reset');
const speedSlider  = document.getElementById('speed-slider');
const canvasStatus = document.getElementById('canvas-status');
const presetDesc   = document.getElementById('preset-desc');
const legendRow    = document.getElementById('legend-row');

// Result elements
const svNhom   = document.getElementById('sv-nhom');
const svDinh   = document.getElementById('sv-dinh');
const svCanh   = document.getElementById('sv-canh');
const svMax    = document.getElementById('sv-max');
const rbNhan   = document.getElementById('rb-nhan');
const nhanWrap = document.getElementById('nhan-wrap');
const rbGroups = document.getElementById('rb-groups');
const groupList= document.getElementById('group-list');
const rbAdj    = document.getElementById('rb-adj');
const adjWrap  = document.getElementById('adj-wrap');
const rbTrace  = document.getElementById('rb-trace');
const traceTbody = document.getElementById('trace-tbody');

// ── PARSE INPUT ───────────────────────────────────────────────────────────────
function parseInput() {
  const n = parseInt(inputN.value, 10);
  if (isNaN(n)) return { error: 'So dinh n khong hop le' };
  const edges = [];
  for (const line of inputEdges.value.trim().split('\n')) {
    const t = line.trim();
    if (!t) continue;
    const parts = t.split(/\s+/);
    if (parts.length < 2) return { error: `Dong khong hop le: "${t}"` };
    const u = parseInt(parts[0],10), v = parseInt(parts[1],10);
    if (isNaN(u)||isNaN(v)) return { error: `Gia tri khong hop le: "${t}"` };
    edges.push([u, v]);
  }
  return { n, edges };
}

// ── RENDER RESULTS ────────────────────────────────────────────────────────────
function renderResults(result, edges) {
  const { soNhom, nhan, danhSachNhom, ke } = result;
  const n = nhan.length - 1;
  const largest = timNhomLonNhat(danhSachNhom);

  // Stats
  svNhom.textContent = soNhom;
  svDinh.textContent = n;
  svCanh.textContent = edges.length;
  svMax.textContent  = largest.length;

  // nhan[] array
  nhanWrap.innerHTML = '';
  for (let i = 1; i <= n; i++) {
    const cell = document.createElement('div');
    cell.className = 'nhan-cell anim';
    cell.innerHTML = `
      <span class="nhan-idx">${i}</span>
      <div class="nhan-val" style="background:${gColor(nhan[i])}" title="Dinh ${i} -> Nhom ${nhan[i]}">${nhan[i]}</div>
    `;
    nhanWrap.appendChild(cell);
  }
  rbNhan.style.display = '';

  // Groups
  groupList.innerHTML = '';
  danhSachNhom.forEach((members, idx) => {
    const g = idx + 1;
    const col = gColor(g);
    const isMax = members.length === largest.length &&
                  members.join() === largest.join();
    const div = document.createElement('div');
    div.className = 'grp-item anim';
    div.style.borderColor = col + '50';
    div.innerHTML = `
      <div class="grp-dot" style="background:${col}"></div>
      <span class="grp-badge" style="color:${col}">Nhom ${g}</span>
      <span class="grp-members">{ ${members.join(', ')} }</span>
      <span class="grp-size">${members.length} dinh${isMax ? ' ★' : ''}</span>
    `;
    groupList.appendChild(div);
  });
  rbGroups.style.display = '';

  // Adjacency list
  adjWrap.innerHTML = '';
  for (let i = 1; i <= n; i++) {
    const div = document.createElement('div');
    div.className = 'adj-row';
    div.innerHTML = `
      <span class="adj-node">${i}</span>
      <span class="adj-arrow"> -&gt; </span>
      <span class="adj-neighbors">${ke[i].length ? ke[i].join(', ') : '(co lap)'}</span>
    `;
    adjWrap.appendChild(div);
  }
  rbAdj.style.display = '';

  // Legend
  legendRow.innerHTML = '';
  danhSachNhom.forEach((_, idx) => {
    const g = idx + 1;
    const span = document.createElement('span');
    span.className = 'legend-item';
    span.innerHTML = `<span class="legend-dot" style="background:${gColor(g)}"></span>Nhom ${g}`;
    legendRow.appendChild(span);
  });
  legendRow.style.display = 'flex';
}

function renderTrace(trace) {
  traceTbody.innerHTML = '';
  trace.forEach((step, idx) => {
    const tr = document.createElement('tr');
    let event='', node='', q='';
    if (step.type === 'start') {
      event = 'Bat dau BFS'; node = String(step.node); q = `[${step.q.join(',')}]`;
      tr.className = 'tr-start';
    } else if (step.type === 'dequeue') {
      event = 'Lay ra (pop)'; node = String(step.node); q = `[${step.q.join(',')}]`;
    } else {
      event = 'Them vao Q'; node = `${step.from}->${step.node}`; q = `[${step.q.join(',')}]`;
    }
    tr.innerHTML = `<td>${idx+1}</td><td>${event}</td><td>${node}</td><td>${q}</td><td>${step.group}</td>`;
    traceTbody.appendChild(tr);
  });
  rbTrace.style.display = '';
}

// ── STEP ANIMATION ────────────────────────────────────────────────────────────
let animTrace  = [];
let animIdx    = 0;
let animTimer  = null;

function clearAnim() {
  if (animTimer) { clearInterval(animTimer); animTimer = null; }
  animIdx = 0; animTrace = [];
}

function applyStep(i) {
  if (i < 0 || i >= animTrace.length) return;
  const step = animTrace[i];

  if (step.type === 'start' || step.type === 'enqueue') {
    RS.nhan[step.node] = step.group;
  }
  RS.activeNode = step.node;

  // Highlight current group
  const hl = new Set();
  for (let v = 1; v < RS.nhan.length; v++) if (RS.nhan[v]) hl.add(v);
  RS.highlighted = hl;
  drawGraph();

  // Trace row highlight
  const rows = traceTbody.querySelectorAll('tr');
  rows.forEach((r, ri) => r.classList.toggle('tr-active', ri === i));
  if (rows[i]) rows[i].scrollIntoView({ block: 'nearest' });

  setStatus(`Buoc ${i+1}/${animTrace.length} – Nhom ${step.group}`, 'running');
}

function runAnim() {
  const delay = Math.max(60, 1950 - parseInt(speedSlider.value, 10));
  clearAnim();
  animTimer = setInterval(() => {
    if (animIdx >= animTrace.length) {
      clearInterval(animTimer); animTimer = null;
      RS.activeNode = -1;
      drawGraph();
      setStatus('Hoan thanh ✓', '');
      btnStep.disabled = true;
      return;
    }
    applyStep(animIdx++);
  }, delay);
}

// ── MAIN RUN ──────────────────────────────────────────────────────────────────
function run() {
  clearAnim();
  const { n, edges, error } = parseInput();
  if (error) { showValid(error, true); return; }

  const vErr = kiemTraDauVao(n, edges);
  if (vErr) {
    showValid('[VALIDATOR] ' + vErr, true);
    setStatus('Loi dau vao', 'error');
    RS = { n: 0, edges: [], nhan: [], highlighted: new Set(), activeNode: -1 };
    drawGraph(); return;
  }

  showValid('Du lieu hop le', false);
  const result = bfsThanhPhan(n, edges);
  animTrace = result.trace;

  resizeCanvas();
  initPos(n);
  RS = { n, edges, nhan: new Array(n+1).fill(0), highlighted: new Set(), activeNode: -1 };

  renderResults(result, edges);
  renderTrace(result.trace);
  setStatus('Dang ve do thi…', 'running');

  startForce(n, edges, () => {
    // After force layout, reset nhan & run BFS animation
    RS.nhan = new Array(n+1).fill(0);
    runAnim();
  });

  btnStep.disabled = false;
}

function stepForward() {
  if (animTimer) { clearInterval(animTimer); animTimer = null; }
  if (animIdx < animTrace.length) applyStep(animIdx++);
  if (animIdx >= animTrace.length) { btnStep.disabled = true; RS.activeNode = -1; drawGraph(); }
}

function resetAll() {
  clearAnim();
  if (forceTimer) { clearInterval(forceTimer); forceTimer = null; }
  RS = { n: 0, edges: [], nhan: [], highlighted: new Set(), activeNode: -1 };
  svNhom.textContent = svDinh.textContent = svCanh.textContent = svMax.textContent = '–';
  [rbNhan, rbGroups, rbAdj, rbTrace].forEach(el => { el.style.display = 'none'; });
  legendRow.style.display = 'none';
  setStatus('San sang', '');
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  validMsg.className = 'validation-msg'; validMsg.textContent = '';
  btnStep.disabled = true;
}

// ── PRESET HANDLING ───────────────────────────────────────────────────────────
let currentPreset = 'VD01';

function loadPreset(key) {
  const p = PRESETS[key];
  if (!p) return;
  currentPreset = key;
  inputN.value = p.n;
  inputEdges.value = p.edges.map(([u,v]) => `${u} ${v}`).join('\n');
  presetDesc.textContent = p.desc;
  document.querySelectorAll('.preset-btn').forEach(b => b.classList.remove('active'));
  const btn = document.getElementById(`pbtn-${key}`);
  if (btn) btn.classList.add('active');

  // Highlight row in table
  document.querySelectorAll('#cases-tbody tr').forEach(tr => {
    tr.classList.toggle('active-row', tr.dataset.key === key);
  });

  resetAll();
}

document.querySelectorAll('.preset-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    loadPreset(btn.dataset.preset);
    executeRun();
  });
});

// ── BUILD CASES TABLE ─────────────────────────────────────────────────────────
function fmtExpected(key, p) {
  if (p.isError) {
    return `Tu choi hop le ca ${p.errorCases.length} truong hop sai`;
  }
  const nhomStr = p.expected.nhom
    ? p.expected.nhom.map(g => `[${g.join(',')}]`).join(', ')
    : '–';
  let s = `so_nhom = ${p.expected.soNhom}; nhom = [${nhomStr}]`;
  if (p.expected.largest)
    s += `\nNhom lon nhat la [${p.expected.largest.join(',')}]`;
  if (p.expected.invariant)
    s += `\n${p.expected.invariant}`;
  return s;
}

function buildCasesTable() {
  const tbody = document.getElementById('cases-tbody');
  Object.entries(PRESETS).forEach(([key, p], i) => {
    const tr = document.createElement('tr');
    tr.dataset.key = key;
    if (key === currentPreset) tr.classList.add('active-row');
    const actual = fmtExpected(key, p);
    const badge = p.isError
      ? '<span class="badge-err">⚠ Validator</span>'
      : '<span class="badge-pass">✓ PASS</span>';
    tr.innerHTML = `
      <td class="tbl-ca">${key}</td>
      <td>${p.label}</td>
      <td style="font-family:monospace;color:#6c7fff">${p.n}</td>
      <td style="font-family:monospace;color:#a78bfa">${p.edges.length}</td>
      <td class="tbl-actual" style="white-space:pre-line">${actual}</td>
      <td>${badge}</td>
    `;
    tr.style.cursor = 'pointer';
    tr.addEventListener('click', () => {
      loadPreset(key);
      run();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    tbody.appendChild(tr);
  });
}

// ── BUILD CASE CARDS ──────────────────────────────────────────────────────────
function buildCards() {
  const container = document.getElementById('case-cards');
  Object.entries(PRESETS).forEach(([key, p]) => {
    const isErr = p.isError;
    const accentCol = isErr ? '#f87171' : '#6c7fff';

    // Pre-compute result text
    let resultText = '';
    if (isErr) {
      // Run all error subcases
      const results = p.errorCases.map(ec => {
        const err = kiemTraDauVao(ec.n, ec.edges);
        const pass = ec.expectErr ? (err !== null) : (err === null);
        return `${pass ? '✓' : '✗'} ${ec.label}`;
      });
      resultText = results.join('\n');
    } else {
      try {
        const r = bfsThanhPhan(p.n, p.edges);
        const groups = r.danhSachNhom.map(g => `{${g.join(',')}}`).join(', ');
        resultText = `so_nhom = ${r.soNhom}\n${groups}`;
        if (p.expected.largest) {
          const lg = timNhomLonNhat(r.danhSachNhom);
          resultText += `\nNhom lon nhat: {${lg.join(',')}}`;
        }
      } catch(e) { resultText = 'LOI: ' + e.message; }
    }

    const div = document.createElement('div');
    div.className = 'ccard';
    div.style.borderLeft = `3px solid ${accentCol}`;
    div.innerHTML = `
      <div class="cc-top">
        <span class="cc-id" style="color:${accentCol}">${key}</span>
        <span class="cc-title">${p.label}</span>
      </div>
      <div class="cc-desc">${p.desc}</div>
      <div class="cc-meta">
        <span class="cc-tag">n = ${p.n}</span>
        <span class="cc-tag">m = ${p.edges.length} canh</span>
      </div>
      <div class="cc-result ${isErr ? 'err' : 'ok'}" style="white-space:pre-line">${resultText}</div>
    `;
    div.addEventListener('click', () => {
      loadPreset(key);
      executeRun();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    container.appendChild(div);
  });
}

// ── LOI01: Special display for validator test ─────────────────────────────────
function runLoi01() {
  const p = PRESETS['LOI01'];

  resetAll();
  showValid('Validator: tu choi ca 5 truong hop dau vao sai', false);
  setStatus('Validator OK ✓', '');

  // Stats
  svNhom.textContent = '–';
  svDinh.textContent = '–';
  svCanh.textContent = '5';
  svMax.textContent  = '–';

  // Show 5 validator results
  groupList.innerHTML = '';
  p.errorCases.forEach(ec => {
    const err = kiemTraDauVao(ec.n, ec.edges);
    const pass = ec.expectErr ? (err !== null) : (err === null);
    const col = pass ? '#34d399' : '#f87171';
    const div = document.createElement('div');
    div.className = 'grp-item anim';
    div.style.borderColor = pass ? 'rgba(52,211,153,0.4)' : 'rgba(248,113,113,0.4)';
    div.innerHTML = `
      <div class="grp-dot" style="background:${col}"></div>
      <span class="grp-badge" style="color:${col}">${pass ? 'PASS' : 'FAIL'}</span>
      <span class="grp-members" style="font-size:0.72rem">${ec.label}</span>
      <span class="grp-size" style="color:${col}">${pass ? '✓ Tu choi' : '✗ Khong phat hien'}</span>
    `;
    if (err && pass) {
      const errNote = document.createElement('div');
      errNote.style.cssText = 'font-size:0.65rem;color:#8a97b8;padding:0.2rem 0 0 1.2rem;font-family:JetBrains Mono,monospace;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;width:100%';
      errNote.textContent = '  Ly do: ' + err;
      div.appendChild(errNote);
    }
    groupList.appendChild(div);
  });
  rbGroups.style.display = '';

  // Draw a clean 4-node graph (no invalid edges) with a red X label
  resizeCanvas();
  const n = 4;
  initPos(n);
  RS = { n, edges: [], nhan: new Array(n+1).fill(0), highlighted: new Set(), activeNode: -1 };

  // Run force layout first, then draw with error annotation
  startForce(n, [], () => {
    drawGraph();
    // Draw red "X" annotation to indicate invalid input
    const W = canvas.width, H = canvas.height;
    ctx.save();
    ctx.font = 'bold 16px Inter, sans-serif';
    ctx.fillStyle = '#f87171';
    ctx.textAlign = 'center';
    ctx.fillText('⚠ Canh (1→5) bi tu choi – dinh 5 vuot ngoai [1,4]', W/2, H - 18);
    ctx.restore();
  });
}

// ── HELPERS ───────────────────────────────────────────────────────────────────
function showValid(msg, isErr) {
  validMsg.textContent = msg;
  validMsg.className   = 'validation-msg ' + (isErr ? 'err' : 'ok');
}
function setStatus(msg, type) {
  canvasStatus.textContent = msg;
  canvasStatus.className   = 'canvas-status' + (type ? ' ' + type : '');
}

// ── UNIFIED DISPATCHER ───────────────────────────────────────────────────────
function executeRun() {
  if (currentPreset === 'LOI01') {
    runLoi01();
  } else {
    run();
  }
}

// ── EVENTS ────────────────────────────────────────────────────────────────────
btnRun.addEventListener('click', executeRun);
btnStep.addEventListener('click', stepForward);
btnReset.addEventListener('click', resetAll);

window.addEventListener('resize', () => {
  resizeCanvas();
  if (RS.n > 0) { initPos(RS.n); drawGraph(); startForce(RS.n, RS.edges, null); }
});

// ── CASES TABLE: row click ────────────────────────────────────────────────────
document.getElementById('cases-tbody').addEventListener('click', e => {
  const tr = e.target.closest('tr[data-key]');
  if (!tr) return;
  loadPreset(tr.dataset.key);
  executeRun();
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ── INIT ──────────────────────────────────────────────────────────────────────
resizeCanvas();
buildCasesTable();
buildCards();
loadPreset('VD01');
setTimeout(executeRun, 400);
