import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PHASES, simulateMatch } from '@/core/engine';
import { ArrowRight, Zap, Trophy } from 'lucide-react';
import { motion } from 'framer-motion';
import FlagImage from '@/components/ui/FlagImage';

export default function PlayoffPhase({ tournament, onSave }) {
  const { playoffTeams, qualified } = tournament;

  const [matches, setMatches] = useState(() => {
    if (tournament.playoffResults?.length > 0) return tournament.playoffResults;
    // Pair teams sequentially: first vs last, second vs second-last, etc.
    const teams = [...playoffTeams];
    const pairs = [];
    while (teams.length >= 2) {
      const a = teams.shift();
      const b = teams.pop();
      pairs.push({ teamA: a, teamB: b, result: null, winner: null });
    }
    return pairs;
  });

  const simulateAll = () => {
    setMatches(prev => prev.map(match => {
      if (match.winner) return match;
      const result = simulateMatch(match.teamA, match.teamB, false);
      const winner = result.winner === match.teamA.name ? match.teamA : match.teamB;
      return { ...match, result, winner };
    }));
  };

  const selectWinner = (matchIdx, team) => {
    setMatches(prev => prev.map((m, i) =>
      i === matchIdx ? { ...m, winner: team, result: { manual: true } } : m
    ));
  };

  const allDecided = matches.every(m => m.winner);

  const handleProceed = () => {
    const winners = matches.map(m => m.winner).filter(Boolean);
    // qualified = direct qualifiers only; winners = playoff qualifiers
    // Together they form the full draw pool
    const allQualified = [...qualified, ...winners];
    onSave({
      qualified: allQualified,
      playoffResults: matches,
      phase: PHASES.DRAW
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-xl font-bold">REPESCA INTERCONTINENTAL</h2>
          <p className="text-sm text-muted-foreground">
            {matches.length} partidos · {matches.filter(m => m.winner).length} decididos
          </p>
        </div>
        <Button onClick={simulateAll} className="gap-2" variant="outline">
          <Zap className="w-4 h-4" /> Simular todos
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {matches.map((match, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
          >
            <Card className={match.winner ? 'border-primary/30' : ''}>
              <CardContent className="p-5 space-y-4">
                <div className="flex items-center justify-between gap-4">
                  {/* Team A */}
                  <button
                    onClick={() => !match.winner && selectWinner(idx, match.teamA)}
                    className={`flex-1 text-center p-3 rounded-xl transition-all ${
                      match.winner?.name === match.teamA.name
                        ? 'bg-primary/10 ring-2 ring-primary'
                        : 'hover:bg-muted'
                    }`}
                  >
                    <div className="flex justify-center mb-1">
                      <FlagImage code={match.teamA.code} name={match.teamA.name} size="lg" />
                    </div>
                    <p className="font-heading font-bold text-sm">{match.teamA.name}</p>
                    <p className="text-xs text-muted-foreground">{match.teamA.confederation}</p>
                  </button>

                  {/* Score */}
                  <div className="text-center shrink-0">
                    {match.result && !match.result.manual ? (
                      <div>
                        <p className="font-heading font-bold text-xl">
                          {match.result.goalsA} – {match.result.goalsB}
                        </p>
                        {match.result.extraTime && (
                          <Badge variant="outline" className="text-[10px]">
                            {match.result.penalties ? 'PEN' : 'ET'}
                          </Badge>
                        )}
                      </div>
                    ) : (
                      <span className="text-muted-foreground font-heading text-lg">VS</span>
                    )}
                  </div>

                  {/* Team B */}
                  <button
                    onClick={() => !match.winner && selectWinner(idx, match.teamB)}
                    className={`flex-1 text-center p-3 rounded-xl transition-all ${
                      match.winner?.name === match.teamB.name
                        ? 'bg-primary/10 ring-2 ring-primary'
                        : 'hover:bg-muted'
                    }`}
                  >
                    <div className="flex justify-center mb-1">
                      <FlagImage code={match.teamB.code} name={match.teamB.name} size="lg" />
                    </div>
                    <p className="font-heading font-bold text-sm">{match.teamB.name}</p>
                    <p className="text-xs text-muted-foreground">{match.teamB.confederation}</p>
                  </button>
                </div>

                {match.winner && (
                  <div className="text-center">
                    <Badge className="bg-primary text-primary-foreground gap-1">
                      <Trophy className="w-3 h-3" />
                      {match.winner.name} clasifica
                    </Badge>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="flex justify-end">
        <Button
          size="lg"
          className="gap-2 font-heading"
          disabled={!allDecided}
          onClick={handleProceed}
        >
          IR AL SORTEO
          <ArrowRight className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
}