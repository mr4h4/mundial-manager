import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Trophy, Trash2, ChevronRight, Users, History } from 'lucide-react';
import { PHASES } from '@/core/engine';

const PHASE_LABELS = {
  [PHASES.CREATED]: 'Creado',
  [PHASES.QUALIFICATION]: 'Clasificación',
  [PHASES.PLAYOFFS]: 'Repesca',
  [PHASES.DRAW]: 'Sorteo',
  [PHASES.GROUP_STAGE]: 'Fase de Grupos',
  [PHASES.KNOCKOUT]: 'Eliminatorias',
  [PHASES.COMPLETED]: 'Finalizado',
};

const PHASE_COLORS = {
  [PHASES.CREATED]: 'bg-muted text-muted-foreground',
  [PHASES.QUALIFICATION]: 'bg-blue-100 text-blue-700',
  [PHASES.PLAYOFFS]: 'bg-orange-100 text-orange-700',
  [PHASES.DRAW]: 'bg-purple-100 text-purple-700',
  [PHASES.GROUP_STAGE]: 'bg-primary/10 text-primary',
  [PHASES.KNOCKOUT]: 'bg-red-100 text-red-700',
  [PHASES.COMPLETED]: 'bg-accent text-accent-foreground',
};

export default function TournamentCard({ tournament, onDelete }) {
  return (
    <Card className="group hover:shadow-lg transition-all duration-300 border-border/50 overflow-hidden">
      <CardContent className="p-0">
        <div className="flex items-stretch">
          {/* Left accent */}
          <div className="w-1.5 bg-primary shrink-0" />
          
          <div className="flex-1 p-5 flex items-center justify-between gap-4">
            <div className="flex items-center gap-4 min-w-0">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <Trophy className="w-6 h-6 text-primary" />
              </div>
              <div className="min-w-0">
                <h3 className="font-heading font-bold text-lg truncate">{tournament.name}</h3>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-sm text-muted-foreground flex items-center gap-1">
                    <Users className="w-3.5 h-3.5" />
                    {tournament.format} equipos
                  </span>
                  <Badge className={`text-xs ${PHASE_COLORS[tournament.phase] || ''}`}>
                    {PHASE_LABELS[tournament.phase] || tournament.phase}
                  </Badge>
                </div>
                {tournament.champion && (
                  <p className="text-sm text-accent font-semibold mt-1">
                    🏆 {tournament.champion}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); onDelete(tournament.id); }}
                className="text-muted-foreground hover:text-destructive"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
              {tournament.phase === PHASES.COMPLETED ? (
                <>
                  <Link to={`/tournament/${tournament.id}/history`}>
                    <Button variant="outline" size="sm" className="gap-1">
                      <History className="w-4 h-4" />
                      Ver torneo
                    </Button>
                  </Link>
                  <Link to={`/tournament/${tournament.id}`}>
                    <Button variant="default" size="sm" className="gap-1">
                      <Trophy className="w-4 h-4" />
                      Campeón
                    </Button>
                  </Link>
                </>
              ) : (
                <Link to={`/tournament/${tournament.id}`}>
                  <Button variant="default" size="sm" className="gap-1">
                    Continuar
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}