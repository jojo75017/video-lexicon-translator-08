import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Zap, TrendingUp, DollarSign } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TokenUsage {
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
}

interface TokenCounterProps {
  isGenerating: boolean;
  tokenUsage: TokenUsage | null;
  estimatedTokens?: number;
  model?: string;
  className?: string;
  compact?: boolean;
}

// Pricing per 1M tokens (OpenAI gpt-4o-mini)
const PRICING = {
  'gpt-4o-mini': { input: 0.15, output: 0.60 }, // $ per 1M tokens
  'gpt-4o': { input: 2.50, output: 10.00 },
  'gpt-4': { input: 30.00, output: 60.00 },
  'gemini-2.5-flash': { input: 0.075, output: 0.30 },
  default: { input: 0.15, output: 0.60 }
};

function calculateCost(usage: TokenUsage, model: string = 'gpt-4o-mini'): number {
  const pricing = PRICING[model as keyof typeof PRICING] || PRICING.default;
  const inputCost = (usage.promptTokens / 1_000_000) * pricing.input;
  const outputCost = (usage.completionTokens / 1_000_000) * pricing.output;
  return inputCost + outputCost;
}

function formatTokens(tokens: number): string {
  if (tokens >= 1000) {
    return `${(tokens / 1000).toFixed(1)}k`;
  }
  return tokens.toString();
}

export const TokenCounter: React.FC<TokenCounterProps> = ({
  isGenerating,
  tokenUsage,
  estimatedTokens = 0,
  model = 'gpt-4o-mini',
  className,
  compact = false
}) => {
  const [animatedTokens, setAnimatedTokens] = React.useState(0);

  // Animate token count during generation
  React.useEffect(() => {
    if (isGenerating && estimatedTokens > 0) {
      const interval = setInterval(() => {
        setAnimatedTokens(prev => {
          const increment = Math.ceil(estimatedTokens / 50);
          const next = prev + increment + Math.floor(Math.random() * 100);
          return Math.min(next, estimatedTokens);
        });
      }, 100);
      return () => clearInterval(interval);
    } else if (!isGenerating && tokenUsage) {
      setAnimatedTokens(tokenUsage.totalTokens);
    } else if (!isGenerating) {
      setAnimatedTokens(0);
    }
  }, [isGenerating, estimatedTokens, tokenUsage]);

  const displayTokens = tokenUsage?.totalTokens || animatedTokens;
  const cost = tokenUsage ? calculateCost(tokenUsage, model) : (displayTokens / 1_000_000) * 0.75;
  const progress = estimatedTokens > 0 ? Math.min((displayTokens / estimatedTokens) * 100, 100) : 0;

  if (compact) {
    return (
      <div className={cn("flex items-center gap-2", className)}>
        <Badge 
          variant="outline" 
          className={cn(
            "transition-all duration-300",
            isGenerating ? "bg-blue-50 text-blue-700 border-blue-300 animate-pulse" : 
            tokenUsage ? "bg-green-50 text-green-700 border-green-300" : 
            "bg-muted text-muted-foreground"
          )}
        >
          <Zap className="h-3 w-3 mr-1" />
          {formatTokens(displayTokens)} tokens
        </Badge>
        {cost > 0 && (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-300">
            <DollarSign className="h-3 w-3 mr-0.5" />
            {cost < 0.01 ? '<0.01' : cost.toFixed(3)}€
          </Badge>
        )}
      </div>
    );
  }

  return (
    <div className={cn(
      "rounded-lg border p-4 space-y-3 transition-all duration-300",
      isGenerating ? "bg-blue-50/50 border-blue-200" : 
      tokenUsage ? "bg-green-50/50 border-green-200" : 
      "bg-muted/30 border-border",
      className
    )}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Zap className={cn(
            "h-4 w-4",
            isGenerating ? "text-blue-500 animate-pulse" : "text-muted-foreground"
          )} />
          <span className="text-sm font-medium">Consommation Tokens</span>
        </div>
        <Badge variant="outline" className="text-xs">
          {model}
        </Badge>
      </div>

      {isGenerating && estimatedTokens > 0 && (
        <div className="space-y-1">
          <Progress value={progress} className="h-2" />
          <p className="text-xs text-muted-foreground text-right">
            ~{formatTokens(estimatedTokens)} tokens estimés
          </p>
        </div>
      )}

      <div className="grid grid-cols-3 gap-3 text-center">
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground">Entrée</p>
          <p className={cn(
            "text-lg font-bold tabular-nums transition-all",
            isGenerating && "text-blue-600"
          )}>
            {formatTokens(tokenUsage?.promptTokens || Math.floor(displayTokens * 0.3))}
          </p>
        </div>
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground">Sortie</p>
          <p className={cn(
            "text-lg font-bold tabular-nums transition-all",
            isGenerating && "text-blue-600"
          )}>
            {formatTokens(tokenUsage?.completionTokens || Math.floor(displayTokens * 0.7))}
          </p>
        </div>
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground">Total</p>
          <p className={cn(
            "text-lg font-bold tabular-nums transition-all",
            isGenerating ? "text-blue-600 animate-pulse" : tokenUsage && "text-green-600"
          )}>
            {formatTokens(displayTokens)}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between pt-2 border-t">
        <div className="flex items-center gap-1 text-sm">
          <DollarSign className="h-4 w-4 text-yellow-600" />
          <span className="text-muted-foreground">Coût estimé:</span>
        </div>
        <span className={cn(
          "font-bold",
          isGenerating ? "text-blue-600" : "text-green-600"
        )}>
          {cost < 0.001 ? '<0.001' : cost.toFixed(4)}€
        </span>
      </div>

      {tokenUsage && !isGenerating && (
        <div className="flex items-center gap-1 text-xs text-green-600">
          <TrendingUp className="h-3 w-3" />
          Génération terminée
        </div>
      )}
    </div>
  );
};

export default TokenCounter;
