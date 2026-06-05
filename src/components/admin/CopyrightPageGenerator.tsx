import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Copy } from 'lucide-react';
import { toast } from 'sonner';

const TEAL = '#008296';

// Générateur déterministe de page de copyright / mentions légales multi-langue
const CopyrightPageGenerator: React.FC = () => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [year, setYear] = useState(String(new Date().getFullYear()));
  const [isbn, setIsbn] = useState('');
  const [publisher, setPublisher] = useState('');
  const [dedication, setDedication] = useState('');
  const [lang, setLang] = useState('fr');

  const generate = (): string => {
    const t = title || '[Titre du livre]';
    const a = author || '[Nom de l\'auteur]';
    const pub = publisher || a;
    if (lang === 'en') {
      return [
        dedication ? `${dedication}\n\n— — —\n` : '',
        `${t}`,
        `Copyright © ${year} ${a}`,
        `All rights reserved.`,
        ``,
        `No part of this book may be reproduced, stored in a retrieval system, or transmitted in any form or by any means — electronic, mechanical, photocopying, recording, or otherwise — without the prior written permission of the author, except for brief quotations in a review.`,
        ``,
        `This is a work${''} published by ${pub}.`,
        isbn ? `ISBN: ${isbn}` : '',
        `First edition, ${year}`,
      ].filter(Boolean).join('\n');
    }
    return [
      dedication ? `${dedication}\n\n— — —\n` : '',
      `${t}`,
      `Copyright © ${year} ${a}`,
      `Tous droits réservés.`,
      ``,
      `Aucune partie de cet ouvrage ne peut être reproduite, stockée dans un système d'archivage ou transmise, sous quelque forme ou par quelque moyen que ce soit — électronique, mécanique, photocopie, enregistrement ou autre — sans l'autorisation écrite préalable de l'auteur, à l'exception de courtes citations dans le cadre d'une critique.`,
      ``,
      `Édité par ${pub}.`,
      isbn ? `ISBN : ${isbn}` : '',
      `Dépôt légal : ${year}`,
      `Première édition, ${year}`,
    ].filter(Boolean).join('\n');
  };

  const [output, setOutput] = useState('');

  return (
    <div className="space-y-4">
      <p className="text-sm text-joy-ink/70">
        Génère une page de copyright et mentions légales conforme, avec dédicace optionnelle,
        à insérer en début d'ebook.
      </p>
      <div className="grid gap-3 sm:grid-cols-2">
        <div><Label className="text-xs">Titre</Label><Input value={title} onChange={(e) => setTitle(e.target.value)} /></div>
        <div><Label className="text-xs">Auteur</Label><Input value={author} onChange={(e) => setAuthor(e.target.value)} /></div>
        <div><Label className="text-xs">Année</Label><Input value={year} onChange={(e) => setYear(e.target.value)} /></div>
        <div><Label className="text-xs">ISBN (optionnel)</Label><Input value={isbn} onChange={(e) => setIsbn(e.target.value)} /></div>
        <div><Label className="text-xs">Éditeur (optionnel)</Label><Input value={publisher} onChange={(e) => setPublisher(e.target.value)} placeholder="Par défaut : l'auteur" /></div>
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
        <div className="sm:col-span-2"><Label className="text-xs">Dédicace (optionnel)</Label><Input value={dedication} onChange={(e) => setDedication(e.target.value)} placeholder="À mes lecteurs…" /></div>
      </div>
      <Button onClick={() => setOutput(generate())} style={{ background: TEAL, color: 'white' }}>Générer la page</Button>
      {output && (
        <Card className="border-joy-ink/10"><CardContent className="p-4 space-y-3">
          <Textarea rows={14} value={output} onChange={(e) => setOutput(e.target.value)} className="text-xs" />
          <Button variant="outline" size="sm" className="gap-1.5"
            onClick={() => { navigator.clipboard.writeText(output); toast.success('Copié ✓'); }}>
            <Copy className="h-3.5 w-3.5" /> Copier
          </Button>
        </CardContent></Card>
      )}
    </div>
  );
};

export default CopyrightPageGenerator;
