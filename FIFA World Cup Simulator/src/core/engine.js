// Tournament Engine - Core logic separated from UI
import { FIFA_SLOTS, CONFEDERATIONS } from './countries';

// ============ MATCH SIMULATION ============

export function simulateMatch(teamA, teamB, allowDraw = true) {
  const strengthA = getTeamStrength(teamA);
  const strengthB = getTeamStrength(teamB);
  const total = strengthA + strengthB;
  
  let goalsA = generateGoals(strengthA / total);
  let goalsB = generateGoals(strengthB / total);
  
  if (!allowDraw && goalsA === goalsB) {
    // Extra time
    const extraA = Math.random() < strengthA / total ? Math.floor(Math.random() * 2) + 1 : 0;
    const extraB = Math.random() < strengthB / total ? Math.floor(Math.random() * 2) + 1 : 0;
    goalsA += extraA;
    goalsB += extraB;
    
    if (goalsA === goalsB) {
      // Penalties
      const penA = simulatePenalties();
      const penB = simulatePenalties();
      return {
        teamA: teamA.name,
        teamB: teamB.name,
        goalsA,
        goalsB,
        penaltiesA: Math.max(penA, penB === penA ? penA + 1 : penA),
        penaltiesB: Math.min(penB, penA === penB ? penB : penB),
        winner: penA >= penB ? teamA.name : teamB.name,
        extraTime: true,
        penalties: true
      };
    }
    
    return {
      teamA: teamA.name,
      teamB: teamB.name,
      goalsA,
      goalsB,
      winner: goalsA > goalsB ? teamA.name : teamB.name,
      extraTime: true,
      penalties: false
    };
  }
  
  return {
    teamA: teamA.name,
    teamB: teamB.name,
    goalsA,
    goalsB,
    winner: goalsA > goalsB ? teamA.name : (goalsB > goalsA ? teamB.name : 'draw'),
    extraTime: false,
    penalties: false
  };
}

function getTeamStrength(team) {
  const ranking = team.ranking || 100;
  // Convert ranking to strength (lower ranking = stronger)
  return Math.max(10, 210 - ranking) + (Math.random() * 30 - 15);
}

function generateGoals(winProb) {
  const base = Math.random() * 3;
  const bonus = winProb > 0.5 ? Math.random() * 2 : 0;
  return Math.floor(base + bonus);
}

function simulatePenalties() {
  let score = 0;
  for (let i = 0; i < 5; i++) {
    if (Math.random() > 0.25) score++;
  }
  return score;
}

// ============ QUALIFICATION SLOTS ============

export function getSlots(format, hosts) {
  const slots = JSON.parse(JSON.stringify(FIFA_SLOTS[format]));
  // Hosts auto-qualify - adjust confederation slots
  hosts.forEach(host => {
    if (host.confederation && slots[host.confederation]) {
      // Host counts against its confederation's direct slots
      // No adjustment needed since host is picked from qualified
    }
  });
  return slots;
}

// ============ GROUP STAGE ============

// FIFA fixed match template for a 4-team group
// P1=pos0, P2=pos1, P3=pos2, P4=pos3
// J1: P1vsP4, P2vsP3
// J2: P1vsP3, P4vsP2
// J3: P1vsP2, P3vsP4
const GROUP_TEMPLATE = [
  { round: 1, a: 0, b: 3 }, // J1: P1 vs P4
  { round: 1, a: 1, b: 2 }, // J1: P2 vs P3
  { round: 2, a: 0, b: 2 }, // J2: P1 vs P3
  { round: 2, a: 3, b: 1 }, // J2: P4 vs P2
  { round: 3, a: 0, b: 1 }, // J3: P1 vs P2
  { round: 3, a: 2, b: 3 }, // J3: P3 vs P4
];

export function generateGroupStageMatches(groups) {
  const allMatches = {};
  for (const [groupName, teams] of Object.entries(groups)) {
    allMatches[groupName] = GROUP_TEMPLATE.map(({ round, a, b }, idx) => ({
      id: `${groupName}_${idx}`,
      group: groupName,
      round,
      teamA: teams[a].name,
      teamB: teams[b].name,
      goalsA: null,
      goalsB: null,
      played: false
    }));
  }
  return allMatches;
}

export function simulateGroupMatches(groups, allTeams) {
  const results = {};
  for (const [groupName, teams] of Object.entries(groups)) {
    results[groupName] = GROUP_TEMPLATE.map(({ round, a, b }, idx) => {
      const teamA = allTeams.find(t => t.name === teams[a].name) || teams[a];
      const teamB = allTeams.find(t => t.name === teams[b].name) || teams[b];
      const result = simulateMatch(teamA, teamB, true);
      return {
        id: `${groupName}_${idx}`,
        group: groupName,
        round,
        ...result,
        played: true
      };
    });
  }
  return results;
}

