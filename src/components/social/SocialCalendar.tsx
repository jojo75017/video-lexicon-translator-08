import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { ALL_TEMPLATES, PLATFORM_CONFIG, SocialPlatform, SocialPostTemplate } from '@/data/socialPostTemplates';
import { Calendar, Plus, Shuffle, Check, Clock } from 'lucide-react';
import { format, addDays, startOfWeek } from 'date-fns';
import { fr } from 'date-fns/locale';

interface CalendarPost {
  date: string;
  time: string;
  platform: SocialPlatform;
  template: SocialPostTemplate;
}

interface SocialCalendarProps {
  onSaveToDb: (posts: CalendarPost[]) => Promise<void>;
}

const SocialCalendar: React.FC<SocialCalendarProps> = ({ onSaveToDb }) => {
  const [calendarPosts, setCalendarPosts] = useState<CalendarPost[]>([]);
  const [weeks, setWeeks] = useState(2);
  const [platforms, setPlatforms] = useState<SocialPlatform[]>(['facebook', 'linkedin', 'x']);
  const [isSaving, setIsSaving] = useState(false);

  const generateCalendar = () => {
    const posts: CalendarPost[] = [];
    const totalDays = weeks * 7;
    const start = new Date();
    
    // Strategy: rotate platforms and post types across days
    const platformTemplates: Record<SocialPlatform, SocialPostTemplate[]> = {
      facebook: ALL_TEMPLATES.filter(t => t.platform === 'facebook'),
      linkedin: ALL_TEMPLATES.filter(t => t.platform === 'linkedin'),
      tiktok: ALL_TEMPLATES.filter(t => t.platform === 'tiktok'),
      pinterest: ALL_TEMPLATES.filter(t => t.platform === 'pinterest'),
      x: ALL_TEMPLATES.filter(t => t.platform === 'x'),
    };

    let dayIndex = 0;
    const counters: Record<string, number> = {};

    for (let d = 0; d < totalDays; d++) {
      const date = addDays(start, d);
      const dayOfWeek = date.getDay();
      
      // Skip Sundays
      if (dayOfWeek === 0) continue;

      // Pick 1-2 platforms per day
      const dayPlatforms = platforms.filter((_, i) => (dayIndex + i) % 2 === 0 || platforms.length <= 2);
      const selectedPlatforms = dayPlatforms.length > 0 ? dayPlatforms.slice(0, 2) : [platforms[0]];

      for (const platform of selectedPlatforms) {
        if (!platform) continue;
        const templates = platformTemplates[platform];
        if (!templates || templates.length === 0) continue;

        const key = platform;
        counters[key] = (counters[key] || 0) % templates.length;
        const template = templates[counters[key]];
        counters[key]++;

        const bestTimes = PLATFORM_CONFIG[platform].bestTimes;
        const time = bestTimes[d % bestTimes.length];

        posts.push({
          date: format(date, 'yyyy-MM-dd'),
          time,
          platform,
          template,
        });
      }
      dayIndex++;
    }

    setCalendarPosts(posts);
    toast.success(`${posts.length} posts planifiés sur ${weeks} semaines !`);
  };

  const togglePlatform = (p: SocialPlatform) => {
    setPlatforms(prev => 
      prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p]
    );
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSaveToDb(calendarPosts);
      toast.success('Calendrier sauvegardé !');
    } catch {
      toast.error('Erreur lors de la sauvegarde');
    } finally {
      setIsSaving(false);
    }
  };

  // Group by date for display
  const grouped = calendarPosts.reduce<Record<string, CalendarPost[]>>((acc, post) => {
    acc[post.date] = acc[post.date] || [];
    acc[post.date].push(post);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border-emerald-500/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Calendar className="h-5 w-5 text-emerald-400" />
            Planifier le calendrier éditorial
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {(Object.keys(PLATFORM_CONFIG) as SocialPlatform[]).map(p => (
              <Button
                key={p}
                size="sm"
                variant={platforms.includes(p) ? 'default' : 'outline'}
                onClick={() => togglePlatform(p)}
                className={platforms.includes(p) ? PLATFORM_CONFIG[p].color : ''}
              >
                {platforms.includes(p) && <Check className="h-3 w-3 mr-1" />}
                {PLATFORM_CONFIG[p].label}
              </Button>
            ))}
          </div>
          
          <div className="flex items-center gap-4">
            <Select value={String(weeks)} onValueChange={v => setWeeks(Number(v))}>
              <SelectTrigger className="w-40 bg-background/50">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 semaine</SelectItem>
                <SelectItem value="2">2 semaines</SelectItem>
                <SelectItem value="4">4 semaines</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={generateCalendar} className="bg-emerald-600 hover:bg-emerald-700 text-white">
              <Shuffle className="h-4 w-4 mr-2" /> Générer le planning
            </Button>
          </div>
        </CardContent>
      </Card>

      {calendarPosts.length > 0 && (
        <>
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">{calendarPosts.length} posts planifiés</p>
            <Button onClick={handleSave} disabled={isSaving} variant="outline" className="border-gold/30 text-gold-light hover:bg-gold/10">
              {isSaving ? 'Sauvegarde...' : 'Sauvegarder en base'}
            </Button>
          </div>
          
          <div className="space-y-4">
            {Object.entries(grouped).map(([date, posts]) => (
              <Card key={date} className="bg-card/60 border-border/40">
                <CardHeader className="py-3">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="font-semibold text-foreground">
                      {format(new Date(date), 'EEEE d MMMM', { locale: fr })}
                    </span>
                    <Badge variant="outline" className="text-xs">{posts.length} post{posts.length > 1 ? 's' : ''}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  {posts.map((post, i) => (
                    <div key={i} className="flex items-center gap-3 p-2 rounded bg-background/50">
                      <Badge className={`${PLATFORM_CONFIG[post.platform].color} border-0 text-xs`}>
                        {PLATFORM_CONFIG[post.platform].label}
                      </Badge>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" /> {post.time}
                      </span>
                      <span className="text-sm text-foreground/80 truncate flex-1">{post.template.type}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default SocialCalendar;
