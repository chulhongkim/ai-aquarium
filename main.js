const canvas = document.querySelector("#aquarium");
const ctx = canvas.getContext("2d");

const ui = {
  smallCount: document.querySelector("#smallCount"),
  middleCount: document.querySelector("#middleCount"),
  bossCount: document.querySelector("#bossCount"),
  smallValue: document.querySelector("#smallValue"),
  middleValue: document.querySelector("#middleValue"),
  bossValue: document.querySelector("#bossValue"),
  fishShapeCount: document.querySelector("#fishShapeCount"),
  rayCount: document.querySelector("#rayCount"),
  octopusCount: document.querySelector("#octopusCount"),
  squidCount: document.querySelector("#squidCount"),
  molaCount: document.querySelector("#molaCount"),
  fishShapeValue: document.querySelector("#fishShapeValue"),
  rayValue: document.querySelector("#rayValue"),
  octopusValue: document.querySelector("#octopusValue"),
  squidValue: document.querySelector("#squidValue"),
  molaValue: document.querySelector("#molaValue"),
  align: document.querySelector("#align"),
  cohesion: document.querySelector("#cohesion"),
  separate: document.querySelector("#separate"),
  speed: document.querySelector("#speed"),
  reset: document.querySelector("#resetBtn"),
  update: document.querySelector("#updateBtn"),
  language: document.querySelector("#languageSelect"),
  fishCount: document.querySelector("#fishCount"),
  fps: document.querySelector("#fps"),
  hint: document.querySelector("#hint"),
  startOverlay: document.querySelector("#startOverlay"),
  deviceButtons: document.querySelectorAll(".deviceBtn"),
  levelButtons: document.querySelectorAll(".levelBtn"),
  start: document.querySelector("#startBtn"),
  view: document.querySelector("#viewBtn"),
  viewActions: document.querySelector("#viewActions"),
  viewStart: document.querySelector("#viewStartBtn"),
  setup: document.querySelector("#setupBtn"),
  panel: document.querySelector("#controlPanel"),
  panelToggle: document.querySelector("#panelToggleBtn"),
  panelClose: document.querySelector("#panelCloseBtn"),
  touchControls: document.querySelector("#touchControls"),
  joystickBase: document.querySelector("#joystickBase"),
  joystickKnob: document.querySelector("#joystickKnob"),
  resultOverlay: document.querySelector("#resultOverlay"),
  resultTitle: document.querySelector(".resultTitle"),
  resultScore: document.querySelector(".resultScore"),
  playAgain: document.querySelector("#playAgainBtn"),
};

const pointer = { x: 0, y: 0, lastX: 0, lastY: 0, speed: 0, active: false, lastMoveAt: performance.now() };
const keys = { ArrowUp: false, ArrowDown: false, ArrowLeft: false, ArrowRight: false };
const joystick = { x: 0, y: 0, active: false, pointerId: null };
const fish = [];
const food = [];
const plantFood = [];
const eggs = [];
const waste = [];
const redClouds = [];
const diver = { active: false, x: 0, y: 0, vx: 1.1, vy: 0, timer: 0, spawnAt: 300, survivalTimer: 0, entered: false, stamina: 1, fleeing: false, hiddenInSchool: false, schoolCover: 0 };
const difficultyLevels = {
  beginner: { label: "Beginner", chaseBoost: 0.44, sharkMax: 9.2, diverBite: 1.05, fishBite: 0.9, fishMultiplier: 1.3 },
  middle: { label: "Normal", chaseBoost: 0.58, sharkMax: 11.8, diverBite: 1.3, fishBite: 1, fishMultiplier: 1 },
  advanced: { label: "Advanced", chaseBoost: 0.74, sharkMax: 14.2, diverBite: 1.55, fishBite: 1.14, fishMultiplier: 0.68 },
};
const gameState = { started: false, over: false, result: null, level: "middle", device: "pc", mode: "game" };
const winMessage = { active: false, timer: 0 };
const shark = { x: 0, y: 0, vx: 2.4, vy: 0.2, size: 34, wiggle: 0, hunger: 0, fullness: 0, speedMood: 1, chasePower: 0.11, nextSpeedChangeAt: 0 };
const SETTINGS_KEY = "ai-aquarium-slider-settings";
const BEST_SCORE_KEY = "ai-aquarium-best-survival-score";
const LANGUAGE_KEY = "ai-aquarium-language";
const translations = {
  en: { appLang: "en", control: "Control", close: "Close", reset: "Reset", update: "Update", language: "Language", device: "Device", phone: "Play on Phone", pc: "Play on PC", level: "Level", beginner: "Beginner", normal: "Normal", advanced: "Advanced", start: "Start Game", view: "View Mode", setup: "Setup", playAgain: "Play Again", smallFish: "Small Fish", middleFish: "Middle Fish", bossFish: "Boss Fish", species: "Species", fishShape: "Fish Shape", ray: "Ray", octopus: "Octopus", squid: "Squid", mola: "Mola", alignment: "Alignment", cohesion: "Cohesion", separation: "Separation", speed: "Speed", gameOver: "GAME OVER", survived: "SURVIVED!", newRecord: "NEW RECORD!", score: "Score", best: "Best", previous: "Previous", survival: "SURVIVAL", selectLevel: "SELECT LEVEL", diverIn: "DIVER IN", enterWater: "ENTER THE WATER", updating: "Updating..." },
  ja: { appLang: "ja", control: "操作", close: "閉じる", reset: "リセット", update: "最新版", language: "言語", device: "端末", phone: "スマホで遊ぶ", pc: "PCで遊ぶ", level: "レベル", beginner: "かんたん", normal: "ふつう", advanced: "むずかしい", start: "ゲーム開始", view: "観察モード", setup: "設定", playAgain: "もう一回", smallFish: "小さい魚", middleFish: "中くらいの魚", bossFish: "大きい魚", species: "種類", fishShape: "魚型", ray: "エイ", octopus: "タコ", squid: "イカ", mola: "マンボウ", alignment: "向きを合わせる", cohesion: "集まる", separation: "離れる", speed: "速さ", gameOver: "ゲームオーバー", survived: "生きのびた!", newRecord: "新記録!", score: "スコア", best: "最高", previous: "前回", survival: "生存時間", selectLevel: "レベル選択", diverIn: "ダイバーまで", enterWater: "入水中", updating: "更新中..." },
  zh: { appLang: "zh", control: "控制", close: "关闭", reset: "重置", update: "更新", language: "语言", device: "设备", phone: "手机游玩", pc: "电脑游玩", level: "等级", beginner: "简单", normal: "普通", advanced: "困难", start: "开始游戏", view: "观赏模式", setup: "设置", playAgain: "再玩一次", smallFish: "小鱼", middleFish: "中鱼", bossFish: "大鱼", species: "种类", fishShape: "鱼形", ray: "鳐鱼", octopus: "章鱼", squid: "鱿鱼", mola: "翻车鱼", alignment: "对齐", cohesion: "聚集", separation: "分散", speed: "速度", gameOver: "游戏结束", survived: "成功逃生!", newRecord: "新纪录!", score: "分数", best: "最高", previous: "上次", survival: "生存时间", selectLevel: "选择等级", diverIn: "潜水员倒计时", enterWater: "入水中", updating: "更新中..." },
  es: { appLang: "es", control: "Control", close: "Cerrar", reset: "Reiniciar", update: "Actualizar", language: "Idioma", device: "Dispositivo", phone: "Jugar en móvil", pc: "Jugar en PC", level: "Nivel", beginner: "Fácil", normal: "Normal", advanced: "Difícil", start: "Empezar", view: "Modo vista", setup: "Ajustes", playAgain: "Otra vez", smallFish: "Peces pequeños", middleFish: "Peces medianos", bossFish: "Peces grandes", species: "Especies", fishShape: "Forma pez", ray: "Raya", octopus: "Pulpo", squid: "Calamar", mola: "Pez luna", alignment: "Alineación", cohesion: "Cohesión", separation: "Separación", speed: "Velocidad", gameOver: "FIN DEL JUEGO", survived: "SOBREVIVISTE!", newRecord: "NUEVO RÉCORD!", score: "Puntuación", best: "Mejor", previous: "Anterior", survival: "SUPERVIVENCIA", selectLevel: "ELIGE NIVEL", diverIn: "BUZO EN", enterWater: "ENTRANDO", updating: "Actualizando..." },
  fr: { appLang: "fr", control: "Contrôle", close: "Fermer", reset: "Réinitialiser", update: "Mettre à jour", language: "Langue", device: "Appareil", phone: "Jouer sur mobile", pc: "Jouer sur PC", level: "Niveau", beginner: "Facile", normal: "Normal", advanced: "Difficile", start: "Démarrer", view: "Mode vue", setup: "Réglages", playAgain: "Rejouer", smallFish: "Petits poissons", middleFish: "Poissons moyens", bossFish: "Gros poissons", species: "Espèces", fishShape: "Forme poisson", ray: "Raie", octopus: "Poulpe", squid: "Calmar", mola: "Môle", alignment: "Alignement", cohesion: "Cohésion", separation: "Séparation", speed: "Vitesse", gameOver: "PARTIE TERMINÉE", survived: "SURVÉCU!", newRecord: "NOUVEAU RECORD!", score: "Score", best: "Meilleur", previous: "Précédent", survival: "SURVIE", selectLevel: "CHOISIR NIVEAU", diverIn: "PLONGEUR DANS", enterWater: "ENTRÉE DANS L'EAU", updating: "Mise à jour..." },
  si: { appLang: "si", control: "පාලනය", close: "වසන්න", reset: "නැවත", update: "යාවත්කාල", language: "භාෂාව", device: "උපාංගය", phone: "දුරකථනයෙන්", pc: "PC එකෙන්", level: "මට්ටම", beginner: "ලේසි", normal: "සාමාන්‍ය", advanced: "අමාරු", start: "ආරම්භ කරන්න", view: "නරඹන මාදිලිය", setup: "සැකසුම්", playAgain: "නැවත සෙල්ලම්", smallFish: "කුඩා මාළු", middleFish: "මැද මාළු", bossFish: "ලොකු මාළු", species: "වර්ග", fishShape: "මාළු හැඩය", ray: "රේ", octopus: "ඔක්ටොපස්", squid: "ස්කුවිඩ්", mola: "මෝලා", alignment: "එක දිශාව", cohesion: "එකට රැස්වීම", separation: "වෙන්වීම", speed: "වේගය", gameOver: "ක්‍රීඩාව අවසන්", survived: "බේරුණා!", newRecord: "නව වාර්තාව!", score: "ලකුණු", best: "හොඳම", previous: "පෙර", survival: "බේරුණු කාලය", selectLevel: "මට්ටම තෝරන්න", diverIn: "කිමිදුම්කරු", enterWater: "ජලයට ඇතුල්", updating: "යාවත්කාලීන..." },
};
let currentLanguage = "en";
function t(key) {
  return translations[currentLanguage]?.[key] || translations.en[key] || key;
}
const sliderKeys = [
  "smallCount",
  "middleCount",
  "bossCount",
  "fishShapeCount",
  "rayCount",
  "octopusCount",
  "squidCount",
  "molaCount",
  "align",
  "cohesion",
  "separate",
  "speed",
];
let width = 0;
let height = 0;
let lastTime = performance.now();
let fpsSmoother = 60;
let audioContext = null;
let lastEatSoundAt = 0;
let lastBiteSoundAt = 0;
let lastGrazeSoundAt = 0;
let bgmTimer = null;
let bgmGain = null;
let lastUpdateTime = performance.now();

