/* =====================================================================
   mock 数据（演示原型专用）
   约定：普通脚本，全局挂载 window.MOCK / window.DIMENSIONS / window.LEVELS
   任何页面直接双击打开即可读取，不依赖 fetch。
   ===================================================================== */

window.DIMENSIONS = [
  { key: 'motivation', name: '创新意识与动机', short: '意识与动机', ask: '想不想',
    desc: '主动提出改变教学的内在驱动', color: 'var(--dim-motivation)' },
  { key: 'thinking', name: '创新思维与方法', short: '思维与方法', ask: '会不会想',
    desc: '发现问题、设计方案并迭代的思维过程', color: 'var(--dim-thinking)' },
  { key: 'character', name: '创新精神与品格', short: '精神与品格', ask: '扛不扛得住',
    desc: '面对失败的坚持与协作开放', color: 'var(--dim-character)' },
  { key: 'practice', name: '教学与教育实践创新', short: '教育实践创新', ask: '做没做成',
    desc: '创新在真实课堂中的落地与效果', color: 'var(--dim-practice)' }
];

/* 四档：表示「证据充分度」，不是能力评分 */
window.LEVELS = [
  { v: 0, name: '待积累', desc: '该维度暂无材料证据' },
  { v: 1, name: '初显', desc: '有零星材料或标签' },
  { v: 2, name: '稳定', desc: '材料覆盖两类以上' },
  { v: 3, name: '成熟', desc: '多类材料并有教师研判' }
];

