import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Copy, Loader2, Sparkles, RefreshCw, Pencil, Check, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { PLATFORMS, GeneratedPost } from './socialPostTypes';

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
  const platform = PLATFORMS.find(p => p.id === post.platform)!;
  const Icon = platform.icon;
  const charCount = post.content.length;
  const charRatio = charCount / platform.maxChars;
  const isOverLimit = charRatio > 1;
  const isNearLimit = charRatio > 0.9 && !isOverLimit;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
    >
      <Card className={cn(
        "bg-card/50 border-border/50 hover:border-indigo-500/30 transition-all",
        isOverLimit && "border-destructive/40"
      )}>
        <CardContent className="p-5">
          {/* Header */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className={cn("p-1.5 rounded-md bg-gradient-to-r text-white", platform.color)}>
                <Icon className="h-4 w-4" />
              </div>
              <span className="font-medium text-sm">{platform.label}</span>
              <Badge 
                variant="outline" 
                className={cn(
                  "text-xs gap-1",
                  isOverLimit ? "border-destructive text-destructive" : 
                  isNearLimit ? "border-amber-500 text-amber-500" : 
                  "text-muted-foreground"
                )}
              >
                {isOverLimit ? <AlertTriangle className="h-3 w-3" /> : isNearLimit ? null : <CheckCircle2 className="h-3 w-3" />}
                {charCount}/{platform.maxChars}
              </Badge>
            </div>
            <div className="flex items-center gap-1">
              <Button size="sm" variant="ghost" onClick={() => setIsEditing(!isEditing)} className="h-8 px-2">
                {isEditing ? <Check className="h-4 w-4" /> : <Pencil className="h-4 w-4" />}
              </Button>
              <Button size="sm" variant="ghost" onClick={onRegenerate} disabled={isRegenerating} className="h-8 px-2">
                {isRegenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
              </Button>
              <Button size="sm" variant="ghost" onClick={onCopy} className="h-8 px-2">
                <Copy className="h-4 w-4 mr-1" /> Copier
              </Button>
            </div>
          </div>

          {/* Content */}
          {isEditing ? (
            <Textarea
              value={post.content}
              onChange={e => onUpdate('content', e.target.value)}
              className="min-h-[120px] text-sm leading-relaxed"
              autoFocus
            />
          ) : (
            <div className="p-4 rounded-lg bg-background/50 border border-border/30 whitespace-pre-wrap text-sm leading-relaxed">
              {post.content}
            </div>
          )}

          {/* Hashtags */}
          {post.hashtags.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {post.hashtags.map((tag, i) => (
                <Badge key={i} variant="secondary" className="text-xs">#{tag}</Badge>
              ))}
            </div>
          )}

          {/* Visual tip */}
          {post.visualTip && (
            <div className="mt-3 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
              <p className="text-xs text-amber-300 flex items-start gap-2">
                <Sparkles className="h-3 w-3 mt-0.5 shrink-0" />
                <span><strong>Visuel suggéré :</strong> {post.visualTip}</span>
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default PostCard;
