import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Trophy, ArrowRight, X } from 'lucide-react';
import { createTournament } from '@/core/tournamentManager';
import { getAllCountries } from '@/core/countries';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { motion } from 'framer-motion';
import FlagImage from '@/components/ui/FlagImage';

export default function CreateTournament() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [format, setFormat] = useState('32');
  const [rankingMode, setRankingMode] = useState('real');
  const [hosts, setHosts] = useState([]);
  const [hostSearch, setHostSearch] = useState('');
  
  const allCountries = getAllCountries();
  const maxHosts = 3;

  const filteredCountries = hostSearch.length > 0
    ? allCountries.filter(c => 
        c.name.toLowerCase().includes(hostSearch.toLowerCase()) &&
        !hosts.find(h => h.name === c.name)
      ).slice(0, 8)
    : [];

  const addHost = (country) => {
    if (hosts.length < maxHosts && !hosts.find(h => h.name === country.name)) {
      setHosts([...hosts, country]);
      setHostSearch('');
    }
  };

  const removeHost = (name) => {
    setHosts(hosts.filter(h => h.name !== name));
  };

  const handleCreate = () => {
    if (!name.trim() || hosts.length === 0) return;
    const tournament = createTournament({
      name: name.trim(),
      format: parseInt(format),
      hosts,
      rankingMode
    });
    navigate(`/tournament/${tournament.id}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto space-y-6"
    >
      <div className="space-y-1">
        <h1 className="font-display text-3xl font-bold tracking-tight">CREAR TORNEO</h1>
        <p className="text-muted-foreground">Configura tu simulación de Copa del Mundo</p>
      </div>

      <Card>
        <CardContent className="p-6 space-y-6">
          {/* Name */}
          <div className="space-y-2">
            <Label className="font-heading uppercase text-sm tracking-wide">Nombre del torneo</Label>
            <Input
              placeholder="Ej: Copa del Mundo 2026"
              value={name}
              onChange={e => setName(e.target.value)}
              className="h-12 text-lg"
            />
          </div>

          {/* Format */}
          <div className="space-y-3">
            <Label className="font-heading uppercase text-sm tracking-wide">Formato</Label>
            <RadioGroup value={format} onValueChange={setFormat} className="grid grid-cols-2 gap-3">
              {['32', '48'].map(f => (
                <Label
                  key={f}
                  htmlFor={`format-${f}`}
                  className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    format === f ? 'border-primary bg-primary/5' : 'border-border hover:border-muted-foreground/30'
                  }`}
                >
                  <RadioGroupItem value={f} id={`format-${f}`} />
                  <div>
                    <p className="font-heading font-bold text-xl">{f}</p>
                    <p className="text-xs text-muted-foreground">equipos</p>
                  </div>
                </Label>
              ))}
            </RadioGroup>
          </div>

          {/* Hosts */}
          <div className="space-y-3">
            <Label className="font-heading uppercase text-sm tracking-wide">
              País(es) anfitrión ({hosts.length}/{maxHosts})
            </Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {hosts.map(h => (
                <Badge key={h.name} variant="secondary" className="py-1.5 px-3 gap-2 text-sm flex items-center">
                  <FlagImage code={h.code} name={h.name} size="xs" />
                  {h.name}
                  <button onClick={() => removeHost(h.name)}>
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
            {hosts.length < maxHosts && (
              <div className="relative">
                <Input
                  placeholder="Buscar país..."
                  value={hostSearch}
                  onChange={e => setHostSearch(e.target.value)}
                />
                {filteredCountries.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto">
                    {filteredCountries.map(c => (
                      <button
                        key={c.name}
                        onClick={() => addHost(c)}
                        className="w-full px-4 py-2.5 text-left hover:bg-muted flex items-center gap-3 text-sm"
                      >
                        <FlagImage code={c.code} name={c.name} size="sm" />
                        <span>{c.name}</span>
                        <span className="text-xs text-muted-foreground ml-auto">{c.confederation}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Ranking Mode */}
          <div className="space-y-3">
            <Label className="font-heading uppercase text-sm tracking-wide">Modo de ranking</Label>
            <RadioGroup value={rankingMode} onValueChange={setRankingMode} className="space-y-2">
              {[
                { value: 'real', label: 'Real', desc: 'Rankings FIFA aproximados' },
                { value: 'random', label: 'Aleatorio', desc: 'Rankings generados al azar' },
                { value: 'custom', label: 'Personalizado', desc: 'Edita los rankings manualmente' },
              ].map(opt => (
                <Label
                  key={opt.value}
                  htmlFor={`rank-${opt.value}`}
                  className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${
                    rankingMode === opt.value ? 'border-primary bg-primary/5' : 'border-border hover:border-muted-foreground/30'
                  }`}
                >
                  <RadioGroupItem value={opt.value} id={`rank-${opt.value}`} />
                  <div>
                    <p className="font-semibold">{opt.label}</p>
                    <p className="text-xs text-muted-foreground">{opt.desc}</p>
                  </div>
                </Label>
              ))}
            </RadioGroup>
          </div>

          {/* Submit */}
          <Button
            size="lg"
            className="w-full h-14 font-heading text-lg gap-2"
            disabled={!name.trim() || hosts.length === 0}
            onClick={handleCreate}
          >
            <Trophy className="w-5 h-5" />
            CREAR TORNEO
            <ArrowRight className="w-5 h-5" />
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}