export function calculateStandings(groupTeams, matches) {
  const standings = groupTeams.map(team => ({
    ...team,
    played: 0,
    won: 0,
    drawn: 0,
    lost: 0,
    goalsFor: 0,
    goalsAgainst: 0,
    goalDifference: 0,
    points: 0
  }));

  matches.filter(m => m.played).forEach(match => {
    const teamA = standings.find(s => s.name === match.teamA);
    const teamB = standings.find(s => s.name === match.teamB);
    if (!teamA || !teamB) return;

    teamA.played++;
    teamB.played++;
    teamA.goalsFor += match.goalsA;
    teamA.goalsAgainst += match.goalsB;
    teamB.goalsFor += match.goalsB;
    teamB.goalsAgainst += match.goalsA;

    if (match.goalsA > match.goalsB) {
      teamA.won++;
      teamA.points += 3;
      teamB.lost++;
    } else if (match.goalsB > match.goalsA) {
      teamB.won++;
      teamB.points += 3;
      teamA.lost++;
    } else {
      teamA.drawn++;
      teamB.drawn++;
      teamA.points += 1;
      teamB.points += 1;
    }

    teamA.goalDifference = teamA.goalsFor - teamA.goalsAgainst;
    teamB.goalDifference = teamB.goalsFor - teamB.goalsAgainst;
  });

  // Sort by FIFA criteria: points, goal difference, goals for
  standings.sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    if (b.goalDifference !== a.goalDifference) return b.goalDifference - a.goalDifference;
    if (b.goalsFor !== a.goalsFor) return b.goalsFor - a.goalsFor;
    return 0;
  });

  return standings;
}

// ============ BEST THIRD-PLACED TEAMS (48 format) ============

export function getBestThirds(allStandings) {
  // Collect all 3rd-placed teams
  const thirds = [];
  for (const [group, standings] of Object.entries(allStandings)) {
    if (standings.length >= 3) {
      thirds.push({ ...standings[2], group });
    }
  }
  
  // Sort by FIFA criteria
  thirds.sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    if (b.goalDifference !== a.goalDifference) return b.goalDifference - a.goalDifference;
    if (b.goalsFor !== a.goalsFor) return b.goalsFor - a.goalsFor;
    return 0;
  });

  return thirds;
}

// ============ DRAW LOGIC ============

export function performDraw(qualifiedTeams, format, hosts) {
  const numGroups = format === 32 ? 8 : 12;
  const teamsPerGroup = format === 32 ? 4 : 4;

  // Work with a copy, sorted by ranking
  const sortedTeams = [...qualifiedTeams].sort((a, b) => (a.ranking || 200) - (b.ranking || 200));

  // Build exactly 4 pots of equal size (trim to nearest multiple of numGroups if needed)
  const totalSlots = numGroups * teamsPerGroup;
  const teamsToPlace = sortedTeams.slice(0, totalSlots);
  const potSize = numGroups; // one team per pot per group

  const hostNames = hosts.map(h => h.name);

  // Separate hosts from non-hosts
  const hostTeams = teamsToPlace.filter(t => hostNames.includes(t.name));
  const nonHostTeams = teamsToPlace.filter(t => !hostNames.includes(t.name));

  // Pot 1: hosts first, then top-ranked non-hosts to fill numGroups spots
  const pot1 = [...hostTeams];
  for (const t of nonHostTeams) {
    if (pot1.length >= potSize) break;
    pot1.push(t);
  }

  // Remaining teams for pots 2-4
  const pot1Names = new Set(pot1.map(t => t.name));
  const remaining = teamsToPlace.filter(t => !pot1Names.has(t.name));
  const pot2 = remaining.slice(0, potSize);
  const pot3 = remaining.slice(potSize, potSize * 2);
  const pot4 = remaining.slice(potSize * 2, potSize * 3);

  const pots = [pot1, pot2, pot3, pot4].filter(p => p.length > 0);

  // Shuffle pots 2-4
  for (let i = 1; i < pots.length; i++) shuffleArray(pots[i]);

  // Build empty groups
  const groups = {};
  const groupLetters = 'ABCDEFGHIJKL'.slice(0, numGroups).split('');
  groupLetters.forEach(letter => { groups[letter] = []; });

  // --- Place Pot 1: hosts go to groups A, B, C... in order; rest fill remaining groups ---
  const shuffledPot1 = [...pot1];
  // Keep hosts at the front, shuffle the rest
  const hostPot1 = shuffledPot1.filter(t => hostNames.includes(t.name));
  const nonHostPot1 = shuffleArray(shuffledPot1.filter(t => !hostNames.includes(t.name)));
  const orderedPot1 = [...hostPot1, ...nonHostPot1];

  orderedPot1.forEach((team, idx) => {
    if (idx < groupLetters.length) {
      groups[groupLetters[idx]].push(team);
    }
  });

  // --- Place pots 2, 3, 4 with confederation constraints ---
  for (let potIdx = 1; potIdx < pots.length; potIdx++) {
    const potTeams = shuffleArray([...pots[potIdx]]);

    for (const team of potTeams) {
      // Find groups with space and confederation constraint satisfied
      const validGroups = groupLetters.filter(g => {
        if (groups[g].length >= teamsPerGroup) return false;
        const confCount = groups[g].filter(t => t.confederation === team.confederation).length;
        const maxSameConf = team.confederation === 'UEFA' ? 2 : 1;
        return confCount < maxSameConf;
      });

      const targetGroup = validGroups.length > 0
        ? validGroups[Math.floor(Math.random() * validGroups.length)]
        : groupLetters.find(g => groups[g].length < teamsPerGroup); // fallback: ignore conf constraint

      if (targetGroup) groups[targetGroup].push(team);
    }
  }

  return { groups, pots };
}

