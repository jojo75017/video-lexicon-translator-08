import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Plus, Trash2, CheckCircle2, Clock, AlertTriangle, ChevronLeft, ChevronRight, BookOpen } from 'lucide-react';
import { toast } from 'sonner';
import { format, addDays, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isSameMonth, isToday, addMonths, subMonths } from 'date-fns';
import { fr } from 'date-fns/locale';

interface CalendarTask {
  id: string;
  title: string;
  date: Date;
  type: 'writing' | 'editing' | 'cover' | 'publish' | 'marketing' | 'review';
  status: 'todo' | 'in-progress' | 'done';
  chapter?: string;
  wordGoal?: number;
}

const typeConfig: Record<string, { label: string; emoji: string; color: string }> = {
  writing: { label: 'Rédaction', emoji: '✍️', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' },
  editing: { label: 'Révision', emoji: '✏️', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' },
  cover: { label: 'Couverture', emoji: '🎨', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300' },
  publish: { label: 'Publication', emoji: '🚀', color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' },
  marketing: { label: 'Marketing', emoji: '📣', color: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300' },
  review: { label: 'Relecture', emoji: '👁️', color: 'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300' },
};

const statusIcons: Record<string, React.ReactNode> = {
  'todo': <Clock className="h-3 w-3 text-muted-foreground" />,
  'in-progress': <AlertTriangle className="h-3 w-3 text-yellow-500" />,
  'done': <CheckCircle2 className="h-3 w-3 text-green-500" />,
};

interface EbookEditorialCalendarProps {
  chapters?: Array<{ id: string; title: string }>;
}

export const EbookEditorialCalendar: React.FC<EbookEditorialCalendarProps> = ({ chapters = [] }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [tasks, setTasks] = useState<CalendarTask[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', type: 'writing' as CalendarTask['type'], date: format(new Date(), 'yyyy-MM-dd'), wordGoal: 2000 });

  const daysInMonth = eachDayOfInterval({ start: startOfMonth(currentMonth), end: endOfMonth(currentMonth) });
  const firstDayOfWeek = startOfMonth(currentMonth).getDay();
  const paddingDays = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;

  const addTask = () => {
    if (!newTask.title.trim()) { toast.error('Titre requis'); return; }
    const task: CalendarTask = {
      id: Date.now().toString(),
      title: newTask.title,
      date: new Date(newTask.date),
      type: newTask.type,
      status: 'todo',
      wordGoal: newTask.wordGoal,
    };
    setTasks(prev => [...prev, task]);
    setNewTask({ title: '', type: 'writing', date: format(new Date(), 'yyyy-MM-dd'), wordGoal: 2000 });
    setShowAddForm(false);
    toast.success('Tâche ajoutée');
  };

  const toggleStatus = (id: string) => {
    setTasks(prev => prev.map(t => {
      if (t.id !== id) return t;
      const next = t.status === 'todo' ? 'in-progress' : t.status === 'in-progress' ? 'done' : 'todo';
      return { ...t, status: next };
    }));
  };

  const removeTask = (id: string) => setTasks(prev => prev.filter(t => t.id !== id));

  const autoGenerate = () => {
    if (chapters.length === 0) { toast.error('Aucun chapitre à planifier'); return; }
    const baseTasks: CalendarTask[] = [];
    const today = new Date();
    chapters.forEach((ch, i) => {
      baseTasks.push({
        id: `auto-write-${i}`,
        title: `Rédiger: ${ch.title}`,
        date: addDays(today, i * 2 + 1),
        type: 'writing',
        status: 'todo',
        chapter: ch.title,
        wordGoal: 2500,
      });
      baseTasks.push({
        id: `auto-edit-${i}`,
        title: `Réviser: ${ch.title}`,
        date: addDays(today, i * 2 + 2),
        type: 'editing',
        status: 'todo',
        chapter: ch.title,
      });
    });
    baseTasks.push({ id: 'auto-cover', title: 'Créer la couverture', date: addDays(today, chapters.length * 2 + 3), type: 'cover', status: 'todo' });
    baseTasks.push({ id: 'auto-publish', title: '🚀 Publication KDP', date: addDays(today, chapters.length * 2 + 7), type: 'publish', status: 'todo' });
    baseTasks.push({ id: 'auto-marketing', title: 'Lancer le marketing', date: addDays(today, chapters.length * 2 + 8), type: 'marketing', status: 'todo' });
    setTasks(baseTasks);
    toast.success(`${baseTasks.length} tâches générées automatiquement`);
  };

  const stats = {
    total: tasks.length,
    done: tasks.filter(t => t.status === 'done').length,
    inProgress: tasks.filter(t => t.status === 'in-progress').length,
    todo: tasks.filter(t => t.status === 'todo').length,
  };

  return (
    <div className="space-y-6">
      <Card className="border-primary/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Calendrier Éditorial
            </CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={autoGenerate}>
                <BookOpen className="h-4 w-4 mr-1" /> Auto-planifier
              </Button>
              <Button size="sm" onClick={() => setShowAddForm(!showAddForm)}>
                <Plus className="h-4 w-4 mr-1" /> Tâche
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Stats */}
          <div className="grid grid-cols-4 gap-2">
            {[
              { label: 'Total', value: stats.total, color: 'text-foreground' },
              { label: 'À faire', value: stats.todo, color: 'text-muted-foreground' },
              { label: 'En cours', value: stats.inProgress, color: 'text-yellow-500' },
              { label: 'Terminé', value: stats.done, color: 'text-green-500' },
            ].map(s => (
              <div key={s.label} className="text-center p-2 rounded-lg bg-muted/50">
                <div className={`text-xl font-bold ${s.color}`}>{s.value}</div>
                <div className="text-xs text-muted-foreground">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Add Form */}
          {showAddForm && (
            <Card className="p-4 space-y-3 bg-muted/30">
              <Input value={newTask.title} onChange={e => setNewTask(p => ({ ...p, title: e.target.value }))} placeholder="Titre de la tâche" />
              <div className="flex gap-2">
                <Input type="date" value={newTask.date} onChange={e => setNewTask(p => ({ ...p, date: e.target.value }))} className="flex-1" />
                <Select value={newTask.type} onValueChange={v => setNewTask(p => ({ ...p, type: v as any }))}>
                  <SelectTrigger className="flex-1"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {Object.entries(typeConfig).map(([k, v]) => (
                      <SelectItem key={k} value={k}>{v.emoji} {v.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={addTask} size="sm">Ajouter</Button>
            </Card>
          )}

          {/* Calendar Grid */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <Button variant="ghost" size="icon" onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <h3 className="font-semibold capitalize">{format(currentMonth, 'MMMM yyyy', { locale: fr })}</h3>
              <Button variant="ghost" size="icon" onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            <div className="grid grid-cols-7 gap-1">
              {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map(d => (
                <div key={d} className="text-center text-xs font-medium text-muted-foreground py-1">{d}</div>
              ))}
              {Array.from({ length: paddingDays }).map((_, i) => <div key={`pad-${i}`} />)}
              {daysInMonth.map(day => {
                const dayTasks = tasks.filter(t => isSameDay(t.date, day));
                return (
                  <div key={day.toISOString()} className={`min-h-[70px] p-1 rounded border text-xs ${isToday(day) ? 'border-primary bg-primary/5' : 'border-border/50'} ${!isSameMonth(day, currentMonth) ? 'opacity-30' : ''}`}>
                    <div className={`font-medium mb-0.5 ${isToday(day) ? 'text-primary' : ''}`}>{format(day, 'd')}</div>
                    {dayTasks.slice(0, 2).map(t => (
                      <div key={t.id} onClick={() => toggleStatus(t.id)} className={`cursor-pointer truncate rounded px-1 py-0.5 mb-0.5 text-[10px] leading-tight ${typeConfig[t.type].color}`}>
                        {typeConfig[t.type].emoji} {t.title.substring(0, 15)}
                      </div>
                    ))}
                    {dayTasks.length > 2 && <div className="text-[10px] text-muted-foreground">+{dayTasks.length - 2}</div>}
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Task List */}
      {tasks.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Toutes les tâches ({tasks.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-[400px] overflow-y-auto">
              {tasks.sort((a, b) => a.date.getTime() - b.date.getTime()).map(t => (
                <div key={t.id} className={`flex items-center gap-2 p-2 rounded-lg border ${t.status === 'done' ? 'opacity-60' : ''}`}>
                  <button onClick={() => toggleStatus(t.id)} className="shrink-0">{statusIcons[t.status]}</button>
                  <Badge className={`text-[10px] ${typeConfig[t.type].color}`}>{typeConfig[t.type].emoji} {typeConfig[t.type].label}</Badge>
                  <span className={`flex-1 text-sm ${t.status === 'done' ? 'line-through' : ''}`}>{t.title}</span>
                  <span className="text-xs text-muted-foreground">{format(t.date, 'dd/MM', { locale: fr })}</span>
                  <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => removeTask(t.id)}>
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default EbookEditorialCalendar;
