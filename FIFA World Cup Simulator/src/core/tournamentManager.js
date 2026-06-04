// Tournament Manager - Orchestrates engine + storage
import { tournamentStorage } from '../storage/tournamentStorage';
import { PHASES } from './engine';
import { getAllCountries } from './countries';

export function createTournament({ name, format, hosts, rankingMode }) {
  const id = tournamentStorage.generateId();
  const allCountries = getAllCountries();
  
  // Apply ranking mode
  let countries = allCountries;
  if (rankingMode === 'random') {
    countries = allCountries.map(c => ({
      ...c,
      ranking: Math.floor(Math.random() * 200) + 1
    }));
  }
  // 'custom' mode lets user edit rankings later
  // 'real' mode keeps default rankings

  const tournament = {
    id,
    name,
    format,
    hosts,
    rankingMode,
    phase: PHASES.CREATED,
    countries,
    qualified: [],
    playoffTeams: [],
    playoffResults: [],
    groups: {},
    pots: [],
    groupMatches: {},
    standings: {},
    knockout: null,
    champion: null
  };

  tournamentStorage.save(tournament);
  return tournament;
}

export function updateTournament(id, updates) {
  const tournament = tournamentStorage.get(id);
  if (!tournament) return null;
  const updated = { ...tournament, ...updates };
  tournamentStorage.save(updated);
  return updated;
}

export function getTournament(id) {
  return tournamentStorage.get(id);
}

export function getAllTournaments() {
  return tournamentStorage.getAll();
}

export function deleteTournament(id) {
  tournamentStorage.delete(id);
}