// ============ KNOCKOUT BRACKET ============

export function generateKnockoutBracket(allStandings, format) {
  const groups = Object.keys(allStandings).sort();

  // Collect 1st and 2nd place per group
  const firsts = {};
  const seconds = {};
  groups.forEach(g => {
    firsts[g] = { ...allStandings[g][0], groupPosition: 1, group: g };
    seconds[g] = { ...allStandings[g][1], groupPosition: 2, group: g };
  });

  if (format === 32) {
    // Fixed FIFA bracket: A1vB2, B1vA2, C1vD2, D1vC2, E1vF2, F1vE2, G1vH2, H1vG2
    const matchupDefs = [
      ['A', 1, 'B', 2], ['B', 1, 'A', 2],
      ['C', 1, 'D', 2], ['D', 1, 'C', 2],
      ['E', 1, 'F', 2], ['F', 1, 'E', 2],
      ['G', 1, 'H', 2], ['H', 1, 'G', 2],
    ];
    const roundOf16 = matchupDefs.map(([gA, posA, gB, posB], idx) => {
      const teamA = posA === 1 ? firsts[gA] : seconds[gA];
      const teamB = posB === 1 ? firsts[gB] : seconds[gB];
      return {
        id: `r16_${idx}`, round: 'R16', matchNumber: idx + 1,
        teamA: teamA?.name || '?', teamB: teamB?.name || '?',
        goalsA: null, goalsB: null, winner: null, played: false
      };
    });
    return { roundOf16, quarterFinals: [], semiFinals: [], thirdPlace: null, final: null };
  }

  // ---- 48-team format: Round of 32 ----
  // 12 groups (A-L): 12 firsts + 12 seconds + 8 best thirds = 32 teams
  const bestThirds = getBestThirds(allStandings).slice(0, 8).map(t => ({ ...t, groupPosition: 3 }));

  // FIFA 2026 style bracket for 32 teams from 12 groups.
  // Key rules:
  //   - 1st of group never faces their own 2nd in R32
  //   - Thirds are slotted into specific positions based on which groups they came from
  // We use a fixed bracket template and fill thirds by best rank, 
  // ensuring no same-group matchups.

  // Fixed first vs second matchups (cross-group, no same group):
  // 1A-2C, 1B-2D, 1C-2A, 1D-2B, 1E-2G, 1F-2H, 1G-2E, 1H-2F,
  // 1I-2K, 1J-2L, 1K-2I, 1L-2J
  // Then 8 thirds fill the remaining 8 slots against: 1A,1B,1E,1F,1I,1J ... (best available)
  // To keep it clean: pair each first with the best available third that isn't from their group

  const firstsList = groups.map(g => firsts[g]);   // 12 firsts
  const secondsList = groups.map(g => seconds[g]); // 12 seconds

  // Fixed first vs second cross matchups (no same-group):
  // Pair A↔C, B↔D, E↔G, F↔H, I↔K, J↔L
  const fvs_pairs = [
    ['A','C'],['B','D'],['E','G'],['F','H'],['I','K'],['J','L'],
    ['C','A'],['D','B'],['G','E'],['H','F'],['K','I'],['L','J'],
  ];
  const fvsMatches = fvs_pairs.map(([g1, g2]) => ({
    first: firsts[g1], second: seconds[g2]
  })).filter(m => m.first && m.second);

  // That gives 12 matches (1 each for 12 firsts), but we only need 12 matches among 
  // 12 firsts + 12 seconds = 24 ... plus 8 thirds → 32 teams → 16 matches total.
  // Actually: 12 firsts + 12 seconds paired = 12 matches + then thirds vs... 
  // Wait: 32 teams / 2 = 16 matches in R32.
  // 12 (1st) + 12 (2nd) + 8 (3rd) = 32 → 16 matches.
  // Each 1st plays one match vs a 2nd OR a 3rd. Each 2nd plays vs a 1st or 3rd.
  // Simplest clean bracket: 
  //   - 8 matches: 1st vs 2nd (cross-group)  → use pairs: 1A-2C, 1B-2D, 1E-2G, 1F-2H, 1I-2K, 1J-2L, 1C-2A (wait that reuses groups)
  //
  // CORRECT approach for 48-team 2026:
  // Each of the 8 "bracket halves" has: 1st (x1) vs best-3rd AND 2nd(x1) vs 2nd(x1)
  // But the actual FIFA structure is complex. We implement a clean version:
  //   Slot the 32 teams: 12 firsts seeded, 12 seconds unseeded, 8 thirds fill gaps.
  //   Create 16 matches so no two teams from same group meet.

  // Simple, fair approach:
  //   - Pair groups: (A,B), (C,D), (E,F), (G,H), (I,J), (K,L) → 6 pairs
  //   - Each pair contributes: 1A, 2A, 1B, 2B → 2 matches within pair avoiding same group:
  //     Match: 1A vs 2B, Match: 1B vs 2A  → 2 matches per pair = 12 matches (24 teams)
  //   - Remaining 8 teams (best thirds) fill 4 more matches against 4 chosen firsts from separate groups
  //   - Total: 16 matches ✓
  //
  // For the thirds, pair each with a 1st from a non-same group, best rank first.

  const groupPairs = [['A','B'],['C','D'],['E','F'],['G','H'],['I','J'],['K','L']];
  const r32Matches = [];
  let matchIdx = 0;

  // 12 matches: 1st vs 2nd cross within each pair
  groupPairs.forEach(([g1, g2]) => {
    if (!firsts[g1] || !firsts[g2]) return;
    r32Matches.push({
      id: `r32_${matchIdx++}`, round: 'R32', matchNumber: matchIdx,
      teamA: firsts[g1].name, teamB: seconds[g2].name,
      goalsA: null, goalsB: null, winner: null, played: false
    });
    r32Matches.push({
      id: `r32_${matchIdx++}`, round: 'R32', matchNumber: matchIdx,
      teamA: firsts[g2].name, teamB: seconds[g1].name,
      goalsA: null, goalsB: null, winner: null, played: false
    });
  });

  // 4 more matches: pair the 8 best thirds among themselves 
  // (thirds vs thirds, sorted best to worst: T1vsT8, T2vsT7, T3vsT6, T4vsT5)
  const sortedThirds = [...bestThirds];
  const thirdMatchups = [
    [sortedThirds[0], sortedThirds[7]],
    [sortedThirds[1], sortedThirds[6]],
    [sortedThirds[2], sortedThirds[5]],
    [sortedThirds[3], sortedThirds[4]],
  ];
  thirdMatchups.forEach(([tA, tB]) => {
    if (!tA || !tB) return;
    r32Matches.push({
      id: `r32_${matchIdx++}`, round: 'R32', matchNumber: matchIdx,
      teamA: tA.name, teamB: tB.name,
      goalsA: null, goalsB: null, winner: null, played: false
    });
  });

  return { roundOf32: r32Matches, roundOf16: [], quarterFinals: [], semiFinals: [], thirdPlace: null, final: null };
}

