import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { CONFEDERATIONS, FIFA_SLOTS } from '@/core/countries';
import { PHASES } from '@/core/engine';
import { ArrowRight, Check, Users } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import FlagImage from '@/components/ui/FlagImage';

export default function QualificationPhase({ tournament, onSave }) {
  const { format, hosts, countries } = tournament;
  const slots = FIFA_SLOTS[format];
  
  const [selectedByConf, setSelectedByConf] = useState(() => {
    // Initialize with previously qualified teams if any
    const init = {};
    Object.keys(CONFEDERATIONS).forEach(conf => {
      init[conf] = { direct: [], playoff: [] };
    });
    // Auto-select hosts as qualified
    hosts.forEach(h => {
      if (h.confederation && init[h.confederation]) {
        init[h.confederation].direct.push(h.name);
      }
    });
    // Restore from tournament state
    if (tournament.qualified?.length > 0) {
      tournament.qualified.forEach(q => {
        if (init[q.confederation]) {
          if (!init[q.confederation].direct.includes(q.name)) {
            init[q.confederation].direct.push(q.name);
          }
        }
      });
    }
    return init;
  });

  const [playoffSelections, setPlayoffSelections] = useState(() => {
    const init = {};
    Object.keys(CONFEDERATIONS).forEach(conf => {
      init[conf] = [];
    });
    if (tournament.playoffTeams?.length > 0) {
      tournament.playoffTeams.forEach(t => {
        if (init[t.confederation]) {
          init[t.confederation].push(t.name);
        }
      });
    }
    return init;
  });

  const [expandedConf, setExpandedConf] = useState(null);

  const hostNames = useMemo(() => hosts.map(h => h.name), [hosts]);

  const getConfCountries = (conf) => {
    return countries.filter(c => c.confederation === conf).sort((a, b) => a.ranking - b.ranking);
  };

  const toggleDirect = (conf, name) => {
    if (hostNames.includes(name)) return; // Can't deselect hosts
    setSelectedByConf(prev => {
      const current = [...prev[conf].direct];
      const idx = current.indexOf(name);
      if (idx >= 0) {
        current.splice(idx, 1);
      } else {
        current.push(name);
      }
      return { ...prev, [conf]: { ...prev[conf], direct: current } };
    });
  };

  const togglePlayoff = (conf, name) => {
    setPlayoffSelections(prev => {
      const current = [...prev[conf]];
      const idx = current.indexOf(name);
      if (idx >= 0) {
        current.splice(idx, 1);
      } else {
        current.push(name);
      }
      return { ...prev, [conf]: current };
    });
  };

  const autoSelectByRanking = (conf) => {
    const confCountries = getConfCountries(conf);
    const directSlots = slots[conf]?.direct || 0;
    const playoffSlots = slots[conf]?.playoff || 0;
    
    // Auto-select top ranked teams
    const hostInConf = confCountries.filter(c => hostNames.includes(c.name));
    const nonHostInConf = confCountries.filter(c => !hostNames.includes(c.name));
    
    const directPicks = [...hostInConf.map(h => h.name)];
    let remaining = directSlots - directPicks.length;
    nonHostInConf.slice(0, Math.max(0, remaining)).forEach(c => directPicks.push(c.name));
    
    const playoffPicks = nonHostInConf
      .filter(c => !directPicks.includes(c.name))
      .slice(0, playoffSlots)
      .map(c => c.name);

    setSelectedByConf(prev => ({ ...prev, [conf]: { ...prev[conf], direct: directPicks } }));
    setPlayoffSelections(prev => ({ ...prev, [conf]: playoffPicks }));
  };

  const autoSelectAll = () => {
    Object.keys(CONFEDERATIONS).forEach(conf => autoSelectByRanking(conf));
  };

  const totalQualified = Object.values(selectedByConf).reduce((sum, v) => sum + v.direct.length, 0);
  const totalPlayoff = Object.values(playoffSelections).reduce((sum, v) => sum + v.length, 0);
  const neededTotal = format;
  const neededPlayoff = Object.values(slots).reduce((sum, s) => sum + (s.playoff || 0), 0);

  const canProceed = totalQualified + totalPlayoff >= neededTotal || 
    (totalQualified >= neededTotal - neededPlayoff && totalPlayoff >= neededPlayoff);

  const handleProceed = () => {
    const qualified = [];
    const playoffTeams = [];

    Object.entries(selectedByConf).forEach(([conf, { direct }]) => {
      direct.forEach(name => {
        const team = countries.find(c => c.name === name);
        if (team) qualified.push(team);
      });
    });

    Object.entries(playoffSelections).forEach(([conf, names]) => {
      names.forEach(name => {
        const team = countries.find(c => c.name === name);
        if (team) playoffTeams.push(team);
      });
    });

    const nextPhase = playoffTeams.length > 0 ? PHASES.PLAYOFFS : PHASES.DRAW;
    onSave({ qualified, playoffTeams, phase: nextPhase });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-xl font-bold">CLASIFICACIÓN</h2>
          <p className="text-sm text-muted-foreground">
            Selecciona los equipos clasificados por confederación
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={autoSelectAll} className="gap-2">
            <Check className="w-4 h-4" /> Auto-seleccionar por ranking
          </Button>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Card className="p-3 text-center">
          <p className="text-2xl font-bold text-primary">{totalQualified}</p>
          <p className="text-xs text-muted-foreground">Clasificados directos</p>
        </Card>
        <Card className="p-3 text-center">
          <p className="text-2xl font-bold text-accent">{totalPlayoff}</p>
          <p className="text-xs text-muted-foreground">Repesca</p>
        </Card>
        <Card className="p-3 text-center">
          <p className="text-2xl font-bold">{neededTotal}</p>
          <p className="text-xs text-muted-foreground">Necesarios</p>
        </Card>
        <Card className="p-3 text-center">
          <p className="text-2xl font-bold">{format === 32 ? 8 : 12}</p>
          <p className="text-xs text-muted-foreground">Grupos</p>
        </Card>
      </div>

      {/* Confederations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.entries(CONFEDERATIONS).map(([confKey, conf]) => {
          const confSlots = slots[confKey] || { direct: 0, playoff: 0 };
          const confCountries = getConfCountries(confKey);
          const directSelected = selectedByConf[confKey]?.direct || [];
          const playoffSelected = playoffSelections[confKey] || [];
          const isExpanded = expandedConf === confKey;

          return (
            <Card key={confKey} className="overflow-hidden">
              <CardHeader 
                className="p-4 cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => setExpandedConf(isExpanded ? null : confKey)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: conf.color }} />
                    <div>
                      <CardTitle className="text-base font-heading">{conf.name}</CardTitle>
                      <p className="text-xs text-muted-foreground">{conf.fullName}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {directSelected.length}/{confSlots.direct} directos
                    </Badge>
                    {confSlots.playoff > 0 && (
                      <Badge variant="outline" className="text-xs bg-accent/10">
                        {playoffSelected.length}/{confSlots.playoff} repesca
                      </Badge>
                    )}
                    <Button size="sm" variant="ghost" onClick={(e) => { e.stopPropagation(); autoSelectByRanking(confKey); }}>
                      Auto
                    </Button>
                  </div>
                </div>
              </CardHeader>

              {isExpanded && (
                <CardContent className="p-0 border-t">
                  <ScrollArea className="h-64">
                    <div className="p-2 space-y-0.5">
                      {confCountries.map(country => {
                        const isHost = hostNames.includes(country.name);
                        const isDirect = directSelected.includes(country.name);
                        const isPlayoff = playoffSelected.includes(country.name);

                        return (
                          <div
                            key={country.name}
                            className={`flex items-center justify-between py-2 px-3 rounded-lg text-sm transition-colors ${
                              isDirect ? 'bg-primary/10' : isPlayoff ? 'bg-accent/10' : 'hover:bg-muted'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <FlagImage code={country.code} name={country.name} size="sm" />
                              <span className={isDirect || isPlayoff ? 'font-medium' : ''}>{country.name}</span>
                              {isHost && <Badge className="text-[10px] py-0 bg-accent text-accent-foreground">Anfitrión</Badge>}
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-muted-foreground w-8 text-right">#{country.ranking}</span>
                              <div className="flex gap-1">
                                <Button
                                  size="sm"
                                  variant={isDirect ? "default" : "outline"}
                                  className="h-7 text-xs px-2"
                                  disabled={isHost}
                                  onClick={() => toggleDirect(confKey, country.name)}
                                >
                                  D
                                </Button>
                                {confSlots.playoff > 0 && !isDirect && (
                                  <Button
                                    size="sm"
                                    variant={isPlayoff ? "default" : "outline"}
                                    className="h-7 text-xs px-2 bg-accent/80 hover:bg-accent"
                                    onClick={() => togglePlayoff(confKey, country.name)}
                                  >
                                    R
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </ScrollArea>
                </CardContent>
              )}
            </Card>
          );
        })}
      </div>

      {/* Proceed */}
      <div className="flex justify-end">
        <Button
          size="lg"
          className="gap-2 font-heading"
          onClick={handleProceed}
          disabled={totalQualified < 2}
        >
          CONTINUAR
          <ArrowRight className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
}