function audio() {
  audioContext ||= new (window.AudioContext || window.webkitAudioContext)();
  if (audioContext.state === "suspended") audioContext.resume();
  return audioContext;
}

function playEatSound() {
  const now = performance.now();
  if (now - lastEatSoundAt < 45) return;
  lastEatSoundAt = now;
  const ac = audio();
  const start = ac.currentTime;
  const oscillator = ac.createOscillator();
  const gain = ac.createGain();
  oscillator.type = "sine";
  oscillator.frequency.setValueAtTime(rand(520, 680), start);
  oscillator.frequency.exponentialRampToValueAtTime(rand(170, 240), start + 0.12);
  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.exponentialRampToValueAtTime(0.08, start + 0.012);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.14);
  oscillator.connect(gain);
  gain.connect(ac.destination);
  oscillator.start(start);
  oscillator.stop(start + 0.15);
}

function playImpactSound() {
  const ac = audio();
  const start = ac.currentTime;
  const low = ac.createOscillator();
  const grit = ac.createOscillator();
  const gain = ac.createGain();
  low.type = "sawtooth";
  grit.type = "square";
  low.frequency.setValueAtTime(52, start);
  low.frequency.exponentialRampToValueAtTime(18, start + 0.55);
  grit.frequency.setValueAtTime(115, start);
  grit.frequency.exponentialRampToValueAtTime(32, start + 0.24);
  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.exponentialRampToValueAtTime(0.22, start + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.62);
  low.connect(gain);
  grit.connect(gain);
  gain.connect(ac.destination);
  low.start(start);
  grit.start(start);
  low.stop(start + 0.65);
  grit.stop(start + 0.32);
}

function playGrazeSound() {
  const now = performance.now();
  if (now - lastGrazeSoundAt < 80) return;
  lastGrazeSoundAt = now;
  const ac = audio();
  const start = ac.currentTime;
  const oscillator = ac.createOscillator();
  const gain = ac.createGain();
  oscillator.type = "triangle";
  oscillator.frequency.setValueAtTime(rand(210, 280), start);
  oscillator.frequency.exponentialRampToValueAtTime(rand(90, 130), start + 0.16);
  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.exponentialRampToValueAtTime(0.055, start + 0.018);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.18);
  oscillator.connect(gain);
  gain.connect(ac.destination);
  oscillator.start(start);
  oscillator.stop(start + 0.2);
}

function playBiteSound() {
  const now = performance.now();
  if (now - lastBiteSoundAt < 180) return;
  lastBiteSoundAt = now;
  const ac = audio();
  const start = ac.currentTime;
  const crunch = ac.createOscillator();
  const thump = ac.createOscillator();
  const gain = ac.createGain();
  crunch.type = "sawtooth";
  thump.type = "triangle";
  crunch.frequency.setValueAtTime(rand(70, 95), start);
  crunch.frequency.exponentialRampToValueAtTime(rand(28, 42), start + 0.22);
  thump.frequency.setValueAtTime(rand(42, 58), start);
  thump.frequency.exponentialRampToValueAtTime(24, start + 0.28);
  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.exponentialRampToValueAtTime(0.16, start + 0.018);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.28);
  crunch.connect(gain);
  thump.connect(gain);
  gain.connect(ac.destination);
  crunch.start(start);
  thump.start(start);
  crunch.stop(start + 0.3);
  thump.stop(start + 0.3);
}

function playTone(frequency, start, duration, type = "sine", peak = 0.08, destination = null) {
  const ac = audio();
  const oscillator = ac.createOscillator();
  const gain = ac.createGain();
  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, start);
  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.exponentialRampToValueAtTime(peak, start + 0.04);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
  oscillator.connect(gain);
  gain.connect(destination || ac.destination);
  oscillator.start(start);
  oscillator.stop(start + duration + 0.03);
}

function stopAquariumBgm() {
  if (bgmTimer) {
    clearInterval(bgmTimer);
    bgmTimer = null;
  }
  if (bgmGain) {
    const ac = audio();
    bgmGain.gain.cancelScheduledValues(ac.currentTime);
    bgmGain.gain.setTargetAtTime(0.0001, ac.currentTime, 0.25);
    bgmGain = null;
  }
}

function scheduleAquariumBgmBar() {
  const ac = audio();
  const start = ac.currentTime + 0.05;
  const notes = [261.63, 329.63, 392.0, 493.88, 587.33, 493.88, 392.0, 329.63];
  if (!bgmGain) {
    bgmGain = ac.createGain();
    bgmGain.gain.setValueAtTime(0.075, ac.currentTime);
    bgmGain.connect(ac.destination);
  }
  notes.forEach((note, index) => {
    playTone(note, start + index * 0.55, 0.9, "sine", 0.032, bgmGain);
    if (index % 2 === 0) playTone(note / 2, start + index * 0.55, 1.15, "triangle", 0.018, bgmGain);
  });
}

function startAquariumBgm() {
  if (gameState.over || bgmTimer) return;
  audio();
  scheduleAquariumBgmBar();
  bgmTimer = setInterval(scheduleAquariumBgmBar, 4200);
}

function playWinMusic() {
  stopAquariumBgm();
  const ac = audio();
  const start = ac.currentTime + 0.03;
  [523.25, 659.25, 783.99, 1046.5].forEach((note, index) => {
    playTone(note, start + index * 0.16, 0.34, "triangle", 0.12);
  });
  playTone(1318.51, start + 0.72, 0.75, "sine", 0.11);
  playTone(1046.5, start + 0.72, 0.75, "sine", 0.08);
}

function playGameOverMusic() {
  stopAquariumBgm();
  const ac = audio();
  const start = ac.currentTime + 0.03;
  [392.0, 369.99, 329.63, 261.63, 196.0].forEach((note, index) => {
    playTone(note, start + index * 0.28, 0.38, "sawtooth", 0.085);
  });
  playTone(130.81, start + 1.42, 0.8, "triangle", 0.09);
}

function playResultMusic(result) {
  if (result === "win") playWinMusic();
  else playGameOverMusic();
}
function loadSettings() {
  try {
    const saved = JSON.parse(localStorage.getItem(SETTINGS_KEY) || "{}");
    for (const key of sliderKeys) {
      if (saved[key] !== undefined && ui[key]) ui[key].value = saved[key];
    }
  } catch {
    // Keep the default values when localStorage is unavailable.
  }
}

