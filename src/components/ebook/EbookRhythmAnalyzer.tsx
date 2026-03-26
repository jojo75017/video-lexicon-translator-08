import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { Activity, BookOpen, MessageSquare, Eye, Zap } from 'lucide-react';

interface Chapter {
  id: string;
  title: string;
  content?: string;
  subChapters?: { id: string; title: string; content?: string }[];
}

interface EbookRhythmAnalyzerProps {
  chapters: Chapter[];
  ebookTitle?: string;
}

const analyzeChapterRhythm = (text: string) => {
  if (!text || text.trim().length === 0) return { action: 0, dialogue: 0, description: 0, narration: 0, total: 0 };

  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 5);
  let action = 0, dialogue = 0, description = 0, narration = 0;

  sentences.forEach(sentence => {
    const s = sentence.trim().toLowerCase();
    // Dialogue detection
    if (/[«»"""]/.test(sentence) || /^\s*[-–—]/.test(sentence) || /dit[- ]|répondit|murmura|cria|demanda|s'exclama|chuchota|ajouta/i.test(s)) {
      dialogue++;
    }
    // Action detection
    else if (/courut|frappa|sauta|lança|attrapa|bondit|s'élança|tira|poussa|saisit|se précipita|combattit|esquiva|tomba|se leva|marcha|traversa|ouvrit|ferma|prit|donna/i.test(s)) {
      action++;
    }
    // Description detection
    else if (/était|semblait|paraissait|ressemblait|se trouvait|s'étendait|brillait|luisait|couleur|forme|grand|petit|immense|sombre|lumineux|ancien|vieux|nouveau/i.test(s)) {
      description++;
    }
    // Narration (everything else)
    else {
      narration++;
    }
  });

  const total = action + dialogue + description + narration || 1;
  return {
    action: Math.round((action / total) * 100),
    dialogue: Math.round((dialogue / total) * 100),
    description: Math.round((description / total) * 100),
    narration: Math.round((narration / total) * 100),
    total: sentences.length,
  };
};

const getRhythmAdvice = (action: number, dialogue: number, description: number) => {
  const tips: string[] = [];
  if (dialogue < 15) tips.push('💬 Ajoutez plus de dialogues pour dynamiser le récit');
  if (dialogue > 60) tips.push('💬 Trop de dialogues — ajoutez des descriptions pour ancrer la scène');
  if (action < 10) tips.push('⚡ Le rythme manque d\'action — ajoutez des scènes de mouvement');
  if (action > 50) tips.push('⚡ Trop d\'action sans pause — ajoutez des moments de réflexion');
  if (description > 50) tips.push('🎨 Descriptions excessives — allégez pour maintenir le rythme');
  if (description < 10) tips.push('🎨 Ajoutez des descriptions pour immerger le lecteur');
  if (tips.length === 0) tips.push('✅ Bon équilibre narratif ! Le rythme est bien dosé');
  return tips;
};

export const EbookRhythmAnalyzer: React.FC<EbookRhythmAnalyzerProps> = ({ chapters, ebookTitle = 'Mon Ebook' }) => {
  const analysis = useMemo(() => {
    return chapters.map((ch, i) => {
      let fullText = ch.content || '';
      ch.subChapters?.forEach(sc => { if (sc.content) fullText += ' ' + sc.content; });
      const rhythm = analyzeChapterRhythm(fullText);
      return {
        name: `Ch.${i + 1}`,
        fullTitle: ch.title,
        ...rhythm,
      };
    });
  }, [chapters]);

  const globalRhythm = useMemo(() => {
    const totals = { action: 0, dialogue: 0, description: 0, narration: 0, count: 0 };
    analysis.forEach(a => {
      totals.action += a.action;
      totals.dialogue += a.dialogue;
      totals.description += a.description;
      totals.narration += a.narration;
      totals.count++;
    });
    const c = totals.count || 1;
    return {
      action: Math.round(totals.action / c),
      dialogue: Math.round(totals.dialogue / c),
      description: Math.round(totals.description / c),
      narration: Math.round(totals.narration / c),
    };
  }, [analysis]);

  const radarData = [
    { subject: 'Action', value: globalRhythm.action, fullMark: 100 },
    { subject: 'Dialogue', value: globalRhythm.dialogue, fullMark: 100 },
    { subject: 'Description', value: globalRhythm.description, fullMark: 100 },
    { subject: 'Narration', value: globalRhythm.narration, fullMark: 100 },
  ];

  const advice = getRhythmAdvice(globalRhythm.action, globalRhythm.dialogue, globalRhythm.description);

  if (chapters.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="pt-6 text-center text-muted-foreground">
          <Activity className="h-12 w-12 mx-auto mb-3 opacity-30" />
          <p>Générez du contenu pour analyser le rythme littéraire</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-xl">
            <div className="p-2 rounded-xl bg-primary/10">
              <Activity className="h-5 w-5 text-primary" />
            </div>
            Analyseur de Rythme Littéraire
            <Badge className="bg-primary/10 text-primary border-primary/30">PRO</Badge>
          </CardTitle>
          <CardDescription>
            Visualisez l'équilibre Action / Dialogue / Description / Narration par chapitre
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Global metrics */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'Action', value: globalRhythm.action, icon: Zap, color: 'text-orange-500' },
          { label: 'Dialogue', value: globalRhythm.dialogue, icon: MessageSquare, color: 'text-blue-500' },
          { label: 'Description', value: globalRhythm.description, icon: Eye, color: 'text-green-500' },
          { label: 'Narration', value: globalRhythm.narration, icon: BookOpen, color: 'text-purple-500' },
        ].map(m => (
          <Card key={m.label}>
            <CardContent className="pt-4 text-center">
              <m.icon className={`h-5 w-5 mx-auto mb-1 ${m.color}`} />
              <div className="text-2xl font-bold">{m.value}%</div>
              <div className="text-xs text-muted-foreground">{m.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Bar chart */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Rythme par Chapitre</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analysis} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="name" fontSize={12} />
                <YAxis unit="%" fontSize={12} />
                <Tooltip
                  formatter={(value: number, name: string) => [`${value}%`, name]}
                  labelFormatter={(label) => {
                    const ch = analysis.find(a => a.name === label);
                    return ch ? `${label} : ${ch.fullTitle}` : label;
                  }}
                />
                <Legend />
                <Bar dataKey="action" name="Action" fill="hsl(25, 95%, 53%)" radius={[2, 2, 0, 0]} />
                <Bar dataKey="dialogue" name="Dialogue" fill="hsl(217, 91%, 60%)" radius={[2, 2, 0, 0]} />
                <Bar dataKey="description" name="Description" fill="hsl(142, 71%, 45%)" radius={[2, 2, 0, 0]} />
                <Bar dataKey="narration" name="Narration" fill="hsl(270, 50%, 60%)" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Radar chart */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Profil Global</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <RadarChart data={radarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" fontSize={12} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} fontSize={10} />
                <Radar name="Rythme" dataKey="value" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.3} />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Advice */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Conseils d'Équilibre</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {advice.map((tip, i) => (
              <div key={i} className="p-3 rounded-lg bg-muted/50 text-sm">{tip}</div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EbookRhythmAnalyzer;
