import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getTournament } from '@/core/tournamentManager';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trophy, ArrowLeft, Medal } from 'lucide-react';
import FlagImage from '@/components/ui/FlagImage';
import { motion } from 'framer-motion';

const ROUND_KEYS = [
  { key: 'groups',        label: 'Fase de Grupos' },
  { key: 'roundOf32',     label: '16avos de Final' },
  { key: 'roundOf16',     label: 'Octavos de Final' },
  { key: 'quarterFinals', label: 'Cuartos de Final' },
  { key: 'semiFinals',    label: 'Semifinales' },
  { key: 'thirdPlace',    label: 'Tercer Puesto' },
  { key: 'final',         label: 'Final' },
];

function MatchCard({ match, countries, highlighted }) {
  const getCode = (name) => countries.find(c => c.name === name)?.code || 'un';
  const winnerA = match.winner === match.teamA;
  const winnerB = match.winner === match.teamB;

  return (
    <Card className={`overflow-hidden ${highlighted ? 'border-accent/40 bg-accent/5' : ''}`}>
      <CardContent className="p-0">
        <div className={`flex items-center gap-3 px-4 py-3 ${winnerA ? 'bg-primary/10' : ''}`}>
          <FlagImage code={getCode(match.teamA)} name={match.teamA} size="sm" />
          <span className={`flex-1 text-sm truncate ${winnerA ? 'font-bold' : ''}`}>{match.teamA}</span>
          {winnerA && <Trophy className="w-4 h-4 text-accent shrink-0" />}
        </div>
        <div className="border-t border-border" />
        <div className={`flex items-center gap-3 px-4 py-3 ${winnerB ? 'bg-primary/10' : ''}`}>
          <FlagImage code={getCode(match.teamB)} name={match.teamB} size="sm" />
          <span className={`flex-1 text-sm truncate ${winnerB ? 'font-bold' : ''}`}>{match.teamB}</span>
          {winnerB && <Trophy className="w-4 h-4 text-accent shrink-0" />}
        </div>
      </CardContent>
    </Card>
  );
}

