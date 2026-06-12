/* Omnilimb dashboard tab — operations panel (i18n-aware).
 * Plain IIFE using window.__HERMES_PLUGIN_SDK__ (no bundled React).
 * Follows the dashboard's active language via SDK.useI18n().locale.
 */
(function () {
  "use strict";

  var SDK = window.__HERMES_PLUGIN_SDK__;
  if (!SDK || !SDK.React) return;

  var React = SDK.React;
  var h = React.createElement;
  var useState = SDK.hooks.useState;
  var useEffect = SDK.hooks.useEffect;
  var fetchJSON = SDK.fetchJSON;
  var C = SDK.components || {};
  var API = "/api/plugins/omnilimb";

  // --- i18n --------------------------------------------------------------
  var STRINGS = {
    en: {
      
      
      statusErr: "Status error", loadingStatus: "Loading Omnilimb status…",
      refresh: "Refresh", license: "license", sandbox: "sandbox", workspace: "workspace",
      openclawCli: "openclaw CLI", yes: "yes", no: "no",
      tabSearch: "Search", tabRuntime: "Runtime",
      searchTitle: "Search skills", searchPh: "Search skills — e.g. browser / PPT",
      search: "Search", searching: "Searching…", install: "Install", noResults: "No results.",
      installed: "Installed", installFail: "Install failed",
      runtimeTitle: "Runtime", run: "Run", running: "Running…",
      tabInstalled: "Installed", installedTitle: "Installed skills", noInstalled: "No skills installed yet.",
      installing: "Installing…", health: "OpenClaw health", healthOk: "OpenClaw detected", healthDown: "OpenClaw not found", nativeMode: "native mode — no OpenClaw needed", recheck: "Recheck",
      calls: "Calls", view: "View / Edit", close: "Close", viewDetail: "View", uninstall: "Uninstall", uninstalling: "Uninstalling…", uninstallFail: "Uninstall failed", confirmUninstall: "Uninstall \"%s\"? This permanently deletes the skill from your workspace.", backInstalled: "← Installed", save: "Save", saving: "Saving…", saved: "Saved ✓", saveFail: "Save failed",
      category: "Category", allCategories: "All categories", sortBy: "Sort", sortRelevance: "Relevance", sortDownloads: "Hot", sortStars: "Stars", sortLatest: "Latest", prev: "Prev", next: "Next", page: "Page", downloads: "downloads", stars: "stars", resultsTotal: "results", verifiedBadge: "Verified",
      homepage: "Skill page", deps: "Requires", noDeps: "No extra deps",
      preview: "Preview", edit: "Edit", seats: "seats", tier: "tier",
      runHistory: "Run history", runsTotal: "Total", runsSuccess: "Success", runsAvg: "Avg", runsLast: "Last", noRuns: "No runs recorded yet.", 
      credentials: "API keys / credentials", credSet: "set", credSave: "Save", credClear: "Clear", credAdd: "Add", credKeyPh: "KEY NAME (e.g. OPENAI_API_KEY)", credValuePh: "value (key or URL)", credNone: "This skill declares no API keys, so it needs none. You can still add one manually below if you know it needs one.", credHint: "Credentials the skill itself uses for its external service (unrelated to Hermes's model). Left = key name (the env var the skill needs); right = its value. Example (OpenAI-compatible): OPENAI_API_KEY → your key; add an OPENAI_BASE_URL row → the endpoint URL.",
      envCheck: "Environment check", envBin: "bin", envKey: "key", envBinMissing: "not found on PATH", envKeyMissing: "not set",
      smokeTitle: "Smoke test", smokeRun: "Test run", smokeOk: "ran successfully", smokeExit: "exit code", smokeNeedsArgs: "the script likely needs arguments to run", smokeHint: "Most skills are agent playbooks — their scripts expect arguments, so an empty smoke run can fail even when the skill is fine.", collapse: "Collapse", expand: "Expand", manualTitle: "Skill butler manual", manualClose: "Close",
      scoreTitle: "Skill health check", scoreRun: "Check", scoreAll: "Health-check all", scoreAllRun: "Checking…", alsoSearched: "Related terms also searched", scoreCaps: "Capabilities", recoYes: "Recommended", recoCaution: "Use with caution", recoNo: "Not recommended",
      updateAvail: "Update available",
      tabSettings: "Settings", settingsTitle: "Settings", fieldAudit: "Audit logging", fieldCache: "Local cache", fieldTtl: "Discover cache TTL (s)", needRestart: "some changes apply on restart", diagTitle: "Diagnostics",
      
      workspaceHint: "Where skills are installed. Leave empty to use the default (~/.openclaw/workspace).",
      backendHint: "How skills run. Auto (recommended) picks the best available; CLI routes through the OpenClaw command line (needs OpenClaw installed); Native runs skills with the built-in runtime — no OpenClaw needed.",
      defaultMarket: "Default market", marketHint: "The skill marketplace used by default for search and discovery.",
      auditHint: "Record every tool call to a local audit log you can review in the Audit tab.",
      cacheHint: "Cache discovery and search results locally so repeat loads are instant.",
      ttlHint: "How long discovery results stay cached before a fresh fetch.",
      credSkillTitle: "Installed skill API keys", credSkillPickPh: "Select an installed skill…", credSectionHint: "Pick an installed skill, then add or update the API keys it uses to call its own external service (unrelated to Hermes's model).",
      fieldShowStats: "Top stat cards", showStatsHint: "Show the five summary cards (installed, total calls, updates, favorites, health) at the top of the page.",
      exportSkills: "Export", importSkills: "Import", importDone: "Imported", favorite: "Favorite", recentSearch: "Recent", myFavorites: "My favorites",
      tabFavorites: "Favorites", favEmpty: "No favorites yet. Tap the heart on any skill to save it here.", favRemove: "Remove",
      tabAudit: "Audit", auditTitle: "Audit log", auditDisabled: "Audit logging is off. Enable it in config.yaml: omnilimb.audit_log: true", noAudit: "No audit records yet.", filterTool: "Tool", filterStatus: "Status", statusAll: "All", statusOk: "OK only", statusFail: "Failed only", export: "Export", time: "Time",
      cachedNotice: "Upstream unavailable — showing cached results (may be stale)",
      heroKicker: "OPENCLAW SKILL MARKETPLACE · AGENT-DRIVEN SUBSTRATE", heroSubtitle: "Let the Hermes brain drive the entire OpenClaw skill ecosystem — community skills, sandboxes, browsers and multi-language runtimes unified as deterministic structured-JSON tools the agent calls directly. No second AI loop, zero inference overhead — find it, install it, run it.", refreshAll: "Refresh", statBackend: "Backend", statMarket: "Market", statLicense: "License", statInstalled: "Installed", statHealth: "Health", healthyShort: "Healthy", attentionShort: "Attention", statPlan: "Plan", statFree: "Free", statSuccess: "Success rate", statMarkets: "Markets", statCalls: "calls", noRunsShort: "no runs yet", statCallsTotal: "Total calls", statUpdates: "Updates",
      from: "from", catAll: "All",
      secHot: "🔥 Hot picks", secLatest: "🆕 Newest", secTop: "⭐ Top rated", viewMore: "View more →", backDiscover: "← Discover",
      discReco: "For you", discRising: "Trending", discHot: "Top downloads", discNewest: "Newest",
      cachedHint: "cached",
    },
    zh: {
      
      
      statusErr: "状态错误", loadingStatus: "正在加载 Omnilimb 状态…",
      refresh: "刷新", license: "授权", sandbox: "沙箱", workspace: "工作区",
      openclawCli: "openclaw CLI", yes: "是", no: "否",
      tabSearch: "搜索", tabRuntime: "运行时",
      searchTitle: "搜索技能", searchPh: "搜索技能，例如 浏览器 / PPT",
      search: "搜索", searching: "搜索中…", install: "安装", noResults: "无结果。",
      installed: "已安装", installFail: "安装失败",
      runtimeTitle: "运行时", run: "运行", running: "运行中…",
      tabInstalled: "已安装", installedTitle: "已安装技能", noInstalled: "尚未安装任何技能。",
      installing: "安装中…", health: "OpenClaw 状态", healthOk: "已检测到 OpenClaw", healthDown: "未检测到 OpenClaw", nativeMode: "原生模式 — 无需 OpenClaw", recheck: "重新检测",
      calls: "调用", view: "查看 / 编辑", close: "收起", viewDetail: "查看详情", uninstall: "卸载", uninstalling: "卸载中…", uninstallFail: "卸载失败", confirmUninstall: "确定卸载「%s」？这会从工作区永久删除该技能。", backInstalled: "← 返回已安装", save: "保存", saving: "保存中…", saved: "已保存 ✓", saveFail: "保存失败",
      category: "分类", allCategories: "全部分类", sortBy: "排序", sortRelevance: "相关度", sortDownloads: "热度", sortStars: "星标", sortLatest: "最新", prev: "上一页", next: "下一页", page: "第", downloads: "下载", stars: "星", resultsTotal: "个结果", verifiedBadge: "已验证",
      homepage: "技能页面", deps: "依赖", noDeps: "无额外依赖",
      preview: "预览", edit: "编辑", seats: "席位", tier: "档位",
      runHistory: "运行记录", runsTotal: "总调用", runsSuccess: "成功率", runsAvg: "平均耗时", runsLast: "最近", noRuns: "暂无运行记录。", 
      credentials: "API Key / 凭据", credSet: "已设置", credSave: "保存", credClear: "清除", credAdd: "添加", credKeyPh: "键名（如 OPENAI_API_KEY）", credValuePh: "值（密钥或地址）", credNone: "该技能没有声明需要 API Key，因此无需填写。若你确定它需要某个密钥，可在下方手动添加。", credHint: "这是技能自己调外部服务用的密钥（和 Hermes 用哪个模型无关）。左边「键名」填技能要的环境变量名，右边填它的值。例（OpenAI 兼容模式）：键名 OPENAI_API_KEY、值填你的密钥；再加一行键名 OPENAI_BASE_URL、值填接口地址。",
      envCheck: "环境检查", envBin: "命令", envKey: "密钥", envBinMissing: "PATH 中未找到", envKeyMissing: "未设置",
      smokeTitle: "冒烟测试", smokeRun: "试运行", smokeOk: "运行成功", smokeExit: "退出码", smokeNeedsArgs: "该脚本可能需要参数才能运行", smokeHint: "多数技能是给 Agent 用的「操作手册」——脚本需要带参数运行，所以空参数冒烟即使技能正常也可能失败。", collapse: "收起", expand: "展开", manualTitle: "技能管家说明书", manualClose: "关闭",
      scoreTitle: "技能体检", scoreRun: "体检", scoreAll: "全部体检", scoreAllRun: "体检中…", alsoSearched: "已自动包含相关词的搜索结果", scoreCaps: "能力", recoYes: "推荐安装/使用", recoCaution: "谨慎", recoNo: "不推荐",
      updateAvail: "有可用更新",
      tabSettings: "设置", settingsTitle: "设置", fieldAudit: "审计日志记录", fieldCache: "本地缓存", fieldTtl: "发现页缓存有效期(秒)", needRestart: "部分改动重启后生效", diagTitle: "诊断",
      
      workspaceHint: "技能的安装目录；留空使用默认（~/.openclaw/workspace）。",
      backendHint: "技能怎么运行。auto（推荐）自动选最合适的；cli 通过 OpenClaw 命令行运行（需已安装 OpenClaw）；native 用内置运行时直接跑，无需 OpenClaw。",
      defaultMarket: "默认市场", marketHint: "搜索和发现页默认使用的技能市场。",
      auditHint: "把每次工具调用记录到本地审计日志，可在「审计」标签里查看。",
      cacheHint: "在本地缓存发现和搜索结果，重复打开更快。",
      ttlHint: "发现页结果缓存多久后才重新拉取。",
      credSkillTitle: "已安装技能的 API Key", credSkillPickPh: "选择一个已安装的技能…", credSectionHint: "选择一个已安装技能，为它添加或更新调用自身外部服务所需的 API Key（与 Hermes 用哪个模型无关）。",
      fieldShowStats: "顶部统计卡", showStatsHint: "在页面顶部显示五个概览方块（已安装、累计调用、可更新、收藏、健康）。",
      exportSkills: "导出", importSkills: "导入", importDone: "已导入", favorite: "收藏", recentSearch: "最近搜索", myFavorites: "我的收藏",
      tabFavorites: "收藏", favEmpty: "还没有收藏。点任意技能上的红心即可收藏到这里。", favRemove: "移除",
      tabAudit: "审计", auditTitle: "审计日志", auditDisabled: "审计未开启。在 config.yaml 中启用：omnilimb.audit_log: true", noAudit: "暂无审计记录。", filterTool: "工具", filterStatus: "状态", statusAll: "全部", statusOk: "仅成功", statusFail: "仅失败", export: "导出", time: "时间",
      cachedNotice: "上游不可达 — 显示缓存结果（可能已过期）",
      heroKicker: "OPENCLAW 技能市场 · 智能体直驱底座", heroSubtitle: "让 Hermes 的大脑直接驱动整个 OpenClaw 技能生态 —— 社区技能、沙箱、浏览器与多语言运行时统一成确定性的结构化 JSON 工具,由智能体直接调用;不额外跑一层 AI、零推理消耗,找到即装、装完即跑。", refreshAll: "刷新", statBackend: "后端", statMarket: "市场", statLicense: "授权", statInstalled: "已安装", statHealth: "健康", healthyShort: "正常", attentionShort: "需关注", statPlan: "版本", statFree: "免费版", statSuccess: "运行成功率", statMarkets: "可用市场", statCalls: "次调用", noRunsShort: "暂无运行", statCallsTotal: "累计调用", statUpdates: "可更新",
      from: "源自", catAll: "全部",
      secHot: "🔥 热门推荐", secLatest: "🆕 最新上架", secTop: "⭐ 高分精选", viewMore: "查看更多 →", backDiscover: "← 返回发现",
      discReco: "为你推荐", discRising: "近期飙升", discHot: "下载热榜", discNewest: "最近上新",
      cachedHint: "已缓存",
    },
    "zh-hant": {
      
      
      statusErr: "狀態錯誤", loadingStatus: "正在載入 Omnilimb 狀態…",
      refresh: "重新整理", license: "授權", sandbox: "沙箱", workspace: "工作區",
      openclawCli: "openclaw CLI", yes: "是", no: "否",
      tabSearch: "搜尋", tabRuntime: "執行階段",
      searchTitle: "搜尋技能", searchPh: "搜尋技能，例如 github / 地圖",
      search: "搜尋", searching: "搜尋中…", install: "安裝", noResults: "無結果。",
      installed: "已安裝", installFail: "安裝失敗",
      
      
      runtimeTitle: "執行階段", run: "執行", running: "執行中…",
      tabInstalled: "已安裝", installedTitle: "已安裝技能", noInstalled: "尚未安裝任何技能。",
      installing: "安裝中…", health: "OpenClaw 狀態", healthOk: "已偵測到 OpenClaw", healthDown: "未偵測到 OpenClaw", nativeMode: "原生模式 — 無需 OpenClaw", recheck: "重新偵測",
    },
    ja: {
      
      
      statusErr: "ステータスエラー", loadingStatus: "Omnilimb のステータスを読み込み中…",
      refresh: "更新", license: "ライセンス", sandbox: "サンドボックス", workspace: "ワークスペース",
      openclawCli: "openclaw CLI", yes: "はい", no: "いいえ",
      tabSearch: "検索", tabRuntime: "ランタイム",
      searchTitle: "スキル検索", searchPh: "スキルを検索 — 例: github / 地図",
      search: "検索", searching: "検索中…", install: "インストール", noResults: "結果なし。",
      installed: "インストール済み", installFail: "インストール失敗",
      
      
      runtimeTitle: "ランタイム", run: "実行", running: "実行中…",
      tabInstalled: "インストール済み", installedTitle: "インストール済みスキル", noInstalled: "まだスキルがありません。",
      installing: "インストール中…", health: "OpenClaw 状態", healthOk: "OpenClaw を検出", healthDown: "OpenClaw が見つかりません", nativeMode: "ネイティブモード — OpenClaw 不要", recheck: "再確認",
    },
    ko: {
      
      
      statusErr: "상태 오류", loadingStatus: "Omnilimb 상태 로딩 중…",
      refresh: "새로고침", license: "라이선스", sandbox: "샌드박스", workspace: "작업공간",
      openclawCli: "openclaw CLI", yes: "예", no: "아니오",
      tabSearch: "검색", tabRuntime: "런타임",
      searchTitle: "스킬 검색", searchPh: "스킬 검색 — 예: github / 지도",
      search: "검색", searching: "검색 중…", install: "설치", noResults: "결과 없음.",
      installed: "설치됨", installFail: "설치 실패",
      
      
      runtimeTitle: "런타임", run: "실행", running: "실행 중…",
      tabInstalled: "설치됨", installedTitle: "설치된 스킬", noInstalled: "아직 설치된 스킬이 없습니다.",
      installing: "설치 중…", health: "OpenClaw 상태", healthOk: "OpenClaw 감지됨", healthDown: "OpenClaw 없음", nativeMode: "네이티브 모드 — OpenClaw 불필요", recheck: "다시 확인",
    },
    de: {
      
      
      statusErr: "Statusfehler", loadingStatus: "Omnilimb-Status wird geladen…",
      refresh: "Aktualisieren", license: "Lizenz", sandbox: "Sandbox", workspace: "Arbeitsbereich",
      openclawCli: "openclaw CLI", yes: "ja", no: "nein",
      tabSearch: "Suche", tabRuntime: "Laufzeit",
      searchTitle: "Skills suchen", searchPh: "Skills suchen – z. B. github / Karte",
      search: "Suchen", searching: "Suche läuft…", install: "Installieren", noResults: "Keine Ergebnisse.",
      installed: "Installiert", installFail: "Installation fehlgeschlagen",
      
      
      runtimeTitle: "Laufzeit", run: "Ausführen", running: "Läuft…",
      tabInstalled: "Installiert", installedTitle: "Installierte Skills", noInstalled: "Noch keine Skills installiert.",
      installing: "Installiere…", health: "OpenClaw-Status", healthOk: "OpenClaw erkannt", healthDown: "OpenClaw nicht gefunden", nativeMode: "Native Modus — kein OpenClaw nötig", recheck: "Erneut prüfen",
    },
    es: {
      
      
      statusErr: "Error de estado", loadingStatus: "Cargando estado de Omnilimb…",
      refresh: "Actualizar", license: "licencia", sandbox: "sandbox", workspace: "espacio",
      openclawCli: "openclaw CLI", yes: "sí", no: "no",
      tabSearch: "Buscar", tabRuntime: "Runtime",
      searchTitle: "Buscar skills", searchPh: "Buscar skills — p. ej. github / mapa",
      search: "Buscar", searching: "Buscando…", install: "Instalar", noResults: "Sin resultados.",
      installed: "Instalado", installFail: "Error de instalación",
      
      
      runtimeTitle: "Runtime", run: "Ejecutar", running: "Ejecutando…",
      tabInstalled: "Instalados", installedTitle: "Skills instalados", noInstalled: "Aún no hay skills instalados.",
      installing: "Instalando…", health: "Estado de OpenClaw", healthOk: "OpenClaw detectado", healthDown: "OpenClaw no encontrado", nativeMode: "modo nativo — sin OpenClaw", recheck: "Reverificar",
    },
    fr: {
      
      
      statusErr: "Erreur d'état", loadingStatus: "Chargement de l'état Omnilimb…",
      refresh: "Actualiser", license: "licence", sandbox: "sandbox", workspace: "espace",
      openclawCli: "openclaw CLI", yes: "oui", no: "non",
      tabSearch: "Recherche", tabRuntime: "Runtime",
      searchTitle: "Rechercher des skills", searchPh: "Rechercher des skills — ex. github / carte",
      search: "Rechercher", searching: "Recherche…", install: "Installer", noResults: "Aucun résultat.",
      installed: "Installé", installFail: "Échec de l'installation",
      
      
      runtimeTitle: "Runtime", run: "Exécuter", running: "Exécution…",
      tabInstalled: "Installés", installedTitle: "Skills installés", noInstalled: "Aucun skill installé pour l'instant.",
      installing: "Installation…", health: "État d'OpenClaw", healthOk: "OpenClaw détecté", healthDown: "OpenClaw introuvable", nativeMode: "mode natif — OpenClaw non requis", recheck: "Revérifier",
    },
    ru: {
      
      
      statusErr: "Ошибка статуса", loadingStatus: "Загрузка статуса Omnilimb…",
      refresh: "Обновить", license: "лицензия", sandbox: "песочница", workspace: "рабочая область",
      openclawCli: "openclaw CLI", yes: "да", no: "нет",
      tabSearch: "Поиск", tabRuntime: "Среда",
      searchTitle: "Поиск навыков", searchPh: "Поиск навыков — напр. github / карта",
      search: "Искать", searching: "Поиск…", install: "Установить", noResults: "Нет результатов.",
      installed: "Установлено", installFail: "Ошибка установки",
      
      
      runtimeTitle: "Среда", run: "Запустить", running: "Выполнение…",
      tabInstalled: "Установлено", installedTitle: "Установленные навыки", noInstalled: "Навыки ещё не установлены.",
      installing: "Установка…", health: "Состояние OpenClaw", healthOk: "OpenClaw обнаружен", healthDown: "OpenClaw не найден", nativeMode: "нативный режим — OpenClaw не нужен", recheck: "Проверить снова",
    },
    pt: {
      
      
      statusErr: "Erro de estado", loadingStatus: "Carregando estado do Omnilimb…",
      refresh: "Atualizar", license: "licença", sandbox: "sandbox", workspace: "workspace",
      openclawCli: "openclaw CLI", yes: "sim", no: "não",
      tabSearch: "Buscar", tabRuntime: "Runtime",
      searchTitle: "Buscar skills", searchPh: "Buscar skills — ex. github / mapa",
      search: "Buscar", searching: "Buscando…", install: "Instalar", noResults: "Sem resultados.",
      installed: "Instalado", installFail: "Falha na instalação",
      
      
      runtimeTitle: "Runtime", run: "Executar", running: "Executando…",
      tabInstalled: "Instalados", installedTitle: "Skills instalados", noInstalled: "Nenhum skill instalado ainda.",
      installing: "Instalando…", health: "Estado do OpenClaw", healthOk: "OpenClaw detectado", healthDown: "OpenClaw não encontrado", nativeMode: "modo nativo — sem OpenClaw", recheck: "Reverificar",
    },
  };

  function useTr() {
    var i18n = SDK.useI18n ? SDK.useI18n() : null;
    var loc = (i18n && i18n.locale) || "en";
    var table = STRINGS[loc] || STRINGS.en;
    return function (k) {
      return table[k] != null ? table[k] : (STRINGS.en[k] != null ? STRINGS.en[k] : k);
    };
  }

  // --- component fallbacks -----------------------------------------------
  function box(tag, extraClass) {
    return function (props, children) {
      props = props || {};
      var cls = (props.className ? props.className + " " : "") + (extraClass || "");
      return h(tag, Object.assign({}, props, { className: cls }), children);
    };
  }
  var Card = C.Card || box("div", "rounded-lg border bg-card text-card-foreground p-4");
  var CardHeader = C.CardHeader || box("div", "mb-2");
  var CardTitle = C.CardTitle || box("div", "font-semibold");
  var CardContent = C.CardContent || box("div", "");
  var Badge = C.Badge || box("span", "inline-flex items-center rounded border px-1.5 py-0.5 text-xs");
  var Button = C.Button || box("button", "inline-flex items-center rounded border px-3 py-1.5 text-sm hover:bg-accent");

  function api(path, init) { return fetchJSON(API + path, init); }
  function post(path, body) {
    return api(path, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body || {}) });
  }
  // Discover boards persisted to localStorage per market, so a repeat page open
  // renders instantly from disk (0 network, 0 flash); a silent background refresh
  // then updates the data. Survives dashboard cold starts too.
  var EX_DISC_LS = "omnilimb.discover.v2";
  function exLsAll() { try { return JSON.parse(localStorage.getItem(EX_DISC_LS) || "{}") || {}; } catch (e) { return {}; } }
  function exLsSeed(mk) { var e = exLsAll()[mk]; return (e && e.tabs && typeof e.tabs === "object") ? e.tabs : {}; }
  function exLsSave(mk, tabs) { try { var all = exLsAll(); all[mk] = { ts: Date.now(), tabs: tabs }; localStorage.setItem(EX_DISC_LS, JSON.stringify(all)); } catch (e) { } }
  // Markets: seed the dropdown from the built-in set (and last-seen cache) so the
  // first paint already shows the full list — no "2 then 4" flicker while /markets loads.
  var EX_MARKETS_LS = "omnilimb.markets.v1";
  var EX_BUILTIN_MARKETS = [
    { id: "clawhub", label: "ClawHub · 官方" },
    { id: "clawhub-cn", label: "ClawHub 国内镜像" },
    { id: "skillhub", label: "SkillHub.cn · 腾讯" },
    { id: "skillsmp", label: "SkillsMP · GitHub 技能索引" },
  ];
  function exMarketsSeed() {
    try { var c = JSON.parse(localStorage.getItem(EX_MARKETS_LS) || "null"); if (c && c.length) return c; } catch (e) { }
    return EX_BUILTIN_MARKETS;
  }
  function exMarketsSave(list) { try { if (list && list.length) localStorage.setItem(EX_MARKETS_LS, JSON.stringify(list)); } catch (e) { } }
  // Top stat-card visibility preference (UI-only, default shown). TopBar listens
  // for the custom event so a Settings toggle reflects instantly without reload.
  var EX_SHOWSTATS_LS = "omnilimb.showStats.v1";
  function exShowStats() { try { return localStorage.getItem(EX_SHOWSTATS_LS) !== "0"; } catch (e) { return true; } }
  function exSetShowStats(v) {
    try { localStorage.setItem(EX_SHOWSTATS_LS, v ? "1" : "0"); } catch (e) { }
    try { window.dispatchEvent(new CustomEvent("omnilimb:showstats", { detail: !!v })); } catch (e) { }
  }
  function field(props) {
    return h("input", Object.assign({ className: "w-full rounded border bg-transparent px-2 py-1.5 text-sm" }, props));
  }
  // Colorable link/chain icon (inherits currentColor — recolor via CSS, no emoji).
  function linkIcon() {
    return h("svg", { viewBox: "0 0 24 24", width: "15", height: "15", fill: "none", stroke: "currentColor", "stroke-width": "2", "stroke-linecap": "round", "stroke-linejoin": "round", "aria-hidden": "true" },
      h("path", { key: "a", d: "M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" }),
      h("path", { key: "b", d: "M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" }));
  }
  function pre(text) {
    return h("pre", { className: "mt-2 max-h-72 overflow-auto rounded border bg-muted/40 p-2 text-xs whitespace-pre-wrap" }, text);
  }
  // Fixed grade colors applied INLINE. Inverted "lens" themes (e.g. Nous Blue)
  // flip the whole page via a z-200 mix-blend-mode:difference overlay, which would
  // turn our blue into gold and white text into black. We counter that by
  // pre-inverting EXACTLY when the lens is active: --foreground-alpha is 1 on
  // inverted themes and 0 on normal dark themes, so invert(var(--foreground-alpha))
  // is identity normally and a full invert under the lens (which the lens then
  // flips back) → the grade colors look identical in every theme.
  var EX_GRADE_HEX = { A: "#22c55e", B: "#3b82f6", C: "#f59e0b", D: "#ef4444" };
  function gradeStyle(g) { return { background: EX_GRADE_HEX[g] || "#6b7280", color: "#fff", filter: "invert(var(--foreground-alpha, 0))" }; }
  function row(children) { return h("div", { className: "flex flex-wrap items-center gap-2" }, children); }

  // --- minimal, XSS-safe Markdown renderer (no external deps) ------------
  function escapeHtml(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }
  function mdInline(s) {
    s = s.replace(/`([^`]+)`/g, '<code>$1</code>');
    s = s.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    s = s.replace(/\*([^*]+)\*/g, '<em>$1</em>');
    // links [text](url) — only http(s) hrefs survive (everything else is escaped text)
    s = s.replace(/\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g,
      '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
    return s;
  }
  function mdToHtml(src) {
    if (!src) return "";
    var lines = escapeHtml(src).split(/\r?\n/);
    var out = []; var inCode = false; var codeBuf = []; var listBuf = null;
    function flushList() { if (listBuf) { out.push("<ul>" + listBuf.join("") + "</ul>"); listBuf = null; } }
    for (var i = 0; i < lines.length; i++) {
      var ln = lines[i];
      if (ln.trim().indexOf("```") === 0) {
        if (inCode) { out.push("<pre><code>" + codeBuf.join("\n") + "</code></pre>"); codeBuf = []; inCode = false; }
        else { flushList(); inCode = true; }
        continue;
      }
      if (inCode) { codeBuf.push(ln); continue; }
      var hm = ln.match(/^(#{1,6})\s+(.*)$/);
      if (hm) { flushList(); var lvl = hm[1].length; out.push("<h" + lvl + ">" + mdInline(hm[2]) + "</h" + lvl + ">"); continue; }
      var li = ln.match(/^\s*[-*]\s+(.*)$/);
      if (li) { if (!listBuf) listBuf = []; listBuf.push("<li>" + mdInline(li[1]) + "</li>"); continue; }
      if (ln.trim() === "") { flushList(); continue; }
      flushList(); out.push("<p>" + mdInline(ln) + "</p>");
    }
    if (inCode) out.push("<pre><code>" + codeBuf.join("\n") + "</code></pre>");
    flushList();
    return out.join("\n");
  }
  function isMarkdown(path) { return /\.(md|markdown)$/i.test(path || ""); }

  var CAT_LABELS = {
    "developer-tools": { zh: "开发工具", en: "Developer Tools" },
    "ai-intelligence": { zh: "AI 智能", en: "AI" },
    "security-compliance": { zh: "安全合规", en: "Security" },
    "productivity": { zh: "效率提升", en: "Productivity" },
    "data-analysis": { zh: "数据分析", en: "Data" },
    "data": { zh: "数据分析", en: "Data" },
    "content-creation": { zh: "内容创作", en: "Content" },
    "content": { zh: "内容创作", en: "Content" },
    "communication": { zh: "通讯协作", en: "Communication" },
    "automation": { zh: "自动化", en: "Automation" },
    "research": { zh: "研究检索", en: "Research" },
    "devops": { zh: "运维部署", en: "DevOps" },
    "finance": { zh: "金融财务", en: "Finance" },
    "marketing": { zh: "市场营销", en: "Marketing" },
    "design": { zh: "设计创意", en: "Design" },
    "education": { zh: "教育学习", en: "Education" },
    "writing": { zh: "写作", en: "Writing" },
    "media": { zh: "多媒体", en: "Media" },
  };
  function prettySlug(s) { return String(s || "").replace(/[-_]+/g, " ").replace(/\b\w/g, function (c) { return c.toUpperCase(); }); }
  function catLabel(slug, locale) { var m = CAT_LABELS[slug]; if (!m) return prettySlug(slug); return (locale && locale.indexOf("zh") === 0) ? m.zh : m.en; }
  function srcLabel(src, market) {
    var s = String(src || "").toLowerCase();
    if (s === "clawhub") return "ClawHub";
    if (s === "skillhub") return "SkillHub";
    if (s) return src;
    return market === "skillhub" ? "SkillHub" : "ClawHub";
  }

  function skelCard(i) {
    return h("div", { key: i, className: "ex-skel-card" },
      h("div", { className: "ex-skel-row" },
        h("div", { className: "ex-skel ex-skel-icon" }),
        h("div", { style: { flex: 1 } }, h("div", { className: "ex-skel ex-skel-title" }))),
      h("div", { className: "ex-skel ex-skel-line" }),
      h("div", { className: "ex-skel ex-skel-line short" }),
      h("div", { className: "ex-skel-row" },
        h("div", { className: "ex-skel ex-skel-pill" }),
        h("div", { className: "ex-skel ex-skel-pill" })));
  }
  function skelGrid(n) {
    var arr = []; for (var i = 0; i < (n || 6); i++) arr.push(skelCard(i));
    return h("div", { className: "ex-grid" }, arr);
  }
  function skelStats() {
    var arr = [];
    for (var i = 0; i < 5; i++) {
      arr.push(h("div", { key: i, className: "ex-stat" },
        h("div", { className: "ex-skel", style: { height: ".6rem", width: "50%" } }),
        h("div", { className: "ex-skel", style: { height: "1.15rem", width: "72%", marginTop: ".45rem" } })));
    }
    return h("section", { className: "ex-stats" }, arr);
  }

  function StatCard(props) {
    return h("div", { className: "ex-stat" },
      h("div", { className: "ex-stat-label" }, props.label),
      h("div", { className: "ex-stat-value " + (props.cls || "") }, props.value),
      props.hint ? h("div", { className: "ex-stat-hint" }, props.hint) : null);
  }

  function TopBar() {
    var t = useTr();
    var st = useState(null);
    var hp = useState(null);
    var inst = useState(null);
    var upd = useState(null);
    var favs = useState(null);
    var showStats = useState(exShowStats());
    function load() {
      api("/status").then(st[1]).catch(function (e) { st[1]({ ok: false, error: String(e) }); });
      hp[1](null);
      api("/health").then(hp[1]).catch(function (e) { hp[1]({ ok: false, error: String(e) }); });
      api("/installed").then(inst[1]).catch(function () { inst[1](null); });
      api("/skill_updates").then(upd[1]).catch(function () { upd[1](null); });
      api("/favorites").then(favs[1]).catch(function () { favs[1](null); });
    }
    useEffect(function () {
      load();
      var on = function () { showStats[1](exShowStats()); };
      window.addEventListener("omnilimb:showstats", on);
      return function () { window.removeEventListener("omnilimb:showstats", on); };
    }, []);
    var s = st[0]; var hv = hp[0]; var iv = inst[0];

    var hero = h("section", { className: "ex-hero" },
      h("div", { className: "ex-hero-text" },
        h("div", { className: "ex-kicker" }, t("heroKicker")),
        h("h1", null, "Omnilimb" + (s && s.ok && s.version ? "  v" + s.version : "")),
        h("p", null, t("heroSubtitle"))),
      h("div", { className: "ex-hero-actions" },
        h("button", { className: "ex-btn ex-btn-primary", onClick: load }, t("refreshAll"))));

    if (!s) return h("div", null, hero);
    if (!s.ok) return h("div", null, hero, h("div", { className: "ex-section" }, h("span", { className: "ex-bad" }, t("statusErr") + ": " + (s.error || "?"))));

    var healthVal, healthCls, ocHint;
    if (!hv) { healthVal = "…"; healthCls = ""; ocHint = ""; }
    else if (hv.ok === false) { healthVal = t("attentionShort"); healthCls = "ex-bad"; ocHint = hv.error || ""; }
    else {
      healthVal = hv.healthy ? t("healthyShort") : t("attentionShort");
      healthCls = hv.healthy ? "ex-ok" : "ex-warn";
      ocHint = hv.openclaw_installed ? (t("healthOk") + (hv.openclaw_version ? " · " + hv.openclaw_version : "")) : t("nativeMode");
    }
    var instCount = (iv && iv.skills) ? iv.skills.length : ((iv && iv.count) || 0);
    var callsTotal = (s.runs && s.runs.total) || 0;
    var upv = upd[0];
    var updCount = (upv && upv.updates) ? Object.keys(upv.updates).filter(function (k) { return upv.updates[k] && upv.updates[k].update_available; }).length : 0;
    var fvv = favs[0];
    var favCount = (fvv && fvv.favorites) ? fvv.favorites.length : 0;

    var stats = h("section", { className: "ex-stats" },
      h(StatCard, { key: "i", label: t("statInstalled"), value: String(instCount), cls: "" }),
      h(StatCard, { key: "c", label: t("statCallsTotal"), value: String(callsTotal), cls: "" }),
      h(StatCard, { key: "u", label: t("statUpdates"), value: String(updCount), cls: updCount > 0 ? "ex-warn" : "" }),
      h(StatCard, { key: "f", label: t("favorite"), value: String(favCount), cls: "" }),
      h(StatCard, { key: "h", label: t("statHealth"), value: healthVal, hint: ocHint, cls: healthCls }));
    return h("div", { className: "ex-page" }, hero, showStats[0] ? stats : null);
  }

  function SearchPanel(props) {
    var t = useTr();
    var isPro = !!(props && props.pro);
    var loc = (SDK.useI18n ? (SDK.useI18n().locale || "en") : "en");
    var q = useState(""); var market = useState("clawhub");
    var category = useState(""); var sort = useState("downloads");
    var page = useState(1);
    var res = useState(null); var loading = useState(false);
    var cats = useState([]);
    var inst = useState({});
    var view = useState("discover");      // "discover" | "results"
    var layout = useState("grid");        // "grid" | "list"
    var disc = useState(exLsSeed("clawhub"));   // seed from localStorage → instant first paint
    var discTab = useState("recommended");
    var discLoading = useState({});       // tab -> bool (per-tab loading)
    var favs = useState([]);              // K: favorite slugs
    var history = useState([]);           // K: recent searches
    var markets = useState(exMarketsSeed());   // seeded with builtin/cached set (no flicker)
    var PAGE = 30;

    function setInst(slug, val) { var cur = Object.assign({}, inst[0]); cur[slug] = val; inst[1](cur); }
    function fmtNum(n) {
      if (n == null) return null;
      n = Number(n); if (isNaN(n)) return null;
      if (n >= 1000000) return (n / 1000000).toFixed(1) + "M";
      if (n >= 1000) return (n / 1000).toFixed(1) + "k";
      return String(n);
    }
    function loadCats(mk) {
      cats[1]([]);
      api("/categories?market=" + mk).then(function (r) { cats[1]((r && r.categories) || []); }).catch(function () { cats[1]([]); });
    }
    function fetchList(opts, cb) {
      var mk = opts.market != null ? opts.market : market[0];
      var cat = opts.category != null ? opts.category : "";
      var so = opts.sort != null ? opts.sort : sort[0];
      var kw = opts.q != null ? opts.q : "";
      var lim = opts.limit || PAGE;
      var pg = opts.page || 1;
      var url = "/search?q=" + encodeURIComponent(kw) + "&market=" + mk + "&limit=" + lim
        + "&page=" + pg + "&sort=" + so + (cat ? "&category=" + encodeURIComponent(cat) : "")
        + (kw ? "" : "&browse=true");
      api(url).then(cb).catch(function (e) { cb({ ok: false, error: String(e) }); });
    }
    var DISC_SORT = { recommended: "relevance", rising: "stars", hot: "downloads", newest: "latest" };
    // Per-tab client cache. Concurrent prefetches use functional state updates so
    // parallel responses don't clobber each other.
    function setDiscTab(tab, r) {
      disc[1](function (prev) {
        var c = Object.assign({}, prev); c[tab] = r;
        if (r && r.ok) exLsSave(market[0], c);   // persist fresh boards for instant repeat open
        return c;
      });
    }
    function setLoad(tab, v) { discLoading[1](function (prev) { var c = Object.assign({}, prev); c[tab] = v; return c; }); }
    function fetchTab(mk, tab, force) {
      setLoad(tab, true);
      return api("/discover?market=" + mk + "&tab=" + tab + (force ? "&force=true" : ""))
        .then(function (r) { setDiscTab(tab, r); })
        .catch(function (e) { setDiscTab(tab, { ok: false, error: String(e) }); })
        .finally(function () { setLoad(tab, false); });
    }
    // Open instantly: load "recommended" first, then prefetch the rest in the
    // background so tab switches are instant. reset=true re-seeds from localStorage
    // for the (possibly new) market so the grid never flashes empty.
    function fetchDiscover(mk, reset) {
      if (reset) disc[1](exLsSeed(mk));
      discTab[1]("recommended");
      fetchTab(mk, "recommended");
      setTimeout(function () {
        ["rising", "hot", "newest"].forEach(function (tab) { fetchTab(mk, tab); });
      }, 350);
    }
    // Tab click: serve from client cache if present, else fetch. force=manual refresh.
    function loadTab(tab, force) {
      tab = tab || "recommended";
      discTab[1](tab);
      if (disc[0][tab] && !force) return;
      fetchTab(market[0], tab, force);
    }
    // Keyword search → list rows.
    function doSearch(opts) {
      opts = opts || {};
      var pg = opts.page || 1;
      page[1](pg); view[1]("results"); layout[1]("list");
      loading[1](true);
      fetchList({ q: (opts.q != null ? opts.q : q[0]), market: market[0], sort: sort[0], page: pg, limit: PAGE },
        function (r) { res[1](r); loading[1](false); refreshHistory(); });
    }
    // Category / "view more" → 3-per-row grid (browse).
    function browseGrid(opts) {
      opts = opts || {};
      var pg = opts.page || 1;
      page[1](pg); view[1]("results"); layout[1]("grid");
      loading[1](true);
      fetchList({ market: market[0], category: (opts.category != null ? opts.category : category[0]),
        sort: (opts.sort != null ? opts.sort : sort[0]), page: pg, limit: 15 },
        function (r) { res[1](r); loading[1](false); });
    }
    useEffect(function () {
      loadCats(market[0]); fetchDiscover(market[0], true);
      api("/favorites").then(function (r) { favs[1]((r && r.favorites) || []); }).catch(function () { });
      api("/search_history").then(function (r) { history[1]((r && r.history) || []); }).catch(function () { });
      api("/markets").then(function (r) { var m = (r && r.markets) || []; if (m.length) { markets[1](m); exMarketsSave(m); } }).catch(function () { });
    }, []);
    function favSlugs() { return (favs[0] || []).map(function (f) { return (f && f.slug) ? f.slug : f; }); }
    function toggleFav(slug, add, sk) {
      var meta = sk ? { name: sk.displayName || sk.name, summary: sk.summary, market: sk.market || market[0], url: sk.url, icon: sk.icon } : null;
      post("/favorites", { slug: slug, add: add, meta: meta }).then(function (r) { favs[1]((r && r.favorites) || []); }).catch(function () { });
    }
    function isFav(slug) { return favSlugs().indexOf(slug) >= 0; }
    function refreshHistory() { api("/search_history").then(function (r) { history[1]((r && r.history) || []); }).catch(function () { }); }
    var scores = useState({});            // Pro-3: slug -> score result (on-demand)
    var scoringAll = useState(false);     // "全部体检" batch in progress
    function setScore(slug, val) { scores[1](function (prev) { var c = Object.assign({}, prev); c[slug] = val; return c; }); }
    function loadScore(slug) {
      setScore(slug, { loading: true });
      api("/skill_score?slug=" + encodeURIComponent(slug))
        .then(function (r) { setScore(slug, r); })
        .catch(function (e) { setScore(slug, { ok: false, error: String(e) }); });
    }
    // "全部体检" — score every result on the current page (concurrency-limited so we
    // don't fire 30 market resolves at once). Reuses the same /skill_score path as the
    // single-skill chip, so the hover breakdown is identical.
    function scoreAll() {
      var list = (res[0] && res[0].skills) || [];
      var queue = list.filter(function (sk) { return sk && sk.slug && !(scores[0][sk.slug] && scores[0][sk.slug].ok); }).map(function (sk) { return sk.slug; });
      if (!queue.length) return;
      scoringAll[1](true);
      queue.forEach(function (slug) { setScore(slug, { loading: true }); });
      var CONC = 4, idx = 0, active = 0;
      function next() {
        if (idx >= queue.length) { if (active === 0) scoringAll[1](false); return; }
        var slug = queue[idx++]; active++;
        api("/skill_score?slug=" + encodeURIComponent(slug))
          .then(function (r) { setScore(slug, r); })
          .catch(function (e) { setScore(slug, { ok: false, error: String(e) }); })
          .finally(function () { active--; next(); });
      }
      for (var i = 0; i < Math.min(CONC, queue.length); i++) next();
    }
    function scoreChip(slug) {
      var sc = scores[0][slug];
      if (!sc) return h("button", { className: "ex-btn", onClick: function () { loadScore(slug); } }, t("scoreRun"));
      if (sc.loading) return h("span", { className: "ex-meta" }, "…");
      if (!sc.ok) return h("span", { className: "ex-meta", title: sc.error || "" }, "?");
      var recoMap = { recommended: t("recoYes"), caution: t("recoCaution"), not_recommended: t("recoNo") };
      var reco = recoMap[sc.recommendation];
      var dims = sc.dimensions || [];
      var pop = h("div", { key: "pop", className: "ex-score-pop" }, [
        h("div", { key: "h", className: "ex-score-pop-head" }, t("scoreTitle") + " · " + (sc.score != null ? sc.score : "?") + "/100 (" + sc.grade + ")"),
        h("div", { key: "rows" }, dims.map(function (d, i) {
          var pct = d.max ? Math.round((d.score / d.max) * 100) : 0;
          return h("div", { key: i, className: "ex-score-pop-row" }, [
            h("span", { key: "n", className: "ex-score-pop-name" }, d.name),
            h("span", { key: "bar", className: "ex-score-pop-bar" }, h("span", { className: "ex-score-pop-fill", style: { width: pct + "%" } })),
            h("span", { key: "s", className: "ex-score-pop-num" }, d.score + "/" + d.max),
          ]);
        })),
        (sc.reliability && sc.reliability.note) ? h("div", { key: "rel", className: "ex-score-pop-rel" }, sc.reliability.note) : null,
      ]);
      return h("span", { className: "ex-score-result ex-score-has-pop", title: "" }, [
        h("span", { key: "g", className: "ex-grade-badge grade-" + sc.grade, style: gradeStyle(sc.grade) }, sc.grade),
        h("span", { key: "s", className: "ex-score-num" }, (sc.score != null ? sc.score + "/100" : "") + (reco ? " · " + reco : "")),
        pop,
      ]);
    }

    function onMarket(v) { market[1](v); category[1](""); q[1](""); loadCats(v); view[1]("discover"); fetchDiscover(v, true); }
    function onCategory(v) {
      category[1](v);
      if (!v) { view[1]("discover"); }
      else { browseGrid({ category: v, sort: "downloads", page: 1 }); }
    }
    function onSort(v) { sort[1](v); if (view[0] === "results") { (layout[0] === "list" ? doSearch : browseGrid)({ sort: v, page: 1 }); } }
    function backToDiscover() { view[1]("discover"); category[1](""); q[1](""); }
    function install(slug) {
      setInst(slug, { state: "installing", elapsed: 0 });
      post("/install", { slug: slug, market: market[0] }).then(function (r) {
        if (!r || !r.ok || !r.job_id) { setInst(slug, { state: "fail", msg: (r && r.error) || "?" }); return; }
        pollInstall(slug, r.job_id);
      }).catch(function (e) { setInst(slug, { state: "fail", msg: String(e) }); });
    }
    function pollInstall(slug, jobId) {
      var tick = function () {
        api("/install_status?id=" + encodeURIComponent(jobId)).then(function (s) {
          if (!s || !s.ok) { setInst(slug, { state: "fail", msg: (s && s.error) || "?" }); return; }
          if (s.state === "done" || s.state === "failed") {
            var res = s.result || {};
            if (s.state === "done" && res.ok) setInst(slug, { state: "ok", msg: (res.version ? "@" + res.version : "") });
            else { var fr = res.friendly || {}; setInst(slug, { state: "fail", msg: (fr.reason || res.error || "?"), fix: fr.fix }); }
            return;
          }
          setInst(slug, { state: "installing", elapsed: s.elapsed_s || 0, stage: s.stage });
          setTimeout(tick, 1000);
        }).catch(function (e) { setInst(slug, { state: "fail", msg: String(e) }); });
      };
      setTimeout(tick, 700);
    }

    var r = res[0];
    var total = (r && r.total) || 0;
    var gridLim = layout[0] === "grid" ? 15 : PAGE;
    var pages = total ? Math.max(1, Math.ceil(total / gridLim)) : ((r && r.skills && r.skills.length === gridLim) ? page[0] + 1 : page[0]);
    var sortOpts = [["relevance", t("sortRelevance")], ["downloads", t("sortDownloads")], ["stars", t("sortStars")], ["latest", t("sortLatest")]];

    function skillRow(sk, i) {
      var stt = inst[0][sk.slug] || {};
      var busy = stt.state === "installing";
      var statusEl = null;
      if (stt.state === "installing") statusEl = h("span", { className: "ex-status-busy" }, t("installing") + (stt.elapsed ? " " + stt.elapsed + "s" : ""));
      else if (stt.state === "ok") statusEl = h("span", { className: "ex-status-ok", title: t("installed") }, "✓");
      else if (stt.state === "fail") statusEl = h("span", { className: "ex-status-bad", title: (stt.msg || "") + (stt.fix ? " — " + stt.fix : "") }, "✗ " + (stt.msg || ""));
      var dl = fmtNum(sk.downloads); var stv = fmtNum(sk.stars);
      var initial = (sk.displayName || sk.slug || "?").charAt(0).toUpperCase();
      return h("div", { key: i, className: "ex-row2" + (sk.verified ? " verified" : "") },
        h("div", { className: "ex-avatar" }, sk.icon ? h("img", { src: sk.icon, onError: function (e) { e.target.style.display = "none"; } }) : initial),
        h("div", { className: "ex-row2-main" },
          h("div", { className: "ex-row2-title" }, [
            h("span", { key: "n", className: "name" }, sk.displayName || sk.slug || "?"),
            sk.verified ? h("span", { key: "vf", className: "ex-badge ex-badge-ok" }, "✓ " + t("verifiedBadge")) : null,
            sk.requires_api_key ? h("span", { key: "ak", className: "ex-badge ex-badge-key" }, "🔑 API Key") : null,
            sk.version ? h("span", { key: "v", className: "ex-badge" }, "v" + sk.version) : null,
          ]),
          sk.summary ? h("div", { className: "ex-row2-desc" }, sk.summary) : null,
          h("div", { className: "ex-row2-sub" }, [
            h("span", { key: "src", className: "ex-row2-src" }, t("from") + " " + srcLabel(sk.source, market[0])),
            sk.url ? h("a", { key: "hp", className: "ex-row2-home", href: sk.url, target: "_blank", rel: "noopener noreferrer", title: t("homepage") }, linkIcon()) : null,
          ])),
        h("div", { className: "ex-row2-meta" }, [
          (stv != null) ? h("span", { key: "s" }, "☆ " + stv) : null,
          (dl != null) ? h("span", { key: "d" }, "⬇ " + dl) : null,
        ]),
        h("div", { className: "ex-row2-actions" }, [
          statusEl,
          h("button", { key: "fv", className: "ex-heart" + (isFav(sk.slug) ? " on" : ""), title: t("favorite"), onClick: function () { toggleFav(sk.slug, !isFav(sk.slug), sk); } }, isFav(sk.slug) ? "♥" : "♡"),
          h("span", { key: "sc" }, scoreChip(sk.slug)),
          h("button", { key: "i", className: "ex-btn ex-btn-solid", onClick: function () { if (!busy) install(sk.slug); }, disabled: busy }, busy ? "…" : t("install")),
        ]));
    }

    function miniCard(sk, i) {
      var stt = inst[0][sk.slug] || {};
      var busy = stt.state === "installing";
      var ok = stt.state === "ok"; var fail = stt.state === "fail";
      var dl = fmtNum(sk.downloads); var stv = fmtNum(sk.stars);
      var initial = (sk.displayName || sk.slug || "?").charAt(0).toUpperCase();
      return h("div", { key: i, className: "ex-mini" + (sk.verified ? " verified" : "") },
        h("div", { className: "ex-mini-head" },
          h("div", { className: "ex-avatar" }, sk.icon ? h("img", { src: sk.icon, onError: function (e) { e.target.style.display = "none"; } }) : initial),
          h("div", { style: { minWidth: 0, flex: 1 } },
            h("div", { className: "ex-mini-title" }, sk.displayName || sk.slug || "?"),
            h("div", { className: "ex-mini-sub" }, (sk.verified ? "✓ " : "") + (dl != null ? "⬇ " + dl + "  " : "") + (stv != null ? "☆ " + stv : ""))),
          h("button", { key: "fav", className: "ex-heart" + (isFav(sk.slug) ? " on" : ""), title: t("favorite"), onClick: function () { toggleFav(sk.slug, !isFav(sk.slug), sk); } }, isFav(sk.slug) ? "♥" : "♡")),
        sk.summary ? h("div", { className: "ex-mini-desc" }, sk.summary) : null,
        h("div", { className: "ex-mini-foot" },
          sk.grade ? h("span", { className: "ex-score-result", title: t("scoreTitle") + (sk.score != null ? ": " + sk.score + "/100" : "") }, [
            h("span", { key: "g", className: "ex-grade-badge grade-" + sk.grade, style: gradeStyle(sk.grade) }, sk.grade),
            (sk.score != null) ? h("span", { key: "s", className: "ex-score-num" }, sk.score + "") : null,
          ]) : scoreChip(sk.slug),
          sk.url ? h("a", { className: "ex-row2-home", href: sk.url, target: "_blank", rel: "noopener noreferrer", title: t("homepage") }, linkIcon()) : h("span", null, ""),
          h("button", { className: "ex-btn ex-btn-solid ex-spacer", title: (fail && stt.msg) ? (stt.msg + (stt.fix ? " — " + stt.fix : "")) : "", onClick: function () { if (!busy) install(sk.slug); }, disabled: busy },
            busy ? (stt.elapsed ? stt.elapsed + "s" : "…") : (ok ? "✓" : (fail ? "✗" : t("install"))))));
    }

    function renderDiscover() {
      var cur = disc[0][discTab[0]];          // active-tab result {ok,skills,cached,age_s,stale}
      var skills = (cur && cur.ok && cur.skills) ? cur.skills : [];
      var tabs = [["recommended", t("discReco")], ["rising", t("discRising")], ["hot", t("discHot")], ["newest", t("discNewest")]];
      var cacheHint = (cur && cur.ok && cur.cached) ? (t("cachedHint") + (cur.age_s != null ? " · " + Math.round(cur.age_s / 60) + "m" : "")) : null;
      var activeLoading = !!discLoading[0][discTab[0]] && !cur;   // only when active tab has no data yet
      return h("div", { style: { marginTop: ".6rem" } },
        h("div", { className: "ex-disc-tabs" }, tabs.map(function (tb) {
          return h("button", { key: tb[0], className: discTab[0] === tb[0] ? "active" : "", onClick: function () { loadTab(tb[0]); } }, tb[1]);
        })),
        h("div", { style: { display: "flex", alignItems: "center", gap: ".6rem", marginTop: ".5rem", justifyContent: "flex-end" } }, [
          cacheHint ? h("span", { key: "ch", className: "ex-meta" }, cacheHint) : null,
          h("button", { key: "rf", className: "ex-btn", onClick: function () { loadTab(discTab[0], true); } }, t("refreshAll")),
        ]),
        activeLoading ? h("div", { className: "ex-empty", style: { textAlign: "center", padding: "1.5rem 0" } }, "…") :
          (cur && !cur.ok ? h("div", { className: "ex-notice" }, cur.error || "?") :
            (skills.length === 0 ? h("div", { className: "ex-empty" }, t("noResults")) :
              h("div", { className: "ex-mini-grid", style: { marginTop: ".5rem" } }, skills.map(miniCard)))),
        (skills.length) ? h("div", { className: "ex-more" },
          h("button", { className: "ex-btn", onClick: function () { var so = DISC_SORT[discTab[0]] || "downloads"; sort[1](so); browseGrid({ category: "", sort: so, page: 1 }); } }, t("viewMore"))) : null);
    }

    return h("div", { className: "ex-section" },
      h("div", { className: "ex-section-title" }, t("searchTitle")),
      h("div", { className: "ex-controls" }, [
          h("select", { key: "mk", value: market[0], onChange: function (e) { onMarket(e.target.value); },
            className: "rounded border bg-transparent px-2 py-1.5 text-sm" },
            ((markets[0] && markets[0].length) ? markets[0] : EX_BUILTIN_MARKETS).map(function (m) {
              return h("option", { key: m.id, value: m.id }, m.label || m.id);
            })),
          h("select", { key: "so", value: sort[0], onChange: function (e) { onSort(e.target.value); },
            className: "rounded border bg-transparent px-2 py-1.5 text-sm" },
            sortOpts.map(function (o) { return h("option", { key: o[0], value: o[0] }, t("sortBy") + ": " + o[1]); })),
          h("div", { key: "in", className: "flex-1 min-w-44" }, field({
            value: q[0], placeholder: t("searchPh"),
            onChange: function (e) { q[1](e.target.value); },
            onKeyDown: function (e) { if (e.key === "Enter") doSearch({ page: 1 }); },
          })),
          h("button", { key: "go", className: "ex-btn ex-btn-primary", onClick: function () { doSearch({ page: 1 }); } }, loading[0] ? "…" : t("search")),
        ]),
        (cats[0] && cats[0].length) ? h("div", { className: "ex-pills", style: { marginTop: ".55rem" } },
          [h("button", { key: "_all", className: category[0] === "" ? "active" : "", onClick: function () { onCategory(""); } }, t("catAll"))].concat(
            cats[0].map(function (c) { return h("button", { key: c, className: category[0] === c ? "active" : "", onClick: function () { onCategory(c); } }, catLabel(c, loc)); }))) : null,
        view[0] === "discover" ? renderDiscover() : null,
        (view[0] === "discover" && history[0] && history[0].length) ? h("div", { className: "ex-pills", style: { marginTop: ".5rem" } },
          [h("span", { key: "_h", className: "ex-meta", style: { marginRight: ".3rem" } }, t("recentSearch") + ":")].concat(
            history[0].slice(0, 8).map(function (hq, i) {
              return h("button", { key: i, onClick: function () { q[1](hq); doSearch({ q: hq, page: 1 }); } }, hq);
            }))) : null,
        view[0] === "results" ? h("div", { className: "mt-3" },
          h("div", { style: { display: "flex", alignItems: "center", gap: ".6rem", marginBottom: ".55rem", flexWrap: "wrap" } },
            h("button", { className: "ex-btn", onClick: backToDiscover }, t("backDiscover")),
            (r && r.stale) ? h("span", { className: "ex-notice" }, "⚠ " + t("cachedNotice")) : null,
            (total) ? h("span", { className: "ex-meta" }, total + " " + t("resultsTotal")) : null,
            (r && r.expanded && r.expanded.length) ? h("span", { className: "ex-badge ex-badge-ok", title: t("alsoSearched") }, "+ " + r.expanded.join(", ")) : null,
            null),
          loading[0] ? h("div", { className: "ex-loadwrap" }, [
            h("div", { key: "bar", className: "ex-loadbar" }),
            h("div", { key: "txt", className: "ex-searching-row" }, [
              h("span", { key: "s", className: "ex-spin" }),
              h("span", { key: "t" }, t("searching")),
            ]),
          ]) : null,
          (r && !r.ok && !loading[0]) ? h("div", { className: "ex-status-bad" }, r.error) : null,
          (r && r.ok) ? h("div", { className: loading[0] ? "ex-dim" : "" },
            (r.skills || []).length === 0 ? (loading[0] ? null : h("div", { className: "ex-empty" }, t("noResults"))) :
              (layout[0] === "list"
                ? h("div", { className: "ex-list" }, (r.skills || []).map(skillRow))
                : h("div", { className: "ex-mini-grid" }, (r.skills || []).map(miniCard)))
          ) : null,
          (r && r.ok && (r.skills || []).length && !loading[0]) ? h("div", { className: "ex-pager" }, [
            h("button", { key: "p", className: "ex-btn", onClick: function () { if (page[0] > 1) (layout[0] === "list" ? doSearch : browseGrid)({ page: page[0] - 1 }); }, disabled: page[0] <= 1 }, t("prev")),
            h("span", { key: "pg", className: "ex-page-ind" }, t("page") + " " + page[0] + " / " + pages),
            h("button", { key: "n", className: "ex-btn", onClick: function () { if (page[0] < pages) (layout[0] === "list" ? doSearch : browseGrid)({ page: page[0] + 1 }); }, disabled: page[0] >= pages }, t("next")),
          ]) : null
        ) : null,
    );
  }

  // One installed skill as a 3-per-row card. "View" opens the full detail page;
  // "Uninstall" removes the skill (with confirm).
  function InstalledCard(props) {
    var t = props.t, sk = props.sk, onView = props.onView, onUninstall = props.onUninstall, busy = props.busy, upd = props.upd;
    var slug = sk.slug || sk.name;
    var initial = (slug || "?").charAt(0).toUpperCase();
    var canUpd = upd && upd.update_available;
    return h("div", { className: "ex-mini ex-mini-clickable", onClick: function () { onView(sk); }, title: t("viewDetail") },
      h("div", { className: "ex-mini-head" },
        h("div", { className: "ex-card-icon" }, initial),
        h("div", { style: { minWidth: 0, flex: 1 } },
          h("div", { className: "ex-mini-title" }, sk.displayName || slug),
          h("div", { className: "ex-mini-sub" }, (sk.version ? "v" + sk.version + "  " : "") + (sk.market || "")))),
      h("div", { className: "ex-badges" }, [
        sk.has_skill_md ? h("span", { key: "s", className: "ex-badge" }, "SKILL.md") : null,
        h("span", { key: "c", className: "ex-badge" }, t("calls") + ": " + (sk.calls || 0)),
        canUpd ? h("span", { key: "u", className: "ex-badge ex-badge-key", title: t("updateAvail") }, "↑ " + (upd.current || "?") + "→" + (upd.latest || "?")) : null,
      ]),
      h("div", { className: "ex-mini-foot" }, [
        h("button", { key: "v", className: "ex-btn ex-btn-primary", onClick: function (e) { e.stopPropagation(); onView(sk); } }, t("viewDetail")),
        h("button", { key: "u", className: "ex-btn ex-btn-danger ex-spacer", onClick: function (e) { e.stopPropagation(); if (!busy) onUninstall(sk); }, disabled: busy }, busy ? t("uninstalling") : t("uninstall")),
      ]));
  }

  // Full-page skill detail: header + file picker + Markdown preview/edit + save.
  function SkillDetailPage(props) {
    var t = props.t, slug = props.slug, onBack = props.onBack;
    var detail = useState(null);
    var sel = useState("");
    var content = useState("");
    var saveMsg = useState("");
    var mode = useState("preview");
    var runs = useState(null);
    var creds = useState(null);
    var credVals = useState({});
    var credMsg = useState("");
    var newKey = useState("");
    var reqs = useState(null);
    var smoke = useState(null);
    var smoking = useState(false);
    var score = useState(null);
    var scoring = useState(false);
    var scoreOpen = useState(true);     // collapse toggle for the score breakdown
    var converting = useState({});      // mode -> bool (in-flight POST /convert)
    var convReport = useState(null);    // last POST /convert result (report | pro | error)
    function loadFile(path) {
      sel[1](path); content[1](""); saveMsg[1]("");
      api("/skill_file?slug=" + encodeURIComponent(slug) + "&path=" + encodeURIComponent(path))
        .then(function (r) { content[1](r && r.ok ? (r.content || "") : ("[" + ((r && r.error) || "?") + "]")); })
        .catch(function (e) { content[1]("[" + String(e) + "]"); });
    }
    useEffect(function () {
      api("/skill?slug=" + encodeURIComponent(slug)).then(function (r) {
        detail[1](r);
        if (r && r.ok) {
          var files = r.files || [];
          var md = null;
          for (var i = 0; i < files.length; i++) { if (files[i].toLowerCase() === "skill.md") { md = files[i]; break; } }
          if (md && r.skill_md != null) { sel[1](md); content[1](r.skill_md); }
          else if (files.length) { loadFile(files[0]); }
        }
      }).catch(function (e) { detail[1]({ ok: false, error: String(e) }); });
      // Pro-1: run history (Pro-gated; pro_required surfaces an upsell note).
      api("/skill_runs?slug=" + encodeURIComponent(slug) + "&limit=50")
        .then(function (r) { runs[1](r); }).catch(function (e) { runs[1]({ ok: false, error: String(e) }); });
      // A: declared API keys + which are set (values never returned).
      api("/skill_credentials?slug=" + encodeURIComponent(slug))
        .then(function (r) { creds[1](r); }).catch(function () { });
      // C: environment readiness (bins + keys).
      api("/skill_requirements?slug=" + encodeURIComponent(slug))
        .then(function (r) { reqs[1](r); }).catch(function () { });
      // Pro-3: auto-load the health score (no button — show it directly).
      scoring[1](true);
      api("/skill_score?slug=" + encodeURIComponent(slug))
        .then(function (r) { score[1](r); }).catch(function (e) { score[1]({ ok: false, error: String(e) }); })
        .finally(function () { scoring[1](false); });
    }, []);
    function runSmoke() {
      smoking[1](true); smoke[1](null);
      post("/skill_smoketest", { slug: slug })
        .then(function (r) { smoke[1](r); }).catch(function (e) { smoke[1]({ ok: false, error: String(e) }); })
        .finally(function () { smoking[1](false); });
    }
    function renderReqs() {
      var rq = reqs[0];
      if (!rq || !rq.ok) return null;
      var hasChecks = rq.checks && rq.checks.length;
      var hasCaps = rq.capabilities && rq.capabilities.length;
      if (!hasChecks && !hasCaps) return null;
      return h("div", { key: "reqs", className: "ex-runs" }, [
        h("div", { key: "h", className: "ex-runs-title" }, t("envCheck") + " " + (rq.ready ? "✓" : "⚠")),
        hasCaps ? h("div", { key: "caps", className: "ex-badges", style: { marginBottom: ".4rem" } },
          [h("span", { key: "_l", className: "ex-meta" }, t("scoreCaps") + ": ")].concat(rq.capabilities.map(function (c, i) { return h("span", { key: i, className: "ex-badge ex-badge-key" }, c); }))) : null,
        hasChecks ? h("div", { key: "l", style: { display: "flex", flexDirection: "column", gap: ".25rem" } }, rq.checks.map(function (c, i) {
          return h("div", { key: i, className: "ex-run-row" }, [
            h("span", { key: "ok", className: c.ok ? "ex-status-ok" : "ex-status-bad" }, c.ok ? "✓" : "✗"),
            h("span", { key: "ty", className: "ex-badge" }, c.type === "bin" ? t("envBin") : t("envKey")),
            h("span", { key: "nm", className: "ex-run-entry" }, c.name),
            !c.ok ? h("span", { key: "hh", className: "ex-meta" }, c.type === "bin" ? t("envBinMissing") : t("envKeyMissing")) : null,
          ]);
        })) : null,
      ]);
    }
    function renderSmoke() {
      var sm = smoke[0];
      var msg = null;
      if (sm) {
        if (sm.ok) {
          msg = h("div", { key: "r", className: "ex-status-ok" }, "✓ " + t("smokeOk") + (sm.entry ? " (" + sm.entry + ")" : ""));
        } else if (sm.kind === "doc") {
          msg = h("div", { key: "r", className: "ex-status-info" }, "ℹ️ " + ((sm.friendly && sm.friendly.reason) || "") + ((sm.friendly && sm.friendly.fix) ? " — " + sm.friendly.fix : ""));
        } else {
          // Build a meaningful failure line (never a bare "✗ ?").
          var detail = (sm.friendly && sm.friendly.reason)
            || sm.error
            || (sm.stderr && String(sm.stderr).trim())
            || (sm.stdout && String(sm.stdout).trim())
            || "";
          detail = String(detail).replace(/\s+/g, " ").slice(0, 200);
          var line = "✗ ";
          if (sm.exit_code != null) line += t("smokeExit") + " " + sm.exit_code + (detail ? " — " + detail : "");
          else line += (detail || t("smokeNeedsArgs"));
          if (!detail && sm.exit_code != null) line += " — " + t("smokeNeedsArgs");
          msg = h("div", { key: "r", className: "ex-status-bad" }, [
            h("div", { key: "l" }, line),
            h("div", { key: "h", className: "ex-meta", style: { marginTop: ".25rem" } }, t("smokeHint")),
          ]);
        }
      }
      return h("div", { key: "smoke", className: "ex-runs" }, [
        h("div", { key: "h", className: "ex-runs-title", style: { display: "flex", alignItems: "center", gap: ".5rem" } }, [
          h("span", { key: "t" }, t("smokeTitle")),
          h("button", { key: "b", className: "ex-btn ex-btn-primary", onClick: runSmoke, disabled: smoking[0] }, smoking[0] ? t("running") : t("smokeRun")),
        ]),
        msg,
      ]);
    }
    function renderScore() {
      var sc = score[0];
      var head = h("div", { key: "h", className: "ex-runs-title", style: { display: "flex", alignItems: "center", gap: ".5rem" } }, [
        h("span", { key: "t" }, t("scoreTitle")),
        (scoring[0] && !sc) ? h("span", { key: "ld", className: "ex-spin" }) : null,
        (sc && sc.ok) ? h("span", { key: "bg", className: "ex-grade-badge grade-" + sc.grade, style: gradeStyle(sc.grade) }, sc.grade) : null,
        (sc && sc.ok) ? h("span", { key: "nm", className: "ex-score-num" }, sc.score + "/100 · " +
          (sc.recommendation === "recommended" ? t("recoYes") : (sc.recommendation === "caution" ? t("recoCaution") : t("recoNo")))) : null,
        (sc && sc.ok) ? h("button", { key: "tg", type: "button", className: "ex-term-toggle", style: { marginLeft: "auto" },
          title: scoreOpen[0] ? t("collapse") : t("expand"),
          onClick: function () { scoreOpen[1](!scoreOpen[0]); } }, scoreOpen[0] ? "▾" : "▸") : null,
      ]);
      var body = null;
      if (sc && !sc.ok) {
        body = h("div", { key: "e", className: "ex-status-bad" }, sc.error || "?");
      } else if (sc && sc.ok && scoreOpen[0]) {
        body = h("div", { key: "c", className: "ex-score", style: { marginTop: ".5rem" } }, [
          (sc.capabilities && sc.capabilities.length) ? h("div", { key: "caps", className: "ex-badges", style: { marginBottom: ".5rem" } },
            [h("span", { key: "_l", className: "ex-meta" }, t("scoreCaps") + ": ")].concat(sc.capabilities.map(function (c, i) { return h("span", { key: i, className: "ex-badge ex-badge-key" }, c); }))) : null,
          h("div", { key: "dims", style: { display: "flex", flexDirection: "column", gap: ".4rem" } }, (sc.dimensions || []).map(function (d, i) {
            var pct = d.max ? Math.round(d.score / d.max * 100) : 0;
            return h("div", { key: i, className: "ex-dim" }, [
              h("div", { key: "l", className: "ex-dim-head" }, [h("span", { key: "n" }, d.name), h("span", { key: "v", className: "ex-meta" }, d.score + "/" + d.max)]),
              h("div", { key: "bar", className: "ex-dim-bar" }, h("div", { className: "ex-dim-fill", style: { width: pct + "%" } })),
              (d.reasons && d.reasons.length) ? h("div", { key: "r", className: "ex-meta" }, d.reasons.join(" · ")) : null,
            ]);
          })),
          (sc.blockers && sc.blockers.length) ? h("div", { key: "bl", className: "ex-status-bad", style: { marginTop: ".4rem" } }, "⛔ " + sc.blockers.join("；")) : null,
        ]);
      }
      return h("div", { key: "score", className: "ex-runs" }, [head, body]);
    }
    function reloadCreds() { api("/skill_credentials?slug=" + encodeURIComponent(slug)).then(creds[1]).catch(function () { }); }
    function setCredVal(k, v) { var c = Object.assign({}, credVals[0]); c[k] = v; credVals[1](c); }
    function saveCred(key, val) {
      credMsg[1](t("saving"));
      post("/skill_credentials", { slug: slug, key: key, value: val })
        .then(function (r) { credMsg[1](r && r.ok ? t("saved") : t("saveFail")); setCredVal(key, ""); reloadCreds(); })
        .catch(function () { credMsg[1](t("saveFail")); });
    }
    function clearCred(key) { post("/skill_credentials", { slug: slug, key: key, value: "" }).then(function () { reloadCreds(); }).catch(function () { }); }
    function renderCreds() {
      var cv = creds[0];
      if (!cv || !cv.ok) return null;
      var declared = cv.declared || []; var setKeys = cv.set || [];
      var keys = declared.slice();
      setKeys.forEach(function (k) { if (keys.indexOf(k) < 0) keys.push(k); });
      return h("div", { key: "creds", className: "ex-runs" }, [
        h("div", { key: "h", className: "ex-runs-title" }, "🔑 " + t("credentials")),
        h("div", { key: "hint", className: "ex-meta", style: { marginBottom: ".5rem", lineHeight: 1.5 } }, t("credHint")),
        keys.length === 0 ? h("div", { key: "n", className: "ex-meta" }, t("credNone")) : null,
        h("div", { key: "rows", style: { display: "flex", flexDirection: "column", gap: ".4rem" } }, keys.map(function (k) {
          var isSet = setKeys.indexOf(k) >= 0;
          return h("div", { key: k, className: "ex-cred-row" }, [
            h("span", { key: "k", className: "ex-cred-key" }, k),
            isSet ? h("span", { key: "b", className: "ex-badge ex-badge-ok" }, "✓ " + t("credSet")) : null,
            h("input", { key: "i", type: "password", className: "ex-cred-input", placeholder: isSet ? "••••••" : t("credValuePh"), value: credVals[0][k] || "", onChange: function (e) { setCredVal(k, e.target.value); } }),
            h("button", { key: "s", className: "ex-btn ex-btn-primary", onClick: function () { saveCred(k, credVals[0][k] || ""); } }, t("credSave")),
            isSet ? h("button", { key: "c", className: "ex-btn ex-btn-danger", onClick: function () { clearCred(k); } }, t("credClear")) : null,
          ]);
        })),
        h("div", { key: "add", className: "ex-cred-row" }, [
          h("input", { key: "nk", className: "ex-cred-input", placeholder: t("credKeyPh"), value: newKey[0], onChange: function (e) { newKey[1](e.target.value); } }),
          h("input", { key: "nv", type: "password", className: "ex-cred-input", placeholder: t("credValuePh"), value: credVals[0]["__new"] || "", onChange: function (e) { setCredVal("__new", e.target.value); } }),
          h("button", { key: "a", className: "ex-btn", onClick: function () { var k = (newKey[0] || "").trim(); if (!k) return; saveCred(k, credVals[0]["__new"] || ""); newKey[1](""); setCredVal("__new", ""); } }, t("credAdd")),
        ]),
        credMsg[0] ? h("div", { key: "m", className: "ex-meta" }, credMsg[0]) : null,
      ]);
    }
    function fmtTs(ts) { try { return new Date((ts || 0) * 1000).toLocaleString(); } catch (e) { return String(ts); } }
    function renderRuns() {
      var rv = runs[0];
      if (!rv) return h("div", { key: "runs", className: "ex-runs" }, h("div", { className: "ex-meta" }, "…"));
      if (!rv.ok) {
        return null;
      }
      var sm = rv.summary || {}; var list = rv.runs || [];
      return h("div", { key: "runs", className: "ex-runs" }, [
        h("div", { key: "h", className: "ex-runs-title" }, t("runHistory")),
        h("div", { key: "sm", className: "ex-runs-summary" }, [
          h("span", { key: "t" }, t("runsTotal") + ": " + (sm.total || 0)),
          h("span", { key: "sr" }, t("runsSuccess") + ": " + (sm.success_rate != null ? Math.round(sm.success_rate * 100) + "%" : "—")),
          h("span", { key: "av" }, t("runsAvg") + ": " + (sm.avg_ms != null ? sm.avg_ms + "ms" : "—")),
          h("span", { key: "ls" }, t("runsLast") + ": " + (sm.last_ts ? fmtTs(sm.last_ts) : "—")),
        ]),
        list.length === 0 ? h("div", { key: "e", className: "ex-empty" }, t("noRuns")) :
          h("div", { key: "l", className: "ex-runs-list" }, list.map(function (r, i) {
            return h("div", { key: i, className: "ex-run-row" }, [
              h("span", { key: "ok", className: r.ok ? "ex-status-ok" : "ex-status-bad" }, r.ok ? "✓" : "✗"),
              h("span", { key: "en", className: "ex-run-entry" }, r.entry || "?"),
              h("span", { key: "d", className: "ex-meta" }, (r.duration_ms != null ? r.duration_ms + "ms" : "")),
              h("span", { key: "ts", className: "ex-meta" }, fmtTs(r.ts)),
              r.error ? h("span", { key: "er", className: "ex-status-bad ex-run-err" }, String(r.error)) : null,
            ]);
          })),
      ]);
    }
    // Per-skill conversion from the detail page (Req 11.2): two modes hit the
    // same backend route, which thin-wraps the converter tool. No conversion
    // logic lives here (Req 11.12). An in-flight request disables both buttons
    // and surfaces a busy state (Req 11.9).
    function setConv(cmode, v) {
      converting[1](function (prev) { var c = Object.assign({}, prev); c[cmode] = v; return c; });
    }
    function convBusy() { var b = converting[0]; return !!(b.deterministic || b.ai_curated); }
    function runConvert(cmode) {
      setConv(cmode, true);
      convReport[1](null);
      post("/convert", { slug: slug, mode: cmode })
        .then(function (r) {
          r = r || { ok: false, error: "?" };
          convReport[1](r);
          // On a successful (non pro-gated) convert, notify the library so it
          // auto-refreshes without a manual reload.
          if (r.ok && !r.pro_required) { try { window.dispatchEvent(new CustomEvent("omnilimb:converted")); } catch (e) {} }
        })
        .catch(function (e) { convReport[1]({ ok: false, error: String(e) }); })
        .finally(function () { setConv(cmode, false); });
    }
    // Render the conversion report in place below the action row (Req 11.7):
    // per-skill status, the mode actually used, whether it fell back from AI to
    // deterministic, the loop iteration count, remediations, and output path.
    function renderConvert() {
      var r = convReport[0];
      if (!r) return null;
      // Pro-gated → upgrade affordance instead of results (Req 11.8).
      if (r.pro_required) {
        return h("div", { key: "conv", className: "ex-notice", style: { marginTop: ".7rem" } }, [
          h("span", { key: "msg" }, t("convProOnly")),
          r.upgrade ? h("a", { key: "up", href: r.upgrade, target: "_blank", rel: "noopener noreferrer", style: { marginLeft: ".4rem" } }, r.upgrade) : null,
        ]);
      }
      // Non-Pro failure → show the returned error (Req 11.10).
      if (!r.ok && !(r.results && r.results.length)) {
        return h("div", { key: "conv", className: "ex-status-bad", style: { marginTop: ".7rem" } }, t("convErr") + ": " + (r.error || "?"));
      }
      var statusLabel = {
        passed: t("convPassed"), failed: t("convFailed"), unchanged: t("convUnchanged"),
        reconverted: t("convReconverted"), "skipped (exists)": t("convSkipped"),
      };
      var modeLabel = { deterministic: t("convModeDet"), ai_curated: t("convModeAi") };
      var results = r.results || [];
      return h("div", { key: "conv", style: { marginTop: ".7rem", display: "flex", flexDirection: "column", gap: ".4rem" } },
        results.map(function (res, i) {
          var loop = res.loop || {};
          var rem = loop.remediations || [];
          var st = statusLabel[res.status] != null ? statusLabel[res.status] : (res.status || "?");
          var usedMode = modeLabel[res.mode] != null ? modeLabel[res.mode] : (res.mode || "?");
          return h("div", { key: i, style: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: ".8rem", padding: ".6rem .7rem", border: "1px solid var(--border, rgba(127,127,127,.3))", borderRadius: ".5rem", cursor: "default" } }, [
            h("div", { key: "info", style: { flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: ".35rem" } }, [
              h("div", { key: "hd", style: { display: "flex", alignItems: "center", gap: ".5rem", flexWrap: "wrap" } }, [
                h("strong", { key: "slug" }, res.slug || res.name || "?"),
                h("span", { key: "stat", className: "ex-badge " + (res.ok ? "ex-badge-ok" : "ex-badge-key") }, t("convStatus") + ": " + st),
                h("span", { key: "md", className: "ex-badge ex-badge-key" }, t("convMode") + ": " + usedMode),
                res.fell_back ? h("span", { key: "fb", className: "ex-badge" }, t("convFellBack")) : null,
              ]),
              h("div", { key: "meta", className: "ex-meta", style: { display: "flex", flexWrap: "wrap", gap: ".9rem" } }, [
                h("span", { key: "it" }, t("convIters") + ": " + (loop.iterations != null ? loop.iterations : 0)),
                h("span", { key: "fx" }, t("convFixes") + ": " + (rem.length ? rem.join(", ") : "—")),
              ]),
              res.output_path ? h("div", { key: "out", className: "ex-meta", style: { wordBreak: "break-all" } }, t("convOut") + ": " + res.output_path) : null,
              (!res.ok && res.reason) ? h("div", { key: "rsn", className: "ex-status-bad" }, res.reason) : null,
            ]),
            res.ok ? h("button", { key: "view", className: "ex-btn ex-btn-primary", style: { flex: "0 0 auto" }, onClick: function () { try { window.dispatchEvent(new CustomEvent("omnilimb:gototab", { detail: "convert" })); } catch (e) {} } }, t("convGoLib")) : null,
          ]);
        }));
    }
    function save() {
      saveMsg[1](t("saving"));
      post("/skill_file", { slug: slug, path: sel[0], content: content[0] })
        .then(function (r) { saveMsg[1](r && r.ok ? t("saved") : (t("saveFail") + ": " + ((r && r.error) || "?"))); })
        .catch(function (e) { saveMsg[1](t("saveFail") + ": " + String(e)); });
    }
    var d = detail[0];
    return h("div", { className: "ex-section" },
      h("div", { className: "ex-detail-bar" },
        h("button", { className: "ex-btn", onClick: onBack }, t("backInstalled")),
        h("div", { className: "ex-detail-name" }, slug),
        null),
      renderConvert(),
      !d ? h("div", { className: "ex-empty" }, t("loadingStatus")) :
        (!d.ok ? h("div", { className: "ex-status-bad" }, d.error || "?") :
          h("div", { className: "ex-detail" }, [
            (d.meta && (d.meta.description || d.meta.homepage || (d.meta.requires_bins && d.meta.requires_bins.length))) ?
              h("div", { key: "mt", className: "ex-detail-meta" }, [
                d.meta.description ? h("p", { key: "ds", className: "ex-detail-desc" }, d.meta.description) : null,
                h("div", { key: "row", className: "ex-meta", style: { display: "flex", flexWrap: "wrap", gap: ".8rem" } }, [
                  d.meta.homepage ? h("a", { key: "hp", className: "ex-link", href: d.meta.homepage, target: "_blank", rel: "noopener noreferrer" }, t("homepage")) : null,
                  h("span", { key: "dep" }, t("deps") + ": " + ((d.meta.requires_bins && d.meta.requires_bins.length) ? d.meta.requires_bins.join(", ") : t("noDeps"))),
                  d.dir ? h("span", { key: "dir", style: { fontFamily: "ui-monospace, monospace", fontSize: ".72rem" } }, d.dir) : null,
                ]),
              ]) : null,
            renderScore(),
            renderReqs(),
            renderRuns(),
            renderSmoke(),
            h("div", { key: "ctl", className: "ex-controls", style: { marginTop: ".6rem" } }, [
              h("select", { key: "f", value: sel[0], onChange: function (e) { loadFile(e.target.value); } },
                (d.files || []).map(function (f) { return h("option", { key: f, value: f }, f); })),
              isMarkdown(sel[0]) ? h("button", { key: "tg", className: "ex-btn", onClick: function () { mode[1](mode[0] === "preview" ? "edit" : "preview"); } }, mode[0] === "preview" ? t("edit") : t("preview")) : null,
              h("button", { key: "sv", className: "ex-btn ex-btn-primary ex-spacer", onClick: save }, t("save")),
            ]),
            (mode[0] === "preview" && isMarkdown(sel[0]))
              ? h("div", { key: "bd", className: "omnilimb-md ex-detail-body", dangerouslySetInnerHTML: { __html: mdToHtml(content[0]) } })
              : h("textarea", { key: "bd", className: "ex-detail-edit", value: content[0], onChange: function (e) { content[1](e.target.value); }, rows: 22 }),
            saveMsg[0] ? h("div", { key: "sm", className: "ex-meta" }, saveMsg[0]) : null,
          ])));
  }

  function InstalledPanel() {
    var t = useTr();
    var d = useState(null);
    var selected = useState("");        // slug being viewed; "" = grid
    var uninstalling = useState({});    // slug -> bool
    var updates = useState({});         // slug -> {current, latest, update_available}
    function load() {
      d[1](null);
      api("/installed").then(d[1]).catch(function (e) { d[1]({ ok: false, error: String(e) }); });
      loadUpdates(false);
    }
    // D: update-available check (stale-while-revalidate). If the backend is still
    // computing in the background, poll once more shortly so badges fill in.
    function loadUpdates(retried) {
      api("/skill_updates").then(function (r) {
        updates[1]((r && r.updates) || {});
        if (r && r.refreshing && !retried) { setTimeout(function () { loadUpdates(true); }, 7000); }
      }).catch(function () { });
    }
    useEffect(function () { load(); }, []);
    function setUn(slug, v) { uninstalling[1](function (prev) { var c = Object.assign({}, prev); c[slug] = v; return c; }); }
    function doUninstall(sk) {
      var slug = sk.slug || sk.name;
      if (!window.confirm(t("confirmUninstall").replace("%s", slug))) return;
      setUn(slug, true);
      post("/uninstall", { slug: slug })
        .then(function (r) { if (r && r.ok) { load(); } else { window.alert(t("uninstallFail") + ": " + ((r && r.error) || "?")); } })
        .catch(function (e) { window.alert(t("uninstallFail") + ": " + String(e)); })
        .finally(function () { setUn(slug, false); });
    }
    // Full detail page replaces the grid (a "new page" within the tab).
    if (selected[0]) {
      return h(SkillDetailPage, { t: t, slug: selected[0], onBack: function () { selected[1](""); load(); } });
    }
    function doExport() {
      api("/export_skills").then(function (r) {
        try {
          var blob = new Blob([JSON.stringify(r, null, 2)], { type: "application/json" });
          var u = URL.createObjectURL(blob);
          var a = document.createElement("a"); a.href = u; a.download = "omnilimb-skills.json";
          document.body.appendChild(a); a.click(); document.body.removeChild(a);
          setTimeout(function () { URL.revokeObjectURL(u); }, 1000);
        } catch (e) { /* ignore */ }
      }).catch(function () { });
    }
    function doImport(file) {
      if (!file) return;
      var reader = new FileReader();
      reader.onload = function () {
        var manifest;
        try { manifest = JSON.parse(reader.result); } catch (e) { window.alert("invalid JSON"); return; }
        post("/import_skills", { manifest: manifest }).then(function (r) {
          var oks = (r.results || []).filter(function (x) { return x.ok; }).length;
          window.alert(t("importDone") + ": " + oks + "/" + ((r.results || []).length));
          load();
        }).catch(function (e) { window.alert(String(e)); });
      };
      reader.readAsText(file);
    }
    var v = d[0];
    return h("div", { className: "ex-section" },
      h("div", { className: "ex-controls", style: { justifyContent: "space-between", marginBottom: ".7rem" } },
        h("div", { className: "ex-section-title", style: { margin: 0 } }, t("installedTitle")),
        h("div", { style: { display: "flex", gap: ".4rem", alignItems: "center" } }, [
          h("button", { key: "ex", className: "ex-btn", onClick: doExport }, t("exportSkills")),
          h("label", { key: "im", className: "ex-btn", style: { cursor: "pointer" } }, [
            t("importSkills"),
            h("input", { key: "f", type: "file", accept: ".json,application/json", style: { display: "none" }, onChange: function (e) { doImport(e.target.files && e.target.files[0]); e.target.value = ""; } }),
          ]),
          h("button", { key: "rf", className: "ex-btn", onClick: load }, t("refresh")),
        ])),
      !v ? h("div", { className: "ex-empty" }, t("loadingStatus")) :
        (!v.ok ? h("div", { className: "ex-status-bad" }, v.error || "?") :
          ((v.skills || []).length === 0 ? h("div", { className: "ex-empty" }, t("noInstalled")) :
            h("div", { className: "ex-mini-grid" }, (v.skills || []).map(function (sk, i) {
              var slug = sk.slug || sk.name;
              return h(InstalledCard, { key: i, sk: sk, t: t, busy: !!uninstalling[0][slug], upd: updates[0][slug],
                onView: function (s) { selected[1](s.slug || s.name); },
                onUninstall: doUninstall });
            })))),
      (v && v.ok) ? h("div", { className: "ex-meta", style: { marginTop: ".7rem" } }, t("workspace") + ": " + (v.workspace || "")) : null,
    );
  }

  // Favorites tab — its own page. Lists rich favorite entries as cards with a
  // link icon, an Install action (same job + poll flow as Search) and a Remove.
  function FavoritesPanel() {
    var t = useTr();
    var favs = useState(null);          // array of rich entries (or slug strings)
    var inst = useState({});            // slug -> {state,elapsed,msg,fix}
    function load() {
      favs[1](null);
      api("/favorites").then(function (r) { favs[1]((r && r.favorites) || []); }).catch(function () { favs[1]([]); });
    }
    useEffect(function () { load(); }, []);
    function setInst(slug, val) { inst[1](function (prev) { var c = Object.assign({}, prev); c[slug] = val; return c; }); }
    function remove(slug) {
      post("/favorites", { slug: slug, add: false }).then(function (r) { favs[1]((r && r.favorites) || []); }).catch(function () { });
    }
    function install(slug, mk) {
      setInst(slug, { state: "installing", elapsed: 0 });
      post("/install", { slug: slug, market: mk || "clawhub" }).then(function (r) {
        if (!r || !r.ok || !r.job_id) { setInst(slug, { state: "fail", msg: (r && r.error) || "?" }); return; }
        pollInstall(slug, r.job_id);
      }).catch(function (e) { setInst(slug, { state: "fail", msg: String(e) }); });
    }
    function pollInstall(slug, jobId) {
      var tick = function () {
        api("/install_status?id=" + encodeURIComponent(jobId)).then(function (s) {
          if (!s || !s.ok) { setInst(slug, { state: "fail", msg: (s && s.error) || "?" }); return; }
          if (s.state === "done" || s.state === "failed") {
            var res = s.result || {};
            if (s.state === "done" && res.ok) setInst(slug, { state: "ok", msg: (res.version ? "@" + res.version : "") });
            else { var fr = res.friendly || {}; setInst(slug, { state: "fail", msg: (fr.reason || res.error || "?"), fix: fr.fix }); }
            return;
          }
          setInst(slug, { state: "installing", elapsed: s.elapsed_s || 0, stage: s.stage });
          setTimeout(tick, 1000);
        }).catch(function (e) { setInst(slug, { state: "fail", msg: String(e) }); });
      };
      setTimeout(tick, 700);
    }
    function card(f, i) {
      var slug = (f && f.slug) ? f.slug : f;
      var name = (f && f.name) || slug;
      var summary = f && f.summary;
      var url = f && f.url;
      var mk = (f && f.market) || "clawhub";
      var icon = f && f.icon;
      var initial = (name || "?").charAt(0).toUpperCase();
      var stt = inst[0][slug] || {};
      var busy = stt.state === "installing";
      var ok = stt.state === "ok"; var fail = stt.state === "fail";
      return h("div", { key: i, className: "ex-mini" },
        h("div", { className: "ex-mini-head" },
          h("div", { className: "ex-avatar" }, icon ? h("img", { src: icon, onError: function (e) { e.target.style.display = "none"; } }) : initial),
          h("div", { style: { minWidth: 0, flex: 1 } },
            h("div", { className: "ex-mini-title" }, name),
            h("div", { className: "ex-mini-sub" }, mk)),
          h("button", { key: "rm", className: "ex-heart on", title: t("favRemove"), onClick: function () { remove(slug); } }, "♥")),
        summary ? h("div", { className: "ex-mini-desc" }, summary) : null,
        h("div", { className: "ex-mini-foot" }, [
          url ? h("a", { key: "lk", className: "ex-row2-home", href: url, target: "_blank", rel: "noopener noreferrer", title: t("homepage") }, linkIcon()) : h("span", { key: "lk" }, ""),
          h("button", { key: "i", className: "ex-btn ex-btn-solid ex-spacer", title: (fail && stt.msg) ? (stt.msg + (stt.fix ? " — " + stt.fix : "")) : "", onClick: function () { if (!busy) install(slug, mk); }, disabled: busy },
            busy ? (stt.elapsed ? stt.elapsed + "s" : "…") : (ok ? "✓" : (fail ? "✗" : t("install")))),
        ]));
    }
    var list = favs[0];
    return h("div", { className: "ex-section" },
      h("div", { className: "ex-controls", style: { justifyContent: "space-between", marginBottom: ".7rem" } },
        h("div", { className: "ex-section-title", style: { margin: 0 } }, t("myFavorites")),
        h("button", { className: "ex-btn", onClick: load }, t("refresh"))),
      list == null ? h("div", { className: "ex-empty" }, t("loadingStatus")) :
        (list.length === 0 ? h("div", { className: "ex-empty" }, t("favEmpty")) :
          h("div", { className: "ex-mini-grid" }, list.map(card))));
  }

  function RunPanel() {
    var t = useTr();
    var lang = useState("python"); var code = useState("print(6 * 7)");
    var out = useState(null); var busy = useState(false);
    function run() {
      busy[1](true); out[1](null);
      post("/runtime", { lang: lang[0], code: code[0] })
        .then(out[1]).catch(function (e) { out[1]({ ok: false, error: String(e) }); })
        .finally(function () { busy[1](false); });
    }
    var o = out[0];
    return h("div", { className: "ex-section" },
      h("div", { className: "ex-section-title" }, t("runtimeTitle")),
      h("div", { className: "ex-controls" },
        h("select", { key: "l", value: lang[0], onChange: function (e) { lang[1](e.target.value); } },
          ["python", "node", "bash", "ruby", "powershell"].map(function (x) { return h("option", { key: x, value: x }, x); })),
        h("button", { key: "run", className: "ex-btn ex-btn-primary ex-spacer", onClick: run, disabled: busy[0] }, busy[0] ? t("running") : t("run"))),
      h("textarea", { value: code[0], onChange: function (e) { code[1](e.target.value); }, rows: 6, style: { width: "100%", marginTop: ".6rem", fontFamily: "ui-monospace, monospace", fontSize: ".8rem" } }),
      o ? pre(o.ok ? (o.stdout || "") + (o.stderr ? "\n[stderr]\n" + o.stderr : "") : "error: " + (o.error || "?")) : null,
    );
  }

  function AuditPanel() {
    var t = useTr();
    var data = useState(null);
    var tool = useState(""); var status = useState("");
    function load(opts) {
      opts = opts || {};
      var tl = opts.tool != null ? opts.tool : tool[0];
      var stt = opts.status != null ? opts.status : status[0];
      data[1](null);
      var url = "/audit?limit=300" + (tl ? "&tool=" + encodeURIComponent(tl) : "") + (stt ? "&ok=" + stt : "");
      api(url).then(data[1]).catch(function (e) { data[1]({ ok: false, error: String(e) }); });
    }
    useEffect(function () { load(); }, []);
    function fmtTs(ts) { try { return new Date((ts || 0) * 1000).toLocaleString(); } catch (e) { return String(ts); } }
    function exportJson() {
      var recs = (data[0] && data[0].records) || [];
      try {
        var blob = new Blob([JSON.stringify(recs, null, 2)], { type: "application/json" });
        var u = URL.createObjectURL(blob);
        var a = document.createElement("a"); a.href = u; a.download = "omnilimb-audit.json";
        document.body.appendChild(a); a.click(); document.body.removeChild(a);
        setTimeout(function () { URL.revokeObjectURL(u); }, 1000);
      } catch (e) { /* ignore */ }
    }
    var d = data[0];
    if (!d) return h("div", { className: "ex-section" }, h("div", { className: "ex-section-title" }, t("auditTitle")), h("div", { className: "ex-empty" }, t("loadingStatus")));
    if (!d.ok) return h("div", { className: "ex-section" },
      h("div", { className: "ex-section-title" }, t("auditTitle")),
      h("div", { className: "ex-notice" }, d.error || "?"));
    var recs = d.records || [];
    return h("div", { className: "ex-section" },
      h("div", { className: "ex-section-title" }, t("auditTitle") + " (" + recs.length + ")"),
      h("div", { className: "ex-controls" },
        h("select", { key: "tl", value: tool[0], onChange: function (e) { tool[1](e.target.value); load({ tool: e.target.value }); } },
          [h("option", { key: "_a", value: "" }, t("filterTool") + ": " + t("statusAll"))].concat((d.tools || []).map(function (x) { return h("option", { key: x, value: x }, x); }))),
        h("select", { key: "st", value: status[0], onChange: function (e) { status[1](e.target.value); load({ status: e.target.value }); } }, [
          h("option", { key: "a", value: "" }, t("filterStatus") + ": " + t("statusAll")),
          h("option", { key: "o", value: "true" }, t("statusOk")),
          h("option", { key: "f", value: "false" }, t("statusFail")),
        ]),
        h("button", { key: "rf", className: "ex-btn", onClick: function () { load(); } }, t("refresh")),
        h("button", { key: "ex", className: "ex-btn ex-spacer", onClick: exportJson, disabled: recs.length === 0 }, t("export"))),
      !d.enabled ? h("div", { className: "ex-notice", style: { marginTop: ".5rem" } }, t("auditDisabled")) : null,
      recs.length === 0 ? h("div", { className: "ex-empty", style: { marginTop: ".6rem" } }, t("noAudit")) :
        h("div", { style: { marginTop: ".7rem", display: "flex", flexDirection: "column", gap: ".3rem" } }, recs.map(function (r, i) {
          return h("div", { key: i, className: "ex-row" },
            h("span", { key: "ok", className: r.ok ? "ex-status-ok" : "ex-status-bad" }, r.ok ? "✓" : "✗"),
            h("span", { key: "tl", style: { fontWeight: 600 } }, r.tool || "?"),
            r.backend ? h("span", { key: "bk", className: "ex-badge" }, r.backend) : null,
            h("span", { key: "ts", className: "ex-meta" }, fmtTs(r.ts)),
            r.error ? h("span", { key: "er", className: "ex-status-bad", style: { overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "100%" } }, String(r.error)) : null,
          );
        })),
    );
  }

  function SettingsPanel() {
    var t = useTr();
    var cfg = useState(null);
    var form = useState({});
    var msg = useState("");
    var health = useState(null);
    var mkts = useState([]);
    // A: per-skill API-key configuration, moved here from the detail page.
    var installed = useState([]);
    var credSlug = useState("");
    var creds = useState(null);      // {ok, declared, set}
    var credVals = useState({});     // key -> input value
    var credNewKey = useState("");
    var credMsg = useState("");
    var showStats = useState(exShowStats());   // UI-only top stat-card visibility
    var proView = useState(false);   // toggle the Pro intro page
    var status = useState(null);     // GET /status (pro, license, upgrade_url)
    var licKey = useState("");        // license key input
    var licMsg = useState("");        // activation result message
    function loadCfg() { api("/settings").then(function (r) { cfg[1](r); if (r && r.ok) form[1](Object.assign({}, r.settings)); }).catch(function (e) { cfg[1]({ ok: false, error: String(e) }); }); }
    function loadHealth() { health[1](null); api("/health").then(health[1]).catch(function (e) { health[1]({ ok: false, error: String(e) }); }); }
    useEffect(function () {
      loadCfg(); loadHealth();
      api("/status").then(status[1]).catch(function () { });
      api("/markets").then(function (r) { mkts[1]((r && r.markets) || []); }).catch(function () { });
      api("/installed").then(function (r) { installed[1]((r && r.skills) || []); }).catch(function () { });
    }, []);
    function setF(k, v) { var c = Object.assign({}, form[0]); c[k] = v; form[1](c); }
    function save() {
      msg[1](t("saving"));
      post("/settings", { settings: form[0] })
        .then(function (r) { msg[1](r && r.ok ? t("saved") : (t("saveFail") + ": " + ((r && r.error) || "?"))); loadCfg(); })
        .catch(function (e) { msg[1](t("saveFail") + ": " + String(e)); });
    }
    // --- credentials helpers ---
    function loadCreds(slug) {
      creds[1](null); credVals[1]({}); credNewKey[1](""); credMsg[1]("");
      if (!slug) return;
      api("/skill_credentials?slug=" + encodeURIComponent(slug)).then(creds[1]).catch(function () { creds[1]({ ok: false }); });
    }
    function onPickSkill(slug) { credSlug[1](slug); loadCreds(slug); }
    function setCredVal(k, v) { var c = Object.assign({}, credVals[0]); c[k] = v; credVals[1](c); }
    function saveCred(key, val) {
      credMsg[1](t("saving"));
      post("/skill_credentials", { slug: credSlug[0], key: key, value: val })
        .then(function (r) { credMsg[1](r && r.ok ? t("saved") : t("saveFail")); setCredVal(key, ""); loadCreds(credSlug[0]); })
        .catch(function () { credMsg[1](t("saveFail")); });
    }
    function clearCred(key) { post("/skill_credentials", { slug: credSlug[0], key: key, value: "" }).then(function () { loadCreds(credSlug[0]); }).catch(function () { }); }
    // --- field/control helpers ---
    function toggle(key) {
      return h("label", { className: "ex-switch" }, [
        h("input", { key: "i", type: "checkbox", checked: !!form[0][key], onChange: function (e) { setF(key, e.target.checked); } }),
        h("span", { key: "t", className: "ex-switch-track" }),
      ]);
    }
    function fieldRow(key, label, control, hint) {
      return h("div", { key: key, className: "ex-set-field" }, [
        h("span", { key: "l", className: "ex-set-label" }, label),
        h("div", { key: "c", className: "ex-set-control" }, control),
        hint ? h("div", { key: "h", className: "ex-set-hint" }, hint) : null,
      ]);
    }
    function renderCredSection() {
      var list = installed[0] || [];
      var cv = creds[0];
      var body = null;
      if (credSlug[0] && cv && cv.ok) {
        var declared = cv.declared || []; var setKeys = cv.set || [];
        var keys = declared.slice();
        setKeys.forEach(function (k) { if (keys.indexOf(k) < 0) keys.push(k); });
        body = h("div", { key: "body", style: { display: "flex", flexDirection: "column", gap: ".4rem", marginTop: ".55rem" } }, [
          keys.length === 0 ? h("div", { key: "n", className: "ex-meta" }, t("credNone")) : null,
          h("div", { key: "rows", style: { display: "flex", flexDirection: "column", gap: ".4rem" } }, keys.map(function (k) {
            var isSet = setKeys.indexOf(k) >= 0;
            return h("div", { key: k, className: "ex-cred-row" }, [
              h("span", { key: "k", className: "ex-cred-key" }, k),
              isSet ? h("span", { key: "b", className: "ex-badge ex-badge-ok" }, "✓ " + t("credSet")) : null,
              h("input", { key: "i", type: "password", className: "ex-cred-input", placeholder: isSet ? "••••••" : t("credValuePh"), value: credVals[0][k] || "", onChange: function (e) { setCredVal(k, e.target.value); } }),
              h("button", { key: "s", className: "ex-btn ex-btn-primary", onClick: function () { saveCred(k, credVals[0][k] || ""); } }, t("credSave")),
              isSet ? h("button", { key: "c", className: "ex-btn ex-btn-danger", onClick: function () { clearCred(k); } }, t("credClear")) : null,
            ]);
          })),
          h("div", { key: "add", className: "ex-cred-row" }, [
            h("input", { key: "nk", className: "ex-cred-input", placeholder: t("credKeyPh"), value: credNewKey[0], onChange: function (e) { credNewKey[1](e.target.value); } }),
            h("input", { key: "nv", type: "password", className: "ex-cred-input", placeholder: t("credValuePh"), value: credVals[0]["__new"] || "", onChange: function (e) { setCredVal("__new", e.target.value); } }),
            h("button", { key: "a", className: "ex-btn", onClick: function () { var k = (credNewKey[0] || "").trim(); if (!k) return; saveCred(k, credVals[0]["__new"] || ""); credNewKey[1](""); setCredVal("__new", ""); } }, t("credAdd")),
          ]),
          credMsg[0] ? h("div", { key: "m", className: "ex-meta" }, credMsg[0]) : null,
        ]);
      }
      return h("div", { className: "ex-runs", style: { marginTop: ".8rem" } }, [
        h("div", { key: "h", className: "ex-runs-title" }, "🔑 " + t("credSkillTitle")),
        h("div", { key: "hint", className: "ex-meta", style: { marginBottom: ".5rem", lineHeight: 1.5 } }, t("credSectionHint")),
        list.length === 0 ? h("div", { key: "none", className: "ex-meta" }, t("noInstalled")) :
          h("select", { key: "pick", className: "ex-cred-input", style: { flex: "0 0 auto", minWidth: "18rem", maxWidth: "100%" }, value: credSlug[0], onChange: function (e) { onPickSkill(e.target.value); } },
            [h("option", { key: "_", value: "" }, t("credSkillPickPh"))].concat(list.map(function (sk) {
              var slug = sk.slug || sk.name; return h("option", { key: slug, value: slug }, sk.displayName || slug);
            }))),
        body,
      ]);
    }
    // --- Pro / license helpers ---
    function activateLicense() {
      var key = (licKey[0] || "").trim();
      post("/activate_license", { key: key }).then(function (r) {
        if (r && r.ok && r.valid) {
          licMsg[1](t("proActivated"));
          api("/status").then(status[1]).catch(function () { });
          try { window.dispatchEvent(new CustomEvent("omnilimb:license")); } catch (e) { }
        } else {
          licMsg[1]((r && r.error) || t("proActivateFail"));
        }
      }).catch(function (e) { licMsg[1](String(e)); });
    }
    function deactivateLicense() {
      post("/activate_license", { key: "" }).then(function () {
        api("/status").then(status[1]).catch(function () { });
        try { window.dispatchEvent(new CustomEvent("omnilimb:license")); } catch (e) { }
      }).catch(function () { });
    }
    function renderProPage() {
      var sv = status[0];
      return h("div", { className: "ex-section" }, [
        h("div", { key: "back", className: "ex-controls", style: { marginBottom: ".7rem" } },
          h("button", { className: "ex-btn", onClick: function () { proView[1](false); } }, t("proBack"))),
        h("div", { key: "title", className: "ex-section-title" }, t("proTitle")),
        h("div", { key: "intro", className: "ex-meta", style: { marginBottom: ".5rem", lineHeight: 1.5 } }, t("proIntro")),
        h("div", { key: "plan", className: "ex-meta", style: { marginBottom: ".7rem" } }, t("proCurrentPlan") + ": " + (sv ? sv.license : "…")),
        h("div", { key: "ftitle", className: "ex-runs-title", style: { marginBottom: ".4rem" } }, t("proFeaturesTitle")),
        h("ul", { key: "feats", className: "ex-meta", style: { margin: "0 0 .8rem", paddingLeft: "1.1rem", lineHeight: 1.7 } }, [
          h("li", { key: "f1" }, t("proFeatureConvert")),
          h("li", { key: "f2" }, t("proFeatureAi")),
          h("li", { key: "f3" }, t("proFeatureScoreAll")),
          h("li", { key: "f4" }, t("proFeatureAgent")),
          h("li", { key: "f5" }, t("proFeaturePacks")),
          h("li", { key: "f6" }, t("proFeatureUpdate")),
          h("li", { key: "f7" }, t("proFeatureRuns")),
        ]),
        h("div", { key: "buy", style: { marginBottom: ".8rem" } },
          h("button", { className: "ex-btn ex-btn-primary", onClick: function () { window.open((sv && sv.upgrade_url) || "https://your-store.example.com", "_blank", "noopener"); } }, t("proBuyNow"))),
        h("div", { key: "act", className: "ex-cred-row", style: { display: "flex", gap: ".4rem", flexWrap: "wrap", alignItems: "center" } }, [
          h("input", { key: "k", className: "ex-cred-input", style: { minWidth: "18rem" }, placeholder: t("proKeyPh"), value: licKey[0], onChange: function (e) { licKey[1](e.target.value); } }),
          h("button", { key: "a", className: "ex-btn ex-btn-primary", onClick: activateLicense }, t("proActivate")),
          (sv && sv.pro) ? h("button", { key: "d", className: "ex-btn ex-btn-danger", onClick: deactivateLicense }, t("credClear")) : null,
        ]),
        licMsg[0] ? h("div", { key: "m", className: "ex-meta", style: { marginTop: ".4rem" } }, licMsg[0]) : null,
      ]);
    }
    var hv = health[0];
    var marketOpts = ((mkts[0] && mkts[0].length) ? mkts[0] : [{ id: "clawhub", label: "ClawHub" }, { id: "skillhub", label: "SkillHub.cn" }]);
    var sv = status[0];
    return h("div", { className: "ex-section" },
      h("div", { className: "ex-section-title" }, t("settingsTitle")),
      null,
      !cfg[0] ? h("div", { className: "ex-empty" }, t("loadingStatus")) :
        h("div", { className: "ex-set-form" }, [
          fieldRow("showstats", t("fieldShowStats"),
            h("label", { className: "ex-switch" }, [
              h("input", { key: "i", type: "checkbox", checked: showStats[0], onChange: function (e) { var v = e.target.checked; showStats[1](v); exSetShowStats(v); } }),
              h("span", { key: "t", className: "ex-switch-track" }),
            ]),
            t("showStatsHint")),
          fieldRow("backend", t("statBackend"),
            h("select", { value: form[0].backend || "auto", onChange: function (e) { setF("backend", e.target.value); } },
              [["auto", "auto"], ["cli", "cli"], ["native", "native"]].map(function (o) { return h("option", { key: o[0], value: o[0] }, o[1]); })),
            t("backendHint")),
          fieldRow("market", t("defaultMarket"),
            h("select", { value: form[0].market || "clawhub", onChange: function (e) { setF("market", e.target.value); } },
              marketOpts.map(function (m) { return h("option", { key: m.id, value: m.id }, m.label || m.id); })),
            t("marketHint")),
          fieldRow("audit_log", t("fieldAudit"), toggle("audit_log"), t("auditHint")),
          fieldRow("cache_enabled", t("fieldCache"), toggle("cache_enabled"), t("cacheHint")),
          fieldRow("ttl", t("fieldTtl"),
            h("input", { type: "number", className: "ex-cred-input", style: { maxWidth: "10rem" }, value: form[0].discover_ttl_s || 0, onChange: function (e) { setF("discover_ttl_s", parseInt(e.target.value || "0", 10)); } }),
            t("ttlHint")),
          fieldRow("ws", t("workspace"),
            h("input", { className: "ex-cred-input", placeholder: "~/.openclaw/workspace", value: form[0].workspace || "", onChange: function (e) { setF("workspace", e.target.value); } }),
            t("workspaceHint")),
          h("div", { key: "sv", className: "ex-set-save", style: { display: "flex", justifyContent: "flex-end", alignItems: "center", gap: ".6rem", flexWrap: "wrap" } }, [
            msg[0] ? h("span", { key: "m", className: "ex-meta" }, msg[0] + " · " + t("needRestart")) : null,
            h("button", { key: "b", className: "ex-btn ex-btn-primary", onClick: save }, t("save")),
          ]),
        ]),
      renderCredSection(),
      h("div", { className: "ex-runs", style: { marginTop: ".8rem" } }, [
        h("div", { key: "h", className: "ex-runs-title", style: { display: "flex", alignItems: "center", gap: ".5rem" } }, [
          h("span", { key: "t" }, t("diagTitle")),
          h("button", { key: "r", className: "ex-btn", onClick: loadHealth }, t("recheck")),
        ]),
        !hv ? h("div", { key: "l", className: "ex-meta" }, "…") :
          (!hv.ok ? h("div", { key: "e", className: "ex-status-bad" }, hv.error || "?") :
            h("div", { key: "c", style: { display: "flex", flexDirection: "column", gap: ".25rem" } }, (hv.checks || []).map(function (c, i) {
              return h("div", { key: i, className: "ex-run-row" }, [
                h("span", { key: "ok", className: c.ok ? "ex-status-ok" : "ex-status-bad" }, c.ok ? "✓" : "✗"),
                h("span", { key: "n", className: "ex-run-entry" }, c.name),
                h("span", { key: "d", className: "ex-meta" }, c.detail || ""),
              ]);
            }))),
      ]));
  }

  // The "更多" manual — a pre-written, sectioned, bilingual documentation page
  // rendered in a slide-in panel (not a chat bubble). Static, instant, 0 token.
  // Returns [{id, title, md?, topics?}]; `topics` sections render clickable
  // marketplace-search chips instead of markdown.
  function exManualSections(loc) {
    var cn = String(loc || "").slice(0, 2) === "zh";
    if (cn) return [
      { id: "start", title: "快速上手", md: [
        "# 技能管家 · 说明书",
        "技能管家是「**接入 Hermes**」面板里的助手：插件原生、**不消耗 LLM token** 的确定性助手。你可以**点快捷动作**、**打命令**，或**用人话提问**，它就帮你把已装技能的体检、推荐、诊断、审计这些事做掉。",
        "## 怎么用（三选一）",
        "1. 点下面的**快捷动作**按钮（体检 / 推荐 / 诊断 / 扫审计）。",
        "2. 在输入框打 `/` 弹出**命令列表**，用 ↑↓ 选、Enter/Tab 确认，例如 `/推荐 github`、`/诊断 技能名`。",
        "3. 直接**用人话问**：「我的技能有没有问题」「为什么 xxx 老失败」，它会自动判断你要做什么。",
      ].join("\n") },
      { id: "features", title: "能做什么", md: [
        "## 技能管家能帮你做四件事",
        "### 体检已装技能",
        "扫描所有已装技能的运行记录，按成功率给 ✅ 正常 / ⚠️ 注意 / ⛔ 异常。每行 = 技能 + 调用次数 + 成功率 + 平均耗时，一眼看清哪些在掉链子。",
        "### 推荐",
        "按关键词从市场挑出值得装的几个，给 A–D 等级和「推荐 / 谨慎 / 不推荐」结论。例如 `推荐 github`、`推荐 pdf`。",
        "### 诊断",
        "看某个技能的运行记录、最近失败原因，并按顺序提示怎么修：",
        "- ⛔ **缺命令行依赖** → 装那个命令（如 `git` / `ffmpeg`）。",
        "- 🔑 **缺 API Key** → 到该技能详情页「API Key / 凭据」填上。",
        "- 都齐还失败 → 多半是参数用法或上游服务问题，看失败行里的具体错误。",
        "用 `诊断` 看全部，或 `诊断 技能名` 只看某一个。",
        "### 扫审计",
        "归纳审计日志里最近的失败，按工具聚合，定位是网络 / 依赖 / 凭据 哪一环出问题（需在「设置」开启审计日志）。",
      ].join("\n") },
      { id: "commands", title: "快捷指令", md: [
        "## 命令速查",
        "在下面输入框直接输入，或点下方按钮试一下。支持 `/` 前缀，中英文都行：",
        "- `体检` — 体检所有已装技能",
        "- `推荐 <关键词>` — 按关键词推荐技能（如 `推荐 github`、`推荐 pdf`）",
        "- `诊断` / `诊断 <技能名>` — 诊断日志、找失败原因",
        "- `审计` — 扫描审计日志里的失败并归纳",
        "- `帮助` / `说明` — 打开本说明书",
      ].join("\n"), intro: "点一下直接执行：", cmds: [
        { label: "体检", intent: "health" },
        { label: "推荐 github", intent: "recommend", q: "github" },
        { label: "推荐 pdf", intent: "recommend", q: "pdf" },
        { label: "推荐 浏览器", intent: "recommend", q: "浏览器" },
        { label: "诊断", intent: "diagnose" },
        { label: "扫审计", intent: "audit" },
      ] },
      { id: "about", title: "关于", md: [
        "## 它和上方终端的关系",
        "上方 **终端** 是真正「接入 Hermes」的地方：让大脑 **零额外消耗地驱动 OpenClaw 技能**、跑真实命令。技能管家只读取这些运行产生的记录帮你体检、诊断 —— **终端干活，管家帮你看懂结果、做决策**。所以可以把终端收起来，专心和管家对话。",
        "## 隐私与消耗",
        "技能管家全程 **不调用大模型、零 token**，数据（运行记录、审计、凭据）都存在本地，凭据值脱敏、不回显。",
      ].join("\n") },
    ];
    // English (fallback for all non-zh locales)
    return [
      { id: "start", title: "Quick start", md: [
        "# Skill Butler · Manual",
        "The Skill Butler lives in the **Connect Hermes** panel: a plugin-native, **zero-LLM-token** deterministic assistant. Tap a quick action, type a command, or just ask in plain language — it health-checks, recommends, diagnoses and audits your installed skills for you.",
        "## How to use (pick one)",
        "1. Tap a **quick action** button (health / recommend / diagnose / audit).",
        "2. Type `/` in the box to open the **command list**; use ↑↓ to move, Enter/Tab to pick — e.g. `/recommend github`, `/diagnose <skill>`.",
        "3. Or **just ask**: \"are my skills ok\", \"why does xxx keep failing\" — it figures out what you mean.",
      ].join("\n") },
      { id: "features", title: "What it does", md: [
        "## The butler does four things",
        "### Health-check installed skills",
        "Scans run history and rates each skill ✅ / ⚠️ / ⛔ by success rate. Each row = skill + calls + success rate + avg latency.",
        "### Recommend",
        "Picks worthwhile skills by keyword, with an A–D grade and a recommend / caution / avoid verdict — e.g. `recommend github`, `recommend pdf`.",
        "### Diagnose",
        "Reads a skill's run history and recent failures, then tells you how to fix, in order:",
        "- ⛔ **Missing CLI dependency** → install it (e.g. `git` / `ffmpeg`).",
        "- 🔑 **Missing API key** → set it on the skill's detail page (API keys / credentials).",
        "- All present but still failing → likely argument usage or an upstream issue; read the specific error.",
        "Use `diagnose` for all, or `diagnose <skill>` for one.",
        "### Scan audit",
        "Summarises recent audit-log failures grouped by tool to pinpoint network / deps / credentials (enable the audit log in Settings).",
      ].join("\n") },
      { id: "commands", title: "Commands", md: [
        "## Command cheat sheet",
        "Type in the box below, or tap a button. A leading `/` works too, in English or Chinese:",
        "- `health` — health-check all installed skills",
        "- `recommend <keyword>` — recommend by keyword (e.g. `recommend github`)",
        "- `diagnose` / `diagnose <skill>` — diagnose logs and find failure causes",
        "- `audit` — scan the audit log for failures",
        "- `help` / `manual` — open this manual",
      ].join("\n"), intro: "Tap to run:", cmds: [
        { label: "health", intent: "health" },
        { label: "recommend github", intent: "recommend", q: "github" },
        { label: "recommend pdf", intent: "recommend", q: "pdf" },
        { label: "recommend browser", intent: "recommend", q: "browser" },
        { label: "diagnose", intent: "diagnose" },
        { label: "scan audit", intent: "audit" },
      ] },
      { id: "about", title: "About", md: [
        "## Relationship to the terminal above",
        "The **terminal** is where Hermes actually connects: the brain drives OpenClaw skills with **zero extra inference cost** and runs real commands. The butler only reads the resulting records to health-check and diagnose — **the terminal does the work, the butler helps you read the results**.",
        "## Privacy & cost",
        "The butler **never calls an LLM (zero tokens)**; all data (run history, audit, credentials) stays local, and credential values are masked and never echoed.",
      ].join("\n") },
    ];
  }

  // Slash-command palette for the butler input (typing "/" pops the list).
  function exSlashCmds(loc) {
    var cn = String(loc || "").slice(0, 2) === "zh";
    if (cn) return [
      { cmd: "体检", run: "health", arg: false, desc: "体检所有已装技能" },
      { cmd: "推荐", run: "recommend", arg: true, desc: "按关键词推荐（/推荐 github）" },
      { cmd: "诊断", run: "diagnose", arg: true, desc: "诊断日志（/诊断 或 /诊断 技能名）" },
      { cmd: "审计", run: "audit", arg: false, desc: "扫描审计里的失败" },
      { cmd: "帮助", run: "about", arg: false, desc: "打开说明书" },
    ];
    return [
      { cmd: "health", run: "health", arg: false, desc: "health-check all skills" },
      { cmd: "recommend", run: "recommend", arg: true, desc: "recommend by keyword (/recommend github)" },
      { cmd: "diagnose", run: "diagnose", arg: true, desc: "diagnose logs (/diagnose or /diagnose <skill>)" },
      { cmd: "audit", run: "audit", arg: false, desc: "scan audit failures" },
      { cmd: "help", run: "about", arg: false, desc: "open the manual" },
    ];
  }

  function AgentPanel(props) {
    var t = useTr();
    var loc = (SDK.useI18n ? (SDK.useI18n().locale || "en") : "en");
    var useRef = SDK.hooks.useRef;
    var st = useState(null);
    var conn = useState("connecting");   // connecting | open | closed
    var termOpen = useState(false);      // embedded terminal collapsed by default — focus the butler
    var msg = useState("");
    var msgs = useState([]);             // {role:'user'|'bot', text}
    var sending = useState(false);
    var manualOpen = useState(false);    // "更多" opens the manual doc panel
    var manualSec = useState("start");   // active manual section
    var slashSel = useState(0);          // highlighted slash-command index
    var proPrompt = useState(false);     // non-Pro user tried to use the input
    var hostRef = useRef(null);
    var termRef = useRef(null);
    var wsRef = useRef(null);
    var paneRef = useRef(null);
    var inputRef = useRef(null);
    useEffect(function () { api("/status").then(st[1]).catch(function () { st[1]({ ok: false }); }); }, []);

    function pushMsg(role, text) { msgs[1](function (prev) { return prev.concat([{ role: role, text: text }]); }); }
    var QA_INTENT = { };
    // The bottom "Skill butler" — talks to the deterministic /assistant endpoint
    // (plugin-native, no LLM/terminal noise) and renders readable Markdown replies.
    function ask(intent, qtext, label) {
      pushMsg("user", label || qtext || intent);
      sending[1](true);
      post("/assistant", { intent: intent, q: qtext || "", slug: "", market: "" })
        .then(function (r) { pushMsg("bot", (r && r.reply) || (r && r.error) || "(无回复)"); })
        .catch(function (e) { pushMsg("bot", "出错：" + String(e)); })
        .finally(function () { sending[1](false); });
    }
    function sendComposer() { var v = (msg[0] || "").trim(); if (v) { ask("", v, v); msg[1](""); } }
    useEffect(function () { var p = paneRef.current; if (p) p.scrollTop = p.scrollHeight; }, [msgs[0].length, sending[0]]);
    // When the terminal is expanded back, nudge a resize so xterm re-fits its host.
    useEffect(function () {
      if (!termOpen[0]) return;
      var tm = setTimeout(function () { try { window.dispatchEvent(new Event("resize")); } catch (e) { } }, 60);
      return function () { clearTimeout(tm); };
    }, [termOpen[0]]);

    var pro = (st[0] && st[0].pro) || !!(props && props.pro);
    // Embedded terminal (top) — the real agent over /api/pty, for running commands.
    useEffect(function () {
      if (!st[0] || !pro) return;
      if (typeof window === "undefined" || !window.Terminal) return;
      var host = hostRef.current;
      if (!host) return;
      var term = new window.Terminal({
        cursorBlink: true, fontSize: 13, scrollback: 4000,
        fontFamily: "ui-monospace, 'Cascadia Mono', 'JetBrains Mono', Consolas, monospace",
        theme: { background: "#0d1f1f", foreground: "#e6f0ea", cursor: "#e6f0ea" },
      });
      termRef.current = term;
      var fit = null;
      try { fit = new window.FitAddon.FitAddon(); term.loadAddon(fit); } catch (e) { fit = null; }
      term.open(host);
      try { if (fit) fit.fit(); } catch (e) { }
      var unmounting = false, dataDisp = null, ws = null, ro = null;
      var channel = (window.crypto && crypto.randomUUID) ? crypto.randomUUID() : ("ex-" + Date.now().toString(36));
      function refit() { try { if (fit) fit.fit(); } catch (e) { } var s = wsRef.current; if (s && s.readyState === 1) s.send("\x1b[RESIZE:" + term.cols + ";" + term.rows + "]"); }
      SDK.buildWsUrl("/api/pty", { channel: channel }).then(function (url) {
        if (unmounting) return;
        ws = new WebSocket(url); ws.binaryType = "arraybuffer"; wsRef.current = ws;
        ws.onopen = function () { conn[1]("open"); ws.send("\x1b[RESIZE:" + term.cols + ";" + term.rows + "]"); };
        ws.onmessage = function (ev) { if (typeof ev.data === "string") term.write(ev.data); else term.write(new Uint8Array(ev.data)); };
        ws.onclose = function () { wsRef.current = null; if (!unmounting) conn[1]("closed"); };
        ws.onerror = function () { if (!unmounting) conn[1]("closed"); };
        dataDisp = term.onData(function (d) { if (ws.readyState === 1) ws.send(d); });
        term.onResize(function () { var s = wsRef.current; if (s && s.readyState === 1) s.send("\x1b[RESIZE:" + term.cols + ";" + term.rows + "]"); });
      }).catch(function () { if (!unmounting) conn[1]("closed"); });
      try { ro = new ResizeObserver(function () { refit(); }); ro.observe(host); } catch (e) { ro = null; }
      var onWinResize = function () { refit(); };
      window.addEventListener("resize", onWinResize);
      var tmr = setTimeout(refit, 250);
      return function () {
        unmounting = true; clearTimeout(tmr);
        window.removeEventListener("resize", onWinResize);
        if (ro) { try { ro.disconnect(); } catch (e) { } }
        if (dataDisp) { try { dataDisp.dispose(); } catch (e) { } }
        if (wsRef.current) { try { wsRef.current.close(); } catch (e) { } }
        wsRef.current = null;
        try { term.dispose(); } catch (e) { }
        termRef.current = null;
      };
    }, [pro]);

    var noTerm = (typeof window !== "undefined" && !window.Terminal);
    var bubbles = msgs[0].map(function (m, i) {
      return m.role === "user"
        ? h("div", { key: i, className: "ex-bubble ex-bubble-user" }, m.text)
        : h("div", { key: i, className: "ex-bubble ex-bubble-bot omnilimb-md", dangerouslySetInnerHTML: { __html: mdToHtml(m.text) } });
    });
    if (sending[0]) bubbles = bubbles.concat([h("div", { key: "_typing", className: "ex-bubble ex-bubble-bot" }, "…")]);
    // Slash-command palette state (shared by the input keydown handler + the menu).
    var _sv = msg[0] || "";
    var slashList = (_sv.charAt(0) === "/" && _sv.indexOf(" ") < 0)
      ? exSlashCmds(loc).filter(function (c) { return c.cmd.toLowerCase().indexOf(_sv.slice(1).toLowerCase()) === 0; })
      : [];
    var slashIdx = slashList.length ? Math.min(slashSel[0], slashList.length - 1) : 0;
    function pickSlash(c) {
      if (!c) return;
      if (c.arg) { msg[1]("/" + c.cmd + " "); try { inputRef.current && inputRef.current.focus(); } catch (e) { } }
      else { msg[1](""); ask(c.run, "", c.cmd); }
    }
    function onInputKey(e) {
      if (slashList.length) {
        if (e.key === "ArrowDown") { e.preventDefault(); slashSel[1]((slashIdx + 1) % slashList.length); return; }
        if (e.key === "ArrowUp") { e.preventDefault(); slashSel[1]((slashIdx - 1 + slashList.length) % slashList.length); return; }
        if (e.key === "Tab") { e.preventDefault(); pickSlash(slashList[slashIdx]); return; }
        if (e.key === "Escape") { e.preventDefault(); msg[1](""); return; }
        if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); pickSlash(slashList[slashIdx]); return; }
      }
      if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendComposer(); }
    }
    return h("div", { className: "ex-section ex-agent" },
      h("div", { className: "ex-agent-bar" }, [
        h("div", { key: "t", className: "ex-section-title", style: { margin: 0 } }, t("agentTitle")),
        h("span", { key: "c", className: "ex-conn ex-conn-" + conn[0] }, "● " + t("agentTermLabel") + " " + t("conn_" + conn[0])),
        noTerm ? null : h("button", { key: "tg", type: "button", className: "ex-term-toggle",
          title: t(termOpen[0] ? "termHide" : "termShow"),
          onClick: function () { termOpen[1](!termOpen[0]); } },
          (termOpen[0] ? "▾ " : "▸ ") + t(termOpen[0] ? "termHide" : "termShow")),
      ]),
      noTerm ? h("div", { className: "ex-notice" }, t("agentTermUnavail")) :
        h("div", { key: "term", ref: hostRef, className: "ex-term-host" + (termOpen[0] ? "" : " ex-term-collapsed") }),
      h("div", { className: "ex-assist" }, manualOpen[0] ? (function () {
        var secs = exManualSections(loc);
        var active = secs[0];
        for (var si = 0; si < secs.length; si++) { if (secs[si].id === manualSec[0]) { active = secs[si]; break; } }
        return [
          h("div", { key: "mh", className: "ex-assist-head ex-manual-head" }, [
            h("span", { key: "t" }, "📖 " + t("manualTitle")),
            h("button", { key: "x", type: "button", className: "ex-term-toggle", style: { marginLeft: "auto" }, onClick: function () { manualOpen[1](false); } }, "✕ " + t("manualClose")),
          ]),
          h("div", { key: "tabs", className: "ex-manual-tabs" }, secs.map(function (s) {
            return h("button", { key: s.id, type: "button", className: manualSec[0] === s.id ? "active" : "", onClick: function () { manualSec[1](s.id); } }, s.title);
          })),
          h("div", { key: "doc", className: "ex-manual" },
            active.cmds ? [
              active.md ? h("div", { key: "md", className: "omnilimb-md", dangerouslySetInnerHTML: { __html: mdToHtml(active.md) } }) : null,
              active.intro ? h("div", { key: "i", className: "ex-meta", style: { margin: ".6rem 0 .4rem" } }, active.intro) : null,
              h("div", { key: "chips", className: "ex-pills" }, active.cmds.map(function (c, ix) {
                return h("button", { key: ix, type: "button", onClick: function () { manualOpen[1](false); ask(c.intent, c.q || "", c.label); } }, c.label);
              })),
            ] : h("div", { key: "md", className: "omnilimb-md", dangerouslySetInnerHTML: { __html: mdToHtml(active.md) } })),
        ];
      })() : [
        h("div", { key: "hd", className: "ex-assist-head" }, "🛠 " + t("assistTitle")),
        h("div", { key: "pane", ref: paneRef, className: "ex-assist-pane" + (termOpen[0] ? "" : " ex-assist-pane-tall") },
          msgs[0].length === 0 ? [h("div", { key: "h", className: "ex-assist-hint" }, "// " + t("agentHint"))] : bubbles),
        h("div", { key: "qa", className: "ex-pills ex-assist-qa" }, ["qaInstalledHealth", "qaTop10", "qaDiagnose", "qaAudit", "qaMore"].map(function (k, i) {
          return h("button", { key: i, disabled: sending[0] || !pro, onClick: function () { if (k === "qaMore") { manualSec[1]("start"); manualOpen[1](true); } else { ask(QA_INTENT[k], "", t(k)); } } }, t(k));
        })),
        h("div", { key: "composer", className: "ex-composer" }, [
          (!pro) ? h("div", { key: "prolock", className: "ex-notice", style: { display: "flex", alignItems: "center", gap: ".5rem", flexWrap: "wrap" } }, [
            h("span", { key: "txt" }, t("proLockedAgent")),
            h("button", { key: "up", className: "ex-btn ex-btn-primary", onClick: function () { try { window.dispatchEvent(new CustomEvent("omnilimb:gototab", { detail: "settings" })); } catch (e) { } } }, t("proUpgrade")),
          ]) : null,
          (function () {
            if (!slashList.length) return null;
            return h("div", { key: "slash", className: "ex-slash-menu" }, slashList.map(function (c, ix) {
              return h("button", { key: ix, type: "button", className: "ex-slash-item" + (ix === slashIdx ? " active" : ""),
                onMouseEnter: function () { slashSel[1](ix); },
                onClick: function () { pickSlash(c); } }, [
                h("span", { key: "c", className: "ex-slash-cmd" }, "/" + c.cmd),
                h("span", { key: "d", className: "ex-slash-desc" }, c.desc),
              ]);
            }));
          })(),
          h("div", { key: "row", className: "ex-assist-row" }, [
            h("textarea", { key: "in", ref: inputRef, className: "ex-assist-input", rows: 1, placeholder: t("agentInputPh"), value: msg[0], readOnly: !pro,
              onFocus: function (e) { if (!pro) { try { e.target.blur(); } catch (er) { } proPrompt[1](true); } },
              onClick: function () { if (!pro) { proPrompt[1](true); } },
              onChange: function (e) { if (!pro) return; msg[1](e.target.value); slashSel[1](0); },
              onKeyDown: onInputKey }),
            h("button", { key: "send", className: "ex-assist-send", title: t("agentSend"), onClick: sendComposer, disabled: sending[0] || !pro || !(msg[0] && msg[0].trim()) }, "↑"),
          ]),
        ]),
      ]));
  }

  // Conversion panel — convert installed OpenClaw/ClawHub/SkillHub skills into
  // native Hermes skills. Operation surface only: it calls exactly two backend
  // routes (GET /convertible_skills, POST /convert) and renders the report it
  // gets back. No conversion logic lives here (Req 11.9).
  // One Converted_Skill as a card, mirroring InstalledCard's style. The whole
  // card is clickable and a "View" button opens the same detail sub-view.
  function ConvertedCard(props) {
    var t = props.t, sk = props.sk, onView = props.onView, onUninstall = props.onUninstall, busy = props.busy;
    var name = sk.name || sk.source_slug || "?";
    var initial = (name || "?").charAt(0).toUpperCase();
    var sub = (sk.source_version ? "v" + sk.source_version + "  " : "") + (sk.source_slug || "");
    // No usage data source for converted skills -> placeholder of 0 / em-dash (Req 11.5).
    var invocations = (sk.invocations != null) ? sk.invocations : "—";
    return h("div", { className: "ex-mini ex-mini-clickable", onClick: function () { onView(sk); }, title: t("convOpen") },
      h("div", { className: "ex-mini-head" },
        h("div", { className: "ex-card-icon" }, initial),
        h("div", { style: { minWidth: 0, flex: 1 } },
          h("div", { className: "ex-mini-title" }, name),
          h("div", { className: "ex-mini-sub" }, sub))),
      sk.description ? h("div", { className: "ex-meta", style: { margin: ".35rem 0 .15rem", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" } }, sk.description) : null,
      h("div", { className: "ex-badges" }, [
        h("span", { key: "s", className: "ex-badge" }, t("convSkillMd")),
        h("span", { key: "iv", className: "ex-badge" }, t("convInvocations") + ": " + invocations),
      ]),
      h("div", { className: "ex-mini-foot" }, [
        h("button", { key: "v", className: "ex-btn ex-btn-primary", onClick: function (e) { e.stopPropagation(); onView(sk); } }, t("convOpen")),
        onUninstall ? h("button", { key: "u", className: "ex-btn ex-btn-danger ex-spacer", onClick: function (e) { e.stopPropagation(); if (!busy) onUninstall(sk); }, disabled: busy }, busy ? t("uninstalling") : t("uninstall")) : null,
      ]));
  }

  // Detail sub-view for a single Converted_Skill. GETs /converted_skill?name=
  // and renders the SKILL.md (markdown), file list, source slug, version and
  // output path. A back button returns to the grid (Req 11.6).
  function ConvertedDetail(props) {
    var t = props.t, name = props.name, onBack = props.onBack;
    var d = useState(null);
    var busy = useState(false);      // in-flight POST /converted_uninstall
    function load() {
      d[1](null);
      api("/converted_skill?name=" + encodeURIComponent(name))
        .then(d[1]).catch(function (e) { d[1]({ ok: false, error: String(e) }); });
    }
    useEffect(function () { load(); }, [name]);
    // Uninstall this converted skill (mirrors InstalledPanel's doUninstall). On
    // success we return to the grid via onBack, which also reloads the library
    // so the deleted card is gone. No conversion logic — backend route only.
    function doUninstall() {
      if (!window.confirm(t("confirmUninstall").replace("%s", name))) return;
      busy[1](true);
      post("/converted_uninstall", { name: name })
        .then(function (r) { if (r && r.ok) { onBack(); } else { window.alert(t("uninstallFail") + ": " + ((r && r.error) || "?")); } })
        .catch(function (e) { window.alert(t("uninstallFail") + ": " + String(e)); })
        .finally(function () { busy[1](false); });
    }
    var v = d[0];
    return h("div", { className: "ex-section" },
      h("div", { className: "ex-controls", style: { justifyContent: "space-between", marginBottom: ".7rem" } },
        h("button", { className: "ex-btn", onClick: onBack }, t("convBackLib")),
        h("div", { style: { display: "flex", gap: ".4rem" } }, [
          h("button", { key: "rf", className: "ex-btn", onClick: load }, t("refresh")),
          h("button", { key: "un", className: "ex-btn ex-btn-danger", disabled: busy[0], onClick: doUninstall }, busy[0] ? t("uninstalling") : t("uninstall")),
        ])),
      !v ? h("div", { className: "ex-empty" }, t("loadingStatus")) :
        (!v.ok ? h("div", { className: "ex-status-bad" }, t("convErr") + ": " + (v.error || "?")) :
          h("div", null, [
            h("div", { key: "hd", className: "ex-detail-head", style: { marginBottom: ".5rem" } },
              h("div", { className: "ex-section-title", style: { margin: 0 } }, v.name || name)),
            h("div", { key: "meta", className: "ex-meta", style: { display: "flex", flexWrap: "wrap", gap: ".9rem", marginBottom: ".6rem" } }, [
              h("span", { key: "src" }, t("convSource") + ": " + (v.source_slug || "—")),
              h("span", { key: "ver" }, t("convVersion") + ": " + (v.source_version || "—")),
            ]),
            v.output_path ? h("div", { key: "out", className: "ex-meta", style: { marginBottom: ".6rem", wordBreak: "break-all" } }, t("convOut") + ": " + v.output_path) : null,
            (v.files && v.files.length) ? h("div", { key: "files", style: { marginBottom: ".6rem" } }, [
              h("div", { key: "ft", className: "ex-meta", style: { fontWeight: 600, marginBottom: ".25rem" } }, t("convFiles")),
              h("ul", { key: "fl", className: "ex-meta", style: { margin: 0, paddingLeft: "1.1rem" } }, v.files.map(function (f, i) {
                return h("li", { key: i, style: { wordBreak: "break-all" } }, f);
              })),
            ]) : null,
            h("div", { key: "smt", className: "ex-meta", style: { fontWeight: 600, margin: ".2rem 0 .25rem" } }, t("convSkillMd")),
            h("div", { key: "smd", className: "omnilimb-md ex-detail-body", dangerouslySetInnerHTML: { __html: mdToHtml(v.skill_md || "") } }),
          ])),
    );
  }

  // Converted_Skill_Library — finished-products library of converted Hermes
  // skills. Operation surface only: it calls exactly two backend routes
  // (GET /converted_skills, GET /converted_skill?name=) and renders the cards
  // and detail it gets back. No conversion logic lives here (Req 11.4, 11.6, 11.12).
  function ConvertedLibraryPanel() {
    var t = useTr();
    var d = useState(null);          // GET /converted_skills response
    var selected = useState("");     // converted skill name being viewed; "" = grid
    var uninstalling = useState({}); // name -> bool (in-flight POST /converted_uninstall)
    function load() {
      d[1](null);
      api("/converted_skills").then(d[1]).catch(function (e) { d[1]({ ok: false, error: String(e) }); });
    }
    // Reload on mount, and whenever a conversion finishes anywhere (a
    // SkillDetailPage dispatches "omnilimb:converted" on success) so the
    // library auto-refreshes without a manual refresh (Req 11.12).
    useEffect(function () {
      load();
      var on = function () { load(); };
      window.addEventListener("omnilimb:converted", on);
      return function () { window.removeEventListener("omnilimb:converted", on); };
    }, []);
    function setUn(nm, v) { uninstalling[1](function (prev) { var c = Object.assign({}, prev); c[nm] = v; return c; }); }
    // Uninstall a converted skill from the grid, then reload the library so the
    // deleted card disappears. Backend route only — no conversion logic here.
    function doUninstall(sk) {
      var nm = sk.name || sk.source_slug;
      if (!window.confirm(t("confirmUninstall").replace("%s", nm))) return;
      setUn(nm, true);
      post("/converted_uninstall", { name: nm })
        .then(function (r) { if (r && r.ok) { load(); } else { window.alert(t("uninstallFail") + ": " + ((r && r.error) || "?")); } })
        .catch(function (e) { window.alert(t("uninstallFail") + ": " + String(e)); })
        .finally(function () { setUn(nm, false); });
    }
    // Convert a single slug, or all installed skills when slug is falsy (Req 11.2, 11.3).
    // Detail sub-view replaces the grid, like InstalledPanel's SkillDetailPage.
    if (selected[0]) {
      return h(ConvertedDetail, { t: t, name: selected[0], onBack: function () { selected[1](""); load(); } });
    }
    var v = d[0];
    var skills = (v && v.ok && (v.skills || [])) || [];
    return h("div", { className: "ex-section" },
      h("div", { className: "ex-controls", style: { justifyContent: "space-between", marginBottom: ".7rem" } },
        h("div", { className: "ex-section-title", style: { margin: 0 } }, t("convLibTitle")),
        h("button", { className: "ex-btn", onClick: load }, t("refresh"))),
      !v ? h("div", { className: "ex-empty" }, t("loadingStatus")) :
        (!v.ok ? h("div", { className: "ex-status-bad" }, v.error || "?") :
          (skills.length === 0 ? h("div", { className: "ex-empty" }, t("convNone")) :
            h("div", { className: "ex-mini-grid" }, skills.map(function (sk, i) {
              return h(ConvertedCard, { key: i, sk: sk, t: t,
                onView: function (s) { selected[1](s.name || s.source_slug); },
                onUninstall: doUninstall,
                busy: !!uninstalling[0][sk.name || sk.source_slug] });
            })))),
    );
  }

  // Conversion operations surface — list installed Source_Skills and convert
  // them (one or all) into native Hermes skills. Calls ONLY /convertible_skills
  // (list) and /convert (run); all discovery/mapping/validation/loop logic lives
  // in the backend tool (Req 11.1–11.9). Renders the per-skill Conversion_Report
  // (status, Validation_Loop iterations, remediations, output path).
  function ConvertPanel() {
    var t = useTr();
    var list = useState(null);        // GET /convertible_skills response
    var busy = useState({});          // key ("*"=all, else slug) -> bool
    var report = useState(null);      // last /convert response
    var proReq = useState(false);     // Pro gate hit -> show upgrade affordance
    function load() {
      list[1](null); report[1](null); proReq[1](false);
      api("/convertible_skills").then(list[1]).catch(function (e) { list[1]({ ok: false, error: String(e) }); });
    }
    useEffect(function () { load(); }, []);
    function setBusy(key, v) { busy[1](function (prev) { var c = Object.assign({}, prev); c[key] = v; return c; }); }
    function convert(slug) {
      var key = slug || "*";
      setBusy(key, true); report[1](null); proReq[1](false);
      post("/convert", slug ? { slug: slug } : {})
        .then(function (r) {
          if (r && r.pro_required) { proReq[1](true); return; }   // Req 11.5 — upgrade affordance
          report[1](r || { ok: false, error: "?" });
        })
        .catch(function (e) { report[1]({ ok: false, error: String(e) }); })
        .finally(function () { setBusy(key, false); });
    }
    function statusLabel(st) {
      var map = { passed: t("convPassed"), failed: t("convFailed"), unchanged: t("convUnchanged"), reconverted: t("convReconverted") };
      if (map[st]) return map[st];
      if (st && st.indexOf("skipped") === 0) return t("convSkipped");
      return st || "?";
    }
    function resultRow(res, i) {
      var fixes = (res.loop && res.loop.remediations) || [];        // loop.remediations
      var iters = (res.loop && res.loop.iterations != null) ? res.loop.iterations : "?";  // loop.iterations
      return h("div", { key: i, className: "ex-run-row" }, [
        h("span", { key: "ok", className: res.ok ? "ex-status-ok" : "ex-status-bad" }, res.ok ? "✓" : "✗"),
        h("span", { key: "nm", style: { fontWeight: 600 } }, res.name || res.slug || "?"),
        h("span", { key: "stt", className: "ex-badge" }, t("convStatus") + ": " + statusLabel(res.status)),
        h("span", { key: "it", className: "ex-meta" }, t("convIters") + ": " + iters),
        fixes.length ? h("span", { key: "fx", className: "ex-meta" }, t("convFixes") + ": " + fixes.join(", ")) : null,
        res.output_path ? h("span", { key: "op", className: "ex-meta", style: { overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "100%" } }, t("convOut") + ": " + res.output_path) : null,
        (!res.ok && res.reason) ? h("span", { key: "rs", className: "ex-status-bad" }, String(res.reason)) : null,
      ]);
    }
    var v = list[0];
    var skills = (v && v.ok && v.skills) ? v.skills : [];
    var allBusy = !!busy[0]["*"];
    var rep = report[0];
    return h("div", { className: "ex-section" },
      h("div", { className: "ex-controls", style: { justifyContent: "space-between", marginBottom: ".7rem" } },
        h("div", { className: "ex-section-title", style: { margin: 0 } }, t("convTitle")),
        h("div", { style: { display: "flex", gap: ".4rem", alignItems: "center" } }, [
          h("button", { key: "all", className: "ex-btn ex-btn-primary", onClick: function () { if (!allBusy) convert(""); }, disabled: allBusy || !(skills && skills.length) }, allBusy ? t("converting") : t("convAll")),
          h("button", { key: "rf", className: "ex-btn", onClick: load }, t("refresh")),
        ])),
      proReq[0] ? h("div", { className: "ex-notice" }, t("convProOnly")) :
        (!v ? h("div", { className: "ex-empty" }, t("loadingStatus")) :
          (!v.ok ? h("div", { className: "ex-status-bad" }, v.error || "?") :
            (skills.length === 0 ? h("div", { className: "ex-empty" }, t("convNone")) :
              h("div", { className: "ex-mini-grid" }, skills.map(function (sk, i) {
                var slug = sk.slug || sk.name;
                var b = !!busy[0][slug];
                return h("div", { key: i, className: "ex-mini" },
                  h("div", { className: "ex-mini-head" },
                    h("div", { style: { minWidth: 0, flex: 1 } },
                      h("div", { className: "ex-mini-title" }, sk.displayName || slug),
                      h("div", { className: "ex-mini-sub" }, slug))),
                  h("div", { className: "ex-mini-foot" }, [
                    h("button", { key: "c", className: "ex-btn ex-btn-solid ex-spacer", onClick: function () { if (!b) convert(slug); }, disabled: b }, b ? t("converting") : t("convOne")),
                  ]));
              }))))),
      (rep && !proReq[0]) ? h("div", { className: "ex-runs", style: { marginTop: ".8rem" } }, [
        h("div", { key: "h", className: "ex-runs-title" }, t("convStatus")),
        (!rep.ok && rep.error) ? h("div", { key: "e", className: "ex-status-bad" }, t("convErr") + ": " + rep.error) : null,
        h("div", { key: "rows", style: { display: "flex", flexDirection: "column", gap: ".3rem" } }, (rep.results || []).map(resultRow)),
      ]) : null,
    );
  }

  function OmnilimbPanel() {
    var t = useTr();
    var tab = useState("search");
    var pro = useState(false);
    // User-facing tabs. Audit is a FREE feature (everyone can view). "Runtime"
    // (a developer code bench) stays hidden from the UI — re-enable by adding
    // ["runtime", t("tabRuntime")] back to this list. The "convert" (converted
    // skills library) tab is Pro-only, so it only appears when pro is true.
    var tabs = [["search", t("tabSearch")], ["installed", t("tabInstalled")]];
    tabs = tabs.concat([["favorites", t("tabFavorites")], ["audit", t("tabAudit")], ["settings", t("tabSettings")]]);
    // Listen for cross-component navigation requests (e.g. SkillDetailPage's
    // "go to converted skills" button) and switch the active tab accordingly.
    // Also keep a live `pro` flag: load it from /status, and refresh whenever a
    // license is activated (omnilimb:license) so the UI flips without a reload.
    useEffect(function () {
      function loadPro() { api("/status").then(function (r) { pro[1](!!(r && r.pro)); }).catch(function () { }); }
      loadPro();
      var on = function (e) { var dst = e && e.detail; if (dst) tab[1](dst); };
      window.addEventListener("omnilimb:gototab", on);
      window.addEventListener("omnilimb:license", loadPro);
      return function () {
        window.removeEventListener("omnilimb:gototab", on);
        window.removeEventListener("omnilimb:license", loadPro);
      };
    }, []);
    return h("div", { className: "ex-page omnilimb-panel p-4" },
      h(TopBar, null),
      h("div", { className: "ex-tabs" }, tabs.map(function (tb) {
        return h("button", { key: tb[0], onClick: function () { tab[1](tb[0]); }, className: (tab[0] === tb[0] ? "active" : "") + (tb[0] === "agent" ? " ex-tab-right" : "") }, tb[1]);
      })),
      tab[0] === "search" ? h(SearchPanel, { pro: pro[0] }) : null,
      tab[0] === "installed" ? h(InstalledPanel, null) : null,
      tab[0] === "favorites" ? h(FavoritesPanel, null) : null,
      tab[0] === "runtime" ? h(RunPanel, null) : null,
      tab[0] === "audit" ? h(AuditPanel, null) : null,
      tab[0] === "settings" ? h(SettingsPanel, null) : null,
    );
  }

  window.__HERMES_PLUGINS__.register("omnilimb", OmnilimbPanel);
})();

/* === vendored xterm BEGIN === */
!function(e,t){if("object"==typeof exports&&"object"==typeof module)module.exports=t();else if("function"==typeof define&&define.amd)define([],t);else{var i=t();for(var s in i)("object"==typeof exports?exports:e)[s]=i[s]}}(globalThis,(()=>(()=>{"use strict";var e={4567:function(e,t,i){var s=this&&this.__decorate||function(e,t,i,s){var r,n=arguments.length,o=n<3?t:null===s?s=Object.getOwnPropertyDescriptor(t,i):s;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)o=Reflect.decorate(e,t,i,s);else for(var a=e.length-1;a>=0;a--)(r=e[a])&&(o=(n<3?r(o):n>3?r(t,i,o):r(t,i))||o);return n>3&&o&&Object.defineProperty(t,i,o),o},r=this&&this.__param||function(e,t){return function(i,s){t(i,s,e)}};Object.defineProperty(t,"__esModule",{value:!0}),t.AccessibilityManager=void 0;const n=i(9042),o=i(9924),a=i(844),h=i(4725),c=i(2585),l=i(3656);let d=t.AccessibilityManager=class extends a.Disposable{constructor(e,t,i,s){super(),this._terminal=e,this._coreBrowserService=i,this._renderService=s,this._rowColumns=new WeakMap,this._liveRegionLineCount=0,this._charsToConsume=[],this._charsToAnnounce="",this._accessibilityContainer=this._coreBrowserService.mainDocument.createElement("div"),this._accessibilityContainer.classList.add("xterm-accessibility"),this._rowContainer=this._coreBrowserService.mainDocument.createElement("div"),this._rowContainer.setAttribute("role","list"),this._rowContainer.classList.add("xterm-accessibility-tree"),this._rowElements=[];for(let e=0;e<this._terminal.rows;e++)this._rowElements[e]=this._createAccessibilityTreeNode(),this._rowContainer.appendChild(this._rowElements[e]);if(this._topBoundaryFocusListener=e=>this._handleBoundaryFocus(e,0),this._bottomBoundaryFocusListener=e=>this._handleBoundaryFocus(e,1),this._rowElements[0].addEventListener("focus",this._topBoundaryFocusListener),this._rowElements[this._rowElements.length-1].addEventListener("focus",this._bottomBoundaryFocusListener),this._refreshRowsDimensions(),this._accessibilityContainer.appendChild(this._rowContainer),this._liveRegion=this._coreBrowserService.mainDocument.createElement("div"),this._liveRegion.classList.add("live-region"),this._liveRegion.setAttribute("aria-live","assertive"),this._accessibilityContainer.appendChild(this._liveRegion),this._liveRegionDebouncer=this.register(new o.TimeBasedDebouncer(this._renderRows.bind(this))),!this._terminal.element)throw new Error("Cannot enable accessibility before Terminal.open");this._terminal.element.insertAdjacentElement("afterbegin",this._accessibilityContainer),this.register(this._terminal.onResize((e=>this._handleResize(e.rows)))),this.register(this._terminal.onRender((e=>this._refreshRows(e.start,e.end)))),this.register(this._terminal.onScroll((()=>this._refreshRows()))),this.register(this._terminal.onA11yChar((e=>this._handleChar(e)))),this.register(this._terminal.onLineFeed((()=>this._handleChar("\n")))),this.register(this._terminal.onA11yTab((e=>this._handleTab(e)))),this.register(this._terminal.onKey((e=>this._handleKey(e.key)))),this.register(this._terminal.onBlur((()=>this._clearLiveRegion()))),this.register(this._renderService.onDimensionsChange((()=>this._refreshRowsDimensions()))),this.register((0,l.addDisposableDomListener)(document,"selectionchange",(()=>this._handleSelectionChange()))),this.register(this._coreBrowserService.onDprChange((()=>this._refreshRowsDimensions()))),this._refreshRows(),this.register((0,a.toDisposable)((()=>{this._accessibilityContainer.remove(),this._rowElements.length=0})))}_handleTab(e){for(let t=0;t<e;t++)this._handleChar(" ")}_handleChar(e){this._liveRegionLineCount<21&&(this._charsToConsume.length>0?this._charsToConsume.shift()!==e&&(this._charsToAnnounce+=e):this._charsToAnnounce+=e,"\n"===e&&(this._liveRegionLineCount++,21===this._liveRegionLineCount&&(this._liveRegion.textContent+=n.tooMuchOutput)))}_clearLiveRegion(){this._liveRegion.textContent="",this._liveRegionLineCount=0}_handleKey(e){this._clearLiveRegion(),/\p{Control}/u.test(e)||this._charsToConsume.push(e)}_refreshRows(e,t){this._liveRegionDebouncer.refresh(e,t,this._terminal.rows)}_renderRows(e,t){const i=this._terminal.buffer,s=i.lines.length.toString();for(let r=e;r<=t;r++){const e=i.lines.get(i.ydisp+r),t=[],n=e?.translateToString(!0,void 0,void 0,t)||"",o=(i.ydisp+r+1).toString(),a=this._rowElements[r];a&&(0===n.length?(a.innerText=" ",this._rowColumns.set(a,[0,1])):(a.textContent=n,this._rowColumns.set(a,t)),a.setAttribute("aria-posinset",o),a.setAttribute("aria-setsize",s))}this._announceCharacters()}_announceCharacters(){0!==this._charsToAnnounce.length&&(this._liveRegion.textContent+=this._charsToAnnounce,this._charsToAnnounce="")}_handleBoundaryFocus(e,t){const i=e.target,s=this._rowElements[0===t?1:this._rowElements.length-2];if(i.getAttribute("aria-posinset")===(0===t?"1":`${this._terminal.buffer.lines.length}`))return;if(e.relatedTarget!==s)return;let r,n;if(0===t?(r=i,n=this._rowElements.pop(),this._rowContainer.removeChild(n)):(r=this._rowElements.shift(),n=i,this._rowContainer.removeChild(r)),r.removeEventListener("focus",this._topBoundaryFocusListener),n.removeEventListener("focus",this._bottomBoundaryFocusListener),0===t){const e=this._createAccessibilityTreeNode();this._rowElements.unshift(e),this._rowContainer.insertAdjacentElement("afterbegin",e)}else{const e=this._createAccessibilityTreeNode();this._rowElements.push(e),this._rowContainer.appendChild(e)}this._rowElements[0].addEventListener("focus",this._topBoundaryFocusListener),this._rowElements[this._rowElements.length-1].addEventListener("focus",this._bottomBoundaryFocusListener),this._terminal.scrollLines(0===t?-1:1),this._rowElements[0===t?1:this._rowElements.length-2].focus(),e.preventDefault(),e.stopImmediatePropagation()}_handleSelectionChange(){if(0===this._rowElements.length)return;const e=document.getSelection();if(!e)return;if(e.isCollapsed)return void(this._rowContainer.contains(e.anchorNode)&&this._terminal.clearSelection());if(!e.anchorNode||!e.focusNode)return void console.error("anchorNode and/or focusNode are null");let t={node:e.anchorNode,offset:e.anchorOffset},i={node:e.focusNode,offset:e.focusOffset};if((t.node.compareDocumentPosition(i.node)&Node.DOCUMENT_POSITION_PRECEDING||t.node===i.node&&t.offset>i.offset)&&([t,i]=[i,t]),t.node.compareDocumentPosition(this._rowElements[0])&(Node.DOCUMENT_POSITION_CONTAINED_BY|Node.DOCUMENT_POSITION_FOLLOWING)&&(t={node:this._rowElements[0].childNodes[0],offset:0}),!this._rowContainer.contains(t.node))return;const s=this._rowElements.slice(-1)[0];if(i.node.compareDocumentPosition(s)&(Node.DOCUMENT_POSITION_CONTAINED_BY|Node.DOCUMENT_POSITION_PRECEDING)&&(i={node:s,offset:s.textContent?.length??0}),!this._rowContainer.contains(i.node))return;const r=({node:e,offset:t})=>{const i=e instanceof Text?e.parentNode:e;let s=parseInt(i?.getAttribute("aria-posinset"),10)-1;if(isNaN(s))return console.warn("row is invalid. Race condition?"),null;const r=this._rowColumns.get(i);if(!r)return console.warn("columns is null. Race condition?"),null;let n=t<r.length?r[t]:r.slice(-1)[0]+1;return n>=this._terminal.cols&&(++s,n=0),{row:s,column:n}},n=r(t),o=r(i);if(n&&o){if(n.row>o.row||n.row===o.row&&n.column>=o.column)throw new Error("invalid range");this._terminal.select(n.column,n.row,(o.row-n.row)*this._terminal.cols-n.column+o.column)}}_handleResize(e){this._rowElements[this._rowElements.length-1].removeEventListener("focus",this._bottomBoundaryFocusListener);for(let e=this._rowContainer.children.length;e<this._terminal.rows;e++)this._rowElements[e]=this._createAccessibilityTreeNode(),this._rowContainer.appendChild(this._rowElements[e]);for(;this._rowElements.length>e;)this._rowContainer.removeChild(this._rowElements.pop());this._rowElements[this._rowElements.length-1].addEventListener("focus",this._bottomBoundaryFocusListener),this._refreshRowsDimensions()}_createAccessibilityTreeNode(){const e=this._coreBrowserService.mainDocument.createElement("div");return e.setAttribute("role","listitem"),e.tabIndex=-1,this._refreshRowDimensions(e),e}_refreshRowsDimensions(){if(this._renderService.dimensions.css.cell.height){this._accessibilityContainer.style.width=`${this._renderService.dimensions.css.canvas.width}px`,this._rowElements.length!==this._terminal.rows&&this._handleResize(this._terminal.rows);for(let e=0;e<this._terminal.rows;e++)this._refreshRowDimensions(this._rowElements[e])}}_refreshRowDimensions(e){e.style.height=`${this._renderService.dimensions.css.cell.height}px`}};t.AccessibilityManager=d=s([r(1,c.IInstantiationService),r(2,h.ICoreBrowserService),r(3,h.IRenderService)],d)},3614:(e,t)=>{function i(e){return e.replace(/\r?\n/g,"\r")}function s(e,t){return t?"[200~"+e+"[201~":e}function r(e,t,r,n){e=s(e=i(e),r.decPrivateModes.bracketedPasteMode&&!0!==n.rawOptions.ignoreBracketedPasteMode),r.triggerDataEvent(e,!0),t.value=""}function n(e,t,i){const s=i.getBoundingClientRect(),r=e.clientX-s.left-10,n=e.clientY-s.top-10;t.style.width="20px",t.style.height="20px",t.style.left=`${r}px`,t.style.top=`${n}px`,t.style.zIndex="1000",t.focus()}Object.defineProperty(t,"__esModule",{value:!0}),t.rightClickHandler=t.moveTextAreaUnderMouseCursor=t.paste=t.handlePasteEvent=t.copyHandler=t.bracketTextForPaste=t.prepareTextForTerminal=void 0,t.prepareTextForTerminal=i,t.bracketTextForPaste=s,t.copyHandler=function(e,t){e.clipboardData&&e.clipboardData.setData("text/plain",t.selectionText),e.preventDefault()},t.handlePasteEvent=function(e,t,i,s){e.stopPropagation(),e.clipboardData&&r(e.clipboardData.getData("text/plain"),t,i,s)},t.paste=r,t.moveTextAreaUnderMouseCursor=n,t.rightClickHandler=function(e,t,i,s,r){n(e,t,i),r&&s.rightClickSelect(e),t.value=s.selectionText,t.select()}},7239:(e,t,i)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.ColorContrastCache=void 0;const s=i(1505);t.ColorContrastCache=class{constructor(){this._color=new s.TwoKeyMap,this._css=new s.TwoKeyMap}setCss(e,t,i){this._css.set(e,t,i)}getCss(e,t){return this._css.get(e,t)}setColor(e,t,i){this._color.set(e,t,i)}getColor(e,t){return this._color.get(e,t)}clear(){this._color.clear(),this._css.clear()}}},3656:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.addDisposableDomListener=void 0,t.addDisposableDomListener=function(e,t,i,s){e.addEventListener(t,i,s);let r=!1;return{dispose:()=>{r||(r=!0,e.removeEventListener(t,i,s))}}}},3551:function(e,t,i){var s=this&&this.__decorate||function(e,t,i,s){var r,n=arguments.length,o=n<3?t:null===s?s=Object.getOwnPropertyDescriptor(t,i):s;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)o=Reflect.decorate(e,t,i,s);else for(var a=e.length-1;a>=0;a--)(r=e[a])&&(o=(n<3?r(o):n>3?r(t,i,o):r(t,i))||o);return n>3&&o&&Object.defineProperty(t,i,o),o},r=this&&this.__param||function(e,t){return function(i,s){t(i,s,e)}};Object.defineProperty(t,"__esModule",{value:!0}),t.Linkifier=void 0;const n=i(3656),o=i(8460),a=i(844),h=i(2585),c=i(4725);let l=t.Linkifier=class extends a.Disposable{get currentLink(){return this._currentLink}constructor(e,t,i,s,r){super(),this._element=e,this._mouseService=t,this._renderService=i,this._bufferService=s,this._linkProviderService=r,this._linkCacheDisposables=[],this._isMouseOut=!0,this._wasResized=!1,this._activeLine=-1,this._onShowLinkUnderline=this.register(new o.EventEmitter),this.onShowLinkUnderline=this._onShowLinkUnderline.event,this._onHideLinkUnderline=this.register(new o.EventEmitter),this.onHideLinkUnderline=this._onHideLinkUnderline.event,this.register((0,a.getDisposeArrayDisposable)(this._linkCacheDisposables)),this.register((0,a.toDisposable)((()=>{this._lastMouseEvent=void 0,this._activeProviderReplies?.clear()}))),this.register(this._bufferService.onResize((()=>{this._clearCurrentLink(),this._wasResized=!0}))),this.register((0,n.addDisposableDomListener)(this._element,"mouseleave",(()=>{this._isMouseOut=!0,this._clearCurrentLink()}))),this.register((0,n.addDisposableDomListener)(this._element,"mousemove",this._handleMouseMove.bind(this))),this.register((0,n.addDisposableDomListener)(this._element,"mousedown",this._handleMouseDown.bind(this))),this.register((0,n.addDisposableDomListener)(this._element,"mouseup",this._handleMouseUp.bind(this)))}_handleMouseMove(e){this._lastMouseEvent=e;const t=this._positionFromMouseEvent(e,this._element,this._mouseService);if(!t)return;this._isMouseOut=!1;const i=e.composedPath();for(let e=0;e<i.length;e++){const t=i[e];if(t.classList.contains("xterm"))break;if(t.classList.contains("xterm-hover"))return}this._lastBufferCell&&t.x===this._lastBufferCell.x&&t.y===this._lastBufferCell.y||(this._handleHover(t),this._lastBufferCell=t)}_handleHover(e){if(this._activeLine!==e.y||this._wasResized)return this._clearCurrentLink(),this._askForLink(e,!1),void(this._wasResized=!1);this._currentLink&&this._linkAtPosition(this._currentLink.link,e)||(this._clearCurrentLink(),this._askForLink(e,!0))}_askForLink(e,t){this._activeProviderReplies&&t||(this._activeProviderReplies?.forEach((e=>{e?.forEach((e=>{e.link.dispose&&e.link.dispose()}))})),this._activeProviderReplies=new Map,this._activeLine=e.y);let i=!1;for(const[s,r]of this._linkProviderService.linkProviders.entries())if(t){const t=this._activeProviderReplies?.get(s);t&&(i=this._checkLinkProviderResult(s,e,i))}else r.provideLinks(e.y,(t=>{if(this._isMouseOut)return;const r=t?.map((e=>({link:e})));this._activeProviderReplies?.set(s,r),i=this._checkLinkProviderResult(s,e,i),this._activeProviderReplies?.size===this._linkProviderService.linkProviders.length&&this._removeIntersectingLinks(e.y,this._activeProviderReplies)}))}_removeIntersectingLinks(e,t){const i=new Set;for(let s=0;s<t.size;s++){const r=t.get(s);if(r)for(let t=0;t<r.length;t++){const s=r[t],n=s.link.range.start.y<e?0:s.link.range.start.x,o=s.link.range.end.y>e?this._bufferService.cols:s.link.range.end.x;for(let e=n;e<=o;e++){if(i.has(e)){r.splice(t--,1);break}i.add(e)}}}}_checkLinkProviderResult(e,t,i){if(!this._activeProviderReplies)return i;const s=this._activeProviderReplies.get(e);let r=!1;for(let t=0;t<e;t++)this._activeProviderReplies.has(t)&&!this._activeProviderReplies.get(t)||(r=!0);if(!r&&s){const e=s.find((e=>this._linkAtPosition(e.link,t)));e&&(i=!0,this._handleNewLink(e))}if(this._activeProviderReplies.size===this._linkProviderService.linkProviders.length&&!i)for(let e=0;e<this._activeProviderReplies.size;e++){const s=this._activeProviderReplies.get(e)?.find((e=>this._linkAtPosition(e.link,t)));if(s){i=!0,this._handleNewLink(s);break}}return i}_handleMouseDown(){this._mouseDownLink=this._currentLink}_handleMouseUp(e){if(!this._currentLink)return;const t=this._positionFromMouseEvent(e,this._element,this._mouseService);t&&this._mouseDownLink===this._currentLink&&this._linkAtPosition(this._currentLink.link,t)&&this._currentLink.link.activate(e,this._currentLink.link.text)}_clearCurrentLink(e,t){this._currentLink&&this._lastMouseEvent&&(!e||!t||this._currentLink.link.range.start.y>=e&&this._currentLink.link.range.end.y<=t)&&(this._linkLeave(this._element,this._currentLink.link,this._lastMouseEvent),this._currentLink=void 0,(0,a.disposeArray)(this._linkCacheDisposables))}_handleNewLink(e){if(!this._lastMouseEvent)return;const t=this._positionFromMouseEvent(this._lastMouseEvent,this._element,this._mouseService);t&&this._linkAtPosition(e.link,t)&&(this._currentLink=e,this._currentLink.state={decorations:{underline:void 0===e.link.decorations||e.link.decorations.underline,pointerCursor:void 0===e.link.decorations||e.link.decorations.pointerCursor},isHovered:!0},this._linkHover(this._element,e.link,this._lastMouseEvent),e.link.decorations={},Object.defineProperties(e.link.decorations,{pointerCursor:{get:()=>this._currentLink?.state?.decorations.pointerCursor,set:e=>{this._currentLink?.state&&this._currentLink.state.decorations.pointerCursor!==e&&(this._currentLink.state.decorations.pointerCursor=e,this._currentLink.state.isHovered&&this._element.classList.toggle("xterm-cursor-pointer",e))}},underline:{get:()=>this._currentLink?.state?.decorations.underline,set:t=>{this._currentLink?.state&&this._currentLink?.state?.decorations.underline!==t&&(this._currentLink.state.decorations.underline=t,this._currentLink.state.isHovered&&this._fireUnderlineEvent(e.link,t))}}}),this._linkCacheDisposables.push(this._renderService.onRenderedViewportChange((e=>{if(!this._currentLink)return;const t=0===e.start?0:e.start+1+this._bufferService.buffer.ydisp,i=this._bufferService.buffer.ydisp+1+e.end;if(this._currentLink.link.range.start.y>=t&&this._currentLink.link.range.end.y<=i&&(this._clearCurrentLink(t,i),this._lastMouseEvent)){const e=this._positionFromMouseEvent(this._lastMouseEvent,this._element,this._mouseService);e&&this._askForLink(e,!1)}}))))}_linkHover(e,t,i){this._currentLink?.state&&(this._currentLink.state.isHovered=!0,this._currentLink.state.decorations.underline&&this._fireUnderlineEvent(t,!0),this._currentLink.state.decorations.pointerCursor&&e.classList.add("xterm-cursor-pointer")),t.hover&&t.hover(i,t.text)}_fireUnderlineEvent(e,t){const i=e.range,s=this._bufferService.buffer.ydisp,r=this._createLinkUnderlineEvent(i.start.x-1,i.start.y-s-1,i.end.x,i.end.y-s-1,void 0);(t?this._onShowLinkUnderline:this._onHideLinkUnderline).fire(r)}_linkLeave(e,t,i){this._currentLink?.state&&(this._currentLink.state.isHovered=!1,this._currentLink.state.decorations.underline&&this._fireUnderlineEvent(t,!1),this._currentLink.state.decorations.pointerCursor&&e.classList.remove("xterm-cursor-pointer")),t.leave&&t.leave(i,t.text)}_linkAtPosition(e,t){const i=e.range.start.y*this._bufferService.cols+e.range.start.x,s=e.range.end.y*this._bufferService.cols+e.range.end.x,r=t.y*this._bufferService.cols+t.x;return i<=r&&r<=s}_positionFromMouseEvent(e,t,i){const s=i.getCoords(e,t,this._bufferService.cols,this._bufferService.rows);if(s)return{x:s[0],y:s[1]+this._bufferService.buffer.ydisp}}_createLinkUnderlineEvent(e,t,i,s,r){return{x1:e,y1:t,x2:i,y2:s,cols:this._bufferService.cols,fg:r}}};t.Linkifier=l=s([r(1,c.IMouseService),r(2,c.IRenderService),r(3,h.IBufferService),r(4,c.ILinkProviderService)],l)},9042:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.tooMuchOutput=t.promptLabel=void 0,t.promptLabel="Terminal input",t.tooMuchOutput="Too much output to announce, navigate to rows manually to read"},3730:function(e,t,i){var s=this&&this.__decorate||function(e,t,i,s){var r,n=arguments.length,o=n<3?t:null===s?s=Object.getOwnPropertyDescriptor(t,i):s;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)o=Reflect.decorate(e,t,i,s);else for(var a=e.length-1;a>=0;a--)(r=e[a])&&(o=(n<3?r(o):n>3?r(t,i,o):r(t,i))||o);return n>3&&o&&Object.defineProperty(t,i,o),o},r=this&&this.__param||function(e,t){return function(i,s){t(i,s,e)}};Object.defineProperty(t,"__esModule",{value:!0}),t.OscLinkProvider=void 0;const n=i(511),o=i(2585);let a=t.OscLinkProvider=class{constructor(e,t,i){this._bufferService=e,this._optionsService=t,this._oscLinkService=i}provideLinks(e,t){const i=this._bufferService.buffer.lines.get(e-1);if(!i)return void t(void 0);const s=[],r=this._optionsService.rawOptions.linkHandler,o=new n.CellData,a=i.getTrimmedLength();let c=-1,l=-1,d=!1;for(let t=0;t<a;t++)if(-1!==l||i.hasContent(t)){if(i.loadCell(t,o),o.hasExtendedAttrs()&&o.extended.urlId){if(-1===l){l=t,c=o.extended.urlId;continue}d=o.extended.urlId!==c}else-1!==l&&(d=!0);if(d||-1!==l&&t===a-1){const i=this._oscLinkService.getLinkData(c)?.uri;if(i){const n={start:{x:l+1,y:e},end:{x:t+(d||t!==a-1?0:1),y:e}};let o=!1;if(!r?.allowNonHttpProtocols)try{const e=new URL(i);["http:","https:"].includes(e.protocol)||(o=!0)}catch(e){o=!0}o||s.push({text:i,range:n,activate:(e,t)=>r?r.activate(e,t,n):h(0,t),hover:(e,t)=>r?.hover?.(e,t,n),leave:(e,t)=>r?.leave?.(e,t,n)})}d=!1,o.hasExtendedAttrs()&&o.extended.urlId?(l=t,c=o.extended.urlId):(l=-1,c=-1)}}t(s)}};function h(e,t){if(confirm(`Do you want to navigate to ${t}?\n\nWARNING: This link could potentially be dangerous`)){const e=window.open();if(e){try{e.opener=null}catch{}e.location.href=t}else console.warn("Opening link blocked as opener could not be cleared")}}t.OscLinkProvider=a=s([r(0,o.IBufferService),r(1,o.IOptionsService),r(2,o.IOscLinkService)],a)},6193:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.RenderDebouncer=void 0,t.RenderDebouncer=class{constructor(e,t){this._renderCallback=e,this._coreBrowserService=t,this._refreshCallbacks=[]}dispose(){this._animationFrame&&(this._coreBrowserService.window.cancelAnimationFrame(this._animationFrame),this._animationFrame=void 0)}addRefreshCallback(e){return this._refreshCallbacks.push(e),this._animationFrame||(this._animationFrame=this._coreBrowserService.window.requestAnimationFrame((()=>this._innerRefresh()))),this._animationFrame}refresh(e,t,i){this._rowCount=i,e=void 0!==e?e:0,t=void 0!==t?t:this._rowCount-1,this._rowStart=void 0!==this._rowStart?Math.min(this._rowStart,e):e,this._rowEnd=void 0!==this._rowEnd?Math.max(this._rowEnd,t):t,this._animationFrame||(this._animationFrame=this._coreBrowserService.window.requestAnimationFrame((()=>this._innerRefresh())))}_innerRefresh(){if(this._animationFrame=void 0,void 0===this._rowStart||void 0===this._rowEnd||void 0===this._rowCount)return void this._runRefreshCallbacks();const e=Math.max(this._rowStart,0),t=Math.min(this._rowEnd,this._rowCount-1);this._rowStart=void 0,this._rowEnd=void 0,this._renderCallback(e,t),this._runRefreshCallbacks()}_runRefreshCallbacks(){for(const e of this._refreshCallbacks)e(0);this._refreshCallbacks=[]}}},3236:(e,t,i)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.Terminal=void 0;const s=i(3614),r=i(3656),n=i(3551),o=i(9042),a=i(3730),h=i(1680),c=i(3107),l=i(5744),d=i(2950),_=i(1296),u=i(428),f=i(4269),v=i(5114),p=i(8934),g=i(3230),m=i(9312),S=i(4725),C=i(6731),b=i(8055),w=i(8969),y=i(8460),E=i(844),k=i(6114),L=i(8437),D=i(2584),R=i(7399),x=i(5941),A=i(9074),B=i(2585),T=i(5435),M=i(4567),O=i(779);class P extends w.CoreTerminal{get onFocus(){return this._onFocus.event}get onBlur(){return this._onBlur.event}get onA11yChar(){return this._onA11yCharEmitter.event}get onA11yTab(){return this._onA11yTabEmitter.event}get onWillOpen(){return this._onWillOpen.event}constructor(e={}){super(e),this.browser=k,this._keyDownHandled=!1,this._keyDownSeen=!1,this._keyPressHandled=!1,this._unprocessedDeadKey=!1,this._accessibilityManager=this.register(new E.MutableDisposable),this._onCursorMove=this.register(new y.EventEmitter),this.onCursorMove=this._onCursorMove.event,this._onKey=this.register(new y.EventEmitter),this.onKey=this._onKey.event,this._onRender=this.register(new y.EventEmitter),this.onRender=this._onRender.event,this._onSelectionChange=this.register(new y.EventEmitter),this.onSelectionChange=this._onSelectionChange.event,this._onTitleChange=this.register(new y.EventEmitter),this.onTitleChange=this._onTitleChange.event,this._onBell=this.register(new y.EventEmitter),this.onBell=this._onBell.event,this._onFocus=this.register(new y.EventEmitter),this._onBlur=this.register(new y.EventEmitter),this._onA11yCharEmitter=this.register(new y.EventEmitter),this._onA11yTabEmitter=this.register(new y.EventEmitter),this._onWillOpen=this.register(new y.EventEmitter),this._setup(),this._decorationService=this._instantiationService.createInstance(A.DecorationService),this._instantiationService.setService(B.IDecorationService,this._decorationService),this._linkProviderService=this._instantiationService.createInstance(O.LinkProviderService),this._instantiationService.setService(S.ILinkProviderService,this._linkProviderService),this._linkProviderService.registerLinkProvider(this._instantiationService.createInstance(a.OscLinkProvider)),this.register(this._inputHandler.onRequestBell((()=>this._onBell.fire()))),this.register(this._inputHandler.onRequestRefreshRows(((e,t)=>this.refresh(e,t)))),this.register(this._inputHandler.onRequestSendFocus((()=>this._reportFocus()))),this.register(this._inputHandler.onRequestReset((()=>this.reset()))),this.register(this._inputHandler.onRequestWindowsOptionsReport((e=>this._reportWindowsOptions(e)))),this.register(this._inputHandler.onColor((e=>this._handleColorEvent(e)))),this.register((0,y.forwardEvent)(this._inputHandler.onCursorMove,this._onCursorMove)),this.register((0,y.forwardEvent)(this._inputHandler.onTitleChange,this._onTitleChange)),this.register((0,y.forwardEvent)(this._inputHandler.onA11yChar,this._onA11yCharEmitter)),this.register((0,y.forwardEvent)(this._inputHandler.onA11yTab,this._onA11yTabEmitter)),this.register(this._bufferService.onResize((e=>this._afterResize(e.cols,e.rows)))),this.register((0,E.toDisposable)((()=>{this._customKeyEventHandler=void 0,this.element?.parentNode?.removeChild(this.element)})))}_handleColorEvent(e){if(this._themeService)for(const t of e){let e,i="";switch(t.index){case 256:e="foreground",i="10";break;case 257:e="background",i="11";break;case 258:e="cursor",i="12";break;default:e="ansi",i="4;"+t.index}switch(t.type){case 0:const s=b.color.toColorRGB("ansi"===e?this._themeService.colors.ansi[t.index]:this._themeService.colors[e]);this.coreService.triggerDataEvent(`${D.C0.ESC}]${i};${(0,x.toRgbString)(s)}${D.C1_ESCAPED.ST}`);break;case 1:if("ansi"===e)this._themeService.modifyColors((e=>e.ansi[t.index]=b.channels.toColor(...t.color)));else{const i=e;this._themeService.modifyColors((e=>e[i]=b.channels.toColor(...t.color)))}break;case 2:this._themeService.restoreColor(t.index)}}}_setup(){super._setup(),this._customKeyEventHandler=void 0}get buffer(){return this.buffers.active}focus(){this.textarea&&this.textarea.focus({preventScroll:!0})}_handleScreenReaderModeOptionChange(e){e?!this._accessibilityManager.value&&this._renderService&&(this._accessibilityManager.value=this._instantiationService.createInstance(M.AccessibilityManager,this)):this._accessibilityManager.clear()}_handleTextAreaFocus(e){this.coreService.decPrivateModes.sendFocus&&this.coreService.triggerDataEvent(D.C0.ESC+"[I"),this.element.classList.add("focus"),this._showCursor(),this._onFocus.fire()}blur(){return this.textarea?.blur()}_handleTextAreaBlur(){this.textarea.value="",this.refresh(this.buffer.y,this.buffer.y),this.coreService.decPrivateModes.sendFocus&&this.coreService.triggerDataEvent(D.C0.ESC+"[O"),this.element.classList.remove("focus"),this._onBlur.fire()}_syncTextArea(){if(!this.textarea||!this.buffer.isCursorInViewport||this._compositionHelper.isComposing||!this._renderService)return;const e=this.buffer.ybase+this.buffer.y,t=this.buffer.lines.get(e);if(!t)return;const i=Math.min(this.buffer.x,this.cols-1),s=this._renderService.dimensions.css.cell.height,r=t.getWidth(i),n=this._renderService.dimensions.css.cell.width*r,o=this.buffer.y*this._renderService.dimensions.css.cell.height,a=i*this._renderService.dimensions.css.cell.width;this.textarea.style.left=a+"px",this.textarea.style.top=o+"px",this.textarea.style.width=n+"px",this.textarea.style.height=s+"px",this.textarea.style.lineHeight=s+"px",this.textarea.style.zIndex="-5"}_initGlobal(){this._bindKeys(),this.register((0,r.addDisposableDomListener)(this.element,"copy",(e=>{this.hasSelection()&&(0,s.copyHandler)(e,this._selectionService)})));const e=e=>(0,s.handlePasteEvent)(e,this.textarea,this.coreService,this.optionsService);this.register((0,r.addDisposableDomListener)(this.textarea,"paste",e)),this.register((0,r.addDisposableDomListener)(this.element,"paste",e)),k.isFirefox?this.register((0,r.addDisposableDomListener)(this.element,"mousedown",(e=>{2===e.button&&(0,s.rightClickHandler)(e,this.textarea,this.screenElement,this._selectionService,this.options.rightClickSelectsWord)}))):this.register((0,r.addDisposableDomListener)(this.element,"contextmenu",(e=>{(0,s.rightClickHandler)(e,this.textarea,this.screenElement,this._selectionService,this.options.rightClickSelectsWord)}))),k.isLinux&&this.register((0,r.addDisposableDomListener)(this.element,"auxclick",(e=>{1===e.button&&(0,s.moveTextAreaUnderMouseCursor)(e,this.textarea,this.screenElement)})))}_bindKeys(){this.register((0,r.addDisposableDomListener)(this.textarea,"keyup",(e=>this._keyUp(e)),!0)),this.register((0,r.addDisposableDomListener)(this.textarea,"keydown",(e=>this._keyDown(e)),!0)),this.register((0,r.addDisposableDomListener)(this.textarea,"keypress",(e=>this._keyPress(e)),!0)),this.register((0,r.addDisposableDomListener)(this.textarea,"compositionstart",(()=>this._compositionHelper.compositionstart()))),this.register((0,r.addDisposableDomListener)(this.textarea,"compositionupdate",(e=>this._compositionHelper.compositionupdate(e)))),this.register((0,r.addDisposableDomListener)(this.textarea,"compositionend",(()=>this._compositionHelper.compositionend()))),this.register((0,r.addDisposableDomListener)(this.textarea,"input",(e=>this._inputEvent(e)),!0)),this.register(this.onRender((()=>this._compositionHelper.updateCompositionElements())))}open(e){if(!e)throw new Error("Terminal requires a parent element.");if(e.isConnected||this._logService.debug("Terminal.open was called on an element that was not attached to the DOM"),this.element?.ownerDocument.defaultView&&this._coreBrowserService)return void(this.element.ownerDocument.defaultView!==this._coreBrowserService.window&&(this._coreBrowserService.window=this.element.ownerDocument.defaultView));this._document=e.ownerDocument,this.options.documentOverride&&this.options.documentOverride instanceof Document&&(this._document=this.optionsService.rawOptions.documentOverride),this.element=this._document.createElement("div"),this.element.dir="ltr",this.element.classList.add("terminal"),this.element.classList.add("xterm"),e.appendChild(this.element);const t=this._document.createDocumentFragment();this._viewportElement=this._document.createElement("div"),this._viewportElement.classList.add("xterm-viewport"),t.appendChild(this._viewportElement),this._viewportScrollArea=this._document.createElement("div"),this._viewportScrollArea.classList.add("xterm-scroll-area"),this._viewportElement.appendChild(this._viewportScrollArea),this.screenElement=this._document.createElement("div"),this.screenElement.classList.add("xterm-screen"),this.register((0,r.addDisposableDomListener)(this.screenElement,"mousemove",(e=>this.updateCursorStyle(e)))),this._helperContainer=this._document.createElement("div"),this._helperContainer.classList.add("xterm-helpers"),this.screenElement.appendChild(this._helperContainer),t.appendChild(this.screenElement),this.textarea=this._document.createElement("textarea"),this.textarea.classList.add("xterm-helper-textarea"),this.textarea.setAttribute("aria-label",o.promptLabel),k.isChromeOS||this.textarea.setAttribute("aria-multiline","false"),this.textarea.setAttribute("autocorrect","off"),this.textarea.setAttribute("autocapitalize","off"),this.textarea.setAttribute("spellcheck","false"),this.textarea.tabIndex=0,this._coreBrowserService=this.register(this._instantiationService.createInstance(v.CoreBrowserService,this.textarea,e.ownerDocument.defaultView??window,this._document??"undefined"!=typeof window?window.document:null)),this._instantiationService.setService(S.ICoreBrowserService,this._coreBrowserService),this.register((0,r.addDisposableDomListener)(this.textarea,"focus",(e=>this._handleTextAreaFocus(e)))),this.register((0,r.addDisposableDomListener)(this.textarea,"blur",(()=>this._handleTextAreaBlur()))),this._helperContainer.appendChild(this.textarea),this._charSizeService=this._instantiationService.createInstance(u.CharSizeService,this._document,this._helperContainer),this._instantiationService.setService(S.ICharSizeService,this._charSizeService),this._themeService=this._instantiationService.createInstance(C.ThemeService),this._instantiationService.setService(S.IThemeService,this._themeService),this._characterJoinerService=this._instantiationService.createInstance(f.CharacterJoinerService),this._instantiationService.setService(S.ICharacterJoinerService,this._characterJoinerService),this._renderService=this.register(this._instantiationService.createInstance(g.RenderService,this.rows,this.screenElement)),this._instantiationService.setService(S.IRenderService,this._renderService),this.register(this._renderService.onRenderedViewportChange((e=>this._onRender.fire(e)))),this.onResize((e=>this._renderService.resize(e.cols,e.rows))),this._compositionView=this._document.createElement("div"),this._compositionView.classList.add("composition-view"),this._compositionHelper=this._instantiationService.createInstance(d.CompositionHelper,this.textarea,this._compositionView),this._helperContainer.appendChild(this._compositionView),this._mouseService=this._instantiationService.createInstance(p.MouseService),this._instantiationService.setService(S.IMouseService,this._mouseService),this.linkifier=this.register(this._instantiationService.createInstance(n.Linkifier,this.screenElement)),this.element.appendChild(t);try{this._onWillOpen.fire(this.element)}catch{}this._renderService.hasRenderer()||this._renderService.setRenderer(this._createRenderer()),this.viewport=this._instantiationService.createInstance(h.Viewport,this._viewportElement,this._viewportScrollArea),this.viewport.onRequestScrollLines((e=>this.scrollLines(e.amount,e.suppressScrollEvent,1))),this.register(this._inputHandler.onRequestSyncScrollBar((()=>this.viewport.syncScrollArea()))),this.register(this.viewport),this.register(this.onCursorMove((()=>{this._renderService.handleCursorMove(),this._syncTextArea()}))),this.register(this.onResize((()=>this._renderService.handleResize(this.cols,this.rows)))),this.register(this.onBlur((()=>this._renderService.handleBlur()))),this.register(this.onFocus((()=>this._renderService.handleFocus()))),this.register(this._renderService.onDimensionsChange((()=>this.viewport.syncScrollArea()))),this._selectionService=this.register(this._instantiationService.createInstance(m.SelectionService,this.element,this.screenElement,this.linkifier)),this._instantiationService.setService(S.ISelectionService,this._selectionService),this.register(this._selectionService.onRequestScrollLines((e=>this.scrollLines(e.amount,e.suppressScrollEvent)))),this.register(this._selectionService.onSelectionChange((()=>this._onSelectionChange.fire()))),this.register(this._selectionService.onRequestRedraw((e=>this._renderService.handleSelectionChanged(e.start,e.end,e.columnSelectMode)))),this.register(this._selectionService.onLinuxMouseSelection((e=>{this.textarea.value=e,this.textarea.focus(),this.textarea.select()}))),this.register(this._onScroll.event((e=>{this.viewport.syncScrollArea(),this._selectionService.refresh()}))),this.register((0,r.addDisposableDomListener)(this._viewportElement,"scroll",(()=>this._selectionService.refresh()))),this.register(this._instantiationService.createInstance(c.BufferDecorationRenderer,this.screenElement)),this.register((0,r.addDisposableDomListener)(this.element,"mousedown",(e=>this._selectionService.handleMouseDown(e)))),this.coreMouseService.areMouseEventsActive?(this._selectionService.disable(),this.element.classList.add("enable-mouse-events")):this._selectionService.enable(),this.options.screenReaderMode&&(this._accessibilityManager.value=this._instantiationService.createInstance(M.AccessibilityManager,this)),this.register(this.optionsService.onSpecificOptionChange("screenReaderMode",(e=>this._handleScreenReaderModeOptionChange(e)))),this.options.overviewRulerWidth&&(this._overviewRulerRenderer=this.register(this._instantiationService.createInstance(l.OverviewRulerRenderer,this._viewportElement,this.screenElement))),this.optionsService.onSpecificOptionChange("overviewRulerWidth",(e=>{!this._overviewRulerRenderer&&e&&this._viewportElement&&this.screenElement&&(this._overviewRulerRenderer=this.register(this._instantiationService.createInstance(l.OverviewRulerRenderer,this._viewportElement,this.screenElement)))})),this._charSizeService.measure(),this.refresh(0,this.rows-1),this._initGlobal(),this.bindMouse()}_createRenderer(){return this._instantiationService.createInstance(_.DomRenderer,this,this._document,this.element,this.screenElement,this._viewportElement,this._helperContainer,this.linkifier)}bindMouse(){const e=this,t=this.element;function i(t){const i=e._mouseService.getMouseReportCoords(t,e.screenElement);if(!i)return!1;let s,r;switch(t.overrideType||t.type){case"mousemove":r=32,void 0===t.buttons?(s=3,void 0!==t.button&&(s=t.button<3?t.button:3)):s=1&t.buttons?0:4&t.buttons?1:2&t.buttons?2:3;break;case"mouseup":r=0,s=t.button<3?t.button:3;break;case"mousedown":r=1,s=t.button<3?t.button:3;break;case"wheel":if(e._customWheelEventHandler&&!1===e._customWheelEventHandler(t))return!1;if(0===e.viewport.getLinesScrolled(t))return!1;r=t.deltaY<0?0:1,s=4;break;default:return!1}return!(void 0===r||void 0===s||s>4)&&e.coreMouseService.triggerMouseEvent({col:i.col,row:i.row,x:i.x,y:i.y,button:s,action:r,ctrl:t.ctrlKey,alt:t.altKey,shift:t.shiftKey})}const s={mouseup:null,wheel:null,mousedrag:null,mousemove:null},n={mouseup:e=>(i(e),e.buttons||(this._document.removeEventListener("mouseup",s.mouseup),s.mousedrag&&this._document.removeEventListener("mousemove",s.mousedrag)),this.cancel(e)),wheel:e=>(i(e),this.cancel(e,!0)),mousedrag:e=>{e.buttons&&i(e)},mousemove:e=>{e.buttons||i(e)}};this.register(this.coreMouseService.onProtocolChange((e=>{e?("debug"===this.optionsService.rawOptions.logLevel&&this._logService.debug("Binding to mouse events:",this.coreMouseService.explainEvents(e)),this.element.classList.add("enable-mouse-events"),this._selectionService.disable()):(this._logService.debug("Unbinding from mouse events."),this.element.classList.remove("enable-mouse-events"),this._selectionService.enable()),8&e?s.mousemove||(t.addEventListener("mousemove",n.mousemove),s.mousemove=n.mousemove):(t.removeEventListener("mousemove",s.mousemove),s.mousemove=null),16&e?s.wheel||(t.addEventListener("wheel",n.wheel,{passive:!1}),s.wheel=n.wheel):(t.removeEventListener("wheel",s.wheel),s.wheel=null),2&e?s.mouseup||(s.mouseup=n.mouseup):(this._document.removeEventListener("mouseup",s.mouseup),s.mouseup=null),4&e?s.mousedrag||(s.mousedrag=n.mousedrag):(this._document.removeEventListener("mousemove",s.mousedrag),s.mousedrag=null)}))),this.coreMouseService.activeProtocol=this.coreMouseService.activeProtocol,this.register((0,r.addDisposableDomListener)(t,"mousedown",(e=>{if(e.preventDefault(),this.focus(),this.coreMouseService.areMouseEventsActive&&!this._selectionService.shouldForceSelection(e))return i(e),s.mouseup&&this._document.addEventListener("mouseup",s.mouseup),s.mousedrag&&this._document.addEventListener("mousemove",s.mousedrag),this.cancel(e)}))),this.register((0,r.addDisposableDomListener)(t,"wheel",(e=>{if(!s.wheel){if(this._customWheelEventHandler&&!1===this._customWheelEventHandler(e))return!1;if(!this.buffer.hasScrollback){const t=this.viewport.getLinesScrolled(e);if(0===t)return;const i=D.C0.ESC+(this.coreService.decPrivateModes.applicationCursorKeys?"O":"[")+(e.deltaY<0?"A":"B");let s="";for(let e=0;e<Math.abs(t);e++)s+=i;return this.coreService.triggerDataEvent(s,!0),this.cancel(e,!0)}return this.viewport.handleWheel(e)?this.cancel(e):void 0}}),{passive:!1})),this.register((0,r.addDisposableDomListener)(t,"touchstart",(e=>{if(!this.coreMouseService.areMouseEventsActive)return this.viewport.handleTouchStart(e),this.cancel(e)}),{passive:!0})),this.register((0,r.addDisposableDomListener)(t,"touchmove",(e=>{if(!this.coreMouseService.areMouseEventsActive)return this.viewport.handleTouchMove(e)?void 0:this.cancel(e)}),{passive:!1}))}refresh(e,t){this._renderService?.refreshRows(e,t)}updateCursorStyle(e){this._selectionService?.shouldColumnSelect(e)?this.element.classList.add("column-select"):this.element.classList.remove("column-select")}_showCursor(){this.coreService.isCursorInitialized||(this.coreService.isCursorInitialized=!0,this.refresh(this.buffer.y,this.buffer.y))}scrollLines(e,t,i=0){1===i?(super.scrollLines(e,t,i),this.refresh(0,this.rows-1)):this.viewport?.scrollLines(e)}paste(e){(0,s.paste)(e,this.textarea,this.coreService,this.optionsService)}attachCustomKeyEventHandler(e){this._customKeyEventHandler=e}attachCustomWheelEventHandler(e){this._customWheelEventHandler=e}registerLinkProvider(e){return this._linkProviderService.registerLinkProvider(e)}registerCharacterJoiner(e){if(!this._characterJoinerService)throw new Error("Terminal must be opened first");const t=this._characterJoinerService.register(e);return this.refresh(0,this.rows-1),t}deregisterCharacterJoiner(e){if(!this._characterJoinerService)throw new Error("Terminal must be opened first");this._characterJoinerService.deregister(e)&&this.refresh(0,this.rows-1)}get markers(){return this.buffer.markers}registerMarker(e){return this.buffer.addMarker(this.buffer.ybase+this.buffer.y+e)}registerDecoration(e){return this._decorationService.registerDecoration(e)}hasSelection(){return!!this._selectionService&&this._selectionService.hasSelection}select(e,t,i){this._selectionService.setSelection(e,t,i)}getSelection(){return this._selectionService?this._selectionService.selectionText:""}getSelectionPosition(){if(this._selectionService&&this._selectionService.hasSelection)return{start:{x:this._selectionService.selectionStart[0],y:this._selectionService.selectionStart[1]},end:{x:this._selectionService.selectionEnd[0],y:this._selectionService.selectionEnd[1]}}}clearSelection(){this._selectionService?.clearSelection()}selectAll(){this._selectionService?.selectAll()}selectLines(e,t){this._selectionService?.selectLines(e,t)}_keyDown(e){if(this._keyDownHandled=!1,this._keyDownSeen=!0,this._customKeyEventHandler&&!1===this._customKeyEventHandler(e))return!1;const t=this.browser.isMac&&this.options.macOptionIsMeta&&e.altKey;if(!t&&!this._compositionHelper.keydown(e))return this.options.scrollOnUserInput&&this.buffer.ybase!==this.buffer.ydisp&&this.scrollToBottom(),!1;t||"Dead"!==e.key&&"AltGraph"!==e.key||(this._unprocessedDeadKey=!0);const i=(0,R.evaluateKeyboardEvent)(e,this.coreService.decPrivateModes.applicationCursorKeys,this.browser.isMac,this.options.macOptionIsMeta);if(this.updateCursorStyle(e),3===i.type||2===i.type){const t=this.rows-1;return this.scrollLines(2===i.type?-t:t),this.cancel(e,!0)}return 1===i.type&&this.selectAll(),!!this._isThirdLevelShift(this.browser,e)||(i.cancel&&this.cancel(e,!0),!i.key||!!(e.key&&!e.ctrlKey&&!e.altKey&&!e.metaKey&&1===e.key.length&&e.key.charCodeAt(0)>=65&&e.key.charCodeAt(0)<=90)||(this._unprocessedDeadKey?(this._unprocessedDeadKey=!1,!0):(i.key!==D.C0.ETX&&i.key!==D.C0.CR||(this.textarea.value=""),this._onKey.fire({key:i.key,domEvent:e}),this._showCursor(),this.coreService.triggerDataEvent(i.key,!0),!this.optionsService.rawOptions.screenReaderMode||e.altKey||e.ctrlKey?this.cancel(e,!0):void(this._keyDownHandled=!0))))}_isThirdLevelShift(e,t){const i=e.isMac&&!this.options.macOptionIsMeta&&t.altKey&&!t.ctrlKey&&!t.metaKey||e.isWindows&&t.altKey&&t.ctrlKey&&!t.metaKey||e.isWindows&&t.getModifierState("AltGraph");return"keypress"===t.type?i:i&&(!t.keyCode||t.keyCode>47)}_keyUp(e){this._keyDownSeen=!1,this._customKeyEventHandler&&!1===this._customKeyEventHandler(e)||(function(e){return 16===e.keyCode||17===e.keyCode||18===e.keyCode}(e)||this.focus(),this.updateCursorStyle(e),this._keyPressHandled=!1)}_keyPress(e){let t;if(this._keyPressHandled=!1,this._keyDownHandled)return!1;if(this._customKeyEventHandler&&!1===this._customKeyEventHandler(e))return!1;if(this.cancel(e),e.charCode)t=e.charCode;else if(null===e.which||void 0===e.which)t=e.keyCode;else{if(0===e.which||0===e.charCode)return!1;t=e.which}return!(!t||(e.altKey||e.ctrlKey||e.metaKey)&&!this._isThirdLevelShift(this.browser,e)||(t=String.fromCharCode(t),this._onKey.fire({key:t,domEvent:e}),this._showCursor(),this.coreService.triggerDataEvent(t,!0),this._keyPressHandled=!0,this._unprocessedDeadKey=!1,0))}_inputEvent(e){if(e.data&&"insertText"===e.inputType&&(!e.composed||!this._keyDownSeen)&&!this.optionsService.rawOptions.screenReaderMode){if(this._keyPressHandled)return!1;this._unprocessedDeadKey=!1;const t=e.data;return this.coreService.triggerDataEvent(t,!0),this.cancel(e),!0}return!1}resize(e,t){e!==this.cols||t!==this.rows?super.resize(e,t):this._charSizeService&&!this._charSizeService.hasValidSize&&this._charSizeService.measure()}_afterResize(e,t){this._charSizeService?.measure(),this.viewport?.syncScrollArea(!0)}clear(){if(0!==this.buffer.ybase||0!==this.buffer.y){this.buffer.clearAllMarkers(),this.buffer.lines.set(0,this.buffer.lines.get(this.buffer.ybase+this.buffer.y)),this.buffer.lines.length=1,this.buffer.ydisp=0,this.buffer.ybase=0,this.buffer.y=0;for(let e=1;e<this.rows;e++)this.buffer.lines.push(this.buffer.getBlankLine(L.DEFAULT_ATTR_DATA));this._onScroll.fire({position:this.buffer.ydisp,source:0}),this.viewport?.reset(),this.refresh(0,this.rows-1)}}reset(){this.options.rows=this.rows,this.options.cols=this.cols;const e=this._customKeyEventHandler;this._setup(),super.reset(),this._selectionService?.reset(),this._decorationService.reset(),this.viewport?.reset(),this._customKeyEventHandler=e,this.refresh(0,this.rows-1)}clearTextureAtlas(){this._renderService?.clearTextureAtlas()}_reportFocus(){this.element?.classList.contains("focus")?this.coreService.triggerDataEvent(D.C0.ESC+"[I"):this.coreService.triggerDataEvent(D.C0.ESC+"[O")}_reportWindowsOptions(e){if(this._renderService)switch(e){case T.WindowsOptionsReportType.GET_WIN_SIZE_PIXELS:const e=this._renderService.dimensions.css.canvas.width.toFixed(0),t=this._renderService.dimensions.css.canvas.height.toFixed(0);this.coreService.triggerDataEvent(`${D.C0.ESC}[4;${t};${e}t`);break;case T.WindowsOptionsReportType.GET_CELL_SIZE_PIXELS:const i=this._renderService.dimensions.css.cell.width.toFixed(0),s=this._renderService.dimensions.css.cell.height.toFixed(0);this.coreService.triggerDataEvent(`${D.C0.ESC}[6;${s};${i}t`)}}cancel(e,t){if(this.options.cancelEvents||t)return e.preventDefault(),e.stopPropagation(),!1}}t.Terminal=P},9924:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.TimeBasedDebouncer=void 0,t.TimeBasedDebouncer=class{constructor(e,t=1e3){this._renderCallback=e,this._debounceThresholdMS=t,this._lastRefreshMs=0,this._additionalRefreshRequested=!1}dispose(){this._refreshTimeoutID&&clearTimeout(this._refreshTimeoutID)}refresh(e,t,i){this._rowCount=i,e=void 0!==e?e:0,t=void 0!==t?t:this._rowCount-1,this._rowStart=void 0!==this._rowStart?Math.min(this._rowStart,e):e,this._rowEnd=void 0!==this._rowEnd?Math.max(this._rowEnd,t):t;const s=Date.now();if(s-this._lastRefreshMs>=this._debounceThresholdMS)this._lastRefreshMs=s,this._innerRefresh();else if(!this._additionalRefreshRequested){const e=s-this._lastRefreshMs,t=this._debounceThresholdMS-e;this._additionalRefreshRequested=!0,this._refreshTimeoutID=window.setTimeout((()=>{this._lastRefreshMs=Date.now(),this._innerRefresh(),this._additionalRefreshRequested=!1,this._refreshTimeoutID=void 0}),t)}}_innerRefresh(){if(void 0===this._rowStart||void 0===this._rowEnd||void 0===this._rowCount)return;const e=Math.max(this._rowStart,0),t=Math.min(this._rowEnd,this._rowCount-1);this._rowStart=void 0,this._rowEnd=void 0,this._renderCallback(e,t)}}},1680:function(e,t,i){var s=this&&this.__decorate||function(e,t,i,s){var r,n=arguments.length,o=n<3?t:null===s?s=Object.getOwnPropertyDescriptor(t,i):s;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)o=Reflect.decorate(e,t,i,s);else for(var a=e.length-1;a>=0;a--)(r=e[a])&&(o=(n<3?r(o):n>3?r(t,i,o):r(t,i))||o);return n>3&&o&&Object.defineProperty(t,i,o),o},r=this&&this.__param||function(e,t){return function(i,s){t(i,s,e)}};Object.defineProperty(t,"__esModule",{value:!0}),t.Viewport=void 0;const n=i(3656),o=i(4725),a=i(8460),h=i(844),c=i(2585);let l=t.Viewport=class extends h.Disposable{constructor(e,t,i,s,r,o,h,c){super(),this._viewportElement=e,this._scrollArea=t,this._bufferService=i,this._optionsService=s,this._charSizeService=r,this._renderService=o,this._coreBrowserService=h,this.scrollBarWidth=0,this._currentRowHeight=0,this._currentDeviceCellHeight=0,this._lastRecordedBufferLength=0,this._lastRecordedViewportHeight=0,this._lastRecordedBufferHeight=0,this._lastTouchY=0,this._lastScrollTop=0,this._wheelPartialScroll=0,this._refreshAnimationFrame=null,this._ignoreNextScrollEvent=!1,this._smoothScrollState={startTime:0,origin:-1,target:-1},this._onRequestScrollLines=this.register(new a.EventEmitter),this.onRequestScrollLines=this._onRequestScrollLines.event,this.scrollBarWidth=this._viewportElement.offsetWidth-this._scrollArea.offsetWidth||15,this.register((0,n.addDisposableDomListener)(this._viewportElement,"scroll",this._handleScroll.bind(this))),this._activeBuffer=this._bufferService.buffer,this.register(this._bufferService.buffers.onBufferActivate((e=>this._activeBuffer=e.activeBuffer))),this._renderDimensions=this._renderService.dimensions,this.register(this._renderService.onDimensionsChange((e=>this._renderDimensions=e))),this._handleThemeChange(c.colors),this.register(c.onChangeColors((e=>this._handleThemeChange(e)))),this.register(this._optionsService.onSpecificOptionChange("scrollback",(()=>this.syncScrollArea()))),setTimeout((()=>this.syncScrollArea()))}_handleThemeChange(e){this._viewportElement.style.backgroundColor=e.background.css}reset(){this._currentRowHeight=0,this._currentDeviceCellHeight=0,this._lastRecordedBufferLength=0,this._lastRecordedViewportHeight=0,this._lastRecordedBufferHeight=0,this._lastTouchY=0,this._lastScrollTop=0,this._coreBrowserService.window.requestAnimationFrame((()=>this.syncScrollArea()))}_refresh(e){if(e)return this._innerRefresh(),void(null!==this._refreshAnimationFrame&&this._coreBrowserService.window.cancelAnimationFrame(this._refreshAnimationFrame));null===this._refreshAnimationFrame&&(this._refreshAnimationFrame=this._coreBrowserService.window.requestAnimationFrame((()=>this._innerRefresh())))}_innerRefresh(){if(this._charSizeService.height>0){this._currentRowHeight=this._renderDimensions.device.cell.height/this._coreBrowserService.dpr,this._currentDeviceCellHeight=this._renderDimensions.device.cell.height,this._lastRecordedViewportHeight=this._viewportElement.offsetHeight;const e=Math.round(this._currentRowHeight*this._lastRecordedBufferLength)+(this._lastRecordedViewportHeight-this._renderDimensions.css.canvas.height);this._lastRecordedBufferHeight!==e&&(this._lastRecordedBufferHeight=e,this._scrollArea.style.height=this._lastRecordedBufferHeight+"px")}const e=this._bufferService.buffer.ydisp*this._currentRowHeight;this._viewportElement.scrollTop!==e&&(this._ignoreNextScrollEvent=!0,this._viewportElement.scrollTop=e),this._refreshAnimationFrame=null}syncScrollArea(e=!1){if(this._lastRecordedBufferLength!==this._bufferService.buffer.lines.length)return this._lastRecordedBufferLength=this._bufferService.buffer.lines.length,void this._refresh(e);this._lastRecordedViewportHeight===this._renderService.dimensions.css.canvas.height&&this._lastScrollTop===this._activeBuffer.ydisp*this._currentRowHeight&&this._renderDimensions.device.cell.height===this._currentDeviceCellHeight||this._refresh(e)}_handleScroll(e){if(this._lastScrollTop=this._viewportElement.scrollTop,!this._viewportElement.offsetParent)return;if(this._ignoreNextScrollEvent)return this._ignoreNextScrollEvent=!1,void this._onRequestScrollLines.fire({amount:0,suppressScrollEvent:!0});const t=Math.round(this._lastScrollTop/this._currentRowHeight)-this._bufferService.buffer.ydisp;this._onRequestScrollLines.fire({amount:t,suppressScrollEvent:!0})}_smoothScroll(){if(this._isDisposed||-1===this._smoothScrollState.origin||-1===this._smoothScrollState.target)return;const e=this._smoothScrollPercent();this._viewportElement.scrollTop=this._smoothScrollState.origin+Math.round(e*(this._smoothScrollState.target-this._smoothScrollState.origin)),e<1?this._coreBrowserService.window.requestAnimationFrame((()=>this._smoothScroll())):this._clearSmoothScrollState()}_smoothScrollPercent(){return this._optionsService.rawOptions.smoothScrollDuration&&this._smoothScrollState.startTime?Math.max(Math.min((Date.now()-this._smoothScrollState.startTime)/this._optionsService.rawOptions.smoothScrollDuration,1),0):1}_clearSmoothScrollState(){this._smoothScrollState.startTime=0,this._smoothScrollState.origin=-1,this._smoothScrollState.target=-1}_bubbleScroll(e,t){const i=this._viewportElement.scrollTop+this._lastRecordedViewportHeight;return!(t<0&&0!==this._viewportElement.scrollTop||t>0&&i<this._lastRecordedBufferHeight)||(e.cancelable&&e.preventDefault(),!1)}handleWheel(e){const t=this._getPixelsScrolled(e);return 0!==t&&(this._optionsService.rawOptions.smoothScrollDuration?(this._smoothScrollState.startTime=Date.now(),this._smoothScrollPercent()<1?(this._smoothScrollState.origin=this._viewportElement.scrollTop,-1===this._smoothScrollState.target?this._smoothScrollState.target=this._viewportElement.scrollTop+t:this._smoothScrollState.target+=t,this._smoothScrollState.target=Math.max(Math.min(this._smoothScrollState.target,this._viewportElement.scrollHeight),0),this._smoothScroll()):this._clearSmoothScrollState()):this._viewportElement.scrollTop+=t,this._bubbleScroll(e,t))}scrollLines(e){if(0!==e)if(this._optionsService.rawOptions.smoothScrollDuration){const t=e*this._currentRowHeight;this._smoothScrollState.startTime=Date.now(),this._smoothScrollPercent()<1?(this._smoothScrollState.origin=this._viewportElement.scrollTop,this._smoothScrollState.target=this._smoothScrollState.origin+t,this._smoothScrollState.target=Math.max(Math.min(this._smoothScrollState.target,this._viewportElement.scrollHeight),0),this._smoothScroll()):this._clearSmoothScrollState()}else this._onRequestScrollLines.fire({amount:e,suppressScrollEvent:!1})}_getPixelsScrolled(e){if(0===e.deltaY||e.shiftKey)return 0;let t=this._applyScrollModifier(e.deltaY,e);return e.deltaMode===WheelEvent.DOM_DELTA_LINE?t*=this._currentRowHeight:e.deltaMode===WheelEvent.DOM_DELTA_PAGE&&(t*=this._currentRowHeight*this._bufferService.rows),t}getBufferElements(e,t){let i,s="";const r=[],n=t??this._bufferService.buffer.lines.length,o=this._bufferService.buffer.lines;for(let t=e;t<n;t++){const e=o.get(t);if(!e)continue;const n=o.get(t+1)?.isWrapped;if(s+=e.translateToString(!n),!n||t===o.length-1){const e=document.createElement("div");e.textContent=s,r.push(e),s.length>0&&(i=e),s=""}}return{bufferElements:r,cursorElement:i}}getLinesScrolled(e){if(0===e.deltaY||e.shiftKey)return 0;let t=this._applyScrollModifier(e.deltaY,e);return e.deltaMode===WheelEvent.DOM_DELTA_PIXEL?(t/=this._currentRowHeight+0,this._wheelPartialScroll+=t,t=Math.floor(Math.abs(this._wheelPartialScroll))*(this._wheelPartialScroll>0?1:-1),this._wheelPartialScroll%=1):e.deltaMode===WheelEvent.DOM_DELTA_PAGE&&(t*=this._bufferService.rows),t}_applyScrollModifier(e,t){const i=this._optionsService.rawOptions.fastScrollModifier;return"alt"===i&&t.altKey||"ctrl"===i&&t.ctrlKey||"shift"===i&&t.shiftKey?e*this._optionsService.rawOptions.fastScrollSensitivity*this._optionsService.rawOptions.scrollSensitivity:e*this._optionsService.rawOptions.scrollSensitivity}handleTouchStart(e){this._lastTouchY=e.touches[0].pageY}handleTouchMove(e){const t=this._lastTouchY-e.touches[0].pageY;return this._lastTouchY=e.touches[0].pageY,0!==t&&(this._viewportElement.scrollTop+=t,this._bubbleScroll(e,t))}};t.Viewport=l=s([r(2,c.IBufferService),r(3,c.IOptionsService),r(4,o.ICharSizeService),r(5,o.IRenderService),r(6,o.ICoreBrowserService),r(7,o.IThemeService)],l)},3107:function(e,t,i){var s=this&&this.__decorate||function(e,t,i,s){var r,n=arguments.length,o=n<3?t:null===s?s=Object.getOwnPropertyDescriptor(t,i):s;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)o=Reflect.decorate(e,t,i,s);else for(var a=e.length-1;a>=0;a--)(r=e[a])&&(o=(n<3?r(o):n>3?r(t,i,o):r(t,i))||o);return n>3&&o&&Object.defineProperty(t,i,o),o},r=this&&this.__param||function(e,t){return function(i,s){t(i,s,e)}};Object.defineProperty(t,"__esModule",{value:!0}),t.BufferDecorationRenderer=void 0;const n=i(4725),o=i(844),a=i(2585);let h=t.BufferDecorationRenderer=class extends o.Disposable{constructor(e,t,i,s,r){super(),this._screenElement=e,this._bufferService=t,this._coreBrowserService=i,this._decorationService=s,this._renderService=r,this._decorationElements=new Map,this._altBufferIsActive=!1,this._dimensionsChanged=!1,this._container=document.createElement("div"),this._container.classList.add("xterm-decoration-container"),this._screenElement.appendChild(this._container),this.register(this._renderService.onRenderedViewportChange((()=>this._doRefreshDecorations()))),this.register(this._renderService.onDimensionsChange((()=>{this._dimensionsChanged=!0,this._queueRefresh()}))),this.register(this._coreBrowserService.onDprChange((()=>this._queueRefresh()))),this.register(this._bufferService.buffers.onBufferActivate((()=>{this._altBufferIsActive=this._bufferService.buffer===this._bufferService.buffers.alt}))),this.register(this._decorationService.onDecorationRegistered((()=>this._queueRefresh()))),this.register(this._decorationService.onDecorationRemoved((e=>this._removeDecoration(e)))),this.register((0,o.toDisposable)((()=>{this._container.remove(),this._decorationElements.clear()})))}_queueRefresh(){void 0===this._animationFrame&&(this._animationFrame=this._renderService.addRefreshCallback((()=>{this._doRefreshDecorations(),this._animationFrame=void 0})))}_doRefreshDecorations(){for(const e of this._decorationService.decorations)this._renderDecoration(e);this._dimensionsChanged=!1}_renderDecoration(e){this._refreshStyle(e),this._dimensionsChanged&&this._refreshXPosition(e)}_createElement(e){const t=this._coreBrowserService.mainDocument.createElement("div");t.classList.add("xterm-decoration"),t.classList.toggle("xterm-decoration-top-layer","top"===e?.options?.layer),t.style.width=`${Math.round((e.options.width||1)*this._renderService.dimensions.css.cell.width)}px`,t.style.height=(e.options.height||1)*this._renderService.dimensions.css.cell.height+"px",t.style.top=(e.marker.line-this._bufferService.buffers.active.ydisp)*this._renderService.dimensions.css.cell.height+"px",t.style.lineHeight=`${this._renderService.dimensions.css.cell.height}px`;const i=e.options.x??0;return i&&i>this._bufferService.cols&&(t.style.display="none"),this._refreshXPosition(e,t),t}_refreshStyle(e){const t=e.marker.line-this._bufferService.buffers.active.ydisp;if(t<0||t>=this._bufferService.rows)e.element&&(e.element.style.display="none",e.onRenderEmitter.fire(e.element));else{let i=this._decorationElements.get(e);i||(i=this._createElement(e),e.element=i,this._decorationElements.set(e,i),this._container.appendChild(i),e.onDispose((()=>{this._decorationElements.delete(e),i.remove()}))),i.style.top=t*this._renderService.dimensions.css.cell.height+"px",i.style.display=this._altBufferIsActive?"none":"block",e.onRenderEmitter.fire(i)}}_refreshXPosition(e,t=e.element){if(!t)return;const i=e.options.x??0;"right"===(e.options.anchor||"left")?t.style.right=i?i*this._renderService.dimensions.css.cell.width+"px":"":t.style.left=i?i*this._renderService.dimensions.css.cell.width+"px":""}_removeDecoration(e){this._decorationElements.get(e)?.remove(),this._decorationElements.delete(e),e.dispose()}};t.BufferDecorationRenderer=h=s([r(1,a.IBufferService),r(2,n.ICoreBrowserService),r(3,a.IDecorationService),r(4,n.IRenderService)],h)},5871:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.ColorZoneStore=void 0,t.ColorZoneStore=class{constructor(){this._zones=[],this._zonePool=[],this._zonePoolIndex=0,this._linePadding={full:0,left:0,center:0,right:0}}get zones(){return this._zonePool.length=Math.min(this._zonePool.length,this._zones.length),this._zones}clear(){this._zones.length=0,this._zonePoolIndex=0}addDecoration(e){if(e.options.overviewRulerOptions){for(const t of this._zones)if(t.color===e.options.overviewRulerOptions.color&&t.position===e.options.overviewRulerOptions.position){if(this._lineIntersectsZone(t,e.marker.line))return;if(this._lineAdjacentToZone(t,e.marker.line,e.options.overviewRulerOptions.position))return void this._addLineToZone(t,e.marker.line)}if(this._zonePoolIndex<this._zonePool.length)return this._zonePool[this._zonePoolIndex].color=e.options.overviewRulerOptions.color,this._zonePool[this._zonePoolIndex].position=e.options.overviewRulerOptions.position,this._zonePool[this._zonePoolIndex].startBufferLine=e.marker.line,this._zonePool[this._zonePoolIndex].endBufferLine=e.marker.line,void this._zones.push(this._zonePool[this._zonePoolIndex++]);this._zones.push({color:e.options.overviewRulerOptions.color,position:e.options.overviewRulerOptions.position,startBufferLine:e.marker.line,endBufferLine:e.marker.line}),this._zonePool.push(this._zones[this._zones.length-1]),this._zonePoolIndex++}}setPadding(e){this._linePadding=e}_lineIntersectsZone(e,t){return t>=e.startBufferLine&&t<=e.endBufferLine}_lineAdjacentToZone(e,t,i){return t>=e.startBufferLine-this._linePadding[i||"full"]&&t<=e.endBufferLine+this._linePadding[i||"full"]}_addLineToZone(e,t){e.startBufferLine=Math.min(e.startBufferLine,t),e.endBufferLine=Math.max(e.endBufferLine,t)}}},5744:function(e,t,i){var s=this&&this.__decorate||function(e,t,i,s){var r,n=arguments.length,o=n<3?t:null===s?s=Object.getOwnPropertyDescriptor(t,i):s;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)o=Reflect.decorate(e,t,i,s);else for(var a=e.length-1;a>=0;a--)(r=e[a])&&(o=(n<3?r(o):n>3?r(t,i,o):r(t,i))||o);return n>3&&o&&Object.defineProperty(t,i,o),o},r=this&&this.__param||function(e,t){return function(i,s){t(i,s,e)}};Object.defineProperty(t,"__esModule",{value:!0}),t.OverviewRulerRenderer=void 0;const n=i(5871),o=i(4725),a=i(844),h=i(2585),c={full:0,left:0,center:0,right:0},l={full:0,left:0,center:0,right:0},d={full:0,left:0,center:0,right:0};let _=t.OverviewRulerRenderer=class extends a.Disposable{get _width(){return this._optionsService.options.overviewRulerWidth||0}constructor(e,t,i,s,r,o,h){super(),this._viewportElement=e,this._screenElement=t,this._bufferService=i,this._decorationService=s,this._renderService=r,this._optionsService=o,this._coreBrowserService=h,this._colorZoneStore=new n.ColorZoneStore,this._shouldUpdateDimensions=!0,this._shouldUpdateAnchor=!0,this._lastKnownBufferLength=0,this._canvas=this._coreBrowserService.mainDocument.createElement("canvas"),this._canvas.classList.add("xterm-decoration-overview-ruler"),this._refreshCanvasDimensions(),this._viewportElement.parentElement?.insertBefore(this._canvas,this._viewportElement);const c=this._canvas.getContext("2d");if(!c)throw new Error("Ctx cannot be null");this._ctx=c,this._registerDecorationListeners(),this._registerBufferChangeListeners(),this._registerDimensionChangeListeners(),this.register((0,a.toDisposable)((()=>{this._canvas?.remove()})))}_registerDecorationListeners(){this.register(this._decorationService.onDecorationRegistered((()=>this._queueRefresh(void 0,!0)))),this.register(this._decorationService.onDecorationRemoved((()=>this._queueRefresh(void 0,!0))))}_registerBufferChangeListeners(){this.register(this._renderService.onRenderedViewportChange((()=>this._queueRefresh()))),this.register(this._bufferService.buffers.onBufferActivate((()=>{this._canvas.style.display=this._bufferService.buffer===this._bufferService.buffers.alt?"none":"block"}))),this.register(this._bufferService.onScroll((()=>{this._lastKnownBufferLength!==this._bufferService.buffers.normal.lines.length&&(this._refreshDrawHeightConstants(),this._refreshColorZonePadding())})))}_registerDimensionChangeListeners(){this.register(this._renderService.onRender((()=>{this._containerHeight&&this._containerHeight===this._screenElement.clientHeight||(this._queueRefresh(!0),this._containerHeight=this._screenElement.clientHeight)}))),this.register(this._optionsService.onSpecificOptionChange("overviewRulerWidth",(()=>this._queueRefresh(!0)))),this.register(this._coreBrowserService.onDprChange((()=>this._queueRefresh(!0)))),this._queueRefresh(!0)}_refreshDrawConstants(){const e=Math.floor(this._canvas.width/3),t=Math.ceil(this._canvas.width/3);l.full=this._canvas.width,l.left=e,l.center=t,l.right=e,this._refreshDrawHeightConstants(),d.full=0,d.left=0,d.center=l.left,d.right=l.left+l.center}_refreshDrawHeightConstants(){c.full=Math.round(2*this._coreBrowserService.dpr);const e=this._canvas.height/this._bufferService.buffer.lines.length,t=Math.round(Math.max(Math.min(e,12),6)*this._coreBrowserService.dpr);c.left=t,c.center=t,c.right=t}_refreshColorZonePadding(){this._colorZoneStore.setPadding({full:Math.floor(this._bufferService.buffers.active.lines.length/(this._canvas.height-1)*c.full),left:Math.floor(this._bufferService.buffers.active.lines.length/(this._canvas.height-1)*c.left),center:Math.floor(this._bufferService.buffers.active.lines.length/(this._canvas.height-1)*c.center),right:Math.floor(this._bufferService.buffers.active.lines.length/(this._canvas.height-1)*c.right)}),this._lastKnownBufferLength=this._bufferService.buffers.normal.lines.length}_refreshCanvasDimensions(){this._canvas.style.width=`${this._width}px`,this._canvas.width=Math.round(this._width*this._coreBrowserService.dpr),this._canvas.style.height=`${this._screenElement.clientHeight}px`,this._canvas.height=Math.round(this._screenElement.clientHeight*this._coreBrowserService.dpr),this._refreshDrawConstants(),this._refreshColorZonePadding()}_refreshDecorations(){this._shouldUpdateDimensions&&this._refreshCanvasDimensions(),this._ctx.clearRect(0,0,this._canvas.width,this._canvas.height),this._colorZoneStore.clear();for(const e of this._decorationService.decorations)this._colorZoneStore.addDecoration(e);this._ctx.lineWidth=1;const e=this._colorZoneStore.zones;for(const t of e)"full"!==t.position&&this._renderColorZone(t);for(const t of e)"full"===t.position&&this._renderColorZone(t);this._shouldUpdateDimensions=!1,this._shouldUpdateAnchor=!1}_renderColorZone(e){this._ctx.fillStyle=e.color,this._ctx.fillRect(d[e.position||"full"],Math.round((this._canvas.height-1)*(e.startBufferLine/this._bufferService.buffers.active.lines.length)-c[e.position||"full"]/2),l[e.position||"full"],Math.round((this._canvas.height-1)*((e.endBufferLine-e.startBufferLine)/this._bufferService.buffers.active.lines.length)+c[e.position||"full"]))}_queueRefresh(e,t){this._shouldUpdateDimensions=e||this._shouldUpdateDimensions,this._shouldUpdateAnchor=t||this._shouldUpdateAnchor,void 0===this._animationFrame&&(this._animationFrame=this._coreBrowserService.window.requestAnimationFrame((()=>{this._refreshDecorations(),this._animationFrame=void 0})))}};t.OverviewRulerRenderer=_=s([r(2,h.IBufferService),r(3,h.IDecorationService),r(4,o.IRenderService),r(5,h.IOptionsService),r(6,o.ICoreBrowserService)],_)},2950:function(e,t,i){var s=this&&this.__decorate||function(e,t,i,s){var r,n=arguments.length,o=n<3?t:null===s?s=Object.getOwnPropertyDescriptor(t,i):s;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)o=Reflect.decorate(e,t,i,s);else for(var a=e.length-1;a>=0;a--)(r=e[a])&&(o=(n<3?r(o):n>3?r(t,i,o):r(t,i))||o);return n>3&&o&&Object.defineProperty(t,i,o),o},r=this&&this.__param||function(e,t){return function(i,s){t(i,s,e)}};Object.defineProperty(t,"__esModule",{value:!0}),t.CompositionHelper=void 0;const n=i(4725),o=i(2585),a=i(2584);let h=t.CompositionHelper=class{get isComposing(){return this._isComposing}constructor(e,t,i,s,r,n){this._textarea=e,this._compositionView=t,this._bufferService=i,this._optionsService=s,this._coreService=r,this._renderService=n,this._isComposing=!1,this._isSendingComposition=!1,this._compositionPosition={start:0,end:0},this._dataAlreadySent=""}compositionstart(){this._isComposing=!0,this._compositionPosition.start=this._textarea.value.length,this._compositionView.textContent="",this._dataAlreadySent="",this._compositionView.classList.add("active")}compositionupdate(e){this._compositionView.textContent=e.data,this.updateCompositionElements(),setTimeout((()=>{this._compositionPosition.end=this._textarea.value.length}),0)}compositionend(){this._finalizeComposition(!0)}keydown(e){if(this._isComposing||this._isSendingComposition){if(229===e.keyCode)return!1;if(16===e.keyCode||17===e.keyCode||18===e.keyCode)return!1;this._finalizeComposition(!1)}return 229!==e.keyCode||(this._handleAnyTextareaChanges(),!1)}_finalizeComposition(e){if(this._compositionView.classList.remove("active"),this._isComposing=!1,e){const e={start:this._compositionPosition.start,end:this._compositionPosition.end};this._isSendingComposition=!0,setTimeout((()=>{if(this._isSendingComposition){let t;this._isSendingComposition=!1,e.start+=this._dataAlreadySent.length,t=this._isComposing?this._textarea.value.substring(e.start,e.end):this._textarea.value.substring(e.start),t.length>0&&this._coreService.triggerDataEvent(t,!0)}}),0)}else{this._isSendingComposition=!1;const e=this._textarea.value.substring(this._compositionPosition.start,this._compositionPosition.end);this._coreService.triggerDataEvent(e,!0)}}_handleAnyTextareaChanges(){const e=this._textarea.value;setTimeout((()=>{if(!this._isComposing){const t=this._textarea.value,i=t.replace(e,"");this._dataAlreadySent=i,t.length>e.length?this._coreService.triggerDataEvent(i,!0):t.length<e.length?this._coreService.triggerDataEvent(`${a.C0.DEL}`,!0):t.length===e.length&&t!==e&&this._coreService.triggerDataEvent(t,!0)}}),0)}updateCompositionElements(e){if(this._isComposing){if(this._bufferService.buffer.isCursorInViewport){const e=Math.min(this._bufferService.buffer.x,this._bufferService.cols-1),t=this._renderService.dimensions.css.cell.height,i=this._bufferService.buffer.y*this._renderService.dimensions.css.cell.height,s=e*this._renderService.dimensions.css.cell.width;this._compositionView.style.left=s+"px",this._compositionView.style.top=i+"px",this._compositionView.style.height=t+"px",this._compositionView.style.lineHeight=t+"px",this._compositionView.style.fontFamily=this._optionsService.rawOptions.fontFamily,this._compositionView.style.fontSize=this._optionsService.rawOptions.fontSize+"px";const r=this._compositionView.getBoundingClientRect();this._textarea.style.left=s+"px",this._textarea.style.top=i+"px",this._textarea.style.width=Math.max(r.width,1)+"px",this._textarea.style.height=Math.max(r.height,1)+"px",this._textarea.style.lineHeight=r.height+"px"}e||setTimeout((()=>this.updateCompositionElements(!0)),0)}}};t.CompositionHelper=h=s([r(2,o.IBufferService),r(3,o.IOptionsService),r(4,o.ICoreService),r(5,n.IRenderService)],h)},9806:(e,t)=>{function i(e,t,i){const s=i.getBoundingClientRect(),r=e.getComputedStyle(i),n=parseInt(r.getPropertyValue("padding-left")),o=parseInt(r.getPropertyValue("padding-top"));return[t.clientX-s.left-n,t.clientY-s.top-o]}Object.defineProperty(t,"__esModule",{value:!0}),t.getCoords=t.getCoordsRelativeToElement=void 0,t.getCoordsRelativeToElement=i,t.getCoords=function(e,t,s,r,n,o,a,h,c){if(!o)return;const l=i(e,t,s);return l?(l[0]=Math.ceil((l[0]+(c?a/2:0))/a),l[1]=Math.ceil(l[1]/h),l[0]=Math.min(Math.max(l[0],1),r+(c?1:0)),l[1]=Math.min(Math.max(l[1],1),n),l):void 0}},9504:(e,t,i)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.moveToCellSequence=void 0;const s=i(2584);function r(e,t,i,s){const r=e-n(e,i),a=t-n(t,i),l=Math.abs(r-a)-function(e,t,i){let s=0;const r=e-n(e,i),a=t-n(t,i);for(let n=0;n<Math.abs(r-a);n++){const a="A"===o(e,t)?-1:1,h=i.buffer.lines.get(r+a*n);h?.isWrapped&&s++}return s}(e,t,i);return c(l,h(o(e,t),s))}function n(e,t){let i=0,s=t.buffer.lines.get(e),r=s?.isWrapped;for(;r&&e>=0&&e<t.rows;)i++,s=t.buffer.lines.get(--e),r=s?.isWrapped;return i}function o(e,t){return e>t?"A":"B"}function a(e,t,i,s,r,n){let o=e,a=t,h="";for(;o!==i||a!==s;)o+=r?1:-1,r&&o>n.cols-1?(h+=n.buffer.translateBufferLineToString(a,!1,e,o),o=0,e=0,a++):!r&&o<0&&(h+=n.buffer.translateBufferLineToString(a,!1,0,e+1),o=n.cols-1,e=o,a--);return h+n.buffer.translateBufferLineToString(a,!1,e,o)}function h(e,t){const i=t?"O":"[";return s.C0.ESC+i+e}function c(e,t){e=Math.floor(e);let i="";for(let s=0;s<e;s++)i+=t;return i}t.moveToCellSequence=function(e,t,i,s){const o=i.buffer.x,l=i.buffer.y;if(!i.buffer.hasScrollback)return function(e,t,i,s,o,l){return 0===r(t,s,o,l).length?"":c(a(e,t,e,t-n(t,o),!1,o).length,h("D",l))}(o,l,0,t,i,s)+r(l,t,i,s)+function(e,t,i,s,o,l){let d;d=r(t,s,o,l).length>0?s-n(s,o):t;const _=s,u=function(e,t,i,s,o,a){let h;return h=r(i,s,o,a).length>0?s-n(s,o):t,e<i&&h<=s||e>=i&&h<s?"C":"D"}(e,t,i,s,o,l);return c(a(e,d,i,_,"C"===u,o).length,h(u,l))}(o,l,e,t,i,s);let d;if(l===t)return d=o>e?"D":"C",c(Math.abs(o-e),h(d,s));d=l>t?"D":"C";const _=Math.abs(l-t);return c(function(e,t){return t.cols-e}(l>t?e:o,i)+(_-1)*i.cols+1+((l>t?o:e)-1),h(d,s))}},1296:function(e,t,i){var s=this&&this.__decorate||function(e,t,i,s){var r,n=arguments.length,o=n<3?t:null===s?s=Object.getOwnPropertyDescriptor(t,i):s;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)o=Reflect.decorate(e,t,i,s);else for(var a=e.length-1;a>=0;a--)(r=e[a])&&(o=(n<3?r(o):n>3?r(t,i,o):r(t,i))||o);return n>3&&o&&Object.defineProperty(t,i,o),o},r=this&&this.__param||function(e,t){return function(i,s){t(i,s,e)}};Object.defineProperty(t,"__esModule",{value:!0}),t.DomRenderer=void 0;const n=i(3787),o=i(2550),a=i(2223),h=i(6171),c=i(6052),l=i(4725),d=i(8055),_=i(8460),u=i(844),f=i(2585),v="xterm-dom-renderer-owner-",p="xterm-rows",g="xterm-fg-",m="xterm-bg-",S="xterm-focus",C="xterm-selection";let b=1,w=t.DomRenderer=class extends u.Disposable{constructor(e,t,i,s,r,a,l,d,f,g,m,S,w){super(),this._terminal=e,this._document=t,this._element=i,this._screenElement=s,this._viewportElement=r,this._helperContainer=a,this._linkifier2=l,this._charSizeService=f,this._optionsService=g,this._bufferService=m,this._coreBrowserService=S,this._themeService=w,this._terminalClass=b++,this._rowElements=[],this._selectionRenderModel=(0,c.createSelectionRenderModel)(),this.onRequestRedraw=this.register(new _.EventEmitter).event,this._rowContainer=this._document.createElement("div"),this._rowContainer.classList.add(p),this._rowContainer.style.lineHeight="normal",this._rowContainer.setAttribute("aria-hidden","true"),this._refreshRowElements(this._bufferService.cols,this._bufferService.rows),this._selectionContainer=this._document.createElement("div"),this._selectionContainer.classList.add(C),this._selectionContainer.setAttribute("aria-hidden","true"),this.dimensions=(0,h.createRenderDimensions)(),this._updateDimensions(),this.register(this._optionsService.onOptionChange((()=>this._handleOptionsChanged()))),this.register(this._themeService.onChangeColors((e=>this._injectCss(e)))),this._injectCss(this._themeService.colors),this._rowFactory=d.createInstance(n.DomRendererRowFactory,document),this._element.classList.add(v+this._terminalClass),this._screenElement.appendChild(this._rowContainer),this._screenElement.appendChild(this._selectionContainer),this.register(this._linkifier2.onShowLinkUnderline((e=>this._handleLinkHover(e)))),this.register(this._linkifier2.onHideLinkUnderline((e=>this._handleLinkLeave(e)))),this.register((0,u.toDisposable)((()=>{this._element.classList.remove(v+this._terminalClass),this._rowContainer.remove(),this._selectionContainer.remove(),this._widthCache.dispose(),this._themeStyleElement.remove(),this._dimensionsStyleElement.remove()}))),this._widthCache=new o.WidthCache(this._document,this._helperContainer),this._widthCache.setFont(this._optionsService.rawOptions.fontFamily,this._optionsService.rawOptions.fontSize,this._optionsService.rawOptions.fontWeight,this._optionsService.rawOptions.fontWeightBold),this._setDefaultSpacing()}_updateDimensions(){const e=this._coreBrowserService.dpr;this.dimensions.device.char.width=this._charSizeService.width*e,this.dimensions.device.char.height=Math.ceil(this._charSizeService.height*e),this.dimensions.device.cell.width=this.dimensions.device.char.width+Math.round(this._optionsService.rawOptions.letterSpacing),this.dimensions.device.cell.height=Math.floor(this.dimensions.device.char.height*this._optionsService.rawOptions.lineHeight),this.dimensions.device.char.left=0,this.dimensions.device.char.top=0,this.dimensions.device.canvas.width=this.dimensions.device.cell.width*this._bufferService.cols,this.dimensions.device.canvas.height=this.dimensions.device.cell.height*this._bufferService.rows,this.dimensions.css.canvas.width=Math.round(this.dimensions.device.canvas.width/e),this.dimensions.css.canvas.height=Math.round(this.dimensions.device.canvas.height/e),this.dimensions.css.cell.width=this.dimensions.css.canvas.width/this._bufferService.cols,this.dimensions.css.cell.height=this.dimensions.css.canvas.height/this._bufferService.rows;for(const e of this._rowElements)e.style.width=`${this.dimensions.css.canvas.width}px`,e.style.height=`${this.dimensions.css.cell.height}px`,e.style.lineHeight=`${this.dimensions.css.cell.height}px`,e.style.overflow="hidden";this._dimensionsStyleElement||(this._dimensionsStyleElement=this._document.createElement("style"),this._screenElement.appendChild(this._dimensionsStyleElement));const t=`${this._terminalSelector} .${p} span { display: inline-block; height: 100%; vertical-align: top;}`;this._dimensionsStyleElement.textContent=t,this._selectionContainer.style.height=this._viewportElement.style.height,this._screenElement.style.width=`${this.dimensions.css.canvas.width}px`,this._screenElement.style.height=`${this.dimensions.css.canvas.height}px`}_injectCss(e){this._themeStyleElement||(this._themeStyleElement=this._document.createElement("style"),this._screenElement.appendChild(this._themeStyleElement));let t=`${this._terminalSelector} .${p} { color: ${e.foreground.css}; font-family: ${this._optionsService.rawOptions.fontFamily}; font-size: ${this._optionsService.rawOptions.fontSize}px; font-kerning: none; white-space: pre}`;t+=`${this._terminalSelector} .${p} .xterm-dim { color: ${d.color.multiplyOpacity(e.foreground,.5).css};}`,t+=`${this._terminalSelector} span:not(.xterm-bold) { font-weight: ${this._optionsService.rawOptions.fontWeight};}${this._terminalSelector} span.xterm-bold { font-weight: ${this._optionsService.rawOptions.fontWeightBold};}${this._terminalSelector} span.xterm-italic { font-style: italic;}`;const i=`blink_underline_${this._terminalClass}`,s=`blink_bar_${this._terminalClass}`,r=`blink_block_${this._terminalClass}`;t+=`@keyframes ${i} { 50% {  border-bottom-style: hidden; }}`,t+=`@keyframes ${s} { 50% {  box-shadow: none; }}`,t+=`@keyframes ${r} { 0% {  background-color: ${e.cursor.css};  color: ${e.cursorAccent.css}; } 50% {  background-color: inherit;  color: ${e.cursor.css}; }}`,t+=`${this._terminalSelector} .${p}.${S} .xterm-cursor.xterm-cursor-blink.xterm-cursor-underline { animation: ${i} 1s step-end infinite;}${this._terminalSelector} .${p}.${S} .xterm-cursor.xterm-cursor-blink.xterm-cursor-bar { animation: ${s} 1s step-end infinite;}${this._terminalSelector} .${p}.${S} .xterm-cursor.xterm-cursor-blink.xterm-cursor-block { animation: ${r} 1s step-end infinite;}${this._terminalSelector} .${p} .xterm-cursor.xterm-cursor-block { background-color: ${e.cursor.css}; color: ${e.cursorAccent.css};}${this._terminalSelector} .${p} .xterm-cursor.xterm-cursor-block:not(.xterm-cursor-blink) { background-color: ${e.cursor.css} !important; color: ${e.cursorAccent.css} !important;}${this._terminalSelector} .${p} .xterm-cursor.xterm-cursor-outline { outline: 1px solid ${e.cursor.css}; outline-offset: -1px;}${this._terminalSelector} .${p} .xterm-cursor.xterm-cursor-bar { box-shadow: ${this._optionsService.rawOptions.cursorWidth}px 0 0 ${e.cursor.css} inset;}${this._terminalSelector} .${p} .xterm-cursor.xterm-cursor-underline { border-bottom: 1px ${e.cursor.css}; border-bottom-style: solid; height: calc(100% - 1px);}`,t+=`${this._terminalSelector} .${C} { position: absolute; top: 0; left: 0; z-index: 1; pointer-events: none;}${this._terminalSelector}.focus .${C} div { position: absolute; background-color: ${e.selectionBackgroundOpaque.css};}${this._terminalSelector} .${C} div { position: absolute; background-color: ${e.selectionInactiveBackgroundOpaque.css};}`;for(const[i,s]of e.ansi.entries())t+=`${this._terminalSelector} .${g}${i} { color: ${s.css}; }${this._terminalSelector} .${g}${i}.xterm-dim { color: ${d.color.multiplyOpacity(s,.5).css}; }${this._terminalSelector} .${m}${i} { background-color: ${s.css}; }`;t+=`${this._terminalSelector} .${g}${a.INVERTED_DEFAULT_COLOR} { color: ${d.color.opaque(e.background).css}; }${this._terminalSelector} .${g}${a.INVERTED_DEFAULT_COLOR}.xterm-dim { color: ${d.color.multiplyOpacity(d.color.opaque(e.background),.5).css}; }${this._terminalSelector} .${m}${a.INVERTED_DEFAULT_COLOR} { background-color: ${e.foreground.css}; }`,this._themeStyleElement.textContent=t}_setDefaultSpacing(){const e=this.dimensions.css.cell.width-this._widthCache.get("W",!1,!1);this._rowContainer.style.letterSpacing=`${e}px`,this._rowFactory.defaultSpacing=e}handleDevicePixelRatioChange(){this._updateDimensions(),this._widthCache.clear(),this._setDefaultSpacing()}_refreshRowElements(e,t){for(let e=this._rowElements.length;e<=t;e++){const e=this._document.createElement("div");this._rowContainer.appendChild(e),this._rowElements.push(e)}for(;this._rowElements.length>t;)this._rowContainer.removeChild(this._rowElements.pop())}handleResize(e,t){this._refreshRowElements(e,t),this._updateDimensions(),this.handleSelectionChanged(this._selectionRenderModel.selectionStart,this._selectionRenderModel.selectionEnd,this._selectionRenderModel.columnSelectMode)}handleCharSizeChanged(){this._updateDimensions(),this._widthCache.clear(),this._setDefaultSpacing()}handleBlur(){this._rowContainer.classList.remove(S),this.renderRows(0,this._bufferService.rows-1)}handleFocus(){this._rowContainer.classList.add(S),this.renderRows(this._bufferService.buffer.y,this._bufferService.buffer.y)}handleSelectionChanged(e,t,i){if(this._selectionContainer.replaceChildren(),this._rowFactory.handleSelectionChanged(e,t,i),this.renderRows(0,this._bufferService.rows-1),!e||!t)return;this._selectionRenderModel.update(this._terminal,e,t,i);const s=this._selectionRenderModel.viewportStartRow,r=this._selectionRenderModel.viewportEndRow,n=this._selectionRenderModel.viewportCappedStartRow,o=this._selectionRenderModel.viewportCappedEndRow;if(n>=this._bufferService.rows||o<0)return;const a=this._document.createDocumentFragment();if(i){const i=e[0]>t[0];a.appendChild(this._createSelectionElement(n,i?t[0]:e[0],i?e[0]:t[0],o-n+1))}else{const i=s===n?e[0]:0,h=n===r?t[0]:this._bufferService.cols;a.appendChild(this._createSelectionElement(n,i,h));const c=o-n-1;if(a.appendChild(this._createSelectionElement(n+1,0,this._bufferService.cols,c)),n!==o){const e=r===o?t[0]:this._bufferService.cols;a.appendChild(this._createSelectionElement(o,0,e))}}this._selectionContainer.appendChild(a)}_createSelectionElement(e,t,i,s=1){const r=this._document.createElement("div"),n=t*this.dimensions.css.cell.width;let o=this.dimensions.css.cell.width*(i-t);return n+o>this.dimensions.css.canvas.width&&(o=this.dimensions.css.canvas.width-n),r.style.height=s*this.dimensions.css.cell.height+"px",r.style.top=e*this.dimensions.css.cell.height+"px",r.style.left=`${n}px`,r.style.width=`${o}px`,r}handleCursorMove(){}_handleOptionsChanged(){this._updateDimensions(),this._injectCss(this._themeService.colors),this._widthCache.setFont(this._optionsService.rawOptions.fontFamily,this._optionsService.rawOptions.fontSize,this._optionsService.rawOptions.fontWeight,this._optionsService.rawOptions.fontWeightBold),this._setDefaultSpacing()}clear(){for(const e of this._rowElements)e.replaceChildren()}renderRows(e,t){const i=this._bufferService.buffer,s=i.ybase+i.y,r=Math.min(i.x,this._bufferService.cols-1),n=this._optionsService.rawOptions.cursorBlink,o=this._optionsService.rawOptions.cursorStyle,a=this._optionsService.rawOptions.cursorInactiveStyle;for(let h=e;h<=t;h++){const e=h+i.ydisp,t=this._rowElements[h],c=i.lines.get(e);if(!t||!c)break;t.replaceChildren(...this._rowFactory.createRow(c,e,e===s,o,a,r,n,this.dimensions.css.cell.width,this._widthCache,-1,-1))}}get _terminalSelector(){return`.${v}${this._terminalClass}`}_handleLinkHover(e){this._setCellUnderline(e.x1,e.x2,e.y1,e.y2,e.cols,!0)}_handleLinkLeave(e){this._setCellUnderline(e.x1,e.x2,e.y1,e.y2,e.cols,!1)}_setCellUnderline(e,t,i,s,r,n){i<0&&(e=0),s<0&&(t=0);const o=this._bufferService.rows-1;i=Math.max(Math.min(i,o),0),s=Math.max(Math.min(s,o),0),r=Math.min(r,this._bufferService.cols);const a=this._bufferService.buffer,h=a.ybase+a.y,c=Math.min(a.x,r-1),l=this._optionsService.rawOptions.cursorBlink,d=this._optionsService.rawOptions.cursorStyle,_=this._optionsService.rawOptions.cursorInactiveStyle;for(let o=i;o<=s;++o){const u=o+a.ydisp,f=this._rowElements[o],v=a.lines.get(u);if(!f||!v)break;f.replaceChildren(...this._rowFactory.createRow(v,u,u===h,d,_,c,l,this.dimensions.css.cell.width,this._widthCache,n?o===i?e:0:-1,n?(o===s?t:r)-1:-1))}}};t.DomRenderer=w=s([r(7,f.IInstantiationService),r(8,l.ICharSizeService),r(9,f.IOptionsService),r(10,f.IBufferService),r(11,l.ICoreBrowserService),r(12,l.IThemeService)],w)},3787:function(e,t,i){var s=this&&this.__decorate||function(e,t,i,s){var r,n=arguments.length,o=n<3?t:null===s?s=Object.getOwnPropertyDescriptor(t,i):s;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)o=Reflect.decorate(e,t,i,s);else for(var a=e.length-1;a>=0;a--)(r=e[a])&&(o=(n<3?r(o):n>3?r(t,i,o):r(t,i))||o);return n>3&&o&&Object.defineProperty(t,i,o),o},r=this&&this.__param||function(e,t){return function(i,s){t(i,s,e)}};Object.defineProperty(t,"__esModule",{value:!0}),t.DomRendererRowFactory=void 0;const n=i(2223),o=i(643),a=i(511),h=i(2585),c=i(8055),l=i(4725),d=i(4269),_=i(6171),u=i(3734);let f=t.DomRendererRowFactory=class{constructor(e,t,i,s,r,n,o){this._document=e,this._characterJoinerService=t,this._optionsService=i,this._coreBrowserService=s,this._coreService=r,this._decorationService=n,this._themeService=o,this._workCell=new a.CellData,this._columnSelectMode=!1,this.defaultSpacing=0}handleSelectionChanged(e,t,i){this._selectionStart=e,this._selectionEnd=t,this._columnSelectMode=i}createRow(e,t,i,s,r,a,h,l,_,f,p){const g=[],m=this._characterJoinerService.getJoinedCharacters(t),S=this._themeService.colors;let C,b=e.getNoBgTrimmedLength();i&&b<a+1&&(b=a+1);let w=0,y="",E=0,k=0,L=0,D=!1,R=0,x=!1,A=0;const B=[],T=-1!==f&&-1!==p;for(let M=0;M<b;M++){e.loadCell(M,this._workCell);let b=this._workCell.getWidth();if(0===b)continue;let O=!1,P=M,I=this._workCell;if(m.length>0&&M===m[0][0]){O=!0;const t=m.shift();I=new d.JoinedCellData(this._workCell,e.translateToString(!0,t[0],t[1]),t[1]-t[0]),P=t[1]-1,b=I.getWidth()}const H=this._isCellInSelection(M,t),F=i&&M===a,W=T&&M>=f&&M<=p;let U=!1;this._decorationService.forEachDecorationAtCell(M,t,void 0,(e=>{U=!0}));let N=I.getChars()||o.WHITESPACE_CELL_CHAR;if(" "===N&&(I.isUnderline()||I.isOverline())&&(N=" "),A=b*l-_.get(N,I.isBold(),I.isItalic()),C){if(w&&(H&&x||!H&&!x&&I.bg===E)&&(H&&x&&S.selectionForeground||I.fg===k)&&I.extended.ext===L&&W===D&&A===R&&!F&&!O&&!U){I.isInvisible()?y+=o.WHITESPACE_CELL_CHAR:y+=N,w++;continue}w&&(C.textContent=y),C=this._document.createElement("span"),w=0,y=""}else C=this._document.createElement("span");if(E=I.bg,k=I.fg,L=I.extended.ext,D=W,R=A,x=H,O&&a>=M&&a<=P&&(a=M),!this._coreService.isCursorHidden&&F&&this._coreService.isCursorInitialized)if(B.push("xterm-cursor"),this._coreBrowserService.isFocused)h&&B.push("xterm-cursor-blink"),B.push("bar"===s?"xterm-cursor-bar":"underline"===s?"xterm-cursor-underline":"xterm-cursor-block");else if(r)switch(r){case"outline":B.push("xterm-cursor-outline");break;case"block":B.push("xterm-cursor-block");break;case"bar":B.push("xterm-cursor-bar");break;case"underline":B.push("xterm-cursor-underline")}if(I.isBold()&&B.push("xterm-bold"),I.isItalic()&&B.push("xterm-italic"),I.isDim()&&B.push("xterm-dim"),y=I.isInvisible()?o.WHITESPACE_CELL_CHAR:I.getChars()||o.WHITESPACE_CELL_CHAR,I.isUnderline()&&(B.push(`xterm-underline-${I.extended.underlineStyle}`)," "===y&&(y=" "),!I.isUnderlineColorDefault()))if(I.isUnderlineColorRGB())C.style.textDecorationColor=`rgb(${u.AttributeData.toColorRGB(I.getUnderlineColor()).join(",")})`;else{let e=I.getUnderlineColor();this._optionsService.rawOptions.drawBoldTextInBrightColors&&I.isBold()&&e<8&&(e+=8),C.style.textDecorationColor=S.ansi[e].css}I.isOverline()&&(B.push("xterm-overline")," "===y&&(y=" ")),I.isStrikethrough()&&B.push("xterm-strikethrough"),W&&(C.style.textDecoration="underline");let $=I.getFgColor(),j=I.getFgColorMode(),z=I.getBgColor(),K=I.getBgColorMode();const q=!!I.isInverse();if(q){const e=$;$=z,z=e;const t=j;j=K,K=t}let V,G,X,J=!1;switch(this._decorationService.forEachDecorationAtCell(M,t,void 0,(e=>{"top"!==e.options.layer&&J||(e.backgroundColorRGB&&(K=50331648,z=e.backgroundColorRGB.rgba>>8&16777215,V=e.backgroundColorRGB),e.foregroundColorRGB&&(j=50331648,$=e.foregroundColorRGB.rgba>>8&16777215,G=e.foregroundColorRGB),J="top"===e.options.layer)})),!J&&H&&(V=this._coreBrowserService.isFocused?S.selectionBackgroundOpaque:S.selectionInactiveBackgroundOpaque,z=V.rgba>>8&16777215,K=50331648,J=!0,S.selectionForeground&&(j=50331648,$=S.selectionForeground.rgba>>8&16777215,G=S.selectionForeground)),J&&B.push("xterm-decoration-top"),K){case 16777216:case 33554432:X=S.ansi[z],B.push(`xterm-bg-${z}`);break;case 50331648:X=c.channels.toColor(z>>16,z>>8&255,255&z),this._addStyle(C,`background-color:#${v((z>>>0).toString(16),"0",6)}`);break;default:q?(X=S.foreground,B.push(`xterm-bg-${n.INVERTED_DEFAULT_COLOR}`)):X=S.background}switch(V||I.isDim()&&(V=c.color.multiplyOpacity(X,.5)),j){case 16777216:case 33554432:I.isBold()&&$<8&&this._optionsService.rawOptions.drawBoldTextInBrightColors&&($+=8),this._applyMinimumContrast(C,X,S.ansi[$],I,V,void 0)||B.push(`xterm-fg-${$}`);break;case 50331648:const e=c.channels.toColor($>>16&255,$>>8&255,255&$);this._applyMinimumContrast(C,X,e,I,V,G)||this._addStyle(C,`color:#${v($.toString(16),"0",6)}`);break;default:this._applyMinimumContrast(C,X,S.foreground,I,V,G)||q&&B.push(`xterm-fg-${n.INVERTED_DEFAULT_COLOR}`)}B.length&&(C.className=B.join(" "),B.length=0),F||O||U?C.textContent=y:w++,A!==this.defaultSpacing&&(C.style.letterSpacing=`${A}px`),g.push(C),M=P}return C&&w&&(C.textContent=y),g}_applyMinimumContrast(e,t,i,s,r,n){if(1===this._optionsService.rawOptions.minimumContrastRatio||(0,_.treatGlyphAsBackgroundColor)(s.getCode()))return!1;const o=this._getContrastCache(s);let a;if(r||n||(a=o.getColor(t.rgba,i.rgba)),void 0===a){const e=this._optionsService.rawOptions.minimumContrastRatio/(s.isDim()?2:1);a=c.color.ensureContrastRatio(r||t,n||i,e),o.setColor((r||t).rgba,(n||i).rgba,a??null)}return!!a&&(this._addStyle(e,`color:${a.css}`),!0)}_getContrastCache(e){return e.isDim()?this._themeService.colors.halfContrastCache:this._themeService.colors.contrastCache}_addStyle(e,t){e.setAttribute("style",`${e.getAttribute("style")||""}${t};`)}_isCellInSelection(e,t){const i=this._selectionStart,s=this._selectionEnd;return!(!i||!s)&&(this._columnSelectMode?i[0]<=s[0]?e>=i[0]&&t>=i[1]&&e<s[0]&&t<=s[1]:e<i[0]&&t>=i[1]&&e>=s[0]&&t<=s[1]:t>i[1]&&t<s[1]||i[1]===s[1]&&t===i[1]&&e>=i[0]&&e<s[0]||i[1]<s[1]&&t===s[1]&&e<s[0]||i[1]<s[1]&&t===i[1]&&e>=i[0])}};function v(e,t,i){for(;e.length<i;)e=t+e;return e}t.DomRendererRowFactory=f=s([r(1,l.ICharacterJoinerService),r(2,h.IOptionsService),r(3,l.ICoreBrowserService),r(4,h.ICoreService),r(5,h.IDecorationService),r(6,l.IThemeService)],f)},2550:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.WidthCache=void 0,t.WidthCache=class{constructor(e,t){this._flat=new Float32Array(256),this._font="",this._fontSize=0,this._weight="normal",this._weightBold="bold",this._measureElements=[],this._container=e.createElement("div"),this._container.classList.add("xterm-width-cache-measure-container"),this._container.setAttribute("aria-hidden","true"),this._container.style.whiteSpace="pre",this._container.style.fontKerning="none";const i=e.createElement("span");i.classList.add("xterm-char-measure-element");const s=e.createElement("span");s.classList.add("xterm-char-measure-element"),s.style.fontWeight="bold";const r=e.createElement("span");r.classList.add("xterm-char-measure-element"),r.style.fontStyle="italic";const n=e.createElement("span");n.classList.add("xterm-char-measure-element"),n.style.fontWeight="bold",n.style.fontStyle="italic",this._measureElements=[i,s,r,n],this._container.appendChild(i),this._container.appendChild(s),this._container.appendChild(r),this._container.appendChild(n),t.appendChild(this._container),this.clear()}dispose(){this._container.remove(),this._measureElements.length=0,this._holey=void 0}clear(){this._flat.fill(-9999),this._holey=new Map}setFont(e,t,i,s){e===this._font&&t===this._fontSize&&i===this._weight&&s===this._weightBold||(this._font=e,this._fontSize=t,this._weight=i,this._weightBold=s,this._container.style.fontFamily=this._font,this._container.style.fontSize=`${this._fontSize}px`,this._measureElements[0].style.fontWeight=`${i}`,this._measureElements[1].style.fontWeight=`${s}`,this._measureElements[2].style.fontWeight=`${i}`,this._measureElements[3].style.fontWeight=`${s}`,this.clear())}get(e,t,i){let s=0;if(!t&&!i&&1===e.length&&(s=e.charCodeAt(0))<256){if(-9999!==this._flat[s])return this._flat[s];const t=this._measure(e,0);return t>0&&(this._flat[s]=t),t}let r=e;t&&(r+="B"),i&&(r+="I");let n=this._holey.get(r);if(void 0===n){let s=0;t&&(s|=1),i&&(s|=2),n=this._measure(e,s),n>0&&this._holey.set(r,n)}return n}_measure(e,t){const i=this._measureElements[t];return i.textContent=e.repeat(32),i.offsetWidth/32}}},2223:(e,t,i)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.TEXT_BASELINE=t.DIM_OPACITY=t.INVERTED_DEFAULT_COLOR=void 0;const s=i(6114);t.INVERTED_DEFAULT_COLOR=257,t.DIM_OPACITY=.5,t.TEXT_BASELINE=s.isFirefox||s.isLegacyEdge?"bottom":"ideographic"},6171:(e,t)=>{function i(e){return 57508<=e&&e<=57558}function s(e){return e>=128512&&e<=128591||e>=127744&&e<=128511||e>=128640&&e<=128767||e>=9728&&e<=9983||e>=9984&&e<=10175||e>=65024&&e<=65039||e>=129280&&e<=129535||e>=127462&&e<=127487}Object.defineProperty(t,"__esModule",{value:!0}),t.computeNextVariantOffset=t.createRenderDimensions=t.treatGlyphAsBackgroundColor=t.allowRescaling=t.isEmoji=t.isRestrictedPowerlineGlyph=t.isPowerlineGlyph=t.throwIfFalsy=void 0,t.throwIfFalsy=function(e){if(!e)throw new Error("value must not be falsy");return e},t.isPowerlineGlyph=i,t.isRestrictedPowerlineGlyph=function(e){return 57520<=e&&e<=57527},t.isEmoji=s,t.allowRescaling=function(e,t,r,n){return 1===t&&r>Math.ceil(1.5*n)&&void 0!==e&&e>255&&!s(e)&&!i(e)&&!function(e){return 57344<=e&&e<=63743}(e)},t.treatGlyphAsBackgroundColor=function(e){return i(e)||function(e){return 9472<=e&&e<=9631}(e)},t.createRenderDimensions=function(){return{css:{canvas:{width:0,height:0},cell:{width:0,height:0}},device:{canvas:{width:0,height:0},cell:{width:0,height:0},char:{width:0,height:0,left:0,top:0}}}},t.computeNextVariantOffset=function(e,t,i=0){return(e-(2*Math.round(t)-i))%(2*Math.round(t))}},6052:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.createSelectionRenderModel=void 0;class i{constructor(){this.clear()}clear(){this.hasSelection=!1,this.columnSelectMode=!1,this.viewportStartRow=0,this.viewportEndRow=0,this.viewportCappedStartRow=0,this.viewportCappedEndRow=0,this.startCol=0,this.endCol=0,this.selectionStart=void 0,this.selectionEnd=void 0}update(e,t,i,s=!1){if(this.selectionStart=t,this.selectionEnd=i,!t||!i||t[0]===i[0]&&t[1]===i[1])return void this.clear();const r=e.buffers.active.ydisp,n=t[1]-r,o=i[1]-r,a=Math.max(n,0),h=Math.min(o,e.rows-1);a>=e.rows||h<0?this.clear():(this.hasSelection=!0,this.columnSelectMode=s,this.viewportStartRow=n,this.viewportEndRow=o,this.viewportCappedStartRow=a,this.viewportCappedEndRow=h,this.startCol=t[0],this.endCol=i[0])}isCellSelected(e,t,i){return!!this.hasSelection&&(i-=e.buffer.active.viewportY,this.columnSelectMode?this.startCol<=this.endCol?t>=this.startCol&&i>=this.viewportCappedStartRow&&t<this.endCol&&i<=this.viewportCappedEndRow:t<this.startCol&&i>=this.viewportCappedStartRow&&t>=this.endCol&&i<=this.viewportCappedEndRow:i>this.viewportStartRow&&i<this.viewportEndRow||this.viewportStartRow===this.viewportEndRow&&i===this.viewportStartRow&&t>=this.startCol&&t<this.endCol||this.viewportStartRow<this.viewportEndRow&&i===this.viewportEndRow&&t<this.endCol||this.viewportStartRow<this.viewportEndRow&&i===this.viewportStartRow&&t>=this.startCol)}}t.createSelectionRenderModel=function(){return new i}},456:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.SelectionModel=void 0,t.SelectionModel=class{constructor(e){this._bufferService=e,this.isSelectAllActive=!1,this.selectionStartLength=0}clearSelection(){this.selectionStart=void 0,this.selectionEnd=void 0,this.isSelectAllActive=!1,this.selectionStartLength=0}get finalSelectionStart(){return this.isSelectAllActive?[0,0]:this.selectionEnd&&this.selectionStart&&this.areSelectionValuesReversed()?this.selectionEnd:this.selectionStart}get finalSelectionEnd(){if(this.isSelectAllActive)return[this._bufferService.cols,this._bufferService.buffer.ybase+this._bufferService.rows-1];if(this.selectionStart){if(!this.selectionEnd||this.areSelectionValuesReversed()){const e=this.selectionStart[0]+this.selectionStartLength;return e>this._bufferService.cols?e%this._bufferService.cols==0?[this._bufferService.cols,this.selectionStart[1]+Math.floor(e/this._bufferService.cols)-1]:[e%this._bufferService.cols,this.selectionStart[1]+Math.floor(e/this._bufferService.cols)]:[e,this.selectionStart[1]]}if(this.selectionStartLength&&this.selectionEnd[1]===this.selectionStart[1]){const e=this.selectionStart[0]+this.selectionStartLength;return e>this._bufferService.cols?[e%this._bufferService.cols,this.selectionStart[1]+Math.floor(e/this._bufferService.cols)]:[Math.max(e,this.selectionEnd[0]),this.selectionEnd[1]]}return this.selectionEnd}}areSelectionValuesReversed(){const e=this.selectionStart,t=this.selectionEnd;return!(!e||!t)&&(e[1]>t[1]||e[1]===t[1]&&e[0]>t[0])}handleTrim(e){return this.selectionStart&&(this.selectionStart[1]-=e),this.selectionEnd&&(this.selectionEnd[1]-=e),this.selectionEnd&&this.selectionEnd[1]<0?(this.clearSelection(),!0):(this.selectionStart&&this.selectionStart[1]<0&&(this.selectionStart[1]=0),!1)}}},428:function(e,t,i){var s=this&&this.__decorate||function(e,t,i,s){var r,n=arguments.length,o=n<3?t:null===s?s=Object.getOwnPropertyDescriptor(t,i):s;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)o=Reflect.decorate(e,t,i,s);else for(var a=e.length-1;a>=0;a--)(r=e[a])&&(o=(n<3?r(o):n>3?r(t,i,o):r(t,i))||o);return n>3&&o&&Object.defineProperty(t,i,o),o},r=this&&this.__param||function(e,t){return function(i,s){t(i,s,e)}};Object.defineProperty(t,"__esModule",{value:!0}),t.CharSizeService=void 0;const n=i(2585),o=i(8460),a=i(844);let h=t.CharSizeService=class extends a.Disposable{get hasValidSize(){return this.width>0&&this.height>0}constructor(e,t,i){super(),this._optionsService=i,this.width=0,this.height=0,this._onCharSizeChange=this.register(new o.EventEmitter),this.onCharSizeChange=this._onCharSizeChange.event;try{this._measureStrategy=this.register(new d(this._optionsService))}catch{this._measureStrategy=this.register(new l(e,t,this._optionsService))}this.register(this._optionsService.onMultipleOptionChange(["fontFamily","fontSize"],(()=>this.measure())))}measure(){const e=this._measureStrategy.measure();e.width===this.width&&e.height===this.height||(this.width=e.width,this.height=e.height,this._onCharSizeChange.fire())}};t.CharSizeService=h=s([r(2,n.IOptionsService)],h);class c extends a.Disposable{constructor(){super(...arguments),this._result={width:0,height:0}}_validateAndSet(e,t){void 0!==e&&e>0&&void 0!==t&&t>0&&(this._result.width=e,this._result.height=t)}}class l extends c{constructor(e,t,i){super(),this._document=e,this._parentElement=t,this._optionsService=i,this._measureElement=this._document.createElement("span"),this._measureElement.classList.add("xterm-char-measure-element"),this._measureElement.textContent="W".repeat(32),this._measureElement.setAttribute("aria-hidden","true"),this._measureElement.style.whiteSpace="pre",this._measureElement.style.fontKerning="none",this._parentElement.appendChild(this._measureElement)}measure(){return this._measureElement.style.fontFamily=this._optionsService.rawOptions.fontFamily,this._measureElement.style.fontSize=`${this._optionsService.rawOptions.fontSize}px`,this._validateAndSet(Number(this._measureElement.offsetWidth)/32,Number(this._measureElement.offsetHeight)),this._result}}class d extends c{constructor(e){super(),this._optionsService=e,this._canvas=new OffscreenCanvas(100,100),this._ctx=this._canvas.getContext("2d");const t=this._ctx.measureText("W");if(!("width"in t&&"fontBoundingBoxAscent"in t&&"fontBoundingBoxDescent"in t))throw new Error("Required font metrics not supported")}measure(){this._ctx.font=`${this._optionsService.rawOptions.fontSize}px ${this._optionsService.rawOptions.fontFamily}`;const e=this._ctx.measureText("W");return this._validateAndSet(e.width,e.fontBoundingBoxAscent+e.fontBoundingBoxDescent),this._result}}},4269:function(e,t,i){var s=this&&this.__decorate||function(e,t,i,s){var r,n=arguments.length,o=n<3?t:null===s?s=Object.getOwnPropertyDescriptor(t,i):s;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)o=Reflect.decorate(e,t,i,s);else for(var a=e.length-1;a>=0;a--)(r=e[a])&&(o=(n<3?r(o):n>3?r(t,i,o):r(t,i))||o);return n>3&&o&&Object.defineProperty(t,i,o),o},r=this&&this.__param||function(e,t){return function(i,s){t(i,s,e)}};Object.defineProperty(t,"__esModule",{value:!0}),t.CharacterJoinerService=t.JoinedCellData=void 0;const n=i(3734),o=i(643),a=i(511),h=i(2585);class c extends n.AttributeData{constructor(e,t,i){super(),this.content=0,this.combinedData="",this.fg=e.fg,this.bg=e.bg,this.combinedData=t,this._width=i}isCombined(){return 2097152}getWidth(){return this._width}getChars(){return this.combinedData}getCode(){return 2097151}setFromCharData(e){throw new Error("not implemented")}getAsCharData(){return[this.fg,this.getChars(),this.getWidth(),this.getCode()]}}t.JoinedCellData=c;let l=t.CharacterJoinerService=class e{constructor(e){this._bufferService=e,this._characterJoiners=[],this._nextCharacterJoinerId=0,this._workCell=new a.CellData}register(e){const t={id:this._nextCharacterJoinerId++,handler:e};return this._characterJoiners.push(t),t.id}deregister(e){for(let t=0;t<this._characterJoiners.length;t++)if(this._characterJoiners[t].id===e)return this._characterJoiners.splice(t,1),!0;return!1}getJoinedCharacters(e){if(0===this._characterJoiners.length)return[];const t=this._bufferService.buffer.lines.get(e);if(!t||0===t.length)return[];const i=[],s=t.translateToString(!0);let r=0,n=0,a=0,h=t.getFg(0),c=t.getBg(0);for(let e=0;e<t.getTrimmedLength();e++)if(t.loadCell(e,this._workCell),0!==this._workCell.getWidth()){if(this._workCell.fg!==h||this._workCell.bg!==c){if(e-r>1){const e=this._getJoinedRanges(s,a,n,t,r);for(let t=0;t<e.length;t++)i.push(e[t])}r=e,a=n,h=this._workCell.fg,c=this._workCell.bg}n+=this._workCell.getChars().length||o.WHITESPACE_CELL_CHAR.length}if(this._bufferService.cols-r>1){const e=this._getJoinedRanges(s,a,n,t,r);for(let t=0;t<e.length;t++)i.push(e[t])}return i}_getJoinedRanges(t,i,s,r,n){const o=t.substring(i,s);let a=[];try{a=this._characterJoiners[0].handler(o)}catch(e){console.error(e)}for(let t=1;t<this._characterJoiners.length;t++)try{const i=this._characterJoiners[t].handler(o);for(let t=0;t<i.length;t++)e._mergeRanges(a,i[t])}catch(e){console.error(e)}return this._stringRangesToCellRanges(a,r,n),a}_stringRangesToCellRanges(e,t,i){let s=0,r=!1,n=0,a=e[s];if(a){for(let h=i;h<this._bufferService.cols;h++){const i=t.getWidth(h),c=t.getString(h).length||o.WHITESPACE_CELL_CHAR.length;if(0!==i){if(!r&&a[0]<=n&&(a[0]=h,r=!0),a[1]<=n){if(a[1]=h,a=e[++s],!a)break;a[0]<=n?(a[0]=h,r=!0):r=!1}n+=c}}a&&(a[1]=this._bufferService.cols)}}static _mergeRanges(e,t){let i=!1;for(let s=0;s<e.length;s++){const r=e[s];if(i){if(t[1]<=r[0])return e[s-1][1]=t[1],e;if(t[1]<=r[1])return e[s-1][1]=Math.max(t[1],r[1]),e.splice(s,1),e;e.splice(s,1),s--}else{if(t[1]<=r[0])return e.splice(s,0,t),e;if(t[1]<=r[1])return r[0]=Math.min(t[0],r[0]),e;t[0]<r[1]&&(r[0]=Math.min(t[0],r[0]),i=!0)}}return i?e[e.length-1][1]=t[1]:e.push(t),e}};t.CharacterJoinerService=l=s([r(0,h.IBufferService)],l)},5114:(e,t,i)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.CoreBrowserService=void 0;const s=i(844),r=i(8460),n=i(3656);class o extends s.Disposable{constructor(e,t,i){super(),this._textarea=e,this._window=t,this.mainDocument=i,this._isFocused=!1,this._cachedIsFocused=void 0,this._screenDprMonitor=new a(this._window),this._onDprChange=this.register(new r.EventEmitter),this.onDprChange=this._onDprChange.event,this._onWindowChange=this.register(new r.EventEmitter),this.onWindowChange=this._onWindowChange.event,this.register(this.onWindowChange((e=>this._screenDprMonitor.setWindow(e)))),this.register((0,r.forwardEvent)(this._screenDprMonitor.onDprChange,this._onDprChange)),this._textarea.addEventListener("focus",(()=>this._isFocused=!0)),this._textarea.addEventListener("blur",(()=>this._isFocused=!1))}get window(){return this._window}set window(e){this._window!==e&&(this._window=e,this._onWindowChange.fire(this._window))}get dpr(){return this.window.devicePixelRatio}get isFocused(){return void 0===this._cachedIsFocused&&(this._cachedIsFocused=this._isFocused&&this._textarea.ownerDocument.hasFocus(),queueMicrotask((()=>this._cachedIsFocused=void 0))),this._cachedIsFocused}}t.CoreBrowserService=o;class a extends s.Disposable{constructor(e){super(),this._parentWindow=e,this._windowResizeListener=this.register(new s.MutableDisposable),this._onDprChange=this.register(new r.EventEmitter),this.onDprChange=this._onDprChange.event,this._outerListener=()=>this._setDprAndFireIfDiffers(),this._currentDevicePixelRatio=this._parentWindow.devicePixelRatio,this._updateDpr(),this._setWindowResizeListener(),this.register((0,s.toDisposable)((()=>this.clearListener())))}setWindow(e){this._parentWindow=e,this._setWindowResizeListener(),this._setDprAndFireIfDiffers()}_setWindowResizeListener(){this._windowResizeListener.value=(0,n.addDisposableDomListener)(this._parentWindow,"resize",(()=>this._setDprAndFireIfDiffers()))}_setDprAndFireIfDiffers(){this._parentWindow.devicePixelRatio!==this._currentDevicePixelRatio&&this._onDprChange.fire(this._parentWindow.devicePixelRatio),this._updateDpr()}_updateDpr(){this._outerListener&&(this._resolutionMediaMatchList?.removeListener(this._outerListener),this._currentDevicePixelRatio=this._parentWindow.devicePixelRatio,this._resolutionMediaMatchList=this._parentWindow.matchMedia(`screen and (resolution: ${this._parentWindow.devicePixelRatio}dppx)`),this._resolutionMediaMatchList.addListener(this._outerListener))}clearListener(){this._resolutionMediaMatchList&&this._outerListener&&(this._resolutionMediaMatchList.removeListener(this._outerListener),this._resolutionMediaMatchList=void 0,this._outerListener=void 0)}}},779:(e,t,i)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.LinkProviderService=void 0;const s=i(844);class r extends s.Disposable{constructor(){super(),this.linkProviders=[],this.register((0,s.toDisposable)((()=>this.linkProviders.length=0)))}registerLinkProvider(e){return this.linkProviders.push(e),{dispose:()=>{const t=this.linkProviders.indexOf(e);-1!==t&&this.linkProviders.splice(t,1)}}}}t.LinkProviderService=r},8934:function(e,t,i){var s=this&&this.__decorate||function(e,t,i,s){var r,n=arguments.length,o=n<3?t:null===s?s=Object.getOwnPropertyDescriptor(t,i):s;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)o=Reflect.decorate(e,t,i,s);else for(var a=e.length-1;a>=0;a--)(r=e[a])&&(o=(n<3?r(o):n>3?r(t,i,o):r(t,i))||o);return n>3&&o&&Object.defineProperty(t,i,o),o},r=this&&this.__param||function(e,t){return function(i,s){t(i,s,e)}};Object.defineProperty(t,"__esModule",{value:!0}),t.MouseService=void 0;const n=i(4725),o=i(9806);let a=t.MouseService=class{constructor(e,t){this._renderService=e,this._charSizeService=t}getCoords(e,t,i,s,r){return(0,o.getCoords)(window,e,t,i,s,this._charSizeService.hasValidSize,this._renderService.dimensions.css.cell.width,this._renderService.dimensions.css.cell.height,r)}getMouseReportCoords(e,t){const i=(0,o.getCoordsRelativeToElement)(window,e,t);if(this._charSizeService.hasValidSize)return i[0]=Math.min(Math.max(i[0],0),this._renderService.dimensions.css.canvas.width-1),i[1]=Math.min(Math.max(i[1],0),this._renderService.dimensions.css.canvas.height-1),{col:Math.floor(i[0]/this._renderService.dimensions.css.cell.width),row:Math.floor(i[1]/this._renderService.dimensions.css.cell.height),x:Math.floor(i[0]),y:Math.floor(i[1])}}};t.MouseService=a=s([r(0,n.IRenderService),r(1,n.ICharSizeService)],a)},3230:function(e,t,i){var s=this&&this.__decorate||function(e,t,i,s){var r,n=arguments.length,o=n<3?t:null===s?s=Object.getOwnPropertyDescriptor(t,i):s;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)o=Reflect.decorate(e,t,i,s);else for(var a=e.length-1;a>=0;a--)(r=e[a])&&(o=(n<3?r(o):n>3?r(t,i,o):r(t,i))||o);return n>3&&o&&Object.defineProperty(t,i,o),o},r=this&&this.__param||function(e,t){return function(i,s){t(i,s,e)}};Object.defineProperty(t,"__esModule",{value:!0}),t.RenderService=void 0;const n=i(6193),o=i(4725),a=i(8460),h=i(844),c=i(7226),l=i(2585);let d=t.RenderService=class extends h.Disposable{get dimensions(){return this._renderer.value.dimensions}constructor(e,t,i,s,r,o,l,d){super(),this._rowCount=e,this._charSizeService=s,this._renderer=this.register(new h.MutableDisposable),this._pausedResizeTask=new c.DebouncedIdleTask,this._observerDisposable=this.register(new h.MutableDisposable),this._isPaused=!1,this._needsFullRefresh=!1,this._isNextRenderRedrawOnly=!0,this._needsSelectionRefresh=!1,this._canvasWidth=0,this._canvasHeight=0,this._selectionState={start:void 0,end:void 0,columnSelectMode:!1},this._onDimensionsChange=this.register(new a.EventEmitter),this.onDimensionsChange=this._onDimensionsChange.event,this._onRenderedViewportChange=this.register(new a.EventEmitter),this.onRenderedViewportChange=this._onRenderedViewportChange.event,this._onRender=this.register(new a.EventEmitter),this.onRender=this._onRender.event,this._onRefreshRequest=this.register(new a.EventEmitter),this.onRefreshRequest=this._onRefreshRequest.event,this._renderDebouncer=new n.RenderDebouncer(((e,t)=>this._renderRows(e,t)),l),this.register(this._renderDebouncer),this.register(l.onDprChange((()=>this.handleDevicePixelRatioChange()))),this.register(o.onResize((()=>this._fullRefresh()))),this.register(o.buffers.onBufferActivate((()=>this._renderer.value?.clear()))),this.register(i.onOptionChange((()=>this._handleOptionsChanged()))),this.register(this._charSizeService.onCharSizeChange((()=>this.handleCharSizeChanged()))),this.register(r.onDecorationRegistered((()=>this._fullRefresh()))),this.register(r.onDecorationRemoved((()=>this._fullRefresh()))),this.register(i.onMultipleOptionChange(["customGlyphs","drawBoldTextInBrightColors","letterSpacing","lineHeight","fontFamily","fontSize","fontWeight","fontWeightBold","minimumContrastRatio","rescaleOverlappingGlyphs"],(()=>{this.clear(),this.handleResize(o.cols,o.rows),this._fullRefresh()}))),this.register(i.onMultipleOptionChange(["cursorBlink","cursorStyle"],(()=>this.refreshRows(o.buffer.y,o.buffer.y,!0)))),this.register(d.onChangeColors((()=>this._fullRefresh()))),this._registerIntersectionObserver(l.window,t),this.register(l.onWindowChange((e=>this._registerIntersectionObserver(e,t))))}_registerIntersectionObserver(e,t){if("IntersectionObserver"in e){const i=new e.IntersectionObserver((e=>this._handleIntersectionChange(e[e.length-1])),{threshold:0});i.observe(t),this._observerDisposable.value=(0,h.toDisposable)((()=>i.disconnect()))}}_handleIntersectionChange(e){this._isPaused=void 0===e.isIntersecting?0===e.intersectionRatio:!e.isIntersecting,this._isPaused||this._charSizeService.hasValidSize||this._charSizeService.measure(),!this._isPaused&&this._needsFullRefresh&&(this._pausedResizeTask.flush(),this.refreshRows(0,this._rowCount-1),this._needsFullRefresh=!1)}refreshRows(e,t,i=!1){this._isPaused?this._needsFullRefresh=!0:(i||(this._isNextRenderRedrawOnly=!1),this._renderDebouncer.refresh(e,t,this._rowCount))}_renderRows(e,t){this._renderer.value&&(e=Math.min(e,this._rowCount-1),t=Math.min(t,this._rowCount-1),this._renderer.value.renderRows(e,t),this._needsSelectionRefresh&&(this._renderer.value.handleSelectionChanged(this._selectionState.start,this._selectionState.end,this._selectionState.columnSelectMode),this._needsSelectionRefresh=!1),this._isNextRenderRedrawOnly||this._onRenderedViewportChange.fire({start:e,end:t}),this._onRender.fire({start:e,end:t}),this._isNextRenderRedrawOnly=!0)}resize(e,t){this._rowCount=t,this._fireOnCanvasResize()}_handleOptionsChanged(){this._renderer.value&&(this.refreshRows(0,this._rowCount-1),this._fireOnCanvasResize())}_fireOnCanvasResize(){this._renderer.value&&(this._renderer.value.dimensions.css.canvas.width===this._canvasWidth&&this._renderer.value.dimensions.css.canvas.height===this._canvasHeight||this._onDimensionsChange.fire(this._renderer.value.dimensions))}hasRenderer(){return!!this._renderer.value}setRenderer(e){this._renderer.value=e,this._renderer.value&&(this._renderer.value.onRequestRedraw((e=>this.refreshRows(e.start,e.end,!0))),this._needsSelectionRefresh=!0,this._fullRefresh())}addRefreshCallback(e){return this._renderDebouncer.addRefreshCallback(e)}_fullRefresh(){this._isPaused?this._needsFullRefresh=!0:this.refreshRows(0,this._rowCount-1)}clearTextureAtlas(){this._renderer.value&&(this._renderer.value.clearTextureAtlas?.(),this._fullRefresh())}handleDevicePixelRatioChange(){this._charSizeService.measure(),this._renderer.value&&(this._renderer.value.handleDevicePixelRatioChange(),this.refreshRows(0,this._rowCount-1))}handleResize(e,t){this._renderer.value&&(this._isPaused?this._pausedResizeTask.set((()=>this._renderer.value?.handleResize(e,t))):this._renderer.value.handleResize(e,t),this._fullRefresh())}handleCharSizeChanged(){this._renderer.value?.handleCharSizeChanged()}handleBlur(){this._renderer.value?.handleBlur()}handleFocus(){this._renderer.value?.handleFocus()}handleSelectionChanged(e,t,i){this._selectionState.start=e,this._selectionState.end=t,this._selectionState.columnSelectMode=i,this._renderer.value?.handleSelectionChanged(e,t,i)}handleCursorMove(){this._renderer.value?.handleCursorMove()}clear(){this._renderer.value?.clear()}};t.RenderService=d=s([r(2,l.IOptionsService),r(3,o.ICharSizeService),r(4,l.IDecorationService),r(5,l.IBufferService),r(6,o.ICoreBrowserService),r(7,o.IThemeService)],d)},9312:function(e,t,i){var s=this&&this.__decorate||function(e,t,i,s){var r,n=arguments.length,o=n<3?t:null===s?s=Object.getOwnPropertyDescriptor(t,i):s;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)o=Reflect.decorate(e,t,i,s);else for(var a=e.length-1;a>=0;a--)(r=e[a])&&(o=(n<3?r(o):n>3?r(t,i,o):r(t,i))||o);return n>3&&o&&Object.defineProperty(t,i,o),o},r=this&&this.__param||function(e,t){return function(i,s){t(i,s,e)}};Object.defineProperty(t,"__esModule",{value:!0}),t.SelectionService=void 0;const n=i(9806),o=i(9504),a=i(456),h=i(4725),c=i(8460),l=i(844),d=i(6114),_=i(4841),u=i(511),f=i(2585),v=String.fromCharCode(160),p=new RegExp(v,"g");let g=t.SelectionService=class extends l.Disposable{constructor(e,t,i,s,r,n,o,h,d){super(),this._element=e,this._screenElement=t,this._linkifier=i,this._bufferService=s,this._coreService=r,this._mouseService=n,this._optionsService=o,this._renderService=h,this._coreBrowserService=d,this._dragScrollAmount=0,this._enabled=!0,this._workCell=new u.CellData,this._mouseDownTimeStamp=0,this._oldHasSelection=!1,this._oldSelectionStart=void 0,this._oldSelectionEnd=void 0,this._onLinuxMouseSelection=this.register(new c.EventEmitter),this.onLinuxMouseSelection=this._onLinuxMouseSelection.event,this._onRedrawRequest=this.register(new c.EventEmitter),this.onRequestRedraw=this._onRedrawRequest.event,this._onSelectionChange=this.register(new c.EventEmitter),this.onSelectionChange=this._onSelectionChange.event,this._onRequestScrollLines=this.register(new c.EventEmitter),this.onRequestScrollLines=this._onRequestScrollLines.event,this._mouseMoveListener=e=>this._handleMouseMove(e),this._mouseUpListener=e=>this._handleMouseUp(e),this._coreService.onUserInput((()=>{this.hasSelection&&this.clearSelection()})),this._trimListener=this._bufferService.buffer.lines.onTrim((e=>this._handleTrim(e))),this.register(this._bufferService.buffers.onBufferActivate((e=>this._handleBufferActivate(e)))),this.enable(),this._model=new a.SelectionModel(this._bufferService),this._activeSelectionMode=0,this.register((0,l.toDisposable)((()=>{this._removeMouseDownListeners()})))}reset(){this.clearSelection()}disable(){this.clearSelection(),this._enabled=!1}enable(){this._enabled=!0}get selectionStart(){return this._model.finalSelectionStart}get selectionEnd(){return this._model.finalSelectionEnd}get hasSelection(){const e=this._model.finalSelectionStart,t=this._model.finalSelectionEnd;return!(!e||!t||e[0]===t[0]&&e[1]===t[1])}get selectionText(){const e=this._model.finalSelectionStart,t=this._model.finalSelectionEnd;if(!e||!t)return"";const i=this._bufferService.buffer,s=[];if(3===this._activeSelectionMode){if(e[0]===t[0])return"";const r=e[0]<t[0]?e[0]:t[0],n=e[0]<t[0]?t[0]:e[0];for(let o=e[1];o<=t[1];o++){const e=i.translateBufferLineToString(o,!0,r,n);s.push(e)}}else{const r=e[1]===t[1]?t[0]:void 0;s.push(i.translateBufferLineToString(e[1],!0,e[0],r));for(let r=e[1]+1;r<=t[1]-1;r++){const e=i.lines.get(r),t=i.translateBufferLineToString(r,!0);e?.isWrapped?s[s.length-1]+=t:s.push(t)}if(e[1]!==t[1]){const e=i.lines.get(t[1]),r=i.translateBufferLineToString(t[1],!0,0,t[0]);e&&e.isWrapped?s[s.length-1]+=r:s.push(r)}}return s.map((e=>e.replace(p," "))).join(d.isWindows?"\r\n":"\n")}clearSelection(){this._model.clearSelection(),this._removeMouseDownListeners(),this.refresh(),this._onSelectionChange.fire()}refresh(e){this._refreshAnimationFrame||(this._refreshAnimationFrame=this._coreBrowserService.window.requestAnimationFrame((()=>this._refresh()))),d.isLinux&&e&&this.selectionText.length&&this._onLinuxMouseSelection.fire(this.selectionText)}_refresh(){this._refreshAnimationFrame=void 0,this._onRedrawRequest.fire({start:this._model.finalSelectionStart,end:this._model.finalSelectionEnd,columnSelectMode:3===this._activeSelectionMode})}_isClickInSelection(e){const t=this._getMouseBufferCoords(e),i=this._model.finalSelectionStart,s=this._model.finalSelectionEnd;return!!(i&&s&&t)&&this._areCoordsInSelection(t,i,s)}isCellInSelection(e,t){const i=this._model.finalSelectionStart,s=this._model.finalSelectionEnd;return!(!i||!s)&&this._areCoordsInSelection([e,t],i,s)}_areCoordsInSelection(e,t,i){return e[1]>t[1]&&e[1]<i[1]||t[1]===i[1]&&e[1]===t[1]&&e[0]>=t[0]&&e[0]<i[0]||t[1]<i[1]&&e[1]===i[1]&&e[0]<i[0]||t[1]<i[1]&&e[1]===t[1]&&e[0]>=t[0]}_selectWordAtCursor(e,t){const i=this._linkifier.currentLink?.link?.range;if(i)return this._model.selectionStart=[i.start.x-1,i.start.y-1],this._model.selectionStartLength=(0,_.getRangeLength)(i,this._bufferService.cols),this._model.selectionEnd=void 0,!0;const s=this._getMouseBufferCoords(e);return!!s&&(this._selectWordAt(s,t),this._model.selectionEnd=void 0,!0)}selectAll(){this._model.isSelectAllActive=!0,this.refresh(),this._onSelectionChange.fire()}selectLines(e,t){this._model.clearSelection(),e=Math.max(e,0),t=Math.min(t,this._bufferService.buffer.lines.length-1),this._model.selectionStart=[0,e],this._model.selectionEnd=[this._bufferService.cols,t],this.refresh(),this._onSelectionChange.fire()}_handleTrim(e){this._model.handleTrim(e)&&this.refresh()}_getMouseBufferCoords(e){const t=this._mouseService.getCoords(e,this._screenElement,this._bufferService.cols,this._bufferService.rows,!0);if(t)return t[0]--,t[1]--,t[1]+=this._bufferService.buffer.ydisp,t}_getMouseEventScrollAmount(e){let t=(0,n.getCoordsRelativeToElement)(this._coreBrowserService.window,e,this._screenElement)[1];const i=this._renderService.dimensions.css.canvas.height;return t>=0&&t<=i?0:(t>i&&(t-=i),t=Math.min(Math.max(t,-50),50),t/=50,t/Math.abs(t)+Math.round(14*t))}shouldForceSelection(e){return d.isMac?e.altKey&&this._optionsService.rawOptions.macOptionClickForcesSelection:e.shiftKey}handleMouseDown(e){if(this._mouseDownTimeStamp=e.timeStamp,(2!==e.button||!this.hasSelection)&&0===e.button){if(!this._enabled){if(!this.shouldForceSelection(e))return;e.stopPropagation()}e.preventDefault(),this._dragScrollAmount=0,this._enabled&&e.shiftKey?this._handleIncrementalClick(e):1===e.detail?this._handleSingleClick(e):2===e.detail?this._handleDoubleClick(e):3===e.detail&&this._handleTripleClick(e),this._addMouseDownListeners(),this.refresh(!0)}}_addMouseDownListeners(){this._screenElement.ownerDocument&&(this._screenElement.ownerDocument.addEventListener("mousemove",this._mouseMoveListener),this._screenElement.ownerDocument.addEventListener("mouseup",this._mouseUpListener)),this._dragScrollIntervalTimer=this._coreBrowserService.window.setInterval((()=>this._dragScroll()),50)}_removeMouseDownListeners(){this._screenElement.ownerDocument&&(this._screenElement.ownerDocument.removeEventListener("mousemove",this._mouseMoveListener),this._screenElement.ownerDocument.removeEventListener("mouseup",this._mouseUpListener)),this._coreBrowserService.window.clearInterval(this._dragScrollIntervalTimer),this._dragScrollIntervalTimer=void 0}_handleIncrementalClick(e){this._model.selectionStart&&(this._model.selectionEnd=this._getMouseBufferCoords(e))}_handleSingleClick(e){if(this._model.selectionStartLength=0,this._model.isSelectAllActive=!1,this._activeSelectionMode=this.shouldColumnSelect(e)?3:0,this._model.selectionStart=this._getMouseBufferCoords(e),!this._model.selectionStart)return;this._model.selectionEnd=void 0;const t=this._bufferService.buffer.lines.get(this._model.selectionStart[1]);t&&t.length!==this._model.selectionStart[0]&&0===t.hasWidth(this._model.selectionStart[0])&&this._model.selectionStart[0]++}_handleDoubleClick(e){this._selectWordAtCursor(e,!0)&&(this._activeSelectionMode=1)}_handleTripleClick(e){const t=this._getMouseBufferCoords(e);t&&(this._activeSelectionMode=2,this._selectLineAt(t[1]))}shouldColumnSelect(e){return e.altKey&&!(d.isMac&&this._optionsService.rawOptions.macOptionClickForcesSelection)}_handleMouseMove(e){if(e.stopImmediatePropagation(),!this._model.selectionStart)return;const t=this._model.selectionEnd?[this._model.selectionEnd[0],this._model.selectionEnd[1]]:null;if(this._model.selectionEnd=this._getMouseBufferCoords(e),!this._model.selectionEnd)return void this.refresh(!0);2===this._activeSelectionMode?this._model.selectionEnd[1]<this._model.selectionStart[1]?this._model.selectionEnd[0]=0:this._model.selectionEnd[0]=this._bufferService.cols:1===this._activeSelectionMode&&this._selectToWordAt(this._model.selectionEnd),this._dragScrollAmount=this._getMouseEventScrollAmount(e),3!==this._activeSelectionMode&&(this._dragScrollAmount>0?this._model.selectionEnd[0]=this._bufferService.cols:this._dragScrollAmount<0&&(this._model.selectionEnd[0]=0));const i=this._bufferService.buffer;if(this._model.selectionEnd[1]<i.lines.length){const e=i.lines.get(this._model.selectionEnd[1]);e&&0===e.hasWidth(this._model.selectionEnd[0])&&this._model.selectionEnd[0]<this._bufferService.cols&&this._model.selectionEnd[0]++}t&&t[0]===this._model.selectionEnd[0]&&t[1]===this._model.selectionEnd[1]||this.refresh(!0)}_dragScroll(){if(this._model.selectionEnd&&this._model.selectionStart&&this._dragScrollAmount){this._onRequestScrollLines.fire({amount:this._dragScrollAmount,suppressScrollEvent:!1});const e=this._bufferService.buffer;this._dragScrollAmount>0?(3!==this._activeSelectionMode&&(this._model.selectionEnd[0]=this._bufferService.cols),this._model.selectionEnd[1]=Math.min(e.ydisp+this._bufferService.rows,e.lines.length-1)):(3!==this._activeSelectionMode&&(this._model.selectionEnd[0]=0),this._model.selectionEnd[1]=e.ydisp),this.refresh()}}_handleMouseUp(e){const t=e.timeStamp-this._mouseDownTimeStamp;if(this._removeMouseDownListeners(),this.selectionText.length<=1&&t<500&&e.altKey&&this._optionsService.rawOptions.altClickMovesCursor){if(this._bufferService.buffer.ybase===this._bufferService.buffer.ydisp){const t=this._mouseService.getCoords(e,this._element,this._bufferService.cols,this._bufferService.rows,!1);if(t&&void 0!==t[0]&&void 0!==t[1]){const e=(0,o.moveToCellSequence)(t[0]-1,t[1]-1,this._bufferService,this._coreService.decPrivateModes.applicationCursorKeys);this._coreService.triggerDataEvent(e,!0)}}}else this._fireEventIfSelectionChanged()}_fireEventIfSelectionChanged(){const e=this._model.finalSelectionStart,t=this._model.finalSelectionEnd,i=!(!e||!t||e[0]===t[0]&&e[1]===t[1]);i?e&&t&&(this._oldSelectionStart&&this._oldSelectionEnd&&e[0]===this._oldSelectionStart[0]&&e[1]===this._oldSelectionStart[1]&&t[0]===this._oldSelectionEnd[0]&&t[1]===this._oldSelectionEnd[1]||this._fireOnSelectionChange(e,t,i)):this._oldHasSelection&&this._fireOnSelectionChange(e,t,i)}_fireOnSelectionChange(e,t,i){this._oldSelectionStart=e,this._oldSelectionEnd=t,this._oldHasSelection=i,this._onSelectionChange.fire()}_handleBufferActivate(e){this.clearSelection(),this._trimListener.dispose(),this._trimListener=e.activeBuffer.lines.onTrim((e=>this._handleTrim(e)))}_convertViewportColToCharacterIndex(e,t){let i=t;for(let s=0;t>=s;s++){const r=e.loadCell(s,this._workCell).getChars().length;0===this._workCell.getWidth()?i--:r>1&&t!==s&&(i+=r-1)}return i}setSelection(e,t,i){this._model.clearSelection(),this._removeMouseDownListeners(),this._model.selectionStart=[e,t],this._model.selectionStartLength=i,this.refresh(),this._fireEventIfSelectionChanged()}rightClickSelect(e){this._isClickInSelection(e)||(this._selectWordAtCursor(e,!1)&&this.refresh(!0),this._fireEventIfSelectionChanged())}_getWordAt(e,t,i=!0,s=!0){if(e[0]>=this._bufferService.cols)return;const r=this._bufferService.buffer,n=r.lines.get(e[1]);if(!n)return;const o=r.translateBufferLineToString(e[1],!1);let a=this._convertViewportColToCharacterIndex(n,e[0]),h=a;const c=e[0]-a;let l=0,d=0,_=0,u=0;if(" "===o.charAt(a)){for(;a>0&&" "===o.charAt(a-1);)a--;for(;h<o.length&&" "===o.charAt(h+1);)h++}else{let t=e[0],i=e[0];0===n.getWidth(t)&&(l++,t--),2===n.getWidth(i)&&(d++,i++);const s=n.getString(i).length;for(s>1&&(u+=s-1,h+=s-1);t>0&&a>0&&!this._isCharWordSeparator(n.loadCell(t-1,this._workCell));){n.loadCell(t-1,this._workCell);const e=this._workCell.getChars().length;0===this._workCell.getWidth()?(l++,t--):e>1&&(_+=e-1,a-=e-1),a--,t--}for(;i<n.length&&h+1<o.length&&!this._isCharWordSeparator(n.loadCell(i+1,this._workCell));){n.loadCell(i+1,this._workCell);const e=this._workCell.getChars().length;2===this._workCell.getWidth()?(d++,i++):e>1&&(u+=e-1,h+=e-1),h++,i++}}h++;let f=a+c-l+_,v=Math.min(this._bufferService.cols,h-a+l+d-_-u);if(t||""!==o.slice(a,h).trim()){if(i&&0===f&&32!==n.getCodePoint(0)){const t=r.lines.get(e[1]-1);if(t&&n.isWrapped&&32!==t.getCodePoint(this._bufferService.cols-1)){const t=this._getWordAt([this._bufferService.cols-1,e[1]-1],!1,!0,!1);if(t){const e=this._bufferService.cols-t.start;f-=e,v+=e}}}if(s&&f+v===this._bufferService.cols&&32!==n.getCodePoint(this._bufferService.cols-1)){const t=r.lines.get(e[1]+1);if(t?.isWrapped&&32!==t.getCodePoint(0)){const t=this._getWordAt([0,e[1]+1],!1,!1,!0);t&&(v+=t.length)}}return{start:f,length:v}}}_selectWordAt(e,t){const i=this._getWordAt(e,t);if(i){for(;i.start<0;)i.start+=this._bufferService.cols,e[1]--;this._model.selectionStart=[i.start,e[1]],this._model.selectionStartLength=i.length}}_selectToWordAt(e){const t=this._getWordAt(e,!0);if(t){let i=e[1];for(;t.start<0;)t.start+=this._bufferService.cols,i--;if(!this._model.areSelectionValuesReversed())for(;t.start+t.length>this._bufferService.cols;)t.length-=this._bufferService.cols,i++;this._model.selectionEnd=[this._model.areSelectionValuesReversed()?t.start:t.start+t.length,i]}}_isCharWordSeparator(e){return 0!==e.getWidth()&&this._optionsService.rawOptions.wordSeparator.indexOf(e.getChars())>=0}_selectLineAt(e){const t=this._bufferService.buffer.getWrappedRangeForLine(e),i={start:{x:0,y:t.first},end:{x:this._bufferService.cols-1,y:t.last}};this._model.selectionStart=[0,t.first],this._model.selectionEnd=void 0,this._model.selectionStartLength=(0,_.getRangeLength)(i,this._bufferService.cols)}};t.SelectionService=g=s([r(3,f.IBufferService),r(4,f.ICoreService),r(5,h.IMouseService),r(6,f.IOptionsService),r(7,h.IRenderService),r(8,h.ICoreBrowserService)],g)},4725:(e,t,i)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.ILinkProviderService=t.IThemeService=t.ICharacterJoinerService=t.ISelectionService=t.IRenderService=t.IMouseService=t.ICoreBrowserService=t.ICharSizeService=void 0;const s=i(8343);t.ICharSizeService=(0,s.createDecorator)("CharSizeService"),t.ICoreBrowserService=(0,s.createDecorator)("CoreBrowserService"),t.IMouseService=(0,s.createDecorator)("MouseService"),t.IRenderService=(0,s.createDecorator)("RenderService"),t.ISelectionService=(0,s.createDecorator)("SelectionService"),t.ICharacterJoinerService=(0,s.createDecorator)("CharacterJoinerService"),t.IThemeService=(0,s.createDecorator)("ThemeService"),t.ILinkProviderService=(0,s.createDecorator)("LinkProviderService")},6731:function(e,t,i){var s=this&&this.__decorate||function(e,t,i,s){var r,n=arguments.length,o=n<3?t:null===s?s=Object.getOwnPropertyDescriptor(t,i):s;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)o=Reflect.decorate(e,t,i,s);else for(var a=e.length-1;a>=0;a--)(r=e[a])&&(o=(n<3?r(o):n>3?r(t,i,o):r(t,i))||o);return n>3&&o&&Object.defineProperty(t,i,o),o},r=this&&this.__param||function(e,t){return function(i,s){t(i,s,e)}};Object.defineProperty(t,"__esModule",{value:!0}),t.ThemeService=t.DEFAULT_ANSI_COLORS=void 0;const n=i(7239),o=i(8055),a=i(8460),h=i(844),c=i(2585),l=o.css.toColor("#ffffff"),d=o.css.toColor("#000000"),_=o.css.toColor("#ffffff"),u=o.css.toColor("#000000"),f={css:"rgba(255, 255, 255, 0.3)",rgba:4294967117};t.DEFAULT_ANSI_COLORS=Object.freeze((()=>{const e=[o.css.toColor("#2e3436"),o.css.toColor("#cc0000"),o.css.toColor("#4e9a06"),o.css.toColor("#c4a000"),o.css.toColor("#3465a4"),o.css.toColor("#75507b"),o.css.toColor("#06989a"),o.css.toColor("#d3d7cf"),o.css.toColor("#555753"),o.css.toColor("#ef2929"),o.css.toColor("#8ae234"),o.css.toColor("#fce94f"),o.css.toColor("#729fcf"),o.css.toColor("#ad7fa8"),o.css.toColor("#34e2e2"),o.css.toColor("#eeeeec")],t=[0,95,135,175,215,255];for(let i=0;i<216;i++){const s=t[i/36%6|0],r=t[i/6%6|0],n=t[i%6];e.push({css:o.channels.toCss(s,r,n),rgba:o.channels.toRgba(s,r,n)})}for(let t=0;t<24;t++){const i=8+10*t;e.push({css:o.channels.toCss(i,i,i),rgba:o.channels.toRgba(i,i,i)})}return e})());let v=t.ThemeService=class extends h.Disposable{get colors(){return this._colors}constructor(e){super(),this._optionsService=e,this._contrastCache=new n.ColorContrastCache,this._halfContrastCache=new n.ColorContrastCache,this._onChangeColors=this.register(new a.EventEmitter),this.onChangeColors=this._onChangeColors.event,this._colors={foreground:l,background:d,cursor:_,cursorAccent:u,selectionForeground:void 0,selectionBackgroundTransparent:f,selectionBackgroundOpaque:o.color.blend(d,f),selectionInactiveBackgroundTransparent:f,selectionInactiveBackgroundOpaque:o.color.blend(d,f),ansi:t.DEFAULT_ANSI_COLORS.slice(),contrastCache:this._contrastCache,halfContrastCache:this._halfContrastCache},this._updateRestoreColors(),this._setTheme(this._optionsService.rawOptions.theme),this.register(this._optionsService.onSpecificOptionChange("minimumContrastRatio",(()=>this._contrastCache.clear()))),this.register(this._optionsService.onSpecificOptionChange("theme",(()=>this._setTheme(this._optionsService.rawOptions.theme))))}_setTheme(e={}){const i=this._colors;if(i.foreground=p(e.foreground,l),i.background=p(e.background,d),i.cursor=p(e.cursor,_),i.cursorAccent=p(e.cursorAccent,u),i.selectionBackgroundTransparent=p(e.selectionBackground,f),i.selectionBackgroundOpaque=o.color.blend(i.background,i.selectionBackgroundTransparent),i.selectionInactiveBackgroundTransparent=p(e.selectionInactiveBackground,i.selectionBackgroundTransparent),i.selectionInactiveBackgroundOpaque=o.color.blend(i.background,i.selectionInactiveBackgroundTransparent),i.selectionForeground=e.selectionForeground?p(e.selectionForeground,o.NULL_COLOR):void 0,i.selectionForeground===o.NULL_COLOR&&(i.selectionForeground=void 0),o.color.isOpaque(i.selectionBackgroundTransparent)){const e=.3;i.selectionBackgroundTransparent=o.color.opacity(i.selectionBackgroundTransparent,e)}if(o.color.isOpaque(i.selectionInactiveBackgroundTransparent)){const e=.3;i.selectionInactiveBackgroundTransparent=o.color.opacity(i.selectionInactiveBackgroundTransparent,e)}if(i.ansi=t.DEFAULT_ANSI_COLORS.slice(),i.ansi[0]=p(e.black,t.DEFAULT_ANSI_COLORS[0]),i.ansi[1]=p(e.red,t.DEFAULT_ANSI_COLORS[1]),i.ansi[2]=p(e.green,t.DEFAULT_ANSI_COLORS[2]),i.ansi[3]=p(e.yellow,t.DEFAULT_ANSI_COLORS[3]),i.ansi[4]=p(e.blue,t.DEFAULT_ANSI_COLORS[4]),i.ansi[5]=p(e.magenta,t.DEFAULT_ANSI_COLORS[5]),i.ansi[6]=p(e.cyan,t.DEFAULT_ANSI_COLORS[6]),i.ansi[7]=p(e.white,t.DEFAULT_ANSI_COLORS[7]),i.ansi[8]=p(e.brightBlack,t.DEFAULT_ANSI_COLORS[8]),i.ansi[9]=p(e.brightRed,t.DEFAULT_ANSI_COLORS[9]),i.ansi[10]=p(e.brightGreen,t.DEFAULT_ANSI_COLORS[10]),i.ansi[11]=p(e.brightYellow,t.DEFAULT_ANSI_COLORS[11]),i.ansi[12]=p(e.brightBlue,t.DEFAULT_ANSI_COLORS[12]),i.ansi[13]=p(e.brightMagenta,t.DEFAULT_ANSI_COLORS[13]),i.ansi[14]=p(e.brightCyan,t.DEFAULT_ANSI_COLORS[14]),i.ansi[15]=p(e.brightWhite,t.DEFAULT_ANSI_COLORS[15]),e.extendedAnsi){const s=Math.min(i.ansi.length-16,e.extendedAnsi.length);for(let r=0;r<s;r++)i.ansi[r+16]=p(e.extendedAnsi[r],t.DEFAULT_ANSI_COLORS[r+16])}this._contrastCache.clear(),this._halfContrastCache.clear(),this._updateRestoreColors(),this._onChangeColors.fire(this.colors)}restoreColor(e){this._restoreColor(e),this._onChangeColors.fire(this.colors)}_restoreColor(e){if(void 0!==e)switch(e){case 256:this._colors.foreground=this._restoreColors.foreground;break;case 257:this._colors.background=this._restoreColors.background;break;case 258:this._colors.cursor=this._restoreColors.cursor;break;default:this._colors.ansi[e]=this._restoreColors.ansi[e]}else for(let e=0;e<this._restoreColors.ansi.length;++e)this._colors.ansi[e]=this._restoreColors.ansi[e]}modifyColors(e){e(this._colors),this._onChangeColors.fire(this.colors)}_updateRestoreColors(){this._restoreColors={foreground:this._colors.foreground,background:this._colors.background,cursor:this._colors.cursor,ansi:this._colors.ansi.slice()}}};function p(e,t){if(void 0!==e)try{return o.css.toColor(e)}catch{}return t}t.ThemeService=v=s([r(0,c.IOptionsService)],v)},6349:(e,t,i)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.CircularList=void 0;const s=i(8460),r=i(844);class n extends r.Disposable{constructor(e){super(),this._maxLength=e,this.onDeleteEmitter=this.register(new s.EventEmitter),this.onDelete=this.onDeleteEmitter.event,this.onInsertEmitter=this.register(new s.EventEmitter),this.onInsert=this.onInsertEmitter.event,this.onTrimEmitter=this.register(new s.EventEmitter),this.onTrim=this.onTrimEmitter.event,this._array=new Array(this._maxLength),this._startIndex=0,this._length=0}get maxLength(){return this._maxLength}set maxLength(e){if(this._maxLength===e)return;const t=new Array(e);for(let i=0;i<Math.min(e,this.length);i++)t[i]=this._array[this._getCyclicIndex(i)];this._array=t,this._maxLength=e,this._startIndex=0}get length(){return this._length}set length(e){if(e>this._length)for(let t=this._length;t<e;t++)this._array[t]=void 0;this._length=e}get(e){return this._array[this._getCyclicIndex(e)]}set(e,t){this._array[this._getCyclicIndex(e)]=t}push(e){this._array[this._getCyclicIndex(this._length)]=e,this._length===this._maxLength?(this._startIndex=++this._startIndex%this._maxLength,this.onTrimEmitter.fire(1)):this._length++}recycle(){if(this._length!==this._maxLength)throw new Error("Can only recycle when the buffer is full");return this._startIndex=++this._startIndex%this._maxLength,this.onTrimEmitter.fire(1),this._array[this._getCyclicIndex(this._length-1)]}get isFull(){return this._length===this._maxLength}pop(){return this._array[this._getCyclicIndex(this._length---1)]}splice(e,t,...i){if(t){for(let i=e;i<this._length-t;i++)this._array[this._getCyclicIndex(i)]=this._array[this._getCyclicIndex(i+t)];this._length-=t,this.onDeleteEmitter.fire({index:e,amount:t})}for(let t=this._length-1;t>=e;t--)this._array[this._getCyclicIndex(t+i.length)]=this._array[this._getCyclicIndex(t)];for(let t=0;t<i.length;t++)this._array[this._getCyclicIndex(e+t)]=i[t];if(i.length&&this.onInsertEmitter.fire({index:e,amount:i.length}),this._length+i.length>this._maxLength){const e=this._length+i.length-this._maxLength;this._startIndex+=e,this._length=this._maxLength,this.onTrimEmitter.fire(e)}else this._length+=i.length}trimStart(e){e>this._length&&(e=this._length),this._startIndex+=e,this._length-=e,this.onTrimEmitter.fire(e)}shiftElements(e,t,i){if(!(t<=0)){if(e<0||e>=this._length)throw new Error("start argument out of range");if(e+i<0)throw new Error("Cannot shift elements in list beyond index 0");if(i>0){for(let s=t-1;s>=0;s--)this.set(e+s+i,this.get(e+s));const s=e+t+i-this._length;if(s>0)for(this._length+=s;this._length>this._maxLength;)this._length--,this._startIndex++,this.onTrimEmitter.fire(1)}else for(let s=0;s<t;s++)this.set(e+s+i,this.get(e+s))}}_getCyclicIndex(e){return(this._startIndex+e)%this._maxLength}}t.CircularList=n},1439:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.clone=void 0,t.clone=function e(t,i=5){if("object"!=typeof t)return t;const s=Array.isArray(t)?[]:{};for(const r in t)s[r]=i<=1?t[r]:t[r]&&e(t[r],i-1);return s}},8055:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.contrastRatio=t.toPaddedHex=t.rgba=t.rgb=t.css=t.color=t.channels=t.NULL_COLOR=void 0;let i=0,s=0,r=0,n=0;var o,a,h,c,l;function d(e){const t=e.toString(16);return t.length<2?"0"+t:t}function _(e,t){return e<t?(t+.05)/(e+.05):(e+.05)/(t+.05)}t.NULL_COLOR={css:"#00000000",rgba:0},function(e){e.toCss=function(e,t,i,s){return void 0!==s?`#${d(e)}${d(t)}${d(i)}${d(s)}`:`#${d(e)}${d(t)}${d(i)}`},e.toRgba=function(e,t,i,s=255){return(e<<24|t<<16|i<<8|s)>>>0},e.toColor=function(t,i,s,r){return{css:e.toCss(t,i,s,r),rgba:e.toRgba(t,i,s,r)}}}(o||(t.channels=o={})),function(e){function t(e,t){return n=Math.round(255*t),[i,s,r]=l.toChannels(e.rgba),{css:o.toCss(i,s,r,n),rgba:o.toRgba(i,s,r,n)}}e.blend=function(e,t){if(n=(255&t.rgba)/255,1===n)return{css:t.css,rgba:t.rgba};const a=t.rgba>>24&255,h=t.rgba>>16&255,c=t.rgba>>8&255,l=e.rgba>>24&255,d=e.rgba>>16&255,_=e.rgba>>8&255;return i=l+Math.round((a-l)*n),s=d+Math.round((h-d)*n),r=_+Math.round((c-_)*n),{css:o.toCss(i,s,r),rgba:o.toRgba(i,s,r)}},e.isOpaque=function(e){return 255==(255&e.rgba)},e.ensureContrastRatio=function(e,t,i){const s=l.ensureContrastRatio(e.rgba,t.rgba,i);if(s)return o.toColor(s>>24&255,s>>16&255,s>>8&255)},e.opaque=function(e){const t=(255|e.rgba)>>>0;return[i,s,r]=l.toChannels(t),{css:o.toCss(i,s,r),rgba:t}},e.opacity=t,e.multiplyOpacity=function(e,i){return n=255&e.rgba,t(e,n*i/255)},e.toColorRGB=function(e){return[e.rgba>>24&255,e.rgba>>16&255,e.rgba>>8&255]}}(a||(t.color=a={})),function(e){let t,a;try{const e=document.createElement("canvas");e.width=1,e.height=1;const i=e.getContext("2d",{willReadFrequently:!0});i&&(t=i,t.globalCompositeOperation="copy",a=t.createLinearGradient(0,0,1,1))}catch{}e.toColor=function(e){if(e.match(/#[\da-f]{3,8}/i))switch(e.length){case 4:return i=parseInt(e.slice(1,2).repeat(2),16),s=parseInt(e.slice(2,3).repeat(2),16),r=parseInt(e.slice(3,4).repeat(2),16),o.toColor(i,s,r);case 5:return i=parseInt(e.slice(1,2).repeat(2),16),s=parseInt(e.slice(2,3).repeat(2),16),r=parseInt(e.slice(3,4).repeat(2),16),n=parseInt(e.slice(4,5).repeat(2),16),o.toColor(i,s,r,n);case 7:return{css:e,rgba:(parseInt(e.slice(1),16)<<8|255)>>>0};case 9:return{css:e,rgba:parseInt(e.slice(1),16)>>>0}}const h=e.match(/rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*(,\s*(0|1|\d?\.(\d+))\s*)?\)/);if(h)return i=parseInt(h[1]),s=parseInt(h[2]),r=parseInt(h[3]),n=Math.round(255*(void 0===h[5]?1:parseFloat(h[5]))),o.toColor(i,s,r,n);if(!t||!a)throw new Error("css.toColor: Unsupported css format");if(t.fillStyle=a,t.fillStyle=e,"string"!=typeof t.fillStyle)throw new Error("css.toColor: Unsupported css format");if(t.fillRect(0,0,1,1),[i,s,r,n]=t.getImageData(0,0,1,1).data,255!==n)throw new Error("css.toColor: Unsupported css format");return{rgba:o.toRgba(i,s,r,n),css:e}}}(h||(t.css=h={})),function(e){function t(e,t,i){const s=e/255,r=t/255,n=i/255;return.2126*(s<=.03928?s/12.92:Math.pow((s+.055)/1.055,2.4))+.7152*(r<=.03928?r/12.92:Math.pow((r+.055)/1.055,2.4))+.0722*(n<=.03928?n/12.92:Math.pow((n+.055)/1.055,2.4))}e.relativeLuminance=function(e){return t(e>>16&255,e>>8&255,255&e)},e.relativeLuminance2=t}(c||(t.rgb=c={})),function(e){function t(e,t,i){const s=e>>24&255,r=e>>16&255,n=e>>8&255;let o=t>>24&255,a=t>>16&255,h=t>>8&255,l=_(c.relativeLuminance2(o,a,h),c.relativeLuminance2(s,r,n));for(;l<i&&(o>0||a>0||h>0);)o-=Math.max(0,Math.ceil(.1*o)),a-=Math.max(0,Math.ceil(.1*a)),h-=Math.max(0,Math.ceil(.1*h)),l=_(c.relativeLuminance2(o,a,h),c.relativeLuminance2(s,r,n));return(o<<24|a<<16|h<<8|255)>>>0}function a(e,t,i){const s=e>>24&255,r=e>>16&255,n=e>>8&255;let o=t>>24&255,a=t>>16&255,h=t>>8&255,l=_(c.relativeLuminance2(o,a,h),c.relativeLuminance2(s,r,n));for(;l<i&&(o<255||a<255||h<255);)o=Math.min(255,o+Math.ceil(.1*(255-o))),a=Math.min(255,a+Math.ceil(.1*(255-a))),h=Math.min(255,h+Math.ceil(.1*(255-h))),l=_(c.relativeLuminance2(o,a,h),c.relativeLuminance2(s,r,n));return(o<<24|a<<16|h<<8|255)>>>0}e.blend=function(e,t){if(n=(255&t)/255,1===n)return t;const a=t>>24&255,h=t>>16&255,c=t>>8&255,l=e>>24&255,d=e>>16&255,_=e>>8&255;return i=l+Math.round((a-l)*n),s=d+Math.round((h-d)*n),r=_+Math.round((c-_)*n),o.toRgba(i,s,r)},e.ensureContrastRatio=function(e,i,s){const r=c.relativeLuminance(e>>8),n=c.relativeLuminance(i>>8);if(_(r,n)<s){if(n<r){const n=t(e,i,s),o=_(r,c.relativeLuminance(n>>8));if(o<s){const t=a(e,i,s);return o>_(r,c.relativeLuminance(t>>8))?n:t}return n}const o=a(e,i,s),h=_(r,c.relativeLuminance(o>>8));if(h<s){const n=t(e,i,s);return h>_(r,c.relativeLuminance(n>>8))?o:n}return o}},e.reduceLuminance=t,e.increaseLuminance=a,e.toChannels=function(e){return[e>>24&255,e>>16&255,e>>8&255,255&e]}}(l||(t.rgba=l={})),t.toPaddedHex=d,t.contrastRatio=_},8969:(e,t,i)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.CoreTerminal=void 0;const s=i(844),r=i(2585),n=i(4348),o=i(7866),a=i(744),h=i(7302),c=i(6975),l=i(8460),d=i(1753),_=i(1480),u=i(7994),f=i(9282),v=i(5435),p=i(5981),g=i(2660);let m=!1;class S extends s.Disposable{get onScroll(){return this._onScrollApi||(this._onScrollApi=this.register(new l.EventEmitter),this._onScroll.event((e=>{this._onScrollApi?.fire(e.position)}))),this._onScrollApi.event}get cols(){return this._bufferService.cols}get rows(){return this._bufferService.rows}get buffers(){return this._bufferService.buffers}get options(){return this.optionsService.options}set options(e){for(const t in e)this.optionsService.options[t]=e[t]}constructor(e){super(),this._windowsWrappingHeuristics=this.register(new s.MutableDisposable),this._onBinary=this.register(new l.EventEmitter),this.onBinary=this._onBinary.event,this._onData=this.register(new l.EventEmitter),this.onData=this._onData.event,this._onLineFeed=this.register(new l.EventEmitter),this.onLineFeed=this._onLineFeed.event,this._onResize=this.register(new l.EventEmitter),this.onResize=this._onResize.event,this._onWriteParsed=this.register(new l.EventEmitter),this.onWriteParsed=this._onWriteParsed.event,this._onScroll=this.register(new l.EventEmitter),this._instantiationService=new n.InstantiationService,this.optionsService=this.register(new h.OptionsService(e)),this._instantiationService.setService(r.IOptionsService,this.optionsService),this._bufferService=this.register(this._instantiationService.createInstance(a.BufferService)),this._instantiationService.setService(r.IBufferService,this._bufferService),this._logService=this.register(this._instantiationService.createInstance(o.LogService)),this._instantiationService.setService(r.ILogService,this._logService),this.coreService=this.register(this._instantiationService.createInstance(c.CoreService)),this._instantiationService.setService(r.ICoreService,this.coreService),this.coreMouseService=this.register(this._instantiationService.createInstance(d.CoreMouseService)),this._instantiationService.setService(r.ICoreMouseService,this.coreMouseService),this.unicodeService=this.register(this._instantiationService.createInstance(_.UnicodeService)),this._instantiationService.setService(r.IUnicodeService,this.unicodeService),this._charsetService=this._instantiationService.createInstance(u.CharsetService),this._instantiationService.setService(r.ICharsetService,this._charsetService),this._oscLinkService=this._instantiationService.createInstance(g.OscLinkService),this._instantiationService.setService(r.IOscLinkService,this._oscLinkService),this._inputHandler=this.register(new v.InputHandler(this._bufferService,this._charsetService,this.coreService,this._logService,this.optionsService,this._oscLinkService,this.coreMouseService,this.unicodeService)),this.register((0,l.forwardEvent)(this._inputHandler.onLineFeed,this._onLineFeed)),this.register(this._inputHandler),this.register((0,l.forwardEvent)(this._bufferService.onResize,this._onResize)),this.register((0,l.forwardEvent)(this.coreService.onData,this._onData)),this.register((0,l.forwardEvent)(this.coreService.onBinary,this._onBinary)),this.register(this.coreService.onRequestScrollToBottom((()=>this.scrollToBottom()))),this.register(this.coreService.onUserInput((()=>this._writeBuffer.handleUserInput()))),this.register(this.optionsService.onMultipleOptionChange(["windowsMode","windowsPty"],(()=>this._handleWindowsPtyOptionChange()))),this.register(this._bufferService.onScroll((e=>{this._onScroll.fire({position:this._bufferService.buffer.ydisp,source:0}),this._inputHandler.markRangeDirty(this._bufferService.buffer.scrollTop,this._bufferService.buffer.scrollBottom)}))),this.register(this._inputHandler.onScroll((e=>{this._onScroll.fire({position:this._bufferService.buffer.ydisp,source:0}),this._inputHandler.markRangeDirty(this._bufferService.buffer.scrollTop,this._bufferService.buffer.scrollBottom)}))),this._writeBuffer=this.register(new p.WriteBuffer(((e,t)=>this._inputHandler.parse(e,t)))),this.register((0,l.forwardEvent)(this._writeBuffer.onWriteParsed,this._onWriteParsed))}write(e,t){this._writeBuffer.write(e,t)}writeSync(e,t){this._logService.logLevel<=r.LogLevelEnum.WARN&&!m&&(this._logService.warn("writeSync is unreliable and will be removed soon."),m=!0),this._writeBuffer.writeSync(e,t)}input(e,t=!0){this.coreService.triggerDataEvent(e,t)}resize(e,t){isNaN(e)||isNaN(t)||(e=Math.max(e,a.MINIMUM_COLS),t=Math.max(t,a.MINIMUM_ROWS),this._bufferService.resize(e,t))}scroll(e,t=!1){this._bufferService.scroll(e,t)}scrollLines(e,t,i){this._bufferService.scrollLines(e,t,i)}scrollPages(e){this.scrollLines(e*(this.rows-1))}scrollToTop(){this.scrollLines(-this._bufferService.buffer.ydisp)}scrollToBottom(){this.scrollLines(this._bufferService.buffer.ybase-this._bufferService.buffer.ydisp)}scrollToLine(e){const t=e-this._bufferService.buffer.ydisp;0!==t&&this.scrollLines(t)}registerEscHandler(e,t){return this._inputHandler.registerEscHandler(e,t)}registerDcsHandler(e,t){return this._inputHandler.registerDcsHandler(e,t)}registerCsiHandler(e,t){return this._inputHandler.registerCsiHandler(e,t)}registerOscHandler(e,t){return this._inputHandler.registerOscHandler(e,t)}_setup(){this._handleWindowsPtyOptionChange()}reset(){this._inputHandler.reset(),this._bufferService.reset(),this._charsetService.reset(),this.coreService.reset(),this.coreMouseService.reset()}_handleWindowsPtyOptionChange(){let e=!1;const t=this.optionsService.rawOptions.windowsPty;t&&void 0!==t.buildNumber&&void 0!==t.buildNumber?e=!!("conpty"===t.backend&&t.buildNumber<21376):this.optionsService.rawOptions.windowsMode&&(e=!0),e?this._enableWindowsWrappingHeuristics():this._windowsWrappingHeuristics.clear()}_enableWindowsWrappingHeuristics(){if(!this._windowsWrappingHeuristics.value){const e=[];e.push(this.onLineFeed(f.updateWindowsModeWrappedState.bind(null,this._bufferService))),e.push(this.registerCsiHandler({final:"H"},(()=>((0,f.updateWindowsModeWrappedState)(this._bufferService),!1)))),this._windowsWrappingHeuristics.value=(0,s.toDisposable)((()=>{for(const t of e)t.dispose()}))}}}t.CoreTerminal=S},8460:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.runAndSubscribe=t.forwardEvent=t.EventEmitter=void 0,t.EventEmitter=class{constructor(){this._listeners=[],this._disposed=!1}get event(){return this._event||(this._event=e=>(this._listeners.push(e),{dispose:()=>{if(!this._disposed)for(let t=0;t<this._listeners.length;t++)if(this._listeners[t]===e)return void this._listeners.splice(t,1)}})),this._event}fire(e,t){const i=[];for(let e=0;e<this._listeners.length;e++)i.push(this._listeners[e]);for(let s=0;s<i.length;s++)i[s].call(void 0,e,t)}dispose(){this.clearListeners(),this._disposed=!0}clearListeners(){this._listeners&&(this._listeners.length=0)}},t.forwardEvent=function(e,t){return e((e=>t.fire(e)))},t.runAndSubscribe=function(e,t){return t(void 0),e((e=>t(e)))}},5435:function(e,t,i){var s=this&&this.__decorate||function(e,t,i,s){var r,n=arguments.length,o=n<3?t:null===s?s=Object.getOwnPropertyDescriptor(t,i):s;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)o=Reflect.decorate(e,t,i,s);else for(var a=e.length-1;a>=0;a--)(r=e[a])&&(o=(n<3?r(o):n>3?r(t,i,o):r(t,i))||o);return n>3&&o&&Object.defineProperty(t,i,o),o},r=this&&this.__param||function(e,t){return function(i,s){t(i,s,e)}};Object.defineProperty(t,"__esModule",{value:!0}),t.InputHandler=t.WindowsOptionsReportType=void 0;const n=i(2584),o=i(7116),a=i(2015),h=i(844),c=i(482),l=i(8437),d=i(8460),_=i(643),u=i(511),f=i(3734),v=i(2585),p=i(1480),g=i(6242),m=i(6351),S=i(5941),C={"(":0,")":1,"*":2,"+":3,"-":1,".":2},b=131072;function w(e,t){if(e>24)return t.setWinLines||!1;switch(e){case 1:return!!t.restoreWin;case 2:return!!t.minimizeWin;case 3:return!!t.setWinPosition;case 4:return!!t.setWinSizePixels;case 5:return!!t.raiseWin;case 6:return!!t.lowerWin;case 7:return!!t.refreshWin;case 8:return!!t.setWinSizeChars;case 9:return!!t.maximizeWin;case 10:return!!t.fullscreenWin;case 11:return!!t.getWinState;case 13:return!!t.getWinPosition;case 14:return!!t.getWinSizePixels;case 15:return!!t.getScreenSizePixels;case 16:return!!t.getCellSizePixels;case 18:return!!t.getWinSizeChars;case 19:return!!t.getScreenSizeChars;case 20:return!!t.getIconTitle;case 21:return!!t.getWinTitle;case 22:return!!t.pushTitle;case 23:return!!t.popTitle;case 24:return!!t.setWinLines}return!1}var y;!function(e){e[e.GET_WIN_SIZE_PIXELS=0]="GET_WIN_SIZE_PIXELS",e[e.GET_CELL_SIZE_PIXELS=1]="GET_CELL_SIZE_PIXELS"}(y||(t.WindowsOptionsReportType=y={}));let E=0;class k extends h.Disposable{getAttrData(){return this._curAttrData}constructor(e,t,i,s,r,h,_,f,v=new a.EscapeSequenceParser){super(),this._bufferService=e,this._charsetService=t,this._coreService=i,this._logService=s,this._optionsService=r,this._oscLinkService=h,this._coreMouseService=_,this._unicodeService=f,this._parser=v,this._parseBuffer=new Uint32Array(4096),this._stringDecoder=new c.StringToUtf32,this._utf8Decoder=new c.Utf8ToUtf32,this._workCell=new u.CellData,this._windowTitle="",this._iconName="",this._windowTitleStack=[],this._iconNameStack=[],this._curAttrData=l.DEFAULT_ATTR_DATA.clone(),this._eraseAttrDataInternal=l.DEFAULT_ATTR_DATA.clone(),this._onRequestBell=this.register(new d.EventEmitter),this.onRequestBell=this._onRequestBell.event,this._onRequestRefreshRows=this.register(new d.EventEmitter),this.onRequestRefreshRows=this._onRequestRefreshRows.event,this._onRequestReset=this.register(new d.EventEmitter),this.onRequestReset=this._onRequestReset.event,this._onRequestSendFocus=this.register(new d.EventEmitter),this.onRequestSendFocus=this._onRequestSendFocus.event,this._onRequestSyncScrollBar=this.register(new d.EventEmitter),this.onRequestSyncScrollBar=this._onRequestSyncScrollBar.event,this._onRequestWindowsOptionsReport=this.register(new d.EventEmitter),this.onRequestWindowsOptionsReport=this._onRequestWindowsOptionsReport.event,this._onA11yChar=this.register(new d.EventEmitter),this.onA11yChar=this._onA11yChar.event,this._onA11yTab=this.register(new d.EventEmitter),this.onA11yTab=this._onA11yTab.event,this._onCursorMove=this.register(new d.EventEmitter),this.onCursorMove=this._onCursorMove.event,this._onLineFeed=this.register(new d.EventEmitter),this.onLineFeed=this._onLineFeed.event,this._onScroll=this.register(new d.EventEmitter),this.onScroll=this._onScroll.event,this._onTitleChange=this.register(new d.EventEmitter),this.onTitleChange=this._onTitleChange.event,this._onColor=this.register(new d.EventEmitter),this.onColor=this._onColor.event,this._parseStack={paused:!1,cursorStartX:0,cursorStartY:0,decodedLength:0,position:0},this._specialColors=[256,257,258],this.register(this._parser),this._dirtyRowTracker=new L(this._bufferService),this._activeBuffer=this._bufferService.buffer,this.register(this._bufferService.buffers.onBufferActivate((e=>this._activeBuffer=e.activeBuffer))),this._parser.setCsiHandlerFallback(((e,t)=>{this._logService.debug("Unknown CSI code: ",{identifier:this._parser.identToString(e),params:t.toArray()})})),this._parser.setEscHandlerFallback((e=>{this._logService.debug("Unknown ESC code: ",{identifier:this._parser.identToString(e)})})),this._parser.setExecuteHandlerFallback((e=>{this._logService.debug("Unknown EXECUTE code: ",{code:e})})),this._parser.setOscHandlerFallback(((e,t,i)=>{this._logService.debug("Unknown OSC code: ",{identifier:e,action:t,data:i})})),this._parser.setDcsHandlerFallback(((e,t,i)=>{"HOOK"===t&&(i=i.toArray()),this._logService.debug("Unknown DCS code: ",{identifier:this._parser.identToString(e),action:t,payload:i})})),this._parser.setPrintHandler(((e,t,i)=>this.print(e,t,i))),this._parser.registerCsiHandler({final:"@"},(e=>this.insertChars(e))),this._parser.registerCsiHandler({intermediates:" ",final:"@"},(e=>this.scrollLeft(e))),this._parser.registerCsiHandler({final:"A"},(e=>this.cursorUp(e))),this._parser.registerCsiHandler({intermediates:" ",final:"A"},(e=>this.scrollRight(e))),this._parser.registerCsiHandler({final:"B"},(e=>this.cursorDown(e))),this._parser.registerCsiHandler({final:"C"},(e=>this.cursorForward(e))),this._parser.registerCsiHandler({final:"D"},(e=>this.cursorBackward(e))),this._parser.registerCsiHandler({final:"E"},(e=>this.cursorNextLine(e))),this._parser.registerCsiHandler({final:"F"},(e=>this.cursorPrecedingLine(e))),this._parser.registerCsiHandler({final:"G"},(e=>this.cursorCharAbsolute(e))),this._parser.registerCsiHandler({final:"H"},(e=>this.cursorPosition(e))),this._parser.registerCsiHandler({final:"I"},(e=>this.cursorForwardTab(e))),this._parser.registerCsiHandler({final:"J"},(e=>this.eraseInDisplay(e,!1))),this._parser.registerCsiHandler({prefix:"?",final:"J"},(e=>this.eraseInDisplay(e,!0))),this._parser.registerCsiHandler({final:"K"},(e=>this.eraseInLine(e,!1))),this._parser.registerCsiHandler({prefix:"?",final:"K"},(e=>this.eraseInLine(e,!0))),this._parser.registerCsiHandler({final:"L"},(e=>this.insertLines(e))),this._parser.registerCsiHandler({final:"M"},(e=>this.deleteLines(e))),this._parser.registerCsiHandler({final:"P"},(e=>this.deleteChars(e))),this._parser.registerCsiHandler({final:"S"},(e=>this.scrollUp(e))),this._parser.registerCsiHandler({final:"T"},(e=>this.scrollDown(e))),this._parser.registerCsiHandler({final:"X"},(e=>this.eraseChars(e))),this._parser.registerCsiHandler({final:"Z"},(e=>this.cursorBackwardTab(e))),this._parser.registerCsiHandler({final:"`"},(e=>this.charPosAbsolute(e))),this._parser.registerCsiHandler({final:"a"},(e=>this.hPositionRelative(e))),this._parser.registerCsiHandler({final:"b"},(e=>this.repeatPrecedingCharacter(e))),this._parser.registerCsiHandler({final:"c"},(e=>this.sendDeviceAttributesPrimary(e))),this._parser.registerCsiHandler({prefix:">",final:"c"},(e=>this.sendDeviceAttributesSecondary(e))),this._parser.registerCsiHandler({final:"d"},(e=>this.linePosAbsolute(e))),this._parser.registerCsiHandler({final:"e"},(e=>this.vPositionRelative(e))),this._parser.registerCsiHandler({final:"f"},(e=>this.hVPosition(e))),this._parser.registerCsiHandler({final:"g"},(e=>this.tabClear(e))),this._parser.registerCsiHandler({final:"h"},(e=>this.setMode(e))),this._parser.registerCsiHandler({prefix:"?",final:"h"},(e=>this.setModePrivate(e))),this._parser.registerCsiHandler({final:"l"},(e=>this.resetMode(e))),this._parser.registerCsiHandler({prefix:"?",final:"l"},(e=>this.resetModePrivate(e))),this._parser.registerCsiHandler({final:"m"},(e=>this.charAttributes(e))),this._parser.registerCsiHandler({final:"n"},(e=>this.deviceStatus(e))),this._parser.registerCsiHandler({prefix:"?",final:"n"},(e=>this.deviceStatusPrivate(e))),this._parser.registerCsiHandler({intermediates:"!",final:"p"},(e=>this.softReset(e))),this._parser.registerCsiHandler({intermediates:" ",final:"q"},(e=>this.setCursorStyle(e))),this._parser.registerCsiHandler({final:"r"},(e=>this.setScrollRegion(e))),this._parser.registerCsiHandler({final:"s"},(e=>this.saveCursor(e))),this._parser.registerCsiHandler({final:"t"},(e=>this.windowOptions(e))),this._parser.registerCsiHandler({final:"u"},(e=>this.restoreCursor(e))),this._parser.registerCsiHandler({intermediates:"'",final:"}"},(e=>this.insertColumns(e))),this._parser.registerCsiHandler({intermediates:"'",final:"~"},(e=>this.deleteColumns(e))),this._parser.registerCsiHandler({intermediates:'"',final:"q"},(e=>this.selectProtected(e))),this._parser.registerCsiHandler({intermediates:"$",final:"p"},(e=>this.requestMode(e,!0))),this._parser.registerCsiHandler({prefix:"?",intermediates:"$",final:"p"},(e=>this.requestMode(e,!1))),this._parser.setExecuteHandler(n.C0.BEL,(()=>this.bell())),this._parser.setExecuteHandler(n.C0.LF,(()=>this.lineFeed())),this._parser.setExecuteHandler(n.C0.VT,(()=>this.lineFeed())),this._parser.setExecuteHandler(n.C0.FF,(()=>this.lineFeed())),this._parser.setExecuteHandler(n.C0.CR,(()=>this.carriageReturn())),this._parser.setExecuteHandler(n.C0.BS,(()=>this.backspace())),this._parser.setExecuteHandler(n.C0.HT,(()=>this.tab())),this._parser.setExecuteHandler(n.C0.SO,(()=>this.shiftOut())),this._parser.setExecuteHandler(n.C0.SI,(()=>this.shiftIn())),this._parser.setExecuteHandler(n.C1.IND,(()=>this.index())),this._parser.setExecuteHandler(n.C1.NEL,(()=>this.nextLine())),this._parser.setExecuteHandler(n.C1.HTS,(()=>this.tabSet())),this._parser.registerOscHandler(0,new g.OscHandler((e=>(this.setTitle(e),this.setIconName(e),!0)))),this._parser.registerOscHandler(1,new g.OscHandler((e=>this.setIconName(e)))),this._parser.registerOscHandler(2,new g.OscHandler((e=>this.setTitle(e)))),this._parser.registerOscHandler(4,new g.OscHandler((e=>this.setOrReportIndexedColor(e)))),this._parser.registerOscHandler(8,new g.OscHandler((e=>this.setHyperlink(e)))),this._parser.registerOscHandler(10,new g.OscHandler((e=>this.setOrReportFgColor(e)))),this._parser.registerOscHandler(11,new g.OscHandler((e=>this.setOrReportBgColor(e)))),this._parser.registerOscHandler(12,new g.OscHandler((e=>this.setOrReportCursorColor(e)))),this._parser.registerOscHandler(104,new g.OscHandler((e=>this.restoreIndexedColor(e)))),this._parser.registerOscHandler(110,new g.OscHandler((e=>this.restoreFgColor(e)))),this._parser.registerOscHandler(111,new g.OscHandler((e=>this.restoreBgColor(e)))),this._parser.registerOscHandler(112,new g.OscHandler((e=>this.restoreCursorColor(e)))),this._parser.registerEscHandler({final:"7"},(()=>this.saveCursor())),this._parser.registerEscHandler({final:"8"},(()=>this.restoreCursor())),this._parser.registerEscHandler({final:"D"},(()=>this.index())),this._parser.registerEscHandler({final:"E"},(()=>this.nextLine())),this._parser.registerEscHandler({final:"H"},(()=>this.tabSet())),this._parser.registerEscHandler({final:"M"},(()=>this.reverseIndex())),this._parser.registerEscHandler({final:"="},(()=>this.keypadApplicationMode())),this._parser.registerEscHandler({final:">"},(()=>this.keypadNumericMode())),this._parser.registerEscHandler({final:"c"},(()=>this.fullReset())),this._parser.registerEscHandler({final:"n"},(()=>this.setgLevel(2))),this._parser.registerEscHandler({final:"o"},(()=>this.setgLevel(3))),this._parser.registerEscHandler({final:"|"},(()=>this.setgLevel(3))),this._parser.registerEscHandler({final:"}"},(()=>this.setgLevel(2))),this._parser.registerEscHandler({final:"~"},(()=>this.setgLevel(1))),this._parser.registerEscHandler({intermediates:"%",final:"@"},(()=>this.selectDefaultCharset())),this._parser.registerEscHandler({intermediates:"%",final:"G"},(()=>this.selectDefaultCharset()));for(const e in o.CHARSETS)this._parser.registerEscHandler({intermediates:"(",final:e},(()=>this.selectCharset("("+e))),this._parser.registerEscHandler({intermediates:")",final:e},(()=>this.selectCharset(")"+e))),this._parser.registerEscHandler({intermediates:"*",final:e},(()=>this.selectCharset("*"+e))),this._parser.registerEscHandler({intermediates:"+",final:e},(()=>this.selectCharset("+"+e))),this._parser.registerEscHandler({intermediates:"-",final:e},(()=>this.selectCharset("-"+e))),this._parser.registerEscHandler({intermediates:".",final:e},(()=>this.selectCharset("."+e))),this._parser.registerEscHandler({intermediates:"/",final:e},(()=>this.selectCharset("/"+e)));this._parser.registerEscHandler({intermediates:"#",final:"8"},(()=>this.screenAlignmentPattern())),this._parser.setErrorHandler((e=>(this._logService.error("Parsing error: ",e),e))),this._parser.registerDcsHandler({intermediates:"$",final:"q"},new m.DcsHandler(((e,t)=>this.requestStatusString(e,t))))}_preserveStack(e,t,i,s){this._parseStack.paused=!0,this._parseStack.cursorStartX=e,this._parseStack.cursorStartY=t,this._parseStack.decodedLength=i,this._parseStack.position=s}_logSlowResolvingAsync(e){this._logService.logLevel<=v.LogLevelEnum.WARN&&Promise.race([e,new Promise(((e,t)=>setTimeout((()=>t("#SLOW_TIMEOUT")),5e3)))]).catch((e=>{if("#SLOW_TIMEOUT"!==e)throw e;console.warn("async parser handler taking longer than 5000 ms")}))}_getCurrentLinkId(){return this._curAttrData.extended.urlId}parse(e,t){let i,s=this._activeBuffer.x,r=this._activeBuffer.y,n=0;const o=this._parseStack.paused;if(o){if(i=this._parser.parse(this._parseBuffer,this._parseStack.decodedLength,t))return this._logSlowResolvingAsync(i),i;s=this._parseStack.cursorStartX,r=this._parseStack.cursorStartY,this._parseStack.paused=!1,e.length>b&&(n=this._parseStack.position+b)}if(this._logService.logLevel<=v.LogLevelEnum.DEBUG&&this._logService.debug("parsing data"+("string"==typeof e?` "${e}"`:` "${Array.prototype.map.call(e,(e=>String.fromCharCode(e))).join("")}"`),"string"==typeof e?e.split("").map((e=>e.charCodeAt(0))):e),this._parseBuffer.length<e.length&&this._parseBuffer.length<b&&(this._parseBuffer=new Uint32Array(Math.min(e.length,b))),o||this._dirtyRowTracker.clearRange(),e.length>b)for(let t=n;t<e.length;t+=b){const n=t+b<e.length?t+b:e.length,o="string"==typeof e?this._stringDecoder.decode(e.substring(t,n),this._parseBuffer):this._utf8Decoder.decode(e.subarray(t,n),this._parseBuffer);if(i=this._parser.parse(this._parseBuffer,o))return this._preserveStack(s,r,o,t),this._logSlowResolvingAsync(i),i}else if(!o){const t="string"==typeof e?this._stringDecoder.decode(e,this._parseBuffer):this._utf8Decoder.decode(e,this._parseBuffer);if(i=this._parser.parse(this._parseBuffer,t))return this._preserveStack(s,r,t,0),this._logSlowResolvingAsync(i),i}this._activeBuffer.x===s&&this._activeBuffer.y===r||this._onCursorMove.fire();const a=this._dirtyRowTracker.end+(this._bufferService.buffer.ybase-this._bufferService.buffer.ydisp),h=this._dirtyRowTracker.start+(this._bufferService.buffer.ybase-this._bufferService.buffer.ydisp);h<this._bufferService.rows&&this._onRequestRefreshRows.fire(Math.min(h,this._bufferService.rows-1),Math.min(a,this._bufferService.rows-1))}print(e,t,i){let s,r;const n=this._charsetService.charset,o=this._optionsService.rawOptions.screenReaderMode,a=this._bufferService.cols,h=this._coreService.decPrivateModes.wraparound,d=this._coreService.modes.insertMode,u=this._curAttrData;let f=this._activeBuffer.lines.get(this._activeBuffer.ybase+this._activeBuffer.y);this._dirtyRowTracker.markDirty(this._activeBuffer.y),this._activeBuffer.x&&i-t>0&&2===f.getWidth(this._activeBuffer.x-1)&&f.setCellFromCodepoint(this._activeBuffer.x-1,0,1,u);let v=this._parser.precedingJoinState;for(let g=t;g<i;++g){if(s=e[g],s<127&&n){const e=n[String.fromCharCode(s)];e&&(s=e.charCodeAt(0))}const t=this._unicodeService.charProperties(s,v);r=p.UnicodeService.extractWidth(t);const i=p.UnicodeService.extractShouldJoin(t),m=i?p.UnicodeService.extractWidth(v):0;if(v=t,o&&this._onA11yChar.fire((0,c.stringFromCodePoint)(s)),this._getCurrentLinkId()&&this._oscLinkService.addLineToLink(this._getCurrentLinkId(),this._activeBuffer.ybase+this._activeBuffer.y),this._activeBuffer.x+r-m>a)if(h){const e=f;let t=this._activeBuffer.x-m;for(this._activeBuffer.x=m,this._activeBuffer.y++,this._activeBuffer.y===this._activeBuffer.scrollBottom+1?(this._activeBuffer.y--,this._bufferService.scroll(this._eraseAttrData(),!0)):(this._activeBuffer.y>=this._bufferService.rows&&(this._activeBuffer.y=this._bufferService.rows-1),this._activeBuffer.lines.get(this._activeBuffer.ybase+this._activeBuffer.y).isWrapped=!0),f=this._activeBuffer.lines.get(this._activeBuffer.ybase+this._activeBuffer.y),m>0&&f instanceof l.BufferLine&&f.copyCellsFrom(e,t,0,m,!1);t<a;)e.setCellFromCodepoint(t++,0,1,u)}else if(this._activeBuffer.x=a-1,2===r)continue;if(i&&this._activeBuffer.x){const e=f.getWidth(this._activeBuffer.x-1)?1:2;f.addCodepointToCell(this._activeBuffer.x-e,s,r);for(let e=r-m;--e>=0;)f.setCellFromCodepoint(this._activeBuffer.x++,0,0,u)}else if(d&&(f.insertCells(this._activeBuffer.x,r-m,this._activeBuffer.getNullCell(u)),2===f.getWidth(a-1)&&f.setCellFromCodepoint(a-1,_.NULL_CELL_CODE,_.NULL_CELL_WIDTH,u)),f.setCellFromCodepoint(this._activeBuffer.x++,s,r,u),r>0)for(;--r;)f.setCellFromCodepoint(this._activeBuffer.x++,0,0,u)}this._parser.precedingJoinState=v,this._activeBuffer.x<a&&i-t>0&&0===f.getWidth(this._activeBuffer.x)&&!f.hasContent(this._activeBuffer.x)&&f.setCellFromCodepoint(this._activeBuffer.x,0,1,u),this._dirtyRowTracker.markDirty(this._activeBuffer.y)}registerCsiHandler(e,t){return"t"!==e.final||e.prefix||e.intermediates?this._parser.registerCsiHandler(e,t):this._parser.registerCsiHandler(e,(e=>!w(e.params[0],this._optionsService.rawOptions.windowOptions)||t(e)))}registerDcsHandler(e,t){return this._parser.registerDcsHandler(e,new m.DcsHandler(t))}registerEscHandler(e,t){return this._parser.registerEscHandler(e,t)}registerOscHandler(e,t){return this._parser.registerOscHandler(e,new g.OscHandler(t))}bell(){return this._onRequestBell.fire(),!0}lineFeed(){return this._dirtyRowTracker.markDirty(this._activeBuffer.y),this._optionsService.rawOptions.convertEol&&(this._activeBuffer.x=0),this._activeBuffer.y++,this._activeBuffer.y===this._activeBuffer.scrollBottom+1?(this._activeBuffer.y--,this._bufferService.scroll(this._eraseAttrData())):this._activeBuffer.y>=this._bufferService.rows?this._activeBuffer.y=this._bufferService.rows-1:this._activeBuffer.lines.get(this._activeBuffer.ybase+this._activeBuffer.y).isWrapped=!1,this._activeBuffer.x>=this._bufferService.cols&&this._activeBuffer.x--,this._dirtyRowTracker.markDirty(this._activeBuffer.y),this._onLineFeed.fire(),!0}carriageReturn(){return this._activeBuffer.x=0,!0}backspace(){if(!this._coreService.decPrivateModes.reverseWraparound)return this._restrictCursor(),this._activeBuffer.x>0&&this._activeBuffer.x--,!0;if(this._restrictCursor(this._bufferService.cols),this._activeBuffer.x>0)this._activeBuffer.x--;else if(0===this._activeBuffer.x&&this._activeBuffer.y>this._activeBuffer.scrollTop&&this._activeBuffer.y<=this._activeBuffer.scrollBottom&&this._activeBuffer.lines.get(this._activeBuffer.ybase+this._activeBuffer.y)?.isWrapped){this._activeBuffer.lines.get(this._activeBuffer.ybase+this._activeBuffer.y).isWrapped=!1,this._activeBuffer.y--,this._activeBuffer.x=this._bufferService.cols-1;const e=this._activeBuffer.lines.get(this._activeBuffer.ybase+this._activeBuffer.y);e.hasWidth(this._activeBuffer.x)&&!e.hasContent(this._activeBuffer.x)&&this._activeBuffer.x--}return this._restrictCursor(),!0}tab(){if(this._activeBuffer.x>=this._bufferService.cols)return!0;const e=this._activeBuffer.x;return this._activeBuffer.x=this._activeBuffer.nextStop(),this._optionsService.rawOptions.screenReaderMode&&this._onA11yTab.fire(this._activeBuffer.x-e),!0}shiftOut(){return this._charsetService.setgLevel(1),!0}shiftIn(){return this._charsetService.setgLevel(0),!0}_restrictCursor(e=this._bufferService.cols-1){this._activeBuffer.x=Math.min(e,Math.max(0,this._activeBuffer.x)),this._activeBuffer.y=this._coreService.decPrivateModes.origin?Math.min(this._activeBuffer.scrollBottom,Math.max(this._activeBuffer.scrollTop,this._activeBuffer.y)):Math.min(this._bufferService.rows-1,Math.max(0,this._activeBuffer.y)),this._dirtyRowTracker.markDirty(this._activeBuffer.y)}_setCursor(e,t){this._dirtyRowTracker.markDirty(this._activeBuffer.y),this._coreService.decPrivateModes.origin?(this._activeBuffer.x=e,this._activeBuffer.y=this._activeBuffer.scrollTop+t):(this._activeBuffer.x=e,this._activeBuffer.y=t),this._restrictCursor(),this._dirtyRowTracker.markDirty(this._activeBuffer.y)}_moveCursor(e,t){this._restrictCursor(),this._setCursor(this._activeBuffer.x+e,this._activeBuffer.y+t)}cursorUp(e){const t=this._activeBuffer.y-this._activeBuffer.scrollTop;return t>=0?this._moveCursor(0,-Math.min(t,e.params[0]||1)):this._moveCursor(0,-(e.params[0]||1)),!0}cursorDown(e){const t=this._activeBuffer.scrollBottom-this._activeBuffer.y;return t>=0?this._moveCursor(0,Math.min(t,e.params[0]||1)):this._moveCursor(0,e.params[0]||1),!0}cursorForward(e){return this._moveCursor(e.params[0]||1,0),!0}cursorBackward(e){return this._moveCursor(-(e.params[0]||1),0),!0}cursorNextLine(e){return this.cursorDown(e),this._activeBuffer.x=0,!0}cursorPrecedingLine(e){return this.cursorUp(e),this._activeBuffer.x=0,!0}cursorCharAbsolute(e){return this._setCursor((e.params[0]||1)-1,this._activeBuffer.y),!0}cursorPosition(e){return this._setCursor(e.length>=2?(e.params[1]||1)-1:0,(e.params[0]||1)-1),!0}charPosAbsolute(e){return this._setCursor((e.params[0]||1)-1,this._activeBuffer.y),!0}hPositionRelative(e){return this._moveCursor(e.params[0]||1,0),!0}linePosAbsolute(e){return this._setCursor(this._activeBuffer.x,(e.params[0]||1)-1),!0}vPositionRelative(e){return this._moveCursor(0,e.params[0]||1),!0}hVPosition(e){return this.cursorPosition(e),!0}tabClear(e){const t=e.params[0];return 0===t?delete this._activeBuffer.tabs[this._activeBuffer.x]:3===t&&(this._activeBuffer.tabs={}),!0}cursorForwardTab(e){if(this._activeBuffer.x>=this._bufferService.cols)return!0;let t=e.params[0]||1;for(;t--;)this._activeBuffer.x=this._activeBuffer.nextStop();return!0}cursorBackwardTab(e){if(this._activeBuffer.x>=this._bufferService.cols)return!0;let t=e.params[0]||1;for(;t--;)this._activeBuffer.x=this._activeBuffer.prevStop();return!0}selectProtected(e){const t=e.params[0];return 1===t&&(this._curAttrData.bg|=536870912),2!==t&&0!==t||(this._curAttrData.bg&=-536870913),!0}_eraseInBufferLine(e,t,i,s=!1,r=!1){const n=this._activeBuffer.lines.get(this._activeBuffer.ybase+e);n.replaceCells(t,i,this._activeBuffer.getNullCell(this._eraseAttrData()),r),s&&(n.isWrapped=!1)}_resetBufferLine(e,t=!1){const i=this._activeBuffer.lines.get(this._activeBuffer.ybase+e);i&&(i.fill(this._activeBuffer.getNullCell(this._eraseAttrData()),t),this._bufferService.buffer.clearMarkers(this._activeBuffer.ybase+e),i.isWrapped=!1)}eraseInDisplay(e,t=!1){let i;switch(this._restrictCursor(this._bufferService.cols),e.params[0]){case 0:for(i=this._activeBuffer.y,this._dirtyRowTracker.markDirty(i),this._eraseInBufferLine(i++,this._activeBuffer.x,this._bufferService.cols,0===this._activeBuffer.x,t);i<this._bufferService.rows;i++)this._resetBufferLine(i,t);this._dirtyRowTracker.markDirty(i);break;case 1:for(i=this._activeBuffer.y,this._dirtyRowTracker.markDirty(i),this._eraseInBufferLine(i,0,this._activeBuffer.x+1,!0,t),this._activeBuffer.x+1>=this._bufferService.cols&&(this._activeBuffer.lines.get(i+1).isWrapped=!1);i--;)this._resetBufferLine(i,t);this._dirtyRowTracker.markDirty(0);break;case 2:for(i=this._bufferService.rows,this._dirtyRowTracker.markDirty(i-1);i--;)this._resetBufferLine(i,t);this._dirtyRowTracker.markDirty(0);break;case 3:const e=this._activeBuffer.lines.length-this._bufferService.rows;e>0&&(this._activeBuffer.lines.trimStart(e),this._activeBuffer.ybase=Math.max(this._activeBuffer.ybase-e,0),this._activeBuffer.ydisp=Math.max(this._activeBuffer.ydisp-e,0),this._onScroll.fire(0))}return!0}eraseInLine(e,t=!1){switch(this._restrictCursor(this._bufferService.cols),e.params[0]){case 0:this._eraseInBufferLine(this._activeBuffer.y,this._activeBuffer.x,this._bufferService.cols,0===this._activeBuffer.x,t);break;case 1:this._eraseInBufferLine(this._activeBuffer.y,0,this._activeBuffer.x+1,!1,t);break;case 2:this._eraseInBufferLine(this._activeBuffer.y,0,this._bufferService.cols,!0,t)}return this._dirtyRowTracker.markDirty(this._activeBuffer.y),!0}insertLines(e){this._restrictCursor();let t=e.params[0]||1;if(this._activeBuffer.y>this._activeBuffer.scrollBottom||this._activeBuffer.y<this._activeBuffer.scrollTop)return!0;const i=this._activeBuffer.ybase+this._activeBuffer.y,s=this._bufferService.rows-1-this._activeBuffer.scrollBottom,r=this._bufferService.rows-1+this._activeBuffer.ybase-s+1;for(;t--;)this._activeBuffer.lines.splice(r-1,1),this._activeBuffer.lines.splice(i,0,this._activeBuffer.getBlankLine(this._eraseAttrData()));return this._dirtyRowTracker.markRangeDirty(this._activeBuffer.y,this._activeBuffer.scrollBottom),this._activeBuffer.x=0,!0}deleteLines(e){this._restrictCursor();let t=e.params[0]||1;if(this._activeBuffer.y>this._activeBuffer.scrollBottom||this._activeBuffer.y<this._activeBuffer.scrollTop)return!0;const i=this._activeBuffer.ybase+this._activeBuffer.y;let s;for(s=this._bufferService.rows-1-this._activeBuffer.scrollBottom,s=this._bufferService.rows-1+this._activeBuffer.ybase-s;t--;)this._activeBuffer.lines.splice(i,1),this._activeBuffer.lines.splice(s,0,this._activeBuffer.getBlankLine(this._eraseAttrData()));return this._dirtyRowTracker.markRangeDirty(this._activeBuffer.y,this._activeBuffer.scrollBottom),this._activeBuffer.x=0,!0}insertChars(e){this._restrictCursor();const t=this._activeBuffer.lines.get(this._activeBuffer.ybase+this._activeBuffer.y);return t&&(t.insertCells(this._activeBuffer.x,e.params[0]||1,this._activeBuffer.getNullCell(this._eraseAttrData())),this._dirtyRowTracker.markDirty(this._activeBuffer.y)),!0}deleteChars(e){this._restrictCursor();const t=this._activeBuffer.lines.get(this._activeBuffer.ybase+this._activeBuffer.y);return t&&(t.deleteCells(this._activeBuffer.x,e.params[0]||1,this._activeBuffer.getNullCell(this._eraseAttrData())),this._dirtyRowTracker.markDirty(this._activeBuffer.y)),!0}scrollUp(e){let t=e.params[0]||1;for(;t--;)this._activeBuffer.lines.splice(this._activeBuffer.ybase+this._activeBuffer.scrollTop,1),this._activeBuffer.lines.splice(this._activeBuffer.ybase+this._activeBuffer.scrollBottom,0,this._activeBuffer.getBlankLine(this._eraseAttrData()));return this._dirtyRowTracker.markRangeDirty(this._activeBuffer.scrollTop,this._activeBuffer.scrollBottom),!0}scrollDown(e){let t=e.params[0]||1;for(;t--;)this._activeBuffer.lines.splice(this._activeBuffer.ybase+this._activeBuffer.scrollBottom,1),this._activeBuffer.lines.splice(this._activeBuffer.ybase+this._activeBuffer.scrollTop,0,this._activeBuffer.getBlankLine(l.DEFAULT_ATTR_DATA));return this._dirtyRowTracker.markRangeDirty(this._activeBuffer.scrollTop,this._activeBuffer.scrollBottom),!0}scrollLeft(e){if(this._activeBuffer.y>this._activeBuffer.scrollBottom||this._activeBuffer.y<this._activeBuffer.scrollTop)return!0;const t=e.params[0]||1;for(let e=this._activeBuffer.scrollTop;e<=this._activeBuffer.scrollBottom;++e){const i=this._activeBuffer.lines.get(this._activeBuffer.ybase+e);i.deleteCells(0,t,this._activeBuffer.getNullCell(this._eraseAttrData())),i.isWrapped=!1}return this._dirtyRowTracker.markRangeDirty(this._activeBuffer.scrollTop,this._activeBuffer.scrollBottom),!0}scrollRight(e){if(this._activeBuffer.y>this._activeBuffer.scrollBottom||this._activeBuffer.y<this._activeBuffer.scrollTop)return!0;const t=e.params[0]||1;for(let e=this._activeBuffer.scrollTop;e<=this._activeBuffer.scrollBottom;++e){const i=this._activeBuffer.lines.get(this._activeBuffer.ybase+e);i.insertCells(0,t,this._activeBuffer.getNullCell(this._eraseAttrData())),i.isWrapped=!1}return this._dirtyRowTracker.markRangeDirty(this._activeBuffer.scrollTop,this._activeBuffer.scrollBottom),!0}insertColumns(e){if(this._activeBuffer.y>this._activeBuffer.scrollBottom||this._activeBuffer.y<this._activeBuffer.scrollTop)return!0;const t=e.params[0]||1;for(let e=this._activeBuffer.scrollTop;e<=this._activeBuffer.scrollBottom;++e){const i=this._activeBuffer.lines.get(this._activeBuffer.ybase+e);i.insertCells(this._activeBuffer.x,t,this._activeBuffer.getNullCell(this._eraseAttrData())),i.isWrapped=!1}return this._dirtyRowTracker.markRangeDirty(this._activeBuffer.scrollTop,this._activeBuffer.scrollBottom),!0}deleteColumns(e){if(this._activeBuffer.y>this._activeBuffer.scrollBottom||this._activeBuffer.y<this._activeBuffer.scrollTop)return!0;const t=e.params[0]||1;for(let e=this._activeBuffer.scrollTop;e<=this._activeBuffer.scrollBottom;++e){const i=this._activeBuffer.lines.get(this._activeBuffer.ybase+e);i.deleteCells(this._activeBuffer.x,t,this._activeBuffer.getNullCell(this._eraseAttrData())),i.isWrapped=!1}return this._dirtyRowTracker.markRangeDirty(this._activeBuffer.scrollTop,this._activeBuffer.scrollBottom),!0}eraseChars(e){this._restrictCursor();const t=this._activeBuffer.lines.get(this._activeBuffer.ybase+this._activeBuffer.y);return t&&(t.replaceCells(this._activeBuffer.x,this._activeBuffer.x+(e.params[0]||1),this._activeBuffer.getNullCell(this._eraseAttrData())),this._dirtyRowTracker.markDirty(this._activeBuffer.y)),!0}repeatPrecedingCharacter(e){const t=this._parser.precedingJoinState;if(!t)return!0;const i=e.params[0]||1,s=p.UnicodeService.extractWidth(t),r=this._activeBuffer.x-s,n=this._activeBuffer.lines.get(this._activeBuffer.ybase+this._activeBuffer.y).getString(r),o=new Uint32Array(n.length*i);let a=0;for(let e=0;e<n.length;){const t=n.codePointAt(e)||0;o[a++]=t,e+=t>65535?2:1}let h=a;for(let e=1;e<i;++e)o.copyWithin(h,0,a),h+=a;return this.print(o,0,h),!0}sendDeviceAttributesPrimary(e){return e.params[0]>0||(this._is("xterm")||this._is("rxvt-unicode")||this._is("screen")?this._coreService.triggerDataEvent(n.C0.ESC+"[?1;2c"):this._is("linux")&&this._coreService.triggerDataEvent(n.C0.ESC+"[?6c")),!0}sendDeviceAttributesSecondary(e){return e.params[0]>0||(this._is("xterm")?this._coreService.triggerDataEvent(n.C0.ESC+"[>0;276;0c"):this._is("rxvt-unicode")?this._coreService.triggerDataEvent(n.C0.ESC+"[>85;95;0c"):this._is("linux")?this._coreService.triggerDataEvent(e.params[0]+"c"):this._is("screen")&&this._coreService.triggerDataEvent(n.C0.ESC+"[>83;40003;0c")),!0}_is(e){return 0===(this._optionsService.rawOptions.termName+"").indexOf(e)}setMode(e){for(let t=0;t<e.length;t++)switch(e.params[t]){case 4:this._coreService.modes.insertMode=!0;break;case 20:this._optionsService.options.convertEol=!0}return!0}setModePrivate(e){for(let t=0;t<e.length;t++)switch(e.params[t]){case 1:this._coreService.decPrivateModes.applicationCursorKeys=!0;break;case 2:this._charsetService.setgCharset(0,o.DEFAULT_CHARSET),this._charsetService.setgCharset(1,o.DEFAULT_CHARSET),this._charsetService.setgCharset(2,o.DEFAULT_CHARSET),this._charsetService.setgCharset(3,o.DEFAULT_CHARSET);break;case 3:this._optionsService.rawOptions.windowOptions.setWinLines&&(this._bufferService.resize(132,this._bufferService.rows),this._onRequestReset.fire());break;case 6:this._coreService.decPrivateModes.origin=!0,this._setCursor(0,0);break;case 7:this._coreService.decPrivateModes.wraparound=!0;break;case 12:this._optionsService.options.cursorBlink=!0;break;case 45:this._coreService.decPrivateModes.reverseWraparound=!0;break;case 66:this._logService.debug("Serial port requested application keypad."),this._coreService.decPrivateModes.applicationKeypad=!0,this._onRequestSyncScrollBar.fire();break;case 9:this._coreMouseService.activeProtocol="X10";break;case 1e3:this._coreMouseService.activeProtocol="VT200";break;case 1002:this._coreMouseService.activeProtocol="DRAG";break;case 1003:this._coreMouseService.activeProtocol="ANY";break;case 1004:this._coreService.decPrivateModes.sendFocus=!0,this._onRequestSendFocus.fire();break;case 1005:this._logService.debug("DECSET 1005 not supported (see #2507)");break;case 1006:this._coreMouseService.activeEncoding="SGR";break;case 1015:this._logService.debug("DECSET 1015 not supported (see #2507)");break;case 1016:this._coreMouseService.activeEncoding="SGR_PIXELS";break;case 25:this._coreService.isCursorHidden=!1;break;case 1048:this.saveCursor();break;case 1049:this.saveCursor();case 47:case 1047:this._bufferService.buffers.activateAltBuffer(this._eraseAttrData()),this._coreService.isCursorInitialized=!0,this._onRequestRefreshRows.fire(0,this._bufferService.rows-1),this._onRequestSyncScrollBar.fire();break;case 2004:this._coreService.decPrivateModes.bracketedPasteMode=!0}return!0}resetMode(e){for(let t=0;t<e.length;t++)switch(e.params[t]){case 4:this._coreService.modes.insertMode=!1;break;case 20:this._optionsService.options.convertEol=!1}return!0}resetModePrivate(e){for(let t=0;t<e.length;t++)switch(e.params[t]){case 1:this._coreService.decPrivateModes.applicationCursorKeys=!1;break;case 3:this._optionsService.rawOptions.windowOptions.setWinLines&&(this._bufferService.resize(80,this._bufferService.rows),this._onRequestReset.fire());break;case 6:this._coreService.decPrivateModes.origin=!1,this._setCursor(0,0);break;case 7:this._coreService.decPrivateModes.wraparound=!1;break;case 12:this._optionsService.options.cursorBlink=!1;break;case 45:this._coreService.decPrivateModes.reverseWraparound=!1;break;case 66:this._logService.debug("Switching back to normal keypad."),this._coreService.decPrivateModes.applicationKeypad=!1,this._onRequestSyncScrollBar.fire();break;case 9:case 1e3:case 1002:case 1003:this._coreMouseService.activeProtocol="NONE";break;case 1004:this._coreService.decPrivateModes.sendFocus=!1;break;case 1005:this._logService.debug("DECRST 1005 not supported (see #2507)");break;case 1006:case 1016:this._coreMouseService.activeEncoding="DEFAULT";break;case 1015:this._logService.debug("DECRST 1015 not supported (see #2507)");break;case 25:this._coreService.isCursorHidden=!0;break;case 1048:this.restoreCursor();break;case 1049:case 47:case 1047:this._bufferService.buffers.activateNormalBuffer(),1049===e.params[t]&&this.restoreCursor(),this._coreService.isCursorInitialized=!0,this._onRequestRefreshRows.fire(0,this._bufferService.rows-1),this._onRequestSyncScrollBar.fire();break;case 2004:this._coreService.decPrivateModes.bracketedPasteMode=!1}return!0}requestMode(e,t){const i=this._coreService.decPrivateModes,{activeProtocol:s,activeEncoding:r}=this._coreMouseService,o=this._coreService,{buffers:a,cols:h}=this._bufferService,{active:c,alt:l}=a,d=this._optionsService.rawOptions,_=e=>e?1:2,u=e.params[0];return f=u,v=t?2===u?4:4===u?_(o.modes.insertMode):12===u?3:20===u?_(d.convertEol):0:1===u?_(i.applicationCursorKeys):3===u?d.windowOptions.setWinLines?80===h?2:132===h?1:0:0:6===u?_(i.origin):7===u?_(i.wraparound):8===u?3:9===u?_("X10"===s):12===u?_(d.cursorBlink):25===u?_(!o.isCursorHidden):45===u?_(i.reverseWraparound):66===u?_(i.applicationKeypad):67===u?4:1e3===u?_("VT200"===s):1002===u?_("DRAG"===s):1003===u?_("ANY"===s):1004===u?_(i.sendFocus):1005===u?4:1006===u?_("SGR"===r):1015===u?4:1016===u?_("SGR_PIXELS"===r):1048===u?1:47===u||1047===u||1049===u?_(c===l):2004===u?_(i.bracketedPasteMode):0,o.triggerDataEvent(`${n.C0.ESC}[${t?"":"?"}${f};${v}$y`),!0;var f,v}_updateAttrColor(e,t,i,s,r){return 2===t?(e|=50331648,e&=-16777216,e|=f.AttributeData.fromColorRGB([i,s,r])):5===t&&(e&=-50331904,e|=33554432|255&i),e}_extractColor(e,t,i){const s=[0,0,-1,0,0,0];let r=0,n=0;do{if(s[n+r]=e.params[t+n],e.hasSubParams(t+n)){const i=e.getSubParams(t+n);let o=0;do{5===s[1]&&(r=1),s[n+o+1+r]=i[o]}while(++o<i.length&&o+n+1+r<s.length);break}if(5===s[1]&&n+r>=2||2===s[1]&&n+r>=5)break;s[1]&&(r=1)}while(++n+t<e.length&&n+r<s.length);for(let e=2;e<s.length;++e)-1===s[e]&&(s[e]=0);switch(s[0]){case 38:i.fg=this._updateAttrColor(i.fg,s[1],s[3],s[4],s[5]);break;case 48:i.bg=this._updateAttrColor(i.bg,s[1],s[3],s[4],s[5]);break;case 58:i.extended=i.extended.clone(),i.extended.underlineColor=this._updateAttrColor(i.extended.underlineColor,s[1],s[3],s[4],s[5])}return n}_processUnderline(e,t){t.extended=t.extended.clone(),(!~e||e>5)&&(e=1),t.extended.underlineStyle=e,t.fg|=268435456,0===e&&(t.fg&=-268435457),t.updateExtended()}_processSGR0(e){e.fg=l.DEFAULT_ATTR_DATA.fg,e.bg=l.DEFAULT_ATTR_DATA.bg,e.extended=e.extended.clone(),e.extended.underlineStyle=0,e.extended.underlineColor&=-67108864,e.updateExtended()}charAttributes(e){if(1===e.length&&0===e.params[0])return this._processSGR0(this._curAttrData),!0;const t=e.length;let i;const s=this._curAttrData;for(let r=0;r<t;r++)i=e.params[r],i>=30&&i<=37?(s.fg&=-50331904,s.fg|=16777216|i-30):i>=40&&i<=47?(s.bg&=-50331904,s.bg|=16777216|i-40):i>=90&&i<=97?(s.fg&=-50331904,s.fg|=16777224|i-90):i>=100&&i<=107?(s.bg&=-50331904,s.bg|=16777224|i-100):0===i?this._processSGR0(s):1===i?s.fg|=134217728:3===i?s.bg|=67108864:4===i?(s.fg|=268435456,this._processUnderline(e.hasSubParams(r)?e.getSubParams(r)[0]:1,s)):5===i?s.fg|=536870912:7===i?s.fg|=67108864:8===i?s.fg|=1073741824:9===i?s.fg|=2147483648:2===i?s.bg|=134217728:21===i?this._processUnderline(2,s):22===i?(s.fg&=-134217729,s.bg&=-134217729):23===i?s.bg&=-67108865:24===i?(s.fg&=-268435457,this._processUnderline(0,s)):25===i?s.fg&=-536870913:27===i?s.fg&=-67108865:28===i?s.fg&=-1073741825:29===i?s.fg&=2147483647:39===i?(s.fg&=-67108864,s.fg|=16777215&l.DEFAULT_ATTR_DATA.fg):49===i?(s.bg&=-67108864,s.bg|=16777215&l.DEFAULT_ATTR_DATA.bg):38===i||48===i||58===i?r+=this._extractColor(e,r,s):53===i?s.bg|=1073741824:55===i?s.bg&=-1073741825:59===i?(s.extended=s.extended.clone(),s.extended.underlineColor=-1,s.updateExtended()):100===i?(s.fg&=-67108864,s.fg|=16777215&l.DEFAULT_ATTR_DATA.fg,s.bg&=-67108864,s.bg|=16777215&l.DEFAULT_ATTR_DATA.bg):this._logService.debug("Unknown SGR attribute: %d.",i);return!0}deviceStatus(e){switch(e.params[0]){case 5:this._coreService.triggerDataEvent(`${n.C0.ESC}[0n`);break;case 6:const e=this._activeBuffer.y+1,t=this._activeBuffer.x+1;this._coreService.triggerDataEvent(`${n.C0.ESC}[${e};${t}R`)}return!0}deviceStatusPrivate(e){if(6===e.params[0]){const e=this._activeBuffer.y+1,t=this._activeBuffer.x+1;this._coreService.triggerDataEvent(`${n.C0.ESC}[?${e};${t}R`)}return!0}softReset(e){return this._coreService.isCursorHidden=!1,this._onRequestSyncScrollBar.fire(),this._activeBuffer.scrollTop=0,this._activeBuffer.scrollBottom=this._bufferService.rows-1,this._curAttrData=l.DEFAULT_ATTR_DATA.clone(),this._coreService.reset(),this._charsetService.reset(),this._activeBuffer.savedX=0,this._activeBuffer.savedY=this._activeBuffer.ybase,this._activeBuffer.savedCurAttrData.fg=this._curAttrData.fg,this._activeBuffer.savedCurAttrData.bg=this._curAttrData.bg,this._activeBuffer.savedCharset=this._charsetService.charset,this._coreService.decPrivateModes.origin=!1,!0}setCursorStyle(e){const t=e.params[0]||1;switch(t){case 1:case 2:this._optionsService.options.cursorStyle="block";break;case 3:case 4:this._optionsService.options.cursorStyle="underline";break;case 5:case 6:this._optionsService.options.cursorStyle="bar"}const i=t%2==1;return this._optionsService.options.cursorBlink=i,!0}setScrollRegion(e){const t=e.params[0]||1;let i;return(e.length<2||(i=e.params[1])>this._bufferService.rows||0===i)&&(i=this._bufferService.rows),i>t&&(this._activeBuffer.scrollTop=t-1,this._activeBuffer.scrollBottom=i-1,this._setCursor(0,0)),!0}windowOptions(e){if(!w(e.params[0],this._optionsService.rawOptions.windowOptions))return!0;const t=e.length>1?e.params[1]:0;switch(e.params[0]){case 14:2!==t&&this._onRequestWindowsOptionsReport.fire(y.GET_WIN_SIZE_PIXELS);break;case 16:this._onRequestWindowsOptionsReport.fire(y.GET_CELL_SIZE_PIXELS);break;case 18:this._bufferService&&this._coreService.triggerDataEvent(`${n.C0.ESC}[8;${this._bufferService.rows};${this._bufferService.cols}t`);break;case 22:0!==t&&2!==t||(this._windowTitleStack.push(this._windowTitle),this._windowTitleStack.length>10&&this._windowTitleStack.shift()),0!==t&&1!==t||(this._iconNameStack.push(this._iconName),this._iconNameStack.length>10&&this._iconNameStack.shift());break;case 23:0!==t&&2!==t||this._windowTitleStack.length&&this.setTitle(this._windowTitleStack.pop()),0!==t&&1!==t||this._iconNameStack.length&&this.setIconName(this._iconNameStack.pop())}return!0}saveCursor(e){return this._activeBuffer.savedX=this._activeBuffer.x,this._activeBuffer.savedY=this._activeBuffer.ybase+this._activeBuffer.y,this._activeBuffer.savedCurAttrData.fg=this._curAttrData.fg,this._activeBuffer.savedCurAttrData.bg=this._curAttrData.bg,this._activeBuffer.savedCharset=this._charsetService.charset,!0}restoreCursor(e){return this._activeBuffer.x=this._activeBuffer.savedX||0,this._activeBuffer.y=Math.max(this._activeBuffer.savedY-this._activeBuffer.ybase,0),this._curAttrData.fg=this._activeBuffer.savedCurAttrData.fg,this._curAttrData.bg=this._activeBuffer.savedCurAttrData.bg,this._charsetService.charset=this._savedCharset,this._activeBuffer.savedCharset&&(this._charsetService.charset=this._activeBuffer.savedCharset),this._restrictCursor(),!0}setTitle(e){return this._windowTitle=e,this._onTitleChange.fire(e),!0}setIconName(e){return this._iconName=e,!0}setOrReportIndexedColor(e){const t=[],i=e.split(";");for(;i.length>1;){const e=i.shift(),s=i.shift();if(/^\d+$/.exec(e)){const i=parseInt(e);if(D(i))if("?"===s)t.push({type:0,index:i});else{const e=(0,S.parseColor)(s);e&&t.push({type:1,index:i,color:e})}}}return t.length&&this._onColor.fire(t),!0}setHyperlink(e){const t=e.split(";");return!(t.length<2)&&(t[1]?this._createHyperlink(t[0],t[1]):!t[0]&&this._finishHyperlink())}_createHyperlink(e,t){this._getCurrentLinkId()&&this._finishHyperlink();const i=e.split(":");let s;const r=i.findIndex((e=>e.startsWith("id=")));return-1!==r&&(s=i[r].slice(3)||void 0),this._curAttrData.extended=this._curAttrData.extended.clone(),this._curAttrData.extended.urlId=this._oscLinkService.registerLink({id:s,uri:t}),this._curAttrData.updateExtended(),!0}_finishHyperlink(){return this._curAttrData.extended=this._curAttrData.extended.clone(),this._curAttrData.extended.urlId=0,this._curAttrData.updateExtended(),!0}_setOrReportSpecialColor(e,t){const i=e.split(";");for(let e=0;e<i.length&&!(t>=this._specialColors.length);++e,++t)if("?"===i[e])this._onColor.fire([{type:0,index:this._specialColors[t]}]);else{const s=(0,S.parseColor)(i[e]);s&&this._onColor.fire([{type:1,index:this._specialColors[t],color:s}])}return!0}setOrReportFgColor(e){return this._setOrReportSpecialColor(e,0)}setOrReportBgColor(e){return this._setOrReportSpecialColor(e,1)}setOrReportCursorColor(e){return this._setOrReportSpecialColor(e,2)}restoreIndexedColor(e){if(!e)return this._onColor.fire([{type:2}]),!0;const t=[],i=e.split(";");for(let e=0;e<i.length;++e)if(/^\d+$/.exec(i[e])){const s=parseInt(i[e]);D(s)&&t.push({type:2,index:s})}return t.length&&this._onColor.fire(t),!0}restoreFgColor(e){return this._onColor.fire([{type:2,index:256}]),!0}restoreBgColor(e){return this._onColor.fire([{type:2,index:257}]),!0}restoreCursorColor(e){return this._onColor.fire([{type:2,index:258}]),!0}nextLine(){return this._activeBuffer.x=0,this.index(),!0}keypadApplicationMode(){return this._logService.debug("Serial port requested application keypad."),this._coreService.decPrivateModes.applicationKeypad=!0,this._onRequestSyncScrollBar.fire(),!0}keypadNumericMode(){return this._logService.debug("Switching back to normal keypad."),this._coreService.decPrivateModes.applicationKeypad=!1,this._onRequestSyncScrollBar.fire(),!0}selectDefaultCharset(){return this._charsetService.setgLevel(0),this._charsetService.setgCharset(0,o.DEFAULT_CHARSET),!0}selectCharset(e){return 2!==e.length?(this.selectDefaultCharset(),!0):("/"===e[0]||this._charsetService.setgCharset(C[e[0]],o.CHARSETS[e[1]]||o.DEFAULT_CHARSET),!0)}index(){return this._restrictCursor(),this._activeBuffer.y++,this._activeBuffer.y===this._activeBuffer.scrollBottom+1?(this._activeBuffer.y--,this._bufferService.scroll(this._eraseAttrData())):this._activeBuffer.y>=this._bufferService.rows&&(this._activeBuffer.y=this._bufferService.rows-1),this._restrictCursor(),!0}tabSet(){return this._activeBuffer.tabs[this._activeBuffer.x]=!0,!0}reverseIndex(){if(this._restrictCursor(),this._activeBuffer.y===this._activeBuffer.scrollTop){const e=this._activeBuffer.scrollBottom-this._activeBuffer.scrollTop;this._activeBuffer.lines.shiftElements(this._activeBuffer.ybase+this._activeBuffer.y,e,1),this._activeBuffer.lines.set(this._activeBuffer.ybase+this._activeBuffer.y,this._activeBuffer.getBlankLine(this._eraseAttrData())),this._dirtyRowTracker.markRangeDirty(this._activeBuffer.scrollTop,this._activeBuffer.scrollBottom)}else this._activeBuffer.y--,this._restrictCursor();return!0}fullReset(){return this._parser.reset(),this._onRequestReset.fire(),!0}reset(){this._curAttrData=l.DEFAULT_ATTR_DATA.clone(),this._eraseAttrDataInternal=l.DEFAULT_ATTR_DATA.clone()}_eraseAttrData(){return this._eraseAttrDataInternal.bg&=-67108864,this._eraseAttrDataInternal.bg|=67108863&this._curAttrData.bg,this._eraseAttrDataInternal}setgLevel(e){return this._charsetService.setgLevel(e),!0}screenAlignmentPattern(){const e=new u.CellData;e.content=1<<22|"E".charCodeAt(0),e.fg=this._curAttrData.fg,e.bg=this._curAttrData.bg,this._setCursor(0,0);for(let t=0;t<this._bufferService.rows;++t){const i=this._activeBuffer.ybase+this._activeBuffer.y+t,s=this._activeBuffer.lines.get(i);s&&(s.fill(e),s.isWrapped=!1)}return this._dirtyRowTracker.markAllDirty(),this._setCursor(0,0),!0}requestStatusString(e,t){const i=this._bufferService.buffer,s=this._optionsService.rawOptions;return(e=>(this._coreService.triggerDataEvent(`${n.C0.ESC}${e}${n.C0.ESC}\\`),!0))('"q'===e?`P1$r${this._curAttrData.isProtected()?1:0}"q`:'"p'===e?'P1$r61;1"p':"r"===e?`P1$r${i.scrollTop+1};${i.scrollBottom+1}r`:"m"===e?"P1$r0m":" q"===e?`P1$r${{block:2,underline:4,bar:6}[s.cursorStyle]-(s.cursorBlink?1:0)} q`:"P0$r")}markRangeDirty(e,t){this._dirtyRowTracker.markRangeDirty(e,t)}}t.InputHandler=k;let L=class{constructor(e){this._bufferService=e,this.clearRange()}clearRange(){this.start=this._bufferService.buffer.y,this.end=this._bufferService.buffer.y}markDirty(e){e<this.start?this.start=e:e>this.end&&(this.end=e)}markRangeDirty(e,t){e>t&&(E=e,e=t,t=E),e<this.start&&(this.start=e),t>this.end&&(this.end=t)}markAllDirty(){this.markRangeDirty(0,this._bufferService.rows-1)}};function D(e){return 0<=e&&e<256}L=s([r(0,v.IBufferService)],L)},844:(e,t)=>{function i(e){for(const t of e)t.dispose();e.length=0}Object.defineProperty(t,"__esModule",{value:!0}),t.getDisposeArrayDisposable=t.disposeArray=t.toDisposable=t.MutableDisposable=t.Disposable=void 0,t.Disposable=class{constructor(){this._disposables=[],this._isDisposed=!1}dispose(){this._isDisposed=!0;for(const e of this._disposables)e.dispose();this._disposables.length=0}register(e){return this._disposables.push(e),e}unregister(e){const t=this._disposables.indexOf(e);-1!==t&&this._disposables.splice(t,1)}},t.MutableDisposable=class{constructor(){this._isDisposed=!1}get value(){return this._isDisposed?void 0:this._value}set value(e){this._isDisposed||e===this._value||(this._value?.dispose(),this._value=e)}clear(){this.value=void 0}dispose(){this._isDisposed=!0,this._value?.dispose(),this._value=void 0}},t.toDisposable=function(e){return{dispose:e}},t.disposeArray=i,t.getDisposeArrayDisposable=function(e){return{dispose:()=>i(e)}}},1505:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.FourKeyMap=t.TwoKeyMap=void 0;class i{constructor(){this._data={}}set(e,t,i){this._data[e]||(this._data[e]={}),this._data[e][t]=i}get(e,t){return this._data[e]?this._data[e][t]:void 0}clear(){this._data={}}}t.TwoKeyMap=i,t.FourKeyMap=class{constructor(){this._data=new i}set(e,t,s,r,n){this._data.get(e,t)||this._data.set(e,t,new i),this._data.get(e,t).set(s,r,n)}get(e,t,i,s){return this._data.get(e,t)?.get(i,s)}clear(){this._data.clear()}}},6114:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.isChromeOS=t.isLinux=t.isWindows=t.isIphone=t.isIpad=t.isMac=t.getSafariVersion=t.isSafari=t.isLegacyEdge=t.isFirefox=t.isNode=void 0,t.isNode="undefined"!=typeof process&&"title"in process;const i=t.isNode?"node":navigator.userAgent,s=t.isNode?"node":navigator.platform;t.isFirefox=i.includes("Firefox"),t.isLegacyEdge=i.includes("Edge"),t.isSafari=/^((?!chrome|android).)*safari/i.test(i),t.getSafariVersion=function(){if(!t.isSafari)return 0;const e=i.match(/Version\/(\d+)/);return null===e||e.length<2?0:parseInt(e[1])},t.isMac=["Macintosh","MacIntel","MacPPC","Mac68K"].includes(s),t.isIpad="iPad"===s,t.isIphone="iPhone"===s,t.isWindows=["Windows","Win16","Win32","WinCE"].includes(s),t.isLinux=s.indexOf("Linux")>=0,t.isChromeOS=/\bCrOS\b/.test(i)},6106:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.SortedList=void 0;let i=0;t.SortedList=class{constructor(e){this._getKey=e,this._array=[]}clear(){this._array.length=0}insert(e){0!==this._array.length?(i=this._search(this._getKey(e)),this._array.splice(i,0,e)):this._array.push(e)}delete(e){if(0===this._array.length)return!1;const t=this._getKey(e);if(void 0===t)return!1;if(i=this._search(t),-1===i)return!1;if(this._getKey(this._array[i])!==t)return!1;do{if(this._array[i]===e)return this._array.splice(i,1),!0}while(++i<this._array.length&&this._getKey(this._array[i])===t);return!1}*getKeyIterator(e){if(0!==this._array.length&&(i=this._search(e),!(i<0||i>=this._array.length)&&this._getKey(this._array[i])===e))do{yield this._array[i]}while(++i<this._array.length&&this._getKey(this._array[i])===e)}forEachByKey(e,t){if(0!==this._array.length&&(i=this._search(e),!(i<0||i>=this._array.length)&&this._getKey(this._array[i])===e))do{t(this._array[i])}while(++i<this._array.length&&this._getKey(this._array[i])===e)}values(){return[...this._array].values()}_search(e){let t=0,i=this._array.length-1;for(;i>=t;){let s=t+i>>1;const r=this._getKey(this._array[s]);if(r>e)i=s-1;else{if(!(r<e)){for(;s>0&&this._getKey(this._array[s-1])===e;)s--;return s}t=s+1}}return t}}},7226:(e,t,i)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.DebouncedIdleTask=t.IdleTaskQueue=t.PriorityTaskQueue=void 0;const s=i(6114);class r{constructor(){this._tasks=[],this._i=0}enqueue(e){this._tasks.push(e),this._start()}flush(){for(;this._i<this._tasks.length;)this._tasks[this._i]()||this._i++;this.clear()}clear(){this._idleCallback&&(this._cancelCallback(this._idleCallback),this._idleCallback=void 0),this._i=0,this._tasks.length=0}_start(){this._idleCallback||(this._idleCallback=this._requestCallback(this._process.bind(this)))}_process(e){this._idleCallback=void 0;let t=0,i=0,s=e.timeRemaining(),r=0;for(;this._i<this._tasks.length;){if(t=Date.now(),this._tasks[this._i]()||this._i++,t=Math.max(1,Date.now()-t),i=Math.max(t,i),r=e.timeRemaining(),1.5*i>r)return s-t<-20&&console.warn(`task queue exceeded allotted deadline by ${Math.abs(Math.round(s-t))}ms`),void this._start();s=r}this.clear()}}class n extends r{_requestCallback(e){return setTimeout((()=>e(this._createDeadline(16))))}_cancelCallback(e){clearTimeout(e)}_createDeadline(e){const t=Date.now()+e;return{timeRemaining:()=>Math.max(0,t-Date.now())}}}t.PriorityTaskQueue=n,t.IdleTaskQueue=!s.isNode&&"requestIdleCallback"in window?class extends r{_requestCallback(e){return requestIdleCallback(e)}_cancelCallback(e){cancelIdleCallback(e)}}:n,t.DebouncedIdleTask=class{constructor(){this._queue=new t.IdleTaskQueue}set(e){this._queue.clear(),this._queue.enqueue(e)}flush(){this._queue.flush()}}},9282:(e,t,i)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.updateWindowsModeWrappedState=void 0;const s=i(643);t.updateWindowsModeWrappedState=function(e){const t=e.buffer.lines.get(e.buffer.ybase+e.buffer.y-1),i=t?.get(e.cols-1),r=e.buffer.lines.get(e.buffer.ybase+e.buffer.y);r&&i&&(r.isWrapped=i[s.CHAR_DATA_CODE_INDEX]!==s.NULL_CELL_CODE&&i[s.CHAR_DATA_CODE_INDEX]!==s.WHITESPACE_CELL_CODE)}},3734:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.ExtendedAttrs=t.AttributeData=void 0;class i{constructor(){this.fg=0,this.bg=0,this.extended=new s}static toColorRGB(e){return[e>>>16&255,e>>>8&255,255&e]}static fromColorRGB(e){return(255&e[0])<<16|(255&e[1])<<8|255&e[2]}clone(){const e=new i;return e.fg=this.fg,e.bg=this.bg,e.extended=this.extended.clone(),e}isInverse(){return 67108864&this.fg}isBold(){return 134217728&this.fg}isUnderline(){return this.hasExtendedAttrs()&&0!==this.extended.underlineStyle?1:268435456&this.fg}isBlink(){return 536870912&this.fg}isInvisible(){return 1073741824&this.fg}isItalic(){return 67108864&this.bg}isDim(){return 134217728&this.bg}isStrikethrough(){return 2147483648&this.fg}isProtected(){return 536870912&this.bg}isOverline(){return 1073741824&this.bg}getFgColorMode(){return 50331648&this.fg}getBgColorMode(){return 50331648&this.bg}isFgRGB(){return 50331648==(50331648&this.fg)}isBgRGB(){return 50331648==(50331648&this.bg)}isFgPalette(){return 16777216==(50331648&this.fg)||33554432==(50331648&this.fg)}isBgPalette(){return 16777216==(50331648&this.bg)||33554432==(50331648&this.bg)}isFgDefault(){return 0==(50331648&this.fg)}isBgDefault(){return 0==(50331648&this.bg)}isAttributeDefault(){return 0===this.fg&&0===this.bg}getFgColor(){switch(50331648&this.fg){case 16777216:case 33554432:return 255&this.fg;case 50331648:return 16777215&this.fg;default:return-1}}getBgColor(){switch(50331648&this.bg){case 16777216:case 33554432:return 255&this.bg;case 50331648:return 16777215&this.bg;default:return-1}}hasExtendedAttrs(){return 268435456&this.bg}updateExtended(){this.extended.isEmpty()?this.bg&=-268435457:this.bg|=268435456}getUnderlineColor(){if(268435456&this.bg&&~this.extended.underlineColor)switch(50331648&this.extended.underlineColor){case 16777216:case 33554432:return 255&this.extended.underlineColor;case 50331648:return 16777215&this.extended.underlineColor;default:return this.getFgColor()}return this.getFgColor()}getUnderlineColorMode(){return 268435456&this.bg&&~this.extended.underlineColor?50331648&this.extended.underlineColor:this.getFgColorMode()}isUnderlineColorRGB(){return 268435456&this.bg&&~this.extended.underlineColor?50331648==(50331648&this.extended.underlineColor):this.isFgRGB()}isUnderlineColorPalette(){return 268435456&this.bg&&~this.extended.underlineColor?16777216==(50331648&this.extended.underlineColor)||33554432==(50331648&this.extended.underlineColor):this.isFgPalette()}isUnderlineColorDefault(){return 268435456&this.bg&&~this.extended.underlineColor?0==(50331648&this.extended.underlineColor):this.isFgDefault()}getUnderlineStyle(){return 268435456&this.fg?268435456&this.bg?this.extended.underlineStyle:1:0}getUnderlineVariantOffset(){return this.extended.underlineVariantOffset}}t.AttributeData=i;class s{get ext(){return this._urlId?-469762049&this._ext|this.underlineStyle<<26:this._ext}set ext(e){this._ext=e}get underlineStyle(){return this._urlId?5:(469762048&this._ext)>>26}set underlineStyle(e){this._ext&=-469762049,this._ext|=e<<26&469762048}get underlineColor(){return 67108863&this._ext}set underlineColor(e){this._ext&=-67108864,this._ext|=67108863&e}get urlId(){return this._urlId}set urlId(e){this._urlId=e}get underlineVariantOffset(){const e=(3758096384&this._ext)>>29;return e<0?4294967288^e:e}set underlineVariantOffset(e){this._ext&=536870911,this._ext|=e<<29&3758096384}constructor(e=0,t=0){this._ext=0,this._urlId=0,this._ext=e,this._urlId=t}clone(){return new s(this._ext,this._urlId)}isEmpty(){return 0===this.underlineStyle&&0===this._urlId}}t.ExtendedAttrs=s},9092:(e,t,i)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.Buffer=t.MAX_BUFFER_SIZE=void 0;const s=i(6349),r=i(7226),n=i(3734),o=i(8437),a=i(4634),h=i(511),c=i(643),l=i(4863),d=i(7116);t.MAX_BUFFER_SIZE=4294967295,t.Buffer=class{constructor(e,t,i){this._hasScrollback=e,this._optionsService=t,this._bufferService=i,this.ydisp=0,this.ybase=0,this.y=0,this.x=0,this.tabs={},this.savedY=0,this.savedX=0,this.savedCurAttrData=o.DEFAULT_ATTR_DATA.clone(),this.savedCharset=d.DEFAULT_CHARSET,this.markers=[],this._nullCell=h.CellData.fromCharData([0,c.NULL_CELL_CHAR,c.NULL_CELL_WIDTH,c.NULL_CELL_CODE]),this._whitespaceCell=h.CellData.fromCharData([0,c.WHITESPACE_CELL_CHAR,c.WHITESPACE_CELL_WIDTH,c.WHITESPACE_CELL_CODE]),this._isClearing=!1,this._memoryCleanupQueue=new r.IdleTaskQueue,this._memoryCleanupPosition=0,this._cols=this._bufferService.cols,this._rows=this._bufferService.rows,this.lines=new s.CircularList(this._getCorrectBufferLength(this._rows)),this.scrollTop=0,this.scrollBottom=this._rows-1,this.setupTabStops()}getNullCell(e){return e?(this._nullCell.fg=e.fg,this._nullCell.bg=e.bg,this._nullCell.extended=e.extended):(this._nullCell.fg=0,this._nullCell.bg=0,this._nullCell.extended=new n.ExtendedAttrs),this._nullCell}getWhitespaceCell(e){return e?(this._whitespaceCell.fg=e.fg,this._whitespaceCell.bg=e.bg,this._whitespaceCell.extended=e.extended):(this._whitespaceCell.fg=0,this._whitespaceCell.bg=0,this._whitespaceCell.extended=new n.ExtendedAttrs),this._whitespaceCell}getBlankLine(e,t){return new o.BufferLine(this._bufferService.cols,this.getNullCell(e),t)}get hasScrollback(){return this._hasScrollback&&this.lines.maxLength>this._rows}get isCursorInViewport(){const e=this.ybase+this.y-this.ydisp;return e>=0&&e<this._rows}_getCorrectBufferLength(e){if(!this._hasScrollback)return e;const i=e+this._optionsService.rawOptions.scrollback;return i>t.MAX_BUFFER_SIZE?t.MAX_BUFFER_SIZE:i}fillViewportRows(e){if(0===this.lines.length){void 0===e&&(e=o.DEFAULT_ATTR_DATA);let t=this._rows;for(;t--;)this.lines.push(this.getBlankLine(e))}}clear(){this.ydisp=0,this.ybase=0,this.y=0,this.x=0,this.lines=new s.CircularList(this._getCorrectBufferLength(this._rows)),this.scrollTop=0,this.scrollBottom=this._rows-1,this.setupTabStops()}resize(e,t){const i=this.getNullCell(o.DEFAULT_ATTR_DATA);let s=0;const r=this._getCorrectBufferLength(t);if(r>this.lines.maxLength&&(this.lines.maxLength=r),this.lines.length>0){if(this._cols<e)for(let t=0;t<this.lines.length;t++)s+=+this.lines.get(t).resize(e,i);let n=0;if(this._rows<t)for(let s=this._rows;s<t;s++)this.lines.length<t+this.ybase&&(this._optionsService.rawOptions.windowsMode||void 0!==this._optionsService.rawOptions.windowsPty.backend||void 0!==this._optionsService.rawOptions.windowsPty.buildNumber?this.lines.push(new o.BufferLine(e,i)):this.ybase>0&&this.lines.length<=this.ybase+this.y+n+1?(this.ybase--,n++,this.ydisp>0&&this.ydisp--):this.lines.push(new o.BufferLine(e,i)));else for(let e=this._rows;e>t;e--)this.lines.length>t+this.ybase&&(this.lines.length>this.ybase+this.y+1?this.lines.pop():(this.ybase++,this.ydisp++));if(r<this.lines.maxLength){const e=this.lines.length-r;e>0&&(this.lines.trimStart(e),this.ybase=Math.max(this.ybase-e,0),this.ydisp=Math.max(this.ydisp-e,0),this.savedY=Math.max(this.savedY-e,0)),this.lines.maxLength=r}this.x=Math.min(this.x,e-1),this.y=Math.min(this.y,t-1),n&&(this.y+=n),this.savedX=Math.min(this.savedX,e-1),this.scrollTop=0}if(this.scrollBottom=t-1,this._isReflowEnabled&&(this._reflow(e,t),this._cols>e))for(let t=0;t<this.lines.length;t++)s+=+this.lines.get(t).resize(e,i);this._cols=e,this._rows=t,this._memoryCleanupQueue.clear(),s>.1*this.lines.length&&(this._memoryCleanupPosition=0,this._memoryCleanupQueue.enqueue((()=>this._batchedMemoryCleanup())))}_batchedMemoryCleanup(){let e=!0;this._memoryCleanupPosition>=this.lines.length&&(this._memoryCleanupPosition=0,e=!1);let t=0;for(;this._memoryCleanupPosition<this.lines.length;)if(t+=this.lines.get(this._memoryCleanupPosition++).cleanupMemory(),t>100)return!0;return e}get _isReflowEnabled(){const e=this._optionsService.rawOptions.windowsPty;return e&&e.buildNumber?this._hasScrollback&&"conpty"===e.backend&&e.buildNumber>=21376:this._hasScrollback&&!this._optionsService.rawOptions.windowsMode}_reflow(e,t){this._cols!==e&&(e>this._cols?this._reflowLarger(e,t):this._reflowSmaller(e,t))}_reflowLarger(e,t){const i=(0,a.reflowLargerGetLinesToRemove)(this.lines,this._cols,e,this.ybase+this.y,this.getNullCell(o.DEFAULT_ATTR_DATA));if(i.length>0){const s=(0,a.reflowLargerCreateNewLayout)(this.lines,i);(0,a.reflowLargerApplyNewLayout)(this.lines,s.layout),this._reflowLargerAdjustViewport(e,t,s.countRemoved)}}_reflowLargerAdjustViewport(e,t,i){const s=this.getNullCell(o.DEFAULT_ATTR_DATA);let r=i;for(;r-- >0;)0===this.ybase?(this.y>0&&this.y--,this.lines.length<t&&this.lines.push(new o.BufferLine(e,s))):(this.ydisp===this.ybase&&this.ydisp--,this.ybase--);this.savedY=Math.max(this.savedY-i,0)}_reflowSmaller(e,t){const i=this.getNullCell(o.DEFAULT_ATTR_DATA),s=[];let r=0;for(let n=this.lines.length-1;n>=0;n--){let h=this.lines.get(n);if(!h||!h.isWrapped&&h.getTrimmedLength()<=e)continue;const c=[h];for(;h.isWrapped&&n>0;)h=this.lines.get(--n),c.unshift(h);const l=this.ybase+this.y;if(l>=n&&l<n+c.length)continue;const d=c[c.length-1].getTrimmedLength(),_=(0,a.reflowSmallerGetNewLineLengths)(c,this._cols,e),u=_.length-c.length;let f;f=0===this.ybase&&this.y!==this.lines.length-1?Math.max(0,this.y-this.lines.maxLength+u):Math.max(0,this.lines.length-this.lines.maxLength+u);const v=[];for(let e=0;e<u;e++){const e=this.getBlankLine(o.DEFAULT_ATTR_DATA,!0);v.push(e)}v.length>0&&(s.push({start:n+c.length+r,newLines:v}),r+=v.length),c.push(...v);let p=_.length-1,g=_[p];0===g&&(p--,g=_[p]);let m=c.length-u-1,S=d;for(;m>=0;){const e=Math.min(S,g);if(void 0===c[p])break;if(c[p].copyCellsFrom(c[m],S-e,g-e,e,!0),g-=e,0===g&&(p--,g=_[p]),S-=e,0===S){m--;const e=Math.max(m,0);S=(0,a.getWrappedLineTrimmedLength)(c,e,this._cols)}}for(let t=0;t<c.length;t++)_[t]<e&&c[t].setCell(_[t],i);let C=u-f;for(;C-- >0;)0===this.ybase?this.y<t-1?(this.y++,this.lines.pop()):(this.ybase++,this.ydisp++):this.ybase<Math.min(this.lines.maxLength,this.lines.length+r)-t&&(this.ybase===this.ydisp&&this.ydisp++,this.ybase++);this.savedY=Math.min(this.savedY+u,this.ybase+t-1)}if(s.length>0){const e=[],t=[];for(let e=0;e<this.lines.length;e++)t.push(this.lines.get(e));const i=this.lines.length;let n=i-1,o=0,a=s[o];this.lines.length=Math.min(this.lines.maxLength,this.lines.length+r);let h=0;for(let c=Math.min(this.lines.maxLength-1,i+r-1);c>=0;c--)if(a&&a.start>n+h){for(let e=a.newLines.length-1;e>=0;e--)this.lines.set(c--,a.newLines[e]);c++,e.push({index:n+1,amount:a.newLines.length}),h+=a.newLines.length,a=s[++o]}else this.lines.set(c,t[n--]);let c=0;for(let t=e.length-1;t>=0;t--)e[t].index+=c,this.lines.onInsertEmitter.fire(e[t]),c+=e[t].amount;const l=Math.max(0,i+r-this.lines.maxLength);l>0&&this.lines.onTrimEmitter.fire(l)}}translateBufferLineToString(e,t,i=0,s){const r=this.lines.get(e);return r?r.translateToString(t,i,s):""}getWrappedRangeForLine(e){let t=e,i=e;for(;t>0&&this.lines.get(t).isWrapped;)t--;for(;i+1<this.lines.length&&this.lines.get(i+1).isWrapped;)i++;return{first:t,last:i}}setupTabStops(e){for(null!=e?this.tabs[e]||(e=this.prevStop(e)):(this.tabs={},e=0);e<this._cols;e+=this._optionsService.rawOptions.tabStopWidth)this.tabs[e]=!0}prevStop(e){for(null==e&&(e=this.x);!this.tabs[--e]&&e>0;);return e>=this._cols?this._cols-1:e<0?0:e}nextStop(e){for(null==e&&(e=this.x);!this.tabs[++e]&&e<this._cols;);return e>=this._cols?this._cols-1:e<0?0:e}clearMarkers(e){this._isClearing=!0;for(let t=0;t<this.markers.length;t++)this.markers[t].line===e&&(this.markers[t].dispose(),this.markers.splice(t--,1));this._isClearing=!1}clearAllMarkers(){this._isClearing=!0;for(let e=0;e<this.markers.length;e++)this.markers[e].dispose(),this.markers.splice(e--,1);this._isClearing=!1}addMarker(e){const t=new l.Marker(e);return this.markers.push(t),t.register(this.lines.onTrim((e=>{t.line-=e,t.line<0&&t.dispose()}))),t.register(this.lines.onInsert((e=>{t.line>=e.index&&(t.line+=e.amount)}))),t.register(this.lines.onDelete((e=>{t.line>=e.index&&t.line<e.index+e.amount&&t.dispose(),t.line>e.index&&(t.line-=e.amount)}))),t.register(t.onDispose((()=>this._removeMarker(t)))),t}_removeMarker(e){this._isClearing||this.markers.splice(this.markers.indexOf(e),1)}}},8437:(e,t,i)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.BufferLine=t.DEFAULT_ATTR_DATA=void 0;const s=i(3734),r=i(511),n=i(643),o=i(482);t.DEFAULT_ATTR_DATA=Object.freeze(new s.AttributeData);let a=0;class h{constructor(e,t,i=!1){this.isWrapped=i,this._combined={},this._extendedAttrs={},this._data=new Uint32Array(3*e);const s=t||r.CellData.fromCharData([0,n.NULL_CELL_CHAR,n.NULL_CELL_WIDTH,n.NULL_CELL_CODE]);for(let t=0;t<e;++t)this.setCell(t,s);this.length=e}get(e){const t=this._data[3*e+0],i=2097151&t;return[this._data[3*e+1],2097152&t?this._combined[e]:i?(0,o.stringFromCodePoint)(i):"",t>>22,2097152&t?this._combined[e].charCodeAt(this._combined[e].length-1):i]}set(e,t){this._data[3*e+1]=t[n.CHAR_DATA_ATTR_INDEX],t[n.CHAR_DATA_CHAR_INDEX].length>1?(this._combined[e]=t[1],this._data[3*e+0]=2097152|e|t[n.CHAR_DATA_WIDTH_INDEX]<<22):this._data[3*e+0]=t[n.CHAR_DATA_CHAR_INDEX].charCodeAt(0)|t[n.CHAR_DATA_WIDTH_INDEX]<<22}getWidth(e){return this._data[3*e+0]>>22}hasWidth(e){return 12582912&this._data[3*e+0]}getFg(e){return this._data[3*e+1]}getBg(e){return this._data[3*e+2]}hasContent(e){return 4194303&this._data[3*e+0]}getCodePoint(e){const t=this._data[3*e+0];return 2097152&t?this._combined[e].charCodeAt(this._combined[e].length-1):2097151&t}isCombined(e){return 2097152&this._data[3*e+0]}getString(e){const t=this._data[3*e+0];return 2097152&t?this._combined[e]:2097151&t?(0,o.stringFromCodePoint)(2097151&t):""}isProtected(e){return 536870912&this._data[3*e+2]}loadCell(e,t){return a=3*e,t.content=this._data[a+0],t.fg=this._data[a+1],t.bg=this._data[a+2],2097152&t.content&&(t.combinedData=this._combined[e]),268435456&t.bg&&(t.extended=this._extendedAttrs[e]),t}setCell(e,t){2097152&t.content&&(this._combined[e]=t.combinedData),268435456&t.bg&&(this._extendedAttrs[e]=t.extended),this._data[3*e+0]=t.content,this._data[3*e+1]=t.fg,this._data[3*e+2]=t.bg}setCellFromCodepoint(e,t,i,s){268435456&s.bg&&(this._extendedAttrs[e]=s.extended),this._data[3*e+0]=t|i<<22,this._data[3*e+1]=s.fg,this._data[3*e+2]=s.bg}addCodepointToCell(e,t,i){let s=this._data[3*e+0];2097152&s?this._combined[e]+=(0,o.stringFromCodePoint)(t):2097151&s?(this._combined[e]=(0,o.stringFromCodePoint)(2097151&s)+(0,o.stringFromCodePoint)(t),s&=-2097152,s|=2097152):s=t|1<<22,i&&(s&=-12582913,s|=i<<22),this._data[3*e+0]=s}insertCells(e,t,i){if((e%=this.length)&&2===this.getWidth(e-1)&&this.setCellFromCodepoint(e-1,0,1,i),t<this.length-e){const s=new r.CellData;for(let i=this.length-e-t-1;i>=0;--i)this.setCell(e+t+i,this.loadCell(e+i,s));for(let s=0;s<t;++s)this.setCell(e+s,i)}else for(let t=e;t<this.length;++t)this.setCell(t,i);2===this.getWidth(this.length-1)&&this.setCellFromCodepoint(this.length-1,0,1,i)}deleteCells(e,t,i){if(e%=this.length,t<this.length-e){const s=new r.CellData;for(let i=0;i<this.length-e-t;++i)this.setCell(e+i,this.loadCell(e+t+i,s));for(let e=this.length-t;e<this.length;++e)this.setCell(e,i)}else for(let t=e;t<this.length;++t)this.setCell(t,i);e&&2===this.getWidth(e-1)&&this.setCellFromCodepoint(e-1,0,1,i),0!==this.getWidth(e)||this.hasContent(e)||this.setCellFromCodepoint(e,0,1,i)}replaceCells(e,t,i,s=!1){if(s)for(e&&2===this.getWidth(e-1)&&!this.isProtected(e-1)&&this.setCellFromCodepoint(e-1,0,1,i),t<this.length&&2===this.getWidth(t-1)&&!this.isProtected(t)&&this.setCellFromCodepoint(t,0,1,i);e<t&&e<this.length;)this.isProtected(e)||this.setCell(e,i),e++;else for(e&&2===this.getWidth(e-1)&&this.setCellFromCodepoint(e-1,0,1,i),t<this.length&&2===this.getWidth(t-1)&&this.setCellFromCodepoint(t,0,1,i);e<t&&e<this.length;)this.setCell(e++,i)}resize(e,t){if(e===this.length)return 4*this._data.length*2<this._data.buffer.byteLength;const i=3*e;if(e>this.length){if(this._data.buffer.byteLength>=4*i)this._data=new Uint32Array(this._data.buffer,0,i);else{const e=new Uint32Array(i);e.set(this._data),this._data=e}for(let i=this.length;i<e;++i)this.setCell(i,t)}else{this._data=this._data.subarray(0,i);const t=Object.keys(this._combined);for(let i=0;i<t.length;i++){const s=parseInt(t[i],10);s>=e&&delete this._combined[s]}const s=Object.keys(this._extendedAttrs);for(let t=0;t<s.length;t++){const i=parseInt(s[t],10);i>=e&&delete this._extendedAttrs[i]}}return this.length=e,4*i*2<this._data.buffer.byteLength}cleanupMemory(){if(4*this._data.length*2<this._data.buffer.byteLength){const e=new Uint32Array(this._data.length);return e.set(this._data),this._data=e,1}return 0}fill(e,t=!1){if(t)for(let t=0;t<this.length;++t)this.isProtected(t)||this.setCell(t,e);else{this._combined={},this._extendedAttrs={};for(let t=0;t<this.length;++t)this.setCell(t,e)}}copyFrom(e){this.length!==e.length?this._data=new Uint32Array(e._data):this._data.set(e._data),this.length=e.length,this._combined={};for(const t in e._combined)this._combined[t]=e._combined[t];this._extendedAttrs={};for(const t in e._extendedAttrs)this._extendedAttrs[t]=e._extendedAttrs[t];this.isWrapped=e.isWrapped}clone(){const e=new h(0);e._data=new Uint32Array(this._data),e.length=this.length;for(const t in this._combined)e._combined[t]=this._combined[t];for(const t in this._extendedAttrs)e._extendedAttrs[t]=this._extendedAttrs[t];return e.isWrapped=this.isWrapped,e}getTrimmedLength(){for(let e=this.length-1;e>=0;--e)if(4194303&this._data[3*e+0])return e+(this._data[3*e+0]>>22);return 0}getNoBgTrimmedLength(){for(let e=this.length-1;e>=0;--e)if(4194303&this._data[3*e+0]||50331648&this._data[3*e+2])return e+(this._data[3*e+0]>>22);return 0}copyCellsFrom(e,t,i,s,r){const n=e._data;if(r)for(let r=s-1;r>=0;r--){for(let e=0;e<3;e++)this._data[3*(i+r)+e]=n[3*(t+r)+e];268435456&n[3*(t+r)+2]&&(this._extendedAttrs[i+r]=e._extendedAttrs[t+r])}else for(let r=0;r<s;r++){for(let e=0;e<3;e++)this._data[3*(i+r)+e]=n[3*(t+r)+e];268435456&n[3*(t+r)+2]&&(this._extendedAttrs[i+r]=e._extendedAttrs[t+r])}const o=Object.keys(e._combined);for(let s=0;s<o.length;s++){const r=parseInt(o[s],10);r>=t&&(this._combined[r-t+i]=e._combined[r])}}translateToString(e,t,i,s){t=t??0,i=i??this.length,e&&(i=Math.min(i,this.getTrimmedLength())),s&&(s.length=0);let r="";for(;t<i;){const e=this._data[3*t+0],i=2097151&e,a=2097152&e?this._combined[t]:i?(0,o.stringFromCodePoint)(i):n.WHITESPACE_CELL_CHAR;if(r+=a,s)for(let e=0;e<a.length;++e)s.push(t);t+=e>>22||1}return s&&s.push(t),r}}t.BufferLine=h},4841:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.getRangeLength=void 0,t.getRangeLength=function(e,t){if(e.start.y>e.end.y)throw new Error(`Buffer range end (${e.end.x}, ${e.end.y}) cannot be before start (${e.start.x}, ${e.start.y})`);return t*(e.end.y-e.start.y)+(e.end.x-e.start.x+1)}},4634:(e,t)=>{function i(e,t,i){if(t===e.length-1)return e[t].getTrimmedLength();const s=!e[t].hasContent(i-1)&&1===e[t].getWidth(i-1),r=2===e[t+1].getWidth(0);return s&&r?i-1:i}Object.defineProperty(t,"__esModule",{value:!0}),t.getWrappedLineTrimmedLength=t.reflowSmallerGetNewLineLengths=t.reflowLargerApplyNewLayout=t.reflowLargerCreateNewLayout=t.reflowLargerGetLinesToRemove=void 0,t.reflowLargerGetLinesToRemove=function(e,t,s,r,n){const o=[];for(let a=0;a<e.length-1;a++){let h=a,c=e.get(++h);if(!c.isWrapped)continue;const l=[e.get(a)];for(;h<e.length&&c.isWrapped;)l.push(c),c=e.get(++h);if(r>=a&&r<h){a+=l.length-1;continue}let d=0,_=i(l,d,t),u=1,f=0;for(;u<l.length;){const e=i(l,u,t),r=e-f,o=s-_,a=Math.min(r,o);l[d].copyCellsFrom(l[u],f,_,a,!1),_+=a,_===s&&(d++,_=0),f+=a,f===e&&(u++,f=0),0===_&&0!==d&&2===l[d-1].getWidth(s-1)&&(l[d].copyCellsFrom(l[d-1],s-1,_++,1,!1),l[d-1].setCell(s-1,n))}l[d].replaceCells(_,s,n);let v=0;for(let e=l.length-1;e>0&&(e>d||0===l[e].getTrimmedLength());e--)v++;v>0&&(o.push(a+l.length-v),o.push(v)),a+=l.length-1}return o},t.reflowLargerCreateNewLayout=function(e,t){const i=[];let s=0,r=t[s],n=0;for(let o=0;o<e.length;o++)if(r===o){const i=t[++s];e.onDeleteEmitter.fire({index:o-n,amount:i}),o+=i-1,n+=i,r=t[++s]}else i.push(o);return{layout:i,countRemoved:n}},t.reflowLargerApplyNewLayout=function(e,t){const i=[];for(let s=0;s<t.length;s++)i.push(e.get(t[s]));for(let t=0;t<i.length;t++)e.set(t,i[t]);e.length=t.length},t.reflowSmallerGetNewLineLengths=function(e,t,s){const r=[],n=e.map(((s,r)=>i(e,r,t))).reduce(((e,t)=>e+t));let o=0,a=0,h=0;for(;h<n;){if(n-h<s){r.push(n-h);break}o+=s;const c=i(e,a,t);o>c&&(o-=c,a++);const l=2===e[a].getWidth(o-1);l&&o--;const d=l?s-1:s;r.push(d),h+=d}return r},t.getWrappedLineTrimmedLength=i},5295:(e,t,i)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.BufferSet=void 0;const s=i(8460),r=i(844),n=i(9092);class o extends r.Disposable{constructor(e,t){super(),this._optionsService=e,this._bufferService=t,this._onBufferActivate=this.register(new s.EventEmitter),this.onBufferActivate=this._onBufferActivate.event,this.reset(),this.register(this._optionsService.onSpecificOptionChange("scrollback",(()=>this.resize(this._bufferService.cols,this._bufferService.rows)))),this.register(this._optionsService.onSpecificOptionChange("tabStopWidth",(()=>this.setupTabStops())))}reset(){this._normal=new n.Buffer(!0,this._optionsService,this._bufferService),this._normal.fillViewportRows(),this._alt=new n.Buffer(!1,this._optionsService,this._bufferService),this._activeBuffer=this._normal,this._onBufferActivate.fire({activeBuffer:this._normal,inactiveBuffer:this._alt}),this.setupTabStops()}get alt(){return this._alt}get active(){return this._activeBuffer}get normal(){return this._normal}activateNormalBuffer(){this._activeBuffer!==this._normal&&(this._normal.x=this._alt.x,this._normal.y=this._alt.y,this._alt.clearAllMarkers(),this._alt.clear(),this._activeBuffer=this._normal,this._onBufferActivate.fire({activeBuffer:this._normal,inactiveBuffer:this._alt}))}activateAltBuffer(e){this._activeBuffer!==this._alt&&(this._alt.fillViewportRows(e),this._alt.x=this._normal.x,this._alt.y=this._normal.y,this._activeBuffer=this._alt,this._onBufferActivate.fire({activeBuffer:this._alt,inactiveBuffer:this._normal}))}resize(e,t){this._normal.resize(e,t),this._alt.resize(e,t),this.setupTabStops(e)}setupTabStops(e){this._normal.setupTabStops(e),this._alt.setupTabStops(e)}}t.BufferSet=o},511:(e,t,i)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.CellData=void 0;const s=i(482),r=i(643),n=i(3734);class o extends n.AttributeData{constructor(){super(...arguments),this.content=0,this.fg=0,this.bg=0,this.extended=new n.ExtendedAttrs,this.combinedData=""}static fromCharData(e){const t=new o;return t.setFromCharData(e),t}isCombined(){return 2097152&this.content}getWidth(){return this.content>>22}getChars(){return 2097152&this.content?this.combinedData:2097151&this.content?(0,s.stringFromCodePoint)(2097151&this.content):""}getCode(){return this.isCombined()?this.combinedData.charCodeAt(this.combinedData.length-1):2097151&this.content}setFromCharData(e){this.fg=e[r.CHAR_DATA_ATTR_INDEX],this.bg=0;let t=!1;if(e[r.CHAR_DATA_CHAR_INDEX].length>2)t=!0;else if(2===e[r.CHAR_DATA_CHAR_INDEX].length){const i=e[r.CHAR_DATA_CHAR_INDEX].charCodeAt(0);if(55296<=i&&i<=56319){const s=e[r.CHAR_DATA_CHAR_INDEX].charCodeAt(1);56320<=s&&s<=57343?this.content=1024*(i-55296)+s-56320+65536|e[r.CHAR_DATA_WIDTH_INDEX]<<22:t=!0}else t=!0}else this.content=e[r.CHAR_DATA_CHAR_INDEX].charCodeAt(0)|e[r.CHAR_DATA_WIDTH_INDEX]<<22;t&&(this.combinedData=e[r.CHAR_DATA_CHAR_INDEX],this.content=2097152|e[r.CHAR_DATA_WIDTH_INDEX]<<22)}getAsCharData(){return[this.fg,this.getChars(),this.getWidth(),this.getCode()]}}t.CellData=o},643:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.WHITESPACE_CELL_CODE=t.WHITESPACE_CELL_WIDTH=t.WHITESPACE_CELL_CHAR=t.NULL_CELL_CODE=t.NULL_CELL_WIDTH=t.NULL_CELL_CHAR=t.CHAR_DATA_CODE_INDEX=t.CHAR_DATA_WIDTH_INDEX=t.CHAR_DATA_CHAR_INDEX=t.CHAR_DATA_ATTR_INDEX=t.DEFAULT_EXT=t.DEFAULT_ATTR=t.DEFAULT_COLOR=void 0,t.DEFAULT_COLOR=0,t.DEFAULT_ATTR=256|t.DEFAULT_COLOR<<9,t.DEFAULT_EXT=0,t.CHAR_DATA_ATTR_INDEX=0,t.CHAR_DATA_CHAR_INDEX=1,t.CHAR_DATA_WIDTH_INDEX=2,t.CHAR_DATA_CODE_INDEX=3,t.NULL_CELL_CHAR="",t.NULL_CELL_WIDTH=1,t.NULL_CELL_CODE=0,t.WHITESPACE_CELL_CHAR=" ",t.WHITESPACE_CELL_WIDTH=1,t.WHITESPACE_CELL_CODE=32},4863:(e,t,i)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.Marker=void 0;const s=i(8460),r=i(844);class n{get id(){return this._id}constructor(e){this.line=e,this.isDisposed=!1,this._disposables=[],this._id=n._nextId++,this._onDispose=this.register(new s.EventEmitter),this.onDispose=this._onDispose.event}dispose(){this.isDisposed||(this.isDisposed=!0,this.line=-1,this._onDispose.fire(),(0,r.disposeArray)(this._disposables),this._disposables.length=0)}register(e){return this._disposables.push(e),e}}t.Marker=n,n._nextId=1},7116:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.DEFAULT_CHARSET=t.CHARSETS=void 0,t.CHARSETS={},t.DEFAULT_CHARSET=t.CHARSETS.B,t.CHARSETS[0]={"`":"◆",a:"▒",b:"␉",c:"␌",d:"␍",e:"␊",f:"°",g:"±",h:"␤",i:"␋",j:"┘",k:"┐",l:"┌",m:"└",n:"┼",o:"⎺",p:"⎻",q:"─",r:"⎼",s:"⎽",t:"├",u:"┤",v:"┴",w:"┬",x:"│",y:"≤",z:"≥","{":"π","|":"≠","}":"£","~":"·"},t.CHARSETS.A={"#":"£"},t.CHARSETS.B=void 0,t.CHARSETS[4]={"#":"£","@":"¾","[":"ij","\\":"½","]":"|","{":"¨","|":"f","}":"¼","~":"´"},t.CHARSETS.C=t.CHARSETS[5]={"[":"Ä","\\":"Ö","]":"Å","^":"Ü","`":"é","{":"ä","|":"ö","}":"å","~":"ü"},t.CHARSETS.R={"#":"£","@":"à","[":"°","\\":"ç","]":"§","{":"é","|":"ù","}":"è","~":"¨"},t.CHARSETS.Q={"@":"à","[":"â","\\":"ç","]":"ê","^":"î","`":"ô","{":"é","|":"ù","}":"è","~":"û"},t.CHARSETS.K={"@":"§","[":"Ä","\\":"Ö","]":"Ü","{":"ä","|":"ö","}":"ü","~":"ß"},t.CHARSETS.Y={"#":"£","@":"§","[":"°","\\":"ç","]":"é","`":"ù","{":"à","|":"ò","}":"è","~":"ì"},t.CHARSETS.E=t.CHARSETS[6]={"@":"Ä","[":"Æ","\\":"Ø","]":"Å","^":"Ü","`":"ä","{":"æ","|":"ø","}":"å","~":"ü"},t.CHARSETS.Z={"#":"£","@":"§","[":"¡","\\":"Ñ","]":"¿","{":"°","|":"ñ","}":"ç"},t.CHARSETS.H=t.CHARSETS[7]={"@":"É","[":"Ä","\\":"Ö","]":"Å","^":"Ü","`":"é","{":"ä","|":"ö","}":"å","~":"ü"},t.CHARSETS["="]={"#":"ù","@":"à","[":"é","\\":"ç","]":"ê","^":"î",_:"è","`":"ô","{":"ä","|":"ö","}":"ü","~":"û"}},2584:(e,t)=>{var i,s,r;Object.defineProperty(t,"__esModule",{value:!0}),t.C1_ESCAPED=t.C1=t.C0=void 0,function(e){e.NUL="\0",e.SOH="",e.STX="",e.ETX="",e.EOT="",e.ENQ="",e.ACK="",e.BEL="",e.BS="\b",e.HT="\t",e.LF="\n",e.VT="\v",e.FF="\f",e.CR="\r",e.SO="",e.SI="",e.DLE="",e.DC1="",e.DC2="",e.DC3="",e.DC4="",e.NAK="",e.SYN="",e.ETB="",e.CAN="",e.EM="",e.SUB="",e.ESC="",e.FS="",e.GS="",e.RS="",e.US="",e.SP=" ",e.DEL=""}(i||(t.C0=i={})),function(e){e.PAD="",e.HOP="",e.BPH="",e.NBH="",e.IND="",e.NEL="",e.SSA="",e.ESA="",e.HTS="",e.HTJ="",e.VTS="",e.PLD="",e.PLU="",e.RI="",e.SS2="",e.SS3="",e.DCS="",e.PU1="",e.PU2="",e.STS="",e.CCH="",e.MW="",e.SPA="",e.EPA="",e.SOS="",e.SGCI="",e.SCI="",e.CSI="",e.ST="",e.OSC="",e.PM="",e.APC=""}(s||(t.C1=s={})),function(e){e.ST=`${i.ESC}\\`}(r||(t.C1_ESCAPED=r={}))},7399:(e,t,i)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.evaluateKeyboardEvent=void 0;const s=i(2584),r={48:["0",")"],49:["1","!"],50:["2","@"],51:["3","#"],52:["4","$"],53:["5","%"],54:["6","^"],55:["7","&"],56:["8","*"],57:["9","("],186:[";",":"],187:["=","+"],188:[",","<"],189:["-","_"],190:[".",">"],191:["/","?"],192:["`","~"],219:["[","{"],220:["\\","|"],221:["]","}"],222:["'",'"']};t.evaluateKeyboardEvent=function(e,t,i,n){const o={type:0,cancel:!1,key:void 0},a=(e.shiftKey?1:0)|(e.altKey?2:0)|(e.ctrlKey?4:0)|(e.metaKey?8:0);switch(e.keyCode){case 0:"UIKeyInputUpArrow"===e.key?o.key=t?s.C0.ESC+"OA":s.C0.ESC+"[A":"UIKeyInputLeftArrow"===e.key?o.key=t?s.C0.ESC+"OD":s.C0.ESC+"[D":"UIKeyInputRightArrow"===e.key?o.key=t?s.C0.ESC+"OC":s.C0.ESC+"[C":"UIKeyInputDownArrow"===e.key&&(o.key=t?s.C0.ESC+"OB":s.C0.ESC+"[B");break;case 8:o.key=e.ctrlKey?"\b":s.C0.DEL,e.altKey&&(o.key=s.C0.ESC+o.key);break;case 9:if(e.shiftKey){o.key=s.C0.ESC+"[Z";break}o.key=s.C0.HT,o.cancel=!0;break;case 13:o.key=e.altKey?s.C0.ESC+s.C0.CR:s.C0.CR,o.cancel=!0;break;case 27:o.key=s.C0.ESC,e.altKey&&(o.key=s.C0.ESC+s.C0.ESC),o.cancel=!0;break;case 37:if(e.metaKey)break;a?(o.key=s.C0.ESC+"[1;"+(a+1)+"D",o.key===s.C0.ESC+"[1;3D"&&(o.key=s.C0.ESC+(i?"b":"[1;5D"))):o.key=t?s.C0.ESC+"OD":s.C0.ESC+"[D";break;case 39:if(e.metaKey)break;a?(o.key=s.C0.ESC+"[1;"+(a+1)+"C",o.key===s.C0.ESC+"[1;3C"&&(o.key=s.C0.ESC+(i?"f":"[1;5C"))):o.key=t?s.C0.ESC+"OC":s.C0.ESC+"[C";break;case 38:if(e.metaKey)break;a?(o.key=s.C0.ESC+"[1;"+(a+1)+"A",i||o.key!==s.C0.ESC+"[1;3A"||(o.key=s.C0.ESC+"[1;5A")):o.key=t?s.C0.ESC+"OA":s.C0.ESC+"[A";break;case 40:if(e.metaKey)break;a?(o.key=s.C0.ESC+"[1;"+(a+1)+"B",i||o.key!==s.C0.ESC+"[1;3B"||(o.key=s.C0.ESC+"[1;5B")):o.key=t?s.C0.ESC+"OB":s.C0.ESC+"[B";break;case 45:e.shiftKey||e.ctrlKey||(o.key=s.C0.ESC+"[2~");break;case 46:o.key=a?s.C0.ESC+"[3;"+(a+1)+"~":s.C0.ESC+"[3~";break;case 36:o.key=a?s.C0.ESC+"[1;"+(a+1)+"H":t?s.C0.ESC+"OH":s.C0.ESC+"[H";break;case 35:o.key=a?s.C0.ESC+"[1;"+(a+1)+"F":t?s.C0.ESC+"OF":s.C0.ESC+"[F";break;case 33:e.shiftKey?o.type=2:e.ctrlKey?o.key=s.C0.ESC+"[5;"+(a+1)+"~":o.key=s.C0.ESC+"[5~";break;case 34:e.shiftKey?o.type=3:e.ctrlKey?o.key=s.C0.ESC+"[6;"+(a+1)+"~":o.key=s.C0.ESC+"[6~";break;case 112:o.key=a?s.C0.ESC+"[1;"+(a+1)+"P":s.C0.ESC+"OP";break;case 113:o.key=a?s.C0.ESC+"[1;"+(a+1)+"Q":s.C0.ESC+"OQ";break;case 114:o.key=a?s.C0.ESC+"[1;"+(a+1)+"R":s.C0.ESC+"OR";break;case 115:o.key=a?s.C0.ESC+"[1;"+(a+1)+"S":s.C0.ESC+"OS";break;case 116:o.key=a?s.C0.ESC+"[15;"+(a+1)+"~":s.C0.ESC+"[15~";break;case 117:o.key=a?s.C0.ESC+"[17;"+(a+1)+"~":s.C0.ESC+"[17~";break;case 118:o.key=a?s.C0.ESC+"[18;"+(a+1)+"~":s.C0.ESC+"[18~";break;case 119:o.key=a?s.C0.ESC+"[19;"+(a+1)+"~":s.C0.ESC+"[19~";break;case 120:o.key=a?s.C0.ESC+"[20;"+(a+1)+"~":s.C0.ESC+"[20~";break;case 121:o.key=a?s.C0.ESC+"[21;"+(a+1)+"~":s.C0.ESC+"[21~";break;case 122:o.key=a?s.C0.ESC+"[23;"+(a+1)+"~":s.C0.ESC+"[23~";break;case 123:o.key=a?s.C0.ESC+"[24;"+(a+1)+"~":s.C0.ESC+"[24~";break;default:if(!e.ctrlKey||e.shiftKey||e.altKey||e.metaKey)if(i&&!n||!e.altKey||e.metaKey)!i||e.altKey||e.ctrlKey||e.shiftKey||!e.metaKey?e.key&&!e.ctrlKey&&!e.altKey&&!e.metaKey&&e.keyCode>=48&&1===e.key.length?o.key=e.key:e.key&&e.ctrlKey&&("_"===e.key&&(o.key=s.C0.US),"@"===e.key&&(o.key=s.C0.NUL)):65===e.keyCode&&(o.type=1);else{const t=r[e.keyCode],i=t?.[e.shiftKey?1:0];if(i)o.key=s.C0.ESC+i;else if(e.keyCode>=65&&e.keyCode<=90){const t=e.ctrlKey?e.keyCode-64:e.keyCode+32;let i=String.fromCharCode(t);e.shiftKey&&(i=i.toUpperCase()),o.key=s.C0.ESC+i}else if(32===e.keyCode)o.key=s.C0.ESC+(e.ctrlKey?s.C0.NUL:" ");else if("Dead"===e.key&&e.code.startsWith("Key")){let t=e.code.slice(3,4);e.shiftKey||(t=t.toLowerCase()),o.key=s.C0.ESC+t,o.cancel=!0}}else e.keyCode>=65&&e.keyCode<=90?o.key=String.fromCharCode(e.keyCode-64):32===e.keyCode?o.key=s.C0.NUL:e.keyCode>=51&&e.keyCode<=55?o.key=String.fromCharCode(e.keyCode-51+27):56===e.keyCode?o.key=s.C0.DEL:219===e.keyCode?o.key=s.C0.ESC:220===e.keyCode?o.key=s.C0.FS:221===e.keyCode&&(o.key=s.C0.GS)}return o}},482:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.Utf8ToUtf32=t.StringToUtf32=t.utf32ToString=t.stringFromCodePoint=void 0,t.stringFromCodePoint=function(e){return e>65535?(e-=65536,String.fromCharCode(55296+(e>>10))+String.fromCharCode(e%1024+56320)):String.fromCharCode(e)},t.utf32ToString=function(e,t=0,i=e.length){let s="";for(let r=t;r<i;++r){let t=e[r];t>65535?(t-=65536,s+=String.fromCharCode(55296+(t>>10))+String.fromCharCode(t%1024+56320)):s+=String.fromCharCode(t)}return s},t.StringToUtf32=class{constructor(){this._interim=0}clear(){this._interim=0}decode(e,t){const i=e.length;if(!i)return 0;let s=0,r=0;if(this._interim){const i=e.charCodeAt(r++);56320<=i&&i<=57343?t[s++]=1024*(this._interim-55296)+i-56320+65536:(t[s++]=this._interim,t[s++]=i),this._interim=0}for(let n=r;n<i;++n){const r=e.charCodeAt(n);if(55296<=r&&r<=56319){if(++n>=i)return this._interim=r,s;const o=e.charCodeAt(n);56320<=o&&o<=57343?t[s++]=1024*(r-55296)+o-56320+65536:(t[s++]=r,t[s++]=o)}else 65279!==r&&(t[s++]=r)}return s}},t.Utf8ToUtf32=class{constructor(){this.interim=new Uint8Array(3)}clear(){this.interim.fill(0)}decode(e,t){const i=e.length;if(!i)return 0;let s,r,n,o,a=0,h=0,c=0;if(this.interim[0]){let s=!1,r=this.interim[0];r&=192==(224&r)?31:224==(240&r)?15:7;let n,o=0;for(;(n=63&this.interim[++o])&&o<4;)r<<=6,r|=n;const h=192==(224&this.interim[0])?2:224==(240&this.interim[0])?3:4,l=h-o;for(;c<l;){if(c>=i)return 0;if(n=e[c++],128!=(192&n)){c--,s=!0;break}this.interim[o++]=n,r<<=6,r|=63&n}s||(2===h?r<128?c--:t[a++]=r:3===h?r<2048||r>=55296&&r<=57343||65279===r||(t[a++]=r):r<65536||r>1114111||(t[a++]=r)),this.interim.fill(0)}const l=i-4;let d=c;for(;d<i;){for(;!(!(d<l)||128&(s=e[d])||128&(r=e[d+1])||128&(n=e[d+2])||128&(o=e[d+3]));)t[a++]=s,t[a++]=r,t[a++]=n,t[a++]=o,d+=4;if(s=e[d++],s<128)t[a++]=s;else if(192==(224&s)){if(d>=i)return this.interim[0]=s,a;if(r=e[d++],128!=(192&r)){d--;continue}if(h=(31&s)<<6|63&r,h<128){d--;continue}t[a++]=h}else if(224==(240&s)){if(d>=i)return this.interim[0]=s,a;if(r=e[d++],128!=(192&r)){d--;continue}if(d>=i)return this.interim[0]=s,this.interim[1]=r,a;if(n=e[d++],128!=(192&n)){d--;continue}if(h=(15&s)<<12|(63&r)<<6|63&n,h<2048||h>=55296&&h<=57343||65279===h)continue;t[a++]=h}else if(240==(248&s)){if(d>=i)return this.interim[0]=s,a;if(r=e[d++],128!=(192&r)){d--;continue}if(d>=i)return this.interim[0]=s,this.interim[1]=r,a;if(n=e[d++],128!=(192&n)){d--;continue}if(d>=i)return this.interim[0]=s,this.interim[1]=r,this.interim[2]=n,a;if(o=e[d++],128!=(192&o)){d--;continue}if(h=(7&s)<<18|(63&r)<<12|(63&n)<<6|63&o,h<65536||h>1114111)continue;t[a++]=h}}return a}}},225:(e,t,i)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.UnicodeV6=void 0;const s=i(1480),r=[[768,879],[1155,1158],[1160,1161],[1425,1469],[1471,1471],[1473,1474],[1476,1477],[1479,1479],[1536,1539],[1552,1557],[1611,1630],[1648,1648],[1750,1764],[1767,1768],[1770,1773],[1807,1807],[1809,1809],[1840,1866],[1958,1968],[2027,2035],[2305,2306],[2364,2364],[2369,2376],[2381,2381],[2385,2388],[2402,2403],[2433,2433],[2492,2492],[2497,2500],[2509,2509],[2530,2531],[2561,2562],[2620,2620],[2625,2626],[2631,2632],[2635,2637],[2672,2673],[2689,2690],[2748,2748],[2753,2757],[2759,2760],[2765,2765],[2786,2787],[2817,2817],[2876,2876],[2879,2879],[2881,2883],[2893,2893],[2902,2902],[2946,2946],[3008,3008],[3021,3021],[3134,3136],[3142,3144],[3146,3149],[3157,3158],[3260,3260],[3263,3263],[3270,3270],[3276,3277],[3298,3299],[3393,3395],[3405,3405],[3530,3530],[3538,3540],[3542,3542],[3633,3633],[3636,3642],[3655,3662],[3761,3761],[3764,3769],[3771,3772],[3784,3789],[3864,3865],[3893,3893],[3895,3895],[3897,3897],[3953,3966],[3968,3972],[3974,3975],[3984,3991],[3993,4028],[4038,4038],[4141,4144],[4146,4146],[4150,4151],[4153,4153],[4184,4185],[4448,4607],[4959,4959],[5906,5908],[5938,5940],[5970,5971],[6002,6003],[6068,6069],[6071,6077],[6086,6086],[6089,6099],[6109,6109],[6155,6157],[6313,6313],[6432,6434],[6439,6440],[6450,6450],[6457,6459],[6679,6680],[6912,6915],[6964,6964],[6966,6970],[6972,6972],[6978,6978],[7019,7027],[7616,7626],[7678,7679],[8203,8207],[8234,8238],[8288,8291],[8298,8303],[8400,8431],[12330,12335],[12441,12442],[43014,43014],[43019,43019],[43045,43046],[64286,64286],[65024,65039],[65056,65059],[65279,65279],[65529,65531]],n=[[68097,68099],[68101,68102],[68108,68111],[68152,68154],[68159,68159],[119143,119145],[119155,119170],[119173,119179],[119210,119213],[119362,119364],[917505,917505],[917536,917631],[917760,917999]];let o;t.UnicodeV6=class{constructor(){if(this.version="6",!o){o=new Uint8Array(65536),o.fill(1),o[0]=0,o.fill(0,1,32),o.fill(0,127,160),o.fill(2,4352,4448),o[9001]=2,o[9002]=2,o.fill(2,11904,42192),o[12351]=1,o.fill(2,44032,55204),o.fill(2,63744,64256),o.fill(2,65040,65050),o.fill(2,65072,65136),o.fill(2,65280,65377),o.fill(2,65504,65511);for(let e=0;e<r.length;++e)o.fill(0,r[e][0],r[e][1]+1)}}wcwidth(e){return e<32?0:e<127?1:e<65536?o[e]:function(e,t){let i,s=0,r=t.length-1;if(e<t[0][0]||e>t[r][1])return!1;for(;r>=s;)if(i=s+r>>1,e>t[i][1])s=i+1;else{if(!(e<t[i][0]))return!0;r=i-1}return!1}(e,n)?0:e>=131072&&e<=196605||e>=196608&&e<=262141?2:1}charProperties(e,t){let i=this.wcwidth(e),r=0===i&&0!==t;if(r){const e=s.UnicodeService.extractWidth(t);0===e?r=!1:e>i&&(i=e)}return s.UnicodeService.createPropertyValue(0,i,r)}}},5981:(e,t,i)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.WriteBuffer=void 0;const s=i(8460),r=i(844);class n extends r.Disposable{constructor(e){super(),this._action=e,this._writeBuffer=[],this._callbacks=[],this._pendingData=0,this._bufferOffset=0,this._isSyncWriting=!1,this._syncCalls=0,this._didUserInput=!1,this._onWriteParsed=this.register(new s.EventEmitter),this.onWriteParsed=this._onWriteParsed.event}handleUserInput(){this._didUserInput=!0}writeSync(e,t){if(void 0!==t&&this._syncCalls>t)return void(this._syncCalls=0);if(this._pendingData+=e.length,this._writeBuffer.push(e),this._callbacks.push(void 0),this._syncCalls++,this._isSyncWriting)return;let i;for(this._isSyncWriting=!0;i=this._writeBuffer.shift();){this._action(i);const e=this._callbacks.shift();e&&e()}this._pendingData=0,this._bufferOffset=2147483647,this._isSyncWriting=!1,this._syncCalls=0}write(e,t){if(this._pendingData>5e7)throw new Error("write data discarded, use flow control to avoid losing data");if(!this._writeBuffer.length){if(this._bufferOffset=0,this._didUserInput)return this._didUserInput=!1,this._pendingData+=e.length,this._writeBuffer.push(e),this._callbacks.push(t),void this._innerWrite();setTimeout((()=>this._innerWrite()))}this._pendingData+=e.length,this._writeBuffer.push(e),this._callbacks.push(t)}_innerWrite(e=0,t=!0){const i=e||Date.now();for(;this._writeBuffer.length>this._bufferOffset;){const e=this._writeBuffer[this._bufferOffset],s=this._action(e,t);if(s){const e=e=>Date.now()-i>=12?setTimeout((()=>this._innerWrite(0,e))):this._innerWrite(i,e);return void s.catch((e=>(queueMicrotask((()=>{throw e})),Promise.resolve(!1)))).then(e)}const r=this._callbacks[this._bufferOffset];if(r&&r(),this._bufferOffset++,this._pendingData-=e.length,Date.now()-i>=12)break}this._writeBuffer.length>this._bufferOffset?(this._bufferOffset>50&&(this._writeBuffer=this._writeBuffer.slice(this._bufferOffset),this._callbacks=this._callbacks.slice(this._bufferOffset),this._bufferOffset=0),setTimeout((()=>this._innerWrite()))):(this._writeBuffer.length=0,this._callbacks.length=0,this._pendingData=0,this._bufferOffset=0),this._onWriteParsed.fire()}}t.WriteBuffer=n},5941:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.toRgbString=t.parseColor=void 0;const i=/^([\da-f])\/([\da-f])\/([\da-f])$|^([\da-f]{2})\/([\da-f]{2})\/([\da-f]{2})$|^([\da-f]{3})\/([\da-f]{3})\/([\da-f]{3})$|^([\da-f]{4})\/([\da-f]{4})\/([\da-f]{4})$/,s=/^[\da-f]+$/;function r(e,t){const i=e.toString(16),s=i.length<2?"0"+i:i;switch(t){case 4:return i[0];case 8:return s;case 12:return(s+s).slice(0,3);default:return s+s}}t.parseColor=function(e){if(!e)return;let t=e.toLowerCase();if(0===t.indexOf("rgb:")){t=t.slice(4);const e=i.exec(t);if(e){const t=e[1]?15:e[4]?255:e[7]?4095:65535;return[Math.round(parseInt(e[1]||e[4]||e[7]||e[10],16)/t*255),Math.round(parseInt(e[2]||e[5]||e[8]||e[11],16)/t*255),Math.round(parseInt(e[3]||e[6]||e[9]||e[12],16)/t*255)]}}else if(0===t.indexOf("#")&&(t=t.slice(1),s.exec(t)&&[3,6,9,12].includes(t.length))){const e=t.length/3,i=[0,0,0];for(let s=0;s<3;++s){const r=parseInt(t.slice(e*s,e*s+e),16);i[s]=1===e?r<<4:2===e?r:3===e?r>>4:r>>8}return i}},t.toRgbString=function(e,t=16){const[i,s,n]=e;return`rgb:${r(i,t)}/${r(s,t)}/${r(n,t)}`}},5770:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.PAYLOAD_LIMIT=void 0,t.PAYLOAD_LIMIT=1e7},6351:(e,t,i)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.DcsHandler=t.DcsParser=void 0;const s=i(482),r=i(8742),n=i(5770),o=[];t.DcsParser=class{constructor(){this._handlers=Object.create(null),this._active=o,this._ident=0,this._handlerFb=()=>{},this._stack={paused:!1,loopPosition:0,fallThrough:!1}}dispose(){this._handlers=Object.create(null),this._handlerFb=()=>{},this._active=o}registerHandler(e,t){void 0===this._handlers[e]&&(this._handlers[e]=[]);const i=this._handlers[e];return i.push(t),{dispose:()=>{const e=i.indexOf(t);-1!==e&&i.splice(e,1)}}}clearHandler(e){this._handlers[e]&&delete this._handlers[e]}setHandlerFallback(e){this._handlerFb=e}reset(){if(this._active.length)for(let e=this._stack.paused?this._stack.loopPosition-1:this._active.length-1;e>=0;--e)this._active[e].unhook(!1);this._stack.paused=!1,this._active=o,this._ident=0}hook(e,t){if(this.reset(),this._ident=e,this._active=this._handlers[e]||o,this._active.length)for(let e=this._active.length-1;e>=0;e--)this._active[e].hook(t);else this._handlerFb(this._ident,"HOOK",t)}put(e,t,i){if(this._active.length)for(let s=this._active.length-1;s>=0;s--)this._active[s].put(e,t,i);else this._handlerFb(this._ident,"PUT",(0,s.utf32ToString)(e,t,i))}unhook(e,t=!0){if(this._active.length){let i=!1,s=this._active.length-1,r=!1;if(this._stack.paused&&(s=this._stack.loopPosition-1,i=t,r=this._stack.fallThrough,this._stack.paused=!1),!r&&!1===i){for(;s>=0&&(i=this._active[s].unhook(e),!0!==i);s--)if(i instanceof Promise)return this._stack.paused=!0,this._stack.loopPosition=s,this._stack.fallThrough=!1,i;s--}for(;s>=0;s--)if(i=this._active[s].unhook(!1),i instanceof Promise)return this._stack.paused=!0,this._stack.loopPosition=s,this._stack.fallThrough=!0,i}else this._handlerFb(this._ident,"UNHOOK",e);this._active=o,this._ident=0}};const a=new r.Params;a.addParam(0),t.DcsHandler=class{constructor(e){this._handler=e,this._data="",this._params=a,this._hitLimit=!1}hook(e){this._params=e.length>1||e.params[0]?e.clone():a,this._data="",this._hitLimit=!1}put(e,t,i){this._hitLimit||(this._data+=(0,s.utf32ToString)(e,t,i),this._data.length>n.PAYLOAD_LIMIT&&(this._data="",this._hitLimit=!0))}unhook(e){let t=!1;if(this._hitLimit)t=!1;else if(e&&(t=this._handler(this._data,this._params),t instanceof Promise))return t.then((e=>(this._params=a,this._data="",this._hitLimit=!1,e)));return this._params=a,this._data="",this._hitLimit=!1,t}}},2015:(e,t,i)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.EscapeSequenceParser=t.VT500_TRANSITION_TABLE=t.TransitionTable=void 0;const s=i(844),r=i(8742),n=i(6242),o=i(6351);class a{constructor(e){this.table=new Uint8Array(e)}setDefault(e,t){this.table.fill(e<<4|t)}add(e,t,i,s){this.table[t<<8|e]=i<<4|s}addMany(e,t,i,s){for(let r=0;r<e.length;r++)this.table[t<<8|e[r]]=i<<4|s}}t.TransitionTable=a;const h=160;t.VT500_TRANSITION_TABLE=function(){const e=new a(4095),t=Array.apply(null,Array(256)).map(((e,t)=>t)),i=(e,i)=>t.slice(e,i),s=i(32,127),r=i(0,24);r.push(25),r.push.apply(r,i(28,32));const n=i(0,14);let o;for(o in e.setDefault(1,0),e.addMany(s,0,2,0),n)e.addMany([24,26,153,154],o,3,0),e.addMany(i(128,144),o,3,0),e.addMany(i(144,152),o,3,0),e.add(156,o,0,0),e.add(27,o,11,1),e.add(157,o,4,8),e.addMany([152,158,159],o,0,7),e.add(155,o,11,3),e.add(144,o,11,9);return e.addMany(r,0,3,0),e.addMany(r,1,3,1),e.add(127,1,0,1),e.addMany(r,8,0,8),e.addMany(r,3,3,3),e.add(127,3,0,3),e.addMany(r,4,3,4),e.add(127,4,0,4),e.addMany(r,6,3,6),e.addMany(r,5,3,5),e.add(127,5,0,5),e.addMany(r,2,3,2),e.add(127,2,0,2),e.add(93,1,4,8),e.addMany(s,8,5,8),e.add(127,8,5,8),e.addMany([156,27,24,26,7],8,6,0),e.addMany(i(28,32),8,0,8),e.addMany([88,94,95],1,0,7),e.addMany(s,7,0,7),e.addMany(r,7,0,7),e.add(156,7,0,0),e.add(127,7,0,7),e.add(91,1,11,3),e.addMany(i(64,127),3,7,0),e.addMany(i(48,60),3,8,4),e.addMany([60,61,62,63],3,9,4),e.addMany(i(48,60),4,8,4),e.addMany(i(64,127),4,7,0),e.addMany([60,61,62,63],4,0,6),e.addMany(i(32,64),6,0,6),e.add(127,6,0,6),e.addMany(i(64,127),6,0,0),e.addMany(i(32,48),3,9,5),e.addMany(i(32,48),5,9,5),e.addMany(i(48,64),5,0,6),e.addMany(i(64,127),5,7,0),e.addMany(i(32,48),4,9,5),e.addMany(i(32,48),1,9,2),e.addMany(i(32,48),2,9,2),e.addMany(i(48,127),2,10,0),e.addMany(i(48,80),1,10,0),e.addMany(i(81,88),1,10,0),e.addMany([89,90,92],1,10,0),e.addMany(i(96,127),1,10,0),e.add(80,1,11,9),e.addMany(r,9,0,9),e.add(127,9,0,9),e.addMany(i(28,32),9,0,9),e.addMany(i(32,48),9,9,12),e.addMany(i(48,60),9,8,10),e.addMany([60,61,62,63],9,9,10),e.addMany(r,11,0,11),e.addMany(i(32,128),11,0,11),e.addMany(i(28,32),11,0,11),e.addMany(r,10,0,10),e.add(127,10,0,10),e.addMany(i(28,32),10,0,10),e.addMany(i(48,60),10,8,10),e.addMany([60,61,62,63],10,0,11),e.addMany(i(32,48),10,9,12),e.addMany(r,12,0,12),e.add(127,12,0,12),e.addMany(i(28,32),12,0,12),e.addMany(i(32,48),12,9,12),e.addMany(i(48,64),12,0,11),e.addMany(i(64,127),12,12,13),e.addMany(i(64,127),10,12,13),e.addMany(i(64,127),9,12,13),e.addMany(r,13,13,13),e.addMany(s,13,13,13),e.add(127,13,0,13),e.addMany([27,156,24,26],13,14,0),e.add(h,0,2,0),e.add(h,8,5,8),e.add(h,6,0,6),e.add(h,11,0,11),e.add(h,13,13,13),e}();class c extends s.Disposable{constructor(e=t.VT500_TRANSITION_TABLE){super(),this._transitions=e,this._parseStack={state:0,handlers:[],handlerPos:0,transition:0,chunkPos:0},this.initialState=0,this.currentState=this.initialState,this._params=new r.Params,this._params.addParam(0),this._collect=0,this.precedingJoinState=0,this._printHandlerFb=(e,t,i)=>{},this._executeHandlerFb=e=>{},this._csiHandlerFb=(e,t)=>{},this._escHandlerFb=e=>{},this._errorHandlerFb=e=>e,this._printHandler=this._printHandlerFb,this._executeHandlers=Object.create(null),this._csiHandlers=Object.create(null),this._escHandlers=Object.create(null),this.register((0,s.toDisposable)((()=>{this._csiHandlers=Object.create(null),this._executeHandlers=Object.create(null),this._escHandlers=Object.create(null)}))),this._oscParser=this.register(new n.OscParser),this._dcsParser=this.register(new o.DcsParser),this._errorHandler=this._errorHandlerFb,this.registerEscHandler({final:"\\"},(()=>!0))}_identifier(e,t=[64,126]){let i=0;if(e.prefix){if(e.prefix.length>1)throw new Error("only one byte as prefix supported");if(i=e.prefix.charCodeAt(0),i&&60>i||i>63)throw new Error("prefix must be in range 0x3c .. 0x3f")}if(e.intermediates){if(e.intermediates.length>2)throw new Error("only two bytes as intermediates are supported");for(let t=0;t<e.intermediates.length;++t){const s=e.intermediates.charCodeAt(t);if(32>s||s>47)throw new Error("intermediate must be in range 0x20 .. 0x2f");i<<=8,i|=s}}if(1!==e.final.length)throw new Error("final must be a single byte");const s=e.final.charCodeAt(0);if(t[0]>s||s>t[1])throw new Error(`final must be in range ${t[0]} .. ${t[1]}`);return i<<=8,i|=s,i}identToString(e){const t=[];for(;e;)t.push(String.fromCharCode(255&e)),e>>=8;return t.reverse().join("")}setPrintHandler(e){this._printHandler=e}clearPrintHandler(){this._printHandler=this._printHandlerFb}registerEscHandler(e,t){const i=this._identifier(e,[48,126]);void 0===this._escHandlers[i]&&(this._escHandlers[i]=[]);const s=this._escHandlers[i];return s.push(t),{dispose:()=>{const e=s.indexOf(t);-1!==e&&s.splice(e,1)}}}clearEscHandler(e){this._escHandlers[this._identifier(e,[48,126])]&&delete this._escHandlers[this._identifier(e,[48,126])]}setEscHandlerFallback(e){this._escHandlerFb=e}setExecuteHandler(e,t){this._executeHandlers[e.charCodeAt(0)]=t}clearExecuteHandler(e){this._executeHandlers[e.charCodeAt(0)]&&delete this._executeHandlers[e.charCodeAt(0)]}setExecuteHandlerFallback(e){this._executeHandlerFb=e}registerCsiHandler(e,t){const i=this._identifier(e);void 0===this._csiHandlers[i]&&(this._csiHandlers[i]=[]);const s=this._csiHandlers[i];return s.push(t),{dispose:()=>{const e=s.indexOf(t);-1!==e&&s.splice(e,1)}}}clearCsiHandler(e){this._csiHandlers[this._identifier(e)]&&delete this._csiHandlers[this._identifier(e)]}setCsiHandlerFallback(e){this._csiHandlerFb=e}registerDcsHandler(e,t){return this._dcsParser.registerHandler(this._identifier(e),t)}clearDcsHandler(e){this._dcsParser.clearHandler(this._identifier(e))}setDcsHandlerFallback(e){this._dcsParser.setHandlerFallback(e)}registerOscHandler(e,t){return this._oscParser.registerHandler(e,t)}clearOscHandler(e){this._oscParser.clearHandler(e)}setOscHandlerFallback(e){this._oscParser.setHandlerFallback(e)}setErrorHandler(e){this._errorHandler=e}clearErrorHandler(){this._errorHandler=this._errorHandlerFb}reset(){this.currentState=this.initialState,this._oscParser.reset(),this._dcsParser.reset(),this._params.reset(),this._params.addParam(0),this._collect=0,this.precedingJoinState=0,0!==this._parseStack.state&&(this._parseStack.state=2,this._parseStack.handlers=[])}_preserveStack(e,t,i,s,r){this._parseStack.state=e,this._parseStack.handlers=t,this._parseStack.handlerPos=i,this._parseStack.transition=s,this._parseStack.chunkPos=r}parse(e,t,i){let s,r=0,n=0,o=0;if(this._parseStack.state)if(2===this._parseStack.state)this._parseStack.state=0,o=this._parseStack.chunkPos+1;else{if(void 0===i||1===this._parseStack.state)throw this._parseStack.state=1,new Error("improper continuation due to previous async handler, giving up parsing");const t=this._parseStack.handlers;let n=this._parseStack.handlerPos-1;switch(this._parseStack.state){case 3:if(!1===i&&n>-1)for(;n>=0&&(s=t[n](this._params),!0!==s);n--)if(s instanceof Promise)return this._parseStack.handlerPos=n,s;this._parseStack.handlers=[];break;case 4:if(!1===i&&n>-1)for(;n>=0&&(s=t[n](),!0!==s);n--)if(s instanceof Promise)return this._parseStack.handlerPos=n,s;this._parseStack.handlers=[];break;case 6:if(r=e[this._parseStack.chunkPos],s=this._dcsParser.unhook(24!==r&&26!==r,i),s)return s;27===r&&(this._parseStack.transition|=1),this._params.reset(),this._params.addParam(0),this._collect=0;break;case 5:if(r=e[this._parseStack.chunkPos],s=this._oscParser.end(24!==r&&26!==r,i),s)return s;27===r&&(this._parseStack.transition|=1),this._params.reset(),this._params.addParam(0),this._collect=0}this._parseStack.state=0,o=this._parseStack.chunkPos+1,this.precedingJoinState=0,this.currentState=15&this._parseStack.transition}for(let i=o;i<t;++i){switch(r=e[i],n=this._transitions.table[this.currentState<<8|(r<160?r:h)],n>>4){case 2:for(let s=i+1;;++s){if(s>=t||(r=e[s])<32||r>126&&r<h){this._printHandler(e,i,s),i=s-1;break}if(++s>=t||(r=e[s])<32||r>126&&r<h){this._printHandler(e,i,s),i=s-1;break}if(++s>=t||(r=e[s])<32||r>126&&r<h){this._printHandler(e,i,s),i=s-1;break}if(++s>=t||(r=e[s])<32||r>126&&r<h){this._printHandler(e,i,s),i=s-1;break}}break;case 3:this._executeHandlers[r]?this._executeHandlers[r]():this._executeHandlerFb(r),this.precedingJoinState=0;break;case 0:break;case 1:if(this._errorHandler({position:i,code:r,currentState:this.currentState,collect:this._collect,params:this._params,abort:!1}).abort)return;break;case 7:const o=this._csiHandlers[this._collect<<8|r];let a=o?o.length-1:-1;for(;a>=0&&(s=o[a](this._params),!0!==s);a--)if(s instanceof Promise)return this._preserveStack(3,o,a,n,i),s;a<0&&this._csiHandlerFb(this._collect<<8|r,this._params),this.precedingJoinState=0;break;case 8:do{switch(r){case 59:this._params.addParam(0);break;case 58:this._params.addSubParam(-1);break;default:this._params.addDigit(r-48)}}while(++i<t&&(r=e[i])>47&&r<60);i--;break;case 9:this._collect<<=8,this._collect|=r;break;case 10:const c=this._escHandlers[this._collect<<8|r];let l=c?c.length-1:-1;for(;l>=0&&(s=c[l](),!0!==s);l--)if(s instanceof Promise)return this._preserveStack(4,c,l,n,i),s;l<0&&this._escHandlerFb(this._collect<<8|r),this.precedingJoinState=0;break;case 11:this._params.reset(),this._params.addParam(0),this._collect=0;break;case 12:this._dcsParser.hook(this._collect<<8|r,this._params);break;case 13:for(let s=i+1;;++s)if(s>=t||24===(r=e[s])||26===r||27===r||r>127&&r<h){this._dcsParser.put(e,i,s),i=s-1;break}break;case 14:if(s=this._dcsParser.unhook(24!==r&&26!==r),s)return this._preserveStack(6,[],0,n,i),s;27===r&&(n|=1),this._params.reset(),this._params.addParam(0),this._collect=0,this.precedingJoinState=0;break;case 4:this._oscParser.start();break;case 5:for(let s=i+1;;s++)if(s>=t||(r=e[s])<32||r>127&&r<h){this._oscParser.put(e,i,s),i=s-1;break}break;case 6:if(s=this._oscParser.end(24!==r&&26!==r),s)return this._preserveStack(5,[],0,n,i),s;27===r&&(n|=1),this._params.reset(),this._params.addParam(0),this._collect=0,this.precedingJoinState=0}this.currentState=15&n}}}t.EscapeSequenceParser=c},6242:(e,t,i)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.OscHandler=t.OscParser=void 0;const s=i(5770),r=i(482),n=[];t.OscParser=class{constructor(){this._state=0,this._active=n,this._id=-1,this._handlers=Object.create(null),this._handlerFb=()=>{},this._stack={paused:!1,loopPosition:0,fallThrough:!1}}registerHandler(e,t){void 0===this._handlers[e]&&(this._handlers[e]=[]);const i=this._handlers[e];return i.push(t),{dispose:()=>{const e=i.indexOf(t);-1!==e&&i.splice(e,1)}}}clearHandler(e){this._handlers[e]&&delete this._handlers[e]}setHandlerFallback(e){this._handlerFb=e}dispose(){this._handlers=Object.create(null),this._handlerFb=()=>{},this._active=n}reset(){if(2===this._state)for(let e=this._stack.paused?this._stack.loopPosition-1:this._active.length-1;e>=0;--e)this._active[e].end(!1);this._stack.paused=!1,this._active=n,this._id=-1,this._state=0}_start(){if(this._active=this._handlers[this._id]||n,this._active.length)for(let e=this._active.length-1;e>=0;e--)this._active[e].start();else this._handlerFb(this._id,"START")}_put(e,t,i){if(this._active.length)for(let s=this._active.length-1;s>=0;s--)this._active[s].put(e,t,i);else this._handlerFb(this._id,"PUT",(0,r.utf32ToString)(e,t,i))}start(){this.reset(),this._state=1}put(e,t,i){if(3!==this._state){if(1===this._state)for(;t<i;){const i=e[t++];if(59===i){this._state=2,this._start();break}if(i<48||57<i)return void(this._state=3);-1===this._id&&(this._id=0),this._id=10*this._id+i-48}2===this._state&&i-t>0&&this._put(e,t,i)}}end(e,t=!0){if(0!==this._state){if(3!==this._state)if(1===this._state&&this._start(),this._active.length){let i=!1,s=this._active.length-1,r=!1;if(this._stack.paused&&(s=this._stack.loopPosition-1,i=t,r=this._stack.fallThrough,this._stack.paused=!1),!r&&!1===i){for(;s>=0&&(i=this._active[s].end(e),!0!==i);s--)if(i instanceof Promise)return this._stack.paused=!0,this._stack.loopPosition=s,this._stack.fallThrough=!1,i;s--}for(;s>=0;s--)if(i=this._active[s].end(!1),i instanceof Promise)return this._stack.paused=!0,this._stack.loopPosition=s,this._stack.fallThrough=!0,i}else this._handlerFb(this._id,"END",e);this._active=n,this._id=-1,this._state=0}}},t.OscHandler=class{constructor(e){this._handler=e,this._data="",this._hitLimit=!1}start(){this._data="",this._hitLimit=!1}put(e,t,i){this._hitLimit||(this._data+=(0,r.utf32ToString)(e,t,i),this._data.length>s.PAYLOAD_LIMIT&&(this._data="",this._hitLimit=!0))}end(e){let t=!1;if(this._hitLimit)t=!1;else if(e&&(t=this._handler(this._data),t instanceof Promise))return t.then((e=>(this._data="",this._hitLimit=!1,e)));return this._data="",this._hitLimit=!1,t}}},8742:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.Params=void 0;const i=2147483647;class s{static fromArray(e){const t=new s;if(!e.length)return t;for(let i=Array.isArray(e[0])?1:0;i<e.length;++i){const s=e[i];if(Array.isArray(s))for(let e=0;e<s.length;++e)t.addSubParam(s[e]);else t.addParam(s)}return t}constructor(e=32,t=32){if(this.maxLength=e,this.maxSubParamsLength=t,t>256)throw new Error("maxSubParamsLength must not be greater than 256");this.params=new Int32Array(e),this.length=0,this._subParams=new Int32Array(t),this._subParamsLength=0,this._subParamsIdx=new Uint16Array(e),this._rejectDigits=!1,this._rejectSubDigits=!1,this._digitIsSub=!1}clone(){const e=new s(this.maxLength,this.maxSubParamsLength);return e.params.set(this.params),e.length=this.length,e._subParams.set(this._subParams),e._subParamsLength=this._subParamsLength,e._subParamsIdx.set(this._subParamsIdx),e._rejectDigits=this._rejectDigits,e._rejectSubDigits=this._rejectSubDigits,e._digitIsSub=this._digitIsSub,e}toArray(){const e=[];for(let t=0;t<this.length;++t){e.push(this.params[t]);const i=this._subParamsIdx[t]>>8,s=255&this._subParamsIdx[t];s-i>0&&e.push(Array.prototype.slice.call(this._subParams,i,s))}return e}reset(){this.length=0,this._subParamsLength=0,this._rejectDigits=!1,this._rejectSubDigits=!1,this._digitIsSub=!1}addParam(e){if(this._digitIsSub=!1,this.length>=this.maxLength)this._rejectDigits=!0;else{if(e<-1)throw new Error("values lesser than -1 are not allowed");this._subParamsIdx[this.length]=this._subParamsLength<<8|this._subParamsLength,this.params[this.length++]=e>i?i:e}}addSubParam(e){if(this._digitIsSub=!0,this.length)if(this._rejectDigits||this._subParamsLength>=this.maxSubParamsLength)this._rejectSubDigits=!0;else{if(e<-1)throw new Error("values lesser than -1 are not allowed");this._subParams[this._subParamsLength++]=e>i?i:e,this._subParamsIdx[this.length-1]++}}hasSubParams(e){return(255&this._subParamsIdx[e])-(this._subParamsIdx[e]>>8)>0}getSubParams(e){const t=this._subParamsIdx[e]>>8,i=255&this._subParamsIdx[e];return i-t>0?this._subParams.subarray(t,i):null}getSubParamsAll(){const e={};for(let t=0;t<this.length;++t){const i=this._subParamsIdx[t]>>8,s=255&this._subParamsIdx[t];s-i>0&&(e[t]=this._subParams.slice(i,s))}return e}addDigit(e){let t;if(this._rejectDigits||!(t=this._digitIsSub?this._subParamsLength:this.length)||this._digitIsSub&&this._rejectSubDigits)return;const s=this._digitIsSub?this._subParams:this.params,r=s[t-1];s[t-1]=~r?Math.min(10*r+e,i):e}}t.Params=s},5741:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.AddonManager=void 0,t.AddonManager=class{constructor(){this._addons=[]}dispose(){for(let e=this._addons.length-1;e>=0;e--)this._addons[e].instance.dispose()}loadAddon(e,t){const i={instance:t,dispose:t.dispose,isDisposed:!1};this._addons.push(i),t.dispose=()=>this._wrappedAddonDispose(i),t.activate(e)}_wrappedAddonDispose(e){if(e.isDisposed)return;let t=-1;for(let i=0;i<this._addons.length;i++)if(this._addons[i]===e){t=i;break}if(-1===t)throw new Error("Could not dispose an addon that has not been loaded");e.isDisposed=!0,e.dispose.apply(e.instance),this._addons.splice(t,1)}}},8771:(e,t,i)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.BufferApiView=void 0;const s=i(3785),r=i(511);t.BufferApiView=class{constructor(e,t){this._buffer=e,this.type=t}init(e){return this._buffer=e,this}get cursorY(){return this._buffer.y}get cursorX(){return this._buffer.x}get viewportY(){return this._buffer.ydisp}get baseY(){return this._buffer.ybase}get length(){return this._buffer.lines.length}getLine(e){const t=this._buffer.lines.get(e);if(t)return new s.BufferLineApiView(t)}getNullCell(){return new r.CellData}}},3785:(e,t,i)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.BufferLineApiView=void 0;const s=i(511);t.BufferLineApiView=class{constructor(e){this._line=e}get isWrapped(){return this._line.isWrapped}get length(){return this._line.length}getCell(e,t){if(!(e<0||e>=this._line.length))return t?(this._line.loadCell(e,t),t):this._line.loadCell(e,new s.CellData)}translateToString(e,t,i){return this._line.translateToString(e,t,i)}}},8285:(e,t,i)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.BufferNamespaceApi=void 0;const s=i(8771),r=i(8460),n=i(844);class o extends n.Disposable{constructor(e){super(),this._core=e,this._onBufferChange=this.register(new r.EventEmitter),this.onBufferChange=this._onBufferChange.event,this._normal=new s.BufferApiView(this._core.buffers.normal,"normal"),this._alternate=new s.BufferApiView(this._core.buffers.alt,"alternate"),this._core.buffers.onBufferActivate((()=>this._onBufferChange.fire(this.active)))}get active(){if(this._core.buffers.active===this._core.buffers.normal)return this.normal;if(this._core.buffers.active===this._core.buffers.alt)return this.alternate;throw new Error("Active buffer is neither normal nor alternate")}get normal(){return this._normal.init(this._core.buffers.normal)}get alternate(){return this._alternate.init(this._core.buffers.alt)}}t.BufferNamespaceApi=o},7975:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.ParserApi=void 0,t.ParserApi=class{constructor(e){this._core=e}registerCsiHandler(e,t){return this._core.registerCsiHandler(e,(e=>t(e.toArray())))}addCsiHandler(e,t){return this.registerCsiHandler(e,t)}registerDcsHandler(e,t){return this._core.registerDcsHandler(e,((e,i)=>t(e,i.toArray())))}addDcsHandler(e,t){return this.registerDcsHandler(e,t)}registerEscHandler(e,t){return this._core.registerEscHandler(e,t)}addEscHandler(e,t){return this.registerEscHandler(e,t)}registerOscHandler(e,t){return this._core.registerOscHandler(e,t)}addOscHandler(e,t){return this.registerOscHandler(e,t)}}},7090:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.UnicodeApi=void 0,t.UnicodeApi=class{constructor(e){this._core=e}register(e){this._core.unicodeService.register(e)}get versions(){return this._core.unicodeService.versions}get activeVersion(){return this._core.unicodeService.activeVersion}set activeVersion(e){this._core.unicodeService.activeVersion=e}}},744:function(e,t,i){var s=this&&this.__decorate||function(e,t,i,s){var r,n=arguments.length,o=n<3?t:null===s?s=Object.getOwnPropertyDescriptor(t,i):s;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)o=Reflect.decorate(e,t,i,s);else for(var a=e.length-1;a>=0;a--)(r=e[a])&&(o=(n<3?r(o):n>3?r(t,i,o):r(t,i))||o);return n>3&&o&&Object.defineProperty(t,i,o),o},r=this&&this.__param||function(e,t){return function(i,s){t(i,s,e)}};Object.defineProperty(t,"__esModule",{value:!0}),t.BufferService=t.MINIMUM_ROWS=t.MINIMUM_COLS=void 0;const n=i(8460),o=i(844),a=i(5295),h=i(2585);t.MINIMUM_COLS=2,t.MINIMUM_ROWS=1;let c=t.BufferService=class extends o.Disposable{get buffer(){return this.buffers.active}constructor(e){super(),this.isUserScrolling=!1,this._onResize=this.register(new n.EventEmitter),this.onResize=this._onResize.event,this._onScroll=this.register(new n.EventEmitter),this.onScroll=this._onScroll.event,this.cols=Math.max(e.rawOptions.cols||0,t.MINIMUM_COLS),this.rows=Math.max(e.rawOptions.rows||0,t.MINIMUM_ROWS),this.buffers=this.register(new a.BufferSet(e,this))}resize(e,t){this.cols=e,this.rows=t,this.buffers.resize(e,t),this._onResize.fire({cols:e,rows:t})}reset(){this.buffers.reset(),this.isUserScrolling=!1}scroll(e,t=!1){const i=this.buffer;let s;s=this._cachedBlankLine,s&&s.length===this.cols&&s.getFg(0)===e.fg&&s.getBg(0)===e.bg||(s=i.getBlankLine(e,t),this._cachedBlankLine=s),s.isWrapped=t;const r=i.ybase+i.scrollTop,n=i.ybase+i.scrollBottom;if(0===i.scrollTop){const e=i.lines.isFull;n===i.lines.length-1?e?i.lines.recycle().copyFrom(s):i.lines.push(s.clone()):i.lines.splice(n+1,0,s.clone()),e?this.isUserScrolling&&(i.ydisp=Math.max(i.ydisp-1,0)):(i.ybase++,this.isUserScrolling||i.ydisp++)}else{const e=n-r+1;i.lines.shiftElements(r+1,e-1,-1),i.lines.set(n,s.clone())}this.isUserScrolling||(i.ydisp=i.ybase),this._onScroll.fire(i.ydisp)}scrollLines(e,t,i){const s=this.buffer;if(e<0){if(0===s.ydisp)return;this.isUserScrolling=!0}else e+s.ydisp>=s.ybase&&(this.isUserScrolling=!1);const r=s.ydisp;s.ydisp=Math.max(Math.min(s.ydisp+e,s.ybase),0),r!==s.ydisp&&(t||this._onScroll.fire(s.ydisp))}};t.BufferService=c=s([r(0,h.IOptionsService)],c)},7994:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.CharsetService=void 0,t.CharsetService=class{constructor(){this.glevel=0,this._charsets=[]}reset(){this.charset=void 0,this._charsets=[],this.glevel=0}setgLevel(e){this.glevel=e,this.charset=this._charsets[e]}setgCharset(e,t){this._charsets[e]=t,this.glevel===e&&(this.charset=t)}}},1753:function(e,t,i){var s=this&&this.__decorate||function(e,t,i,s){var r,n=arguments.length,o=n<3?t:null===s?s=Object.getOwnPropertyDescriptor(t,i):s;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)o=Reflect.decorate(e,t,i,s);else for(var a=e.length-1;a>=0;a--)(r=e[a])&&(o=(n<3?r(o):n>3?r(t,i,o):r(t,i))||o);return n>3&&o&&Object.defineProperty(t,i,o),o},r=this&&this.__param||function(e,t){return function(i,s){t(i,s,e)}};Object.defineProperty(t,"__esModule",{value:!0}),t.CoreMouseService=void 0;const n=i(2585),o=i(8460),a=i(844),h={NONE:{events:0,restrict:()=>!1},X10:{events:1,restrict:e=>4!==e.button&&1===e.action&&(e.ctrl=!1,e.alt=!1,e.shift=!1,!0)},VT200:{events:19,restrict:e=>32!==e.action},DRAG:{events:23,restrict:e=>32!==e.action||3!==e.button},ANY:{events:31,restrict:e=>!0}};function c(e,t){let i=(e.ctrl?16:0)|(e.shift?4:0)|(e.alt?8:0);return 4===e.button?(i|=64,i|=e.action):(i|=3&e.button,4&e.button&&(i|=64),8&e.button&&(i|=128),32===e.action?i|=32:0!==e.action||t||(i|=3)),i}const l=String.fromCharCode,d={DEFAULT:e=>{const t=[c(e,!1)+32,e.col+32,e.row+32];return t[0]>255||t[1]>255||t[2]>255?"":`[M${l(t[0])}${l(t[1])}${l(t[2])}`},SGR:e=>{const t=0===e.action&&4!==e.button?"m":"M";return`[<${c(e,!0)};${e.col};${e.row}${t}`},SGR_PIXELS:e=>{const t=0===e.action&&4!==e.button?"m":"M";return`[<${c(e,!0)};${e.x};${e.y}${t}`}};let _=t.CoreMouseService=class extends a.Disposable{constructor(e,t){super(),this._bufferService=e,this._coreService=t,this._protocols={},this._encodings={},this._activeProtocol="",this._activeEncoding="",this._lastEvent=null,this._onProtocolChange=this.register(new o.EventEmitter),this.onProtocolChange=this._onProtocolChange.event;for(const e of Object.keys(h))this.addProtocol(e,h[e]);for(const e of Object.keys(d))this.addEncoding(e,d[e]);this.reset()}addProtocol(e,t){this._protocols[e]=t}addEncoding(e,t){this._encodings[e]=t}get activeProtocol(){return this._activeProtocol}get areMouseEventsActive(){return 0!==this._protocols[this._activeProtocol].events}set activeProtocol(e){if(!this._protocols[e])throw new Error(`unknown protocol "${e}"`);this._activeProtocol=e,this._onProtocolChange.fire(this._protocols[e].events)}get activeEncoding(){return this._activeEncoding}set activeEncoding(e){if(!this._encodings[e])throw new Error(`unknown encoding "${e}"`);this._activeEncoding=e}reset(){this.activeProtocol="NONE",this.activeEncoding="DEFAULT",this._lastEvent=null}triggerMouseEvent(e){if(e.col<0||e.col>=this._bufferService.cols||e.row<0||e.row>=this._bufferService.rows)return!1;if(4===e.button&&32===e.action)return!1;if(3===e.button&&32!==e.action)return!1;if(4!==e.button&&(2===e.action||3===e.action))return!1;if(e.col++,e.row++,32===e.action&&this._lastEvent&&this._equalEvents(this._lastEvent,e,"SGR_PIXELS"===this._activeEncoding))return!1;if(!this._protocols[this._activeProtocol].restrict(e))return!1;const t=this._encodings[this._activeEncoding](e);return t&&("DEFAULT"===this._activeEncoding?this._coreService.triggerBinaryEvent(t):this._coreService.triggerDataEvent(t,!0)),this._lastEvent=e,!0}explainEvents(e){return{down:!!(1&e),up:!!(2&e),drag:!!(4&e),move:!!(8&e),wheel:!!(16&e)}}_equalEvents(e,t,i){if(i){if(e.x!==t.x)return!1;if(e.y!==t.y)return!1}else{if(e.col!==t.col)return!1;if(e.row!==t.row)return!1}return e.button===t.button&&e.action===t.action&&e.ctrl===t.ctrl&&e.alt===t.alt&&e.shift===t.shift}};t.CoreMouseService=_=s([r(0,n.IBufferService),r(1,n.ICoreService)],_)},6975:function(e,t,i){var s=this&&this.__decorate||function(e,t,i,s){var r,n=arguments.length,o=n<3?t:null===s?s=Object.getOwnPropertyDescriptor(t,i):s;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)o=Reflect.decorate(e,t,i,s);else for(var a=e.length-1;a>=0;a--)(r=e[a])&&(o=(n<3?r(o):n>3?r(t,i,o):r(t,i))||o);return n>3&&o&&Object.defineProperty(t,i,o),o},r=this&&this.__param||function(e,t){return function(i,s){t(i,s,e)}};Object.defineProperty(t,"__esModule",{value:!0}),t.CoreService=void 0;const n=i(1439),o=i(8460),a=i(844),h=i(2585),c=Object.freeze({insertMode:!1}),l=Object.freeze({applicationCursorKeys:!1,applicationKeypad:!1,bracketedPasteMode:!1,origin:!1,reverseWraparound:!1,sendFocus:!1,wraparound:!0});let d=t.CoreService=class extends a.Disposable{constructor(e,t,i){super(),this._bufferService=e,this._logService=t,this._optionsService=i,this.isCursorInitialized=!1,this.isCursorHidden=!1,this._onData=this.register(new o.EventEmitter),this.onData=this._onData.event,this._onUserInput=this.register(new o.EventEmitter),this.onUserInput=this._onUserInput.event,this._onBinary=this.register(new o.EventEmitter),this.onBinary=this._onBinary.event,this._onRequestScrollToBottom=this.register(new o.EventEmitter),this.onRequestScrollToBottom=this._onRequestScrollToBottom.event,this.modes=(0,n.clone)(c),this.decPrivateModes=(0,n.clone)(l)}reset(){this.modes=(0,n.clone)(c),this.decPrivateModes=(0,n.clone)(l)}triggerDataEvent(e,t=!1){if(this._optionsService.rawOptions.disableStdin)return;const i=this._bufferService.buffer;t&&this._optionsService.rawOptions.scrollOnUserInput&&i.ybase!==i.ydisp&&this._onRequestScrollToBottom.fire(),t&&this._onUserInput.fire(),this._logService.debug(`sending data "${e}"`,(()=>e.split("").map((e=>e.charCodeAt(0))))),this._onData.fire(e)}triggerBinaryEvent(e){this._optionsService.rawOptions.disableStdin||(this._logService.debug(`sending binary "${e}"`,(()=>e.split("").map((e=>e.charCodeAt(0))))),this._onBinary.fire(e))}};t.CoreService=d=s([r(0,h.IBufferService),r(1,h.ILogService),r(2,h.IOptionsService)],d)},9074:(e,t,i)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.DecorationService=void 0;const s=i(8055),r=i(8460),n=i(844),o=i(6106);let a=0,h=0;class c extends n.Disposable{get decorations(){return this._decorations.values()}constructor(){super(),this._decorations=new o.SortedList((e=>e?.marker.line)),this._onDecorationRegistered=this.register(new r.EventEmitter),this.onDecorationRegistered=this._onDecorationRegistered.event,this._onDecorationRemoved=this.register(new r.EventEmitter),this.onDecorationRemoved=this._onDecorationRemoved.event,this.register((0,n.toDisposable)((()=>this.reset())))}registerDecoration(e){if(e.marker.isDisposed)return;const t=new l(e);if(t){const e=t.marker.onDispose((()=>t.dispose()));t.onDispose((()=>{t&&(this._decorations.delete(t)&&this._onDecorationRemoved.fire(t),e.dispose())})),this._decorations.insert(t),this._onDecorationRegistered.fire(t)}return t}reset(){for(const e of this._decorations.values())e.dispose();this._decorations.clear()}*getDecorationsAtCell(e,t,i){let s=0,r=0;for(const n of this._decorations.getKeyIterator(t))s=n.options.x??0,r=s+(n.options.width??1),e>=s&&e<r&&(!i||(n.options.layer??"bottom")===i)&&(yield n)}forEachDecorationAtCell(e,t,i,s){this._decorations.forEachByKey(t,(t=>{a=t.options.x??0,h=a+(t.options.width??1),e>=a&&e<h&&(!i||(t.options.layer??"bottom")===i)&&s(t)}))}}t.DecorationService=c;class l extends n.Disposable{get isDisposed(){return this._isDisposed}get backgroundColorRGB(){return null===this._cachedBg&&(this.options.backgroundColor?this._cachedBg=s.css.toColor(this.options.backgroundColor):this._cachedBg=void 0),this._cachedBg}get foregroundColorRGB(){return null===this._cachedFg&&(this.options.foregroundColor?this._cachedFg=s.css.toColor(this.options.foregroundColor):this._cachedFg=void 0),this._cachedFg}constructor(e){super(),this.options=e,this.onRenderEmitter=this.register(new r.EventEmitter),this.onRender=this.onRenderEmitter.event,this._onDispose=this.register(new r.EventEmitter),this.onDispose=this._onDispose.event,this._cachedBg=null,this._cachedFg=null,this.marker=e.marker,this.options.overviewRulerOptions&&!this.options.overviewRulerOptions.position&&(this.options.overviewRulerOptions.position="full")}dispose(){this._onDispose.fire(),super.dispose()}}},4348:(e,t,i)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.InstantiationService=t.ServiceCollection=void 0;const s=i(2585),r=i(8343);class n{constructor(...e){this._entries=new Map;for(const[t,i]of e)this.set(t,i)}set(e,t){const i=this._entries.get(e);return this._entries.set(e,t),i}forEach(e){for(const[t,i]of this._entries.entries())e(t,i)}has(e){return this._entries.has(e)}get(e){return this._entries.get(e)}}t.ServiceCollection=n,t.InstantiationService=class{constructor(){this._services=new n,this._services.set(s.IInstantiationService,this)}setService(e,t){this._services.set(e,t)}getService(e){return this._services.get(e)}createInstance(e,...t){const i=(0,r.getServiceDependencies)(e).sort(((e,t)=>e.index-t.index)),s=[];for(const t of i){const i=this._services.get(t.id);if(!i)throw new Error(`[createInstance] ${e.name} depends on UNKNOWN service ${t.id}.`);s.push(i)}const n=i.length>0?i[0].index:t.length;if(t.length!==n)throw new Error(`[createInstance] First service dependency of ${e.name} at position ${n+1} conflicts with ${t.length} static arguments`);return new e(...[...t,...s])}}},7866:function(e,t,i){var s=this&&this.__decorate||function(e,t,i,s){var r,n=arguments.length,o=n<3?t:null===s?s=Object.getOwnPropertyDescriptor(t,i):s;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)o=Reflect.decorate(e,t,i,s);else for(var a=e.length-1;a>=0;a--)(r=e[a])&&(o=(n<3?r(o):n>3?r(t,i,o):r(t,i))||o);return n>3&&o&&Object.defineProperty(t,i,o),o},r=this&&this.__param||function(e,t){return function(i,s){t(i,s,e)}};Object.defineProperty(t,"__esModule",{value:!0}),t.traceCall=t.setTraceLogger=t.LogService=void 0;const n=i(844),o=i(2585),a={trace:o.LogLevelEnum.TRACE,debug:o.LogLevelEnum.DEBUG,info:o.LogLevelEnum.INFO,warn:o.LogLevelEnum.WARN,error:o.LogLevelEnum.ERROR,off:o.LogLevelEnum.OFF};let h,c=t.LogService=class extends n.Disposable{get logLevel(){return this._logLevel}constructor(e){super(),this._optionsService=e,this._logLevel=o.LogLevelEnum.OFF,this._updateLogLevel(),this.register(this._optionsService.onSpecificOptionChange("logLevel",(()=>this._updateLogLevel()))),h=this}_updateLogLevel(){this._logLevel=a[this._optionsService.rawOptions.logLevel]}_evalLazyOptionalParams(e){for(let t=0;t<e.length;t++)"function"==typeof e[t]&&(e[t]=e[t]())}_log(e,t,i){this._evalLazyOptionalParams(i),e.call(console,(this._optionsService.options.logger?"":"xterm.js: ")+t,...i)}trace(e,...t){this._logLevel<=o.LogLevelEnum.TRACE&&this._log(this._optionsService.options.logger?.trace.bind(this._optionsService.options.logger)??console.log,e,t)}debug(e,...t){this._logLevel<=o.LogLevelEnum.DEBUG&&this._log(this._optionsService.options.logger?.debug.bind(this._optionsService.options.logger)??console.log,e,t)}info(e,...t){this._logLevel<=o.LogLevelEnum.INFO&&this._log(this._optionsService.options.logger?.info.bind(this._optionsService.options.logger)??console.info,e,t)}warn(e,...t){this._logLevel<=o.LogLevelEnum.WARN&&this._log(this._optionsService.options.logger?.warn.bind(this._optionsService.options.logger)??console.warn,e,t)}error(e,...t){this._logLevel<=o.LogLevelEnum.ERROR&&this._log(this._optionsService.options.logger?.error.bind(this._optionsService.options.logger)??console.error,e,t)}};t.LogService=c=s([r(0,o.IOptionsService)],c),t.setTraceLogger=function(e){h=e},t.traceCall=function(e,t,i){if("function"!=typeof i.value)throw new Error("not supported");const s=i.value;i.value=function(...e){if(h.logLevel!==o.LogLevelEnum.TRACE)return s.apply(this,e);h.trace(`GlyphRenderer#${s.name}(${e.map((e=>JSON.stringify(e))).join(", ")})`);const t=s.apply(this,e);return h.trace(`GlyphRenderer#${s.name} return`,t),t}}},7302:(e,t,i)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.OptionsService=t.DEFAULT_OPTIONS=void 0;const s=i(8460),r=i(844),n=i(6114);t.DEFAULT_OPTIONS={cols:80,rows:24,cursorBlink:!1,cursorStyle:"block",cursorWidth:1,cursorInactiveStyle:"outline",customGlyphs:!0,drawBoldTextInBrightColors:!0,documentOverride:null,fastScrollModifier:"alt",fastScrollSensitivity:5,fontFamily:"courier-new, courier, monospace",fontSize:15,fontWeight:"normal",fontWeightBold:"bold",ignoreBracketedPasteMode:!1,lineHeight:1,letterSpacing:0,linkHandler:null,logLevel:"info",logger:null,scrollback:1e3,scrollOnUserInput:!0,scrollSensitivity:1,screenReaderMode:!1,smoothScrollDuration:0,macOptionIsMeta:!1,macOptionClickForcesSelection:!1,minimumContrastRatio:1,disableStdin:!1,allowProposedApi:!1,allowTransparency:!1,tabStopWidth:8,theme:{},rescaleOverlappingGlyphs:!1,rightClickSelectsWord:n.isMac,windowOptions:{},windowsMode:!1,windowsPty:{},wordSeparator:" ()[]{}',\"`",altClickMovesCursor:!0,convertEol:!1,termName:"xterm",cancelEvents:!1,overviewRulerWidth:0};const o=["normal","bold","100","200","300","400","500","600","700","800","900"];class a extends r.Disposable{constructor(e){super(),this._onOptionChange=this.register(new s.EventEmitter),this.onOptionChange=this._onOptionChange.event;const i={...t.DEFAULT_OPTIONS};for(const t in e)if(t in i)try{const s=e[t];i[t]=this._sanitizeAndValidateOption(t,s)}catch(e){console.error(e)}this.rawOptions=i,this.options={...i},this._setupOptions(),this.register((0,r.toDisposable)((()=>{this.rawOptions.linkHandler=null,this.rawOptions.documentOverride=null})))}onSpecificOptionChange(e,t){return this.onOptionChange((i=>{i===e&&t(this.rawOptions[e])}))}onMultipleOptionChange(e,t){return this.onOptionChange((i=>{-1!==e.indexOf(i)&&t()}))}_setupOptions(){const e=e=>{if(!(e in t.DEFAULT_OPTIONS))throw new Error(`No option with key "${e}"`);return this.rawOptions[e]},i=(e,i)=>{if(!(e in t.DEFAULT_OPTIONS))throw new Error(`No option with key "${e}"`);i=this._sanitizeAndValidateOption(e,i),this.rawOptions[e]!==i&&(this.rawOptions[e]=i,this._onOptionChange.fire(e))};for(const t in this.rawOptions){const s={get:e.bind(this,t),set:i.bind(this,t)};Object.defineProperty(this.options,t,s)}}_sanitizeAndValidateOption(e,i){switch(e){case"cursorStyle":if(i||(i=t.DEFAULT_OPTIONS[e]),!function(e){return"block"===e||"underline"===e||"bar"===e}(i))throw new Error(`"${i}" is not a valid value for ${e}`);break;case"wordSeparator":i||(i=t.DEFAULT_OPTIONS[e]);break;case"fontWeight":case"fontWeightBold":if("number"==typeof i&&1<=i&&i<=1e3)break;i=o.includes(i)?i:t.DEFAULT_OPTIONS[e];break;case"cursorWidth":i=Math.floor(i);case"lineHeight":case"tabStopWidth":if(i<1)throw new Error(`${e} cannot be less than 1, value: ${i}`);break;case"minimumContrastRatio":i=Math.max(1,Math.min(21,Math.round(10*i)/10));break;case"scrollback":if((i=Math.min(i,4294967295))<0)throw new Error(`${e} cannot be less than 0, value: ${i}`);break;case"fastScrollSensitivity":case"scrollSensitivity":if(i<=0)throw new Error(`${e} cannot be less than or equal to 0, value: ${i}`);break;case"rows":case"cols":if(!i&&0!==i)throw new Error(`${e} must be numeric, value: ${i}`);break;case"windowsPty":i=i??{}}return i}}t.OptionsService=a},2660:function(e,t,i){var s=this&&this.__decorate||function(e,t,i,s){var r,n=arguments.length,o=n<3?t:null===s?s=Object.getOwnPropertyDescriptor(t,i):s;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)o=Reflect.decorate(e,t,i,s);else for(var a=e.length-1;a>=0;a--)(r=e[a])&&(o=(n<3?r(o):n>3?r(t,i,o):r(t,i))||o);return n>3&&o&&Object.defineProperty(t,i,o),o},r=this&&this.__param||function(e,t){return function(i,s){t(i,s,e)}};Object.defineProperty(t,"__esModule",{value:!0}),t.OscLinkService=void 0;const n=i(2585);let o=t.OscLinkService=class{constructor(e){this._bufferService=e,this._nextId=1,this._entriesWithId=new Map,this._dataByLinkId=new Map}registerLink(e){const t=this._bufferService.buffer;if(void 0===e.id){const i=t.addMarker(t.ybase+t.y),s={data:e,id:this._nextId++,lines:[i]};return i.onDispose((()=>this._removeMarkerFromLink(s,i))),this._dataByLinkId.set(s.id,s),s.id}const i=e,s=this._getEntryIdKey(i),r=this._entriesWithId.get(s);if(r)return this.addLineToLink(r.id,t.ybase+t.y),r.id;const n=t.addMarker(t.ybase+t.y),o={id:this._nextId++,key:this._getEntryIdKey(i),data:i,lines:[n]};return n.onDispose((()=>this._removeMarkerFromLink(o,n))),this._entriesWithId.set(o.key,o),this._dataByLinkId.set(o.id,o),o.id}addLineToLink(e,t){const i=this._dataByLinkId.get(e);if(i&&i.lines.every((e=>e.line!==t))){const e=this._bufferService.buffer.addMarker(t);i.lines.push(e),e.onDispose((()=>this._removeMarkerFromLink(i,e)))}}getLinkData(e){return this._dataByLinkId.get(e)?.data}_getEntryIdKey(e){return`${e.id};;${e.uri}`}_removeMarkerFromLink(e,t){const i=e.lines.indexOf(t);-1!==i&&(e.lines.splice(i,1),0===e.lines.length&&(void 0!==e.data.id&&this._entriesWithId.delete(e.key),this._dataByLinkId.delete(e.id)))}};t.OscLinkService=o=s([r(0,n.IBufferService)],o)},8343:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.createDecorator=t.getServiceDependencies=t.serviceRegistry=void 0;const i="di$target",s="di$dependencies";t.serviceRegistry=new Map,t.getServiceDependencies=function(e){return e[s]||[]},t.createDecorator=function(e){if(t.serviceRegistry.has(e))return t.serviceRegistry.get(e);const r=function(e,t,n){if(3!==arguments.length)throw new Error("@IServiceName-decorator can only be used to decorate a parameter");!function(e,t,r){t[i]===t?t[s].push({id:e,index:r}):(t[s]=[{id:e,index:r}],t[i]=t)}(r,e,n)};return r.toString=()=>e,t.serviceRegistry.set(e,r),r}},2585:(e,t,i)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.IDecorationService=t.IUnicodeService=t.IOscLinkService=t.IOptionsService=t.ILogService=t.LogLevelEnum=t.IInstantiationService=t.ICharsetService=t.ICoreService=t.ICoreMouseService=t.IBufferService=void 0;const s=i(8343);var r;t.IBufferService=(0,s.createDecorator)("BufferService"),t.ICoreMouseService=(0,s.createDecorator)("CoreMouseService"),t.ICoreService=(0,s.createDecorator)("CoreService"),t.ICharsetService=(0,s.createDecorator)("CharsetService"),t.IInstantiationService=(0,s.createDecorator)("InstantiationService"),function(e){e[e.TRACE=0]="TRACE",e[e.DEBUG=1]="DEBUG",e[e.INFO=2]="INFO",e[e.WARN=3]="WARN",e[e.ERROR=4]="ERROR",e[e.OFF=5]="OFF"}(r||(t.LogLevelEnum=r={})),t.ILogService=(0,s.createDecorator)("LogService"),t.IOptionsService=(0,s.createDecorator)("OptionsService"),t.IOscLinkService=(0,s.createDecorator)("OscLinkService"),t.IUnicodeService=(0,s.createDecorator)("UnicodeService"),t.IDecorationService=(0,s.createDecorator)("DecorationService")},1480:(e,t,i)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.UnicodeService=void 0;const s=i(8460),r=i(225);class n{static extractShouldJoin(e){return 0!=(1&e)}static extractWidth(e){return e>>1&3}static extractCharKind(e){return e>>3}static createPropertyValue(e,t,i=!1){return(16777215&e)<<3|(3&t)<<1|(i?1:0)}constructor(){this._providers=Object.create(null),this._active="",this._onChange=new s.EventEmitter,this.onChange=this._onChange.event;const e=new r.UnicodeV6;this.register(e),this._active=e.version,this._activeProvider=e}dispose(){this._onChange.dispose()}get versions(){return Object.keys(this._providers)}get activeVersion(){return this._active}set activeVersion(e){if(!this._providers[e])throw new Error(`unknown Unicode version "${e}"`);this._active=e,this._activeProvider=this._providers[e],this._onChange.fire(e)}register(e){this._providers[e.version]=e}wcwidth(e){return this._activeProvider.wcwidth(e)}getStringCellWidth(e){let t=0,i=0;const s=e.length;for(let r=0;r<s;++r){let o=e.charCodeAt(r);if(55296<=o&&o<=56319){if(++r>=s)return t+this.wcwidth(o);const i=e.charCodeAt(r);56320<=i&&i<=57343?o=1024*(o-55296)+i-56320+65536:t+=this.wcwidth(i)}const a=this.charProperties(o,i);let h=n.extractWidth(a);n.extractShouldJoin(a)&&(h-=n.extractWidth(i)),t+=h,i=a}return t}charProperties(e,t){return this._activeProvider.charProperties(e,t)}}t.UnicodeService=n}},t={};function i(s){var r=t[s];if(void 0!==r)return r.exports;var n=t[s]={exports:{}};return e[s].call(n.exports,n,n.exports,i),n.exports}var s={};return(()=>{var e=s;Object.defineProperty(e,"__esModule",{value:!0}),e.Terminal=void 0;const t=i(9042),r=i(3236),n=i(844),o=i(5741),a=i(8285),h=i(7975),c=i(7090),l=["cols","rows"];class d extends n.Disposable{constructor(e){super(),this._core=this.register(new r.Terminal(e)),this._addonManager=this.register(new o.AddonManager),this._publicOptions={...this._core.options};const t=e=>this._core.options[e],i=(e,t)=>{this._checkReadonlyOptions(e),this._core.options[e]=t};for(const e in this._core.options){const s={get:t.bind(this,e),set:i.bind(this,e)};Object.defineProperty(this._publicOptions,e,s)}}_checkReadonlyOptions(e){if(l.includes(e))throw new Error(`Option "${e}" can only be set in the constructor`)}_checkProposedApi(){if(!this._core.optionsService.rawOptions.allowProposedApi)throw new Error("You must set the allowProposedApi option to true to use proposed API")}get onBell(){return this._core.onBell}get onBinary(){return this._core.onBinary}get onCursorMove(){return this._core.onCursorMove}get onData(){return this._core.onData}get onKey(){return this._core.onKey}get onLineFeed(){return this._core.onLineFeed}get onRender(){return this._core.onRender}get onResize(){return this._core.onResize}get onScroll(){return this._core.onScroll}get onSelectionChange(){return this._core.onSelectionChange}get onTitleChange(){return this._core.onTitleChange}get onWriteParsed(){return this._core.onWriteParsed}get element(){return this._core.element}get parser(){return this._parser||(this._parser=new h.ParserApi(this._core)),this._parser}get unicode(){return this._checkProposedApi(),new c.UnicodeApi(this._core)}get textarea(){return this._core.textarea}get rows(){return this._core.rows}get cols(){return this._core.cols}get buffer(){return this._buffer||(this._buffer=this.register(new a.BufferNamespaceApi(this._core))),this._buffer}get markers(){return this._checkProposedApi(),this._core.markers}get modes(){const e=this._core.coreService.decPrivateModes;let t="none";switch(this._core.coreMouseService.activeProtocol){case"X10":t="x10";break;case"VT200":t="vt200";break;case"DRAG":t="drag";break;case"ANY":t="any"}return{applicationCursorKeysMode:e.applicationCursorKeys,applicationKeypadMode:e.applicationKeypad,bracketedPasteMode:e.bracketedPasteMode,insertMode:this._core.coreService.modes.insertMode,mouseTrackingMode:t,originMode:e.origin,reverseWraparoundMode:e.reverseWraparound,sendFocusMode:e.sendFocus,wraparoundMode:e.wraparound}}get options(){return this._publicOptions}set options(e){for(const t in e)this._publicOptions[t]=e[t]}blur(){this._core.blur()}focus(){this._core.focus()}input(e,t=!0){this._core.input(e,t)}resize(e,t){this._verifyIntegers(e,t),this._core.resize(e,t)}open(e){this._core.open(e)}attachCustomKeyEventHandler(e){this._core.attachCustomKeyEventHandler(e)}attachCustomWheelEventHandler(e){this._core.attachCustomWheelEventHandler(e)}registerLinkProvider(e){return this._core.registerLinkProvider(e)}registerCharacterJoiner(e){return this._checkProposedApi(),this._core.registerCharacterJoiner(e)}deregisterCharacterJoiner(e){this._checkProposedApi(),this._core.deregisterCharacterJoiner(e)}registerMarker(e=0){return this._verifyIntegers(e),this._core.registerMarker(e)}registerDecoration(e){return this._checkProposedApi(),this._verifyPositiveIntegers(e.x??0,e.width??0,e.height??0),this._core.registerDecoration(e)}hasSelection(){return this._core.hasSelection()}select(e,t,i){this._verifyIntegers(e,t,i),this._core.select(e,t,i)}getSelection(){return this._core.getSelection()}getSelectionPosition(){return this._core.getSelectionPosition()}clearSelection(){this._core.clearSelection()}selectAll(){this._core.selectAll()}selectLines(e,t){this._verifyIntegers(e,t),this._core.selectLines(e,t)}dispose(){super.dispose()}scrollLines(e){this._verifyIntegers(e),this._core.scrollLines(e)}scrollPages(e){this._verifyIntegers(e),this._core.scrollPages(e)}scrollToTop(){this._core.scrollToTop()}scrollToBottom(){this._core.scrollToBottom()}scrollToLine(e){this._verifyIntegers(e),this._core.scrollToLine(e)}clear(){this._core.clear()}write(e,t){this._core.write(e,t)}writeln(e,t){this._core.write(e),this._core.write("\r\n",t)}paste(e){this._core.paste(e)}refresh(e,t){this._verifyIntegers(e,t),this._core.refresh(e,t)}reset(){this._core.reset()}clearTextureAtlas(){this._core.clearTextureAtlas()}loadAddon(e){this._addonManager.loadAddon(this,e)}static get strings(){return t}_verifyIntegers(...e){for(const t of e)if(t===1/0||isNaN(t)||t%1!=0)throw new Error("This API only accepts integers")}_verifyPositiveIntegers(...e){for(const t of e)if(t&&(t===1/0||isNaN(t)||t%1!=0||t<0))throw new Error("This API only accepts positive integers")}}e.Terminal=d})(),s})()));
//# sourceMappingURL=xterm.js.map
!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t():"function"==typeof define&&define.amd?define([],t):"object"==typeof exports?exports.FitAddon=t():e.FitAddon=t()}(self,(()=>(()=>{"use strict";var e={};return(()=>{var t=e;Object.defineProperty(t,"__esModule",{value:!0}),t.FitAddon=void 0,t.FitAddon=class{activate(e){this._terminal=e}dispose(){}fit(){const e=this.proposeDimensions();if(!e||!this._terminal||isNaN(e.cols)||isNaN(e.rows))return;const t=this._terminal._core;this._terminal.rows===e.rows&&this._terminal.cols===e.cols||(t._renderService.clear(),this._terminal.resize(e.cols,e.rows))}proposeDimensions(){if(!this._terminal)return;if(!this._terminal.element||!this._terminal.element.parentElement)return;const e=this._terminal._core,t=e._renderService.dimensions;if(0===t.css.cell.width||0===t.css.cell.height)return;const r=0===this._terminal.options.scrollback?0:e.viewport.scrollBarWidth,i=window.getComputedStyle(this._terminal.element.parentElement),o=parseInt(i.getPropertyValue("height")),s=Math.max(0,parseInt(i.getPropertyValue("width"))),n=window.getComputedStyle(this._terminal.element),l=o-(parseInt(n.getPropertyValue("padding-top"))+parseInt(n.getPropertyValue("padding-bottom"))),a=s-(parseInt(n.getPropertyValue("padding-right"))+parseInt(n.getPropertyValue("padding-left")))-r;return{cols:Math.max(2,Math.floor(a/t.css.cell.width)),rows:Math.max(1,Math.floor(l/t.css.cell.height))}}}})(),e})()));
//# sourceMappingURL=addon-fit.js.map
/* === vendored xterm END === */
