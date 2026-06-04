import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trophy, Star, ArrowLeft } from 'lucide-react';
import FlagImage from '@/components/ui/FlagImage';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function ChampionScreen({ tournament }) {
  const champion = tournament.countries.find(c => c.name === tournament.champion);
  const finalist = tournament.knockout?.final?.[0];
  const thirdPlace = tournament.knockout?.thirdPlace?.[0];

  return (
    <div className="space-y-8 py-8">
      {/* Champion */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, type: 'spring' }}
        className="text-center space-y-6"
      >
        <div className="relative inline-block">
          <motion.div
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          >
            <Trophy className="w-24 h-24 text-accent mx-auto" />
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="absolute -top-2 -right-2"
          >
            <Star className="w-8 h-8 text-accent fill-accent" />
          </motion.div>
        </div>

        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground font-heading mb-2">
            Campeón del Mundo
          </p>
          <div className="flex justify-center mb-4">
            <FlagImage code={champion?.code} name={champion?.name} size="xl" className="w-20 h-14 rounded-md shadow-lg" />
          </div>
          <h1 className="font-display text-4xl sm:text-6xl font-bold tracking-tight">
            {tournament.champion}
          </h1>
        </div>

        <p className="font-heading text-lg text-muted-foreground uppercase tracking-wide">
          {tournament.name}
        </p>
      </motion.div>

      {/* Final result */}
      {finalist && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="max-w-lg mx-auto"
        >
          <Card className="p-6 text-center border-accent/30 bg-accent/5">
            <p className="text-xs uppercase tracking-wider text-muted-foreground mb-3 font-heading">Final</p>
            <div className="flex items-center justify-center gap-6">
              <div className="text-center">
                <FlagImage code={tournament.countries.find(c => c.name === finalist.teamA)?.code} name={finalist.teamA} size="lg" />
                <p className="font-heading font-bold text-sm mt-1">{finalist.teamA}</p>
              </div>
              <div className="font-display text-3xl font-bold">
                {finalist.goalsA} - {finalist.goalsB}
              </div>
              <div className="text-center">
                <FlagImage code={tournament.countries.find(c => c.name === finalist.teamB)?.code} name={finalist.teamB} size="lg" />
                <p className="font-heading font-bold text-sm mt-1">{finalist.teamB}</p>
              </div>
            </div>
            {finalist.penalties && (
              <p className="text-sm text-muted-foreground mt-2">
                Penales: {finalist.penaltiesA}-{finalist.penaltiesB}
              </p>
            )}
          </Card>
        </motion.div>
      )}

      {/* Third place */}
      {thirdPlace?.played && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="max-w-sm mx-auto"
        >
          <Card className="p-4 text-center">
            <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2 font-heading">Tercer Puesto</p>
            <p className="font-heading font-bold">
              🥉 {thirdPlace.winner}
            </p>
            <p className="text-sm text-muted-foreground">
              {thirdPlace.teamA} {thirdPlace.goalsA} - {thirdPlace.goalsB} {thirdPlace.teamB}
            </p>
          </Card>
        </motion.div>
      )}

      {/* Actions */}
      <div className="flex justify-center gap-3">
        <Link to="/">
          <Button variant="outline" className="gap-2 font-heading">
            <ArrowLeft className="w-4 h-4" /> VOLVER AL INICIO
          </Button>
        </Link>
      </div>
    </div>
  );
}