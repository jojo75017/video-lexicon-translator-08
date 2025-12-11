import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { 
  BarChart3, 
  TrendingUp, 
  BookOpen, 
  Target, 
  Award,
  Clock,
  Zap,
  DollarSign,
  Star,
  Sparkles
} from 'lucide-react';
import { Chapter } from '@/hooks/useEbookGeneration';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, LineChart, Line, Area, AreaChart } from 'recharts';

interface EbookAnalyticsDashboardProps {
  chapters: Chapter[];
  targetWordsPerChapter?: number;
  ebookTitle?: string;
}

export const EbookAnalyticsDashboard: React.FC<EbookAnalyticsDashboardProps> = ({
  chapters,
  targetWordsPerChapter = 2500,
  ebookTitle = 'Mon Ebook'
}) => {
  const analytics = useMemo(() => {
    const totalWords = chapters.reduce((acc, ch) => {
      const chapterWords = (ch.content || '').split(/\s+/).filter(w => w.length > 0).length;
      const subChapterWords = (ch.subChapters || []).reduce((subAcc, sub) => 
        subAcc + (sub.content || '').split(/\s+/).filter(w => w.length > 0).length, 0
      );
      return acc + chapterWords + subChapterWords;
    }, 0);

    const totalCharacters = chapters.reduce((acc, ch) => {
      const chapterChars = (ch.content || '').length;
      const subChapterChars = (ch.subChapters || []).reduce((subAcc, sub) => 
        subAcc + (sub.content || '').length, 0
      );
      return acc + chapterChars + subChapterChars;
    }, 0);

    const targetTotalWords = chapters.length * targetWordsPerChapter;
    const completionPercent = targetTotalWords > 0 ? Math.min(100, (totalWords / targetTotalWords) * 100) : 0;
    
    const chaptersWithContent = chapters.filter(ch => 
      (ch.content && ch.content.trim().length > 50) || 
      (ch.subChapters?.some(sub => sub.content && sub.content.trim().length > 50))
    ).length;

    const estimatedPages = Math.ceil(totalWords / 250); // ~250 words per page
    const estimatedReadingTime = Math.ceil(totalWords / 200); // ~200 words per minute

    // Calculate per-chapter stats
    const chapterStats = chapters.map((ch, index) => {
      const words = (ch.content || '').split(/\s+/).filter(w => w.length > 0).length +
        (ch.subChapters || []).reduce((acc, sub) => 
          acc + (sub.content || '').split(/\s+/).filter(w => w.length > 0).length, 0
        );
      return {
        name: `Ch ${index + 1}`,
        fullName: ch.title || `Chapitre ${index + 1}`,
        words,
        target: targetWordsPerChapter,
        completion: Math.min(100, (words / targetWordsPerChapter) * 100)
      };
    });

    // KDP Revenue estimation
    const pricePoint = 4.99; // Average ebook price
    const royaltyRate = 0.7; // 70% royalty
    const estimatedMonthlySales = Math.floor(estimatedPages * 0.5); // Rough estimate based on content
    const estimatedMonthlyRevenue = estimatedMonthlySales * pricePoint * royaltyRate;

    return {
      totalWords,
      totalCharacters,
      targetTotalWords,
      completionPercent,
      chaptersWithContent,
      totalChapters: chapters.length,
      estimatedPages,
      estimatedReadingTime,
      chapterStats,
      estimatedMonthlySales,
      estimatedMonthlyRevenue
    };
  }, [chapters, targetWordsPerChapter]);

  const COLORS = ['hsl(var(--primary))', 'hsl(var(--muted))'];
  const CHART_COLORS = ['#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#6366f1', '#84cc16'];

  const pieData = [
    { name: 'Complété', value: analytics.completionPercent },
    { name: 'Restant', value: 100 - analytics.completionPercent }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-violet-500/20 to-purple-500/10 border-violet-500/30 hover:scale-105 transition-transform duration-300">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-violet-500/20 rounded-lg">
                <BookOpen className="h-5 w-5 text-violet-400" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Total Mots</p>
                <p className="text-2xl font-bold text-violet-400">{analytics.totalWords.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-cyan-500/20 to-blue-500/10 border-cyan-500/30 hover:scale-105 transition-transform duration-300">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-cyan-500/20 rounded-lg">
                <Target className="h-5 w-5 text-cyan-400" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Pages estimées</p>
                <p className="text-2xl font-bold text-cyan-400">{analytics.estimatedPages}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-emerald-500/20 to-green-500/10 border-emerald-500/30 hover:scale-105 transition-transform duration-300">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-500/20 rounded-lg">
                <Clock className="h-5 w-5 text-emerald-400" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Temps de lecture</p>
                <p className="text-2xl font-bold text-emerald-400">{analytics.estimatedReadingTime} min</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-500/20 to-orange-500/10 border-amber-500/30 hover:scale-105 transition-transform duration-300">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-500/20 rounded-lg">
                <Award className="h-5 w-5 text-amber-400" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Chapitres rédigés</p>
                <p className="text-2xl font-bold text-amber-400">{analytics.chaptersWithContent}/{analytics.totalChapters}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Progress & Charts Row */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Completion Pie Chart */}
        <Card className="border-primary/20 bg-gradient-to-br from-card to-card/80">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Sparkles className="h-5 w-5 text-primary" />
              Progression globale
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-6">
              <div className="w-32 h-32">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={35}
                      outerRadius={50}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index]} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex-1">
                <p className="text-4xl font-bold text-primary">{Math.round(analytics.completionPercent)}%</p>
                <p className="text-sm text-muted-foreground">
                  {analytics.totalWords.toLocaleString()} / {analytics.targetTotalWords.toLocaleString()} mots
                </p>
                <Progress value={analytics.completionPercent} className="mt-3 h-2" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* KDP Revenue Estimator */}
        <Card className="border-emerald-500/30 bg-gradient-to-br from-emerald-500/10 to-green-500/5">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-lg">
              <DollarSign className="h-5 w-5 text-emerald-400" />
              Estimation revenus KDP
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-emerald-500/10 rounded-lg">
                <span className="text-sm">Ventes estimées/mois</span>
                <span className="text-xl font-bold text-emerald-400">{analytics.estimatedMonthlySales}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-emerald-500/20 rounded-lg">
                <span className="text-sm">Revenus estimés/mois</span>
                <span className="text-2xl font-bold text-emerald-400">${analytics.estimatedMonthlyRevenue.toFixed(2)}</span>
              </div>
              <p className="text-xs text-muted-foreground">
                * Basé sur un prix de 4.99$ et 70% de royalties. Les résultats réels peuvent varier.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Chapter Progress Bar Chart */}
      <Card className="border-primary/20 bg-gradient-to-br from-card to-card/80">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-lg">
            <BarChart3 className="h-5 w-5 text-primary" />
            Progression par chapitre
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics.chapterStats} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                <YAxis tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                  formatter={(value: number, name: string) => [
                    `${value.toLocaleString()} mots`,
                    name === 'words' ? 'Écrit' : 'Objectif'
                  ]}
                  labelFormatter={(label) => {
                    const chapter = analytics.chapterStats.find(c => c.name === label);
                    return chapter?.fullName || label;
                  }}
                />
                <Bar dataKey="words" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                <Bar dataKey="target" fill="hsl(var(--muted))" radius={[4, 4, 0, 0]} opacity={0.3} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Writing Stats Area Chart */}
      <Card className="border-primary/20 bg-gradient-to-br from-card to-card/80">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-lg">
            <TrendingUp className="h-5 w-5 text-primary" />
            Distribution du contenu
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={analytics.chapterStats} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorWords" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                <YAxis tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="words" 
                  stroke="hsl(var(--primary))" 
                  fillOpacity={1} 
                  fill="url(#colorWords)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Achievement Badges */}
      <Card className="border-primary/20 bg-gradient-to-br from-card to-card/80">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Star className="h-5 w-5 text-amber-400" />
            Badges de réussite
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            {analytics.totalWords >= 1000 && (
              <div className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-amber-500/20 to-orange-500/20 rounded-full border border-amber-500/30 animate-scale-in">
                <Zap className="h-4 w-4 text-amber-400" />
                <span className="text-sm font-medium">1000 mots</span>
              </div>
            )}
            {analytics.totalWords >= 5000 && (
              <div className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-violet-500/20 to-purple-500/20 rounded-full border border-violet-500/30 animate-scale-in">
                <Star className="h-4 w-4 text-violet-400" />
                <span className="text-sm font-medium">5000 mots</span>
              </div>
            )}
            {analytics.totalWords >= 10000 && (
              <div className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full border border-cyan-500/30 animate-scale-in">
                <Award className="h-4 w-4 text-cyan-400" />
                <span className="text-sm font-medium">10000 mots</span>
              </div>
            )}
            {analytics.chaptersWithContent >= 3 && (
              <div className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-emerald-500/20 to-green-500/20 rounded-full border border-emerald-500/30 animate-scale-in">
                <BookOpen className="h-4 w-4 text-emerald-400" />
                <span className="text-sm font-medium">3 chapitres</span>
              </div>
            )}
            {analytics.completionPercent >= 50 && (
              <div className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-pink-500/20 to-rose-500/20 rounded-full border border-pink-500/30 animate-scale-in">
                <Target className="h-4 w-4 text-pink-400" />
                <span className="text-sm font-medium">50% complété</span>
              </div>
            )}
            {analytics.completionPercent >= 100 && (
              <div className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-yellow-400/30 to-amber-400/30 rounded-full border border-yellow-400/50 animate-scale-in shadow-lg shadow-yellow-500/20">
                <Sparkles className="h-4 w-4 text-yellow-400" />
                <span className="text-sm font-bold text-yellow-400">Livre terminé ! 🎉</span>
              </div>
            )}
            {analytics.totalWords === 0 && (
              <p className="text-sm text-muted-foreground">Commencez à écrire pour débloquer des badges !</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EbookAnalyticsDashboard;
