import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { FolderOpen, Save, Trash2, Upload } from 'lucide-react';
import { toast } from 'sonner';
import { listProjects, saveProject, deleteProject, SavedProject } from '@/lib/ebookProjectStorage';

interface Props<T> {
  scope: string;
  label: string;
  currentData: T;
  isEmpty: boolean;
  onLoad: (data: T) => void;
}

export function EbookProjectsPanel<T>({ scope, label, currentData, isEmpty, onLoad }: Props<T>) {
  const [name, setName] = useState('');
  const [projects, setProjects] = useState<SavedProject<T>[]>(() => listProjects<T>(scope));

  const refresh = () => setProjects(listProjects<T>(scope));

  const handleSave = () => {
    const finalName = name.trim() || `${label} ${new Date().toLocaleString('fr-FR')}`;
    if (isEmpty) {
      toast.error('Rien à sauvegarder — générez d\'abord du contenu');
      return;
    }
    saveProject<T>(scope, finalName, currentData);
    setName('');
    refresh();
    toast.success(`Projet "${finalName}" sauvegardé`);
  };

  const handleLoad = (p: SavedProject<T>) => {
    onLoad(p.data);
    toast.success(`Projet "${p.name}" chargé`);
  };

  const handleDelete = (id: string, n: string) => {
    deleteProject(scope, id);
    refresh();
    toast.success(`Projet "${n}" supprimé`);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <FolderOpen className="w-5 h-5 text-primary" /> Mes projets {label}
          <Badge variant="secondary" className="ml-2">{projects.length}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex gap-2">
          <Input value={name} onChange={e => setName(e.target.value)} placeholder="Nom du projet (ex: Maths CM2 - septembre)" />
          <Button onClick={handleSave}><Save className="w-4 h-4 mr-2" />Sauvegarder</Button>
        </div>
        {projects.length === 0 ? (
          <p className="text-sm text-muted-foreground">Aucun projet sauvegardé. Le travail en cours est aussi auto-sauvegardé automatiquement.</p>
        ) : (
          <div className="space-y-1 max-h-64 overflow-y-auto">
            {projects.map(p => (
              <div key={p.id} className="flex items-center justify-between gap-2 p-2 rounded border bg-card hover:bg-accent/20">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{p.name}</p>
                  <p className="text-xs text-muted-foreground">{new Date(p.updatedAt).toLocaleString('fr-FR')}</p>
                </div>
                <Button variant="ghost" size="sm" onClick={() => handleLoad(p)}><Upload className="w-3 h-3 mr-1" />Charger</Button>
                <Button variant="ghost" size="icon" onClick={() => handleDelete(p.id, p.name)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