export function advanceKnockout(bracket, round, allTeams) {
  const currentMatches = bracket[round];
  const results = currentMatches.map(match => {
    if (match.played) return match;
    const teamA = allTeams.find(t => t.name === match.teamA) || { name: match.teamA, ranking: 100 };
    const teamB = allTeams.find(t => t.name === match.teamB) || { name: match.teamB, ranking: 100 };
    return { ...match, ...simulateMatch(teamA, teamB, false), played: true };
  });

  const nextRound = getNextRound(round);
  const nextMatches = [];
  
  for (let i = 0; i < results.length; i += 2) {
    if (results[i] && results[i + 1]) {
      nextMatches.push({
        id: `${nextRound}_${i / 2}`,
        round: nextRound,
        matchNumber: i / 2 + 1,
        teamA: results[i].winner,
        teamB: results[i + 1].winner,
        goalsA: null, goalsB: null, winner: null, played: false
      });
    }
  }

  return { currentResults: results, nextMatches };
}

function getNextRound(round) {
  const order = ['roundOf32', 'roundOf16', 'quarterFinals', 'semiFinals', 'final'];
  const idx = order.indexOf(round);
  return idx >= 0 && idx < order.length - 1 ? order[idx + 1] : 'champion';
}

// ============ UTILS ============

export function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Phases of the tournament
export const PHASES = {
  CREATED: 'created',
  QUALIFICATION: 'qualification',
  PLAYOFFS: 'playoffs',
  DRAW: 'draw',
  GROUP_STAGE: 'group_stage',
  KNOCKOUT: 'knockout',
  COMPLETED: 'completed'
};