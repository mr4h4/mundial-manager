import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Plus, Trophy, Globe } from 'lucide-react';
import { getAllTournaments, deleteTournament } from '@/core/tournamentManager';
import TournamentCard from '@/components/tournament/TournamentCard';
import { motion, AnimatePresence } from 'framer-motion';

export default function Home() {
  const [tournaments, setTournaments] = useState([]);

  useEffect(() => {
    setTournaments(getAllTournaments());
  }, []);

  const handleDelete = (id) => {
    deleteTournament(id);
    setTournaments(getAllTournaments());
  };

  return (
    <div className="space-y-8">
      {/* Hero */}
      <div className="text-center py-8 sm:py-16 space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-primary/10 mb-2">
            <Globe className="w-10 h-10 text-primary" />
          </div>
          <h1 className="font-display text-4xl sm:text-6xl font-bold tracking-tight">
            WORLD CUP
            <span className="block text-primary">SIMULATOR</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-md mx-auto">
            Simula un Mundial de fútbol completo. Clasificación, sorteo, fase de grupos y eliminatorias.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Link to="/create">
            <Button size="lg" className="gap-2 font-heading text-lg px-8 h-14">
              <Plus className="w-5 h-5" />
              NUEVO TORNEO
            </Button>
          </Link>
        </motion.div>
      </div>

      {/* Tournament List */}
      {tournaments.length > 0 && (
        <div className="space-y-4">
          <h2 className="font-heading text-xl font-bold uppercase tracking-wide text-muted-foreground">
            Tus Torneos
          </h2>
          <AnimatePresence mode="popLayout">
            {tournaments.map((t, i) => (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ delay: i * 0.05 }}
              >
                <TournamentCard tournament={t} onDelete={handleDelete} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}