/* =====================================================================
   页面逻辑：按 body[data-page] 分派
   约定：HTML 提供静态骨架，本文件负责填充动态数据与交互
   ===================================================================== */
(function () {
  'use strict';

  const UI = window.UI;
  const { $, esc, model, icon, D, DIMS, LEVELS } = UI;

  function qs(k) {
    const i = location.hash.indexOf('?');
    return i > -1 ? new URLSearchParams(location.hash.slice(i + 1)).get(k) : null;
  }

  /* ═════════════════════ 启动页 ═════════════════════ */

  function initSplash() {
    /* 启动页直接提供角色入口，不再自动跳转 */
  }

  /* ═════════════════════ 二维码 ═════════════════════ */

  function qrSVG() {
    const N = 25;
    let seed = 20261106;
    const rnd = () => { seed = (seed * 1103515245 + 12345) & 0x7fffffff; return seed / 0x7fffffff; };
    let cells = '';
    for (let y = 0; y < N; y++) {
      for (let x = 0; x < N; x++) {
        const finder = (x < 7 && y < 7) || (x >= N - 7 && y < 7) || (x < 7 && y >= N - 7);
        if (finder) continue;
        if (rnd() > 0.52) cells += `<rect x="${x}" y="${y}" width="1" height="1"/>`;
      }
    }
    let f = '';
    [[0, 0], [N - 7, 0], [0, N - 7]].forEach(function (p) {
      f += `<rect x="${p[0] + 0.5}" y="${p[1] + 0.5}" width="6" height="6" rx="1.3" fill="none" stroke="#1d1d1f" stroke-width="1"/>`;
      f += `<rect x="${p[0] + 2}" y="${p[1] + 2}" width="3" height="3" rx="0.6" fill="#1d1d1f"/>`;
    });
    return `<svg viewBox="-1 -1 ${N + 2} ${N + 2}" shape-rendering="crispEdges">
      <g fill="#1d1d1f">${cells}</g>${f}</svg>`;
  }

  /* ═════════════════════ 学生首页 ═════════════════════ */

  function initStudentHome() {
    const sid = 's1';

    const h = new Date().getHours();
    const greet = h < 11 ? '早上好' : h < 14 ? '中午好' : h < 18 ? '下午好' : '晚上好';
    const st = model.student(sid);
    const kl = model.klass(st.classId);
    const g = $('#greet');
    if (g) {
      g.innerHTML = `<div class="t-2xl fw-600 lh-tight">${greet}，${esc(st.name)}</div>
        <div class="t-sm c-3 mt-8">${esc(kl.name)} · ${esc(st.no)}</div>`;
    }

    const p = model.portrait(sid);
    const mats = model.materialsOf(sid);
    const revs = model.reviewsOf(sid);
    const el = $('#portrait-preview');
    if (el) {
      el.innerHTML = `
        <div class="row-between">
          <div>
            <div class="t-xl fw-600">我的成长画像预览</div>
          </div>
          <a class="chip active" href="#/student/portrait">完整画像 ${icon('chev', 14)}</a>
        </div>
        <div class="stack mt-16">
          ${p.dims.map(d => `
            <div>
              <div class="row-between t-xs c-3" style="margin-bottom:5px">
                <span>${esc(d.short)}</span>
              </div>
              ${UI.levelBar(d.level, d.key)}
            </div>`).join('')}
        </div>
        <div class="divider"></div>
        <div class="row-between t-xs c-3">
          <span>本学期已提交 <b class="c-2">${mats.length}</b> 份材料</span>
          <span>已获 <b class="c-2">${revs.length}</b> 条教师反馈</span>
        </div>
        <div class="mt-12 footnote" style="text-align:left;padding:0">
          本图展示四个维度的证据充分程度，不代表能力评分。
        </div>`;
    }

    const statEl = $('#home-stats');
    if (statEl) {
      statEl.innerHTML = [
        UI.stat(mats.length, '份', '已提交材料'),
        UI.stat(mats.filter(m => m.status === 'reviewed').length, '份', '已研判'),
        UI.stat(revs.length, '条', '收到反馈')
      ].join('');
    }

    const recent = $('#recent-list');
    if (recent) {
      recent.innerHTML = mats.slice(0, 3).map(m => `
        <a class="list-item" href="#/student/material?id=${m.id}">
          <div class="li-icon">${icon(UI.typeIcon(m.type), 19)}</div>
          <div class="li-body">
            <div class="li-title">${esc(m.title)}</div>
            <div class="li-sub">${esc(m.type)} · ${UI.fmtDate(m.at)}</div>
          </div>
          <span class="chev">${icon('chev', 16)}</span>
        </a>`).join('');
    }
  }

  /* ═════════════════════ 档案袋 ═════════════════════ */

  function initPortfolio() {
    const sid = 's1';
    const mats = model.materialsOf(sid);
    const listEl = $('#material-list');
    const countEl = $('#portfolio-count');
    const chips = UI.$$('#type-filter .chip');

    let filter = '全部';

    function render() {
      const data = filter === '全部' ? mats : mats.filter(m => m.type === filter);
      if (countEl) {
        countEl.innerHTML = `已提交 <b class="c-2">${mats.length}</b> 份 · 覆盖 <b class="c-2">${new Set(mats.map(m => m.type)).size}</b> 类材料`;
      }
      if (!listEl) return;
      if (!data.length) {
        listEl.innerHTML = UI.emptyState('folder', '这一类还没有材料',
          '一次课堂、一次失败或一次讨论，都可以作为材料。',
          `<a class="btn btn-primary btn-sm" href="#/student/reflection">去写一段反思</a>`);
        return;
      }
      listEl.innerHTML = data.map(m => `
        <a class="list-item" href="#/student/material?id=${m.id}">
          <div class="li-icon">${icon(UI.typeIcon(m.type), 19)}</div>
          <div class="li-body">
            <div class="li-title">${esc(m.title)}</div>
            <div class="li-sub">${esc(m.type)} · ${UI.fmtDate(m.at)}</div>
            <div class="tag-row" style="margin-top:7px">
              ${m.tags.slice(0, 3).map(t => UI.tagChip(t)).join('')}
              ${m.tags.length > 3 ? `<span class="tag ghost">+${m.tags.length - 3}</span>` : ''}
            </div>
          </div>
          <div style="text-align:right;display:flex;flex-direction:column;align-items:flex-end;gap:6px">
            ${UI.statusTag(m.status)}
            <span class="chev">${icon('chev', 16)}</span>
          </div>
        </a>`).join('');
    }

    chips.forEach(c => {
      c.addEventListener('click', () => {
        chips.forEach(x => x.classList.remove('active'));
        c.classList.add('active');
        filter = c.dataset.type;
        render();
      });
    });

    const btn = $('#upload-btn');
    if (btn) {
      btn.addEventListener('click', () => {
        UI.openSheet('暂不支持上传',
          `<p>正式版将支持 PDF / Word / 图片，单份 ≤ 50MB，并自动做文件类型校验。<br><br>
           上传后的材料会进入教师的「待研判」队列，研判前学生可自行删除。</p>`);
      });
    }

    render();
  }

  /* ═════════════════════ 材料详情 ═════════════════════ */

  function initMaterial() {
    const id = qs('id') || 'm1';
    const m = D.materials.find(x => x.id === id) || D.materials[0];
    const st = model.student(m.sid);
    const rev = model.reviewsOf(m.sid)[0];
    const root = $('#material-detail');
    if (!root) return;

    root.innerHTML = `
      <div class="card">
        <div class="row" style="align-items:flex-start">
          <div class="li-icon" style="width:46px;height:46px;border-radius:14px">${icon(UI.typeIcon(m.type), 22)}</div>
          <div class="grow">
            <div class="t-lg fw-600 lh-tight">${esc(m.title)}</div>
            <div class="t-sm c-3 mt-8">${esc(m.type)} · ${UI.fmtDate(m.at)}</div>
          </div>
          ${UI.statusTag(m.status)}
        </div>
        <div class="divider"></div>
        <div class="row gap-12 t-sm c-3">
          <span class="row gap-6">${icon('file', 15)}${esc(m.file)}</span>
          <span class="mono">${esc(m.size)}</span>
        </div>
      </div>

      <div class="card">
        <div class="card-hd"><div><h3>材料摘要</h3><p>学生提交时填写的说明</p></div></div>
        <p class="t-md c-2" style="line-height:1.7">${esc(m.summary || '（未填写说明）')}</p>
      </div>

      <div class="card">
        <div class="card-hd"><div><h3>四维指标标签</h3><p>由教师研判时标注，是检索索引，不是评语</p></div></div>
        ${m.tags.length
          ? `<div class="tag-row">${m.tags.map(t => UI.tagChip(t)).join('')}</div>`
          : `<p class="t-sm c-3">教师尚未为该材料标注指标标签。</p>`}
        ${m.custom.length ? `
          <div class="divider"></div>
          <div class="t-xs c-3" style="margin-bottom:8px">教师备注标签（不参与画像聚合）</div>
          <div class="tag-row">${m.custom.map(c => UI.customChip(c)).join('')}</div>` : ''}
      </div>

      ${m.status === 'reviewed' && rev ? `
        <div class="card card-soft">
          <div class="card-hd"><div><h3>教师反馈</h3><p>${esc(D.teacher.name)} · ${UI.fmtDate(rev.at)}</p></div></div>
          <p class="t-md" style="line-height:1.75">${esc(rev.comment)}</p>
        </div>` : `
        <div class="banner neutral">
          ${icon('info', 17)}
          <div>教师尚未研判这份材料。你可以先去完善自我反思，帮助教师理解你的设计意图。</div>
        </div>`}

      <div class="footnote">材料本身不打分。</div>
    `;
  }

  /* ═════════════════════ 创新能力画像 ═════════════════════ */

  function initPortrait() {
    const sid = qs('sid') || 's1';
    const st = model.student(sid);
    const p = model.portrait(sid);
    const revs = model.reviewsOf(sid);
    const confirmed = revs.length ? DIMS.map(d => revs[0].levels[d.key]) : null;

    const head = $('#portrait-head');
    if (head) {
      head.innerHTML = `<div class="t-xs c-3">${esc(st.name)} · ${esc(model.klass(st.classId).name)}</div>`;
    }

    const radar = $('#radar');
    if (radar) {
      radar.innerHTML = UI.radarSVG(p.dims.map(d => d.level), confirmed ? { confirmed: confirmed } : {});
    }

    const lv = $('#level-rows');
    if (lv) {
      lv.innerHTML = p.dims.map(d => `
        <div class="mt-12">
          <div class="row-between t-sm" style="margin-bottom:6px">
            <span class="c-2">${esc(d.name)}</span>
            <span class="c-4 t-xs">${d.materials} 份材料 · ${d.tags} 个标签</span>
          </div>
          ${UI.levelBar(d.level, d.key)}
        </div>`).join('');
    }

    const blocks = $('#portrait-blocks');
    if (blocks) {
      blocks.innerHTML = `
        <div class="card">
          <div class="card-hd">
            <div><h3>优势领域</h3><p>证据较充分的维度</p></div>
          </div>
          <div class="stack">
            ${p.strengths.map(d => `
              <div class="row gap-12">
                <span class="dim-dot dim-${d.key}" style="width:8px;height:8px"></span>
                <div class="grow">
                  <div class="t-md fw-500">${esc(d.name)}</div>
                  <div class="t-xs c-3">${esc(UI.DIM_STRENGTH_NOTE[d.key])}</div>
                </div>
                ${UI.levelTag(d.level)}
              </div>`).join('')}
          </div>
        </div>

        <div class="card">
          <div class="card-hd">
            <div><h3>待提升方向</h3><p>证据较少的维度，可以补充材料</p></div>
          </div>
          <div class="stack">
            ${p.weak.map(d => `
              <div class="row gap-12">
                <span class="dim-dot dim-${d.key}" style="width:8px;height:8px"></span>
                <div class="grow">
                  <div class="t-md fw-500">${esc(d.name)}</div>
                  <div class="t-xs c-3">${esc(UI.DIM_ADVICE[d.key])}</div>
                </div>
                ${UI.levelTag(d.level)}
              </div>`).join('')}
          </div>
        </div>

        <div class="card card-cream">
          <div class="card-hd">
            <div><h3>个性化发展建议</h3><p>系统依据证据分布归纳，仅供自我参照</p></div>
          </div>
          <p class="t-md" style="line-height:1.8">
            「${esc(p.strengths[0].short)}」的材料已经比较充分。
            相对少的是「${esc(p.weak[0].short)}」，可以从最近一次不太顺利的尝试写起。
          </p>
          <div class="divider"></div>
          <div class="t-xs c-4" style="line-height:1.7">
            系统依据材料证据自动归纳，仅供自我参照；最终发展建议以教师反馈为准。
          </div>
        </div>

        <a class="btn btn-primary btn-block" href="#/student/feedback">
          ${icon('message', 17)} 查看教师反馈
        </a>
        <div class="footnote">
          本页全部内容表示「证据充分程度」，不代表能力评分，也不作为任何评价依据。
        </div>
      `;
    }
  }

  /* ═════════════════════ 我的反馈 ═════════════════════ */

  function initFeedback() {
    const sid = 's1';
    const revs = model.reviewsOf(sid);
    const root = $('#feedback-list');
    if (!root) return;

    if (!revs.length) {
      root.innerHTML = UI.emptyState('message', '教师尚未发布反馈',
        '你可以先完善材料与反思，教师研判后这里会出现质性评语与发展建议。');
      return;
    }

    root.innerHTML = `<div class="timeline">${revs.map((r, i) => `
      <div class="tl-item">
        <div class="card">
          <div class="row-between">
            <div class="row gap-6 t-xs c-3">
              ${icon('calendar', 14)}${UI.fmtFull(r.at)} · 周${UI.weekday(r.at)}
            </div>
            <span class="tag ghost">${esc(D.teacher.name)}</span>
          </div>
          <div class="mt-12">
            <div class="t-xs c-4" style="margin-bottom:6px">质性评语</div>
            <p class="t-md" style="line-height:1.75">${esc(r.comment)}</p>
          </div>
          <div class="mt-16">
            <div class="t-xs c-4" style="margin-bottom:6px">发展改进建议</div>
            <p class="t-md" style="line-height:1.75">${esc(r.suggestion)}</p>
          </div>
          <div class="divider"></div>
          <div class="t-xs c-4" style="margin-bottom:8px">教师确认的证据等级</div>
          <div class="tag-row">
            ${DIMS.map(d => `<span class="tag"><i class="dim-dot dim-${d.key}"></i>${esc(d.short)} · ${model.levelName(r.levels[d.key])}</span>`).join('')}
          </div>
        </div>
      </div>`).join('')}</div>`;
  }

  /* ═════════════════════ 发展资源 ═════════════════════ */

  function initResources() {
    const root = $('#resource-list');
    const chips = UI.$$('#res-filter .chip');
    let cat = '全部';

    function render() {
      const data = cat === '全部' ? D.resources : D.resources.filter(r => r.cat === cat);
      if (!root) return;
      root.innerHTML = data.map((r, i) => `
        <a class="list-item" href="#/student/resource?id=${r.id}">
          <div class="li-icon">${icon(r.cat === '教研选题' ? 'bulp' : r.cat === '竞赛信息' ? 'trophy' : 'book', 19)}</div>
          <div class="li-body">
            <div class="li-title">${esc(r.title)}</div>
            <div class="li-sub">${esc(r.source)} · ${UI.fmtDate(r.at)}</div>
          </div>
          <span class="tag ghost">参考</span>
        </a>
        ${i === 2 ? `<div class="banner neutral" style="margin:12px 0">
          ${icon('info', 16)}<div>以上内容由院校或教师推荐，不构成考核要求。</div></div>` : ''}
      `).join('');
    }

    chips.forEach(c => {
      c.addEventListener('click', () => {
        chips.forEach(x => x.classList.remove('active'));
        c.classList.add('active');
        cat = c.dataset.cat;
        render();
      });
    });
    render();
  }

  function initResourceDetail() {
    const id = qs('id') || 'rs1';
    const r = D.resources.find(x => x.id === id) || D.resources[0];
    const root = $('#resource-detail');
    if (!root) return;
    const related = D.resources.filter(x => x.cat === r.cat && x.id !== r.id).slice(0, 2);

    root.innerHTML = `
      <div class="card">
        <span class="tag">${esc(r.cat)}</span>
        <div class="t-xl fw-600 lh-tight mt-12">${esc(r.title)}</div>
        <div class="t-sm c-3 mt-8">${esc(r.source)} · ${UI.fmtFull(r.at)}</div>
        <div class="divider"></div>
        <p class="t-md c-2" style="line-height:1.8">${esc(r.summary)}</p>
        <div class="tag-row mt-16"><span class="tag ghost">#${esc(r.tag)}</span></div>
      </div>
      <div class="banner">
        ${icon('info', 17)}
        <div>资源仅作参考，不强制任务。是否阅读、是否使用，完全由你决定。</div>
      </div>
      <div class="card">
        <div class="card-hd"><div><h3>同类推荐</h3></div></div>
        <div class="list">
          ${related.map(x => `
            <a class="list-item" href="#/student/resource?id=${x.id}">
              <div class="li-icon">${icon('book', 19)}</div>
              <div class="li-body"><div class="li-title">${esc(x.title)}</div>
                <div class="li-sub">${esc(x.source)}</div></div>
              <span class="chev">${icon('chev', 16)}</span>
            </a>`).join('')}
        </div>
      </div>`;
  }

  /* ═════════════════════ 自我反思 ═════════════════════ */

  function initReflection() {
    const R = D.reflection;
    const map = {
      brief: 'brief', motivation: 'motivation', thinking: 'thinking',
      character: 'character', practice: 'practice', plan: 'plan'
    };
    Object.keys(map).forEach(k => {
      const el = document.getElementById('rf-' + k);
      if (el) {
        el.value = R[k] || '';
        updateCount(el);
      }
    });

    function updateCount(el) {
      const c = document.getElementById('cnt-' + el.id.slice(3));
      if (c) c.textContent = el.value.length + ' 字';
    }

    UI.$$('.textarea').forEach(el => {
      el.addEventListener('input', () => {
        updateCount(el);
        const s = $('#save-state');
        if (s) {
          const now = new Date();
          s.textContent = `已自动保存 ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
        }
      });
    });

    const btn = $('#save-reflection');
    if (btn) {
      btn.addEventListener('click', () => {
        UI.toast('反思已保存到你的成长记录');
      });
    }
  }

  /* ═════════════════════ 我的 ═════════════════════ */

  function initMe() {
    const st = model.student('s1');
    const root = $('#me-card');
    if (root) {
      root.innerHTML = `
        <div class="row gap-12">
          ${UI.avatar(st, 'lg')}
          <div class="grow">
            <div class="t-lg fw-600">${esc(st.name)}</div>
            <div class="t-sm c-3 mt-8">${esc(model.klass(st.classId).name)}</div>
            <div class="t-xs c-4 mono mt-8">${esc(st.no)}</div>
          </div>
        </div>`;
    }
  }

  /* ═════════════════════ 教师首页 ═════════════════════ */

  function initTeacherHome() {
    const pending = D.materials.filter(m => m.status === 'submitted');
    const done = D.materials.filter(m => m.status === 'reviewed');
    const s = $('#t-stats');
    if (s) {
      s.innerHTML = [
        UI.stat(pending.length, '份', '待研判'),
        UI.stat(done.length, '份', '已研判'),
        UI.stat(D.classes.length, '个', '带班')
      ].join('');
    }
    const t = $('#t-today');
    if (t) {
      t.innerHTML = pending
        .slice()
        .sort((a, b) => (a.at < b.at ? 1 : -1))
        .slice(0, 5)
        .map(m => {
        const st = model.student(m.sid);
        return `<a class="list-item" href="#/teacher/workbench?id=${m.id}">
          <div class="li-icon">${icon(UI.typeIcon(m.type), 19)}</div>
          <div class="li-body">
            <div class="li-title">${esc(st.name)} · ${esc(m.title)}</div>
            <div class="li-sub">${esc(m.type)} · ${UI.fmtDate(m.at)}</div>
          </div>
          <span class="chev">${icon('chev', 16)}</span>
        </a>`;
      }).join('');
    }
  }

  /* ═════════════════════ 材料查阅与标签辅助 ═════════════════════ */

  function initTeacherMaterials() {
    const cards = $('#m-cards');
    const clsSel = $('#f-class');
    const stuSel = $('#f-student');
    const typeSel = $('#f-type');
    const statSel = $('#f-status');
    const countEl = $('#m-count');
    let rows = D.materials.slice();

    function updateCount() {
      if (!countEl) return;
      const reviewed = rows.filter(m => m.status === 'reviewed').length;
      countEl.innerHTML = `已查阅学生材料：<b class="c-2">${reviewed}</b> 份 ｜ 待研判学生材料：<b class="c-2">${rows.length - reviewed}</b> 份`;
    }

    function render() {
      const cid = clsSel ? clsSel.value : '';
      const sid = stuSel ? stuSel.value : '';
      const type = typeSel ? typeSel.value : '';
      const status = statSel ? statSel.value : '';

      const data = rows.filter(m => {
        const st = model.student(m.sid);
        if (cid && st.classId !== cid) return false;
        if (sid && m.sid !== sid) return false;
        if (type && m.type !== type) return false;
        if (status && m.status !== status) return false;
        return true;
      });

      if (!cards) return;
      if (!data.length) {
        cards.innerHTML = UI.emptyState('search', '没有符合条件的材料', '换个筛选条件试试。');
      } else {
        cards.innerHTML = data.map(m => {
          const st = model.student(m.sid);
          return `<div class="list-item">
            ${UI.avatar(st, 'sm')}
            <div class="li-body">
              <div class="li-title">${esc(m.title)}</div>
              <div class="li-sub">${esc(st.name)} · ${esc(m.type)} · ${UI.fmtFull(m.at)}</div>
              <div class="tag-row" style="margin-top:8px">
                ${m.tags.slice(0, 3).map(t => UI.tagChip(t)).join('')}
                ${m.custom.length ? `<span class="tag ghost">+${m.custom.length} 备注</span>` : ''}
                ${!m.tags.length ? '<span class="t-xs c-4">待标注</span>' : ''}
              </div>
            </div>
            <div style="display:flex;flex-direction:column;align-items:flex-end;gap:8px">
              ${UI.statusTag(m.status)}
              <a class="btn btn-soft btn-xs" href="#/teacher/workbench?id=${m.id}">研判</a>
            </div>
          </div>`;
        }).join('');
      }
      updateCount();
    }

    [clsSel, stuSel, typeSel, statSel].forEach(el => {
      if (el) el.addEventListener('change', render);
    });

    // 学生下拉随班级联动
    if (clsSel && stuSel) {
      clsSel.addEventListener('change', () => {
        const cid = clsSel.value;
        const list = cid ? D.students.filter(s => s.classId === cid) : D.students;
        stuSel.innerHTML = `<option value="">全部学生</option>` +
          list.map(s => `<option value="${s.id}">${esc(s.name)}</option>`).join('');
      });
    }

    render();
  }

  /* ═════════════════════ 研判工作台 ═════════════════════ */

  function initWorkbench() {
    const id = qs('id') || 'm1';
    const m = D.materials.find(x => x.id === id) || D.materials[0];
    const st = model.student(m.sid);
    const root = $('#wb-body');
    if (!root) return;

    let selected = m.tags.slice();
    let custom = m.custom.slice();

    function tagPanel() {
      return DIMS.map(d => `
        <div class="mt-16">
          <div class="row gap-6 t-xs c-3" style="margin-bottom:8px">
            <span class="dim-dot dim-${d.key}"></span>${esc(d.name)}
          </div>
          <div class="tag-row">
            ${model.dimTags(d.key).map(t => `
              <button class="chip ${selected.indexOf(t.id) > -1 ? 'active' : ''}" data-tag="${t.id}">${esc(t.name)}</button>
            `).join('')}
          </div>
        </div>`).join('');
    }

    function render() {
      root.innerHTML = `
        <div class="card">
          <div class="row" style="align-items:flex-start">
            <div class="li-icon" style="width:44px;height:44px;border-radius:13px">${icon(UI.typeIcon(m.type), 21)}</div>
            <div class="grow">
              <div class="t-md fw-600">${esc(m.title)}</div>
              <div class="t-xs c-3 mt-8">${esc(st.name)} · ${esc(m.type)} · ${UI.fmtDate(m.at)}</div>
            </div>
          </div>
          <div class="divider"></div>
          <div class="t-xs c-3" style="line-height:1.7">${esc(m.summary || '（未填写说明）')}</div>
          <div class="row-between mt-16 t-xs c-4">
            <span class="row gap-6">${icon('file', 14)}${esc(m.file)}</span>
            <span class="mono">${esc(m.size)}</span>
          </div>
        </div>

        <div class="banner warn">
          ${icon('alert', 17)}
          <div><b>本平台不提供打分功能</b>，禁止直接评定单一量化分数，无分数录入入口。</div>
        </div>

        <div class="card">
          <div class="card-hd"><div><h3>四维指标标签</h3><p>官方标签参与画像聚合；备注标签仅供个人查阅</p></div></div>
          ${tagPanel()}
          <div class="divider"></div>
          <div class="t-xs c-3" style="margin-bottom:8px">备注标签（不参与聚合）</div>
          <div class="tag-row" id="wb-custom">
            ${custom.map(c => `<span class="tag ghost">${esc(c)}</span>`).join('')}
          </div>
          <div class="row gap-6 mt-12">
            <input class="input" id="wb-custom-input" placeholder="输入备注标签后回车" style="padding:8px 12px;font-size:13px">
          </div>
        </div>

        <div class="card">
          <div class="field">
            <label>质性评语 <span class="hint">必填，建议 80–300 字</span></label>
            <textarea class="textarea" id="wb-comment" placeholder="描述你观察到的变化与具体证据">${esc(m.status === 'reviewed' ? (model.reviewsOf(m.sid)[0] || {}).comment || '' : '')}</textarea>
          </div>
          <div class="mt-16 field">
            <label>发展改进建议</label>
            <textarea class="textarea" id="wb-suggest" placeholder="给出一条具体、可执行的下一步建议">${esc(m.status === 'reviewed' ? (model.reviewsOf(m.sid)[0] || {}).suggestion || '' : '')}</textarea>
          </div>
        </div>

        <button class="btn btn-primary btn-block" id="wb-save">保存研判</button>
        <div class="footnote">保存后学生可在「我的反馈」里看到。</div>
      `;

      UI.$$('#wb-body [data-tag]').forEach(b => {
        b.addEventListener('click', () => {
          const t = b.dataset.tag;
          const i = selected.indexOf(t);
          if (i > -1) selected.splice(i, 1); else selected.push(t);
          b.classList.toggle('active');
        });
      });

      const inp = $('#wb-custom-input');
      if (inp) {
        inp.addEventListener('keydown', e => {
          if (e.key === 'Enter' && inp.value.trim()) {
            custom.push(inp.value.trim());
            inp.value = '';
            const box = $('#wb-custom');
            box.innerHTML = custom.map(c => `<span class="tag ghost">${esc(c)}</span>`).join('');
          }
        });
      }

      const save = $('#wb-save');
      if (save) {
        save.addEventListener('click', () => {
          const c = $('#wb-comment').value.trim();
          const s = $('#wb-suggest').value.trim();
          if (!c) { UI.toast('请先填写质性评语'); return; }
          m.status = 'reviewed';
          UI.toast('已保存，学生端能看到这条反馈');
          setTimeout(() => { location.hash = '#/teacher/materials'; }, 900);
        });
      }
    }

    render();
  }

  /* ═════════════════════ 多元研判与反馈输出 ═════════════════════ */

  function initReview() {
    const root = $('#review-body');
    if (!root) return;

    let sid = qs('sid') || 's1';

    function render() {
      const st = model.student(sid);
      const mats = model.materialsOf(sid);

      root.innerHTML = `
        <div class="card">
          <div class="field">
            <label>选择学生 <span class="hint">这份反馈写给谁</span></label>
            <select class="input" id="rv-student">
              ${D.students.map(s => `<option value="${s.id}"${s.id === sid ? ' selected' : ''}>${esc(s.name)} · ${esc(model.klass(s.classId).name)}</option>`).join('')}
            </select>
          </div>
          <div class="t-xs c-3 mt-12">${esc(st.name)} 已提交 ${mats.length} 份材料</div>
        </div>

        <div class="banner warn">
          ${icon('shield', 17)}
          <div><b>本平台不提供打分功能。</b>禁止直接评定单一量化分数，也没有分数录入入口。</div>
        </div>

        <div class="card">
          <div class="field">
            <label>质性评语 <span class="hint">必填</span></label>
            <textarea class="textarea" id="rv-comment" placeholder="描述你观察到的具体变化，尽量指向材料中的证据"></textarea>
          </div>
          <div class="mt-16 field">
            <label>发展改进建议 <span class="hint">必填</span></label>
            <textarea class="textarea" id="rv-suggest" placeholder="给出一条具体、可执行的下一步建议"></textarea>
          </div>
        </div>

        <div class="card">
          <div class="card-hd"><div><h3>四维证据等级确认</h3><p>确认的是「证据充分程度」，不是能力评定</p></div></div>
          <div class="stack">
            ${DIMS.map(d => `
              <div class="row-between">
                <span class="row gap-6 t-sm c-2"><span class="dim-dot dim-${d.key}"></span>${esc(d.short)}</span>
                <select class="input" id="lv-${d.key}" style="width:132px;padding:7px 10px;font-size:13px">
                  ${LEVELS.map(l => `<option value="${l.v}">${l.name}</option>`).join('')}
                </select>
              </div>`).join('')}
          </div>
          <div class="footnote" style="text-align:left;padding:12px 0 0">
            等级只表示材料证据的多少，不换算成分数。
          </div>
        </div>

        <div class="card">
          <div class="card-hd"><div><h3>选择材料进行研判</h3><p>可选，勾选后反馈会关联到这些材料</p></div></div>
          <div class="list">
            ${mats.map(m => `
              <label class="list-item" style="padding:9px 2px;cursor:pointer">
                <input type="checkbox" style="width:16px;height:16px;accent-color:#3e6ba6">
                <div class="li-body"><div class="t-sm">${esc(m.title)}</div></div>
              </label>`).join('')}
          </div>
        </div>

        <button class="btn btn-primary btn-block" id="rv-save">提交反馈</button>
        <div class="footnote">
          <span class="row gap-6" style="justify-content:center">${icon('lock', 14)} 学生端只能看到评语、建议和等级文字</span>
        </div>
      `;

      $('#rv-student').addEventListener('change', ev => {
        sid = ev.target.value;
        render();
      });

      $('#rv-save').addEventListener('click', () => {
        const c = $('#rv-comment').value.trim();
        const s = $('#rv-suggest').value.trim();
        if (!c || !s) { UI.toast('请完整填写评语与建议'); return; }
        UI.toast('反馈已提交，学生端立即可见');
      });
    }

    render();
  }

  /* ═════════════════════ 教师看学生画像 ═════════════════════ */

  function initTeacherPortrait() {
    const sid = qs('sid') || 's1';
    const st = model.student(sid);
    const p = model.portrait(sid);
    const revs = model.reviewsOf(sid);

    const head = $('#tp-head');
    if (head) {
      head.innerHTML = `<div class="row gap-12">
        ${UI.avatar(st)}
        <div class="grow">
          <div class="t-md fw-600">${esc(st.name)}</div>
          <div class="t-sm c-3 mt-8">${esc(model.klass(st.classId).name)} · ${esc(st.no)}</div>
        </div>
        <a class="btn btn-soft btn-sm" href="#/teacher/review?sid=${sid}">撰写研判</a>
      </div>`;
    }

    const radar = $('#tp-radar');
    if (radar) {
      const confirmed = revs.length ? DIMS.map(d => revs[0].levels[d.key]) : null;
      radar.innerHTML = UI.radarSVG(p.dims.map(d => d.level), confirmed ? { confirmed: confirmed } : {});
    }

    const leg = $('#tp-legend');
    if (leg) {
      leg.innerHTML = UI.legend([
        { color: '#3e6ba6', label: '系统归纳（证据覆盖）' },
        { color: '#b8792e', label: '教师确认等级' }
      ]);
    }

    const hist = $('#tp-history');
    if (hist) {
      hist.innerHTML = revs.length
        ? revs.map(r => `<div class="list-item">
            <div class="li-icon">${icon('message', 18)}</div>
            <div class="li-body">
              <div class="li-title">${UI.fmtFull(r.at)} 的反馈</div>
              <div class="li-sub" style="white-space:normal;line-height:1.6">${esc(r.comment.slice(0, 42))}…</div>
            </div>
          </div>`).join('')
        : UI.emptyState('message', '尚无研判记录', '这位学生还没有收到教师反馈。');
    }
  }

  /* ═════════════════════ 群体统计 ═════════════════════ */

  function initStats() {
    const seg = UI.$$('#cls-seg button');
    const root = $('#stats-body');
    let cid = 'c1';

    function render() {
      const s = model.classStats(cid);
      const kl = model.klass(cid);
      if (!root) return;

      const tooSmall = s.total < 10;

      // 短板：level0 人数最多的维度
      let weakDim = DIMS[0], weakCount = -1;
      DIMS.forEach(d => {
        const c = s.levelDist[d.key][0];
        if (c > weakCount) { weakCount = c; weakDim = d; }
      });

      root.innerHTML = `
        <div class="row-between">
          <div>
            <div class="t-lg fw-600">${esc(kl.name)}</div>
            <div class="t-xs c-3 mt-8">${s.total} 名学生 · 仅做群体分析，不展示个人排名</div>
          </div>
        </div>

        <div class="stat-grid mt-16">
          ${UI.stat(s.rate, '%', '参与率')}
          ${UI.stat(s.perCapita, '份', '人均材料')}
          ${UI.stat(s.reviewedRate, '%', '已研判率')}
        </div>

        <div class="card chart-card mt-16">
          <div class="card-hd"><div><h3>材料类型分布</h3><p>全班提交的材料构成</p></div></div>
          <div class="row" style="justify-content:center">
            ${UI.donutSVG(D.materialTypes.map(t => ({ label: t, value: s.byType[t] || 0 })), { centerLabel: '份材料' })}
          </div>
          ${UI.legend(D.materialTypes.map((t, i) => ({
            color: ['#3e6ba6', '#6f96c9', '#a9c3e3', '#cfdcea', '#b08850'][i], label: t
          })))}
        </div>

        ${tooSmall ? `
          <div class="card mt-16">
            ${UI.emptyState('shield', '样本量不足，暂不展示分组分析',
              '该班共 ' + s.total + ' 人，少于 10 人时分组数据可能反推出个人，出于隐私保护此处不展示四维分布。')}
          </div>` : `
          <div class="card chart-card mt-16">
            <div class="card-hd"><div><h3>四维证据分布</h3><p>每个维度的四档人数占比</p></div></div>
            <div class="donut-grid">
              ${DIMS.map(d => `
                <div class="donut-cell">
                  <div class="donut-name">${esc(d.short)}</div>
                  ${UI.donutSVG(
                    LEVELS.map((l, i) => ({ label: l.name, value: s.levelDist[d.key][i], color: UI.LEVEL_COLORS[i] })),
                    { centerText: s.total, centerLabel: '人', maxW: '124px' }
                  )}
                </div>`).join('')}
            </div>
            ${UI.legend(LEVELS.map((l, i) => ({ color: UI.LEVEL_COLORS[i], label: l.name })))}
          </div>`}

        <div class="card mt-16">
          <div class="card-hd"><div><h3>培养短板提示</h3><p>供课堂与实习指导参考</p></div></div>
          <div class="banner">
            ${icon('bulp', 17)}
            <div>本班「<b>${esc(weakDim.name)}</b>」的证据最少，${weakCount} 人还是「待积累」。
              实习复盘时可以把这块留出一点时间。</div>
          </div>
          <div class="footnote" style="text-align:left;padding:12px 0 0">
            仅做班级群体数据分析，不展示学生个人排名，也不用于任何评比。
          </div>
        </div>
      `;
    }

    seg.forEach(b => {
      b.addEventListener('click', () => {
        seg.forEach(x => x.classList.remove('active'));
        b.classList.add('active');
        cid = b.dataset.cid;
        render();
      });
    });
    render();
  }

  /* ═════════════════════ 院校首页 ═════════════════════ */

  function initAdminHome() {
    const s = $('#a-stats');
    if (!s) return;
    const all = model.classStats('c1');
    const all2 = model.classStats('c2');
    const totalStudents = D.students.length;
    const totalMaterials = D.materials.length;
    const submitters = new Set(D.materials.map(m => m.sid)).size;
    s.innerHTML = [
      UI.stat(totalStudents, '人', '在库学生'),
      UI.stat(totalMaterials, '份', '成长材料'),
      UI.stat(Math.round(submitters / totalStudents * 100), '%', '材料覆盖率')
    ].join('');
  }

  /* ═════════════════════ 指标库 ═════════════════════ */

  function initAdminTags() {
    const root = $('#tag-lib');
    if (!root) return;
    let extra = [];
    let cid = 'c1';

    function render() {
      const kl = model.klass(cid);
      root.innerHTML = `
        <div class="card card-soft">
          <div class="t-xs c-3">当前指标库</div>
          <div class="t-lg fw-600 mt-8">${esc(kl.name)} · 师范生创新能力指标库</div>
          <div class="t-xs c-3 mt-8">面向师范生培养目标：课堂实践、教学反思、教研协作</div>
          <div class="seg mt-16" id="tag-cls">
            ${D.classes.map(c => `<button class="${c.id === cid ? 'active' : ''}" data-cid="${c.id}">${esc(c.name)}</button>`).join('')}
          </div>
        </div>
        ${DIMS.map(d => {
          const tags = model.dimTags(d.key);
          return `<div class="card mt-16">
            <div class="card-hd">
              <div class="row gap-6">
                <span class="dim-dot dim-${d.key}" style="width:8px;height:8px"></span>
                <div><h3>${esc(d.name)}</h3><p>${esc(d.desc)}</p></div>
              </div>
              <span class="t-xs c-4">${tags.length} 个标签</span>
            </div>
            <div class="tag-row">
              ${tags.map(t => `
                <span class="tag" style="padding-right:6px">
                  ${esc(t.name)}
                  <button class="t-xs c-4" style="margin-left:4px;padding:0 2px" title="停用" onclick="UI.toast('已停用，历史材料不受影响')">×</button>
                </span>`).join('')}
              ${extra.filter(x => x.dim === d.key).map(x => `
                <span class="tag" style="background:#fff;border:1px dashed var(--primary)">${esc(x.name)}</span>`).join('')}
            </div>
            <div class="row gap-6 mt-12">
              <input class="input" placeholder="新增标签…" style="padding:8px 12px;font-size:13px"
                onkeydown="if(event.key==='Enter'&&this.value.trim()){window.__addTag('${d.key}',this.value.trim())}">
            </div>
          </div>`;
        }).join('')}
      `;

      UI.$$('#tag-cls button').forEach(b => {
        b.addEventListener('click', () => {
          cid = b.dataset.cid;
          render();
        });
      });
    }

    window.__addTag = function (dim, name) {
      extra.push({ dim, name });
      render();
      UI.toast('已新增标签：' + name);
    };

    render();
  }

  /* ═════════════════════ 规则管理 ═════════════════════ */

  function initAdminRules() {
    UI.$$('.switch').forEach(sw => {
      sw.addEventListener('click', () => sw.classList.toggle('on'));
    });
  }

  /* ═════════════════════ 群体质量报告 ═════════════════════ */

  function initReport() {
    const root = $('#report-body');
    if (!root) return;

    const cls = D.classes.map(c => ({ meta: c, stats: model.classStats(c.id) }));
    const byType = {};
    D.materialTypes.forEach(t => { byType[t] = D.materials.filter(m => m.type === t).length; });

    const allDist = {};
    DIMS.forEach(d => {
      const arr = [0, 0, 0, 0];
      D.students.forEach(s => { arr[model.coverage(s.id)[d.key].level] += 1; });
      allDist[d.key] = arr;
    });

    const majors = [
      { label: '小学教育', value: 82 },
      { label: '学前教育', value: 71 },
      { label: '特殊教育', value: 64 }
    ];

    root.innerHTML = `
      <div class="row-between">
        <div>
          <div class="t-lg fw-600">2023 级师范生创新实践概览</div>
          <div class="t-xs c-3 mt-8">统计周期：2026-2027 学年第一学期</div>
        </div>
        <span class="tag">聚合数据</span>
      </div>

      <div class="card chart-card mt-16">
        <div class="card-hd"><div><h3>班级参与率</h3><p>按班级统计，不含个人</p></div></div>
        <div class="donut-grid">
          ${cls.map(item => `
            <div class="donut-cell">
              <div class="donut-name">${esc(item.meta.name)}</div>
              ${UI.donutSVG([
                { label: '已提交', value: item.stats.submitters, color: '#3e6ba6' },
                { label: '未提交', value: item.stats.total - item.stats.submitters, color: '#e2e8f1' }
              ], { centerText: item.stats.rate + '%', centerLabel: '参与率', maxW: '132px' })}
            </div>`).join('')}
        </div>
        ${UI.legend([
          { color: '#3e6ba6', label: '已提交' },
          { color: '#e2e8f1', label: '未提交' }
        ])}
      </div>

      <div class="card chart-card mt-16">
        <div class="card-hd"><div><h3>四维证据分布</h3><p>全院四档人数占比</p></div></div>
        <div class="donut-grid">
          ${DIMS.map(d => `
            <div class="donut-cell">
              <div class="donut-name">${esc(d.short)}</div>
              ${UI.donutSVG(
                LEVELS.map((l, i) => ({ label: l.name, value: allDist[d.key][i], color: UI.LEVEL_COLORS[i] })),
                { centerText: D.students.length, centerLabel: '人', maxW: '124px' }
              )}
            </div>`).join('')}
        </div>
        ${UI.legend(LEVELS.map((l, i) => ({ color: UI.LEVEL_COLORS[i], label: l.name })))}
      </div>

      <div class="card chart-card mt-16">
        <div class="card-hd"><div><h3>材料类型构成</h3><p>全院材料分布</p></div></div>
        <div class="row" style="justify-content:center">
          ${UI.donutSVG(D.materialTypes.map(t => ({ label: t, value: byType[t] })), { centerLabel: '份材料' })}
        </div>
        ${UI.legend(D.materialTypes.map((t, i) => ({
          color: ['#3e6ba6', '#6f96c9', '#a9c3e3', '#cfdcea', '#b08850'][i], label: t
        })))}
      </div>

      <div class="card chart-card mt-16">
        <div class="card-hd"><div><h3>专业方向对比</h3><p>参与率示意</p></div></div>
        ${UI.hBarSVG(majors)}
      </div>

      <div class="card mt-16">
        <div class="card-hd"><div><h3>培养短板提示</h3></div></div>
        <div class="banner">
          ${icon('bulp', 17)}
          <div>「创新精神与品格」的证据偏少，实习指导时可以多关注失败复盘。
            「教学与教育实践创新」的材料类型太集中，可以鼓励学生多交课堂实录。</div>
        </div>
      </div>

      <button class="btn btn-primary btn-block mt-24" onclick="UI.toast('正式版将导出带声明页脚的报告')">
        ${icon('download', 17)} 导出 PDF 报告
      </button>
      <div class="footnote">
        本报告用于人才培养方案修订与课程改革，不用于学生个体排名筛选。
      </div>`;
  }

  /* ═════════════════════ 导出 ═════════════════════ */

  window.Pages = {
    'splash': initSplash,
    'qr': function () { const el = $('#qr-slot'); if (el) el.innerHTML = qrSVG(); },
    'student-home': initStudentHome,
    'student-portfolio': initPortfolio,
    'student-material': initMaterial,
    'student-portrait': initPortrait,
    'student-feedback': initFeedback,
    'student-resources': initResources,
    'student-resource': initResourceDetail,
    'student-reflection': initReflection,
    'student-me': initMe,
    'teacher-home': initTeacherHome,
    'teacher-materials': initTeacherMaterials,
    'teacher-workbench': initWorkbench,
    'teacher-review': initReview,
    'teacher-portrait': initTeacherPortrait,
    'teacher-stats': initStats,
    'admin-home': initAdminHome,
    'admin-tags': initAdminTags,
    'admin-rules': initAdminRules,
    'admin-report': initReport
  };
})();
