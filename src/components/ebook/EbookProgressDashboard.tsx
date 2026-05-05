import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  BookOpen, FileText, Clock, CheckCircle2, Circle,
  PenLine, Image as ImageIcon, Rocket, Lightbulb,
  Target, Sparkles, ArrowRight, TrendingUp
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import type { Chapter } from '@/hooks/useSubscriptionGeneration';

// KDP palette (memory: charte-graphique-amazon-kdp-reposant)
const TEAL = '#008296';
const ORANGE = '#FF9E2D';
const TEXT = '#232F3E';
const BG_SOFT = '#FAFAFA';

interface EbookProgressDashboardProps {
  ebookTitle: string;
  authorName: string;
  bookDescription?: string;
  targetAudience?: string;
  chapters: Chapter[];
  preface?: string;
  conclusion?: string;
  coverImageUrl?: string;
  kdpDescription?: string;
  kdpKeywords?: string;
  kdpCategories?: string;
  numberOfChapters?: number;
  targetWordsPerChapter?: number;
  onNavigateToTab?: (tabId: string) => void;
}

const wordCount = (text?: string) =>
  text ? text.trim().split(/\s+/).filter(Boolean).length : 0;

export const EbookProgressDashboard: React.FC<EbookProgressDashboardProps> = ({
  ebookTitle,
  authorName,
  bookDescription = '',
  targetAudience = '',
  chapters,
  preface = '',
  conclusion = '',
  coverImageUrl,
  kdpDescription = '',
  kdpKeywords = '',
  kdpCategories = '',
  numberOfChapters,
  targetWordsPerChapter = 2000,
  onNavigateToTab,
}) => {
  // ============= Real data only — no mock numbers =============
  const stats = useMemo(() => {
    const totalChapters = chapters.length || numberOfChapters || 0;
    const writtenChapters = chapters.filter(c => wordCount(c.content) >= 200).length;
    const totalWords =
      chapters.reduce((acc, c) => acc + wordCount(c.content), 0) +
      wordCount(preface) +
      wordCount(conclusion);
    const targetTotal = (totalChapters || 8) * targetWordsPerChapter;
    const wordsProgress = Math.min(100, Math.round((totalWords / targetTotal) * 100));

    // KDP quality score (0-100) — based on actual fields filled
    const kdpChecks = [
      !!coverImageUrl,
      kdpDescription.length >= 200,
      kdpKeywords.split(/[,;\n]/).filter(k => k.trim().length > 2).length >= 5,
      !!kdpCategories,
    ];
    const kdpScore = Math.round((kdpChecks.filter(Boolean).length / kdpChecks.length) * 100);

    // Time remaining estimate: ~250 words/min reading => ~15 wpm writing assisted by AI ~ 500 wpm
    const wordsRemaining = Math.max(0, targetTotal - totalWords);
    const minutesRemaining = Math.round(wordsRemaining / 500); // AI-assisted pace
    const hoursRemaining = Math.max(0, Math.round(minutesRemaining / 60));

    return {
      totalChapters,
      writtenChapters,
      totalWords,
      targetTotal,
      wordsProgress,
      kdpScore,
      hoursRemaining,
    };
  }, [chapters, preface, conclusion, coverImageUrl, kdpDescription, kdpKeywords, kdpCategories, numberOfChapters, targetWordsPerChapter]);

  // ============= 5 milestones — global progress =============
  const milestones = useMemo(() => {
    const conceptOk = !!ebookTitle && !!authorName && bookDescription.length >= 50;
    const planOk = stats.totalChapters >= 3 && chapters.every(c => !!c.title);
    const writingOk = stats.writtenChapters >= Math.max(1, Math.floor(stats.totalChapters * 0.5));
    const writingDone = stats.totalChapters > 0 && stats.writtenChapters >= stats.totalChapters;
    const coverOk = !!coverImageUrl;
    const kdpOk = stats.kdpScore >= 75;

    return [
      { key: 'concept', label: 'Concept défini', done: conceptOk },
      { key: 'plan', label: 'Plan de chapitres', done: planOk },
      { key: 'writing', label: 'Rédaction terminée', done: writingDone, partial: writingOk && !writingDone },
      { key: 'cover', label: 'Couverture KDP', done: coverOk },
      { key: 'export', label: 'Prêt pour publication', done: kdpOk && coverOk && writingDone },
    ];
  }, [ebookTitle, authorName, bookDescription, stats, chapters, coverImageUrl]);

  const globalProgress = Math.round(
    (milestones.filter(m => m.done).length / milestones.length) * 100
  );

  // Phase label
  const phase = useMemo(() => {
    if (globalProgress >= 90) return { label: 'Phase 4 : Publication', color: 'bg-emerald-500' };
    if (globalProgress >= 60) return { label: 'Phase 3 : Édition', color: 'bg-amber-500' };
    if (globalProgress >= 30) return { label: 'Phase 2 : Rédaction', color: 'bg-blue-500' };
    return { label: 'Phase 1 : Conception', color: 'bg-violet-500' };
  }, [globalProgress]);

  // Next recommended action
  const nextAction = useMemo(() => {
    if (!milestones[0].done) return {
      title: '1️⃣ Définissez votre concept',
      desc: 'Renseignez titre, auteur et description (≥50 caractères) dans l\'onglet Configuration.',
      tab: 'config',
      cta: 'Configurer mon ebook',
    };
    if (!milestones[1].done) return {
      title: '2️⃣ Créez votre plan de chapitres',
      desc: 'Générez automatiquement un plan structuré avec l\'IA — c\'est la base de votre livre.',
      tab: 'complete-workflow',
      cta: 'Lancer le pipeline IA',
    };
    if (!milestones[2].done) return {
      title: '3️⃣ Rédigez vos chapitres',
      desc: `${stats.writtenChapters}/${stats.totalChapters} chapitres écrits. Continuez la rédaction assistée IA.`,
      tab: 'writing',
      cta: 'Continuer la rédaction',
    };
    if (!milestones[3].done) return {
      title: '4️⃣ Générez votre couverture KDP',
      desc: 'Couverture professionnelle Kindle + broché avec dimensions exactes.',
      tab: 'cover',
      cta: 'Créer la couverture',
    };
    if (!milestones[4].done) return {
      title: '5️⃣ Optimisez pour Amazon KDP',
      desc: 'Description, mots-clés (≥5) et catégories pour maximiser vos ventes.',
      tab: 'kdp-tools',
      cta: 'Optimiser pour KDP',
    };
    return {
      title: '🎉 Tout est prêt !',
      desc: 'Exportez votre manuscrit et publiez sur Amazon KDP.',
      tab: 'export',
      cta: 'Exporter mon livre',
    };
  }, [milestones, stats]);

  // ============= Chart data (real values only) =============
  const chapterData = chapters.slice(0, 12).map((c, i) => {
    const written = wordCount(c.content);
    return {
      name: c.title ? (c.title.length > 18 ? c.title.slice(0, 16) + '…' : c.title) : `Chap ${i + 1}`,
      écrits: written,
      objectif: targetWordsPerChapter,
    };
  });

  const taskRepartition = useMemo(() => {
    const items = [
      { name: 'Concept', value: milestones[0].done ? 100 : 0, color: '#8b5cf6' },
      { name: 'Plan', value: milestones[1].done ? 100 : 0, color: '#3b82f6' },
      { name: 'Rédaction', value: stats.totalChapters > 0 ? Math.round((stats.writtenChapters / stats.totalChapters) * 100) : 0, color: TEAL },
      { name: 'Couverture', value: milestones[3].done ? 100 : 0, color: ORANGE },
      { name: 'KDP', value: stats.kdpScore, color: '#10b981' },
    ];
    return items.filter(i => i.value > 0);
  }, [milestones, stats]);

  // Mini-checklist
  const checklist = [
    { label: 'Titre défini', done: !!ebookTitle },
    { label: 'Nom d\'auteur', done: !!authorName },
    { label: 'Description (≥50 car.)', done: bookDescription.length >= 50 },
    { label: 'Public cible défini', done: !!targetAudience },
    { label: 'Préface rédigée', done: wordCount(preface) >= 50 },
    { label: 'Plan ≥3 chapitres', done: stats.totalChapters >= 3 },
    { label: 'Conclusion rédigée', done: wordCount(conclusion) >= 50 },
    { label: 'Couverture générée', done: !!coverImageUrl },
    { label: 'Description KDP', done: kdpDescription.length >= 200 },
    { label: 'Mots-clés KDP (≥5)', done: kdpKeywords.split(/[,;\n]/).filter(k => k.trim().length > 2).length >= 5 },
  ];
  const checklistDone = checklist.filter(c => c.done).length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
      style={{ color: TEXT }}
    >
      {/* ===== A. Bandeau "Où en êtes-vous ?" ===== */}
      <Card className="border-2 overflow-hidden" style={{ borderColor: TEAL }}>
        <CardHeader
          className="pb-3"
          style={{ background: `linear-gradient(135deg, ${TEAL} 0%, #006d7e 100%)`, color: 'white' }}
        >
          <div className="flex items-start justify-between gap-3 flex-wrap">
            <div>
              <CardTitle className="text-xl flex items-center gap-2">
                <Target className="w-6 h-6" />
                Où en êtes-vous ?
              </CardTitle>
              <p className="text-white/85 text-sm mt-1">
                Tableau de bord de votre projet "{ebookTitle || 'Mon Ebook'}"
              </p>
            </div>
            <Badge className={`${phase.color} text-white border-0 text-sm px-3 py-1`}>
              {phase.label}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-5" style={{ background: BG_SOFT }}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold">Progression globale</span>
            <span className="text-2xl font-bold" style={{ color: TEAL }}>{globalProgress}%</span>
          </div>
          <Progress value={globalProgress} className="h-3 mb-4" />

          {/* 5 jalons */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mb-4">
            {milestones.map((m, i) => (
              <div
                key={m.key}
                className={`flex items-center gap-2 p-2 rounded-lg border text-xs ${
                  m.done ? 'bg-emerald-50 border-emerald-200' :
                  m.partial ? 'bg-amber-50 border-amber-200' :
                  'bg-white border-gray-200'
                }`}
              >
                {m.done ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : m.partial ? (
                  <Circle className="w-4 h-4 text-amber-500 shrink-0" />
                ) : (
                  <Circle className="w-4 h-4 text-gray-300 shrink-0" />
                )}
                <span className="font-medium truncate">{m.label}</span>
              </div>
            ))}
          </div>

          {/* Prochaine étape recommandée */}
          <div
            className="rounded-xl p-4 flex items-start justify-between gap-3 flex-wrap"
            style={{ background: 'white', border: `2px dashed ${ORANGE}` }}
          >
            <div className="flex items-start gap-3 flex-1 min-w-[260px]">
              <Lightbulb className="w-5 h-5 mt-0.5" style={{ color: ORANGE }} />
              <div>
                <div className="font-bold text-sm" style={{ color: TEXT }}>
                  Prochaine étape recommandée
                </div>
                <div className="font-semibold mt-1">{nextAction.title}</div>
                <div className="text-sm text-muted-foreground mt-1">{nextAction.desc}</div>
              </div>
            </div>
            {onNavigateToTab && (
              <Button
                onClick={() => onNavigateToTab(nextAction.tab)}
                style={{ background: TEAL }}
                className="hover:opacity-90 text-white shrink-0"
              >
                {nextAction.cta}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* ===== B. KPI cards ===== */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <KpiCard
          icon={<FileText className="w-5 h-5" />}
          label="Mots écrits"
          value={stats.totalWords.toLocaleString('fr-FR')}
          sub={`/ ${stats.targetTotal.toLocaleString('fr-FR')} objectif`}
          color={TEAL}
          progress={stats.wordsProgress}
        />
        <KpiCard
          icon={<BookOpen className="w-5 h-5" />}
          label="Chapitres complétés"
          value={`${stats.writtenChapters} / ${stats.totalChapters || '?'}`}
          sub={stats.totalChapters > 0 ? `${Math.round((stats.writtenChapters / stats.totalChapters) * 100)}% rédigé` : 'À planifier'}
          color="#3b82f6"
        />
        <KpiCard
          icon={<Clock className="w-5 h-5" />}
          label="Temps estimé restant"
          value={stats.hoursRemaining > 0 ? `~${stats.hoursRemaining}h` : '✓'}
          sub="avec assistance IA"
          color={ORANGE}
        />
        <KpiCard
          icon={<CheckCircle2 className="w-5 h-5" />}
          label="Score qualité KDP"
          value={`${stats.kdpScore}%`}
          sub={stats.kdpScore >= 75 ? 'Prêt à publier' : 'À optimiser'}
          color={stats.kdpScore >= 75 ? '#10b981' : ORANGE}
          progress={stats.kdpScore}
        />
      </div>

      {/* ===== C. Charts ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <TrendingUp className="w-4 h-4" style={{ color: TEAL }} />
              Progression par chapitre
            </CardTitle>
          </CardHeader>
          <CardContent>
            {chapterData.length > 0 ? (
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={chapterData} layout="vertical" margin={{ left: 10, right: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={90} tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="objectif" fill="#e5e7eb" radius={[0, 4, 4, 0]} />
                  <Bar dataKey="écrits" radius={[0, 4, 4, 0]}>
                    {chapterData.map((d, i) => (
                      <Cell key={i} fill={d.écrits >= d.objectif ? TEAL : d.écrits > 0 ? ORANGE : '#d1d5db'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <EmptyChart label="Aucun chapitre planifié — créez votre plan d'abord" />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Sparkles className="w-4 h-4" style={{ color: ORANGE }} />
              Répartition de l'avancement
            </CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center">
            {taskRepartition.length > 0 ? (
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie
                    data={taskRepartition}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                    label={({ name, value }) => `${name} ${value}%`}
                  >
                    {taskRepartition.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <EmptyChart label="Commencez par définir votre concept" />
            )}
          </CardContent>
        </Card>
      </div>

      {/* ===== D. Que faire maintenant ? — 4 actions ===== */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Rocket className="w-4 h-4" style={{ color: TEAL }} />
            Que faire maintenant ?
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            <ActionCard
              icon={<PenLine className="w-5 h-5" />}
              title="Plan IA"
              desc="Générer votre plan en 1 clic"
              done={milestones[1].done}
              onClick={() => onNavigateToTab?.('complete-workflow')}
            />
            <ActionCard
              icon={<FileText className="w-5 h-5" />}
              title="Rédaction"
              desc={`${stats.writtenChapters}/${stats.totalChapters} chapitres`}
              done={milestones[2].done}
              onClick={() => onNavigateToTab?.('writing')}
            />
            <ActionCard
              icon={<ImageIcon className="w-5 h-5" />}
              title="Couverture"
              desc="Kindle + broché"
              done={milestones[3].done}
              onClick={() => onNavigateToTab?.('cover')}
            />
            <ActionCard
              icon={<Rocket className="w-5 h-5" />}
              title="Publier KDP"
              desc="Description, mots-clés"
              done={milestones[4].done}
              onClick={() => onNavigateToTab?.('kdp-tools')}
            />
          </div>
        </CardContent>
      </Card>

      {/* ===== E. Mini-checklist ===== */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center justify-between">
            <span>Checklist de votre projet</span>
            <Badge variant="outline" className="text-xs">
              {checklistDone} / {checklist.length}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {checklist.map((item, i) => (
              <div
                key={i}
                className={`flex items-center gap-2 p-2 rounded text-sm ${
                  item.done ? 'bg-emerald-50' : 'bg-gray-50'
                }`}
              >
                {item.done ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : (
                  <Circle className="w-4 h-4 text-gray-300 shrink-0" />
                )}
                <span className={item.done ? 'text-foreground' : 'text-muted-foreground'}>
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

// ===== Sub-components =====
const KpiCard: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: string;
  sub?: string;
  color: string;
  progress?: number;
}> = ({ icon, label, value, sub, color, progress }) => (
  <Card>
    <CardContent className="pt-4 pb-3 px-4">
      <div className="flex items-center justify-between mb-1">
        <div style={{ color }}>{icon}</div>
      </div>
      <div className="text-2xl font-bold" style={{ color: TEXT }}>{value}</div>
      <div className="text-xs text-muted-foreground">{label}</div>
      {sub && <div className="text-[11px] mt-1" style={{ color }}>{sub}</div>}
      {typeof progress === 'number' && (
        <Progress value={progress} className="h-1 mt-2" />
      )}
    </CardContent>
  </Card>
);

const ActionCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  desc: string;
  done: boolean;
  onClick?: () => void;
}> = ({ icon, title, desc, done, onClick }) => (
  <button
    onClick={onClick}
    className={`text-left p-4 rounded-xl border-2 transition-all hover:shadow-md ${
      done
        ? 'border-emerald-200 bg-emerald-50/50 hover:border-emerald-400'
        : 'border-gray-200 bg-white hover:border-[#FF9E2D]'
    }`}
  >
    <div className="flex items-center justify-between mb-2">
      <div style={{ color: done ? '#10b981' : TEAL }}>{icon}</div>
      {done ? (
        <Badge className="bg-emerald-500 text-white border-0 text-[10px]">✓ Fait</Badge>
      ) : (
        <ArrowRight className="w-4 h-4 text-muted-foreground" />
      )}
    </div>
    <div className="font-semibold text-sm" style={{ color: TEXT }}>{title}</div>
    <div className="text-xs text-muted-foreground mt-0.5">{desc}</div>
  </button>
);

const EmptyChart: React.FC<{ label: string }> = ({ label }) => (
  <div className="text-center py-12 text-sm text-muted-foreground">
    <Lightbulb className="w-8 h-8 mx-auto mb-2 opacity-30" />
    {label}
  </div>
);

export default EbookProgressDashboard;