window.MOCK = {
  teacher: { id: 't1', name: '王丽', title: '副教授 · 指导教师', short: '王' },

  classes: [
    { id: 'c1', name: '小学教育 2023 级 1 班', grade: '2023 级', major: '小学教育' },
    { id: 'c2', name: '小学教育 2023 级 2 班', grade: '2023 级', major: '小学教育' }
  ],

  students: [
    { id: 's1',  name: '李华', no: '2023010112', classId: 'c1', avatar: '李' },
    { id: 's2',  name: '张三', no: '2023010118', classId: 'c1', avatar: '张' },
    { id: 's3',  name: '王五', no: '2023010123', classId: 'c1', avatar: '王' },
    { id: 's4',  name: '赵六', no: '2023010131', classId: 'c1', avatar: '赵' },
    { id: 's5',  name: '陈明', no: '2023010136', classId: 'c1', avatar: '陈' },
    { id: 's6',  name: '刘洋', no: '2023010141', classId: 'c1', avatar: '刘' },
    { id: 's7',  name: '杨光', no: '2023010207', classId: 'c2', avatar: '杨' },
    { id: 's8',  name: '周涛', no: '2023010212', classId: 'c2', avatar: '周' },
    { id: 's9',  name: '吴静', no: '2023010219', classId: 'c2', avatar: '吴' },
    { id: 's10', name: '郑强', no: '2023010225', classId: 'c2', avatar: '郑' },
    { id: 's11', name: '孙丽', no: '2023010230', classId: 'c2', avatar: '孙' },
    { id: 's12', name: '马超', no: '2023010234', classId: 'c2', avatar: '马' },
    /* 1 班补足 10 人：仅用于群体统计的班级规模，尚未提交材料 */
    { id: 's13', name: '朱琳', no: '2023010146', classId: 'c1', avatar: '朱' },
    { id: 's14', name: '胡军', no: '2023010149', classId: 'c1', avatar: '胡' },
    { id: 's15', name: '高鹏', no: '2023010152', classId: 'c1', avatar: '高' },
    { id: 's16', name: '何敏', no: '2023010155', classId: 'c1', avatar: '何' }
  ],

  /* 四维指标标签：平台只保留这四个 */
  tags: [
    { id: 'motivation', name: '创新意识与动机', short: '意识与动机', dim: 'motivation' },
    { id: 'thinking',   name: '创新思维与方法', short: '思维与方法', dim: 'thinking' },
    { id: 'character',  name: '创新精神与品格', short: '精神与品格', dim: 'character' },
    { id: 'practice',   name: '教学与教育实践创新', short: '实践创新', dim: 'practice' }
  ],

  /* 材料类型 */
  materialTypes: ['教学设计方案', '教学设计方案修改', '实习反思', '教研记录', '教学实践材料'],

  /* 教师备注标签：不参与画像聚合 */
  customTags: ['公开课磨课', '板书设计', '情境导入', '单元整体设计', '学情分析', '家校沟通'],

  materials: [
    { id: 'm1',  sid: 's1', type: '教学设计方案',     title: '《分数的初步认识》教学设计方案', at: '2026-09-18', file: '分数的初步认识-教学设计.pdf', size: '1.2 MB', tags: ['motivation','thinking','practice'], custom: [], status: 'reviewed',
      summary: '以「分一分」的真实情境导入，尝试让学生先操作再命名分数，改变原先「先讲定义再练习」的顺序。' },
    { id: 'm2',  sid: 's1', type: '教学设计方案修改', title: '《分数的初步认识》二稿：增加学情前测', at: '2026-09-25', file: '分数的初步认识-二稿.pdf', size: '1.3 MB', tags: ['thinking'], custom: ['公开课磨课','学情分析'], status: 'reviewed',
      summary: '组内试讲后发现学生对「平均分」理解不牢，二稿增加 5 分钟前测与错例对比环节。' },
    { id: 'm3',  sid: 's1', type: '实习反思',         title: '第一次上讲台的三个意外',   at: '2026-10-09', file: '实习反思-第一次上讲台.docx', size: '86 KB', tags: ['character','motivation'], custom: [], status: 'reviewed',
      summary: '原以为学生会被操作材料吸引，实际出现了抢材料、听不懂指令两个问题；记录了三条改进措施。' },
    { id: 'm4',  sid: 's1', type: '教研记录',         title: '单元整体教学的组内研讨纪要', at: '2026-10-16', file: '教研记录-单元整体教学.docx', size: '64 KB', tags: ['character','thinking'], custom: ['单元整体设计'], status: 'reviewed',
      summary: '与同组三位同学共同梳理「分数的意义」单元脉络，提出了两个跨学科整合点。' },
    { id: 'm5',  sid: 's1', type: '教学实践材料',     title: '小组合作学习的课堂实录片段', at: '2026-10-23', file: '课堂实录-合作学习.mp4', size: '18.4 MB', tags: ['practice','motivation'], custom: ['板书设计'], status: 'reviewed',
      summary: '把全班统一提问改成分层任务卡，记录了三组学生的不同完成路径。' },
    { id: 'm6',  sid: 's1', type: '教学实践材料',     title: '数学绘本阅读活动设计方案', at: '2026-10-30', file: '数学绘本活动方案.pdf', size: '2.1 MB', tags: ['practice','motivation'], custom: [], status: 'reviewed',
      summary: '用《谁偷了包子》绘本串起分数比较，设计了一个可课后延伸的阅读任务单。' },

    { id: 'm7',  sid: 's2', type: '教学设计方案',     title: '《认识时间》教学设计方案', at: '2026-09-20', file: '认识时间-教学设计.pdf', size: '980 KB', tags: ['motivation'], custom: [], status: 'reviewed',
      summary: '尝试用「一天的时间轴」替代直接讲钟面，先让学生画出自己的作息。' },
    { id: 'm8',  sid: 's2', type: '教学设计方案修改', title: '《认识时间》二稿', at: '2026-09-28', file: '认识时间-二稿.pdf', size: '1.0 MB', tags: ['thinking'], custom: [], status: 'reviewed',
      summary: '第一稿时间轴耗时过长，二稿把它拆成课前与课中各一段。' },
    { id: 'm9',  sid: 's2', type: '实习反思',         title: '被学生问住的那节课', at: '2026-10-11', file: '实习反思-被问住的课.docx', size: '72 KB', tags: ['motivation'], custom: [], status: 'reviewed',
      summary: '学生问「为什么分针走一圈时针才走一格」，当时没能给出直观解释，课后向指导教师请教。' },
    { id: 'm10', sid: 's2', type: '教学实践材料',     title: '钟面模型制作活动记录', at: '2026-10-25', file: '钟面模型活动记录.pdf', size: '1.6 MB', tags: [], custom: [], status: 'submitted',
      summary: '组织学生用纸盘自制钟面模型，尚未整理成完整材料。' },

    { id: 'm11', sid: 's3', type: '教学设计方案',     title: '《圆的认识》教学设计方案', at: '2026-09-22', file: '圆的认识-教学设计.pdf', size: '1.1 MB', tags: ['motivation','thinking'], custom: [], status: 'reviewed',
      summary: '以「为什么车轮是圆的」为驱动问题，设计了三轮探究活动。' },
    { id: 'm12', sid: 's3', type: '实习反思',         title: '探究活动的节奏控制', at: '2026-10-14', file: '实习反思-节奏控制.docx', size: '68 KB', tags: ['character'], custom: [], status: 'reviewed',
      summary: '探究环节超时 12 分钟，反思了任务单颗粒度与巡视路线的问题。' },
    { id: 'm13', sid: 's3', type: '教学实践材料',     title: '圆规使用微课', at: '2026-10-28', file: '圆规使用微课.mp4', size: '24.2 MB', tags: [], custom: [], status: 'submitted',
      summary: '准备了一段 3 分钟的圆规使用示范，尚未提交说明文档。' },

    { id: 'm14', sid: 's4', type: '教学设计方案',     title: '《童年的水墨画》教学设计方案', at: '2026-09-19', file: '童年的水墨画-教学设计.pdf', size: '1.0 MB', tags: ['thinking','practice'], custom: [], status: 'reviewed',
      summary: '用自己的水墨小样做导入，把诗的意境与画面直接连起来。' },
    { id: 'm15', sid: 's4', type: '教学实践材料',     title: '诗配画创作活动记录', at: '2026-10-20', file: '诗配画活动记录.pdf', size: '2.8 MB', tags: ['practice'], custom: [], status: 'reviewed',
      summary: '让学生为诗句配画，用「画面是否说清了这句诗」替代传统默写检查。' },
    { id: 'm16', sid: 's4', type: '教研记录',         title: '语文组磨课纪要', at: '2026-10-08', file: '语文组磨课纪要.docx', size: '52 KB', tags: ['character'], custom: [], status: 'reviewed',
      summary: '记录组内对导入环节的三条修改意见，已纳入二稿。' },

    { id: 'm17', sid: 's5', type: '教学设计方案',     title: '《植物的一生》教学设计方案', at: '2026-09-26', file: '植物的一生-教学设计.pdf', size: '1.4 MB', tags: ['motivation','thinking'], custom: [], status: 'reviewed',
      summary: '发现学生对「种子发芽需要什么」存在大量前概念，据此重排了探究顺序。' },
    { id: 'm18', sid: 's5', type: '教学设计方案修改', title: '《植物的一生》二稿：增加对照实验', at: '2026-10-10', file: '植物的一生-二稿.pdf', size: '1.5 MB', tags: ['thinking'], custom: [], status: 'reviewed',
      summary: '把原本的观察活动改成两组对照，让学生自己判断变量。' },
    { id: 'm19', sid: 's5', type: '实习反思',         title: '实验材料准备的那一周', at: '2026-10-18', file: '实习反思-材料准备.docx', size: '64 KB', tags: ['character'], custom: [], status: 'reviewed',
      summary: '连续三天材料发芽失败，记录了排查过程与最后的解决方案。' },
    { id: 'm20', sid: 's5', type: '教学实践材料',     title: '种植角观察记录表', at: '2026-10-27', file: '种植角观察记录.pdf', size: '1.2 MB', tags: ['practice'], custom: [], status: 'submitted',
      summary: '设计了为期两周的观察记录表，学生每日填写。' },

    { id: 'm21', sid: 's6', type: '教学设计方案',     title: '《认识钟表》教学设计方案', at: '2026-09-24', file: '认识钟表-教学设计.pdf', size: '900 KB', tags: ['motivation'], custom: [], status: 'submitted',
      summary: '引入「没有钟表的一天」情境，但活动设计还不完整。' },
    { id: 'm22', sid: 's6', type: '教学实践材料',     title: '课堂教具照片与说明', at: '2026-10-22', file: '教具照片.zip', size: '6.4 MB', tags: ['practice'], custom: [], status: 'submitted',
      summary: '自制了一套可转动的大钟面教具。' },

    { id: 'm23', sid: 's7', type: '教学设计方案',     title: '《乌鸦喝水》教学设计方案', at: '2026-09-21', file: '乌鸦喝水-教学设计.pdf', size: '1.0 MB', tags: ['thinking'], custom: [], status: 'reviewed',
      summary: '用实物演示替代图片讲解，让学生亲手试石头填瓶。' },
    { id: 'm24', sid: 's7', type: '实习反思',         title: '演示实验失败的十分钟', at: '2026-10-13', file: '实习反思-演示实验.docx', size: '70 KB', tags: ['character'], custom: [], status: 'reviewed',
      summary: '瓶子太小导致水面没有明显上升，现场改用透明量杯补救。' },
    { id: 'm25', sid: 's7', type: '教学实践材料',     title: '课堂演示实验记录', at: '2026-10-26', file: '演示实验记录.pdf', size: '1.8 MB', tags: ['practice'], custom: [], status: 'submitted',
      summary: '整理了两次演示实验的对比数据。' },

    { id: 'm26', sid: 's8', type: '教学设计方案',     title: '《分数的意义》教学设计方案', at: '2026-09-23', file: '分数的意义-教学设计.pdf', size: '1.1 MB', tags: ['motivation','thinking'], custom: [], status: 'submitted',
      summary: '从「一个整体」与「一个单位」的辨析切入。' },
    { id: 'm27', sid: 's8', type: '教研记录',         title: '小组集体备课记录', at: '2026-10-12', file: '集体备课记录.docx', size: '48 KB', tags: ['character'], custom: [], status: 'submitted',
      summary: '四人小组分工完成一课时设计，负责课件与素材。' },

    { id: 'm28', sid: 's9', type: '实习反思',         title: '一年级课堂常规的建立', at: '2026-10-15', file: '实习反思-课堂常规.docx', size: '66 KB', tags: ['motivation'], custom: [], status: 'submitted',
      summary: '记录了三次口令调整的尝试与效果差异。' },
    { id: 'm29', sid: 's9', type: '教学实践材料',     title: '课堂评价小印章使用记录', at: '2026-10-29', file: '评价印章记录.pdf', size: '1.1 MB', tags: ['practice'], custom: [], status: 'submitted',
      summary: '用印章替代口头表扬，记录了一周内学生的反馈。' },

    { id: 'm30', sid: 's10', type: '教学设计方案',    title: '《认识图形》教学设计方案', at: '2026-09-30', file: '认识图形-教学设计.pdf', size: '870 KB', tags: ['thinking'], custom: [], status: 'submitted',
      summary: '以「摸一摸、猜一猜」的触觉游戏导入。' },

    { id: 'm31', sid: 's11', type: '教学设计方案',    title: '《秋天》教学设计方案', at: '2026-09-27', file: '秋天-教学设计.pdf', size: '940 KB', tags: ['motivation'], custom: [], status: 'reviewed',
      summary: '把课文学习与校园落叶观察结合起来。' },
    { id: 'm32', sid: 's11', type: '实习反思',        title: '户外活动的组织反思', at: '2026-10-17', file: '实习反思-户外活动.docx', size: '62 KB', tags: ['character'], custom: [], status: 'reviewed',
      summary: '户外观察时队伍管理失控，记录了三条改进办法。' },

    { id: 'm33', sid: 's12', type: '教学实践材料',    title: '拼音卡片制作', at: '2026-10-24', file: '拼音卡片.zip', size: '4.2 MB', tags: ['practice'], custom: [], status: 'submitted',
      summary: '一套手绘拼音卡片，用于课后个别辅导。' }
  ],

  /* ── 教师研判（质性评语 + 发展建议 + 四维证据确认）── */
  reviews: [
    { id: 'r1', sid: 's1', at: '2026-10-24',
      comment: '李华这一个月进步挺明显的。一开始只是「想把课上得不一样」，现在能说清哪里不一样、为什么这么改。二稿主动加了前测，说明他开始考虑学生实际会卡在哪儿。',
      suggestion: '建议把「失败复盘」写细一点：当时是怎么判断的、依据是什么，别只写结果。数学绘本那个活动可以再整理成一节完整的课，以后能接着用。',
      levels: { motivation: 3, thinking: 2, character: 2, practice: 2 } },
    { id: 'r2', sid: 's1', at: '2026-09-30',
      comment: '第一次交的材料已经能看出设计意识，情境导入比教材原来的设计更贴近学生。',
      suggestion: '方案里可以补一段「学生不按预设回答时怎么办」，新手常漏掉这块。',
      levels: { motivation: 2, thinking: 1, character: 1, practice: 1 } },
    { id: 'r3', sid: 's2', at: '2026-10-16',
      comment: '张三在课上遇到答不上来的问题，没有硬撑，课后主动来问了。设计上也已经开始有取舍。',
      suggestion: '现在的材料集中在「想改」和「怎么设计」，还看不到完整上下来的一节课。补一份课堂实录或者学生作品，「做成了什么」就完整了。',
      levels: { motivation: 2, thinking: 2, character: 0, practice: 0 } },
    { id: 'r4', sid: 's4', at: '2026-10-20',
      comment: '赵六把水墨导入和诗配画活动连成了一条线，评价也从默写换成了「画面能不能说清诗意」，这个改动有想法。',
      suggestion: '可以再往前走一步：让学生互评时说清依据，别只写「画得好不好」。',
      levels: { motivation: 1, thinking: 2, character: 1, practice: 2 } },
    { id: 'r5', sid: 's5', at: '2026-10-26',
      comment: '陈明把观察活动改成对照实验，把「看」变成了「判断」，是这学期很扎实的一次改动。材料连着几天没发芽也没放弃，这一点也值得记下来。',
      suggestion: '对照实验的结论可以整理成一页教研小结，署上小组名字，下一届能用。',
      levels: { motivation: 2, thinking: 2, character: 2, practice: 1 } },
    { id: 'r6', sid: 's7', at: '2026-10-22',
      comment: '杨光的演示实验现场出了问题，临时改用透明量杯补救，这个反应比原设计更值得记。',
      suggestion: '把这次补救写成完整的复盘：当时为什么判断瓶子太小、换量杯解决了什么。这种材料比成功案例更有用。',
      levels: { motivation: 1, thinking: 1, character: 2, practice: 1 } },
    { id: 'r7', sid: 's8', at: '2026-10-18',
      comment: '周涛在集体备课里负责课件和素材，配合得不错。设计上开始关注「一个整体」和「一个单位」的区别了。',
      suggestion: '建议自己独立写一份教学反思，把备课时的想法和上课后的感受对着写。',
      levels: { motivation: 1, thinking: 1, character: 1, practice: 0 } },
    { id: 'r8', sid: 's11', at: '2026-10-12',
      comment: '孙丽把课文和校园落叶观察结合起来，想法不错。户外活动组织上的问题也如实写了。',
      suggestion: '下次户外活动前，可以先在教室里演练一遍怎么排队、怎么走位。',
      levels: { motivation: 2, thinking: 1, character: 1, practice: 0 } }
  ],

  /* ── 发展资源 ── */
  resources: [
    { id: 'rs1', cat: '教学创新案例', title: '小学数学「分数的意义」大概念单元设计', source: '省基础教育课程中心', at: '2026-10-18', tag: '单元整体',
      summary: '以一个核心问题贯通 6 个课时，展示了如何用「整体—部分」的大概念组织单元。' },
    { id: 'rs2', cat: '教学创新案例', title: '语文课堂的「问题链」设计：从提问到追问', source: '语文教学通讯', at: '2026-10-09', tag: '问题设计',
      summary: '把零散的提问改造成有梯度的链条，附三节完整课例的追问记录。' },
    { id: 'rs3', cat: '教学创新案例', title: '项目式学习在小学科学中的落地', source: '科学课杂志', at: '2026-09-26', tag: '项目式学习',
      summary: '一个学期的 PBL 实践：从选题、分解任务到成果展的完整流程。' },
    { id: 'rs4', cat: '教学创新案例', title: '跨学科主题学习的课时设计模板', source: '院校教师发展中心', at: '2026-09-15', tag: '跨学科',
      summary: '提供可直接填写的模板，含目标对齐表与评价量规。' },

    { id: 'rs5', cat: '教研选题', title: '师范生课堂提问质量的自我诊断工具', source: '教师教育研究', at: '2026-10-21', tag: '课堂观察',
      summary: '一套 12 题的自我诊断表，可用于实习期的课堂录像分析。' },
    { id: 'rs6', cat: '教研选题', title: '小学低段学生课堂参与度的观察量表开发', source: '院校教研项目', at: '2026-10-05', tag: '量表开发',
      summary: '从行为、语言、情绪三个维度记录参与情况，附信效度说明。' },
    { id: 'rs7', cat: '教研选题', title: 'AI 辅助备课对师范生教学设计能力的影响', source: '教育技术研究', at: '2026-09-22', tag: 'AI + 教学',
      summary: '一个学期的准实验研究，讨论 AI 是替代了思考还是解放了思考。' },
    { id: 'rs8', cat: '教研选题', title: '实习期「关键事件」反思写作的支架设计', source: '院校教师发展中心', at: '2026-09-10', tag: '反思写作',
      summary: '提供四类反思支架，帮助实习生把「发生了什么」写成「我理解了什么」。' },

    { id: 'rs9',  cat: '竞赛信息', title: '全国师范生教学技能竞赛 · 校内选拔', source: '教务处', at: '2026-11-01', tag: '教学技能',
      summary: '校内选拔 11 月下旬启动，含教学设计、说课、模拟授课三个环节。' },
    { id: 'rs10', cat: '竞赛信息', title: '大学生创新创业训练计划申报', source: '创新创业学院', at: '2026-10-28', tag: '大创',
      summary: '面向大二大三，鼓励以教育场景为选题，需组队并联系指导教师。' },
    { id: 'rs11', cat: '竞赛信息', title: '省级师范生信息化教学应用大赛', source: '省教育厅', at: '2026-10-12', tag: '信息化',
      summary: '重点考察数字资源开发与课堂融合，提交作品需附应用说明。' },
    { id: 'rs12', cat: '竞赛信息', title: '校级教学创新设计工作坊招募', source: '教师发展中心', at: '2026-09-30', tag: '工作坊',
      summary: '为期四周的线下工作坊，围绕真实课例做迭代设计。' }
  ],

  /* ── 自我反思（李华，演示草稿态）── */
  reflection: {
    brief: '在附属小学三（2）班开展《分数的初步认识》一课教学，共 2 课时，对象为 42 名学生。这是我第一次独立完成从设计到实施的全过程。',
    motivation: '上完这节课，我最大的感受是：想改和敢改是两件事。备课时觉得自己的方案挺好，站上讲台才发现学生不按我想的路走。「以学生为中心」这句话以前只是听说过，这次才算碰到。',
    thinking: '学生能背「平均分」，但要判断一个图形是不是平均分，还是会错。教材是先给定义再练习，中间少了操作上的冲突。我的做法是把操作放到定义前面，先分再命名。第一稿不太行，二稿加了前测和错例对比。',
    character: '有。第一稿试讲，学生抢材料，指令没人听，课上到一半就乱了。当时挺挫败的。后来复盘，问题出在任务卡没有分层，也没提前说好材料怎么发。任务卡是组里同学陪我一起改的，帮了大忙。',
    practice: '课堂里做了三件事：分层任务卡、错例对比、课后数学绘本阅读。效果上，前测正确率 38%，课后同类题正确率 79%；绘本活动有 31 名学生完成了口头分享。',
    plan: '下一步想补充两件事：一是把绘本活动整理成一节完整的课；二是请王老师帮我看一次课堂录像，重点看巡视路线和提问时机。'
  },

  /* ── 院校端配置（演示态）── */
  rules: {
    needReview: true,
    adminCanView: false,
    retention: '5 年',
    exportNotice: '本报告仅用于人才培养方案修订与课程改革，不用于学生个体排名筛选。'
  }
};
