import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Copy, ShieldCheck, Eye, AlertTriangle, FileDown, ExternalLink, Download } from 'lucide-react';
import { toast } from 'sonner';

const TEAL = '#008296';

const copy = (text: string) => {
  navigator.clipboard.writeText(text);
  toast.success('Copié ✓');
};

/* ------------------------------------------------------------------ */
/* 1. PROTÉGER AVANT PUBLICATION                                       */
/* ------------------------------------------------------------------ */
const ProtectTab: React.FC = () => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [year, setYear] = useState(String(new Date().getFullYear()));
  const [lang, setLang] = useState('fr');
  const [nonFiction, setNonFiction] = useState(true);
  const [financial, setFinancial] = useState(false);
  const [output, setOutput] = useState('');

  const generate = (): string => {
    const t = title || '[Titre du livre]';
    const a = author || "[Nom de l'auteur]";
    if (lang === 'en') {
      const lines = [
        t,
        `Copyright © ${year} ${a}`,
        'All rights reserved.',
        '',
        'No part of this publication may be reproduced, distributed, or transmitted in any form or by any means — including photocopying, recording, or other electronic or mechanical methods — without the prior written permission of the author, except for brief quotations used in reviews and certain other non-commercial uses permitted by copyright law.',
      ];
      if (nonFiction) lines.push('', 'This book reflects the personal experience and opinions of the author. It is provided for informational purposes only and does not constitute professional advice.');
      if (financial) lines.push('', 'The author makes no guarantee regarding financial results. Any figures or examples are illustrative and do not represent a promise of earnings.');
      lines.push('', `First edition, ${year}`);
      return lines.join('\n');
    }
    const lines = [
      t,
      `Copyright © ${year} ${a}`,
      'Tous droits réservés.',
      '',
      "Aucune partie de cette publication ne peut être reproduite, distribuée ou transmise sous quelque forme ou par quelque moyen que ce soit — photocopie, enregistrement ou autre procédé électronique ou mécanique — sans l'autorisation écrite préalable de l'auteur, à l'exception de courtes citations utilisées dans le cadre d'une critique et de certains usages non commerciaux autorisés par la loi sur le droit d'auteur.",
    ];
    if (nonFiction) lines.push('', "Cet ouvrage reflète l'expérience et les opinions personnelles de l'auteur. Il est fourni à titre informatif uniquement et ne constitue pas un conseil professionnel.");
    if (financial) lines.push('', "L'auteur ne garantit aucun résultat financier. Les chiffres ou exemples cités sont illustratifs et ne constituent en aucun cas une promesse de gains.");
    lines.push('', `Dépôt légal : ${year}`, `Première édition, ${year}`);
    return lines.join('\n');
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-joy-ink/70">
        Génère une page de copyright renforcée à insérer en début d'ebook. Ajoute les clauses
        adaptées à ton type d'ouvrage pour décourager la copie et limiter les litiges.
      </p>
      <div className="grid gap-3 sm:grid-cols-2">
        <div><Label className="text-xs">Titre</Label><Input value={title} onChange={(e) => setTitle(e.target.value)} /></div>
        <div><Label className="text-xs">Auteur</Label><Input value={author} onChange={(e) => setAuthor(e.target.value)} /></div>
        <div><Label className="text-xs">Année</Label><Input value={year} onChange={(e) => setYear(e.target.value)} /></div>
        <div>
          <Label className="text-xs">Langue</Label>
          <Select value={lang} onValueChange={setLang}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="fr">Français</SelectItem>
              <SelectItem value="en">Anglais</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <label className="flex items-center gap-2 text-sm">
          <Checkbox checked={nonFiction} onCheckedChange={(v) => setNonFiction(!!v)} />
          Ajouter la clause « ouvrage non-fiction / informatif »
        </label>
        <label className="flex items-center gap-2 text-sm">
          <Checkbox checked={financial} onCheckedChange={(v) => setFinancial(!!v)} />
          Ajouter le déni de responsabilité financière
        </label>
      </div>
      <Button onClick={() => setOutput(generate())} style={{ background: TEAL, color: 'white' }}>
        Générer la page Copyright
      </Button>
      {output && (
        <Card className="border-joy-ink/10"><CardContent className="p-4 space-y-3">
          <Textarea rows={14} value={output} onChange={(e) => setOutput(e.target.value)} className="text-xs" />
          <Button variant="outline" size="sm" className="gap-1.5" onClick={() => copy(output)}>
            <Copy className="h-3.5 w-3.5" /> Copier
          </Button>
        </CardContent></Card>
      )}

      <Card className="border-joy-ink/10 bg-joy-ink/[0.02]"><CardContent className="p-4 space-y-2">
        <h4 className="text-sm font-semibold flex items-center gap-1.5">
          <ShieldCheck className="h-4 w-4" style={{ color: TEAL }} /> Marquage & traçage (anti-copie)
        </h4>
        <ul className="text-xs text-joy-ink/70 list-disc pl-4 space-y-1">
          <li>Glisse 2 ou 3 <strong>phrases-pièges uniques</strong> dans ton texte : des tournures que personne d'autre n'écrirait. Elles serviront de preuve si quelqu'un copie ton contenu.</li>
          <li>Note ces phrases dans un fichier daté et conserve-le précieusement.</li>
          <li>Insère ton nom et l'année dans l'en-tête ou le pied de page du PDF intérieur.</li>
          <li>Garde une version horodatée du manuscrit (email à toi-même, dépôt légal, ou archive datée) comme preuve d'antériorité.</li>
        </ul>
      </CardContent></Card>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* 2. SURVEILLER                                                       */
/* ------------------------------------------------------------------ */
const WEEKLY_CHECKS = [
  "Rechercher le titre exact de l'ebook sur Google",
  "Rechercher le titre exact sur Amazon",
  "Coller une phrase unique de l'ebook dans Google (entre guillemets)",
  "Vérifier les nouvelles parutions suspectes dans ta niche",
  "Contrôler que ta fiche produit n'a pas été dupliquée",
];

const MonitorTab: React.FC = () => {
  const [title, setTitle] = useState('');
  const [phrase, setPhrase] = useState('');
  const [checked, setChecked] = useState<boolean[]>(WEEKLY_CHECKS.map(() => false));

  const toggle = (i: number) => setChecked((c) => c.map((v, idx) => (idx === i ? !v : v)));
  const done = checked.filter(Boolean).length;

  const queries = [
    title && `"${title}"`,
    phrase && `"${phrase}"`,
  ].filter(Boolean) as string[];

  return (
    <div className="space-y-4">
      <p className="text-sm text-joy-ink/70">
        Mets en place une surveillance simple. Crée des alertes Google et fais un mini-audit
        de 10 minutes chaque semaine.
      </p>

      <Card className="border-joy-ink/10"><CardContent className="p-4 space-y-3">
        <h4 className="text-sm font-semibold flex items-center gap-1.5">
          <Eye className="h-4 w-4" style={{ color: TEAL }} /> Générateur de requêtes d'alerte
        </h4>
        <div className="grid gap-3 sm:grid-cols-2">
          <div><Label className="text-xs">Titre exact du livre</Label><Input value={title} onChange={(e) => setTitle(e.target.value)} /></div>
          <div><Label className="text-xs">Phrase unique de ton texte</Label><Input value={phrase} onChange={(e) => setPhrase(e.target.value)} /></div>
        </div>
        {queries.length > 0 && (
          <div className="space-y-2">
            {queries.map((q, i) => (
              <div key={i} className="flex items-center gap-2">
                <code className="flex-1 text-xs bg-joy-ink/5 rounded px-2 py-1.5 truncate">{q}</code>
                <Button variant="outline" size="sm" className="gap-1" onClick={() => copy(q)}>
                  <Copy className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        )}
        <a href="https://www.google.com/alerts" target="_blank" rel="noreferrer"
          className="inline-flex items-center gap-1.5 text-xs font-medium" style={{ color: TEAL }}>
          <ExternalLink className="h-3.5 w-3.5" /> Créer ces alertes sur Google Alerts
        </a>
      </CardContent></Card>

      <Card className="border-joy-ink/10"><CardContent className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-semibold">Mini-audit hebdomadaire (10 min)</h4>
          <span className="text-xs text-joy-ink/50">{done}/{WEEKLY_CHECKS.length}</span>
        </div>
        <div className="space-y-2">
          {WEEKLY_CHECKS.map((c, i) => (
            <label key={i} className="flex items-start gap-2 text-sm cursor-pointer">
              <Checkbox checked={checked[i]} onCheckedChange={() => toggle(i)} className="mt-0.5" />
              <span className={checked[i] ? 'line-through text-joy-ink/40' : ''}>{c}</span>
            </label>
          ))}
        </div>
      </CardContent></Card>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* 3. RÉAGIR                                                           */
/* ------------------------------------------------------------------ */
const PROOF_CHECKS = [
  "Fichier source daté du manuscrit (export original)",
  "Email d'envoi à toi-même horodaté",
  "Captures d'écran de ta fiche KDP avec la date de publication",
  "Brouillons / versions successives conservés",
  "Liste des phrases-pièges uniques insérées",
  "Capture d'écran de la copie suspecte (URL + date visibles)",
];

const ReactTab: React.FC = () => {
  const [myTitle, setMyTitle] = useState('');
  const [pubDate, setPubDate] = useState('');
  const [penName, setPenName] = useState('');
  const [copiedTitle, setCopiedTitle] = useState('');
  const [copiedLink, setCopiedLink] = useState('');
  const [output, setOutput] = useState('');
  const [checked, setChecked] = useState<boolean[]>(PROOF_CHECKS.map(() => false));
  const toggle = (i: number) => setChecked((c) => c.map((v, idx) => (idx === i ? !v : v)));

  const generate = () => {
    const txt = [
      'Objet : Signalement d\'atteinte au droit d\'auteur (œuvre copiée)',
      '',
      'Bonjour,',
      '',
      `Je suis l'auteur de l'ouvrage « ${myTitle || '[Titre de mon livre]'} », publié le ${pubDate || '[date de publication]'} sous le nom ${penName || '[nom / pseudonyme]'}.`,
      '',
      `J'ai constaté que le contenu suivant reproduit mon œuvre sans mon autorisation : ${copiedTitle || '[titre du livre copié]'}${copiedLink ? ` (${copiedLink})` : ''}.`,
      '',
      "Je détiens les droits exclusifs sur cette œuvre et je dispose de preuves d'antériorité (fichiers sources datés, versions successives, éléments de traçage uniques). Cette publication constitue une violation de mes droits.",
      '',
      "Je vous demande de retirer immédiatement le contenu en infraction. Je certifie de bonne foi que l'usage signalé n'est pas autorisé par moi, mon mandataire ou la loi, et que les informations ci-dessus sont exactes.",
      '',
      'Dans l\'attente de votre intervention, je vous prie d\'agréer mes salutations distinguées.',
      '',
      `${penName || '[nom / pseudonyme]'}`,
      '[email de contact]',
    ].join('\n');
    setOutput(txt);
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-joy-ink/70">
        En cas de plagiat, rassemble tes preuves et envoie une demande de retrait formelle.
      </p>

      <Card className="border-joy-ink/10"><CardContent className="p-4 space-y-3">
        <h4 className="text-sm font-semibold flex items-center gap-1.5">
          <AlertTriangle className="h-4 w-4" style={{ color: TEAL }} /> Email de signalement / retrait
        </h4>
        <div className="grid gap-3 sm:grid-cols-2">
          <div><Label className="text-xs">Titre de mon livre</Label><Input value={myTitle} onChange={(e) => setMyTitle(e.target.value)} /></div>
          <div><Label className="text-xs">Date de publication</Label><Input value={pubDate} onChange={(e) => setPubDate(e.target.value)} placeholder="JJ/MM/AAAA" /></div>
          <div><Label className="text-xs">Mon nom / pseudo</Label><Input value={penName} onChange={(e) => setPenName(e.target.value)} /></div>
          <div><Label className="text-xs">Titre du livre copié</Label><Input value={copiedTitle} onChange={(e) => setCopiedTitle(e.target.value)} /></div>
          <div className="sm:col-span-2"><Label className="text-xs">Lien de la copie (URL)</Label><Input value={copiedLink} onChange={(e) => setCopiedLink(e.target.value)} /></div>
        </div>
        <Button onClick={generate} style={{ background: TEAL, color: 'white' }}>Générer l'email</Button>
        {output && (
          <div className="space-y-2">
            <Textarea rows={16} value={output} onChange={(e) => setOutput(e.target.value)} className="text-xs" />
            <Button variant="outline" size="sm" className="gap-1.5" onClick={() => copy(output)}>
              <Copy className="h-3.5 w-3.5" /> Copier
            </Button>
          </div>
        )}
        <div className="flex flex-wrap gap-3 pt-1">
          <a href="https://kdp.amazon.com/fr_FR/help/topic/G200635650" target="_blank" rel="noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-medium" style={{ color: TEAL }}>
            <ExternalLink className="h-3.5 w-3.5" /> Signaler une violation à Amazon KDP
          </a>
        </div>
      </CardContent></Card>

      <Card className="border-joy-ink/10"><CardContent className="p-4 space-y-3">
        <h4 className="text-sm font-semibold">Checklist des preuves d'antériorité</h4>
        <div className="space-y-2">
          {PROOF_CHECKS.map((c, i) => (
            <label key={i} className="flex items-start gap-2 text-sm cursor-pointer">
              <Checkbox checked={checked[i]} onCheckedChange={() => toggle(i)} className="mt-0.5" />
              <span className={checked[i] ? 'line-through text-joy-ink/40' : ''}>{c}</span>
            </label>
          ))}
        </div>
      </CardContent></Card>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* 4. PACK DE DÉFENSE (PDF)                                            */
/* ------------------------------------------------------------------ */
const PackTab: React.FC = () => (
  <div className="space-y-4">
    <p className="text-sm text-joy-ink/70">
      Télécharge le Pack Anti-Plagiat : un PDF prêt à l'emploi qui réunit le modèle de page
      Copyright, l'email de signalement à Amazon KDP, la checklist des preuves d'antériorité
      et la routine de surveillance hebdomadaire.
    </p>
    <Card className="border-joy-ink/10"><CardContent className="p-5 space-y-4">
      <div className="flex items-center gap-3">
        <FileDown className="h-8 w-8" style={{ color: TEAL }} />
        <div>
          <h4 className="font-semibold">Pack Anti-Plagiat (PDF)</h4>
          <p className="text-xs text-joy-ink/60">Modèles + checklists + liens utiles</p>
        </div>
      </div>
      <a href="/pack-anti-plagiat.pdf" download>
        <Button className="gap-1.5" style={{ background: TEAL, color: 'white' }}>
          <Download className="h-4 w-4" /> Télécharger le PDF
        </Button>
      </a>
    </CardContent></Card>
  </div>
);

/* ------------------------------------------------------------------ */
const EbookAntiPlagiat: React.FC = () => {
  return (
    <Tabs defaultValue="protect" className="w-full">
      <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4">
        <TabsTrigger value="protect" className="text-xs">1. Protéger</TabsTrigger>
        <TabsTrigger value="monitor" className="text-xs">2. Surveiller</TabsTrigger>
        <TabsTrigger value="react" className="text-xs">3. Réagir</TabsTrigger>
        <TabsTrigger value="pack" className="text-xs">4. Pack PDF</TabsTrigger>
      </TabsList>
      <TabsContent value="protect" className="mt-4"><ProtectTab /></TabsContent>
      <TabsContent value="monitor" className="mt-4"><MonitorTab /></TabsContent>
      <TabsContent value="react" className="mt-4"><ReactTab /></TabsContent>
      <TabsContent value="pack" className="mt-4"><PackTab /></TabsContent>
    </Tabs>
  );
};

export default EbookAntiPlagiat;
