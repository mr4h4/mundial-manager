import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { advanceKnockout, PHASES, simulateMatch } from '@/core/engine';
import FlagImage from '@/components/ui/FlagImage';
import { ArrowRight, Zap, Trophy } from 'lucide-react';
import { motion } from 'framer-motion';

const ROUND_NAMES = {
  roundOf32: '16avos de Final',
  roundOf16: 'Octavos de Final',
  quarterFinals: 'Cuartos de Final',
  semiFinals: 'Semifinales',
  thirdPlace: 'Tercer y Cuarto Puesto',
  final: 'Final'
};

export default function KnockoutPhase({ tournament, onSave }) {
  const [bracket, setBracket] = useState(tournament.knockout);
  const { countries, format } = tournament;

  const getInitialRound = (b) => {
    if (b.final?.length > 0 && b.final.some(m => m.played)) return 'final';
    if (b.semiFinals?.length > 0 && b.semiFinals.some(m => !m.played)) return 'semiFinals';
    if (b.semiFinals?.length > 0) return 'semiFinals';
    if (b.quarterFinals?.length > 0 && b.quarterFinals.some(m => !m.played)) return 'quarterFinals';
    if (b.quarterFinals?.length > 0) return 'quarterFinals';
    if (b.roundOf16?.length > 0 && (format === 32 || b.roundOf32?.every(m => m.played))) return 'roundOf16';
    if (format === 48 && b.roundOf32?.length > 0) return 'roundOf32';
    return format === 32 ? 'roundOf16' : 'roundOf32';
  };

  const [currentRound, setCurrentRound] = useState(() => getInitialRound(bracket));

  const simulateRound = (round) => {
    const matches = bracket[round];
    if (!matches || matches.length === 0) return;

    const simulated = matches.map(match => {
      if (match.played) return match;
      const teamA = countries.find(c => c.name === match.teamA) || { name: match.teamA, ranking: 100 };
      const teamB = countries.find(c => c.name === match.teamB) || { name: match.teamB, ranking: 100 };
      const result = simulateMatch(teamA, teamB, false);
      return { ...match, ...result, played: true };
    });

    const newBracket = { ...bracket, [round]: simulated };
    const winners = simulated.map(m => m.winner);

    if (round === 'roundOf32') {
      // Generate round of 16 from winners, paired sequentially (bracket order preserved)
      const r16 = [];
      for (let i = 0; i < winners.length; i += 2) {
        if (winners[i] && winners[i + 1]) {
          r16.push({
            id: `r16_${i / 2}`, round: 'R16', matchNumber: i / 2 + 1,
            teamA: winners[i], teamB: winners[i + 1],
            goalsA: null, goalsB: null, winner: null, played: false
          });
        }
      }
      newBracket.roundOf16 = r16;
      setCurrentRound('roundOf16');
    } else if (round === 'roundOf16') {
      const qf = [];
      for (let i = 0; i < winners.length; i += 2) {
        if (winners[i] && winners[i + 1]) {
          qf.push({
            id: `qf_${i / 2}`, round: 'QF', matchNumber: i / 2 + 1,
            teamA: winners[i], teamB: winners[i + 1],
            goalsA: null, goalsB: null, winner: null, played: false
          });
        }
      }
      newBracket.quarterFinals = qf;
      setCurrentRound('quarterFinals');
    } else if (round === 'quarterFinals') {
      const sf = [];
      for (let i = 0; i < winners.length; i += 2) {
        if (winners[i] && winners[i + 1]) {
          sf.push({
            id: `sf_${i / 2}`, round: 'SF', matchNumber: i / 2 + 1,
            teamA: winners[i], teamB: winners[i + 1],
            goalsA: null, goalsB: null, winner: null, played: false
          });
        }
      }
      newBracket.semiFinals = sf;
      setCurrentRound('semiFinals');
    } else if (round === 'semiFinals') {
      const losers = simulated.map(m => m.winner === m.teamA ? m.teamB : m.teamA);
      newBracket.thirdPlace = [{
        id: 'third', round: '3rd', matchNumber: 1,
        teamA: losers[0], teamB: losers[1] || losers[0],
        goalsA: null, goalsB: null, winner: null, played: false
      }];
      newBracket.final = [{
        id: 'final', round: 'F', matchNumber: 1,
        teamA: winners[0], teamB: winners[1] || winners[0],
        goalsA: null, goalsB: null, winner: null, played: false
      }];
      setCurrentRound('final');
    } else if (round === 'final') {
      if (newBracket.thirdPlace?.[0] && !newBracket.thirdPlace[0].played) {
        const tp = newBracket.thirdPlace[0];
        const tA = countries.find(c => c.name === tp.teamA) || { name: tp.teamA, ranking: 100 };
        const tB = countries.find(c => c.name === tp.teamB) || { name: tp.teamB, ranking: 100 };
        newBracket.thirdPlace = [{ ...tp, ...simulateMatch(tA, tB, false), played: true }];
      }
      const champion = simulated[0]?.winner;
      onSave({ knockout: newBracket, champion, phase: PHASES.COMPLETED });
      return;
    }

    setBracket(newBracket);
    onSave({ knockout: newBracket });
  };

  const selectWinner = (round, matchId, winnerName) => {
    const newBracket = { ...bracket };
    newBracket[round] = bracket[round].map(m => {
      if (m.id !== matchId) return m;
      // Manual selection: no score, just winner
      return { ...m, winner: winnerName, played: true, goalsA: null, goalsB: null, manual: true };
    });
    setBracket(newBracket);
  };

  const allCurrentPlayed = bracket[currentRound]?.every(m => m.played);

  const getTeamData = (name) => countries.find(c => c.name === name) || { name, code: 'un' };

  const renderMatch = (match, round) => (
    <motion.div key={match.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <Card className={`overflow-hidden ${match.played ? 'border-primary/20' : ''}`}>
        <CardContent className="p-0">
          {/* Team A */}
          <button
            className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors ${
              match.winner === match.teamA ? 'bg-primary/10 font-bold' : 'hover:bg-muted'
            }`}
            onClick={() => !match.played && selectWinner(round, match.id, match.teamA)}
          >
            <FlagImage code={getTeamData(match.teamA).code} name={match.teamA} size="sm" />
            <span className="flex-1 text-left truncate">{match.teamA}</span>
            {match.played && !match.manual && <span className="font-heading text-lg">{match.goalsA}</span>}
            {match.winner === match.teamA && <Trophy className="w-4 h-4 text-accent" />}
          </button>

          <div className="border-t border-border" />

          {/* Team B */}
          <button
            className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors ${
              match.winner === match.teamB ? 'bg-primary/10 font-bold' : 'hover:bg-muted'
            }`}
            onClick={() => !match.played && selectWinner(round, match.id, match.teamB)}
          >
            <FlagImage code={getTeamData(match.teamB).code} name={match.teamB} size="sm" />
            <span className="flex-1 text-left truncate">{match.teamB}</span>
            {match.played && !match.manual && <span className="font-heading text-lg">{match.goalsB}</span>}
            {match.winner === match.teamB && <Trophy className="w-4 h-4 text-accent" />}
          </button>

          {match.played && !match.manual && (match.extraTime || match.penalties) && (
            <div className="border-t border-border px-4 py-1.5 bg-muted/50 text-center">
              <Badge variant="outline" className="text-[10px]">
                {match.penalties ? `PEN (${match.penaltiesA}-${match.penaltiesB})` : 'Prórroga'}
              </Badge>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );

  const mainRounds = format === 48
    ? ['roundOf32', 'roundOf16', 'quarterFinals', 'semiFinals', 'final']
    : ['roundOf16', 'quarterFinals', 'semiFinals', 'final'];

  const gridClass = {
    roundOf32: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
    roundOf16: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
    quarterFinals: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
    semiFinals: 'grid-cols-1 sm:grid-cols-2 max-w-2xl mx-auto',
    final: 'grid-cols-1 max-w-md mx-auto',
  };

  return (
    <div className="space-y-6">
      {/* Round tabs */}
      <div className="flex gap-1 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0">
        {mainRounds.map(round => {
          const hasMatches = bracket[round]?.length > 0;
          return (
            <Button
              key={round}
              size="sm"
              variant={currentRound === round ? 'default' : 'ghost'}
              className="font-heading shrink-0"
              disabled={!hasMatches}
              onClick={() => setCurrentRound(round)}
            >
              {ROUND_NAMES[round]}
            </Button>
          );
        })}
      </div>

      {/* Current round matches */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display text-lg font-bold">{ROUND_NAMES[currentRound]}</h3>
          <Button onClick={() => simulateRound(currentRound)} className="gap-2" size="sm">
            <Zap className="w-4 h-4" /> Simular ronda
          </Button>
        </div>

        <div className={`grid gap-3 ${gridClass[currentRound] || 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'}`}>
          {(bracket[currentRound] || []).map(match => renderMatch(match, currentRound))}
        </div>
      </div>

      {/* Third place (shown alongside final) */}
      {bracket.thirdPlace?.length > 0 && currentRound === 'final' && (
        <div className="max-w-md mx-auto">
          <h3 className="font-display text-lg font-bold mb-3 text-center">{ROUND_NAMES.thirdPlace}</h3>
          {bracket.thirdPlace.map(match => renderMatch(match, 'thirdPlace'))}
        </div>
      )}

      {/* Advance button */}
      {allCurrentPlayed && currentRound !== 'final' && (
        <div className="flex justify-center">
          <Button
            size="lg"
            className="gap-2 font-heading"
            onClick={() => simulateRound(currentRound)}
          >
            SIGUIENTE RONDA <ArrowRight className="w-5 h-5" />
          </Button>
        </div>
      )}
    </div>
  );
}