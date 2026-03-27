import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { 
  Copy, Loader2, RefreshCw, Pencil, Check, AlertTriangle, CheckCircle2, 
  CalendarIcon, Eye, EyeOff, Sparkles 
} from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { PLATFORMS, PHASES, GeneratedPost } from './socialPostTypes';

interface PostCardProps {
  post: GeneratedPost;
  index: number;
  isRegenerating: boolean;
  onCopy: () => void;
  onRegenerate: () => void;
  onUpdate: (field: keyof GeneratedPost, value: any) => void;
}

const PostCard: React.FC<PostCardProps> = ({ post, index, isRegenerating, onCopy, onRegenerate, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showVisualTip, setShowVisualTip] = useState(true);
  const [scheduledDate, setScheduledDate] = useState<Date | undefined>();
  
  const platform = PLATFORMS.find(p => p.id === post.platform)!;
  const phase = PHASES.find(p => p.id === post.phase);
  const Icon = platform.icon;
  const charCount = post.content.length;
  const charRatio = charCount / platform.maxChars;
  const isOverLimit = charRatio > 1;
  const isNearLimit = charRatio > 0.9 && !isOverLimit;
  const progressPercent = Math.min(charRatio * 100, 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
    >
      <Card className={cn(
        "bg-card/50 border-border/50 hover:border-primary/30 transition-all group",
        isOverLimit && "border-destructive/40 hover:border-destructive/60"
      )}>
        <CardContent className="p-5">
          {/* Header */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 flex-wrap">
              <div className={cn("p-1.5 rounded-md bg-gradient-to-r text-white", platform.color)}>
                <Icon className="h-4 w-4" />
              </div>
              <span className="font-medium text-sm">{platform.label}</span>
              {phase && (
                <Badge variant="outline" className="text-xs bg-primary/5">
                  {phase.emoji} {phase.label}
                </Badge>
              )}
              {scheduledDate && (
                <Badge variant="outline" className="text-xs bg-accent/30 gap-1">
                  <CalendarIcon className="h-3 w-3" />
                  {format(scheduledDate, 'dd MMM', { locale: fr })}
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-1">
              <Popover>
                <PopoverTrigger asChild>
                  <Button size="sm" variant="ghost" className="h-8 px-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <CalendarIcon className="h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="end">
                  <Calendar
                    mode="single"
                    selected={scheduledDate}
                    onSelect={setScheduledDate}
                    className="p-3 pointer-events-auto"
                    locale={fr}
                  />
                </PopoverContent>
              </Popover>
              <Button size="sm" variant="ghost" onClick={() => setIsEditing(!isEditing)} className="h-8 px-2">
                {isEditing ? <Check className="h-4 w-4 text-green-500" /> : <Pencil className="h-4 w-4" />}
              </Button>
              <Button size="sm" variant="ghost" onClick={onRegenerate} disabled={isRegenerating} className="h-8 px-2">
                {isRegenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
              </Button>
              <Button size="sm" variant="ghost" onClick={onCopy} className="h-8 px-2 gap-1">
                <Copy className="h-4 w-4" /> <span className="hidden sm:inline text-xs">Copier</span>
              </Button>
            </div>
          </div>

          {/* Character progress bar */}
          <div className="mb-3">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-1.5">
                {isOverLimit ? (
                  <AlertTriangle className="h-3 w-3 text-destructive" />
                ) : (
                  <CheckCircle2 className="h-3 w-3 text-green-500" />
                )}
                <span className={cn(
                  "text-xs font-medium",
                  isOverLimit ? "text-destructive" : isNearLimit ? "text-amber-500" : "text-muted-foreground"
                )}>
                  {charCount} / {platform.maxChars} caractères
                </span>
              </div>
              {isOverLimit && (
                <span className="text-xs text-destructive font-medium">
                  -{charCount - platform.maxChars} à supprimer
                </span>
              )}
            </div>
            <div className="h-1.5 rounded-full bg-muted overflow-hidden">
              <motion.div 
                className={cn(
                  "h-full rounded-full transition-colors",
                  isOverLimit ? "bg-destructive" : isNearLimit ? "bg-amber-500" : "bg-green-500"
                )}
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
            </div>
          </div>

          {/* Content */}
          {isEditing ? (
            <Textarea
              value={post.content}
              onChange={e => onUpdate('content', e.target.value)}
              className="min-h-[120px] text-sm leading-relaxed border-primary/30 focus:border-primary"
              autoFocus
            />
          ) : (
            <div className="p-4 rounded-lg bg-background/50 border border-border/30 whitespace-pre-wrap text-sm leading-relaxed hover:bg-background/80 transition-colors cursor-pointer" onClick={() => setIsEditing(true)}>
              {post.content || <span className="text-muted-foreground italic">Cliquez pour éditer...</span>}
            </div>
          )}

          {/* Hashtags */}
          {post.hashtags.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {post.hashtags.map((tag, i) => (
                <Badge key={i} variant="secondary" className="text-xs hover:bg-primary/20 cursor-pointer transition-colors">
                  #{tag}
                </Badge>
              ))}
            </div>
          )}

          {/* Visual tip */}
          {post.visualTip && (
            <div className="mt-3">
              <button 
                onClick={() => setShowVisualTip(!showVisualTip)}
                className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors mb-1"
              >
                <Sparkles className="h-3 w-3" />
                <span>Suggestion visuelle</span>
                {showVisualTip ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
              </button>
              {showVisualTip && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20"
                >
                  <p className="text-xs text-amber-400">
                    🎨 {post.visualTip}
                  </p>
                </motion.div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default PostCard;
