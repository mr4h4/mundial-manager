import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { performDraw, PHASES } from '@/core/engine';
import { ArrowRight, Shuffle, Play } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import FlagImage from '@/components/ui/FlagImage';

export default function DrawPhase({ tournament, onSave }) {
  const { qualified, format, hosts } = tournament;
  const [drawResult, setDrawResult] = useState(tournament.groups && Object.keys(tournament.groups).length > 0 ? 
    { groups: tournament.groups, pots: tournament.pots || [] } : null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [revealedGroups, setRevealedGroups] = useState(new Set());
  const [currentTeam, setCurrentTeam] = useState(null);
  const animationRef = useRef(null);

  const startDraw = () => {
    const result = performDraw(qualified, format, hosts);
    setDrawResult(result);
    setRevealedGroups(new Set());
    animateReveal(result.groups);
  };

  const animateReveal = async (groups) => {
    setIsAnimating(true);
    const groupKeys = Object.keys(groups).sort();
    
    for (const groupKey of groupKeys) {
      for (const team of groups[groupKey]) {
        setCurrentTeam(team);
        await new Promise(r => setTimeout(r, 400));
      }
      setRevealedGroups(prev => new Set([...prev, groupKey]));
      await new Promise(r => setTimeout(r, 300));
    }
    setCurrentTeam(null);
    setIsAnimating(false);
  };

  const instantDraw = () => {
    const result = performDraw(qualified, format, hosts);
    setDrawResult(result);
    const allGroups = new Set(Object.keys(result.groups));
    setRevealedGroups(allGroups);
    setIsAnimating(false);
  };

  const handleProceed = () => {
    if (!drawResult) return;
    onSave({
      groups: drawResult.groups,
      pots: drawResult.pots,
      phase: PHASES.GROUP_STAGE
    });
  };

  const allRevealed = drawResult && revealedGroups.size === Object.keys(drawResult.groups).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-xl font-bold">SORTEO</h2>
          <p className="text-sm text-muted-foreground">
            {qualified.length} equipos en {format === 32 ? 8 : 12} grupos
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={startDraw} disabled={isAnimating} className="gap-2" variant="outline">
            <Play className="w-4 h-4" /> Sorteo animado
          </Button>
          <Button onClick={instantDraw} disabled={isAnimating} className="gap-2">
            <Shuffle className="w-4 h-4" /> Sorteo instantáneo
          </Button>
        </div>
      </div>

      {/* Current team being drawn */}
      <AnimatePresence>
        {currentTeam && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="flex justify-center"
          >
            <Card className="border-2 border-primary bg-primary/5 px-8 py-4">
              <div className="flex items-center gap-4">
                <FlagImage code={currentTeam.code} name={currentTeam.name} size="xl" />
                <div>
                  <p className="font-heading font-bold text-xl">{currentTeam.name}</p>
                  <p className="text-sm text-muted-foreground">{currentTeam.confederation}</p>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pots */}
      {drawResult?.pots?.length > 0 && !isAnimating && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {drawResult.pots.map((pot, idx) => (
            <Card key={idx} className="overflow-hidden">
              <CardHeader className="p-3 bg-muted/50">
                <CardTitle className="text-sm font-heading">Bombo {idx + 1}</CardTitle>
              </CardHeader>
              <CardContent className="p-2 space-y-1">
                {pot.map(team => (
                  <div key={team.name} className="flex items-center gap-2 px-2 py-1 text-sm">
                    <FlagImage code={team.code} name={team.name} size="xs" />
                    <span className="truncate">{team.name}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Groups */}
      {drawResult && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Object.entries(drawResult.groups).sort(([a], [b]) => a.localeCompare(b)).map(([groupKey, teams]) => {
            const isRevealed = revealedGroups.has(groupKey);
            return (
              <motion.div
                key={groupKey}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: isRevealed ? 1 : 0.3, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card className={`overflow-hidden transition-all ${isRevealed ? 'border-primary/30 shadow-md' : ''}`}>
                  <CardHeader className="p-3 bg-primary/5">
                    <CardTitle className="text-sm font-heading">GRUPO {groupKey}</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    {teams.map((team, idx) => (
                      <motion.div
                        key={team.name}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: isRevealed ? 1 : 0.2, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="flex items-center gap-3 px-4 py-2.5 border-b last:border-0 text-sm"
                      >
                        <FlagImage code={team.code} name={team.name} size="sm" />
                        <span className="font-medium truncate">{team.name}</span>
                        <span className="text-xs text-muted-foreground ml-auto">#{team.ranking}</span>
                      </motion.div>
                    ))}
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}

      {allRevealed && (
        <div className="flex justify-end">
          <Button size="lg" className="gap-2 font-heading" onClick={handleProceed}>
            FASE DE GRUPOS
            <ArrowRight className="w-5 h-5" />
          </Button>
        </div>
      )}
    </div>
  );
}