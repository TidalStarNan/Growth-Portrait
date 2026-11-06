/* =====================================================================
   公共层：图标 / 导航 / 组件 / 模型计算 / SVG 图表
   零依赖、零构建，双击 html 即可运行。
   ===================================================================== */
(function () {
  'use strict';

  const D = window.MOCK;
  const DIMS = window.DIMENSIONS;
  const LEVELS = window.LEVELS;
  const TAGMAP = {};
  D.tags.forEach(t => { TAGMAP[t.id] = t; });

  /* ───────────────────────── 工具 ───────────────────────── */

  const $ = (sel, root) => (root || document).querySelector(sel);
  const $$ = (sel, root) => Array.from((root || document).querySelectorAll(sel));

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, c => (
      { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
    ));
  }

  function fmtDate(iso) {
    if (!iso) return '';
    const p = iso.split('-');
    return `${+p[1]}月${+p[2]}日`;
  }
  function fmtFull(iso) {
    if (!iso) return '';
    const p = iso.split('-');
    return `${p[0]}.${p[1]}.${p[2]}`;
  }
  function weekday(iso) {
    const d = new Date(iso + 'T00:00:00');
    return '日一二三四五六'[d.getDay()];
  }

  /* ───────────────────────── 图标 ───────────────────────── */

  const ICONS = {
    home: '<path d="M4 10.6 12 4l8 6.6V20a1 1 0 0 1-1 1h-4.5v-6h-5v6H5a1 1 0 0 1-1-1z"/>',
    folder: '<path d="M3 7a2 2 0 0 1 2-2h4.2l2 2H19a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>',
    spark: '<path d="M12 3.2l1.9 5.2 5.2 1.9-5.2 1.9L12 17.4l-1.9-5.2L4.9 10.3l5.2-1.9z"/><path d="M18.6 15.2l.8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8z"/>',
    user: '<circle cx="12" cy="8.2" r="3.4"/><path d="M5.2 20c0-3.2 3-5.8 6.8-5.8s6.8 2.6 6.8 5.8"/>',
    users: '<circle cx="9" cy="8" r="3.2"/><path d="M3.2 19.4c0-2.9 2.6-5.2 5.8-5.2s5.8 2.3 5.8 5.2"/><path d="M16.2 5.4a3 3 0 0 1 0 5.2"/><path d="M17.6 14.2c1.9.7 3.2 2.4 3.2 4.6"/>',
    back: '<path d="M15 4.5 7.5 12l7.5 7.5"/>',
    chev: '<path d="M9.5 5.5 16 12l-6.5 6.5"/>',
    chevDown: '<path d="M5.5 9.5 12 16l6.5-6.5"/>',
    upload: '<path d="M12 16.5V4.2"/><path d="M7.2 9l4.8-4.8L16.8 9"/><path d="M4.2 15.8v3.4a1 1 0 0 0 1 1h13.6a1 1 0 0 0 1-1v-3.4"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    check: '<path d="M4.5 12.6 9.4 17.5 19.8 6.8"/>',
    close: '<path d="M6 6l12 12M18 6L6 18"/>',
    info: '<circle cx="12" cy="12" r="8.6"/><path d="M12 11.2v5"/><circle cx="12" cy="8" r="0.9" fill="currentColor" stroke="none"/>',
    alert: '<path d="M12 4.5 21 19.5H3z"/><path d="M12 10v4"/><circle cx="12" cy="16.8" r="0.9" fill="currentColor" stroke="none"/>',
    search: '<circle cx="11" cy="11" r="6.4"/><path d="M15.6 15.6 20.5 20.5"/>',
    download: '<path d="M12 4v11.5"/><path d="M7.2 10.8 12 15.6l4.8-4.8"/><path d="M4.5 19.8h15"/>',
    qr: '<rect x="3.5" y="3.5" width="6.2" height="6.2" rx="1.4"/><rect x="14.3" y="3.5" width="6.2" height="6.2" rx="1.4"/><rect x="3.5" y="14.3" width="6.2" height="6.2" rx="1.4"/><path d="M14.3 14.3h2.6v2.6h-2.6zM18.5 18.5h1.6v1.6h-1.6zM14.3 18.5h2.6v2.6h-2.6zM18.5 14.3h1.6v2.6h-1.6z" fill="currentColor" stroke="none"/>',
    settings: '<circle cx="12" cy="12" r="3"/><path d="M12 3.2v2.2M12 18.6v2.2M3.2 12h2.2M18.6 12h2.2M5.8 5.8l1.6 1.6M16.6 16.6l1.6 1.6M18.2 5.8l-1.6 1.6M7.4 16.6l-1.6 1.6"/>',
    eye: '<path d="M2.4 12S6 6.2 12 6.2 21.6 12 21.6 12 18 17.8 12 17.8 2.4 12 2.4 12z"/><circle cx="12" cy="12" r="2.4"/>',
    trash: '<path d="M4.2 7h15.6M9 7V4.8h6V7M6.2 7l1 13h9.6l1-13"/>',
    clock: '<circle cx="12" cy="12" r="8.6"/><path d="M12 7.2v5.2l3.2 1.9"/>',
    file: '<path d="M6.2 3h7l5.6 5.6V21H6.2z"/><path d="M13.2 3v5.6h5.6"/>',
    book: '<path d="M4.2 5.2a1.8 1.8 0 0 1 1.8-1.8h13V18H6a1.8 1.8 0 0 0-1.8 1.8z"/><path d="M4.2 19.8A1.8 1.8 0 0 1 6 18h13"/>',
    target: '<circle cx="12" cy="12" r="8.4"/><circle cx="12" cy="12" r="4.2"/><circle cx="12" cy="12" r="1" fill="currentColor" stroke="none"/>',
    refresh: '<path d="M20 12a8 8 0 1 1-2.4-5.7"/><path d="M20 4.4v4.2h-4.2"/>',
    pause: '<path d="M9.4 5.2v13.6M14.6 5.2v13.6"/>',
    edit: '<path d="M4 20h4.2L20 8.2 15.8 4 4 15.8z"/>',
    arrowUpRight: '<path d="M7 17 17 7M9.2 7H17v7.8"/>',
    shield: '<path d="M12 3.2 19 6v6c0 4.4-2.9 7.4-7 8.8-4.1-1.4-7-4.4-7-8.8V6z"/><path d="M8.8 12.2 11 14.4l4.2-4.4"/>',
    lock: '<rect x="5" y="10.8" width="14" height="9.4" rx="2.2"/><path d="M8.2 10.8V8a3.8 3.8 0 0 1 7.6 0v2.8"/>',
    trend: '<path d="M3.2 17.4 9 11.6l4 4 7.8-7.8"/><path d="M16 7.4h4.8v4.8"/>',
    filter: '<path d="M3.4 5.2h17.2l-6.8 7.8v5.6l-3.6 2v-7.6z"/>',
    list: '<path d="M8.4 6h12M8.4 12h12M8.4 18h12"/><circle cx="4.2" cy="6" r="1.1" fill="currentColor" stroke="none"/><circle cx="4.2" cy="12" r="1.1" fill="currentColor" stroke="none"/><circle cx="4.2" cy="18" r="1.1" fill="currentColor" stroke="none"/>',
    trophy: '<path d="M8 4h8v5.2a4 4 0 0 1-8 0z"/><path d="M8 5.6H5.4v1.8A3.4 3.4 0 0 0 8.8 11M16 5.6h2.6v1.8a3.4 3.4 0 0 1-3.4 3.6"/><path d="M12 13.4V17M8.6 20h6.8"/>',
    calendar: '<rect x="3.4" y="5.2" width="17.2" height="15.4" rx="2.2"/><path d="M3.4 10h17.2M8.2 3.2v3.6M15.8 3.2v3.6"/>',
    message: '<path d="M4.2 5.2h15.6v10.4H9.6L4.2 20z"/>',
    bulp: '<path d="M9.4 18.2h5.2M10.2 21h3.6"/><path d="M12 3.2a6 6 0 0 1 3.5 10.9v1.9H8.5v-1.9A6 6 0 0 1 12 3.2z"/>',
    layers: '<path d="M12 3.4 21 8l-9 4.6L3 8z"/><path d="M3 12.4 12 17l9-4.6"/><path d="M3 16.8 12 21.4l9-4.6"/>',
    grid: '<rect x="3.6" y="3.6" width="7" height="7" rx="1.6"/><rect x="13.4" y="3.6" width="7" height="7" rx="1.6"/><rect x="3.6" y="13.4" width="7" height="7" rx="1.6"/><rect x="13.4" y="13.4" width="7" height="7" rx="1.6"/>',
    flag: '<path d="M5.4 21V4.2h10.8l-2.2 4.2 2.2 4.2H5.4"/>',
    link: '<path d="M10.2 13.8a3.8 3.8 0 0 0 5.4 0l2.6-2.6a3.8 3.8 0 0 0-5.4-5.4l-1.2 1.2"/><path d="M13.8 10.2a3.8 3.8 0 0 0-5.4 0l-2.6 2.6a3.8 3.8 0 0 0 5.4 5.4l1.2-1.2"/>',
    minus: '<path d="M5 12h14"/>',
    logo: '<path d="M12 3.4 19.6 7.8v8.4L12 20.6 4.4 16.2V7.8z"/><path d="M12 8.2 15.6 10v4l-3.6 2-3.6-2v-4z"/>'
  };

  function icon(name, size, cls) {
    const s = size || 20;
    return `<svg viewBox="0 0 24 24" width="${s}" height="${s}" fill="none"
      stroke="currentColor" stroke-width="1.7" stroke-linecap="round"
      stroke-linejoin="round" class="${cls || ''}" aria-hidden="true">${ICONS[name] || ''}</svg>`;
  }

  /* ───────────────────────── 模型计算 ───────────────────────── */

  const model = {
    student(sid) { return D.students.find(s => s.id === sid); },
    klass(cid) { return D.classes.find(c => c.id === cid); },
    classStudents(cid) { return D.students.filter(s => s.classId === cid); },
    materialsOf(sid) { return D.materials.filter(m => m.sid === sid).sort((a, b) => b.at < a.at ? -1 : 1); },
    reviewedMaterialsOf(sid) { return D.materials.filter(m => m.sid === sid && m.status === 'reviewed'); },
    materialsByClass(cid) { return D.materials.filter(m => { const s = model.student(m.sid); return s && s.classId === cid; }); },
    reviewsOf(sid) { return D.reviews.filter(r => r.sid === sid).sort((a, b) => b.at < a.at ? -1 : 1); },
    tag(id) { return TAGMAP[id]; },
    dimTags(dimKey) { return D.tags.filter(t => t.dim === dimKey); },

    /** 证据覆盖度：level 表示证据充分程度，不是能力评分 */
    coverage(sid) {
      const ms = model.materialsOf(sid);
      const hasReview = model.reviewsOf(sid).length > 0;
      const out = {};
      DIMS.forEach(d => {
        const mats = ms.filter(m => m.tags.some(t => TAGMAP[t] && TAGMAP[t].dim === d.key));
        const tagSet = new Set();
        mats.forEach(m => m.tags.forEach(t => {
          if (TAGMAP[t] && TAGMAP[t].dim === d.key) tagSet.add(t);
        }));
        const types = new Set(mats.map(m => m.type));
        let lv = 0;
        if (mats.length > 0) {
          lv = mats.length <= 2 ? 1 : mats.length <= 5 ? 2 : 3;
          if (lv >= 2 && types.size < 2) lv = 1;
          if (lv === 3 && types.size < 3) lv = 2;
          if (lv === 3 && !hasReview) lv = 2;
        }
        out[d.key] = { level: lv, materials: mats.length, tags: tagSet.size, types: types.size };
      });
      return out;
    },

    levelName(v) { return (LEVELS[v] || LEVELS[0]).name; },

    portrait(sid) {
      const cov = model.coverage(sid);
      const dims = DIMS.map(d => Object.assign({}, d, cov[d.key]));
      const byLevel = [...dims].sort((a, b) => b.level - a.level || b.materials - a.materials);
      const strengths = byLevel.filter(d => d.level >= 1).slice(0, 2);
      const weak = [...dims].sort((a, b) => a.level - b.level || a.materials - b.materials).slice(0, 2);
      return { cov, dims, strengths, weak };
    },

    /** 班级聚合：仅群体数据，不含个人排名 */
    classStats(cid) {
      const ss = model.classStudents(cid);
      const ms = model.materialsByClass(cid);
      const submitters = new Set(ms.map(m => m.sid));
      const reviewed = ms.filter(m => m.status === 'reviewed').length;
      const byType = {};
      D.materialTypes.forEach(t => { byType[t] = ms.filter(m => m.type === t).length; });
      const levelDist = {};
      DIMS.forEach(d => {
        const arr = [0, 0, 0, 0];
        ss.forEach(s => { arr[model.coverage(s.id)[d.key].level] += 1; });
        levelDist[d.key] = arr;
      });
      return {
        total: ss.length,
        submitters: submitters.size,
        rate: ss.length ? Math.round(submitters.size / ss.length * 100) : 0,
        materials: ms.length,
        perCapita: ss.length ? (ms.length / ss.length).toFixed(1) : '0',
        reviewedRate: ms.length ? Math.round(reviewed / ms.length * 100) : 0,
        byType, levelDist
      };
    }
  };

  /* ───────────────────────── 文案库 ───────────────────────── */

  const DIM_ADVICE = {
    motivation: '可以记下「我为什么想改这节课」，三句话就行。',
    thinking: '挑一次改动，写清问题是什么、方案怎么来的、依据是什么。',
    character: '写一次不顺利的尝试：当时怎么判断、后来怎么调、谁帮了你。',
    practice: '补一份课堂实录、学生作品或活动记录。'
  };
  const DIM_STRENGTH_NOTE = {
    motivation: '多份材料都看到主动求变的痕迹',
    thinking: '设计看得出改了不止一版',
    character: '有失败复盘和协作的记录',
    practice: '有真实课堂的落地证据'
  };

  /* ───────────────────────── 组件 ───────────────────────── */

  function tagChip(tagId, cls) {
    const t = TAGMAP[tagId];
    if (!t) return '';
    return `<span class="tag ${cls || ''}"><i class="dim-dot dim-${t.dim}"></i>${esc(t.name)}</span>`;
  }

  function customChip(name) {
    return `<span class="tag ghost">${esc(name)}</span>`;
  }

  function levelTag(level) {
    return `<span class="tag">${model.levelName(level)}</span>`;
  }

  function levelBar(level, dimName) {
    const pct = [4, 34, 66, 98][level] || 4;
    return `<div class="level-bar">
      <span class="dim-dot dim-${dimName || 'motivation'}"></span>
      <div class="level-track"><div class="level-fill" style="width:${pct}%"></div></div>
      <span class="level-name">${model.levelName(level)}</span>
    </div>`;
  }

  function avatar(student, size) {
    if (!student) return '';
    const cls = size === 'sm' ? 'avatar sm' : size === 'lg' ? 'avatar lg' : 'avatar';
    return `<div class="${cls}">${esc(student.avatar || student.name.slice(0, 1))}</div>`;
  }

  function emptyState(iconName, title, desc, actionHtml) {
    return `<div class="empty">
      <div class="empty-ico">${icon(iconName || 'folder', 26)}</div>
      <h4>${esc(title)}</h4>
      <p>${esc(desc || '')}</p>
      ${actionHtml ? `<div class="mt-16">${actionHtml}</div>` : ''}
    </div>`;
  }

  function stat(num, unit, label) {
    return `<div class="stat">
      <div class="stat-num">${num}${unit ? `<em>${unit}</em>` : ''}</div>
      <div class="stat-label">${esc(label)}</div>
    </div>`;
  }

  function statusTag(status) {
    return status === 'reviewed'
      ? '<span class="tag success">已研判</span>'
      : '<span class="tag warn">待研判</span>';
  }

  function typeIcon(type) {
    if (type === '实习反思') return 'message';
    if (type === '教研记录') return 'users';
    if (type === '教学实践材料') return 'layers';
    if (type === '教学设计方案修改') return 'edit';
    return 'file';
  }

  /* ───────────────────────── 图表（手写 SVG） ───────────────────────── */

  const LEVEL_COLORS = ['#dfe6ef', '#a9c3e3', '#6f96c9', '#3e6ba6'];

  /** 四维雷达：不显示刻度与数值，只表示证据覆盖 */
  function radarSVG(values, opts) {
    opts = opts || {};
    const W = 400, H = 302, cx = 200, cy = 150, R = 88;
    const ang = [-Math.PI / 2, 0, Math.PI / 2, Math.PI];
    const pt = (a, r) => [cx + Math.cos(a) * r, cy + Math.sin(a) * r];
    let s = `<svg class="chart-svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="四维证据分布雷达图">`;

    // 网格
    for (let i = 1; i <= 4; i++) {
      const rr = R * i / 4;
      const pts = ang.map(a => pt(a, rr).map(n => n.toFixed(1)).join(',')).join(' ');
      s += `<polygon points="${pts}" fill="none" stroke="#e6ebf2" stroke-width="1"/>`;
    }
    ang.forEach(a => {
      const p = pt(a, R);
      s += `<line x1="${cx}" y1="${cy}" x2="${p[0].toFixed(1)}" y2="${p[1].toFixed(1)}" stroke="#e6ebf2" stroke-width="1"/>`;
    });

    // 数据多边形
    const dataPts = values.map((v, i) => {
      const rr = R * (0.10 + 0.90 * Math.min(v, 3) / 3);
      return pt(ang[i], rr);
    });
    const poly = dataPts.map(p => p.map(n => n.toFixed(1)).join(',')).join(' ');
    s += `<polygon points="${poly}" fill="rgba(62,107,166,0.16)" stroke="#3e6ba6" stroke-width="1.8" stroke-linejoin="round"/>`;
    dataPts.forEach(p => {
      s += `<circle cx="${p[0].toFixed(1)}" cy="${p[1].toFixed(1)}" r="3.6" fill="#fff" stroke="#3e6ba6" stroke-width="2"/>`;
    });

    // 教师确认值（虚线外圈）
    if (opts.confirmed) {
      const cp = opts.confirmed.map((v, i) => {
        const rr = R * (0.10 + 0.90 * Math.min(v, 3) / 3);
        return pt(ang[i], rr);
      });
      const cpoly = cp.map(p => p.map(n => n.toFixed(1)).join(',')).join(' ');
      s += `<polygon points="${cpoly}" fill="none" stroke="#b8792e" stroke-width="1.4" stroke-dasharray="4 4" stroke-linejoin="round" opacity="0.85"/>`;
    }

    // 标签
    const labels = [
      { x: cx, y: cy - R - 16, anchor: 'middle', text: DIMS[0].short },
      { x: cx + R + 12, y: cy + 4, anchor: 'start', text: DIMS[1].short },
      { x: cx, y: cy + R + 26, anchor: 'middle', text: DIMS[2].short },
      { x: cx - R - 12, y: cy + 4, anchor: 'end', text: DIMS[3].short }
    ];
    labels.forEach((l, i) => {
      s += `<text x="${l.x}" y="${l.y}" text-anchor="${l.anchor}" font-size="12" fill="#6b6b70" font-family="inherit">${l.text}</text>`;
      s += `<text x="${l.x}" y="${l.y + 15}" text-anchor="${l.anchor}" font-size="10" fill="#9a9aa0" font-family="inherit">${LEVELS[values[i]].name}</text>`;
    });
    s += '</svg>';
    return s;
  }

  /** 横向条形 */
  function hBarSVG(items, opts) {
    opts = opts || {};
    const n = items.length;
    const rowH = 38, pad = 6;
    const W = 380, H = n * rowH + pad * 2;
    const labelW = opts.labelW || 86;
    const max = Math.max.apply(null, items.map(i => i.value).concat([1]));
    const trackX = labelW + 8;
    const trackW = W - trackX - 46;
    let s = `<svg class="chart-svg" viewBox="0 0 ${W} ${H}" role="img">`;
    items.forEach((it, i) => {
      const y = pad + i * rowH;
      const barY = y + 11;
      const w = Math.max(3, trackW * it.value / max);
      s += `<text x="0" y="${y + 22}" font-size="12" fill="#45454a" font-family="inherit">${esc(it.label)}</text>`;
      s += `<rect x="${trackX}" y="${barY}" width="${trackW}" height="10" rx="5" fill="#f1f4f8"/>`;
      s += `<rect x="${trackX}" y="${barY}" width="${w.toFixed(1)}" height="10" rx="5" fill="${it.color || '#3e6ba6'}"/>`;
      s += `<text x="${trackX + trackW + 10}" y="${y + 21}" font-size="11.5" fill="#6b6b70" font-family="inherit" font-variant-numeric="tabular-nums">${it.value}</text>`;
    });
    s += '</svg>';
    return s;
  }

  /** 折线（平滑） */
  function lineSVG(points, opts) {
    opts = opts || {};
    const W = 380, H = 200;
    const pl = 34, pr = 14, ptp = 16, pb = 30;
    const iw = W - pl - pr, ih = H - ptp - pb;
    const max = Math.max.apply(null, points.map(p => p.value).concat([1]));
    const min = 0;
    const xs = i => pl + (points.length === 1 ? iw / 2 : i * iw / (points.length - 1));
    const ys = v => ptp + ih * (1 - (v - min) / (max - min || 1));

    let path = '';
    points.forEach((p, i) => {
      const x = xs(i), y = ys(p.value);
      if (i === 0) { path += `M${x.toFixed(1)},${y.toFixed(1)}`; return; }
      const px = xs(i - 1), py = ys(points[i - 1].value);
      const cx1 = (px + x) / 2;
      path += ` C${cx1.toFixed(1)},${py.toFixed(1)} ${cx1.toFixed(1)},${y.toFixed(1)} ${x.toFixed(1)},${y.toFixed(1)}`;
    });
    const area = path + ` L${xs(points.length - 1).toFixed(1)},${(ptp + ih).toFixed(1)} L${xs(0).toFixed(1)},${(ptp + ih).toFixed(1)} Z`;

    let s = `<svg class="chart-svg" viewBox="0 0 ${W} ${H}" role="img">`;
    s += `<defs><linearGradient id="lg-area" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#3e6ba6" stop-opacity="0.18"/>
      <stop offset="100%" stop-color="#3e6ba6" stop-opacity="0"/></linearGradient></defs>`;
    // 网格
    for (let i = 0; i <= 3; i++) {
      const y = ptp + ih * i / 3;
      s += `<line x1="${pl}" y1="${y}" x2="${W - pr}" y2="${y}" stroke="#eef1f6" stroke-width="1"/>`;
    }
    s += `<path d="${area}" fill="url(#lg-area)"/>`;
    s += `<path d="${path}" fill="none" stroke="#3e6ba6" stroke-width="2" stroke-linecap="round"/>`;
    points.forEach((p, i) => {
      s += `<circle cx="${xs(i).toFixed(1)}" cy="${ys(p.value).toFixed(1)}" r="3.4" fill="#fff" stroke="#3e6ba6" stroke-width="2"/>`;
      s += `<text x="${xs(i).toFixed(1)}" y="${H - 9}" text-anchor="middle" font-size="10.5" fill="#9a9aa0" font-family="inherit">${esc(p.label)}</text>`;
    });
    s += `<text x="${pl - 6}" y="${ptp + 4}" text-anchor="end" font-size="10" fill="#9a9aa0" font-family="inherit">${max}</text>`;
    s += `<text x="${pl - 6}" y="${ptp + ih}" text-anchor="end" font-size="10" fill="#9a9aa0" font-family="inherit">0</text>`;
    s += '</svg>';
    return s;
  }

  /** 横向堆叠条：四档人数分布 */
  function stackBarSVG(rows) {
    const rowH = 40, pad = 8;
    const W = 380, H = rows.length * rowH + pad * 2;
    const labelW = 96;
    const trackX = labelW + 8;
    const trackW = W - trackX - 8;
    let s = `<svg class="chart-svg" viewBox="0 0 ${W} ${H}" role="img">`;
    rows.forEach((row, i) => {
      const y = pad + i * rowH;
      const total = row.segments.reduce((a, b) => a + b, 0) || 1;
      let x = trackX;
      s += `<text x="0" y="${y + 20}" font-size="12" fill="#45454a" font-family="inherit">${esc(row.label)}</text>`;
      row.segments.forEach((v, k) => {
        if (!v) return;
        const w = trackW * v / total;
        s += `<rect x="${x.toFixed(1)}" y="${y + 10}" width="${Math.max(0, w - 1.5).toFixed(1)}" height="14" rx="4" fill="${LEVEL_COLORS[k]}"/>`;
        if (w > 18) {
          s += `<text x="${(x + w / 2).toFixed(1)}" y="${y + 20.5}" text-anchor="middle" font-size="10.5"
            fill="${k >= 2 ? '#fff' : '#45454a'}" font-family="inherit">${v}</text>`;
        }
        x += w;
      });
    });
    s += '</svg>';
    return s;
  }

  /** 环形 */
  function donutSVG(items, opts) {
    opts = opts || {};
    const W = 200, H = 200, cx = 100, cy = 100, r = 62, sw = 22;
    const C = 2 * Math.PI * r;
    const total = items.reduce((a, b) => a + b.value, 0) || 1;
    let s = `<svg class="chart-svg" viewBox="0 0 ${W} ${H}" role="img" style="max-width:200px;margin:0 auto">`;
    s += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="#f1f4f8" stroke-width="${sw}"/>`;
    let offset = 0;
    const colors = ['#3e6ba6', '#6f96c9', '#a9c3e3', '#cfdcea', '#b08850', '#8a6ea8'];
    items.forEach((it, i) => {
      const len = C * it.value / total;
      s += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${it.color || colors[i % colors.length]}"
        stroke-width="${sw}" stroke-dasharray="${(len - 2).toFixed(1)} ${(C - len + 2).toFixed(1)}"
        stroke-dashoffset="${(-offset).toFixed(1)}" stroke-linecap="round"
        transform="rotate(-90 ${cx} ${cy})"/>`;
      offset += len;
    });
    s += `<text x="${cx}" y="${cy - 2}" text-anchor="middle" font-size="22" font-weight="600" fill="#1d1d1f" font-family="inherit">${total}</text>`;
    s += `<text x="${cx}" y="${cy + 18}" text-anchor="middle" font-size="11" fill="#9a9aa0" font-family="inherit">${esc(opts.centerLabel || '总量')}</text>`;
    s += '</svg>';
    return s;
  }

  function legend(items) {
    return `<div class="chart-legend">${items.map(it =>
      `<span class="legend-item"><span class="legend-swatch" style="background:${it.color}"></span>${esc(it.label)}</span>`
    ).join('')}</div>`;
  }

  /* ───────────────────────── 导航 ───────────────────────── */

  const ROLE_NAME = { student: '学生', teacher: '教师', admin: '院校管理员' };
  const ROLE_HOME = { student: '#/student/home', teacher: '#/teacher/home', admin: '#/admin/home' };

  function navHTML(role, title, back) {
    const chip = `<span class="demo-chip"><i></i>${ROLE_NAME[role]}</span>`;
    return `<header class="nav">
      <div class="nav-inner">
        <a class="nav-back" href="${back || ROLE_HOME[role]}" aria-label="返回">${icon('back', 20)}</a>
        <div class="grow"><div class="nav-title">${esc(title || '')}</div></div>
        ${chip}
      </div>
    </header>`;
  }

  const TABS = [
    { key: 'home', label: '首页', ico: 'home', href: '#/student/home' },
    { key: 'portfolio', label: '档案', ico: 'folder', href: '#/student/portfolio' },
    { key: 'resources', label: '资源', ico: 'spark', href: '#/student/resources' },
    { key: 'me', label: '我的', ico: 'user', href: '#/student/me' }
  ];

  function tabHTML(active) {
    return `<nav class="tabbar">${TABS.map(t => `
      <a class="tab ${t.key === active ? 'active' : ''}" href="${t.href}">
        ${icon(t.ico, 21)}<span>${t.label}</span>
      </a>`).join('')}</nav>`;
  }

  /* ───────────────────────── 弹层 / Toast ───────────────────────── */

  let backdrop, sheetEl, toastEl, toastTimer;

  function ensureOverlay() {
    if (backdrop) return;
    backdrop = document.createElement('div');
    backdrop.className = 'backdrop';
    backdrop.addEventListener('click', closeSheet);
    sheetEl = document.createElement('div');
    sheetEl.className = 'sheet';
    toastEl = document.createElement('div');
    toastEl.className = 'toast';
    document.body.appendChild(backdrop);
    document.body.appendChild(sheetEl);
    document.body.appendChild(toastEl);
  }

  function openSheet(title, bodyHtml, actionHtml) {
    ensureOverlay();
    sheetEl.innerHTML = `<h3>${esc(title)}</h3><div class="mt-8">${bodyHtml}</div>
      ${actionHtml || '<button class="btn btn-primary btn-block mt-24" onclick="UI.closeSheet()">我知道了</button>'}`;
    requestAnimationFrame(() => {
      backdrop.classList.add('show');
      sheetEl.classList.add('show');
    });
  }

  function closeSheet() {
    if (!sheetEl) return;
    backdrop.classList.remove('show');
    sheetEl.classList.remove('show');
  }

  function toast(msg) {
    ensureOverlay();
    toastEl.textContent = msg;
    requestAnimationFrame(() => toastEl.classList.add('show'));
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove('show'), 2200);
  }

  /* ───────────────────────── 路由与启动 ───────────────────────── */

  function parseHash() {
    const raw = (location.hash || '').replace(/^#/, '') || '/';
    const i = raw.indexOf('?');
    return {
      path: i > -1 ? raw.slice(0, i) : raw,
      query: i > -1 ? raw.slice(i + 1) : ''
    };
  }

  function renderRoute() {
    const app = document.getElementById('app');
    if (!app) return;

    const { path } = parseHash();
    const key = window.ROUTE_MAP ? window.ROUTE_MAP[path] : null;

    if (!key) {
      if (path !== '/') location.replace('#/');
      return;
    }

    const v = window.VIEWS[key];
    document.title = v.title ? v.title + ' · 智育成长画像' : '智育成长画像';

    let html = '';
    if (v.nav) html += navHTML(v.role, v.title, v.back);
    html += v.html;
    if (v.tabbar && v.role === 'student') html += tabHTML(v.tab);

    app.innerHTML = html;
    window.scrollTo(0, 0);

    if (window.Pages && typeof window.Pages[key] === 'function') {
      try { window.Pages[key](); } catch (e) { console.error('[view:' + key + ']', e); }
    }
  }

  function boot() {
    if (!location.hash) {
      try { history.replaceState(null, '', '#/'); } catch (e) { /* file:// 下个别浏览器受限，忽略 */ }
    }
    window.addEventListener('hashchange', renderRoute);
    renderRoute();
  }

  // 键盘 Esc 关闭弹层
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeSheet();
  });

  window.UI = {
    $, $$, esc, fmtDate, fmtFull, weekday,
    icon, model, D, DIMS, LEVELS, TAGMAP,
    tagChip, customChip, levelTag, levelBar, avatar, emptyState, stat, statusTag, typeIcon,
    radarSVG, hBarSVG, lineSVG, stackBarSVG, donutSVG, legend, LEVEL_COLORS,
    DIM_ADVICE, DIM_STRENGTH_NOTE,
    openSheet, closeSheet, toast,
    boot
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
