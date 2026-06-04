const STORAGE_KEY = 'wc_simulator_tournaments';

export const tournamentStorage = {
  getAll() {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  },

  get(id) {
    const all = this.getAll();
    return all.find(t => t.id === id) || null;
  },

  save(tournament) {
    const all = this.getAll();
    const index = all.findIndex(t => t.id === tournament.id);
    if (index >= 0) {
      all[index] = { ...tournament, updatedAt: Date.now() };
    } else {
      all.push({ ...tournament, createdAt: Date.now(), updatedAt: Date.now() });
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
    return tournament;
  },

  delete(id) {
    const all = this.getAll().filter(t => t.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  },

  generateId() {
    return `t_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  }
};