function GroupsTab({ tournament }) {
  const { groups, groupMatches, standings, countries } = tournament;
  const [activeGroup, setActiveGroup] = useState(Object.keys(groups || {}).sort()[0]);
  const groupKeys = Object.keys(groups || {}).sort();

  if (!groupKeys.length) return <p className="text-muted-foreground text-center py-8">Sin datos de grupos.</p>;

  const groupStandings = standings?.[activeGroup] || [];
  const matches = (groupMatches?.[activeGroup] || []);

  return (
    <div className="space-y-4">
      <div className="flex gap-1 overflow-x-auto pb-2">
        {groupKeys.map(g => (
          <Button key={g} size="sm" variant={activeGroup === g ? 'default' : 'ghost'}
            className="font-heading shrink-0" onClick={() => setActiveGroup(g)}>
            Grupo {g}
          </Button>
        ))}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-xs text-muted-foreground">
              <th className="text-left py-1 px-2 w-8">#</th>
              <th className="text-left py-1 px-2">Equipo</th>
              <th className="text-center py-1 px-2 w-10">PJ</th>
              <th className="text-center py-1 px-2 w-10">G</th>
              <th className="text-center py-1 px-2 w-10">E</th>
              <th className="text-center py-1 px-2 w-10">P</th>
              <th className="text-center py-1 px-2 w-10">GF</th>
              <th className="text-center py-1 px-2 w-10">GC</th>
              <th className="text-center py-1 px-2 w-10">DG</th>
              <th className="text-center py-1 px-2 w-12 font-bold">Pts</th>
            </tr>
          </thead>
          <tbody>
            {groupStandings.map((team, idx) => (
              <tr key={team.name} className={`border-t border-border ${idx < 2 ? 'bg-primary/5' : ''}`}>
                <td className="py-2 px-2 font-bold text-xs">{idx + 1}</td>
                <td className="py-2 px-2">
                  <div className="flex items-center gap-2">
                    <FlagImage code={team.code} name={team.name} size="sm" />
                    <span className="font-medium">{team.name}</span>
                  </div>
                </td>
                <td className="text-center py-2 px-2">{team.played}</td>
                <td className="text-center py-2 px-2">{team.won}</td>
                <td className="text-center py-2 px-2">{team.drawn}</td>
                <td className="text-center py-2 px-2">{team.lost}</td>
                <td className="text-center py-2 px-2">{team.goalsFor}</td>
                <td className="text-center py-2 px-2">{team.goalsAgainst}</td>
                <td className="text-center py-2 px-2">{team.goalDifference > 0 ? '+' : ''}{team.goalDifference}</td>
                <td className="text-center py-2 px-2 font-bold text-primary">{team.points}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="space-y-4">
        {[1, 2, 3].map(jornada => {
          const jornadaMatches = matches.filter(m => m.round === jornada);
          if (!jornadaMatches.length) return null;
          return (
            <div key={jornada}>
              <p className="text-xs font-heading font-bold text-muted-foreground mb-2 uppercase tracking-wider">
                Jornada {jornada}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {jornadaMatches.map(match => (
                  <MatchCard key={match.id} match={match} countries={countries} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function KnockoutTab({ roundKey, tournament }) {
  const { knockout, countries } = tournament;
  const matches = knockout?.[roundKey] || [];
  if (!matches.length) return <p className="text-muted-foreground text-center py-8">No hay partidos en esta ronda.</p>;

  const gridClass = {
    roundOf32: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
    roundOf16: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
    quarterFinals: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
    semiFinals: 'grid-cols-1 sm:grid-cols-2 max-w-2xl mx-auto',
    thirdPlace: 'grid-cols-1 max-w-md mx-auto',
    final: 'grid-cols-1 max-w-md mx-auto',
  }[roundKey] || 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4';

  return (
    <div className={`grid gap-3 ${gridClass}`}>
      {matches.map(match => (
        <MatchCard key={match.id} match={match} countries={countries}
          highlighted={roundKey === 'final' || roundKey === 'thirdPlace'} />
      ))}
    </div>
  );
}

export default function TournamentHistory() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tournament, setTournament] = useState(null);
  const [activeTab, setActiveTab] = useState('groups');

  useEffect(() => {
    const t = getTournament(id);
    if (!t) { navigate('/'); return; }
    setTournament(t);
  }, [id, navigate]);

  if (!tournament) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-4 border-muted border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  const { knockout, format, champion, countries } = tournament;
  const champion_data = countries.find(c => c.name === champion);

  const availableTabs = ROUND_KEYS.filter(({ key }) => {
    if (key === 'groups') return Object.keys(tournament.groups || {}).length > 0;
    if (key === 'roundOf32') return format === 48 && knockout?.roundOf32?.length > 0;
    return knockout?.[key]?.length > 0;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <button onClick={() => navigate('/')} className="text-muted-foreground hover:text-foreground text-sm flex items-center gap-1 mb-1">
            <ArrowLeft className="w-3.5 h-3.5" /> Volver
          </button>
          <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight">{tournament.name}</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {tournament.format} equipos · Historial completo
          </p>
        </div>
        {champion && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-3 bg-accent/10 border border-accent/30 rounded-xl px-4 py-3"
          >
            <Trophy className="w-6 h-6 text-accent shrink-0" />
            <div>
              <p className="text-xs text-muted-foreground font-heading uppercase tracking-wider">Campeón</p>
              <div className="flex items-center gap-2">
                <FlagImage code={champion_data?.code} name={champion} size="sm" />
                <span className="font-display font-bold text-lg">{champion}</span>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0">
        {availableTabs.map(({ key, label }) => (
          <Button
            key={key}
            size="sm"
            variant={activeTab === key ? 'default' : 'ghost'}
            className="font-heading shrink-0"
            onClick={() => setActiveTab(key)}
          >
            {key === 'final' && <Trophy className="w-3 h-3 mr-1" />}
            {key === 'thirdPlace' && <Medal className="w-3 h-3 mr-1" />}
            {label}
          </Button>
        ))}
      </div>

      {/* Tab content */}
      <motion.div key={activeTab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
        {activeTab === 'groups'
          ? <GroupsTab tournament={tournament} />
          : <KnockoutTab roundKey={activeTab} tournament={tournament} />
        }
      </motion.div>
    </div>
  );
}