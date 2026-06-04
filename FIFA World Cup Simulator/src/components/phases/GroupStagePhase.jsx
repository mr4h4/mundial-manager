import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { simulateMatch, simulateGroupMatches, calculateStandings, getBestThirds, generateKnockoutBracket, PHASES } from '@/core/engine';
import FlagImage from '@/components/ui/FlagImage';
import { ArrowRight, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

export default function GroupStagePhase({ tournament, onSave }) {
  const { groups, format, countries } = tournament;
  
  // FIFA template: J1: P1vsP4, P2vsP3 / J2: P1vsP3, P4vsP2 / J3: P1vsP2, P3vsP4
  const GROUP_TEMPLATE = [
    { round: 1, a: 0, b: 3 },
    { round: 1, a: 1, b: 2 },
    { round: 2, a: 0, b: 2 },
    { round: 2, a: 3, b: 1 },
    { round: 3, a: 0, b: 1 },
    { round: 3, a: 2, b: 3 },
  ];

  const [groupMatches, setGroupMatches] = useState(() => {
    if (tournament.groupMatches && Object.keys(tournament.groupMatches).length > 0) {
      return tournament.groupMatches;
    }
    const matches = {};
    Object.entries(groups).forEach(([groupName, teams]) => {
      matches[groupName] = GROUP_TEMPLATE.map(({ round, a, b }, idx) => ({
        id: `${groupName}_${idx}`,
        group: groupName,
        round,
        teamA: teams[a].name,
        teamB: teams[b].name,
        goalsA: null,
        goalsB: null,
        played: false
      }));
    });
    return matches;
  });

  const [activeGroup, setActiveGroup] = useState(Object.keys(groups).sort()[0]);

  const standings = useMemo(() => {
    const s = {};
    Object.entries(groups).forEach(([groupName, teams]) => {
      s[groupName] = calculateStandings(teams, groupMatches[groupName] || []);
    });
    return s;
  }, [groups, groupMatches]);

  const allPlayed = Object.values(groupMatches).every(matches => matches.every(m => m.played));

  const simulateAll = () => {
    const allMatches = simulateGroupMatches(groups, countries);
    setGroupMatches(allMatches);
  };

  const simulateGroup = (groupName) => {
    const teams = groups[groupName];
    const matches = GROUP_TEMPLATE.map(({ round, a, b }, idx) => {
      const teamA = countries.find(c => c.name === teams[a].name) || teams[a];
      const teamB = countries.find(c => c.name === teams[b].name) || teams[b];
      const result = simulateMatch(teamA, teamB, true);
      return { id: `${groupName}_${idx}`, group: groupName, round, ...result, played: true };
    });
    setGroupMatches(prev => ({ ...prev, [groupName]: matches }));
  };

  const updateMatchScore = (groupName, matchId, field, value) => {
    const numValue = value === '' ? null : parseInt(value);
    setGroupMatches(prev => ({
      ...prev,
      [groupName]: prev[groupName].map(m => {
        if (m.id !== matchId) return m;
        const updated = { ...m, [field]: numValue };
        if (updated.goalsA !== null && updated.goalsB !== null) {
          updated.played = true;
          updated.winner = updated.goalsA > updated.goalsB ? updated.teamA : 
            updated.goalsB > updated.goalsA ? updated.teamB : 'draw';
        }
        return updated;
      })
    }));
  };

  const handleProceed = () => {
    const bracket = generateKnockoutBracket(standings, format);
    onSave({
      groupMatches,
      standings,
      knockout: bracket,
      phase: PHASES.KNOCKOUT
    });
  };

  const groupKeys = Object.keys(groups).sort();
  const bestThirds = format === 48 ? getBestThirds(standings) : [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-xl font-bold">FASE DE GRUPOS</h2>
          <p className="text-sm text-muted-foreground">
            Introduce resultados o simula los partidos
          </p>
        </div>
        <Button onClick={simulateAll} className="gap-2">
          <Zap className="w-4 h-4" /> Simular todo
        </Button>
      </div>

      {/* Group tabs */}
      <div className="flex gap-1 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0">
        {groupKeys.map(g => (
          <Button
            key={g}
            size="sm"
            variant={activeGroup === g ? 'default' : 'ghost'}
            className="font-heading shrink-0"
            onClick={() => setActiveGroup(g)}
          >
            Grupo {g}
          </Button>
        ))}
      </div>

      {/* Active group */}
      {activeGroup && standings[activeGroup] && (
        <motion.div key={activeGroup} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
          {/* Standings table */}
          <Card>
            <CardHeader className="p-4 pb-0">
              <CardTitle className="font-heading text-lg">GRUPO {activeGroup}</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-8">#</TableHead>
                      <TableHead>Equipo</TableHead>
                      <TableHead className="text-center w-10">PJ</TableHead>
                      <TableHead className="text-center w-10">G</TableHead>
                      <TableHead className="text-center w-10">E</TableHead>
                      <TableHead className="text-center w-10">P</TableHead>
                      <TableHead className="text-center w-10">GF</TableHead>
                      <TableHead className="text-center w-10">GC</TableHead>
                      <TableHead className="text-center w-10">DG</TableHead>
                      <TableHead className="text-center w-12 font-bold">Pts</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {standings[activeGroup].map((team, idx) => (
                      <TableRow key={team.name} className={idx < 2 ? 'bg-primary/5' : idx === 2 && format === 48 ? 'bg-accent/5' : ''}>
                        <TableCell className="font-bold">{idx + 1}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <FlagImage code={team.code} name={team.name} size="sm" />
                            <span className="font-medium text-sm">{team.name}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-center">{team.played}</TableCell>
                        <TableCell className="text-center">{team.won}</TableCell>
                        <TableCell className="text-center">{team.drawn}</TableCell>
                        <TableCell className="text-center">{team.lost}</TableCell>
                        <TableCell className="text-center">{team.goalsFor}</TableCell>
                        <TableCell className="text-center">{team.goalsAgainst}</TableCell>
                        <TableCell className="text-center font-medium">
                          {team.goalDifference > 0 ? '+' : ''}{team.goalDifference}
                        </TableCell>
                        <TableCell className="text-center font-bold text-primary">{team.points}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <div className="flex gap-4 mt-3 text-xs text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded bg-primary/20" />
                  Clasifica (1º y 2º)
                </div>
                {format === 48 && (
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded bg-accent/20" />
                    Posible mejor tercero
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Matches by Jornada */}
          <Card>
            <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-heading">PARTIDOS</CardTitle>
              <Button size="sm" variant="outline" onClick={() => simulateGroup(activeGroup)} className="text-xs gap-1">
                <Zap className="w-3 h-3" /> Simular grupo
              </Button>
            </CardHeader>
            <CardContent className="p-4 pt-2 space-y-4">
              {[1, 2, 3].map(jornada => {
                const jornadaMatches = (groupMatches[activeGroup] || []).filter(m => m.round === jornada);
                return (
                  <div key={jornada}>
                    <p className="text-xs font-heading font-bold text-muted-foreground mb-2 uppercase tracking-wider">
                      Jornada {jornada}
                    </p>
                    <div className="space-y-2">
                      {jornadaMatches.map(match => (
                        <div key={match.id} className={`flex items-center gap-3 p-3 rounded-lg ${match.played ? 'bg-muted/50' : 'bg-card border border-border'}`}>
                          <span className="flex-1 text-right text-sm font-medium truncate">{match.teamA}</span>
                          <div className="flex items-center gap-1 shrink-0">
                            <Input
                              type="number"
                              min="0"
                              value={match.goalsA ?? ''}
                              onChange={e => updateMatchScore(activeGroup, match.id, 'goalsA', e.target.value)}
                              className="w-12 h-8 text-center text-sm p-0"
                            />
                            <span className="text-muted-foreground mx-1">-</span>
                            <Input
                              type="number"
                              min="0"
                              value={match.goalsB ?? ''}
                              onChange={e => updateMatchScore(activeGroup, match.id, 'goalsB', e.target.value)}
                              className="w-12 h-8 text-center text-sm p-0"
                            />
                          </div>
                          <span className="flex-1 text-left text-sm font-medium truncate">{match.teamB}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Best thirds (48 format) */}
      {format === 48 && allPlayed && bestThirds.length > 0 && (
        <Card>
          <CardHeader className="p-4">
            <CardTitle className="font-heading text-lg">MEJORES TERCEROS</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>#</TableHead>
                    <TableHead>Equipo</TableHead>
                    <TableHead>Grupo</TableHead>
                    <TableHead className="text-center">Pts</TableHead>
                    <TableHead className="text-center">DG</TableHead>
                    <TableHead className="text-center">GF</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bestThirds.map((team, idx) => (
                    <TableRow key={team.name} className={idx < 8 ? 'bg-primary/5' : ''}>
                      <TableCell>{idx + 1}</TableCell>
                      <TableCell>
                            <div className="flex items-center gap-2">
                              <FlagImage code={team.code} name={team.name} size="sm" />
                              <span className="font-medium text-sm">{team.name}</span>
                            </div>
                          </TableCell>
                          <TableCell>{team.group}</TableCell>
                      <TableCell className="text-center font-bold">{team.points}</TableCell>
                      <TableCell className="text-center">{team.goalDifference}</TableCell>
                      <TableCell className="text-center">{team.goalsFor}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      {allPlayed && (
        <div className="flex justify-end">
          <Button size="lg" className="gap-2 font-heading" onClick={handleProceed}>
            ELIMINATORIAS
            <ArrowRight className="w-5 h-5" />
          </Button>
        </div>
      )}
    </div>
  );
}