function saveSettings() {
  try {
    const settings = {};
    for (const key of sliderKeys) settings[key] = ui[key].value;
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch {
    // Saving settings is optional; the simulation can continue without it.
  }
}

function connectSettingPersistence() {
  for (const key of sliderKeys) {
    ui[key].addEventListener("input", saveSettings);
  }
}

function keepInsideTank(entity, radius, bounce = 0.55) {
  const left = radius;
  const right = Math.max(left, width - radius);
  const top = radius;
  const bottom = Math.max(top, height - radius);

  if (entity.x < left) {
    entity.x = left;
    entity.vx = Math.abs(entity.vx) * bounce;
  } else if (entity.x > right) {
    entity.x = right;
    entity.vx = -Math.abs(entity.vx) * bounce;
  }

  if (entity.y < top) {
    entity.y = top;
    entity.vy = Math.abs(entity.vy) * bounce;
  } else if (entity.y > bottom) {
    entity.y = bottom;
    entity.vy = -Math.abs(entity.vy) * bounce;
  }
}
function rand(min, max) {
  return min + Math.random() * (max - min);
}


function usesOverlayPanel() {
  return window.matchMedia("(orientation: landscape) and (max-height: 560px) and (max-width: 980px)").matches;
}

function loadLanguage() {
  try {
    const saved = localStorage.getItem(LANGUAGE_KEY);
    currentLanguage = translations[saved] ? saved : "en";
  } catch (error) {
    currentLanguage = "en";
  }
  if (ui.language) ui.language.value = currentLanguage;
}

function saveLanguage(language) {
  currentLanguage = translations[language] ? language : "en";
  try {
    localStorage.setItem(LANGUAGE_KEY, currentLanguage);
  } catch (error) {
    // Keep the current language for this session when storage is unavailable.
  }
}

function applyLanguage() {
  document.documentElement.lang = t("appLang");
  document.querySelectorAll("[data-i18n]").forEach((element) => {
    const key = element.dataset.i18n;
    element.textContent = t(key);
  });
  updateStartControls();
}

async function updateToLatest() {
  if (ui.update) ui.update.textContent = t("updating");
  try {
    if ("serviceWorker" in navigator) {
      const registrations = await navigator.serviceWorker.getRegistrations();
      await Promise.all(registrations.map((registration) => registration.update()));
    }
    if ("caches" in window) {
      const keys = await caches.keys();
      await Promise.all(keys.filter((key) => key.startsWith("ai-aquarium-")).map((key) => caches.delete(key)));
    }
  } finally {
    window.location.reload();
  }
}
function setPanelOpen(open) {
  if (!ui.panel) return;
  const shouldOpen = open && usesOverlayPanel();
  ui.panel.classList.toggle("open", shouldOpen);
  if (ui.panelToggle) ui.panelToggle.setAttribute("aria-expanded", String(shouldOpen));
}
function resize() {
  const rect = canvas.getBoundingClientRect();
  const scale = Math.min(window.devicePixelRatio || 1, 2);
  width = rect.width;
  height = rect.height;
  canvas.width = Math.floor(width * scale);
  canvas.height = Math.floor(height * scale);
  ctx.setTransform(scale, 0, 0, scale, 0, 0);
  if (!usesOverlayPanel()) setPanelOpen(false);
}

function entityScale() {
  if (width <= 0 || height <= 0) return 1;
  if (width > 760 && height > 560) return 1;
  return Math.max(0.64, Math.min(1, Math.min(width / 760, height / 620)));
}

function sharkMovementScale() {
  if (width > 760 && height > 560) return 1;
  return Math.max(0.62, Math.min(0.82, entityScale() + 0.08));
}

function makeFish(x = rand(0, width), y = rand(0, height), kind = "normal", species = null) {
  const angle = rand(0, Math.PI * 2);
  const isBoss = kind === "boss";
  const isMiddle = kind === "middle";
  const speciesPool = isBoss ? ["mola", "ray"] : isMiddle ? ["fish", "squid", "ray", "mola"] : ["fish", "squid", "octopus", "ray"];
  const chosenSpecies = species || speciesPool[Math.floor(rand(0, speciesPool.length))];
  const hue = isBoss ? rand(30, 48) : isMiddle ? rand(52, 62) : chosenSpecies === "octopus" ? rand(315, 340) : rand(165, 205);
  const scale = entityScale();
  const speedScale = sharkMovementScale();
  return {
    kind,
    species: chosenSpecies,
    x,
    y,
    vx: Math.cos(angle) * rand(1, isBoss ? 3.4 : isMiddle ? 3.2 : 3) * speedScale,
    vy: Math.sin(angle) * rand(1, isBoss ? 3.4 : isMiddle ? 3.2 : 3) * speedScale,
    size: (isBoss ? rand(11, 15) : isMiddle ? rand(8, 10.5) : rand(3.5, 7.5)) * scale,
    hue,
    wiggle: rand(0, Math.PI * 2),
    wanderPhase: rand(0, Math.PI * 2),
    schoolBias: rand(0.82, 1.18),
    age: rand(900, 1800),
    meals: 3,
  };
}

function countBy(field, value) {
  return fish.filter((f) => f[field] === value).length;
}

function removeBy(field, value) {
  const index = fish.findIndex((f) => f[field] === value);
  if (index !== -1) fish.splice(index, 1);
}

function levelFishMultiplier() {
  return difficultyLevels[gameState.level]?.fishMultiplier || 1;
}

function scaleFishTargets(targets) {
  const multiplier = levelFishMultiplier();
  const scaled = {};
  for (const [key, value] of Object.entries(targets)) scaled[key] = Math.max(0, Math.round(value * multiplier));
  return scaled;
}

function targetSpeciesCounts() {
  return scaleFishTargets({
    fish: Number(ui.fishShapeCount.value),
    ray: Number(ui.rayCount.value),
    octopus: Number(ui.octopusCount.value),
    squid: Number(ui.squidCount.value),
    mola: Number(ui.molaCount.value),
  });
}

function targetKindCounts() {
  return scaleFishTargets({
    normal: Number(ui.smallCount.value),
    middle: Number(ui.middleCount.value),
    boss: Number(ui.bossCount.value),
  });
}

function pickKind(kindTargets) {
  const kinds = ["normal", "middle", "boss"];
  return kinds.find((kind) => countBy("kind", kind) < kindTargets[kind]) || "normal";
}

function restyleFish(f, kind) {
  const replacement = makeFish(f.x, f.y, kind, f.species);
  Object.assign(f, replacement);
}

function balanceKindCounts(kindTargets) {
  for (const kind of ["normal", "middle", "boss"]) {
    while (countBy("kind", kind) > kindTargets[kind]) {
      const receiver = ["normal", "middle", "boss"].find((candidate) => countBy("kind", candidate) < kindTargets[candidate]);
      if (!receiver) break;
      const target = fish.find((f) => f.kind === kind);
      if (!target) break;
      restyleFish(target, receiver);
    }
  }
}

function syncFishCount() {
  const speciesTargets = targetSpeciesCounts();
  const kindTargets = targetKindCounts();

  for (const species of ["fish", "ray", "octopus", "squid", "mola"]) {
    while (countBy("species", species) < speciesTargets[species]) fish.push(makeFish(undefined, undefined, pickKind(kindTargets), species));
    while (countBy("species", species) > speciesTargets[species]) removeBy("species", species);
  }

  balanceKindCounts(kindTargets);

  ui.smallValue.textContent = kindTargets.normal;
  ui.middleValue.textContent = kindTargets.middle;
  ui.bossValue.textContent = kindTargets.boss;
  ui.fishShapeValue.textContent = speciesTargets.fish;
  ui.rayValue.textContent = speciesTargets.ray;
  ui.octopusValue.textContent = speciesTargets.octopus;
  ui.squidValue.textContent = speciesTargets.squid;
  ui.molaValue.textContent = speciesTargets.mola;
  ui.fishCount.textContent = fish.length;
}


function randomizeSharkSpeed() {
  const speedScale = sharkMovementScale();
  const roll = Math.random();
  if (roll < 0.34) shark.speedMood = rand(0.58, 0.82);
  else if (roll < 0.67) shark.speedMood = rand(0.9, 1.12);
  else shark.speedMood = rand(1.28, 1.72);
  shark.chasePower = (0.075 + shark.speedMood * 0.045) * speedScale;
  shark.vx = rand(2.4, 3.7) * shark.speedMood * speedScale;
  shark.vy = rand(-0.4, 0.4) * shark.speedMood * speedScale;
  shark.nextSpeedChangeAt = performance.now() + rand(2200, 5200);
}

function maybeRandomizeSharkSpeed() {
  if (performance.now() < shark.nextSpeedChangeAt) return;
  const oldSpeed = Math.hypot(shark.vx, shark.vy) || 1;
  const oldMood = shark.speedMood || 1;
  randomizeSharkSpeed();
  const direction = Math.atan2(shark.vy, shark.vx);
  const newSpeed = Math.max(1.2, oldSpeed * (shark.speedMood / oldMood));
  shark.vx = Math.cos(direction) * newSpeed;
  shark.vy = Math.sin(direction) * newSpeed;
}

function reset(showStart = true) {
  if (showStart) gameState.mode = "game";
  fish.length = 0;
  food.length = 0;
  plantFood.length = 0;
  shark.size = 34 * entityScale();
  shark.x = Math.min(width - shark.size * 2.8, shark.size * 2.8);
  shark.y = rand(shark.size * 1.5, Math.max(shark.size * 1.5, height - shark.size * 1.5));
  randomizeSharkSpeed();
  shark.hunger = 0;
  shark.fullness = 0;
  waste.length = 0;
  redClouds.length = 0;
  eggs.length = 0;
  diver.active = false;
  diver.timer = 0;
  diver.spawnAt = 300;
  diver.survivalTimer = 0;
  diver.entered = false;
  for (const key of Object.keys(keys)) keys[key] = false;
  gameState.started = !showStart && gameState.mode === "game";
  gameState.over = false;
  gameState.result = null;
  stopAquariumBgm();
  winMessage.active = false;
  winMessage.timer = 0;
  if (ui.resultTitle) ui.resultTitle.textContent = t("gameOver");
  if (ui.resultScore) {
    ui.resultScore.textContent = "";
    ui.resultScore.classList.remove("record", "standard");
  }
  if (ui.resultOverlay) {
    ui.resultOverlay.classList.remove("win", "gameover", "record");
    ui.resultOverlay.hidden = true;
  }
  resetJoystick();
  if (ui.startOverlay) ui.startOverlay.hidden = !showStart;
  updateStartControls();
  syncFishCount();
}


function updateStartControls() {
  ui.deviceButtons.forEach((button) => button.classList.toggle("active", button.dataset.device === gameState.device));
  ui.levelButtons.forEach((button) => button.classList.toggle("active", button.dataset.level === gameState.level));
  if (ui.touchControls) ui.touchControls.hidden = !(gameState.mode === "game" && gameState.started && gameState.device === "phone" && !gameState.over);
  if (ui.viewActions) ui.viewActions.hidden = gameState.mode !== "view";
  if (ui.hint) {
    if (gameState.mode === "view") ui.hint.textContent = "view mode: tap aquarium to feed";
    else if (!gameState.started) ui.hint.textContent = "Choose device and level, then start or view";
    else if (gameState.device === "phone") ui.hint.textContent = "slide joystick: diver / tap aquarium: feed";
    else ui.hint.textContent = "arrow keys: diver / click: feed";
  }
}
function startGame() {
  gameState.mode = "game";
  reset(false);
  updateStartControls();
  startAquariumBgm();
}

function startViewMode() {
  gameState.mode = "view";
  reset(false);
  if (ui.startOverlay) ui.startOverlay.hidden = true;
  updateStartControls();
  startAquariumBgm();
}
function limitSpeed(f, maxSpeed) {
  const speed = Math.hypot(f.vx, f.vy) || 1;
  if (speed > maxSpeed) {
    f.vx = (f.vx / speed) * maxSpeed;
    f.vy = (f.vy / speed) * maxSpeed;
  }
}


function increaseSlider(input, amount = 1) {
  input.value = Math.min(Number(input.max), Number(input.value) + amount);
}

function increaseCountsForBaby(parent) {
  const speciesInputs = {
    fish: ui.fishShapeCount,
    ray: ui.rayCount,
    octopus: ui.octopusCount,
    squid: ui.squidCount,
    mola: ui.molaCount,
  };
  const kindInputs = {
    normal: ui.smallCount,
    middle: ui.middleCount,
    boss: ui.bossCount,
  };
  increaseSlider(speciesInputs[parent.species]);
  increaseSlider(kindInputs[parent.kind]);
  saveSettings();
}


function layEgg(parent) {
  eggs.push({
    x: parent.x + rand(-14, 14),
    y: parent.y + rand(-14, 14),
    vx: rand(-0.12, 0.12),
    vy: rand(0.08, 0.28),
    radius: Math.max(3.5, parent.size * 0.34),
    age: 0,
    hatchAt: rand(520, 820),
    kind: parent.kind,
    species: parent.species,
  });
}

function hatchEgg(egg) {
  increaseCountsForBaby(egg);
  const baby = makeFish(egg.x + rand(-8, 8), egg.y + rand(-8, 8), egg.kind, egg.species);
  baby.size = Math.max(3, egg.radius * 1.65);
  baby.age = 0;
  baby.meals = 0;
  baby.vx = rand(-1.4, 1.4);
  baby.vy = rand(-1.4, 1.4);
  fish.push(baby);
}

function updateEggs() {
  for (let i = eggs.length - 1; i >= 0; i -= 1) {
    const egg = eggs[i];
    egg.age += 1;
    egg.x += egg.vx;
    egg.y += egg.vy;
    egg.vx += Math.sin(egg.age * 0.025 + egg.x) * 0.0015;
    egg.vy *= 0.996;
    if (egg.y > height - 46) egg.vy -= 0.018;
    if (egg.age >= egg.hatchAt) {
      hatchEgg(egg);
      eggs.splice(i, 1);
    }
  }
}

function drawEggs() {
  for (const egg of eggs) {
    const pulse = 0.7 + Math.sin(egg.age * 0.08) * 0.18;
    ctx.fillStyle = `rgba(238, 255, 218, ${0.55 + pulse * 0.18})`;
    ctx.strokeStyle = `rgba(143, 255, 206, ${0.35 + pulse * 0.22})`;
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.ellipse(egg.x, egg.y, egg.radius * 0.85, egg.radius * 1.08, 0.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  }
}

function breedFish(parent) {
  increaseCountsForBaby(parent);
  const baby = makeFish(parent.x + rand(-18, 18), parent.y + rand(-18, 18), parent.kind, parent.species);
  baby.size = Math.max(3, parent.size * 0.62);
  baby.age = 0;
  baby.meals = 0;
  baby.vx = parent.vx + rand(-1.2, 1.2);
  baby.vy = parent.vy + rand(-1.2, 1.2);
  fish.push(baby);
}


function isAdult(f) {
  return f.meals >= 3;
}

function makePlantFood(x, y, amount = 1) {
  for (let i = 0; i < amount; i += 1) {
    plantFood.push({
      x: x + rand(-20, 20),
      y: y + rand(-8, 8),
      radius: rand(4, 7),
      life: 1,
      sway: rand(0, Math.PI * 2),
    });
  }
}

function updatePlantFood() {
  const target = Math.max(18, Math.floor(width / 70));
  if (plantFood.length < target && Math.random() < 0.08) {
    makePlantFood(rand(30, width - 30), height - rand(44, 92), 1);
  }
  for (let i = plantFood.length - 1; i >= 0; i -= 1) {
    plantFood[i].life -= 0.0008;
    if (plantFood[i].life <= 0) plantFood.splice(i, 1);
  }
}

function drawPlantFood(time) {
  ctx.lineCap = "round";
  for (const plant of plantFood) {
    const sway = Math.sin(time * 0.002 + plant.sway) * 4;
    ctx.strokeStyle = `rgba(107, 238, 149, ${0.35 + plant.life * 0.45})`;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(plant.x, plant.y + 12);
    ctx.quadraticCurveTo(plant.x + sway * 0.4, plant.y - 6, plant.x + sway, plant.y - plant.radius * 2.7);
    ctx.stroke();
    ctx.fillStyle = `rgba(164, 255, 138, ${0.45 + plant.life * 0.4})`;
    ctx.beginPath();
    ctx.arc(plant.x + sway, plant.y - plant.radius * 2.8, plant.radius, 0, Math.PI * 2);
    ctx.fill();
  }
}

function makePlankton(x, y, amount = 10) {
  for (let i = 0; i < amount; i += 1) {
    food.push({
      type: "plankton",
      x: x + rand(-28, 28),
      y: y + rand(-22, 22),
      vx: rand(-0.25, 0.25),
      vy: rand(-0.28, 0.05),
      radius: rand(2, 4.5),
      life: 1,
    });
  }
}

function makeWaste(x, y) {
  for (let i = 0; i < 8; i += 1) {
    waste.push({
      x: x + rand(-18, 18),
      y: y + rand(-10, 10),
      vx: rand(-0.35, 0.15),
      vy: rand(0.45, 1.1),
      radius: rand(3, 6),
      life: 1,
    });
  }
}

function updateFish(f, index) {
  // Gather nearby neighbors for the three flocking rules.
  const perception = 92;
  const avoidRadius = 26;
  let alignX = 0;
  let alignY = 0;
  let centerX = 0;
  let centerY = 0;
  let awayX = 0;
  let awayY = 0;
  let seen = 0;

  for (let i = 0; i < fish.length; i += 1) {
    if (i === index) continue;
    const other = fish[i];
    const dx = other.x - f.x;
    const dy = other.y - f.y;
    const distance = Math.hypot(dx, dy);
    if (distance > 0 && distance < perception) {
      // Alignment: add nearby fish velocity, then average it into a direction.
      const kinship = other.kind === f.kind ? 1.08 : other.species === f.species ? 1.03 : 0.96;
      alignX += other.vx * kinship;
      alignY += other.vy * kinship;
      // Cohesion: add nearby fish positions, then steer toward the group center.
      centerX += other.x;
      centerY += other.y;
      seen += 1;
      // Separation: build a direction away from fish that are too close.
      if (distance < avoidRadius) {
        awayX -= dx / distance;
        awayY -= dy / distance;
      }
    }
  }

  const alignWeight = Number(ui.align.value);
  const cohesionWeight = Number(ui.cohesion.value);
  const separateWeight = Number(ui.separate.value);
  const maxSpeed = Number(ui.speed.value) * (f.kind === "boss" ? 1.12 : f.kind === "middle" ? 1.06 : 1);

  if (seen) {
    // Average the gathered values and apply the slider strengths to velocity.
    alignX /= seen;
    alignY /= seen;
    centerX = centerX / seen - f.x;
    centerY = centerY / seen - f.y;
    const schoolBias = f.schoolBias || 1;
    const formationCalm = Math.min(1, seen / 8);
    f.vx += alignX * 0.0145 * alignWeight * schoolBias + centerX * 0.0028 * cohesionWeight * schoolBias + awayX * 0.082 * separateWeight;
    f.vy += alignY * 0.0145 * alignWeight * schoolBias + centerY * 0.0028 * cohesionWeight * schoolBias + awayY * 0.082 * separateWeight;
    f.vx += Math.cos(f.wanderPhase + f.age * 0.014) * 0.012 * (1 - formationCalm);
    f.vy += Math.sin(f.wanderPhase + f.age * 0.011) * 0.012 * (1 - formationCalm);
  }

  f.age += 1;
  if (isAdult(f)) {
    for (let i = plantFood.length - 1; i >= 0; i -= 1) {
      const plant = plantFood[i];
      const dx = plant.x - f.x;
      const dy = plant.y - f.y;
      const distance = Math.hypot(dx, dy);
      if (distance < f.size + plant.radius + 4) {
        plantFood.splice(i, 1);
        layEgg(f);
        playGrazeSound();
        continue;
      }
      if (distance < 210) {
        f.vx += (dx / (distance || 1)) * 0.035;
        f.vy += (dy / (distance || 1)) * 0.035;
      }
    }
  } else {
    for (let i = food.length - 1; i >= 0; i -= 1) {
      const pellet = food[i];
      const dx = pellet.x - f.x;
      const dy = pellet.y - f.y;
      const distance = Math.hypot(dx, dy);
      if (distance < f.size + pellet.radius + 2) {
        food.splice(i, 1);
        f.meals += pellet.type === "plankton" ? 1 : 2;
        if (isAdult(f)) f.age = Math.max(f.age, 900);
        playEatSound();
        continue;
      }
      if (distance < 180) {
        f.vx += (dx / (distance || 1)) * 0.045;
        f.vy += (dy / (distance || 1)) * 0.045;
      }
    }
  }

  const sharkDx = f.x - shark.x;
  const sharkDy = f.y - shark.y;
  const sharkDistance = Math.hypot(sharkDx, sharkDy);
  if (sharkDistance < 250) {
    const force = (250 - sharkDistance) / 250;
    f.vx += (sharkDx / (sharkDistance || 1)) * force * 1.25;
    f.vy += (sharkDy / (sharkDistance || 1)) * force * 1.25;
  }

  // Treat the pointer as a predator; closer fish flee more strongly.
  if (pointer.active) {
    const dx = f.x - pointer.x;
    const dy = f.y - pointer.y;
    const distance = Math.hypot(dx, dy);
    if (distance < 130) {
      const force = (130 - distance) / 130;
      f.vx += (dx / (distance || 1)) * force * 0.8;
      f.vy += (dy / (distance || 1)) * force * 0.8;
    }
  }

  // Steer gently inward near the edges so fish stay inside the tank.
  const margin = 70;
  if (f.x < margin) f.vx += 0.08;
  if (f.x > width - margin) f.vx -= 0.08;
  if (f.y < margin) f.vy += 0.08;
  if (f.y > height - margin) f.vy -= 0.08;

  // Limit speed before advancing position and tail motion.
  limitSpeed(f, maxSpeed);
  f.x += f.vx;
  f.y += f.vy;
  f.wiggle += 0.18;

  keepInsideTank(f, Math.max(8, f.size * 1.8));
}

function drawBackground(time) {
  const gradient = ctx.createLinearGradient(0, 0, 0, height);
  gradient.addColorStop(0, "#09272b");
  gradient.addColorStop(0.55, "#0a3a3a");
  gradient.addColorStop(1, "#071316");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  ctx.strokeStyle = "rgba(185, 244, 236, 0.08)";
  ctx.lineWidth = 1;
  for (let y = 40; y < height; y += 44) {
    ctx.beginPath();
    for (let x = 0; x <= width; x += 18) {
      const wave = Math.sin(x * 0.016 + time * 0.001 + y * 0.03) * 5;
      if (x === 0) ctx.moveTo(x, y + wave);
      else ctx.lineTo(x, y + wave);
    }
    ctx.stroke();
  }
  drawSeafloor(time);
}


function drawSeafloor(time) {
  const floorTop = height - Math.max(72, height * 0.13);
  const sand = ctx.createLinearGradient(0, floorTop, 0, height);
  sand.addColorStop(0, "rgba(73, 82, 61, 0.52)");
  sand.addColorStop(1, "rgba(32, 41, 34, 0.92)");
  ctx.fillStyle = sand;
  ctx.beginPath();
  ctx.moveTo(0, height);
  ctx.lineTo(0, floorTop + 10);
  for (let x = 0; x <= width; x += 36) {
    const ridge = Math.sin(x * 0.018) * 7 + Math.sin(x * 0.045) * 3;
    ctx.lineTo(x, floorTop + ridge);
  }
  ctx.lineTo(width, height);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = "rgba(12, 30, 27, 0.42)";
  for (let x = 18; x < width; x += 92) {
    const y = floorTop + 24 + Math.sin(x * 0.07) * 7;
    ctx.beginPath();
    ctx.ellipse(x, y, 24 + (x % 4) * 4, 8 + (x % 5), 0, 0, Math.PI * 2);
    ctx.fill();
  }

  const scale = entityScale();
  for (let x = 42; x < width; x += 118) drawSeaweed(x, floorTop + 10, time, (34 + (x % 43)) * scale);
  for (let x = 88; x < width; x += 176) drawCoral(x, floorTop + 20, (18 + (x % 31)) * scale);
  for (let x = 150; x < width; x += 240) drawBranchCoral(x, floorTop + 18, (24 + (x % 27)) * scale);
}

function drawSeaweed(x, baseY, time, heightScale) {
  ctx.strokeStyle = "rgba(92, 219, 152, 0.72)";
  ctx.lineWidth = 4 * entityScale();
  ctx.lineCap = "round";
  for (let i = 0; i < 4; i += 1) {
    const offset = (i - 1.5) * 8;
    const sway = Math.sin(time * 0.0016 + x * 0.04 + i) * 8;
    ctx.beginPath();
    ctx.moveTo(x + offset, baseY + 32);
    ctx.quadraticCurveTo(x + offset + sway * 0.4, baseY - heightScale * 0.2, x + offset + sway, baseY - heightScale);
    ctx.stroke();
  }
}

function drawCoral(x, baseY, size) {
  ctx.fillStyle = "rgba(255, 116, 132, 0.86)";
  ctx.strokeStyle = "rgba(255, 190, 174, 0.72)";
  ctx.lineWidth = 3 * entityScale();
  ctx.lineCap = "round";
  for (let i = 0; i < 6; i += 1) {
    const angle = -Math.PI / 2 + (i - 2.5) * 0.28;
    const length = size * (0.55 + i * 0.07);
    const endX = x + Math.cos(angle) * length;
    const endY = baseY + Math.sin(angle) * length;
    ctx.beginPath();
    ctx.moveTo(x, baseY + 18);
    ctx.quadraticCurveTo((x + endX) / 2, baseY - size * 0.35, endX, endY);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(endX, endY, 4, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawBranchCoral(x, baseY, size) {
  ctx.strokeStyle = "rgba(143, 214, 255, 0.68)";
  ctx.lineWidth = 4 * entityScale();
  ctx.lineCap = "round";
  const branches = [0, -0.55, 0.55, -0.92, 0.92];
  for (const angleOffset of branches) {
    const angle = -Math.PI / 2 + angleOffset;
    ctx.beginPath();
    ctx.moveTo(x, baseY + 22);
    ctx.lineTo(x + Math.cos(angle) * size, baseY + 22 + Math.sin(angle) * size);
    ctx.stroke();
  }
}

function baseStyle(f) {
  const isBoss = f.kind === "boss";
  const isMiddle = f.kind === "middle";
  return {
    body: `hsl(${f.hue} ${isBoss ? 56 : isMiddle ? 50 : 42}% ${isBoss ? 48 : isMiddle ? 52 : 54}%)`,
    accent: `hsl(${f.hue + (isBoss ? 12 : isMiddle ? 8 : 28)} ${isBoss ? 58 : isMiddle ? 52 : 46}% ${isBoss ? 40 : isMiddle ? 44 : 48}%)`,
    stroke: isBoss ? "rgba(245, 230, 185, 0.58)" : isMiddle ? "rgba(222, 234, 194, 0.42)" : "rgba(3, 24, 26, 0.28)",
    line: isBoss ? 2.5 : isMiddle ? 1.6 : 1,
  };
}

function drawClassicFish(f, style, tail) {
  ctx.fillStyle = style.body;
  ctx.strokeStyle = style.stroke;
  ctx.lineWidth = style.line;
  ctx.beginPath();
  ctx.moveTo(f.size * 2.1, 0);
  ctx.quadraticCurveTo(0, -f.size, -f.size * 1.6, 0);
  ctx.quadraticCurveTo(0, f.size, f.size * 2.1, 0);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = style.accent;
  ctx.beginPath();
  ctx.moveTo(-f.size * 1.4, 0);
  ctx.lineTo(-f.size * 2.8, -f.size * 0.8 + tail);
  ctx.lineTo(-f.size * 2.5, f.size * 0.8 + tail);
  ctx.closePath();
  ctx.fill();
}

function drawRay(f, style, tail) {
  ctx.fillStyle = style.body;
  ctx.strokeStyle = style.stroke;
  ctx.lineWidth = style.line;
  ctx.beginPath();
  ctx.moveTo(f.size * 2.2, 0);
  ctx.quadraticCurveTo(f.size * 0.2, -f.size * 1.8, -f.size * 1.4, -f.size * 0.35);
  ctx.quadraticCurveTo(-f.size * 0.8, 0, -f.size * 1.4, f.size * 0.35);
  ctx.quadraticCurveTo(f.size * 0.2, f.size * 1.8, f.size * 2.2, 0);
  ctx.fill();
  ctx.stroke();
  ctx.strokeStyle = style.accent;
  ctx.lineWidth = Math.max(1, style.line * 0.8);
  ctx.beginPath();
  ctx.moveTo(-f.size * 1.1, 0);
  ctx.lineTo(-f.size * 3.4, tail * 0.5);
  ctx.stroke();
}

function drawSquid(f, style, tail) {
  ctx.fillStyle = style.body;
  ctx.strokeStyle = style.stroke;
  ctx.lineWidth = style.line;
  ctx.beginPath();
  ctx.moveTo(f.size * 2.1, 0);
  ctx.lineTo(f.size * 0.4, -f.size * 1.15);
  ctx.quadraticCurveTo(-f.size * 1.3, -f.size * 0.8, -f.size * 1.4, 0);
  ctx.quadraticCurveTo(-f.size * 1.3, f.size * 0.8, f.size * 0.4, f.size * 1.15);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.strokeStyle = style.accent;
  for (let i = -2; i <= 2; i += 1) {
    ctx.beginPath();
    ctx.moveTo(-f.size * 1.25, i * f.size * 0.18);
    ctx.quadraticCurveTo(-f.size * 2.1, i * f.size * 0.22 + tail * 0.25, -f.size * 2.8, i * f.size * 0.34);
    ctx.stroke();
  }
}

function drawOctopus(f, style, tail) {
  ctx.fillStyle = style.body;
  ctx.strokeStyle = style.stroke;
  ctx.lineWidth = style.line;
  ctx.beginPath();
  ctx.arc(f.size * 0.45, 0, f.size * 1.08, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.strokeStyle = style.accent;
  for (let i = -3; i <= 3; i += 1) {
    ctx.beginPath();
    ctx.moveTo(-f.size * 0.45, i * f.size * 0.22);
    ctx.quadraticCurveTo(-f.size * 1.6, i * f.size * 0.28 + tail * 0.35, -f.size * 2.3, i * f.size * 0.18);
    ctx.stroke();
  }
}

function drawMola(f, style) {
  ctx.fillStyle = style.body;
  ctx.strokeStyle = style.stroke;
  ctx.lineWidth = style.line;
  ctx.beginPath();
  ctx.ellipse(f.size * 0.25, 0, f.size * 1.45, f.size * 1.05, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = style.accent;
  ctx.beginPath();
  ctx.moveTo(-f.size * 1.05, 0);
  ctx.lineTo(-f.size * 1.75, -f.size * 0.72);
  ctx.lineTo(-f.size * 1.68, f.size * 0.72);
  ctx.closePath();
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(f.size * 0.2, -f.size * 1.0);
  ctx.lineTo(f.size * 0.7, -f.size * 1.75);
  ctx.lineTo(f.size * 0.95, -f.size * 0.65);
  ctx.fill();
}

function drawFish(f) {
  const angle = Math.atan2(f.vy, f.vx);
  const tail = Math.sin(f.wiggle) * f.size * 0.45;
  const style = baseStyle(f);
  ctx.save();
  ctx.translate(f.x, f.y);
  ctx.rotate(angle);

  if (f.species === "ray") drawRay(f, style, tail);
  else if (f.species === "squid") drawSquid(f, style, tail);
  else if (f.species === "octopus") drawOctopus(f, style, tail);
  else if (f.species === "mola") drawMola(f, style);
  else drawClassicFish(f, style, tail);

  if (f.kind === "boss") {
    ctx.fillStyle = "rgba(255, 250, 210, 0.95)";
    ctx.beginPath();
    ctx.arc(f.size * 1.05, -f.size * 0.28, Math.max(1.8, f.size * 0.14), 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

function drawFood() {
  for (const pellet of food) {
    ctx.fillStyle = pellet.type === "plankton" ? `rgba(126, 255, 198, ${pellet.life})` : `rgba(255, 205, 92, ${pellet.life})`;
    ctx.beginPath();
    ctx.arc(pellet.x, pellet.y, pellet.radius, 0, Math.PI * 2);
    ctx.fill();
    pellet.life -= 0.0025;
    pellet.radius *= 0.997;
  }
  for (let i = food.length - 1; i >= 0; i -= 1) {
    if (food[i].life <= 0.05) food.splice(i, 1);
  }
}


function reduceSlider(input, amount = 1) {
  input.value = Math.max(Number(input.min), Number(input.value) - amount);
}

function reduceCountsForPrey(prey) {
  const speciesInputs = {
    fish: ui.fishShapeCount,
    ray: ui.rayCount,
    octopus: ui.octopusCount,
    squid: ui.squidCount,
    mola: ui.molaCount,
  };
  const kindInputs = {
    normal: ui.smallCount,
    middle: ui.middleCount,
    boss: ui.bossCount,
  };
  reduceSlider(speciesInputs[prey.species]);
  reduceSlider(kindInputs[prey.kind]);
  saveSettings();
}


function makeRedCloud(x, y, amount = 34) {
  for (let i = 0; i < amount; i += 1) {
    redClouds.push({
      x: x + rand(-20, 20),
      y: y + rand(-16, 16),
      vx: rand(-1.4, 1.4),
      vy: rand(-1.0, 1.0),
      radius: rand(5, 14),
      life: 1,
    });
  }
}

function hatchManyEggs(limit = 90) {
  let hatched = 0;
  for (let i = eggs.length - 1; i >= 0 && hatched < limit; i -= 1) {
    hatchEgg(eggs[i]);
    eggs.splice(i, 1);
    hatched += 1;
  }
}

function diverBoundsRadius() {
  return 78 * entityScale();
}
function isSharkWaitingForDiver() {
  return gameState.started && !diver.active && diver.timer >= Math.max(0, diver.spawnAt - 300);
}

function holdSharkForDiverStandby(targetY = height * 0.5) {
  const margin = shark.size * 3.2;
  shark.x = Math.max(margin, width - margin);
  shark.y += (targetY - shark.y) * 0.045;
  shark.y = Math.max(shark.size * 1.8, Math.min(height - shark.size * 1.8, shark.y));
  shark.vx *= 0.68;
  shark.vy *= 0.68;
}

function spawnDiver() {
  diver.active = true;
  diver.x = diverBoundsRadius();
  diver.y = rand(diverBoundsRadius(), Math.max(diverBoundsRadius(), height - diverBoundsRadius()));
  holdSharkForDiverStandby(diver.y);
  shark.vx = -Math.abs(rand(1.2, 2.4) * shark.speedMood * sharkMovementScale());
  shark.vy = rand(-0.18, 0.18);
  shark.nextSpeedChangeAt = performance.now() + rand(1800, 3600);
  diver.vx = rand(0.9, 1.25);
  diver.vy = rand(-0.12, 0.12);
  diver.timer = 0;
  diver.survivalTimer = 0;
  diver.entered = false;
  diver.stamina = 1;
  diver.fleeing = false;
  diver.hiddenInSchool = false;
  diver.schoolCover = 0;
}

function updateDiver() {
  if (!gameState.started) return;
  if (!diver.active) {
    diver.timer += 1;
    if (diver.timer > diver.spawnAt) spawnDiver();
    return;
  }

  diver.timer += 1;
  const sharkDx = diver.x - shark.x;
  const sharkDy = diver.y - shark.y;
  const sharkDistance = Math.hypot(sharkDx, sharkDy);
  const nearbyFish = fish.reduce((count, f) => count + (Math.hypot(f.x - diver.x, f.y - diver.y) < 135 ? 1 : 0), 0);
  diver.schoolCover = Math.min(1, nearbyFish / 8);
  diver.hiddenInSchool = nearbyFish >= 5;
  diver.fleeing = sharkDistance < 310 && !diver.hiddenInSchool;

  const keyboardX = (keys.ArrowRight ? 1 : 0) - (keys.ArrowLeft ? 1 : 0);
  const keyboardY = (keys.ArrowDown ? 1 : 0) - (keys.ArrowUp ? 1 : 0);
  const inputX = keyboardX || joystick.x;
  const inputY = keyboardY || joystick.y;
  const inputLength = Math.hypot(inputX, inputY);
  if (inputLength > 0) {
    const thrust = diver.fleeing ? 0.42 : 0.34;
    diver.vx += (inputX / inputLength) * thrust;
    diver.vy += (inputY / inputLength) * thrust;
  } else {
    diver.vx += 0.016;
    diver.vy += Math.sin(diver.timer * 0.025) * 0.012;
  }

  if (diver.fleeing) {
    diver.stamina = Math.max(0, diver.stamina - 0.0048);
  } else {
    diver.stamina = Math.min(1, diver.stamina + 0.0012);
  }

  const hasInput = inputLength > 0;
  const maxDiverSpeed = hasInput ? 5.8 : 2.2;
  limitSpeed(diver, maxDiverSpeed);
  diver.x += diver.vx;
  diver.y += diver.vy + Math.sin(diver.timer * 0.035) * 0.18;
  if (diver.y < diverBoundsRadius()) diver.vy += 0.08;
  if (diver.y > height - diverBoundsRadius()) diver.vy -= 0.08;
  if (!diver.entered && diver.x >= 0) {
    diver.entered = true;
    diver.survivalTimer = 0;
  }
  if (diver.entered) diver.survivalTimer += 1;
  keepInsideTank(diver, diverBoundsRadius(), 0.2);
}

function triggerDiverEvent() {
  if (gameState.over) return;
  makeRedCloud(diver.x, diver.y, 48);
  makeWaste(diver.x, diver.y);
  makeWaste(diver.x + rand(-18, 18), diver.y + rand(-18, 18));
  makePlankton(diver.x, diver.y, 80);
  hatchManyEggs(120);
  playImpactSound();
  diver.active = false;
  diver.timer = 0;
  diver.spawnAt = rand(1200, 2200);
  shark.fullness = 0;
  showResult("gameover");
}

function updateRedClouds() {
  for (let i = redClouds.length - 1; i >= 0; i -= 1) {
    const cloud = redClouds[i];
    cloud.x += cloud.vx;
    cloud.y += cloud.vy;
    cloud.vx *= 0.982;
    cloud.vy *= 0.982;
    cloud.radius *= 1.006;
    cloud.life -= 0.006;
    if (cloud.life <= 0) redClouds.splice(i, 1);
  }
}

function drawRedClouds() {
  for (const cloud of redClouds) {
    ctx.fillStyle = `rgba(156, 18, 38, ${cloud.life * 0.38})`;
    ctx.beginPath();
    ctx.arc(cloud.x, cloud.y, cloud.radius, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawDiver() {
  if (!diver.active) return;
  const kick = Math.sin(diver.timer * 0.14) * 8;
  ctx.save();
  ctx.translate(diver.x, diver.y);
  ctx.scale(entityScale(), entityScale());
  ctx.rotate(Math.sin(diver.timer * 0.03) * 0.08);
  ctx.lineCap = "round";

  ctx.fillStyle = "rgba(255, 42, 80, 0.99)";
  ctx.strokeStyle = "rgba(255, 255, 235, 0.98)";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(0, -18, 13, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = "rgba(255, 208, 35, 0.99)";
  ctx.strokeStyle = "rgba(6, 28, 38, 0.98)";
  ctx.lineWidth = 3;
  ctx.fillRect(-13, -5, 26, 34);
  ctx.strokeRect(-13, -5, 26, 34);

  ctx.strokeStyle = diver.hiddenInSchool ? "rgba(128, 255, 154, 0.98)" : diver.fleeing ? "rgba(0, 238, 255, 0.98)" : "rgba(248, 255, 255, 0.98)";
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(-10, 2);
  ctx.lineTo(-32, 12 + kick * 0.4);
  ctx.moveTo(10, 2);
  ctx.lineTo(32, 12 - kick * 0.4);
  ctx.moveTo(-7, 28);
  ctx.lineTo(-22, 52 + kick);
  ctx.moveTo(7, 28);
  ctx.lineTo(24, 52 - kick);
  ctx.stroke();

  ctx.fillStyle = "rgba(0, 242, 255, 0.98)";
  ctx.fillRect(-28, 51 + kick, 20, 6);
  ctx.fillRect(13, 51 - kick, 20, 6);
  ctx.fillStyle = "rgba(255, 64, 112, 0.98)";
  ctx.fillRect(-16, -24, 32, 6);

  ctx.fillStyle = "rgba(5, 18, 22, 0.7)";
  ctx.fillRect(-24, -42, 48, 5);
  ctx.fillStyle = diver.stamina > 0.25 ? "rgba(110, 255, 142, 0.95)" : "rgba(255, 68, 68, 0.95)";
  ctx.fillRect(-24, -42, 48 * diver.stamina, 5);
  ctx.restore();
}

function updateShark() {
  shark.hunger += 0.004;
  shark.wiggle += 0.12;
  if (isSharkWaitingForDiver()) {
    holdSharkForDiverStandby(height * 0.5 + Math.sin(diver.timer * 0.025) * height * 0.18);
    return;
  }
  maybeRandomizeSharkSpeed();
  let target = null;
  let nearest = Infinity;

  if (diver.active) {
    target = diver;
    nearest = Math.hypot(diver.x - shark.x, diver.y - shark.y);
    if (diver.hiddenInSchool && Math.random() < 0.72) {
      const decoys = fish.filter((f) => Math.hypot(f.x - diver.x, f.y - diver.y) < 155);
      if (decoys.length) {
        target = decoys[Math.floor(Math.random() * decoys.length)];
        nearest = Math.hypot(target.x - shark.x, target.y - shark.y);
      }
    }
  } else {
    for (const candidate of fish) {
      const distance = Math.hypot(candidate.x - shark.x, candidate.y - shark.y);
      if (distance < nearest) {
        nearest = distance;
        target = candidate;
      }
    }
  }

  if (target && (nearest < 360 || diver.active)) {
    const dx = target.x - shark.x;
    const dy = target.y - shark.y;
    const distance = Math.hypot(dx, dy) || 1;
    const level = difficultyLevels[gameState.level];
    const confusion = diver.active && diver.hiddenInSchool ? 1 - diver.schoolCover * 0.62 : 1;
    const chaseBoost = diver.active ? level.chaseBoost * sharkMovementScale() * shark.speedMood * confusion : shark.chasePower;
    shark.vx += (dx / distance) * chaseBoost;
    shark.vy += (dy / distance) * chaseBoost;
  } else {
    shark.vx += Math.sin(performance.now() * 0.0004) * 0.025;
    shark.vy += Math.sin(performance.now() * 0.0007 + 2) * 0.025;
  }

  const level = difficultyLevels[gameState.level];
  const confusionSpeed = diver.active && diver.hiddenInSchool ? 1 - diver.schoolCover * 0.34 : 1;
  const maxSpeed = (diver.active ? level.sharkMax * shark.speedMood * confusionSpeed : 3.2 + shark.speedMood * 2.4 + Math.min(shark.hunger, 1.6)) * sharkMovementScale();
  limitSpeed(shark, maxSpeed);
  shark.x += shark.vx;
  shark.y += shark.vy;

  if (shark.y < shark.size * 1.8) shark.vy += 0.18;
  if (shark.y > height - shark.size * 1.8) shark.vy -= 0.18;
  keepInsideTank(shark, shark.size * 2.8, 0.35);

  if (diver.active && Math.hypot(diver.x - shark.x, diver.y - shark.y) < shark.size * difficultyLevels[gameState.level].diverBite) {
    triggerDiverEvent();
    return;
  }

  for (let i = fish.length - 1; i >= 0; i -= 1) {
    const prey = fish[i];
    const distance = Math.hypot(prey.x - shark.x, prey.y - shark.y);
    const biteRange = (shark.size * (0.68 + shark.speedMood * 0.16) + prey.size) * difficultyLevels[gameState.level].fishBite;
    if (distance < biteRange) {
      fish.splice(i, 1);
      reduceCountsForPrey(prey);
      shark.hunger = 0;
      shark.fullness += prey.kind === "boss" ? 2 : 1;
      if (shark.fullness >= 3) {
        makeWaste(shark.x - shark.size * 1.3, shark.y + shark.size * 0.25);
        shark.fullness = 0;
      }
      playBiteSound();
      break;
    }
  }
}

function drawShark() {
  const angle = Math.atan2(shark.vy, shark.vx);
  const tail = Math.sin(shark.wiggle) * shark.size * 0.32;
  ctx.save();
  ctx.translate(shark.x, shark.y);
  ctx.rotate(angle);
  const sharkBody = ctx.createLinearGradient(-shark.size * 1.8, -shark.size, shark.size * 2.8, shark.size);
  sharkBody.addColorStop(0, "rgba(160, 96, 255, 0.98)");
  sharkBody.addColorStop(0.48, "rgba(255, 82, 184, 0.98)");
  sharkBody.addColorStop(1, "rgba(255, 174, 214, 0.98)");
  ctx.fillStyle = sharkBody;
  ctx.strokeStyle = "rgba(255, 244, 252, 0.58)";
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(shark.size * 2.7, 0);
  ctx.quadraticCurveTo(shark.size * 0.35, -shark.size * 0.92, -shark.size * 1.65, -shark.size * 0.42);
  ctx.quadraticCurveTo(-shark.size * 0.95, 0, -shark.size * 1.65, shark.size * 0.42);
  ctx.quadraticCurveTo(shark.size * 0.35, shark.size * 0.92, shark.size * 2.7, 0);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = "rgba(126, 83, 255, 0.98)";
  ctx.beginPath();
  ctx.moveTo(-shark.size * 1.35, 0);
  ctx.lineTo(-shark.size * 2.5, -shark.size * 0.95 + tail);
  ctx.lineTo(-shark.size * 2.34, shark.size * 0.95 + tail);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = "rgba(0, 214, 255, 0.96)";
  ctx.beginPath();
  ctx.moveTo(shark.size * 0.1, -shark.size * 0.78);
  ctx.lineTo(shark.size * 0.75, -shark.size * 1.65);
  ctx.lineTo(shark.size * 0.95, -shark.size * 0.45);
  ctx.fill();

  ctx.fillStyle = "rgba(8, 16, 18, 0.95)";
  ctx.beginPath();
  ctx.arc(shark.size * 1.62, -shark.size * 0.2, shark.size * 0.08, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = "rgba(82, 0, 38, 0.92)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(shark.size * 1.8, shark.size * 0.22);
  ctx.lineTo(shark.size * 2.38, shark.size * 0.05);
  ctx.stroke();
  ctx.restore();
}

function updateWaste() {
  for (let i = waste.length - 1; i >= 0; i -= 1) {
    const particle = waste[i];
    particle.x += particle.vx;
    particle.y += particle.vy;
    particle.vy *= 0.992;
    particle.life -= 0.004;
    if (particle.life < 0.42 || particle.y > height - 38) {
      makePlankton(particle.x, particle.y, 7);
      waste.splice(i, 1);
    }
  }

  for (const pellet of food) {
    if (pellet.type !== "plankton") continue;
    pellet.x += pellet.vx || 0;
    pellet.y += pellet.vy || 0;
    pellet.vx = (pellet.vx || 0) + Math.sin(performance.now() * 0.001 + pellet.x) * 0.002;
    pellet.vy = Math.max(-0.35, (pellet.vy || 0) - 0.001);
  }
}

function drawWaste() {
  for (const particle of waste) {
    ctx.fillStyle = `rgba(115, 76, 44, ${particle.life * 0.72})`;
    ctx.beginPath();
    ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
    ctx.fill();
  }
}


function survivalSeconds() {
  return Math.max(0, diver.survivalTimer / 60);
}

function formatSeconds(seconds) {
  return `${seconds.toFixed(1)}s`;
}

function readBestScore() {
  try {
    return Number(localStorage.getItem(BEST_SCORE_KEY) || 0) || 0;
  } catch (error) {
    return 0;
  }
}

function writeBestScore(score) {
  try {
    localStorage.setItem(BEST_SCORE_KEY, String(score));
  } catch (error) {
    // Keep the score in-memory only when localStorage is unavailable.
  }
}

function buildResultScore(result) {
  const score = survivalSeconds();
  const previousBest = readBestScore();
  const isRecord = score > previousBest;
  if (isRecord) writeBestScore(score);
  const best = Math.max(score, previousBest);
  const title = result === "gameover" && isRecord ? t("newRecord") : result === "gameover" ? t("gameOver") : t("survived");
  const detail = isRecord ? `${t("previous")} ${formatSeconds(previousBest)}` : `${t("best")} ${formatSeconds(best)}`;
  return { title, score, isRecord, html: `<span class="scoreLabel">${t("score")}</span><strong>${formatSeconds(score)}</strong><span>${detail}</span>` };
}

function showResult(result) {
  resetJoystick();
  if (ui.startOverlay) ui.startOverlay.hidden = true;
  if (ui.touchControls) ui.touchControls.hidden = true;
  gameState.over = true;
  gameState.result = result;
  winMessage.active = true;
  winMessage.timer = Infinity;
  const scoreResult = buildResultScore(result);
  if (ui.resultTitle) ui.resultTitle.textContent = scoreResult.title;
  if (ui.resultScore) {
    ui.resultScore.innerHTML = scoreResult.html;
    ui.resultScore.classList.toggle("record", scoreResult.isRecord);
    ui.resultScore.classList.toggle("standard", !scoreResult.isRecord);
  }
  if (ui.resultOverlay) {
    ui.resultOverlay.classList.toggle("win", false);
    ui.resultOverlay.classList.toggle("record", scoreResult.isRecord);
    ui.resultOverlay.classList.toggle("gameover", result === "gameover" && !scoreResult.isRecord);
    ui.resultOverlay.hidden = false;
  }
  playResultMusic(result);
}

function showWinMessage() {
  showResult("win");
}

function updateWinMessage() {
  if (!winMessage.active) return;
  winMessage.timer -= 1;
  if (winMessage.timer <= 0) winMessage.active = false;
}

function drawGameTimer() {
  if (gameState.mode === "view") return;
  let label = gameState.started ? `${t("diverIn")} 5` : t("selectLevel");
  let seconds = null;

  if (diver.active && diver.entered) {
    seconds = survivalSeconds();
    label = formatSeconds(seconds);
  } else if (diver.active) {
    label = t("enterWater");
  } else if (!gameState.started) {
    label = t("selectLevel");
  } else if (!gameState.over) {
    seconds = Math.max(0, Math.ceil((diver.spawnAt - diver.timer) / 60));
    label = `${t("diverIn")} ${seconds}`;
  } else if (gameState.result === "gameover") {
    label = formatSeconds(survivalSeconds());
  }

  ctx.save();
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "rgba(3, 18, 22, 0.62)";
  ctx.strokeStyle = "rgba(190, 239, 231, 0.26)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.roundRect(width / 2 - 110, 22, 220, 54, 8);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = "rgba(190, 239, 231, 0.88)";
  ctx.font = "800 11px Segoe UI, sans-serif";
  const timerTitle = gameState.started ? `${t("survival")} / ${difficultyLevels[gameState.level].label}` : t("selectLevel");
  ctx.fillText(timerTitle, width / 2, 36);
  ctx.fillStyle = "#f8fffb";
  ctx.font = label.length > 8 ? "900 18px Segoe UI, sans-serif" : "900 28px Segoe UI, sans-serif";
  ctx.fillText(label, width / 2, 59);
  ctx.restore();
}
function drawWinMessage() {
  if (!winMessage.active) return;
  ctx.save();
  ctx.fillStyle = "rgba(5, 18, 22, 0.58)";
  ctx.fillRect(0, 0, width, height);
  ctx.fillStyle = "rgba(255, 246, 110, 0.98)";
  ctx.strokeStyle = "rgba(15, 55, 60, 0.95)";
  ctx.lineWidth = 6;
  ctx.font = `900 ${Math.min(92, Math.max(44, width * 0.09))}px Segoe UI, sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  const message = gameState.result === "gameover" ? t("gameOver") : t("survived");
  ctx.strokeText(message, width / 2, height * 0.42);
  ctx.fillText(message, width / 2, height * 0.42);
  ctx.restore();
}
function drawPointer() {
  if (!pointer.active) return;
  ctx.strokeStyle = "rgba(255, 122, 168, 0.35)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(pointer.x, pointer.y, 130, 0, Math.PI * 2);
  ctx.stroke();
}

function loop(time) {
  const delta = time - lastUpdateTime;
  if (delta < 1000 / 64) {
    requestAnimationFrame(loop);
    return;
  }
  lastUpdateTime = time;
  lastTime = time;
  fpsSmoother = fpsSmoother * 0.92 + (1000 / Math.max(delta, 1)) * 0.08;
  ui.fps.textContent = Math.round(fpsSmoother);

  if (!gameState.over) syncFishCount();
  drawBackground(time);
  if (!gameState.over) {
    updateWaste();
    updatePlantFood();
    updateRedClouds();
    updateDiver();
    updateWinMessage();
    updateEggs();
  }
  drawWaste();
  drawPlantFood(time);
  drawRedClouds();
  drawFood();
  drawEggs();
  drawDiver();
  drawPointer();
  if (!gameState.over) {
    fish.forEach(updateFish);
    updateShark();
  }
  fish.forEach(drawFish);
  drawShark();
  drawGameTimer();
  drawWinMessage();
  requestAnimationFrame(loop);
}

function canvasPoint(event) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top,
  };
}

canvas.addEventListener("pointermove", (event) => {
  const point = canvasPoint(event);
  const now = performance.now();
  const elapsed = Math.max(now - pointer.lastMoveAt, 16);
  const moved = Math.hypot(point.x - pointer.x, point.y - pointer.y);
  pointer.lastX = pointer.x;
  pointer.lastY = pointer.y;
  pointer.x = point.x;
  pointer.y = point.y;
  pointer.speed = pointer.speed * 0.7 + (moved / elapsed) * 16.67 * 0.3;
  pointer.lastMoveAt = now;
  pointer.active = true;
});

canvas.addEventListener("pointerleave", () => {
  pointer.active = false;
  pointer.speed = 0;
});

canvas.addEventListener("click", (event) => {
  audio();
  startAquariumBgm();
  const point = canvasPoint(event);
  for (let i = 0; i < 9; i += 1) {
    food.push({
      x: point.x + rand(-18, 18),
      y: point.y + rand(-18, 18),
      radius: rand(3, 7),
      life: 1,
    });
  }
});


window.addEventListener("keydown", (event) => {
  if (event.key in keys) {
    keys[event.key] = true;
    startAquariumBgm();
    event.preventDefault();
  }
});

window.addEventListener("keyup", (event) => {
  if (event.key in keys) {
    keys[event.key] = false;
    event.preventDefault();
  }
});

ui.reset.addEventListener("click", () => reset(true));
if (ui.playAgain) ui.playAgain.addEventListener("click", () => reset(true));
if (ui.update) ui.update.addEventListener("click", updateToLatest);
if (ui.language) ui.language.addEventListener("change", () => {
  saveLanguage(ui.language.value);
  applyLanguage();
});
ui.deviceButtons.forEach((button) => {
  button.addEventListener("click", () => {
    gameState.device = button.dataset.device || "pc";
    updateStartControls();
  });
});
ui.levelButtons.forEach((button) => {
  button.addEventListener("click", () => {
    gameState.level = button.dataset.level || "middle";
    updateStartControls();
  });
});
if (ui.start) ui.start.addEventListener("click", startGame);
if (ui.viewStart) ui.viewStart.addEventListener("click", startGame);
if (ui.view) ui.view.addEventListener("click", startViewMode);
if (ui.setup) ui.setup.addEventListener("click", () => reset(true));
function togglePanel(event) {
  event.preventDefault();
  event.stopPropagation();
  setPanelOpen(!ui.panel.classList.contains("open"));
}

function closePanel(event) {
  event.preventDefault();
  event.stopPropagation();
  setPanelOpen(false);
}

if (ui.panelToggle) {
  ui.panelToggle.addEventListener("pointerdown", togglePanel);
}
if (ui.panelClose) {
  ui.panelClose.addEventListener("pointerdown", closePanel);
}
if (ui.panel) {
  ui.panel.addEventListener("pointerdown", (event) => event.stopPropagation());
}
window.addEventListener("pointerdown", (event) => {
  if (!ui.panel || !ui.panel.classList.contains("open")) return;
  if (event.target === ui.panelToggle) return;
  if (ui.panel.contains(event.target)) return;
  setPanelOpen(false);
});
function updateJoystick(event) {
  if (!ui.joystickBase || !ui.joystickKnob) return;
  const rect = ui.joystickBase.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  const maxDistance = rect.width * 0.34;
  const rawX = event.clientX - centerX;
  const rawY = event.clientY - centerY;
  const distance = Math.hypot(rawX, rawY);
  const clamped = Math.min(distance, maxDistance);
  const angle = Math.atan2(rawY, rawX);
  const knobX = distance > 0 ? Math.cos(angle) * clamped : 0;
  const knobY = distance > 0 ? Math.sin(angle) * clamped : 0;
  joystick.x = maxDistance > 0 ? knobX / maxDistance : 0;
  joystick.y = maxDistance > 0 ? knobY / maxDistance : 0;
  ui.joystickKnob.style.transform = `translate(calc(-50% + ${knobX}px), calc(-50% + ${knobY}px))`;
}

function resetJoystick() {
  joystick.x = 0;
  joystick.y = 0;
  joystick.active = false;
  joystick.pointerId = null;
  if (ui.joystickKnob) ui.joystickKnob.style.transform = "translate(-50%, -50%)";
}

if (ui.joystickBase) {
  ui.joystickBase.addEventListener("pointerdown", (event) => {
    event.preventDefault();
    joystick.active = true;
    joystick.pointerId = event.pointerId;
    ui.joystickBase.setPointerCapture(event.pointerId);
    updateJoystick(event);
    startAquariumBgm();
  });
  ui.joystickBase.addEventListener("pointermove", (event) => {
    if (!joystick.active || joystick.pointerId !== event.pointerId) return;
    event.preventDefault();
    updateJoystick(event);
  });
  ui.joystickBase.addEventListener("pointerup", (event) => {
    if (joystick.pointerId === event.pointerId) resetJoystick();
  });
  ui.joystickBase.addEventListener("pointercancel", resetJoystick);
  ui.joystickBase.addEventListener("lostpointercapture", resetJoystick);
}
window.addEventListener("resize", resize);

loadSettings();
loadLanguage();
applyLanguage();
connectSettingPersistence();
resize();
reset();
requestAnimationFrame(loop);





















