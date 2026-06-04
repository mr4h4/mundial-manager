import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getTournament, updateTournament } from '@/core/tournamentManager';
import { PHASES } from '@/core/engine';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import QualificationPhase from '@/components/phases/QualificationPhase';
import PlayoffPhase from '@/components/phases/PlayoffPhase';
import DrawPhase from '@/components/phases/DrawPhase';
import GroupStagePhase from '@/components/phases/GroupStagePhase';
import KnockoutPhase from '@/components/phases/KnockoutPhase';
import ChampionScreen from '@/components/phases/ChampionScreen';
import { motion } from 'framer-motion';
import FlagImage from '@/components/ui/FlagImage';

const PHASE_ORDER = [
  PHASES.CREATED,
  PHASES.QUALIFICATION,
  PHASES.PLAYOFFS,
  PHASES.DRAW,
  PHASES.GROUP_STAGE,
  PHASES.KNOCKOUT,
  PHASES.COMPLETED
];

const PHASE_NAMES = {
  [PHASES.CREATED]: 'Inicio',
  [PHASES.QUALIFICATION]: 'Clasificación',
  [PHASES.PLAYOFFS]: 'Repesca',
  [PHASES.DRAW]: 'Sorteo',
  [PHASES.GROUP_STAGE]: 'Fase de Grupos',
  [PHASES.KNOCKOUT]: 'Eliminatorias',
  [PHASES.COMPLETED]: 'Campeón',
};

export default function TournamentHub() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tournament, setTournament] = useState(null);

  const reload = useCallback(() => {
    const t = getTournament(id);
    if (!t) {
      navigate('/');
      return;
    }
    setTournament(t);
  }, [id, navigate]);

  useEffect(() => { reload(); }, [reload]);

  const saveTournament = useCallback((updates) => {
    const updated = updateTournament(id, updates);
    setTournament(updated);
  }, [id]);

  if (!tournament) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-4 border-muted border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  const currentPhaseIdx = PHASE_ORDER.indexOf(tournament.phase);

  const renderPhase = () => {
    switch (tournament.phase) {
      case PHASES.CREATED:
      case PHASES.QUALIFICATION:
        return <QualificationPhase tournament={tournament} onSave={saveTournament} />;
      case PHASES.PLAYOFFS:
        return <PlayoffPhase tournament={tournament} onSave={saveTournament} />;
      case PHASES.DRAW:
        return <DrawPhase tournament={tournament} onSave={saveTournament} />;
      case PHASES.GROUP_STAGE:
        return <GroupStagePhase tournament={tournament} onSave={saveTournament} />;
      case PHASES.KNOCKOUT:
        return <KnockoutPhase tournament={tournament} onSave={saveTournament} />;
      case PHASES.COMPLETED:
        return <ChampionScreen tournament={tournament} />;
      default:
        return <p>Fase desconocida</p>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Tournament header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <button onClick={() => navigate('/')} className="text-muted-foreground hover:text-foreground text-sm flex items-center gap-1 mb-1">
            <ArrowLeft className="w-3.5 h-3.5" /> Volver
          </button>
          <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight">
            {tournament.name}
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5 flex items-center gap-2 flex-wrap">
            <span>{tournament.format} equipos ·</span>
            {tournament.hosts.map(h => (
              <span key={h.name} className="flex items-center gap-1">
                <FlagImage code={h.code} name={h.name} size="xs" />
                {h.name}
              </span>
            ))}
          </p>
        </div>
      </div>

      {/* Phase stepper */}
      <div className="flex items-center gap-1 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0">
        {PHASE_ORDER.filter(p => p !== PHASES.CREATED).map((phase, idx) => {
          const phaseIdx = PHASE_ORDER.indexOf(phase);
          const isCurrent = phase === tournament.phase || (tournament.phase === PHASES.CREATED && phase === PHASES.QUALIFICATION);
          const isPast = currentPhaseIdx > phaseIdx;

          return (
            <React.Fragment key={phase}>
              {idx > 0 && <div className={`w-4 sm:w-8 h-0.5 shrink-0 ${isPast ? 'bg-primary' : 'bg-border'}`} />}
              <Badge
                className={`whitespace-nowrap text-xs shrink-0 ${
                  isCurrent 
                    ? 'bg-primary text-primary-foreground' 
                    : isPast 
                      ? 'bg-primary/20 text-primary' 
                      : 'bg-muted text-muted-foreground'
                }`}
              >
                {PHASE_NAMES[phase]}
              </Badge>
            </React.Fragment>
          );
        })}
      </div>

      {/* Phase content */}
      <motion.div
        key={tournament.phase}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {renderPhase()}
      </motion.div>
    </div>
  );
}