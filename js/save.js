(() => {
  const PRIMARY_KEY = 'petMathPermanent';
  const BACKUP_KEY = 'petMathPermanentBackup';
  const DAILY_BACKUP_KEY = 'petMathDailyBackup';
  const CURRENT_VERSION = 13;
  const LEGACY_KEYS = ['petMathV10', 'petMathV8', 'petMathV5'];

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function safeParse(raw) {
    if (!raw) return null;
    try {
      const parsed = JSON.parse(raw);
      return parsed && typeof parsed === 'object' ? parsed : null;
    } catch {
      return null;
    }
  }

  function readFirstValid() {
    const candidates = [
      localStorage.getItem(PRIMARY_KEY),
      localStorage.getItem(BACKUP_KEY),
      localStorage.getItem(DAILY_BACKUP_KEY),
      ...LEGACY_KEYS.map(key => localStorage.getItem(key))
    ];
    for (const raw of candidates) {
      const parsed = safeParse(raw);
      if (parsed) return parsed;
    }
    return null;
  }

  function migrate(saved, defaults, todayKey) {
    const merged = Object.assign(clone(defaults), saved || {});
    merged.player = Object.assign(clone(defaults.player), (saved && saved.player) || {});
    merged.inventory = Object.assign(clone(defaults.inventory), (saved && saved.inventory) || {});
    merged.pets = Object.assign(clone(defaults.pets), (saved && saved.pets) || {});
    merged.daily = Object.assign(clone(defaults.daily), (saved && saved.daily) || {});
    merged.login = Object.assign(clone(defaults.login), (saved && saved.login) || {});
    merged.chest = Object.assign(clone(defaults.chest), (saved && saved.chest) || {});
    merged.typeStats = Object.assign({}, (saved && saved.typeStats) || {});
    merged.recent = Array.isArray(saved && saved.recent) ? saved.recent.slice(-20) : [];

    Object.keys(defaults.pets).forEach(key => {
      const oldPet = saved && saved.pets && saved.pets[key];
      merged.pets[key] = Object.assign(clone(defaults.pets[key]), merged.pets[key] || {});
      if (!oldPet || oldPet.correct == null) {
        merged.pets[key].correct = key === merged.pet ? Number((saved && saved.correct) || 0) : 0;
      }
      merged.pets[key].hunger = Math.max(0, Math.min(100, Number(merged.pets[key].hunger ?? 50)));
      merged.pets[key].stagePenalty = Number(merged.pets[key].stagePenalty || 0);
      merged.pets[key].starved = Boolean(merged.pets[key].starved);
      merged.pets[key].interactions = Number(merged.pets[key].interactions || 0);
      merged.pets[key].lastFedAt = Number(merged.pets[key].lastFedAt || 0);
    });

    merged.coins = Math.max(0, Number(merged.coins || 0));
    merged.correct = Number(merged.correct || 0);
    merged.combo = Number(merged.combo || 0);
    merged.ability = Number(merged.ability || 100);
    merged.grade = Math.max(1, Math.min(8, Number(merged.grade || 1)));
    merged.lastHungerUpdate = Number(merged.lastHungerUpdate || Date.now());
    merged.storageVersion = CURRENT_VERSION;
    merged.updatedAt = Date.now();

    if (merged.daily.date !== todayKey) {
      merged.daily = {
        date: todayKey,
        answered: 0,
        correct: 0,
        feeds: 0,
        maxCombo: 0,
        gachaUsed: false
      };
    }
    return merged;
  }

  function writeBackups(state) {
    const serialized = JSON.stringify(state);
    const previous = localStorage.getItem(PRIMARY_KEY);
    if (previous) localStorage.setItem(BACKUP_KEY, previous);
    localStorage.setItem(PRIMARY_KEY, serialized);

    const today = new Date().toISOString().slice(0, 10);
    const daily = safeParse(localStorage.getItem(DAILY_BACKUP_KEY));
    if (!daily || daily.backupDate !== today) {
      localStorage.setItem(DAILY_BACKUP_KEY, JSON.stringify({
        backupDate: today,
        storageVersion: CURRENT_VERSION,
        state
      }));
    }
  }

  function load(defaults, todayKey) {
    let saved = readFirstValid();
    if (saved && saved.state && saved.backupDate) saved = saved.state;
    const migrated = migrate(saved, defaults, todayKey);
    writeBackups(migrated);
    return migrated;
  }

  function save(state) {
    const clean = clone(state);
    clean.storageVersion = CURRENT_VERSION;
    clean.updatedAt = Date.now();
    writeBackups(clean);
  }

  function exportToFile(state) {
    const payload = {
      app: '萌寵數學餵養樂園',
      storageVersion: CURRENT_VERSION,
      exportedAt: new Date().toISOString(),
      state: clone(state)
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], {type: 'application/json'});
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const stamp = new Date().toISOString().slice(0, 10);
    link.href = url;
    link.download = `萌寵數學存檔_${stamp}.json`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }

  async function importFromFile(file, defaults, todayKey) {
    const text = await file.text();
    const parsed = safeParse(text);
    if (!parsed) throw new Error('檔案不是有效的 JSON 存檔');
    const rawState = parsed.state || parsed;
    if (!rawState || typeof rawState !== 'object') throw new Error('找不到遊戲資料');
    return migrate(rawState, defaults, todayKey);
  }

  window.SaveSystem = {
    version: CURRENT_VERSION,
    load,
    save,
    exportToFile,
    importFromFile
  };
})();